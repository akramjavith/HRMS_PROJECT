const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const workStationSchema = new Schema({
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
  floor: {
    type: String,
    required: false,
  },
  area: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  // cabinname: {
  //     type: [String],
  //     required: false,
  // },
  maincabin: {
    type: String,
    required: false,
  },
  combinstation: [
    {
      cabinname: {
        type: String,
        required: false,
      },
      subTodos: [
        {
          idval: {
            type: String,
            required: false,
          },
          subcabinname: {
            type: String,
            required: false,
          },
        },
      ],
    },
  ],

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
module.exports = mongoose.model("workStation", workStationSchema);
