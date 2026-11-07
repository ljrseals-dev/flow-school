// ===== content.js : bots, lessons, quiz banks, knowledge base, safety text =====
// Written by hand for this tool. No lyrics are quoted. Style notes are general characterisations, not claims about specific songs.
const BOTS = {
  singer: {
    id: 'singer', name: 'SingerFlow', emoji: '🎤',
    tagline: 'Healthy-voice training for young singers',
    intro: "Hi, I'm SingerFlow. I'm a rule-based coach that runs entirely on your device: no internet, no AI model behind me. I can teach lessons, quiz you, build a warm-up and practice plan, break words into consonants, build runs, and track your progress. Type \"help\" to see what I can do.",
    about: 'SingerFlow is a rule-based training tool: keyword matching, a hand-written knowledge base and small calculators. It has no neural network and no API. Pitch and formant tools (mic) only work if your browser allows the microphone. It is not a medical or voice-teacher substitute. Gospel and other style notes are general craft ideas; nothing here clones or imitates a real person\'s voice.',
    levels: ['Foundations', 'Technique', 'Craft', 'Performance'],
    chips: ['help', 'lesson 1', 'quiz me', 'warm up', 'practice plan 20', 'run', 'safety']
  },
  rapper: {
    id: 'rapper', name: 'BiggieFlow', emoji: '🎧',
    tagline: 'Flow, rhyme and writing for young artists',
    intro: "Yo, I'm BiggieFlow, a rule-based flow coach that runs entirely on your device: no internet, no AI model. I'm an independent study tool inspired by the storytelling and rhyme craft of 1990s New York rap. I'm not affiliated with the Notorious B.I.G. or his estate, I don't speak as him, and I won't reproduce his lyrics. Paste 4 bars and I'll break down the flow. Type \"help\" to see everything.",
    about: 'BiggieFlow is a rule-based training tool: keyword matching, hand-written lessons and spelling-based rhyme and stress heuristics. No neural network, no API. Its rhyme, stress and flow-grid analysis is an estimate from spelling, not from audio; it can be wrong, especially on names, slang and unusual words. It is unaffiliated with the Notorious B.I.G. or his estate and does not reproduce or imitate any real artist\'s voice or lyrics. His catalogue contains explicit material; this tool teaches craft and keeps its own content clean.',
    levels: ['Foundations', 'Rhyme craft', 'Writing craft', 'Performance'],
    chips: ['help', 'lesson 1', 'quiz me', 'rhyme time', 'bar timer 90', 'freestyle prompt', 'practice plan 20']
  }
};

const LESSONS = { singer: [], rapper: [] };
function L(bot, level, title, goal, body, drill, quiz) { LESSONS[bot].push({ id: bot[0] + (LESSONS[bot].length + 1), n: LESSONS[bot].length + 1, level, title, goal, body, drill, quiz }); }

// ---------------- SINGER ----------------
L('singer', 1, 'Posture and easy breath', 'Breathe low and quietly, sing without tension.',
  ['Stand with feet about hip-width apart, knees soft, shoulders loose and chin level. A tall but relaxed body gives the breath room to move.',
   'Breathe in quietly through the nose or the corners of the mouth. Let the belly and the lower ribs widen a little instead of lifting the shoulders. You do not need a huge breath; you need an easy, quiet one.',
   'Let the air out slowly and steadily. A good test is a steady "sss": try to keep it even for 10 seconds, then 15, without squeezing.'],
  ['Hand on belly: breathe in for 4 counts, feel it widen, then out on "sss" for 6. Repeat 5 times.', 'Shoulder check in a mirror: they should not rise on the inhale.', 'Count how long you can hold a quiet "sss". Write it down and compare next week.'],
  [{ q: 'On the inhale, what should you notice?', o: ['Shoulders lifting high', 'Belly and lower ribs widening a little', 'Chest puffed out and held', 'A loud gasp'], a: 1, why: 'A quiet, low breath keeps the neck and shoulders free.' },
   { q: 'What does a steady "sss" help you check?', o: ['Pitch accuracy', 'Breath control', 'Vibrato speed', 'Vowel colour'], a: 1, why: 'It is a simple way to hear whether the air flow is even.' }]);
L('singer', 1, 'Your comfortable range (and changing voices)', 'Find the notes that feel easy today and sing within them.',
  ['Your range is the span from your lowest to highest comfortable note. It grows slowly with healthy practice; it does not grow by forcing.',
   'Voices change during puberty. Cracks, flips and sudden changes in the lowest and highest notes are normal for many young singers. Do not force notes, and do not copy a singer\'s sound that sits far outside your own voice.',
   'Find your "home" notes: slide gently up on "ng" or a hum and notice where it feels free. Practise mostly in the middle; visit the edges briefly and quietly.'],
  ['Slide a gentle "ng" up from a low comfortable note until it starts to feel effortful. Stop one or two notes before that. That is today\'s top.', 'Do the same downward.', 'Write both notes down; they can change day to day.'],
  [{ q: 'Voice cracks during puberty are…', o: ['A sign you are singing wrong and should stop forever', 'Common and normal; avoid forcing', 'Fixed by singing louder', 'Only a problem for girls'], a: 1, why: 'The voice is changing; gentle, easy singing is the way through.' },
   { q: 'Where should most practice happen?', o: ['At the very top of your range', 'In the comfortable middle', 'Only on the lowest notes', 'Wherever the singer you copy sings'], a: 1, why: 'Visit the edges briefly; live in the middle.' }]);
