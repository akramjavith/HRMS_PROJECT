const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const duedatemasterSchema = new Schema({
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
  type: {
    type: String,
    required: false,
  },
  reason: {
    type: String,
    required: false,
  },
  sector: {
    type: String,
    required: false,
  },
  priority: {
    type: String,
    required: false,
  },
  estimation: {
    type: String,
    required: false,
  },

  estimationtime: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("DuedatemasterSchema", duedatemasterSchema);
