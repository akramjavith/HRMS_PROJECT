const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MyCreationSchema = new Schema({
  type: {
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
  username: {
    type: String,
    required: false,
  },
  files: [
    {
      data: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      preview: {
        type: String,
        required: false,
      },
      remark: {
        type: String,
        required: false,
      },
    },
  ],

  password: {
    type: String,
    required: false,
  },
  employeedbid: {
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
module.exports = mongoose.model("myCreation", MyCreationSchema);
