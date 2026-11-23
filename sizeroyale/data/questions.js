/*
 * SizeRoyale question bank. Canonical value is always METERS.
 * Each entry: category, kind (what is measured), title, description, value (m),
 * difficulty, fact, source name + URL.
 *
 * IMPORTANT: values come from commonly published figures (Wikipedia / NASA / ISO / agency pages).
 * They were entered without live web access, so every source URL must be re-checked before launch
 * (see docs/QA_REPORT.md). Ranges ("up to", "typical") are stated in the description/definition.
 */
const Q = [];
const W = (p) => 'https://en.wikipedia.org/wiki/' + p;
let n = {};
function add(cat, icon, kind, title, description, meters, difficulty, fact, sourceName, sourceUrl) {
  n[cat] = (n[cat] || 0) + 1;
  Q.push({
    id: `${cat}-${String(n[cat]).padStart(3, '0')}`,
    category: cat, icon, kind, title, description, meters, difficulty, fact, sourceName, sourceUrl,
  });
}

// ---------- ANIMALS ----------
add('animals', '🐋', 'Length', 'How long is a blue whale?', 'Longest reliably measured adult blue whale, nose to tail tip.', 29.9, 'easy', 'Blue whales are the largest animals known to have ever lived.', 'Wikipedia – Blue whale', W('Blue_whale'));
add('animals', '🦒', 'Height', 'How tall is the tallest male giraffe?', 'Standing height of a very tall adult male giraffe, ground to top of the head (ossicones).', 5.5, 'easy', 'Giraffes have seven neck vertebrae – the same number as humans.', 'Wikipedia – Giraffe', W('Giraffe'));
add('animals', '🐘', 'Height', 'How tall is an African bush elephant?', 'Typical shoulder height of an adult male, ground to the top of the shoulder.', 3.2, 'medium', 'The African bush elephant is the largest living land animal.', 'Wikipedia – African bush elephant', W('African_bush_elephant'));
add('animals', '🐧', 'Height', 'How tall is an emperor penguin?', 'Standing height of an adult emperor penguin.', 1.15, 'medium', 'Emperor penguins are the largest of all penguin species.', 'Wikipedia – Emperor penguin', W('Emperor_penguin'));
add('animals', '🦅', 'Wingspan', 'What is the wingspan of a wandering albatross?', 'Tip-to-tip wingspan of a large adult wandering albatross.', 3.5, 'medium', 'It has one of the largest wingspans of any living bird.', 'Wikipedia – Wandering albatross', W('Wandering_albatross'));
add('animals', '🐊', 'Length', 'How long is a big saltwater crocodile?', 'Length of a large adult male saltwater crocodile, snout to tail tip.', 6.0, 'medium', 'The saltwater crocodile is the largest living reptile.', 'Wikipedia – Saltwater crocodile', W('Saltwater_crocodile'));
add('animals', '🦈', 'Length', 'How long is a whale shark?', 'Maximum length of the largest fish alive, snout to tail tip.', 12.0, 'hard', 'The whale shark is the largest living fish, yet it eats plankton.', 'Wikipedia – Whale shark', W('Whale_shark'));
add('animals', '🐦', 'Length', 'How long is a bee hummingbird?', 'Total length of an adult male bee hummingbird, bill to tail tip.', 0.055, 'hard', 'The bee hummingbird is the smallest living bird.', 'Wikipedia – Bee hummingbird', W('Bee_hummingbird'));

