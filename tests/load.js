const fs = require('fs'), path = require('path');
const ORDER = ['core.js', 'music.js', 'content.js', 'bot.js'];
module.exports = function load() {
  const dir = path.join(__dirname, '..', 'src', 'js');
  const src = ORDER.filter(f => fs.existsSync(path.join(dir, f))).map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n');
  return new Function(src + '\n;var __core={g2p,syllabify,syllables,rhymeRelation,multiMatch,analyzeBar,analyzeVerse,gridString,seedRng,stressedTail};try{return FS}catch(e){return __core}')();
};
