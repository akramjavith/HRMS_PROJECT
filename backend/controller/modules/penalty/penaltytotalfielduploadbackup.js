const Penaltytotalfieldupload = require("../../../model/modules/penalty/penaltytotalfieldupload");

const PenaltyErrorUpload = require("../../../model/modules/penalty/penaltyerrorupload");
const BulkErrorUpload = require("../../../model/modules/penalty/bulkerrorupload");

const ClientUserid = require("../../../model/modules/production/ClientUserIDModel")
const Hirerarchi = require("../../../model/modules/setup/hierarchy");
const Users = require("../../../model/login/auth")
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const moment = require("moment");

// get All Penaltytotalfieldupload => /api/Penaltytotalfieldupload
exports.getAllPenaltytotalfieldupload = catchAsyncErrors(async (req, res, next) => {
    let penaltytotalfielduploads;
    try {
        penaltytotalfielduploads = await Penaltytotalfieldupload.find({ accuracy: { $nin: ["NA", "NA "] } });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltytotalfielduploads) {
        return next(new ErrorHandler("Penaltytotalfieldupload not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        penaltytotalfielduploads,
    });
});

// Create new Penaltytotalfieldupload=> /api/Penaltytotalfieldupload/new
exports.addPenaltytotalfieldupload = catchAsyncErrors(async (req, res, next) => {
    let aPenaltytotalfieldupload = await Penaltytotalfieldupload.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle penaltyerroruploadpoints => /api/penaltyerroruploadpoints/:id
exports.getSinglePenaltytotalfieldupload = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let spenaltytotalfieldupload = await Penaltytotalfieldupload.findById(id);

    if (!spenaltytotalfieldupload) {
        return next(new ErrorHandler("Penaltytotalfieldupload not found!", 404));
    }
    return res.status(200).json({
        spenaltytotalfieldupload,
    });
});

// update Penaltytotalfieldupload by id => /api/Penaltytotalfieldupload/:id
exports.updatePenaltytotalfieldupload = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let upenaltytotalfieldupload = await Penaltytotalfieldupload.findByIdAndUpdate(id, req.body);
    if (!upenaltytotalfieldupload) {
        return next(new ErrorHandler("Penaltytotalfieldupload not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete penaltyerroruploadpoints by id => /api/penaltyerroruploadpoints/:id
exports.deletePenaltytotalfieldupload = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dpenaltytotalfieldupload = await Penaltytotalfieldupload.findByIdAndRemove(id);

    if (!dpenaltytotalfieldupload) {
        return next(new ErrorHandler("Penaltytotalfieldupload not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});


exports.deleteMultiplePenaltytotalfieldupload = catchAsyncErrors(
    async (req, res, next) => {
        const ids = req.body.ids;
        if (!Array.isArray(ids) || ids.length === 0) {
            return next(new ErrorHandler("Invalid IDs provided", 400));
        }

        // Define a batch size for deletion
        // const batchSize = Math.ceil(ids.length / 10);
        const batchSize = 10000;

        // Loop through IDs in batches
        for (let i = 0; i < ids.length; i += batchSize) {
            const batchIds = ids.slice(i, i + batchSize);

            // Delete records in the current batch
            await Penaltytotalfieldupload.deleteMany({ _id: { $in: batchIds } });
        }

        return res
            .status(200)
            .json({ message: "Deleted successfully", success: true });
    }
);


// Filter 
exports.getAllPenaltytotalfielduploadFilter = catchAsyncErrors(async (req, res, next) => {
    let penaltytotalfielduploaddatefilter;
    console.log(req.body)
    let formatfrom = moment(req.body.fromdate).format('DD-MM-YYYY')
    // console.log(formatfrom,'formatfrom')
    let formatto = moment(req.body.todate).format('DD-MM-YYYY')

    try {

        penaltytotalfielduploaddatefilter = await Penaltytotalfieldupload.find({
            date: { $gte: req.body.fromdate, $lte: req.body.todate }, accuracy: { $nin: ["NA", "NA "] }
        }, {});
        // console.log(penaltytotalfielduploaddatefilter,'sks')
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltytotalfielduploaddatefilter) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        penaltytotalfielduploaddatefilter,
    });
});










// Filter 
// exports.getAllValidationErrorFilter = catchAsyncErrors(async (req, res, next) => {
//     let validatefinal, validatefinalData, penaltyerrorupload, bulkerrorupload;
//     try {

//         const { projectvendor, process, loginid, fromdate, todate } = req.body;
//         // console.log(req.body.process, "process")
//         let query = {};

//         if (projectvendor && projectvendor.length > 0) {
//             query.projectvendor = { $in: projectvendor };
//         }

//         if (process && process.length > 0) {
//             query.process = { $in: process };
//         }

//         if (loginid && loginid.length > 0) {
//             query.loginid = { $in: loginid };
//         }

//         if (fromdate && todate) {
//             query.date = { $gte: fromdate, $lte: todate };
//         }

//         query.validatestatus = { $ne: true }

//         // console.log(query, "query")

//         penaltyerrorupload = await PenaltyErrorUpload.find(query, {});
//         bulkerrorupload = await BulkErrorUpload.find(query, {});

//         validatefinalData = [...penaltyerrorupload, ...bulkerrorupload]


//         const userids = [...new Set(validatefinalData.map(item => item.loginid))];
//         let loginids = await ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] }, allotted: "allotted", userid: { $in: userids } });

//         validatefinal = validatefinalData.map(upload => {
//             const loginInfo = loginids.find((login) => login.userid === upload.loginid && login.projectvendor == upload.projectvendor);
//             let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

//             let filteredDataDateTime = null;
//             if (loginallot.length > 0) {
//                 const groupedByDateTime = {};
//                 loginallot.forEach((item) => {
//                     const dateTime = item.date + " " + item.time;
//                     if (!groupedByDateTime[dateTime]) {
//                         groupedByDateTime[dateTime] = [];
//                     }
//                     groupedByDateTime[dateTime].push(item);
//                 });

//                 const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);
//                 lastItemsForEachDateTime.sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time));

//                 for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
//                     const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;
//                     let datevalsplitfinal = upload.date;
//                     if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
//                         filteredDataDateTime = lastItemsForEachDateTime[i];
//                     } else {
//                         break;
//                     }
//                 }
//             }

//             let logininfoname = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
//             let logininfobranch = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.branch : loginInfo ? loginInfo.branch : "";
//             let logininfounit = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.unit : loginInfo ? loginInfo.unit : "";

//             return {
//                 ...upload._doc,
//                 name: logininfoname,
//                 branch: logininfobranch,
//                 unit: logininfounit
//             };
//         });
//         console.log(validatefinal.lenth)

//         // console.log(penaltytotalfielduploaddatefilter,'sks')
//     } catch (err) {

//         return next(new ErrorHandler("Records not found!", 404));
//     }
//     // if (!penaltytotalfielduploaddatefilter) {
//     //     return next(new ErrorHandler("Data not found!", 404));
//     // }
//     return res.status(200).json({
//         // count: products.length,
//         validatefinal,
//     });
// });


exports.getPenaltyTotalFieldLoginProject = catchAsyncErrors(async (req, res, next) => {
    let errormodes, errormodesAll, penaltyerrorupload, bulkerrorupload;

    try {

        let comparename = await ClientUserid.find({
            $and: [
                { loginallotlog: { $exists: true, $ne: [] } },
                { "loginallotlog.empname": req.body.companyname },
                { allotted: "allotted" }
            ]
        });

        let ids = comparename.map(item => item.loginallotlog).flat().map(data => data.userid)

        // Fetch data from the collections
        errormodesAll = await Penaltytotalfieldupload.find({ loginid: { $in: ids }, isedited: { $ne: true }, accuracy: { $nin: ["NA", "NA "] } }, {});

        penaltyerrorupload = await PenaltyErrorUpload.find({ loginid: { $in: ids } }, { projectvendor: 1, process: 1, loginid: 1, date: 1 });
        bulkerrorupload = await BulkErrorUpload.find({ loginid: { $in: ids } }, { projectvendor: 1, process: 1, loginid: 1, dateformatted: 1 });

        // console.log(penaltyerrorupload, "penaltyerrorupload")

        let matchedItems = 0

        // Helper function to count matches in an error array
        function countMatches(dataItem, errorArray, type) {
            return errorArray.filter(
                error => {
                    let dateFinal = type == "ind" ? error.date : error.dateformatted

                    return (
                        error.project === dataItem.project &&
                        error.process === dataItem.queuename &&
                        error.loginid === dataItem.loginid &&
                        dateFinal === dataItem.date
                        // error.date === dataItem.date

                    )
                }
            ).length;
        }

        // Generating the result based on matched counts in bulkerror and penaltyerror
        const filteredErrorModes = errormodesAll.map(item => {
            const bulkCount = countMatches(item, bulkerrorupload, "bulk");
            const penaltyCount = countMatches(item, penaltyerrorupload, "ind");
            return {
                ...item._doc,
                uploadcount: (bulkCount > 0 && penaltyCount > 0) ? (bulkCount + penaltyCount) : bulkCount > 0 ? bulkCount : penaltyCount > 0 ? penaltyCount : 0// Sum of counts from bulkerror and penaltyerror
            };
        });

        // let loginids = await ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] }, allotted: "allotted", userid: { $in: userids } });

        errormodes = filteredErrorModes.map(upload => {
            const loginInfo = comparename.find((login) => login.userid === upload.loginid && login.projectvendor == upload.projectvendor);
            let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

            let filteredDataDateTime = null;
            if (loginallot.length > 0) {
                const groupedByDateTime = {};
                loginallot.forEach((item) => {
                    const dateTime = item.date + " " + item.time;
                    if (!groupedByDateTime[dateTime]) {
                        groupedByDateTime[dateTime] = [];
                    }
                    groupedByDateTime[dateTime].push(item);
                });

                const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);
                lastItemsForEachDateTime.sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time));

                for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                    const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;
                    let datevalsplitfinal = upload.date;
                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break;
                    }
                }
            }

            let logininfoname = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
            let logininfobranch = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.branch : loginInfo ? loginInfo.branch : "";
            let logininfounit = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.unit : loginInfo ? loginInfo.unit : "";

            return {
                ...upload,
                name: logininfoname,
                branch: logininfobranch,
                unit: logininfounit
            };
        });

        console.log(errormodes, "errormodes")

        // console.log(matchedCount, "matchedCount")

        return res.status(200).json({
            errormodes
        });
    } catch (err) {
        console.log(err);
        return next(new ErrorHandler("An error occurred while processing data!", 500));
    }
});



