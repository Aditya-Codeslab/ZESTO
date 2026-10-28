# ZESTO - Ultra-Stylish Multi-Tenant Restaurant Ordering Platform (SaaS)

ZESTO is an ultra-stylish, multi-tenant restaurant ordering platform designed to eliminate the 25%–30% commissions charged by third-party delivery aggregators. Styled with an artisanal, high-end hospitality aesthetic (inspired by SevenRooms, Resy, and luxury dining tech), ZESTO equips independent culinary brands with bespoke storefronts, live kitchen display systems, instant course catalog editing, and secure order processing.

---

## 🍽️ Key Capabilities

1. **Editorial SaaS Marketing Experience**: High-impact hospitality aesthetic featuring an interactive Delivery ROI Commission Savings Calculator, live restaurant preview card, and Bento-box feature highlights.
2. **Dedicated Restaurant Storefronts (`/restaurant/:slug`)**: Bespoke diner experience with dark gradient cover header, floating monogram, category navigation tabs (*Wood-Fired Pizza, Primi, Dolci*), dietary allergen tags, quantity steppers, and quick-add micro-interactions.
3. **Staff Gratuity & 1-Page Checkout**: Diners can choose pre-set or custom gratuity tips (15%, 18%, 20%, Custom), select Delivery vs. Pickup, enter contact/address details, and submit orders directly.
4. **Canonical Server-Style Price Integrity**: Validates all items against canonical menu prices, calculating subtotal, 8% sales tax, delivery fee, and optional gratuity with strict server-side integrity.
5. **Live Kitchen Display System (KDS)**: Real-time Kanban board organized across *Pending Intake*, *In Kitchen / Oven*, *Ready for Hand-off*, and *Completed* stages with 1-click status transitions.
6. **Live Customer Order Tracking (`/order/:orderId`)**: A 4-stage visual stepper (*Order Confirmed* $\to$ *Kitchen Firing* $\to$ *Dispatched / Ready* $\to$ *Delivered*) with real-time WebSocket updates that change dynamically whenever the kitchen updates order status.
7. **Dual-Engine Architecture (Supabase + Local Reactive Fallback)**: Operates instantly with local persistence while allowing seamless connection to any live Supabase PostgreSQL database with Row Level Security (RLS) policies.

---

## 🎨 Design System & Aesthetic

- **Typography**: Editorial serif headings (`Playfair Display`, `Cormorant Garamond`) paired with modern, readable sans-serif (`Plus Jakarta Sans`) and tabular monospace numerals (`Space Mono`).
- **Color Palette**:
  - Antique linen / warm cream canvas (`#FAF8F5`)
  - Deep rich charcoal / near-black headers & accents (`#121212`, `#1E1E1E`)
  - Signature Sunset Amber / Coral (`#FF6B4A`, hover `#E85D35`)
  - Soft Olive / Sage (`#6B705C`) and brushed gold accents
- **Spatial Polish**: Glassmorphism toolbars, 24px border radii (`rounded-3xl`), delicate hairline borders, and smooth spring-like micro-interactions.
