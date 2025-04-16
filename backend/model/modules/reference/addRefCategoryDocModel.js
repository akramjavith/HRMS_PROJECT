const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RefDocumnentSchema = new Schema({

    categoryname: {
        type: String,
        required: false,
    },
    subcategoryname: {
        type: String,
        required: false,
    },
    step: {
        type: String,
        required: false,
    },
    referencetodo: [
        {
            no: {
                type: String,
                required: false,
            },
            label: {
                type: String,
                required: false,
            },
            name: {
                type: String,
                required: false,
            },
            documentstext: {
                type: String,
                required: false
            },
            document: [
                {
                    data: {
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
                    remark: {
                        type: String,
                        required: false
                    },

                }
            ],
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
module.exports = mongoose.model('AddRefDocumnent', RefDocumnentSchema);