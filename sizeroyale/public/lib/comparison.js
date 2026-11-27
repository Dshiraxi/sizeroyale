/* Shared measurement-safe comparison helpers for browser and Node tests. */
(function (root) {
  'use strict';
  function validMeasurement(item) {
    return !!item && typeof item.id === 'string' && typeof item.kind === 'string' &&
      Number.isFinite(Number(item.meters)) && Number(item.meters) > 0;
  }
  function compatibleItems(items, reference) {
    const ref = typeof reference === 'string' ? (items || []).find((item) => item && item.id === reference) : reference;
    if (!validMeasurement(ref)) return [];
    return (items || []).filter((item) => validMeasurement(item) && item.id !== ref.id && item.kind === ref.kind);
  }
  function compare(a, b) {
    if (!validMeasurement(a) || !validMeasurement(b) || a.id === b.id || a.kind !== b.kind) return null;
    const larger = Number(a.meters) >= Number(b.meters) ? a : b;
    const smaller = larger === a ? b : a;
    return { larger, smaller, ratio: Number(larger.meters) / Number(smaller.meters), kind: a.kind };
  }
  function buildPairs(items) {
    const groups = new Map();
    (items || []).forEach((item) => {
      if (!validMeasurement(item)) return;
      if (!groups.has(item.kind)) groups.set(item.kind, []);
      groups.get(item.kind).push(item);
    });
    const pairs = [];
    groups.forEach((group) => {
      for (let i = 0; i < group.length; i++) for (let j = i + 1; j < group.length; j++) {
        const result = compare(group[i], group[j]);
        if (result && result.ratio > 1.01) pairs.push({ pair: [group[i], group[j]], ratio: result.ratio });
      }
    });
    return pairs;
  }
  const api = Object.freeze({ compatibleItems, compare, buildPairs });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.SRComparison = api;
})(typeof window !== 'undefined' ? window : globalThis);
