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
    })
    .then(async () => {
      await User.create({
        email: 'login@example.com',
        password: 'password'
      })
    })
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /register', () => {
    it('should create a new user', async () => {
      const user = {
        email: 'test@example.com',
        password: 'password'
      };
      const response = await request(app).post('/users/register').send(user);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id', expect.any(String));
      expect(response.body).toHaveProperty('email', user.email);
      expect(response.body).toHaveProperty('membership', null);
    });
  });

  describe('GET /users', () => {
    it('should return a user data', async () => {
      const response = await request(app).get('/users');
      console.log(response.body);
      expect(response.status).toBe(200);
      response.body.forEach(el => {
        expect(el).toHaveProperty('_id', expect.any(String))
        expect(el).toHaveProperty('email', expect.any(String))
        expect(el).toHaveProperty('membership',  null)
        expect(el).toHaveProperty('ponds', expect.any(Array));
      })
    });
  });
})