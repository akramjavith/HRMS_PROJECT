const Penaltytotalfieldupload = require("../../../model/modules/penalty/penaltytotalfieldupload");
const PenaltyErrorUpload = require("../../../model/modules/penalty/penaltyerrorupload");
const BulkErrorUpload = require("../../../model/modules/penalty/bulkerrorupload");
const ClientUserid = require("../../../model/modules/production/ClientUserIDModel")
const PenaltyErrorControl = require('../../../model/modules/production/errorcontrol');
const Hirerarchi = require("../../../model/modules/setup/hierarchy");
const Users = require("../../../model/login/auth")
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const moment = require("moment");
const Penaltydayupload = require("../../../model/modules/penalty/penaltydayupload");
const DepartmentMonth = require("../../../model/modules/departmentmonthset");
// const Penaltywaivermaster = require("../../../model/modules/penalty/penaltywaivermaster");
const Penaltywaivermaster = [];

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
        }, { projectvendor: 1, mode: 1, process: 1, queuename: 1, filename: 1, addedby: 1, loginid: 1, accuracy: 1, totalfields: 1, errorcount: 1, autocount: 1 }).lean();
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


exports.getPenaltyTotalFieldLoginProject = catchAsyncErrors(async (req, res, next) => {
    let errormodes, clientuserid, filteredErrorModes, bulkerrorupload;

    const { fromdate, todate } = req.body;

    try {

        //   const skip = (page - 1) * pageSize;
        //  const limit = pageSize;

        loginids = await ClientUserid.find({ "loginallotlog.empname": req.body.companyname }, { userid: 1, loginallotlog: 1, projectvendor: 1 }).lean();

        let logs = loginids.flatMap((user) =>
            user.loginallotlog.map((log) => ({
                userid: user.userid,
                _id: user._id,
                projectvendor: user.projectvendor,
                date: log.date,
                time: log.time,
                empname: log.empname,
                empcode: log.empcode,
                enddate: log.enddate ? log.enddate : null,
            }))
        );
        // console.log(logs, "logs")
        // Step 2: Sort logs by date and time (ascending order)
        logs.sort((a, b) => {
            if (a.date === b.date) {
                return a.time.localeCompare(b.time);
            }
            return new Date(a.date) - new Date(b.date);
        });

        // Step 3: Calculate the enddate for each log (except the last log for each userid)
        const userLogsMap = {};
        logs.forEach((log) => {
            if (!userLogsMap[log.userid]) {
                userLogsMap[log.userid] = {};
            }

            if (!userLogsMap[log.userid][log.projectvendor]) {
                userLogsMap[log.userid][log.projectvendor] = [];
            }

            userLogsMap[log.userid][log.projectvendor].push(log);
        });

        Object.values(userLogsMap).forEach((userLogs) => {
            Object.values(userLogs).forEach((logsArray) => {
                logsArray.forEach((log, idx) => {
                    if (idx < logsArray.length - 1) {
                        log.enddate = logsArray[idx + 1].date;
                    }
                });
            });
        });
        // Step 4: Filter logs based on input date
        const filteredLogs = logs.filter((log) => {
            return new Date(log.date) <= new Date(fromdate) && (!log.enddate || new Date(log.enddate) >= new Date(fromdate));
        });

        // Step 5: Sort the filtered logs by date and time (descending order)
        filteredLogs.sort((a, b) => {
            if (a.date === b.date) {
                return b.time.localeCompare(a.time);
            }
            return new Date(b.date) - new Date(a.date);
        });
        clientuserid = filteredLogs.filter((d) => d.empname === req.body.companyname);

        console.log(clientuserid.map((d) => d.userid), "filteredErrorModes1")

        filteredErrorModes = await Penaltytotalfieldupload.aggregate([
            {
                $match: {
                    date: { $gte: fromdate, $lte: todate },
                    $or: [
                        clientuserid.map((d) => ({
                            loginid: d.userid,
                            projectvendor: d.projectvendor

                        }))
                    ],
                    // loginid: { $in: clientuserid.map((d) => d.userid) },
                    isedited: { $ne: "true" },
                    accuracy: { $nin: ["NA", "NA "] },
                },
            },

            {
                $lookup: {
                    from: "penaltyerroruploads",
                    let: { loginid: "$loginid", date: "$date", process: "$queuename", project: "$projectvendor" },
                    pipeline: [
                        {
                            $match: { loginid: { $in: clientuserid.map((d) => d.userid) } },
                        },
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$loginid", "$$loginid"] },
                                        { $eq: ["$date", "$$date"] },
                                        { $eq: ["$process", "$$process"] },
                                        { $eq: ["$projectvendor", "$$project"] }
                                    ],
                                },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    as: "penaltyErrors",
                },
            },
            {
                $lookup: {
                    from: "bulkerroruploads",
                    let: { loginid: "$loginid", date: "$date", process: "$queuename", project: "$projectvendor" },
                    pipeline: [
                        {
                            $match: { loginid: { $in: clientuserid.map((d) => d.userid) } },
                        },
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$loginid", "$$loginid"] },
                                        { $eq: ["$dateformatted", "$$date"] },
                                        { $eq: ["$process", "$$process"] },
                                        { $eq: ["$projectvendor", "$$project"] }
                                    ],
                                },
                            },
                        },
                        {
                            $group: {
                                _id: null,
                                count: { $sum: 1 },
                            },
                        },
                    ],
                    as: "bulkErrors",
                },
            },
            {
                $addFields: {
                    penaltyCount: { $ifNull: [{ $arrayElemAt: ["$penaltyErrors.count", 0] }, 0] },
                    bulkCount: { $ifNull: [{ $arrayElemAt: ["$bulkErrors.count", 0] }, 0] },
                    uploadcount: {
                        $add: [
                            { $ifNull: [{ $arrayElemAt: ["$penaltyErrors.count", 0] }, 0] },
                            { $ifNull: [{ $arrayElemAt: ["$bulkErrors.count", 0] }, 0] }
                        ]
                    },
                },
            },
            {
                $project: {
                    projectvendor: 1,
                    queuename: 1,
                    loginid: 1,
                    date: 1,
                    accuracy: 1,
                    errorcount: 1,
                    totalfields: 1,
                    mode: 1,
                    autocount: 1,
                    manualerror: 1,
                    isedited: 1,
                    uploadcount: 1,
                    name: req.body.companyname,
                    branch: req.body.branch,
                    unit: req.body.unit
                },
            },
        ]);

        errormodes = filteredErrorModes.filter(item => item != null)
        console.log(errormodes.length, "errormodes")

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
    let validatefinal, validatefinalData, penaltyerrorupload, bulkerrorupload, errorcontrol;
    try {

        const { projectvendor, process, loginid, fromdate, todate, batchNumber, batchSize } = req.body;

        console.log(req.body, "body")

        let query = {}

        let querypenalty = {};
        if (projectvendor && projectvendor.length > 0) {
            query.projectvendor = { $in: projectvendor };
            querypenalty.projectvendor = { $in: projectvendor };
        }

        if (process && process.length > 0) {
            query.process = { $in: process };
            querypenalty.process = { $in: process };
        }

        if (loginid && loginid.length > 0) {
            query.loginid = { $in: loginid };
            querypenalty.loginid = { $in: loginid };
        }

        if (fromdate && todate) {
            query.dateformatted = { $gte: fromdate, $lte: todate };
            querypenalty.date = { $gte: fromdate, $lte: todate };
        }
        errorcontrol = await PenaltyErrorControl.find({}, { projectvendor: 1, process: 1, mode: 1 })


        penaltyerrorupload = await PenaltyErrorUpload.find(querypenalty, {
            projectvendor: 1, process: 1, loginid: 1, date: 1, errorfilename: 1, documentnumber: 1, documenttype: 1, fieldname: 1, editedcount: 1,
            line: 1, errorvalue: 1, correctvalue: 1, link: 1, doclink: 1, mode: 1,
        })


        bulkerrorupload = await BulkErrorUpload.find(query, {
            editedcount: 1,
            projectvendor: 1, process: 1, loginid: 1, dateformat: 1, dateformatted: 1, mode: 1, errorfilename: 1, documentnumber: 1, documenttype: 1, fieldname: 1,
            line: 1, errorvalue: 1, correctvalue: 1, link: 1, doclink: 1, mode: 1,
        })

        // console.log(bulkerrorupload, "bulkerrorupload")


        validatefinalData = [...penaltyerrorupload, ...bulkerrorupload]

        const userids = [...new Set(validatefinalData.map(item => item.loginid))];
        let loginids = await ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] }, allotted: "allotted", userid: { $in: userids } });

        validatefinal = validatefinalData.map(upload => {
            const loginInfo = loginids.find((login) => login.userid === upload.loginid &&
                login.projectvendor == upload.projectvendor);

            const errorcontrolInfo = errorcontrol.find((error) => error.projectvendor === upload.projectvendor &&
                error.process == upload.process);

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
                unit: logininfounit,
                errormode: errorcontrolInfo ? errorcontrolInfo.mode : ""


            };
        });


        // console.log(validatefinal, 'sks')
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


