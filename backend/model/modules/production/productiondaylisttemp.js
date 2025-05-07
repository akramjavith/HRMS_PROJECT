const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductionDayListTempSchema = new Schema({
  company: {
    type: String,
    required: false,
  },
  fromtodate: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  flag: {
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
  department: {
    type: String,
    required: false,
  },
  doj: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  filename: {
    type: String,
    required: false,
  },
  empname: {
    type: String,
    required: false,
  },
  empcode: {
    type: String,
    required: false,
  },
  experience: {
    type: String,
    required: false,
  },
  mode: {
    type: String,
    required: false,
  },
  user: {
    type: String,
    required: false,
  },
  unitid: {
    type: String,
    required: false,
  },
  unitrate: {
    type: String,
    required: false,
  },
  dateval: {
    type: String,
    required: false,
  },
  username: {
    type: String,
    required: false,
  },
  project: {
    type: String,
    required: false,
  },
  vendor: {
    type: String,
    required: false,
  },
  processcode: {
    type: String,
    required: false,
  },
  target: {
    type: String,
    required: false,
  },
  points: {
    type: String,
    required: false,
  },
  aprocess: {
    type: String,
    required: false,
  },
  sprocess: {
    type: String,
    required: false,
  },
  shiftpoints: {
    type: String,
    required: false,
  },
  conshiftpoints: {
    type: String,
    required: false,
  },
  avgpoint: {
    type: String,
    required: false,
  },
  shiftsts: {
    type: String,
    required: false,
  },
  contarget: {
    type: String,
    required: false,
  },
  conpoints: {
    type: String,
    required: false,
  },
  conavg: {
    type: String,
    required: false,
  },
  uniqueid: {
    type: Number,
    required: false,
  },
  type: {
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
module.exports = mongoose.model("ProductionDayListTemp", ProductionDayListTempSchema);