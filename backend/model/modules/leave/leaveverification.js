const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const LeaveVerificationSchema = new Schema({
  companyfrom: {
    type: String,
    required: false,
  },
  branchfrom: {
    type: [String],
    required: false,
  },
  unitfrom: {
    type: [String],
    required: false,
  },
  teamfrom: {
    type: [String],
    required: false,
  },

  employeenamefrom: {
    type: [String],
    required: false,
  },
  type: {
    type: [String],
    required: false,
  },
  companyto: {
    type: String,
    required: false,
  },
  branchto: {
    type: [String],
    required: false,
  },
  unitto: {
    type: [String],
    required: false,
  },
  teamto: {
    type: [String],
    required: false,
  },

  employeenameto: {
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
module.exports = mongoose.model("LeaveVerification", LeaveVerificationSchema);