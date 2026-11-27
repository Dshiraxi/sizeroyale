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

The bank has reached 180 records after four 20-record source-backed additions. Batch 4 adds 20 NASA/JPL satellite dimensions with explicit mean-radius/equivalent-diameter qualifications. Batch 3 adds NPS-listed Statue of Liberty component dimensions and Boeing 777/767 technical dimensions. This document flags confirmed overlap examples; it does **not** claim the entire 140-record bank has been exhaustively deduplicated or fact-checked.
