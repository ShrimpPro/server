const Xendit = require("../lib/xendit");
const Order = require("../models/order");
const Invoice = require("xendit-node/src/invoice/invoice");
const PaymentController = require("../controllers/paymentController");
const User = require("../models/user");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Device = require("../models/device");
const { ObjectId } = require("mongoose");
const Pond = require("../models/pond");

describe("PaymentController", () => {

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  describe("createInvoice", () => {
    it("should create invoice and order correctly", async () => {
      const req = {
        body: {
          isPond: "PREMIUM",
          totalPond: 3,
        },
        user: {
          id: "user-id",
          email: "user@example.com",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedInvoice = {
        id: "invoice-id",
        external_id: "invoice-shrimPro-id-123456789",
        amount: 1300000,
        payer_email: "user@example.com",
        description: "invoice for ShrimPro",
        invoice_url: "https://invoice.xendit.com/invoice-url",
      };
      const expectedOrder = {
        category: "PREMIUM",
        totalPrice: 1300000,
        user: "user-id",
        status: "PENDING",
        invoice: "https://invoice.xendit.com/invoice-url",
      };
      Xendit.getXenditInvoice = jest.fn().mockResolvedValue(expectedInvoice);
      Order.create = jest.fn().mockResolvedValue(expectedOrder);

      await PaymentController.createInvoice(req, res);

      expect(Xendit.getXenditInvoice).toHaveBeenCalledWith({
        external_id: expect.stringContaining("invoice-shrimPro-id-"),
        amount: 1300000,
        payer_email: "user@example.com",
        description: "invoice for ShrimPro",
      });
      expect(Order.create).toHaveBeenCalledWith(expectedOrder);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedOrder);
    });

    it("should create order with correct price if isPond is BASIC", async () => {
      const req = {
        body: {
          isPond: "BASIC",
          totalPond: 0,
        },
        user: {
          id: "user-id",
          email: "user@example.com",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedInvoice = {
        id: "invoice-id",
        external_id: "invoice-shrimPro-id-123456789",
        amount: 400000,
        payer_email: "user@example.com",
        description: "invoice for ShrimPro",
        invoice_url: "https://invoice.xendit.com/invoice-url",
      };
      const expectedOrder = {
        category: "BASIC",
        totalPrice: 400000,
        user: "user-id",
        status: "PENDING",
        invoice: "https://invoice.xendit.com/invoice-url",
      };
      Xendit.getXenditInvoice = jest.fn().mockResolvedValue(expectedInvoice);
      Order.create = jest.fn().mockResolvedValue(expectedOrder);

      await PaymentController.createInvoice(req, res);

      expect(Xendit.getXenditInvoice).toHaveBeenCalledWith({
        external_id: expect.stringContaining("invoice-shrimPro-id-"),
        amount: 400000,
        payer_email: "user@example.com",
        description: "invoice for ShrimPro",
      });
      expect(Order.create).toHaveBeenCalledWith(expectedOrder);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedOrder);
    });

    it("should create order with correct price if isPond is BASIC and totalPond is 3", async () => {
      const req = {
        body: {
          isPond: "BASIC",
          totalPond: 3,
        },
        user: {
          id: "user-id",
          email: "user@example.com",
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const expectedInvoice = {
        id: "invoice-id",
        external_id: "invoice-shrimPro-id-123456789",
        amount: 1200000,
        payer_email: "user@example.com",
        description: "invoice for ShrimPro",
        invoice_url: "https://invoice.xendit.com/invoice-url",
      };
      const expectedOrder = {
        category: "BASIC",
        totalPrice: 1200000,
        user: "user-id",
        status: "PENDING",
        invoice: "https://invoice.xendit.com/invoice-url",
      };
      Xendit.getXenditInvoice = jest.fn().mockResolvedValue(expectedInvoice);
      Order.create = jest.fn().mockResolvedValue(expectedOrder);

      await PaymentController.createInvoice(req, res);

      expect(Xendit.getXenditInvoice).toHaveBeenCalledWith({
        external_id: expect.stringContaining("invoice-shrimPro-id-"),
        amount: 1200000,
        payer_email: "user@example.com",
        description: "invoice for ShrimPro",
      });
      expect(Order.create).toHaveBeenCalledWith(expectedOrder);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedOrder);
    });

  });
  // describe("MOCK-POST /invoice", () => {
  //   beforeAll(async () => {
  //     jest.spyOn(Xendit, "getXenditInvoice").mockRejectedValue("mock error");
  //   });
  //   afterAll(async () => {
  //     jest.restoreAllMocks();
  //   });
  //   it("fail (ISE), should return error if Xendit.getXenditInvoice() fails", async () => {
  //     const response = await request(app).post("/payments/invoice").send({
  //       isPond: "BASIC",
  //       totalPond: 1,
  //     });
  //     expect(response.status).toBe(401);
  //     expect(response.body.message).toBe("Internal Server Error");
  //   });
  // });

  describe("PaymentController", () => {
    let order;
    let newInvoice;
    let userId;
    let mockPond;
    let userSeed;
    beforeAll(async () => {
      await mongoose
        .connect(process.env.MONGO_TEST, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          dbName: "testdb",
        })
        .then(async () => {
          userSeed = await User.create({
            email: "testlogin@example.com",
            password: "password",
            address: "Indonesia",
            phoneNumber: "0822222222",
            name: "Tambak Piara",
            membership: "BASIC",
          });
          userId = userSeed._id;

          const deviceSeed = await Device.create({
            name: "device-2",
            type: "esp32",
            detail: "alat sensor pengukur ph dan temperatur",
            pond: "642986eeb8baa3f01eba9f8a",
          });

          newInvoice = await Xendit.getXenditInvoice({
            external_id:
              "invoice-shrimPro-id-" + new Date().getTime().toString(),
            amount: "400000",
            payer_email: "test@payment.com",
            description: `invoice for ${"ShrimPro"}`,
          });
          order = await Order.create({
            totalPrice: "400000",
            user: userId,
            status: "PENDING",
            invoice: `https://checkout-staging.xendit.co/web/${userId}`,
            save: jest.fn(),
          });
          console.log(newInvoice);

          mockPond = await Pond.create({
            userId: userSeed._id,
            device: deviceSeed._id,
            temp: 0,
            pH: 0,
          });

          jest.spyOn(Pond, "create").mockResolvedValue(mockPond);
        });
    });

    afterAll(async () => {
      await Device.deleteMany({});
      await User.deleteMany({});
      await Pond.deleteMany({});
      await mongoose.connection.close();
      jest.restoreAllMocks();
    });

    describe("paid", () => {
      it("should change order status to PAID and update Xendit invoice status to PAID", async () => {
        const mockUpdatePaid = {
          _id: "order-id-123",
          user: "user-id-123",
          status: "PAID",
          invoice: "invoice-id-123",
          save: jest.fn(),
        };

        // definisikan Order.findById sebagai mock function
        Order.findOne = jest.fn().mockResolvedValue(order);
        User.findById = jest.fn().mockResolvedValue(userSeed);
        order.save = jest.fn().mockResolvedValue({ status: "SUCCESS" });
        // definisikan Invoice.getByInvoiceID dan Invoice.update sebagai mock function
        // Xendit.findById = jest.fn().mockResolvedValue(mockInvoice);
        // Invoice.getByInvoiceID = jest.fn().mockResolvedValue(mockInvoice);
        // Invoice.update = jest.fn().mockResolvedValue(null);

        const req = {
          body: {
            status: "PAID",
            id: "642bea9ca565a704c909ec96",
          },
        };
        const next = jest.fn();
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        await PaymentController.paid(req, res, next);

        expect(Order.findOne).toHaveBeenCalledWith({
          invoice: `https://checkout-staging.xendit.co/web/${req.body.id}`,
        });
        // expect(Xendit.getXenditInvoice).not.toHaveBeenCalled();
        expect(order.status).toBe("SUCCESS");
        expect(User.findById).toHaveBeenCalledWith(order.user);
        // expect(Invoice.update).toHaveBeenCalledWith({
        //   invoiceID: "invoice-id-123",
        //   status: "PAID",
        // });
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: "SUCCESS" });
        expect(next).not.toHaveBeenCalled();
      });

      it("fail (payment failed), should return an error message", async () => {
        const id = "642bea9ca565a704c909ec96";
        const res = await request(app).post("/payments/paid").send({
          status: "SUCCESS",
          id,
        });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe("Payment failed for id " + id);
      });

      describe("MOCK-POST /paid", () => {
        beforeAll(async () => {
          jest.spyOn(Order, "findOne").mockRejectedValue("mock error");
        });
        afterAll(async () => {
          jest.restoreAllMocks();
        });
        it("fail (ISE), should return error if User.findById() fails", async () => {
          const response = await request(app).post("/payments/paid").send({
            status: "PAID",
            id: "642bea9ca565a704c909ec96",
          });
          expect(response.status).toBe(500);
          expect(response.body.message).toBe("Internal Server Error");
        });
      });
    });
  });

  // describe("PaymentController", () => {
  //   describe("updateStatusOrder", () => {
  //     it("should update order status to EXPIRED", async () => {
  //       const mockOrder = {
  //         id: 1,
  //         invoice: "INV123",
  //         totalPrice: 10000,
  //       };
  //       Order.findOne = jest.fn().mockResolvedValue(mockOrder);
  //       Order.update = jest.fn().mockResolvedValue([1]);

  //       const req = {
  //         headers: {
  //           "x-callback-token": process.env.CALLBACK_XENDIT,
  //         },
  //         body: {
  //           status: "EXPIRED",
  //           paid_amount: 0,
  //           id: "INV123",
  //         },
  //       };
  //       const res = {
  //         status: jest.fn().mockReturnThis(),
  //         json: jest.fn(),
  //       };
  //       const next = jest.fn();

  //       await PaymentController.updateStatusOrder(req, res, next);

  //       expect(Order.findOne).toHaveBeenCalledWith({
  //         where: { invoice: req.body.id },
  //       });
  //       expect(Order.update).toHaveBeenCalledWith(
  //         { status: "EXPIRED" },
  //         { where: { invoice: req.body.id } }
  //       );
  //       expect(res.status).toHaveBeenCalledWith(200);
  //       expect(res.json).toHaveBeenCalledWith({
  //         message: "Update to Expired Success",
  //       });
  //     });
  //   });

  //   describe("MOCK-POST /paid", () => {
  //     beforeAll(async () => {
  //       jest.spyOn(Order, "findOne").mockRejectedValue("mock error");
  //     });
  //     afterAll(async () => {
  //       jest.restoreAllMocks();
  //     });
  //     it("fail (ISE), should return error if User.findById() fails", async () => {
  //       const response = await request(app)
  //         .post("/payments/paid")
  //         .send({
  //           status: "PAID",
  //           id: "642bea9ca565a704c909ec96",
  //         });
  //       expect(response.status).toBe(500);
  //       expect(response.body.message).toBe("Internal Server Error");
  //     });
  //   });
  // });
});
