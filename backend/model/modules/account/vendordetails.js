const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const VendorDetailsSchema = new Schema({

  vendorid: {
    type: String,
    required: false,
  },
  vendorname: {
    type: String,
    required: false,
  },
  emailid: {
    type: String,
    required: false,
  },
  phonenumber: {
    type: Number,
    required: false,
  },
  phonecheck: {
    type: Boolean,
    required: false,
  },
  whatsappnumber: {
    type: Number,
    required: false,
  },
  contactperson: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  country: {
    type: String,
    required: false,
  },
  state: {
    type: String,
    required: false,
  },
  city: {
    type: String,
    required: false,
  },
  pincode: {
    type: Number,
    required: false,
  },
  landline: {
    type: String,
    required: false,
  },
  creditdays: {
    type: Number,
    required: false,
  },
  gstnumber: {
    type: String,
    required: false,
  },
  modeofpayments: {
    type: [String],
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
  phonenumberone: {
    type: Number,
    required: false,
  },
  phonenumbertwo: {
    type: Number,
    required: false,
  },
  phonenumberthree: {
    type: Number,
    required: false,
  },
  phonenumberfour: {
    type: Number,
    required: false,
  },
  paymentfrequency: {
    type: String,
    required: false,
  },
  vendorstatus: {
    type: String,
    required: false,
  },
  monthlyfrequency: {
    type: String,
    required: false,
  },

  faceDescriptor: [Number],

  files: [
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
module.exports = mongoose.model("VendorDetails", VendorDetailsSchema);
