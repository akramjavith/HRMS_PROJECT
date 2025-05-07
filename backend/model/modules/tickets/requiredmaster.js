const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const requiredMaster = new Schema({
  category: {
    type: [String],
    required: false,
  },
  subcategory: {
    type: [String],
    required: false,
  },
  subsubcategory: {
    type: [String],
    required: false,
  },

  overalldetails: [
    {
      details: {
        type: String,
        required: false,
      },
      options: {
        type: String,
        required: false,
      },
      count: {
        type: String,
        required: false,
      },
      raiser: {
        type: Boolean,
        required: false,
      },
      resolver: {
        type: Boolean,
        required: false,
      },
      restriction: {
        type: Boolean,
        required: false,
      },
    },
  ],
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
module.exports = mongoose.model("RequiredMaster", requiredMaster);