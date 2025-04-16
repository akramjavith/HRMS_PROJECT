const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const cardpreparationSchema = new Schema({
  date: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  department: {
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
  person: {
    type: [String],
    required: false,
  },
  compinfo:{type: String,
    required: false,
  },
  idcardfrontheader:  [
    {
        preview: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: false
        },
        data: {
            type: String,
            required: false
        },
        remark: {
            type: String,
            required: false
        }

    }
],
idcardfrontfooter:  [
    {
        preview: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: false
        },
        data: {
            type: String,
            required: false
        },
        remark: {
            type: String,
            required: false
        }

    }
],
idcardbackheader:  [
    {
        preview: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: false
        },
        data: {
            type: String,
            required: false
        },
        remark: {
            type: String,
            required: false
        }

    }
],
idcardbackfooter:  [
    {
        preview: {
            type: String,
            required: false
        },
        name: {
            type: String,
            required: false
        },
        data: {
            type: String,
            required: false
        },
        remark: {
            type: String,
            required: false
        }

    }
  ],
  add:{
    type: String,
    required: false,
  },
  comp:{
    type: String,
    required: false,
  },
  comurl:{
    type: String,
    required: false,
  },
 
  idcard: [{
    company: {
      type: String,
      required: false,
    },
    department: {
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
    firstname: {
      type: String,
      required: false,
    },
    lastname: {
      type: String,
      required: false,
    },
    callingname: {
      type: String,
      required: false,
    },
    legalname: {
      type: String,
      required: false,
    },
    profileimage: {
      type: String,
      required: false,
    },
    dob: {
      type: String,
      required: false,
    },
    bloodgroup: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    emergencyno: {
      type: String,
      required: false,
    },
    pdoor: {
      type: String,
      required: false,
    },
    pstreet: {
      type: String,
      required: false,
    },
    parea: {
      type: String,
      required: false,
    },
    plandmark: {
      type: String,
      required: false,
    },
    pcountry: {
      type: String,
      required: false,
    },
    cpincode: {
      type: String,
      required: false,
    },
    ccity: {
      type: String,
      required: false,
    },
   
    empcode: {
      type: String,
      required: false,
    },
    company: {
      type: String,
      required: false,
    },
  }],
  
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
module.exports = mongoose.model("idcardpreparation", cardpreparationSchema);