exports.getAllValidationErrorFilter = catchAsyncErrors(async (req, res, next) => {
    let validatefinal, validatefinalData, penaltyerrorupload, bulkerrorupload;
    try {

        const { projectvendor, process, loginid, fromdate, todate, batchNumber, batchSize } = req.body;

        const skip = (batchNumber - 1) * batchSize;
        const limit = batchSize;

        // console.log(req.body, "boedyu")

        let query = {}

        if (projectvendor && projectvendor.length > 0) {
            query.projectvendor = { $in: projectvendor };
        }

        if (process && process.length > 0) {
            query.process = { $in: process };
        }

        if (loginid && loginid.length > 0) {
            query.loginid = { $in: loginid };
        }

        if (fromdate && todate) {
            query.dateformatted = { $gte: fromdate, $lte: todate };
        }

        // query.$or = [{ validatestatus: { $ne: true } }, { validatestatus: { $exists: false } }]
        query = {}

        let querypenalty = {};

        if (projectvendor && projectvendor.length > 0) {
            querypenalty.projectvendor = { $in: projectvendor };
        }

        if (process && process.length > 0) {
            querypenalty.process = { $in: process };
        }

        if (loginid && loginid.length > 0) {
            querypenalty.loginid = { $in: loginid };
        }

        if (fromdate && todate) {
            querypenalty.date = { $gte: fromdate, $lte: todate };
        }

        // querypenalty.$or = [{ validatestatus: { $ne: true } }, { validatestatus: { $exists: false } }]
        querypenalty = {}
        // console.log(query, "query")

        penaltyerrorupload = await PenaltyErrorUpload.find(querypenalty, {}).skip(skip)  // Skip the number of documents based on page number
            .limit(limit);
        bulkerrorupload = await BulkErrorUpload.find(query, {}).skip(skip)  // Skip the number of documents based on page number
            .limit(limit);



        // console.log(bulkerrorupload.length, penaltyerrorupload.length, "penaltyerrorupload")

        // console.log(penaltyerrorupload.length)
        validatefinalData = [...penaltyerrorupload, ...bulkerrorupload]
        // console.log(validatefinalData.length)

        const userids = [...new Set(validatefinalData.map(item => item.loginid))];
        let loginids = await ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] }, allotted: "allotted", userid: { $in: userids } });

        validatefinal = validatefinalData.map(upload => {
            // console.log(upload.mode, "upmopde")
            const loginInfo = loginids.find((login) => login.userid === upload.loginid && login.projectvendor == upload.projectvendor);
            let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

            let filteredDataDateTime = null;
            if (loginallot.length > 0) {
                const groupedByDateTime = {};
                loginallot.forEach((item) => {
                    const dateTime = item.date + " " + item.time;
                    if (!groupedByDateTime[dateTime]) {
                        groupedByDateTime[dateTime] = [];
                    }
                    groupedByDateTime[dateTime].push(item);
                });

                const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);
                lastItemsForEachDateTime.sort((a, b) => new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time));

                for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                    const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;
                    let datevalsplitfinal = upload.mode == "Bulkupload" ? upload.dateformatted : upload.date;
                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break;
                    }
                }
            }

            let logininfoname = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
            let logininfobranch = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.branch : loginInfo ? loginInfo.branch : "";
            let logininfounit = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.unit : loginInfo ? loginInfo.unit : "";

            return {
                ...upload._doc,
                name: logininfoname,
                branch: logininfobranch,
                unit: logininfounit
            };
        });
        // console.log(validatefinal.length)

        // console.log(penaltytotalfielduploaddatefilter,'sks')
    } catch (err) {
        console.log(err, "validateerror")
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!penaltytotalfielduploaddatefilter) {
    //     return next(new ErrorHandler("Data not found!", 404));
    // }
    return res.status(200).json({
        // count: products.length,
        validatefinal,
        count: validatefinal.length,
    });
});



