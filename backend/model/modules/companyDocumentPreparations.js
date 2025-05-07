const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const companyDocumentPreparationSchema = new Schema({
  date: {
    type: String,
    required: false,
  },
  qrcode: {
    type: String,
    required: false,
  },
  printingstatus: {
    type: String,
    required: false,
  },
  pagenumberneed: {
    type: String,
    required: false,
  },
  qrCodeNeed: {
    type: Boolean,
    required: false,
  },
  watermark: {
    type: String,
    required: false,
  },
  pagesize: {
    type: String,
    required: false,
  },
  pageheight: {
    type: String,
    required: false,
  },
  pagewidth: {
    type: String,
    required: false,
  },
  template: {
    type: String,
    required: false,
  },
  templateno: {
    type: String,
    required: false,
  },
  document: {
    type: String,
    required: false,
  },
  referenceno: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  tocompany: {
    type: String,
    required: false,
  },
  tocompanyaddress: {
    type: String,
    required: false,
  },
  tocompany: {
    type: String,
    required: false,
  },
  issuingauthority: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  print: {
    type: String,
    required: false,
  },
  proption: {
    type: String,
    required: false,
  },
  pagesize: {
    type: String,
    required: false,
  },
  head: {
    type: String,
    required: false,
  },
  foot: {
    type: String,
    required: false,
  },
  headvalue: {
    type: [String],
    required: false,
  },
  signature: {
    type: String,
    required: false,
  },
  tempcode: {
    type: String,
    required: false,
  },
  sign: {
    type: String,
    required: false,
  },
  sealing: {
    type: String,
    required: false,
  },
  seal: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  mail: {
    type: String,
    required: false,
  },
  issuedpersondetails: {
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
module.exports = mongoose.model("companyDocumentPreparation", companyDocumentPreparationSchema);