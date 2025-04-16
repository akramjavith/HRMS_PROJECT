const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OtherPaymentSchema = new Schema({
  vendorgrouping: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  branchname: {
    type: String,
    required: false,
  },
  headname: {
    type: String,
    required: false,
  },
  purpose: {
    type: String,
    required: false,
  },
  billno: {
    type: String,
    required: false,
  },
  vendor: {
    type: String,
    required: false,
  },
  gstno: {
    type: String,
    required: false,
  },
  billdate: {
    type: String,
    required: false,
  },
  receiptdate: {
    type: String,
    required: false,
  },
  dueamount: {
    type: Number,
    required: false,
  },
  accountname: {
    type: String,
    required: false,
  },
  bankname: {
    type: String,
    required: false,
  },
  paidthrough: {
    type: String,
    required: false,
  },
  ifsccode: {
    type: String,
    required: false,
  },
  accountholdername: {
    type: String,
    required: false,
  },
  referenceno: {
    type: String,
    required: false,
  },
  vendorfrequency: {
    type: String,
    required: false,
  },
  vendorid: {
    type: String,
    required: false,
  },
  source: {
    type: String,
    required: false,
  },
  paidstatus: {
    type: String,
    required: false,
  },

  bankname: {
    type: String,
    required: false,
  },
  bankbranchname: {
    type: String,
    required: false,
  },
  accountholdername: {
    type: String,
    required: false,
  },
  accountnumber: {
    type: String,
    required: false,
  },
  ifsccode: {
    type: String,
    required: false,
  },
  upinumber: {
    type: String,
    required: false,
  },
  cardnumber: {
    type: String,
    required: false,
  },
  cardholdername: {
    type: String,
    required: false,
  },
  cardtransactionnumber: {
    type: String,
    required: false,
  },
  cardtype: {
    type: String,
    required: false,
  },
  cardmonth: {
    type: String,
    required: false,
  },
  cardyear: {
    type: String,
    required: false,
  },
  cardsecuritycode: {
    type: String,
    required: false,
  },
  chequenumber: {
    type: String,
    required: false,
  },
  cash: {
    type: String,
    required: false,
  },
  expensecategory: {
    type: String,
    required: false,
  },
  expensesubcategory: {
    type: String,
    required: false,
  },
  billstatus: {
    type: String,
    required: false,
  },
  billsdocument: [
    {
      base64: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      preview: {
        type: String,
        required: false,
      },
      size: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
    },
  ],
  receiptdocument: [
    {
      base64: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      preview: {
        type: String,
        required: false,
      },
      size: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
    },
  ],
  addedby: [
    {
      name: {
        type: String,
        required: false,
      },
      date: {
        type: String,
        required: false,
      },
    },
  ],
  updatedby: [
    {
      name: {
        type: String,
        required: false,
      },
      date: {
        type: String,
        required: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("otherpayments", OtherPaymentSchema);