# Question-bank duplicate and overlap audit

Updated: 27 November 2026  
Branch: `upgrade/route-seo-light-theme`

## Findings from the original 100-record bank

The original data file contains repeated subject/measurement facts under different wording. These are examples confirmed by inspecting the question entries (not an automated exhaustive classification):

| Subject | Measurement overlap | Notes |
|---|---|---|
| Giraffe | Height | Original question and later “can stand” wording; both use 5.5 m. |
| African elephant | Height | Original height and shoulder-height phrasing are closely overlapping, though definitions differ slightly. |
| Emperor penguin | Height | Repeated height fact, both around 1.15 m. |
| Tyrannosaurus rex | Length | Same commonly cited 12.3 m specimen/estimate under different title wording. |
| Triceratops | Length | Repeated ~9 m adult estimate. |
| Stegosaurus | Length | Repeated ~9 m adult estimate. |
| Velociraptor | Length | Repeated length estimate with different rounding/description. |
| Earth, Mars, Venus, Mercury | Diameter | Mean/equatorial variants are not always distinguished consistently; must retain only clearly defined, intentionally different measurements. |
| Eiffel Tower, Burj Khalifa, Statue of Liberty | Height | Same landmark height rephrased. |
| Grand Canyon | Depth | Similar maximum-depth fact appears twice; verify that the endpoints/definition are genuinely distinct before retaining both. |
| Airbus A380 | Length and wingspan | The A380 is represented with near-identical variant-specific questions and rounded values. Keep one canonical figure per stated model/measurement unless the variant materially changes it. |
| Titanic | Length | Repeated overall-length fact under two names. |
| Tennis ball, basketball, football | Diameter | Multiple size/standard formulations overlap; official standard and size class must be specified. |
| Bank card / credit card | Length | Same ISO ID-1 long-edge dimension. |

## Safe cleanup policy

- Do **not** blindly delete rows or renumber question IDs: existing game/account progress may store question IDs.
- Keep a stable ID for each retained question; if a duplicate is retired, exclude it from new rounds through a deliberate compatibility-safe mechanism and preserve historical result lookups.
- Where two entries genuinely measure different boundaries (for example, mean vs equatorial diameter, or figure vs pedestal-inclusive height), keep both only if the title, definition and source make that distinction explicit.
- Replace retired duplicates with new, source-backed facts rather than simply shrinking the bank.
- Automated tests currently enforce unique IDs and normalized titles, but that is not sufficient to detect same-subject duplicate facts. A manual subject-and-measurement audit is still required.

## Current status

The bank has reached 260 records after eight 20-record source-backed additions. Batch 8 adds official bridge, canal and dam dimensions with explicit span/length/height/depth definitions. Batch 7 adds NPS/Smithsonian/NOAA wildlife dimensions with measurement and sex qualifiers. Batch 6 adds NOAA Fisheries marine mammal and shark length ranges with species/sex/source qualifiers. Batch 5 adds NOAA, Smithsonian National Zoo and NPS animal dimensions with qualifiers for range, sex and measurement boundaries. Batch 4 adds 20 NASA/JPL satellite dimensions with explicit mean-radius/equivalent-diameter qualifications. Batch 3 adds NPS-listed Statue of Liberty component dimensions and Boeing 777/767 technical dimensions. This document flags confirmed overlap examples; it does **not** claim the entire 140-record bank has been exhaustively deduplicated or fact-checked.


## First programmatic candidate scan (27 November 2026)

A text-pattern scan of the legacy bank and all eight expansion files found exact same-category/same-measurement/same-value groups. This is a **candidate report**, not a final duplicate verdict: equal values across different species or objects are not duplicates, and equal values with different measurement boundaries may be intentional. One legacy record did not match the scan's simple parser, so the scan is not yet a complete count of every entry.

### Same-subject candidates requiring disposition

| Subject | Measurement | Repeated value | Candidate wording / distinction |
|---|---|---:|---|
| Giraffe | Height | 5.5 m | “tallest male giraffe” vs “can a giraffe stand”; definitions should be reconciled |
| Emperor penguin | Height | 1.15 m | “typical standing height” vs “how tall”; likely same fact |
| Tyrannosaurus rex | Length | 12.3 m | “Sue” specimen vs “large adult”; same value but specimen-specific wording differs |
| Stegosaurus | Length | 9 m | General vs adult wording; likely duplicate estimate |
| Triceratops | Length | 9 m | General vs adult wording; likely duplicate estimate |
| Earth | Diameter | 12,742 km | Same mean-diameter fact with alternate title |
| Mars | Diameter | 6,779 km | Equatorial vs mean wording uses the same value; definition/value mismatch must be checked |
| Mercury | Diameter | 4,879 km | Mean diameter repeated under alternate title |
| Venus | Diameter | 12,104 km | Mean diameter repeated under alternate title |
| Eiffel Tower | Height | 330 m | Current antenna / antenna-inclusive height wording repeated |
| Burj Khalifa | Height | 828 m | Architectural height repeated under alternate title |
| Statue of Liberty | Height | 93 m | Ground-to-torch definition repeated; verify whether both use identical endpoints |
| RMS Titanic | Length | 269.1 m | “Titanic” vs “RMS Titanic”; same overall-length fact |
| Size-5 association football | Diameter | 0.22 m | “soccer ball” vs “football”; same size class and approximate value |
| ID-1 bank/credit card | Length | 0.0856 m | Same standard long-edge dimension |
| Tennis ball | Diameter | 0.067 m | General vs “standard” wording; same rounded value |

