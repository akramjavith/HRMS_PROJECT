const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const accountgroupSchema = new Schema({

    accountname: {
        type: String,
        required: false,
    },
    under: {
        type: String,
        required: false,
    },
    alias: {
        type: String,
        required: false,
    },
    natureofgroup: {
        type: String,
        required: false,
    },
    // today: {
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
module.exports = mongoose.model('Accountgroup', accountgroupSchema);