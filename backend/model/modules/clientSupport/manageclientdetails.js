const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ClientDetailsSchema = new Schema({

    clientid: {
        type: String,
        required: false,
    },
    clientname: {
        type: String,
        required: false,
    },
    clientemail: {
        type: String,
        required: false,
    },
    orderdate: {
        type: String,
        required: false,
    },
    contactpersonname: {
        type: String,
        required: false,
    },
    contactpersonnumber: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    clienturl: {
        type: String,
        required: false
    },
    apikey: {
        type: String,
        required: false
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
module.exports = mongoose.model('ClientDetails', ClientDetailsSchema);