### Important false-positive filter

The scan also surfaced equal numeric values for unrelated animals/aircraft/moons. Those are **not duplicates** simply because their metres values match. Keep them unless the subject, dimension and definition also overlap. Distinct aircraft variants and distinct wildlife species must not be collapsed based on value alone.

### Data-integrity finding

Legacy question IDs are generated from category order (for example, animals-001) rather than declared as explicit immutable IDs. Therefore, do not reorder or remove legacy entries during cleanup: that could change IDs and affect saved history. Expansion entries have explicit IDs. Before retiring a legacy duplicate, add a compatibility-safe explicit-ID migration or exclusion layer and test historical-result lookup.

### Next audit pass

1. Match candidates by entity + measured dimension + endpoints/qualifier, not by value alone.
2. Confirm source and numeric value for both records.
3. Mark each pair **keep-distinct**, **merge for new rounds**, or **replace with a verified new fact**.
4. Preserve the old ID mapping for historical results.
5. Add regression tests for duplicate policy and stable IDs before changing the live selection pool.


## Stable ID preparation completed

The 100 legacy records have now been converted from category-order-generated IDs to explicit ID strings on the upgrade branch. The generated values were preserved exactly. A JSON snapshot at `tests/fixtures/legacy-question-ids.json` and a regression test now pin the complete legacy ID-to-title mapping, so future edits that shift IDs or reassign a saved-history reference fail the test. No questions have been removed, renamed, or excluded from new rounds in this pass.

Candidate IDs from the legacy pairs above:

| Candidate | Existing ID | Alternate ID |
|---|---|---|
| Giraffe height | animals-002 | animals-013 |
| Emperor penguin height | animals-004 | animals-016 |
| T. rex length | dinosaurs-001 | dinosaurs-011 |
| Stegosaurus length | dinosaurs-006 | dinosaurs-012 |
| Triceratops length | dinosaurs-002 | dinosaurs-013 |
| Earth diameter | space-001 | space-014 |
| Mars diameter | space-004 | space-015 |
| Mercury diameter | space-007 | space-017 |
| Venus diameter | space-008 | space-016 |
| Eiffel Tower height | geography-002 | geography-016 |
| Burj Khalifa height | geography-003 | geography-015 |
| Statue of Liberty height | geography-004 | geography-017 |
| Titanic length | vehicles-005 | vehicles-018 |
| Size-5 football diameter | everyday-objects-002 | everyday-objects-016 |
| Credit/bank card length | everyday-objects-004 | everyday-objects-017 |
| Tennis ball diameter | everyday-objects-006 | everyday-objects-014 |


## Disposition pass completed on 27 November 2026

The 16 same-subject / same-measurement candidates in the first scan have now been assigned a conservative new-round policy. Their original question records and stable IDs remain in the complete bank so previously saved results and direct historical lookup are not broken. They are excluded only from fresh question selection, daily challenge generation, and new multiplayer rounds by `data/question-policy.js`.

- **Excluded from new rounds:** `animals-013`, `animals-016`, `dinosaurs-011`, `dinosaurs-012`, `dinosaurs-013`, `space-004`, `space-014`, `space-016`, `space-017`, `geography-015`, `geography-016`, `geography-017`, `vehicles-018`, `everyday-objects-014`, `everyday-objects-016`, `everyday-objects-017`.
- **Kept for new rounds:** the corresponding canonical legacy entries, except Mars: legacy `space-004` calls 6,779 km an equatorial diameter, although that stored value is the mean diameter. It is retired; the expansion `space-015` clearly identifies the mean diameter.
- **No rows deleted, no IDs renumbered, and no historical records erased.**

Automated regression coverage verifies that every retired ID still exists in the full question bank, none is in the active pool, and the policy currently contains exactly 16 IDs. The bank remains 260 records; the active pool is 244. This is a duplicate-selection cleanup, **not** a claim that every remaining record has been independently fact-checked or that the 500-question goal is complete.
