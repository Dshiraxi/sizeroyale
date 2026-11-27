# SizeRoyale factual and PWA audit

Updated: 27 November 2026  
Branch: `upgrade/route-seo-light-theme`

## Dataset inventory

- 200 question records are now present: the original 100 plus five curated 20-record expansion batches.
- Every record has a positive canonical meter value, measurement kind, definition, named source and HTTPS source URL.
- Question IDs and normalized question titles are checked for uniqueness by `tests/questions.test.js`.
- The bank still contains a number of repeated subjects/near-duplicate facts (for example, multiple wordings for the same dinosaur or planet measurement). Unique titles do not make those independent facts. These should be consolidated or replaced with separately sourced facts before describing the entire bank as 120 distinct facts.
- A large share of the existing citations point to Wikipedia pages. Those are useful starting references, but are not primary sources. This pass does not certify every one of the original 100 values. The older records that still cite Wikipedia remain flagged for a source-by-source audit.

## First curated expansion (20 records)

Added 20 questions using NASA mission reference data, National Park Service monument measurements, Smithsonian Ocean giant-squid measurements, and Airbus published aircraft specifications. Each entry states its measurement boundary/approximation and links the source. New records are isolated in `data/question-expansion.js` and appended to the existing bank; no existing scores, APIs or question values were changed by this addition. Automated checks now require 120 total records and verify the 20 expansion IDs and approved source hosts. This validates structure and source provenance, not an independent remeasurement of every source value.

## Second curated expansion (20 records)

Added 10 Boeing/Airbus aircraft dimensions and 10 planetary satellite diameters. Aircraft values are sourced from manufacturer technical tables; satellite mean diameters are calculated as twice the mean radii in NASA/JPL's physical-parameter tables, with the calculation and irregular-shape caveat in the question definition. These are source-backed additions; the project still needs a full cross-bank duplicate review and fact-by-fact verification of legacy records.

## Third curated expansion (20 records)

Added 10 component dimensions from the National Park Service Statue of Liberty statistics table and 10 Boeing 777/767 aircraft dimensions from Boeing's published technical specification pages. The question definitions distinguish component/variant measurements rather than presenting them as one generic height or length.

## Fourth curated expansion (20 records)

Added 20 satellite diameter questions using NASA/JPL physical-parameter tables and NASA's Pluto system fact sheet. For irregular small moons, the questions state when the value is a volume-equivalent diameter derived from mean radius or an approximate published dimension. These are useful measurement distinctions, but they are not a substitute for full cross-bank deduplication.

## Fifth curated expansion (20 records)

Added 20 wildlife size questions sourced from NOAA Fisheries, Smithsonian’s National Zoo and the National Park Service. Definitions state whether the value is a maximum, upper end of a published range, sex-specific average, body-only length or tail/component length. Because biological size varies, these questions use the stated source bounds rather than claiming universal exact sizes.

## Corrections made in this pass

- CH-47 Chinook: the 30.1 m Boeing figure is **“Length of Rotors While Operating”**, not the helicopter fuselage/overall vehicle length. The question now identifies it as operating rotor length, changes the measurement kind to `Rotor length`, explains the measurement boundary and cites Boeing directly:
  https://www.boeing.com/defense/military-rotorcraft/h-47-chinook

## Selected source checks completed

The following selected records were checked against the cited or an authoritative source during this pass:

| Record | Stored value | Check |
|---|---:|---|
| Eiffel Tower current height | 330 m | Official Eiffel Tower site lists 1,083 ft (about 330 m): https://www.toureiffel.paris/en/the-monument/key-figures |
| Statue of Liberty, ground to torch | 93 m | US National Park Service lists 305 ft 1 in / 92.99 m: https://www.nps.gov/stli/learn/historyculture/statue-statistics.htm |
| Challenger Deep | 10,935 m | NOAA Ocean Exploration reports 10,935 m and notes uncertainty in deep-ocean estimates: https://oceanexplorer.noaa.gov/ocean-fact/ocean-depth/ |
| Airbus A380 wingspan | 79.75–79.8 m | Airbus product information rounds to 79.8 m; Airbus technical data lists 79.75 m: https://www.airbus.com/en/products-services/commercial-aircraft/passenger-aircraft/a380 and https://www.aircraft.airbus.com/sites/default/files/2025-12/AC_A380_20251201.pdf |
| Tennis ball diameter | 0.067 m | ITF rules specify 6.54–6.86 cm for standard ball types; 6.7 cm is a representative midpoint, not a universal exact size: https://www.itftennis.com/media/7221/2024-rules-of-tennis-english.pdf |
| CH-47 Chinook operating rotor length | 30.1 m | Boeing distinguishes 30.1 m operating rotor length from 15.6 m fuselage length: https://www.boeing.com/defense/military-rotorcraft/h-47-chinook |

## Remaining factual work

- Review all remaining Wikipedia-cited records against primary sources, museum/agency/standards bodies or established reference institutions.
- Resolve repeated subjects and measurements so the bank contains distinct questions, not just differently worded duplicates.
- Recheck measurements that vary by model, sex, age, configuration, record-holder or measurement convention. Keep those qualifiers in the title/definition.
- Do not increase the question count to 500 by inventing measurements or copying unsourced values.

## PWA changes and checks

- Manifest theme and background colors now match the light theme (`#F5F8FC`).
- Service-worker cache version was bumped to `sizeroyale-v10`.
- `/lib/comparison.js` was added to the precache shell so the comparison feature is available in the cached app shell.
- Offline fallback page now uses the light theme.
- Browser smoke test now checks manifest values, service-worker response, cache version and comparison-helper precache entry.

## Scope / limitations

This is a selected factual review plus automated dataset integrity checks, not a full independent verification of every fact. Browser automation checks the PWA manifest and service-worker shell configuration, but does not replace a real install/offline test on physical Android/iOS devices. No production deployment or merge was performed.