// ---------- DINOSAURS ----------
add('dinosaurs', '🦖', 'Length', 'How long was Tyrannosaurus rex?', 'Length of "Sue", one of the most complete T. rex skeletons, snout to tail tip.', 12.3, 'easy', 'More time separates Stegosaurus from T. rex than T. rex from today.', 'Wikipedia – Tyrannosaurus', W('Tyrannosaurus'));
add('dinosaurs', '🦕', 'Length', 'How long was Triceratops?', 'Estimated maximum body length of an adult Triceratops.', 9.0, 'medium', 'Its name means "three-horned face".', 'Wikipedia – Triceratops', W('Triceratops'));
add('dinosaurs', '🦖', 'Length', 'How long was Velociraptor?', 'Estimated body length of Velociraptor mongoliensis.', 2.07, 'medium', 'Real Velociraptors were roughly turkey-sized, far smaller than in the movies.', 'Wikipedia – Velociraptor', W('Velociraptor'));
add('dinosaurs', '🦕', 'Length', 'How long was Brachiosaurus?', 'Upper estimate of body length for Brachiosaurus altithorax.', 22.0, 'hard', 'Its front legs were longer than its back legs, giving it a giraffe-like posture.', 'Wikipedia – Brachiosaurus', W('Brachiosaurus'));
add('dinosaurs', '🦕', 'Length', 'How long was Diplodocus?', 'Upper estimate of body length for Diplodocus carnegii.', 26.0, 'hard', 'Diplodocus is among the longest dinosaurs known from fairly complete skeletons.', 'Wikipedia – Diplodocus', W('Diplodocus'));
add('dinosaurs', '🦖', 'Length', 'How long was Stegosaurus?', 'Estimated maximum body length of Stegosaurus.', 9.0, 'medium', 'Stegosaurus lived about 150 million years ago, long before T. rex.', 'Wikipedia – Stegosaurus', W('Stegosaurus'));
add('dinosaurs', '🐊', 'Length', 'How long was Spinosaurus?', 'Commonly cited length estimate for Spinosaurus aegyptiacus.', 14.0, 'hard', 'Spinosaurus was likely semi-aquatic and is among the largest known predatory dinosaurs.', 'Wikipedia – Spinosaurus', W('Spinosaurus'));

// ---------- SPACE ----------
add('space', '🌍', 'Diameter', 'What is the diameter of Earth?', 'Mean diameter of Earth.', 12742000, 'easy', 'Earth is the largest of the four rocky planets.', 'NASA – Earth Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html');
add('space', '🌕', 'Diameter', 'What is the diameter of the Moon?', 'Mean diameter of the Moon.', 3474800, 'easy', 'The Moon is about 27% of Earth\'s diameter.', 'NASA – Moon Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html');
add('space', '🪐', 'Diameter', 'What is the equatorial diameter of Jupiter?', 'Equatorial diameter of Jupiter.', 142984000, 'medium', 'More than 1,300 Earths could fit inside Jupiter by volume.', 'NASA – Jupiter Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html');
add('space', '🔴', 'Diameter', 'What is the equatorial diameter of Mars?', 'Equatorial diameter of Mars.', 6779000, 'medium', 'Mars is roughly half the diameter of Earth.', 'NASA – Mars Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html');
add('space', '☀️', 'Diameter', 'What is the diameter of the Sun?', 'Mean diameter of the Sun.', 1392700000, 'medium', 'About 109 Earths would fit across the Sun\'s diameter.', 'NASA – Sun Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html');
add('space', '🪐', 'Diameter', 'What is the equatorial diameter of Saturn?', 'Equatorial diameter of Saturn, excluding its rings.', 120536000, 'hard', 'Saturn is the second-largest planet in the Solar System.', 'NASA – Saturn Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html');
add('space', '⚫', 'Diameter', 'What is the diameter of Mercury?', 'Mean diameter of Mercury.', 4879000, 'hard', 'Mercury is the smallest planet in the Solar System.', 'NASA – Mercury Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html');
add('space', '🟡', 'Diameter', 'What is the diameter of Venus?', 'Mean diameter of Venus.', 12104000, 'hard', 'Venus is nearly Earth\'s twin in size.', 'NASA – Venus Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html');
add('space', '🚀', 'Distance', 'How far is the Moon from Earth?', 'Average distance between the centers of Earth and the Moon.', 384400000, 'medium', 'Light takes about 1.3 seconds to travel from the Moon to Earth.', 'NASA – Moon Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html');

