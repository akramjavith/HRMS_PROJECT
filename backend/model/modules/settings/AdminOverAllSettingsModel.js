const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const adminOverAllSettingsSchema = new Schema({
  overalltwofaswitch: {
    type: Boolean,
    required: false,
  },
  iprestrictionswitch: {
    type: Boolean,
    required: false,
  },
  mobilerestrictionswitch: {
    type: Boolean,
    required: false,
  },
  companykeyproducts: {
    type: Boolean,
    required: false,
  },
  hiconnectapikey: {
    type: String,
    required: false,
  },
  emaildomain: {
    type: String,
    required: false,
  },

  hiconnecturl: {
    type: String,
    required: false,
  },
  jobapplydays: {
    type: Number,
    required: false,
  },
  contactemail: {
    type: String,
    required: false,
  },
  loginapprestriction: {
    type: String,
    required: false,
  },
  externalloginapprestriction: {
    type: String,
    required: false,
  },
  bothloginapprestriction: {
    type: String,
    required: false,
  },
  companyawards: {
    type: Boolean,
    required: false,
  },
  jobrequirements: {
    type: Boolean,
    required: false,
  },
  jorolesresponsibility: {
    type: Boolean,
    required: false,
  },
  jobperks: {
    type: Boolean,
    required: false,
  },
  chatboxlink: {
    type: String,
    required: false,
  },
  companyname: {
    type: String,
    required: false,
  },
  todos: [
    {
      company: {
        type: String,
        required: false,
      },
      branch: {
        type: [String],
        required: false,
      },
      empcodedigits: {
        type: String,
        required: false,
      },
    },
  ],
  companylogo: {
    type: String,
    required: false,
  },
  companydescription: {
    type: String,
    required: false,
  },
  repeatinterval: {
    type: Number,
    required: false,
  },
  emaildescription: {
    type: String,
    required: false,
  },
  subjectname: {
    type: String,
    required: false,
  },
  allkeyproducts: [String],
  allawardsrecognitions: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },

  loginrestrictionswitch: {
    type: Boolean,
    required: false,
  },
  autologoutswitch: {
    type: Boolean,
    required: false,
  },
  autologoutmins: {
    type: String,
    required: false,
  },
  empdigits: {
    type: Boolean,
    required: false,
  },
  empcodedigits: {
    type: String,
    required: false,
  },
  rolesandres: {
    type: String,
    required: false,
  },
  jobrequirementsAdd: {
    type: String,
    required: false,
  },
  jobbenefits: {
    type: String,
    required: false,
  },
  shiftstart: {
    type: String,
    required: false,
  },
  shiftend: {
    type: String,
    required: false,
  },
  advanceapprovalmonth: {
    type: String,
    required: false,
  },
  loanapprovalmonth: {
    type: String,
    required: false,
  },
  careerimg: {
    type: String,
    required: false,
  },
  bdaycompanylogo: {
    type: String,
    required: false,
  },
  bdayfootertext: {
    type: String,
    required: false,
  },
  bdaywishes: {
    type: String,
    required: false,
  },
  internalurl: {
    type: [String],
    required: false,
  },
  externalurl: {
    type: [String],
    required: false,
  },
  loginmode: {
    type: String,
    required: false,
  },
  listpageaccessmode: {
    type: String,
    required: false,
  },
  
  watermark: {
    type: String,
    required: false,
  },
  opacitywatermark: {
    type: Number,
    default: 0.05,
  },
  opacitytextwatermark: {
    type: String,
    default: "Semi-transparent (20% visible)",
  },
  colorsandfonts: {
    navbgcolour: {
      type: String,
      default: "#1976d2",
    },
    navfontcolour: {
      type: String,
      default: "#ffffff",
    },
    companylogobfcolour: {
      type: String,
      default: "#1976d2",
    },
    submitbgcolour: {
      type: String,
      default: "#1976d2",
    },
    submitfontcolour: {
      type: String,
      default: "#ffffff",
    },
    clearcancelbgcolour: {
      type: String,
      default: "#f4f4f4",
    },
    clearcancelfontcolour: {
      type: String,
      default: "#444",
    },
    bulkdeletebgcolour: {
      type: String,
      default: "#d32f2f",
    },
    bulkdeletefontcolour: {
      type: String,
      default: "#ffffff",
    },
    editiconcolour: {
      type: String,
      default: "#1976d2",
    },
    deleteiconcolour: {
      type: String,
      default: "#1976d2",
    },
    viewiconcolour: {
      type: String,
      default: "#1976d2",
    },
    infoiconcolour: {
      type: String,
      default: "#1976d2",
    },
    pageheadingfontsize: {
      type: String,
      default: "medium",
    },
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
  "adminOverAllSettings",
  adminOverAllSettingsSchema
);