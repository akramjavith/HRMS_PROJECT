const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const DocumnentSchema = new Schema({

    categoryname: {
        type: [String],
        required: false,
      },
    subcategoryname: {
        type: [String],
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    module: {
        type: [String],
        required: false,
    },
    customer: {
        type: [String],
        required: false,
    },
    queue: {
        type: [String],
        required: false,
    }, 
    process: {
        type: [String],
        required: false,
    },
    form: {
        type: String,
        required: false,
    },
    documentstext: {
        type: [String],
        required: false
    },
    document: [
        {
            lastModified: {
                type: String,
                required: false
            },
            name: {
                type: String,
                required: false
            },
            path: {
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
            },
            data: {
                type: String,
                required: false
            },
            preview: {
                type: String,
                required: false
            },

        }
    ],
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
module.exports = mongoose.model('Adddocumnent', DocumnentSchema);