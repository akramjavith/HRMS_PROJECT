const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DesignationMonthSetSchema = new Schema({
  designation: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: false,
  },
  month: {
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
  totaldays: {
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
module.exports = mongoose.model("DesignationMonthSet", DesignationMonthSetSchema);
