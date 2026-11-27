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
function add(id, cat, icon, kind, title, description, meters, difficulty, fact, sourceName, sourceUrl) {
  n[cat] = (n[cat] || 0) + 1;
  Q.push({
    id,
    category: cat, icon, kind, title, description, meters, difficulty, fact, sourceName, sourceUrl,
  });
}

// ---------- ANIMALS ----------
add('animals-001', 'animals', '🐋', 'Length', 'How long is a blue whale?', 'Longest reliably measured adult blue whale, nose to tail tip.', 29.9, 'easy', 'Blue whales are the largest animals known to have ever lived.', 'Wikipedia – Blue whale', W('Blue_whale'));
add('animals-002', 'animals', '🦒', 'Height', 'How tall is the tallest male giraffe?', 'Standing height of a very tall adult male giraffe, ground to top of the head (ossicones).', 5.5, 'easy', 'Giraffes have seven neck vertebrae – the same number as humans.', 'Wikipedia – Giraffe', W('Giraffe'));
add('animals-003', 'animals', '🐘', 'Height', 'How tall is an African bush elephant?', 'Typical shoulder height of an adult male, ground to the top of the shoulder.', 3.2, 'medium', 'The African bush elephant is the largest living land animal.', 'Wikipedia – African bush elephant', W('African_bush_elephant'));
add('animals-004', 'animals', '🐧', 'Height', 'What is the typical standing height of an emperor penguin?', 'Standing height of an adult emperor penguin.', 1.15, 'medium', 'Emperor penguins are the largest of all penguin species.', 'Wikipedia – Emperor penguin', W('Emperor_penguin'));
add('animals-005', 'animals', '🦅', 'Wingspan', 'What is the wingspan of a wandering albatross?', 'Tip-to-tip wingspan of a large adult wandering albatross.', 3.5, 'medium', 'It has one of the largest wingspans of any living bird.', 'Wikipedia – Wandering albatross', W('Wandering_albatross'));
add('animals-006', 'animals', '🐊', 'Length', 'How long is a big saltwater crocodile?', 'Length of a large adult male saltwater crocodile, snout to tail tip.', 6.0, 'medium', 'The saltwater crocodile is the largest living reptile.', 'Wikipedia – Saltwater crocodile', W('Saltwater_crocodile'));
add('animals-007', 'animals', '🦈', 'Length', 'How long is a whale shark?', 'Maximum length of the largest fish alive, snout to tail tip.', 12.0, 'hard', 'The whale shark is the largest living fish, yet it eats plankton.', 'Wikipedia – Whale shark', W('Whale_shark'));
add('animals-008', 'animals', '🐦', 'Length', 'How long is a bee hummingbird?', 'Total length of an adult male bee hummingbird, bill to tail tip.', 0.055, 'hard', 'The bee hummingbird is the smallest living bird.', 'Wikipedia – Bee hummingbird', W('Bee_hummingbird'));

// ---------- DINOSAURS ----------
add('dinosaurs-001', 'dinosaurs', '🦖', 'Length', 'How long was Tyrannosaurus rex?', 'Length of "Sue", one of the most complete T. rex skeletons, snout to tail tip.', 12.3, 'easy', 'More time separates Stegosaurus from T. rex than T. rex from today.', 'Wikipedia – Tyrannosaurus', W('Tyrannosaurus'));
add('dinosaurs-002', 'dinosaurs', '🦕', 'Length', 'How long was Triceratops?', 'Estimated maximum body length of an adult Triceratops.', 9.0, 'medium', 'Its name means "three-horned face".', 'Wikipedia – Triceratops', W('Triceratops'));
add('dinosaurs-003', 'dinosaurs', '🦖', 'Length', 'How long was Velociraptor?', 'Estimated body length of Velociraptor mongoliensis.', 2.07, 'medium', 'Real Velociraptors were roughly turkey-sized, far smaller than in the movies.', 'Wikipedia – Velociraptor', W('Velociraptor'));
add('dinosaurs-004', 'dinosaurs', '🦕', 'Length', 'How long was Brachiosaurus?', 'Upper estimate of body length for Brachiosaurus altithorax.', 22.0, 'hard', 'Its front legs were longer than its back legs, giving it a giraffe-like posture.', 'Wikipedia – Brachiosaurus', W('Brachiosaurus'));
add('dinosaurs-005', 'dinosaurs', '🦕', 'Length', 'How long was Diplodocus?', 'Upper estimate of body length for Diplodocus carnegii.', 26.0, 'hard', 'Diplodocus is among the longest dinosaurs known from fairly complete skeletons.', 'Wikipedia – Diplodocus', W('Diplodocus'));
add('dinosaurs-006', 'dinosaurs', '🦖', 'Length', 'How long was Stegosaurus?', 'Estimated maximum body length of Stegosaurus.', 9.0, 'medium', 'Stegosaurus lived about 150 million years ago, long before T. rex.', 'Wikipedia – Stegosaurus', W('Stegosaurus'));
add('dinosaurs-007', 'dinosaurs', '🐊', 'Length', 'How long was Spinosaurus?', 'Commonly cited length estimate for Spinosaurus aegyptiacus.', 14.0, 'hard', 'Spinosaurus was likely semi-aquatic and is among the largest known predatory dinosaurs.', 'Wikipedia – Spinosaurus', W('Spinosaurus'));

