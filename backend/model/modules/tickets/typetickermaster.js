const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const TypeticketmasterSchema = new Schema({
  typename: {
    type: String,
    required: false,
  },
  department: {
    type: String,
    required: false,
  },
  action: {
    type: String,
    required: false,
  },
  naturetype: {
    type: String,
    required: false,
  },

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
module.exports = mongoose.model("typeticketmaster", TypeticketmasterSchema);
