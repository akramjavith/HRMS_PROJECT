const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PageModelSchema = new Schema({
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
  pagetypename: {
    type: String,
    required: false,
  },
  pagetype: {
    type: String,
    required: false,
  },
  mainpage: {
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
  estimationtype: {
    type: String,
    required: false,
  },
  estimationtime: {
    type: String,
    required: false,
  },
  pageBranch: {
    type: String,
    required: false,
  },
  taskassignboardliststatus: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  sameascheckbox: {
    type: Boolean,
    required: false,
  },
  allotedstatus: {
    type: Boolean,
    required: false,
  },
  uploadpbi: [
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
  uidesign: [
    {
      subcomponent: {
        type: String,
        required: false,
      },
      subEstType: {
        type: String,
        required: false,
      },
      subEstTime: {
        type: String,
        required: false,
      },
      idval: {
        type: String,
        required: false,
      },
      edit: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: false,
      },
      todo: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      datafetch: {
        type: String,
        required: false,
      },
      existingoption: {
        type: String,
        required: false,
      },
      inputvalue: {
        type: String,
        required: false,
      },
      sizeheight: {
        type: String,
        required: false,
      },
      sizewidth: {
        type: String,
        required: false,
      },
      colour: {
        type: String,
        required: false,
      },
      direction: {
        type: String,
        required: false,
      },
      position: {
        type: String,
        required: false,
      },
      refCode: {
        type: String,
        required: false,
      },
      refDetails: {
        type: String,
        required: false,
      },
      refLinks: {
        type: String,
        required: false,
      },

      refImage: [
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
      refDocuments: [
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
    },
  ],
  develop: [
    {
      subcomponent: {
        type: String,
        required: false,
      },
      subEstType: {
        type: String,
        required: false,
      },
      subEstTime: {
        type: String,
        required: false,
      },
      idval: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: false,
      },
      edit: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },

      datafetch: {
        type: String,
        required: false,
      },
      existingoption: {
        type: String,
        required: false,
      },
      inputvalue: {
        type: String,
        required: false,
      },

      refCode: {
        type: String,
        required: false,
      },
      refDetails: {
        type: String,
        required: false,
      },
      refLinks: {
        type: String,
        required: false,
      },
      refImage: [
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
      refDocuments: [
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
    },
  ],
  testing: [
    {
      subcomponent: {
        type: String,
        required: false,
      },
      subEstType: {
        type: String,
        required: false,
      },
      subEstTime: {
        type: String,
        required: false,
      },
      idval: {
        type: String,
        required: false,
      },
      todo: {
        type: String,
        required: false,
      },
      edit: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      datafetch: {
        type: String,
        required: false,
      },

      existingoption: {
        type: String,
        required: false,
      },
      inputvalue: {
        type: String,
        required: false,
      },

      refCode: {
        type: String,
        required: false,
      },
      refDetails: {
        type: String,
        required: false,
      },
      refLinks: {
        type: String,
        required: false,
      },
      refImage: [
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
      refDocuments: [
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
    },
  ],
  testinguidesign: [
    {
      subcomponent: {
        type: String,
        required: false,
      },
      subEstType: {
        type: String,
        required: false,
      },
      subEstTime: {
        type: String,
        required: false,
      },
      idval: {
        type: String,
        required: false,
      },
      todo: {
        type: String,
        required: false,
      },
      edit: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: false,
      },

      name: {
        type: String,
        required: false,
      },
      datafetch: {
        type: String,
        required: false,
      },
      existingoption: {
        type: String,
        required: false,
      },
      inputvalue: {
        type: String,
        required: false,
      },

      refCode: {
        type: String,
        required: false,
      },
      refDetails: {
        type: String,
        required: false,
      },
      refLinks: {
        type: String,
        required: false,
      },
      refImage: [
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
      refDocuments: [
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
module.exports = mongoose.model("PageModel", PageModelSchema);
