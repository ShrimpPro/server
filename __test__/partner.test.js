const mongoose = require('mongoose');
const Pond = require("../models/pond");
const Harvest = require('../models/harvest');
const Device = require("../models/device");
const User = require('../models/user');
const request = require('supertest');
const app = require('../app');
const { createToken } = require('../helpers/jwt');

describe('Partner collection', () => {

  let access_token;
  let harvestId;
  let pondId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'testdb'
    })
    .then(async () => {
      const userSeed = await User.create({
        email: 'testlogin@example.com',
        password: 'password'
      })
      const payload = { id: userSeed._id };
      access_token = createToken(payload);
      
      const deviceSeed = await Device.create({
        name: 'device-2',
        type: 'esp32',
        detail: 'alat sensor pengukur ph dan temperatur',
        pond: '642986eeb8baa3f01eba9f8a'
      });

      const pondSeed = await Pond.create( {
        userId: userSeed._id,
        device: deviceSeed._id
      })
      pondId = pondSeed._id

      const harvestSeed = await Harvest.create(    {
        capital: 1000000,
        earning: 5000000,
        quality: "Baik",
        description: "udang-udang sehat dan suhu rerata di angka 34°C",
        pondId: pondId
      })
      harvestId = String(harvestSeed._id)
    })
  });

  afterAll(async () => {
    await Pond.deleteMany({});
    await Harvest.deleteMany({});
    await Device.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /ponds', () => {
    it.only('success, should return ponds list', async () => {
      const response = await request(app).get('/partners/ponds').set({access_token});
      expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object)
    });
  });

  describe('POST /ponds', () => {
    it.only('success, should add new devices and ponds', async () => {
      const response = await request(app).post('/partners/ponds').set({access_token});
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('device', expect.any(Object));
        expect(response.body.device).toHaveProperty('_id', expect.any(String));
        expect(response.body.device).toHaveProperty('name', expect.any(String));
        expect(response.body.device).toHaveProperty('type', expect.any(String));
        expect(response.body.device).toHaveProperty('detail', expect.any(String));

      expect(response.body).toHaveProperty('pond', expect.any(Object));
        expect(response.body.pond).toHaveProperty('_id', expect.any(String));
        expect(response.body.pond).toHaveProperty('temp', null);
        expect(response.body.pond).toHaveProperty('pH', null);
        expect(response.body.pond).toHaveProperty('histories', expect.any(Array));
        expect(response.body.pond).toHaveProperty('harvests', expect.any(Array));
    });
  });

  describe('GET /harvests', () => {
    it.only('success, should return harvests list', async () => {
      const response = await request(app).get('/partners/harvests').set({access_token});
      expect(response.status).toBe(200);
      response.body.forEach((el) => {
        expect(el).toHaveProperty('_id', expect.any(String));
        expect(el).toHaveProperty('capital', expect.any(Number));
        expect(el).toHaveProperty('earning', expect.any(Number));
        expect(el).toHaveProperty('quality', expect.any(String));
        expect(el).toHaveProperty('description', expect.any(String));
        expect(el).toHaveProperty('pondId', expect.any(String));
      })
    });
  });

  describe('GET /harvests:id', () => {
    it.only('success, should return harvest data by id', async () => {
      const response = await request(app).get('/partners/harvests/' + harvestId).set({access_token});
      expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', expect.any(String));
        expect(response.body).toHaveProperty('capital', expect.any(Number));
        expect(response.body).toHaveProperty('earning', expect.any(Number));
        expect(response.body).toHaveProperty('quality', expect.any(String));
        expect(response.body).toHaveProperty('description', expect.any(String));
        expect(response.body).toHaveProperty('pondId', expect.any(String));
    });

    it.only('fail (not found), should return a message: Data Data not found', async () => {
      const response = await request(app).get('/partners/harvests/64299c983278418f9a6f720b').set({access_token});
      expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Data not found');
    });
  });

  describe('POST /harvests/:pondId', () => {
    it.only('success, should add new harvest data', async () => {
      const harvest = {
        capital: 1000000,
        earning: 5000000,
        quality: "Baik",
        description: "udang berkualitas baik, suhu tidak pernah dibawah 34° Celcius",
      }
      const response = await request(app).post('/partners/harvests/' + pondId).send(harvest).set({access_token})
      expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('_id', expect.any(String));
        expect(response.body).toHaveProperty('capital', 1000000);
        expect(response.body).toHaveProperty('earning', 5000000);
        expect(response.body).toHaveProperty('quality', "Baik");
        expect(response.body).toHaveProperty('description', "udang berkualitas baik, suhu tidak pernah dibawah 34° Celcius");
        expect(response.body).toHaveProperty('pondId', String(pondId));
    });

    it.only('fail (not found), should return a message: Data Data not found', async () => {
      const harvest = {
        capital: 1000000,
        earning: 5000000,
        quality: "Baik",
        description: "udang berkualitas baik, suhu tidak pernah dibawah 34° Celcius",
      }
      const response = await request(app).post('/partners/harvests/64299c983278418f9a6f720b').send(harvest).set({access_token})
      expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Data not found');
    });
  });

  describe('PUT /harvests/:id', () => {
    it.only('success, should changed harvest data', async () => {
      const harvest = {
        capital: 1000000,
        earning: 5000000,
        quality: "Cukup",
        description: "udang-udang sehat dan suhu rerata di angka 34°C",
      }
      const response = await request(app).put('/partners/harvests/' + harvestId).send(harvest).set({access_token});
      expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('_id', harvestId);
        expect(response.body).toHaveProperty('capital', 1000000);
        expect(response.body).toHaveProperty('earning', 5000000);
        expect(response.body).toHaveProperty('quality', "Cukup");
        expect(response.body).toHaveProperty('description', "udang-udang sehat dan suhu rerata di angka 34°C");
        expect(response.body).toHaveProperty('pondId', String(pondId));
    });

    it.only('fail (not found), should return a message: Data Data not found', async () => {
      const harvest = {
        capital: 1000000,
        earning: 5000000,
        quality: "Cukup",
        description: "udang-udang sehat dan suhu rerata di angka 34°C",
      }
      const response = await request(app).put('/partners/harvests/64299c983278418f9a6f720b').send(harvest).set({access_token});
      expect(response.status).toBe(404);
       expect(response.body).toHaveProperty('message', 'Data not found');
    });

    it.only('fail (null capital), should return an error message', async () => {
      const harvest = {
        earning: 5000000,
        quality: "Cukup",
        description: "udang-udang sehat dan suhu rerata di angka 34°C",
      }
      const response = await request(app).put('/partners/harvests/' + harvestId).send(harvest).set({access_token});
      expect(response.status).toBe(400);
       expect(response.body).toHaveProperty('message', 'Harvest validation failed: capital: Path `capital` is required.');
    });

    it.only('fail (null quality), should return an error message', async () => {
      const harvest = {
        earning: 5000000,
        capital: 5000000,
        description: "udang-udang sehat dan suhu rerata di angka 34°C",
      }
      const response = await request(app).put('/partners/harvests/' + harvestId).send(harvest).set({access_token});
      expect(response.status).toBe(400);
       expect(response.body).toHaveProperty('message', 'Harvest validation failed: quality: Path `quality` is required.');
    });
  });

  describe('GET /ponds', () => {
    it.only('success, should return ponds list', async () => {
      const response = await request(app).get('/partners/ponds').set({access_token});
      expect(response.status).toBe(200);
        expect(response.body).toBeInstanceOf(Object)
    });
  });
})

