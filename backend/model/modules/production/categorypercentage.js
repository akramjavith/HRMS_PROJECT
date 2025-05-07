const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ManagecategorypercentageSchema = new Schema({

  projectvendor: {
    type: String,
    required: false,
  },
  process: {
    type: String,
    required: false,
  },
  percentage: {
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
module.exports = mongoose.model("managecategorypercentage", ManagecategorypercentageSchema);