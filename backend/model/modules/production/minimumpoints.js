const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MinimumPointsSchema = new Schema({
  year: {
    type: String,
    required: false,
  },
  month: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  unit: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  empcode: {
    type: String,
    required: false,
  },
  team: {
    type: String,
    required: false,
  },
  department: {
    type: String,
    required: false,
  },
  totalpaiddays: {
    type: String,
    required: false,
  },
  monthpoint: {
    type: String,
    required: false,
  },
  daypoint: {
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
module.exports = mongoose.model("MinimumPoints", MinimumPointsSchema);
