const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductionTempSchema = new Schema({



  datetimezone: {
    type: String,
    required: false,
  },
  vendor: {
    type: String,
    required: false,
  },
  fromdate: {
    type: String,
    required: false,
  },
  todate: {
    type: String,
    required: false,
  },
  sheetnumber: {
    type: String,
    required: false,
  },
  datedrop: {
    type: String,
    required: false,
  },
  monthdrop: {
    type: String,
    required: false,
  },
  yeardrop: {
    type: String,
    required: false,
  },
  symboldrop: {
    type: String,
    required: false,
  },
  hoursdrop: {
    type: String,
    required: false,
  },
  uniqueid: {
    type: Number,
    required: false,
  },
  overallcount: {
    type: String,
    required: false,
  },
  percent: {
    type: String,
    required: false,
  },
  createddate: {
    type: String,
    required: false,
  },


  addedby: [
    {
      name: {
        type: String,
        required: false,
      },
      companyname: {
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
module.exports = mongoose.model("ProductionTemp", ProductionTempSchema);