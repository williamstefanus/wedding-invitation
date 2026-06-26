# Sangjit Invitation Antigravity Prompt Pack
## Screenshot-Based + Figma Sizing-Locked Version

This prompt pack is revised for Google Antigravity with two important constraints:

1. Antigravity cannot access Figma directly.
2. Antigravity must not randomly guess sizing/spacing from screenshots.

Use the exported screenshots in `public/assets/sangjit-screen/` as visual references, but use the Figma sizing rules written in this prompt pack as the source of truth for dimensions, spacing, typography, and layout behavior.

---

# Global Implementation Rules

## Visual Reference Folder

Use these exported screen PNGs as visual references only:

```txt
/public/assets/sangjit-screen/OpeningScreen.png
/public/assets/sangjit-screen/HeroSection&CountDown.png
/public/assets/sangjit-screen/CoupleEnvelopeSection.png
/public/assets/sangjit-screen/ScheduleSection.png
/public/assets/sangjit-screen/RSVPSection.png
/public/assets/sangjit-screen/GiftSection.png
/public/assets/sangjit-screen/ThankYouSection.png
```

The screenshot files are only references for visual matching.

Do not render these screenshot PNGs as the actual invitation sections.
Do not use them as final section backgrounds.
Do not use them as production decorative assets.
Do not crop them into the website.

Build every section with HTML/CSS and real assets from:

```txt
/assets/sangjit-invitation/
```

## Figma Sizing Source of Truth

Use the Figma sizing details written in each prompt below as the source of truth.

If a screenshot seems to conflict with the numeric sizing in this prompt, prioritize the numeric sizing in this prompt.

Do not invent missing spacing.
Do not stretch sections to full desktop width.
Do not resize the canvas based on browser width.
Do not add new decorative dividers between sections unless the prompt specifically says the divider belongs inside that section.

## Canvas Rules

The Sangjit invitation uses a mobile invitation canvas.

```txt
Canvas width: 480px
Desktop behavior: center the 480px canvas on a light grey page background
Outer page background: #E6E6E6
Inner canvas background: white or section-specific background
```

Suggested CSS:

```css
.sangjit-page {
  width: 100%;
  min-height: 100vh;
  background: #e6e6e6;
}

.sangjit-canvas {
  width: 100%;
  max-width: 480px;
  margin: 0 auto;
  position: relative;
  overflow: visible;
  background: #ffffff;
}
```

## Smooth Scroll Rules

Use natural smooth scrolling.

Do not use mandatory section snapping.
Do not use magnet scrolling.
Do not add JavaScript that forces the viewport to stop at sections.

Do not add:

```css
scroll-snap-type: y mandatory;
scroll-snap-align: start;
scroll-snap-stop: always;
```

If seams appear, use tiny CSS overlap only:

```css
.sangjit-section {
  position: relative;
  overflow: visible;
}

.sangjit-section + .sangjit-section {
  margin-top: -1px;
}
```

Allowed seam overlap:

```txt
-1px to -4px only
```

Do not use large negative margins for transitions unless that exact negative margin is already part of a Figma sizing rule in the section prompt.

## Image Rendering Rules

For decorative full-width images:

```css
.decorative-image-wrapper {
  line-height: 0;
  font-size: 0;
}

.decorative-image-wrapper img {
  display: block;
  width: 100%;
  height: auto;
}
```

Outer section wrappers should use:

```css
position: relative;
overflow: visible;
```

Only inner masks, image frames, rounded cards, and intentional crops may use:

```css
overflow: hidden;
```

---

# Shared Asset Constants

Create or update:

```txt
src/constants/sangjitInvitationAssets.ts
```

Use this exact object:

