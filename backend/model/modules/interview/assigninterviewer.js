const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const assigninterviewerSchema = new Schema({
  fromcompany: {
    type: [String],
    required: false,
  },
  frombranch: {
    type: [String],
    required: false,
  },
  fromunit: {
    type: [String],
    required: false,
  },
  fromteam: {
    type: [String],
    required: false,
  },
  designation: {
    type: String,
    required: false,
  },
  round: {
    type: [String],
    required: false,
  },
  tocompany: {
    type: String,
    required: false,
  },
  tobranch: {
    type: String,
    required: false,
  },
  tounit: {
    type: String,
    required: false,
  },
  toteam: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  employee: {
    type: [String],
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
module.exports = mongoose.model("Assigninterviewer", assigninterviewerSchema);