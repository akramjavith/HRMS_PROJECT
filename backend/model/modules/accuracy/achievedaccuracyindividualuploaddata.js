const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AchievedAccuracyIndividualUploaddataSchema = new Schema({
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

  commonid: {
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
module.exports = mongoose.model("achievedaccuracyindividualuploaddata", AchievedAccuracyIndividualUploaddataSchema);
