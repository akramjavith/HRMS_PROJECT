const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const penaltywaivermasterSchema = new Schema({

    department: {
    type: String,
    required: false, 
  },
  year: {
    type: String,
    required: false,
  },
  monthname: {
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
  company: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  processcode: {
    type: String,
    required: false,
  },
  process: {
    type: String,
    required: false,
  },
  employee: {
    type: String,
    required: false,
  },
  waiverallowupto: {
    type: Number,
    required: false,
  },
  waiveramountupto: {
    type: Number,
    required: false,
  },
  waiverpercentageupto: {
    type: Number,
    required: false,
  },
  clienterrocountupto: {
    type: Number,
    required: false,
  },
  clienterroramount: {
    type: Number,
    required: false,
  },
  clienterrorpercentage: {
    type: Number,
    required: false,
  },
  validitydays: {
    type: Number,
    required: false,
  },


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
module.exports = mongoose.model("Penaltywaivermaster", penaltywaivermasterSchema);