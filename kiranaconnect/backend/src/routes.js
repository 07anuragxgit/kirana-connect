const express = require('express');
const { getDb } = require('./db');
const { generateAnalytics } = require('./ai');
const { verifyToken, verifyVendor } = require('./middleware/auth');
const crypto = require('crypto');

const router = express.Router();

router.get('/stores', async (req, res) => {
  const db = await getDb();
  const stores = await db.all('SELECT * FROM stores');
  stores.forEach(s => {
    try { s.tags = JSON.parse(s.tags) } catch(e){ s.tags=[] }
  });
  res.json(stores);
});

router.post('/stores', verifyToken, verifyVendor, async (req, res) => {
  const db = await getDb();
  // Check if vendor already has a store
  const existing = await db.get('SELECT * FROM stores WHERE vendorId = ?', [req.user.id]);
  if (existing) return res.status(400).json({ error: 'Vendor already has a store' });

  const { name, owner, distance, rating, deliveryTime, address, tags } = req.body;
  const id = crypto.randomBytes(4).toString('hex');
  
  try {
    await db.run('INSERT INTO stores (id, vendorId, name, owner, distance, rating, deliveryTime, address, lat, lng, tags, open) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, req.user.id, name, owner, distance, rating, deliveryTime, address, 0, 0, JSON.stringify(tags || []), 1]);
    const store = await db.get('SELECT * FROM stores WHERE id = ?', [id]);
    res.json(store);
  } catch (err) {
    res.status(500).json({ error: 'Store creation failed' });
  }
});

router.get('/vendor/store', verifyToken, verifyVendor, async (req, res) => {
  const db = await getDb();
  const store = await db.get('SELECT * FROM stores WHERE vendorId = ?', [req.user.id]);
  res.json(store || null);
});

router.get('/stores/:id/products', async (req, res) => {
  const db = await getDb();
  const products = await db.all('SELECT * FROM products WHERE storeId = ?', [req.params.id]);
  res.json(products);
});

router.post('/stores/:id/products', verifyToken, verifyVendor, async (req, res) => {
  const db = await getDb();
  const store = await db.get('SELECT * FROM stores WHERE id = ? AND vendorId = ?', [req.params.id, req.user.id]);
  if (!store) return res.status(403).json({ error: 'Not authorized for this store' });

  const { name, price, category, image, stock } = req.body;
  const id = crypto.randomBytes(4).toString('hex');
  
  await db.run('INSERT INTO products (id, storeId, name, price, category, image, stock) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, store.id, name, price, category, image, stock]);
  const prod = await db.get('SELECT * FROM products WHERE id = ?', [id]);
  res.json(prod);
});

router.post('/orders', verifyToken, async (req, res) => {
  const db = await getDb();
  const { storeId, customerName, customerPhone, items, total } = req.body;
  const id = crypto.randomBytes(4).toString('hex');
  const status = 'pending';
  const createdAt = new Date().toISOString();

  await db.run('INSERT INTO orders (id, storeId, userId, customerName, customerPhone, total, status, createdAt, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [id, storeId, req.user.id, customerName, customerPhone, total, status, createdAt, JSON.stringify(items)]);
    
  res.json({ success: true, orderId: id });
});

router.get('/orders/:storeId', verifyToken, verifyVendor, async (req, res) => {
  const db = await getDb();
  const store = await db.get('SELECT * FROM stores WHERE id = ? AND vendorId = ?', [req.params.storeId, req.user.id]);
  if (!store) return res.status(403).json({ error: 'Not authorized' });

  const orders = await db.all('SELECT * FROM orders WHERE storeId = ? ORDER BY createdAt DESC', [req.params.storeId]);
  orders.forEach(o => {
    try { o.items = JSON.parse(o.items) } catch(e){}
  });
  res.json(orders);
});

router.patch('/orders/:orderId', verifyToken, verifyVendor, async (req, res) => {
  const db = await getDb();
  const { status } = req.body;
  await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.orderId]);
  res.json({ success: true });
});

router.get('/stores/:id/analytics', verifyToken, verifyVendor, async (req, res) => {
  const db = await getDb();
  const orders = await db.all('SELECT total, status, createdAt, items FROM orders WHERE storeId = ? ORDER BY createdAt DESC LIMIT 15', [req.params.id]);
  orders.forEach(o => {
     try { o.items = JSON.parse(o.items) } catch(e){}
  });
  
  const insights = await generateAnalytics(orders);
  res.json({ insights });
});

module.exports = router;