```ts
export const SANGJIT_INVITATION_ASSETS = {
  sangjitWatercolorBackground: "/assets/sangjit-invitation/sangjit-watercolor-background.png",
  sangjitOpeningEmblem: "/assets/sangjit-invitation/sangjit-opening-emblem.png",
  sangjitBottomFloralWave: "/assets/sangjit-invitation/sangjit-bottom-floral-wave.png",
  sangjitCountdownCard: "/assets/sangjit-invitation/sangjit-countdown-card.png",

  sangjitEnvelopeBackPanel: "/assets/sangjit-invitation/sangjit-envelope-back-panel.png",
  sangjitEnvelopeInnerPattern: "/assets/sangjit-invitation/sangjit-envelope-inner-pattern.png",
  sangjitEnvelopePaperCard: "/assets/sangjit-invitation/sangjit-envelope-paper-card.png",
  sangjitWaxSeal: "/assets/sangjit-invitation/sangjit-wax-seal.png",
  sangjitEnvelopeLeftFloral: "/assets/sangjit-invitation/sangjit-envelope-left-floral.png",
  sangjitEnvelopeRightFloral: "/assets/sangjit-invitation/sangjit-envelope-right-floral.png",
  sangjitMaroonWaveDivider: "/assets/sangjit-invitation/sangjit-maroon-wave-divider.png",

  sangjitPhoenixIllustration: "/assets/sangjit-invitation/sangjit-phoenix-illustration.png",
  sangjitScheduleBackground: "/assets/sangjit-invitation/sangjit-schedule-background.png",

  sangjitRsvpBackground: "/assets/sangjit-invitation/sangjit-rsvp-background.png",
  sangjitRsvpFloralHeader: "/assets/sangjit-invitation/sangjit-rsvp-floral-header.png",

  sangjitGiftBackground: "/assets/sangjit-invitation/sangjit-gift-background.png",
  sangjitGiftLeftFloral: "/assets/sangjit-invitation/sangjit-gift-left-floral.png",
  sangjitGiftTopWave: "/assets/sangjit-invitation/sangjit-gift-top-wave.png",

  sangjitThankYouLeftFloral: "/assets/sangjit-invitation/sangjit-thank-you-left-floral.png",
  sangjitThankYouRightFloral: "/assets/sangjit-invitation/sangjit-thank-you-right-floral.png",

  textareaResizeGrab: "/assets/sangjit-invitation/textarea-resize-grab.svg"
};
```

Create or update:

```txt
src/constants/sangjitScreenReferences.ts
```

Use this exact object:

```ts
export const SANGJIT_SCREEN_REFERENCES = {
  openingScreen: "/assets/sangjit-screen/OpeningScreen.png",
  heroCountdown: "/assets/sangjit-screen/HeroSection&CountDown.png",
  coupleEnvelope: "/assets/sangjit-screen/CoupleEnvelopeSection.png",
  schedule: "/assets/sangjit-screen/ScheduleSection.png",
  rsvp: "/assets/sangjit-screen/RSVPSection.png",
  gift: "/assets/sangjit-screen/GiftSection.png",
  thankYou: "/assets/sangjit-screen/ThankYouSection.png"
};
```

Use `SANGJIT_SCREEN_REFERENCES` only as optional developer reference paths, not as rendered production images.

---

# Prompt S01 — Setup, Route, Constants, Smooth Scroll Foundation

Prepare the Sangjit invitation variant setup only.

Do not build the full Sangjit invitation page in this prompt.
Do not implement final visual details for the sections yet.

Create route:

```txt
/invite/sangjit/[code]
```

The route should:

- read invitation code from URL
- use the same invitation-code lookup pattern as the Wedding Invitation route
- resolve only Sangjit invitation records
- treat Wedding codes as invalid on this route
- load linked guest data
- prepare data props for future sections

Temporary output only:

```txt
Sangjit Invitation
Code: [code]
Guest: [guest name]
Sections will be added in the next prompts.
```

Create the shared constants:

```txt
src/constants/sangjitInvitationAssets.ts
src/constants/sangjitScreenReferences.ts
```

Create `SangjitInvitationCanvas`.

Canvas rules:

```txt
width: 100%
max-width: 480px
margin: 0 auto
position: relative
overflow: visible
background: #ffffff
desktop outer page background: #e6e6e6
```

Create placeholder section components only:

```txt
SangjitOpeningScreen
SangjitHeroCountdownSection
SangjitCoupleEnvelopeSection
SangjitScheduleSection
SangjitRSVPSection
SangjitGiftSection
SangjitThankYouSection
```

Each placeholder may return:

```tsx
export function SangjitOpeningScreen() {
  return <section data-section="sangjit-opening" />;
}
```

Do not use Figma URLs.
Do not render screenshot PNGs as page sections.
Do not use mandatory scroll snap.
Do not create new divider bridge components in this prompt.

Acceptance criteria:

- `/invite/sangjit/[code]` exists
- route reads code param
- route only accepts Sangjit invitation records
- constants exist
- `SangjitInvitationCanvas` exists
- placeholder section files exist
- smooth natural scroll foundation exists
- no visual section is guessed yet

