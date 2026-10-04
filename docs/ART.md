# Dark Chronicle pixel illustrations

The current illustrations were generated on October 4, 2026 with the built-in
image_gen tool. The user approved the detailed pixel Keeper's Office, requested
a dark exterior through its doorway, then directed the same style for the other
three pictures and a mechanically credible Oil Press handle. This establishes
**Dark Chronicle pixel art** as the current direction. The October 2 realistic
batches and their prompts below are historical records, not style references.
No CLI/API fallback or runtime image service is used.

The user subsequently approved the Smithy, Sealed Chamber and Awakening batch,
then requested no people in the pictures: workstations and discoveries by
themselves. The entire seven-image set follows this rule, including removal of
the earlier Oil Press worker and cistern hand. Unoccupied framing is an
atmospheric choice, not new lore about vanished or absent inhabitants.

## Approved direction and reference

Use `public/art/keeper-office.webp`, with the dark doorway, as the style anchor.
Keep realistic proportions and perspective, rich amber oil-lamp light, dirty
brown materials, charcoal shadows, restrained ivory highlights, intimate
viewpoints and meaningful surrounding darkness. The rendering medium is
detailed pixel art: visible square clusters, stepped contours, discrete shading
ramps and selective detail. All objects, surfaces and lighting belong
to the same pixel treatment. Avoid chibi proportions, low-detail cartoon
sprites, photographic patches, blur, painterly strokes and mosaic-filtered
realistic images. No people, body parts, portraits or human silhouettes are
depicted; life is implied by useful tools and traces of work. Held objects
must rest naturally on surfaces when a figure is removed. The art change does
not require retro fonts or pixel styling
for the terminal interface.

Wear is material-specific and selective: wood marks follow fibers; stone has
quiet faces between irregular worn patches; cloth retains folds and believable
weight. Avoid uniform stippling and all-over texture noise. Use the approved
office for pixel density and palette rather than returning to the realistic
assets or superseded smoothing trials.

Ordinary human work must remain understandable. In the Oil Press, the horizontal
turning bar connects to a rotating hub on the vertical screw below the fixed
upper beam. Its grip is reachable; pushing it around the screw
axis turns the screw through the stationary threaded beam and lowers the
compression platen. A handle attached to a fixed post or beam is incorrect.
This is ordinary craft, not an explanation of ancient infrastructure.

The full conversion prompts and generated source filenames are recorded in
[the pixel prompt set](ART_PIXEL_PROMPTS.md). All generation used the built-in
image_gen tool.
The final people-free edits and new scenes are documented in
[the unoccupied-scene prompt set](ART_UNOCCUPIED_PROMPTS.md). Earlier figure
studies are superseded and must not guide new artwork.

## Assets and triggers

| Asset in public/art | Chronicle record | Accomplishment | Bytes |
|---|---|---|---|
| keeper-office.webp | appointment | Fresh save | 142070 |
| oil-press.webp | oil-press-built | First construction | 193498 |
| lamp-examination.webp | lamp-examination | Completed examination | 107092 |
| cistern-find.webp | cistern-find | First expedition return | 189392 |
| smithy.webp | smithy-built | First construction | 156420 |
| sealed-chamber.webp | chamber-opened | Completed opening | 159130 |
| junction-awakened.webp | junction-awakened | Deliberate awakening, after its staged passages | 118640 |

All seven files are 1200×900 WebP images, resized without cropping using Sharp's
nearest-neighbor kernel to preserve pixel edges, then encoded at quality 82
with smart chroma subsampling (Sharp is already present through Next.js).
Combined size is 1066242 bytes. Original PNGs remain in the image tool's
generated-images directory; only final optimized assets are served. The
existing service-worker builder precaches them and changes its cache hash
when artwork changes. No save migration is needed.

