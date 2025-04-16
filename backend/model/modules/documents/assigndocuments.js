const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AssignDocumnentSchema = new Schema({
  categoryname: {
    type: [String],
    required: false,
  },
  subcategoryname: {
    type: [String],
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  module: {
    type: String,
    required: false,
  },
  company: {
    type: [String],
    required: false,
  },
  branch: {
    type: [String],
    required: false,
  },
  unit: {
    type: [String],
    required: false,
  },
  team: {
    type: [String],
    required: false,
  },
  employeename: {
    type: [String],
    required: false,
  },
  employeedbid: {
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
module.exports = mongoose.model("AssignDocument", AssignDocumnentSchema);
