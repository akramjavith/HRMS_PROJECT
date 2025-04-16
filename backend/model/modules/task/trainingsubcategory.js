const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const trainingsubcategorySchema = new Schema({
  subcategoryname: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  duration: {
    type: String,
    required: false,
  },

  documentslist: [{
    name: {
      type: String,
      required: false
    },
    document: {
      type: [String],
      required: false
    },
    files: [
      {
        data: {
          type: String,
          required: false
        },
        name: {
          type: String,
          required: false
        },
        preview: {
          type: String,
          required: false
        },
        remark: {
          type: String,
          required: false
        },

      }
    ],
  }],

  module: {
    type: String,
    required: false,
  },
  customer: {
    type: String,
    required: false,
  },
  process: {
    type: String,
    required: false,
  },
  queue: {
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
module.exports = mongoose.model("Trainingsubcategory", trainingsubcategorySchema);
