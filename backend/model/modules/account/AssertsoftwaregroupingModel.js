const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AssertsoftwaregroupingSchema = new Schema({
  material: {
    type: String,
    required: false,
  },
  bulkselect: {
    type: Boolean,
    required: false,
  },
  remoteaccesssoftware: {
    type: Boolean,
    required: false,
  },
  applicationname: {
    type: Boolean,
    required: false,
  },
  operatingsystem: {
    type: Boolean,
    required: false,
  },
  webbrowser: {
    type: Boolean,
    required: false,
  },
  devicedrivers: {
    type: Boolean,
    required: false,
  },
  productivitysoftware: {
    type: Boolean,
    required: false,
  },
  cloudcomputingsoftware: {
    type: Boolean,
    required: false,
  },
  communicationsoftware: {
    type: Boolean,
    required: false,
  },
  developmentsoftware: {
    type: Boolean,
    required: false,
  },
  databasemanagementsoftware: {
    type: Boolean,
    required: false,
  },
  securitysoftware: {
    type: Boolean,
    required: false,
  },
  networksoftware: {
    type: Boolean,
    required: false,
  },
  printersoftware: {
    type: Boolean,
    required: false,
  },
  multimediasoftware: {
    type: Boolean,
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
module.exports = mongoose.model("assetsoftwaregrouping", AssertsoftwaregroupingSchema);
