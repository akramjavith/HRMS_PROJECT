const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const assetworkstationSchema = new Schema({
  categoryname: {
    type: String,
    required: false,
  },
  workstation: {
    type: String,
    required: false,
  },
  speccheck: {
    type: Boolean,
    required: false,
  },
  type: {
    type: Boolean,
    required: false,
  },
  model: {
    type: Boolean,
    required: false,
  },
  size: {
    type: Boolean,
    required: false,
  },
  variant: {
    type: Boolean,
    required: false,
  },
  brand: {
    type: Boolean,
    required: false,
  },
  serial: {
    type: Boolean,
    required: false,
  },
  other: {
    type: Boolean,
    required: false,
  },
  capacity: {
    type: Boolean,
    required: false,
  },
  hdmiport: {
    type: Boolean,
    required: false,
  },
  vgaport: {
    type: Boolean,
    required: false,
  },
  dpport: {
    type: Boolean,
    required: false,
  },
  usbport: {
    type: Boolean,
    required: false,
  },
  paneltypescreen: {
    type: Boolean,
    required: false,
  },
  resolution: {
    type: Boolean,
    required: false,
  },
  connectivity: {
    type: Boolean,
    required: false,
  },
  daterate: {
    type: Boolean,
    required: false,
  },
  compatibledevice: {
    type: Boolean,
    required: false,
  },
  outputpower: {
    type: Boolean,
    required: false,
  },
  collingfancount: {
    type: Boolean,
    required: false,
  },
  clockspeed: {
    type: Boolean,
    required: false,
  },
  core: {
    type: Boolean,
    required: false,
  },
  speed: {
    type: Boolean,
    required: false,
  },
  frequency: {
    type: Boolean,
    required: false,
  },
  output: {
    type: Boolean,
    required: false,
  },
  ethernetports: {
    type: Boolean,
    required: false,
  },

  distance: {
    type: Boolean,
    required: false,
  },
  lengthname: {
    type: Boolean,
    required: false,
  },
  slot: {
    type: Boolean,
    required: false,
  },
  noofchannels: {
    type: Boolean,
    required: false,
  },
  colours: {
    type: Boolean,
    required: false,
  },
  subcategoryname: [
    {
      subcomponent: {
        type: String,
        required: false,
      },
      type: {
        type: Boolean,
        required: false,
      },
      model: {
        type: Boolean,
        required: false,
      },
      size: {
        type: Boolean,
        required: false,
      },
      variant: {
        type: Boolean,
        required: false,
      },
      brand: {
        type: Boolean,
        required: false,
      },
      serial: {
        type: Boolean,
        required: false,
      },
      other: {
        type: Boolean,
        required: false,
      },
      capacity: {
        type: Boolean,
        required: false,
      },
      hdmiport: {
        type: Boolean,
        required: false,
      },
      vgaport: {
        type: Boolean,
        required: false,
      },
      dpport: {
        type: Boolean,
        required: false,
      },
      usbport: {
        type: Boolean,
        required: false,
      },
      resolution: {
        type: Boolean,
        required: false,
      },
      lengthname: {
        type: Boolean,
        required: false,
      },
      paneltypescreen: {
        type: Boolean,
        required: false,
      },
      connectivity: {
        type: Boolean,
        required: false,
      },
      daterate: {
        type: Boolean,
        required: false,
      },
      compatibledevice: {
        type: Boolean,
        required: false,
      },
      outputpower: {
        type: Boolean,
        required: false,
      },
      collingfancount: {
        type: Boolean,
        required: false,
      },
      clockspeed: {
        type: Boolean,
        required: false,
      },
      core: {
        type: Boolean,
        required: false,
      },
      speed: {
        type: Boolean,
        required: false,
      },
      frequency: {
        type: Boolean,
        required: false,
      },
      output: {
        type: Boolean,
        required: false,
      },
      ethernetports: {
        type: Boolean,
        required: false,
      },

      distance: {
        type: Boolean,
        required: false,
      },
      length: {
        type: Boolean,
        required: false,
      },
      slot: {
        type: Boolean,
        required: false,
      },
      noofchannels: {
        type: Boolean,
        required: false,
      },
      colours: {
        type: Boolean,
        required: false,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
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
});
assetworkstationSchema.index({ workstaion: 1 })
module.exports = mongoose.model("assetworkstation", assetworkstationSchema);