const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const manageothertaskSchema = new Schema({
  project: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  duetime: {
    type: String,
    required: false,
  },
  subcategory: {
    type: String,
    required: false,
  },
  total: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  time: {
    type: String,
    required: false,
  },
  assignedby: {
    type: String,
    required: false,
  },
  assignedmode: {
    type: String,
    required: false,
  },
  ticket: {
    type: String,
    required: false,
  },
  documentstext: {
    type: String,
    required: false
  },
  document: [
    {
      preview: {
        type: String,
        required: false
      },
      name: {
        type: String,
        required: false
      },
      data: {
        type: String,
        required: false
      },
      remark: {
        type: String,
        required: false
      }

    }
  ],
  duedate:{
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
module.exports = mongoose.model("Manageothertask", manageothertaskSchema);