L('singer', 1, 'Matching pitch', 'Hear a note, sing it, and judge how close you are.',
  ['Pitch matching is a listening skill first. Hum the note softly; if you can hear it in your head before you sing it, you will hit it more often.',
   'Cents measure how far you are from a note: 100 cents is one semitone (one piano key). Being within about 20 cents sounds in tune to most listeners; singers drift a little all the time.',
   'Use a piano, a drone or the tuner tool. Aim first for the middle of the note, then hold it steady for 3 seconds without wobbling.'],
  ['Play one note. Hum it back, then open to "ah". Check with the tuner if you have a mic.', 'Try two notes: one, then the next one up. Repeat slowly.', 'Close your eyes and sing the note first, then check yourself.'],
  [{ q: 'How many cents are in one semitone?', o: ['10', '50', '100', '1200'], a: 2, why: '100 cents = 1 semitone; 1200 cents = 1 octave.' },
   { q: 'Before singing a target note, a good first step is…', o: ['Singing louder', 'Hearing it in your head or humming it softly', 'Holding your breath', 'Sliding from far above'], a: 1, why: 'Audiate first (hear it internally), then sing.' }]);
L('singer', 2, 'Vowels: the five shapes', 'Keep vowels pure and consistent across notes.',
  ['Singing is mostly vowels. A held note is a vowel. Practise ee, eh, ah, oh, oo with a loose jaw and a relaxed tongue, changing only the mouth and tongue shape, not the pitch.',
   'Each vowel has resonances called formants (F1 and F2), which are why "ee" and "ah" sound different even on the same note. Roughly, F1 rises as the mouth opens and F2 rises as the tongue moves forward. The formant tool can show these, but it works best on low-to-mid pitches and is only an estimate.',
   'On higher notes, many singers modify vowels a little (for example "ee" slightly more open) to keep tone free. A teacher can show you how. Do not push to keep a vowel exact if it makes you strain.'],
  ['On one comfortable pitch: ee - eh - ah - oh - oo, one beat each, no pitch change.', 'Sing the same pattern one step higher; notice if any vowel tightens.', 'Mirror check: jaw drops straight down on "ah", lips round on "oo".'],
  [{ q: 'Which part of a sung word do you usually hold?', o: ['The first consonant', 'The vowel', 'The last consonant', 'The silent letter'], a: 1, why: 'Sustained sound is the vowel.' },
   { q: 'What do formants (F1, F2) explain?', o: ['Why vowels sound different', 'How loud you are', 'Your tempo', 'Where to breathe'], a: 0, why: 'Vowel colour comes from resonances of the vocal tract.' }]);
L('singer', 2, 'Consonants that carry the words', 'Make words clear without disturbing the tone.',
  ['Consonants give words their shape. Plosives (p b t d k g) are quick bursts, fricatives (f v s z sh th) are air noise, nasals (m n ng) hum through the nose, liquids (l r) and glides (w y) are almost vowels.',
   'Voiced consonants (b d g v z m n) add a buzz; unvoiced ones (p t k f s sh) are just air. Unvoiced consonants have no pitch, so begin them slightly before the beat and have the vowel land on the beat.',
   'Nasals and liquids are good places to keep tone going. End hard consonants cleanly and short so held vowels stay clear.'],
  ['Say the word "beautiful" slowly and mark the consonants. Sing it on one note, landing the vowel on the beat.', 'Sing "mah-nah-lah" on one pitch, keeping the tone smooth.', 'Use the consonant coach: type three words from a song you are working on.'],
  [{ q: 'Which is an unvoiced consonant?', o: ['b', 'v', 's', 'm'], a: 2, why: '"s" is air only; b, v, m add voice.' },
   { q: 'To keep a beat clean, an unvoiced start like "s" should…', o: ['Land exactly on the beat', 'Start slightly before the beat so the vowel lands on it', 'Be as long as possible', 'Be skipped'], a: 1, why: 'Lead the consonant; land the vowel.' }]);
L('singer', 2, 'Intervals and scales', 'Recognise common distances between notes and sing simple scales.',
  ['An interval is the distance between two notes. A major scale (do re mi fa sol la ti do) goes up by whole steps except between 3-4 and 7-8, which are half steps.',
   'The major pentatonic scale uses five notes (1 2 3 5 6) and is easy to sing in tune; the minor pentatonic (1 b3 4 5 b7) and the blues scale (add a b5) are common in gospel, soul and pop.',
   'Memorise interval sounds with songs you know. A perfect fifth is seven semitones; an octave is twelve.'],
  ['Sing a major scale up and down slowly with solfege.', 'Sing a 5-note major pentatonic: 1 2 3 5 6, then back.', 'Use the ear trainer: three intervals a day, starting with fifths and octaves.'],
  [{ q: 'How many semitones are in a perfect fifth?', o: ['5', '7', '9', '12'], a: 1, why: 'C to G is 7 semitones.' },
   { q: 'Which scale has five notes?', o: ['Major', 'Blues (six)', 'Pentatonic', 'Chromatic'], a: 2, why: 'Penta means five.' }]);
L('singer', 3, 'Phrasing and dynamics', 'Shape a line instead of singing note-by-note.',
  ['A phrase is a musical sentence. Decide where each phrase begins, where it leads (usually one important word), and where you will breathe. Mark breaths in pencil on your lyric sheet.',
   'Dynamics are changes in loudness. Start phrases a little softer and grow into the key word. You do not need to be loud to be powerful; contrast does most of the work.',
   'Speak the lyric as if telling a friend. Then sing it with the same meaning. Meaning shapes phrasing better than technique does.'],
  ['Pick 4 lines of a song. Speak them with feeling, then sing them with the same emphasis.', 'Mark breath places and the "peak" word of each phrase.', 'Sing it once soft-to-loud and once even; record both and compare.'],
  [{ q: 'Dynamics are changes in…', o: ['Pitch', 'Loudness', 'Key', 'Word order'], a: 1, why: 'Dynamics = volume.' },
   { q: 'A good way to find phrasing is to…', o: ['Sing as fast as possible', 'Speak the lyric with meaning first', 'Remove all breaths', 'Hold every note equally'], a: 1, why: 'Meaning guides emphasis and breath.' }]);
