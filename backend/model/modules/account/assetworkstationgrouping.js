const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AssetworkgrpSchema = new Schema({
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
  floor: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  area: {
    type: String,
    required: false,
  },
  assetmaterial: {
    type: String,
    required: false,
  },
  component: {
    type: [String],
    required: false,
  },
  assetmaterialcheck: {
    type: String,
    required: false,
  },
  workstation: {
    type: String,
    required: false,
  },
  assetmaterialcheck: {
    type: String,
    required: false,
  },
  subcomponents: {
    type: [String],
    required: false,
  },
  uniqueid: {
    type: Number,
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
module.exports = mongoose.model("Assetworkgrp", AssetworkgrpSchema);