// ===== core.js : PRNG, text helpers, spelling-based G2P, stress, rhyme, flow grid =====
// Everything here is a HEURISTIC based on spelling. No dictionary of pronunciations, no neural model, no network.
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
let _rng = mulberry32((Date.now() & 0xffffffff) >>> 0);
function seedRng(s) { _rng = mulberry32(s >>> 0); }
const rnd = () => _rng();
const pick = a => a[Math.floor(rnd() * a.length)];
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));

const VOW = new Set(['iy', 'ih', 'ey', 'eh', 'ae', 'aa', 'ao', 'ow', 'uh', 'uw', 'ah', 'ay', 'aw', 'oy', 'er']);
const isV = t => VOW.has(t);

// Exceptions: irregular words whose spelling misleads the rules.
const EXC = {};
const TAILX = {};
(function (raw) { raw.split('\n').forEach(l => { const m = l.split(':'); if (m.length !== 2) return; const ws = m[0].trim().split(/\s+/), ph = m[1].trim().split(' '); if (ws.length === 1) EXC[ws[0]] = m[1].trim(); else { let k = 0; while (k < ph.length && !VOW.has(ph[k])) k++; ws.forEach(w => TAILX[w] = ph.slice(k)); } }); })(`
the:dh ah
a:ah
i:ay
my by shy sly fly sky try cry why dry fry pry spy:ay
a:ah
of:ah v
one:w ah n
won:w ah n
once:w ah n s
two to too:t uw
do:d uw
who:h uw
whom:h uw m
you:y uw
your:y ao r
you're:y ao r
are:aa r
were:w er
was:w ah z
is:ih z
his:h ih z
this:dh ih s
has:h ae z
as:ae z
says say:s ey
said:s eh d
says:s eh z
have:h ae v
give:g ih v
live:l ih v
love:l ah v
above:ah b ah v
glove:g l ah v
dove shove:ah v
come:k ah m
some:s ah m
done:d ah n
none:n ah n
gone:g ao n
none:n ah n
son sun:s ah n
ton:t ah n
money:m ah n iy
honey:h ah n iy
monkey:m ah ng k iy
mother:m ah dh er
brother:b r ah dh er
other:ah dh er
another:ah n ah dh er
nothing:n ah th ih ng
something:s ah m th ih ng
touch:t ah ch
tough rough:r ah f
laugh:l ae f
cough:k ao f
though although:dh ow
thought brought bought fought sought:th ao t
through threw:th r uw
thorough:th er ow
dough:d ow
bough:b aw
night light might right fight sight tight bright flight height slight white write:ay t
heart:h aa r t
hearts:h aa r t s
hear here:h ih r
heard:h er d
earth:er th
learn:l er n
world:w er l d
word:w er d
work:w er k
worth:w er th
worse:w er s
love:l ah v
move prove:m uw v
lose:l uw z
choose:ch uw z
shoes:sh uw z
whose:h uw z
blood:b l ah d
flood:f l ah d
good hood wood stood:g uh d
book look took cook hook shook brook:b uh k
foot:f uh t
put:p uh t
full pull bull:p uh l
push:p uh sh
wolf:w uh l f
door floor:d ao r
poor:p uh r
four:f ao r
more:m ao r
roar:r ao r
war:w ao r
water:w ao t er
father:f aa dh er
want:w aa n t
watch:w aa ch
what:w ah t
was:w ah z
want:w aa n t
break steak:b r ey k
great:g r ey t
head dead bread read lead:h eh d
heaven:h eh v ah n
ready steady:r eh d iy
weather feather leather:w eh dh er
breath death:eh th
threat:th r eh t
sweat:s w eh t
beautiful:b y uw t ah f ah l
beauty:b y uw t iy
people:p iy p ah l
eye:ay
eyes:ay z
height:h ay t
buy guy:b ay
die lie pie tie:t ay
friend:f r eh n d
believe:b ih l iy v
receive:r ih s iy v
idea:ay d iy ah
real:r iy l
really:r iy l iy
create:k r iy ey t
area:eh r iy ah
many any:m eh n iy
very:v eh r iy
every:eh v r iy
family:f ae m l iy
city:s ih t iy
pretty:p r ih t iy
already:ao l r eh d iy
always:ao l w ey z
all:ao l
call fall wall tall small ball hall:ao l
walk talk chalk:w ao k
half calf:h ae f
calm palm:k aa m
salmon:s ae m ah n
know:n ow
knows:n ow z
no go so show slow flow glow grow throw blow low row toe foe woe:ow
now how cow wow brow vow:aw
down town brown crown clown gown drown frown:aw n
owl howl growl fowl:aw l
allow:ah l aw
crowd:k r aw d
crowds:k r aw d z
own known shown grown flown blown thrown:ow n
bow:b ow
gold cold hold told bold sold fold mold old scold:ow l d
most post host ghost:ow s t
both:b ow th
soul:s ow l
shoulder:sh ow l d er
mind find kind blind grind:ay n d
behind:b ih h ay n d
remind:r ih m ay n d
guard:g aa r d
guide:g ay d
guess:g eh s
guitar:g ih t aa r
together:t ah g eh dh er
forget:f er g eh t
forgive:f er g ih v
begin:b ih g ih n
target:t aa r g ih t
gift:g ih f t
girl:g er l
get:g eh t
sign:s ay n
signs:s ay n z
design:d ih z ay n
child mild wild:ay l d
climb:k l ay m
high:h ay
sigh thigh:ay
eight:ey t
weight:w ey t
straight:s t r ey t
they:dh ey
grey:g r ey
obey:ow b ey
key:k iy
people:p iy p ah l
queen:k w iy n
sure:sh uh r
pure cure:k y uh r
fire:f ay er
desire:d ih z ay er
tired:t ay er d
hire wire:ay er
flower power tower shower:aw er
hour our:aw er
there their:dh eh r
where:w eh r
care share:eh r
bear wear swear pear tear:eh r
fear near clear year dear:ih r
tear:t ih r
ear:ih r
beer:b ih r
deer:d ih r
here:h ih r
very:v eh r iy
mirror:m ih r er
ocean:ow sh ah n
nation:n ey sh ah n
passion:p ae sh ah n
ocean:ow sh ah n
vision:v ih zh ah n
choir:k w ay er
quiet:k w ay ah t
science:s ay ah n s
gym:jh ih m
rhythm:r ih dh ah m
rhyme:r ay m
rhymes:r ay m z
chorus:k ao r ah s
echo:eh k ow
melody:m eh l ah d iy
harmony:h aa r m ah n iy
music:m y uw z ih k
singer:s ih ng er
singing:s ih ng ih ng
finger:f ih ng g er
anger:ae ng g er
hunger:h ah ng g er
longer:l ao ng g er
stronger:s t r ao ng g er
younger:y ah ng g er
young:y ah ng
country:k ah n t r iy
couple:k ah p ah l
double:d ah b ah l
trouble:t r ah b ah l
cousin:k ah z ah n
enough:ih n ah f
bye:b ay
okay:ow k ey
yeah:y eh
yes:y eh s
oh:ow
ooh:uw
uh:ah
hey:h ey
yo:y ow
mic:m ay k
mike:m ay k
beat:b iy t
bar:b aa r
bars:b aa r z
flow:f l ow
freestyle:f r iy s t ay l
hip:h ih p
hop:h aa p
rap:r ae p
rapper:r ae p er
`);

