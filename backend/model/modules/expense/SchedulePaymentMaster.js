const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SchedulePaymentMasterSchema = new Schema({
  company: {
    type: String,
    required: false,
  },
  branch: {
    type: String,
    required: false,
  },
  purpose: {
    type: String,
    required: false,
  },

  vendor: {
    type: String,
    required: false,
  },
  vendorgrouping: {
    type: String,
    required: false,
  },
  gstno: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: false,
  },
  vendorid: {
    type: String,
    required: false,
  },

  expensecategory: {
    type: String,
    required: false,
  },
  expensesubcategory: {
    type: String,
    required: false,
  },

  frequency: {
    type: String,
    required: false,
  },

  //day wise and weekly
  daywiseandweeklydays: {
    type: [String],
    required: false,
  },

  //date wise and monthly
  datewiseandmonthlydate: {
    type: String,
    required: false,
  },

  billstatus: {
    type: String,
    required: false,
  },
  duedays: {
    type: String,
    required: false,
  },

  //anually
  annuallymonth: {
    type: String,
    required: false,
  },
  annuallyday: {
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
  createdAt: {
    type: Date,
    default: Date.now,
  },

  statuslog: [
    {
      company: {
        type: String,
        required: false,
      },
      branch: {
        type: String,
        required: false,
      },
      purpose: {
        type: String,
        required: false,
      },

      vendor: {
        type: String,
        required: false,
      },
      gstno: {
        type: String,
        required: false,
      },
      status: {
        type: String,
        required: false,
      },
      vendorid: {
        type: String,
        required: false,
      },

      expensecategory: {
        type: String,
        required: false,
      },
      expensesubcategory: {
        type: String,
        required: false,
      },

      frequency: {
        type: String,
        required: false,
      },
      duedays: {
        type: String,
        required: false,
      },

      //day wise and weekly
      daywiseandweeklydays: {
        type: [String],
        required: false,
      },

      //date wise and monthly
      datewiseandmonthlydate: {
        type: String,
        required: false,
      },

      //anually
      annuallymonth: {
        type: String,
        required: false,
      },
      annuallyday: {
        type: String,
        required: false,
      },

      logchangedby: [
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
    },
  ],
});
module.exports = mongoose.model(
  "SchedulePaymentMaster",
  SchedulePaymentMasterSchema
);