const test = require('node:test');
const assert = require('node:assert/strict');
const { compatibleItems, compare, buildPairs } = require('../public/lib/comparison');

const whale = { id: 'whale', kind: 'Length', meters: 29.9 };
const bus = { id: 'bus', kind: 'Length', meters: 12 };
const giraffe = { id: 'giraffe', kind: 'Height', meters: 5.5 };
const elephant = { id: 'elephant', kind: 'Height', meters: 3.2 };

test('compatibleItems returns only different items with the same measurement kind', () => {
  assert.deepEqual(compatibleItems([whale, bus, giraffe], whale), [bus]);
});
test('compare rejects mismatched measurement kinds and identical items', () => {
  assert.equal(compare(whale, giraffe), null);
  assert.equal(compare(whale, whale), null);
});
test('compare returns larger, smaller and ratio for compatible measurements', () => {
  const result = compare(whale, bus);
  assert.equal(result.larger, whale);
  assert.equal(result.smaller, bus);
  assert.ok(Math.abs(result.ratio - 29.9 / 12) < 1e-12);
  assert.equal(result.kind, 'Length');
});
test('buildPairs creates pairs only within matching measurement kinds', () => {
  const pairs = buildPairs([whale, bus, giraffe, elephant]);
  assert.equal(pairs.length, 2);
  assert.ok(pairs.every(({ pair }) => pair[0].kind === pair[1].kind));
});
