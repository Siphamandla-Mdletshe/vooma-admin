# Dashboard reference assets

The dashboard follows `vooma Admin Dashboard UI Collage.png`, supplied by the user. Its navy sidebar, blue selected navigation and controls, white cards, table layouts, status badges, and January 2025 sample data are implemented as React components and CSS. Payments, Reports, and Settings extend the same styling.

## Generated image

- Project asset: `public/images/admin-portraits-vehicles.webp`
- Method: built-in image generation using the supplied collage as a visual reference.
- Contents: nine fictional portraits and three vehicle thumbnails, arranged in a four-column, three-row sheet. CSS selects each cell without extra image requests.
- Format: 1254 x 1254 WebP, quality 86, approximately 138 KB.
- These are recreated assets, not pixel-exact copies of the reference photographs.

## Final generation prompt

Produce a production asset contact sheet for the Vooma admin UI in the attached reference. Output a square image with exactly FOUR equal columns and THREE equal rows, 12 rectangular cells, no gaps, no border, no text or labels. Each cell has a uniform very light cool gray #f3f5f7 studio background. Every subject fits inside its cell with plenty of space. First 9 cells are realistic studio headshot profile photographs of fictional Cameroon adults, clean sharp faces, shoulders visible, centered, smiling naturally, similar to reference profile thumbnails. Row1 col1: Black male 35 with short hair short beard and charcoal collared shirt, matching Olivier profile. Row1 col2 Black woman 30 short natural hair olive blouse, Claire. Row1 col3 Black male 30 short hair slight beard blue shirt, Jean. Row1 col4 Black woman 30 shoulder-length black hair dark blouse, Sandra. Row2 col1 Black woman 30 natural hair mustard blouse, Aminata. Row2 col2 Black male 35 short hair beard white shirt, Paul. Row2 col3 Black woman 28 medium-length hair blue blouse, Marie. Row2 col4 Black male 30 clean shaven navy shirt, Guy. Row3 col1 Black male professional 35 navy suit white shirt portrait for administrator. Row3 col2 isolated white Toyota Corolla sedan front three-quarter view pointing left, whole car centered small enough to fit. Row3 col3 isolated white Kia Picanto compact hatchback front three-quarter view pointing left whole car centered. Row3 col4 isolated black and silver Yamaha commuter motorcycle side three-quarter view whole bike centered. Match understated realistic photography of thumbnail images in reference. No UI, no letters, no watermarks. Strict equal 4 by 3 grid, square overall image.

## Behaviour and verification

The data remains a local demo. Record totals, filtering, and ten-row pagination use deterministic sample datasets. Dashboard trend series and aggregate revenue are illustrative. Driver messages are demo drafts, and no external messages are sent. The account dropdown contains Settings and Sign out.

Verified with the TypeScript/Vite production build and Chromium browser checks: all nine sections; driver detail tabs; chart controls; global and record search; status/city/date filters; pagination through the final page; row selection; driver and ticket creation; driver suspension; vehicle approval; ticket status updates; message drafts; CSV download; profile settings; notifications; sign-out. Layouts checked at 1440, 1024, 768, 390, and 320 pixels wide, including mobile navigation. No browser runtime errors or page-level horizontal overflow were found.
