const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BankDetailsVerificationSchema = new Schema ({
    empname:{
        type:String,
        required:[true,"please enter the field"]
    },
    empcode:{
        type:String,
        required:[true,"please enter the field"]
    },
    phone:{
        type:String,
        required:[true,"please enter the field"]
    },
    doj:{
        type:String,
        required:[true,"please enter the field"]
    },
    noofdays:{
        type:String,
        required:[true,"please enter the field"]
    },
    time:{
        type:String,
        required:[true,"please enter the field"]
    },
    dot:{
        type:String,
        required:[true,"please enter the field"]
    },
    doorno:{
        type:String,
        required:false
    },
    street:{
        type:String,
        required:false
    },
    area:{
        type:String,
        required:false
    },
    landmark:{
        type:String,
        required:false
    },
    taluk:{
        type:String,
        required:false
    },
    post:{
        type:String,
        required:false
    },
    pincode:{
        type:String,
        required:false
    },
    country:{
        type:String,
        required:false
    },
    state:{
        type:String,
        required:false
    },
    city:{
        type:String,
        required:false
    },
    reminder:{
        type:Boolean,
        required:false,
        default:false
    },
    isaddressupdated:{
        type:Boolean,
        required:false,
        default:false
    },
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
    createdAt: {
        type: Date,
        default: Date.now,
      },
})

module.exports = mongoose.model("bankverificationdetails", BankDetailsVerificationSchema);
