const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const RaisissueSchema = new Schema({
  project: {
    type: String,
    required: false,
  },
  subproject: {
    type: String,
    required: false,
  },
  module: {
    type: String,
    required: false,
  },
  submodule: {
    type: String,
    required: false,
  },
  pagetypeno: {
    type: String,
    required: false,
  },
  pagetypename: {
    type: String,
    required: false,
  },
  mainpage: {
    type: String,
    required: false,
  },
  raiseissueadded: {
    type: String,
    required: false,
  },
  subpage: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  added: {
    type: String,
    required: false,
  },

  issuedate: {
    type: String,
    required: false,
  },
  ticketno: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  previousid: {
    type: String,
    required: false,
  },
  priority: {
    type: String,
    required: false,
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  files: [
    {
      base64: {
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
      size: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
    },
  ],

  // addissue: [
  //     {
  //         issuedate: {
  //             type: String,
  //             required: false,
  //         },
  //         ticketno: {
  //             type: String,
  //             required: false,
  //         },
  //         status: {
  //             type: String,
  //             required: false,
  //         },
  //         priority: {
  //             type: String,
  //             required: false,
  //         },
  //         title: {
  //             type: String,
  //             required: false,
  //         },
  //         description: {
  //             type: String,
  //             required: false,
  //         },
  //         files: [
  //             {
  //                 base64: {
  //                     type: String,
  //                     required: false
  //                 },
  //                 name: {
  //                     type: String,
  //                     required: false
  //                 },
  //                 preview: {
  //                     type: String,
  //                     required: false
  //                 },
  //                 size: {
  //                     type: String,
  //                     required: false
  //                 },
  //                 type: {
  //                     type: String,
  //                     required: false
  //                 },
  //             }
  //         ],
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
module.exports = mongoose.model("Raiseissue", RaisissueSchema);
