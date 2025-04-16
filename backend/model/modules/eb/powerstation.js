const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const powerstationSchema = new Schema({
  company: {
    type: [String],
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

  name: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  fromtime: {
    type: String,
    required: false,
  },
  totime: {
    type: String,
    required: false,
  },
  totaltime: {
    type: String,
    required: false,
  },
  powershutdowntype: {
    type: String,
    required: false,
  },
  messagereceivedfrom: {
    type: String,
    required: false,
  },
  personname: {
    type: String,
    required: false,
  },
  reason: {
    type: String,
    required: false,
  },
  applicablefor: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  postponddate: {
    type: String,
    required: false,
  },
  postpondfromtime: {
    type: String,
    required: false,
  },
  postpondtotime: {
    type: String,
    required: false,
  },
  postpondtotaltime: {
    type: String,
    required: false,
  },
  cancelreason: {
    type: String,
    required: false,
  },
  noofdays: {
    type: Number,
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
module.exports = mongoose.model("Powerstation", powerstationSchema);
