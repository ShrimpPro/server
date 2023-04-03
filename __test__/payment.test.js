const Xendit = require('../lib/xendit');
const Order = require("../models/order");
const PaymentController = require("../controllers/paymentController");

// create mock request and response objects
const req = {
  user: { id: 1, email: "test@test.com" },
  body: { isPond: "PREMIUM", totalPond: 2 },
  headers: { "x-callback-token": process.env.CALLBACK_XENDIT }
};
const res = {
  status: jest.fn(() => res),
  json: jest.fn()
};
const next = jest.fn();

// mock Xendit getXenditInvoice function
jest.mock('../lib/xendit', () => ({
  getXenditInvoice: jest.fn(() => Promise.resolve({
    invoice_url: "https://example.com/invoice",
    amount: 120000
  }))
}));

describe("PaymentController", () => {
  describe("createInvoice", () => {
    it("should create a new invoice and order", async () => {
      jest.spyOn(Order, "create").mockResolvedValueOnce({ id: 1 });
      jest.spyOn(Order, "findOne").mockResolvedValueOnce({ id: 1 });
      await PaymentController.createInvoice(req, res, next);
      expect(Xendit.getXenditInvoice).toHaveBeenCalled();
      expect(Order.create).toHaveBeenCalled();
      expect(Order.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        invoice_url: "https://example.com/invoice",
        amount: 120000
      });
    });
  });

  describe("paid", () => {
    it("should return 401 if callback token is invalid", async () => {
      req.headers["x-callback-token"] = "invalid-token";
      await PaymentController.paid(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized" });
    });

    it("should return 404 if invoice not found", async () => {
      jest.spyOn(Order, "findOne").mockResolvedValueOnce(null);
      await PaymentController.paid(req, res, next);
      expect(Order.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Data not found" });
    });

    it("should return 400 if paid amount is not same with amount", async () => {
      jest.spyOn(Order, "findOne").mockResolvedValueOnce({
        totalPrice: 100000,
        invoice: "123"
      });
      req.body.paid_amount = 50000;
      req.body.id = "123";
      await PaymentController.paid(req, res, next);
      expect(Order.findOne).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Paid amount not same with amount" });
    });

    it("should update order status to PAID if payment status is PAID", async () => {
      jest.spyOn(Order, "findOne").mockResolvedValueOnce({
        totalPrice: 100000,
        invoice: "123"
      });
      req.body.status = "PAID";
      req.body.paid_amount = 100000;
      req.body.id = "123";
      jest.spyOn(Order, "update").mockResolvedValueOnce([1]);
      await PaymentController.paid(req, res, next);
      expect(Order.findOne).toHaveBeenCalled();
      expect(Order.update).toHaveBeenCalledWith(
        { status: "PAID" },
        { where: { invoice: "123" } }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Update to PAID Success" });
    });
  });
});
