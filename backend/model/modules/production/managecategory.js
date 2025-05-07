const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const managecategorySchema = new Schema({
  project: {
    type: String,
    required: false,
  },
  mode: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  subcategory: {
    type: [String],
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  schedule: {
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
module.exports = mongoose.model("Managecategory", managecategorySchema);
