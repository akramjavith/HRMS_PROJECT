const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const assetSpecificationGroupingSchema = new Schema({
  assetmaterial: {
    type: String,
    required: false,
  },
  component: {
    type: String,
    required: false,
  },
  subcomponent: {
    type: String,
    required: false,
  },
  type: {
    type: [String],
    required: false,
  },
  model: {
    type: [String],
    required: false,
  },
  size: {
    type: [String],
    required: false,
  },
  variant: {
    type: [String],
    required: false,
  },
  brand: {
    type: [String],
    required: false,
  },
  capacity: {
    type: [String],
    required: false,
  },
  paneltype: {
    type: [String],
    required: false,
  },
  screenresolution: {
    type: [String],
    required: false,
  },
  connectivity: {
    type: [String],
    required: false,
  },
  datarate: {
    type: [String],
    required: false,
  },
  compatibledevices: {
    type: [String],
    required: false,
  },
  outputpower: {
    type: [String],
    required: false,
  },
  coolingfancount: {
    type: [String],
    required: false,
  },
  clockspeed: {
    type: [String],
    required: false,
  },
  core: {
    type: [String],
    required: false,
  },
  speed: {
    type: [String],
    required: false,
  },
  frequency: {
    type: [String],
    required: false,
  },
  output: {
    type: [String],
    required: false,
  },
  ethernetports: {
    type: [String],
    required: false,
  },
  distance: {
    type: [String],
    required: false,
  },
  lengthname: {
    type: [String],
    required: false,
  },
  slot: {
    type: [String],
    required: false,
  },
  noofchannels: {
    type: [String],
    required: false,
  },
  colours: {
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
module.exports = mongoose.model("assetSpecificationGrouping", assetSpecificationGroupingSchema);
