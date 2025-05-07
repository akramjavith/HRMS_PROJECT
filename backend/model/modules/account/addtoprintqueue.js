const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AddtoprintqueueSchema = new Schema({
  company: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  ebusage: {
    type: String,
    required: false,
  },
  unit: {
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
  area: {
    type: String,
    required: false,
  },
  workstation: {
    type: String,
    required: false,
  },

  department: {
    type: String,
    required: false,
  },
  workcheck: {
    type: Boolean,
    required: false,
  },
  responsibleteam: {
    type: String,
    required: false,
  },
  responsibleperson: {
    type: String,
    required: false,
  },

  asset: {
    type: String,
    required: false,
  },
  material: {
    type: String,
    required: false,
  },
  code: {
    type: String,
    required: false,
  },
  countquantity: {
    type: String,
    required: false,
  },
  materialcountcode: {
    type: String,
    required: false,
  },
  count: {
    type: String,
    required: false,
  },
  rate: {
    type: String,
    required: false,
  },
  overallrate: {
    type: Boolean,
    required: false,
  },

  warranty: {
    type: String,
    required: false,
  },
  estimation: {
    type: String,
    required: false,
  },
  vendorid: {
    type: String,
    require: false,
  },
  phonenumber: {
    type: String,
    require: false,
  },
  address: {
    type: String,
    require: false,
  },
  estimationtime: {
    type: String,
    required: false,
  },
  warrantycalculation: {
    type: String,
    required: false,
  },
  purchasedate: {
    type: String,
    required: false,
  },
  vendor: {
    type: String,
    required: false,
  },
  customercare: {
    type: String,
    required: false,
  },
  stockcode: {
    type: String,
    required: false,
  },
  assettype: {
    type: String,
    required: false,
  },
  component: {
    type: String,
    required: false,
  },
  team: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  labelstatus: {
    type: String,
    required: false
},
  ticketid: {
    type: String,
    required: false,
  },
  assignedthrough: {
    type: String,
    required: false,
  },
  repairproblem: {
    type: String,
    required: false,
  },
  subcomponent: [
    {
      sub: {
        type: String,
        required: false,
      },
      subname: {
        type: String,
        required: false,
      },
      type: {
        type: String,
        required: false,
      },
      model: {
        type: String,
        required: false,
      },
      size: {
        type: String,
        required: false,
      },
      variant: {
        type: String,
        required: false,
      },

      brand: {
        type: String,
        required: false,
      },

      serial: {
        type: String,
        required: false,
      },
      other: {
        type: String,
        required: false,
      },
      capacity: {
        type: String,
        required: false,
      },
      hdmiport: {
        type: String,
        required: false,
      },
      vgaport: {
        type: String,
        required: false,
      },
      dpport: {
        type: String,
        required: false,
      },
      usbport: {
        type: String,
        required: false,
      },
      paneltypescreen: {
        type: String,
        required: false,
      },
      resolution: {
        type: String,
        required: false,
      },
      connectivity: {
        type: String,
        required: false,
      },
      daterate: {
        type: String,
        required: false,
      },
      compatibledevice: {
        type: String,
        required: false,
      },
      outputpower: {
        type: String,
        required: false,
      },
      collingfancount: {
        type: String,
        required: false,
      },
      clockspeed: {
        type: String,
        required: false,
      },
      core: {
        type: String,
        required: false,
      },
      speed: {
        type: String,
        required: false,
      },
      frequency: {
        type: String,
        required: false,
      },
      output: {
        type: String,
        required: false,
      },
      ethernetports: {
        type: String,
        required: false,
      },
      distance: {
        type: String,
        required: false,
      },
      lengthname: {
        type: String,
        required: false,
      },
      slot: {
        type: String,
        required: false,
      },
      noofchannels: {
        type: String,
        required: false,
      },
      colours: {
        type: String,
        required: false,
      },
      warranty: {
        type: String,
        required: false,
      },
      estimation: {
        type: String,
        required: false,
      },
      vendorid: {
        type: String,
        require: false,
      },
      phonenumber: {
        type: String,
        require: false,
      },
      address: {
        type: String,
        require: false,
      },
      estimationtime: {
        type: String,
        required: false,
      },
      warrantycalculation: {
        type: String,
        required: false,
      },
      purchasedate: {
        type: String,
        required: false,
      },
      vendor: {
        type: String,
        required: false,
      },
      code: {
        type: String,
        required: false,
      },
      countquantity: {
        type: String,
        required: false,
      },
      rate: {
        type: String,
        required: false,
      },
    },
  ],
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
module.exports = mongoose.model("Addtoprintqueue", AddtoprintqueueSchema);