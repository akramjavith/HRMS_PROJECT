const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const MaintentanceSchema = new Schema({
  company: {
    type: String,
    required: false,
  },
  schedulestatus: {
    type: String,
    required: false,
  },
  assetmaterialcode: {
    type: [String],
    require: false,
  },
  taskassign: {
    type: String,
    required: false,
  },
  needvendor: {
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
  location: {
    type: String,
    required: false,
  },
  area: {
    type: String,
    required: false,
  },

  companyto: {
    type: String,
    required: false,
  },
  branchto: {
    type: [String],
    required: false,
  },
  unitto: {
    type: [String],
    required: false,
  },
  teamto: {
    type: [String],
    required: false,
  },

  employeenameto: {
    type: [String],
    required: false,
  },


  equipment: {
    type: String,
    required: false,
  },
  maintenancedetails: {
    type: String,
    required: false,
  },
  frequency: {
    type: String,
    require: false,
  },
  taskstatus: {
    type: String,
    require: false,
  },
  taskdetails: {
    type: String,
    require: false,
  },
  created: {
    type: String,
    required: false,
  },
  taskassigneddate: {
    type: String,
    required: false,
  },

  taskdate: {
    type: String,
    required: false,
  },
  tasktime: {
    type: String,
    required: false,
  },
  priority: {
    type: String,
    required: false,
  },
  schedule: {
    type: String,
    required: false,
  },
  maintenancedate: {
    type: String,
    required: false,
  },
  maintenancetime: {
    type: String,
    require: false,
  },
  resdepartment: {
    type: String,
    required: false,
  },
  resteam: {
    type: String,
    require: false,
  },
  resperson: {
    type: String,
    require: false,
  },
  fromdate: {
    type: String,
    require: false,
  },
  todate: {
    type: String,
    require: false,
  },
  vendorgroup: {
    type: String,
    require: false,
  },
  vendor: {
    type: String,
    require: false,
  },
  vendorid: {
    type: String,
    require: false,
  },
  address: {
    type: String,
    require: false,
  },
  phone: {
    type: String,
    require: false,
  },
  emailid: {
    type: String,
    required: false,
  },
  phonenumberone: {
    type: String,
    required: false,
  },
  assetmaterial: {
    type: String,
    require: false,
  },
  assetmaterialcheck: {
    type: String,
    require: false,
  },
  employee: {
    type: String,
    require: false,
  },

  description: {
    type: String,
    required: false,
  },

  duration: {
    type: String,
    required: false,
  },
  breakup: {
    type: String,
    required: false,
  },
  breakupcount: {
    type: String,
    required: false,
  },
  // schedule: {
  //     type: String,
  //     required: false,
  // },
  required: {
    type: [String],
    required: false,
  },




  documentfiles: [
    {
      data: {
        type: String,
        required: false
      },
      name: {
        type: String,
        required: false
      },
      preview: {
        type: String,
        required: false
      },
      remark: {
        type: String,
        required: false
      },

    }
  ],
  maintenancelog: [
    {
      company: {
        type: String,
        required: false,
      },
      schedulestatus: {
        type: String,
        required: false,
      },
      taskassign: {
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
      location: {
        type: String,
        required: false,
      },
      area: {
        type: String,
        required: false,
      },
      assetmaterial: {
        type: String,
        require: false,
      },
      assetmaterialcode: {
        type: [String],
        require: false,
      },
      maintenancedetails: {
        type: String,
        required: false,
      },
      date: {
        type: String,
        required: false,
      },
    }
  ],

  timetodo: [
    {
      hour: {
        type: String,
        required: false,
      },
      min: {
        type: String,
        required: false,
      },
      timetype: {
        type: String,
        required: false,
      },
    }
  ],
  monthdate: {
    type: String,
    required: false,
  },
  weekdays: {
    type: [String],
    required: false,
  },
  datewise: {
    type: String,
    required: false,
  },
  annumonth: {
    type: String,
    required: false,
  },
  annuday: {
    type: String,
    required: false,
  },
  remark: [
    {
      equipmentname: {
        type: String,
        require: false,
      },
      remarkdate: {
        type: String,
        require: false,
      },
      nextdate: {
        type: String,
        require: false,
      },
      nexttime: {
        type: String,
        require: false,
      },
      remarkaddress: {
        type: String,
        require: false,
      },
      state: {
        type: String,
        require: false,
      },
      country: {
        type: String,
        require: false,
      },
      city: {
        type: String,
        require: false,
      },
      // address: {
      //   type: String,
      //   require: false,
      // },
      pincode: {
        type: String,
        require: false,
      },
      pincode: {
        type: String,
        require: false,
      },
      // ip: {
      //   type: String,
      //   require: false,
      // },
      longitude: {
        type: String,
        require: false,
      },
      latitude: {
        type: String,
        require: false,
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
      imagelocationfiles: [
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

MaintentanceSchema.index({ company: 1, branch: 1, unit: 1, assetmaterial: 1 })


module.exports = mongoose.model("Maintenance", MaintentanceSchema);
