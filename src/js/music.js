// ===== music.js : notes, intervals, scales, runs, warm-ups, consonant coach, breath, timing, practice plans =====
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const midiToHz = m => 440 * Math.pow(2, (m - 69) / 12);
const midiName = m => NOTE_NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
function noteToMidi(s) {
  const m = /^\s*([A-Ga-g])([#b♯♭]?)(-?\d)\s*$/.exec(String(s)); if (!m) return null;
  const base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1].toUpperCase()];
  const acc = (m[2] === '#' || m[2] === '♯') ? 1 : (m[2] === 'b' || m[2] === '♭') ? -1 : 0;
  return base + acc + (parseInt(m[3], 10) + 1) * 12;
}
function hzToNote(hz) { if (!(hz > 0)) return null; const m = 69 + 12 * Math.log2(hz / 440), r = Math.round(m); return { midi: r, name: midiName(r), cents: Math.round((m - r) * 100) }; }
function centsBetween(f, ref) { return 1200 * Math.log2(f / ref); }

const INTERVALS = [
  { n: 0, name: 'unison', short: 'P1' }, { n: 1, name: 'minor 2nd', short: 'm2' }, { n: 2, name: 'major 2nd', short: 'M2' },
  { n: 3, name: 'minor 3rd', short: 'm3' }, { n: 4, name: 'major 3rd', short: 'M3' }, { n: 5, name: 'perfect 4th', short: 'P4' },
  { n: 6, name: 'tritone', short: 'TT' }, { n: 7, name: 'perfect 5th', short: 'P5' }, { n: 8, name: 'minor 6th', short: 'm6' },
  { n: 9, name: 'major 6th', short: 'M6' }, { n: 10, name: 'minor 7th', short: 'm7' }, { n: 11, name: 'major 7th', short: 'M7' }, { n: 12, name: 'octave', short: 'P8' }
];
const INTERVAL_SONG_HINTS = { 7: 'perfect 5th (the first two notes of "Twinkle Twinkle")', 12: 'octave (the first two notes of "Somewhere Over the Rainbow")', 5: 'perfect 4th (the first two notes of "Here Comes the Bride")', 4: 'major 3rd (the first two notes of "When the Saints Go Marching In")' };
function intervalQuestion(maxN) {
  const pool = INTERVALS.filter(i => i.n > 0 && i.n <= (maxN || 12)), it = pick(pool), low = 55 + Math.floor(rnd() * 10); // G3..E4: comfortable
  return { low, high: low + it.n, answer: it.n, name: it.name, text: 'Starting on ' + midiName(low) + ', what note is a ' + it.name + ' above? (that is ' + it.n + ' semitones)' , note: midiName(low + it.n) };
}

const SCALES = {
  'major pentatonic': [0, 2, 4, 7, 9], 'minor pentatonic': [0, 3, 5, 7, 10], 'blues': [0, 3, 5, 6, 7, 10],
  'major': [0, 2, 4, 5, 7, 9, 11], 'natural minor': [0, 2, 3, 5, 7, 8, 10]
};
function scaleNotes(tonic, scaleName, lo, hi) {
  const iv = SCALES[scaleName] || SCALES['major pentatonic'], out = [];
  for (let base = tonic - 12; base <= tonic + 24; base += 12) iv.forEach(i => { const m = base + i; if (m >= lo && m <= hi) out.push(m); });
  return out.sort((a, b) => a - b);
}
// Run builder: bounded to one octave, stepwise cells first. Gospel-style runs are decorations around a held note.
function genRun(opts) {
  opts = opts || {}; const tonic = opts.tonic != null ? opts.tonic : 60, sc = opts.scale || 'major pentatonic', lvl = clamp(opts.level || 1, 1, 3);
  const win = scaleNotes(tonic, sc, tonic, tonic + 12); // one octave, tonic up
  let dir = opts.dir || pick(['up', 'down', 'wave']); if (lvl === 3) dir = 'wave';
  const len = [4, 6, 8][lvl - 1], seq = [];
  if (dir === 'up') { for (let i = 0; i < Math.min(len, win.length); i++) seq.push(win[i]); }
  else if (dir === 'down') { const top = Math.min(win.length - 1, len - 1); for (let i = 0; i < len && top - i >= 0; i++) seq.push(win[top - i]); }
  else { const half = len / 2, st = lvl === 3 ? 0 : Math.floor(rnd() * Math.max(1, win.length - half)); for (let i = 0; i < half; i++) seq.push(win[Math.min(win.length - 1, st + i)]); for (let i = half - 1; i >= 0; i--) seq.push(win[Math.min(win.length - 1, st + i)]); }
  return { notes: seq, names: seq.map(midiName), scale: sc, level: lvl, dir, held: tonic, tips: ['Say it slowly on one vowel (ah or oh) first, one note per beat.', 'Land the last note and hold it; a run is a decoration that leads somewhere.', 'Speed up only when every note is clean at the slow tempo. Stay relaxed; stop if your throat tightens.'] };
}

