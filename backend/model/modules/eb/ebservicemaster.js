const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ebservicemasterSchema = new Schema({
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
  floor: {
    type: String,
    required: false,
  },
  area: {
    type: [String],
    required: false,
  },
  vendor: {
    type: String,
    required: false,
  },
  servicenumber: {
    type: String,
    required: false,
  },
  servicedate: {
    type: String,
    required: false,
  },
 startdate: {
        type: String,
        required: false,
      },
  kwrs: {
    type: String,
    required: false,
  },
  openkwh: {
    type: String,
    required: false,
  },
  powerfactorpenality: {
    type: String,
    required: false,
  },
  kvah: {
    type: String,
    required: false,
  },
  sectionid: {
    type: String,
    required: false,
  },
  sectionname: {
    type: String,
    required: false,
  },
  contractedload: {
    type: String,
    required: false,
  },
  powerfactor: {
    type: String,
    required: false,
  },
  metertype: {
    type: String,
    required: false,
  },
  billmonth: {
    type: String,
    required: false,
  },
  allowedunit: {
    type: String,
    required: false,
  },
  allowedunitmonth: {
    type: String,
    required: false,
  },
  maxdem: {
    type: String,
    required: false,
  },  
  tax: {
    type: String,
    required: false,
  },
  phase: {
    type: String,
    required: false,
  },  
  tariff: {
    type: String,
    required: false,
  },
  name: {
    type: String,
    required: false,
  },
  region: {
    type: String,
    required: false,
  },
  circle: {
    type: String,
    required: false,
  },
  distribution: {
    type: String,
    required: false,
  },
  number: {
    type: String,
    required: false,
  },
  address: {
    type: String,
    required: false,
  },
  meternumber: {
    type: String,
    required: false,
  },
  servicecategory: {
    type: String,
    required: false,
  },
  sdavailable: {
    type: String,
    required: false,
  },
  sdrefund: {
    type: String,
    required: false,
  },
  mcdavailable: {
    type: String,
    required: false,
  },
  mcdrefund: {
    type: String,
    required: false,
  },
  powerfactor: {
    type: String,
    required: false,
  },
  billperiod: {
    type: String,
    required: false,
  },
  metertype: {
    type: String,
    required: false,
  },
  renewalpenalty: {
    type: String,
    required: false,
  }, 
  ebservicepurposes: {
    type: String,
    required: false,
  }, 
  rentalcontact: {
    type: String,
    required: false,
  }, 
  selectCTtypes: {
    type: String,
    required: false,
  }, 
  solars: {
    type: String,
    required: false,
  }, 
  weldings: {
    type: String,
    required: false,
  }, 
  billingcycles: {
    type: String,
    required: false,
  }, 
  status: {
    type: String,
    required: false,
  }, 
  nickname: {
    type: String,
    required: false,
  }, 
  tenentname: {
    type: String,
    required: false,
  }, 
  rentaladdress: {
    type: String,
    required: false,
  }, 
  servicelog:[
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
      floor: {
        type: String,
        required: false,
      },
      area: {
        type: [String],
        required: false,
      },
      vendor: {
        type: String,
        required: false,
      },
      servicenumber: {
        type: String,
        required: false,
      },
      servicedate: {
        type: String,
        required: false,
      },
startdate: {
        type: String,
        required: false,
      },
enddate: {
        type: String,
        required: false,
      },
      kwrs: {
        type: String,
        required: false,
      },
      openkwh: {
        type: String,
        required: false,
      },
      powerfactorpenality: {
        type: String,
        required: false,
      },
      kvah: {
        type: String,
        required: false,
      },
      sectionid: {
        type: String,
        required: false,
      },
      sectionname: {
        type: String,
        required: false,
      },
      contractedload: {
        type: String,
        required: false,
      },
      powerfactor: {
        type: String,
        required: false,
      },
      metertype: {
        type: String,
        required: false,
      },
      billmonth: {
        type: String,
        required: false,
      },
      allowedunit: {
        type: String,
        required: false,
      },
      allowedunitmonth: {
        type: String,
        required: false,
      },
      maxdem: {
        type: String,
        required: false,
      },  
      tax: {
        type: String,
        required: false,
      },
      phase: {
        type: String,
        required: false,
      },  
      tariff: {
        type: String,
        required: false,
      },
      name: {
        type: String,
        required: false,
      },
      region: {
        type: String,
        required: false,
      },
      circle: {
        type: String,
        required: false,
      },
      distribution: {
        type: String,
        required: false,
      },
      number: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      meternumber: {
        type: String,
        required: false,
      },
      servicecategory: {
        type: String,
        required: false,
      },
      sdavailable: {
        type: String,
        required: false,
      },
      sdrefund: {
        type: String,
        required: false,
      },
      mcdavailable: {
        type: String,
        required: false,
      },
      mcdrefund: {
        type: String,
        required: false,
      },
      powerfactor: {
        type: String,
        required: false,
      },
      billperiod: {
        type: String,
        required: false,
      },
      metertype: {
        type: String,
        required: false,
      },
      renewalpenalty: {
        type: String,
        required: false,
      }, 
      ebservicepurposes: {
        type: String,
        required: false,
      }, 
      rentalcontact: {
        type: String,
        required: false,
      }, 
      selectCTtypes: {
        type: String,
        required: false,
      }, 
      solars: {
        type: String,
        required: false,
      }, 
      weldings: {
        type: String,
        required: false,
      }, 
      billingcycles: {
        type: String,
        required: false,
      }, 
      status: {
        type: String,
        required: false,
      }, 
      nickname: {
        type: String,
        required: false,
      }, 
      tenentname: {
        type: String,
        required: false,
      }, 
      rentaladdress: {
        type: String,
        required: false,
      }, 
      changedusername:{
        type: String,
        required: false,
      },
      date: {
        type: Date,
        default: Date.now,
      }
    }
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
module.exports = mongoose.model("Ebservicemaster", ebservicemasterSchema);

