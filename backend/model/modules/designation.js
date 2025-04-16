const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DesignationSchema = new Schema({
  branch: {
    type: String,
    required: false,
  },
  group: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  noticeperiodfrom: {
    type: String,
    require: false,
  },
  noticeperiodto: {
    type: String,
    require: false,
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
module.exports = mongoose.model("Designation", DesignationSchema);
