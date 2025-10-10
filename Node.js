// Novo arquivo: server.js (Node.js com Express e MongoDB para backend)
// Para rodar: npm init -y; npm install express mongoose cors; node server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const MONGODB_URI = 'mongodb+srv://pablobass034_db_user:AqBVeBOlSfejm7zu@degusto.x2058kq.mongodb.net/?retryWrites=true&w=majority&appName=degusto';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('Conectado ao MongoDB!'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Schemas
const cartSchema = new mongoose.Schema({
    userId: String,
    data: Array,
    updatedAt: { type: Date, default: Date.now }
});

const gamificationSchema = new mongoose.Schema({
    userId: String,
    data: Object,
    updatedAt: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
    userId: String,
    data: Object,
    createdAt: { type: Date, default: Date.now }
});

// Models
const Cart = mongoose.model('Cart', cartSchema);
const Gamification = mongoose.model('Gamification', gamificationSchema);
const Order = mongoose.model('Order', orderSchema);

// Endpoints
app.post('/api/cart', async(req, res) => {
    const { userId, ...data } = req.body;
    await Cart.findOneAndUpdate({ userId }, { data, updatedAt: new Date() }, { upsert: true });
    res.json({ success: true });
});

app.get('/api/cart', async(req, res) => {
    const { userId } = req.query;
    const cart = await Cart.findOne({ userId });
    res.json(cart ? cart.data : []);
});

app.post('/api/gamification', async(req, res) => {
    const { userId, ...data } = req.body;
    await Gamification.findOneAndUpdate({ userId }, { data, updatedAt: new Date() }, { upsert: true });
    res.json({ success: true });
});

app.get('/api/gamification', async(req, res) => {
    const { userId } = req.query;
    const gam = await Gamification.findOne({ userId });
    res.json(gam ? gam.data : {});
});

app.post('/api/orders', async(req, res) => {
    const { userId, ...data } = req.body;
    await Order.create({ userId, data });
    res.json({ success: true });
});

app.get('/api/orders', async(req, res) => {
    const { userId } = req.query;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders.map(o => o.data));
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:3000/api/cart?AqBVeBOlSfejm7zu`);
});