import { Restaurant, Category, MenuItem, Order } from '../types';

export const SEED_RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-forno-fuoco-001',
    owner_id: 'owner-seed-001',
    name: 'Forno & Fuoco Trattoria',
    slug: 'forno-fuoco',
    description: 'Authentic wood-fired Neapolitan pizza, hand-cut egg pasta, and slow-braised Italian classics crafted from imported Italian flour and San Marzano tomatoes.',
    cuisine: 'Italian & Wood-Fired Pizza',
    logo_url: '',
    banner_url: '',
    phone: '+1 (555) 234-8901',
    email: 'ciao@fornofuoco.com',
    address: '428 Via Vesuvio, Little Italy',
    city: 'San Francisco',
    postal_code: '94133',
    delivery_fee: 3.50,
    min_order: 15.00,
    prep_time_minutes: 25,
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  },
  {
    id: 'rest-cafe-mocha-002',
    owner_id: 'owner-seed-002',
    name: 'Café Mocha & Patisserie',
    slug: 'cafe-mocha',
    description: 'Single-origin espresso roasts, slow cold brew, flaky French viennoiserie, and savory breakfast tartines baked fresh every morning.',
    cuisine: 'Artisan Bakery & Specialty Coffee',
    logo_url: '',
    banner_url: '',
    phone: '+1 (555) 782-4190',
    email: 'orders@cafemocha.io',
    address: '112 Roasted Bean Ave',
    city: 'San Francisco',
    postal_code: '94107',
    delivery_fee: 2.50,
    min_order: 10.00,
    prep_time_minutes: 15,
    is_active: true,
    created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString()
  }
];

export const SEED_CATEGORIES: Category[] = [
  // Forno & Fuoco categories
  { id: 'cat-ff-01', restaurant_id: 'rest-forno-fuoco-001', name: 'Antipasti & Crudo', sort_order: 1 },
  { id: 'cat-ff-02', restaurant_id: 'rest-forno-fuoco-001', name: 'Wood-Fired Pizza', sort_order: 2 },
  { id: 'cat-ff-03', restaurant_id: 'rest-forno-fuoco-001', name: 'Primi & Handmade Pasta', sort_order: 3 },
  { id: 'cat-ff-04', restaurant_id: 'rest-forno-fuoco-001', name: 'Dolci & Dessert', sort_order: 4 },
  { id: 'cat-ff-05', restaurant_id: 'rest-forno-fuoco-001', name: 'Bevande & Sodas', sort_order: 5 },

  // Café Mocha categories
  { id: 'cat-cm-01', restaurant_id: 'rest-cafe-mocha-002', name: 'Espresso & Coffee', sort_order: 1 },
  { id: 'cat-cm-02', restaurant_id: 'rest-cafe-mocha-002', name: 'Viennoiserie & Bakes', sort_order: 2 },
  { id: 'cat-cm-03', restaurant_id: 'rest-cafe-mocha-002', name: 'Savory Sandwiches', sort_order: 3 }
];