L('singer', 3, 'Gospel-style runs and ornaments', 'Build a short, clean run that lands on a held note.',
  ['A run is a quick stepwise group of notes decorating a longer note. Gospel and soul singers use them for emphasis. Mahalia Jackson, a gospel pioneer often called the Queen of Gospel, is a famous reference for powerful, church-rooted phrasing: repeating a phrase, building intensity, and holding key words. Use her as a listening reference for craft ideas, not as a voice to imitate.',
   'Start with 4 notes of a pentatonic scale, one note per beat, on a single vowel. Slow it down until each note is clean, then add speed. A run should lead to a held target note.',
   'Keep it within an octave and well inside your comfortable range. If your throat tightens, stop and go back to slower, quieter versions.'],
  ['Use the run builder: level 1, ascending. Sing it at 60 beats per minute with one note per beat.', 'Play it back at 90, then 120 only when clean.', 'Write your own 4-note run and sing it into a held word.'],
  [{ q: 'A run should…', o: ['Be as fast and high as possible', 'Lead clearly to a held note, and stay comfortable', 'Replace the melody entirely', 'Ignore the key'], a: 1, why: 'Runs are decoration; clarity and comfort come first.' },
   { q: 'What is the best way to learn a run?', o: ['At full speed immediately', 'Slowly on one vowel, then speed up gradually', 'Whisper it', 'Skip warm-ups'], a: 1, why: 'Accuracy first, speed later.' }]);
L('singer', 3, 'Vibrato and tone', 'Let a natural vibrato appear; do not force it.',
  ['Vibrato is a gentle wobble in pitch (and a bit of loudness) on held notes. It usually appears naturally when the voice is relaxed and supported. Forcing or shaking the jaw or throat to make it will cause tension.',
   'Practise straight tone first (a steady note with no wobble), then let the note relax. Many young voices do not have a steady vibrato yet, and that is normal.',
   'Tone also comes from relaxed jaw, space in the mouth and clear vowels. Brightness and darkness are matters of taste; keep it easy.'],
  ['Hold a comfortable note straight for 4 counts.', 'Hold it again and relax; listen for a gentle movement without pushing it.', 'Record both and compare.'],
  [{ q: 'The safest way to get vibrato is to…', o: ['Shake your jaw', 'Relax and let it develop', 'Squeeze the throat', 'Sing louder'], a: 1, why: 'Vibrato is a by-product of relaxed, supported singing.' },
   { q: 'Straight tone means…', o: ['No vibrato', 'Very loud', 'Very high', 'Whispered'], a: 0, why: 'A steady pitch with little or no wobble.' }]);
L('singer', 4, 'Microphone technique and recording', 'Use a mic so you do not have to push your voice.',
  ['A microphone lets you stay soft. Hold or stand about a fist (10 to 15 cm) from it, a little off to the side to soften "p" and "b" pops. Move slightly away on loud notes and closer on soft ones.',
   'When recording, listen with headphones at a low volume. Record short takes, listen back, and take notes. Your voice sounds different to you than to others, and recordings are the honest mirror.',
   'Do not sing over loud music or shout over a crowd; ask for a better monitor or lower the backing track.'],
  ['Record the same phrase at three distances. Which sounds best?', 'Record a "p" word on and off axis; listen for pops.', 'Keep one take a week as a progress diary.'],
  [{ q: 'A good starting mic distance is about…', o: ['Touching the mic', 'A fist (10-15 cm)', 'Across the room', '2 metres'], a: 1, why: 'Close enough for tone, far enough to avoid pops.' },
   { q: 'In a loud room you should…', o: ['Shout', 'Ask for better monitoring or a lower backing track', 'Whisper', 'Clear your throat repeatedly'], a: 1, why: 'Fix the sound around you, not by straining.' }]);
L('singer', 4, 'Performance and nerves', 'Turn nerves into energy and prepare calmly.',
  ['Nerves are common and are not a sign you will do badly. Your body is getting ready. Slow breaths and a clear plan help.',
   'Prepare in layers: know the words, know the melody, then practise the performance (standing, with a mic, in front of someone). Run the opening 8 bars many times so the first moments feel familiar.',
   'The night before, keep it light: gentle warm-up, water, sleep. On the day, warm up, sip water, and choose one thing to focus on, such as the meaning of the first line.'],
  ['Perform for one trusted person, then two.', 'Breathe in 4, out 6 for one minute before you start.', 'Write a three-line checklist (words, first note, breath) and read it before every run.'],
  [{ q: 'Which preparation is best the night before?', o: ['A long hard rehearsal', 'Light review, gentle warm-up, water, sleep', 'Shouting practice', 'No water'], a: 1, why: 'Rested voices perform better.' },
   { q: 'Nerves are…', o: ['Always bad', 'Normal and manageable', 'Rare', 'Proof you are unprepared'], a: 1, why: 'Almost all performers feel them.' }]);
L('singer', 4, 'A sustainable routine and vocal health', 'Build a plan that grows your voice and protects it.',
  ['Short, regular sessions beat rare marathons. Fifteen to thirty focused minutes most days, with at least one rest day, is a good pattern for many young singers; ask your teacher what suits you.',
   'Vocal hygiene: drink water through the day, do not shout or whisper hard, avoid repeated throat clearing, rest when tired, avoid smoke, and sleep well. See a doctor for hoarseness lasting over about two weeks, pain, or trouble swallowing or breathing.',
   'Track progress weekly: range notes, steady-"sss" seconds, favourite recording, one goal. Celebrate small wins.'],
  ['Write a 5-day plan with one rest day.', 'Set one goal for this month (for example a clean 4-note run).', 'Run the warm-up builder and save it.'],
  [{ q: 'Hoarseness lasting more than about two weeks means…', o: ['Sing harder', 'See a doctor', 'Whisper', 'Ignore it'], a: 1, why: 'Persistent hoarseness needs a medical check.' },
   { q: 'A good practice pattern is…', o: ['One 4-hour session a month', 'Short regular sessions with rest days', 'Only before performances', 'Nonstop'], a: 1, why: 'Consistency and recovery.' }]);