exports.getAllPenaltytotalfielduploadValidationEntry = catchAsyncErrors(async (req, res, next) => {
    let penaltytotalfielduploads, penaltyerrorupload, bulkerrorupload;
    try {


        penaltytotalfielduploads = await Penaltytotalfieldupload.find({ isedited: true }, { projectvendor: 1, queuename: 1, loginid: 1, date: 1, isedited: 1 })


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltytotalfielduploads) {
        return next(new ErrorHandler("Penaltytotalfieldupload not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        penaltytotalfielduploads,
    });
});


exports.getAllErrorUploadHierarchyList = catchAsyncErrors(
    async (req, res, next) => {
        let result,
            reportingtobaseduser,
            clientuserid,
            hierarchy,
            resultAccessFilter,
            secondaryhierarchyfinal,
            tertiaryhierarchyfinal,
            primaryhierarchyfinal,
            hierarchyfilter,
            filteredoverall,
            primaryhierarchy,
            hierarchyfilter1,
            secondaryhierarchy,
            hierarchyfilter2,
            tertiaryhierarchy,
            primaryhierarchyall,
            secondaryhierarchyall,
            tertiaryhierarchyall,
            branch,
            hierarchySecond,
            overallMyallList,
            hierarchyMap,
            resulted,
            resultedTeam,
            myallTotalNames,
            hierarchyFinal,
            hierarchyDefault,
            reportingusers,
            penaltyerrorupload, bulkerrorupload;


        try {
            const { listpageaccessmode, batchNumber, batchSize } = req.body;
            const vendorNames = req.body.vendor.map((vendor) => vendor.value);

            const skip = (batchNumber - 1) * batchSize;
            const limit = batchSize;

            let clientidsmap;
            let levelFinal = req.body?.sector === "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body?.sector]
            // console.log(levelFinal, req.body, "lof")

            let finalDataRestrictList = []



            if (listpageaccessmode === "Reporting to Based") {
                let usersss = await User.find(
                    {
                        enquirystatus: {
                            $nin: ["Enquiry Purpose"],
                        },

                        resonablestatus: {
                            $nin: [
                                "Not Joined",
                                "Postponed",
                                "Rejected",
                                "Closed",
                                "Releave Employee",
                                "Absconded",
                                "Hold",
                                "Terminate",
                            ],
                        },
                        reportingto: req.body.username,
                    },
                    {
                        empcode: 1,
                        companyname: 1,
                    }
                ).lean();


                const companyNames = usersss.map((user) => user.companyname);
                let clientids = await ClientUserid.find(
                    {
                        // projectvendor: { $in: vendorNames },
                        empname: { $in: companyNames },
                    },
                    { userid: 1 }
                ).lean();
                clientidsmap = clientids.map((user) => user.userid);
            }
            penaltyerrorupload = await PenaltyErrorUpload.find({ projectvendor: { $in: vendorNames }, date: { $gte: req.body.fromdate, $lte: req.body.todate }, }, { projectvendor: 1, process: 1, loginid: 1, date: 1 });
            bulkerrorupload = await BulkErrorUpload.find({ projectvendor: { $in: vendorNames }, dateformatted: { $gte: req.body.fromdate, $lte: req.body.todate }, }, { projectvendor: 1, process: 1, loginid: 1, dateformatted: 1 });
            // console.log(penaltyerrorupload.length, "penalty")
            // console.log(bulkerrorupload.length, "bulkerrorupload")
            let prodresultnew = await Penaltytotalfieldupload.find(
                {

                    isedited: true,

                    $or: [
                        { iseditedtotal: { $ne: true } },
                        { iseditedtotal: { $exists: false } },

                    ],
                    projectvendor: { $in: vendorNames },

                    date: { $gte: req.body.fromdate, $lte: req.body.todate },

                    ...(listpageaccessmode === "Reporting to Based"
                        ? { user: { $in: clientidsmap } }
                        : {}),
                    accuracy: { $nin: ["NA", "NA "] }
                },
                {
                    projectvendor: 1,
                    queuename: 1,
                    loginid: 1,
                    date: 1,
                    dateformatted: 1,
                    accuracy: 1,
                    errorcount: 1,
                    totalfields: 1,
                    autocount: 1,
                    filename: 1,
                    manualerror: 1,
                    manualtotal: 1,
                    uploadcount: 1,
                    createdAt: 1,
                    _id: 1,
                }
            ).skip(skip)  // Skip the number of documents based on page number
                .limit(limit);


            // Helper function to count matches in an error array
            function countMatches(dataItem, errorArray, type) {
                return errorArray.filter(
                    error => {
                        let dateFinal = type == "ind" ? error.date : error.dateformatted

                        return (
                            error.project === dataItem.project &&
                            error.process === dataItem.queuename &&
                            error.loginid === dataItem.loginid &&
                            dateFinal === dataItem.date
                            // error.date === dataItem.date

                        )
                    }
                ).length;
            }

            // Generating the result based on matched counts in bulkerror and penaltyerror
            const prodresult = prodresultnew.map(item => {
                const bulkCount = countMatches(item, bulkerrorupload, "bulk");
                const penaltyCount = countMatches(item, penaltyerrorupload, "ind");

                // console.log(bulkCount > 0 && penaltyCount > 0, penaltyCount, "bulkCount")

                return {
                    ...item._doc,
                    uploadcount: (bulkCount > 0 && penaltyCount > 0) ? (bulkCount + penaltyCount) : bulkCount > 0 ? bulkCount : penaltyCount > 0 ? penaltyCount : 0
                    // uploadcount: (bulkCount > 0 && penaltyCount > 0) ? Math.min(bulkCount, penaltyCount) : 0// Sum of counts from bulkerror and penaltyerror
                };
            });


            // console.log(prodresult, "prodresult")


            clientuserid = await ClientUserid.find(
                { loginallotlog: { $exists: true, $ne: [] } },
                { empname: 1, userid: 1, loginallotlog: 1, projectvendor: 1 }
            ).lean();

            result = prodresult.map((item) => {
                const loginInfo = clientuserid.filter((d) => d.userid == item.loginid && d.projectvendor == item.projectvendor);

                let loginallot = loginInfo.length > 0 ? loginInfo.map(d => d.loginallotlog).flat() : [];
                // console.log(loginallot, "loginallot")
                let filteredDataDateTime = null;
                if (loginallot.length > 0) {
                    const groupedByDateTime = {};

                    // Group items by date and time
                    loginallot.forEach((item) => {
                        const dateTime = item.date + " " + item.time;
                        if (!groupedByDateTime[dateTime]) {
                            groupedByDateTime[dateTime] = [];
                        }
                        groupedByDateTime[dateTime].push(item);
                    });

                    // Extract the last item of each group
                    const lastItemsForEachDateTime = Object.values(groupedByDateTime).map(
                        (group) => group[group.length - 1]
                    );

                    // Sort the last items by date and time
                    lastItemsForEachDateTime.sort((a, b) => {
                        return (
                            new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
                        );
                    });

                    // Find the first item in the sorted array that meets the criteria

                    for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                        const dateTime =
                            lastItemsForEachDateTime[i].date + " " + lastItemsForEachDateTime[i].time;
                        // let datevalsplit = item.mode === "Manual" ? "" : upload.dateval.split(" IST");
                        let datevalsplitfinal = item.date;
                        // console.log(new Date(dateTime), new Date(datevalsplitfinal), "opopop")
                        if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                            filteredDataDateTime = lastItemsForEachDateTime[i];
                        } else {
                            break;
                        }
                    }
                }
                // console.log(filteredDataDateTime, "filteredDataDateTime")
                let logininfoempname =
                    loginallot.length > 0 && filteredDataDateTime
                        ? filteredDataDateTime.empname
                        : loginInfo.length == 1
                            ? loginInfo[0].empname
                            : "";
                let logininfobranch =
                    loginallot.length > 0 && filteredDataDateTime
                        ? filteredDataDateTime.branch
                        : loginInfo.length == 1
                            ? loginInfo[0].branch
                            : "";
                let logininfounit =
                    loginallot.length > 0 && filteredDataDateTime
                        ? filteredDataDateTime.unit
                        : loginInfo.length == 1
                            ? loginInfo[0].unit
                            : "";

                // let logininfoempname = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
                // let logininfobranch = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.branch : loginInfo ? loginInfo.branch : "";
                // let logininfounit = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.unit : loginInfo ? loginInfo.unit : "";

                return {
                    ...item._doc,
                    projectvendor: item.projectvendor,
                    queuename: item.queuename,
                    loginid: item.loginid,
                    date: item.date,
                    accuracy: item.accuracy,
                    errorcount: item.errorcount,
                    totalfields: item.totalfields,
                    autocount: item.autocount,
                    filename: item.filename,
                    uploadcount: item.uploadcount,
                    manualerror: item.manualerror,
                    manualtotal: item.manualtotal,
                    _id: item._id,
                    companyname: logininfoempname,
                    branchname: logininfobranch,
                    unitname: logininfounit,
                };
            });




            // console.log(result, "resutl")

            //myhierarchy dropdown
            if (
                req.body.hierachy === "myhierarchy" &&
                (listpageaccessmode === "Hierarchy Based" ||
                    listpageaccessmode === "Overall")
            ) {
                hierarchy = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
                    level: req.body.sector,
                });
                hierarchyDefault = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
                });

                let answerDef = hierarchyDefault.map((data) => data.employeename);

                hierarchyFinal =
                    req.body.sector === "all"
                        ? answerDef.length > 0
                            ? [].concat(...answerDef)
                            : []
                        : hierarchy.length > 0
                            ? [].concat(...hierarchy.map((item) => item.employeename))
                            : [];
                hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

                hierarchyfilter = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
                    level: "Primary",
                });
                primaryhierarchy = hierarchyfilter.map((item) => item.employeename[0])
                    ? hierarchyfilter.map((item) => item.employeename[0])
                    : [];

                hierarchyfilter1 = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
                    level: "Secondary",
                });
                secondaryhierarchy = hierarchyfilter1.map(
                    (item) => item.employeename[0]
                )
                    ? hierarchyfilter1.map((item) => item.employeename[0])
                    : [];

                hierarchyfilter2 = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
                    level: "Tertiary",
                });
                tertiaryhierarchy = hierarchyfilter2.map((item) => item.employeename[0])
                    ? hierarchyfilter2.map((item) => item.employeename[0])
                    : [];

                resulted = result
                    .map((userObj) => {
                        const matchingHierarchy = hierarchyDefault.find(
                            (hierarchyObj) =>
                                hierarchyObj.employeename[0] == userObj.companyname
                        );
                        return {
                            companyname: userObj.companyname,
                            branchname: userObj.branchname,
                            unitname: userObj.unitname,
                            projectvendor: userObj.projectvendor,
                            queuename: userObj.queuename,
                            loginid: userObj.loginid,
                            date: userObj.date,
                            accuracy: userObj.accuracy,
                            errorcount: userObj.errorcount,
                            totalfields: userObj.totalfields,
                            autocount: userObj.autocount,
                            filename: userObj.filename,
                            manualerror: userObj.manualerror,
                            manualtotal: userObj.manualtotal,
                            uploadcount: userObj.uploadcount,
                            _id: userObj._id,
                            level: matchingHierarchy ? matchingHierarchy.level : "",
                            control: matchingHierarchy ? matchingHierarchy.control : "",
                        };
                    })
                    .filter((data) => hierarchyMap.includes(data.companyname));
            }

            if (
                req.body.hierachy === "allhierarchy" &&
                (listpageaccessmode === "Hierarchy Based" ||
                    listpageaccessmode === "Overall")
            ) {
                hierarchySecond = await Hirerarchi.find(
                    {},
                    { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
                );
                let sectorFinal = req.body.sector == "all"
                    ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

                hierarchyDefault = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
                    level: { $in: sectorFinal },

                });

                // console.log(hierarchyDefault, "hierarchyDefault")

                let answerDef = hierarchyDefault
                    .map((data) => data.employeename)
                    .flat();





                function findEmployeesRecursive(
                    currentSupervisors,
                    processedSupervisors,
                    result
                ) {
                    const filteredData = hierarchySecond.filter((item) =>
                        item.supervisorchoose.some(
                            (supervisor) =>
                                currentSupervisors.includes(supervisor) &&
                                (req.body.sector == "all"
                                    ? ["Primary", "Secondary", "Tertiary"].includes(item.level) : req.body.sector == item.level) &&
                                !processedSupervisors.has(supervisor)
                        )
                    );

                    if (filteredData.length === 0) {
                        return result;
                    }

                    const newEmployees = filteredData.reduce((employees, item) => {
                        employees.push(...item.employeename);
                        processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
                        return employees;
                    }, []);

                    const uniqueNewEmployees = [...new Set(newEmployees)];
                    result = [...result, ...filteredData];
                    // console.log(result, "result")
                    return findEmployeesRecursive(
                        uniqueNewEmployees,
                        processedSupervisors,
                        result
                    );
                }

                const processedSupervisors = new Set();
                const filteredOverallItem = findEmployeesRecursive(
                    answerDef,
                    processedSupervisors,
                    []
                );
                let answerDeoverall = filteredOverallItem
                    .filter((data) =>
                        req.body.sector == "all"
                            ? ["Primary", "Secondary", "Tertiary"].includes(data.level)
                            : data.level == req.body.sector
                    )
                    .map((item) => item.employeename[0]);

                resultedTeam = result
                    .map((userObj) => {
                        const matchingHierarchycontrol = filteredOverallItem.find(
                            (hierarchyObj) =>
                                hierarchyObj.employeename[0] == userObj.companyname
                        );
                        return {
                            companyname: userObj.companyname,
                            branchname: userObj.branchname,
                            unitname: userObj.unitname,
                            projectvendor: userObj.projectvendor,
                            queuename: userObj.queuename,
                            loginid: userObj.loginid,
                            date: userObj.date,
                            accuracy: userObj.accuracy,
                            errorcount: userObj.errorcount,
                            totalfields: userObj.totalfields,
                            autocount: userObj.autocount,
                            filename: userObj.filename,
                            manualerror: userObj.manualerror,
                            manualtotal: userObj.manualtotal,
                            uploadcount: userObj.uploadcount,
                            _id: userObj._id,
                            level: matchingHierarchycontrol
                                ? matchingHierarchycontrol.level
                                : "",
                            control: matchingHierarchycontrol
                                ? matchingHierarchycontrol.control
                                : "",
                        };
                    })
                    .filter((data) => answerDeoverall.includes(data.companyname));



                let hierarchyallfinal = await Hirerarchi.find({
                    employeename: { $in: answerDeoverall.map((item) => item) },
                    level: req.body.sector,
                });

                hierarchyFinal =
                    req.body.sector === "all"
                        ? answerDeoverall.length > 0
                            ? [].concat(...answerDeoverall)
                            : []
                        : hierarchyallfinal.length > 0
                            ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
                            : [];


                finalDataRestrictList = hierarchyFinal


                primaryhierarchyall = resultedTeam
                    .filter((item) => item.level == "Primary")
                    .map((item) => item.companyname);

                secondaryhierarchyall = resultedTeam
                    .filter((item) => item.level == "Secondary")
                    .map((item) => item.companyname);

                tertiaryhierarchyall = resultedTeam
                    .filter((item) => item.level == "Tertiary")
                    .map((item) => item.companyname);
            }
            // console.log(hierarchyFinal, "hierarchyFinal")
            //my + all hierarchy list dropdown

            if (
                req.body.hierachy === "myallhierarchy" &&
                (listpageaccessmode === "Hierarchy Based" ||
                    listpageaccessmode === "Overall")
            ) {
                hierarchySecond = await Hirerarchi.find(
                    {},
                    { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
                );

                let sectorFinal = req.body.sector == "all"
                    ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

                hierarchyDefault = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
                    level: { $in: sectorFinal },

                });

                let answerDef = hierarchyDefault.map((data) => data.employeename);

                function findEmployeesRecursive(
                    currentSupervisors,
                    processedSupervisors,
                    result
                ) {
                    const filteredData = hierarchySecond.filter((item) =>
                        item.supervisorchoose.some(
                            (supervisor) =>
                                currentSupervisors.includes(supervisor) &&
                                (req.body.sector == "all"
                                    ? ["Primary", "Secondary", "Tertiary"].includes(item.level) : req.body.sector == item.level) &&
                                !processedSupervisors.has(supervisor)
                        )
                    );

                    if (filteredData.length === 0) {
                        return result;
                    }

                    const newEmployees = filteredData.reduce((employees, item) => {
                        employees.push(...item.employeename);
                        processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
                        return employees;
                    }, []);

                    const uniqueNewEmployees = [...new Set(newEmployees)];
                    result = [...result, ...filteredData];

                    return findEmployeesRecursive(
                        uniqueNewEmployees,
                        processedSupervisors,
                        result
                    );
                }

                const processedSupervisors = new Set();
                const filteredOverallItem = findEmployeesRecursive(
                    [req.body.username],
                    processedSupervisors,
                    []
                );
                let answerDeoverall = filteredOverallItem
                    .filter((data) =>
                        req.body.sector == "all"
                            ? ["Primary", "Secondary", "Tertiary"].includes(data.level)
                            : data.level == req.body.sector
                    )
                    .map((item) => item.employeename[0]);


                // console.log(answerDeoverall.length, "answerDeoverall")

                filteredoverall = result
                    .map((userObj) => {
                        const matchingHierarchycontrol = filteredOverallItem.find(
                            (hierarchyObj) =>
                                hierarchyObj.employeename[0] == userObj.companyname
                        );
                        return {
                            companyname: userObj.companyname,
                            branchname: userObj.branchname,
                            uploadcount: userObj.uploadcount,
                            unitname: userObj.unitname,
                            projectvendor: userObj.projectvendor,
                            queuename: userObj.queuename,
                            loginid: userObj.loginid,
                            date: userObj.date,
                            accuracy: userObj.accuracy,
                            errorcount: userObj.errorcount,
                            totalfields: userObj.totalfields,
                            autocount: userObj.autocount,
                            filename: userObj.filename,
                            manualerror: userObj.manualerror,
                            manualtotal: userObj.manualtotal,
                            _id: userObj._id,
                            createdAt: userObj.createdAt,
                            level: matchingHierarchycontrol
                                ? matchingHierarchycontrol.level
                                : "",
                            control: matchingHierarchycontrol
                                ? matchingHierarchycontrol.control
                                : "",
                        };
                    })
                    .filter((data) =>
                        answerDeoverall.includes(data.companyname));


                // console.log(filteredoverall.length, "filteredoverall")

                let hierarchyallfinal = await Hirerarchi.find({
                    employeename: { $in: answerDeoverall.map((item) => item) },
                    level: req.body.sector,
                });

                hierarchyFinal =
                    req.body.sector === "all"
                        ? answerDeoverall.length > 0
                            ? [].concat(...answerDeoverall)
                            : []
                        : hierarchyallfinal.length > 0
                            ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
                            : [];
                finalDataRestrictList = hierarchyFinal
                primaryhierarchyfinal = filteredoverall
                    .filter((item) => item.level == "Primary")
                    .map((item) => item.companyname);

                secondaryhierarchyfinal = filteredoverall
                    .filter((item) => item.level == "Secondary")
                    .map((item) => item.companyname);

                tertiaryhierarchyfinal = filteredoverall
                    .filter((item) => item.level == "Tertiary")
                    .map((item) => item.companyname);
            }

            if (listpageaccessmode === "Reporting to Based") {
                reportingtobaseduser = result.map((userObj) => {
                    return {
                        companyname: userObj.companyname,
                        branchname: userObj.branchname,
                        unitname: userObj.unitname,
                        projectvendor: userObj.projectvendor,
                        queuename: userObj.queuename,
                        loginid: userObj.loginid,
                        date: userObj.date,
                        accuracy: userObj.accuracy,
                        errorcount: userObj.errorcount,
                        totalfields: userObj.totalfields,
                        autocount: userObj.autocount,
                        filename: userObj.filename,
                        manualerror: userObj.manualerror,
                        manualtotal: userObj.manualtotal,
                        _id: userObj._id,
                        level: "",
                        control: "",
                    };
                });
            }



            let finalsupervisor = req.body.hierachy == "myhierarchy" ? resulted?.map(Data => Data?.companyname) : req.body.hierachy == "allhierarchy" ? resultedTeam?.map(Data => Data?.companyname) : filteredoverall?.map(Data => Data?.companyname)
            const restrictTeam = await Hirerarchi.aggregate([
                {
                    $match: {
                        $or: [
                            {
                                supervisorchoose: { $in: finalsupervisor } // Matches if supervisorchoose field has a value in finalsupervisor
                            },
                            {
                                employeename: { $in: finalsupervisor }     // Matches if employeename field has a value in finalsupervisor
                            }
                        ],
                        level: { $in: levelFinal } // Matches if level field has a value in levelFinal
                    },
                },
                {
                    $lookup: {
                        from: "reportingheaders",
                        let: {
                            teamControlsArray: {
                                $ifNull: ["$pagecontrols", []]
                            }
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {
                                                $in: [
                                                    "$name",
                                                    "$$teamControlsArray"
                                                ]
                                            }, // Check if 'name' is in 'teamcontrols' array
                                            {
                                                $in: [
                                                    req?.body?.pagename,
                                                    "$reportingnew" // Check if 'menuteamloginstatus' is in 'reportingnew' array
                                                ]
                                            } // Additional condition for reportingnew array
                                        ]
                                    }
                                }
                            }
                        ],
                        as: "reportData" // The resulting matched documents will be in this field
                    }
                },
                {
                    $project: {
                        supervisorchoose: 1,
                        employeename: 1,
                        reportData: 1
                    }
                }
            ]);

            let restrictListTeam = restrictTeam?.filter(data => data?.reportData?.length > 0)?.flatMap(Data => Data?.employeename)
            const resultAccessFilterHierarchy = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : filteredoverall;
            resultAccessFilter = restrictListTeam?.length > 0 ? resultAccessFilterHierarchy?.filter(data => restrictListTeam?.includes(data?.companyname)) : [];
            console.log(resultAccessFilter, "resultAccessFilter")
        } catch (err) {
            console.log(err, "err");
            return next(new ErrorHandler("Records not found!", 404));
        }
        if (!resultAccessFilter) {
            return next(new ErrorHandler("No data found!", 404));
        }
        return res.status(200).json({
            // result
            // resulted,
            // resultedTeam,
            // branch,
            // hierarchy,
            // overallMyallList,
            resultAccessFilter,
            count: resultAccessFilter.length,
            // primaryhierarchy,
            //  secondaryhierarchy,
            //  tertiaryhierarchy,
            //  primaryhierarchyall,
            //  secondaryhierarchyall,
            //  tertiaryhierarchyall,
            //  primaryhierarchyfinal,
            //  secondaryhierarchyfinal, tertiaryhierarchyfinal,
        });
    }
);


