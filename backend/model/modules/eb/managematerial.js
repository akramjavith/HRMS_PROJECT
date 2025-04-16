const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const managematerialSchema = new Schema({
  materialname: {
    type: String,
    required: false,
  },
  unitperhour: {
    type: String,
    required: false,
  },
  totalminutes: {
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
module.exports = mongoose.model("Managematerial", managematerialSchema);