// ---------------- RAPPER ----------------
L('rapper', 1, 'Counting bars and the beat', 'Count 4/4 and know where the bar starts.',
  ['Most rap sits on 4/4: four beats per bar, counted 1-2-3-4. A verse is often 16 bars, a hook often 4 or 8. Count out loud over a beat until you can feel when the bar restarts.',
   'Each beat splits into four 16th notes: 1 e & a. A bar is 16 slots. Syllables you say sit in those slots. Beats 2 and 4 are the backbeat (usually the snare).',
   'Use the metronome: pick 80 to 95 beats per minute, count "1 2 3 4" for four bars, then speak any sentence once per bar.'],
  ['Count bars to 16 without losing track, at 85 bpm.', 'Say your name and one other word per beat, steady.', 'Clap the backbeat (2 and 4) while counting.'],
  [{ q: 'How many 16th-note slots are in one 4/4 bar?', o: ['4', '8', '16', '32'], a: 2, why: '4 beats x 4 sixteenths = 16.' },
   { q: 'Which beats are the backbeat?', o: ['1 and 3', '2 and 4', 'Only 1', 'All of them'], a: 1, why: 'The snare usually lands on 2 and 4.' }]);
L('rapper', 1, 'Syllables and stress', 'See where stressed syllables land in the bar.',
  ['A syllable is one beat of sound: "flow" is 1, "rhythm" is 2, "melody" is 3. Stress is the louder, longer syllable in a word: RHY-thm, MEL-o-dy, be-LIEVE.',
   'Rap sounds smooth when stressed syllables land on strong spots (the beats or the offbeats) and unstressed ones fill in around them. When a stressed syllable lands somewhere awkward, the line feels clumsy.',
   'Use the flow grid: it places your syllables in 16 slots and marks stressed ones with X. It is a spelling-based estimate, so say the line out loud to confirm.'],
  ['Write one line and underline stressed syllables.', 'Paste it into the flow grid. Where does the grid put the stress?', 'Rewrite one word so a stressed syllable lands on beat 3.'],
  [{ q: 'How many syllables are in "melody"?', o: ['2', '3', '4', '5'], a: 1, why: 'mel-o-dy.' },
   { q: 'Smooth flow usually means…', o: ['Stressed syllables land on strong spots', 'All words are the same length', 'No rests', 'Every line is 20 syllables'], a: 0, why: 'Stress and rhythm should line up.' }]);
L('rapper', 1, 'Breath and clear delivery', 'Breathe in the gaps and make every word understandable.',
  ['Breath is part of the rhythm. Plan your breath at the end of a bar or a line, a quick low breath through the nose or mouth, not a gasp. Mark breath spots on your page.',
   'Clear speech wins. Open your mouth, shape consonants, and slow down until every word is crisp, then speed up. Fast and mumbled loses to medium and clear.',
   'Practise tongue twisters slowly first. Accuracy before speed.'],
  ['Read a verse and mark a breath at the end of every second bar.', 'Say a tongue twister at half speed 3 times, then normal speed once.', 'Record one bar; can a friend write down every word?'],
  [{ q: 'The best place to breathe is usually…', o: ['In the middle of a word', 'At the end of a bar or line', 'Never', 'On every beat'], a: 1, why: 'Planned breath at natural gaps.' },
   { q: 'For fast rap, you should first…', o: ['Mumble', 'Make it clear slowly, then speed up', 'Shout', 'Skip consonants'], a: 1, why: 'Clear first, fast later.' }]);
L('rapper', 2, 'Rhyme types', 'Tell perfect, slant, and multisyllabic rhymes apart.',
  ['Perfect rhyme: same vowel and ending sounds (flow / know, night / light). Slant (near) rhyme: similar but not identical (home / stone, time / mind). Using only perfect rhymes can sound sing-song; slant rhymes give you more words and more surprise.',
   'Multisyllabic rhyme matches several syllables in a row, usually the vowel sounds ("the kind of" / "I find a"). Match the vowels from the end backward: more matches = denser rhyme.',
   'End rhyme is at the ends of lines. Internal rhyme sits inside a line. Both can be used together.'],
  ['Pick a word and list 10 perfect and 5 slant rhymes (use the rhyme lab to check).', 'Write a 2-line couplet with a slant rhyme.', 'Write one 2-syllable multi rhyme.'],
  [{ q: 'Which pair is a slant rhyme?', o: ['cat / hat', 'time / mind', 'flow / know', 'night / light'], a: 1, why: 'Similar vowel, different ending consonants.' },
   { q: 'A multisyllabic rhyme matches…', o: ['Only the last letter', 'Several syllables, mostly the vowel sounds', 'The first word', 'Nothing'], a: 1, why: 'Matching from the end backward through several vowels.' }]);
L('rapper', 2, 'Internal rhyme and rhyme families', 'Chain rhymes inside bars and across a verse.',
  ['Pick one rhyme family for a verse (for example the "-ine" sound: mine, line, shine, design). Build a list before you write, so you have words ready.',
   'Internal rhyme: put a word in the middle of the line that rhymes with the end ("I rise with the skies"). Chain rhymes inside several bars and the verse sounds woven together.',
   'Mix rhyme families so the verse does not feel stuck: do four bars in one family, then switch.'],
  ['Choose an ending sound and brainstorm 12 words for it.', 'Write 4 bars; each must have an internal rhyme.', 'Check with the verse analyzer to see the scheme letters.'],
  [{ q: 'An internal rhyme is…', o: ['Rhyme at line ends only', 'A rhyme inside a line', 'A silent line', 'The title'], a: 1, why: 'Inside the bar, not only at the end.' },
   { q: 'Why build a rhyme list first?', o: ['It is required', 'Words are ready when you write or freestyle', 'It makes lines shorter', 'It is not helpful'], a: 1, why: 'Having options keeps you in flow.' }]);
