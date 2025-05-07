const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const addexistsallSchema = new Schema({

    // empid: {
    //     type: String,
    //     required: false,
    // },

    empname: {
        type: String,
        required: false,
    },
    today: {
        type: String,
        required: false,
    },
    interviewername: {
        type: String,
        required: false,
    },
    reasonleavingname: {
        type: String,
        required: false,
    },
    workingagainname: {
        type: String,
        required: false,
    },
    mostorganisation: {
        type: String,
        required: false,
    },
    think: {
        type: String,
        required: false,
    },
    anything: {
        type: String,
        required: false,
    },
    companyvechile: {
        type: String,
        required: false,
    },
    allequiment: {
        type: String,
        required: false,
    },
    exitinterview: {
        type: String,
        required: false,
    },
    resignation: {
        type: String,
        required: false,
    }, 
    files: [
        {
            base64: {
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
            size: {
                type: String,
                required: false
            },
            type: {
                type: String,
                required: false
            },
        }
    ],
    security: {
        type: String,
        required: false,
    }, 
    noticeperiod: {
        type: String,
        required: false,
    }, 
    managesupervisor: {
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
module.exports = mongoose.model('Addexistsall', addexistsallSchema);