// ---------- GEOGRAPHY ----------
add('geography', '🏔️', 'Height', 'How tall is Mount Everest?', 'Official elevation above sea level (China–Nepal 2020 survey).', 8848.86, 'easy', 'The 2020 joint survey added about 0.86 m to the earlier official height.', 'Wikipedia – Mount Everest', W('Mount_Everest'));
add('geography', '🗼', 'Height', 'How tall is the Eiffel Tower?', 'Height including antennas.', 330, 'easy', 'It was completed in 1889 for the World\'s Fair in Paris.', 'Wikipedia – Eiffel Tower', W('Eiffel_Tower'));
add('geography', '🏙️', 'Height', 'How tall is the Burj Khalifa?', 'Architectural height of the tallest building in the world.', 828, 'medium', 'It has been the world\'s tallest building since 2010.', 'Wikipedia – Burj Khalifa', W('Burj_Khalifa'));
add('geography', '🗽', 'Height', 'How tall is the Statue of Liberty?', 'Height from ground level to the tip of the torch (including pedestal and foundation).', 93, 'medium', 'It was a gift from France, dedicated in 1886.', 'Wikipedia – Statue of Liberty', W('Statue_of_Liberty'));
add('geography', '🌊', 'Length', 'How long is the Nile?', 'Commonly cited length of the Nile river (the longest-river ranking is debated).', 6650000, 'hard', 'Its length is often compared with the Amazon\'s, and sources disagree on which is longer.', 'Wikipedia – Nile', W('Nile'));
add('geography', '🌋', 'Height', 'How tall is Mount Kilimanjaro?', 'Elevation of Uhuru Peak above sea level.', 5895, 'medium', 'Kilimanjaro is the highest mountain in Africa.', 'Wikipedia – Mount Kilimanjaro', W('Mount_Kilimanjaro'));
add('geography', '🕳️', 'Depth', 'How deep is the Challenger Deep?', 'Approximate depth of the deepest known point of the oceans.', 10935, 'hard', 'It lies in the Mariana Trench in the western Pacific.', 'Wikipedia – Challenger Deep', W('Challenger_Deep'));
add('geography', '🏜️', 'Length', 'How long is the Grand Canyon?', 'Length of the canyon along the Colorado River.', 446000, 'hard', 'The Grand Canyon is up to about 1.8 km deep.', 'Wikipedia – Grand Canyon', W('Grand_Canyon'));
add('geography', '🔺', 'Height', 'How tall was the Great Pyramid of Giza?', 'Original height when completed (it is shorter today).', 146.6, 'medium', 'It stood as the tallest human-made structure for thousands of years.', 'Wikipedia – Great Pyramid of Giza', W('Great_Pyramid_of_Giza'));
add('geography', '🗻', 'Height', 'How tall is Mount Fuji?', 'Elevation of the summit above sea level.', 3776, 'medium', 'Mount Fuji is the highest mountain in Japan.', 'Wikipedia – Mount Fuji', W('Mount_Fuji'));

// ---------- VEHICLES ----------
add('vehicles', '✈️', 'Length', 'How long is a Boeing 747-400?', 'Overall fuselage length.', 70.6, 'medium', 'The 747 was the first wide-body airliner.', 'Wikipedia – Boeing 747', W('Boeing_747'));
add('vehicles', '🛫', 'Length', 'How long is an Airbus A380?', 'Overall length of the A380-800.', 72.72, 'medium', 'The A380 is the largest passenger airliner ever built.', 'Wikipedia – Airbus A380', W('Airbus_A380'));
add('vehicles', '🛩️', 'Wingspan', 'What is the wingspan of an Airbus A380?', 'Tip-to-tip wingspan.', 79.75, 'hard', 'Its wingspan is wider than a football field is long.', 'Wikipedia – Airbus A380', W('Airbus_A380'));
add('vehicles', '✈️', 'Wingspan', 'What is the wingspan of a Boeing 747-400?', 'Tip-to-tip wingspan.', 64.4, 'hard', 'Its upper-deck "hump" was originally designed for a cargo nose door.', 'Wikipedia – Boeing 747', W('Boeing_747'));
add('vehicles', '🚢', 'Length', 'How long was the Titanic?', 'Overall length of RMS Titanic.', 269.1, 'easy', 'Titanic sank in 1912 on its maiden voyage.', 'Wikipedia – Titanic', W('Titanic'));
add('vehicles', '🚀', 'Length', 'How long is a Space Shuttle orbiter?', 'Overall length of the orbiter vehicle.', 37.24, 'hard', 'The Shuttle program flew 135 missions between 1981 and 2011.', 'Wikipedia – Space Shuttle', W('Space_Shuttle'));
add('vehicles', '🚀', 'Height', 'How tall was the Saturn V rocket?', 'Total height of the Apollo-era launch vehicle with spacecraft.', 110.6, 'medium', 'Saturn V carried astronauts to the Moon.', 'Wikipedia – Saturn V', W('Saturn_V'));
add('vehicles', '🛳️', 'Length', 'How long is the Queen Mary 2?', 'Overall length of the ocean liner.', 345, 'hard', 'It is one of the largest ocean liners ever built.', 'Wikipedia – Queen Mary 2', W('RMS_Queen_Mary_2'));
add('vehicles', '✈️', 'Length', 'How long is a Boeing 737-800?', 'Overall fuselage length.', 39.5, 'medium', 'The 737 family is the best-selling commercial jet airliner.', 'Wikipedia – Boeing 737 Next Generation', W('Boeing_737_Next_Generation'));
add('vehicles', '🚌', 'Length', 'How long is a typical full-size school bus?', 'Approximate overall length of a full-size US school bus (about 40 feet).', 12.2, 'easy', 'School buses come in several sizes; this is a representative full-size bus length.', 'Wikipedia – School bus', W('School_bus'));

