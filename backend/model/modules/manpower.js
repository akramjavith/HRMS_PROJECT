const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const manpowerShema = new Schema({
  branch: {
    type: String,
    required: false,
  },
  floor: {
    type: String,
    required: false,
  },
  area: {
    type: [String],
    required: false,
  },
  seatcount: {
    type: Number,
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
module.exports = mongoose.model("Manpower", manpowerShema);