L('rapper', 2, 'The pocket: on, ahead, behind', 'Choose where your words sit relative to the beat.',
  ['The pocket is where your delivery settles relative to the beat. On the beat is tight and punchy. Ahead pushes energy. Behind, a laid-back feel where syllables land slightly after the beat, sounds relaxed. Critics often describe a relaxed, behind-the-beat feel as a mark of some classic 1990s New York rappers; treat that as a listening tip, not a claim about any one song.',
   'A pickup is a word or two before beat 1 that leads into the bar. Placing the first stressed word on beat 1 or 3 often helps lines feel anchored.',
   'Swing delays the off-beat 16th notes slightly, making a groove bounce. The metronome has a swing setting so you can feel the difference.'],
  ['Say a line straight on the beat, then half a 16th behind, then ahead. Which feels best?', 'Add a one-word pickup before beat 1.', 'Turn swing on in the metronome and repeat.'],
  [{ q: 'A pickup is…', o: ['A word or two before beat 1', 'A kind of beat', 'The chorus', 'A silent bar'], a: 0, why: 'It leads into the bar.' },
   { q: 'Behind-the-beat delivery tends to feel…', o: ['Rushed', 'Relaxed', 'Silent', 'Out of key'], a: 1, why: 'Slightly late syllables give a laid-back feel.' }]);
L('rapper', 3, 'Imagery and storytelling', 'Show a scene instead of listing facts.',
  ['A story needs a setup (who and where), a problem or turn, and a landing. Even 8 bars can do this. Specific details make it real: the colour of a jacket, a sound at the window.',
   'Show, do not tell: not "I was nervous" but "my hands would not stay still". Use the five senses.',
   'Keep it original and age-appropriate. Write about your own life, imagination and community. Describing real hardship honestly does not require graphic or explicit content.'],
  ['Write 4 bars of setup, 4 bars of turn, 4 bars of landing.', 'Underline every concrete detail; add two more.', 'Read it aloud: does a listener see the scene?'],
  [{ q: 'A story in rap needs at least…', o: ['Setup, turn and landing', 'Only a hook', 'Only rhymes', 'Swear words'], a: 0, why: 'A simple arc keeps listeners with you.' },
   { q: '"Show, do not tell" means…', o: ['Use concrete details', 'Use more adjectives like "very"', 'Skip the story', 'Repeat the title'], a: 0, why: 'Details make the scene vivid.' }]);
L('rapper', 3, 'Wordplay and punchlines', 'Land a clever line with a twist at the end.',
  ['A punchline sets a expectation and then twists it. Put the twist word at the end of the bar so the rhyme lands on it.',
   'Double meanings, metaphors and similes all help. Try "Thing A is like thing B because…" and write the surprising "because".',
   'Keep it kind and clever. The best punchlines punch up or at yourself, not down at people.'],
  ['Pick a word with two meanings and write one line that uses both.', 'Write a simile with a surprising "because".', 'Put the twist in the final word and check it rhymes.'],
  [{ q: 'Where does a punchline usually go?', o: ['At the end of the bar', 'In the title', 'Before the beat starts', 'It cannot be placed'], a: 0, why: 'The end gets the rhyme and the last impression.' },
   { q: 'A double meaning is…', o: ['A word with two meanings used on purpose', 'Two beats', 'A repeat', 'A rest'], a: 0, why: 'A pun or layered meaning.' }]);
L('rapper', 3, 'Flow switches and rests', 'Vary your rhythm so the verse stays interesting.',
  ['Flow is the rhythmic pattern of your syllables. Changing it, for example from steady to double-time (twice as many syllables) or adding a pause, keeps the listener awake.',
   'Rests are part of the flow. A one-beat silence before a punchline gives it room. Do not fill every slot.',
   'Mark your verse: where does it speed up, slow down, rest? Aim for at least one change every 4 or 8 bars.'],
  ['Write one line with 6 syllables and one with 14, then say both in the same bar.', 'Add a pause before the last word of a bar.', 'Analyze with the flow grid and look at the density labels.'],
  [{ q: 'Double-time means…', o: ['Twice as many syllables in the same time', 'Half the beats', 'Doubling the song length', 'Two choruses'], a: 0, why: 'Same bar, twice as dense.' },
   { q: 'Rests help because…', o: ['They give lines room to land', 'They are required', 'They add syllables', 'They break rhymes'], a: 0, why: 'Silence frames the line.' }]);
L('rapper', 4, 'Writing a full 16-bar verse', 'Plan and write a complete verse.',
  ['Plan first: topic, three images, one rhyme family per four bars, and an ending line that lands the idea. Write in 4-bar blocks.',
   'Read each block aloud over a beat before moving on. Fix breath, clarity and stress as you go.',
   'Then do a clean-up pass: cut filler, strengthen verbs, check that every bar earns its place.'],
  ['Choose a topic and write the plan in 5 bullets.', 'Write bars 1-4, test, then 5-8, and so on.', 'Final pass: cut 10 percent.'],
  [{ q: 'A good first step is…', o: ['Plan topic and images', 'Record immediately', 'Copy another verse', 'Skip rhyme'], a: 0, why: 'Planning prevents rambling.' },
   { q: 'Writing in 4-bar blocks helps you…', o: ['Test as you go', 'Avoid rhyme', 'Write less', 'Skip breath'], a: 0, why: 'Short loops make it easy to fix.' }]);
L('rapper', 4, 'Freestyle skills', 'Keep going without stopping, using prepared tools.',
  ['Freestyle is mostly preparation: lists of rhyme families, images and themes ready in your head. Look ahead; pick your next rhyme word while saying the current line.',
   'If you blank, repeat a phrase, describe what you see, or use a filler that fits the beat. Keep the beat going; the audience forgives a pause more than a stop.',
   'Practise with the prompter: random words every 4 bars.'],
  ['Freestyle 2 bars on one prompt word.', 'Add a second word every 4 bars.', 'Record and listen back; note one thing to fix.'],
  [{ q: 'The best freestyle prep is…', o: ['Rhyme families and images ready', 'Memorising other rappers', 'Silence', 'Louder volume'], a: 0, why: 'Prepared tools make improvisation easier.' },
   { q: 'If you blank, you should…', o: ['Stop', 'Repeat or describe what you see, keep the beat', 'Leave', 'Shout'], a: 1, why: 'Keep the groove going.' }]);
