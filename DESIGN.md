# DESIGN.md — StudioSpace Design Direction

## Product Identity
StudioSpace is an architectural, editorial marketplace connecting creative professionals (photographers, cinematographers, podcasters, sound engineers) with verified production spaces. The design reflects physical studio spaces: concrete floors, north-facing daylight lofts, acoustic baffling, and tactile hardware.

## Visual Language & Palette
- **Neutral Ground (Base):**
  - Light mode: Warm travertine `#faf9f6`, Crisp card surface `#ffffff`, Sub-surface `#f1f0ec`
  - Dark mode: Deep studio matte `#111110`, Surface `#1b1b19`, Sub-surface `#242421`
- **Typography:**
  - High-contrast charcoal `#171717` (light) / Pristine `#f5f5f2` (dark)
  - Secondary metadata muted stone `#737373` (light) / `#a3a3a0` (dark)
- **Single Brand Accent (Terracotta / Studio Tungsten):**
  - Primary Accent: `#d97745` (warm terracotta)
  - Dark Mode Accent: `#e58b5b`
  - Purpose: Reserved strictly for active indicators, primary call-to-actions, and availability state. No generic purple-blue gradients or full-page glows.

## Hierarchy & Surface Rules (Anti-Slop Alignment)
- **Surfaces:** Solid, grounded cards with crisp 1px borders (`#e8e6e1` / `#333330`). Glassmorphism is capped strictly to the sticky navigation bar and active modals.
- **Radii:** Distinct radii to maintain hierarchy:
  - Inputs & interactive controls: `rounded-xl` (12px)
  - Cards & containers: `rounded-2xl` (16px) or `rounded-3xl` (24px)
  - Badges & pills: `rounded-full`
- **Shadows:** Flat grounded elements by default. Elevation shadows (`shadow-sm` / `shadow-md`) applied strictly on active hover or elevated action sheets.
- **Motion (Lenis + GSAP):** Deliberate momentum scroll (lerp 0.1) paired with purposeful GSAP staggered fade-and-rise entrances (`duration: 0.8s`, `ease: "power2.out"`). Zero chaotic infinite loops or floating orbs.

## Copywriting Standard
- Direct, honest, production-grounded copy.
- No buzzwords ("supercharge your workflow", "AI-powered synergy", "next-gen").
- Real studio metrics: hourly rate, ceiling height, daylight orientation, soundproof rating, and confirmed reservation slots.
