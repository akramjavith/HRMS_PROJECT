const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const areagroupingSchema = new Schema({
  branch: {
    type: String,
    required: false,
  },
  floor: {
    type: String,
    required: false,
  },
  locationareastatus: {
    type: Boolean,
    required: false,
  },
  boardingareastatus: {
    type: Boolean,
    required: false,
  },
  area: {
    type: [String],
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  unit: {
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
module.exports = mongoose.model("Areagrouping", areagroupingSchema);