L('rapper', 4, 'Recording, performing and staying original', 'Perform with confidence and respect other artists.',
  ['Mic basics: a fist away, slightly off-axis to soften pops, record short takes and listen back. Do not shout; it strains the voice. Drink water.',
   'Originality: learning from a technique (a rhyme pattern, a flow) is fine. Copying someone\'s lyrics, flow note-for-note, or voice and presenting it as yours is not. Sampling or covering needs permission. Cloning a real person\'s voice needs that person\'s consent.',
   'Keep it clean and kind for school and young audiences. Share work with a trusted adult or mentor for feedback.'],
  ['Record one verse, three takes, pick the best.', 'List three techniques you borrowed and how you made them your own.', 'Share with a trusted person and ask for one suggestion.'],
  [{ q: 'Is copying a rapper\'s lyrics and calling them yours okay?', o: ['Yes', 'No, learn techniques but write your own', 'Only if it rhymes', 'Only on weekdays'], a: 1, why: 'Copying lyrics is plagiarism and may infringe copyright.' },
   { q: 'Cloning a real person\'s voice requires…', o: ['Nothing', 'Their consent', 'A fast computer', 'A microphone'], a: 1, why: 'Consent is essential; some people (for example the deceased) cannot give it.' }]);

// ---------------- extra quiz bank ----------------
const QBANK = {
  singer: [
    { q: 'Which is a safe response to feeling pain while singing?', o: ['Push through', 'Stop and rest', 'Sing louder', 'Whisper hard'], a: 1, why: 'Pain is a stop signal.' },
    { q: 'How many semitones are in an octave?', o: ['7', '10', '12', '24'], a: 2, why: '12 semitones.' },
    { q: 'Lip trills are mainly used to…', o: ['Warm up gently with easy airflow', 'Sing high notes loudly', 'Clean the mic', 'Learn lyrics'], a: 0, why: 'They are gentle, low-effort warm-ups.' },
    { q: 'Hydration is best…', o: ['All day', 'Only just before singing', 'Never', 'Only coffee'], a: 0, why: 'Steady sips through the day.' },
    { q: 'Whispering hard is generally…', o: ['Good for the voice', 'Often harder on the voice than soft speech', 'A warm-up', 'Required'], a: 1, why: 'Strained whispering can irritate the voice.' }
  ],
  rapper: [
    { q: 'Which word best rhymes (perfect) with "flow"?', o: ['now', 'know', 'few', 'low-key'], a: 1, why: 'flow / know share the same vowel and ending.' },
    { q: 'How many beats in a 4/4 bar?', o: ['2', '3', '4', '8'], a: 2, why: 'Four.' },
    { q: 'A hook is usually…', o: ['A repeated catchy section', 'A beat', 'A rest', 'A mic'], a: 0, why: 'The memorable repeated part.' },
    { q: 'Scheme "AABB" means…', o: ['Lines 1-2 rhyme and lines 3-4 rhyme', 'All lines rhyme', 'No rhymes', 'Lines 1 and 3 rhyme'], a: 0, why: 'Couplets.' },
    { q: 'Clear delivery comes from…', o: ['Shaping consonants and slowing down first', 'Mumbling', 'Shouting', 'Skipping words'], a: 0, why: 'Clarity first, speed later.' }
  ]
};

