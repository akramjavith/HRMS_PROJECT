const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const InteractorPurposeSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  prevprojectname: {
    type: String,
    required: false
  },
  addcandidate: {
    type: Boolean,
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
module.exports = mongoose.model("interactorpurpose", InteractorPurposeSchema);