---

# Prompt S02 — Page Skeleton With Fixed Section Order

Build the Sangjit page skeleton using the setup from Prompt S01.

Route:

```txt
/invite/sangjit/[code]
```

Use this exact section order:

```tsx
<SangjitInvitationCanvas>
  <SangjitOpeningScreen />
  <SangjitHeroCountdownSection />
  <SangjitCoupleEnvelopeSection />
  <SangjitScheduleSection />
  <SangjitRSVPSection />
  <SangjitGiftSection />
  <SangjitThankYouSection />
</SangjitInvitationCanvas>
```

Important:

- do not add gallery/moments
- do not add new SectionBridge components
- do not insert extra decorative divider assets between sections
- each divider/wave belongs inside the specific section prompt where listed
- keep natural smooth scrolling
- desktop centers the 480px canvas
- do not stretch the invitation to full desktop width

Data behavior:

- fetch invitation by `invitation_code`
- use event type `"sangjit"` or the project’s existing Sangjit identifier
- guest name comes from linked guest data
- countdown target comes from Sangjit settings
- schedule details come from Sangjit settings where available
- RSVP reuses shared RSVP logic
- gift details come from settings where available

Acceptance criteria:

- sections render in correct order
- mobile canvas is 480px
- desktop centers the canvas
- no magnet scrolling
- no screenshot PNGs rendered as final sections
- no Figma MCP URLs

---

# Prompt S03 — SangjitOpeningScreen With Figma Sizing

Build `SangjitOpeningScreen`.

Visual reference screenshot:

```txt
/public/assets/sangjit-screen/OpeningScreen.png
```

Use the screenshot as visual reference only. Use the sizing details below as the source of truth.

## Figma Section Size

```txt
OpeningScreen frame:
width: 479.97174072265625px
height: 970px
```

## Figma Layout Sizing

Main upper frame:

```txt
width: 479.97174072265625px
height: 883px
padding-top: 72px
padding-bottom: 160px
gap between major items: 64px
margin-bottom: -120px
background: white + watercolor image opacity 30%
```

Bottom floral wave:

```txt
width: 480px
height: 207px
position: after upper frame
visual y in Figma: 763px
```

Opening emblem:

```txt
width: 320px
height: 288px
object-fit: cover
centered
```

Title block:

```txt
width: 313.416px
display: flex column
gap: 8px
text-align: center
line-height: 0.95
color: #761B33
font-family: EgizioEF Condensed
```

Title typography:

```txt
"The Sangjit of": 36px
"Aziel & William": 56px
```

Guest / button block:

```txt
width: 100%
padding-left/right: 24px
gap: 24px
align-items: center
```

Guest greeting:

```txt
width: 202.332px
font-family: Montserrat Medium
font-size: 16px
line-height: 2.4
color: #761B33
text-align: center
```

Button:

```txt
width: 240px
height: 40px
background: #761B33
border-radius: 10px
padding: 8px 16px
box-shadow: 0px 1px 1px rgba(0,0,0,0.1)
text: Inter Medium 14px, white #FAFAFA
```

## Assets

Use:

```ts
sangjitWatercolorBackground
sangjitOpeningEmblem
sangjitBottomFloralWave
```

## Text

```txt
The Sangjit of
Aziel & William

Dear Mr. / Mrs. / Ms.
[guest name]

Open Invitation
```

## Behavior

Reuse existing Wedding opening logic:

- scroll lock before opening
- fade out after opening
- reveal content after click
- optional music trigger after click if already implemented
- guest name from invitation data

Acceptance criteria:

- section matches `OpeningScreen.png`
- dimensions follow the Figma sizing above
- screenshot is not rendered as final background
- guest name is dynamic
- button behavior works
- no Figma URLs

---

# Prompt S04 — SangjitHeroCountdownSection With Figma Sizing

Build `SangjitHeroCountdownSection`.

Visual reference screenshot:

```txt
/public/assets/sangjit-screen/HeroSection&CountDown.png
```

Use the screenshot as visual reference only. Use the sizing details below as the source of truth.

## Figma Section Size

```txt
HeroSection&CountDown frame:
width: 479.97174072265625px
height: 1035.76171875px
background: #761B33
display: flex column
gap: 8px
padding-bottom: 24px
```

## Top Hero Frame

