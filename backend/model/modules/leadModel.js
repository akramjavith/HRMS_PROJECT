const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const LeadSchema = new Schema({
    prefix:{
        type: String,
        require: false,
    },
    firstname:{
        type: String,
        required: false,
    },
    lastname:{
        type: String,
        required: false,
    },
    emailid:{
        type: String,
        required: false,
    },
    phonenumber:{
        type: String,
        require: false,
    },
    fax:{
        type: String,
        required: false,
    },
    website:{
        type: String,
        require: false,
    },
    leadsource:{
        type: String,
        required: false,
    },
    leadstatus:{
        type: String,
        require: false,
    },
    industrytype:{
        type: String,
        require: false,
    },
    noofemployee:{
        type: String,
        require: false,
    },
    annualrevenue:{
        type: String,
        require: false,
    },
    rating:{
        type: String,
        require: false,
    },
    skypeid:{
        type: String,
        require: false,
    },
    secondaryemailid:{
        type: String,
        require: false,
    },
    twitterid:{
        type: String,
        require: false,
    },
    street:{
        type: String,
        require: false,
    },
    city:{
        type: String,
        require: false,
    },
    state:{
        type: String,
        require: false,
    },
    country:{
        type: String,
        require: false,
    },
    zipcode:{
        type: String,
        require: false,
    },
    description:{
        type: String,
        require: false,
    },
    leadaddedby:{
        type: String,
        require: false,
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
    addedby:[
        {
        name:{
            type: String,
            required: false,
        },
        date:{
            type: String,
            required: false,
        },
    
    }],
    updatedby:[
        {
        name:{
            type: String,
            required: false,
        },
        date:{
            type: String,
            required: false,
        },
    
    }],
    createdAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Lead', LeadSchema);