// ---------- EVERYDAY OBJECTS ----------
add('everyday-objects', '🏀', 'Diameter', 'What is the diameter of a basketball?', 'Diameter of an official men\'s basketball (29.5 in circumference).', 0.239, 'easy', 'The official circumference is 29.5 inches.', 'Wikipedia – Basketball (ball)', W('Basketball_(ball)'));
add('everyday-objects', '⚽', 'Diameter', 'What is the diameter of a size-5 soccer ball?', 'Approximate diameter of a standard size-5 ball (68–70 cm circumference).', 0.22, 'medium', 'Size 5 is the standard ball for adult professional play.', 'Wikipedia – Football (ball)', W('Football_(ball)'));
add('everyday-objects', '💵', 'Length', 'How long is a US dollar bill?', 'Long side of a US banknote.', 0.1556, 'easy', 'All US notes share the same size, about 6.14 × 2.61 inches.', 'Wikipedia – United States one-dollar bill', W('United_States_one-dollar_bill'));
add('everyday-objects', '💳', 'Length', 'How long is a standard credit card?', 'Long side of an ISO/IEC 7810 ID-1 card.', 0.0856, 'medium', 'Bank cards, ID cards and many licenses use this same size.', 'Wikipedia – ISO/IEC 7810', W('ISO/IEC_7810'));
add('everyday-objects', '📄', 'Length', 'How long is an A4 sheet of paper?', 'Long side of an A4 sheet (210 × 297 mm).', 0.297, 'easy', 'A4 belongs to the ISO 216 family, where each size halves to the next.', 'Wikipedia – ISO 216', W('ISO_216'));
add('everyday-objects', '🎾', 'Diameter', 'What is the diameter of a tennis ball?', 'Approximate diameter within the official range of 6.54–6.86 cm.', 0.067, 'medium', 'The ITF allows a small range of sizes for official balls.', 'Wikipedia – Tennis ball', W('Tennis_ball'));
add('everyday-objects', '✏️', 'Length', 'How long is a new standard pencil?', 'Typical length of a new, unsharpened US hexagonal pencil (7.5 in).', 0.1905, 'medium', 'Most pencils are hexagonal so they don\'t roll off desks.', 'Wikipedia – Pencil', W('Pencil'));
add('everyday-objects', '⛳', 'Diameter', 'What is the diameter of a golf ball?', 'Minimum allowed diameter under golf rules (42.67 mm).', 0.04267, 'hard', 'Rules limit the minimum diameter, not the maximum.', 'Wikipedia – Golf ball', W('Golf_ball'));
add('everyday-objects', '⚾', 'Length', 'How long can a baseball bat be?', 'Maximum bat length allowed in professional baseball (42 in).', 1.0668, 'hard', 'Professional bats must be one smooth, solid piece of wood.', 'Wikipedia – Baseball bat', W('Baseball_bat'));