```txt
Frame 24:
width: 479.97174072265625px
height: 766px
```

Hero content area:

```txt
width: 479.97174072265625px
height: 679px
padding-top: 72px
padding-bottom: 160px
gap: 64px
margin-bottom: -120px
background: white + watercolor image opacity 30%
```

Bottom floral wave:

```txt
width: 480px
height: 207px
visual y in Figma: 559px
```

Emblem:

```txt
width: 320px
height: 288px
```

Title block:

```txt
width: 313.416px
gap: 8px
line-height: 0.95
text-align: center
color: #761B33
font-family: EgizioEF Condensed
```

Title typography:

```txt
"The Sangjit of": 36px
"William & Aziel": 56px
```

## Countdown Area

```txt
Frame 27:
width: 479.97174072265625px
height: 237.76171875px
gap: 24px
```

Date heading:

```txt
width: 479.97174072265625px
height: 38px
font-family: EgizioEF Condensed
font-size: 40px
line-height: 0.95
text-align: center
color: #FFFFFF
```

Countdown card wrapper:

```txt
width: 479.97174072265625px
height: 175.76171875px
padding-left/right: 48px
```

Countdown card:

```txt
width: 383.97174072265625px
height: 175.76171875px
aspect-ratio: 568 / 260
```

## Assets

Use:

```ts
sangjitWatercolorBackground
sangjitOpeningEmblem
sangjitBottomFloralWave
sangjitCountdownCard
```

## Data Rules

- countdown target comes from Sangjit settings/database
- event date comes from Sangjit settings/database
- if placeholder is needed, use `Saturday, 17 October 2026`
- do not hardcode an incorrect weekday

Acceptance criteria:

- section matches `HeroSection&CountDown.png`
- dimensions follow Figma sizing above
- countdown works
- no screenshot rendered as final section
- no Figma URLs

---

# Prompt S05 — SangjitCoupleEnvelopeSection With Figma Sizing

Build `SangjitCoupleEnvelopeSection`.

Visual reference screenshot:

```txt
/public/assets/sangjit-screen/CoupleEnvelopeSection.png
```

Use the screenshot as visual reference only. Use the sizing details below as the source of truth.

## Figma Section Size

There are two related Figma frames:

```txt
CoupleEnvelopeSection:
width: 480px
height: 702.8834228515625px
background: #761B33
padding-bottom: 72px

Parent Frame 23 including bottom divider:
width: 480px
height: 774.8834228515625px
```

Bottom maroon wave divider:

```txt
asset: sangjitMaroonWaveDivider
width: 480px
height: 128px
position in parent: y = 646.8834228515625px
```

Important:
Keep `sangjitMaroonWaveDivider` as part of this section’s bottom transition only. Do not add it again between sections.

## Envelope Base Area

Envelope visual group:

```txt
Frame 1:
width: 480px
height: 417px
margin-bottom: -244px
```

Envelope container:

```txt
Event Image Container:
x: 35px
y: 0px
width: 410px
height: 417px
```

Envelope back panel:

```txt
width: 410px
height: 417px
object-fit: contain
```

Inner rotated diamond area:

```txt
outer container width: 342.989px
outer container height: 345.684px
margin-left: 31px
margin-top: 14.02px
rotation: -45.22deg
skew-x: -0.45deg
inner visible area width: 245.093px
inner visible area height: 241.877px
border-radius: 24px
```

## Event Info Block

```txt
Event Info Block:
width: 390px
x: 45px
y: 173px
```

Front / lower envelope visual:

```txt
width: 390px
height: 238px
margin-bottom: -148px
image visible left: 6.1%
image visible width: 87.81%
flipped vertically / rotated as in Figma
```

Details container:

```txt
width: 390px
position: relative
isolate layering
```

Wax seal:

```txt
width: 57.399px
height: 53.883px
margin-bottom: -37px
z-index: 3
centered
```

Inner card container:

```txt
width: 307px
height: 351px
x: 41.5px
y: 16.883px
background: #FFF8EF
box-shadow: 0px 4px 4px rgba(0,0,0,0.25)
```

Text block inside card:

```txt
width: 225.705px
x: 40.5px
y: 44.12px
display: flex column
gap: 16px
text-align: center
color: #761B33
```

Bride block:

```txt
width: 183.484px
gap: 8px
```

Bride name:

