const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const checklisttypeSchema = new Schema({
  typename: {
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

  createdAt: {
    type: Date,
    default: Date.now,
  },
  checklist: {
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
  details: {
    type: String,
    required: false,
  },
  information: {
    type: String,
    required: false,
  },
  module: {
    type: String,
    required: false,
  },
  submodule: {
    type: String,
    required: false,
  },
  mainpage: {
    type: String,
    required: false,
  },
  subpage: {
    type: String,
    required: false,
  },
  subsubpage: {
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
module.exports = mongoose.model("checklisttype", checklisttypeSchema);