// ---- warm-ups (conservative, general guidance; a voice teacher outranks this list) ----
const WARMUPS = [
  { id: 'breath-reset', name: 'Easy breath reset', min: 1, kind: 'breath', steps: ['Stand or sit tall with shoulders loose.', 'Breathe in through the nose for 4 counts, letting the belly and low ribs widen.', 'Breathe out slowly on a quiet "sss" for 6 counts. Repeat 4 times.'] },
  { id: 'sigh', name: 'Gentle sighs', min: 1, kind: 'sovt', steps: ['Sigh softly from a comfortable high note down to a comfortable low note, like a sleepy "ahh".', 'Keep the jaw loose. Do 4 sighs.'], pattern: [7, 5, 4, 2, 0] },
  { id: 'lip-trill', name: 'Lip trills', min: 2, kind: 'sovt', steps: ['Blow air so your lips buzz (add a little voice if you can).', 'Slide gently up and down on a 5-note scale: do re mi fa sol then back.', 'If the buzz will not start, press lightly on your cheeks with your fingertips. Do not push the air hard.'], pattern: [0, 2, 4, 5, 7, 5, 4, 2, 0] },
  { id: 'straw', name: 'Straw hum', min: 2, kind: 'sovt', steps: ['Hum through a drinking straw (or lips pursed small) on an easy pitch.', 'Glide up a 3rd and back down. Keep it quiet and buzzy in the lips, not in the throat.'], pattern: [0, 2, 4, 2, 0] },
  { id: 'hum', name: 'Humming slides', min: 1, kind: 'hum', steps: ['Hum "mm" with lips lightly closed and teeth apart.', 'Slide up a 5th and back down. You should feel a gentle buzz at the lips and nose.'], pattern: [0, 7, 0] },
  { id: 'vowels', name: 'Five vowels on one note', min: 2, kind: 'vowel', steps: ['On one comfortable pitch sing "ee - eh - ah - oh - oo", one beat each, changing only the mouth shape.', 'Keep the pitch steady. Watch in a mirror: jaw loose, tongue tip resting behind the lower front teeth.'], pattern: [0, 0, 0, 0, 0] },
  { id: 'five-note', name: 'Five-note scale on "no"', min: 2, kind: 'vowel', steps: ['Sing do-re-mi-fa-sol-fa-mi-re-do on "noh" (or "nee").', 'Move up by a half step each time while it still feels easy; turn around before it feels like effort.'], pattern: [0, 2, 4, 5, 7, 5, 4, 2, 0] },
  { id: 'consonants', name: 'Consonant clarity', min: 2, kind: 'consonant', steps: ['Say slowly then sing on one note: "b-b-b, d-d-d, g-g-g" (plosives), then "v-v-v, z-z-z, sh-sh-sh" (voiced and unvoiced air).', 'Then sing "mah-nah-lah" to feel nasal and liquid consonants.', 'Keep the pitch steady through the consonant; do not push extra breath.'], pattern: [0, 0, 0] },
  { id: 'arpeggio', name: 'Arpeggio on "ah"', min: 2, kind: 'vowel', steps: ['Sing 1-3-5-3-1 (do-mi-sol-mi-do) on "ah" with a relaxed jaw.', 'Move up a half step at a time, staying within the part of your range that feels easy.'], pattern: [0, 4, 7, 4, 0] },
  { id: 'cooldown', name: 'Cool-down hum', min: 1, kind: 'cool', steps: ['Hum softly from a comfortable middle pitch downward in a slow slide.', 'Finish with a few easy breaths and a sip of water.'], pattern: [7, 5, 4, 2, 0] }
];
const WARMUP_ORDER = ['breath-reset', 'sigh', 'lip-trill', 'straw', 'hum', 'vowels', 'five-note', 'consonants', 'arpeggio', 'cooldown'];
function buildWarmup(minutes, level) {
  minutes = clamp(minutes || 8, 4, 20); level = level || 1; const total = [];
  const must = ['breath-reset', 'lip-trill', 'cooldown'], opt = WARMUP_ORDER.filter(id => !must.includes(id)).filter(id => level > 1 || id !== 'arpeggio');
  let sum = must.reduce((a, id) => a + WARMUPS.find(w => w.id === id).min, 0); const chosen = must.slice(); let k = 0;
  while (k < opt.length) { const w = WARMUPS.find(x => x.id === opt[k]); if (sum + w.min <= minutes) { chosen.push(w.id); sum += w.min; } k++; }
  const order = WARMUP_ORDER.filter(id => chosen.includes(id));
  return { minutes: sum, items: order.map(id => WARMUPS.find(w => w.id === id)) };
}
const VOICE_SAFETY = [
  'Stay in the part of your range that feels easy. If it hurts, scratches or goes hoarse, stop and rest.',
  'Sip water through the day, not only right before you sing.',
  'Do not shout, scream or push to be louder. Use a mic and good technique instead.',
  'Do not whisper hard or clear your throat over and over; sip water or swallow instead.',
  'Take quiet breaks in long sessions, and sleep well. Tired voices recover better when rested.',
  'Hoarseness that lasts more than about two weeks, pain, trouble swallowing or breathing: see a doctor (an ENT or voice specialist).',
  'Voices change during puberty. Cracks are normal; do not force high notes or copy someone else\'s voice. A voice teacher can help.'
];