```txt
font-family: EgizioEF Condensed
font-size: 36px
line-height: 0.95
```

Bride parent text:

```txt
width: 136.228px
font-family: Montserrat Regular
font-size: 10px
line-height: 1.4
```

Separator:

```txt
font-family: Montserrat Regular
font-size: 10px
```

Groom block:

```txt
width: 225.705px
gap: 8px
```

Groom name:

```txt
font-family: EgizioEF Condensed
font-size: 36px
line-height: 0.95
```

Groom parent text:

```txt
width: 169.969px
font-family: Montserrat Regular
font-size: 10px
```

## Floral Decorations

Left flower / decorative elements from Figma:

```txt
large left floral:
absolute left: -145px
top: 69px
source visual size: 362.527px square
rendered size: 300.443px square
rotation: -166.44deg with vertical flip

small left floral:
absolute left: -97px
top: -89px
source visual size: 254.563px square
rendered size: 181.25px square
rotation: 38.28deg
```

Right flower / decorative elements from Figma:

```txt
right lower floral:
absolute left: 286px
top: 441px
source visual size: 254.246px square
rendered size: 182.367px square
rotation: -125.34deg

right upper floral:
absolute left: 286px
top: 184px
outer width: 271.455px
outer height: 273.653px
rendered crop width: 196.788px
rendered crop height: 202.703px
source image left offset: -95.08px
source image size: 291.866px square
rotation: -29.76deg
```

## Assets

Use:

```ts
sangjitEnvelopeBackPanel
sangjitEnvelopeInnerPattern
sangjitEnvelopePaperCard
sangjitWaxSeal
sangjitEnvelopeLeftFloral
sangjitEnvelopeRightFloral
sangjitMaroonWaveDivider
```

## Text

```txt
Aziel
Yorieza, B.A

Second daughter of
Mr. Yopie Kusnandar &
Mrs. Ina Rostiana Rahardja

– and –

William
Stefanus, S.Kom

First son of Mr. Hadi Stefanus
& Mrs. Lanny Mariana
```

Acceptance criteria:

- section matches `CoupleEnvelopeSection.png`
- Figma dimensions are preserved
- bottom maroon divider appears only once
- no screenshot rendered as final section
- no Figma URLs
- text is editable HTML

---

# Prompt S06 — SangjitScheduleSection With Figma Sizing

Build `SangjitScheduleSection`.

Visual reference screenshot:

```txt
/public/assets/sangjit-screen/ScheduleSection.png
```

Use the screenshot as visual reference only. Use the sizing details below as the source of truth.

## Figma Section Size

```txt
ScheduleSection:
width: 480px
height: 433.61688232421875px
padding-left/right: 24px
padding-top/bottom: 48px
background: white + sangjitScheduleBackground opacity 30%
```

Main content row:

```txt
width: 100%
display: flex
align-items: flex-start
justify-content: flex-end
```

Phoenix visual container:

```txt
size: 337.617px square
margin-right: -48px
rotation: 6.3deg
inner image crop size: 305.907px square
```

Detail stack:

```txt
padding-top: 24px
gap: 24px
align-items: center
```

Date block:

```txt
width: 120px
font-family: EgizioEF Condensed
font-size: 36px
line-height: 0.95
text-align: center
color: #761B33
```

Time:

```txt
font-family: Montserrat Regular
font-size: 16px
line-height: 0.91
color: #761B33
```

Venue/address block:

```txt
width: 129.349px
text-align: center
venue font: Montserrat Bold 12px
address font: Montserrat Regular 12px
color: #761B33
```

Map button:

```txt
height: 32px
width: 100% of detail stack
border: 1px solid #761B33
border-radius: 10px
padding: 8px 16px
box-shadow: 0px 1px 2px rgba(0,0,0,0.1)
text: Inter Medium 14px
text color: #761B33
background: transparent/white
```

## Assets

Use:

```ts
sangjitScheduleBackground
sangjitPhoenixIllustration
```

## Content

Use Sangjit settings/database where available.

Placeholder:

```txt
Saturday,
17 October 2026

11:00 - 13:00

Sentosa Seafood
Jl. Aruna No. 30

Open in Google Maps
```

Acceptance criteria:

- section matches `ScheduleSection.png`
- dimensions follow Figma sizing above
- map button works
- no screenshot rendered as final section
- no Figma URLs

---

# Prompt S07 — SangjitRSVPSection With Figma Sizing

