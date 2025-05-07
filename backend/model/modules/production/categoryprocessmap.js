const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const categoryprocessmapSchema = new Schema({
  company: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  process: {
    type: String,
    required: false,
  },
  project: {
    type: String,
    required: false,
  },
  categoryname: {
    type: String,
    required: false,
  },
  subcategoryname: {
    type: String,
    required: false,
  },
  processtypes: {
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
module.exports = mongoose.model("Categoryprocessmap", categoryprocessmapSchema);