exports.getAllInvalidErrorEntryHierarchyList = catchAsyncErrors(async (req, res, next) => {
    let result,
        reportingtobaseduser,
        clientuserid,
        hierarchy,
        resultAccessFilter,
        secondaryhierarchyfinal,
        tertiaryhierarchyfinal,
        primaryhierarchyfinal,
        hierarchyfilter,
        filteredoverall,
        primaryhierarchy,
        hierarchyfilter1,
        secondaryhierarchy,
        hierarchyfilter2,
        tertiaryhierarchy,
        primaryhierarchyall,
        secondaryhierarchyall,
        tertiaryhierarchyall,
        branch,
        hierarchySecond,
        overallMyallList,
        hierarchyMap,
        resulted,
        resultedTeam,
        myallTotalNames,
        hierarchyFinal,
        hierarchyDefault,
        reportingusers,
        penaltyerrorupload, bulkerrorupload;

    try {
        const { listpageaccessmode } = req.body;
        let clientidsmap;
        let levelFinal = req.body?.sector === "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body?.sector]

        // console.log(levelFinal, "levelFinal")
        if (listpageaccessmode === "Reporting to Based") {
            let usersss = await User.find(
                {
                    enquirystatus: {
                        $nin: ["Enquiry Purpose"],
                    },

                    resonablestatus: {
                        $nin: [
                            "Not Joined",
                            "Postponed",
                            "Rejected",
                            "Closed",
                            "Releave Employee",
                            "Absconded",
                            "Hold",
                            "Terminate",
                        ],
                    },
                    reportingto: req.body.username,
                },
                {
                    empcode: 1,
                    companyname: 1,
                }
            ).lean();


            const companyNames = usersss.map((user) => user.companyname);
            // console.log(companyNames, "companyNames")
            let clientids = await ClientUserid.find(
                {
                    // projectvendor: { $in: vendorNames },
                    empname: { $in: companyNames },
                },
                { userid: 1 }
            ).lean();

            clientidsmap = clientids.map((user) => user.userid);
        }

        let querypenalty = {


            status: "Invalid",

            date: { $gte: req.body.fromdate, $lte: req.body.todate },

            ...(listpageaccessmode === "Reporting to Based"
                ? { user: { $in: clientidsmap } }
                : {}),

        }



        let querybulk = {


            status: "Invalid",

            dateformatted: { $gte: req.body.fromdate, $lte: req.body.todate },

            ...(listpageaccessmode === "Reporting to Based"
                ? { user: { $in: clientidsmap } }
                : {}),

        }
        console.log(querybulk, "querybulk")




        penaltyerrorupload = await PenaltyErrorUpload.find(querypenalty, {});

        bulkerrorupload = await BulkErrorUpload.find(querybulk, {});


        let prodresult = [...penaltyerrorupload, ...bulkerrorupload]


        // console.log(prodresult.length, "loeeeeeee")




        clientuserid = await ClientUserid.find(
            { loginallotlog: { $exists: true, $ne: [] } },
            { empname: 1, userid: 1, loginallotlog: 1, projectvendor: 1 }
        ).lean();

        result = prodresult.map((item) => {
            const loginInfo = clientuserid.filter((d) => d.userid == item.loginid && d.projectvendor == item.projectvendor);

            let loginallot = loginInfo.length > 0 ? loginInfo.map(d => d.loginallotlog).flat() : [];
            // console.log(loginallot, "loginallot")
            let filteredDataDateTime = null;
            if (loginallot.length > 0) {
                const groupedByDateTime = {};

                // Group items by date and time
                loginallot.forEach((item) => {
                    const dateTime = item.date + " " + item.time;
                    if (!groupedByDateTime[dateTime]) {
                        groupedByDateTime[dateTime] = [];
                    }
                    groupedByDateTime[dateTime].push(item);
                });

                // Extract the last item of each group
                const lastItemsForEachDateTime = Object.values(groupedByDateTime).map(
                    (group) => group[group.length - 1]
                );

                // Sort the last items by date and time
                lastItemsForEachDateTime.sort((a, b) => {
                    return (
                        new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
                    );
                });

                // Find the first item in the sorted array that meets the criteria

                for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                    const dateTime =
                        lastItemsForEachDateTime[i].date + " " + lastItemsForEachDateTime[i].time;
                    // let datevalsplit = item.mode === "Manual" ? "" : upload.dateval.split(" IST");
                    let datevalsplitfinal = item.date;
                    // console.log(new Date(dateTime), new Date(datevalsplitfinal), "opopop")
                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break;
                    }
                }
            }
            // console.log(filteredDataDateTime, "filteredDataDateTime")
            let logininfoempname =
                loginallot.length > 0 && filteredDataDateTime
                    ? filteredDataDateTime.empname
                    : loginInfo.length == 1
                        ? loginInfo[0].empname
                        : "";
            let logininfobranch =
                loginallot.length > 0 && filteredDataDateTime
                    ? filteredDataDateTime.branch
                    : loginInfo.length == 1
                        ? loginInfo[0].branch
                        : "";
            let logininfounit =
                loginallot.length > 0 && filteredDataDateTime
                    ? filteredDataDateTime.unit
                    : loginInfo.length == 1
                        ? loginInfo[0].unit
                        : "";

            // let logininfoempname = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
            // let logininfobranch = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.branch : loginInfo ? loginInfo.branch : "";
            // let logininfounit = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.unit : loginInfo ? loginInfo.unit : "";

            return {
                ...item._doc,
                projectvendor: item.projectvendor,
                process: item.process,
                loginid: item.loginid,
                date: item.date,
                dateformatted: item.dateformatted,
                mode: item.mode,
                errorfilename: item.errorfilename,
                documentnumber: item.documentnumber,
                documenttype: item.documenttype,
                fieldname: item.fieldname,
                line: item.line,
                errorvalue: item.errorvalue,
                correctvalue: item.correctvalue,
                link: item.link,
                doclink: item.doclink,
                filename: item.filename,
                dateformat: item.dateformat,
                invalidcheck: item.invalidcheck,
                status: item.status,
                _id: item._id,
                companyname: logininfoempname,
                branchname: logininfobranch,
                unitname: logininfounit,
            };
        });

        // console.log(result, "resutl")

        //myhierarchy dropdown
        if (
            req.body.hierachy === "myhierarchy" &&
            (listpageaccessmode === "Hierarchy Based" ||
                listpageaccessmode === "Overall")
        ) {
            hierarchy = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: req.body.sector,
            });
            hierarchyDefault = await Hirerarchi.find({
                supervisorchoose: req.body.username,
            });

            let answerDef = hierarchyDefault.map((data) => data.employeename);

            hierarchyFinal =
                req.body.sector === "all"
                    ? answerDef.length > 0
                        ? [].concat(...answerDef)
                        : []
                    : hierarchy.length > 0
                        ? [].concat(...hierarchy.map((item) => item.employeename))
                        : [];
            hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

            hierarchyfilter = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: "Primary",
            });
            primaryhierarchy = hierarchyfilter.map((item) => item.employeename[0])
                ? hierarchyfilter.map((item) => item.employeename[0])
                : [];

            hierarchyfilter1 = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: "Secondary",
            });
            secondaryhierarchy = hierarchyfilter1.map(
                (item) => item.employeename[0]
            )
                ? hierarchyfilter1.map((item) => item.employeename[0])
                : [];

            hierarchyfilter2 = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: "Tertiary",
            });
            tertiaryhierarchy = hierarchyfilter2.map((item) => item.employeename[0])
                ? hierarchyfilter2.map((item) => item.employeename[0])
                : [];

            resulted = result
                .map((userObj) => {
                    const matchingHierarchy = hierarchyDefault.find(
                        (hierarchyObj) =>
                            hierarchyObj.employeename[0] == userObj.companyname
                    );
                    return {
                        companyname: userObj.companyname,
                        branchname: userObj.branchname,
                        unitname: userObj.unitname,
                        projectvendor: userObj.projectvendor,
                        process: userObj.process,
                        loginid: userObj.loginid,
                        date: userObj.date,
                        dateformatted: userObj.dateformatted,
                        mode: userObj.mode,
                        invalidcheck: userObj.invalidcheck,
                        errorfilename: userObj.errorfilename,
                        documentnumber: userObj.documentnumber,
                        documenttype: userObj.documenttype,
                        fieldname: userObj.fieldname,
                        line: userObj.line,
                        errorvalue: userObj.errorvalue,
                        correctvalue: userObj.correctvalue,
                        link: userObj.link,
                        doclink: userObj.doclink,
                        filename: userObj.filename,
                        dateformat: userObj.dateformat,
                        _id: userObj._id,
                        level: matchingHierarchy ? matchingHierarchy.level : "",
                        control: matchingHierarchy ? matchingHierarchy.control : "",
                    };
                })
                .filter((data) => hierarchyMap.includes(data.companyname));
        }

        if (
            req.body.hierachy === "allhierarchy" &&
            (listpageaccessmode === "Hierarchy Based" ||
                listpageaccessmode === "Overall")
        ) {
            hierarchySecond = await Hirerarchi.find(
                {},
                { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
            );
            let sectorFinal = req.body.sector == "all"
                ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

            hierarchyDefault = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: { $in: sectorFinal },

            });

            // console.log(hierarchyDefault, "hierarchyDefault")

            let answerDef = hierarchyDefault
                .map((data) => data.employeename)
                .flat();





            function findEmployeesRecursive(
                currentSupervisors,
                processedSupervisors,
                result
            ) {
                const filteredData = hierarchySecond.filter((item) =>
                    item.supervisorchoose.some(
                        (supervisor) =>
                            currentSupervisors.includes(supervisor) &&
                            (req.body.sector == "all"
                                ? ["Primary", "Secondary", "Tertiary"].includes(item.level) : req.body.sector == item.level) &&
                            !processedSupervisors.has(supervisor)
                    )
                );

                if (filteredData.length === 0) {
                    return result;
                }

                const newEmployees = filteredData.reduce((employees, item) => {
                    employees.push(...item.employeename);
                    processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
                    return employees;
                }, []);

                const uniqueNewEmployees = [...new Set(newEmployees)];
                result = [...result, ...filteredData];
                // console.log(result, "result")
                return findEmployeesRecursive(
                    uniqueNewEmployees,
                    processedSupervisors,
                    result
                );
            }

            const processedSupervisors = new Set();
            const filteredOverallItem = findEmployeesRecursive(
                answerDef,
                processedSupervisors,
                []
            );
            let answerDeoverall = filteredOverallItem
                .filter((data) =>
                    req.body.sector == "all"
                        ? ["Primary", "Secondary", "Tertiary"].includes(data.level)
                        : data.level == req.body.sector
                )
                .map((item) => item.employeename[0]);

            resultedTeam = result
                .map((userObj) => {
                    const matchingHierarchycontrol = filteredOverallItem.find(
                        (hierarchyObj) =>
                            hierarchyObj.employeename[0] == userObj.companyname
                    );
                    return {
                        companyname: userObj.companyname,
                        branchname: userObj.branchname,
                        unitname: userObj.unitname,
                        projectvendor: userObj.projectvendor,
                        process: userObj.process,
                        loginid: userObj.loginid,
                        date: userObj.date,
                        dateformatted: userObj.dateformatted,
                        mode: userObj.mode,
                        invalidcheck: userObj.invalidcheck,
                        errorfilename: userObj.errorfilename,
                        documentnumber: userObj.documentnumber,
                        documenttype: userObj.documenttype,
                        fieldname: userObj.fieldname,
                        line: userObj.line,
                        errorvalue: userObj.errorvalue,
                        correctvalue: userObj.correctvalue,
                        link: userObj.link,
                        doclink: userObj.doclink,
                        filename: userObj.filename,
                        dateformat: userObj.dateformat,
                        status: userObj.status,
                        _id: userObj._id,
                        level: matchingHierarchycontrol
                            ? matchingHierarchycontrol.level
                            : "",
                        control: matchingHierarchycontrol
                            ? matchingHierarchycontrol.control
                            : "",
                    };
                })
                .filter((data) => answerDeoverall.includes(data.companyname));



            let hierarchyallfinal = await Hirerarchi.find({
                employeename: { $in: answerDeoverall.map((item) => item) },
                level: req.body.sector,
            });

            hierarchyFinal =
                req.body.sector === "all"
                    ? answerDeoverall.length > 0
                        ? [].concat(...answerDeoverall)
                        : []
                    : hierarchyallfinal.length > 0
                        ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
                        : [];


            finalDataRestrictList = hierarchyFinal


            primaryhierarchyall = resultedTeam
                .filter((item) => item.level == "Primary")
                .map((item) => item.companyname);

            secondaryhierarchyall = resultedTeam
                .filter((item) => item.level == "Secondary")
                .map((item) => item.companyname);

            tertiaryhierarchyall = resultedTeam
                .filter((item) => item.level == "Tertiary")
                .map((item) => item.companyname);
        }
        // console.log(hierarchyFinal, "hierarchyFinal")
        //my + all hierarchy list dropdown

        if (
            req.body.hierachy === "myallhierarchy" &&
            (listpageaccessmode === "Hierarchy Based" ||
                listpageaccessmode === "Overall")
        ) {
            hierarchySecond = await Hirerarchi.find(
                {},
                { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
            );

            let sectorFinal = req.body.sector == "all"
                ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

            hierarchyDefault = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: { $in: sectorFinal },

            });

            let answerDef = hierarchyDefault.map((data) => data.employeename);

            function findEmployeesRecursive(
                currentSupervisors,
                processedSupervisors,
                result
            ) {
                const filteredData = hierarchySecond.filter((item) =>
                    item.supervisorchoose.some(
                        (supervisor) =>
                            currentSupervisors.includes(supervisor) &&
                            (req.body.sector == "all"
                                ? ["Primary", "Secondary", "Tertiary"].includes(item.level) : req.body.sector == item.level) &&
                            !processedSupervisors.has(supervisor)
                    )
                );

                if (filteredData.length === 0) {
                    return result;
                }

                const newEmployees = filteredData.reduce((employees, item) => {
                    employees.push(...item.employeename);
                    processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
                    return employees;
                }, []);

                const uniqueNewEmployees = [...new Set(newEmployees)];
                result = [...result, ...filteredData];

                return findEmployeesRecursive(
                    uniqueNewEmployees,
                    processedSupervisors,
                    result
                );
            }

            const processedSupervisors = new Set();
            const filteredOverallItem = findEmployeesRecursive(
                [req.body.username],
                processedSupervisors,
                []
            );
            let answerDeoverall = filteredOverallItem
                .filter((data) =>
                    req.body.sector == "all"
                        ? ["Primary", "Secondary", "Tertiary"].includes(data.level)
                        : data.level == req.body.sector
                )
                .map((item) => item.employeename[0]);


            // console.log(answerDeoverall.length, "answerDeoverall")

            filteredoverall = result
                .map((userObj) => {
                    const matchingHierarchycontrol = filteredOverallItem.find(
                        (hierarchyObj) =>
                            hierarchyObj.employeename[0] == userObj.companyname
                    );
                    return {
                        companyname: userObj.companyname,
                        branchname: userObj.branchname,
                        uploadcount: userObj.uploadcount,
                        unitname: userObj.unitname,
                        projectvendor: userObj.projectvendor,
                        process: userObj.process,
                        loginid: userObj.loginid,
                        date: userObj.date,
                        dateformatted: userObj.dateformatted,
                        mode: userObj.mode,
                        errorfilename: userObj.errorfilename,
                        documentnumber: userObj.documentnumber,
                        documenttype: userObj.documenttype,
                        fieldname: userObj.fieldname,
                        invalidcheck: userObj.invalidcheck,
                        status: userObj.status,
                        line: userObj.line,
                        errorvalue: userObj.errorvalue,
                        correctvalue: userObj.correctvalue,
                        link: userObj.link,
                        doclink: userObj.doclink,
                        filename: userObj.filename,
                        dateformat: userObj.dateformat,
                        _id: userObj._id,
                        createdAt: userObj.createdAt,
                        level: matchingHierarchycontrol
                            ? matchingHierarchycontrol.level
                            : "",
                        control: matchingHierarchycontrol
                            ? matchingHierarchycontrol.control
                            : "",
                    };
                })
                .filter((data) =>
                    answerDeoverall.includes(data.companyname));


            // console.log(filteredoverall.length, "filteredoverall")

            let hierarchyallfinal = await Hirerarchi.find({
                employeename: { $in: answerDeoverall.map((item) => item) },
                level: req.body.sector,
            });

            hierarchyFinal =
                req.body.sector === "all"
                    ? answerDeoverall.length > 0
                        ? [].concat(...answerDeoverall)
                        : []
                    : hierarchyallfinal.length > 0
                        ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
                        : [];
            finalDataRestrictList = hierarchyFinal
            primaryhierarchyfinal = filteredoverall
                .filter((item) => item.level == "Primary")
                .map((item) => item.companyname);

            secondaryhierarchyfinal = filteredoverall
                .filter((item) => item.level == "Secondary")
                .map((item) => item.companyname);

            tertiaryhierarchyfinal = filteredoverall
                .filter((item) => item.level == "Tertiary")
                .map((item) => item.companyname);
        }

        if (listpageaccessmode === "Reporting to Based") {
            reportingtobaseduser = result.map((userObj) => {
                return {
                    companyname: userObj.companyname,
                    branchname: userObj.branchname,
                    unitname: userObj.unitname,
                    projectvendor: userObj.projectvendor,
                    queuename: userObj.queuename,
                    loginid: userObj.loginid,
                    date: userObj.date,
                    accuracy: userObj.accuracy,
                    errorcount: userObj.errorcount,
                    totalfields: userObj.totalfields,
                    autocount: userObj.autocount,
                    invalidcheck: userObj.invalidcheck,
                    status: userObj.status,
                    filename: userObj.filename,
                    manualerror: userObj.manualerror,
                    manualtotal: userObj.manualtotal,
                    _id: userObj._id,
                    level: "",
                    control: "",
                };
            });
        }



        let finalsupervisor = req.body.hierachy == "myhierarchy" ? resulted?.map(Data => Data?.companyname) : req.body.hierachy == "allhierarchy" ? resultedTeam?.map(Data => Data?.companyname) : filteredoverall?.map(Data => Data?.companyname)
        const restrictTeam = await Hirerarchi.aggregate([
            {
                $match: {
                    $or: [
                        {
                            supervisorchoose: { $in: finalsupervisor } // Matches if supervisorchoose field has a value in finalsupervisor
                        },
                        {
                            employeename: { $in: finalsupervisor }     // Matches if employeename field has a value in finalsupervisor
                        }
                    ],
                    level: { $in: levelFinal } // Matches if level field has a value in levelFinal
                },
            },
            {
                $lookup: {
                    from: "reportingheaders",
                    let: {
                        teamControlsArray: {
                            $ifNull: ["$pagecontrols", []]
                        }
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $in: [
                                                "$name",
                                                "$$teamControlsArray"
                                            ]
                                        }, // Check if 'name' is in 'teamcontrols' array
                                        {
                                            $in: [
                                                req?.body?.pagename,
                                                "$reportingnew" // Check if 'menuteamloginstatus' is in 'reportingnew' array
                                            ]
                                        } // Additional condition for reportingnew array
                                    ]
                                }
                            }
                        }
                    ],
                    as: "reportData" // The resulting matched documents will be in this field
                }
            },
            {
                $project: {
                    supervisorchoose: 1,
                    employeename: 1,
                    reportData: 1
                }
            }
        ]);

        let restrictListTeam = restrictTeam?.filter(data => data?.reportData?.length > 0)?.flatMap(Data => Data?.employeename)
        const resultAccessFilterHierarchy = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : filteredoverall;
        resultAccessFilter = restrictListTeam?.length > 0 ? resultAccessFilterHierarchy?.filter(data => restrictListTeam?.includes(data?.companyname)) : [];

    } catch (err) {
        console.log(err, "err");
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!resultAccessFilter) {
        return next(new ErrorHandler("No data found!", 404));
    }
    return res.status(200).json({
        // result
        // resulted,
        // resultedTeam,
        // branch,
        // hierarchy,
        // overallMyallList,
        resultAccessFilter,
        // primaryhierarchy,
        //  secondaryhierarchy,
        //  tertiaryhierarchy,
        //  primaryhierarchyall,
        //  secondaryhierarchyall,
        //  tertiaryhierarchyall,
        //  primaryhierarchyfinal,
        //  secondaryhierarchyfinal, tertiaryhierarchyfinal,
    });
}
);


