const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const controlcriteriaSchema = new Schema({
  graceminute: {
    type: String,
    required: false,
  },
  clockouthours: {
    type: String,
    required: false,
  },
  latepermonth: {
    type: String,
    required: false,
  },
  reduces: { 
    type: String,
    required: false,
  },
  morethenthat: {
    type: String,
    required: false,
  },
  permessionhours: {
    type: String,
    required: false,
  },
  blockdaylop: {
    type: String,
    required: false,
  },
  nottoputleave: {
    type: Boolean,
    required: false,
  },
  // nottoputleave:{
  //     type:Boolean,
  //     required: false
  // },
  // deduction:{
  //     type:Boolean,
  //     required: false
  // },
  notleaveintraing: {
    type: Boolean,
    required: false,
  },
  uninformedleave: {
    type: Boolean,
    required: false,
  },
  numberdays: {
    type: String,
    required: false,
  },
  noticeperiodemployee: {
    type: Boolean,
    required: false,
  },
  monday: {
    type: Boolean,
    required: false,
  },
  tuesday: {
    type: Boolean,
    required: false,
  },
  wednesday: {
    type: Boolean,
    required: false,
  },
  thursday: {
    type: Boolean,
    required: false,
  },
  friday: {
    type: Boolean,
    required: false,
  },
  saturday: {
    type: Boolean,
    required: false,
  },
  days: [String],
  // releivingdays: {
  //     type: String,
  //     required: false,
  // },
  // releivingdays: [
  //     {
  //         monday: {
  //             type: String,
  //             required: false,
  //         },
  //         tuesday: {
  //             type: String,
  //             required: false,
  //         },
  //         wednesday: {
  //             type: String,
  //             required: false,
  //         },
  //         thursday: {
  //             type: String,
  //             required: false,
  //         },
  //         friday: {
  //             type: String,
  //             required: false,
  //         },
  //         saturday: {
  //             type: String,
  //             required: false,
  //         },

  //     }],

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
module.exports = mongoose.model("Control Criteria", controlcriteriaSchema);
