// ===== bot.js : word bank, rhyme lookup, offline chat engine, progress =====
const WORDBANK = `love above glove dove shove thrust trust dust must just rust crust bust gust
flow know show glow grow slow low go so though throw blow below snow row toe tempo hero zero ago
night light right fight sight bright flight tight might white write height delight tonight spotlight highlight
time rhyme climb prime chime crime lime dime mime sublime paradigm
mind find kind blind grind behind remind signed designed aligned combined define refine
mine line shine sign design divine fine wine vine pine nine dine decline incline
fire desire higher wire tire choir inspire entire liar buyer flyer
sky high fly try cry why die lie buy eye goodbye reply deny supply
day way say play stay pray today away delay display okay gray bay clay ray tray
rain pain gain chain brain train main plain lane vain explain remain contain complain
hand stand land band grand brand planned command demand understand
heart start part art smart chart apart depart cart dart
dream seem team stream beam theme extreme scheme gleam cream
street beat heat feet meet seat sweet repeat complete defeat discreet treat neat
feel real deal steal heal wheel kneel reveal appeal conceal ideal
free be see me key tree three agree degree guarantee galaxy
soul whole goal role control console stroll toll roll scroll patrol
stone bone zone phone alone tone throne known grown shown own prone cologne
home roam foam dome chrome poem
gold cold hold told bold sold fold old mold behold unfold
down town crown brown clown frown drown gown renown
sound ground found round bound crowd loud proud cloud allowed aloud
sing ring bring thing king spring wing swing string cling
song long strong wrong belong along throng
more door floor shore store core score floor explore ignore before restore adore
stars bars cars scars guitars mars
mission vision decision precision ambition tradition position condition addition
beautiful dutiful
city pretty witty gritty committee
money honey sunny funny bunny runny
rhythm with myth
flame game name fame same shame frame claim aim blame tame
rise eyes prize wise size skies lies cries tries surprise advise disguise
girl world pearl swirl twirl
face place space race grace base trace chase embrace
jump pump bump lump thump
dance chance glance stance trance romance advance
wave brave save gave cave crave slave behave
fast last past blast cast vast mast passed
beat heat seat wheat
bright night tight sight kite quite
cool school rule fool tool pool jewel
chill thrill still will hill skill fill drill until
pen ten when then again men
shoe blue true new too few crew view through knew grew flew who do
smile mile style while file pile trial
ride side wide pride guide tide slide hide inside
fall call all wall tall small ball hall crawl
bounce pounce ounce
sunshine moonshine
highway byway skyway
river shiver deliver quiver
thunder wonder under number
mountain fountain
window shadow meadow widow
rocket pocket socket locket
champion companion
memory energy gravity
victory history mystery`.split(/\s+/).filter(Boolean);
const WORD_SET = Array.from(new Set(WORDBANK));
function rhymesFor(word, max) {
  const w = String(word).toLowerCase().replace(/[^a-z]/g, ''); if (!w) return null;
  const res = { perfect: [], slant: [], near: [] };
  WORD_SET.forEach(c => { if (c === w) return; const r = rhymeRelation(w, c); if (r.type === 'perfect') res.perfect.push([c, r.score]); else if (r.type === 'slant') res.slant.push([c, r.score]); else if (r.type === 'near') res.near.push([c, r.score]); });
  ['perfect', 'slant', 'near'].forEach(k => { res[k].sort((a, b) => b[1] - a[1]); res[k] = res[k].map(x => x[0]).slice(0, max || 14); });
  return res;
}

const FREE_IMAGES = ['a rooftop at sunrise', 'a bus ride home', 'rain on the window', 'a crowded kitchen', 'a basketball court at night', 'a school hallway', 'a train platform', 'a corner store', 'a bright stage', 'an old photograph', 'a city skyline', 'a quiet library', 'a thunderstorm', 'a long road trip', 'a first day somewhere new'];
const FREE_THEMES = ['working hard', 'a dream you will not drop', 'family', 'friends who stay', 'a goal for next year', 'being nervous but doing it anyway', 'where you are from', 'a promise to yourself', 'learning from a mistake', 'celebrating a small win'];
const FREE_WORDS = ['anchor', 'engine', 'ladder', 'mirror', 'orbit', 'lantern', 'compass', 'bridge', 'thunder', 'rhythm', 'velvet', 'marathon', 'horizon', 'spark', 'harbor', 'canvas', 'rocket', 'echo', 'blueprint', 'river'];

