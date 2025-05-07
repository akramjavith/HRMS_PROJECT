const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AcheivedAccuracyClientSchema = new Schema({
    date:{
        type:Date,
        required:false,
    },
    project: {
        type: String, 
        required: false,
    },
    vendor: {
        type: String, 
        required: false,
    },
    queue: {
        type: String,
        required: false,
    },
    // subcategory: {
    //     type: String,
    //     required: false,
    // },
    acheivedaccuracy: {
        type: Number,
        required: false,
    },
    clientstatus: {
        type: String,
        required: false,
    },
    // internalstatus: {
    //     type: String,
    //     required: false,
    // },
    // statusmode: {
    //     type: String,
    //     required: false,
    // },
    // percentage: {
    //     type: String,
    //     required: false,
    // },
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
module.exports = mongoose.model("Acheivedaccuracyclient", AcheivedAccuracyClientSchema);