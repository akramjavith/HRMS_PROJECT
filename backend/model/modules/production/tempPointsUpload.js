const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const tempPointsUploadSchema = new Schema({
  uploaddata: [
    {
      name: {
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
  date: {
    type: String,
    required: false,
  },
  document: [
    {
      data: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      preview: {
        type: String,
        required: false,
      },
      remark: {
        type: String,
        required: false,
      },
    },
  ],
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
tempPointsUploadSchema.index({ "uploaddata.date": 1 })
module.exports = mongoose.model("tempPoints", tempPointsUploadSchema);
