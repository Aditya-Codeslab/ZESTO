# Universal Restaurant Ordering Platform (SaaS)

A multi-tenant restaurant SaaS platform enabling restaurant owners to register their restaurant, manage categorization and menus, configure branding, and receive live customer orders, while hungry diners browse curated restaurant storefronts, customize dishes, and place orders with real-time status tracking.

## User Review & Critical Decisions

> [!IMPORTANT]
> The architectural and design decisions below have been aligned based on your Phase 1 preferences:

- **Supabase Integration & Fallback**: Confirmed to support both direct Supabase connection (URL & Anon Key configured via environment variables or in-app secure credentials modal) and a seamless, zero-friction local storage + simulated realtime fallback mode so the application is immediately operational and verifiable.
- **Visual Aesthetic & Theme**: Clean minimalist white background canvas with deep charcoal structural surfaces (`#0F172A`) and an energetic, warm culinary coral accent (`#FF5A36` / `#E04826`), paired with crisp sans typography (`Plus Jakarta Sans` / `DM Sans`) and tabular numerals for pricing and timestamps.
- **Seed Demonstration Tenant**: Wood-fired artisan pizzeria and trattoria (*"Forno & Fuoco Trattoria"*, slug `/restaurant/forno-fuoco`), featuring artisanal Neapolitan pizzas, handmade pastas, appetizers, and Italian desserts with high-resolution imagery and customizable item options.

---

## 1. Overview & Core Concept

- **What It Does**: A multi-tenant SaaS application providing two primary experiences:
  1. **Owner Portal**: Landing page, owner authentication, restaurant onboarding (branding, slug, contact details, operating hours, delivery settings), comprehensive menu management (categories, dishes, prices, descriptions, image uploads, stock availability toggles), and a live kitchen/order dispatch board with status transitions (Received $\to$ Preparing $\to$ Ready $\to$ Delivered).
  2. **Customer Storefront**: Dedicated restaurant pages accessed via slug (e.g. `/restaurant/forno-fuoco`), interactive menu filtering by category, rich dish detail with allergen/dietary tags, responsive slide-out cart drawer, customer checkout with address and contact details, and a live order confirmation page with real-time status progression.
- **Target Audience / Persona**: Independent restaurant owners, cafe proprietors, and pizzeria chefs looking to break free from high aggregator commissions, alongside diners ordering directly from their favorite local eateries.
- **Key Value**: Low-friction restaurant website generation, instant menu updates, zero commission on direct orders, and multi-tenant isolation.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Landing & Exploration**: SaaS marketing landing page highlighting commission savings, instant online storefront generation, and feature breakdown. Includes quick-switch exploration links to demo restaurants and a "Launch Your Store" CTA.
2. **Owner Registration & Onboarding**: Owner signs up or signs in, then creates their restaurant profile (name, slug, cuisine tags, logo, address, phone, estimated prep time).
3. **Menu Engineering**: Owner organizes categories (e.g. *Antipasti*, *Wood-Fired Pizza*, *Primi*, *Dolci*), adds items with prices, descriptions, dietary badges (Vegetarian, Gluten-Free, Spicy), availability toggles, and photo uploads.
4. **Customer Storefront & Ordering**: Diner visits `/restaurant/:slug`, explores categorized items, adjusts quantities, adds to the slide-over cart, enters delivery/pickup info, reviews itemized summary with tax and delivery calculations, and places order.
5. **Kitchen Display & Order Lifecycle**: Owner sees incoming orders in real time on the kitchen dashboard, updates status (*Preparing* $\to$ *Ready for Pickup* $\to$ *Completed*), which synchronizes to the customer's live tracking view.

### Visual Identity & Theme
- **Color Palette (Precision 4-Color System)**:
  - *Primary Accent (Buttons, Active States, Highlights)*: `#E53935` (Vibrant Red) with `#D32F2F` hover state.
  - *Primary Canvas / App Background*: `#FFFFFF` (Clean Pure White).
  - *Primary Text / Headings*: `#202124` (Dark Charcoal / Near Black).
  - *Card Surfaces / Container Backgrounds*: `#F5F5F5` (Soft Light Gray) with crisp `border-gray-200` framing.
- **Typography & Scale**:
  - *Display / Headings*: High-contrast editorial style with balanced line wraps.
  - *Body Prose*: Plus Jakarta Sans / Inter at 12–15px for crisp hierarchy and legibility.
  - *Numerals & Timestamps*: Monospace tabular figures (`tabular-nums font-mono`) for prices, order IDs, delivery countdowns, and table metrics.
- **Component Styling & Anti-Slop Discipline**:
  - Strict zero-pill rule for static metadata: tags use quiet typography separated by middle dots (`·`) or subtle hairline borders; no candy capsules.
  - Interactive filter bars use clean segmented control styles with explicit active states.
  - Consistent layout across SaaS marketing landing page, owner portal (Overview, KDS, Menu Catalog, Settings), and diner storefronts.

