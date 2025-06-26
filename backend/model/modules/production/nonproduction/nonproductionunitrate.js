const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NonProductionUnitRateSchema = new Schema({
  categoryname: {
    type: String,
    required: false,
  },
  subcategory: {
    type: String,
    required: false,
  },
  base: {
    type: String,
    required: false,
  },
  process: {
    type: String,
    required: false,
  },
  mindays: {
    type: Number,
    required: false,
  },
  minhours: {
    type: Number,
    required: false,
  },
  minminutes: {
    type: Number,
    required: false,
  },
  maxdays: {
    type: Number,
    required: false,
  },
  maxhours: {
    type: Number,
    required: false,
  },
  maxminutes: {
    type: Number,
    required: false,
  },
  rate: {
    type: Number,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  addedby: [
    {
      name: {
        type: String,
        required: false,
      },
      date: {
        type: Date,
        default: Date.now,
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
        type: Date,
        default: Date.now,
      },
    },
  ],
});
module.exports = mongoose.model('nonproductionunitrate', NonProductionUnitRateSchema);