// ---------- SPACE ----------
add('space-001', 'space', '🌍', 'Diameter', 'What is the diameter of Earth?', 'Mean diameter of Earth.', 12742000, 'easy', 'Earth is the largest of the four rocky planets.', 'NASA – Earth Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html');
add('space-002', 'space', '🌕', 'Diameter', 'What is the diameter of the Moon?', 'Mean diameter of the Moon.', 3474800, 'easy', 'The Moon is about 27% of Earth\'s diameter.', 'NASA – Moon Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html');
add('space-003', 'space', '🪐', 'Diameter', 'What is the equatorial diameter of Jupiter?', 'Equatorial diameter of Jupiter.', 142984000, 'medium', 'More than 1,300 Earths could fit inside Jupiter by volume.', 'NASA – Jupiter Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html');
add('space-004', 'space', '🔴', 'Diameter', 'What is the equatorial diameter of Mars?', 'Equatorial diameter of Mars.', 6779000, 'medium', 'Mars is roughly half the diameter of Earth.', 'NASA – Mars Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html');
add('space-005', 'space', '☀️', 'Diameter', 'What is the diameter of the Sun?', 'Mean diameter of the Sun.', 1392700000, 'medium', 'About 109 Earths would fit across the Sun\'s diameter.', 'NASA – Sun Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html');
add('space-006', 'space', '🪐', 'Diameter', 'What is the equatorial diameter of Saturn?', 'Equatorial diameter of Saturn, excluding its rings.', 120536000, 'hard', 'Saturn is the second-largest planet in the Solar System.', 'NASA – Saturn Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html');
add('space-007', 'space', '⚫', 'Diameter', 'What is the diameter of Mercury?', 'Mean diameter of Mercury.', 4879000, 'hard', 'Mercury is the smallest planet in the Solar System.', 'NASA – Mercury Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html');
add('space-008', 'space', '🟡', 'Diameter', 'What is the diameter of Venus?', 'Mean diameter of Venus.', 12104000, 'hard', 'Venus is nearly Earth\'s twin in size.', 'NASA – Venus Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html');
add('space-009', 'space', '🚀', 'Distance', 'How far is the Moon from Earth?', 'Average distance between the centers of Earth and the Moon.', 384400000, 'medium', 'Light takes about 1.3 seconds to travel from the Moon to Earth.', 'NASA – Moon Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html');

