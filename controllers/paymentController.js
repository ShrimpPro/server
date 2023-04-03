const Xendit = require('../lib/xendit');
const Order = require("../models/order");



// const invoiceSpecificOptions = {};
// const payoutSpecificOptions = {};
// const i = new Invoice(invoiceSpecificOptions);
// const p = new Payout(payoutSpecificOptions);

class PaymentController {
  static async createInvoice(req, res, next) {
    try {
      // dari react native ngirim body isPond 'PREMIUM' | 'BASIC'
      let { isPond, totalPond } = req.body // dari client
      let totalPrice


      if (isPond === 'PREMIUM') {
        totalPrice = 100000 + totalPond * 10000
      } else {
        (totalPond === 0) && (totalPond === 3)
        totalPrice = totalPond * 10000
      }

      const invoice = await Xendit.getXenditInvoice({
        external_id: 'invoice-shrimPro-id-' + new Date().getTime().toString(),
        amount: totalPrice,
        payer_email: req.user.email,
        description: `invoice for ${"ShrimPro"}`,
      })
      // insert ordernya disini
      console.log(invoice)
      await Order.create({
        totalPrice: totalPrice,
        user: req.user.id,
        status: 'PENDING',
        invoice: invoice.invoce_url
      })
      res.status(200).json(invoice)
    } catch (error) {
      next(error)
    }
  }

  // - Update status jika sudah bayar yang premium === Subscribed & device (Pond besar)
  // else sudah bayar !premium & device (Pond Kecil, device maks 3 device)

  static async paid(req, res, next) {
    try {
      let orderId = req.body.orderId
      const currentPaid = await Order.findById(orderId);
      if (!currentPaid) throw { name: 'NotFound' };

      currentPaid.status = 'SUCCESS';
      const updatePaid = await currentPaid.save();
      res.status(200).json(updatePaid);
      // manggil ketika pembayaran sukses setelah deploy
      // status pending dirubah jd success
      // tambahin biar pas udh dibayar, mengurangi serangan hacker 
    } catch (error) {
      console.log(error)
      next(error)
    }
  }

  static async updateStatusOrder(req, res, next) {
    try {
      let x = req.headers["x-callback-token"];
      let { status, paid_amount, id } = req.body;
      if (x !== process.env.XENDIT_X) {
        return res.status(401).json({ message: "You are not authorized" });
      }
      if (status === "PAID") {
        let data = await Order.findOne({ where: { invoice: id } });
        if (!data) {
          return res.status(404).json({ message: "Data not found" });
        }

        if (data.totalPrice !== paid_amount) {
          return res
            .status(400)
            .json({ message: "Paid amount not same with amount" });
        }

        await Order.update({ status: "PAID" }, { where: { invoice: id } });

        return res.status(200).json({ message: "Update to PAID Success" });
      } else if (status === "EXPIRED") {
        let data = await Order.findOne({ where: { invoice: id } });
        let orderProd = await OrderProduct.findAll({
          where: { OrderId: data.id },
        });
        if (!data) {
          return res.status(404).json({ message: "Data not found" });
        }
        let updatedPayment = await Order.update(
          { status: "EXPIRED" },
          { where: { invoice: id } }
        );
        return res.status(200).json({ message: "Update to Expired Success" });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = PaymentController;
