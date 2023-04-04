const mongoose = require("mongoose");
const Pond = require("../models/pond");
const Harvest = require("../models/harvest");
const Device = require("../models/device");
const User = require("../models/user");
const request = require("supertest");
const app = require("../app");
const { createToken } = require("../helpers/jwt");

describe("Partner collection", () => {
  let access_token;
  let access_token_fail;
  let access_token_upgrade;
  let harvestId;
  let pondId;

  beforeAll(async () => {
    await mongoose
      .connect(process.env.MONGO_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: "testdb",
      })
      .then(async () => {
        const userSeed = await User.create({
          email: "testlogin@example.com",
          password: "password",
          address: "Indonesia",
          phoneNumber: "0822222222",
          name: "Tambak Piara",
          membership: "BASIC",
        });
        const payload = { id: userSeed._id };
        access_token = createToken(payload);

        const userSeedFail = await User.create({
          email: "testfail@example.com",
          password: "password",
          address: "Indonesia",
          phoneNumber: "08111111",
          name: "Tambak Piara"
        });
        const payloadFail = { id: userSeedFail._id };
        access_token_fail = createToken(payloadFail);

        let userSeedUpgrade = await User.create({
          email: "testUpgrade@example.com",
          password: "password",
          address: "Indonesia",
          phoneNumber: "08111111",
          name: "Tambak Piara",
          membership: "BASIC",
        });
        const payloadUpgrade = { id: userSeedUpgrade._id };
        access_token_upgrade = createToken(payloadUpgrade);

        const deviceSeed = await Device.create({
          name: "device-2",
          type: "esp32",
          detail: "alat sensor pengukur ph dan temperatur",
          pond: "642986eeb8baa3f01eba9f8a",
        });

        const pondsUpgrade = await Pond.create({
          userId: userSeedUpgrade._id,
          device: deviceSeed._id,
        });

        userSeedUpgrade.ponds.push(pondsUpgrade._id);
        await userSeedUpgrade.save();

        console.log(userSeedUpgrade.ponds.length)

        const pondSeed = await Pond.create({
          userId: userSeed._id,
          device: deviceSeed._id,
        });
        pondId = pondSeed._id;

        const harvestSeed = await Harvest.create({
          capital: 1000000,
          earning: 5000000,
          quality: "Baik",
          description: "udang-udang sehat dan suhu rerata di angka 34°C",
          pondId: pondId,
        });
        harvestId = String(harvestSeed._id);
      });
  });

  afterAll(async () => {
    await Pond.deleteMany({});
    await Harvest.deleteMany({});
    await Device.deleteMany({});
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  describe("GET /ponds", () => {
    it("success, should return ponds list", async () => {
      const response = await request(app)
        .get("/partners/ponds")
        .set({ access_token });
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("POST /ponds", () => {
    it("success, should add new devices and ponds", async () => {
      const response = await request(app)
        .post("/partners/ponds")
        .set({ access_token });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("device", expect.any(Object));
      expect(response.body.device).toHaveProperty("_id", expect.any(String));
      expect(response.body.device).toHaveProperty("name", expect.any(String));
      expect(response.body.device).toHaveProperty("type", expect.any(String));
      expect(response.body.device).toHaveProperty("detail", expect.any(String));

      expect(response.body).toHaveProperty("pond", expect.any(Object));
      expect(response.body.pond).toHaveProperty("_id", expect.any(String));
      expect(response.body.pond).toHaveProperty("temp", null);
      expect(response.body.pond).toHaveProperty("pH", null);
      expect(response.body.pond).toHaveProperty("histories", expect.any(Array));
      expect(response.body.pond).toHaveProperty("harvests", expect.any(Array));
    });

    it("fail (need membership), should return an error message", async () => {
      const response = await request(app)
        .post("/partners/ponds")
        .set({ access_token: access_token_fail });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "You need to be a member first"
      );
    });

    it("fail (need upgrade), should return an error message", async () => {
      const response = await request(app)
        .post("/partners/ponds")
        .set({ access_token: access_token_upgrade });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Maximum limit reached, please consider upgrading your membership"
      );
    });
  });

  describe("GET /ponds/:id", () => {
    it("success, should return pond detail", async () => {
      const response = await request(app)
        .get("/partners/ponds/" + pondId)
        .set({ access_token });
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Object);
    });
  });

  describe("MOCK-GET /ponds & /ponds/:id", () => {
    beforeAll(async () => {
      jest.spyOn(Pond, "populate").mockRejectedValue("mock error");
    });
    afterAll(async () => {
      jest.restoreAllMocks();
    });
    it("fail (ISE), should return error if Pond.find().populate() fails", async () => {
      const response = await request(app)
        .get("/partners/ponds")
        .set({ access_token });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal Server Error");
    });
    it("fail (ISE), should return error if Pond.findById().populate() fails", async () => {
      const response = await request(app)
        .get("/partners/ponds/" + pondId)
        .set({ access_token });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal Server Error");
    });
  });

  describe("GET /harvests", () => {
    it("success, should return harvests list", async () => {
      const response = await request(app)
        .get("/partners/harvests")
        .set({ access_token });
      expect(response.status).toBe(200);
      response.body.forEach((el) => {
        expect(el).toHaveProperty("_id", expect.any(String));
        expect(el).toHaveProperty("capital", expect.any(Number));
        expect(el).toHaveProperty("earning", expect.any(Number));
        expect(el).toHaveProperty("quality", expect.any(String));
        expect(el).toHaveProperty("description", expect.any(String));
        expect(el).toHaveProperty("pondId", expect.any(String));
      });
    });
  });

  describe("MOCK-GET /harvests", () => {
    beforeAll(async () => {
      jest.spyOn(Harvest, "find").mockRejectedValue("mock error");
    });
    afterAll(async () => {
      jest.restoreAllMocks();
    });
    it("fail (ISE), should return error if Harvest.find() fails", async () => {
      const response = await request(app)
        .get("/partners/harvests")
        .set({ access_token });
      expect(response.status).toBe(500);
      expect(response.body.message).toBe("Internal Server Error");
    });
  });

  describe("GET /harvests:id", () => {
    it("success, should return harvest data by id", async () => {
      const response = await request(app)
        .get("/partners/harvests/" + harvestId)
        .set({ access_token });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", expect.any(String));
      expect(response.body).toHaveProperty("capital", expect.any(Number));
      expect(response.body).toHaveProperty("earning", expect.any(Number));
      expect(response.body).toHaveProperty("quality", expect.any(String));
      expect(response.body).toHaveProperty("description", expect.any(String));
      expect(response.body).toHaveProperty("pondId", expect.any(String));
    });

    it("fail (not found), should return a message: Data Data not found", async () => {
      const response = await request(app)
        .get("/partners/harvests/64299c983278418f9a6f720b")
        .set({ access_token });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Data not found");
    });
  });

  describe("POST /harvests/:pondId", () => {
    it("success, should add new harvest data", async () => {
      const harvest = {
        capital: 1000000,
        earning: 5000000,
        quality: "Baik",
        description:
          "udang berkualitas baik, suhu tidak pernah dibawah 34° Celcius",
      };
      const response = await request(app)
        .post("/partners/harvests/" + pondId)
        .send(harvest)
        .set({ access_token });
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("_id", expect.any(String));
      expect(response.body).toHaveProperty("capital", 1000000);
      expect(response.body).toHaveProperty("earning", 5000000);
      expect(response.body).toHaveProperty("quality", "Baik");
      expect(response.body).toHaveProperty(
        "description",
        "udang berkualitas baik, suhu tidak pernah dibawah 34° Celcius"
      );
      expect(response.body).toHaveProperty("pondId", String(pondId));
    });

    it("fail (not found), should return a message: Data Data not found", async () => {
      const harvest = {
        capital: 1000000,
        earning: 5000000,
        quality: "Baik",
        description:
          "udang berkualitas baik, suhu tidak pernah dibawah 34° Celcius",
      };
      const response = await request(app)
        .post("/partners/harvests/64299c983278418f9a6f720b")
        .send(harvest)
        .set({ access_token });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Data not found");
    });
  });

  describe("PUT /harvests/:id", () => {
    it("success, should changed harvest data", async () => {
      const harvest = {
        capital: 1000000,
        earning: 5000000,
        quality: "Cukup",
        description: "udang-udang sehat dan suhu rerata di angka 34°C",
      };
      const response = await request(app)
        .put("/partners/harvests/" + harvestId)
        .send(harvest)
        .set({ access_token });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("_id", harvestId);
      expect(response.body).toHaveProperty("capital", 1000000);
      expect(response.body).toHaveProperty("earning", 5000000);
      expect(response.body).toHaveProperty("quality", "Cukup");
      expect(response.body).toHaveProperty(
        "description",
        "udang-udang sehat dan suhu rerata di angka 34°C"
      );
      expect(response.body).toHaveProperty("pondId", String(pondId));
    });

    it("fail (not found), should return a message: Data Data not found", async () => {
      const harvest = {
        capital: 1000000,
        earning: 5000000,
        quality: "Cukup",
        description: "udang-udang sehat dan suhu rerata di angka 34°C",
      };
      const response = await request(app)
        .put("/partners/harvests/64299c983278418f9a6f720b")
        .send(harvest)
        .set({ access_token });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Data not found");
    });

    it("fail (null capital), should return an error message", async () => {
      const harvest = {
        earning: 5000000,
        quality: "Cukup",
        description: "udang-udang sehat dan suhu rerata di angka 34°C",
      };
      const response = await request(app)
        .put("/partners/harvests/" + harvestId)
        .send(harvest)
        .set({ access_token });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Harvest validation failed: capital: Path `capital` is required."
      );
    });

    it("fail (null quality), should return an error message", async () => {
      const harvest = {
        earning: 5000000,
        capital: 5000000,
        description: "udang-udang sehat dan suhu rerata di angka 34°C",
      };
      const response = await request(app)
        .put("/partners/harvests/" + harvestId)
        .send(harvest)
        .set({ access_token });
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Harvest validation failed: quality: Path `quality` is required."
      );
    });
  });

  describe("DELETE /harvests/:id", () => {
    it("success, should remove harvest by id", async () => {
      const response = await request(app)
        .delete("/partners/harvests/" + harvestId)
        .set({ access_token });
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("message", "Harvest removed");
    });

    it("fail (not found), should return an error message", async () => {
      const response = await request(app)
        .delete("/partners/harvests/642a52434eca1d8fb4e84677")
        .set({ access_token });
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "Data not found");
    });
  });
});
