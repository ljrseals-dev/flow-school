#!/usr/bin/env node
// Terminal client: node cli/chat.js [singer|rapper]   (offline, no network, no dependencies)
const fs = require('fs'), path = require('path'), os = require('os'), readline = require('readline');
const dir = path.join(__dirname, '..', 'src', 'js');
const src = ['core.js', 'music.js', 'content.js', 'bot.js'].map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
const FS = new Function(src + '\n;return FS;')();
const bot = (process.argv[2] || '').toLowerCase().startsWith('s') ? 'singer' : 'rapper';
const file = path.join(os.homedir(), '.flowschool.json');
let data = {}; try { data = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { }
const store = { get: k => data[k] || null, set: (k, v) => { data[k] = v; try { fs.writeFileSync(file, JSON.stringify(data)); } catch (e) { } } };
const b = FS.createBot(bot, store);
const show = r => { console.log('\n' + FS.BOTS[bot].name + ': ' + r.text + (r.extra ? '\n\n' + r.extra : '') + '\n'); };
show(b.greet());
const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: 'you> ' });
let buf = null;
rl.prompt();
rl.on('line', line => {
  if (buf !== null) { if (line.trim() === '') { const t = buf.join('\n'); buf = null; show(b.reply(t)); } else buf.push(line); rl.prompt(); return; }
  if (/^(exit|quit|bye)$/i.test(line.trim())) { rl.close(); return; }
  if (/^paste\b/i.test(line.trim())) { buf = []; console.log('Paste lines, then a blank line to finish.'); buf.push(line.replace(/^paste\s*/i, '').trim() ? line.replace(/^paste\s*/i, '') : 'analyze'); if (buf[0] === 'analyze') buf = ['analyze']; rl.prompt(); return; }
  show(b.reply(line)); rl.prompt();
});
rl.on('close', () => { console.log('Keep practising. Rest your voice!'); process.exit(0); });
