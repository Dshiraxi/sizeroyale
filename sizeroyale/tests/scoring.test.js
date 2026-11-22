const test = require('node:test');
const assert = require('node:assert/strict');
const { score, toMeters, fromMeters, percentError } = require('../lib/scoring');
const { QUESTIONS, CATEGORIES } = require('../data/questions');
const { dailyQuestions } = require('../server');

test('exact guess = 1000', () => assert.equal(score(50, 50), 1000));
// Spec says "≈863"; the exact formula gives 862.496 → 862 with consistent Math.round.
test('10% over ≈ 863 (exactly 862.5 before rounding)', () => { assert.equal(score(110, 100), 862); assert.ok(Math.abs(1000 * (1 - Math.log(1.1) / Math.LN2) - 862.5) < 0.01); });
test('25% under ≈ 585', () => assert.equal(score(75, 100), 585));
test('half and double = 0', () => { assert.equal(score(50, 100), 0); assert.equal(score(200, 100), 0); });
test('beyond range stays 0, never negative', () => { assert.equal(score(1e9, 1), 0); assert.equal(score(1e-9, 1), 0); });
test('never exceeds 1000', () => assert.ok(score(100.0000001, 100) <= 1000));
test('rejects zero, negative, NaN, Infinity', () => {
  for (const g of [0, -5, NaN, Infinity]) assert.throws(() => score(g, 10), RangeError);
  assert.throws(() => score(5, 0), RangeError);
});
test('unit conversion round-trips', () => {
  assert.ok(Math.abs(toMeters(1, 'ft') - 0.3048) < 1e-12);
  assert.ok(Math.abs(toMeters(1, 'mi') - 1609.344) < 1e-9);
  assert.ok(Math.abs(fromMeters(toMeters(12.5, 'in'), 'in') - 12.5) < 1e-12);
  assert.throws(() => toMeters(1, 'parsec'), RangeError);
  assert.throws(() => toMeters(-1, 'm'), RangeError);
});
test('same real size in different units gives same score', () => assert.equal(score(toMeters(328.084, 'ft'), 100), score(toMeters(100, 'm'), 100)));
test('percent error sign', () => assert.equal(percentError(110, 100), 10));
test('question bank integrity', () => {
  const ids = new Set(); const titles = new Set();
  for (const q of QUESTIONS) {
    assert.ok(!ids.has(q.id), 'dup id ' + q.id); ids.add(q.id);
    assert.ok(!titles.has(q.title), 'dup title ' + q.title); titles.add(q.title);
    assert.ok(q.meters > 0 && q.kind && q.fact && q.sourceName && /^https:\/\//.test(q.sourceUrl), q.id);
    assert.ok(CATEGORIES.some((c) => c.slug === q.category));
    assert.ok(['easy', 'medium', 'hard'].includes(q.difficulty));
  }
  for (const c of CATEGORIES) for (const d of ['easy', 'medium', 'hard']) assert.ok(QUESTIONS.some((q) => q.category === c.slug && q.difficulty === d), `${c.slug}/${d} empty`);
});
test('daily set is deterministic, 5 distinct questions', () => {
  const a = dailyQuestions('2026-11-22').map((q) => q.id); const b = dailyQuestions('2026-11-22').map((q) => q.id);
  assert.deepEqual(a, b); assert.equal(new Set(a).size, 5);
  assert.notDeepEqual(a, dailyQuestions('2026-11-23').map((q) => q.id));
});