exports.getAllValidateErrorEntryHierarchyList = catchAsyncErrors(async (req, res, next) => {
    let result,
        reportingtobaseduser,
        clientuserid,
        hierarchy,
        resultAccessFilter,
        secondaryhierarchyfinal,
        tertiaryhierarchyfinal,
        primaryhierarchyfinal,
        hierarchyfilter,
        filteredoverall,
        primaryhierarchy,
        hierarchyfilter1,
        secondaryhierarchy,
        hierarchyfilter2,
        tertiaryhierarchy,
        primaryhierarchyall,
        secondaryhierarchyall,
        tertiaryhierarchyall,
        branch,
        hierarchySecond,
        overallMyallList,
        hierarchyMap,
        resulted,
        resultedTeam,
        myallTotalNames,
        hierarchyFinal,
        hierarchyDefault,
        reportingusers,
        penaltyerrorupload, bulkerrorupload;

    try {
        const { listpageaccessmode } = req.body;
        let clientidsmap;
        let levelFinal = req.body?.sector === "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body?.sector]

        // console.log(levelFinal, "levelFinal")
        if (listpageaccessmode === "Reporting to Based") {
            let usersss = await User.find(
                {
                    enquirystatus: {
                        $nin: ["Enquiry Purpose"],
                    },

                    resonablestatus: {
                        $nin: [
                            "Not Joined",
                            "Postponed",
                            "Rejected",
                            "Closed",
                            "Releave Employee",
                            "Absconded",
                            "Hold",
                            "Terminate",
                        ],
                    },
                    reportingto: req.body.username,
                },
                {
                    empcode: 1,
                    companyname: 1,
                }
            ).lean();


            const companyNames = usersss.map((user) => user.companyname);
            // console.log(companyNames, "companyNames")
            let clientids = await ClientUserid.find(
                {
                    // projectvendor: { $in: vendorNames },
                    empname: { $in: companyNames },
                },
                { userid: 1 }
            ).lean();

            clientidsmap = clientids.map((user) => user.userid);
        }

        let querypenalty = {


            status: "Valid",

            date: { $gte: req.body.fromdate, $lte: req.body.todate },

            ...(listpageaccessmode === "Reporting to Based"
                ? { user: { $in: clientidsmap } }
                : {}),

        }

        console.log(req.body.fromdate, req.body.todate, "valid")

        let querybulk = {


            status: "Valid",

            date: { $gte: req.body.fromdate, $lte: req.body.todate },

            ...(listpageaccessmode === "Reporting to Based"
                ? { user: { $in: clientidsmap } }
                : {}),

        }
        // console.log(querypenalty, "querypenalty")




        penaltyerrorupload = await PenaltyErrorUpload.find(querypenalty, {});

        bulkerrorupload = await BulkErrorUpload.find(querybulk, {});


        let prodresult = [...penaltyerrorupload, ...bulkerrorupload]


        console.log(prodresult.length, "loeeeeeee")




        clientuserid = await ClientUserid.find(
            { loginallotlog: { $exists: true, $ne: [] } },
            { empname: 1, userid: 1, loginallotlog: 1, projectvendor: 1 }
        ).lean();

        result = prodresult.map((item) => {
            const loginInfo = clientuserid.filter((d) => d.userid == item.loginid && d.projectvendor == item.projectvendor);

            let loginallot = loginInfo.length > 0 ? loginInfo.map(d => d.loginallotlog).flat() : [];
            // console.log(loginallot, "loginallot")
            let filteredDataDateTime = null;
            if (loginallot.length > 0) {
                const groupedByDateTime = {};

                // Group items by date and time
                loginallot.forEach((item) => {
                    const dateTime = item.date + " " + item.time;
                    if (!groupedByDateTime[dateTime]) {
                        groupedByDateTime[dateTime] = [];
                    }
                    groupedByDateTime[dateTime].push(item);
                });

                // Extract the last item of each group
                const lastItemsForEachDateTime = Object.values(groupedByDateTime).map(
                    (group) => group[group.length - 1]
                );

                // Sort the last items by date and time
                lastItemsForEachDateTime.sort((a, b) => {
                    return (
                        new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
                    );
                });

                // Find the first item in the sorted array that meets the criteria

                for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                    const dateTime =
                        lastItemsForEachDateTime[i].date + " " + lastItemsForEachDateTime[i].time;
                    // let datevalsplit = item.mode === "Manual" ? "" : upload.dateval.split(" IST");
                    let datevalsplitfinal = item.date;
                    // console.log(new Date(dateTime), new Date(datevalsplitfinal), "opopop")
                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break;
                    }
                }
            }
            // console.log(filteredDataDateTime, "filteredDataDateTime")
            let logininfoempname =
                loginallot.length > 0 && filteredDataDateTime
                    ? filteredDataDateTime.empname
                    : loginInfo.length == 1
                        ? loginInfo[0].empname
                        : "";
            let logininfobranch =
                loginallot.length > 0 && filteredDataDateTime
                    ? filteredDataDateTime.branch
                    : loginInfo.length == 1
                        ? loginInfo[0].branch
                        : "";
            let logininfounit =
                loginallot.length > 0 && filteredDataDateTime
                    ? filteredDataDateTime.unit
                    : loginInfo.length == 1
                        ? loginInfo[0].unit
                        : "";

            // let logininfoempname = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
            // let logininfobranch = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.branch : loginInfo ? loginInfo.branch : "";
            // let logininfounit = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.unit : loginInfo ? loginInfo.unit : "";

            return {
                ...item._doc,
                projectvendor: item.projectvendor,
                process: item.process,
                loginid: item.loginid,
                date: item.date,
                dateformatted: item.dateformatted,
                mode: item.mode,
                errorfilename: item.errorfilename,
                documentnumber: item.documentnumber,
                documenttype: item.documenttype,
                fieldname: item.fieldname,
                line: item.line,
                errorvalue: item.errorvalue,
                correctvalue: item.correctvalue,
                link: item.link,
                validcheck: item.validcheck,
                doclink: item.doclink,
                filename: item.filename,
                dateformat: item.dateformat,
                status: item.status,
                _id: item._id,
                companyname: logininfoempname,
                branchname: logininfobranch,
                unitname: logininfounit,
            };
        });

        console.log(result.length, "resutl")

        //myhierarchy dropdown
        if (
            req.body.hierachy === "myhierarchy" &&
            (listpageaccessmode === "Hierarchy Based" ||
                listpageaccessmode === "Overall")
        ) {
            hierarchy = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: req.body.sector,
            });
            hierarchyDefault = await Hirerarchi.find({
                supervisorchoose: req.body.username,
            });

            let answerDef = hierarchyDefault.map((data) => data.employeename);

            hierarchyFinal =
                req.body.sector === "all"
                    ? answerDef.length > 0
                        ? [].concat(...answerDef)
                        : []
                    : hierarchy.length > 0
                        ? [].concat(...hierarchy.map((item) => item.employeename))
                        : [];
            hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

            hierarchyfilter = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: "Primary",
            });
            primaryhierarchy = hierarchyfilter.map((item) => item.employeename[0])
                ? hierarchyfilter.map((item) => item.employeename[0])
                : [];

            hierarchyfilter1 = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: "Secondary",
            });
            secondaryhierarchy = hierarchyfilter1.map(
                (item) => item.employeename[0]
            )
                ? hierarchyfilter1.map((item) => item.employeename[0])
                : [];

            hierarchyfilter2 = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: "Tertiary",
            });
            tertiaryhierarchy = hierarchyfilter2.map((item) => item.employeename[0])
                ? hierarchyfilter2.map((item) => item.employeename[0])
                : [];

            resulted = result
                .map((userObj) => {
                    const matchingHierarchy = hierarchyDefault.find(
                        (hierarchyObj) =>
                            hierarchyObj.employeename[0] == userObj.companyname
                    );
                    return {
                        companyname: userObj.companyname,
                        branchname: userObj.branchname,
                        unitname: userObj.unitname,
                        projectvendor: userObj.projectvendor,
                        process: userObj.process,
                        loginid: userObj.loginid,
                        date: userObj.date,
                        dateformatted: userObj.dateformatted,
                        mode: userObj.mode,
                        errorfilename: userObj.errorfilename,
                        documentnumber: userObj.documentnumber,
                        documenttype: userObj.documenttype,
                        fieldname: userObj.fieldname,
                        line: userObj.line,
                        validcheck: userObj.validcheck,
                        errorvalue: userObj.errorvalue,
                        correctvalue: userObj.correctvalue,
                        link: userObj.link,
                        doclink: userObj.doclink,
                        filename: userObj.filename,
                        dateformat: userObj.dateformat,
                        _id: userObj._id,
                        level: matchingHierarchy ? matchingHierarchy.level : "",
                        control: matchingHierarchy ? matchingHierarchy.control : "",
                    };
                })
                .filter((data) => hierarchyMap.includes(data.companyname));
        }

        if (
            req.body.hierachy === "allhierarchy" &&
            (listpageaccessmode === "Hierarchy Based" ||
                listpageaccessmode === "Overall")
        ) {
            hierarchySecond = await Hirerarchi.find(
                {},
                { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
            );
            let sectorFinal = req.body.sector == "all"
                ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

            hierarchyDefault = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: { $in: sectorFinal },

            });

            // console.log(hierarchyDefault, "hierarchyDefault")

            let answerDef = hierarchyDefault
                .map((data) => data.employeename)
                .flat();





            function findEmployeesRecursive(
                currentSupervisors,
                processedSupervisors,
                result
            ) {
                const filteredData = hierarchySecond.filter((item) =>
                    item.supervisorchoose.some(
                        (supervisor) =>
                            currentSupervisors.includes(supervisor) &&
                            (req.body.sector == "all"
                                ? ["Primary", "Secondary", "Tertiary"].includes(item.level) : req.body.sector == item.level) &&
                            !processedSupervisors.has(supervisor)
                    )
                );

                if (filteredData.length === 0) {
                    return result;
                }

                const newEmployees = filteredData.reduce((employees, item) => {
                    employees.push(...item.employeename);
                    processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
                    return employees;
                }, []);

                const uniqueNewEmployees = [...new Set(newEmployees)];
                result = [...result, ...filteredData];
                // console.log(result, "result")
                return findEmployeesRecursive(
                    uniqueNewEmployees,
                    processedSupervisors,
                    result
                );
            }

            const processedSupervisors = new Set();
            const filteredOverallItem = findEmployeesRecursive(
                answerDef,
                processedSupervisors,
                []
            );
            let answerDeoverall = filteredOverallItem
                .filter((data) =>
                    req.body.sector == "all"
                        ? ["Primary", "Secondary", "Tertiary"].includes(data.level)
                        : data.level == req.body.sector
                )
                .map((item) => item.employeename[0]);

            resultedTeam = result
                .map((userObj) => {
                    const matchingHierarchycontrol = filteredOverallItem.find(
                        (hierarchyObj) =>
                            hierarchyObj.employeename[0] == userObj.companyname
                    );
                    return {
                        companyname: userObj.companyname,
                        branchname: userObj.branchname,
                        unitname: userObj.unitname,
                        projectvendor: userObj.projectvendor,
                        process: userObj.process,
                        validcheck: userObj.validcheck,
                        loginid: userObj.loginid,
                        date: userObj.date,
                        dateformatted: userObj.dateformatted,
                        mode: userObj.mode,
                        errorfilename: userObj.errorfilename,
                        documentnumber: userObj.documentnumber,
                        documenttype: userObj.documenttype,
                        fieldname: userObj.fieldname,
                        line: userObj.line,
                        errorvalue: userObj.errorvalue,
                        correctvalue: userObj.correctvalue,
                        link: userObj.link,
                        doclink: userObj.doclink,
                        filename: userObj.filename,
                        dateformat: userObj.dateformat,
                        status: userObj.status,
                        _id: userObj._id,
                        level: matchingHierarchycontrol
                            ? matchingHierarchycontrol.level
                            : "",
                        control: matchingHierarchycontrol
                            ? matchingHierarchycontrol.control
                            : "",
                    };
                })
                .filter((data) => answerDeoverall.includes(data.companyname));



            let hierarchyallfinal = await Hirerarchi.find({
                employeename: { $in: answerDeoverall.map((item) => item) },
                level: req.body.sector,
            });

            hierarchyFinal =
                req.body.sector === "all"
                    ? answerDeoverall.length > 0
                        ? [].concat(...answerDeoverall)
                        : []
                    : hierarchyallfinal.length > 0
                        ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
                        : [];


            finalDataRestrictList = hierarchyFinal


            primaryhierarchyall = resultedTeam
                .filter((item) => item.level == "Primary")
                .map((item) => item.companyname);

            secondaryhierarchyall = resultedTeam
                .filter((item) => item.level == "Secondary")
                .map((item) => item.companyname);

            tertiaryhierarchyall = resultedTeam
                .filter((item) => item.level == "Tertiary")
                .map((item) => item.companyname);
        }
        // console.log(hierarchyFinal, "hierarchyFinal")
        //my + all hierarchy list dropdown

        if (
            req.body.hierachy === "myallhierarchy" &&
            (listpageaccessmode === "Hierarchy Based" ||
                listpageaccessmode === "Overall")
        ) {
            hierarchySecond = await Hirerarchi.find(
                {},
                { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
            );

            let sectorFinal = req.body.sector == "all"
                ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

            hierarchyDefault = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: { $in: sectorFinal },

            });

            let answerDef = hierarchyDefault.map((data) => data.employeename);

            function findEmployeesRecursive(
                currentSupervisors,
                processedSupervisors,
                result
            ) {
                const filteredData = hierarchySecond.filter((item) =>
                    item.supervisorchoose.some(
                        (supervisor) =>
                            currentSupervisors.includes(supervisor) &&
                            (req.body.sector == "all"
                                ? ["Primary", "Secondary", "Tertiary"].includes(item.level) : req.body.sector == item.level) &&
                            !processedSupervisors.has(supervisor)
                    )
                );

                if (filteredData.length === 0) {
                    return result;
                }

                const newEmployees = filteredData.reduce((employees, item) => {
                    employees.push(...item.employeename);
                    processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
                    return employees;
                }, []);

                const uniqueNewEmployees = [...new Set(newEmployees)];
                result = [...result, ...filteredData];

                return findEmployeesRecursive(
                    uniqueNewEmployees,
                    processedSupervisors,
                    result
                );
            }

            const processedSupervisors = new Set();
            const filteredOverallItem = findEmployeesRecursive(
                [req.body.username],
                processedSupervisors,
                []
            );
            let answerDeoverall = filteredOverallItem
                .filter((data) =>
                    req.body.sector == "all"
                        ? ["Primary", "Secondary", "Tertiary"].includes(data.level)
                        : data.level == req.body.sector
                )
                .map((item) => item.employeename[0]);


            // console.log(answerDeoverall.length, "answerDeoverall")

            filteredoverall = result
                .map((userObj) => {
                    const matchingHierarchycontrol = filteredOverallItem.find(
                        (hierarchyObj) =>
                            hierarchyObj.employeename[0] == userObj.companyname
                    );
                    return {
                        companyname: userObj.companyname,
                        branchname: userObj.branchname,
                        uploadcount: userObj.uploadcount,
                        unitname: userObj.unitname,
                        projectvendor: userObj.projectvendor,
                        process: userObj.process,
                        loginid: userObj.loginid,
                        date: userObj.date,
                        dateformatted: userObj.dateformatted,
                        mode: userObj.mode,
                        errorfilename: userObj.errorfilename,
                        documentnumber: userObj.documentnumber,
                        documenttype: userObj.documenttype,
                        validcheck: userObj.validcheck,
                        fieldname: userObj.fieldname,
                        status: userObj.status,
                        line: userObj.line,
                        errorvalue: userObj.errorvalue,
                        correctvalue: userObj.correctvalue,
                        link: userObj.link,
                        doclink: userObj.doclink,
                        filename: userObj.filename,
                        dateformat: userObj.dateformat,
                        _id: userObj._id,
                        createdAt: userObj.createdAt,
                        level: matchingHierarchycontrol
                            ? matchingHierarchycontrol.level
                            : "",
                        control: matchingHierarchycontrol
                            ? matchingHierarchycontrol.control
                            : "",
                    };
                })
                .filter((data) =>
                    answerDeoverall.includes(data.companyname));



            let hierarchyallfinal = await Hirerarchi.find({
                employeename: { $in: answerDeoverall.map((item) => item) },
                level: req.body.sector,
            });

            hierarchyFinal =
                req.body.sector === "all"
                    ? answerDeoverall.length > 0
                        ? [].concat(...answerDeoverall)
                        : []
                    : hierarchyallfinal.length > 0
                        ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
                        : [];
            finalDataRestrictList = hierarchyFinal
            primaryhierarchyfinal = filteredoverall
                .filter((item) => item.level == "Primary")
                .map((item) => item.companyname);

            secondaryhierarchyfinal = filteredoverall
                .filter((item) => item.level == "Secondary")
                .map((item) => item.companyname);

            tertiaryhierarchyfinal = filteredoverall
                .filter((item) => item.level == "Tertiary")
                .map((item) => item.companyname);
        }

        if (listpageaccessmode === "Reporting to Based") {
            reportingtobaseduser = result.map((userObj) => {
                return {
                    companyname: userObj.companyname,
                    branchname: userObj.branchname,
                    unitname: userObj.unitname,
                    projectvendor: userObj.projectvendor,
                    queuename: userObj.queuename,
                    loginid: userObj.loginid,
                    date: userObj.date,
                    accuracy: userObj.accuracy,
                    errorcount: userObj.errorcount,
                    totalfields: userObj.totalfields,
                    autocount: userObj.autocount,
                    validcheck: userObj.validcheck,
                    status: userObj.status,
                    filename: userObj.filename,
                    manualerror: userObj.manualerror,
                    manualtotal: userObj.manualtotal,
                    _id: userObj._id,
                    level: "",
                    control: "",
                };
            });
        }



        let finalsupervisor = req.body.hierachy == "myhierarchy" ? resulted?.map(Data => Data?.companyname) : req.body.hierachy == "allhierarchy" ? resultedTeam?.map(Data => Data?.companyname) : filteredoverall?.map(Data => Data?.companyname)
        console.log(finalsupervisor, "finalsupervisor")

        const restrictTeam = await Hirerarchi.aggregate([
            {
                $match: {
                    $or: [
                        {
                            supervisorchoose: { $in: finalsupervisor } // Matches if supervisorchoose field has a value in finalsupervisor
                        },
                        {
                            employeename: { $in: finalsupervisor }     // Matches if employeename field has a value in finalsupervisor
                        }
                    ],
                    level: { $in: levelFinal } // Matches if level field has a value in levelFinal
                },
            },
            {
                $lookup: {
                    from: "reportingheaders",
                    let: {
                        teamControlsArray: {
                            $ifNull: ["$pagecontrols", []]
                        }
                    },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        {
                                            $in: [
                                                "$name",
                                                "$$teamControlsArray"
                                            ]
                                        }, // Check if 'name' is in 'teamcontrols' array
                                        {
                                            $in: [
                                                req?.body?.pagename,
                                                "$reportingnew" // Check if 'menuteamloginstatus' is in 'reportingnew' array
                                            ]
                                        } // Additional condition for reportingnew array
                                    ]
                                }
                            }
                        }
                    ],
                    as: "reportData" // The resulting matched documents will be in this field
                }
            },
            {
                $project: {
                    supervisorchoose: 1,
                    employeename: 1,
                    reportData: 1
                }
            }
        ]);
        console.log(restrictTeam, "restrictTeam")
        let restrictListTeam = restrictTeam?.filter(data => data?.reportData?.length > 0)?.flatMap(Data => Data?.employeename)
        const resultAccessFilterHierarchy = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : filteredoverall;
        resultAccessFilter = restrictListTeam?.length > 0 ? resultAccessFilterHierarchy?.filter(data => restrictListTeam?.includes(data?.companyname)) : [];

    } catch (err) {
        console.log(err, "err");
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!resultAccessFilter) {
        return next(new ErrorHandler("No data found!", 404));
    }
    return res.status(200).json({
        // result
        // resulted,
        // resultedTeam,
        // branch,
        // hierarchy,
        // overallMyallList,
        resultAccessFilter,
        // primaryhierarchy,
        //  secondaryhierarchy,
        //  tertiaryhierarchy,
        //  primaryhierarchyall,
        //  secondaryhierarchyall,
        //  tertiaryhierarchyall,
        //  primaryhierarchyfinal,
        //  secondaryhierarchyfinal, tertiaryhierarchyfinal,
    });
}
);