Initial October 4 conversion validation: inspected each generated image and its 350-pixel-wide
preview. The office reveal also loaded correctly in the production game at a
390×844 browser viewport, displaying at 350×262.5 with no console warnings or
errors. All 25 illustration tests, the type check and the static production
build passed; the generated offline shell includes all four artwork paths.

The completed seven-image batch passed `npm run check` (lint, type checking and
167 tests) and `npm run build`. All seven final files are present in the static
export and offline shell. Smithy, Sealed Chamber and Awakening reveals were
reviewed in the production preview at 390×844; their images loaded and controls
remained usable, with scrolling available for the long finale caption. The
Awakening image appeared only after all three staged passages. Dismissal
persisted across reload, and the browser reported no warnings or errors.
These browser checks do not establish iPhone Safari or installed-PWA behavior.

The user subsequently requested a Sealed Chamber revision because the closure
looked odd. Its revised slab has a clearer fitted surround and larger profile,
quieter soot-black material and a simple rope sling instead of a drilled
eye-bolt. The bench-like interior shape is reduced to a faint wall fragment;
the nearest threshold remains visible and the chamber stays concealed.
Inspected the final source and 350-pixel-wide served preview. The hidden
turning point is not illustrated or explained. See the exact edits and content
authority in [the chamber revision prompts](ART_CHAMBER_REVISION.md).
The revision passed the type check, all 26 illustration tests and static
production build. Its exported bytes match the served asset, and the generated
offline shell includes the revised file with a new cache hash.

The approved pixel office was the style reference for each new scene/redraw; the
previous realistic scene supplied its subject and composition. The lamp's
earlier bowl-shaped housing was rejected because it could imply an oil
reservoir. The pixel replacement preserves the shallow upright fixture, pale
unlit lining, descending seam and narrative limits. The discarded lamp is not
shipped. The office keeps the Keeper undefined and the exterior dark.

## Narrative review

All seven images omit people and body parts, leaving the Keeper's and other
characters' appearances undefined. Oil Press and Smithy show established
ordinary workstations and functional tools. The lamp stays in place and supplies
no explanation of its lining or illumination. Cistern fragments remain
unidentified; the stair's destination stays hidden. The opened chamber shows
only its threshold and nearest cleared floor, with no later inspection platform.
The Awakening shows neutral white flameless civic lamps and emptied oil fittings
without explaining their power source. No scene depicts a spacecraft,
comprehensive map, system purpose, new character backstory or later revelation.
All captions reuse existing Chronicle prose. The generic finale illustration
waits until the three staged Awakening passages have finished, then remains
replayable in Chronicle. Existing saves retain progress and dismissal state;
already-earned new artwork becomes eligible once through its existing records.

## Adding an illustration

Use a stable ID in src/content/illustrations.ts with a Chronicle binding, local asset, accurate dimensions and alt text. A record's first accomplishment makes its art eligible. Building artwork also needs a one-time construction record and matching save validation/migration. Reuse the Chronicle caption rather than maintaining another copy. Keep each served asset below 300000 bytes; the asset test enforces existence, format, distinct bindings and size. Review all imagery and captions against AGENTS.md and docs/NARRATIVE_BIBLE.md before shipping.

## Historical surface correction — October 2, superseded medium

This section records the earlier realistic batch. Retain its concern for
irregular, material-specific wear and original lighting, expressed now through
selective pixel clusters rather than realistic pores and microtexture. Its
rendering prompts are not the current style authority.

The original PNGs already contain unusually regular pitting and pores. WebP encoding and the interface did not create this pattern. Repeated emphasis on tactile, weathered surfaces and painterly texture appears to have encouraged it, and the office reference carried it into the later scenes.

On October 2, 2026, the user clarified that the original coloring should remain: the desired correction is less regular texture, not a smoother art style. Preserve the original amber light, dirty browns, charcoal shadows, exposure, contrast, saturation and white balance. Keep materials rugged, old and tactile. Stone wear should vary in size, depth, density and spacing: irregular clusters, less pitted stretches, localized erosion and occasional shallow scars. Timber grain should follow the wood, with wear concentrated around use and edges. Different materials and individual stone blocks should not share an identical stamped texture.