// ---------------- knowledge base ----------------
// k: keyword string (stems matched loosely); a: answer; next: suggested follow-ups
const KB = {
  shared: [
    { id: 'greet', k: 'hello hi hey yo sup howdy', a: null, special: 'greet' },
    { id: 'thanks', k: 'thanks thank cheers appreciate', a: "You're welcome! Want to try a quick drill or a quiz?" },
    { id: 'who', k: 'who are you what are you ai bot robot real person neural', a: 'I am a rule-based practice coach. I match your words against a hand-written knowledge base and run small calculators. I have no internet connection and no AI model inside me, so I can be wrong or miss a question. Type "help" to see what I can do.' },
    { id: 'offline', k: 'offline internet api wifi online server cloud', a: 'Everything runs on your device. I do not call any API or send what you type anywhere. (If a tool needs your microphone, that is handled by your browser and stays local.)' },
    { id: 'sleep', k: 'sleep rest recover tired', a: 'Rest is training. Sleep well, take at least one rest day a week, and stop when your voice or body is tired.' },
    { id: 'goal', k: 'goal goals motivation motivated improve progress better', a: 'Pick one small goal for this week, practise a little every day, and record yourself once a week. Progress shows in the recordings. Try "practice plan 20".' },
    { id: 'age', k: 'age young kid teen teenager parent teacher adult', a: 'This tool is made for young artists. Ask a trusted adult, teacher or coach to practise with you, and always tell them if something hurts or worries you.' },
    { id: 'copyright', k: 'copyright plagiarism steal copy copying original sample cover permission', a: 'Learn from techniques, write your own words. Copying lyrics or a melody note-for-note and calling it yours is plagiarism and can break copyright. Samples and covers need permission. And never imitate or clone a real person\'s voice without their consent.' },
    { id: 'clean', k: 'clean explicit swear curse profanity inappropriate', a: 'I keep my own examples clean and kid-friendly. You can write about real life honestly without graphic or explicit content; strong writing is specific, not shocking.' }
  ],
  singer: [
    { id: 's-breath', k: 'breath breathe breathing diaphragm support air belly inhale exhale', a: 'Breathe in quietly and low: belly and lower ribs widen a little, shoulders stay down. Let the air out slowly and steadily. Test with a quiet "sss": aim for an even 10 to 15 seconds. Try the breath timer.', next: ['lesson 1', 'breath timer'] },
    { id: 's-warm', k: 'warm warmup warm-up exercises routine before', a: 'A short warm-up: easy breath, gentle sighs, lip trills, a straw hum or "ng" slides, then five-note scales on "no". Say "warm up 8" for an 8-minute routine.', next: ['warm up 8'] },
    { id: 's-range', k: 'range high low notes octave extend higher belt', a: 'Range grows slowly when you stay in the comfortable middle and visit the edges briefly and quietly. Do not push or shout to reach higher; that can hurt your voice. A voice teacher can guide safe range-building.', next: ['lesson 2'] },
    { id: 's-crack', k: 'crack cracking break breaking flip voice change puberty squeak', a: 'Cracks and flips are common, especially during puberty. Sing lightly, stay in comfortable notes, do not force, and keep practising. If your voice is hoarse or painful, rest and talk to a doctor or teacher.', next: ['safety'] },
    { id: 's-pitch', k: 'pitch tune tuning flat sharp off-key offkey intonation cents', a: 'Hear the note in your head first, hum it, then open to a vowel. Flat means a little under the note; sharp is over. Within about 20 cents sounds in tune. Use the tuner tool with a mic, or sing against a piano or drone.', next: ['lesson 3', 'interval'] },
    { id: 's-vowel', k: 'vowel vowels formant formants f1 f2 resonance ee ah oo mouth', a: 'Vowels carry the sound. Practise ee, eh, ah, oh, oo on one pitch with a loose jaw. Formants (F1, F2) are resonances that make vowels sound different; the formant tool estimates them but is accurate mostly on low-to-mid pitches.', next: ['lesson 4'] },
    { id: 's-cons', k: 'consonant consonants diction articulate articulation words clear plosive fricative nasal', a: 'Lead unvoiced consonants (p t k s sh) slightly before the beat so the vowel lands on time; keep nasals (m n ng) for holding; end hard consonants short. Try "consonant beautiful".', next: ['lesson 5', 'consonant love'] },
    { id: 's-run', k: 'runs run riff riffs melisma ornament gospel agility fast', a: 'A run is a quick stepwise group of notes that leads to a held note. Start with 4 pentatonic notes, one per beat, on one vowel. Slow first, speed later, and stay inside your comfortable range. Say "run" for a new one to practise.', next: ['run', 'lesson 8'] },
    { id: 's-gospel', k: 'gospel mahalia jackson church soul spiritual style queen', a: 'Mahalia Jackson is a famous gospel pioneer, often called the Queen of Gospel, known for a powerful contralto and church-rooted phrasing (repetition, build, call and response). She is a listening reference for craft ideas. I do not imitate or clone her voice; build your own sound.', next: ['lesson 8'] },
    { id: 's-vibrato', k: 'vibrato wobble shake tremolo straight tone', a: 'Vibrato appears on its own when you are relaxed and supported. Do not shake your jaw or squeeze your throat to make it. Practise straight tone, then relax and let it develop.', next: ['lesson 9'] },
    { id: 's-mic', k: 'mic microphone record recording headphones pop distance', a: 'Keep the mic a fist away, slightly off to the side to soften "p" and "b". Record short takes, listen with headphones at low volume, and compare weekly.', next: ['lesson 10'] },
    { id: 's-nerves', k: 'nervous nerves anxiety stage fright scared performance perform audition', a: 'Nerves are normal. Breathe in 4, out 6 for a minute, know your first line and first note, and run the opening many times. Focus on the meaning of the first line instead of on being perfect.', next: ['lesson 11'] },
    { id: 's-hoarse', k: 'hoarse hoarseness lost losing sore scratchy throat pain hurts hurt cough', a: 'Stop singing and rest your voice. Sip water; avoid throat clearing and whispering. If you have pain, trouble swallowing or breathing, or hoarseness for more than about two weeks, see a doctor (an ENT or voice specialist). I am not a medical tool.', next: ['safety'], safety: true },
    { id: 's-water', k: 'water hydration drink tea honey coffee dairy', a: 'Sip water through the day, not only just before singing. Limit caffeine. Warm drinks can feel nice; there is no magic drink that fixes strain, rest does.', next: ['safety'] },
    { id: 's-practice', k: 'practice practise schedule daily often long how-often', a: 'Short, regular sessions: 15 to 30 focused minutes most days, with one rest day. Say "practice plan 20" for a plan.', next: ['practice plan 20'] },
    { id: 's-posture', k: 'posture stand standing sit sitting shoulders neck jaw tension relax', a: 'Feet hip-width, knees soft, shoulders loose, chin level, jaw relaxed. Check for tension in the neck and jaw before each song.', next: ['lesson 1'] },
    { id: 's-phrase', k: 'phrase phrasing dynamics expression emotion emotional feeling', a: 'Speak the lyric with meaning first, then sing it. Find the key word of each phrase, start softer, and grow into it. Mark breaths on your lyric sheet.', next: ['lesson 7'] },
    { id: 's-scales', k: 'scale scales interval intervals pentatonic blues major minor solfege ear', a: 'Start with the major pentatonic (1 2 3 5 6). Perfect fifth = 7 semitones; octave = 12. Ear trainer: three intervals a day.', next: ['lesson 6', 'interval'] },
    { id: 's-belt', k: 'belt chest head mix falsetto register passaggio', a: 'Registers (chest, head, mix, falsetto) are ways the voice vibrates across your range. Learning to blend them takes time with a good teacher. Do not force chest voice upward; if it strains, lighten it.', next: ['safety'] },
    { id: 's-song', k: 'song songs choose choosing pick repertoire', a: 'Pick songs that fit the comfortable middle of your range, not the highest note you can barely reach. Learn the melody slowly first, then add words, then add emotion.', next: ['lesson 7'] },
    { id: 's-clone', k: 'clone cloning imitate imitation copy voice sound-like deepfake', a: 'I do not clone or imitate real people\'s voices. A voice belongs to its owner, and many singers cannot consent. Learn craft ideas from singers you love, then build your own sound.', special: 'boundary' }
  ],
  rapper: [
    { id: 'r-flow', k: 'flow flows cadence pattern rhythm', a: 'Flow is the rhythm pattern of your syllables against the beat. Paste your bars and I will place the syllables on a 16-slot grid so you can see where stress lands. Vary the flow every 4 or 8 bars.', next: ['lesson 2', 'analyze'] },
    { id: 'r-bar', k: 'bar bars count counting measure 16 sixteen verse hook', a: 'A bar is four beats. A verse is often 16 bars; a hook 4 or 8. Count 1 2 3 4 out loud over a beat until you can feel the restart. Try "bar timer 90".', next: ['lesson 1', 'bar timer 90'] },
    { id: 'r-rhyme', k: 'rhyme rhymes rhyming perfect slant near multisyllabic multi', a: 'Perfect rhyme: same vowel and ending (flow / know). Slant: similar (time / mind). Multisyllabic: several syllables match, mostly the vowels ("the kind of" / "I find a"). Type "rhyme <word>" and I will list options.', next: ['lesson 4', 'rhyme time'] },
    { id: 'r-internal', k: 'internal inside chain chaining rhyme-scheme scheme aabb abab', a: 'Internal rhyme sits inside a line. Chain it across bars for a woven sound. Scheme letters show which lines rhyme: AABB = couplets, ABAB = alternating. Paste a verse and I will label it.', next: ['lesson 5'] },
    { id: 'r-pocket', k: 'pocket behind ahead beat laid-back offbeat swing groove', a: 'The pocket is where your words sit against the beat: on the beat is punchy, ahead pushes, behind relaxes. Add a pickup word before beat 1. The metronome has a swing control to feel it.', next: ['lesson 6', 'metronome'] },
    { id: 'r-story', k: 'story storytelling narrative scene imagery detail visual', a: 'Setup, turn, landing, with concrete details (colours, sounds). Show instead of tell. Write about your own life and imagination; honest does not have to mean graphic.', next: ['lesson 7'] },
    { id: 'r-punch', k: 'punchline punchlines wordplay pun metaphor simile double-meaning clever', a: 'Set an expectation, then twist it at the end of the bar so the rhyme lands on the twist word. Try a simile with a surprising "because".', next: ['lesson 8'] },
    { id: 'r-breath', k: 'breath breathe breathing stamina air lungs run-out', a: 'Plan quick low breaths at the end of a bar or line and mark them on your page. Slow it down first for clarity; speed comes later. Try the breath timer "rap" pattern.', next: ['lesson 3', 'breath timer'] },
    { id: 'r-free', k: 'freestyle freestyling improvise improv cypher battle blank', a: 'Freestyle is mostly preparation: rhyme families, images and themes ready. Look ahead to your next rhyme word, keep the beat going if you blank, and describe what you see. Try "freestyle prompt".', next: ['lesson 11', 'freestyle prompt'] },
    { id: 'r-write', k: 'write writing lyrics verse bars writer block stuck ideas topic', a: 'Plan topic and three images, pick a rhyme family per four bars, write in 4-bar blocks, and read each aloud over a beat. If you are stuck: describe a place, list objects, then find rhymes.', next: ['lesson 10'] },
    { id: 'r-fast', k: 'fast speed double-time doubletime tongue twister quick rapid', a: 'Clear first, then fast. Practise tongue twisters at half speed, then normal. Double-time means twice the syllables in the same bar; a 16-slot bar fits at most about 16 syllables.', next: ['lesson 9'] },
    { id: 'r-mic', k: 'mic microphone record recording studio headphones pop booth', a: 'Stand a fist away, slightly off-axis to soften pops, record short takes, and do not shout. Listen back and note one fix per take.', next: ['lesson 12'] },
    { id: 'r-biggie', k: 'biggie notorious christopher wallace big brooklyn', a: 'BiggieFlow is an independent study tool inspired by the storytelling, internal-rhyme and relaxed-pocket craft that critics often discuss in 1990s New York rap. It is not affiliated with the Notorious B.I.G. or his estate, I do not speak as him, and I do not reproduce his lyrics. His catalogue is explicit. Listen to his work yourself (age-appropriate guidance advised), and write your own words.', next: ['lesson 6'], special: 'boundary' },
    { id: 'r-style', k: 'style voice sound unique original find-your-style own identity', a: 'Your style is your voice, vocabulary and perspective. Borrow techniques (a rhyme pattern, a pocket), never lines, and put your own life and humour into it.', next: ['lesson 12'] },
    { id: 'r-beat', k: 'beat bpm tempo metronome instrumental loop', a: 'Many boom-bap style beats sit around 80 to 95 bpm; faster styles run 130 to 150 (often felt in half time). Use the metronome tool to practise, and the bar timer to see how long a bar lasts.', next: ['metronome', 'bar timer 90'] },
    { id: 'r-hook', k: 'hook chorus catchy melody repeat refrain', a: 'A hook is the repeated, memorable part. Keep it short, repeat a key phrase, and make it easy to sing along. Write the hook first if you are stuck.', next: ['lesson 10'] },
    { id: 'r-clone', k: 'clone cloning imitate imitation voice deepfake sound-like', a: 'I do not clone or imitate real people\'s voices. A voice belongs to its owner, and some artists cannot consent. Learn techniques from artists you admire and build your own sound.', special: 'boundary' },
    { id: 'r-lyrics', k: 'lyrics write-lyrics-for give-me-lyrics full-song quote', a: 'I do not reproduce or quote copyrighted lyrics. I can explain a technique, analyze your own bars, or give you prompts and rhyme lists so you write your own.', special: 'boundary' }
  ]
};

const HELP = {
  singer: ['lesson <1-12> : a lesson', 'next / back : move between lessons', 'quiz me : multiple-choice quiz (answer with a letter)', 'warm up <minutes> : a warm-up routine', 'practice plan <minutes> : a daily plan', 'run [pentatonic|blues] [easy|medium|hard] : a run to practise', 'consonant <word> : consonants and singing tips', 'note <C4> : frequency; interval : a theory question', 'breath timer : breathing patterns', 'progress : your stats', 'safety : voice-health guidance', 'about : what I am and am not'],
  rapper: ['lesson <1-12> : a lesson', 'next / back : move between lessons', 'quiz me : multiple-choice quiz (answer with a letter)', 'rhyme <word> : perfect, slant and multi rhymes', 'rhyme time : rhyme-family challenge', 'analyze + paste your 4 or 8 bars : flow grid and tips', 'syllables <phrase> : count and stress', 'bar timer <bpm> : how long a bar lasts', 'freestyle prompt : words to rap about', 'practice plan <minutes> : a daily plan', 'breath timer : breathing patterns', 'progress : your stats', 'safety : voice and health', 'about : what I am and am not']
};
