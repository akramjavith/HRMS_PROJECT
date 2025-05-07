const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reasonmasterSchema = new Schema({
  categoryreason: {
    type: [String],
    required: false,
  },
  subcategoryreason: {
    type: [String],
    required: false,
  },
  subsubcategoryreason: {
    type: [String],
    required: false,
  },
  typereason: {
    type: String,
    required: false,
  },
  namereason: {
    type: String,
    required: false,
  },
  // today: {
  //     type: String,
  //     required: false,
  // },

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
module.exports = mongoose.model("Reasonmaster", reasonmasterSchema);
