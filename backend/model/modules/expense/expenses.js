const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ExpenseSchema = new Schema({
  company: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  unit: {
    type: String,
    required: false,
  },
  purpose: {
    type: String,
    required: false,
  },
  referenceno: {
    type: String,
    required: false,
  },
  vendorname: {
    type: String,
    required: false,
  },
  vendorgrouping: {
    type: String,
    required: false,
  },
  expansecategory: {
    type: String,
    required: false,
  },
  expansesubcategory: {
    type: String,
    required: false,
  },
  totalbillamount: {
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
  date: {
    type: String,
    required: false,
  },
  duedate: {
    type: String,
    required: false,
  },
  sortdate: {
    type: String,
    required: false,
  },
  expansenote: {
    type: String,
    required: false,
  },
  paidstatus: {
    type: String,
    required: false,
  },
  paidmode: {
    type: String,
    required: false,
  },
  paidamount: {
    type: Number,
    required: false,
  },
  balanceamount: {
    type: Number,
    required: false,
  },
  expensetotal: {
    type: String,
    required: false,
  },
  billstatus: {
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



  tododetails: [
    {
      particularmode: {
        type: String,
        required: false,
      },
      category: {
        type: String,
        required: false,
      },
      subcategory: {
        type: String,
        required: false,
      },
      itemname: {
        type: String,
        required: false,
      },
      uom: {
        type: String,
        required: false,
      },
      rate: {
        type: String,
        required: false,
      },
      quantity: {
        type: String,
        required: false,
      },
      amount: {
        type: String,
        required: false,
      },
    },
  ],
  files: [
    {
      data: {
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
      remark: {
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
module.exports = mongoose.model("Expenses", ExpenseSchema);
