const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductionClientRateSchema = new Schema({

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
  rate: {
    type: Number,
    required: false,
  },
  addedby: [
    {
      name: {
        type: String,
        required: false,
      },
      companyname:{
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
module.exports = mongoose.model("productionclientrate", ProductionClientRateSchema);