---

## 3. Key Product Decisions & Trade-Offs

- **Dual-Engine Persistence Strategy**:
  - *Approach*: Implement a clean Supabase client module that reads `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, coupled with an interactive Supabase Settings dialog and a robust LocalStorage/InMemory reactive adapter.
  - *Why*: Ensures the application can be run and tested without waiting on external cloud credentials, while allowing users to plug in their Supabase credentials whenever desired.
- **Client-Side URL Routing & Tenant Isolation**:
  - *Approach*: Lightweight hash/path history router supporting `/`, `/auth`, `/onboarding`, `/dashboard`, `/dashboard/menu`, `/dashboard/orders`, `/dashboard/settings`, and `/restaurant/:slug`.
  - *Why*: Provides clean restaurant-specific URLs without requiring external routing dependencies or SSR overhead, fully compatible with the AI Studio single-page application sandbox.
- **Price Verification & Order Calculation**:
  - *Approach*: Orders are calculated using the restaurant's stored menu price definitions, preventing any client-side tampering of totals, tax, or fees.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Universal SaaS Platform                         │
├───────────────────────────────────┬────────────────────────────────────┤
│           Public SaaS & Diner     │           Owner Portal             │
│  ┌─────────────────────────────┐  │  ┌──────────────────────────────┐  │
│  │     SaaS Marketing Hero     │  │  │  Owner Auth (Sign In/Up)     │  │
│  ├─────────────────────────────┤  │  ├──────────────────────────────┤  │
│  │   Restaurant Directory      │  │  │  Restaurant Onboarding Form  │  │
│  ├─────────────────────────────┤  │  ├──────────────────────────────┤  │
│  │  Storefront (/restaurant/:s)│  │  │  Dashboard Overview & Stats  │  │
│  ├─────────────────────────────┤  │  ├──────────────────────────────┤  │
│  │  Slide-Out Cart & Checkout  │  │  │  Menu & Category Management  │  │
│  ├─────────────────────────────┤  │  ├──────────────────────────────┤  │
│  │  Live Order Tracking View   │  │  │  Live Order Dispatch Board   │  │
│  └─────────────────────────────┘  │  └──────────────────────────────┘  │
└─────────────────┬─────────────────┴──────────────────┬─────────────────┘
                  │                                    │
                  ▼                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   Unified Data & State Orchestration                   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │  Storage & Auth Adapter (`supabaseService` + `localFallback`)  │   │
│   └──────┬─────────────────────────┬─────────────────────────┬─────┘   │
│          ▼                         ▼                         ▼         │
│     [Restaurants]              [MenuItems]                [Orders]     │
│   • id, slug, name          • id, restaurant_id       • id, number     │
│   • cuisine, logo           • category, price         • status, items  │
│   • address, phone          • available, tags         • total, diner   │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Models & Entities
1. **Restaurant**: `id`, `owner_id`, `name`, `slug` (unique), `description`, `cuisine`, `logo_url`, `banner_url`, `phone`, `email`, `address`, `delivery_fee`, `min_order`, `prep_time_minutes`, `is_active`, `created_at`.
2. **Category**: `id`, `restaurant_id`, `name`, `sort_order`.
3. **MenuItem**: `id`, `restaurant_id`, `category_id`, `name`, `description`, `price`, `image_url`, `is_available`, `dietary_tags` (`vegetarian`, `vegan`, `gluten_free`, `spicy`), `created_at`.
4. **Order**: `id`, `order_number`, `restaurant_id`, `customer_name`, `customer_phone`, `customer_email`, `delivery_address`, `order_type` (`delivery` | `pickup`), `status` (`pending` | `confirmed` | `preparing` | `ready` | `delivered` | `cancelled`), `subtotal`, `tax`, `delivery_fee`, `total`, `special_instructions`, `created_at`.
5. **OrderItem**: `id`, `order_id`, `menu_item_id`, `item_name`, `unit_price`, `quantity`, `subtotal`.

### Key Verification & Execution Steps
1. **Package Setup**: Install `@supabase/supabase-js`.
2. **Branding & Image Assets**: Generate appetizing high-fidelity food imagery for the seed artisan pizzeria using `generate_image` in a single batch turn.
3. **Core Services**: Build the Supabase/storage provider with auth, database CRUD, and real-time event subscriptions.
4. **Components & Views**:
   - Marketing Landing page with value props and demo restaurant switcher.
   - Owner authentication & onboarding wizard.
   - Owner dashboard with metrics, category & dish editor, and kitchen order dispatch screen.
   - Customer restaurant storefront with responsive category navigation, item cards, slide-over cart, and checkout modal.
   - Customer real-time order tracker with status progress bar.
5. **Verification**: Run `compile_applet` and test navigation across all views and order states.
