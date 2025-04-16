const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SubcomponentSchema = new Schema({

    componentname: {
        type: String,
        required: false,
    },
    componentcode: {
        type: String,
        required: false,
    },
    subCompName: {
        type: String,
        required: false,
    },
    estimationType: {
        type: String,
        required: false,
    },
    estimationTime: {
        type: String,
        required: false,
    },
    inputvalue: {
        type: String,
        required: false,
    },
    sizeheight: {
        type: String,
        required: false,
    },
    sizewidth: {
        type: String,
        required: false,
    },
    colour: {
        type: String,
        required: false,
    },
    direction: {
        type: String,
        required: false,
    },
    position: {
        type: String,
        required: false,
    },
    refCode: {
        type: String,
        required: false,
    },
    refCode: {
        type: String,
        required: false,
    },
    refImage: [
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
            }
        }
    ],
    refDocuments: [
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
            }
        }
    ],
    refLinks: {
        type: String,
        required: false,
    },
    refDetails: {
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
module.exports = mongoose.model("SubcomponentSchema", SubcomponentSchema)