const ONSET_V = 'aeiou';
const isVowelCh = c => ONSET_V.indexOf(c) >= 0;

function g2pRaw(w) {
  // w: lowercase letters only, no exception hit. Returns tokens.
  const n = w.length, out = [];
  const magic = /^(.*?)([aeiou])([^aeiou]|qu)e$/.test(w) ? w.length - 2 : -1; // index of silent-e vowel's consonant pos
  let i = 0;
  const at = k => w[k] || '';
  const rest = k => w.slice(k);
  const nextIsFinalE = k => (k + 2 === n - 1 && w[n - 1] === 'e' && !isVowelCh(w[k + 1])); // V C e#
  while (i < n) {
    const c = w[i], r = rest(i), prev = w[i - 1] || '';
    let m;
    // --- consonants ---
    if (i === 0 && (m = /^(kn|gn|pn)/.exec(r))) { out.push('n'); i += 2; continue; }
    if (i === 0 && r.startsWith('wr')) { out.push('r'); i += 2; continue; }
    if (i === 0 && r.startsWith('wh')) { out.push('w'); i += 2; continue; }
    if (r.startsWith('tch')) { out.push('ch'); i += 3; continue; }
    if (r.startsWith('dge')) { out.push('jh'); i += 3; continue; }
    if (r.startsWith('dg')) { out.push('jh'); i += 2; continue; }
    if (r.startsWith('ch')) { out.push('ch'); i += 2; continue; }
    if (r.startsWith('sh')) { out.push('sh'); i += 2; continue; }
    if (r.startsWith('th')) { out.push('th'); i += 2; continue; }
    if (r.startsWith('ph')) { out.push('f'); i += 2; continue; }
    if (r.startsWith('ck')) { out.push('k'); i += 2; continue; }
    if (r.startsWith('ng')) { out.push('ng'); i += 2; continue; }
    if (r.startsWith('nk')) { out.push('ng'); out.push('k'); i += 2; continue; }
    if (r.startsWith('qu')) { out.push('k'); out.push('w'); i += 2; continue; }
    if (r.startsWith('mb') && i + 2 === n) { out.push('m'); i += 2; continue; }
    if (/^tion$|^tions$/.test(r)) { out.push('sh', 'ah', 'n'); i += 4; continue; }
    if (/^sion/.test(r) && i > 0) { out.push('zh', 'ah', 'n'); i += 4; continue; }
    if (/^ture/.test(r) && i > 0) { out.push('ch', 'er'); i += 4; continue; }
    if (r.startsWith('gh')) { if (i === 0) { out.push('g'); } i += 2; continue; }
    if (c === 'x') { out.push('k', 's'); i++; continue; }
    if (c === 'c') { out.push(/^c[eiy]/.test(r) ? 's' : 'k'); i += (at(i + 1) === 'c' && !/^cc[eiy]/.test(r)) ? 2 : 1; continue; }
    if (c === 'g') { out.push(/^g[eiy]/.test(r) && i > 0 || /^g[ei]/.test(r) && i === 0 && false ? 'jh' : 'g'); i += at(i + 1) === 'g' ? 2 : 1; continue; }
    if (c === 'j') { out.push('jh'); i++; continue; }
    if (c === 'q') { out.push('k'); i++; continue; }
    if (c === 'y' && (i === 0 || isVowelCh(prev) && false)) { out.push('y'); i++; continue; }
    if (c === 'w' && !isVowelCh(prev) || c === 'w' && i === 0) { out.push('w'); i++; continue; }
    if ('bdfhklmnprstvz'.includes(c)) {
      if (c === 'h' && i > 0 && 'ctsgp'.includes(prev)) { i++; continue; }
      if (c === 's' && at(i + 1) === 'h') { out.push('sh'); i += 2; continue; }
      out.push(c === 's' && isVowelCh(prev) && at(i + 1) === '' ? 'z' : c); i += (at(i + 1) === c && c !== 's' || (c === 's' && at(i + 1) === 's')) ? 2 : 1; continue;
    }
    // --- vowels & y/w as vowels ---
    // final silent e
    if (c === 'e' && i === n - 1 && i > 0) {
      if (/[^aeiou]l$/.test(w.slice(0, i + 0)) && /[^aeiou]le$/.test(w) && !(magic >= 0 && 0)) { /* handled by -le below */ }
      i++; continue;
    }
    if (r === 'le' && i > 1 && !isVowelCh(prev)) { out.push('ah', 'l'); i += 2; continue; }
    if (r === 'les' && i > 1 && !isVowelCh(prev)) { out.push('ah', 'l', 'z'); i += 3; continue; }
    // vowel digraphs / trigraphs
    const dg = (re, toks) => { const mm = re.exec(r); if (mm) { toks.forEach(t => out.push(t)); i += mm[0].length; return true; } return false; };
    if (dg(/^ign/, ['ay', 'n'])) continue;
    if (dg(/^igh/, ['ay'])) continue;
    if (dg(/^eigh/, ['ey'])) continue;
    if (dg(/^ough/, ['ao']) ) continue;
    if (dg(/^ear(?=[^aeiou]|$)/, i === 0 ? ['er'] : ['ih', 'r'])) continue;
    if (dg(/^oar/, ['ao', 'r'])) continue;
    if (dg(/^oor/, ['ao', 'r'])) continue;
    if (dg(/^our/, ['aw', 'er'])) continue;
    if (dg(/^ai/, ['ey'])) continue;
    if (dg(/^ay/, ['ey'])) continue;
    if (dg(/^ey$/, ['iy'])) continue;
    if (dg(/^ey/, ['ey'])) continue;
    if (dg(/^ee/, ['iy'])) continue;
    if (dg(/^ea/, ['iy'])) continue;
    if (dg(/^oa/, ['ow'])) continue;
    if (dg(/^oo/, ['uw'])) continue;
    if (dg(/^oi|^oy/, ['oy'])) continue;
    if (dg(/^ou/, ['aw'])) continue;
    if (dg(/^ow$|^ow(?=n$)/, ['ow'])) continue;
    if (dg(/^ow/, ['ow'])) continue;
    if (dg(/^au|^aw/, ['ao'])) continue;
    if (dg(/^ew/, ['uw'])) continue;
    if (dg(/^eu/, ['uw'])) continue;
    if (dg(/^ie$/, ['ay'])) continue;
    if (dg(/^ie/, ['iy'])) continue;
    if (dg(/^ui/, ['uw'])) continue;
    if (dg(/^ue$/, ['uw'])) continue;
    if (dg(/^ei/, ['iy'])) continue;
    // r-colored
    if (dg(/^ar(?![aeiou])/, ['aa', 'r'])) continue;
    if (dg(/^or(?![aeiou])/, ['ao', 'r'])) continue;
    if (dg(/^[eiu]r(?![aeiou])/, ['er'])) continue;
    if (dg(/^are/, ['eh', 'r'])) continue;
    if (dg(/^ore/, ['ao', 'r'])) continue;
    if (dg(/^ire/, ['ay', 'er'])) continue;
    if (dg(/^ure/, ['uh', 'r'])) continue;
    if (dg(/^ere/, ['ih', 'r'])) continue;
    if (dg(/^all/, ['ao', 'l'])) continue;
    if (dg(/^alk/, ['ao', 'k'])) continue;
    if (dg(/^ild/, ['ay', 'l', 'd'])) continue;
    if (dg(/^ind(?=$)/, ['ay', 'n', 'd'])) continue;
    if (dg(/^old$/, ['ow', 'l', 'd'])) continue;
    if (dg(/^ost$/, ['ow', 's', 't'])) continue;
    // single vowels: magic e (V C e at end) -> long
    const longV = nextIsFinalE(i);
    if (c === 'a') { out.push(longV ? 'ey' : 'ae'); i++; continue; }
    if (c === 'e') { out.push(longV ? 'iy' : (i === n - 2 && at(i + 1) === 's' || i === n - 2 && at(i + 1) === 'd') && i > 1 ? 'ih' : 'eh'); i++; continue; }
    if (c === 'i') { out.push(longV ? 'ay' : 'ih'); i++; continue; }
    if (c === 'o') { out.push(longV || i === n - 1 ? 'ow' : (/^o[bdgmnpst]?[aeiou]/.test(r) && !isVowelCh(at(i + 1)) && /^o[^aeiou][aeiouy]/.test(r) && i + 2 < n && !/^o[^aeiou]{2}/.test(r)) ? 'ow' : 'aa'); i++; continue; }
    if (c === 'u') { out.push(longV ? 'uw' : 'ah'); i++; continue; }
    if (c === 'y') { out.push(i === n - 1 ? (out.filter(isV).length === 0 ? 'ay' : 'iy') : 'ih'); i++; continue; }
    if (c === 'w') { out.push('w'); i++; continue; }
    i++;
  }
  return out;
}

