const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const wavierpercentageSchema = new Schema({
  fromdate: {
    type: String,
    required: false,
  },
  todate: {
    type: String,
    required: false,
  },
  projectvendor: {
    type: String,
    required: false,
  },
  queuename: {
    type: String,
    required: false,
  },
  loginid: {
    type: String,
    required: false,
  },
  percentage: {
    type: String,
    required: false,
  },
  filename: {
    type: String,
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
module.exports = mongoose.model("wavierpercentage", wavierpercentageSchema);