const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const attendanceControlCriteriaSchema = new Schema({
  clockin: {
    type: String,
    required: false,
  },
  clockout: {
    type: String,
    required: false,
  },
  gracetime: {
    type: String,
    required: false,
  },
  lateclockin: {
    type: String,
    required: false,
  },
  earlyclockout: {
    type: String,
    required: false,
  },
  afterlateclockin: {
    type: String,
    required: false,
  },
  beforeearlyclockout: {
    type: String,
    required: false,
  },
  //

  lateclockincount: {
    type: String,
    required: false,
  },
  lateclockinreduces: {
    type: String,
    required: false,
  },
  lateclockinmorethanthat: {
    type: String,
    required: false,
  },

  //

  earlyclockoutcount: {
    type: String,
    required: false,
  },
  earlyclockoutreduces: {
    type: String,
    required: false,
  },
  earlyclockoutmorethanthat: {
    type: String,
    required: false,
  },

  //

  permissionperdayduration: {
    type: String,
    required: false,
  },
  permissionpermonthduration: {
    type: String,
    required: false,
  },
  allowedpermissionreduces: {
    type: String,
    required: false,
  },
  allowedpermissionmorethanthat: {
    type: String,
    required: false,
  },

  //

  leaverespecttoweekoff: {
    type: Boolean,
    required: false,
  },
  leaverespecttotraining: {
    type: Boolean,
    required: false,
  },

  //

  uninformedleave: {
    type: Boolean,
    required: false,
  },
  uninformedleavecount: {
    type: String,
    required: false,
  },

  //

  leavefornoticeperiod: {
    type: Boolean,
    required: false,
  },
  leavefornoticeperiodcount: {
    type: String,
    required: false,
  },

  //
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

  //

  relievingfromdate: {
    type: String,
    required: false,
  },
  relievingtodate: {
    type: String,
    required: false,
  },

  onclockout: {
    type: String,
    required: false,
  },
  earlyclockin: {
    type: String,
    required: false,
  },

  //

  todos: [
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
      team: {
        type: String,
        required: false,
      },
      employeename: {
        type: String,
        required: false,
      },
      employeegracetime: {
        type: String,
        required: false,
      },
      employeeleaverespecttoweekoff: {
        type: Boolean,
        required: false,
      },
      employeedbid: {
        type: String,
        required: false,
      },
    },
  ],
  
  
  calcshiftday: {
    type: String,
    required: false,
  },
  calcshifttimeday: {
    type: String,
    required: false,
  },
  calcshifthourday: {
    type: String,
    required: false,
  },
  calcshiftminday: {
    type: String,
    required: false,
  },



  calcshiftnight: {
    type: String,
    required: false,
  },
  calcshifttimenight: {
    type: String,
    required: false,
  },
  calcshifthournight: {
    type: String,
    required: false,
  },
  calcshiftminnight: {
    type: String,
    required: false,
  },

  dayactive: {
    type: Boolean,
    required: false,
  },
  nightactive: {
    type: Boolean,
    required: false,
  },
  

  //productionentry
  entrystatusHour: {
    type: String,
    required: false,
  },
  entrystatusMin: {
    type: String,
    required: false,
  },
  approvalstatusHour: {
    type: String,
    required: false,
  },
  approvalstatusMin: {
    type: String,
    required: false,
  },

  entrystatusDays: {
    type: String,
    required: false,
  },
  approvalstatusDays: {
    type: String,
    required: false,
  },


  // addedby: [
  //     {
  //         name: {
  //             type: String,
  //             required: false,
  //         },
  //         date: {
  //             type: String,
  //             required: false,
  //         },

  //     }],
  // updatedby: [
  //     {
  //         name: {
  //             type: String,
  //             required: false,
  //         },
  //         date: {
  //             type: String,
  //             required: false,
  //         },

  //     }],
});
module.exports = mongoose.model(
  "attendancecontrolcriteria",
  attendanceControlCriteriaSchema
);