// ---- consonants for singing and rapping ----
const CCLASS = {
  p: ['plosive', 'unvoiced'], b: ['plosive', 'voiced'], t: ['plosive', 'unvoiced'], d: ['plosive', 'voiced'], k: ['plosive', 'unvoiced'], g: ['plosive', 'voiced'],
  f: ['fricative', 'unvoiced'], v: ['fricative', 'voiced'], th: ['fricative', 'unvoiced'], dh: ['fricative', 'voiced'], s: ['fricative', 'unvoiced'], z: ['fricative', 'voiced'], sh: ['fricative', 'unvoiced'], zh: ['fricative', 'voiced'], h: ['fricative', 'unvoiced'],
  m: ['nasal', 'voiced'], n: ['nasal', 'voiced'], ng: ['nasal', 'voiced'], l: ['liquid', 'voiced'], r: ['liquid', 'voiced'], w: ['glide', 'voiced'], y: ['glide', 'voiced'], ch: ['affricate', 'unvoiced'], jh: ['affricate', 'voiced']
};
const CTIPS = {
  plosive: { onset: 'Plosive start: build a little pressure, then release right before the beat so the vowel lands on time. Do not blast air.', coda: 'Plosive ending: stop the sound cleanly (a quick tongue or lip closure). Decide whether to release it audibly or leave it closed.' },
  fricative: { onset: 'Fricative start: begin the hiss a hair early; it is unvoiced noise, so the pitch starts when the vowel does.', coda: 'Fricative ending: keep the final hiss short and quiet; a long "sss" at the end of a held note sounds sharp.' },
  nasal: { onset: 'Nasal start: hum first so the pitch is already there, then open to the vowel.', coda: 'Nasal ending: you can hold the note on "m", "n" or "ng" and close at the very end. It is a good place to hold.' },
  liquid: { onset: 'L/R start: keep it light and quick; get to the vowel fast so the tone is not dark.', coda: 'L/R ending: shape it late, at the very end, so the vowel keeps its colour.' },
  glide: { onset: 'W/Y start: it is almost a vowel; start already voiced and move quickly into the main vowel.', coda: 'W/Y ending: treat it as a quick vowel tail.' },
  affricate: { onset: 'Ch/J start: a plosive and a fricative stuck together. Release smoothly; do not make it long.', coda: 'Ch/J ending: keep it short; release the breath gently.' }
};
function coachWord(word) {
  const sy = syllabify(word), out = [];
  sy.forEach((s, i) => {
    const on = s.onset.map(t => ({ t, c: CCLASS[t] || ['?', '?'] })), co = s.coda.map(t => ({ t, c: CCLASS[t] || ['?', '?'] }));
    const tips = []; if (on[0] && CTIPS[on[0].c[0]]) tips.push(CTIPS[on[0].c[0]].onset); if (co.length && CTIPS[co[co.length - 1].c[0]]) tips.push(CTIPS[co[co.length - 1].c[0]].coda);
    if (!on.length) tips.push('Vowel start: begin the vowel with a soft onset (a gentle "h" feel), not a hard glottal click.');
    out.push({ idx: i + 1, vowel: s.v, onset: on, coda: co, stress: s.stress, tips, holdable: s.coda.length === 0 || (co.length && ['nasal', 'liquid', 'glide'].includes(co[co.length - 1].c[0])) });
  });
  return out;
}