//error upload confirm
exports.getAllErrorUploadHierarchyList = catchAsyncErrors(
    async (req, res, next) => {
        let resultall = [];
        let result, reportingtobaseduser, hierarchyfirstlevel,
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
        let resultsectorother = []
        let filteredoverallsectorall = []
        try {
            const { listpageaccessmode, batchNumber, batchSize } = req.body;
            const vendorNames = req.body.vendor.map((vendor) => vendor.value);

            //   const skip = (batchNumber - 1) * batchSize;
            //const limit = batchSize;

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
            penaltyerrorupload = await PenaltyErrorUpload.find({ projectvendor: { $in: vendorNames }, date: { $gte: req.body.fromdate, $lte: req.body.todate }, }, { projectvendor: 1, process: 1, loginid: 1, date: 1, mode: 1 });
            bulkerrorupload = await BulkErrorUpload.find({ projectvendor: { $in: vendorNames }, dateformatted: { $gte: req.body.fromdate, $lte: req.body.todate }, }, { projectvendor: 1, process: 1, loginid: 1, dateformatted: 1, mode: 1 });
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
                    mode: 1,
                    filename: 1,
                    manualerror: 1,
                    manualtotal: 1,
                    uploadcount: 1,
                    createdAt: 1,
                    _id: 1,
                }
            )


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
                            ...userObj,
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
                            ...userObj,
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

                //alert there is no sector

                if (resultedTeam.length == 0) {

                    hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: req.body.sector, });
                    //  let hierarchySecond2 = await Hirerarchi.find({});
                    hierarchySecond = await Hirerarchi.find(
                        {},
                        { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
                    );

                    hierarchyDefault = await Hirerarchi.find({
                        //     supervisorchoose: req.body.username,
                        //  level: { $nin: sectorFinal },

                    });

                    console.log(hierarchySecond.length, "hierarchyDefault")

                    let answerDef = hierarchyDefault
                        .map((data) => data.employeename)
                        .flat();
                    console.log(answerDef, "answerDef")
                    function findEmployeesRecursive(
                        currentSupervisors,
                        processedSupervisorsallsector,
                        resultsectorother
                    ) {
                        const filteredData = hierarchySecond.filter((item) =>
                            item.supervisorchoose.some(
                                (supervisor) =>
                                    currentSupervisors.includes(supervisor) &&

                                    !processedSupervisorsallsector.has(supervisor)
                            )
                        );

                        if (filteredData.length === 0) {
                            return resultsectorother;
                        }

                        const newEmployees = filteredData.reduce((employees, item) => {
                            employees.push(...item.employeename);
                            processedSupervisorsallsector.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
                            return employees;
                        }, []);

                        const uniqueNewEmployees = [...new Set(newEmployees)];
                        resultsectorother = [...resultsectorother, ...filteredData];
                        // console.log(result, "result")
                        return findEmployeesRecursive(
                            uniqueNewEmployees,
                            processedSupervisorsallsector,
                            resultsectorother
                        );
                    }

                    const processedSupervisorsallsector = new Set();
                    const filteredOverallItem = findEmployeesRecursive(
                        answerDef,
                        processedSupervisorsallsector,
                        []
                    );

                    console.log(processedSupervisorsallsector, "processedSupervisorsallsector");
                    //  console.log(filteredOverallItem.map((item) => item.employeename), "filteredOverallItem");

                    let answerDeoverall = filteredOverallItem.map((item) => item.employeename ? item.employeename[0] : "");

                    console.log("Count of data in other sectors:", answerDeoverall);

                    filteredoverallsectorall = resultsectorother.filter((data) =>
                        answerDeoverall.includes(data.companyname)
                    ).length;

                    console.log("filteredoverallsectorall:", filteredoverallsectorall);
                }

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
            let countDifferentSector = 0
            if (
                req.body.hierachy === "myallhierarchy" &&
                (listpageaccessmode === "Hierarchy Based" ||
                    listpageaccessmode === "Overall")
            ) {
                hierarchySecond = await Hirerarchi.find({}, { employeename: 1, supervisorchoose: 1, level: 1, control: 1 });

                let sectorFinal = req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

                hierarchyDefault = await Hirerarchi.find({ supervisorchoose: req.body.username, level: { $in: sectorFinal }, });

                function findEmployeesRecursive(currentSupervisors, processedSupervisors, result) {
                    const filteredData = hierarchySecond.filter((item) =>
                        item.supervisorchoose.some(
                            (supervisor) =>
                                currentSupervisors.includes(supervisor) &&
                                (req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"].includes(item.level) : req.body.sector == item.level) &&
                                !processedSupervisors.has(supervisor)
                        )
                    );

                    if (filteredData.length === 0) { return result }

                    const newEmployees = filteredData.reduce((employees, item) => {
                        employees.push(...item.employeename);
                        processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
                        return employees;
                    }, []);

                    const uniqueNewEmployees = [...new Set(newEmployees)];
                    result = [...result, ...filteredData];

                    return findEmployeesRecursive(uniqueNewEmployees, processedSupervisors, result);
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



                // console.log("Count of data in other sectors:", countDifferentSector);

                filteredoverall = result
                    .map((userObj) => {
                        const matchingHierarchycontrol = filteredOverallItem.find(
                            (hierarchyObj) =>
                                hierarchyObj.employeename[0] == userObj.companyname
                        );
                        return {
                            ...userObj,
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



                //alert there is no sector
                if (filteredoverall.length == 0) {

                    let hierarchySecond2 = await Hirerarchi.find();
                    hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: req.body.sector, });
                    console.log(hierarchyfirstlevel, "hierarchyfirstlevel")

                    function findEmployeesRecursive(currentSupervisors, processedSupervisorsallsector, resultsectorother) {
                        const filteredData = hierarchySecond2.filter((item) =>
                            item.supervisorchoose.some(
                                (supervisor) =>
                                    currentSupervisors.includes(supervisor) &&

                                    // (req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"].includes(item.level) : req.body.sector == item.level) &&
                                    !processedSupervisorsallsector.has(supervisor)
                            )
                        );

                        console.log(filteredData.length, "l;lp");
                        if (filteredData.length === 0) {
                            return resultsectorother; // No more employees to process
                        }

                        // Collect new employees
                        const newEmployees = filteredData.reduce((employees, item) => {
                            employees.push(...item.employeename);
                            processedSupervisorsallsector.add(item.supervisorchoose[0]); // Track processed supervisors
                            return employees;
                        }, []);

                        // Prevent duplicates
                        const uniqueNewEmployees = [...new Set(newEmployees)];

                        // **Modify `resultall` in place** instead of reassigning it
                        resultsectorother.push(...filteredData);

                        // console.log(result, "resultall1");

                        // Recursive call with new employees
                        return findEmployeesRecursive(uniqueNewEmployees, processedSupervisorsallsector, resultsectorother);
                    }

                    const processedSupervisorsallsector = new Set();
                    // const resultall = []; // Define `resultall` outside to maintain reference

                    const filteredOverallItem = findEmployeesRecursive(
                        [req.body.username],
                        processedSupervisorsallsector,
                        resultsectorother // Pass the reference instead of a new array
                    );

                    console.log(processedSupervisorsallsector, "processedSupervisorsallsector");
                    //   console.log(filteredOverallItem.map((item) => item.employeename), "filteredOverallItem");

                    let answerDeoverall = filteredOverallItem.map((item) => item.employeename ? item.employeename[0] : "");

                    console.log("Count of data in other sectors:", answerDeoverall);

                    filteredoverallsectorall = resultsectorother.filter((data) =>
                        answerDeoverall.includes(data.companyname)
                    ).length;

                    console.log("filteredoverallsectorall:", filteredoverallsectorall);
                }

                // console.log(filteredoverall.length, "filteredoverall")

                // let hierarchyallfinal = await Hirerarchi.find({
                //     employeename: { $in: answerDeoverall.map((item) => item) },
                //     level: req.body.sector,
                // });

                // hierarchyFinal =
                //     req.body.sector === "all"
                //         ? answerDeoverall.length > 0
                //             ? [].concat(...answerDeoverall)
                //             : []
                //         : hierarchyallfinal.length > 0
                //             ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
                //             : [];
                // finalDataRestrictList = hierarchyFinal
                // primaryhierarchyfinal = filteredoverall
                //     .filter((item) => item.level == "Primary")
                //     .map((item) => item.companyname);

                // secondaryhierarchyfinal = filteredoverall
                //     .filter((item) => item.level == "Secondary")
                //     .map((item) => item.companyname);

                // tertiaryhierarchyfinal = filteredoverall
                //     .filter((item) => item.level == "Tertiary")
                //     .map((item) => item.companyname);
            }

            if (listpageaccessmode === "Reporting to Based") {
                reportingtobaseduser = result.map((userObj) => {
                    return {
                        ...userObj,
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
            console.log(resultAccessFilter, finalsupervisor.length, "erroruploadconfirm")
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
            hierarchyfirstlevel,
            filteredoverallsectorall,
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

//invalid error entry
exports.getAllInvalidErrorEntryHierarchyList = catchAsyncErrors(async (req, res, next) => {
    let result,
        reportingtobaseduser,
        clientuserid,
        hierarchyfirstlevel,
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
    let resultsectorother = [];

    let filteredoverallsectorall = []

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
            movedstatus: { $ne: true },
            date: { $gte: req.body.fromdate, $lte: req.body.todate },

            ...(listpageaccessmode === "Reporting to Based"
                ? { user: { $in: clientidsmap } }
                : {}),

        }



        let querybulk = {


            status: "Invalid",
            movedstatus: { $ne: true },
            dateformatted: { $gte: req.body.fromdate, $lte: req.body.todate },

            ...(listpageaccessmode === "Reporting to Based"
                ? { user: { $in: clientidsmap } }
                : {}),

        }
        console.log(querybulk, "querybulk")




        penaltyerrorupload = await PenaltyErrorUpload.find(querypenalty, {});

        bulkerrorupload = await BulkErrorUpload.find(querybulk, {});
        console.log(bulkerrorupload.length, "kkk")

        let prodresult = [...penaltyerrorupload, ...bulkerrorupload]


        console.log(prodresult.length, "valid")




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
        resultsectorother = result
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
                        ...userObj,
                        companyname: userObj.companyname,
                        branchname: userObj.branchname,
                        editedcount: userObj.editedcount,
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

                        errorseverity: userObj.errorseverity,
                        errortype: userObj.errortype,
                        explanation: userObj.explanation,
                        reason: userObj.reason,

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
                        ...userObj,
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

                        errorseverity: userObj.errorseverity,
                        errortype: userObj.errortype,
                        explanation: userObj.explanation,
                        reason: userObj.reason,
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


            //alert there is no sector
            console.log(resultedTeam.length, "sdf")
            if (resultedTeam.length == 0) {

                hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: req.body.sector, });
                //  let hierarchySecond2 = await Hirerarchi.find({});
                hierarchySecond = await Hirerarchi.find(
                    {},
                    { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
                );

                hierarchyDefault = await Hirerarchi.find({
                    //     supervisorchoose: req.body.username,
                    //  level: { $nin: sectorFinal },

                });

                console.log(hierarchySecond.length, "hierarchyDefault")

                let answerDef = hierarchyDefault
                    .map((data) => data.employeename)
                    .flat();
                console.log(answerDef, "answerDef")
                function findEmployeesRecursive(
                    currentSupervisors,
                    processedSupervisorsallsector,
                    resultsectorother
                ) {
                    const filteredData = hierarchySecond.filter((item) =>
                        item.supervisorchoose.some(
                            (supervisor) =>
                                currentSupervisors.includes(supervisor) &&

                                !processedSupervisorsallsector.has(supervisor)
                        )
                    );

                    if (filteredData.length === 0) {
                        return resultsectorother;
                    }

                    const newEmployees = filteredData.reduce((employees, item) => {
                        employees.push(...item.employeename);
                        processedSupervisorsallsector.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
                        return employees;
                    }, []);

                    const uniqueNewEmployees = [...new Set(newEmployees)];
                    resultsectorother = [...resultsectorother, ...filteredData];
                    // console.log(result, "result")
                    return findEmployeesRecursive(
                        uniqueNewEmployees,
                        processedSupervisorsallsector,
                        resultsectorother
                    );
                }

                const processedSupervisorsallsector = new Set();
                const filteredOverallItem = findEmployeesRecursive(
                    answerDef,
                    processedSupervisorsallsector,
                    []
                );

                console.log(processedSupervisorsallsector, "processedSupervisorsallsector");
                //  console.log(filteredOverallItem.map((item) => item.employeename), "filteredOverallItem");

                let answerDeoverall = filteredOverallItem.map((item) => item.employeename ? item.employeename[0] : "");

                console.log("Count of data in other sectors:", answerDeoverall);

                filteredoverallsectorall = resultsectorother.filter((data) =>
                    answerDeoverall.includes(data.companyname)
                ).length;

                console.log("filteredoverallsectorall:", filteredoverallsectorall);
            }




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
                        ...userObj,
                        companyname: userObj.companyname,
                        branchname: userObj.branchname,
                        editedcount: userObj.editedcount,
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
                        errorseverity: userObj.errorseverity,
                        errortype: userObj.errortype,
                        explanation: userObj.explanation,
                        reason: userObj.reason,
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

            //alert there is no sector
            if (filteredoverall.length == 0) {
                hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: req.body.sector, });
                let hierarchySecond2 = await Hirerarchi.find({});

                function findEmployeesRecursive(currentSupervisors, processedSupervisorsallsector, resultsectorother) {
                    const filteredData = hierarchySecond2.filter((item) =>
                        item.supervisorchoose.some(
                            (supervisor) =>
                                currentSupervisors.includes(supervisor) &&
                                !processedSupervisorsallsector.has(supervisor)
                        )
                    );

                    //   console.log(filteredData.length, "l;lp");
                    if (filteredData.length === 0) {
                        return resultsectorother; // No more employees to process
                    }

                    // Collect new employees
                    const newEmployees = filteredData.reduce((employees, item) => {
                        employees.push(...item.employeename);
                        processedSupervisorsallsector.add(item.supervisorchoose[0]); // Track processed supervisors
                        return employees;
                    }, []);

                    // Prevent duplicates
                    const uniqueNewEmployees = [...new Set(newEmployees)];

                    // **Modify `resultall` in place** instead of reassigning it
                    resultsectorother.push(...filteredData);

                    // Recursive call with new employees
                    return findEmployeesRecursive(uniqueNewEmployees, processedSupervisorsallsector, resultsectorother);
                }

                const processedSupervisorsallsector = new Set();

                const filteredOverallItem = findEmployeesRecursive(
                    [req.body.username],
                    processedSupervisorsallsector,
                    resultsectorother // Pass the reference instead of a new array
                );

                //    console.log(processedSupervisorsallsector, "processedSupervisorsallsector");
                //   console.log(filteredOverallItem.map((item) => item.employeename), "filteredOverallItem");

                let answerDeoverall = filteredOverallItem.map((item) => item.employeename ? item.employeename[0] : "");

                console.log("Count of data in other sectors:", answerDeoverall);

                filteredoverallsectorall = resultsectorother.filter((data) =>
                    answerDeoverall.includes(data.companyname)
                ).length;



                //  console.log("filteredoverallsectorall:", filteredoverallsectorall);
            }




            // let hierarchyallfinal = await Hirerarchi.find({
            //     employeename: { $in: answerDeoverall.map((item) => item) },
            //     level: req.body.sector,
            // });

            // hierarchyFinal =
            //     req.body.sector === "all"
            //         ? answerDeoverall.length > 0
            //             ? [].concat(...answerDeoverall)
            //             : []
            //         : hierarchyallfinal.length > 0
            //             ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
            //             : [];
            // finalDataRestrictList = hierarchyFinal
            // primaryhierarchyfinal = filteredoverall
            //     .filter((item) => item.level == "Primary")
            //     .map((item) => item.companyname);

            // secondaryhierarchyfinal = filteredoverall
            //     .filter((item) => item.level == "Secondary")
            //     .map((item) => item.companyname);

            // tertiaryhierarchyfinal = filteredoverall
            //     .filter((item) => item.level == "Tertiary")
            //     .map((item) => item.companyname);
        }

        if (listpageaccessmode === "Reporting to Based") {
            reportingtobaseduser = result.map((userObj) => {
                return {
                    ...userObj,
                    companyname: userObj.companyname,
                    branchname: userObj.branchname,
                    editedcount: userObj.editedcount,
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
                    errorseverity: userObj.errorseverity,
                    errortype: userObj.errortype,
                    explanation: userObj.explanation,
                    reason: userObj.reason,
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
        // console.log(restrictTeam, "restrictTeam")
        let restrictListTeam = restrictTeam?.filter(data => data?.reportData?.length > 0)?.flatMap(Data => Data?.employeename)
        // console.log(restrictListTeam, "restrictListTeam")
        const resultAccessFilterHierarchy = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : filteredoverall;
        resultAccessFilter = restrictListTeam?.length > 0 ? resultAccessFilterHierarchy?.filter(data => restrictListTeam?.includes(data?.companyname)) : [];
        // console.log(resultAccessFilter[0], "resultAccessFilterinvalid")
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
        hierarchyfirstlevel,
        filteredoverallsectorall,
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

//valid error entry

exports.getAllValidateErrorEntryHierarchyList = catchAsyncErrors(async (req, res, next) => {
    let result,
        reportingtobaseduser,
        clientuserid,
        hierarchyfirstlevel,
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
    let resultsectorother = []
    let filteredoverallsectorall = []

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



        let querybulk = {


            status: "Valid",

            dateformatted: { $gte: req.body.fromdate, $lte: req.body.todate },

            ...(listpageaccessmode === "Reporting to Based"
                ? { user: { $in: clientidsmap } }
                : {}),

        }
        // console.log(querypenalty, "querypenalty")




        penaltyerrorupload = await PenaltyErrorUpload.find(querypenalty, {});

        bulkerrorupload = await BulkErrorUpload.find(querybulk, {});


        let prodresult = [...penaltyerrorupload, ...bulkerrorupload]


        //console.log(prodresult, "valideee")




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
                validokcheck: item.validokcheck,
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

        // console.log(result, "resutl")
        resultsectorother = result
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
                        ...userObj,
                        companyname: userObj.companyname,
                        branchname: userObj.branchname,
                        editedcount: userObj.editedcount,
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
                        status: userObj.status,
                        link: userObj.link,
                        doclink: userObj.doclink,
                        filename: userObj.filename,
                        dateformat: userObj.dateformat,
                        validokcheck: userObj.validokcheck,

                        errorseverity: userObj.errorseverity,
                        errortype: userObj.errortype,
                        explanation: userObj.explanation,
                        reason: userObj.reason,




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
                        ...userObj,
                        companyname: userObj.companyname,
                        branchname: userObj.branchname,
                        editedcount: userObj.editedcount,
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
                        validokcheck: userObj.validokcheck,
                        errorseverity: userObj.errorseverity,
                        errortype: userObj.errortype,
                        explanation: userObj.explanation,
                        reason: userObj.reason,
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

            //alert there is no sector

            if (resultedTeam.length == 0) {

                hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: req.body.sector, });
                //  let hierarchySecond2 = await Hirerarchi.find({});
                hierarchySecond = await Hirerarchi.find(
                    {},
                    { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
                );

                hierarchyDefault = await Hirerarchi.find({
                    //     supervisorchoose: req.body.username,
                    //  level: { $nin: sectorFinal },

                });

                console.log(hierarchySecond.length, "hierarchyDefault")

                let answerDef = hierarchyDefault
                    .map((data) => data.employeename)
                    .flat();
                console.log(answerDef, "answerDef")
                function findEmployeesRecursive(
                    currentSupervisors,
                    processedSupervisorsallsector,
                    resultsectorother
                ) {
                    const filteredData = hierarchySecond.filter((item) =>
                        item.supervisorchoose.some(
                            (supervisor) =>
                                currentSupervisors.includes(supervisor) &&

                                !processedSupervisorsallsector.has(supervisor)
                        )
                    );

                    if (filteredData.length === 0) {
                        return resultsectorother;
                    }

                    const newEmployees = filteredData.reduce((employees, item) => {
                        employees.push(...item.employeename);
                        processedSupervisorsallsector.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
                        return employees;
                    }, []);

                    const uniqueNewEmployees = [...new Set(newEmployees)];
                    resultsectorother = [...resultsectorother, ...filteredData];
                    // console.log(result, "result")
                    return findEmployeesRecursive(
                        uniqueNewEmployees,
                        processedSupervisorsallsector,
                        resultsectorother
                    );
                }

                const processedSupervisorsallsector = new Set();
                const filteredOverallItem = findEmployeesRecursive(
                    answerDef,
                    processedSupervisorsallsector,
                    []
                );

                console.log(processedSupervisorsallsector, "processedSupervisorsallsector");
                //  console.log(filteredOverallItem.map((item) => item.employeename), "filteredOverallItem");

                let answerDeoverall = filteredOverallItem.map((item) => item.employeename ? item.employeename[0] : "");

                console.log("Count of data in other sectors:", answerDeoverall);

                filteredoverallsectorall = resultsectorother.filter((data) =>
                    answerDeoverall.includes(data.companyname)
                ).length;

                console.log("filteredoverallsectorall:", filteredoverallsectorall);
            }



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
                        ...userObj,
                        companyname: userObj.companyname,
                        branchname: userObj.branchname,
                        editedcount: userObj.editedcount,
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
                        validokcheck: userObj.validokcheck,
                        errorseverity: userObj.errorseverity,
                        errortype: userObj.errortype,
                        explanation: userObj.explanation,
                        reason: userObj.reason,
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


            //alert there is no sector
            if (filteredoverall.length == 0) {
                hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: req.body.sector, });
                let hierarchySecond2 = await Hirerarchi.find({});

                function findEmployeesRecursive(currentSupervisors, processedSupervisorsallsector, resultsectorother) {
                    const filteredData = hierarchySecond2.filter((item) =>
                        item.supervisorchoose.some(
                            (supervisor) =>
                                currentSupervisors.includes(supervisor) &&
                                !processedSupervisorsallsector.has(supervisor)
                        )
                    );

                    //   console.log(filteredData.length, "l;lp");
                    if (filteredData.length === 0) {
                        return resultsectorother; // No more employees to process
                    }

                    // Collect new employees
                    const newEmployees = filteredData.reduce((employees, item) => {
                        employees.push(...item.employeename);
                        processedSupervisorsallsector.add(item.supervisorchoose[0]); // Track processed supervisors
                        return employees;
                    }, []);

                    // Prevent duplicates
                    const uniqueNewEmployees = [...new Set(newEmployees)];

                    // **Modify `resultall` in place** instead of reassigning it
                    resultsectorother.push(...filteredData);

                    // console.log(result, "resultall1");

                    // Recursive call with new employees
                    return findEmployeesRecursive(uniqueNewEmployees, processedSupervisorsallsector, resultsectorother);
                }

                const processedSupervisorsallsector = new Set();
                // const resultall = []; // Define `resultall` outside to maintain reference

                const filteredOverallItem = findEmployeesRecursive(
                    [req.body.username],
                    processedSupervisorsallsector,
                    resultsectorother // Pass the reference instead of a new array
                );

                //    console.log(processedSupervisorsallsector, "processedSupervisorsallsector");
                //   console.log(filteredOverallItem.map((item) => item.employeename), "filteredOverallItem");

                let answerDeoverall = filteredOverallItem.map((item) => item.employeename ? item.employeename[0] : "");

                //   console.log("Count of data in other sectors:", answerDeoverall);

                filteredoverallsectorall = resultsectorother.filter((data) =>
                    answerDeoverall.includes(data.companyname)
                ).length;

                //  console.log("filteredoverallsectorall:", filteredoverallsectorall);
            }



            // let hierarchyallfinal = await Hirerarchi.find({
            //     employeename: { $in: answerDeoverall.map((item) => item) },
            //     level: req.body.sector,
            // });

            // hierarchyFinal =
            //     req.body.sector === "all"
            //         ? answerDeoverall.length > 0
            //             ? [].concat(...answerDeoverall)
            //             : []
            //         : hierarchyallfinal.length > 0
            //             ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
            //             : [];
            // finalDataRestrictList = hierarchyFinal
            // primaryhierarchyfinal = filteredoverall
            //     .filter((item) => item.level == "Primary")
            //     .map((item) => item.companyname);

            // secondaryhierarchyfinal = filteredoverall
            //     .filter((item) => item.level == "Secondary")
            //     .map((item) => item.companyname);

            // tertiaryhierarchyfinal = filteredoverall
            //     .filter((item) => item.level == "Tertiary")
            //     .map((item) => item.companyname);
        }

        if (listpageaccessmode === "Reporting to Based") {
            reportingtobaseduser = result.map((userObj) => {
                return {
                    ...userObj,
                    companyname: userObj.companyname,
                    branchname: userObj.branchname,
                    editedcount: userObj.editedcount,
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
                    validokcheck: userObj.validokcheck,
                    errorseverity: userObj.errorseverity,
                    errortype: userObj.errortype,
                    explanation: userObj.explanation,
                    reason: userObj.reason,
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
        filteredoverallsectorall,
        resultAccessFilter,
        hierarchyfirstlevel,
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
//         const { vendor, process, loginid, date } = req.body;

//         // Parse the incoming date as 'DD-MM-YYYY' and format to 'YYYY-MM-DD'
//         const formattedDate = moment(date, 'DD-MM-YYYY').format('YYYY-MM-DD');

//         checkmanager = await Penaltytotalfieldupload.countDocuments({
//             projectvendor: vendor,
//             queuename: process,
//             loginid: loginid,
//             date: formattedDate
//         });

//         console.log(checkmanager, "checkmanager");

//     } catch (err) {
//         return next(new ErrorHandler("Records not found!", 404));
//     }

//     return res.status(200).json({
//         checkmanager,
//     });
// });

exports.getAllPenaltytotalfielduploadInvalidReject = catchAsyncErrors(async (req, res, next) => {
    let penaltytotalfielduploads, penaltyerrorupload, bulkerrorupload;
    try {

        //     const { projectvendor, process, loginid, date } = req.body;
        //    let query ={}
        //    query.projectvendor =projectvendor;
        //    query.queuename =process;
        //    query.loginid =loginid;
        //    query.date =date;

        //    penaltytotalfielduploads = await Penaltytotalfieldupload.findOneAndUpdate(
        //     query, // Find the document with outerId and where data._id matches innerId
        //         {

        //             $set: {
        //                 "isedited": "",
        //                 "iseditedtotal": "",
        //                 "manualtotal": "",
        //                 "manualerror": "",
        //             }
        //         }, // Set the matched array element to updateData
        //         { new: true } // Return the updated document
        //     );

        //     penaltytotalfielduploads = await Penaltytotalfieldupload.find(query,{});

        const { projectvendor, process, loginid, date } = req.body;

        // Validate inputs


        const query = {
            projectvendor,
            queuename: process,
            loginid,
            date,
        };

        // Update documents
        await Penaltytotalfieldupload.updateMany(query, {
            $set: {
                "isedited": "",
                "iseditedtotal": "",
                "manualtotal": "",
                "manualerror": "",
            },
        });

        // Fetch updated documents
        penaltytotalfielduploads = await Penaltytotalfieldupload.find(query);



    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        // count: products.length,
        penaltytotalfielduploads,
    });
});



exports.getAllValidOkEntryAlert = catchAsyncErrors(async (req, res, next) => {
    let count;

    try {
        const { date } = req.body.date;

        count = await Penaltydayupload.countDocuments({ date: date }, {});
        return res.status(200).json({
            count,
        });
    } catch (err) {
        console.log(err, "err");
        return next(new ErrorHandler("Records not found!", 404));
    }
});

exports.getAllValidOkEntry = catchAsyncErrors(async (req, res, next) => {
    let finalvalue;

    try {
        const { date } = req.body.date;
        let querypenalty = {
            iseditedtotal: "true",
            date: req.body.date,
        };
        let querynotconfirm = {
            $or: [{ iseditedtotal: { $ne: "true" } }, { isedited: { $ne: "true" } }],
            date: req.body.date,
        };
        let userQuery = {
            enquirystatus: {
                $nin: ["Enquiry Purpose"],
            },
            $or: [{ reasondate: { $exists: false } }, { reasondate: { $eq: "" } }, { reasondate: { $gte: date } }],
        };
        let logidQuery = {
            loginallotlog: { $exists: true, $ne: [] },
        };
        // console.log(req.body, "date1");

        let deptMonthQuery = {
            fromdate: { $lte: date },
            todate: { $gte: date },
        };
        // console.log(querypenalty, "querypenalty");
        const [PENATY_TOTAL_FIELD, loginids, usersAll, depMonthSet, errorControls, WAIVER_MASTER, PENALTY_NOT_CONFIRM_COUNT, PENALTY_DAY_COUNT] = await Promise.all([
            Penaltytotalfieldupload.find(querypenalty).lean(),
            ClientUserid.find(logidQuery, { empname: 1, userid: 1, projectvendor: 1, loginallotlog: 1 }).lean(),
            Users.find(userQuery, {
                companyname: 1,
                empcode: 1,
                company: 1,
                departmentlog: 1,
                unit: 1,
                branch: 1,
                team: 1,
                username: 1,
                processlog: 1,
                shifttiming: 1,
                department: 1,
                doj: 1,
                process: 1,
                assignExpLog: 1,
                shiftallot: 1,
                boardingLog: 1,
                intStartDate: 1,
            }).lean(),
            DepartmentMonth.find(deptMonthQuery, { department: 1, year: 1, month: 1, monthname: 1, fromdate: 1, todate: 1, totaldays: 1 }).lean(),
            PenaltyErrorControl.find({ islock: "Open" }, { projectvendor: 1, process: 1, mode: 1, rate: 1, islock: 1 }).lean(),
            Penaltywaivermaster.find().lean(),
            Penaltytotalfieldupload.countDocuments(querynotconfirm).lean(),
            Penaltytotalfieldupload.countDocuments({ date: req.body.date }).lean(),
        ]);

        let users = usersAll.map((item) => {
            let findUserDepartment = item.department;
            let findUserTeam = item.team;
            let findUserProcess = item.process;
            let findexpval = item.experience;

            const dojDate = item.boardingLog.length > 0 ? item.boardingLog[0].startdate : item.doj;

            // Handling team change with boardingLog
            if (item.boardingLog && item.boardingLog.length > 0) {
                // Check if there's any team change
                const teamChangeLog = item.boardingLog.filter((log) => log.logcreation !== "shift" && log.ischangeteam === true);

                if (teamChangeLog.length > 0) {
                    // Sort by startdate descending
                    const sortedTeamLog = teamChangeLog.sort((a, b) => {
                        // First, compare startdate
                        const startDateComparison = new Date(b.startdate) - new Date(a.startdate);
                        if (startDateComparison !== 0) {
                            return startDateComparison;
                        }

                        // If startdate is the same, compare createdat
                        return b.updateddatetime - a.updateddatetime;
                    });

                    // Find the relevant team change based on the 'date'
                    const findTeam = sortedTeamLog.find((log) => new Date(date) >= new Date(log.startdate));
                    findUserTeam = findTeam ? findTeam.team : item.team;
                }
            }

            // Handling department change with departmentlog
            if (item.departmentlog && item.departmentlog.length > 0) {
                if (item.departmentlog.length > 1) {
                    // Sort department logs by startdate descending
                    const sortedDepartmentLog = item.departmentlog.sort((a, b) => {
                        // First, compare startdate
                        const startDateComparison = new Date(b.startdate) - new Date(a.startdate);
                        if (startDateComparison !== 0) {
                            return startDateComparison;
                        }

                        // If startdate is the same, compare createdat
                        return b.updateddatetime - a.updateddatetime;
                    });

                    // Find the relevant department change based on the 'date'
                    const findDept = sortedDepartmentLog.length > 1 && sortedDepartmentLog.map((item) => item.department).includes("Internship") ? sortedDepartmentLog.filter((item) => item.department != "Internship").find((dept) => new Date(date) >= new Date(dept.startdate)) : sortedDepartmentLog.find((dept) => new Date(date) >= new Date(dept.startdate));
                    findUserDepartment = findDept ? findDept.department : item.department;
                } else if (item.departmentlog.length === 1) {
                    findUserDepartment = new Date(date) >= new Date(item.departmentlog[0].startdate) ? item.departmentlog[0].department : item.department;
                } else {
                    findUserDepartment = item.department;
                }
            }

            if (item && item.processlog) {
                const groupedByMonthProcs = {};

                // Group items by month
                item.processlog &&
                    item.processlog
                        ?.sort((a, b) => {
                            return new Date(a.date) - new Date(b.date);
                        })
                        ?.forEach((d) => {
                            const monthYear = d.date?.split("-").slice(0, 2).join("-");
                            if (!groupedByMonthProcs[monthYear]) {
                                groupedByMonthProcs[monthYear] = [];
                            }
                            groupedByMonthProcs[monthYear].push(d);
                        });

                // Extract the last item of each group
                const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

                // Filter the data array based on the month and year
                lastItemsForEachMonthPros.sort((a, b) => {
                    return new Date(a.date) - new Date(b.date);
                });
                // Find the first item in the sorted array that meets the criteria

                for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
                    const date = lastItemsForEachMonthPros[i].date;

                    if (new Date(req.body.date) >= new Date(date)) {
                        findUserProcess = lastItemsForEachMonthPros[i];
                    } else {
                        break;
                    }
                }
            }
            const groupedByMonth = {};
            if (item.assignExpLog && item.assignExpLog.length > 0) {
                const findMonthStartDate = depMonthSet.find((data) => new Date(date) >= new Date(data.fromdate) && new Date(date) <= new Date(data.todate) && data.department == findUserDepartment);
                let findDate = findMonthStartDate ? findMonthStartDate.fromdate : date;
                item.assignExpLog &&
                    item.assignExpLog.length > 0 &&
                    item.assignExpLog
                        .filter((d) => d.expmode != "Auto" && d.expmode != "Manual")
                        .sort((a, b) => {
                            return new Date(a.updatedate) - new Date(b.updatedate);
                        })
                        .forEach((item) => {
                            const monthYear = item.updatedate?.split("-").slice(0, 2).join("-");
                            if (!groupedByMonth[monthYear]) {
                                groupedByMonth[monthYear] = [];
                            }
                            groupedByMonth[monthYear].push(item);
                        });

                // Extract the last item of each group
                const lastItemsForEachMonth = Object.values(groupedByMonth).map((group) => group[group.length - 1]);

                // Find the first item in the sorted array that meets the criteria

                // Find the first item in the sorted array that meets the criteria
                let filteredItem = null;

                for (let i = 0; i < lastItemsForEachMonth.length; i++) {
                    const date1 = lastItemsForEachMonth[i].updatedate;

                    if (date >= date1) {
                        filteredItem = lastItemsForEachMonth[i];
                    } else {
                        break;
                    }
                }

                let modevalue = filteredItem;

                const calculateMonthsBetweenDates = (startDate, endDate) => {
                    if (startDate && endDate) {
                        const start = new Date(startDate);
                        const end = new Date(endDate);

                        let years = end.getFullYear() - start.getFullYear();
                        let months = end.getMonth() - start.getMonth();
                        let days = end.getDate() - start.getDate();

                        // Convert years to months
                        months += years * 12;

                        // Adjust for negative days
                        if (days < 0) {
                            months -= 1; // Subtract a month
                            days += new Date(end.getFullYear(), end.getMonth(), 0).getDate(); // Add days of the previous month
                        }

                        // Adjust for days 15 and above
                        if (days >= 15) {
                            months += 1; // Count the month if 15 or more days have passed
                        }

                        return months <= 0 ? 0 : months;
                    }

                    return 0; // Return 0 if either date is missing
                };

                // Calculate difference in months between findDate and item.doj
                let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
                if (modevalue) {
                    //findexp end difference yes/no
                    if (modevalue.endexp === "Yes") {
                        differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, modevalue.endexpdate);
                        //  Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                        if (modevalue.expmode === "Add") {
                            differenceInMonthsexp += parseInt(modevalue.expval);
                        } else if (modevalue.expmode === "Minus") {
                            differenceInMonthsexp -= parseInt(modevalue.expval);
                        } else if (modevalue.expmode === "Fix") {
                            differenceInMonthsexp = parseInt(modevalue.expval);
                        }
                    } else {
                        differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                        // Math.floor((new Date(findDate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                        if (modevalue.expmode === "Add") {
                            differenceInMonthsexp += parseInt(modevalue.expval);
                        } else if (modevalue.expmode === "Minus") {
                            differenceInMonthsexp -= parseInt(modevalue.expval);
                        } else if (modevalue.expmode === "Fix") {
                            differenceInMonthsexp = parseInt(modevalue.expval);
                        } else {
                            // differenceInMonths = parseInt(modevalue.expval);
                            differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                        }
                    }

                    //findtar end difference yes/no
                    if (modevalue.endtar === "Yes") {
                        differenceInMonthstar = calculateMonthsBetweenDates(item.doj, modevalue.endtardate);
                        //  Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
                        if (modevalue.expmode === "Add") {
                            differenceInMonthstar += parseInt(modevalue.expval);
                        } else if (modevalue.expmode === "Minus") {
                            differenceInMonthstar -= parseInt(modevalue.expval);
                        } else if (modevalue.expmode === "Fix") {
                            differenceInMonthstar = parseInt(modevalue.expval);
                        }
                    } else {
                        differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                        if (modevalue.expmode === "Add") {
                            differenceInMonthstar += parseInt(modevalue.expval);
                        } else if (modevalue.expmode === "Minus") {
                            differenceInMonthstar -= parseInt(modevalue.expval);
                        } else if (modevalue.expmode === "Fix") {
                            differenceInMonthstar = parseInt(modevalue.expval);
                        } else {
                            // differenceInMonths = parseInt(modevalue.expval);
                            differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                        }
                    }

                    differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                    if (modevalue.expmode === "Add") {
                        differenceInMonths += parseInt(modevalue.expval);
                    } else if (modevalue.expmode === "Minus") {
                        differenceInMonths -= parseInt(modevalue.expval);
                    } else if (modevalue.expmode === "Fix") {
                        differenceInMonths = parseInt(modevalue.expval);
                    } else {
                        // differenceInMonths = parseInt(modevalue.expval);
                        differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                    }
                } else {
                    differenceInMonthsexp = calculateMonthsBetweenDates(item.doj, findDate);
                    differenceInMonthstar = calculateMonthsBetweenDates(item.doj, findDate);
                    differenceInMonths = calculateMonthsBetweenDates(item.doj, findDate);
                }
                // console.log(differenceInMonthstar, modevalue, 'differenceInMonthstar');
                findexpval = differenceInMonthstar < 1 ? "00" : differenceInMonthstar <= 9 ? "0" + differenceInMonthstar : differenceInMonthstar;
            }
            let findUserProcessFinal = findUserProcess ? findUserProcess.process : item.process;

            return {
                ...item,
                department: findUserDepartment,
                team: findUserTeam,
                process: findUserProcessFinal,
                exp: findexpval,
                dojDate: dojDate,
            };
        });
        // console.log(PENATY_TOTAL_FIELD.length, "PENATY_TOTAL_FIELD");
        // Step 1: Flatten the loginallotlog array and include user info
        let logs = loginids.flatMap((user) =>
            user.loginallotlog.map((log) => ({
                userid: user.userid,
                projectvendor: user.projectvendor,
                date: log.date,
                time: log.time,
                empname: log.empname,
                empcode: log.empcode,
                enddate: log.enddate ? log.enddate : null,
            }))
        );
        // console.log(logs.length, "log");
        // Step 2: Sort logs by date and time (ascending order)
        logs.sort((a, b) => {
            if (a.date === b.date) {
                return a.time.localeCompare(b.time);
            }
            return new Date(a.date) - new Date(b.date);
        });

        // Step 3: Calculate the enddate for each log (except the last log for each userid)
        const userLogsMap = {};
        logs.forEach((log) => {
            if (!userLogsMap[log.userid]) {
                userLogsMap[log.userid] = {};
            }

            if (!userLogsMap[log.userid][log.projectvendor]) {
                userLogsMap[log.userid][log.projectvendor] = [];
            }

            userLogsMap[log.userid][log.projectvendor].push(log);
        });

        Object.values(userLogsMap).forEach((userLogs) => {
            Object.values(userLogs).forEach((logsArray) => {
                logsArray.forEach((log, idx) => {
                    if (idx < logsArray.length - 1) {
                        log.enddate = logsArray[idx + 1].date;
                    }
                });
            });
        });

        // Step 4: Filter logs based on input date
        const filteredLogs = logs.filter((log) => {
            return new Date(log.date) <= new Date(req.body.date) && (!log.enddate || new Date(log.enddate) >= new Date(req.body.date));
        });

        // Step 5: Sort the filtered logs by date and time (descending order)
        filteredLogs.sort((a, b) => {
            if (a.date === b.date) {
                return b.time.localeCompare(a.time);
            }
            return new Date(b.date) - new Date(a.date);
        });

        const penaltyerroruploads = await PenaltyErrorUpload.aggregate([
            {
                $match: { date: req.body.date },
            },
            {
                $lookup: {
                    from: "penaltyerrortypes",
                    let: { projectvendor: "$projectvendor", process: "$process", errortype: "$errortype", status: "$status" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ["$projectvendor", "$$projectvendor"] }, { $eq: ["$process", "$$process"] }, { $eq: ["$errortype", "$$errortype"] }, { $eq: ["$status", "$$status"] }],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                penaltycalculation: 1,
                            },
                        },
                    ],
                    as: "penaltyerrortypes",
                },
            },
            {
                $addFields: {
                    penaltycalculation: {
                        $ifNull: [{ $arrayElemAt: ["$penaltyerrortypes.penaltycalculation", 0] }, "No"],
                    },
                },
            },
            {
                $group: {
                    _id: {
                        projectvendor: "$projectvendor",
                        process: "$process",
                        loginid: "$loginid",
                        date: "$date",
                    },
                    movedstatus: {
                        $sum: { $cond: { if: "$movedstatus", then: 1, else: 0 } },
                    },
                    penalty: {
                        $sum: { $cond: { if: { $eq: ["$penaltycalculation", "Yes"] }, then: 1, else: 0 } },
                    },
                    nonpenalty: {
                        $sum: { $cond: { if: { $eq: ["$penaltycalculation", "No"] }, then: 1, else: 0 } },
                    },
                    validatestatus: { $push: { $ifNull: ["$validatestatus", false] } },
                    editedcount: { $push: { $ifNull: ["$editedcount", 0] } },
                    rejectarray: {
                        $push: {
                            $cond: [{ $isArray: "$rejectarray" }, { $size: "$rejectarray" }, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    projectvendor: "$_id.projectvendor",
                    process: "$_id.process",
                    loginid: "$_id.loginid",
                    rejectarray: 1,
                    movedstatus: 1,
                    validatestatus: 1,
                    penalty: 1,
                    editedcount: 1,
                    nonpenalty: 1,
                },
            },
        ]);

        const bulkerroruploads = await BulkErrorUpload.aggregate([
            {
                $match: { dateformatted: req.body.date },
            },
            {
                $lookup: {
                    from: "penaltyerrortypes",
                    let: { projectvendor: "$projectvendor", process: "$process", errortype: "$errortype", status: "$status" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [{ $eq: ["$projectvendor", "$$projectvendor"] }, { $eq: ["$process", "$$process"] }, { $eq: ["$errortype", "$$errortype"] }, { $eq: ["$status", "$$status"] }],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 0,
                                penaltycalculation: 1,
                            },
                        },
                    ],
                    as: "penaltyerrortypes",
                },
            },
            {
                $addFields: {
                    penaltycalculation: {
                        $ifNull: [{ $arrayElemAt: ["$penaltyerrortypes.penaltycalculation", 0] }, "No"],
                    },
                },
            },
            {
                $group: {
                    _id: {
                        projectvendor: "$projectvendor",
                        process: "$process",
                        loginid: "$loginid",
                        date: "$date",
                        mode: "$mode",
                    },
                    mode: { $first: "$mode" },
                    movedstatus: {
                        $sum: { $cond: { if: "$movedstatus", then: 1, else: 0 } },
                    },
                    penalty: {
                        $sum: { $cond: { if: { $eq: ["$penaltycalculation", "Yes"] }, then: 1, else: 0 } },
                    },
                    nonpenalty: {
                        $sum: { $cond: { if: { $eq: ["$penaltycalculation", "No"] }, then: 1, else: 0 } },
                    },
                    validatestatus: { $push: { $ifNull: ["$validatestatus", false] } },
                    editedcount: { $push: { $ifNull: ["$editedcount", 0] } },
                    rejectarray: {
                        $push: {
                            $cond: [{ $isArray: "$rejectarray" }, { $size: "$rejectarray" }, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    projectvendor: "$_id.projectvendor",
                    process: "$_id.process",
                    loginid: "$_id.loginid",
                    rejectarray: 1,
                    movedstatus: 1,
                    validatestatus: 1,
                    penalty: 1,
                    mode: 1,
                    editedcount: 1,
                    nonpenalty: 1,
                },
            },
        ]);

        // console.log(PENATY_TOTAL_FIELD, "penaltyerroruploads");

        const finalResult = PENATY_TOTAL_FIELD.map((upload) => {
            const loginInfo = filteredLogs.filter((login) => login.userid === upload.loginid && login.projectvendor === upload.projectvendor);

            const errorUploadsInd = penaltyerroruploads.filter((item) => item.process == upload.queuename && item.loginid === upload.loginid && item.projectvendor === upload.projectvendor);
            const bulkerrorUploads = bulkerroruploads.filter((item) => item.process == upload.queuename && item.loginid === upload.loginid && item.projectvendor === upload.projectvendor);

            const errorUploads = [...errorUploadsInd, ...bulkerrorUploads];
            //Final
            const errorUploadsMovedCount = errorUploads.reduce((sum, data) => sum + (data.movedstatus || 0), 0);
            const errorUploadsPenaltyCount = errorUploads.reduce((sum, data) => sum + (data.penalty || 0), 0);
            const errorUploadsNonPenaltyCount = errorUploads.reduce((sum, data) => sum + (data.nonpenalty || 0), 0);

            const rejectArrays = errorUploads.length > 0 ? errorUploads.flatMap((data) => data.rejectarray) : [];
            const findrejectCount1 = rejectArrays.length > 0 ? rejectArrays.filter((d) => d == 1).length : 0;
            const findrejectCount2 = rejectArrays.length > 0 ? rejectArrays.filter((d) => d == 2).length : 0;
            const findrejectCount3 = rejectArrays.length > 0 ? rejectArrays.filter((d) => d == 3).length : 0;
            const findrejectCount4 = rejectArrays.length > 0 ? rejectArrays.filter((d) => d == 4).length : 0;

            const EditedArrays = errorUploads.length > 0 ? errorUploads.flatMap((data) => data.editedcount) : [];
            const findEditedCount1 = EditedArrays.length > 0 ? EditedArrays.filter((d) => d == 1).length : 0;
            const findEditedCount2 = EditedArrays.length > 0 ? EditedArrays.filter((d) => d == 2).length : 0;
            const findEditedCount3 = EditedArrays.length > 0 ? EditedArrays.filter((d) => d == 3).length : 0;
            const findEditedCount4 = EditedArrays.length > 0 ? EditedArrays.filter((d) => d == 4).length : 0;

            // console.log(findrejectCount1, rejectArrays, rejectStatus, "rejectCounts");
            let loginallot = loginInfo ? loginInfo : [];

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

                // Extract the last item of each group
                const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);

                // Sort the last items by date and time
                lastItemsForEachDateTime.sort((a, b) => {
                    return new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time);
                });

                // Find the first item in the sorted array that meets the criteria
                for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                    const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;
                    // let datevalsplit = upload.mode == "Manual" ? "" : upload.formatteddatetime.split(" ");
                    let datevalsplitfinal = `${upload.date}`;
                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break;
                    }
                }
            }

            let logininfoname = loginallot.length > 0 && filteredDataDateTime && filteredDataDateTime.empname ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";

            const userInfo = users.find((user) => user.companyname === logininfoname);

            let getprocessCode = userInfo ? userInfo.process : "";
            const NAME = userInfo ? userInfo.companyname : "";
            const EMPCODE = userInfo ? userInfo.empcode : "";
            const COMPANY = userInfo ? userInfo.company : "";
            const UNIT = userInfo ? userInfo.unit : "";
            const BRANCH = userInfo ? userInfo.branch : "";
            const DOJ = userInfo ? userInfo.doj : "";
            const DOJDATE = userInfo ? userInfo.dojDate : "";
            const TEAM = userInfo ? userInfo.team : "";
            const EXP = userInfo ? userInfo.exp : "";
            const DEPARTMENT = userInfo ? userInfo.department : "";

            const getWaiverPercentage = WAIVER_MASTER.find(
                (d) =>
                    (d.company == COMPANY || d.company == "All") &&
                    (d.branch == BRANCH || d.branch == "All") &&
                    (d.employee == NAME || d.employee == "All") &&
                    (d.processcode == getprocessCode?.slice(0, 3) || d.processcode == "All") &&
                    (d.process == upload.process || d.process == "All") &&
                    new Date(req.body.date) >= new Date(d.fromdate) &&
                    new Date(req.body.date) <= new Date(d.todate)
            );
            const WaiverPercentage = getWaiverPercentage ? Number(getWaiverPercentage.waiverpercentageupto) : 0;

            // console.log(WAIVER_MASTER.length, getWaiverPercentage, "waiverperocetage");
            const bulkkeyingcnt = bulkerrorUploads.filter((d) => d.mode === "Bulkkeying").length;
            const bulkuploadcnt = bulkerrorUploads.filter((d) => d.mode === "Bulkupload").length;

            const validatedArrays = errorUploads.length > 0 ? errorUploads.flatMap((data) => data.validatestatus) : [];
            const validatedCount = validatedArrays.filter((d) => d === "true").length;
            const notValidatedCount = validatedArrays.filter((d) => d == "false").length;

            const getRate = (mode) => {
                const found = errorControls.find((d) => d.mode === mode && d.projectvendor === upload.projectvendor && d.process === upload.queuename);
                return found ? Number(found.rate) : 0;
            };

            const Bulk_Keying_Amt = getRate("Bulk_Keying") * bulkkeyingcnt;
            const Bulk_Upload_Amt = getRate("Bulk_Upload") * bulkuploadcnt;
            const Reject1_Amt = getRate("Reject1") * findrejectCount1;
            const Reject2_Amt = getRate("Reject2") * findrejectCount2;
            const Reject3_Amt = getRate("Reject3") * findrejectCount3;
            const Reject4_Amt = getRate("Reject4") * findrejectCount4;
            const Edited1_Amt = getRate("Edited1") * findEditedCount1;
            const Edited2_Amt = getRate("Edited2") * findEditedCount2;
            const Edited3_Amt = getRate("Edited3") * findEditedCount3;
            const Edited4_Amt = getRate("Edited4") * findEditedCount4;
            const NotValidated_Amt = getRate("Not Validate") * notValidatedCount;

            const netError = Bulk_Upload_Amt + Bulk_Keying_Amt + Edited1_Amt + Edited2_Amt + Edited3_Amt + Edited4_Amt + Reject1_Amt + Reject2_Amt + Reject3_Amt + Reject4_Amt + NotValidated_Amt;

            const Percentage = Number(((netError / Number(upload.totalfields)) * WaiverPercentage).toFixed(2));

            const Amount = Number((netError * Percentage).toFixed(2));

            return {
                loginid: upload.loginid,
                vendorname: upload.projectvendor,
                process: upload.queuename,
                date: upload.date,
                totalfield: upload.totalfields,
                autoerror: upload.autocount,
                manualerror: upload.manualerror,
                uploaderror: upload.errorcount,
                moved: errorUploadsMovedCount,
                notupload: Number(upload.manualerror) - Number(upload.errorcount),
                penalty: errorUploadsPenaltyCount,
                nonpenalty: errorUploadsNonPenaltyCount,
                bulkupload: bulkuploadcnt,
                bulkkeying: bulkkeyingcnt,
                edited1: findEditedCount1,
                edited2: findEditedCount2,
                edited3: findEditedCount3,
                edited4: findEditedCount4,
                reject1: findrejectCount1,
                reject2: findrejectCount2,
                reject3: findrejectCount3,
                reject4: findrejectCount4,
                notvalidate: notValidatedCount,
                validateerror: validatedCount,
                waivererror: WaiverPercentage,
                neterror: netError,
                per: WaiverPercentage,
                percentage: Percentage,
                amount: Amount,
                name: NAME,
                empcode: EMPCODE,
                company: COMPANY,

                unit: UNIT,
                branch: BRANCH,
                doj: DOJ,
                dojDate: DOJDATE,
                team: TEAM,

                exp: EXP,
                department: DEPARTMENT,
                processcode: getprocessCode,
            };
        });

        function formatDate(dateStr) {
            const [year, month, day] = dateStr.split("-");
            return `${day}${month}${year}`;
        }

        // Example usage
        const formattedDate = formatDate(req.body.date);
        // console.log(formattedDate);
        // console.log(finalResult.length, "finalResult");
        if (finalResult.length > 0 && PENALTY_NOT_CONFIRM_COUNT == 0) {
            finalvalue = [
                {
                    date: req.body.date,
                    filename: `Penalty Day_${formattedDate}`,
                    type: "nonexcel",
                    uploaddata: finalResult,
                    addedby: [
                        {
                            date: new Date(),
                            name: req.body.username,
                        },
                    ],
                },
            ];
            console.log(finalvalue.length, "finalvalue");

            await Penaltydayupload.insertMany(finalvalue);
            return res.status(200).json({
                message: "Created Sucessfully",
            });
        } else if (PENALTY_NOT_CONFIRM_COUNT > 0) {
            return res.status(200).json({
                message: "Error upload confirmation pending",
            });
        } else {
            return res.status(200).json({
                message: "No Data to Upload",
            });
        }
    } catch (err) {
        console.log(err, "err");
        return next(new ErrorHandler("Records not found!", 404));
    }
});

exports.checkWaiverIsStarted = catchAsyncErrors(async (req, res, next) => {
    let count;

    try {
        const { date } = req.body.date;

        count = await Penaltydayupload.countDocuments({
            date: date,
            "uploaddata.history": {
                $exists: true,
                $ne: [],
            },
        });
        return res.status(200).json({
            count,
        });
    } catch (err) {
        console.log(err, "err");
        return next(new ErrorHandler("Records not found!", 404));
    }
});