/* ---------- EXTRA VARIETY: additional distinct comparisons ---------- */
// ANIMALS
add('animals', '🦁', 'Length', 'How long is an adult male lion?', 'Approximate total body length of a large adult male lion, excluding the tail.', 2.5, 'medium', 'A lion’s tail adds further length beyond its head and body.', 'Wikipedia – Lion', W('Lion'));
add('animals', '🐻‍❄️', 'Length', 'How long is a polar bear?', 'Approximate head-and-body length of a large adult polar bear.', 2.6, 'medium', 'Polar bears are the largest living bear species.', 'Wikipedia – Polar bear', W('Polar_bear'));
add('animals', '🦍', 'Height', 'How tall is a silverback gorilla?', 'Approximate upright height of an adult male gorilla.', 1.7, 'medium', 'Adult male gorillas are called silverbacks because of the silver hair on their backs.', 'Wikipedia – Gorilla', W('Gorilla'));
add('animals', '🦩', 'Height', 'How tall is a greater flamingo?', 'Approximate standing height of an adult greater flamingo.', 1.4, 'hard', 'The greater flamingo is the tallest and most widespread flamingo species.', 'Wikipedia – Greater flamingo', W('Greater_flamingo'));

// DINOSAURS
add('dinosaurs', '🦴', 'Length', 'How long was Allosaurus?', 'Approximate length of a large adult Allosaurus.', 9.7, 'medium', 'Allosaurus lived in the Late Jurassic period.', 'Wikipedia – Allosaurus', W('Allosaurus'));
add('dinosaurs', '🛡️', 'Length', 'How long was Ankylosaurus?', 'Approximate length of an adult Ankylosaurus.', 6.0, 'medium', 'Ankylosaurus had heavy body armor and a powerful tail club.', 'Wikipedia – Ankylosaurus', W('Ankylosaurus'));
add('dinosaurs', '🦕', 'Length', 'How long was Parasaurolophus?', 'Approximate body length of an adult Parasaurolophus.', 9.5, 'hard', 'Its distinctive hollow head crest may have helped produce sounds.', 'Wikipedia – Parasaurolophus', W('Parasaurolophus'));

// SPACE & PLANETS
add('space', '🔵', 'Diameter', 'What is the equatorial diameter of Neptune?', 'Equatorial diameter of Neptune.', 49528000, 'medium', 'Neptune is the most distant recognised planet from the Sun.', 'NASA – Neptune Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html');
add('space', '🟦', 'Diameter', 'What is the equatorial diameter of Uranus?', 'Equatorial diameter of Uranus.', 51118000, 'medium', 'Uranus rotates on its side compared with most planets.', 'NASA – Uranus Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html');
add('space', '🧊', 'Diameter', 'What is the diameter of Pluto?', 'Mean diameter of dwarf planet Pluto.', 2377000, 'hard', 'Pluto is classified as a dwarf planet.', 'NASA – Pluto', 'https://science.nasa.gov/dwarf-planets/pluto/');
add('space', '🪐', 'Diameter', 'What is the equatorial diameter of Jupiter’s moon Ganymede?', 'Mean diameter of Ganymede, Jupiter’s largest moon.', 5268000, 'hard', 'Ganymede is larger than the planet Mercury in diameter.', 'NASA – Ganymede', 'https://science.nasa.gov/jupiter/moons/ganymede/');

// GEOGRAPHY
add('geography', '🏙️', 'Height', 'How tall is the Empire State Building?', 'Architectural height including its antenna.', 443.2, 'medium', 'The Empire State Building opened in 1931.', 'Wikipedia – Empire State Building', W('Empire_State_Building'));
add('geography', '🏢', 'Height', 'How tall is Taipei 101?', 'Architectural height of Taipei 101.', 508, 'medium', 'Taipei 101 was the world’s tallest building from 2004 to 2010.', 'Wikipedia – Taipei 101', W('Taipei_101'));
add('geography', '💧', 'Height', 'How tall is Angel Falls?', 'Approximate total height of Angel Falls in Venezuela.', 979, 'hard', 'Angel Falls is widely recognised as the world’s highest uninterrupted waterfall.', 'Wikipedia – Angel Falls', W('Angel_Falls'));
add('geography', '🏔️', 'Height', 'How tall is K2?', 'Elevation of K2 above sea level.', 8611, 'hard', 'K2 is the second-highest mountain on Earth.', 'Wikipedia – K2', W('K2'));

