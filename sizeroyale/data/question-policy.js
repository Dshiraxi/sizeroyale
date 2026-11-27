// Question IDs retained for historical result lookup but excluded from newly generated rounds.
// Reasons are subject + measurement + matching stored value/definition, not merely equal numbers.
// Revisit this list only with source-backed replacements and stable-ID compatibility tests.
const RETIRED_FROM_NEW_ROUNDS = Object.freeze({
  'animals-013': 'Near-duplicate giraffe height; keep the more explicitly defined legacy record animals-002.',
  'animals-016': 'Duplicate emperor-penguin standing-height fact; keep animals-004.',
  'dinosaurs-011': 'Same T. rex length estimate as the legacy specimen question; keep dinosaurs-001.',
  'dinosaurs-012': 'Same Stegosaurus length estimate as dinosaurs-006.',
  'dinosaurs-013': 'Same Triceratops length estimate as dinosaurs-002.',
  'space-004': 'Stored 6,779 km is mean diameter, not equatorial; corrected qualified mean-diameter entry space-015 remains active.',
  'space-014': 'Duplicate Earth mean-diameter fact; keep space-001.',
  'space-016': 'Duplicate Venus mean-diameter fact; keep space-008.',
  'space-017': 'Duplicate Mercury mean-diameter fact; keep space-007.',
  'geography-015': 'Duplicate Burj Khalifa architectural-height fact; keep geography-003.',
  'geography-016': 'Duplicate Eiffel Tower antenna-inclusive height; keep geography-002.',
  'geography-017': 'Duplicate Statue of Liberty ground-to-torch height; keep geography-004.',
  'vehicles-018': 'Duplicate RMS Titanic overall length; keep vehicles-005.',
  'everyday-objects-014': 'Same representative tennis-ball diameter; keep everyday-objects-006 with official range qualifier.',
  'everyday-objects-016': 'Same size-5 association-football diameter; keep everyday-objects-002.',
  'everyday-objects-017': 'Same ISO ID-1 card long-edge dimension; keep everyday-objects-004.'
});

function getActiveQuestions(questions) {
  return questions.filter((q) => !Object.prototype.hasOwnProperty.call(RETIRED_FROM_NEW_ROUNDS, q.id));
}

module.exports = { RETIRED_FROM_NEW_ROUNDS, getActiveQuestions };
