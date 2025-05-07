const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const HirerarchiSchema = new Schema({
  company: {
    type: String,
    required: false,
  },
  designationgroup: {
    type: String,
    required: false,
  },
  department: {
    type: String,
    required: false,
  },
  empcode: {
    type: String,
    required: false,
  },
  empbranch: {
    type: String,
    required: false,
  },
  empunit: {
    type: String,
    required: false,
  },
  empteam: {
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
  team: {
    type: String,
    required: false,
  },
  supervisorchoose: {
    type: [String],
    required: false,
  },
  pagecontrols: {
    type: [String],
    required: false,
  },
  mode: {
    type: String,
    required: false,
  },
  level: {
    type: String,
    required: false,
  },
  control: {
    type: String,
    required: false,
  },
  employeename: {
    type: [String],
    required: false,
  },
  action: {
    type: Boolean,
    required: false,
  },
  access: {
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
module.exports = mongoose.model("Hirerarchi", HirerarchiSchema);