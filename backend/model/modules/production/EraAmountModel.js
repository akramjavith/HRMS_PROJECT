const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EraAnountSchema = new Schema({
  branch: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  processcode: {
    type: String,
    required: false,
  },
  amount: {
    type: String,
    required: false,
  },
  filename: {
    type: String,
    required: false,
  },
  lastupload: {
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
module.exports = mongoose.model("EraAmount", EraAnountSchema);
