const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const OtherTaskOriginalUplaodSchema = new Schema({
    datetimezone: {
        type: String,
        required: false,
    },
    vendor: {
        type: String,
        required: false,
    },
    fromdate: {
        type: String,
        required: false,
    },
    todate: {
        type: String,
        required: false,
    },
    // sheetnumber: {
    //   type: String,
    //   required: false,
    // },
    // datedrop: {
    //   type: String,
    //   required: false,
    // },
    // monthdrop: {
    //   type: String,
    //   required: false,
    // },
    // yeardrop: {
    //   type: String,
    //   required: false,
    // },
    // symboldrop: {
    //   type: String,
    //   required: false,
    // },
    // hoursdrop: {
    //   type: String,
    //   required: false,
    // },
    category: {
        type: String,
        required: false,
    },
    unitid: {
        type: String,
        required: false,
    },
    uniqueid: {
        type: Number,
        required: false,
    },
    user: {
        type: String,
        required: false,
    },
    filename: {
        type: String,
        required: false,
    },
    filenamenew: {
        type: String,
        required: false,
    },
    // olddateval: {
    //   type: String,
    //   required: false,
    // },
    dateval: {
        type: String,
        required: false,
    },
    formatteddate: {
        type: String,
        required: false,
    },
    formattedtime: {
        type: String,
        required: false,
    },
    filecategory: {
        type: String,
        required: false,
    },
    unitrate: {
        type: Number,
        required: false,
    },
    checkunique: {
        type: String,
        required: false,
    },

    flagcount: {
        type: Number,
        required: false,
    },
    section: {
        type: String,
        required: false,
    },
    alllogin: {
        type: String,
        required: false,
    },
    unallothide: {
        type: String,
        required: false,
    },
    unallotcategory: {
        type: String,
        required: false,
    },
    unallotsubcategory: {
        type: String,
        required: false,
    },
    updatedunitrate: {
        type: String,
        required: false,
    },
    updatedsection: {
        type: String,
        required: false,
    },
    updatedflag: {
        type: String,
        required: false,
    },
    dateobjformatdate: {
        type: Date,
        required: false,
    },
    filenameupdated: {
        type: String,
        required: false,
    },
    dupe: {
        type: String,
        required: false,
    },

    addedby: [
        {
            name: {
                type: String,
                required: false,
            },
            companyname: {
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
            companyname: {
                type: String,
                required: false,
            },
            date: {
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
module.exports = mongoose.model("OtherTaskOriginalUplaod", OtherTaskOriginalUplaodSchema);