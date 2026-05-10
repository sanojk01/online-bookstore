const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');


/* Routes */
const authRoutes = require('./routes/auth.routes');
const addressRoutes = require('./routes/address.routes');
const bookRoutes = require('./routes/book.routes');
const cartRoutes = require('./routes/cart.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());


/* Use Routes */
app.use('/api/auth', authRoutes);
app.use('/api/users/me/addresses', addressRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);



module.exports = app;