Build `SangjitRSVPSection`.

Visual reference screenshot:

```txt
/public/assets/sangjit-screen/RSVPSection.png
```

Use the screenshot as visual reference only. Use the sizing details below as the source of truth.

## Figma Section Size

```txt
RSVPSection:
width: 480px
height: 742.3974609375px
padding-left/right: 24px
padding-top/bottom: 48px
background: white + sangjitRsvpBackground opacity 30%
```

RSVP container:

```txt
width: 432px
```

Header block:

```txt
RSVP Details:
width: 432px
margin-bottom: -24px
```

Heading row:

```txt
display: flex
gap: 24px
align-items: center
```

Heading:

```txt
text: RSVP
width: 120px
font-family: EgizioEF Condensed
font-size: 48px
line-height: 0.95
color: #761B33
```

Floral header visual:

```txt
outer container width: 349.74px
outer container height: 186.397px
rotation: 6.16deg
image width: 335.439px
image height: 151.256px
```

Form stack:

```txt
width: 100%
display: flex column
gap: 24px
```

Question groups:

```txt
display: flex column
gap: 8px
width: 100%
```

Labels:

```txt
font-family: Alegreya Sans Regular
font-size: 16px
line-height: normal
color: #761B33
width: 100%
```

Button rows:

```txt
display: flex
gap: 4px
width: 100%
```

All option buttons:

```txt
height: 32px
border-radius: 10px
padding: 8px 16px
box-shadow: 0px 1px 1px rgba(0,0,0,0.1)
text: Inter Medium 14px
```

Selected button:

```txt
background: #761B33
text color: #FAFAFA
```

Unselected button:

```txt
background: white
border: 1px solid #E5E5E5
text color: #761B33
```

Textarea wrapper:

```txt
width: 100%
height content includes 64px text area
padding: 8px 12px
border: 1px solid #E5E5E5
border-radius: 8px
box-shadow: 0px 1px 2px rgba(0,0,0,0.1)
background: white
overflow: hidden
```

Textarea placeholder:

```txt
font-family: Inter Regular
font-size: 16px
line-height: 24px
color: #737373
```

Submit buttons block:

```txt
width: 432px
gap: 4px
```

Submit button:

```txt
height: 32px
background: #761B33
border-radius: 10px
text: Inter Medium 14px, #FAFAFA
```

Secondary calendar button:

```txt
height: 32px
background: white
border: 1px solid #E5E5E5
border-radius: 10px
text: Inter Medium 14px, #761B33
```

## Assets

Use:

```ts
sangjitRsvpBackground
sangjitRsvpFloralHeader
textareaResizeGrab
```

## RSVP Logic

Reuse shared Wedding RSVP logic.

Important wording for Sangjit:

Use:

```txt
Will you attend?
```

Do not use:

```txt
Will you attend our wedding?
```

Form rules:

- If No: hide event session selection and pax selection, confirmed_pax = 0
- If Yes: require at least one event session and pax
- pax options must not exceed max_pax
- wishes max length: 500 characters
- existing RSVP pre-fills
- latest RSVP overwrites previous RSVP
- after deadline, show read-only state

Acceptance criteria:

- section matches `RSVPSection.png`
- Figma dimensions are preserved
- RSVP logic works
- no screenshot rendered as final section
- no Figma URLs

---

# Prompt S08 — SangjitGiftSection With Figma Sizing

Build `SangjitGiftSection`.

Visual reference screenshot:

```txt
/public/assets/sangjit-screen/GiftSection.png
```

Use the screenshot as visual reference only.

## Figma Section Size

```txt
GiftSection:
width: 480px
height: 511px
```

Important:
The GiftSection internal layer metadata was not readable through the connector, so use the exported screenshot as the visual reference for internal placement while preserving these fixed rules:

```txt
canvas width: 480px
section height: 511px
background: white + watercolor/paper texture
main color: #761B33
cream card: #FFF9ED
side padding target: 24px
heading font: EgizioEF Condensed around 48px
body font: Alegreya Sans or Montserrat
buttons height: 32px when matching shared button style
button border radius: 10px
bank card border radius: around 14px
```

Use the screenshot to match:

- top cream wave position
- left floral illustration size and placement
- Gift heading position
- paragraph position
- Send Gift button position
- bank card size and placement
- copy button placement

Do not render the screenshot as the section.

## Assets

