const mongoose = require('mongoose');
const request = require('supertest');
const express = require('express');
const app = require('../app');
const User = require('../models/user');
const Order = require('../models/order');
const { createToken } = require('../helpers/jwt');
const PaymentRouter = require('../routers/payment');

const paymentApp = express();
paymentApp.use(express.json());
paymentApp.use('/payments', PaymentRouter);

describe('PaymentController', () => {
  let server, token, db;

  beforeAll(async () => {
    db = await mongoose.connect(process.env.MONGO_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // create a new user to get the token
    const user = await User.create({
      name: 'a',
      email: 'a@a.com',
      password: 'a',
    });

    // create token
    token = createToken({ id: user._id });

    server = paymentApp.listen(4000, () => {
      console.log('Server started on port 4000');
    });
  });

  afterAll(async () => {
    await server.close();
    await db.connection.close();
  });

  describe('GET /payments/invoice', () => {
    it('should create a new order and invoice', async () => {
      const response = await request(paymentApp)
        .get('/payments/invoice')
        .send({ isPond: 'BASIC', totalPond: 2 })
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('external_id');
      expect(response.body).toHaveProperty('payer_email');
    });
  });

  describe('GET /payments/paid', () => {
    it('should update the order status to SUCCESS', async () => {
      const order = await Order.create({
        totalPrice: 200000,
        user: new mongoose.Types.ObjectId(),
        status: 'PENDING',
        invoice: 'https://invoice.xendit.com/id/123456',
      });

      const response = await request(paymentApp)
        .get(`/payments/paid?orderId=${order._id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'SUCCESS');

      const updatedOrder = await Order.findById(order._id);
      expect(updatedOrder.status).toBe('SUCCESS');
    });
  });
});