// ---------- GEOGRAPHY ----------
add('geography-001', 'geography', '🏔️', 'Height', 'How tall is Mount Everest?', 'Official elevation above sea level (China–Nepal 2020 survey).', 8848.86, 'easy', 'The 2020 joint survey added about 0.86 m to the earlier official height.', 'Wikipedia – Mount Everest', W('Mount_Everest'));
add('geography-002', 'geography', '🗼', 'Height', 'How tall is the Eiffel Tower?', 'Height including antennas.', 330, 'easy', 'It was completed in 1889 for the World\'s Fair in Paris.', 'Wikipedia – Eiffel Tower', W('Eiffel_Tower'));
add('geography-003', 'geography', '🏙️', 'Height', 'How tall is the Burj Khalifa?', 'Architectural height of the tallest building in the world.', 828, 'medium', 'It has been the world\'s tallest building since 2010.', 'Wikipedia – Burj Khalifa', W('Burj_Khalifa'));
add('geography-004', 'geography', '🗽', 'Height', 'How tall is the Statue of Liberty?', 'Height from ground level to the tip of the torch (including pedestal and foundation).', 93, 'medium', 'It was a gift from France, dedicated in 1886.', 'Wikipedia – Statue of Liberty', W('Statue_of_Liberty'));
add('geography-005', 'geography', '🌊', 'Length', 'How long is the Nile?', 'Commonly cited length of the Nile river (the longest-river ranking is debated).', 6650000, 'hard', 'Its length is often compared with the Amazon\'s, and sources disagree on which is longer.', 'Wikipedia – Nile', W('Nile'));
add('geography-006', 'geography', '🌋', 'Height', 'How tall is Mount Kilimanjaro?', 'Elevation of Uhuru Peak above sea level.', 5895, 'medium', 'Kilimanjaro is the highest mountain in Africa.', 'Wikipedia – Mount Kilimanjaro', W('Mount_Kilimanjaro'));
add('geography-007', 'geography', '🕳️', 'Depth', 'How deep is the Challenger Deep?', 'Approximate depth of the deepest known point of the oceans.', 10935, 'hard', 'It lies in the Mariana Trench in the western Pacific.', 'Wikipedia – Challenger Deep', W('Challenger_Deep'));
add('geography-008', 'geography', '🏜️', 'Length', 'How long is the Grand Canyon?', 'Length of the canyon along the Colorado River.', 446000, 'hard', 'The Grand Canyon is up to about 1.8 km deep.', 'Wikipedia – Grand Canyon', W('Grand_Canyon'));
add('geography-009', 'geography', '🔺', 'Height', 'How tall was the Great Pyramid of Giza?', 'Original height when completed (it is shorter today).', 146.6, 'medium', 'It stood as the tallest human-made structure for thousands of years.', 'Wikipedia – Great Pyramid of Giza', W('Great_Pyramid_of_Giza'));
add('geography-010', 'geography', '🗻', 'Height', 'How tall is Mount Fuji?', 'Elevation of the summit above sea level.', 3776, 'medium', 'Mount Fuji is the highest mountain in Japan.', 'Wikipedia – Mount Fuji', W('Mount_Fuji'));

// ---------- VEHICLES ----------
add('vehicles-001', 'vehicles', '✈️', 'Length', 'How long is a Boeing 747-400?', 'Overall fuselage length.', 70.6, 'medium', 'The 747 was the first wide-body airliner.', 'Wikipedia – Boeing 747', W('Boeing_747'));
add('vehicles-002', 'vehicles', '🛫', 'Length', 'How long is an Airbus A380?', 'Overall length of the A380-800.', 72.72, 'medium', 'The A380 is the largest passenger airliner ever built.', 'Wikipedia – Airbus A380', W('Airbus_A380'));
add('vehicles-003', 'vehicles', '🛩️', 'Wingspan', 'What is the wingspan of an Airbus A380?', 'Tip-to-tip wingspan.', 79.75, 'hard', 'Its wingspan is wider than a football field is long.', 'Wikipedia – Airbus A380', W('Airbus_A380'));
add('vehicles-004', 'vehicles', '✈️', 'Wingspan', 'What is the wingspan of a Boeing 747-400?', 'Tip-to-tip wingspan.', 64.4, 'hard', 'Its upper-deck "hump" was originally designed for a cargo nose door.', 'Wikipedia – Boeing 747', W('Boeing_747'));
add('vehicles-005', 'vehicles', '🚢', 'Length', 'How long was the Titanic?', 'Overall length of RMS Titanic.', 269.1, 'easy', 'Titanic sank in 1912 on its maiden voyage.', 'Wikipedia – Titanic', W('Titanic'));
add('vehicles-006', 'vehicles', '🚀', 'Length', 'How long is a Space Shuttle orbiter?', 'Overall length of the orbiter vehicle.', 37.24, 'hard', 'The Shuttle program flew 135 missions between 1981 and 2011.', 'Wikipedia – Space Shuttle', W('Space_Shuttle'));
add('vehicles-007', 'vehicles', '🚀', 'Height', 'How tall was the Saturn V rocket?', 'Total height of the Apollo-era launch vehicle with spacecraft.', 110.6, 'medium', 'Saturn V carried astronauts to the Moon.', 'Wikipedia – Saturn V', W('Saturn_V'));
add('vehicles-008', 'vehicles', '🛳️', 'Length', 'How long is the Queen Mary 2?', 'Overall length of the ocean liner.', 345, 'hard', 'It is one of the largest ocean liners ever built.', 'Wikipedia – Queen Mary 2', W('RMS_Queen_Mary_2'));
add('vehicles-009', 'vehicles', '✈️', 'Length', 'How long is a Boeing 737-800?', 'Overall fuselage length.', 39.5, 'medium', 'The 737 family is the best-selling commercial jet airliner.', 'Wikipedia – Boeing 737 Next Generation', W('Boeing_737_Next_Generation'));
add('vehicles-010', 'vehicles', '🚌', 'Length', 'How long is a typical full-size school bus?', 'Approximate overall length of a full-size US school bus (about 40 feet).', 12.2, 'easy', 'School buses come in several sizes; this is a representative full-size bus length.', 'Wikipedia – School bus', W('School_bus'));

