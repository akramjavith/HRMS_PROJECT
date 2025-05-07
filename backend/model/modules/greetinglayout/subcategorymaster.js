const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const subcategorymasterSchema = new Schema({
  categoryname: {
    type: String,
    required: false,
  },
  subcategoryname: [String],
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
module.exports = mongoose.model("Subcategorymaster", subcategorymasterSchema);