function g2p(word) {
  let w = String(word).toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return [];
  if (EXC[w]) return EXC[w].split(' ');
  if (TAILX[w]) { const mo = w.match(/^y?[^aeiouy]*/)[0]; return (mo ? g2pRaw(mo) : []).concat(TAILX[w]); }
  let m;
  // suffix handling on a recursively converted base
  if (w.length > 4 && (m = /^(.+)ing$/.exec(w))) {
    let b = m[1];
    if (/([^aeiou])\1$/.test(b) && !/(ll|ss|ff|zz)$/.test(b)) b = b.slice(0, -1);
    else if (/[^aeiou][aeiou][^aeiouwxy]$/.test(b) && countV(g2p(b)) === 1) b += 'e';
    return g2p(b).concat(['ih', 'ng']);
  }
  if (w.length > 3 && (m = /^(.+?)(ied|ies)$/.exec(w))) { const t = g2p(m[1] + 'y'); return m[2] === 'ied' ? t.concat(['d']) : t.concat(['z']); }
  if (w.length > 3 && (m = /^(.+)ed$/.exec(w)) && !/^(bed|red|fed|wed|shed|sled|need|feed|seed|speed|bleed|breed|weed|deed|greed|creed|indeed|hundred|sacred|naked)$/.test(w)) {
    let b = m[1];
    if (/([^aeiou])\1$/.test(b) && !/(ll|ss|ff|zz)$/.test(b)) b = b.slice(0, -1);
    else if (/[^aeiou][aeiou][^aeiouwxy]$/.test(b) && countV(g2p(b)) === 1 && !/[td]$/.test(b)) b += 'e';
    else if (/[^aeiou][aeiou][^aeiouwxy]$/.test(b) && /[td]$/.test(b) && countV(g2p(b)) === 1) b += 'e';
    const t = g2p(b), last = t[t.length - 1];
    if (last === 't' || last === 'd') return t.concat(['ih', 'd']);
    return t.concat([['p', 'k', 'f', 's', 'sh', 'ch', 'th'].includes(last) ? 't' : 'd']);
  }
  if (w.length > 2 && /[^suiao]s$|[aeiou]s$/.test(w) && !/(ss|us|is|as|ous)$/.test(w) && (m = /^(.+?)(es|s)$/.exec(w))) {
    let b = m[2] === 'es' && /(s|x|z|ch|sh|c|g)es$/.test(w) ? w.slice(0, -2) : (m[2] === 'es' ? w.slice(0, -1) : w.slice(0, -1));
    if (b.length >= 2) {
      const t = g2p(b), last = t[t.length - 1];
      if (['s', 'z', 'sh', 'ch', 'jh', 'zh'].includes(last)) return t.concat(['ih', 'z']);
      return t.concat([['p', 't', 'k', 'f', 'th'].includes(last) ? 's' : 'z']);
    }
  }
  const t = g2pRaw(w);
  return t.length ? t : ['ah'];
}
const countV = t => t.filter(isV).length;
function syllables(word) { return Math.max(1, countV(g2p(word))); }