//check manager
// exports.getAllCheckManagerPenaltyTotal = catchAsyncErrors(async (req, res, next) => {
//     let checkmanager;
//     try {
//         const { vendor, process, loginid, date } = req.body
//         let query = {

//             projectvendor: vendor, queuename: process, loginid: loginid, date: date,
//             iseditedtotal: { $in: [true, "true"] }

//         }


//         checkmanager = await Penaltytotalfieldupload.countDocuments(query)
//         //  console.log(checkmanager, query, "checkmanager")

//     } catch (err) {
//         return next(new ErrorHandler("Records not found!", 404));
//     }
//     // if (!checkmanager) {
//     //     return next(new ErrorHandler("Penaltytotalfieldupload not found!", 404));
//     // }
//     return res.status(200).json({
//         // count: products.length,
//         checkmanager,
//     });
// });


exports.getAllCheckManagerPenaltyTotal = catchAsyncErrors(async (req, res, next) => {
    let checkmanager;
    try {
        const { vendor, process, loginid, date } = req.body;
        // Parse the incoming date as 'DD-MM-YYYY' and format to 'YYYY-MM-DD'
        const formattedDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');
        checkmanager = await Penaltytotalfieldupload.countDocuments({
            projectvendor: vendor,
            queuename: process,
            loginid: loginid,
            date: formattedDate,
            iseditedtotal: { $in: [true, "true"] }
        });
        console.log(checkmanager, "checkmanager");
    } catch (err) {
        console.log(err, "err")
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        checkmanager,
    });
});








