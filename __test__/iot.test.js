const mongoose = require('mongoose');
const User = require('../models/user');
const request = require('supertest');
const app = require('../app');

describe('IoT collection', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'testdb'
    })
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('GET /devices', () => {
    it('success, should return all devices list', async () => {
      const response = await request(app).get('/iot/devices');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
    });
  });
})

