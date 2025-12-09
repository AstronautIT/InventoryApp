const Database = require('better-sqlite3');
const path = require('path');

// Create database
const db = new Database('inventory.db');

// Create products table
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 0,
    price REAL NOT NULL,
    category TEXT,
    sku TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Sample beer products to populate
const products = [
  { name: 'Golden Lager', description: 'Classic light lager with crisp finish, 4.5% ABV', quantity: 240, price: 8.99, category: 'Lager', sku: 'BEER-LAG-001' },
  { name: 'Amber Ale', description: 'Rich amber ale with caramel notes, 5.2% ABV', quantity: 180, price: 10.99, category: 'Ale', sku: 'BEER-ALE-001' },
  { name: 'India Pale Ale', description: 'Hoppy IPA with citrus and pine flavors, 6.8% ABV', quantity: 320, price: 12.99, category: 'IPA', sku: 'BEER-IPA-001' },
  { name: 'Dark Stout', description: 'Robust stout with coffee and chocolate notes, 7.2% ABV', quantity: 150, price: 13.99, category: 'Stout', sku: 'BEER-STT-001' },
  { name: 'Wheat Beer', description: 'Smooth wheat beer with banana and clove hints, 5.0% ABV', quantity: 200, price: 9.99, category: 'Wheat Beer', sku: 'BEER-WHT-001' },
  { name: 'Pilsner Premium', description: 'Czech-style pilsner with noble hop character, 4.8% ABV', quantity: 280, price: 9.49, category: 'Lager', sku: 'BEER-LAG-002' },
  { name: 'Porter Classic', description: 'Traditional porter with roasted malt flavor, 6.0% ABV', quantity: 120, price: 11.99, category: 'Porter', sku: 'BEER-POR-001' },
  { name: 'Belgian Blonde', description: 'Belgian-style blonde ale, fruity and spicy, 6.5% ABV', quantity: 95, price: 14.99, category: 'Ale', sku: 'BEER-ALE-002' },
  { name: 'Double IPA', description: 'Bold double IPA with intense hop flavor, 8.5% ABV', quantity: 160, price: 15.99, category: 'IPA', sku: 'BEER-IPA-002' },
  { name: 'Pale Ale', description: 'American pale ale with balanced malt and hops, 5.5% ABV', quantity: 210, price: 10.49, category: 'Ale', sku: 'BEER-ALE-003' },
  { name: 'Session IPA', description: 'Light-bodied session IPA, easy drinking, 4.2% ABV', quantity: 300, price: 9.99, category: 'IPA', sku: 'BEER-IPA-003' },
  { name: 'Hefeweizen', description: 'Bavarian wheat beer, unfiltered and refreshing, 5.3% ABV', quantity: 175, price: 10.99, category: 'Wheat Beer', sku: 'BEER-WHT-002' },
  { name: 'Red Ale', description: 'Irish red ale with toffee and biscuit notes, 5.8% ABV', quantity: 140, price: 11.49, category: 'Ale', sku: 'BEER-ALE-004' },
  { name: 'Imperial Stout', description: 'High-gravity imperial stout, rich and complex, 10.0% ABV', quantity: 80, price: 18.99, category: 'Stout', sku: 'BEER-STT-002' },
  { name: 'Craft Lager', description: 'Modern craft lager with clean finish, 4.7% ABV', quantity: 260, price: 9.99, category: 'Lager', sku: 'BEER-LAG-003' },
  { name: 'Sour Ale', description: 'Fruity sour ale with tart berry flavors, 5.5% ABV', quantity: 110, price: 13.49, category: 'Sour', sku: 'BEER-SOU-001' },
  { name: 'Brown Ale', description: 'Nutty brown ale with sweet malt character, 5.6% ABV', quantity: 130, price: 10.99, category: 'Ale', sku: 'BEER-ALE-005' },
  { name: 'Barrel-Aged Stout', description: 'Bourbon barrel-aged stout, premium edition, 11.5% ABV', quantity: 45, price: 24.99, category: 'Stout', sku: 'BEER-STT-003' },
  { name: 'Hazy IPA', description: 'New England hazy IPA, juicy and tropical, 6.9% ABV', quantity: 220, price: 13.99, category: 'IPA', sku: 'BEER-IPA-004' },
  { name: 'Light Beer', description: 'Low-calorie light beer, crisp and refreshing, 3.8% ABV', quantity: 350, price: 7.99, category: 'Lager', sku: 'BEER-LAG-004' }
];

// Insert products only if table is empty
const count = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (count.count === 0) {
  const insert = db.prepare(`
    INSERT INTO products (name, description, quantity, price, category, sku)
    VALUES (@name, @description, @quantity, @price, @category, @sku)
  `);

  const insertMany = db.transaction((products) => {
    for (const product of products) {
      insert.run(product);
    }
  });

  insertMany(products);
  console.log('Database initialized with 20 beer products');
} else {
  console.log('Database already contains products');
}

module.exports = db;
