const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ErrorUploadSchema = new Schema({

  projectvendor: {
    type: String,
    required: false,
  },
  process: {
    type: String,
    required: false,
  },
  errortype: {
    type: String,
    required: false,
  },
  ismoving: {
    type: String,
    required: false,
  },
  penaltycalculation: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  rate: {
    type: Number,
    required: false,
  },
  addedby: [
    {
      name: {
        type: String,
        required: false,
      },
      companyname:{
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
module.exports = mongoose.model("Errortype", ErrorUploadSchema);