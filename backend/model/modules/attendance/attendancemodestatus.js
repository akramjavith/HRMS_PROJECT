const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const attendanceModeStatusSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  appliedthrough: {
    type: String,
    required: false,
  },
  lop: {
    type: Boolean,
    required: false,
  },
  loptype: {
    type: String,
    required: false,
  },
  criteria: {
    type: String,
    required: false,
  },
  target: {
    type: Boolean,
    required: false,
  },
  paidleave: {
    type: Boolean,
    required: false,
  },
  paidleavetype: {
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
module.exports = mongoose.model(
  "Attendancemodestatus",
  attendanceModeStatusSchema
);
