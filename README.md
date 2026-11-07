# FlowSchool: SingerFlow and BiggieFlow

Two offline training chat bots for young artists. **Rule-based: no API, no neural model, no network.**

| | SingerFlow | BiggieFlow |
|---|---|---|
| Lessons | 12 (4 levels): breath, range, pitch, vowels, consonants, intervals, phrasing, runs, vibrato, mic, nerves, routine | 12 (4 levels): bars, stress, breath, rhyme types, internal rhyme, pocket, storytelling, punchlines, flow switches, verse writing, freestyle, recording and originality |
| Tools | pitch and vowel tuner (mic), interval ear trainer, run builder with playback, consonant coach, warm-up builder | metronome with swing and tap tempo, rhyme lab, flow grid, freestyle prompter, bar timer |
| Shared | chat, lessons with checkpoints, quizzes, practice plans, breath timer, progress (XP, streak, badges), safety guidance | same |

## Run it
- Web: open `index.html` (or `dist/flowschool.html` as a page body).
- Terminal: `node cli/chat.js singer` or `node cli/chat.js rapper` (progress saved to `~/.flowschool.json`).
- Rebuild: `python3 build.py`. Tests: `node tests/rhyme.test.js && node tests/bot.test.js`.

## How it works
`src/js/core.js` spelling-based G2P, stress, rhyme and 16-slot flow grid. `music.js` notes, intervals, runs, warm-ups, consonant coach, timing, plans. `content.js` lessons, quizzes, knowledge base. `bot.js` word bank, keyword matcher with command routing and quiz/rhyme-game state machines, progress store. The formant DSP in the tuner is reused from Blowtorch.

## Honest limits
- Rhyme, stress and flow analysis are **estimates from spelling**, not audio. 48 of 48 test rhyme pairs pass, but names, slang and odd words can be wrong.
- The word bank is a few hundred clean words. The matcher is keyword-based and will miss unusual questions.
- Formant readings are only roughly reliable below about 260 Hz; the mic works only where the browser allows it (not in the artifact viewer).
- General vocal-health guidance only; not medical advice.

## Ethics
- BiggieFlow is an independent study tool, unaffiliated with the Notorious B.I.G. or his estate. It does not speak as him or reproduce his lyrics. His catalogue is explicit; this tool keeps its own content clean.
- Mahalia Jackson is mentioned as a listening reference for craft ideas only.
- No voice cloning. The bots refuse requests to clone or imitate real voices or to reproduce lyrics, decline explicit requests, and route distress or medical-emergency messages to a trusted adult and emergency help.