// ---- stress ----
const FUNCTION_WORDS = new Set('a an the and but or nor so yet for of to in on at by with from up as is am are was were be been being it its i me my we us our you your he him his she her they them their this that these those do does did have has had will would can could shall should may might must not no if then than there here when what who which how all just very too'.split(' '));
const STRESS_FINAL_PREFIX = /^(a|be|de|re|ex|in|im|un|dis|pre|pro|con|com|per|sur|ap|ar|al|ad|ob|sup|sus|mis|en|em|for|fore|to|re)(?=[^aeiou])/;
const FIRST_STRESS_SUFFIX = /(ing|er|ly|y|le|en|ow|ed|ness|ful|less|ment|est|ure|age|ish|on|et|ent|al|ic|ie)$/;
function stressIndex(word, nSyl) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (nSyl <= 1) return 0;
  if (/(tion|sion|tions|sions|ic|ics|ial|ian|ious|eous|ity|ify)$/.test(w) && nSyl >= 3) { if (/(ity|ify)$/.test(w)) return nSyl - 3; return nSyl - 2; }
  if (/(ate|ize|ise|fy)$/.test(w) && nSyl >= 3) return nSyl - 3;
  if (nSyl === 2) {
    if (/(ing|er|ly|y|le|en|ow|ed|ness|ful|less|ment|est|age|ish|et|ure|ie|ey|ay)$/.test(w) && !/^(be|de|re|a)(?=[^aeiou])/.test(w) || /^(.)\1/.test(w)) return 0;
    if (STRESS_FINAL_PREFIX.test(w)) return 1;
    if (/(ee|oo|ain|ide|ire|eep|ound|ove|ose|ate|ake|ine)$/.test(w) && w.length > 4) return 1;
    return 0;
  }
  if (STRESS_FINAL_PREFIX.test(w) && /^(be|de|re|a|con|ex|pre|pro|per|sur)/.test(w) && nSyl === 3) return 1;
  return 0;
}

