# Design System: Team Task Manager

## 1. Visual Theme & Atmosphere

The Team Task Manager conveys a **"Focused Authority"** aesthetic — the kind of environment where serious work gets done, but without feeling oppressive. The overall mood is a blend of **Corporate Precision** and **Modern Warmth**:

- **Auth pages (Login / Signup):** Deep, immersive dark-mode with a celestial gradient backdrop (midnight navy transitioning to indigo-black). Orb-like ambient light pulses softly in the background, creating a sense of depth. The interface itself is a glass panel — frosted, luminous, and floating — achieved via backdrop blur and translucent white surfaces (`bg-white/5 backdrop-blur-xl`). The grid-dot overlay adds a subtle tech texture without distracting from the form.

- **Application pages (Dashboard, Board, Team):** Clean, airy, near-white canvas. Cards feel like physical pieces of paper with whisper-soft borders. The sidebar is a quiet anchor on the left — compact, intelligent, and unobtrusive. Data-heavy sections (charts, task grids) feel organized and scannable thanks to generous whitespace and a strict 12-column rhythm.

- **Overall Density:** Medium. Not minimalist to the point of emptiness, but never cluttered. Every element earns its space.

---

## 2. Color Palette & Roles

### Primary Brand Colors
| Descriptive Name | Hex | Functional Role |
|---|---|---|
| Galactic Blue | `#3B82F6` (`blue-500`) | Primary CTA buttons, active nav states, links, key data highlights |
| Royal Indigo | `#6366F1` (`indigo-500`) | Gradient partner for CTAs, hover transitions, accent on cards |
| Deep Space Navy | `#0F172A` (`slate-950`) | Auth page full-bleed background |
| Midnight Blue | `#1E3A5F` (`blue-950`) | Auth page gradient midpoint |

### Semantic / Status Colors
| Descriptive Name | Hex | Functional Role |
|---|---|---|
| Emerald Success | `#10B981` (`emerald-500`) | DONE status, completion rates, positive metrics |
| Amber Warning | `#F59E0B` (`amber-500`) | MEDIUM priority, ADMIN shield icon |
| Crimson Alert | `#EF4444` (`red-500`) | HIGH priority, error states, overdue indicators |
| Sky In-Progress | `#3B82F6` (`blue-500`) | IN_PROGRESS status, active task count |

### Surface & Neutral Colors (Light Mode — App Shell)
| Descriptive Name | Hex / OKLCH | Functional Role |
|---|---|---|
| Pure Canvas | `oklch(1 0 0)` / `#FFFFFF` | Main page background, card backgrounds |
| Charcoal Ink | `oklch(0.145 0 0)` / `#171717` | Primary body text, headings |
| Ash Muted | `oklch(0.97 0 0)` / `#F5F5F5` | Muted background for secondary sections, hover states |
| Slate Whisper | `oklch(0.922 0 0)` / `#EBEBEB` | Borders, dividers, input strokes |
| Fog Text | `oklch(0.556 0 0)` / `#707070` | Placeholder text, secondary labels, metadata |

### Glassmorphism Palette (Auth Layer Only)
| Descriptive Name | Value | Functional Role |
|---|---|---|
| Frost Glass | `bg-white/5 backdrop-blur-xl` | Login/Signup card surface |
| Ghost Border | `border-white/10` | Card boundary on dark backgrounds |
| Ice Text | `text-blue-200/60` | Subtitles and descriptive text on dark |
| Phantom Placeholder | `text-white/25` | Input placeholder on dark |

---

## 3. Typography Rules

- **Font Family:** `Inter` (Google Fonts) — loaded via `next/font/google`. A geometric sans-serif with humanist curves. Conveys intelligence and clarity.
- **Font Stack Fallback:** `system-ui, -apple-system, sans-serif`

