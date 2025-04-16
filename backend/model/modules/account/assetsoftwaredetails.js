const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const assetsoftwareSchema = new Schema({
    distributed: {
        type: Boolean,
        required: false,
    },
    distributedto: {
        type: String,
        required: false,
    },
    assetsoftwarematerial: {
        type: String,
        required: false,
    },
    company: {
        type: String,
        required: false,
    },
    branch: {
        type: String,
        required: false,
    },
    ebusage: {
        type: String,
        required: false,
    },
    unit: {
        type: String,
        required: false,
    },
    floor: {
        type: String,
        required: false,
    },
    location: {
        type: String,
        required: false,
    },
    area: {
        type: String,
        required: false,
    },
    workstation: {
        type: String,
        required: false,
    },

    department: {
        type: String,
        required: false,
    },


    workcheck: {
        type: Boolean,
        required: false,
    },




    responsibleteam: {
        type: String,
        required: false,
    },
    responsibleperson: {
        type: String,
        required: false,
    },

    asset: {
        type: String,
        required: false,
    },
    material: {
        type: String,
        required: false,
    },
    assetmaterialcode: {
        type: String,
        required: false,
    },
    type: {
        type: String,
        required: false,
    },
    options: {
        type: [String],
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    materialvendor: {
        type: String,
        required: false,
    },
    materialvendorgroup: {
        type: String,
        required: false,
    },
    materialaddress: {
        type: String,
        required: false,
    },
    materialphonenumber: {
        type: String,
        required: false,
    },
    code: {
        type: String,
        required: false,
    },
    countquantity: {
        type: String,
        required: false,
    },
    materialcountcode: {
        type: String,
        required: false,
    },
    count: {
        type: String,
        required: false,
    },
    rate: {
        type: String,
        required: false,
    },
    overallrate: {
        type: Boolean,
        required: false,
    },

    warranty: {
        type: String,
        required: false,
    },
    estimation: {
        type: String,
        required: false,
    },
    vendorid: {
        type: String,
        require: false,
    },
    phonenumber: {
        type: String,
        require: false,
    },
    address: {
        type: String,
        require: false,
    },
    estimationtime: {
        type: String,
        required: false,
    },
    warrantycalculation: {
        type: String,
        required: false,
    },
    purchasedate: {
        type: String,
        required: false,
    },
    vendorgroup: {
        type: String,
        required: false,
    },
    vendor: {
        type: String,
        required: false,
    },
    customercare: {
        type: String,
        required: false,
    },
    stockcode: {
        type: String,
        required: false,
    },
    assettype: {
        type: String,
        required: false,
    },
    component: {
        type: String,
        required: false,
    },
    team: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    ticketid: {
        type: String,
        required: false,
    },
    assignedthrough: {
        type: String,
        required: false,
    },
    repairproblem: {
        type: String,
        required: false,
    },
    subcomponent: [
        {

            type: {
                type: String,
                required: false,
            },
            option: {
                type: [String],
                required: false,
            },
            status: {
                type: String,
                required: false,
            },
            materialvendor: {
                type: String,
                required: false,
            },
            materialvendorgroup: {
                type: String,
                required: false,
            },
            estimation: {
                type: String,
                required: false,
            },
            estimationtime: {
                type: String,
                required: false,
            },


            purchasedate: {
                type: String,
                required: false,
            },
            warrantycalculation: {
                type: String,
                required: false,
            },


        },
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
module.exports = mongoose.model("AssetdetailSoftware", assetsoftwareSchema);