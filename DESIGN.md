---
name: Elyndor Interactive
description: Cinematic Dark Fantasy & Studio Game Showcase Design System
colors:
  primary: "#d4af37"
  crimson: "#a33a2e"
  neutral-bg: "#050505"
  neutral-surface: "#0c0c0c"
  neutral-border: "rgba(255, 255, 255, 0.07)"
  text-primary: "#f0ece4"
  text-heading: "#e8e0d0"
  text-muted: "#9e988f"
  badge-playstore: "#247a4a"
  badge-itch: "#b83c30"
typography:
  display:
    fontFamily: "Cinzel, serif"
    fontSize: "clamp(2.2rem, 5vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "1px"
  headline:
    fontFamily: "Cinzel, serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "1px"
  title:
    fontFamily: "Cinzel, serif"
    fontSize: "1.2rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.5px"
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "1.5px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  pill: "20px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "3rem"
  2xl: "4rem"
components:
  button-primary:
    backgroundColor: "transparent"
    textColor: "{colors.primary}"
    rounded: "{rounded.sm}"
    padding: "0.8rem 2rem"
  button-primary-hover:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.sm}"
    padding: "0.8rem 2rem"
---

# Design System: Elyndor Interactive

## Overview

**Creative North Star: "The Cinematic Sanctum"**

Elyndor Interactive's design language pairs the mystique of dark fantasy and Indian myth with modern, high-precision game studio engineering. The aesthetic rejects generic tech templates, loud neon gamer tropes, and distracting AI gimmicks. Instead, it relies on deep obsidian canvases, warm radiant gold accents (`#d4af37`), and classical Roman-epigraphic typography (`Cinzel`) to convey prestige, authenticity, and narrative depth.

Every screen feels like walking through a private studio exhibition: high-contrast game art posters, subtle ambient glass reflections, and quiet micro-interactions that never distract from playable games.

**Key Characteristics:**
- **Obsidian & Gold Contrast**: Deep velvety black backgrounds punctured with precise, purposeful gold highlights.
- **Dignified Typography**: Classical serif titles anchored by clean, legible body text.
- **Restrained Motion**: Subtle 60fps scale and lift transitions that reward interaction without moving content under the user's cursor.
- **Grounded Authenticity**: Direct, human copy celebrating independent game development from Nashik, India.

## Colors

A curated dark palette engineered for high contrast, atmospheric depth, and zero eye fatigue.

### Primary
- **Imperial Gold** (`#d4af37`): The signature brand accent. Reserved for primary calls-to-action, active navigation states, interactive arrows, and key highlights.

### Secondary
- **Studio Crimson** (`#a33a2e`): A deep, historic red used for subtle ambient glows, dramatic hero backdrops (e.g. Project Origin / Kaali), and secondary focus areas.

### Tertiary
- **Play Store Emerald** (`#247a4a`): A muted, balanced green reserved strictly for Google Play distribution badges.
- **Itch Terracotta** (`#b83c30`): A warm earthy red reserved strictly for itch.io game badges.

### Neutral
- **Deep Obsidian** (`#050505`): The primary background canvas.
- **Glass Surface** (`rgba(255, 255, 255, 0.02)`): Card and module fill color providing gentle depth against pure black.
- **Warm Alabaster** (`#f0ece4`): Primary high-contrast text color for titles and critical information.
- **Warm Off-White** (`#e8e0d0`): Section headings (`<h2>`) ensuring readable contrast against black.
- **Muted Earth Grey** (`#9e988f`): Secondary body copy and metadata.

### Named Rules
**The Rarity Rule.** Gold (`#d4af37`) is an accent, not a background. It must never cover more than 8% of the viewport. Its power comes from restraint.
**The No-Neon Rule.** Pure neon hues (`#00ff00`, `#ff00ff`) are strictly forbidden on the studio site. Colors must feel natural, cinematic, and rich.

## Typography

**Display Font:** `Cinzel, serif`  
**Body Font:** `Inter, sans-serif`  
**Character:** A pairing of ancient epigraphic gravitas and modern functional legibility.

