const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const unitrateSchema = new Schema({
  project: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  subcategory: {
    type: String,
    required: false,
  },
  orate: {
    type: String,
    required: false,
  },
  oratelog: [
    {
      date: {
        type: String,
        required: false,
      },
      dateval: {
        type: String,
        required: false,
      },
      orate: {
        type: String,
        required: false,
      },
      trate: {
        type: String,
        required: false,
      },
      filefrom: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      vendor: {
        type: String,
        required: false,
      },
      filename: {
        type: String,
        required: false,
      },
    },
  ],
  mrate: {
    type: String,
    required: false,
  },
  trate: {
    type: String,
    required: false,
  },
  conversion: {
    type: String,
    required: false,
  },
  points: {
    type: String,
    required: false,
  },
  flagcount: {
    type: String,
    required: false,
  },
  flagstatus: {
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
      filename: {
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
      filename: {
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
unitrateSchema.index({ project: 1, subcategory: 1, category: 1 });
module.exports = mongoose.model("unitrate", unitrateSchema);
