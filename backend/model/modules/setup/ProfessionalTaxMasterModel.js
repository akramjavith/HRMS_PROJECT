const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const professionalTaxMasterSchema = new Schema({
  company: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  fromamount: {
    type: Number,
    required: false,
  },
  toamount: {
    type: Number,
    required: false,
  }, 
  taxamount: {
    type: Number,
    required: false,
  },
  date: {
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
module.exports = mongoose.model("professionalTaxMaster", professionalTaxMasterSchema);
