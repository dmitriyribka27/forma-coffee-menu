# Changes and QA

## v0.1.0 — initial working prototype (2026-11-15)

### Implemented
- Static Vite/TypeScript application and responsive Warm Editorial styling.
- Three-language selection gate; scoped localStorage persistence with graceful failure.
- Header, sticky horizontal categories, scrollable search, drawer navigation, 15 dish cards.
- Local live search by translated name, description and ingredients.
- Full-screen dish dialog on mobile; variants, prices, ingredients, allergen labels and stock status.
- Data integrity validation prior to UI rendering.
- Escape handling, focus-return and basic focus loop for overlay dialogs.
- Local unit checks for menu data.

### Known gaps
- Photos are graphic placeholders; final editorial photography is not yet integrated.
- Translations and recipe/allergen data require human review before any real restaurant use.
- Search/scroll behavior, VoiceOver, screen-reader and iPhone Safari require manual on-device QA.
- No Cloudflare Pages deployment or QR generation completed.
- No restaurant admin or ordering; both intentionally out of scope.

### iPhone check after deployment
1. Open in Safari private and normal mode, select each language, and reload.
2. Switch language inside sidebar; verify drawer stays open.
3. Check category stickiness and scroll under dynamic Safari toolbar.
4. Search for a dish, clear search, open its details, close and verify scroll restoration.
5. Check keyboard appearance, iPhone safe areas, VoiceOver/large text and 320px narrow layout.
6. Check that sold-out brownie is visibly marked and remains informational.

### Updating
- Replace `src/data.ts` data and validate with `npm test` / `npm run build`.
- Commit the updated source to GitHub; connected Pages will deploy the new static build.
- Keep the Pages project URL stable so an existing QR code does not change.

## v0.2.0 — Visual refresh (2026-11-15)
- Preserved the greeting and shortened the introduction to bring dishes higher on mobile.
- Added 15 locally hosted, AI-generated illustrative dish photos in WebP format (not photos of real café products).
- Removed decorative filler text and mid-menu promotional panel.
- Tightened menu cards and language gate spacing.
- Improved category navigation offset beneath sticky header and tabs.
- Preserved language switching, search, details, pricing and availability.
- QA: TypeScript and 7 Node tests passed. Real iPhone/Safari verification still required.