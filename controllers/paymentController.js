const Xendit = require("xendit-node");

const xendit = new Xendit({
  secretKey: process.env.API_XENDIT
});

const { Invoice, Payout } = xendit;
const invoiceSpecificOptions = {};
const payoutSpecificOptions = {};
const i = new Invoice(invoiceSpecificOptions);
const p = new Payout(payoutSpecificOptions);

class PaymentController {
  static createInvoice(req, res, next) {
    let idPayout = "invoice-shrimPro-id-" + new Date().getTime().toString(); //
    let { totalPond } = req.body; //ditangkap dari client
    let amount = +req.body.amount; // ditangkap dari client
    if (!amount) throw { name: "AmountRequired" };

    // TEST
    let isPond = 'POND BESAR'
    let totalPrice = 0

    if (isPond === 'POND BESAR') {
      totalPrice = 100000 + totalPond * 10000
    } else {
      totalPrice = totalPond * 10000
    }

    i.createInvoice({
      externalID: idPayout,
      payerEmail: req.user.email,
      description: "ShrimPro",
      amount: amount, // amount kan penjumlahan (subscribe&device). berarti amount dibuat dari client-side. jangan dihardcode supaya dinamis 
      // ini nama itemnya ada apa aja (array of object)
      items: [
        {
          name: "Device IOT",
          quantity: totalPond,
          price: totalPrice,
          url: "https://yourcompany.com/example_item",
        },
      ],

      //Ini fee buat handle IOT
      fees: [
        {
          name: "Handling Fee",
          amount: 5000,
        },
      ],
    })
      .then((response) => {


        // KALO BERHASIL, maka :
        // RUBAH isSubscribe to TRUE
        // UPDATE PAYMENT to SUCCESS
        // UPDATE totalPond ke DB

        // ELSE (GAGAL)
        // PAYMENT = FAILED

        res.status(200).json(response);


      })
      .catch((err) => {
        next(err);
      });
  }

  static createPayout(req, res, next) {
    let idPayout = "invoice-shrimPro-id-" + new Date().getTime().toString(); //
    let amount = +req.body.amount; // ditangkap dari client
    p.createPayout({
      externalID: idPayout,
      amount: amount,
      payerEmail: req.user.email,
    }).then((response) => {
      console.log(response);
    });
  }
}
module.exports = PaymentController;