// ---------- EVERYDAY OBJECTS ----------
add('everyday-objects-001', 'everyday-objects', '🏀', 'Diameter', 'What is the diameter of a basketball?', 'Diameter of an official men\'s basketball (29.5 in circumference).', 0.239, 'easy', 'The official circumference is 29.5 inches.', 'Wikipedia – Basketball (ball)', W('Basketball_(ball)'));
add('everyday-objects-002', 'everyday-objects', '⚽', 'Diameter', 'What is the diameter of a size-5 soccer ball?', 'Approximate diameter of a standard size-5 ball (68–70 cm circumference).', 0.22, 'medium', 'Size 5 is the standard ball for adult professional play.', 'Wikipedia – Football (ball)', W('Football_(ball)'));
add('everyday-objects-003', 'everyday-objects', '💵', 'Length', 'How long is a US dollar bill?', 'Long side of a US banknote.', 0.1556, 'easy', 'All US notes share the same size, about 6.14 × 2.61 inches.', 'Wikipedia – United States one-dollar bill', W('United_States_one-dollar_bill'));
add('everyday-objects-004', 'everyday-objects', '💳', 'Length', 'How long is a standard credit card?', 'Long side of an ISO/IEC 7810 ID-1 card.', 0.0856, 'medium', 'Bank cards, ID cards and many licenses use this same size.', 'Wikipedia – ISO/IEC 7810', W('ISO/IEC_7810'));
add('everyday-objects-005', 'everyday-objects', '📄', 'Length', 'How long is an A4 sheet of paper?', 'Long side of an A4 sheet (210 × 297 mm).', 0.297, 'easy', 'A4 belongs to the ISO 216 family, where each size halves to the next.', 'Wikipedia – ISO 216', W('ISO_216'));
add('everyday-objects-006', 'everyday-objects', '🎾', 'Diameter', 'What is the diameter of a tennis ball?', 'Approximate diameter within the official range of 6.54–6.86 cm.', 0.067, 'medium', 'The ITF allows a small range of sizes for official balls.', 'Wikipedia – Tennis ball', W('Tennis_ball'));
add('everyday-objects-007', 'everyday-objects', '✏️', 'Length', 'How long is a new standard pencil?', 'Typical length of a new, unsharpened US hexagonal pencil (7.5 in).', 0.1905, 'medium', 'Most pencils are hexagonal so they don\'t roll off desks.', 'Wikipedia – Pencil', W('Pencil'));
add('everyday-objects-008', 'everyday-objects', '⛳', 'Diameter', 'What is the diameter of a golf ball?', 'Minimum allowed diameter under golf rules (42.67 mm).', 0.04267, 'hard', 'Rules limit the minimum diameter, not the maximum.', 'Wikipedia – Golf ball', W('Golf_ball'));
add('everyday-objects-009', 'everyday-objects', '⚾', 'Length', 'How long can a baseball bat be?', 'Maximum bat length allowed in professional baseball (42 in).', 1.0668, 'hard', 'Professional bats must be one smooth, solid piece of wood.', 'Wikipedia – Baseball bat', W('Baseball_bat'));


