const Xendit = require('../lib/xendit');
const Order = require("../models/order");
const PaymentController = require("../controllers/paymentController");

describe('PaymentController', () => {
  describe('createInvoice', () => {
    it('should create invoice and order correctly', async () => {
      const req = {
        body: {
          isPond: 'PREMIUM',
          totalPond: 3
        },
        user: {
          id: 'user-id',
          email: 'user@example.com'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const expectedInvoice = {
        id: 'invoice-id',
        external_id: 'invoice-shrimPro-id-123456789',
        amount: 130000,
        payer_email: 'user@example.com',
        description: 'invoice for ShrimPro',
        invoice_url: 'https://invoice.xendit.com/invoice-url'
      };
      const expectedOrder = {
        totalPrice: 130000,
        user: 'user-id',
        status: 'PENDING',
        invoice: 'https://invoice.xendit.com/invoice-url'
      };
      Xendit.getXenditInvoice = jest.fn().mockResolvedValue(expectedInvoice);
      Order.create = jest.fn().mockResolvedValue(expectedOrder);

      await PaymentController.createInvoice(req, res);

      expect(Xendit.getXenditInvoice).toHaveBeenCalledWith({
        external_id: expect.stringContaining('invoice-shrimPro-id-'),
        amount: 130000,
        payer_email: 'user@example.com',
        description: 'invoice for ShrimPro'
      });
      expect(Order.create).toHaveBeenCalledWith(expectedOrder);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedInvoice);
    });

    it('should create order with correct price if isPond is BASIC', async () => {
      const req = {
        body: {
          isPond: 'BASIC',
          totalPond: 0
        },
        user: {
          id: 'user-id',
          email: 'user@example.com'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const expectedInvoice = {
        id: 'invoice-id',
        external_id: 'invoice-shrimPro-id-123456789',
        amount: 0,
        payer_email: 'user@example.com',
        description: 'invoice for ShrimPro',
        invoice_url: 'https://invoice.xendit.com/invoice-url'
      };
      const expectedOrder = {
        totalPrice: 0,
        user: 'user-id',
        status: 'PENDING',
        invoice: 'https://invoice.xendit.com/invoice-url'
      };
      Xendit.getXenditInvoice = jest.fn().mockResolvedValue(expectedInvoice);
      Order.create = jest.fn().mockResolvedValue(expectedOrder);

      await PaymentController.createInvoice(req, res);

      expect(Xendit.getXenditInvoice).toHaveBeenCalledWith({
        external_id: expect.stringContaining('invoice-shrimPro-id-'),
        amount: 0,
        payer_email: 'user@example.com',
        description: 'invoice for ShrimPro'
      });
      expect(Order.create).toHaveBeenCalledWith(expectedOrder);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedInvoice);
    });

    it('should create order with correct price if isPond is BASIC and totalPond is 3', async () => {
      const req = {
        body: {
          isPond:       'BASIC',
          totalPond: 3
        },
        user: {
          id: 'user-id',
          email: 'user@example.com'
        }
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      const expectedInvoice = {
        id: 'invoice-id',
        external_id: 'invoice-shrimPro-id-123456789',
        amount: 30000,
        payer_email: 'user@example.com',
        description: 'invoice for ShrimPro',
        invoice_url: 'https://invoice.xendit.com/invoice-url'
      };
      const expectedOrder = {
        totalPrice: 30000,
        user: 'user-id',
        status: 'PENDING',
        invoice: 'https://invoice.xendit.com/invoice-url'
      };
      Xendit.getXenditInvoice = jest.fn().mockResolvedValue(expectedInvoice);
      Order.create = jest.fn().mockResolvedValue(expectedOrder);
    
      await PaymentController.createInvoice(req, res);
    
      expect(Xendit.getXenditInvoice).toHaveBeenCalledWith({
        external_id: expect.stringContaining('invoice-shrimPro-id-'),
        amount: 30000,
        payer_email: 'user@example.com',
        description: 'invoice for ShrimPro'
      });
      expect(Order.create).toHaveBeenCalledWith(expectedOrder);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedInvoice);
    });
    
  });
});