Avoid uniform stippling, repeated dimples or wormlike curls, procedural bump patterns, all-over granular relief, canvas texture, impasto and oversharpening. Do not replace these with global blur, polished stone, plastic surfaces or a new color grade. Keep meaningful edges, joints, tools and silhouettes clear.

A trial that broadly smoothed the office and lamp was superseded by this clarification; those trial images are not the approved style reference. Inspect candidates at full resolution and approximately 350 pixels wide in the actual game. Check both natural variation in texture and fidelity to the original colors before accepting them. Correct the source artwork rather than adding compression or CSS filters.

Reusable prompt clause:

> Preserve the original color grade, exposure, contrast, saturation, white balance and localized lighting. Rugged historical materials with nonuniform natural wear: pits and pores vary in size, depth and spacing, clustered erosion alternates with less pitted areas. Keep material-specific grain and clear object edges. No repeated stippling, embossed curls, uniform procedural bump pattern, canvas texture or oversharpening. No global smoothing, blur, polished or plastic surfaces, recoloring or relighting.

## Original generation prompts

These document the first batch. For new work, use the approved pixel direction
and the October 4 [pixel prompts](ART_PIXEL_PROMPTS.md). Do not propagate the
original repetitive surface pattern or realistic medium.

For the Oil Press and cistern, the reference was the accepted office PNG. The initial lamp also used that office reference. The lamp correction used the discarded lamp as image 1 (edit target) and the office as image 2 (style reference).

### Keeper's office

Use case: illustration-story. Asset type: first opening illustration for the text-led game Buried Sun, style anchor for a four-image Dark Chronicle series. Generate one landscape 4:3 illustration, no borders or lettering. A cramped shabby civic keeper's office in an ancient inhabited stone structure, at the eye level of someone entering the small room. A battered wooden desk holds an open old household register (marks indistinct, no readable text), a ring of ordinary iron keys, ink, a few records and a small oil lamp. An EMPTY worn wooden chair faces the desk, representing the viewer's place. Worn shelves and practical storage disappear into shadow. Ordinary masonry incorporates a small smooth dark structural surface without explanation. A narrow doorway gives only a dark, obstructed glimpse into the Outer Ward; no skyline or comprehensive architecture. Grounded historical realism with subtle painterly texture, heavy chiaroscuro, localized amber oil-lamp illumination, deep surrounding darkness, weathered tactile wood, stone, soot and iron, restrained desaturated charcoal/dirty brown/bone/olive palette. The office is modest, functional, nearly abandoned; no luxury or heroic composition. Darkness hides meaningful boundaries rather than being a dark filter. Human-scale intimate viewpoint; reveal the desk and conceal the larger world. No people, no magic symbols, no fantasy spectacle, no castle panorama, no science-fiction equipment, screens, electrical lamps, spaceship forms, machinery explanations, glowing seams, or technological reveal. No title, text, logos or watermark.

### Oil Press

Use case: illustration-story. Create a NEW standalone landscape 4:3 illustration for Buried Sun: Oil Press, first construction. The supplied office image is a STYLE AND MATERIAL reference only, not an edit target; preserve its grounded historical realism, subtle painterly texture, desaturated colors and heavy localized chiaroscuro, but depict a different small stone workshop. A worn hand-operated wooden screw press with believable sturdy timber frame, plain iron fittings, compression boards and a collecting tray, producing ordinary lamp oil into earthenware vessels. One unheroic worker in worn practical wool and linen tends the press, concentrating on work, seen obliquely, small relative to the workshop. Intimate human-eye-level viewpoint; the press and worker's hands emerge from a small amber oil lamp; shelves, containers and stone room boundaries disappear in deep structural shadow. Soot, oily timber, dull iron and battered containers. Function and ordinary labor before spectacle. Do not imply the press is mysterious advanced machinery; nothing glowing except the ordinary lamp flame. Ancient inhabited environment, not a picturesque medieval village. No modern machinery, gears spectacle, screens, circuits, recognizable science fiction, magic symbols, armor, panoramic view, fantasy heroes, text, title, border, logo or watermark. Consistent Dark Chronicle art; reveal one useful corner of the Ward, conceal larger architecture.