// Break a word into syllables with phoneme tokens: [{ph:[...], v:'ey', onset:[..], coda:[..], stress:0|1}]
function syllabify(word) {
  const t = g2p(word), vi = []; t.forEach((x, i) => { if (isV(x)) vi.push(i); });
  if (!vi.length) return [{ ph: t.slice(), v: null, onset: t.slice(), coda: [], stress: 1, text: word }];
  const sy = []; let start = 0;
  for (let k = 0; k < vi.length; k++) {
    const nextV = vi[k + 1];
    let end;
    if (nextV === undefined) end = t.length;
    else { const between = nextV - vi[k] - 1; end = vi[k] + 1 + (between >= 2 ? Math.floor(between / 2) : 0); if (between >= 2 && t[nextV - 1] === 'l' && between === 2 && 'pbkgf'.includes(t[nextV - 2])) end = vi[k] + 1; if (between === 2 && ['s'].includes(t[vi[k] + 1])) end = vi[k] + 1; }
    const ph = t.slice(start, end);
    const vpos = ph.findIndex(isV);
    sy.push({ ph, v: ph[vpos], onset: ph.slice(0, vpos), coda: ph.slice(vpos + 1), stress: 0 });
    start = end;
  }
  const si = stressIndex(word, sy.length);
  sy.forEach((s, i) => s.stress = i === si ? 1 : 0);
  return sy;
}

