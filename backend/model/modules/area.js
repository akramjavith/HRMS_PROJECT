const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AreaSchema = new Schema({
    sno:{
        type: Number,
        required: false,
    },
    code:{
        type: String,
        required: false,
    },
    name:{
        type: String,
        required: false,
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
    // updatedby:[
    //     {
    //     name: String(isUserRoleAccess.companyname),
    //     date: String(new Date()),
    //     },
    // ],
    createdAt:{
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Area',AreaSchema);