### Type Scale & Weight Usage:
| Role | Size | Weight | Treatment |
|---|---|---|---|
| Page Hero Title (`h1`) | `text-4xl` to `text-5xl` | `font-extrabold` (800) | `tracking-tight`, no letter spacing |
| Section Heading (`h2`) | `text-2xl` to `text-3xl` | `font-bold` (700) | `tracking-tight` |
| Card Title | `text-lg` to `text-xl` | `font-bold` (700) | Normal tracking |
| Body & Descriptions | `text-sm` to `text-base` | `font-normal` (400) | `leading-relaxed` |
| Labels & Metadata | `text-xs` | `font-bold` (700) | `uppercase tracking-widest` |
| Badge / Pill Text | `text-[9px]` to `text-[11px]` | `font-black` (900) | `uppercase tracking-widest` |

### Key Principle:
Use extreme weight contrast to create hierarchy. Jump from `font-normal` body copy directly to `font-extrabold` headings — no medium weights in between. This creates a sharp, confident typographic voice.

---

## 4. Component Stylings

### Buttons
- **Primary CTA:** Horizontal gradient from Galactic Blue (`#3B82F6`) to Royal Indigo (`#6366F1`). Generously rounded corners (`rounded-xl`). Elevated with a colour-tinted shadow (`shadow-blue-500/25`). On hover: gradient lightens and shadow intensifies, with a barely-perceptible lift (`hover:scale-[1.01]`). On press: slight press-down (`active:scale-[0.99]`).
- **Secondary / Outline:** Ghost button with `border-white/10` stroke on dark backgrounds; `border-muted` stroke on light. Background is near-transparent (`bg-white/5` or `bg-transparent`). Text is soft white or muted foreground. Transforms to a light fill on hover.
- **Ghost Button (Sign Out):** No border, no background. Muted foreground text that transitions to `text-destructive` red on hover, with a faint red tint background wash. Conveys reversibility and caution.

### Cards / Containers
- **Standard Card:** Pure white background. A single-pixel border in Slate Whisper (`#EBEBEB`). Corner roundness: **subtly generous** (`rounded-2xl` to `rounded-3xl` for premium areas, `rounded-xl` for standard). Elevation: **whisper-soft shadow** — a diffused, large-radius, low-opacity shadow (`hover:shadow-xl`) that becomes more visible on mouse-enter. Cards lift 0.5px on hover with a smooth `transition-all duration-300`.
- **Muted Section Card:** Uses `bg-muted/30` fill with `bg-muted/30` header — creates a soft distinction between the card header zone and the content body.
- **Stat / Metric Card:** Uses colored pastel tints for backgrounds (e.g., `bg-emerald-50`, `bg-blue-50`) paired with matching icon tints. Bordered with matching hue at low opacity.
- **Glass Card (Auth):** Completely transparent except for `bg-white/5`. Heavy backdrop blur (`backdrop-blur-xl`). `border-white/10` stroke. The shadow is deep and dark (`shadow-2xl shadow-black/20`).

### Inputs & Forms
- **Light Mode:** `bg-muted/30` fill, `rounded-2xl` corners, no visible stroke at rest. On focus: the background shifts to pure white `bg-background`, a 4-pixel ring appears in primary color at low opacity (`focus:ring-4 focus:ring-primary/10`). Smooth transition between states.
- **Dark Mode (Auth):** `bg-white/5` fill, `border-white/10` stroke, white text. Focus ring uses blue (`focus:ring-blue-500/50`). Inputs feel like they are etched into the glass surface.

### Navigation (Sidebar)
- **Container:** `sticky top-0 h-screen` — anchored to the viewport. Thin right border. Light card background (`bg-card`).
- **Active Nav Item:** Filled with primary color gradient pill (`bg-primary`). White foreground text. Subtle shadow below (`shadow-lg shadow-primary/20`). Pill shape: `rounded-lg`.
- **Inactive Nav Item:** Muted text (`text-muted-foreground`). On hover: light muted fill (`hover:bg-muted`), icon scales up slightly (`group-hover:scale-110 transition-transform`).
- **Collapse Button:** Small circular button `-right-3` from the edge. Acts as a peek-out toggle. `rounded-full` with a subtle shadow.

