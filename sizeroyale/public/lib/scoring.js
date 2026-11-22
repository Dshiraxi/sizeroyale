/* Shared scoring + unit helpers (works in Node and browser). */
(function (root) {
  'use strict';
  const UNITS = {
    mm: 0.001, cm: 0.01, m: 1, km: 1000,
    in: 0.0254, ft: 0.3048, yd: 0.9144, mi: 1609.344,
  };
  const METRIC_UNITS = ['cm', 'm', 'km'];
  const US_UNITS = ['in', 'ft', 'mi'];
  const MAX_METERS = 1e12;
  const MIN_METERS = 1e-6;

  function toMeters(value, unit) {
    const f = UNITS[unit];
    if (!f) throw new RangeError('Unknown unit: ' + unit);
    const v = Number(value);
    if (!Number.isFinite(v) || v <= 0) throw new RangeError('Guess must be a positive number');
    const m = v * f;
    if (!Number.isFinite(m) || m < MIN_METERS || m > MAX_METERS) throw new RangeError('Guess is out of range');
    return m;
  }
  function fromMeters(m, unit) {
    const f = UNITS[unit];
    if (!f) throw new RangeError('Unknown unit: ' + unit);
    return m / f;
  }

  // S = max(0, 1000 * (1 - |ln(g/a)| / ln 2)), rounded to nearest integer.
  function score(g, a) {
    if (!(typeof g === 'number' && typeof a === 'number') || !Number.isFinite(g) || !Number.isFinite(a) || g <= 0 || a <= 0) {
      throw new RangeError('Guess and answer must be positive finite numbers');
    }
    const s = 1000 * (1 - Math.abs(Math.log(g / a)) / Math.LN2);
    return Math.max(0, Math.min(1000, Math.round(s)));
  }
  const percentError = (g, a) => ((g - a) / a) * 100;

  // Human-friendly number formatting (3 significant digits for small, grouped for large)
  function fmt(n) {
    if (!Number.isFinite(n)) return '–';
    const abs = Math.abs(n);
    if (abs >= 1000) return Math.round(n).toLocaleString('en-US');
    if (abs >= 100) return n.toFixed(0);
    if (abs >= 10) return n.toFixed(1).replace(/\.0$/, '');
    if (abs >= 1) return n.toFixed(2).replace(/0$/, '').replace(/\.0$/, '');
    return Number(n.toPrecision(3)).toString();
  }
  // Pick a sensible display unit for a magnitude in meters.
  function bestUnit(m, system) {
    if (system === 'us') {
      const ft = m / UNITS.ft;
      if (m / UNITS.mi >= 0.5) return 'mi';
      if (ft >= 3) return 'ft';
      return 'in';
    }
    if (m >= 1000) return 'km';
    if (m >= 1) return 'm';
    return 'cm';
  }

  const api = { UNITS, METRIC_UNITS, US_UNITS, toMeters, fromMeters, score, percentError, fmt, bestUnit };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.SR = api;
})(typeof window !== 'undefined' ? window : globalThis);
