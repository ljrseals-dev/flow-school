const FS = require('./load')();
let fails = 0; const ok = (n, c, d) => { if (!c) { fails++; console.log('FAIL ' + n + (d ? '  ' + d : '')); } else if (process.env.V) console.log('PASS ' + n); };
const mem = {}; const store = { get: k => mem[k] || null, set: (k, v) => { mem[k] = JSON.parse(JSON.stringify(v)); } };
// content integrity
['singer', 'rapper'].forEach(bot => {
  ok(bot + ' has 12 lessons', FS.LESSONS[bot].length === 12);
  FS.LESSONS[bot].forEach(l => { ok(bot + ' lesson ' + l.n + ' fields', l.title && l.goal && l.body.length >= 3 && l.drill.length >= 3 && l.quiz.length >= 2);
    l.quiz.concat([]).forEach(q => ok(bot + ' lesson ' + l.n + ' quiz valid', q.o.length === 4 && q.a >= 0 && q.a < 4 && q.why, q.q)); });
  FS.QBANK[bot].forEach(q => ok(bot + ' bank valid', q.o.length === 4 && q.a >= 0 && q.a < 4, q.q));
  // every KB entry reachable by its own keywords
  const b = FS.createBot(bot, store);
  FS.KB.shared.concat(FS.KB[bot]).forEach(e => { if (/^(s-breath|r-breath|s-cons|r-flow|r-free|r-lyrics|who)$/.test(e.id)) return; const r = b.reply(e.k.split(' ').slice(0, 3).join(' ')); const want = e.a || FS.BOTS[bot].intro; ok(bot + ' KB reachable: ' + e.id, r.text.startsWith((want || '').slice(0, 25)) || /greet/.test(e.id) , r.text.slice(0, 60)); });
  // commands never throw, never empty
  const inputs = ['', ' ', 'help', 'about', 'safety', 'lessons', 'lesson 0', 'lesson 99', 'lesson 3', 'next', 'back', 'check', 'a', 'stop', 'quiz', 'stop', 'progress', 'practice plan 5', 'practice plan 500', 'plan', 'warm up', 'warm up 20', 'breath timer', 'run', 'run blues hard', 'consonant beautiful', 'note C4', 'note H9', 'interval', '7', 'rhyme xyzzy', 'rhyme time', 'done', 'syllables', 'bar timer 0', 'bar timer 9999', 'freestyle prompt', 'analyze', 'a\nb', 'analyze\nhello world today\nsecond line goes here', 'tools', 'tell me more', 'reset progress', 'cancel', '<script>alert(1)</script>', '🎤🎤', 'x'.repeat(10000), 'I want to die', 'cough up blood', 'clone mahalia voice', 'write the full lyrics of a famous song', 'write explicit drug lyrics'];
  inputs.forEach(i => { let r; try { r = b.reply(i); } catch (e) { ok(bot + ' no throw: ' + JSON.stringify(i.slice(0, 20)), false, e.message); return; } ok(bot + ' non-empty: ' + JSON.stringify(i.slice(0, 20)), r && typeof r.text === 'string' && r.text.length > 0); });
  const rs = b.reply('I want to die').text; ok(bot + ' crisis response has 988 and adult', /988/.test(rs) && /trusted adult/.test(rs));
  ok(bot + ' refuses cloning', /can't clone/.test(b.reply('make a clone of his voice').text));
  ok(bot + ' refuses lyrics', /don't reproduce/.test(b.reply('give me the full lyrics of that song').text));
  ok(bot + ' clean decline', /clean and kind/.test(b.reply('write something sexual and explicit').text));
});
// quiz flow on fresh store
{
  const b = FS.createBot('rapper', {}); // store without get/set -> memory fallback
  b.reply('lesson 1'); let r = b.reply('check'); ok('check starts quiz', /Q1\/2/.test(r.text));
  // answer correctly by reading answer from state
  for (let k = 0; k < 2; k++) { const it = b.state().items[b.state().i]; r = b.reply(String.fromCharCode(65 + it.a)); }
  ok('perfect checkpoint completes lesson', b.progress().done.r1 === 2 && /mastered/.test(r.text), r.text.slice(0, 120));
  ok('xp awarded', b.progress().xp >= 30, 'xp=' + b.progress().xp);
  // streak
  let d = '2026-11-01'; const b2 = FS.createBot('singer', {}, { today: () => d }); b2.reply('lesson 1'); d = '2026-11-02'; b2.reply('lesson 2'); d = '2026-11-03'; b2.reply('lesson 3'); ok('3-day streak', b2.progress().streak === 3 && b2.progress().badges.includes('streak3'));
  d = '2026-11-10'; b2.reply('lesson 4'); ok('streak resets after gap', b2.progress().streak === 1 && b2.progress().best === 3);
  // quiz: option shuffling keeps correct answer consistent
  const b3 = FS.createBot('singer', {}); b3.reply('quiz me'); let good = 0; const n = b3.state().items.length; for (let k = 0; k < n; k++) { const it = b3.state().items[b3.state().i]; b3.reply(String.fromCharCode(65 + it.a)); good++; } ok('quiz all-correct path', good === n && b3.progress().quizzes.at(-1).score === n);
  ok('progress persisted', JSON.parse(JSON.stringify(mem['flowschool:singer'])).xp > 0);
}
// determinism of seeded prng
{ FS.seedRng(42); const a = FS.genRun({ tonic: 60 }).names.join(); FS.seedRng(42); const b = FS.genRun({ tonic: 60 }).names.join(); ok('seeded runs repeat', a === b); }
// runs bounded and warm-ups sane
{ let bad = 0; for (let i = 0; i < 400; i++) { ['major pentatonic', 'minor pentatonic', 'blues'].forEach(sc => [1, 2, 3].forEach(lv => { const r = FS.genRun({ tonic: 60, scale: sc, level: lv }); const lo = Math.min(...r.notes), hi = Math.max(...r.notes); if (hi - lo > 12 || lo < 60 || hi > 72 || r.notes.length < 4) bad++; })); } ok('runs stay within one octave and C3..C5 window', bad === 0, 'bad=' + bad);
  [4, 8, 12, 20].forEach(m => { const w = FS.buildWarmup(m, 1); ok('warmup ' + m + ' min fits', w.minutes <= Math.max(m, 4) + 0 && w.items.length >= 3 && w.items[w.items.length - 1].id === 'cooldown', w.minutes + ''); }); }
// music maths
ok('A4=440', Math.abs(FS.midiToHz(FS.noteToMidi('A4')) - 440) < 1e-9); ok('C4=261.63', Math.abs(FS.midiToHz(60) - 261.6256) < 0.01);
ok('hzToNote', FS.hzToNote(440).name === 'A4' && FS.hzToNote(440).cents === 0 && FS.hzToNote(452).cents > 40);
ok('tapTempo 500ms = 120', FS.tapTempo([0, 500, 1000, 1500]) === 120);
ok('bar at 90bpm = 2.667s', Math.abs(FS.barSeconds(90) - 2.6667) < 1e-3);
// flow grid invariants
['I spit it slow let the rhythm flow', 'a', 'one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen', 'beautiful melody harmony symphony'].forEach(l => { const a = FS.analyzeBar(l); if (a.grid) { const filled = a.grid.filter(Boolean).length; ok('grid cells <= syllables: ' + l.slice(0, 20), filled <= Math.max(a.n, 0) && (a.density === 'overflow' ? filled === 0 : filled === a.n), a.n + '/' + filled); } });
ok('overflow flagged', FS.analyzeBar('one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen').density === 'overflow');
console.log(fails ? '\n' + fails + ' check(s) failed' : 'all bot checks passed'); process.exit(fails ? 1 : 0);