export const SEED_MENU_ITEMS: MenuItem[] = [
  // Forno & Fuoco Items
  {
    id: 'item-ff-101',
    restaurant_id: 'rest-forno-fuoco-001',
    category_id: 'cat-ff-02',
    name: 'Margherita D.O.P.',
    description: 'San Marzano D.O.P. tomatoes, fresh buffalo mozzarella, hand-torn sweet basil, and Sicilian extra virgin olive oil on 72-hour fermented dough.',
    price: 18.50,
    is_available: true,
    dietary_tags: ['vegetarian'],
    created_at: new Date().toISOString()
  },
  {
    id: 'item-ff-102',
    restaurant_id: 'rest-forno-fuoco-001',
    category_id: 'cat-ff-02',
    name: 'Diavola Calabrese',
    description: 'Crispy soppressata piccante, spicy Calabrian nduja, fior di latte mozzarella, hot wildflower honey drizzle, and chili oil.',
    price: 21.00,
    is_available: true,
    dietary_tags: ['spicy'],
    created_at: new Date().toISOString()
  },
  {
    id: 'item-ff-103',
    restaurant_id: 'rest-forno-fuoco-001',
    category_id: 'cat-ff-02',
    name: 'Tartufo Nero & Funghi',
    description: 'Black summer truffle purée, roasted cremini and chanterelle mushrooms, taleggio cheese, fresh thyme, and white truffle oil.',
    price: 23.50,
    is_available: true,
    dietary_tags: ['vegetarian'],
    created_at: new Date().toISOString()
  },
  {
    id: 'item-ff-104',
    restaurant_id: 'rest-forno-fuoco-001',
    category_id: 'cat-ff-03',
    name: 'Tagliolini al Tartufo',
    description: 'Hand-extruded golden egg tagliolini tossed in cultured alpine butter, parmigiano reggiano 24-month, and fresh shaved black truffles.',
    price: 24.00,
    is_available: true,
    dietary_tags: ['vegetarian'],
    created_at: new Date().toISOString()
  },
  {
    id: 'item-ff-105',
    restaurant_id: 'rest-forno-fuoco-001',
    category_id: 'cat-ff-03',
    name: 'Pappardelle al Cinghiale',
    description: 'Wide ribbon pasta with slow-braised Tuscan wild boar ragù, juniper berries, red Chianti reduction, and aged pecorino toscano.',
    price: 22.50,
    is_available: true,
    dietary_tags: [],
    created_at: new Date().toISOString()
  },
  {
    id: 'item-ff-106',
    restaurant_id: 'rest-forno-fuoco-001',
    category_id: 'cat-ff-01',
    name: 'Burrata Pugliese con Heirloom',
    description: 'Creamy Puglian burrata over multicolored heirloom tomatoes, basil pesto emulsion, crispy sea salt focaccia crisps, and 12-year balsamic.',
    price: 16.00,
    is_available: true,
    dietary_tags: ['vegetarian'],
    created_at: new Date().toISOString()
  },
  {
    id: 'item-ff-107',
    restaurant_id: 'rest-forno-fuoco-001',
    category_id: 'cat-ff-01',
    name: 'Calamari & Gamberi Fritti',
    description: 'Semolina-dusted wild calamari and white prawns fried crisp, charred Amalfi lemon cheeks, and garlic herb aioli.',
    price: 17.50,
    is_available: true,
    dietary_tags: [],
    created_at: new Date().toISOString()
  },
  {
    id: 'item-ff-108',
    restaurant_id: 'rest-forno-fuoco-001',
    category_id: 'cat-ff-04',
    name: 'Cannoli Siciliani Artigianali',
    description: 'Handmade crisp pastry tubes filled with whipped sheep milk ricotta, candied orange peel, dark chocolate pearls, and Bronte pistachio crumbles.',
    price: 9.50,
    is_available: true,
    dietary_tags: ['vegetarian'],
    created_at: new Date().toISOString()
  },
  {
    id: 'item-ff-109',
    restaurant_id: 'rest-forno-fuoco-001',
    category_id: 'cat-ff-04',
    name: 'Tiramisù al Mascarpone',
    description: 'Espresso-dipped savoiardi ladyfingers layered with velvety zabaglione mascarpone cream, finished with Valrhona bitter cocoa.',
    price: 10.00,
    is_available: true,
    dietary_tags: ['vegetarian'],
    created_at: new Date().toISOString()
  },
  {
    id: 'item-ff-110',
    restaurant_id: 'rest-forno-fuoco-001',
    category_id: 'cat-ff-05',
    name: 'San Pellegrino Blood Orange',
    description: 'Sparkling Italian citrus soda brewed with Sicilian blood orange juice (Aranciata Rossa).',
    price: 4.00,
    is_available: true,
    dietary_tags: ['vegan', 'gluten_free'],
    created_at: new Date().toISOString()
  },

  // Café Mocha Items
  {
    id: 'item-cm-201',
    restaurant_id: 'rest-cafe-mocha-002',
    category_id: 'cat-cm-01',
    name: 'Velvet Mocha Macchiato',
    description: 'Double shot of Ethiopian Yirgacheffe espresso blended with steamed oat milk, Valrhona 70% dark ganache, and Madagascar vanilla.',
    price: 6.25,
    is_available: true,
    dietary_tags: ['vegetarian'],
    created_at: new Date().toISOString()
  },
  {
    id: 'item-cm-202',
    restaurant_id: 'rest-cafe-mocha-002',
    category_id: 'cat-cm-02',
    name: 'Almond Frangipane Croissant',
    description: 'Twice-baked butter croissant steeped in orange blossom syrup, filled with almond cream, topped with toasted sliced almonds.',
    price: 5.75,
    is_available: true,
    dietary_tags: ['vegetarian'],
    created_at: new Date().toISOString()
  },
  {
    id: 'item-cm-203',
    restaurant_id: 'rest-cafe-mocha-002',
    category_id: 'cat-cm-03',
    name: 'Prosciutto & Fig Tartine',
    description: 'Toasted seeded sourdough, whipped goat cheese, 24-month prosciutto di Parma, mission fig jam, and baby arugula.',
    price: 13.50,
    is_available: true,
    dietary_tags: [],
    created_at: new Date().toISOString()
  }
];

