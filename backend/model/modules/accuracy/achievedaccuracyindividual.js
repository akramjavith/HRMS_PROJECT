const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AchievedAccuracyIndividualSchema = new Schema({
  uploaddata: [
    {

      date: {
        type: String,
        required: false,
      },
      project: {
        type: String,
        required: false,
      },
      vendor: {
        type: String,
        required: false,
      },
      queue: {
        type: String,
        required: false,
      },
      loginid: {
        type: String,
        required: false
        ,
      },
      accuracy: {
        type: String,
        required: false,
      },
      totalfield: {
        type: String,
        required: false,
      },

    },
  ],

  date: {
    type: String,
    required: false,
  },
  project: {
    type: String,
    required: false,
  },
  vendor: {
    type: String,
    required: false,
  },
  queue: {
    type: String,
    required: false,
  },
  filename: {
    type: String,
    required: false,
  },
  document: [
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
}); AchievedAccuracyIndividualSchema.index({ date: 1 })
module.exports = mongoose.model("achievedaccuracyindividual", AchievedAccuracyIndividualSchema);
