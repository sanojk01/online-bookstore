const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');


/* Routes */
const authRoutes = require('./routes/auth.routes');
const addressRoutes = require('./routes/address.routes');
const bookRoutes = require('./routes/book.routes');

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());


/* Use Routes */
app.use('/api/auth', authRoutes);
app.use('/api/users/me/addresses', addressRoutes);
app.use('/api/books', bookRoutes);



module.exports = app;