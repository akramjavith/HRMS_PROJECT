const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const penaltydayUploadSchema = new Schema({
  uploaddata: [
    {
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
      team: {
        type: String,
        required: false,
      },
      processcode: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      empcode: {
        type: String,
        required: false,
      },
      date: {
        type: String,
        required: false,
      },
      vendorname: {
        type: String,
        required: false,
      },
      process: {
        type: String,
        required: false,
      },
      totalfield: {
        type: String,
        required: false,
      },
      autoerror: {
        type: String,
        required: false,
      },
      manualerror: {
        type: String,
        required: false,
      },
      uploaderror: {
        type: String,
        required: false,
      },
      moved: {
        type: String,
        required: false,
      },
      notupload: {
        type: String,
        required: false,
      },
      penalty: {
        type: String,
        required: false,
      },
      nonpenalty: {
        type: String,
        required: false,
      },
      bulkupload: {
        type: String,
        required: false,
      },
      bulkkeying: {
        type: String,
        required: false,
      },
      edited1: {
        type: String,
        required: false,
      },
      edited2: {
        type: String,
        required: false,
      },
      edited3: {
        type: String,
        required: false,
      },
      edited4: {
        type: String,
        required: false,
      },
      reject1: {
        type: String,
        required: false,
      },
      reject2: {
        type: String,
        required: false,
      },
      reject3: {
        type: String,
        required: false,
      },
      reject4: {
        type: String,
        required: false,
      },
      notvalidate: {
        type: String,
        required: false,
      },
      validateerror: {
        type: String,
        required: false,
      },
      waivererror: {
        type: String,
        required: false,
      },
      neterror: {
        type: String,
        required: false,
      },
      per: {
        type: String,
        required: false,
      },
      percentage: {
        type: String,
        required: false,
      },
      amount: {
        type: String,
        required: false,
      },
    },
  ],
  type: {
    type: String,
    required: false,
  },
  filename: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  document: [
    {
      data: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      preview: {
        type: String,
        required: false,
      },
      remark: {
        type: String,
        required: false,
      },
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
module.exports = mongoose.model("Penaltydayupload", penaltydayUploadSchema);
