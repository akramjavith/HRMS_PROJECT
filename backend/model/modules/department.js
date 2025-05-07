const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DepartmentSchema = new Schema({
    deptname:{
        type: String,
        required: true
    },
    descrip:{
        type:String,
        required: false
    },
    deduction:{
        type:Boolean,
        required: false
    },
    penalty:{
        type:Boolean,
        required: false
    },
    era:{
        type:Boolean,
        required: false
    },
    prod:{
        type:Boolean,
        required: false
    },
    target:{
        type:Boolean,
        required: false
    },
    tax:{
        type:Boolean,
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
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model("Department", DepartmentSchema)