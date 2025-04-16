const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ebuseinstrument = new Schema({
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
  floor: {
    type: String,
    required: false,
  },
  area: {
    type: String,
    required: false,
  },
  location: {
    type: [String],
    required: false,
  },
  servicenumber: {
    type: String,
    required: false,
  },
  materialname: {
    type: String,
    required: false,
  },
  quantity: {
    type: String,
    required: false,
  },
  unitperhour: {
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
module.exports = mongoose.model("EbUseInstrument", ebuseinstrument);
