const mongoose = require('mongoose');
const User = require('../models/user');
const request = require('supertest');
const app = require('../app');

let userId;

describe('User collection', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'testdb'
       }).then( async () => {
        const userSeed = await User.create({
          email: 'testlogin@example.com',
          password: 'password',
          address: 'Indonesia',
          phoneNumber: '0822222222',
          name: 'Tambak Piara'
        })
        userId = userSeed._id
      })
  });

  beforeEach(() => {
    jest.resetAllMocks()
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('POST /register', () => {
    it('should create a new user', async () => {
      const user = {
        email: 'test@example.com',
        password: 'password',
        address: 'Indonesia',
        phoneNumber: '0822222222',
        name: 'Tambak Piara'
      };
      const response = await request(app).post('/users/register').send(user);
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id', expect.any(String));
      expect(response.body).toHaveProperty('email', user.email);
      expect(response.body).toHaveProperty('membership', null);
      expect(response.body).toHaveProperty('ponds', expect.any(Array));
    });
    
    // it('fail (ISE), should return error if User.create fails', async () => {
    //   User.create = jest.fn().mockImplementation(() => {
    //     throw new Error('mock error');
    //   });
    //   const response = await request(app).post('/users/register').send({});
    //   expect(response.status).toBe(500);
    //   expect(response.body.message).toBe('Internal Server Error');
    //   User.create.mockReset();
    // });
  });

  describe('GET /users', () => {
    it('should return a user data', async () => {
      const response = await request(app).get('/users');
      expect(response.status).toBe(200);
      response.body.forEach(el => {
        expect(el).toHaveProperty('_id', expect.any(String))
        expect(el).toHaveProperty('email', expect.any(String))
        expect(el).toHaveProperty('membership',  null)
        expect(el).toHaveProperty('ponds', expect.any(Array));
      })
    });

    // it('should return error if User.find() fails', async () => {
    //   User.find = jest.fn().mockImplementation(() => {
    //     throw new Error('mock error');
    //   });
    //   const response = await request(app).get('/users');
    //   expect(response.status).toBe(500);
    //   expect(response.body.message).toBe('Internal Server Error');
    //   User.find.mockReset();
    // });
  });

  describe('POST /login', () => {
    it('success, should return an access token', async () => {
      const user = {
        email: 'testlogin@example.com',
        password: 'password'
      };
      const response = await request(app).post('/users/login').send(user);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('access_token', expect.any(String));
    });

    it('fail (wrong email), should return a message: Email or Password is invalid', async () => {
      const user = {
        email: 'login',
        password: 'password'
      };
      const response = await request(app).post('/users/login').send(user);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Email or Password is invalid');;
    });

    it('fail (wrong password), should return a message: Email or Password is invalid', async () => {
      const user = {
        email: 'login@example.com',
        password: 'wrongpassword'
      };
      const response = await request(app).post('/users/login').send(user);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Email or Password is invalid');;
    });

    it('fail (empty email), should return a message: Email and Password is required', async () => {
      const user = {
        email: '',
        password: 'password'
      };
      const response = await request(app).post('/users/login').send(user);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email and Password is required');;
    });

    it('fail (empty password), should return a message: Email and Password is required', async () => {
      const user = {
        email: 'login@example.com',
        password: ''
      };
      const response = await request(app).post('/users/login').send(user);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email and Password is required');
    });
  });

  describe('PATCH /membership/:id', () => {
    it('success, should return an updated membership data', async () => {
      const memberPremium = await User.create({
        email: 'checkmember@example.com',
        password: 'password',
        address: 'Indonesia',
        phoneNumber: '0822222222',
        name: 'Tambak Piara'
      })
      let id = String(memberPremium._id)
      console.log(id, '<<<<<<<<<<<<<<<<<')
      const response = await request(app).patch('/users/membership/' + id ).send({membership: 'premium'});
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', String(memberPremium._id));
      expect(response.body).toHaveProperty('email', 'checkmember@example.com');
      expect(response.body).toHaveProperty('membership', 'premium');
      expect(response.body).toHaveProperty('ponds', expect.any(Array));
    });

    it('fail (id not found), should return a message: Data not found', async () => {
      const response = await request(app).patch('/users/membership/64294078048f36630707dcf4').send({membership: 'premium'});
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Data not found');
    });
  });

  describe('GET /users/:id', () => {
    it('success, should return an updated membership data', async () => {
      const response = await request(app).get('/users/' + String(userId) );
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', String(userId));
      expect(response.body).toHaveProperty('email', 'testlogin@example.com');
      expect(response.body).toHaveProperty('phoneNumber', expect.any(String));
      expect(response.body).toHaveProperty('address', expect.any(String));
      expect(response.body).toHaveProperty('name', expect.any(String));
      expect(response.body).toHaveProperty('membership', null);
      expect(response.body).toHaveProperty('ponds', expect.any(Array));
    });

    // it('fail (ISE), should return error if User.findById() fails', async () => {
    //   User.findById = jest.fn().mockImplementation(() => {
    //     throw new Error('mock error');
    //   });
    //   const response = await request(app).get('/users/' + String(userId));
    //   expect(response.status).toBe(500);
    //   expect(response.body.message).toBe('Internal Server Error');
    //   User.findById.mockReset();
    // });
  });

  describe('PUT /users/:id', () => {
    it('success, should return an updated membership data', async () => {
      const putUser = {
        name: 'Tambak Piara',
        phoneNumber: '0822222222',
        address: 'Indonesia',
        images: 'imgofme.com'
      }

      const response = await request(app).put('/users/' + String(userId) ).send(putUser);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id', String(userId));
      expect(response.body).toHaveProperty('email', 'testlogin@example.com');
      expect(response.body).toHaveProperty('phoneNumber', '0822222222');
      expect(response.body).toHaveProperty('address', 'Indonesia');
      expect(response.body).toHaveProperty('name', 'Tambak Piara');
      expect(response.body).toHaveProperty('membership', null);
      expect(response.body).toHaveProperty('images', expect.any(Array));
    });

    it('fail (id not found), should return a message: Data not found', async () => {
      const response = await request(app).put('/users/64294078048f36630707dcf4').send({membership: 'premium'});
      expect(response.status).toBe(404);
      console.log(response.body)
      expect(response.body).toHaveProperty('message', 'Data not found');
    });

    it('fail (invalid access_token), should return Please login first', async () => {
      const response = await request(app).get('/partners/ponds').set({});
      expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object)
    });

    it('fail (invalid access_token), should return Please login first', async () => {
      const access_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0MmFjZmZkMjY4NDhkMmQ4ZGFiZTE0ZCIsImlhdCI6MTY4MDUyNzM2M30.BmLizQKIdEfAao5ZjJLXHBMDT6VDuMpDGrC7M-UfW6s'
      const response = await request(app).get('/partners/ponds').set({access_token});
      expect(response.status).toBe(401);
        expect(response.body).toBeInstanceOf(Object)
    });
  });
})