/* ---------- EXTRA VARIETY: additional distinct comparisons ---------- */
// ANIMALS
add('animals-009', 'animals', '🦁', 'Length', 'How long is an adult male lion?', 'Approximate total body length of a large adult male lion, excluding the tail.', 2.5, 'medium', 'A lion’s tail adds further length beyond its head and body.', 'Wikipedia – Lion', W('Lion'));
add('animals-010', 'animals', '🐻‍❄️', 'Length', 'How long is a polar bear?', 'Approximate head-and-body length of a large adult polar bear.', 2.6, 'medium', 'Polar bears are the largest living bear species.', 'Wikipedia – Polar bear', W('Polar_bear'));
add('animals-011', 'animals', '🦍', 'Height', 'How tall is a silverback gorilla?', 'Approximate upright height of an adult male gorilla.', 1.7, 'medium', 'Adult male gorillas are called silverbacks because of the silver hair on their backs.', 'Wikipedia – Gorilla', W('Gorilla'));
add('animals-012', 'animals', '🦩', 'Height', 'How tall is a greater flamingo?', 'Approximate standing height of an adult greater flamingo.', 1.4, 'hard', 'The greater flamingo is the tallest and most widespread flamingo species.', 'Wikipedia – Greater flamingo', W('Greater_flamingo'));

// DINOSAURS
add('dinosaurs-008', 'dinosaurs', '🦴', 'Length', 'How long was Allosaurus?', 'Approximate length of a large adult Allosaurus.', 9.7, 'medium', 'Allosaurus lived in the Late Jurassic period.', 'Wikipedia – Allosaurus', W('Allosaurus'));
add('dinosaurs-009', 'dinosaurs', '🛡️', 'Length', 'How long was Ankylosaurus?', 'Approximate length of an adult Ankylosaurus.', 6.0, 'medium', 'Ankylosaurus had heavy body armor and a powerful tail club.', 'Wikipedia – Ankylosaurus', W('Ankylosaurus'));
add('dinosaurs-010', 'dinosaurs', '🦕', 'Length', 'How long was Parasaurolophus?', 'Approximate body length of an adult Parasaurolophus.', 9.5, 'hard', 'Its distinctive hollow head crest may have helped produce sounds.', 'Wikipedia – Parasaurolophus', W('Parasaurolophus'));

// SPACE & PLANETS
add('space-010', 'space', '🔵', 'Diameter', 'What is the equatorial diameter of Neptune?', 'Equatorial diameter of Neptune.', 49528000, 'medium', 'Neptune is the most distant recognised planet from the Sun.', 'NASA – Neptune Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html');
add('space-011', 'space', '🟦', 'Diameter', 'What is the equatorial diameter of Uranus?', 'Equatorial diameter of Uranus.', 51118000, 'medium', 'Uranus rotates on its side compared with most planets.', 'NASA – Uranus Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html');
add('space-012', 'space', '🧊', 'Diameter', 'What is the diameter of Pluto?', 'Mean diameter of dwarf planet Pluto.', 2377000, 'hard', 'Pluto is classified as a dwarf planet.', 'NASA – Pluto', 'https://science.nasa.gov/dwarf-planets/pluto/');
add('space-013', 'space', '🪐', 'Diameter', 'What is the equatorial diameter of Jupiter’s moon Ganymede?', 'Mean diameter of Ganymede, Jupiter’s largest moon.', 5268000, 'hard', 'Ganymede is larger than the planet Mercury in diameter.', 'NASA – Ganymede', 'https://science.nasa.gov/jupiter/moons/ganymede/');

// GEOGRAPHY
add('geography-011', 'geography', '🏙️', 'Height', 'How tall is the Empire State Building?', 'Architectural height including its antenna.', 443.2, 'medium', 'The Empire State Building opened in 1931.', 'Wikipedia – Empire State Building', W('Empire_State_Building'));
add('geography-012', 'geography', '🏢', 'Height', 'How tall is Taipei 101?', 'Architectural height of Taipei 101.', 508, 'medium', 'Taipei 101 was the world’s tallest building from 2004 to 2010.', 'Wikipedia – Taipei 101', W('Taipei_101'));
add('geography-013', 'geography', '💧', 'Height', 'How tall is Angel Falls?', 'Approximate total height of Angel Falls in Venezuela.', 979, 'hard', 'Angel Falls is widely recognised as the world’s highest uninterrupted waterfall.', 'Wikipedia – Angel Falls', W('Angel_Falls'));
add('geography-014', 'geography', '🏔️', 'Height', 'How tall is K2?', 'Elevation of K2 above sea level.', 8611, 'hard', 'K2 is the second-highest mountain on Earth.', 'Wikipedia – K2', W('K2'));