### Lamp examination — initial generation

Use case: illustration-story. Create a NEW standalone landscape 4:3 illustration for Buried Sun: the completed first examination of the third lamp. The supplied office image is a STYLE AND MATERIAL reference only, not an edit target. Match its grounded historical realism, subtle painterly texture, heavy chiaroscuro, desaturated charcoal/dirty brown/bone palette and close tactile detail. An intimate close observational view inside an old stone chapel, of a modest wall-mounted civic lamp whose open casing has a cold pale white lining and NO wick, oil reservoir or flame. Its lining is unfamiliar without looking like a modern electrical bulb or LED. A thin continuous seam descends from the lamp base into the chapel wall, partly hidden by weathered masonry. The lamp stays fixed in place: do not show it removed or transported. Indirect localized warm light from an ordinary oil lamp outside the frame picks out edges, stone texture and lining; the rest of the wall and chamber falls into genuine deep darkness. Do not show a diagram, technical mechanism, power source, circuitry, wires, luminous strips, blue neon or recognizable modern equipment. The object should resemble an old civic fixture or small architectural fragment whose purpose seems ordinary until closely examined. Preserve mystery; no claim about the lining's light source, age, makers, physiology or the larger structure. No explanatory symbols, religious iconography, magic, fantasy spectacle, futuristic doors, spacecraft, panorama, text, border, logo or watermark. Situated human-eye-level viewpoint, cropped fragments only.

### Lamp examination — final correction

Use case: precise-object-edit. Image 1 is the lamp illustration EDIT TARGET. Image 2 is the office STYLE reference. Keep image 1's 4:3 composition, stone chapel, warm indirect lamplight, deep shadows and tactile realistic rendering. Change ONLY the lamp housing: the present deep bowl and raised hinged lid could be mistaken for an oil reservoir. Replace both with a single shallow UPRIGHT architectural lamp fixture set close to the wall: a narrow vertical recessed oval of cold pale white lining enclosed by plain worn dark metal edges. Its lining is visible as a solid shallow upright surface, with NO bowl, cup, basin, deep vessel, hinged lid, fuel reservoir, wick, flame or identifiable electrical component. Preserve a thin seam descending from the base into the wall, not a cord. The fixture stays in place. No glowing bulbs, neon, circuit patterns, symbols or new lore. It should be difficult to distinguish from an old civic architectural fitting. Keep surrounding masonry, viewpoint, palette and darkness unchanged. No text or border.

### Old Cistern discovery

Use case: illustration-story. Create a NEW standalone landscape 4:3 illustration for Buried Sun: first Old Cistern expedition discovery. The supplied office image is a STYLE AND MATERIAL reference only, not an edit target. Match its grounded historical realism, subtle painterly texture, heavy chiaroscuro and desaturated charcoal/dirty brown/bone palette. A human-eye-level intimate view beside a newly exposed worn stone stair within a cramped old cistern, with silt on its lower steps. In the foreground, a few small PALE IRREGULAR fragments of older material are laid on plain worn cloth by returning scavengers; show a simple hand or tool for scale, no heroic portrait. The fragments are unidentified material, not skulls, bones, fossils, crystals, jewels, circuit boards, engines or glowing objects. No markings or detailed technical cross-section that explains them. A rope is fixed to a plain uncorroded ring in the masonry beside the upper stair. A fine groove is partly visible in the stair wall. The stair continues down beyond illumination and out of frame, with its destination concealed; no comprehensive chamber or geographic map. One small ordinary oil lamp provides localized amber light across cloth, pale fragments, damp stone and silt while the room boundaries disappear in genuine deep shadow. Cropped architectural fragments, inhabited ancient environment, material and functional human tools. Preserve uncertainty: no machine identity, purpose, spacecraft features, magical symbols, monumental panorama or bright fantasy spectacle. No screens, modern electrical equipment, neon, text, border, title, logo or watermark.

