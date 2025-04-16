const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const branch = new Schema({
    code:{
        type: String,
        required: false,
    },
    assetcode:{
        type: String,
        required: false,
    },
    phone:{
        type: String,
        required: false,
    },
    qrcode: {
        type: String,  // Store the QR code as a Base64 string
        required: false
    },
    qrcodeurl: {
        type: String,  // Store the QR code as a Base64 string
        required: false
    },
    // checkbranch:{
    //     type: String,
    //     required: false,
    // },
    companycode: {
        type: String,
        required: false,
    },
    email:{
        type: String,
        required: false,
    },
    name:{
        type: String,
        required: false,
    },
    company:{
        type: String,
        required: false,
    },      
    country:{
        type: String,
        required: false
    },
    state:{
        type: String,
        required: false
    },
    address:{
        type: String,
        required: false
    },
    city:{
        type: String,
        required: false
    },
    pincode:{
        type: String,
        required: false
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
    createdAt:{
        type:Date,
        default:Date.now,
    },
})
module.exports = mongoose.model('Branch', branch);