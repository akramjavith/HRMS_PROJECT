const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ManagestockitemsSchema = new Schema({
    stockcategory: {
    type: String,
    required: false,
  },
  stocksubcategory: {
    type: String,
    required: false,
  },
  itemname: {
    type: String,
    required: false,
  },
  uom: {
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
module.exports = mongoose.model("Managestockitems", ManagestockitemsSchema);