### Badges & Status Chips
- Shape: **Pill-shaped** (`rounded-full`). 
- Text: ALL CAPS, extra-wide letter spacing (`tracking-widest`), ultra-bold (`font-black`).
- Priority HIGH: Red pastel fill (`bg-red-100 text-red-700`).
- Priority MEDIUM: Amber pastel fill (`bg-amber-100 text-amber-700`).
- Priority LOW: Emerald pastel fill (`bg-emerald-100 text-emerald-700`).
- Designation/Role badge: Primary tint (`bg-primary/10 text-primary`).

---

## 5. Layout Principles

### Grid & Spacing
- **Sidebar Width:** 256px expanded (`w-64`), 80px collapsed (`w-20`). Animated via CSS transition.
- **Main Content Area:** `flex-1` fluid. Inner padding: `p-8` (32px) on all sides.
- **Section Spacing:** `space-y-12` between major page sections, `space-y-6` between sub-sections.
- **Card Grid:** Responsive. Starts at 1 column, expands to `md:grid-cols-2`, `lg:grid-cols-3`, `xl:grid-cols-4` for team members. Task board uses a horizontal flex row.

### Whitespace Philosophy
**"Let it breathe."** This app is used for extended periods. Cramped UI causes cognitive fatigue. Every section has generous top/bottom margins. Cards have internal padding of `p-5` to `p-8`. Stats and numbers are given prominent space to be "scanned, not read."

### Depth & Elevation Model
Three distinct layers of elevation:
1. **Base Canvas** — Page background. Flat, no shadow.
2. **Card Layer** — 1px border + whisper-soft shadow. Lifts slightly on hover.
3. **Modal / Overlay Layer** — Full-screen backdrop blur (`backdrop-blur-md bg-black/60`). The modal panel itself has `shadow-2xl` and `rounded-3xl`. Feels like a physical sheet placed on top of the world.

### Motion & Animation
- All interactive transitions use `duration-300` with `ease` curves.
- Hover effects are subtle: scale is `scale-[1.01]` at most, not `scale-110`.
- Icons in nav links use `group-hover:scale-110` for micro-delight.
- Background orbs on the auth page use `animate-pulse` at very low opacity to imply life without distraction.
- Modals animate in with `animate-in fade-in zoom-in duration-300`.

---

## 6. High-Impact UI Enhancement Opportunities

### Enhancement 1: Glassmorphic Command Palette
A `Cmd+K` triggered floating panel that allows users to quickly navigate to any task, page, or action. Built as an overlay on top of all content. Uses the Glass Card pattern (frosted glass background, `backdrop-blur-xl`) with a dark gradient background. Supports fuzzy search across task titles, team members, and navigation routes. Powered by the existing `prisma.task.findMany` and `prisma.user.findMany` server actions via MCP.

### Enhancement 2: Animated Kanban with Micro-Feedback
Upgrade the existing drag-and-drop Kanban board with rich CSS micro-animations. When a task card is picked up, it rotates 2-3° and scales up. The target column glows with a pulsing primary-color ring to indicate a valid drop zone. When dropped, the card snaps into place with a satisfying spring-like bounce. Add a "confetti burst" on moving a card to the DONE column. All via CSS keyframes + dnd-kit event hooks.

### Enhancement 3: Real-time Task Activity Feed
A live sidebar panel or bottom-of-page feed showing a chronological stream of task state changes: "Ansh moved 'Fix Auth Bug' → DONE", "Admin assigned 'Deploy Feature' to Riya". Powered by polling `prisma.task.findMany({ orderBy: { updatedAt: 'desc' }, take: 10 })` via a React Query interval refetch. Each feed item slides in from the bottom with a subtle fade animation. Uses the Emerald/Blue/Amber color system to color-code event types.
