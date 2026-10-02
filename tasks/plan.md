# Illustrated unlocks

Implement the user-approved four-image batch: Keeper's office at a fresh start,
Oil Press on first construction, completed lamp examination, and the first Old
Cistern expedition return. Preserve Dark Chronicle art and situated knowledge.

## Decisions

- A single native reveal dialog shows a Chronicle title, illustration, caption,
  and Continue. Production continues. Queue multiple records in Chronicle order;
  provide Leave remaining in Chronicle for the current queue snapshot.
- Archive the same images and captions in paginated Chronicle records. Add the
  one-time `oil-press-built` construction record. Illustration dismissal and
  Chronicle reading remain separate acknowledgements.
- Save version 4 persists validated dismissal IDs. Migrate versions 1–3 with
  earned art dismissed and any backfilled Oil Press record read, avoiding a
  popup backlog while preserving existing unread entries.
- Reveal only in the visible save-owning tab, after any return summary, and
  without stacking over the exact-resource dialog. Suppress Chronicle reading
  while a reveal is pending or the resource dialog obscures it.
- Ship four uncropped 1200×900 WebP files, each below 300 KB, through the existing
  static export and offline cache. No runtime image service or new dependency.

## Delivery order

1. Generate/review the office style anchor; match the other three illustrations.
2. Implement accomplishment records, dismissal actions, migration, and tests.
3. Integrate accessible reveals and illustrated Chronicle records.
4. Verify phone layouts, accessibility, replay, migration, failed images, and
   offline caching; document prompts and evidence.

## Verification

Run `npm run check` and `npm run build`. Use an isolated browser on the local
production preview, including fresh saves and timestamp-adjusted exported saves
for away intervals. Real-device iPhone Safari/PWA validation remains separate.
