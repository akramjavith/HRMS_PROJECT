const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const checklistverificationmasterSchema = new Schema({
  checklisttype: {
    type: [String],
    required: false,
  },
  categoryname: {
    type: String,
    required: false,
  },
  subcategoryname: {
    type: String,
    required: false,
  },
  company: {
    type: [String],
    required: false,
  },
  branch: {
    type: [String],
    required: false,
  },
  unit: {
    type: [String],
    required: false,
  },
  team: {
    type: [String],
    required: false,
  },
  employee: {
    type: [String],
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
module.exports = mongoose.model("Checklistverificationmaster", checklistverificationmasterSchema);