const mongoose = require('mongoose');
const User = require('../models/user');
const request = require('supertest');
const app = require('../app');

describe('User collection', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'testdb'
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /register', () => {
    it('should create a new user', async () => {
      const user = {
        email: 'test@example.com',
        password: 'password'
      };
      const response = await request(app).post('/users/register').send(user);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('email', user.email);
      expect(response.body).toHaveProperty('password', expect.any(String));
      expect(response.body).toHaveProperty('role', 'user');
    });
  });
})