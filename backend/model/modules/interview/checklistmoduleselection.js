const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const checklistmoduleSchema = new Schema({


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
module.exports = mongoose.model("checklistmoduleselection", checklistmoduleSchema);