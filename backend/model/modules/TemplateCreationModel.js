const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const templateCreationSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  tempaltemode: {
    type: String,
    required: false,
  },
  tempcode: {
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
  pagemode:{
    type: String,
    required: false,
  },
  pageformat: {
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
  seal: {
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
module.exports = mongoose.model("templateCreation", templateCreationSchema);