// VEHICLES
add('vehicles-011', 'vehicles', '🚗', 'Length', 'How long is a Tesla Model 3?', 'Approximate overall length of a recent Tesla Model 3.', 4.72, 'easy', 'The Model 3 is a mid-size electric sedan.', 'Wikipedia – Tesla Model 3', W('Tesla_Model_3'));
add('vehicles-012', 'vehicles', '🛻', 'Length', 'How long is a Ford F-150?', 'Approximate overall length of a full-size Ford F-150 pickup configuration.', 5.89, 'medium', 'The F-150 has been one of the best-selling pickup trucks in the United States.', 'Wikipedia – Ford F-Series', W('Ford_F-Series'));
add('vehicles-013', 'vehicles', '🚄', 'Length', 'How long is a Shinkansen train set?', 'Approximate length of a 16-car Tokaido Shinkansen train set.', 400, 'hard', 'A 16-car Shinkansen train can be about 400 metres long.', 'Wikipedia – Shinkansen', W('Shinkansen'));
add('vehicles-014', 'vehicles', '🚁', 'Rotor length', 'What is the operating rotor length of a CH-47 Chinook?', 'Tip-to-tip length of the tandem rotors while operating, as specified by Boeing; this is not the fuselage length.', 30.1, 'hard', 'The Chinook uses tandem rotors instead of a tail rotor.', 'Boeing – H-47 Chinook specifications', 'https://www.boeing.com/defense/military-rotorcraft/h-47-chinook');

// EVERYDAY OBJECTS
add('everyday-objects-010', 'everyday-objects', '📱', 'Length', 'How tall is a typical smartphone?', 'Approximate height of a modern large-screen smartphone.', 0.16, 'easy', 'Smartphone dimensions vary by model and screen size.', 'Wikipedia – Smartphone', W('Smartphone'));
add('everyday-objects-011', 'everyday-objects', '📏', 'Length', 'How long is a standard 30 cm ruler?', 'Length of a common classroom ruler.', 0.30, 'easy', 'A 30 cm ruler is also close to one foot long.', 'Wikipedia – Ruler', W('Ruler'));
add('everyday-objects-012', 'everyday-objects', '🚪', 'Height', 'How tall is a standard interior door?', 'Approximate height of a common interior door.', 2.03, 'medium', 'Door sizes vary by country and building standards.', 'Wikipedia – Door', W('Door'));
add('everyday-objects-013', 'everyday-objects', '🎸', 'Length', 'How long is a full-size acoustic guitar?', 'Approximate overall length of a full-size acoustic guitar.', 1.0, 'hard', 'Full-size acoustic guitar dimensions vary by body style.', 'Wikipedia – Acoustic guitar', W('Acoustic_guitar'));

