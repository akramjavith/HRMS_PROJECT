const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LoanSchema = new Schema({

    loanamount: {
        type: String,
        required: false,
    },
    startyear: {
        type: String,
        required: false,
    },
    month: {
        type: String,
        required: false,
    },
    applieddate: {
        type: String,
        required: false,
    },
    description:{
        type: String,
        require: false,
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


    document: [
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
    tenure: {
        type: String,
        required: false,
    },  
    
    empcode: {
        type: String,
        required: false,
    },  
    companyname: {
        type: String,
        required: false,
    },  
    shifttiming: {
        type: String,
        required: false,
    },  
    status: {
        type: String,
        required: false,
    }, 
    rejectedreason: {
        type: String,
        required: false,
    }, 
    approvedloanstartdate: {
        type: String,
        required: false,
    }, 
    approvedinstallment: {
        type: String,
        required: false,
    }, 
    interestpercent: {
        type: String,
        required: false,
    }, 
    approvedloanamount: {
        type: String,
        required: false,
    }, 
    approvedstartmonth: {
        type: String,
        required: false,
    }, 
    approvedstartyear: {
        type: String,
        required: false,
    }, 
    totalamountpayable: {
        type: String,
        required: false,
    }, 

    emitodo: [
        {
            months: {
            type: String,
            required: false,
          },
          balance: {
            type: String,
            required: false,
          },
          payableAmount: {
            type: String,
            required: false,
          },
          year: {
            type: String,
            required: false,
          },
          loanamount: {
            type: String,
            required: false,
          },
          repaymentprincipalamount: {
            type: String,
            required: false,
          },
          repaymentintrestamount: {
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

        }],
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

        }],
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Loan', LoanSchema);