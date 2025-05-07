const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listPageAccessModeSchema = new Schema({
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
  listpageaccessmode: {
    type: String,
    required: false,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("listpageaccessmode", listPageAccessModeSchema);
