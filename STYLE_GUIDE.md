# Yajro Priests Partner App - Style Guide

This document outlines the visual identity and design patterns for the Yajro Priests Partner application. It serves as a reference for maintaining consistency across the mobile-first interface.

---

### 1. Color Palette

The app uses a warm, spiritual-themed palette inspired by traditional saffron and earth tones, balanced with clean neutrals.

#### Primary Brand Colors
- **Saffron (Brand):** `#FF9933` (Used in gradients, logos, and active states)
- **Deep Saffron:** `#B35300` (Used for text on saffron backgrounds and headings)
- **Amber:** `oklch(0.828 0.189 84.429)` (Secondary accents)

#### Semantic Colors
- **Success:** `#10B981` (Emerald-500)
- **Destructive:** `#EF4444` (Red-500)
- **Warning:** `#F59E0B` (Amber-500)
- **Info:** `#3B82F6` (Blue-500)

#### Neutrals
- **Background:** `#fffdfb` (Off-white, warm background)
- **Text Primary:** `#0F172A` (Slate-900)
- **Text Secondary:** `#64748B` (Slate-500)
- **Borders:** `#E2E8F0` (Slate-200)

---

### 2. Typography

The app relies on system fonts (Inter or default sans-serif) with a focus on hierarchy and readability on small screens.

- **Headings:** Bold, Slate-900 or Deep Saffron.
- **Body:** Regular/Medium, Slate-800.
- **Captions:** Medium, 10px-11px, Slate-500.
- **Button Labels:** Semibold/Bold, 14px (text-sm).

---

### 3. Layout & Structure

The app is designed with a **Native Mobile Feel**.

- **Shell:** `MobileShell` provides the core structure with safe-area handling.
- **Max Width:** Content is capped at `460px` and centered on larger screens.
- **Safe Areas:** Uses CSS variables `--sat`, `--sab`, etc., for notches and home indicators.
- **Spacing:**
  - Standard Page Padding: `px-4` (1rem).
  - Vertical Section Spacing: `space-y-6`.
  - Component Gap: `gap-2` or `gap-4`.

---

### 4. Components

#### Buttons (`Button.tsx`)
- **Default:** Saffron to Amber gradient, white text, rounded-xl.
- **Outline:** Transparent with orange border, orange text.
- **Secondary:** White background, slate border.
- **Corner Radius:** `rounded-xl` (10px) or `rounded-2xl` (16px) for larger buttons.

#### Cards (`Card.tsx`)
- White background, `rounded-xl` or `rounded-2xl`.
- Subtle shadow (`shadow-sm` or `shadow-md`).
- Border: Slate-100 or Slate-200.

#### Badges (`Badge.tsx`)
- **Saffron/Gold:** Low opacity background with colored text and ring.
- **Shape:** Full pill (`rounded-full`).
- **Text:** Uppercase, tracking-wider, 9px-11px.

#### Inputs (`input-group.tsx`, `OTPInput.tsx`)
- **Height:** `h-11`.
- **Corner Radius:** `rounded-xl`.
- **Background:** Slate-50/50 or white.
- **Focus State:** 2px-3px ring in saffron/orange.

---

### 5. Icons & Illustrations

- **Icon Library:** `lucide-react`.
- **Icon Size:** Standard `h-5 w-5` or `h-4 w-4` for inline use.
- **Styling:** Often wrapped in a `p-2.5 rounded-xl` container with light background.

---

### 6. Design Principles

1.  **Consistency:** Use established UI components from `@/components/ui`.
2.  **Mobile-First:** Prioritize touch targets (minimum 44px height).
3.  **Visual Feedback:** Always provide loading states (spinners) and haptic-like transitions.
4.  **Declarative UI:** Use Tailwind classes and Framer Motion for animations.