// ---- breath & timing ----
const BREATH = {
  easy: { name: 'Easy 4-out-6', phases: [['In (nose)', 4], ['Out on "sss"', 6]], rounds: 6 },
  box: { name: 'Box 4-4-4-4', phases: [['In', 4], ['Hold gently', 4], ['Out', 4], ['Rest', 4]], rounds: 4 },
  rap: { name: 'Rap bar breath 2-2-4', phases: [['Quick in', 2], ['Hold', 2], ['Out on "fff"', 4]], rounds: 6 },
  long: { name: 'Long phrase 4-in-12-out', phases: [['In (low and quiet)', 4], ['Out on "sss"', 12]], rounds: 4 }
};
function beatMs(bpm) { return 60000 / bpm; }
function swingOffsetMs(bpm, swing) { return (swing || 0) * (60000 / bpm) / 4; } // swing 0..1 delays the offbeat 16th
function tapTempo(times) { if (times.length < 2) return null; const iv = []; for (let i = 1; i < times.length; i++) iv.push(times[i] - times[i - 1]); const med = iv.slice().sort((a, b) => a - b)[Math.floor(iv.length / 2)]; return Math.round(60000 / med); }
function verseSeconds(bpm, bars) { return barSeconds(bpm, 4) * bars; }
function sylPerSecond(syl, bpm) { return syl / barSeconds(bpm, 4); }

// ---- practice plans ----
function practicePlan(bot, minutes, level, focus) {
  minutes = clamp(Math.round(minutes || 20), 10, 90); level = clamp(level || 1, 1, 4);
  const B = bot === 'singer';
  const blocks = B ? [
    ['Warm-up (breath, lip trills, easy slides)', 0.2], ['Technique drill: ' + (focus || 'pitch and vowels'), 0.3], ['Song or phrase work (small sections, slow)', 0.3], ['Record yourself once and listen back', 0.1], ['Cool-down hum and water', 0.1]
  ] : [
    ['Warm-up: breath and clear-speech tongue twisters (slowly)', 0.15], ['Flow drill: ' + (focus || 'count bars on a beat'), 0.3], ['Writing: one 4-bar verse with a rhyme family', 0.3], ['Perform it out loud on a beat, record once', 0.15], ['Review: what worked, what to fix tomorrow', 0.1]
  ];
  let used = 0; const items = blocks.map((b, i) => { const m = i === blocks.length - 1 ? minutes - used : Math.max(1, Math.round(minutes * b[1])); used += m; return { text: b[0], min: m }; });
  return { minutes, items, rules: B ? ['Short, regular sessions beat one long one.', 'Rest day at least once a week; stop if your voice feels strained.'] : ['Short, regular sessions beat one long one.', 'Write original lines. Imitating a technique is fine; copying lines is not.'] };
}
