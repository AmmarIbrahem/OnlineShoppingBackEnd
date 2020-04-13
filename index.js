const express = require('express');
const mongoose = require('mongoose');
const app = express();
const ordersRouter = require('./routes/orders');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/ECommerce';
const port = process.env.PORT || 3000;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(() => console.log('Connected to MongoDB...'))
    .catch(error => console.log('Failed to connect to Mongodb,', error.message));

app.use(express.json());

app.use('/api/orders', ordersRouter);
app.use('/api/products', productsRouter);
app.use('/api/users', usersRouter);

app.listen(port, () => console.log(`Server listens on port ${port}`));