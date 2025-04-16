const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teamsSchema = new Schema({
  unit: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  teamname: {
    type: String,
    required: false,
  },
  department: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  company: {
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

module.exports = mongoose.model("Teams", teamsSchema);
