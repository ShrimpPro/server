const Xendit = require('../lib/xendit');
const axios = require('axios');

jest.mock('axios');

describe('Xendit', () => {
  describe('getXenditInvoice', () => {
    const mockResponse = { id: 'INV123' };
    const body = {
      external_id: 'invoice-shrimPro-id-' + new Date().getTime().toString(),
      amount: 100000,
      payer_email: 'john@example.com',
      description: `invoice for ${"ShrimPro"}`,
    };
    const headers = {
      Authorization: `Basic ${process.env.API_XENDIT} `,
      Authorization2: `Basic ${process.env.CALLBACK_XENDIT}`,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return invoice data when API returns success', async () => {
      axios.mockResolvedValueOnce({ data: mockResponse });

      const result = await Xendit.getXenditInvoice(body);

      expect(axios).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.xendit.co/v2/invoices',
        data: body,
        headers,
      });
      expect(result).toEqual(mockResponse);
    });

    it('should return error message when API returns error', async () => {
      const errorMessage = 'Error message';
      axios.mockRejectedValueOnce({
        response: {
          data: {
            error_code: 'INVALID_EXTERNAL_ID',
            message: errorMessage,
          },
        },
      });

      try {
        await Xendit.getXenditInvoice(body);
      } catch (error) {
        expect(axios).toHaveBeenCalledWith({
          method: 'POST',
          url: 'https://api.xendit.co/v2/invoices',
          data: body,
          headers,
        });
        expect(error.message).toEqual(errorMessage);
      }
    });
  });
});
