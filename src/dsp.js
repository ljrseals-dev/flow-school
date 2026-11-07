// <DSP>
const DSP = (() => {
  const NOTE = ['C','C♯','D','E♭','E','F','F♯','G','A♭','A','B♭','B'];
  function decimate(x, f){
    if (f <= 1) return Float64Array.from(x);
    const m = Math.floor(x.length / f), y = new Float64Array(m);
    for (let i = 0; i < m; i++){ let s = 0; for (let j = 0; j < f; j++) s += x[i*f+j]; y[i] = s / f; }
    return y;
  }
  function rms(x){ let s = 0; for (let i = 0; i < x.length; i++) s += x[i]*x[i]; return Math.sqrt(s / x.length); }
  // Normalised autocorrelation pitch tracker. Picks the shortest strong peak to avoid octave errors.
  function pitch(x, fs, fmin = 70, fmax = 1100){
    const n = x.length, minLag = Math.max(2, Math.floor(fs / fmax)), maxLag = Math.min(Math.floor(fs / fmin), n - 3);
    let mean = 0; for (let i = 0; i < n; i++) mean += x[i]; mean /= n;
    const z = new Float64Array(n); let e = 0;
    for (let i = 0; i < n; i++){ z[i] = x[i] - mean; e += z[i]*z[i]; }
    if (e <= 0) return { f0: 0, clarity: 0 };
    const r = new Float64Array(maxLag + 2);
    for (let lag = minLag - 1; lag <= maxLag + 1; lag++){
      let s = 0; for (let i = 0; i < n - lag; i++) s += z[i]*z[i+lag];
      r[lag] = (s / (n - lag)) / (e / n);
    }
    const peaks = []; let best = 0;
    for (let l = minLag; l <= maxLag; l++){
      if (r[l] > r[l-1] && r[l] >= r[l+1] && r[l] > 0.3){ peaks.push(l); if (r[l] > best) best = r[l]; }
    }
    if (!peaks.length) return { f0: 0, clarity: 0 };
    let lag = peaks.find(l => r[l] >= 0.95 * best);
    const a = r[lag-1], b = r[lag], c = r[lag+1], d = a - 2*b + c;
    const shift = d !== 0 ? 0.5 * (a - c) / d : 0;
    return { f0: fs / (lag + shift), clarity: best };
  }
  function lpc(x, order){
    const n = x.length, r = new Float64Array(order + 1);
    for (let k = 0; k <= order; k++){ let s = 0; for (let i = 0; i < n - k; i++) s += x[i]*x[i+k]; r[k] = s; }
    r[0] *= 1.0001; r[0] += 1e-9;
    const a = new Float64Array(order + 1); a[0] = 1; let err = r[0];
    for (let i = 1; i <= order; i++){
      let acc = r[i]; for (let j = 1; j < i; j++) acc += a[j]*r[i-j];
      const k = -acc / err, prev = a.slice();
      for (let j = 1; j < i; j++) a[j] = prev[j] + k*prev[i-j];
      a[i] = k; err *= (1 - k*k); if (err <= 0) break;
    }
    return a;
  }
  // Formant candidates = peaks of the LPC spectral envelope.
  function formants(x, fs, order){
    const n = x.length, y = new Float64Array(n);
    y[0] = x[0]; for (let i = 1; i < n; i++) y[i] = x[i] - 0.97*x[i-1];
    for (let i = 0; i < n; i++) y[i] *= 0.54 - 0.46*Math.cos(2*Math.PI*i/(n-1));
    const a = lpc(y, order), N = 512, fmaxEval = Math.min(5000, fs/2 - 50), env = new Float64Array(N);
    for (let k = 0; k < N; k++){
      const w = 2*Math.PI*(k*fmaxEval/(N-1))/fs; let re = 1, im = 0;
      for (let j = 1; j <= order; j++){ re += a[j]*Math.cos(w*j); im -= a[j]*Math.sin(w*j); }
      env[k] = 1 / Math.sqrt(re*re + im*im);
    }
    const out = [];
    for (let k = 1; k < N - 1; k++){
      if (env[k] > env[k-1] && env[k] >= env[k+1]){
        const l0 = Math.log(env[k-1]), l1 = Math.log(env[k]), l2 = Math.log(env[k+1]), d = l0 - 2*l1 + l2;
        const sh = d !== 0 ? 0.5*(l0 - l2)/d : 0, f = (k + sh)*fmaxEval/(N-1);
        if (f > 180) out.push({ f, mag: env[k] });
      }
    }
    return out;
  }
  function analyze(buf, fs){
    const level = rms(buf);
    if (level < 0.004) return { level, voiced: false };
    const dp = Math.max(1, Math.round(fs / 24000));
    const p = pitch(decimate(buf.subarray(Math.max(0, buf.length - 2048*dp)), dp), fs/dp);
    if (!p.f0 || p.clarity < 0.5) return { level, voiced: false };
    const df = Math.max(1, Math.round(fs / 11025)), nWin = Math.round(0.04 * fs);
    const seg = decimate(buf.subarray(buf.length - nWin), df), fsd = fs / df;
    const fm = formants(seg, fsd, Math.round(fsd/1000) + 2);
    return { level, voiced: true, f0: p.f0, clarity: p.clarity, F1: fm[0] ? fm[0].f : 0, F2: fm[1] ? fm[1].f : 0, F3: fm[2] ? fm[2].f : 0 };
  }
  function hzToNote(f){
    const m = 69 + 12*Math.log2(f/440), mi = Math.round(m);
    return { name: NOTE[((mi % 12) + 12) % 12] + (Math.floor(mi/12) - 1), cents: Math.round((m - mi)*100), midi: mi };
  }
  function midiToHz(m){ return 440 * Math.pow(2, (m - 69)/12); }
  function midiName(m){ return NOTE[((m % 12) + 12) % 12] + (Math.floor(m/12) - 1); }
  function harmonicOffset(F, f0){
    const n = Math.max(1, Math.round(F / f0));
    return { n, cents: 1200*Math.log2(F / (n*f0)) };
  }
  return { decimate, rms, pitch, lpc, formants, analyze, hzToNote, midiToHz, midiName, harmonicOffset };
})();
