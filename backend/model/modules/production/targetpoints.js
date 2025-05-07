const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const targetPointsSchema = new Schema({
  experience: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  processcode: {
    type: String,
    required: false,
  },
  code: {
    type: String,
    required: false,
  },
  points: {
    type: String,
    required: false,
  },
  filename: {
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
targetPointsSchema.index({ company: 1, branch: 1, processcode: 1 })

module.exports = mongoose.model("targetpoints", targetPointsSchema);
