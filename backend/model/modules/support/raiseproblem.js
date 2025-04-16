const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const raiseSchema = new Schema({
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

  category: {
    type: String,
    required: false,
  },
  subcategory: {
    type: String,
    required: false,
  },

  createdby: {
    type: String,
    required: false,
  },
  createdbycompany: {
    type: String,
    required: false,
  },
  createdbyemail: {
    type: String,
    required: false,
  },
  createdbycontactnumber: {
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

  status: {
    type: String,
    required: false,
  },

  detailsneeded: {
    type: String,
    required: false,
  },

  closedby: {
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
module.exports = mongoose.model("Raise", raiseSchema);