Use:

```ts
sangjitGiftBackground
sangjitGiftLeftFloral
sangjitGiftTopWave
```

## Text

```txt
Gift

Your prayer and presence is the best gift,
but if giving is your expression of love,
you may use the following feature.

Send Gift
Click to Copy
```

Gift card data should come from settings/database where available.

Behavior:

- bank card hidden by default
- clicking Send Gift reveals bank card
- copy button copies account number
- show success state after copy

Acceptance criteria:

- section matches `GiftSection.png`
- section width and height follow Figma size
- uses local assets only
- no screenshot rendered as final section
- no Figma URLs

---

# Prompt S09 — SangjitThankYouSection With Figma Sizing

Build `SangjitThankYouSection`.

Visual reference screenshot:

```txt
/public/assets/sangjit-screen/ThankYouSection.png
```

Use the screenshot as visual reference only. Use the sizing details below as the source of truth.

## Figma Section Size

```txt
ThankYouSection:
width: 480px
height: 241px
background: #761B33
```

Inner frame:

```txt
Frame 22:
x: -35px
y: 0px
width: 550px
height: 241px
```

Left floral:

```txt
x: 154.6406px
y: -19.8186px
width: 232.1459px
height: 280.6372px
```

Center text frame:

```txt
x: 183.3333px
y: 30px
width: 183.3333px
height: 181px
```

Footer text block:

```txt
x: 4.6667px
y: 0px
width: 174px
height: 150px
```

Top body text:

```txt
width: 174px
height: 60px
font-family: Montserrat Regular
font-size: around 12px
color: white
text-align: center
```

Thank You heading:

```txt
width: 174px
height: 51px
y: 72px
font-family: EgizioEF Condensed
font-size: around 54px
color: white
text-align: center
```

Small blessing text:

```txt
width: 159px
height: 15px
y: 135px
font-family: Montserrat Regular
font-size: around 12px
color: white
text-align: center
```

Copyright / names:

```txt
x: 14.1667px
y: 166px
width: 155px
height: 15px
font-family: Montserrat Regular
font-size: around 12px
color: white
text-align: center
```

Right floral:

```txt
x: 342.1002px
y: 65.6854px
width: 232.4663px
height: 230.5px
```

## Assets

Use:

```ts
sangjitThankYouLeftFloral
sangjitThankYouRightFloral
```

## Text

```txt
It would be our greatest joy to have your presence as we celebrate this special moment together.

Thank You

for your love and blessings

William & Aziel - 2026
```

Acceptance criteria:

- section matches `ThankYouSection.png`
- dimensions follow Figma sizing above
- text remains editable HTML
- no screenshot rendered as final section
- no Figma URLs

---

# Prompt S10 — Final Integration + QA

Integrate the Sangjit invitation route:

```txt
/invite/sangjit/[code]
```

Final section order:

```txt
1. SangjitOpeningScreen
2. SangjitHeroCountdownSection
3. SangjitCoupleEnvelopeSection
4. SangjitScheduleSection
5. SangjitRSVPSection
6. SangjitGiftSection
7. SangjitThankYouSection
```

Final rules:

- use natural smooth scrolling
- no mandatory snap
- no magnet scrolling
- no extra divider bridges
- no duplicated divider assets
- desktop centers 480px canvas
- screenshot PNGs are references only
- real assets come from `/assets/sangjit-invitation/`
- no Figma MCP URLs
- no remote images
- no placeholder image URLs

Shared logic to reuse:

- invitation_code lookup
- invalid code handling
- guest name display
- opening screen scroll lock
- countdown target from settings
- event schedule from settings
- Google Maps button
- RSVP upsert/edit/read-only behavior
- max_pax handling
- wishes limit
- gift reveal
- copy bank account number
- add to Google Calendar

QA checklist:

- `/invite/sangjit/[code]` renders
- invalid code page works
- Wedding code on Sangjit route is invalid
- opening screen locks/unlocks scroll
- countdown uses Sangjit date
- schedule button opens Sangjit map
- RSVP saves and updates
- RSVP read-only deadline works
- gift reveal works
- copy bank account works
- desktop centers 480px canvas
- layout matches exported screenshots and Figma sizing rules
- no screenshots are rendered as final page sections

After implementation, summarize:

- changed files
- route behavior
- section files created/updated
- assets used
- any sizing deviations and why
- manual testing steps
