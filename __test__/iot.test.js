const mongoose = require('mongoose');
const Pond = require("../models/pond");
const User = require('../models/user');
const Device = require('../models/device');
const request = require('supertest');
const app = require('../app');
const IoT = require('../models/iot');

describe('IoT collection', () => {

  let pondId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'testdb'
    }).then(async () => {
      const userSeed = await User.create({
        email: 'testlogin@example.com',
        password: 'password',
        address: 'Indonesia',
        phoneNumber: '0822222222',
        name: 'Tambak Piara'
      })

      const deviceSeed = await Device.create({
        name: 'device-2',
        type: 'esp32',
        detail: 'alat sensor pengukur ph dan temperatur',
      });
      
      const pondSeed = await Pond.create( {
        userId: userSeed._id,
        device: deviceSeed._id
      })
      pondId = pondSeed._id

    })
  });

  afterAll(async () => {
    await Pond.deleteMany({});
    await Device.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe('GET /devices', () => {
    it('success, should return all devices list', async () => {
      const response = await request(app).get('/iot/devices');
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("MOCK-GET /devices", () => {
    beforeAll(async () => {
      jest.spyOn(IoT, "findAll").mockRejectedValue("mock error");
    });
    afterAll(async () => {
      jest.restoreAllMocks();
    });
    it("fail (ISE), should return error if IoT.findAll() fails", async () => {
      const response = await request(app).get('/iot/devices');
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal Server Error");
    });
  });

  describe('GET /devices/:pondId', () => {
    it('success, should return a devices detail by pondId', async () => {
      const response = await request(app).get('/iot/devices/6425db4ba1202bb6288f31d9');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('DeviceId', expect.any(String));
      expect(response.body).toHaveProperty('pH', expect.any(Number));
      expect(response.body).toHaveProperty('temp', expect.any(Number));
    });
  });

  describe("MOCK-GET /devices/:pondId", () => {
    beforeAll(async () => {
      jest.spyOn(IoT, "findById").mockRejectedValue({ name: 'NotFound' });
    });
    afterAll(async () => {
      jest.restoreAllMocks();
    });
    it("fail (ISE), should return error if Pond.findById() fails", async () => {
      const response = await request(app).get('/iot/devices/:pondIds');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Data not found");
    });
  });

  describe('POST /devices/:pondId', () => {
    it('success, should add new update data', async () => {
      const data = {
        pH: 7,
        temp: 30
      }
      const response = await request(app).post('/iot/devices/' + pondId).send(data);
      expect(response.status).toBe(201);
        expect(response.body.pond).toHaveProperty('_id',  expect.any(String));
        expect(response.body.pond).toHaveProperty('pH',  expect.any(Number));
        expect(response.body.pond).toHaveProperty('temp',  expect.any(Number));
    });

    it('fail (not found), should return an error message', async () => {
      const data = {
        pH: 7,
        temp: 30
      }
      const response = await request(app).post('/iot/devices/64282f2403a4f431f2080037').send(data);
      expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('message', 'Data not found');
    });
  });
})

