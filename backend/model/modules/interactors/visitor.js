const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const VisitorsSchema = new Schema({
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
  visitorid: {
    type: String,
    required: false,
  },
  visitortype: {
    type: String,
    required: false,
  },
  visitormode: {
    type: String,
    required: false,
  },
  date: {
    type: String,
    required: false,
  },
  prefix: {
    type: String,
    required: false,
  },
  visitorname: {
    type: String,
    required: false,
  },
  intime: {
    type: String,
    required: false,
  },
  visitorpurpose: {
    type: String,
    required: false,
  },
  visitorcontactnumber: {
    type: String,
    required: false,
  },
  visitoremail: {
    type: String,
    required: false,
  },
  visitorcompnayname: {
    type: String,
    required: false,
  },
  documenttype: {
    type: String,
    required: false,
  },
  documentnumber: {
    type: String,
    required: false,
  },
  meetingdetails: {
    type: Boolean,
    required: false,
  },
  meetingpersoncompany: {
    type: [String],
    required: false,
  },
  meetingpersonbranch: {
    type: [String],
    required: false,
  },
  meetingpersonunit: {
    type: [String],
    required: false,
  },
  meetingpersondepartment: {
    type: [String],
    required: false,
  },
  meetingpersonteam: {
    type: [String],
    required: false,
  },
  meetingpersonemployeename: {
    type: String,
    required: false,
  },
  meetinglocationcompany: {
    type: [String],
    required: false,
  },
  meetinglocationbranch: {
    type: [String],
    required: false,
  },
  meetinglocationunit: {
    type: [String],
    required: false,
  },
  meetinglocationfloor: {
    type: [String],
    required: false,
  },
  meetinglocationarea: {
    type: String,
    required: false,
  },
  escortinformation: {
    type: Boolean,
    required: false,
  },
  escortdetails: {
    type: String,
    required: false,
  },
  equipmentborrowed: {
    type: String,
    required: false,
  },
  outtime: {
    type: String,
    required: false,
  },
  remark: {
    type: String,
    required: false,
  },
  followupaction: {
    type: String,
    required: false,
  },
  followupdate: {
    type: String,
    required: false,
  },
  followuptime: {
    type: String,
    required: false,
  },
  visitorbadge: {
    type: String,
    required: false,
  },
  visitorsurvey: {
    type: String,
    required: false,
  },
  detailsaddedy: {
    type: String,
    required: false,
  },
  interactorstatus: {
    type: String,
    required: false,
  },
  
 visitorfirstname: {
  type: String,
  required: false,
},
visitorlastname: {
  type: String,
  required: false,
},
visitorcontactnumber: {
  type: String,
  required: false,
},
visitoremail: {
  type: String,
  required: false,
},
visitorwhatsapp: {
  type: String,
  required: false,
},
visitorphonecheck: {
  type: Boolean,
  required: false,
},

addcandidate: {
  type: Boolean,
  required: false,
},
checkout: {
  type: Boolean,
  required: false,
},
unique: {
  type: Number,
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
  followuparray: [
    {

      visitortype: {
        type: String,
        required: false,
      },
      visitormode: {
        type: String,
        required: false,
      },
      intime: {
        type: String,
        required: false,
      },

      visitorpurpose: {
        type: String,
        required: false,
      },
      meetingdetails: {
        type: Boolean,
        required: false,
      },
      meetingpersoncompany: {
        type: [String],
        required: false,
      },
      meetingpersonbranch: {
        type: [String],
        required: false,
      },
      meetingpersonunit: {
        type: [String],
        required: false,
      },
      meetingpersondepartment: {
        type: [String],
        required: false,
      },
      meetingpersonteam: {
        type: [String],
        required: false,
      },
      meetingpersonemployeename: {
        type: String,
        required: false,
      },
      meetinglocationcompany: {
        type: [String],
        required: false,
      },
      meetinglocationbranch: {
        type: [String],
        required: false,
      },
      meetinglocationunit: {
        type: [String],
        required: false,
      },
      meetinglocationfloor: {
        type: [String],
        required: false,
      },
      meetinglocationarea: {
        type: String,
        required: false,
      },
      escortinformation: {
        type: Boolean,
        required: false,
      },
      escortdetails: {
        type: String,
        required: false,
      },
      equipmentborrowed: {
        type: String,
        required: false,
      },
      outtime: {
        type: String,
        required: false,
      },
      remark: {
        type: String,
        required: false,
      },
      followupaction: {
        type: String,
        required: false,
      },
      followupdate: {
        type: String,
        required: false,
      },
      followuptime: {
        type: String,
        required: false,
      },
      visitorbadge: {
        type: String,
        required: false,
      },
      visitorsurvey: {
        type: String,
        required: false,
      },

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
module.exports = mongoose.model("visitors", VisitorsSchema);
