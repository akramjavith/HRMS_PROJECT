const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const IpMasterSchema = new Schema({
  categoryname: {
    type: String,
    required: false,
  },
  subcategoryname: {
    type: String,
    required: false,
  },
  ipaddress: {
    type: String,
    required: false,
  },
  ipdetails: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  subnet: {
    type: String,
    required: false,
  },
  gateway: {
    type: String,
    required: false,
  },
  dns1: {
    type: String,
    required: false,
  },
  dns2: {
    type: String,
    required: false,
  },
  dns3: {
    type: String,
    required: false,
  },
  dns4: {
    type: String,
    required: false,
  },
  dns5: {
    type: String,
    required: false,
  },
  available: {
    type: String,
    required: false,
  },
  starting: {
    type: String,
    required: false,
  },
  ending: {
    type: String,
    required: false,
  },
  ipsecsecretpassword: {
    type: String,
    required: false,
  },

  ipconfig: [
    {
      categoryname: {
        type: String,
        required: false,
      },
      subcategoryname: {
        type: String,
        required: false,
      },
      ipaddress: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
      ipdetails: {
        type: String,
        required: false,
      },
      subnet: {
        type: String,
        required: false,
      },
      gateway: {
        type: String,
        required: false,
      },
      dns1: {
        type: String,
        required: false,
      },
      company: {
        type: [String],
        required: false,
      },
      branch: {
        type: [String],
        required: false,
      },
      unit: {
        type: [String],
        required: false,
      },
      team: {
        type: [String],
        required: false,
      },
      employeename: {
        type: String,
        required: false,
      },
      assignedthrough: {
        type: String,
        required: false,
      },
      floor: {
        type: String,
        required: false,
      },
      location: {
        type: String,
        required: false,
      },
      assetmaterial: {
        type: String,
        required: false,
      },
      assetmaterialcode: {
        type: String,
        required: false,
      },
      area: {
        type: String,
        required: false,
      },
      status: {
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
IpMasterSchema.index({ "ipconfig.company": 1, "ipconfig.branch": 1 })
module.exports = mongoose.model("ipMaster", IpMasterSchema);