// ---- rhyme ----
const SIB = { z: 's', zh: 'sh', jh: 'ch', d: 't', g: 'k', b: 'p', v: 'f', dh: 'th' }; // voicing pairs for "near" comparison
function stressedTail(word) {
  const sy = syllabify(word); let si = sy.findIndex(s => s.stress === 1); if (si < 0) si = sy.length - 1;
  const tail = [].concat(...sy.slice(si).map(s => s.ph));
  return { tail, v: sy[si].v, coda: sy[si].coda.concat(...sy.slice(si + 1).map(s => s.ph)), nAfter: sy.length - 1 - si, sy };
}
const norm1 = t => t === 'z' ? 's' : t;
function rhymeRelation(a, b) {
  a = String(a).toLowerCase().replace(/[^a-z]/g, ''); b = String(b).toLowerCase().replace(/[^a-z]/g, '');
  if (!a || !b) return { type: 'none', score: 0 };
  if (a === b) return { type: 'same', score: 0 };
  const A = stressedTail(a), B = stressedTail(b);
  const ta = A.tail.map(norm1).join(' '), tb = B.tail.map(norm1).join(' ');
  if (ta === tb && A.nAfter === B.nAfter) return { type: 'perfect', score: 1 };
  // perfect if same vowel and same coda (ignoring s/z), differing syllable count after stress tolerated only when equal
  if (A.v === B.v) {
    const ca = A.coda.map(norm1).join(' '), cb = B.coda.map(norm1).join(' ');
    if (ca === cb) return { type: 'perfect', score: 0.95 };
    const sa = A.coda.map(x => SIB[x] || x).join(' '), sb = B.coda.map(x => SIB[x] || x).join(' ');
    if (sa === sb) return { type: 'near', score: 0.7 };
    return { type: 'slant', score: 0.55, why: 'same vowel (assonance)' };
  }
  const ca = A.coda.map(norm1).join(' '), cb = B.coda.map(norm1).join(' ');
  if (ca && ca === cb) return { type: 'slant', score: 0.45, why: 'same ending consonants (consonance)' };
  const FAM = [['ih', 'iy'], ['eh', 'ey', 'ae'], ['aa', 'ao', 'ow'], ['uh', 'uw', 'ow'], ['ah', 'aa'], ['ay', 'ey']];
  if (FAM.some(f => f.includes(A.v) && f.includes(B.v)) && ca === cb) return { type: 'near', score: 0.4, why: 'similar vowels' };
  return { type: 'none', score: 0 };
}
// Multisyllabic: compare the vowel sequence at the end of two phrases
function vowelSeq(text) { const ws = (text.toLowerCase().match(/[a-z']+/g) || []); const seq = []; ws.forEach(w => g2p(w).forEach(t => { if (isV(t)) seq.push(t); })); return seq; }
function multiMatch(a, b) {
  const x = vowelSeq(a), y = vowelSeq(b); let n = 0;
  while (n < x.length && n < y.length && x[x.length - 1 - n] === y[y.length - 1 - n]) n++;
  return n;
}
function lastWord(line) { const w = (String(line).toLowerCase().match(/[a-z']+/g) || []); return w.length ? w[w.length - 1].replace(/'/g, '') : ''; }
function tokensOf(line) { return (String(line).match(/[A-Za-z']+/g) || []).map(w => w.replace(/'/g, '')).filter(Boolean); }

// ---- flow grid ----
const SLOT_W = [3, 1, 2, 1, 3, 1, 2, 1, 3, 1, 2, 1, 3, 1, 2, 1]; // 16th-note weights: beats 1-4 strongest, offbeat 8ths next
function lineSyllables(line) {
  const out = [];
  tokensOf(line).forEach(w => {
    const sy = syllabify(w), fw = FUNCTION_WORDS.has(w.toLowerCase());
    sy.forEach((s, i) => out.push({ w, i, n: sy.length, stress: (!fw || sy.length > 1) && s.stress === 1 && !(fw && sy.length === 1) ? 1 : 0, wordEnd: i === sy.length - 1, fw }));
  });
  return out;
}
function placeBar(syl) {
  const n = syl.length; if (!n) return null;
  const cands = [];
  const score = slots => { let s = 0; syl.forEach((x, i) => { if (x.stress) s += SLOT_W[slots[i]] * 2; else s += (SLOT_W[slots[i]] === 1 ? 0.4 : 0); }); const last = slots[n - 1]; if (last >= 11) s += 2; if (last >= 15 && false) s -= 1; return s; };
  if (n <= 16) {
    for (let off = 0; off <= Math.min(3, 16 - n); off++) cands.push({ kind: 'packed', slots: syl.map((_, i) => off + i) });
    for (let off = 0; off <= 3; off++) { const slots = syl.map((_, i) => Math.min(15, Math.floor(off + i * (16 - off) / n))); let ok = true; for (let i = 1; i < n; i++) if (slots[i] <= slots[i - 1]) ok = false; if (ok) cands.push({ kind: 'spread', slots }); }
    // stress-snapped: put each stressed syllable on the nearest strong slot that keeps order
    const snap = []; let prev = -1; syl.forEach((x, i) => { const ideal = Math.round(i * 16 / n); let s = Math.max(prev + 1, Math.min(ideal, 15 - (n - 1 - i))); if (x.stress) { let best = s, bw = -1; for (let t = Math.max(prev + 1, s - 1); t <= Math.min(15 - (n - 1 - i), s + 1); t++) if (SLOT_W[t] > bw) { bw = SLOT_W[t]; best = t; } s = best; } snap.push(s); prev = s; });
    cands.push({ kind: 'snapped', slots: snap });
  } else {
    return { kind: 'overflow', slots: null };
  }
  let best = null; cands.forEach(c => { c.score = score(c.slots); if (!best || c.score > best.score + 1e-9) best = c; });
  return best;
}
function analyzeBar(line) {
  const syl = lineSyllables(line), n = syl.length;
  if (!n) return { n: 0, text: line, grid: Array(16).fill(null), notes: ['Empty bar.'] };
  const pl = placeBar(syl), notes = [];
  const stressed = syl.filter(s => s.stress).length;
  let onBeat = 0, onBack = 0, grid = Array(16).fill(null), pocket = 0;
  if (pl.slots) {
    pl.slots.forEach((sl, i) => { grid[sl] = { t: syl[i].w + (syl[i].n > 1 ? '·' + (syl[i].i + 1) : ''), stress: syl[i].stress, w: syl[i].w, wordEnd: syl[i].wordEnd }; if (syl[i].stress && sl % 4 === 0) onBeat++; if (syl[i].stress && (sl === 4 || sl === 12)) onBack++; });
    pocket = stressed ? onBeat / stressed : 0;
  }
  const dens = n <= 6 ? 'spacious' : n <= 10 ? 'steady' : n <= 14 ? 'busy' : n <= 16 ? 'packed' : 'overflow';
  if (dens === 'overflow') notes.push(n + ' syllables will not fit one bar on a 16-slot grid. Split it into two bars, or treat it as double-time and say so.');
  if (dens === 'packed') notes.push('Packed: almost every 16th note is filled, so there is no room to breathe. Cut a word or move the break.');
  if (dens === 'spacious') notes.push('Spacious: lots of room. Good for punchlines or laid-back delivery; add a pickup or a tag if it feels empty.');
  if (pl.slots) {
    const empties = [0, 4, 8, 12].filter(b => !grid[b]).length;
    if (empties >= 2) notes.push(empties + ' of the 4 main beats have no syllable. That can feel like a gap; fill with a word or lean on it deliberately.');
    if (stressed && pocket < 0.5) notes.push('Only ' + onBeat + ' of ' + stressed + ' stressed syllables land on a beat in my best placement. Try shifting where the line starts (a pickup) or swap a word so a stressed one lands on the beat.');
    const last = pl.slots[n - 1]; if (last < 11) notes.push('The bar ends early (slot ' + (last + 1) + ' of 16). Ending later makes the rhyme land closer to the 4.');
  }
  return { n, text: line, syl, kind: pl.kind, grid, stressed, onBeat, onBack, pocket, density: dens, notes, end: pl.slots ? pl.slots[n - 1] : null };
}
function gridString(a) { // 16 cells, readable
  if (!a.grid) return ''; const beats = [];
  for (let b = 0; b < 4; b++) { const cells = []; for (let k = 0; k < 4; k++) { const c = a.grid[b * 4 + k]; cells.push(c ? (c.stress ? 'X' : 'x') : '.'); } beats.push(cells.join(' ')); }
  return beats.join(' | ');
}

// ---- verse analysis ----
function schemeLetters(lines) {
  const ends = lines.map(lastWord), letters = [], reps = []; let next = 0;
  ends.forEach((w, i) => {
    let found = -1;
    for (let j = 0; j < reps.length; j++) { const r = rhymeRelation(w, reps[j].w); if (r.type === 'perfect' || r.type === 'same' || r.type === 'slant' && r.score >= 0.55 || r.type === 'near' && r.score >= 0.7) { found = j; break; } }
    if (found < 0) { reps.push({ w, L: String.fromCharCode(65 + next++) }); letters.push(reps[reps.length - 1].L); } else letters.push(reps[found].L);
  });
  return letters;
}
function internalRhymes(line) {
  const ws = tokensOf(line).filter(w => !FUNCTION_WORDS.has(w.toLowerCase()) && w.length > 2), out = [];
  for (let i = 0; i < ws.length; i++) for (let j = i + 1; j < ws.length; j++) { if (ws[i].toLowerCase() === ws[j].toLowerCase()) continue; const r = rhymeRelation(ws[i], ws[j]); if (r.type === 'perfect' || r.type === 'slant' && r.score >= 0.55) out.push([ws[i], ws[j], r.type]); }
  return out;
}
function alliteration(line) {
  const ws = tokensOf(line).filter(w => !FUNCTION_WORDS.has(w.toLowerCase())); let run = 1, best = 1, pairs = 0;
  const on = w => { const s = syllabify(w)[0]; return s.onset[0] || s.v; };
  for (let i = 1; i < ws.length; i++) { if (on(ws[i]) === on(ws[i - 1])) { run++; pairs++; best = Math.max(best, run); } else run = 1; }
  return { pairs, run: best };
}
function analyzeVerse(text) {
  const lines = String(text).split(/\n+/).map(s => s.trim()).filter(Boolean).slice(0, 32);
  const bars = lines.map(analyzeBar), scheme = schemeLetters(lines);
  const ints = lines.map(internalRhymes), alli = lines.map(alliteration);
  const multi = lines.map((l, i) => i ? Math.max(multiMatch(lines[i - 1], l), 0) : 0);
  const syl = bars.map(b => b.n), avg = syl.reduce((a, b) => a + b, 0) / (syl.length || 1);
  const sd = Math.sqrt(syl.reduce((a, b) => a + (b - avg) * (b - avg), 0) / (syl.length || 1));
  const runOn = lines.map(l => !/[.!?;:]$|,$/.test(l));
  const tips = [];
  if (lines.length < 2) tips.push('Paste at least 2 bars (one per line) so I can look at rhyme and consistency.');
  else {
    const counts = {}; scheme.forEach(c => counts[c] = (counts[c] || 0) + 1);
    const rhymed = scheme.filter(c => counts[c] > 1).length;
    if (rhymed / lines.length < 0.5) tips.push('Fewer than half your bars share an end rhyme with another bar. Pick one rhyme family for the verse and write toward it.');
    else tips.push('End rhymes: scheme ' + scheme.join('') + '. ' + Math.round(100 * rhymed / lines.length) + '% of bars share an ending sound.');
    if (sd > 3) tips.push('Bar lengths swing a lot (' + Math.min(...syl) + ' to ' + Math.max(...syl) + ' syllables). Some variation is style; this much can sound like stumbling. Even out the shortest and longest.');
    else tips.push('Bar lengths are consistent (about ' + avg.toFixed(1) + ' syllables).');
    const totInt = ints.reduce((a, x) => a + x.length, 0);
    if (!totInt) tips.push('No internal rhymes found. Try rhyming a word in the middle of the bar with the end word.');
    else tips.push('Internal rhymes found: ' + totInt + '. Nice texture.');
    if (Math.max(...multi) >= 3) tips.push('Multisyllabic match of ' + Math.max(...multi) + ' vowel sounds between neighbouring bars. That is the dense kind of rhyme.');
    else tips.push('Try one multisyllabic rhyme (match 2-3 vowel sounds, not just the last one), like "the kind of" with "I find a".');
    const pk = bars.filter(b => b.stressed).map(b => b.pocket), pm = pk.length ? pk.reduce((a, b) => a + b, 0) / pk.length : 0;
    tips.push('Pocket estimate: ' + Math.round(pm * 100) + '% of stressed syllables sit on a main beat in the best placement I can find. Rap often lives off the beat on purpose, so treat this as a conversation starter.');
  }
  return { lines, bars, scheme, ints, alli, multi, avg, sd, runOn, tips };
}
function barSeconds(bpm, beats) { return (60 / bpm) * (beats || 4); }
