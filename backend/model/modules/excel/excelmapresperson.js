const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const excelmaprespersondata = new Schema({

    // exceldata:[
    //     {
    customer: {
        type: String,
        required: false,
    },
    priority: {
        type: String,
        required: false,
    },
    process: {
        type: String,
        required: false,
    },
    hyperlink: {
        type: String,
        required: false,
    },
    project: {
        type: String,
        required: false,
    },
    vendor: {
        type: String,
        required: false,
    },
    category: {
        type: String,
        required: false,
    },
    subcategory: {
        type: String,
        required: false,
    },
    queue: {
        type: String,
        required: false,
    },
    time: {
        type: String,
        required: false,
    },
    points: {
        type: String,
        required: false,
    },
    count: {
        type: String,
        required: false,
    },
    tat: {
        type: String,
        required: false,
    },
    created: {
        type: String,
        required: false,
    },

    todo: [
        {
            branch: {
                type: String,
                required: false,
            },
            priority: {
                type: String,
                required: false,
            },
            unit: {
                type: String,
                required: false
            },
            team: {
                type: String,
                required: false
            },
            resperson: {
                type: String,
                required: false
            },
        }
    ],
    updatedate: {
        type: String,
        required: false,
    },
    username: {
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
            todo: [
                {
                    branch: {
                        type: String,
                        required: false,
                    },
                    priority: {
                        type: String,
                        required: false,
                    },
                    unit: {
                        type: String,
                        required: false
                    },
                    team: {
                        type: String,
                        required: false
                    },
                    resperson: {
                        type: String,
                        required: false
                    },
                }
            ],
            date: {
                type: String,
                required: false,
            },

        }],
    created: {
        type: String,
        required: false
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
})
module.exports = mongoose.model('Excelmapdataresperson', excelmaprespersondata);