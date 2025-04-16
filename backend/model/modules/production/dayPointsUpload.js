const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const dayPointsUploadSchema = new Schema({
  uploaddata: [
    {
      name: {
        type: String,
        required: false,
      },
      fromtodate: {
        type: String,
        required: false,
      },
      empcode: {
        type: String,
        required: false,
      },
      companyname: {
        type: String,
        required: false,
      },
      processcode: {
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
      date: {
        type: String,
        required: false,
      },
      dateval: {
        type: String,
        required: false,
      },
      exper: {
        type: String,
        required: false,
      },
      target: {
        type: String,
        required: false,
      },
      weekoff: {
        type: String,
        required: false,
      },
      conshiftpoints: {
        type: String,
        required: false,
      },
      shiftsts: {
        type: String,
        required: false,
      },
      shiftpoints: {
        type: String,
        required: false,
      },
      production: {
        type: String,
        required: false,
      },
      manual: {
        type: String,
        required: false,
      },
      nonproduction: {
        type: String,
        required: false,
      },
      point: {
        type: String,
        required: false,
      },
      users: {
        type: [String],
        required: false,
      },
      allowancepoint: {
        type: String,
        required: false,
      },
      nonallowancepoint: {
        type: String,
        required: false,
      },
      avgpoint: {
        type: Number,
        required: false,
      },
    },
  ],
  filename: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  date: {
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
dayPointsUploadSchema.index({ "uploaddata.date": 1 })
dayPointsUploadSchema.index({ date: 1 })
module.exports = mongoose.model("dayPoints", dayPointsUploadSchema);