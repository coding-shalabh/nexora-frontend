# Nexora CRM - Soft Lavender Design System

> Complete design system documentation for building consistent UI components.

---

## Table of Contents

1. [Brand Identity](#1-brand-identity)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Border & Radius](#5-border--radius)
6. [Shadows & Effects](#6-shadows--effects)
7. [Buttons](#7-buttons)
8. [Icons](#8-icons)
9. [Cards](#9-cards)
10. [Badges & Tags](#10-badges--tags)
11. [Form Elements](#11-form-elements)
12. [Navigation](#12-navigation)
13. [Avatars & Profiles](#13-avatars--profiles)
14. [Tables & Lists](#14-tables--lists)
15. [Modals & Dropdowns](#15-modals--dropdowns)
16. [Status & Indicators](#16-status--indicators)
17. [Charts & Data Viz](#17-charts--data-viz)
18. [Animations](#18-animations)
19. [CRM-Specific Components](#19-crm-specific-components)
20. [CSS Variables](#20-css-variables)

---

## 1. Brand Identity

### Theme Name: **Soft Lavender**

| Attribute     | Value                        |
| ------------- | ---------------------------- |
| Primary Color | Deep Blue `#0004c3`          |
| Background    | Soft Lavender `#ecf4ff`      |
| Content Area  | Pure White `#ffffff`         |
| Font          | Inter                        |
| Style         | Clean, Modern, Professional  |
| Mood          | Calm, Trustworthy, Efficient |

### Design Principles

1. **Clarity** - Information hierarchy through color and size
2. **Consistency** - Same patterns across all components
3. **Calmness** - Soft colors reduce visual fatigue
4. **Efficiency** - Compact layouts maximize screen space

---

## 2. Color System

### 2.1 Brand Colors

| Name              | Hex                  | RGB         | CSS Variable      | Usage                          |
| ----------------- | -------------------- | ----------- | ----------------- | ------------------------------ |
| **Brand Primary** | `#0004c3`            | `0, 4, 195` | `--brand-primary` | Primary actions, active states |
| **Brand Hover**   | `#0003a3`            | `0, 3, 163` | `--brand-hover`   | Hover states                   |
| **Brand Light**   | `rgba(0,4,195,0.06)` | -           | `--brand-light`   | Subtle backgrounds             |
| **Brand Border**  | `rgba(0,4,195,0.15)` | -           | `--brand-border`  | Accent borders                 |
| **Brand Text**    | `#0004c3`            | -           | `--brand-text`    | Links, active text             |

### 2.2 Background Colors

| Name           | Hex                     | Tailwind       | Usage                  |
| -------------- | ----------------------- | -------------- | ---------------------- |
| **Theme BG**   | `#ecf4ff`               | `bg-[#ecf4ff]` | Header, sidebar, rails |
| **Card BG**    | `#f8fafc`               | `bg-slate-50`  | Data cards, panels     |
| **Content BG** | `#ffffff`               | `bg-white`     | Main content area      |
| **Item BG**    | `#ffffff`               | `bg-white`     | List items, rows       |
| **Hover BG**   | `rgba(255,255,255,0.5)` | `bg-white/50`  | Hover on theme bg      |
| **Muted BG**   | `#f1f5f9`               | `bg-slate-100` | Disabled, inactive     |

### 2.3 Text Colors

| Name               | Hex       | Tailwind        | Usage               |
| ------------------ | --------- | --------------- | ------------------- |
| **Text Primary**   | `#111827` | `text-gray-900` | Headlines, values   |
| **Text Secondary** | `#374151` | `text-gray-700` | Labels, names       |
| **Text Body**      | `#4b5563` | `text-gray-600` | Body text           |
| **Text Muted**     | `#6b7280` | `text-gray-500` | Descriptions        |
| **Text Subtle**    | `#9ca3af` | `text-gray-400` | Placeholders, hints |
| **Text Disabled**  | `#d1d5db` | `text-gray-300` | Disabled text       |
| **Text White**     | `#ffffff` | `text-white`    | On dark backgrounds |

### 2.4 Semantic Colors

| Purpose     | Main      | Light BG  | Light Text | Dark      | Usage               |
| ----------- | --------- | --------- | ---------- | --------- | ------------------- |
| **Success** | `#10b981` | `#d1fae5` | `#059669`  | `#047857` | Completed, positive |
| **Warning** | `#f59e0b` | `#fef3c7` | `#d97706`  | `#b45309` | Caution, pending    |
| **Error**   | `#ef4444` | `#fee2e2` | `#dc2626`  | `#b91c1c` | Failed, alerts      |
| **Info**    | `#3b82f6` | `#dbeafe` | `#2563eb`  | `#1d4ed8` | Information         |

**Tailwind Equivalents:**

- Success: `emerald-500`, `emerald-100`, `emerald-600`, `emerald-700`
- Warning: `amber-500`, `amber-100`, `amber-600`, `amber-700`
- Error: `red-500`, `red-100`, `red-600`, `red-700`
- Info: `blue-500`, `blue-100`, `blue-600`, `blue-700`

### 2.5 Channel Colors

| Channel       | Color     | Tailwind                      | Icon Text |
| ------------- | --------- | ----------------------------- | --------- |
| **WhatsApp**  | `#22c55e` | `bg-green-500`                | WA        |
| **Email**     | `#3b82f6` | `bg-blue-500`                 | EM        |
| **Instagram** | Gradient  | `from-purple-500 to-pink-500` | IG        |
| **SMS**       | `#f97316` | `bg-orange-500`               | SM        |
| **Phone**     | `#8b5cf6` | `bg-violet-500`               | PH        |
| **Web Chat**  | `#06b6d4` | `bg-cyan-500`                 | WC        |
| **Facebook**  | `#1d4ed8` | `bg-blue-700`                 | FB        |
| **Twitter/X** | `#171717` | `bg-neutral-900`              | X         |
| **LinkedIn**  | `#0077b5` | `bg-[#0077b5]`                | LI        |

### 2.6 Status Colors

| Status             | Color     | Light BG  | Usage             |
| ------------------ | --------- | --------- | ----------------- |
| **Active**         | `#10b981` | `#d1fae5` | Online, active    |
| **Away**           | `#f59e0b` | `#fef3c7` | Away, busy        |
| **Offline**        | `#6b7280` | `#f3f4f6` | Offline, inactive |
| **Do Not Disturb** | `#ef4444` | `#fee2e2` | DND mode          |

### 2.7 Priority Colors

| Priority     | Color     | Tailwind        |
| ------------ | --------- | --------------- |
| **Critical** | `#dc2626` | `bg-red-600`    |
| **High**     | `#f97316` | `bg-orange-500` |
| **Medium**   | `#eab308` | `bg-yellow-500` |
| **Low**      | `#22c55e` | `bg-green-500`  |
| **None**     | `#9ca3af` | `bg-gray-400`   |

### 2.8 Deal Stage Colors

| Stage           | Color     | Tailwind         |
| --------------- | --------- | ---------------- |
| **Lead**        | `#8b5cf6` | `bg-violet-500`  |
| **Qualified**   | `#3b82f6` | `bg-blue-500`    |
| **Proposal**    | `#f59e0b` | `bg-amber-500`   |
| **Negotiation** | `#f97316` | `bg-orange-500`  |
| **Won**         | `#10b981` | `bg-emerald-500` |
| **Lost**        | `#ef4444` | `bg-red-500`     |

---

## 3. Typography

### 3.1 Font Family

```css
/* Primary Font */
font-family:
  'Inter',
  -apple-system,
  BlinkMacSystemFont,
  'Segoe UI',
  Roboto,
  'Helvetica Neue',
  Arial,
  sans-serif;

/* Monospace (for code, IDs) */
font-family: 'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, 'Courier New', monospace;
```

### 3.2 Font Weights

| Weight       | Value | CSS             | Usage              |
| ------------ | ----- | --------------- | ------------------ |
| **Light**    | 300   | `font-light`    | Large display text |
| **Regular**  | 400   | `font-normal`   | Body text          |
| **Medium**   | 500   | `font-medium`   | Labels, navigation |
| **Semibold** | 600   | `font-semibold` | Section headers    |
| **Bold**     | 700   | `font-bold`     | Headlines, values  |

### 3.3 Complete Font Scale

| Name           | Size | Line Height | Tailwind      | Weight      | Usage           |
| -------------- | ---- | ----------- | ------------- | ----------- | --------------- |
| **Display XL** | 48px | 1.1         | `text-5xl`    | 700         | Hero sections   |
| **Display L**  | 36px | 1.15        | `text-4xl`    | 700         | Page hero       |
| **Display**    | 30px | 1.2         | `text-3xl`    | 700         | Big numbers     |
| **H1**         | 24px | 1.25        | `text-2xl`    | 700         | Page titles     |
| **H2**         | 20px | 1.3         | `text-xl`     | 700/600     | Card values     |
| **H3**         | 18px | 1.35        | `text-lg`     | 600         | Section headers |
| **H4**         | 16px | 1.4         | `text-base`   | 600         | Subsections     |
| **Body L**     | 16px | 1.5         | `text-base`   | 400         | Large body      |
| **Body**       | 14px | 1.5         | `text-sm`     | 400         | Default body    |
| **Body S**     | 13px | 1.45        | `text-[13px]` | 400         | Compact body    |
| **Small**      | 12px | 1.4         | `text-xs`     | 400/500     | Captions        |
| **Caption**    | 11px | 1.35        | `text-[11px]` | 500         | Card labels     |
| **Tiny**       | 10px | 1.3         | `text-[10px]` | 400/500/700 | Badges, labels  |
| **Micro**      | 9px  | 1.25        | `text-[9px]`  | 500         | Timestamps      |
| **Nano**       | 8px  | 1.2         | `text-[8px]`  | 500         | Progress %      |
| **Mini**       | 7px  | 1.15        | `text-[7px]`  | 500         | Icon badges     |

### 3.4 Font Styling by Context

#### Page Titles

```html
<h1 class="text-2xl font-bold text-gray-400">Dashboard</h1>
<!-- Muted gray for page titles to not compete with content -->
```

#### Section Headers

```html
<h2 class="text-lg font-semibold text-gray-900">Recent Activity</h2>
```

#### Card Titles

```html
<p class="text-[11px] text-gray-500 font-medium mb-1.5">Top sales from</p>
```

#### Card Values (Large)

```html
<p class="text-3xl font-bold text-gray-900">$528,976</p>
```

#### Card Values (Medium)

```html
<p class="text-xl font-bold text-gray-900">$42,300</p>
```

#### Card Values (Small)

```html
<p class="text-lg font-bold text-gray-900">108%</p>
```

#### Labels

```html
<span class="text-[10px] text-gray-400 font-medium">Win rate</span>
```

#### Body Text

```html
<p class="text-sm text-gray-600">Contact added successfully</p>
```

#### Muted/Secondary

```html
<span class="text-xs text-gray-500">Last updated 2 hours ago</span>
```

#### Links

```html
<a class="text-sm text-[#0004c3] hover:underline">View details</a>
```

#### Monospace (IDs, Codes)

```html
<code class="text-xs font-mono text-gray-600 bg-gray-100 px-1 rounded">TKT-2024-001</code>
```

### 3.5 Text Truncation

```html
<!-- Single line truncate -->
<p class="truncate">Long text that will be cut off...</p>

<!-- Multi-line clamp (2 lines) -->
<p class="line-clamp-2">Long text that will show 2 lines then ellipsis...</p>

<!-- Multi-line clamp (3 lines) -->
<p class="line-clamp-3">Long text...</p>
```

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

| Token | Pixels | Tailwind           | Usage        |
| ----- | ------ | ------------------ | ------------ |
| `0`   | 0px    | `p-0`, `m-0`       | Reset        |
| `px`  | 1px    | `p-px`             | Hairline     |
| `0.5` | 2px    | `p-0.5`, `gap-0.5` | Micro        |
| `1`   | 4px    | `p-1`, `gap-1`     | Tight        |
| `1.5` | 6px    | `p-1.5`, `gap-1.5` | Compact      |
| `2`   | 8px    | `p-2`, `gap-2`     | Small        |
| `2.5` | 10px   | `p-2.5`, `gap-2.5` | Default card |
| `3`   | 12px   | `p-3`, `gap-3`     | Standard     |
| `4`   | 16px   | `p-4`, `gap-4`     | Medium       |
| `5`   | 20px   | `p-5`, `gap-5`     | Large        |
| `6`   | 24px   | `p-6`, `gap-6`     | XL           |
| `8`   | 32px   | `p-8`, `gap-8`     | XXL          |
| `10`  | 40px   | `p-10`             | Sections     |
| `12`  | 48px   | `p-12`             | Page margins |

### 4.2 Layout Dimensions

| Element                     | Size  | Tailwind        |
| --------------------------- | ----- | --------------- |
| **Header Height**           | 56px  | `h-14`          |
| **Icon Rail Width**         | 56px  | `w-14`          |
| **Sidebar Width**           | 208px | `w-52`          |
| **Sidebar Collapsed**       | 0px   | `w-0`           |
| **Content Wrapper Padding** | 6px   | `p-1.5`         |
| **Content Border Radius**   | 16px  | `rounded-2xl`   |
| **Min Content Width**       | 320px | `min-w-[320px]` |

### 4.3 Grid Systems

#### Dashboard Top Row (33/33/34)

```html
<div class="grid grid-cols-3 gap-3">
  <div><!-- 33% --></div>
  <div><!-- 33% --></div>
  <div><!-- 34% --></div>
</div>
```

#### Two Column (50/50)

```html
<div class="grid grid-cols-2 gap-2.5">
  <div><!-- 50% --></div>
  <div><!-- 50% --></div>
</div>
```

#### Three Column

```html
<div class="grid grid-cols-3 gap-4">
  <div><!-- 33% --></div>
  <div><!-- 33% --></div>
  <div><!-- 33% --></div>
</div>
```

#### Four Column

```html
<div class="grid grid-cols-4 gap-4">
  <!-- 25% each -->
</div>
```

#### Responsive Grid

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  <!-- Responsive columns -->
</div>
```

### 4.4 Flex Patterns

#### Space Between

```html
<div class="flex items-center justify-between">
  <span>Left</span>
  <span>Right</span>
</div>
```

#### Centered

```html
<div class="flex items-center justify-center">
  <span>Centered</span>
</div>
```

#### Fill Remaining Height

```html
<div class="flex flex-col h-full">
  <div>Fixed</div>
  <div class="flex-1">Fills remaining</div>
  <div class="mt-auto">Footer</div>
</div>
```

---

## 5. Border & Radius

### 5.1 Border Radius Scale

| Name     | Value  | Tailwind       | Usage                   |
| -------- | ------ | -------------- | ----------------------- |
| **None** | 0      | `rounded-none` | -                       |
| **XS**   | 2px    | `rounded-sm`   | Tiny elements           |
| **SM**   | 4px    | `rounded`      | Progress bars, badges   |
| **MD**   | 6px    | `rounded-md`   | List items, small cards |
| **LG**   | 8px    | `rounded-lg`   | Buttons, inputs         |
| **XL**   | 12px   | `rounded-xl`   | Cards, panels           |
| **2XL**  | 16px   | `rounded-2xl`  | Main containers         |
| **3XL**  | 24px   | `rounded-3xl`  | Large modals            |
| **Full** | 9999px | `rounded-full` | Avatars, pills          |

### 5.2 Border Styles

```html
<!-- Default border -->
<div class="border border-gray-200">
  <!-- Subtle border -->
  <div class="border border-gray-100">
    <!-- Strong border -->
    <div class="border border-gray-300">
      <!-- Brand border -->
      <div style="border: 1px solid rgba(0, 4, 195, 0.15);">
        <!-- Alert border -->
        <div class="border border-red-200">
          <!-- Success border -->
          <div class="border border-emerald-200">
            <!-- Left accent border -->
            <div class="border-l-4 border-l-[#0004c3]">
              <!-- Divider line -->
              <hr class="border-gray-200" />

              <!-- Subtle divider -->
              <div class="border-l border-gray-200/60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

### 5.3 Border Width

| Width | Tailwind   | Usage       |
| ----- | ---------- | ----------- |
| 1px   | `border`   | Default     |
| 2px   | `border-2` | Emphasis    |
| 4px   | `border-4` | Accent bars |
| 0     | `border-0` | Remove      |

---

## 6. Shadows & Effects

### 6.1 Shadow Scale

| Name           | CSS                           | Tailwind      | Usage      |
| -------------- | ----------------------------- | ------------- | ---------- |
| **None**       | none                          | `shadow-none` | Flat       |
| **XS**         | `0 1px 2px rgba(0,0,0,0.05)`  | `shadow-xs`   | Subtle     |
| **SM**         | `0 1px 3px rgba(0,0,0,0.1)`   | `shadow-sm`   | Cards      |
| **MD**         | `0 4px 6px rgba(0,0,0,0.1)`   | `shadow-md`   | Dropdowns  |
| **LG**         | `0 10px 15px rgba(0,0,0,0.1)` | `shadow-lg`   | Modals     |
| **XL**         | `0 20px 25px rgba(0,0,0,0.1)` | `shadow-xl`   | Popovers   |
| **Hover Lift** | `0 8px 25px rgba(0,0,0,0.08)` | Custom        | Card hover |

### 6.2 Hover Effects

```css
/* Card Hover Lift */
.hover-lift {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

/* Button Press */
.press:active {
  transform: scale(0.98);
}

/* Subtle Scale */
.hover-scale:hover {
  transform: scale(1.02);
}
```

### 6.3 Opacity States

| State             | Opacity | Tailwind      |
| ----------------- | ------- | ------------- |
| **Disabled**      | 50%     | `opacity-50`  |
| **Hover overlay** | 50%     | `bg-white/50` |
| **Subtle**        | 60%     | `opacity-60`  |
| **Muted**         | 40%     | `opacity-40`  |

### 6.4 Transitions

| Property      | Duration | Easing | CSS                                 |
| ------------- | -------- | ------ | ----------------------------------- |
| **Default**   | 150ms    | ease   | `transition`                        |
| **Colors**    | 150ms    | ease   | `transition-colors`                 |
| **All**       | 300ms    | ease   | `transition-all duration-300`       |
| **Transform** | 300ms    | ease   | `transition-transform duration-300` |
| **Slow**      | 500ms    | ease   | `duration-500`                      |

---

## 7. Buttons

### 7.1 Button Sizes

| Size   | Height | Padding | Font | Radius       | Icon |
| ------ | ------ | ------- | ---- | ------------ | ---- |
| **XS** | 24px   | `px-2`  | 11px | `rounded`    | 12px |
| **SM** | 32px   | `px-3`  | 12px | `rounded-lg` | 14px |
| **MD** | 36px   | `px-4`  | 14px | `rounded-lg` | 16px |
| **LG** | 44px   | `px-6`  | 16px | `rounded-lg` | 20px |
| **XL** | 52px   | `px-8`  | 18px | `rounded-xl` | 24px |

### 7.2 Button Variants

#### Primary Button

```html
<button
  class="h-9 px-4 rounded-lg text-sm font-medium text-white transition hover:opacity-90 active:scale-[0.98]"
  style="background: #0004c3;"
>
  Create Contact
</button>
```

#### Secondary Button

```html
<button
  class="h-9 px-4 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
>
  Cancel
</button>
```

#### Outline Button

```html
<button
  class="h-9 px-4 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
>
  Export
</button>
```

#### Ghost Button

```html
<button class="h-9 px-4 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition">
  View All
</button>
```

#### Danger Button

```html
<button
  class="h-9 px-4 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition"
>
  Delete
</button>
```

#### Success Button

```html
<button
  class="h-9 px-4 rounded-lg text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition"
>
  Confirm
</button>
```

#### Link Button

```html
<button class="text-sm font-medium text-[#0004c3] hover:underline">Learn more</button>
```

### 7.3 Icon Buttons

#### Square Icon Button (Default)

```html
<button
  class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition"
>
  <svg class="w-4 h-4">...</svg>
</button>
```

#### Square Icon Button (Active)

```html
<button
  class="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 transition"
>
  <svg class="w-4 h-4">...</svg>
</button>
```

#### Round Icon Button (Add/Primary)

```html
<button
  class="w-9 h-9 rounded-full flex items-center justify-center text-white transition hover:opacity-90"
  style="background: #0004c3;"
>
  <svg class="w-4 h-4">...</svg>
</button>
```

#### Round Icon Button (Secondary)

```html
<button
  class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition"
>
  <svg class="w-4 h-4">...</svg>
</button>
```

#### Navigation Rail Button (Inactive)

```html
<button
  class="w-10 h-10 rounded-xl hover:bg-white/50 flex items-center justify-center text-gray-400 transition"
>
  <svg class="w-5 h-5">...</svg>
</button>
```

#### Navigation Rail Button (Active)

```html
<button
  class="w-10 h-10 rounded-xl flex items-center justify-center text-white transition"
  style="background: #0004c3;"
>
  <svg class="w-5 h-5">...</svg>
</button>
```

### 7.4 Button with Icon

#### Icon Left

```html
<button
  class="h-9 px-4 rounded-lg text-sm font-medium text-white flex items-center gap-2 transition"
  style="background: #0004c3;"
>
  <svg class="w-4 h-4">...</svg>
  Add Contact
</button>
```

#### Icon Right

```html
<button
  class="h-9 px-4 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 flex items-center gap-2 hover:bg-gray-50 transition"
>
  Export
  <svg class="w-4 h-4">...</svg>
</button>
```

### 7.5 Button States

| State        | Style                                                   |
| ------------ | ------------------------------------------------------- |
| **Default**  | Base styles                                             |
| **Hover**    | `hover:opacity-90` or `hover:bg-*`                      |
| **Active**   | `active:scale-[0.98]`                                   |
| **Focus**    | `focus:ring-2 focus:ring-offset-2 focus:ring-[#0004c3]` |
| **Disabled** | `opacity-50 cursor-not-allowed`                         |
| **Loading**  | Show spinner, `pointer-events-none`                     |

### 7.6 Button Groups

```html
<div class="flex">
  <button
    class="h-9 px-4 rounded-l-lg border border-r-0 border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
  >
    Day
  </button>
  <button
    class="h-9 px-4 border border-r-0 border-gray-300 text-sm text-white"
    style="background: #0004c3;"
  >
    Week
  </button>
  <button
    class="h-9 px-4 rounded-r-lg border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
  >
    Month
  </button>
</div>
```

---

## 8. Icons

### 8.1 Icon Library

**Primary:** Heroicons (Outline style)
**Secondary:** Lucide Icons

### 8.2 Icon Sizes

| Name    | Size | Tailwind      | Stroke | Usage            |
| ------- | ---- | ------------- | ------ | ---------------- |
| **XS**  | 12px | `w-3 h-3`     | 2      | Tiny indicators  |
| **SM**  | 14px | `w-3.5 h-3.5` | 1.5    | Footer, captions |
| **MD**  | 16px | `w-4 h-4`     | 2      | Buttons, actions |
| **LG**  | 20px | `w-5 h-5`     | 1.5    | Navigation       |
| **XL**  | 24px | `w-6 h-6`     | 1.5    | Headers          |
| **2XL** | 32px | `w-8 h-8`     | 1.5    | Empty states     |
| **3XL** | 48px | `w-12 h-12`   | 1      | Hero icons       |

### 8.3 Icon Colors

| Context      | Color     | Tailwind           |
| ------------ | --------- | ------------------ |
| **Default**  | `#9ca3af` | `text-gray-400`    |
| **Hover**    | `#4b5563` | `text-gray-600`    |
| **Active**   | `#0004c3` | Brand color        |
| **On Brand** | `#ffffff` | `text-white`       |
| **Success**  | `#10b981` | `text-emerald-500` |
| **Warning**  | `#f59e0b` | `text-amber-500`   |
| **Error**    | `#ef4444` | `text-red-500`     |

### 8.4 Common Icons

#### Navigation

```html
<!-- Home -->
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
  />
</svg>

<!-- Inbox -->
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
  />
</svg>

<!-- Contacts/Users -->
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
  />
</svg>

<!-- Settings -->
<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  />
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  />
</svg>
```

#### Actions

```html
<!-- Plus/Add -->
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
</svg>

<!-- Search -->
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
  />
</svg>

<!-- More/Menu (Vertical) -->
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
  />
</svg>

<!-- More/Menu (Horizontal) -->
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
  />
</svg>

<!-- Chevron Down -->
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
</svg>

<!-- Chevron Right -->
<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
</svg>

<!-- Close/X -->
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
</svg>

<!-- Check -->
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
</svg>

<!-- Calendar -->
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
  />
</svg>

<!-- Refresh -->
<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
  />
</svg>
```

#### Status

```html
<!-- Star (Outline) -->
<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
  />
</svg>

<!-- Clock/Time -->
<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="1.5"
    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
  />
</svg>

<!-- Arrow Up (Trend) -->
<svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M5 10l7-7m0 0l7 7m-7-7v18"
  />
</svg>

<!-- Arrow Down (Trend) -->
<svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    d="M19 14l-7 7m0 0l-7-7m7 7V3"
  />
</svg>
```

---

## 9. Cards

### 9.1 Card Variants

#### Standard Card (White)

```html
<div class="bg-white rounded-xl border border-gray-200 p-3 hover-lift">
  <!-- Content -->
</div>
```

#### Data Card (Gray BG)

```html
<div class="rounded-xl p-2.5 flex flex-col" style="background: #f8fafc;">
  <p class="text-[11px] text-gray-500 font-medium mb-1.5">Card Title</p>
  <!-- Content -->
</div>
```

#### Stat Card (Compact)

```html
<div class="bg-white rounded-xl border border-gray-200 p-3 card-animate hover-lift">
  <p class="text-[10px] text-gray-400 mb-1">Label</p>
  <p class="text-xl font-bold text-gray-900">Value</p>
</div>
```

#### Highlighted Card (Brand)

```html
<div
  class="rounded-xl p-3 hover-lift"
  style="background: rgba(0, 4, 195, 0.06); border: 1px solid rgba(0, 4, 195, 0.15);"
>
  <p class="text-[10px] mb-1" style="color: #0004c3;">Label</p>
  <p class="text-xl font-bold" style="color: #0004c3;">Value</p>
</div>
```

#### Alert Card (Featured/Pink)

```html
<div
  class="rounded-xl p-3 hover-lift relative"
  style="background: #fef1f1; border: 1px solid #fecaca;"
>
  <div class="absolute top-2 right-2">
    <!-- Optional icon -->
  </div>
  <p class="text-[10px] text-gray-500 mb-1">Label</p>
  <p class="text-xl font-bold text-gray-900">Value</p>
</div>
```

#### Success Card

```html
<div class="rounded-xl p-3 bg-emerald-50 border border-emerald-200">
  <!-- Content -->
</div>
```

#### Warning Card

```html
<div class="rounded-xl p-3 bg-amber-50 border border-amber-200">
  <!-- Content -->
</div>
```

#### Error Card

```html
<div class="rounded-xl p-3 bg-red-50 border border-red-200">
  <!-- Content -->
</div>
```

### 9.2 Card with Header

```html
<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
  <!-- Header -->
  <div class="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
    <h3 class="text-sm font-semibold text-gray-900">Card Title</h3>
    <button
      class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"
    >
      <svg class="w-4 h-4">...</svg>
    </button>
  </div>
  <!-- Body -->
  <div class="p-4">
    <!-- Content -->
  </div>
</div>
```

### 9.3 Card with Footer

```html
<div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
  <div class="p-4">
    <!-- Content -->
  </div>
  <div class="px-4 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-2">
    <button class="text-sm text-gray-600 hover:text-gray-900">Cancel</button>
    <button class="h-8 px-3 rounded-lg text-sm text-white" style="background: #0004c3;">
      Save
    </button>
  </div>
</div>
```

---

## 10. Badges & Tags

### 10.1 Status Badges

#### Trend Badge (Positive)

```html
<span class="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-medium"
  >↑ 7.9%</span
>
```

#### Trend Badge (Negative)

```html
<span class="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-600 font-medium"
  >↓ 2.3%</span
>
```

#### Count Badge (Pill)

```html
<span class="inline-block text-sm px-2 py-0.5 rounded bg-rose-400 text-white font-bold">256</span>
```

#### Notification Badge (Dot)

```html
<span
  class="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-medium"
  >2</span
>
```

#### Notification Dot (No Number)

```html
<span class="w-2 h-2 rounded-full bg-red-500"></span>
```

### 10.2 Status Tags

```html
<!-- Active -->
<span class="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium"
  >Active</span
>

<!-- Pending -->
<span class="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">Pending</span>

<!-- Closed -->
<span class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600 font-medium">Closed</span>

<!-- Urgent -->
<span class="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">Urgent</span>
```

### 10.3 Icon Badges (Channel/Source)

```html
<!-- WhatsApp -->
<div class="w-4 h-4 rounded bg-green-500 flex items-center justify-center">
  <span class="text-[7px] text-white font-medium">WA</span>
</div>

<!-- Email -->
<div class="w-4 h-4 rounded bg-blue-500 flex items-center justify-center">
  <span class="text-[7px] text-white font-medium">EM</span>
</div>

<!-- Instagram -->
<div
  class="w-4 h-4 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center"
>
  <span class="text-[7px] text-white font-medium">IG</span>
</div>

<!-- SMS -->
<div class="w-4 h-4 rounded bg-orange-500 flex items-center justify-center">
  <span class="text-[7px] text-white font-medium">SM</span>
</div>

<!-- Brand/Enterprise -->
<div class="w-4 h-4 rounded flex items-center justify-center" style="background: #0004c3;">
  <span class="text-[7px] text-white font-medium">EN</span>
</div>
```

### 10.4 Larger Icon Badges (Avatar Style)

```html
<div
  class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-[8px] text-white font-medium"
>
  MI
</div>
```

### 10.5 Priority Tags

```html
<!-- Critical -->
<span class="text-[10px] px-1.5 py-0.5 rounded bg-red-600 text-white font-medium">Critical</span>

<!-- High -->
<span class="text-[10px] px-1.5 py-0.5 rounded bg-orange-500 text-white font-medium">High</span>

<!-- Medium -->
<span class="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500 text-gray-900 font-medium"
  >Medium</span
>

<!-- Low -->
<span class="text-[10px] px-1.5 py-0.5 rounded bg-green-500 text-white font-medium">Low</span>
```

---

## 11. Form Elements

### 11.1 Text Input

#### Default

```html
<input
  type="text"
  placeholder="Enter name..."
  class="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400
         focus:outline-none focus:border-[#0004c3] focus:ring-1 focus:ring-[#0004c3] transition"
/>
```

#### With Icon (Left)

```html
<div class="relative">
  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">...</svg>
  <input
    type="text"
    placeholder="Search..."
    class="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 text-sm"
  />
</div>
```

#### Search Input (Rounded)

```html
<div class="relative">
  <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">...</svg>
  <input
    type="text"
    placeholder="Try searching 'insights'"
    class="w-full bg-white border border-gray-200 rounded-full pl-9 pr-4 py-2 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300"
  />
</div>
```

#### Error State

```html
<input
  type="text"
  class="w-full h-10 px-3 rounded-lg border border-red-500 text-sm text-gray-900
         focus:outline-none focus:ring-1 focus:ring-red-500"
/>
<p class="text-xs text-red-500 mt-1">This field is required</p>
```

#### Disabled

```html
<input
  type="text"
  disabled
  class="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-100 text-sm text-gray-400 cursor-not-allowed"
/>
```

### 11.2 Textarea

```html
<textarea
  rows="4"
  placeholder="Enter description..."
  class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder-gray-400
         focus:outline-none focus:border-[#0004c3] focus:ring-1 focus:ring-[#0004c3] resize-none"
></textarea>
```

### 11.3 Select

```html
<div class="relative">
  <select
    class="w-full h-10 px-3 pr-10 rounded-lg border border-gray-200 text-sm text-gray-900 appearance-none focus:outline-none focus:border-[#0004c3]"
  >
    <option>Select option...</option>
    <option>Option 1</option>
    <option>Option 2</option>
  </select>
  <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
  </svg>
</div>
```

### 11.4 Checkbox

```html
<label class="flex items-center gap-2 cursor-pointer">
  <input
    type="checkbox"
    class="w-4 h-4 rounded border-gray-300 text-[#0004c3] focus:ring-[#0004c3]"
  />
  <span class="text-sm text-gray-700">Remember me</span>
</label>
```

### 11.5 Radio

```html
<label class="flex items-center gap-2 cursor-pointer">
  <input
    type="radio"
    name="option"
    class="w-4 h-4 border-gray-300 text-[#0004c3] focus:ring-[#0004c3]"
  />
  <span class="text-sm text-gray-700">Option 1</span>
</label>
```

### 11.6 Toggle Switch

```html
<button
  type="button"
  class="relative w-11 h-6 rounded-full transition-colors"
  style="background: #0004c3;"
>
  <span
    class="absolute right-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
  ></span>
</button>

<!-- Off state -->
<button type="button" class="relative w-11 h-6 rounded-full bg-gray-200 transition-colors">
  <span
    class="absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform"
  ></span>
</button>
```

### 11.7 Date Picker Trigger

```html
<div
  class="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 cursor-pointer hover:border-gray-300 transition"
>
  <svg class="w-4 h-4 text-gray-400">...</svg>
  <span>Sep 1 - Nov 30, 2023</span>
  <svg class="w-4 h-4 text-gray-400">...</svg>
</div>
```

### 11.8 Form Layout

```html
<!-- Form Group -->
<div class="space-y-1.5">
  <label class="text-sm font-medium text-gray-700">Email</label>
  <input type="email" class="..." />
</div>

<!-- Inline Form -->
<div class="flex items-end gap-3">
  <div class="flex-1 space-y-1.5">
    <label class="text-sm font-medium text-gray-700">Search</label>
    <input type="text" class="..." />
  </div>
  <button class="h-10 px-4 rounded-lg text-white" style="background: #0004c3;">Search</button>
</div>

<!-- Two Column Form -->
<div class="grid grid-cols-2 gap-4">
  <div class="space-y-1.5">
    <label class="text-sm font-medium text-gray-700">First Name</label>
    <input type="text" class="..." />
  </div>
  <div class="space-y-1.5">
    <label class="text-sm font-medium text-gray-700">Last Name</label>
    <input type="text" class="..." />
  </div>
</div>
```

---

## 12. Navigation

### 12.1 Global Header

```html
<header
  class="fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 z-50"
  style="background: #ecf4ff;"
>
  <!-- Left: Logo -->
  <div class="flex items-center gap-2.5">
    <div class="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center">
      <span class="text-white font-semibold text-base">N</span>
    </div>
    <div class="flex items-center gap-1 cursor-pointer">
      <span class="font-semibold text-gray-900 text-sm">Nexora.com</span>
      <svg class="w-3.5 h-3.5 text-gray-400">...</svg>
    </div>
  </div>

  <!-- Center: Search -->
  <div class="flex-1 max-w-sm mx-6">
    <!-- Search input -->
  </div>

  <!-- Right: Actions -->
  <div class="flex items-center gap-2">
    <!-- Menu button -->
    <!-- Avatar -->
    <!-- Add button -->
  </div>
</header>
```

### 12.2 Icon Rail

```html
<div class="w-14 flex flex-col items-center py-4 gap-1.5" style="background: #ecf4ff;">
  <!-- Nav buttons (w-10 h-10 rounded-xl) -->
  <button
    class="w-10 h-10 rounded-xl hover:bg-white/50 flex items-center justify-center text-gray-400 transition"
  >
    <svg class="w-5 h-5">...</svg>
  </button>

  <!-- Active button -->
  <button
    class="w-10 h-10 rounded-xl flex items-center justify-center text-white"
    style="background: #0004c3;"
  >
    <svg class="w-5 h-5">...</svg>
  </button>

  <!-- Spacer -->
  <div class="flex-1"></div>

  <!-- Settings at bottom -->
  <button
    class="w-10 h-10 rounded-xl hover:bg-white/50 flex items-center justify-center text-gray-400 transition"
  >
    <svg class="w-5 h-5">...</svg>
  </button>
</div>
```

### 12.3 Sidebar

```html
<div class="w-52 py-4 overflow-y-auto" style="background: #ecf4ff;">
  <!-- Section Header -->
  <div class="px-3 mb-0.5">
    <div class="flex items-center gap-2 text-gray-400 text-xs py-1.5 px-2">
      <svg class="w-3.5 h-3.5">...</svg>
      Starred
    </div>
  </div>

  <!-- Nav Items -->
  <div class="px-2 space-y-0.5">
    <!-- Regular item -->
    <a
      href="#"
      class="block px-3 py-1.5 text-sm text-gray-600 hover:bg-white/50 rounded-lg transition"
    >
      Sales list
    </a>

    <!-- Section with children -->
    <div class="pt-1">
      <div
        class="flex items-center justify-between px-3 py-1.5 text-sm text-gray-900 font-medium cursor-pointer hover:bg-white/50 rounded-lg"
      >
        <span>Dashboard</span>
        <svg class="w-3.5 h-3.5 text-gray-400">...</svg>
      </div>

      <!-- Sub-items with border -->
      <div class="ml-4 pl-3 border-l border-gray-200/60 space-y-0.5 mt-1">
        <a href="#" class="block px-2 py-1 text-sm text-gray-500 hover:text-gray-700 transition">
          Item
        </a>
        <!-- Active item -->
        <a href="#" class="block px-2 py-1 text-sm font-medium transition" style="color: #0004c3;">
          Active Item
        </a>
        <!-- Item with badge -->
        <a href="#" class="flex items-center justify-between px-2 py-1 text-sm text-gray-500">
          <span>Analytics</span>
          <span
            class="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center"
            >7</span
          >
        </a>
      </div>
    </div>
  </div>

  <!-- Footer link -->
  <div class="px-3 pt-4 mt-4 border-t border-gray-200/40">
    <a
      href="#"
      class="flex items-center gap-2 text-gray-400 text-sm hover:text-gray-600 transition px-2"
    >
      <svg class="w-3.5 h-3.5">...</svg>
      Manage folders
    </a>
  </div>
</div>
```

### 12.4 Breadcrumbs

```html
<nav class="flex items-center gap-2 text-sm">
  <a href="#" class="text-gray-500 hover:text-gray-700">Home</a>
  <svg class="w-3 h-3 text-gray-400">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
  </svg>
  <a href="#" class="text-gray-500 hover:text-gray-700">Contacts</a>
  <svg class="w-3 h-3 text-gray-400">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
  </svg>
  <span class="text-gray-900 font-medium">John Doe</span>
</nav>
```

### 12.5 Tabs

```html
<div class="flex items-center border-b border-gray-200">
  <!-- Active tab -->
  <button
    class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition"
    style="color: #0004c3; border-color: #0004c3;"
  >
    Overview
  </button>
  <!-- Inactive tab -->
  <button
    class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 -mb-px transition"
  >
    Activity
  </button>
  <button
    class="px-4 py-2 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-700 -mb-px transition"
  >
    Notes
  </button>
</div>
```

### 12.6 Footer Links

```html
<div class="mt-auto pt-2">
  <hr class="border-gray-200 mb-1.5" />
  <div class="flex items-center justify-center gap-6">
    <a
      href="#"
      class="text-xs text-gray-400 hover:text-gray-600 transition flex items-center gap-1.5"
    >
      <svg class="w-3.5 h-3.5">...</svg>
      Support
    </a>
    <a
      href="#"
      class="text-xs text-gray-400 hover:text-gray-600 transition flex items-center gap-1.5"
    >
      <svg class="w-3.5 h-3.5">...</svg>
      FAQ
    </a>
    <!-- More links... -->
  </div>
</div>
```

---

## 13. Avatars & Profiles

### 13.1 Avatar Sizes

| Size    | Dimensions | Tailwind    | Font Size | Usage           |
| ------- | ---------- | ----------- | --------- | --------------- |
| **XS**  | 20px       | `w-5 h-5`   | 8px       | Compact lists   |
| **SM**  | 24px       | `w-6 h-6`   | 10px      | Inline mentions |
| **MD**  | 32px       | `w-8 h-8`   | 12px      | Lists, cards    |
| **LG**  | 36px       | `w-9 h-9`   | 12px      | Header          |
| **XL**  | 48px       | `w-12 h-12` | 16px      | Profile cards   |
| **2XL** | 64px       | `w-16 h-16` | 20px      | Profile page    |

### 13.2 Avatar Variants

#### Initials Avatar (Gradient)

```html
<div
  class="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm cursor-pointer"
>
  <span class="text-white text-xs font-medium">JD</span>
</div>
```

#### Initials Avatar (Solid)

```html
<div class="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
  <span class="text-white text-xs font-medium">AB</span>
</div>
```

#### Logo Avatar (Dark)

```html
<div class="w-9 h-9 rounded-full bg-gray-900 flex items-center justify-center">
  <span class="text-white font-semibold text-base">N</span>
</div>
```

#### Image Avatar

```html
<img src="..." alt="User" class="w-9 h-9 rounded-full object-cover" />
```

#### Avatar with Status

```html
<div class="relative">
  <div
    class="w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center"
  >
    <span class="text-white text-xs font-medium">JD</span>
  </div>
  <!-- Online indicator -->
  <span
    class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"
  ></span>
</div>
```

### 13.3 Avatar Group

```html
<div class="flex -space-x-2">
  <div
    class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center border-2 border-white"
  >
    <span class="text-white text-xs">A</span>
  </div>
  <div
    class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center border-2 border-white"
  >
    <span class="text-white text-xs">B</span>
  </div>
  <div
    class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center border-2 border-white"
  >
    <span class="text-white text-xs">C</span>
  </div>
  <div
    class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white"
  >
    <span class="text-gray-600 text-xs">+3</span>
  </div>
</div>
```

---

## 14. Tables & Lists

### 14.1 Simple Table

```html
<table class="w-full">
  <thead>
    <tr class="border-b border-gray-200">
      <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
        Name
      </th>
      <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
        Email
      </th>
      <th class="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
        Status
      </th>
    </tr>
  </thead>
  <tbody class="divide-y divide-gray-100">
    <tr class="hover:bg-gray-50 transition">
      <td class="py-3 px-4 text-sm text-gray-900">John Doe</td>
      <td class="py-3 px-4 text-sm text-gray-600">john@example.com</td>
      <td class="py-3 px-4">
        <span class="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Active</span>
      </td>
    </tr>
  </tbody>
</table>
```

### 14.2 Data List Item

```html
<div class="bg-white rounded-md p-1.5">
  <div class="flex items-center justify-between mb-0.5">
    <div class="flex items-center gap-1.5">
      <div class="w-4 h-4 rounded bg-green-500 flex items-center justify-center">
        <span class="text-[7px] text-white font-medium">WA</span>
      </div>
      <span class="text-[10px] text-gray-700 font-medium">WhatsApp</span>
    </div>
    <span class="text-[10px] font-bold text-gray-900">$227,459</span>
  </div>
  <div class="flex items-center gap-1.5">
    <div class="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
      <div class="h-full rounded-full bg-green-500" style="width: 43%;"></div>
    </div>
    <span class="text-[8px] text-gray-500 w-6">43%</span>
  </div>
</div>
```

### 14.3 Contact List Item

```html
<div class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition">
  <div class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
    <span class="text-white text-sm font-medium">JD</span>
  </div>
  <div class="flex-1 min-w-0">
    <p class="text-sm font-medium text-gray-900 truncate">John Doe</p>
    <p class="text-xs text-gray-500 truncate">john@example.com</p>
  </div>
  <span class="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Lead</span>
</div>
```

### 14.4 Activity Feed Item

```html
<div class="flex gap-3 py-3">
  <div class="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
    <svg class="w-4 h-4 text-blue-600">...</svg>
  </div>
  <div class="flex-1 min-w-0">
    <p class="text-sm text-gray-900">
      <span class="font-medium">Sarah</span> added a note to
      <span class="font-medium">Acme Corp</span>
    </p>
    <p class="text-xs text-gray-500 mt-0.5">2 hours ago</p>
  </div>
</div>
```

---

## 15. Modals & Dropdowns

### 15.1 Modal

```html
<!-- Overlay -->
<div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
  <!-- Modal -->
  <div class="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
    <!-- Header -->
    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <h2 class="text-lg font-semibold text-gray-900">Modal Title</h2>
      <button
        class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"
      >
        <svg class="w-4 h-4">...</svg>
      </button>
    </div>
    <!-- Body -->
    <div class="px-6 py-4">
      <p class="text-sm text-gray-600">Modal content goes here.</p>
    </div>
    <!-- Footer -->
    <div
      class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl"
    >
      <button class="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition">Cancel</button>
      <button
        class="px-4 py-2 rounded-lg text-sm text-white transition"
        style="background: #0004c3;"
      >
        Confirm
      </button>
    </div>
  </div>
</div>
```

### 15.2 Dropdown Menu

```html
<div class="relative">
  <!-- Trigger -->
  <button
    class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"
  >
    <svg class="w-4 h-4">...</svg>
  </button>

  <!-- Dropdown -->
  <div
    class="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
  >
    <a href="#" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
      <svg class="w-4 h-4 text-gray-400">...</svg>
      Edit
    </a>
    <a href="#" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
      <svg class="w-4 h-4 text-gray-400">...</svg>
      Duplicate
    </a>
    <hr class="my-1 border-gray-100" />
    <a href="#" class="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
      <svg class="w-4 h-4">...</svg>
      Delete
    </a>
  </div>
</div>
```

### 15.3 Tooltip

```html
<div class="relative group">
  <button>Hover me</button>
  <div
    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap"
  >
    Tooltip text
  </div>
</div>
```

### 15.4 Popover

```html
<div
  class="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-4 z-10"
>
  <h4 class="text-sm font-semibold text-gray-900 mb-2">Popover Title</h4>
  <p class="text-xs text-gray-600">Popover content with more details.</p>
</div>
```

---

## 16. Status & Indicators

### 16.1 Progress Bar

```html
<div class="flex items-center gap-1.5">
  <div class="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden">
    <div
      class="h-full rounded-full bg-green-500 transition-all duration-1000"
      style="width: 43%;"
    ></div>
  </div>
  <span class="text-[8px] text-gray-500 w-6">43%</span>
</div>
```

### 16.2 Progress Bar (Larger)

```html
<div class="w-full">
  <div class="flex items-center justify-between mb-1">
    <span class="text-xs text-gray-600">Progress</span>
    <span class="text-xs font-medium text-gray-900">75%</span>
  </div>
  <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
    <div class="h-full rounded-full" style="width: 75%; background: #0004c3;"></div>
  </div>
</div>
```

### 16.3 Status Dot

```html
<!-- Online -->
<span class="w-2 h-2 rounded-full bg-emerald-500"></span>

<!-- Away -->
<span class="w-2 h-2 rounded-full bg-amber-500"></span>

<!-- Offline -->
<span class="w-2 h-2 rounded-full bg-gray-400"></span>

<!-- Busy -->
<span class="w-2 h-2 rounded-full bg-red-500"></span>
```

### 16.4 Loading Spinner

```html
<svg class="animate-spin w-5 h-5 text-[#0004c3]" fill="none" viewBox="0 0 24 24">
  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
  <path
    class="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
  ></path>
</svg>
```

### 16.5 Empty State

```html
<div class="flex flex-col items-center justify-center py-12 text-center">
  <div class="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
    <svg class="w-8 h-8 text-gray-400">...</svg>
  </div>
  <h3 class="text-lg font-semibold text-gray-900 mb-1">No contacts yet</h3>
  <p class="text-sm text-gray-500 mb-4">Get started by adding your first contact.</p>
  <button class="px-4 py-2 rounded-lg text-sm text-white" style="background: #0004c3;">
    Add Contact
  </button>
</div>
```

### 16.6 Skeleton Loading

```html
<!-- Text skeleton -->
<div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>

<!-- Circle skeleton -->
<div class="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>

<!-- Card skeleton -->
<div class="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
  <div class="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
  <div class="h-8 bg-gray-200 rounded animate-pulse w-1/2"></div>
  <div class="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
</div>
```

---

## 17. Charts & Data Viz

### 17.1 Chart Container

```html
<div class="rounded-xl p-2.5" style="background: #f8fafc;">
  <div class="flex items-center justify-between mb-2">
    <div>
      <p class="text-[11px] text-gray-400 mb-0.5">Chart Title</p>
      <p class="text-base font-bold text-gray-900">Subtitle</p>
    </div>
    <!-- Legend -->
    <div class="flex items-center gap-4 text-xs">
      <div class="flex items-center gap-2">
        <div class="w-2.5 h-2.5 rounded-full" style="background: #0004c3;"></div>
        <span class="text-gray-500">Revenue</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-2.5 h-2.5 rounded-full bg-gray-300"></div>
        <span class="text-gray-500">Target</span>
      </div>
    </div>
  </div>

  <!-- Chart -->
  <div class="h-40">
    <canvas id="chart"></canvas>
  </div>
</div>
```

### 17.2 Chart.js Theme Config

```javascript
const chartConfig = {
  type: 'line',
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#9ca3af', font: { size: 10 } },
        border: { display: false },
      },
      y: {
        display: false,
      },
    },
    animation: {
      duration: 1500,
      easing: 'easeOutQuart',
    },
  },
};

// Chart colors
const colors = {
  primary: '#0004c3',
  primaryRGB: '0, 4, 195',
  secondary: '#d1d5db',
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

// Gradient fill
const gradient = ctx.createLinearGradient(0, 0, 0, 200);
gradient.addColorStop(0, `rgba(${colors.primaryRGB}, 0.3)`);
gradient.addColorStop(1, `rgba(${colors.primaryRGB}, 0.02)`);
```

### 17.3 Stat Display

```html
<div class="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
  <div>
    <p class="text-[10px] text-gray-400 mb-0.5">Total Revenue</p>
    <p class="text-lg font-bold text-gray-900">$528,976</p>
  </div>
  <div>
    <p class="text-[10px] text-gray-400 mb-0.5">Target</p>
    <p class="text-lg font-bold text-gray-400">$490,000</p>
  </div>
  <div>
    <p class="text-[10px] text-gray-400 mb-0.5">Achievement</p>
    <p class="text-lg font-bold text-emerald-600">108%</p>
  </div>
</div>
```

---

## 18. Animations

### 18.1 CSS Animations

```css
/* Fade in */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.animate-fade-in {
  animation: fadeIn 0.3s ease;
}

/* Slide up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-up {
  animation: slideUp 0.3s ease;
}

/* Scale in */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scale-in {
  animation: scaleIn 0.2s ease;
}

/* Pulse */
.animate-pulse {
  animation: pulse 2s infinite;
}

/* Spin */
.animate-spin {
  animation: spin 1s linear infinite;
}
```

### 18.2 GSAP Configuration

```javascript
// Default timeline
gsap.timeline({ defaults: { ease: 'power3.out' } });

// Stagger animation
gsap.to('.card', {
  opacity: 1,
  y: 0,
  duration: 0.6,
  stagger: 0.1,
});

// Counter animation
gsap.to(counter, {
  innerHTML: targetValue,
  duration: 2,
  snap: { innerHTML: 1 },
  ease: 'power2.out',
});
```

### 18.3 Transition Classes

```css
/* Hover lift */
.hover-lift {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

/* Progress bar */
.progress-bar {
  width: 0;
  transition: width 1s ease-out;
}

/* General transition */
.transition {
  transition: all 0.15s ease;
}
.transition-colors {
  transition:
    color 0.15s ease,
    background-color 0.15s ease;
}
.transition-transform {
  transition: transform 0.3s ease;
}
```

---

## 19. CRM-Specific Components

### 19.1 Contact Card

```html
<div class="bg-white rounded-xl border border-gray-200 p-4 hover-lift">
  <div class="flex items-start gap-3">
    <div
      class="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center flex-shrink-0"
    >
      <span class="text-white font-semibold">JD</span>
    </div>
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-2 mb-1">
        <h3 class="text-sm font-semibold text-gray-900 truncate">John Doe</h3>
        <span class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">Lead</span>
      </div>
      <p class="text-xs text-gray-500 truncate">john@example.com</p>
      <p class="text-xs text-gray-400 mt-1">Last contact: 2 days ago</p>
    </div>
  </div>
</div>
```

### 19.2 Deal Card

```html
<div class="bg-white rounded-xl border border-gray-200 p-4 hover-lift">
  <div class="flex items-center justify-between mb-3">
    <span class="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium"
      >Proposal</span
    >
    <span class="text-lg font-bold text-gray-900">$25,000</span>
  </div>
  <h3 class="text-sm font-semibold text-gray-900 mb-1">Enterprise License</h3>
  <p class="text-xs text-gray-500 mb-3">Acme Corporation</p>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
        <span class="text-white text-[10px]">SM</span>
      </div>
      <span class="text-xs text-gray-600">Sarah M.</span>
    </div>
    <span class="text-xs text-gray-400">Due in 5 days</span>
  </div>
</div>
```

### 19.3 Pipeline Column

```html
<div class="flex-1 min-w-[280px] bg-gray-50 rounded-xl p-3">
  <div class="flex items-center justify-between mb-3">
    <div class="flex items-center gap-2">
      <div class="w-2 h-2 rounded-full bg-amber-500"></div>
      <h3 class="text-sm font-semibold text-gray-900">Proposal</h3>
      <span class="text-xs text-gray-500">(5)</span>
    </div>
    <span class="text-sm font-semibold text-gray-900">$125,000</span>
  </div>
  <div class="space-y-2">
    <!-- Deal cards here -->
  </div>
</div>
```

### 19.4 Activity Item

```html
<div class="flex gap-3 py-3 border-b border-gray-100 last:border-0">
  <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
    <svg class="w-4 h-4 text-green-600">...</svg>
  </div>
  <div class="flex-1 min-w-0">
    <p class="text-sm text-gray-900"><span class="font-medium">Email sent</span> to John Doe</p>
    <p class="text-xs text-gray-500 mt-0.5">Subject: Follow-up on proposal</p>
    <p class="text-xs text-gray-400 mt-1">Today at 2:30 PM</p>
  </div>
  <button
    class="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400"
  >
    <svg class="w-4 h-4">...</svg>
  </button>
</div>
```

### 19.5 Conversation Message

```html
<!-- Incoming message -->
<div class="flex gap-3 max-w-[80%]">
  <div class="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
    <span class="text-xs font-medium">JD</span>
  </div>
  <div>
    <div class="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-2">
      <p class="text-sm text-gray-900">Hi, I'm interested in your enterprise plan.</p>
    </div>
    <span class="text-xs text-gray-400 mt-1 block">10:30 AM</span>
  </div>
</div>

<!-- Outgoing message -->
<div class="flex gap-3 max-w-[80%] ml-auto flex-row-reverse">
  <div
    class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
    style="background: #0004c3;"
  >
    <span class="text-xs font-medium text-white">ME</span>
  </div>
  <div>
    <div class="rounded-2xl rounded-tr-sm px-4 py-2 text-white" style="background: #0004c3;">
      <p class="text-sm">Great! I'd be happy to help. Let me send you more details.</p>
    </div>
    <span class="text-xs text-gray-400 mt-1 block text-right">10:32 AM</span>
  </div>
</div>
```

---

## 20. CSS Variables

```css
:root {
  /* Brand Colors */
  --brand-primary: #0004c3;
  --brand-primary-rgb: 0, 4, 195;
  --brand-hover: #0003a3;
  --brand-light: rgba(0, 4, 195, 0.06);
  --brand-border: rgba(0, 4, 195, 0.15);

  /* Backgrounds */
  --bg-theme: #ecf4ff;
  --bg-card: #f8fafc;
  --bg-content: #ffffff;
  --bg-hover: rgba(255, 255, 255, 0.5);

  /* Text */
  --text-primary: #111827;
  --text-secondary: #374151;
  --text-muted: #6b7280;
  --text-subtle: #9ca3af;

  /* Borders */
  --border-default: #e5e7eb;
  --border-light: #f3f4f6;
  --border-focus: var(--brand-primary);

  /* Semantic */
  --success: #10b981;
  --success-light: #d1fae5;
  --warning: #f59e0b;
  --warning-light: #fef3c7;
  --error: #ef4444;
  --error-light: #fee2e2;
  --info: #3b82f6;
  --info-light: #dbeafe;

  /* Sizes */
  --header-height: 56px;
  --sidebar-width: 208px;
  --icon-rail-width: 56px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
}
```

---

## Quick Reference

| Property               | Value               |
| ---------------------- | ------------------- |
| **Brand Color**        | `#0004c3`           |
| **Theme Background**   | `#ecf4ff`           |
| **Card Background**    | `#f8fafc`           |
| **Content Background** | `#ffffff`           |
| **Font**               | Inter               |
| **Header Height**      | 56px (`h-14`)       |
| **Sidebar Width**      | 208px (`w-52`)      |
| **Icon Rail Width**    | 56px (`w-14`)       |
| **Card Radius**        | 12px (`rounded-xl`) |
| **Item Radius**        | 6px (`rounded-md`)  |
| **Button Radius**      | 8px (`rounded-lg`)  |
| **Default Padding**    | 10px (`p-2.5`)      |
| **Default Gap**        | 10px (`gap-2.5`)    |
| **Transition**         | 300ms ease          |
| **Primary Text**       | `text-gray-900`     |
| **Muted Text**         | `text-gray-400`     |
| **Icon Size (Nav)**    | 20px (`w-5 h-5`)    |
| **Icon Size (Action)** | 16px (`w-4 h-4`)    |

---

_Last Updated: January 2026_
_Version: 2.0 - Comprehensive Edition_
