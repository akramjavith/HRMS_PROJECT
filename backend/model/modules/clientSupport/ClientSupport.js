const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const clientSupportSchema = new Schema({
  autoid: {
    type: String,
    required: false,
  },
  mode: {
    type: String,
    required: false,
  },

  priority: {
    type: String,
    required: false,
  },
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

  status: {
    type: String,
    required: false,
  },

  category: {
    type: String,
    required: false,
  },
  subcategory: {
    type: String,
    required: false,
  },

  clientdetails: [
    {
      autoid: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      mobilenumber: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
      url: {
        type: String,
        required: false,
      },
    },
  ],

  createdby: [
    {
      dbid: {
        type: String,
        required: false,
      },
      username: {
        type: String,
        required: false,
      },
      company: {
        type: String,
        required: false,
      },
      mobilenumber: {
        type: String,
        required: false,
      },
      email: {
        type: String,
        required: false,
      },
    },
  ],

  closedby: [
    {
      dbid: {
        type: String,
        required: false,
      },
      username: {
        type: String,
        required: false,
      },
      closereason: {
        type: String,
        required: false,
      },
      closedAt: {
        type: String,
        required: false,
      },
      closedfiles: [
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
    },
  ],

  raisetodo: [
    {
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
      document: {
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
module.exports = mongoose.model("ClientSupport", clientSupportSchema);
