const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const IndividualSettingsSchema = new Schema({
  company: {
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
  companyname: {
    type: [String],
    required: false,
  },
  twofaswitch: {
    type: Boolean,
    required: false,
  },
  loginapprestriction: {
    type: String,
    required: false,
  },
  externalloginapprestriction: {
    type: String,
    required: false,
  },
  bothloginapprestriction: {
    type: String,
    required: false,
  },
  ipswitch: {
    type: Boolean,
    required: false,
  },
  mobileipswitch: {
    type: Boolean,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  loginipswitch: {
    type: Boolean,
    required: false,
  },
  internalurl: {
    type: [String],
    required: false,
  },
  externalurl: {
    type: [String],
    required: false,
  },
  loginmode: {
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
});
module.exports = mongoose.model("IndividualSettings", IndividualSettingsSchema);