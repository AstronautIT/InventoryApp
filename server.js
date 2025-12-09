const express = require('express');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes

// Get all beers
app.get('/api/products', (req, res) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY category, name').all();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new product
app.post('/api/products', (req, res) => {
  try {
    const { name, description, quantity, price, category, sku } = req.body;
    
    if (!name || !sku || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'Missing required fields: name, sku, price, quantity' });
    }

    const insert = db.prepare(`
      INSERT INTO products (name, description, quantity, price, category, sku)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    const result = insert.run(name, description || '', quantity, price, category || 'General', sku);
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(product);
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      res.status(400).json({ error: 'SKU already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Update product
app.put('/api/products/:id', (req, res) => {
  try {
    const { name, description, quantity, price, category } = req.body;
    
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const update = db.prepare(`
      UPDATE products 
      SET name = ?, description = ?, quantity = ?, price = ?, category = ?
      WHERE id = ?
    `);
    
    update.run(
      name !== undefined ? name : product.name,
      description !== undefined ? description : product.description,
      quantity !== undefined ? quantity : product.quantity,
      price !== undefined ? price : product.price,
      category !== undefined ? category : product.category,
      req.params.id
    );
    
    const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  try {
    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: 'Product deleted successfully', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Beer Inventory App running on http://localhost:${PORT}`);
});
