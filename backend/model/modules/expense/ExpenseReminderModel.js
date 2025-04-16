const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const expenseReminderSchema = new Schema({
    categoryexpense: {
        type: String,
        required: false,
    },
    subcategoryexpense: {
        type: String,
        required: false,
    },
    frequency: {
        type: String,
        required: false,
    },  
    date: {
        type: String,
        required: false,
    },  
    day: {
        type: String,
        required: false,
    },  
    month: {
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
        },
    ],
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
        },
    ],
    status: [
        {
            expensecatename: {
                type: String,
                required: false,
            },
            expensesubcatename: {
                type: String,
                required: false,
            },
            paiddate: {
                type: String,
                required: false,
            },
            paidstatus: {
                type: String,
                required: false,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("ExpenseReminder", expenseReminderSchema);
