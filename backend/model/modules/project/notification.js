const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
    timedata:[
        {
            time:{
            type: String,
            required: false,
        },
    }],
    timevalue:{
        type:String,
        required: false
    },

    description:{
        type:String,
        required: false
    },
    monday:{
        type:Boolean,
        required: false
    },
    tuesday:{
        type:Boolean,
        required: false
    },
    wednesday:{
        type:Boolean,
        required: false
    },
    thursday:{
        type:Boolean,
        required: false
    },
    friday:{
        type:Boolean,
        required: false
    },
    saturday:{
        type:Boolean,
        required: false
    },
    sunday:{
        type:Boolean,
        required: false
    },
    selectedDays:{
        type:[Number],
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
module.exports = mongoose.model("Notification", NotificationSchema)