// ---------- progress ----------
const dayKey = d => { d = d || new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
const BADGES = [
  { id: 'first', name: 'First Lesson', test: p => Object.keys(p.done).length >= 1 },
  { id: 'half', name: 'Halfway There (6 lessons)', test: p => Object.keys(p.done).length >= 6 },
  { id: 'all', name: 'Full Course (12 lessons)', test: p => Object.keys(p.done).length >= 12 },
  { id: 'ace', name: 'Quiz Ace (5 of 5)', test: p => p.quizzes.some(q => q.total >= 5 && q.score === q.total) },
  { id: 'streak3', name: '3-Day Streak', test: p => p.best >= 3 },
  { id: 'streak7', name: '7-Day Streak', test: p => p.best >= 7 },
  { id: 'xp200', name: '200 XP', test: p => p.xp >= 200 }
];
function loadProgress(store, bot) {
  let p = null; try { p = store && store.get('flowschool:' + bot); } catch (e) { p = null; }
  p = p && typeof p === 'object' ? p : {};
  return Object.assign({ done: {}, quizzes: [], xp: 0, streak: 0, best: 0, last: null, badges: [], log: [], pos: 1 }, p);
}
function saveProgress(store, bot, p) { try { store && store.set('flowschool:' + bot, p); } catch (e) { } }
function touchStreak(p, today) {
  if (p.last === today) return;
  const y = new Date(today + 'T12:00:00'); y.setDate(y.getDate() - 1);
  p.streak = p.last === dayKey(y) ? p.streak + 1 : 1; p.last = today; p.best = Math.max(p.best || 0, p.streak);
}
function award(p, xp, why, today) {
  touchStreak(p, today); p.xp += xp; p.log.push({ d: today, xp, why }); if (p.log.length > 60) p.log.shift();
  const gained = []; BADGES.forEach(b => { if (!p.badges.includes(b.id) && b.test(p)) { p.badges.push(b.id); gained.push(b.name); } });
  return gained;
}
function levelOf(p, bot) { const L = LESSONS[bot]; let lvl = 1; for (let l = 1; l <= 4; l++) { const ls = L.filter(x => x.level === l); if (ls.every(x => p.done[x.id] != null)) lvl = Math.min(4, l + 1); else break; } return lvl; }

// ---------- chat ----------
const STOP = new Set('a an the and or but of to in on at by with from for is am are was were be i me my you your it its this that these those do does did can could will would should please tell about what how why when where which who some any more thing things want need like know lets let us get got give show'.split(' '));
const stem = w => w.replace(/'/g, '').replace(/(ing|ed|es|s|ly)$/, m => w.length > 4 ? '' : m);
const toks = s => (String(s).toLowerCase().match(/[a-z0-9\-]+/g) || []).map(w => w.replace(/^-+|-+$/g, '')).filter(Boolean);
function kbIndex(bot) {
  const entries = KB.shared.concat(KB[bot]), df = {};
  entries.forEach(e => { e._t = Array.from(new Set(toks(e.k).map(stem))); e._t.forEach(t => df[t] = (df[t] || 0) + 1); });
  return { entries, df };
}
function matchKB(idx, text) {
  const q = Array.from(new Set(toks(text).filter(w => !STOP.has(w)).map(stem))); if (!q.length) return [];
  const sc = idx.entries.map(e => { let s = 0; q.forEach(t => { if (e._t.includes(t)) s += 1 / Math.sqrt(idx.df[t] || 1) + 0.4; else if (t.length > 4 && e._t.some(x => x.length > 4 && (x.startsWith(t) || t.startsWith(x)))) s += 0.5; }); return { e, s }; });
  return sc.filter(x => x.s > 0).sort((a, b) => b.s - a.s);
}
const letter = i => String.fromCharCode(65 + i);
function fmtQ(item, i, n) { return 'Q' + i + '/' + n + ': ' + item.q + '\n' + item.o.map((o, k) => '  ' + letter(k) + ') ' + o).join('\n') + '\nAnswer with a letter (A-D). "skip" or "stop" also work.'; }
function fmtList(a) { return a.length ? a.join(', ') : '(none found in my word bank)'; }

function createBot(botId, store, opt) {
  opt = opt || {}; const B = BOTS[botId], idx = kbIndex(botId), lessons = LESSONS[botId], today = opt.today || (() => dayKey());
  let P = loadProgress(store, botId), S = { mode: null }, lastTopic = null;
  const save = () => saveProgress(store, botId, P);
  const R = (text, extra) => Object.assign({ text, chips: B.chips.slice(0, 6) }, extra || {});
  const gainText = g => g.length ? '\n\nBadge unlocked: ' + g.join(', ') + '!' : '';

  function showLesson(n) {
    n = clamp(n, 1, lessons.length); const l = lessons[n - 1]; P.pos = n; save();
    const done = P.done[l.id] != null;
    let g = []; if (!P.seen) P.seen = {}; if (!P.seen[l.id]) { P.seen[l.id] = 1; g = award(P, 10, 'read ' + l.id, today()); save(); }
    return R('LESSON ' + n + ' of ' + lessons.length + ' · Level ' + l.level + ' (' + B.levels[l.level - 1] + ')' + (done ? ' · done' : '') + '\n' + l.title + '\nGoal: ' + l.goal + '\n\n' + l.body.join('\n\n') + '\n\nDRILL\n' + l.drill.map((d, i) => (i + 1) + '. ' + d).join('\n') + '\n\nSay "check" for the 2-question checkpoint, or "next" for the next lesson.' + gainText(g), { chips: ['check', 'next', 'back', 'lessons', 'quiz me'] });
  }
  function startQuiz(pool, label, lessonId) {
    const items = shuffle(pool).slice(0, lessonId ? pool.length : 5).map(q => { const order = shuffle(q.o.map((_, k) => k)); return { q: q.q, o: order.map(k => q.o[k]), a: order.indexOf(q.a), why: q.why }; }); S = { mode: 'quiz', items, i: 0, score: 0, label, lessonId };
    return R(label + '\n\n' + fmtQ(items[0], 1, items.length), { chips: ['A', 'B', 'C', 'D', 'skip', 'stop'] });
  }
  function quizPool() { const out = []; lessons.forEach(l => { if (P.done[l.id] != null || P.pos >= l.n) l.quiz.forEach(q => out.push(q)); }); QBANK[botId].forEach(q => out.push(q)); return out; }
  function answerQuiz(t) {
    const s = S, it = s.items[s.i]; let ans = null; const m = /^\(?([a-d])\)?[\).]?$/i.exec(t.trim()) || /^(?:answer|ans|it'?s|its)\s+([a-d])\b/i.exec(t.trim());
    if (/^(stop|quit|exit|end|cancel)\b/i.test(t)) { S = { mode: null }; return R('Quiz stopped. Score so far: ' + s.score + '/' + s.i + '.'); }
    if (/^skip\b/.test(t.toLowerCase())) { s.i++; return nextQ('Skipped. The answer was ' + letter(it.a) + ') ' + it.o[it.a] + '. ' + it.why); }
    if (!m) return R('Please answer with A, B, C or D (or "skip" / "stop").\n\n' + fmtQ(it, s.i + 1, s.items.length), { chips: ['A', 'B', 'C', 'D', 'skip', 'stop'] });
    ans = m[1].toUpperCase().charCodeAt(0) - 65; if (ans >= it.o.length) return R('Choose A-' + letter(it.o.length - 1) + '.');
    const ok = ans === it.a; if (ok) s.score++; s.i++;
    return nextQ((ok ? 'Correct! ' : 'Not quite. The answer is ' + letter(it.a) + ') ' + it.o[it.a] + '. ') + it.why);
  }
  function nextQ(prefix) {
    const s = S;
    if (s.i >= s.items.length) {
      const sc = s.score, tot = s.items.length; let msg = prefix + '\n\nFinished: ' + sc + '/' + tot + '.', g = [];
      P.quizzes.push({ d: today(), score: sc, total: tot, label: s.label }); if (P.quizzes.length > 40) P.quizzes.shift();
      let xp = sc * 5;
      if (s.lessonId) { const pass = sc >= Math.ceil(tot / 2); if (pass) { const first = P.done[s.lessonId] == null; P.done[s.lessonId] = Math.max(P.done[s.lessonId] || 0, sc); if (first) xp += 20; msg += ' Lesson complete' + (sc === tot ? ' (mastered)!' : '.'); } else msg += ' Review the lesson and try "check" again.'; }
      g = award(P, xp, 'quiz ' + sc + '/' + tot, today()); save(); S = { mode: null };
      return R(msg + ' +' + xp + ' XP.' + gainText(g) + (s.lessonId ? '\nSay "next" for the next lesson.' : ''), { chips: ['next', 'quiz me', 'progress', 'practice plan 20'] });
    }
    return R(prefix + '\n\n' + fmtQ(s.items[s.i], s.i + 1, s.items.length), { chips: ['A', 'B', 'C', 'D', 'skip', 'stop'] });
  }

  function flowReport(text) {
    const lines = text.split(/\n+/).map(x => x.trim()).filter(Boolean).slice(0, 16);
    if (!lines.length) return R('Paste your bars, one line per bar.');
    const v = analyzeVerse(lines.join('\n')); let out = [];
    v.bars.forEach((b, i) => { out.push('Bar ' + (i + 1) + ' [' + v.scheme[i] + '] ' + b.n + ' syl, ' + b.density + (b.stressed ? ', ' + b.onBeat + '/' + b.stressed + ' stressed on a beat' : '') + '\n  ' + gridString(b) + '\n  ' + b.text); });
    const extra = [];
    v.ints.forEach((x, i) => { if (x.length) extra.push('Bar ' + (i + 1) + ' internal: ' + x.slice(0, 3).map(p => p[0] + '/' + p[1]).join(', ')); });
    v.alli.forEach((x, i) => { if (x.pairs >= 2) extra.push('Bar ' + (i + 1) + ' alliteration run of ' + x.run); });
    const g = award(P, 5, 'analyzed a verse', today()); save();
    return R(out.join('\n\n'), { pre: true, extra: 'Grid key: X = stressed syllable, x = unstressed, . = empty slot. Four groups = four beats; each group is 4 sixteenth notes.\n\n' + v.tips.join('\n') + (extra.length ? '\n\n' + extra.join('\n') : '') + '\n\nThis is a spelling-based estimate; say the line over a beat to confirm.' + gainText(g), chips: ['analyze', 'rhyme time', 'lesson 2', 'practice plan 20'] });
  }

  function lyricReport(text) { // singer: paste lyric lines
    const lines = text.split(/\n+/).map(x => x.trim()).filter(Boolean).slice(0, 16), out = [];
    lines.forEach((l, i) => { const w = tokensOf(l), sy = w.reduce((a, x) => a + syllables(x), 0), lw = w[w.length - 1] || '', c = coachWord(lw), last = c[c.length - 1]; out.push('Line ' + (i + 1) + ': ' + sy + ' syllables. Ends on "' + lw + '"' + (last ? (last.holdable ? ' (a good word to hold, ends on a vowel or a nasal/liquid)' : ' (ends on a hard consonant; keep it short)') : '')); });
    return R(out.join('\n') + '\n\nBreathe at line ends or commas; find the key word in each line and grow into it.', { pre: true });
  }

  function route(raw) {
    const t = raw.trim(), low = t.toLowerCase(); let m;
    if (!t) return R('Say something or type "help".');
    if (S.mode === 'quiz') return answerQuiz(t);
    if (S.mode === 'verse') { S = { mode: null }; return botId === 'rapper' ? flowReport(raw) : lyricReport(raw); }
    if (S.mode === 'rhymetime') {
      if (/^(done|stop|quit|exit|end|finish)\b/.test(low)) { const sc = S.found.length; const g = award(P, Math.min(sc, 10), 'rhyme time ' + sc, today()); save(); const w = S.word; S = { mode: null }; return R('Rhyme time over: ' + sc + ' rhymes for "' + w + '". +' + Math.min(sc, 10) + ' XP.' + gainText(g)); }
      const ws = toks(t).filter(x => x.length > 1), good = [], bad = [];
      ws.forEach(w => { if (w === S.word || S.found.includes(w)) return; const r = rhymeRelation(S.word, w); if (r.type === 'perfect' || r.type === 'slant') { S.found.push(w); good.push(w + ' (' + r.type + ')'); } else bad.push(w); });
      return R((good.length ? 'Nice: ' + good.join(', ') + '. ' : '') + (bad.length ? 'Not a rhyme I can hear in the spelling: ' + bad.join(', ') + '. ' : '') + 'Total ' + S.found.length + '. Keep going or type "done".', { chips: ['done'] });
    }
    if (S.mode === 'interval') { const q = S.q; S = { mode: null }; const n = parseInt(t, 10), nm = low; const ok = n === q.answer || nm.includes(q.name) || nm.replace(/\s/g, '') === q.note.toLowerCase(); return R((ok ? 'Correct! ' : 'Not quite. ') + q.name + ' = ' + q.answer + ' semitones, so ' + midiName(q.low) + ' up to ' + q.note + '.' + (INTERVAL_SONG_HINTS[q.answer] ? '\nSong hint: ' + INTERVAL_SONG_HINTS[q.answer] + '.' : ''), { chips: ['interval', 'quiz me'] }); }

    // safety first
    if (/\b(kill myself|suicid|want to die|hurt myself|self[- ]?harm|end my life|abuse[ds]?|being abused)\b/.test(low)) return R("I'm really sorry you're dealing with something that heavy. You matter, and you deserve support from a real person right now. Please tell a trusted adult (a parent, teacher, coach or counsellor) today. If you are in the US you can call or text 988 any time; if you are elsewhere, contact your local emergency number or crisis line. If you are in immediate danger, call your local emergency number. I'm just a practice tool and can't give you the help a person can.", { chips: ['safety'] });
    if (/(cough(ing)? (up )?blood|can'?t breathe|cannot breathe|trouble breathing|can'?t swallow|trouble swallowing|choking)/.test(low)) return R('That needs a doctor now, not practice. If it is severe or sudden, call your local emergency number. Otherwise tell a trusted adult and see a doctor soon. Stop singing and rapping until you have been checked.', { chips: ['safety'] });
    // boundaries
    if (/\b(clone|deepfake|impersonat\w*|sound (exactly )?like|voice of|in the voice of|be (biggie|mahalia|tupac|beyonce))\b/.test(low) && /\b(voice|sound|record|generate|make|do)\b/.test(low)) return R("I can't clone or imitate a real person's voice, and I can't speak as them. A voice belongs to its owner, and some artists can't consent. I can teach you the craft ideas you admire (rhythm, rhyme, phrasing) so you build your own sound.", { chips: ['lesson 1', 'help'] });
    if (/\b(full|whole|exact|entire)?\s*lyrics?\b.*\b(of|to|for|from)\b/.test(low) && /\b(write|give|print|quote|show|paste|tell|recite|sing)\b/.test(low) || /\b(recite|quote|reproduce)\b.*\b(lyrics?|verse|song)\b/.test(low)) return R("I don't reproduce or quote copyrighted lyrics. I can explain the technique, analyze your own bars, or give you prompts and rhyme lists so you write your own.", { chips: botId === 'rapper' ? ['freestyle prompt', 'rhyme time'] : ['lesson 7', 'warm up'] });
    if (/\b(write|give|make|do)\b.*\b(sex|sexual|explicit|drugs?|gun|guns|kill|violent|violence|nude|porn)\w*/.test(low) || /\b(diss|insult)\b.*\b(race|religion|gay|disab)/.test(low)) return R('I keep things clean and kind for young artists, so I will pass on that. I can help you write something vivid and honest without explicit or hurtful content.', { chips: ['lesson 7', 'freestyle prompt'] });

    // commands
    if (/^(help|\?|commands|menu|what can you do)\b/.test(low)) return R('Here is what I can do:\n' + HELP[botId].map(x => '• ' + x).join('\n'), { chips: B.chips });
    if (/^(about|credits|disclaimer)\b/.test(low)) return R(B.about);
    if (/^(safety|voice health|vocal health|health)\b/.test(low)) return R('VOICE AND BODY SAFETY\n' + VOICE_SAFETY.map(x => '• ' + x).join('\n') + '\n\nThis is general guidance, not medical advice. Your doctor and voice teacher know you best.', { chips: ['warm up', 'breath timer', 'about'] });
    if (/^(lessons|curriculum|course|syllabus)\b/.test(low)) return R(lessons.map(l => (P.done[l.id] != null ? '[x] ' : '[ ] ') + l.n + '. ' + l.title + ' (L' + l.level + ')').join('\n') + '\n\nSay "lesson 3" to open one.', { pre: true, chips: ['lesson ' + (P.pos || 1), 'next'] });
    if ((m = /^(?:lesson|l)\s*(\d{1,2})\b/.exec(low))) { const n = parseInt(m[1], 10); if (n < 1 || n > lessons.length) return R('Lessons run from 1 to ' + lessons.length + '. Say "lessons" for the list.'); return showLesson(n); }
    if (/^(start|begin|start course|first lesson)\b/.test(low)) return showLesson(1);
    if (/^(next|continue|go on|next lesson)\b/.test(low) && !/\bnext (level)\b/.test(low)) return showLesson(Math.min(lessons.length, (P.pos || 0) + 1));
    if (/^(back|previous|prev|last lesson)\b/.test(low)) return showLesson(Math.max(1, (P.pos || 2) - 1));
    if (/^(check|checkpoint|test me|lesson quiz)\b/.test(low)) { const l = lessons[(P.pos || 1) - 1]; return startQuiz(l.quiz, 'CHECKPOINT: ' + l.title, l.id); }
    if (/^(quiz|test|quiz me|question)\b/.test(low)) return startQuiz(quizPool(), 'QUIZ (5 questions)');
    if (/^(progress|stats|score|streak|xp|badges)\b/.test(low)) {
      const done = Object.keys(P.done).length, lvl = levelOf(P, botId), qs = P.quizzes.slice(-3).map(q => q.score + '/' + q.total).join(', ');
      return R('PROGRESS\nLessons done: ' + done + '/' + lessons.length + ' · Level ' + lvl + ' (' + B.levels[lvl - 1] + ')\nXP: ' + P.xp + ' · Streak: ' + P.streak + ' day(s) (best ' + P.best + ')\nLast quizzes: ' + (qs || 'none yet') + '\nBadges: ' + (P.badges.length ? P.badges.map(id => BADGES.find(b => b.id === id).name).join('; ') : 'none yet') + '\n\nNext step: ' + (done < lessons.length ? 'lesson ' + (lessons.find(l => P.done[l.id] == null).n) : 'review with "quiz me"'), { pre: true });
    }
    if (/^reset( my)? progress\b/.test(low)) { S = { mode: 'confirmreset' }; return R('This erases your lessons, XP and streak for ' + B.name + '. Type "yes reset" to confirm.', { chips: ['yes reset', 'cancel'] }); }
    if (/^yes reset\b/.test(low)) { P = loadProgress(null, botId); save(); return R('Progress reset.'); }
    if ((m = /^(?:practice|practise)\s*plan\s*(\d+)?\s*(?:min\w*)?\s*(.*)$/.exec(low)) || /^plan\b/.test(low)) { const mm = m || /^plan\s*(\d+)?\s*(.*)$/.exec(low); const minutes = parseInt(mm[1], 10) || 20, p = practicePlan(botId, minutes, levelOf(P, botId), (mm[2] || '').trim() || null); return R('PRACTICE PLAN · ' + p.minutes + ' minutes\n' + p.items.map((x, i) => (i + 1) + '. ' + x.min + ' min: ' + x.text).join('\n') + '\n\n' + p.rules.join('\n'), { pre: true, chips: ['warm up', 'quiz me', 'progress'] }); }
    if (botId === 'singer' && (m = /^warm[ -]?up\s*(\d+)?/.exec(low))) { const w = buildWarmup(parseInt(m[1], 10) || 8, levelOf(P, botId)); return R('WARM-UP · about ' + w.minutes + ' minutes (stay easy; stop if anything hurts)\n\n' + w.items.map((x, i) => (i + 1) + '. ' + x.name + ' (' + x.min + ' min)\n   ' + x.steps.join('\n   ')).join('\n\n'), { pre: true, chips: ['breath timer', 'run', 'safety'] }); }
    if (botId === 'rapper' && /^warm[ -]?up\b/.test(low)) return R('RAP WARM-UP (3 minutes)\n1. Easy breath: in 4, out on "sss" for 6, three times.\n2. Lip trill or hum for 30 seconds, quietly.\n3. Slow tongue twisters (three times each at half speed): "red leather, yellow leather"; "unique New York".\n4. Count 4 bars over a beat at 85 bpm, saying one word per beat.\nStop if your voice hurts or goes hoarse.', { pre: true, chips: ['breath timer', 'freestyle prompt', 'safety'] });
    if (/^breath/.test(low)) return R('BREATH PATTERNS (use the timer tool in the app, or count along)\n' + Object.values(BREATH).map(b => '• ' + b.name + ': ' + b.phases.map(p => p[0] + ' ' + p[1] + 's').join(' → ') + ' (x' + b.rounds + ')').join('\n') + '\nStay relaxed; do not strain or hold your breath hard.', { pre: true });
    if (botId === 'singer' && (m = /^(?:run|riff)\b\s*(.*)$/.exec(low))) { const a = m[1], sc = /blues/.test(a) ? 'blues' : /minor/.test(a) ? 'minor pentatonic' : 'major pentatonic', lv = /hard|3/.test(a) ? 3 : /med|2/.test(a) ? 2 : 1, r = genRun({ tonic: 60, scale: sc, level: lv }); return R('RUN (' + sc + ', ' + r.dir + ', level ' + lv + ') in C\n' + r.names.join(' – ') + '\n\n' + r.tips.join('\n') + '\n\nIn the app you can hear it played back.', { pre: true, chips: ['run blues', 'run hard', 'lesson 8'] }); }
    if (botId === 'singer' && (m = /^(?:consonants?|diction)\s+(.+)$/.exec(low))) { const words = toks(m[1]).slice(0, 4); return R(words.map(w => { const c = coachWord(w); return w.toUpperCase() + '\n' + c.map(s => '  syllable ' + s.idx + ' (' + s.vowel + (s.stress ? ', stressed' : '') + '): start ' + (s.onset.map(x => x.t + ' [' + x.c.join(', ') + ']').join(' ') || 'vowel') + ' · end ' + (s.coda.map(x => x.t + ' [' + x.c.join(', ') + ']').join(' ') || 'vowel') + (s.holdable ? ' · holdable' : '') + (s.tips.length ? '\n    ' + s.tips.join('\n    ') : '')).join('\n'); }).join('\n\n'), { pre: true }); }
    if (botId === 'singer' && (m = /^note\s+([a-g][#b]?-?\d)\b/.exec(low))) { const mi = noteToMidi(m[1]); return R(midiName(mi) + ' = ' + midiToHz(mi).toFixed(2) + ' Hz (MIDI ' + mi + ')'); }
    if (botId === 'singer' && /^interval/.test(low)) { const q = intervalQuestion(12); S = { mode: 'interval', q }; return R(q.text + '\nAnswer with the number of semitones, the interval name, or the note.', { chips: ['5', '7', '12'] }); }
    if (botId === 'rapper' && (m = /^(?:rhymes?(?: for| with)?|what rhymes with|words that rhyme with)\s+([a-z']+)\s*$/.exec(low)) && m[1] !== 'time') {
      const w = m[1].replace(/'/g, ''), r = rhymesFor(w, 12), sy = syllabify(w);
      return R('"' + w + '" · ' + sy.length + ' syllable(s) · I read it as [' + g2p(w).join(' ') + ']\nPerfect: ' + fmtList(r.perfect) + '\nSlant: ' + fmtList(r.slant) + '\nNear: ' + fmtList(r.near) + '\n\nMy word bank is small (a few hundred clean words); use your own ear to find more. Try a multisyllabic version: match the vowels of a two-word phrase.', { pre: true, chips: ['rhyme time', 'analyze'] });
    }
    if (botId === 'rapper' && /^rhyme time\b|^rhyme (challenge|game)\b/.test(low)) { const w = pick(['night', 'flow', 'mind', 'sky', 'time', 'gold', 'fire', 'dream', 'street', 'rain', 'stone', 'heart']); S = { mode: 'rhymetime', word: w, found: [] }; return R('RHYME TIME: type as many words as you can that rhyme with "' + w + '" (perfect or slant). Type "done" when finished.', { chips: ['done'] }); }
    if (botId === 'rapper' && (m = /^(?:syllables?|stress|count)\s+(.+)$/.exec(low))) { const ws = tokensOf(m[1]), parts = ws.map(w => { const s = syllabify(w), fw = FUNCTION_WORDS.has(w.toLowerCase()) && s.length === 1; return w + ': ' + s.length + ' (' + s.map(x => x.stress && !fw ? 'STRESS' : 'unstressed').join(' · ') + ')'; }); return R(parts.join('\n') + '\nTotal syllables: ' + ws.reduce((a, w) => a + syllables(w), 0), { pre: true }); }
    if (botId === 'rapper' && (m = /^(?:bar timer|bars?|timer|bpm)\s*(\d{2,3})?/.exec(low)) && /^(bar timer|bpm|timer|bars)\b/.test(low)) { const b = clamp(parseInt(m[1], 10) || 90, 50, 200); return R('AT ' + b + ' BPM\n1 bar = ' + barSeconds(b).toFixed(2) + ' s · 4 bars = ' + verseSeconds(b, 4).toFixed(1) + ' s · 16 bars = ' + verseSeconds(b, 16).toFixed(1) + ' s\nSyllables per second: 8 per bar = ' + sylPerSecond(8, b).toFixed(1) + ' · 12 per bar = ' + sylPerSecond(12, b).toFixed(1) + ' · 16 per bar = ' + sylPerSecond(16, b).toFixed(1) + '\nOne beat = ' + beatMs(b).toFixed(0) + ' ms; one 16th note = ' + (beatMs(b) / 4).toFixed(0) + ' ms.', { pre: true, chips: ['bar timer 80', 'bar timer 140', 'metronome'] }); }
    if (botId === 'rapper' && /^(freestyle|prompt|cypher)/.test(low)) { const ws = shuffle(FREE_WORDS).slice(0, 4); return R('FREESTYLE PROMPT\nScene: ' + pick(FREE_IMAGES) + '\nTheme: ' + pick(FREE_THEMES) + '\nWords to land: ' + ws.join(', ') + '\nRhyme family to chain: ' + pick(['-ine', '-ight', '-ow', '-ay', '-ame', '-ound', '-ing']) + '\nTempo: ' + (80 + 5 * Math.floor(rnd() * 4)) + ' bpm. Do 4 bars, one breath each.', { pre: true, chips: ['freestyle prompt', 'rhyme time', 'analyze'] }); }
    if (/^(analy[sz]e|flow|check my (bars|verse|lyrics?)|grade)\b/.test(low) || (/\n/.test(t) && t.split(/\n+/).filter(x => tokensOf(x).length >= 3).length >= 2)) {
      let body = t.replace(/^(analy[sz]e|flow|check my (bars|verse|lyrics?)|grade)\b[:\s-]*/i, '');
      if (!body.trim()) { S = { mode: 'verse' }; return R(botId === 'rapper' ? 'Paste your bars now, one bar per line (4 to 16 lines).' : 'Paste your lyric lines now, one per line.'); }
      return botId === 'rapper' ? flowReport(body) : lyricReport(body);
    }
    if (/^(tell me more|more|another|go deeper|explain more)\b/.test(low) && lastTopic && lastTopic.next) { const nx = lastTopic.next[0]; return route(nx); }
    if (/^(metronome|tuner|tools?|ear trainer)\b/.test(low)) return R('The tools tab has the ' + (botId === 'rapper' ? 'metronome, tap tempo, rhyme lab, flow grid and freestyle prompter' : 'pitch tuner, formant view, ear trainer, run builder, consonant coach and warm-up player') + '. In the terminal version, use the text commands instead.');

    // knowledge base
    const hits = matchKB(idx, t);
    if (hits.length && hits[0].s >= 1.0) {
      const e = hits[0].e; lastTopic = e;
      if (e.special === 'greet') return R(B.intro + '\n\nTry: "lesson 1", "quiz me", or ask me a question.', { chips: B.chips });
      return R(e.a, { chips: (e.next || []).concat(['help']).slice(0, 5) });
    }
    const sug = hits.slice(0, 3).map(h => h.e).filter(e => e.a).map(e => e.id.replace(/^[sr]-/, ''));
    return R("I'm a simple offline coach, so I may have missed that. I can answer questions about " + (botId === 'singer' ? 'breath, warm-ups, range, pitch, vowels, consonants, runs, mic, nerves and voice health' : 'flow, bars, rhyme, pocket, storytelling, punchlines, freestyle, breath and recording') + ', teach lessons, and run quizzes.' + (sug.length ? '\nClosest topics: ' + sug.join(', ') + '.' : '') + '\nType "help" for commands.', { chips: B.chips });
  }
  return { id: botId, bot: B, reply: raw => { const r = route(String(raw == null ? '' : raw).slice(0, 4000)); return r; }, greet: () => R(B.intro, { chips: B.chips }), progress: () => P, state: () => S, lessons, reload: () => { P = loadProgress(store, botId); } };
}

const FS = { INTERVAL_SONG_HINTS, mulberry32, seedRng, g2p, syllabify, syllables, rhymeRelation, multiMatch, stressedTail, analyzeBar, analyzeVerse, gridString, schemeLetters, internalRhymes, rhymesFor, createBot, BOTS, LESSONS, QBANK, KB, WARMUPS, BREATH, VOICE_SAFETY, HELP, BADGES, INTERVALS, SCALES, genRun, buildWarmup, coachWord, intervalQuestion, practicePlan, noteToMidi, midiToHz, midiName, hzToNote, centsBetween, scaleNotes, barSeconds, beatMs, swingOffsetMs, tapTempo, sylPerSecond, verseSeconds, FREE_WORDS, FREE_IMAGES, FREE_THEMES, dayKey, tokensOf, lastWord, vowelSeq, levelOf, loadProgress, WORD_SET, CCLASS, SLOT_W, shuffle, pick, rnd, clamp };