// Additional size questions – measurements are approximate where stated; source pages are linked for review.
// ANIMALS
add('animals-013', 'animals', '🦒', 'Height', 'How tall can a giraffe stand?', 'Approximate height of a large adult giraffe.', 5.5, 'easy', 'Giraffes are the tallest living land animals.', 'Britannica – Giraffe', 'https://www.britannica.com/animal/giraffe');
add('animals-014', 'animals', '🐘', 'Height', 'How high is an African elephant at the shoulder?', 'Approximate shoulder height of a large adult African bush elephant.', 3.3, 'medium', 'African elephants are the largest living land animals.', 'Britannica – African elephant', 'https://www.britannica.com/animal/African-elephant');
add('animals-015', 'animals', '🦤', 'Height', 'How tall is an adult ostrich?', 'Approximate standing height of an adult ostrich.', 2.7, 'medium', 'The ostrich is the largest living bird.', 'Britannica – Ostrich', 'https://www.britannica.com/animal/ostrich');
add('animals-016', 'animals', '🐧', 'Height', 'How tall is an emperor penguin?', 'Approximate standing height of an adult emperor penguin.', 1.15, 'hard', 'The emperor penguin is the tallest and heaviest living penguin.', 'Australian Antarctic Program – Emperor penguins', 'https://www.antarctica.gov.au/about-antarctica/animals/penguins/emperor-penguins/');
// DINOSAURS
add('dinosaurs-011', 'dinosaurs', '🦖', 'Length', 'How long was a large adult Tyrannosaurus rex?', 'Approximate length of a large adult Tyrannosaurus rex.', 12.3, 'easy', 'T. rex was one of the largest known land predators.', 'Natural History Museum – T. rex', 'https://www.nhm.ac.uk/discover/dino-directory/tyrannosaurus.html');
add('dinosaurs-012', 'dinosaurs', '🛡️', 'Length', 'How long was an adult Stegosaurus?', 'Approximate length of an adult Stegosaurus.', 9, 'medium', 'Stegosaurus carried two rows of plates along its back.', 'Natural History Museum – Stegosaurus', 'https://www.nhm.ac.uk/discover/dino-directory/stegosaurus.html');
add('dinosaurs-013', 'dinosaurs', '🦏', 'Length', 'How long was an adult Triceratops?', 'Approximate length of an adult Triceratops.', 9, 'medium', 'Triceratops had three facial horns and a large bony frill.', 'Natural History Museum – Triceratops', 'https://www.nhm.ac.uk/discover/dino-directory/triceratops.html');
add('dinosaurs-014', 'dinosaurs', '🦕', 'Length', 'How long was a Velociraptor?', 'Approximate length of a Velociraptor, including its tail.', 2, 'hard', 'Velociraptor was much smaller than its portrayal in many films.', 'Natural History Museum – Velociraptor', 'https://www.nhm.ac.uk/discover/dino-directory/velociraptor.html');
// SPACE & PLANETS
add('space-014', 'space', '🌍', 'Diameter', 'What is Earth’s mean diameter?', 'Mean diameter of Earth.', 12742000, 'easy', 'Earth is slightly wider at the equator than from pole to pole.', 'NASA – Earth Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html');
add('space-015', 'space', '🔴', 'Diameter', 'What is Mars’s mean diameter?', 'Mean diameter of Mars.', 6779000, 'medium', 'Mars is often called the Red Planet because of iron oxide on its surface.', 'NASA – Mars Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html');
add('space-016', 'space', '🟡', 'Diameter', 'What is Venus’s mean diameter?', 'Mean diameter of Venus.', 12104000, 'medium', 'Venus is similar to Earth in size but has a very different atmosphere.', 'NASA – Venus Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html');
add('space-017', 'space', '☿️', 'Diameter', 'What is Mercury’s mean diameter?', 'Mean diameter of Mercury.', 4879000, 'hard', 'Mercury is the smallest planet in the Solar System.', 'NASA – Mercury Fact Sheet', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html');
// GEOGRAPHY & LANDMARKS
add('geography-015', 'geography', '🏙️', 'Height', 'What is the architectural height of Burj Khalifa?', 'Architectural height of the Burj Khalifa.', 828, 'easy', 'The Burj Khalifa is in Dubai, United Arab Emirates.', 'Burj Khalifa – Official website', 'https://www.burjkhalifa.ae/');
add('geography-016', 'geography', '🗼', 'Height', 'What is the Eiffel Tower’s height including its current antenna?', 'Height of the Eiffel Tower including its current antenna.', 330, 'medium', 'The Eiffel Tower is in Paris, France.', 'Eiffel Tower – Official website', 'https://www.toureiffel.paris/en/the-monument/key-figures');
add('geography-017', 'geography', '🗽', 'Height', 'What is the Statue of Liberty’s height to the torch?', 'Approximate height from ground level to the tip of the torch.', 93, 'hard', 'The Statue of Liberty stands on Liberty Island in New York Harbor.', 'National Park Service – Statue of Liberty', 'https://www.nps.gov/stli/learn/historyculture/statue-statistics.htm');
add('geography-018', 'geography', '🏞️', 'Depth', 'How deep is the Grand Canyon at its deepest point?', 'Approximate maximum depth from rim to river.', 1800, 'hard', 'The Colorado River runs through the Grand Canyon.', 'National Park Service – Grand Canyon', 'https://www.nps.gov/grca/learn/nature/grand-canyon.htm');
// VEHICLES
add('vehicles-015', 'vehicles', '✈️', 'Length', 'What is the overall length of an Airbus A380-800?', 'Overall length of the Airbus A380-800.', 72.7, 'medium', 'The A380 is a full-length double-deck passenger aircraft.', 'Airbus – A380', 'https://www.airbus.com/en/products-services/commercial-aircraft/passenger-aircraft/a380');
add('vehicles-016', 'vehicles', '✈️', 'Wingspan', 'What is the wingspan of the Airbus A380-800?', 'Wingspan of the Airbus A380-800.', 79.8, 'hard', 'The A380 has the largest passenger-carrying capacity of any airliner.', 'Airbus – A380', 'https://www.airbus.com/en/products-services/commercial-aircraft/passenger-aircraft/a380');
add('vehicles-017', 'vehicles', '🚌', 'Length', 'How long is a typical London double-decker bus?', 'Approximate length of a standard full-size double-decker city bus.', 10.9, 'easy', 'London buses come in several models and lengths.', 'Transport for London – Buses', 'https://tfl.gov.uk/modes/buses/');
add('vehicles-018', 'vehicles', '🚢', 'Length', 'How long was RMS Titanic?', 'Overall length of RMS Titanic.', 269.1, 'hard', 'Titanic was a British passenger liner that sank on its maiden voyage in 1912.', 'Encyclopaedia Britannica – Titanic', 'https://www.britannica.com/topic/Titanic');
// EVERYDAY OBJECTS & SPORTS EQUIPMENT
add('everyday-objects-014', 'everyday-objects', '🎾', 'Diameter', 'What is the diameter of a standard tennis ball?', 'Approximate diameter of a standard tennis ball.', 0.067, 'easy', 'Tennis balls must meet official size specifications.', 'International Tennis Federation – Rules of Tennis', 'https://www.itftennis.com/en/about-us/governance/rules-and-regulations/');
add('everyday-objects-015', 'everyday-objects', '🏀', 'Diameter', 'What is the diameter of a size 7 basketball?', 'Approximate outside diameter of a regulation men’s basketball.', 0.24, 'medium', 'A regulation size 7 basketball is used in men’s competitions.', 'FIBA – Official Basketball Rules', 'https://www.fiba.basketball/documents/official-basketball-rules');
add('everyday-objects-016', 'everyday-objects', '⚽', 'Diameter', 'What is the diameter of a size 5 football?', 'Approximate diameter of a regulation size 5 association football.', 0.22, 'medium', 'Size 5 is the standard adult match ball size.', 'FIFA – Football Technology', 'https://www.fifa.com/technical/football-technology');
add('everyday-objects-017', 'everyday-objects', '💳', 'Length', 'How long is a standard bank card?', 'Long edge of a standard ID-1 bank card.', 0.0856, 'hard', 'The ID-1 format is commonly used for bank cards and identity cards.', 'ISO – Identification cards (ISO/IEC 7810)', 'https://www.iso.org/standard/70483.html');

const CATEGORIES = [
  { slug: 'animals', name: 'Animals', short: 'Animals', target: 100, path: '/animals', icon: '🐯', grad: 'linear-gradient(145deg,#1c6b3a,#0b2d1b)', desc: 'From the blue whale to the bee hummingbird – how big is the animal kingdom, really?' },
  { slug: 'dinosaurs', name: 'Dinosaurs', short: 'Dinosaurs', target: 60, path: '/dinosaurs', icon: '🦖', grad: 'linear-gradient(145deg,#9a4a1d,#2f1708)', desc: 'Giants of the Mesozoic. Can you tell a Velociraptor from a Diplodocus by size?' },
  { slug: 'space', name: 'Space & Planets', short: 'Space & Planets', target: 60, path: '/space', icon: '🪐', grad: 'linear-gradient(145deg,#5b2bb8,#1a0b45)', desc: 'Planets, the Moon and the Sun – sizes that stretch your intuition.' },
  { slug: 'geography', name: 'Geography & Countries', short: 'Geography & Countries', target: 100, path: '/geography', icon: '🌍', grad: 'linear-gradient(145deg,#1f6fb8,#07224a)', desc: 'Mountains, rivers, canyons and landmarks from around the world.' },
  { slug: 'vehicles', name: 'Vehicles', short: 'Vehicles', target: 80, path: '/vehicles', icon: '🏎️', grad: 'linear-gradient(145deg,#b3202f,#33060c)', desc: 'Airliners, ships and rockets – the biggest machines humans have built.' },
  { slug: 'everyday-objects', name: 'Everyday Objects', short: 'Everyday Objects', target: 100, path: '/everyday-objects', icon: '🏀', grad: 'linear-gradient(145deg,#c47a12,#3a2305)', desc: 'Balls, cards and paper – familiar things you may still misjudge.' },
];

Q.push(...require('./question-expansion'));
Q.push(...require('./question-expansion-2'));
Q.push(...require('./question-expansion-3'));
Q.push(...require('./question-expansion-4'));
Q.push(...require('./question-expansion-5'));
Q.push(...require('./question-expansion-6'));
Q.push(...require('./question-expansion-7'));
Q.push(...require('./question-expansion-8'));

module.exports = { QUESTIONS: Q, CATEGORIES };
