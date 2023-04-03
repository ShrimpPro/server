const Xendit = require('../lib/xendit');
const Order = require("../models/order");
const PaymentController = require("../controllers/paymentController");

describe("PaymentController.createInvoice", () => {
  const req = {
    body: {
      isPond: "PREMIUM",
      totalPond: 5,
    },
    user: {
      id: "user-1",
      email: "user@example.com",
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  it("should create an invoice and order with correct data and return the invoice", async () => {
    const getXenditInvoiceSpy = jest.spyOn(Xendit, "getXenditInvoice").mockResolvedValueOnce({
      external_id: "invoice-shrimPro-id-123",
      amount: 150000,
      invoice_url: "https://example.com/invoice",
    });

    const orderCreateSpy = jest.spyOn(Order, "create").mockResolvedValueOnce({
      totalPrice: 150000,
      user: "user-1",
      status: "PENDING",
      invoice: "https://example.com/invoice",
    });

    await PaymentController.createInvoice(req, res, next);

    expect(getXenditInvoiceSpy).toHaveBeenCalledWith({
      external_id: expect.stringContaining("invoice-shrimPro-id-"),
      amount: 150000,
      payer_email: "user@example.com",
      description: "invoice for ShrimPro",
    });

    expect(orderCreateSpy).toHaveBeenCalledWith({
      totalPrice: 150000,
      user: "user-1",
      status: "PENDING",
      invoice: "https://example.com/invoice",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      external_id: "invoice-shrimPro-id-123",
      amount: 150000,
      invoice_url: "https://example.com/invoice",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should create an invoice and order with correct data and return the invoice (basic)", async () => {
    req.body.isPond = "BASIC";
    req.body.totalPond = 3;

    const getXenditInvoiceSpy = jest.spyOn(Xendit, "getXenditInvoice").mockResolvedValueOnce({
      external_id: "invoice-shrimPro-id-456",
      amount: 30000,
      invoice_url: "https://example.com/invoice-basic",
    });

    const orderCreateSpy = jest.spyOn(Order, "create").mockResolvedValueOnce({
      totalPrice: 30000,
      user: "user-1",
      status: "PENDING",
      invoice: "https://example.com/invoice-basic",
    });

    await PaymentController.createInvoice(req, res, next);

    expect(getXenditInvoiceSpy).toHaveBeenCalledWith({
      external_id: expect.stringContaining("invoice-shrimPro-id-"),
      amount: 30000,
      payer_email: "user@example.com",
      description: "invoice for ShrimPro",
    });

    expect(orderCreateSpy).toHaveBeenCalledWith({
      totalPrice: 30000,
      user: "user-1",
      status: "PENDING",
      invoice: "https://example.com/invoice-basic",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      external_id: "invoice-shrimPro-id-456",
      amount: 30000,
      invoice_url: "https://example.com/invoice-basic",
    });
  })
})

describe('PaymentController', () => {
  describe('paid', () => {
    it('should change order status to PAID and update Xendit invoice status to PAID', async () => {
      const mockCurrentPaid = {
        _id: 'order-id-123',
        user: 'user-id-123',
        status: 'PENDING',
        invoice: 'invoice-id-123',
        save: jest.fn(),
      };
      
      const mockInvoice = {
        status: 'PENDING',
      };

      const mockUpdatePaid = {
        _id: 'order-id-123',
        user: 'user-id-123',
        status: 'PAID',
        invoice: 'invoice-id-123',
        save: jest.fn(),
      };

      // definisikan Order.findById sebagai mock function
      Order.findById = jest.fn().mockResolvedValue(mockCurrentPaid);
      
      // definisikan Invoice.getByInvoiceID dan Invoice.update sebagai mock function
      Xendit.getXenditInvoice = jest.fn().mockResolvedValue(mockInvoice);
      Invoice.getByInvoiceID = jest.fn().mockResolvedValue(mockInvoice);
      Invoice.update = jest.fn().mockResolvedValue(null);

      const req = {
        user: {
          id: 'user-id-123',
        },
        body: {
          orderId: 'order-id-123',
        },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const next = jest.fn();

      await PaymentController.paid(req, res, next);

      expect(Order.findById).toHaveBeenCalledWith('order-id-123');
      expect(Xendit.getXenditInvoice).not.toHaveBeenCalled();
      expect(mockCurrentPaid.status).toBe('PAID');
      expect(mockCurrentPaid.save).toHaveBeenCalled();
      expect(Invoice.getByInvoiceID).toHaveBeenCalledWith('invoice-id-123');
      expect(Invoice.update).toHaveBeenCalledWith({
        invoiceID: 'invoice-id-123',
        status: 'PAID',
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUpdatePaid);
      expect(next).not.toHaveBeenCalled();
    });
  });
});