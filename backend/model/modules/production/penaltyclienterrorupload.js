const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const penaltyclientamountUploadSchema = new Schema({
  uploaddata: [
    {
      name: {
        type: String,
        required: false,
      },
      empcode: {
        type: String,
        required: false,
      },
      clientamount: {
        type: String,
        required: false,
      },
      wavieramount: {
        type: String,
        required: false,
      },
      totalamount: {
        type: String,
        required: false,
      },
    },
  ],
  filename: {
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
  document: [
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
module.exports = mongoose.model("Penaltyclientamount", penaltyclientamountUploadSchema);