### Hierarchy
- **Display** (`700`, `clamp(2.2rem, 5vw, 4.5rem)`, `1.1`): Hero game titles and major brand moments.
- **Headline** (`700`, `2rem`, `1.2`): Section titles (`<h2>`). Always uppercase with `1px` tracking.
- **Title** (`600`, `1.2rem`, `1.3`): Game card titles and component headers.
- **Body** (`400`, `0.95rem`, `1.7`): Editorial prose, descriptions, and lore. Line lengths capped at `65ch` for optimal reading rhythm.
- **Label** (`700`, `0.75rem`, `1.5px`): Platform tags, pill badges, and eyebrow captions. Always uppercase.

### Named Rules
**The Breathing Room Rule.** Body copy must maintain a `line-height` of at least `1.65` to ensure effortless scannability against dark surfaces.

## Layout

- **Container Model**: Centered max-width containers (`max-width: 1200px` for content; `max-width: 1320px` for header and portfolio showcase).
- **Game Grid**: Responsive CSS Grid (`grid-template-columns: repeat(auto-fill, minmax(260px, 1fr))`) with `1.75rem` gap.
- **Section Spacing**: Consistent vertical rhythm with `5rem 2rem` padding.
- **Responsive Behavior**: Gracefully reflows from multi-column grids down to single-column card feeds on mobile devices below `640px`.

## Elevation & Depth

Surfaces rely on tonal layering and luminous border illumination rather than heavy drop-shadows.

### Shadow Vocabulary
- **Card Hover Elevation** (`box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(212, 175, 55, 0.12)`): Applied on card hover to create an organic lift.
- **Button Glow** (`box-shadow: 0 0 15px rgba(212, 175, 55, 0.4)`): Applied when primary buttons are hovered or focused.
- **Video Stage Elevation** (`box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8)`): Embeds trailers into deep cinematic perspective.

### Named Rules
**The State-Activated Depth Rule.** Elements rest flush against the surface canvas. Dramatic shadows and glows appear only in response to user interaction or media focus.

## Shapes

- **Cards & Modules**: `12px` rounded corners with subtle `1px` border (`rgba(255, 255, 255, 0.07)`).
- **Media Thumbnails**: `8px` rounded corners nested cleanly within cards.
- **Badges**: `4px` subtle rounding with glassmorphic backdrop blur.
- **Pills & Eyebrows**: `20px` full pill shapes for flagship tags and profile links.
- **Monogram Avatars**: Circular (`50%`) with radial metallic gold border rings.

## Components

### Buttons
- **Shape**: Slightly rounded rectangle (`4px`).
- **Primary Style**: Transparent background, `1px solid #d4af37`, gold uppercase text, `0.8rem 2rem` padding.
- **Hover**: Fills with gold (`#d4af37`), dark obsidian text, ambient gold glow.

### Game Cards
- **Structure**: Three-tiered card with media container (top), info body (middle), and action bar (bottom).
- **Hover**: Subtle lift (`translateY(-6px)`), border lighting to `rgba(212, 175, 55, 0.4)`.
- **Action Bar**: Fixed footer separator line with platform tag on the left and `▶ Play Now` on the right (slides `+4px` on hover). Never overlaps text.

### Platform Badges
- **Style**: Floating top-right overlay on thumbnails, semi-transparent background with `backdrop-filter: blur(8px)`, bold uppercase text.

### Navigation Header
- **Structure**: Fixed frosted header (`height: 76px`, `backdrop-filter: blur(12px)`), logo on the left, spaced uppercase text links on the right.
- **Active / Hover State**: Thin gold underline indicator (`2px`) sliding in from left.

## Do's and Don'ts

### Do:
- **Do** maintain high contrast between text (`#f0ece4` / `#e8e0d0`) and background (`#050505`).
- **Do** preserve the responsive CSS Grid for game cards without reintroducing horizontal scrollbars.
- **Do** keep action buttons and platform tags cleanly separated from descriptive text.
- **Do** maintain grounded, authentic voice that highlights genuine gameplay and indie development.

### Don't:
- **Don't** reintroduce CPU-heavy canvas particles, custom cursor rings, or ambient sound oscillators.
- **Don't** use dark crimson or dark red on section titles (`<h2>`) against black backgrounds.
- **Don't** use typewriter effects or glitch text scrambles that delay user comprehension.
- **Don't** use horizontal mouse-tracking auto-scroll scripts that hijack cursor control.
