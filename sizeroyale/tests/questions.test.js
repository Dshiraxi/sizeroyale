const test = require('node:test');
const assert = require('node:assert/strict');
const { QUESTIONS, CATEGORIES } = require('../data/questions');

test('question bank has at least 100 entries and unique stable IDs', () => {
  assert.ok(QUESTIONS.length >= 100, 'question bank should contain at least 100 questions');
  const ids = QUESTIONS.map((q) => q.id);
  assert.equal(new Set(ids).size, ids.length, 'question IDs must be unique');
});

test('every question has a valid category, measurement and source URL', () => {
  const categories = new Set(CATEGORIES.map((c) => c.slug));
  for (const q of QUESTIONS) {
    assert.ok(categories.has(q.category), q.id + ' has an unknown category');
    assert.equal(typeof q.kind, 'string');
    assert.ok(q.kind.trim().length > 0, q.id + ' needs a measurement kind');
    assert.ok(Number.isFinite(q.meters) && q.meters > 0, q.id + ' needs a positive meter value');
    assert.ok(typeof q.title === 'string' && q.title.trim().length > 0, q.id + ' needs a question title');
    assert.ok(typeof q.description === 'string' && q.description.trim().length > 0, q.id + ' needs a measurement definition');
    assert.ok(typeof q.sourceName === 'string' && q.sourceName.trim().length > 0, q.id + ' needs a named source');
    assert.ok(/^https:\/\//.test(q.sourceUrl), q.id + ' source must use HTTPS');
    assert.ok(Number.isFinite(q.difficulty === 'easy' ? 1 : q.difficulty === 'medium' ? 2 : q.difficulty === 'hard' ? 3 : NaN), q.id + ' has an invalid difficulty');
  }
});

test('question titles are unique after normalization', () => {
  const titles = QUESTIONS.map((q) => q.title.trim().toLocaleLowerCase());
  assert.equal(new Set(titles).size, titles.length, 'question titles should be distinguishable');
});
