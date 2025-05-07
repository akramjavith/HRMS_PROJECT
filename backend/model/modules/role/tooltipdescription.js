const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const toolDescSchema = new Schema({
  
  modulename: {
    type: String,
    required: false,
  },
  submodulename: {
    type: String,
    required: false,
  },
  mainpagename: {
    type: String,
    required: false,
  },
  subpagename: {
    type: String,
    required: false,
  },
  subsubpagename: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("tooldescription", toolDescSchema);