export const SEED_ORDERS: Order[] = [
  {
    id: 'order-ff-9001',
    order_number: 'ORD-1082',
    restaurant_id: 'rest-forno-fuoco-001',
    customer_name: 'Elena Rostova',
    customer_phone: '+1 (555) 392-1084',
    customer_email: 'elena.rostova@example.com',
    delivery_address: '742 Evergreen Terrace, Apt 4B, San Francisco, CA',
    order_type: 'delivery',
    status: 'preparing',
    items: [
      {
        id: 'oi-9001-1',
        order_id: 'order-ff-9001',
        menu_item_id: 'item-ff-101',
        item_name: 'Margherita D.O.P.',
        unit_price: 18.50,
        quantity: 2,
        subtotal: 37.00,
        special_instructions: 'Well done crust please'
      },
      {
        id: 'oi-9001-2',
        order_id: 'order-ff-9001',
        menu_item_id: 'item-ff-108',
        item_name: 'Cannoli Siciliani Artigianali',
        unit_price: 9.50,
        quantity: 1,
        subtotal: 9.50
      }
    ],
    subtotal: 46.50,
    tax: 3.72,
    delivery_fee: 3.50,
    total: 53.72,
    special_instructions: 'Please buzz code #401 on arrival.',
    created_at: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  {
    id: 'order-ff-9002',
    order_number: 'ORD-1083',
    restaurant_id: 'rest-forno-fuoco-001',
    customer_name: 'Marcus Vance',
    customer_phone: '+1 (555) 819-2045',
    customer_email: 'm.vance@example.com',
    delivery_address: 'Pick up in store',
    order_type: 'pickup',
    status: 'ready',
    items: [
      {
        id: 'oi-9002-1',
        order_id: 'order-ff-9002',
        menu_item_id: 'item-ff-104',
        item_name: 'Tagliolini al Tartufo',
        unit_price: 24.00,
        quantity: 1,
        subtotal: 24.00
      },
      {
        id: 'oi-9002-2',
        order_id: 'order-ff-9002',
        menu_item_id: 'item-ff-106',
        item_name: 'Burrata Pugliese con Heirloom',
        unit_price: 16.00,
        quantity: 1,
        subtotal: 16.00
      }
    ],
    subtotal: 40.00,
    tax: 3.20,
    delivery_fee: 0,
    total: 43.20,
    special_instructions: 'Extra parmigiano on the side.',
    created_at: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: 'order-ff-9003',
    order_number: 'ORD-1084',
    restaurant_id: 'rest-forno-fuoco-001',
    customer_name: 'Sarah Chen',
    customer_phone: '+1 (555) 441-9872',
    customer_email: 'sarah.chen@example.com',
    delivery_address: '1280 Columbus Ave, Suite 300, San Francisco, CA',
    order_type: 'delivery',
    status: 'pending',
    items: [
      {
        id: 'oi-9003-1',
        order_id: 'order-ff-9003',
        menu_item_id: 'item-ff-102',
        item_name: 'Diavola Calabrese',
        unit_price: 21.00,
        quantity: 1,
        subtotal: 21.00,
        special_instructions: 'Extra hot honey!'
      },
      {
        id: 'oi-9003-2',
        order_id: 'order-ff-9003',
        menu_item_id: 'item-ff-110',
        item_name: 'San Pellegrino Blood Orange',
        unit_price: 4.00,
        quantity: 2,
        subtotal: 8.00
      }
    ],
    subtotal: 29.00,
    tax: 2.32,
    delivery_fee: 3.50,
    total: 34.82,
    created_at: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 60 * 1000).toISOString()
  },
  {
    id: 'order-ff-9000',
    order_number: 'ORD-1079',
    restaurant_id: 'rest-forno-fuoco-001',
    customer_name: 'David Miller',
    customer_phone: '+1 (555) 772-9103',
    customer_email: 'david.m@example.com',
    delivery_address: '450 Mission St, Suite 1200, San Francisco, CA',
    order_type: 'delivery',
    status: 'delivered',
    items: [
      {
        id: 'oi-9000-1',
        order_id: 'order-ff-9000',
        menu_item_id: 'item-ff-103',
        item_name: 'Funghi Selvatici & Fontina',
        unit_price: 22.50,
        quantity: 1,
        subtotal: 22.50,
        special_instructions: 'Crispy edges'
      },
      {
        id: 'oi-9000-2',
        order_id: 'order-ff-9000',
        menu_item_id: 'item-ff-109',
        item_name: 'Tiramisù al Mascarpone',
        unit_price: 10.00,
        quantity: 1,
        subtotal: 10.00
      }
    ],
    subtotal: 32.50,
    tax: 2.60,
    delivery_fee: 3.50,
    tip: 5.00,
    total: 43.60,
    special_instructions: 'Please leave with reception concierge.',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 38 * 60 * 1000).toISOString()
  }
];