## Historical realistic replacement prompts — October 2

Generated with the built-in image_gen tool after the texture clarification.
Direct edits repeatedly retained the embossed pattern, so the then-accepted
replacements were freshly rendered from the established scenes and palette.
These realistic replacements were superseded by the October 4 pixel batch.
Their scene contents and reveal limits remain useful; their rendering medium
is not a style reference. No smoothed trial is a style anchor.

### Keeper's office

Use case: illustration-story. A new 4:3 landscape Dark Chronicle illustration for Buried Sun. A cramped shabby keeper's office, viewed from behind an EMPTY worn wooden chair in the foreground facing a battered desk. Open old household register centered on desk, ordinary iron keys to its right, ink vessel left, ordinary oil lamp behind keys on the right. Practical shelves of records on left and right, modest stone walls. Narrow dark doorway in the rear right gives an obstructed glimpse of steps, barrel and cloth awning in the Outer Ward, no skyline. Small dark structural inset in left wall remains unexplained. Keeper's appearance undefined, no people. The scene feels modest, functional and inherited. Coloring must retain the established rich warm amber-orange oil-lamp light, dirty brown timber and stone, soot charcoal shadows, pale bone objects and dull iron. Heavy chiaroscuro, localized light, deep darkness concealing room boundaries, no overall brightening or desaturation. Grounded historical realism, aged tactile ordinary materials, intimate human-scale viewpoint. IMPORTANT MATERIAL TREATMENT: broad worn stone faces with low natural relief; irregular isolated patches of erosion and differently sized shallow pores, quieter stretches between clusters, sparse chipped edges and localized soot stains. Different stones have different textures. Timber grain follows its fibers, wear gathers around use and edges. Avoid the artificially repeated embossed squiggles or same-size pits of generated textures. No uniform stippling, worm trails, porous foam, canvas pattern, impasto, procedural bump noise, oversharpening or HDR crunch. Material wear should be irregular, convincing and localized, neither pristine nor polished. Clear object silhouettes, tools, joints and meaningful edges. No recognizable science-fiction equipment, electrical components, magic, castle, noble or heroic spectacle, explanation of ancient structures, new lore, map, panorama, readable text, border, logo or watermark.

### Oil Press

Use case: illustration-story. A new 4:3 landscape Dark Chronicle illustration for Buried Sun. A cramped stone workshop with a sturdy hand-operated timber screw press dominating center and right. Plain iron fittings, screw, compression boards, and oil collecting from tray into earthenware vessel at its base. One ordinary worker in practical worn wool/linen on the left leans toward the lever, tending the press with believable hands and working posture, no heroic pose. Ordinary oil lamp at lower right, vessels and tools in shadow at left. Real timber has long directional fibers, edge wear and occasional splits, never uniform stone-like pores. Real cloth is soft, skin natural, pottery mostly matte with limited oil highlights. Coloring must retain the established rich warm amber-orange oil-lamp light, dirty brown timber and stone, soot charcoal shadows, pale bone objects and dull iron. Heavy chiaroscuro, localized light, deep darkness concealing room boundaries, no overall brightening or desaturation. Grounded historical realism, aged tactile ordinary materials, intimate human-scale viewpoint. IMPORTANT MATERIAL TREATMENT: broad worn stone faces with low natural relief; irregular isolated patches of erosion and differently sized shallow pores, quieter stretches between clusters, sparse chipped edges and localized soot stains. Different stones have different textures. Timber grain follows its fibers, wear gathers around use and edges. Avoid the artificially repeated embossed squiggles or same-size pits of generated textures. No uniform stippling, worm trails, porous foam, canvas pattern, impasto, procedural bump noise, oversharpening or HDR crunch. Material wear should be irregular, convincing and localized, neither pristine nor polished. Clear object silhouettes, tools, joints and meaningful edges. No recognizable science-fiction equipment, electrical components, magic, castle, noble or heroic spectacle, explanation of ancient structures, new lore, map, panorama, readable text, border, logo or watermark.

