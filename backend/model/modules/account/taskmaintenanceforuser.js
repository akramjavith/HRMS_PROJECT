const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TaskForMaintenanceUserSchema = new Schema({

    category: {
        type: String,
        required: false,
    },
    subcategory: {
        type: String,
        required: false,
    },
    completedbyuser: {
        type: String,
        required: false,
    },
    taskassign: {
        type: String,
        required: false,
    },
    assignId: {
        type: String,
        required: false,
    },
    startTime: {
        type: [String],
        required: false,
    },
    username: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    taskname: {
        type: String,
        required: false,
    },
    userdescription: {
        type: String,
        required: false,
    },
    orginalid: {
        type: String,
        required: false,
    },
    taskstatus: {
        type: String,
        required: false,
    },
    scheduledDates: {
        type: [String],
        required: false,
    },
    created: {
        type: String,
        required: false,
    },
    shiftEndTime: {
        type: String,
        required: false,
    },
    taskassigneddate: {
        type: String,
        required: false,
    },

    taskdetails: {
        type: String,
        required: false,
    },
    taskdate: {
        type: String,
        required: false,
    },
    tasktime: {
        type: String,
        required: false,
    },


    endTime: {
        type: [String],
        required: false,
    },
    startTimeSchedule: {
        type: [String],
        required: false,
    },
    state: {
        type: String,
        required: false,
    },
    endTimeSchedule: {
        type: [String],
        required: false,
    },
    timetodo: [
        {
            hour: {
                type: String,
                required: false,
            },
            min: {
                type: String,
                required: false,
            },
            timetype: {
                type: String,
                required: false,
            },
        }
    ],
    ticketid: {
        type: String,
        required: false,
    },
    ticketstatus: {
        type: String,
        required: false,
    },
    assetmaterialname: {
        type: String,
        required: false,
    },
    monthdate: {
        type: String,
        required: false,
    },
    weekdays: {
        type: [String],
        required: false,
    },
    datewise: {
        type: String,
        required: false,
    },
    annumonth: {
        type: String,
        required: false,
    },
    annuday: {
        type: String,
        required: false,
    },
    frequency: {
        type: String,
        required: false,
    },
    duration: {
        type: String,
        required: false,
    },
    breakup: {
        type: String,
        required: false,
    },
    breakupcount: {
        type: String,
        required: false,
    },
    assetmaterial: {
        type: String,
        required: false,
    },
    schedule: {
        type: String,
        required: false,
    },
    required: {
        type: [String],
        required: false,
    },
    priority: {
        type: String,
        required: false,
    },
    orginalid: {
        type: String,
        required: false,
    },
    files: [
        {
            base64: {
                type: String,
                required: false,
            },
            name: {
                type: String,
                required: false,
            },
            preview: {
                type: String,
                required: false,
            },
            size: {
                type: String,
                required: false,
            },
            type: {
                type: String,
                required: false,
            },
        },
    ],
    tableFormat: [{
        sno: {
            type: String,
            required: false,
        },
        task: {
            type: String,
            required: false,
        },
        subtask: {
            type: String,
            required: false,
        },
        totalduration: {
            type: String,
            required: false,
        },
        breakupcount: {
            type: String,
            required: false,
        },
        startDate: {
            type: String,
            required: false,
        },
        startTime: {
            type: String,
            required: false,
        },
        endDate: {
            type: String,
            required: false,
        },
        endTime: {
            type: String,
            required: false,
        },

        reason: {
            type: String,
            required: false,
        },
        status: {
            type: String,
            required: false,
        },
        files: [
            {
                base64: {
                    type: String,
                    required: false,
                },
                name: {
                    type: String,
                    required: false,
                },
                preview: {
                    type: String,
                    required: false,
                },
                size: {
                    type: String,
                    required: false,
                },
                type: {
                    type: String,
                    required: false,
                },
            },
        ],

    }]
    ,
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

TaskForMaintenanceUserSchema.index({ taskstatus: 1 })
TaskForMaintenanceUserSchema.index({ username: 1, state: 1 })

TaskForMaintenanceUserSchema.index({ taskassigneddate: 1, taskassign: 1 })
TaskForMaintenanceUserSchema.index({ taskassigneddate: 1 })
TaskForMaintenanceUserSchema.index({ taskstatus: 1, username: 1 })
TaskForMaintenanceUserSchema.index({ assignId: 1 })
TaskForMaintenanceUserSchema.index({ assignId: 1, taskassign: 1 })
TaskForMaintenanceUserSchema.index({
    assetmaterial: 1,
    username: 1,
    frequency: 1,
    duration: 1,
    taskassigneddate: 1,
    taskdetails: 1,
    timetodo: 1
})


TaskForMaintenanceUserSchema.index({ company: 1, branch: 1, unit: 1, team: 1, department: 1, companyname: 1, taskassigneddate: 1, taskstatus: 1 })
module.exports = mongoose.model('TaskMaintenanceForUser', TaskForMaintenanceUserSchema);