// VEHICLES
add('vehicles', '🚗', 'Length', 'How long is a Tesla Model 3?', 'Approximate overall length of a recent Tesla Model 3.', 4.72, 'easy', 'The Model 3 is a mid-size electric sedan.', 'Wikipedia – Tesla Model 3', W('Tesla_Model_3'));
add('vehicles', '🛻', 'Length', 'How long is a Ford F-150?', 'Approximate overall length of a full-size Ford F-150 pickup configuration.', 5.89, 'medium', 'The F-150 has been one of the best-selling pickup trucks in the United States.', 'Wikipedia – Ford F-Series', W('Ford_F-Series'));
add('vehicles', '🚄', 'Length', 'How long is a Shinkansen train set?', 'Approximate length of a 16-car Tokaido Shinkansen train set.', 400, 'hard', 'A 16-car Shinkansen train can be about 400 metres long.', 'Wikipedia – Shinkansen', W('Shinkansen'));
add('vehicles', '🚁', 'Length', 'How long is a Boeing CH-47 Chinook helicopter?', 'Overall length including rotors, approximately.', 30.1, 'hard', 'The Chinook uses tandem rotors instead of a tail rotor.', 'Wikipedia – Boeing CH-47 Chinook', W('Boeing_CH-47_Chinook'));

// EVERYDAY OBJECTS
add('everyday-objects', '📱', 'Length', 'How tall is a typical smartphone?', 'Approximate height of a modern large-screen smartphone.', 0.16, 'easy', 'Smartphone dimensions vary by model and screen size.', 'Wikipedia – Smartphone', W('Smartphone'));
add('everyday-objects', '📏', 'Length', 'How long is a standard 30 cm ruler?', 'Length of a common classroom ruler.', 0.30, 'easy', 'A 30 cm ruler is also close to one foot long.', 'Wikipedia – Ruler', W('Ruler'));
add('everyday-objects', '🚪', 'Height', 'How tall is a standard interior door?', 'Approximate height of a common interior door.', 2.03, 'medium', 'Door sizes vary by country and building standards.', 'Wikipedia – Door', W('Door'));
add('everyday-objects', '🎸', 'Length', 'How long is a full-size acoustic guitar?', 'Approximate overall length of a full-size acoustic guitar.', 1.0, 'hard', 'Full-size acoustic guitar dimensions vary by body style.', 'Wikipedia – Acoustic guitar', W('Acoustic_guitar'));

const CATEGORIES = [
  { slug: 'animals', name: 'Animals', short: 'Animals', target: 100, path: '/animals', icon: '🐯', grad: 'linear-gradient(145deg,#1c6b3a,#0b2d1b)', desc: 'From the blue whale to the bee hummingbird – how big is the animal kingdom, really?' },
  { slug: 'dinosaurs', name: 'Dinosaurs', short: 'Dinosaurs', target: 60, path: '/dinosaurs', icon: '🦖', grad: 'linear-gradient(145deg,#9a4a1d,#2f1708)', desc: 'Giants of the Mesozoic. Can you tell a Velociraptor from a Diplodocus by size?' },
  { slug: 'space', name: 'Space & Planets', short: 'Space & Planets', target: 60, path: '/space', icon: '🪐', grad: 'linear-gradient(145deg,#5b2bb8,#1a0b45)', desc: 'Planets, the Moon and the Sun – sizes that stretch your intuition.' },
  { slug: 'geography', name: 'Geography & Countries', short: 'Geography & Countries', target: 100, path: '/geography', icon: '🌍', grad: 'linear-gradient(145deg,#1f6fb8,#07224a)', desc: 'Mountains, rivers, canyons and landmarks from around the world.' },
  { slug: 'vehicles', name: 'Vehicles', short: 'Vehicles', target: 80, path: '/vehicles', icon: '🏎️', grad: 'linear-gradient(145deg,#b3202f,#33060c)', desc: 'Airliners, ships and rockets – the biggest machines humans have built.' },
  { slug: 'everyday-objects', name: 'Everyday Objects', short: 'Everyday Objects', target: 100, path: '/everyday-objects', icon: '🏀', grad: 'linear-gradient(145deg,#c47a12,#3a2305)', desc: 'Balls, cards and paper – familiar things you may still misjudge.' },
];

module.exports = { QUESTIONS: Q, CATEGORIES };
