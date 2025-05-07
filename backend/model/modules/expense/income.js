const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const incomeSchema = new Schema({
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
  paymentmode: {
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
  modeDrop: {
    type: String,
    required: false,
  },
  notes: {
    type: String,
    required: false,
  },
  amount: {
    type: Number,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  sortdate: {
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
module.exports = mongoose.model("Income", incomeSchema);
