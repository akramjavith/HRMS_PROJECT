const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const companydomainSchema = new Schema({
  company: {
    type: String,
    required: false,
  },
  assignedname: {
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
module.exports = mongoose.model("Companydomain", companydomainSchema);