### Lamp examination

Use case: illustration-story. Buried Sun, Dark Chronicle: a close observational view of a shallow UPRIGHT wall-mounted civic lamp fixture in an ancient dark stone chapel, landscape 4:3. Human-eye-level oblique composition. The fixture is a narrow vertical oval of cold pale ivory solid lining, plain dark worn metal rim, two mounting bolts, set close against the wall. Thin seam descends from its base into the masonry, not a wire. Partial column on left, room beyond nearly invisible. The fixture has no bowl, reservoir, wick, flame, bulb or recognizable electrical parts and does not glow. Rich restrained amber-orange indirect oil light grazes dirty brown masonry from off-frame left; charcoal darkness on right, strong heavy chiaroscuro. Original game palette: warm brown and amber, soot black, bone, dull iron; no color shift toward gray-green or washed-out brown. Grounded historical realism with convincing aged natural materials. Wall blocks have broad hand-cut faces, modest irregular mineral texture, random shallow weathering in isolated patches and rounded chips at selected edges. Large less-pitted stretches between uneven clusters of a few pores of different sizes and depths. Stone is solid dense material, NOT porous foam. Strong variation between individual stones, no embossed squiggles, worm trails, repetitive dimples, stamped stucco, canvas pattern, painterly impasto, all-over noise, procedural bump effect or extreme microtexture. Keep roughness around worn edges and selected patches; clear masonry joints and important object edges. Quiet material realism with localized stains and soot, neither pristine nor polished. Intimate enclosed scene, darkness conceals the greater architecture, no technological explanation. No sci-fi, neon, magic, symbols, diagram, landscape, text or border.

### Old Cistern discovery

Use case: illustration-story. A new 4:3 landscape Dark Chronicle illustration for Buried Sun. An intimate view beside a partly exposed stone stair descending at right and out of frame into dark depths, cramped old cistern. Foreground cloth spread on stone at lower left holds three small pale irregular unidentified material fragments, one held by a simple hand for scale. Tools and pack on left; ordinary oil lamp illuminates from left-middle. Rope attached to plain uncorroded ring in masonry beside stair at upper middle, fine groove partly visible in wall. Silt on lower steps. Preserve uncertainty: fragments not bones, fossils, crystals, circuitry, engines, or glowing objects. Destination concealed. Damp stone has localized wet patches and restrained broad highlights, no uniformly sparkling glitter. Coloring must retain the established rich warm amber-orange oil-lamp light, dirty brown timber and stone, soot charcoal shadows, pale bone objects and dull iron. Heavy chiaroscuro, localized light, deep darkness concealing room boundaries, no overall brightening or desaturation. Grounded historical realism, aged tactile ordinary materials, intimate human-scale viewpoint. IMPORTANT MATERIAL TREATMENT: broad worn stone faces with low natural relief; irregular isolated patches of erosion and differently sized shallow pores, quieter stretches between clusters, sparse chipped edges and localized soot stains. Different stones have different textures. Timber grain follows its fibers, wear gathers around use and edges. Avoid the artificially repeated embossed squiggles or same-size pits of generated textures. No uniform stippling, worm trails, porous foam, canvas pattern, impasto, procedural bump noise, oversharpening or HDR crunch. Material wear should be irregular, convincing and localized, neither pristine nor polished. Clear object silhouettes, tools, joints and meaningful edges. No recognizable science-fiction equipment, electrical components, magic, castle, noble or heroic spectacle, explanation of ancient structures, new lore, map, panorama, readable text, border, logo or watermark.
