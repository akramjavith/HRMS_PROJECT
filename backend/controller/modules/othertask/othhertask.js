const Manageothertask = require('../../../model/modules/othertask/othertask');
const QueueTypeMaster = require('../../../model/modules/production/queuetypemaster');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const ClientUserid = require("../../../model/modules/production/ClientUserIDModel")
const ProductionIndividual = require("../../../model/modules/production/productionindividual")
const Users = require("../../../model/login/auth")
const OtherTaskUpload = require("../../../model/modules/production/othertaskoriginalupload")
const Unitrate = require("../../../model/modules/production/productionunitrate");
const moment = require("moment");

//get All Source =>/api/assignedby
exports.getAllManageothertask = catchAsyncErrors(async (req, res, next) => {
    let manageothertasks;
    try {
        manageothertasks = await Manageothertask.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!manageothertasks) {
        return next(new ErrorHandler('Manageothertask not found!', 404));
    }
    return res.status(200).json({
        manageothertasks
    });
})


exports.getOverallOthertaskSortExport = catchAsyncErrors(async (req, res, next) => {
    let totalProjects, results, totalProjectsOverall;

    const { page, pageSize, project, category, allFilters, logicOperator, searchQuery, subcategory, assignedby, assignedmode, fromdate, todate, month, year } = req.body;

    try {
        let query = {};

        // Apply filters for other fields
        if (Array.isArray(project) && project.length > 0) {
            query.project = { $in: project };
        }

        if (Array.isArray(category) && category.length > 0) {
            query.category = { $in: category };
        }

        if (Array.isArray(subcategory) && subcategory.length > 0) {
            query.subcategory = { $in: subcategory };
        }

        if (Array.isArray(assignedby) && assignedby.length > 0) {
            query.assignedby = { $in: assignedby };
        }

        if (Array.isArray(assignedmode) && assignedmode.length > 0) {
            query.assignedmode = { $in: assignedmode };
        }
        // Date filtering
        if (fromdate && todate) {
            const fromDateObj = fromdate;
            const toDateObj = todate;

            query.date = {
                $gte: fromDateObj,
                $lte: toDateObj,
            };
        } else if (fromdate) {
            const fromDateObj = fromdate;
            query.date = {
                $gte: fromDateObj,
            };
        } else if (todate) {
            const toDateObj = todate;
            query.date = {
                $lte: toDateObj,
            };
        }

        // Month and Year filtering
        if ((Array.isArray(month) && month.length > 0) && (Array.isArray(year) && year.length > 0)) {
            const monthIndices = month.map(m => {
                // Convert month name to its index
                const date = new Date(`${m} 01, 2000`);
                return date.getMonth() + 1; // Months are 0-indexed, so add 1
            });


            query.$expr = {
                $and: [
                    {
                        $in: [
                            { $month: { $dateFromString: { dateString: '$date' } } },
                            monthIndices
                        ]
                    },
                    {
                        $in: [
                            { $year: { $dateFromString: { dateString: '$date' } } },
                            year
                        ]
                    }
                ]
            }
        } else if (Array.isArray(month) && month.length > 0) {
            const monthIndices = month.map(m => {
                // Convert month name to its index
                const date = new Date(`${m} 01, 2000`);
                return date.getMonth() + 1; // Months are 0-indexed, so add 1
            });
            query.$expr = {
                $in: [{ $month: { $dateFromString: { dateString: '$date' } } }, monthIndices]
            };
        } else if (Array.isArray(year) && year.length > 0) {

            query.$expr = {
                $in: [{ $year: { $dateFromString: { dateString: '$date' } } }, year]
            };
        }

        let conditions = [];

        // Advanced search filter
        if (allFilters && allFilters.length > 0) {
            allFilters.forEach(filter => {
                if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
                    conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
                }
            });
        }

        if (searchQuery && searchQuery !== undefined) {
            const searchTermsArray = searchQuery.split(" ");
            const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

            const orConditions = regexTerms.map((regex) => ({
                $or: [
                    { project: regex },
                    { category: regex },
                    { subcategory: regex },
                    { total: regex },
                    { date: regex },
                    { time: regex },
                    { assignedby: regex },
                    { assignedmode: regex },
                    { ticket: regex },
                    { duedate: regex },
                    { duetime: regex },
                    { estimation: regex },
                    { estimationtime: regex },
                ],
            }));

            query = {
                $and: [
                    query,
                    // {
                    //     $or: assignbranch.map(item => ({
                    //         company: item.company,
                    //         branch: item.branch,
                    //     }))
                    // },
                    ...orConditions,
                ],
            };
        }

        // Apply logicOperator to combine conditions
        if (conditions.length > 0) {
            if (logicOperator === "AND") {
                query.$and = conditions;
            } else if (logicOperator === "OR") {
                query.$or = conditions;
            }
        }


        const isEmpty = Object.keys(query).length === 0;

        totalProjectsOverall = isEmpty ? 0 : await Manageothertask.find(query).select({
            project: 1,
            category: 1,
            subcategory: 1,
            total: 1,
            date: 1,
            time: 1,
            duedate: 1,
            duetime: 1,
            estimation: 1,
            estimationtime: 1,
            assignedby: 1,
            assignedmode: 1,
        })

        return res.status(200).json({
            totalProjectsOverall,
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});



//create new assignedby => /api/Manageothertask/new
exports.addManageothertask = catchAsyncErrors(async (req, res, next) => {


    let aManageothertask = await Manageothertask.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})


// get Single Manageothertask => /api/Manageothertask/:id
exports.getSingleManageothertask = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let smanageothertask = await Manageothertask.findById(id);
    if (!smanageothertask) {
        return next(new ErrorHandler('Manageothertask not found', 404));
    }
    return res.status(200).json({
        smanageothertask
    })
})

//update Manageothertask by id => /api/Manageothertask/:id
exports.updateManageothertask = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let umanageothertask = await Manageothertask.findByIdAndUpdate(id, req.body);
    if (!umanageothertask) {
        return next(new ErrorHandler('Manageothertask not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Manageothertask by id => /api/Manageothertask/:id
exports.deleteManageothertask = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dmanageothertask = await Manageothertask.findByIdAndRemove(id);
    if (!dmanageothertask) {
        return next(new ErrorHandler('Manageothertask not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

// get All result => /api/results

//view all
exports.getOverallOthertaskView = catchAsyncErrors(async (req, res, next) => {
    let productionupload, mergedData, mergedDataall;
    try {
        // producionIndividual = await ProducionIndividual.find({}, {});
        let loginids = await ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] } }, { empname: 1, userid: 1, loginallotlog: 1 }).lean();
        let users = await Users.find({}, { companyname: 1, empcode: 1, company: 1, unit: 1, branch: 1, team: 1, username: 1, processlog: 1, shifttiming: 1, department: 1, doj: 1, assignExpLog: 1, shiftallot: 1, boardingLog: 1 });


        let query = {
            vendor: new RegExp("^" + req.body.project),
            filename: { $in: req.body.category },
            category: { $in: req.body.subcategory },
            fromdate: { $in: req.body.fromdate },
        }
        productionupload = await ProductionIndividual.find(query, {
            vendor: 1, fromdate: 1, category: 1, filename: 1, flagcount: 1,
            unitid: 1, user: 1, alllogin: 1, section: 1, approvalstatus: 1, lateentrystatus: 1, time: 1, createdAt: 1

        });


        let mergedDataallfirst = productionupload.map((upload) => {
            const loginInfo = loginids.find((login) => login.userid === upload.user && login.projectvendor === upload.vendor);
            let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];
            let filteredDataDateTime = null;
            if (loginallot.length > 0) {
                const groupedByDateTime = {};

                // Group items by date and time
                loginallot.forEach((item) => {
                    const dateTime = item.date + " " + item.time; // Assuming item.updatetime contains time in HH:mm format
                    if (!groupedByDateTime[dateTime]) {
                        groupedByDateTime[dateTime] = [];
                    }
                    groupedByDateTime[dateTime].push(item);
                });
                // Extract the last item of each group
                const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);

                // Sort the last items by date and time
                lastItemsForEachDateTime.sort((a, b) => {
                    return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
                });
                // Find the first item in the sorted array that meets the criteria

                for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                    const dateTime = lastItemsForEachDateTime[i].date + " " + lastItemsForEachDateTime[i].time;
                    // let datevalsplit = upload.mode == "Manual" ? upload.fromdate : upload.dateval.split(" ");
                    let datevalsplitfinal = upload.fromdate + " " + upload.time + ":00"

                    /////
                    const datevalsplitfinalFormatted = datevalsplitfinal.replace(" PM:00", " PM"); // Remove ":00"
                    const parsedDatevalsplitfinal = new Date(datevalsplitfinalFormatted);
                    // Parse `dateTime`
                    const parsedDateTime = new Date(dateTime);
                    /////

                    if (parsedDateTime <= parsedDatevalsplitfinal) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break; // Break the loop if we encounter an item with date and time greater than or equal to selectedDateTime
                    }
                }
            }
            // const userInfo = loginInfo ? users.find(user => user.companyname === loginInfo.empname) : "";


            let logininfoname = loginallot.length > 0 ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
            const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : "";
            // const userArray = loginInfo ? users.filter((user) => user.companyname === logininfoname) : "";
            return {
                user: upload.user,
                fromdate: upload.fromdate,
                todate: upload.todate,
                vendor: upload.vendor,
                category: upload.category,
                // dateval: upload.mode === "Manual" ? `${upload.fromdate} ${upload.time}:00` : upload.dateval.split(" IST")[0],
                // dateval: upload.mode === "Manual" ? `${upload.fromdate} ${upload.time}:00` : upload.dateval.split(" IST")[0],
                // olddateval: upload.mode === "Manual" ? `${upload.fromdate}T${upload.time}:00` : `${upload.dateval.split(" IST")[0]}T${upload.dateval.split(" ")[1]}`,
                createdAt: upload.createdAt,
                time: upload.time,
                filename: upload.filename,
                empname: loginInfo && loginInfo.empname,
                empcode: userInfo && userInfo.empcode,
                company: userInfo && userInfo.company,
                unit: userInfo && userInfo.unit,
                branch: userInfo && userInfo.branch,
                team: userInfo && userInfo.team,

                username: userInfo && userInfo.username,
                _id: upload._id,

                section: upload.section,
                csection: upload.updatedsection ? upload.updatedsection : "",
                flagcount: upload.flagcount,
                cflagcount: upload.updatedflag ? upload.updatedflag : "",
                lateentrystatus: upload.lateentrystatus,
                approvalstatus: upload.approvalstatus,
                unitid: upload.unitid,
                filename: upload.filename,
                points: Number(upload.unitrate) * 8.333333333333333,
                cpoints: upload.updatedunitrate ? Number(upload.updatedunitrate) * 8.333333333333333 : "",
                unitrate: Number(upload.unitrate),
                cunitrate: upload.updatedunitrate ? Number(upload.updatedunitrate) : "",
            };

        });
        mergedDataall = mergedDataallfirst.map(curr => {
            return {
                vendor: curr.vendor, // Include section
                category: curr.category,
                filename: curr.filename,
                fromdate: curr.fromdate,
                flagcount: curr.flagcount,
                unitid: curr.unitid,
                user: curr.user,
                alllogin: curr.alllogin,
                section: curr.section,
                approvalstatus: curr.approvalstatus,
                lateentrystatus: curr.lateentrystatus,
                time: curr.time,
                empname: curr.empname,
                empcode: curr.empcode,
                company: curr.company,
                unit: curr.unit,
                branch: curr.branch,
                team: curr.team,
                unitrate: curr.unitrate,
                points: curr.points,
                points: curr.points,
                createdAt: curr.createdAt,
                _id: curr._id,
            };

        });

        mergedData = mergedDataall.filter(item => item != null)
    } catch (err) {
        return next(new ErrorHandler("Data not found", 404));
    }
    if (!productionupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        mergedData,
    });
});


//othertaskconsolidatedreport
exports.getOverallOthertaskConsolidatedReport = catchAsyncErrors(async (req, res, next) => {
    let result = [];
    let allData = [];
    const { project, category, subcategory, fromdate, todate } = req.body;
    try {
        let query = {};
        let queryManual = {};
        let queryothertaskupload = {};

        let queryTypeMaster = {};
        let queryUnitRate = {};

        // Apply filters for other fields
        // if (project) {
        query.project = project;
        queryTypeMaster.vendor = project;
        queryUnitRate.project = project;
        queryManual.vendor = new RegExp("^" + project);
        queryothertaskupload.vendor = new RegExp("^" + project);
        // }

        if (Array.isArray(category) && category.length > 0) {
            query.category = { $in: category };
            queryManual.filename = { $in: category };
            queryothertaskupload.filenameupdated = { $in: category };

            queryTypeMaster.category = { $in: category };
            queryUnitRate.category = { $in: category };
        }

        if (Array.isArray(subcategory) && subcategory.length > 0 && !subcategory.includes("All")) {
            query.subcategory = { $in: subcategory };
            queryManual.category = { $in: subcategory };
            queryothertaskupload.category = { $in: subcategory };

            // queryTypeMaster.subcategory = { $in: subcategory };
            queryUnitRate.subcategory = { $in: subcategory };
        }

        // Date filtering
        if (fromdate && todate) {
            const fromDateObj = fromdate;
            const toDateObj = todate;
            query.date = { $gte: fromDateObj, $lte: toDateObj };
            queryManual.fromdate = { $gte: fromDateObj, $lte: toDateObj };
            queryothertaskupload.formatteddate = { $gte: fromDateObj, $lte: toDateObj };
        } else if (fromdate) {
            const fromDateObj = fromdate;
            query.date = { $gte: fromDateObj };
            queryManual.fromdate = { $gte: fromDateObj };
            queryothertaskupload.formatteddate = { $gte: fromDateObj };
        } else if (todate) {
            const toDateObj = todate;
            query.date = { $lte: toDateObj };
            queryManual.fromdate = { $lte: toDateObj };
            queryothertaskupload.formatteddate = { $lte: toDateObj };
        }

        const promises = [];

        if (req.body.mode.includes("Other task queues")) {
            promises.push(
                Manageothertask.aggregate([
                    { $match: query },
                    {
                        $group: {
                            _id: {
                                project: "$project",
                                category: "$category",
                                subcategory: "$subcategory",
                            },
                            total: { $sum: { $toDouble: "$total" } },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            vendor: "$_id.project",
                            filename: "$_id.category",
                            category: "$_id.subcategory",
                            flagcount: "$total",
                            // orate: "$orate",
                        },
                    },
                    {
                        $addFields: {
                            mode: "Other task queues",
                        },
                    },
                ])
            );
        } else {
            promises.push(Promise.resolve([]));
        }

        if (req.body.mode.includes("Manual Entry")) {
            promises.push(
                ProductionIndividual.aggregate([
                    { $match: queryManual },
                    {
                        $group: {
                            _id: {
                                vendor: { $arrayElemAt: [{ $split: ["$vendor", "-"] }, 0] },
                                filename: "$filename",
                                category: "$category",
                            },
                            unitrate: { $first: "$unitrate" },
                            flagcount: { $sum: "$flagcount" },
                        },
                    },
                    {
                        $project: {
                            vendor: "$_id.vendor",
                            filename: "$_id.filename",
                            category: "$_id.category",
                            flagcount: "$flagcount",
                            unitrate: { $ifNull: ["$unitrate", 0] },
                        },
                    },
                    {
                        $addFields: {
                            mode: "Manual Entry",
                        },
                    },
                ])
            );
        } else {
            promises.push(Promise.resolve([]));
        }

        if (req.body.mode.includes("Other task upload")) {
            promises.push(
                OtherTaskUpload.aggregate([
                    { $match: queryothertaskupload },
                    {
                        $group: {
                            _id: {
                                vendor: { $arrayElemAt: [{ $split: ["$vendor", "-"] }, 0] },
                                filenameupdated: "$filenameupdated",
                                category: "$category",
                            },
                            unitrate: { $first: "$unitrate" },
                            flagcount: { $sum: "$flagcount" },
                        },
                    },
                    {
                        $project: {
                            vendor: "$_id.vendor",
                            filename: "$_id.filenameupdated",
                            category: "$_id.category",
                            flagcount: "$flagcount",
                            unitrate: { $ifNull: ["$unitrate", 0] },
                        },
                    },
                    {
                        $addFields: {
                            mode: "Other task upload",
                        },
                    },
                ])
            );
        } else {
            promises.push(Promise.resolve([]));
        }

        // Add QueueTypeMaster query
        promises.push(QueueTypeMaster.find(queryTypeMaster, { vendor: 1, category: 1, subcategory: 1, newrate: 1, type: 1, orate: 1 }).lean());
        promises.push(Unitrate.find(queryUnitRate, { project: 1, category: 1, subcategory: 1, mrate: 1 }).lean());

        // Execute all queries concurrently
        const [productionunmatched, productionindividual, othertaskupload, queuetypemaster, unitrates] = await Promise.all(promises);
        allData = [...productionunmatched, ...productionindividual, ...othertaskupload];

        const QueuetypeMapold = new Map(queuetypemaster.map((item) => [item.vendor + "-" + item.category + "-" + item.subcategory + "-" + item.type, item]));
        const QueuetypeMap = new Map(queuetypemaster.map((item) => [item.vendor + "-" + item.category + "-" + item.subcategory + "-" + item.type + "-" + Number(item.orate), item]));

        const UnitrateMap = new Map(unitrates.map((item) => [item.project + "-" + item.category + "-" + item.subcategory, item]));

        result = allData.map((currentEntry, index) => {
            const finaltotal = currentEntry.flagcount;

            const finalType = currentEntry.mode == "Other task upload" ? currentEntry.mode : "Other task queues";

            const findMrate = UnitrateMap.get(`${currentEntry.vendor}-${currentEntry.filename}-${currentEntry.category}`);
            const finalMrate = findMrate ? Number(findMrate.mrate) : "";

            const matchQueuetype = QueuetypeMapold.get(`${currentEntry.vendor}-${currentEntry.filename}-${currentEntry.category}-${finalType}`);
            const matchQueuetype1 = QueuetypeMap.get(`${currentEntry.vendor}-${currentEntry.filename}-${"All"}-${finalType}-${finalMrate}`);

            // console.log(matchQueuetype, "matchQueuetype")
            const newrateValue = matchQueuetype ? Number(matchQueuetype.newrate) : matchQueuetype1 ? Number(matchQueuetype1.newrate) : 0;

            return {
                _id: currentEntry._id,
                project: currentEntry.vendor,
                category: currentEntry.filename,
                subcategory: currentEntry.category,
                total: Number(finaltotal),
                newrate: newrateValue,
                date: `${fromdate} to ${todate}`,
                mode: currentEntry.mode,
                totalnew: newrateValue * Number(finaltotal),
            };
        });
    } catch (err) {
        console.log(err);
    }

    return res.status(200).json({
        result,
    });
});
//othertaskconsolidatedreport summary
// exports.getOverallOthertaskConsolidatedReportSummary = catchAsyncErrors(async (req, res, next) => {
//     let result = [];
//     let allData = [];
//     const { project, category, subcategory, fromdate, todate } = req.body;
//     try {
//         let query = {};
//         let queryManual = {};
//         let queryothertaskupload = {};

//         let queryTypeMaster = {};
//         let queryUnitRate = {};

//         // Apply filters for other fields
//         // if (project) {
//         // query.project = project;
//         // queryTypeMaster.vendor = project;
//         // queryUnitRate.project = project;
//         // queryManual.vendor = new RegExp("^" + project);
//         // queryothertaskupload.vendor = new RegExp("^" + project);
//         // }

//         // if (Array.isArray(category) && category.length > 0) {
//         //     query.category = { $in: category };
//         //     queryManual.filename = { $in: category };
//         //     queryothertaskupload.filenameupdated = { $in: category };

//         //     queryTypeMaster.category = { $in: category };
//         //     queryUnitRate.category = { $in: category };
//         // }

//         // if (Array.isArray(subcategory) && subcategory.length > 0 && !subcategory.includes("All")) {
//         //     query.subcategory = { $in: subcategory };
//         //     queryManual.category = { $in: subcategory };
//         //     queryothertaskupload.category = { $in: subcategory };

//         //     // queryTypeMaster.subcategory = { $in: subcategory };
//         //     queryUnitRate.subcategory = { $in: subcategory };
//         // }

//         // Date filtering
//         if (fromdate && todate) {
//             const fromDateObj = fromdate;
//             const toDateObj = todate;
//             query.date = { $gte: fromDateObj, $lte: toDateObj };
//             queryManual.fromdate = { $gte: fromDateObj, $lte: toDateObj };
//             queryothertaskupload.formatteddate = { $gte: fromDateObj, $lte: toDateObj };
//         } else if (fromdate) {
//             const fromDateObj = fromdate;
//             query.date = { $gte: fromDateObj };
//             queryManual.fromdate = { $gte: fromDateObj };
//             queryothertaskupload.formatteddate = { $gte: fromDateObj };
//         } else if (todate) {
//             const toDateObj = todate;
//             query.date = { $lte: toDateObj };
//             queryManual.fromdate = { $lte: toDateObj };
//             queryothertaskupload.formatteddate = { $lte: toDateObj };
//         }

//         const promises = [];

//         if (req.body.mode.includes("Other task queues")) {
//             promises.push(
//                 Manageothertask.aggregate([
//                     { $match: query },
//                     {
//                         $group: {
//                             _id: {
//                                 project: "$project",
//                                 category: "$category",
//                                 subcategory: "$subcategory",
//                             },
//                             total: { $sum: { $toDouble: "$total" } },
//                         },
//                     },
//                     {
//                         $project: {
//                             _id: 0,
//                             vendor: "$_id.project",
//                             filename: "$_id.category",
//                             category: "$_id.subcategory",
//                             flagcount: "$total",
//                             // orate: "$orate",
//                         },
//                     },
//                     {
//                         $addFields: {
//                             mode: "Other task queues",
//                         },
//                     },
//                 ])
//             );
//         } else {
//             promises.push(Promise.resolve([]));
//         }

//         if (req.body.mode.includes("Manual Entry")) {
//             promises.push(
//                 ProductionIndividual.aggregate([
//                     { $match: queryManual },
//                     {
//                         $group: {
//                             _id: {
//                                 vendor: { $arrayElemAt: [{ $split: ["$vendor", "-"] }, 0] },
//                                 filename: "$filename",
//                                 category: "$category",
//                             },
//                             unitrate: { $first: "$unitrate" },
//                             flagcount: { $sum: "$flagcount" },
//                         },
//                     },
//                     {
//                         $project: {
//                             vendor: "$_id.vendor",
//                             filename: "$_id.filename",
//                             category: "$_id.category",
//                             flagcount: "$flagcount",
//                             unitrate: { $ifNull: ["$unitrate", 0] },
//                         },
//                     },
//                     {
//                         $addFields: {
//                             mode: "Manual Entry",
//                         },
//                     },
//                 ])
//             );
//         } else {
//             promises.push(Promise.resolve([]));
//         }

//         if (req.body.mode.includes("Other task upload")) {
//             promises.push(
//                 OtherTaskUpload.aggregate([
//                     { $match: queryothertaskupload },
//                     {
//                         $group: {
//                             _id: {
//                                 vendor: { $arrayElemAt: [{ $split: ["$vendor", "-"] }, 0] },
//                                 filenameupdated: "$filenameupdated",
//                                 category: "$category",
//                             },
//                             unitrate: { $first: "$unitrate" },
//                             flagcount: { $sum: "$flagcount" },
//                         },
//                     },
//                     {
//                         $project: {
//                             vendor: "$_id.vendor",
//                             filename: "$_id.filenameupdated",
//                             category: "$_id.category",
//                             flagcount: "$flagcount",
//                             unitrate: { $ifNull: ["$unitrate", 0] },
//                         },
//                     },
//                     {
//                         $addFields: {
//                             mode: "Other task upload",
//                         },
//                     },
//                 ])
//             );
//         } else {
//             promises.push(Promise.resolve([]));
//         }

//         // Add QueueTypeMaster query
//         promises.push(QueueTypeMaster.find(queryTypeMaster, { vendor: 1, category: 1, subcategory: 1, newrate: 1, type: 1, orate: 1 }).lean());
//         promises.push(Unitrate.find(queryUnitRate, { project: 1, category: 1, subcategory: 1, mrate: 1 }).lean());

//         // Execute all queries concurrently
//         const [productionunmatched, productionindividual, othertaskupload, queuetypemaster, unitrates] = await Promise.all(promises);
//         allData = [...productionunmatched, ...productionindividual, ...othertaskupload];

//         const QueuetypeMapold = new Map(queuetypemaster.map((item) => [item.vendor + "-" + item.category + "-" + item.subcategory + "-" + item.type, item]));
//         const QueuetypeMap = new Map(queuetypemaster.map((item) => [item.vendor + "-" + item.category + "-" + item.subcategory + "-" + item.type + "-" + Number(item.orate), item]));

//         const UnitrateMap = new Map(unitrates.map((item) => [item.project + "-" + item.category + "-" + item.subcategory, item]));

//         result = allData.map((currentEntry, index) => {
//             const finaltotal = currentEntry.flagcount;


//             const finalType = currentEntry.mode == "Other task upload" ? currentEntry.mode : "Other task queues";

//             const findMrate = UnitrateMap.get(`${currentEntry.vendor}-${currentEntry.filename}-${currentEntry.category}`);
//             const finalMrate = findMrate ? Number(findMrate.mrate) : "";

//             const matchQueuetype = QueuetypeMapold.get(`${currentEntry.vendor}-${currentEntry.filename}-${currentEntry.category}-${finalType}`);
//             const matchQueuetype1 = QueuetypeMap.get(`${currentEntry.vendor}-${currentEntry.filename}-${"All"}-${finalType}-${finalMrate}`);

//             // console.log(matchQueuetype, "matchQueuetype")
//             const newrateValue = matchQueuetype ? Number(matchQueuetype.newrate) : matchQueuetype1 ? Number(matchQueuetype1.newrate) : 0;

//             return {
//                 _id: currentEntry._id,
//                 project: currentEntry.vendor,
//                 category: currentEntry.filename,
//                 subcategory: currentEntry.category,
//                 total: Number(finaltotal),
//                 newrate: newrateValue,
//                 date: `${fromdate} to ${todate}`,
//                 mode: currentEntry.mode,
//                 totalnew: newrateValue * Number(finaltotal),
//             };
//         });



//         console.log(result[0], "oooo")
//     } catch (err) {
//         console.log(err);
//     }

//     return res.status(200).json({
//         result,
//     });
// });

exports.getOverallOthertaskConsolidatedReportSummary = catchAsyncErrors(async (req, res, next) => {
    let result = [];
    let allData = [];
    const { project, category, subcategory, fromdate, todate } = req.body;
    try {
        let query = {};
        let queryManual = {};
        let queryothertaskupload = {};

        let queryTypeMaster = {};
        let queryUnitRate = {};

        // Apply filters for other fields
        // if (Array.isArray(project) && project.length > 0) {
        //     query.project = project;
        //     queryManual.vendor = project.map((item) => new RegExp("^" + item));
        //     queryothertaskupload.vendor = project.map((item) => new RegExp("^" + item));

        //     queryTypeMaster.vendor = project;
        //     queryUnitRate.project = project;
        // }

        // if (Array.isArray(category) && category.length > 0) {
        //     query.category = { $in: category };
        //     queryManual.filename = { $in: category };
        //     queryothertaskupload.filenameupdated = { $in: category };

        //     queryTypeMaster.category = { $in: category };
        //     queryUnitRate.category = { $in: category };
        // }

        // if (Array.isArray(subcategory) && subcategory.length > 0 && !subcategory.includes("All")) {
        //     query.subcategory = { $in: subcategory };
        //     queryManual.category = { $in: subcategory };
        //     queryothertaskupload.category = { $in: subcategory };

        //     // queryTypeMaster.subcategory = { $in: subcategory };
        //     queryUnitRate.subcategory = { $in: subcategory };
        // }

        // Date filtering
        if (fromdate && todate) {
            const fromDateObj = fromdate;
            const toDateObj = todate;

            query.date = { $gte: fromDateObj, $lte: toDateObj };
            queryManual.fromdate = { $gte: fromDateObj, $lte: toDateObj };
            queryothertaskupload.formatteddate = { $gte: fromDateObj, $lte: toDateObj };
        } else if (fromdate) {
            const fromDateObj = fromdate;
            query.date = { $gte: fromDateObj };
            queryManual.fromdate = { $gte: fromDateObj };
            queryothertaskupload.formatteddate = { $gte: fromDateObj };
        } else if (todate) {
            const toDateObj = todate;
            query.date = { $lte: toDateObj };
            queryManual.fromdate = { $lte: toDateObj };
            queryothertaskupload.formatteddate = { $lte: toDateObj };
        }

        const promises = [];

        if (req.body.mode.includes("Other task queues")) {
            promises.push(
                Manageothertask.aggregate([
                    { $match: query },
                    {
                        $project: {
                            project: 1,
                            category: 1,
                            subcategory: 1,
                            date: 1,
                            total: 1,
                        },
                    },
                    { $addFields: { mode: "Other task queues" } }, // Adding mode directly
                ])
            );
        } else {
            promises.push(Promise.resolve([]));
        }

        if (req.body.mode.includes("Manual Entry")) {
            promises.push(
                ProductionIndividual.aggregate([
                    { $match: queryManual },
                    {
                        $project: {
                            vendor: 1,
                            filename: 1,
                            category: 1,
                            fromdate: 1,
                            flagcount: 1,
                        },
                    },
                    {
                        $addFields: {
                            date: "$fromdate",
                            project: { $arrayElemAt: [{ $split: ["$vendor", "-"] }, 0] }, // Extract first part before "-"
                            category: "$filename",
                            subcategory: "$category",
                            mode: "Manual Entry",
                        },
                    },
                ])
            );
        } else {
            promises.push(Promise.resolve([]));
        }

        if (req.body.mode.includes("Other task upload")) {
            promises.push(
                OtherTaskUpload.aggregate([
                    { $match: queryothertaskupload },
                    {
                        $project: {
                            vendor: 1,
                            filenameupdated: 1,
                            category: 1,
                            formatteddate: 1,
                            flagcount: 1,
                        },
                    },
                    {
                        $addFields: {
                            project: { $arrayElemAt: [{ $split: ["$vendor", "-"] }, 0] },
                            date: "$formatteddate",
                            category: "$filenameupdated",
                            subcategory: "$category",
                            mode: "Other task upload",
                        },
                    },
                ])
            );
        } else {
            promises.push(Promise.resolve([]));
        }

        // Add QueueTypeMaster query
        promises.push(QueueTypeMaster.find(queryTypeMaster, { vendor: 1, category: 1, subcategory: 1, newrate: 1, type: 1, orate: 1 }).lean());
        promises.push(Unitrate.find(queryUnitRate, { project: 1, category: 1, subcategory: 1, mrate: 1 }).lean());

        // Execute all queries concurrently
        const [productionunmatched, productionindividual, othertaskupload, queuetypemaster, unitrates] = await Promise.all(promises);
        // console.log(productionunmatched, productionindividual, othertaskupload, queuetypemaster, "productionunmatched, productionindividual, othertaskupload, queuetypemaste");
        allData = [...productionunmatched, ...productionindividual, ...othertaskupload];

        const QueuetypeMap = new Map(queuetypemaster.map((item) => [item.vendor + "-" + item.category + "-" + item.subcategory + "-" + item.type, item]));
        const QueuetypeMap1 = new Map(queuetypemaster.map((item) => [item.vendor + "-" + item.category + "-" + item.subcategory + "-" + item.type + "-" + Number(item.orate), item]));

        const UnitrateMap = new Map(unitrates.map((item) => [item.project + "-" + item.category + "-" + item.subcategory, item]));

        result = allData.map((item, index) => {
            const finaldate = item.mode == "Other task queues" ? item.date : item.mode == "Other task upload" ? item.formatteddate : item.fromdate;
            const finaltotal = item.mode == "Other task queues" ? item.total : item.mode == "Other task upload" ? item.flagcount : item.flagcount;
            const finalType = item.mode == "Other task upload" ? item.mode : "Other task queues";

            const findMrate = UnitrateMap.get(`${item.project}-${item.category}-${item.subcategory}`);
            const finalMrate = findMrate ? Number(findMrate.mrate) : "";

            const matchQueuetype = QueuetypeMap.get(`${item.project}-${item.category}-${item.subcategory}-${finalType}`);
            const matchQueuetype1 = QueuetypeMap1.get(`${item.project}-${item.category}-${"All"}-${finalType}-${finalMrate}`);

            // console.log(matchQueuetype, "matchQueuetype")
            const newrateValue = matchQueuetype ? Number(matchQueuetype.newrate) : matchQueuetype1 ? Number(matchQueuetype1.newrate) : 0;

            return {
                _id: item._id,
                project: item.project,
                category: item.category,
                subcategory: item.subcategory,
                total: Number(finaltotal),
                newrate: newrateValue,
                date: finaldate,
                mode: item.mode,
                totalnew: newrateValue * Number(finaltotal),
            };
        });
    } catch (err) {
        console.log(err);
    }

    return res.status(200).json({
        result,
    });
});


//individualconsolidatedreport
exports.getOverallOthertaskIndividualReport = catchAsyncErrors(async (req, res, next) => {
    let result = [];
    let allData = [];
    const { project, category, subcategory, fromdate, todate } = req.body;
    try {
        let query = {};
        let queryManual = {};
        let queryothertaskupload = {};

        let queryTypeMaster = {};
        let queryUnitRate = {};

        // Apply filters for other fields
        if (Array.isArray(project) && project.length > 0) {
            query.project = project;
            queryManual.vendor = project.map((item) => new RegExp("^" + item));
            queryothertaskupload.vendor = project.map((item) => new RegExp("^" + item));

            queryTypeMaster.vendor = project;
            queryUnitRate.project = project;
        }

        if (Array.isArray(category) && category.length > 0) {
            query.category = { $in: category };
            queryManual.filename = { $in: category };
            queryothertaskupload.filenameupdated = { $in: category };

            queryTypeMaster.category = { $in: category };
            queryUnitRate.category = { $in: category };
        }

        if (Array.isArray(subcategory) && subcategory.length > 0 && !subcategory.includes("All")) {
            query.subcategory = { $in: subcategory };
            queryManual.category = { $in: subcategory };
            queryothertaskupload.category = { $in: subcategory };

            // queryTypeMaster.subcategory = { $in: subcategory };
            queryUnitRate.subcategory = { $in: subcategory };
        }

        // Date filtering
        if (fromdate && todate) {
            const fromDateObj = fromdate;
            const toDateObj = todate;

            query.date = { $gte: fromDateObj, $lte: toDateObj };
            queryManual.fromdate = { $gte: fromDateObj, $lte: toDateObj };
            queryothertaskupload.formatteddate = { $gte: fromDateObj, $lte: toDateObj };
        } else if (fromdate) {
            const fromDateObj = fromdate;
            query.date = { $gte: fromDateObj };
            queryManual.fromdate = { $gte: fromDateObj };
            queryothertaskupload.formatteddate = { $gte: fromDateObj };
        } else if (todate) {
            const toDateObj = todate;
            query.date = { $lte: toDateObj };
            queryManual.fromdate = { $lte: toDateObj };
            queryothertaskupload.formatteddate = { $lte: toDateObj };
        }

        const promises = [];

        if (req.body.mode.includes("Other task queues")) {
            promises.push(
                Manageothertask.aggregate([
                    { $match: query },
                    {
                        $project: {
                            project: 1,
                            category: 1,
                            subcategory: 1,
                            date: 1,
                            total: 1,
                        },
                    },
                    { $addFields: { mode: "Other task queues" } }, // Adding mode directly
                ])
            );
        } else {
            promises.push(Promise.resolve([]));
        }

        if (req.body.mode.includes("Manual Entry")) {
            promises.push(
                ProductionIndividual.aggregate([
                    { $match: queryManual },
                    {
                        $project: {
                            vendor: 1,
                            filename: 1,
                            category: 1,
                            fromdate: 1,
                            flagcount: 1,
                        },
                    },
                    {
                        $addFields: {
                            date: "$fromdate",
                            project: { $arrayElemAt: [{ $split: ["$vendor", "-"] }, 0] }, // Extract first part before "-"
                            category: "$filename",
                            subcategory: "$category",
                            mode: "Manual Entry",
                        },
                    },
                ])
            );
        } else {
            promises.push(Promise.resolve([]));
        }

        if (req.body.mode.includes("Other task upload")) {
            promises.push(
                OtherTaskUpload.aggregate([
                    { $match: queryothertaskupload },
                    {
                        $project: {
                            vendor: 1,
                            filenameupdated: 1,
                            category: 1,
                            formatteddate: 1,
                            flagcount: 1,
                        },
                    },
                    {
                        $addFields: {
                            project: { $arrayElemAt: [{ $split: ["$vendor", "-"] }, 0] },
                            date: "$formatteddate",
                            category: "$filenameupdated",
                            subcategory: "$category",
                            mode: "Other task upload",
                        },
                    },
                ])
            );
        } else {
            promises.push(Promise.resolve([]));
        }

        // Add QueueTypeMaster query
        promises.push(QueueTypeMaster.find(queryTypeMaster, { vendor: 1, category: 1, subcategory: 1, newrate: 1, type: 1, orate: 1 }).lean());
        promises.push(Unitrate.find(queryUnitRate, { project: 1, category: 1, subcategory: 1, mrate: 1 }).lean());

        // Execute all queries concurrently
        const [productionunmatched, productionindividual, othertaskupload, queuetypemaster, unitrates] = await Promise.all(promises);
        // console.log(productionunmatched, productionindividual, othertaskupload, queuetypemaster, "productionunmatched, productionindividual, othertaskupload, queuetypemaste");
        allData = [...productionunmatched, ...productionindividual, ...othertaskupload];

        const QueuetypeMap = new Map(queuetypemaster.map((item) => [item.vendor + "-" + item.category + "-" + item.subcategory + "-" + item.type, item]));
        const QueuetypeMap1 = new Map(queuetypemaster.map((item) => [item.vendor + "-" + item.category + "-" + item.subcategory + "-" + item.type + "-" + Number(item.orate), item]));

        const UnitrateMap = new Map(unitrates.map((item) => [item.project + "-" + item.category + "-" + item.subcategory, item]));

        result = allData.map((item, index) => {
            const finaldate = item.mode == "Other task queues" ? item.date : item.mode == "Other task upload" ? item.formatteddate : item.fromdate;
            const finaltotal = item.mode == "Other task queues" ? item.total : item.mode == "Other task upload" ? item.flagcount : item.flagcount;
            const finalType = item.mode == "Other task upload" ? item.mode : "Other task queues";

            const findMrate = UnitrateMap.get(`${item.project}-${item.category}-${item.subcategory}`);
            const finalMrate = findMrate ? Number(findMrate.mrate) : "";

            const matchQueuetype = QueuetypeMap.get(`${item.project}-${item.category}-${item.subcategory}-${finalType}`);
            const matchQueuetype1 = QueuetypeMap1.get(`${item.project}-${item.category}-${"All"}-${finalType}-${finalMrate}`);

            // console.log(matchQueuetype, "matchQueuetype")
            const newrateValue = matchQueuetype ? Number(matchQueuetype.newrate) : matchQueuetype1 ? Number(matchQueuetype1.newrate) : 0;

            return {
                _id: item._id,
                project: item.project,
                category: item.category,
                subcategory: item.subcategory,
                total: Number(finaltotal),
                newrate: newrateValue,
                date: finaldate,
                mode: item.mode,
                totalnew: newrateValue * Number(finaltotal),
            };
        });
    } catch (err) {
        console.log(err);
    }

    return res.status(200).json({
        result,
    });
});

exports.getOverallOthertaskSort = catchAsyncErrors(async (req, res, next) => {
    let totalProjects, results, totalProjectsOverall;

    const { page, pageSize, project, category, allFilters, logicOperator, searchQuery, subcategory, assignedby, assignedmode, fromdate, todate, month, year } = req.body;

    try {
        let query = {};

        // Apply filters for other fields
        if (Array.isArray(project) && project.length > 0) {
            query.project = { $in: project };
        }

        if (Array.isArray(category) && category.length > 0) {
            query.category = { $in: category };
        }

        if (Array.isArray(subcategory) && subcategory.length > 0) {
            query.subcategory = { $in: subcategory };
        }

        if (Array.isArray(assignedby) && assignedby.length > 0) {
            query.assignedby = { $in: assignedby };
        }

        if (Array.isArray(assignedmode) && assignedmode.length > 0) {
            query.assignedmode = { $in: assignedmode };
        }
        // Date filtering
        if (fromdate && todate) {
            const fromDateObj = fromdate;
            const toDateObj = todate;

            query.date = {
                $gte: fromDateObj,
                $lte: toDateObj,
            };
        } else if (fromdate) {
            const fromDateObj = fromdate;
            query.date = {
                $gte: fromDateObj,
            };
        } else if (todate) {
            const toDateObj = todate;
            query.date = {
                $lte: toDateObj,
            };
        }

        // Month and Year filtering
        if ((Array.isArray(month) && month.length > 0) && (Array.isArray(year) && year.length > 0)) {
            const monthIndices = month.map(m => {
                // Convert month name to its index
                const date = new Date(`${m} 01, 2000`);
                return date.getMonth() + 1; // Months are 0-indexed, so add 1
            });


            query.$expr = {
                $and: [
                    {
                        $in: [
                            { $month: { $dateFromString: { dateString: '$date' } } },
                            monthIndices
                        ]
                    },
                    {
                        $in: [
                            { $year: { $dateFromString: { dateString: '$date' } } },
                            year
                        ]
                    }
                ]
            }
        } else if (Array.isArray(month) && month.length > 0) {
            const monthIndices = month.map(m => {
                // Convert month name to its index
                const date = new Date(`${m} 01, 2000`);
                return date.getMonth() + 1; // Months are 0-indexed, so add 1
            });
            query.$expr = {
                $in: [{ $month: { $dateFromString: { dateString: '$date' } } }, monthIndices]
            };
        } else if (Array.isArray(year) && year.length > 0) {

            query.$expr = {
                $in: [{ $year: { $dateFromString: { dateString: '$date' } } }, year]
            };
        }

        let conditions = [];

        // Advanced search filter
        if (allFilters && allFilters.length > 0) {
            allFilters.forEach(filter => {
                if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
                    conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
                }
            });
        }

        if (searchQuery && searchQuery !== undefined) {
            const searchTermsArray = searchQuery.split(" ");
            const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

            const orConditions = regexTerms.map((regex) => ({
                $or: [
                    { project: regex },
                    { category: regex },
                    { subcategory: regex },
                    { total: regex },
                    { date: regex },
                    { time: regex },
                    { assignedby: regex },
                    { assignedmode: regex },
                    { ticket: regex },
                    { duedate: regex },
                    { duetime: regex },
                    { estimation: regex },
                    { estimationtime: regex },
                ],
            }));

            query = {
                $and: [
                    query,
                    // {
                    //     $or: assignbranch.map(item => ({
                    //         company: item.company,
                    //         branch: item.branch,
                    //     }))
                    // },
                    ...orConditions,
                ],
            };
        }

        // Apply logicOperator to combine conditions
        if (conditions.length > 0) {
            if (logicOperator === "AND") {
                query.$and = conditions;
            } else if (logicOperator === "OR") {
                query.$or = conditions;
            }
        }


        const isEmpty = Object.keys(query).length === 0;

        totalProjects = isEmpty ? 0 : await Manageothertask.find(query).countDocuments();
        // totalProjectsOverall = isEmpty ? 0 : await Manageothertask.find(query)

        // results = await Manageothertask.find(query)
        //     .skip((page - 1) * pageSize)
        //     .limit(parseInt(pageSize));

        const results = await Manageothertask.find(query)
            .select({
                project: 1,
                category: 1,
                subcategory: 1,
                total: 1,
                date: 1,
                time: 1,
                duedate: 1,
                duetime: 1,
                estimation: 1,
                estimationtime: 1,
                assignedby: 1,
                assignedmode: 1,
            })
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize));

        const result = isEmpty ? [] : results;


        return res.status(200).json({
            totalProjects,
            totalProjectsOverall: [],
            result,
            currentPage: page,
            totalPages: Math.ceil(totalProjects / pageSize),
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});

exports.getOverallOthertaskSortExport = catchAsyncErrors(async (req, res, next) => {
    let totalProjects, results, totalProjectsOverall;

    const { page, pageSize, project, category, allFilters, logicOperator, searchQuery, subcategory, assignedby, assignedmode, fromdate, todate, month, year } = req.body;

    try {
        let query = {};

        // Apply filters for other fields
        if (Array.isArray(project) && project.length > 0) {
            query.project = { $in: project };
        }

        if (Array.isArray(category) && category.length > 0) {
            query.category = { $in: category };
        }

        if (Array.isArray(subcategory) && subcategory.length > 0) {
            query.subcategory = { $in: subcategory };
        }

        if (Array.isArray(assignedby) && assignedby.length > 0) {
            query.assignedby = { $in: assignedby };
        }

        if (Array.isArray(assignedmode) && assignedmode.length > 0) {
            query.assignedmode = { $in: assignedmode };
        }
        // Date filtering
        if (fromdate && todate) {
            const fromDateObj = fromdate;
            const toDateObj = todate;

            query.date = {
                $gte: fromDateObj,
                $lte: toDateObj,
            };
        } else if (fromdate) {
            const fromDateObj = fromdate;
            query.date = {
                $gte: fromDateObj,
            };
        } else if (todate) {
            const toDateObj = todate;
            query.date = {
                $lte: toDateObj,
            };
        }

        // Month and Year filtering
        if ((Array.isArray(month) && month.length > 0) && (Array.isArray(year) && year.length > 0)) {
            const monthIndices = month.map(m => {
                // Convert month name to its index
                const date = new Date(`${m} 01, 2000`);
                return date.getMonth() + 1; // Months are 0-indexed, so add 1
            });


            query.$expr = {
                $and: [
                    {
                        $in: [
                            { $month: { $dateFromString: { dateString: '$date' } } },
                            monthIndices
                        ]
                    },
                    {
                        $in: [
                            { $year: { $dateFromString: { dateString: '$date' } } },
                            year
                        ]
                    }
                ]
            }
        } else if (Array.isArray(month) && month.length > 0) {
            const monthIndices = month.map(m => {
                // Convert month name to its index
                const date = new Date(`${m} 01, 2000`);
                return date.getMonth() + 1; // Months are 0-indexed, so add 1
            });
            query.$expr = {
                $in: [{ $month: { $dateFromString: { dateString: '$date' } } }, monthIndices]
            };
        } else if (Array.isArray(year) && year.length > 0) {

            query.$expr = {
                $in: [{ $year: { $dateFromString: { dateString: '$date' } } }, year]
            };
        }

        let conditions = [];

        // Advanced search filter
        if (allFilters && allFilters.length > 0) {
            allFilters.forEach(filter => {
                if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
                    conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
                }
            });
        }

        if (searchQuery && searchQuery !== undefined) {
            const searchTermsArray = searchQuery.split(" ");
            const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

            const orConditions = regexTerms.map((regex) => ({
                $or: [
                    { project: regex },
                    { category: regex },
                    { subcategory: regex },
                    { total: regex },
                    { date: regex },
                    { time: regex },
                    { assignedby: regex },
                    { assignedmode: regex },
                    { ticket: regex },
                    { duedate: regex },
                    { duetime: regex },
                    { estimation: regex },
                    { estimationtime: regex },
                ],
            }));

            query = {
                $and: [
                    query,
                    // {
                    //     $or: assignbranch.map(item => ({
                    //         company: item.company,
                    //         branch: item.branch,
                    //     }))
                    // },
                    ...orConditions,
                ],
            };
        }

        // Apply logicOperator to combine conditions
        if (conditions.length > 0) {
            if (logicOperator === "AND") {
                query.$and = conditions;
            } else if (logicOperator === "OR") {
                query.$or = conditions;
            }
        }


        const isEmpty = Object.keys(query).length === 0;

        totalProjectsOverall = isEmpty ? 0 : await Manageothertask.find(query).select({
            project: 1,
            category: 1,
            subcategory: 1,
            total: 1,
            date: 1,
            time: 1,
            duedate: 1,
            duetime: 1,
            estimation: 1,
            estimationtime: 1,
            assignedby: 1,
            assignedmode: 1,
        })

        return res.status(200).json({
            totalProjectsOverall,
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});


exports.getOverallOthertaskCompanySort = catchAsyncErrors(async (req, res, next) => {
    const { page, pageSize, project, searchQuery, category, allFilters, logicOperator, subcategory, assignedby, assignedmode, fromdate, todate, month, year } = req.body;

    try {
        let query = {};

        // Apply filters for other fields
        if (Array.isArray(project) && project.length > 0) {
            query.project = { $in: project };
        }

        if (Array.isArray(category) && category.length > 0) {
            query.category = { $in: category };
        }

        if (Array.isArray(subcategory) && subcategory.length > 0) {
            query.subcategory = { $in: subcategory };
        }

        if (Array.isArray(assignedby) && assignedby.length > 0) {
            query.assignedby = { $in: assignedby };
        }

        if (Array.isArray(assignedmode) && assignedmode.length > 0) {
            query.assignedmode = { $in: assignedmode };
        }

        // Date filtering
        if (fromdate && todate) {
            query.date = { $gte: fromdate, $lte: todate };
        } else if (fromdate) {
            query.date = { $gte: fromdate };
        } else if (todate) {
            query.date = { $lte: todate };
        }

        // Month and Year filtering
        if (Array.isArray(month) && month.length > 0 && Array.isArray(year) && year.length > 0) {
            const monthIndices = month.map(m => new Date(`${m} 01, 2000`).getMonth() + 1);
            query.$expr = {
                $and: [
                    { $in: [{ $month: { $dateFromString: { dateString: '$date' } } }, monthIndices] },
                    { $in: [{ $year: { $dateFromString: { dateString: '$date' } } }, year] }
                ]
            };
        } else if (Array.isArray(month) && month.length > 0) {
            const monthIndices = month.map(m => new Date(`${m} 01, 2000`).getMonth() + 1);
            query.$expr = { $in: [{ $month: { $dateFromString: { dateString: '$date' } } }, monthIndices] };
        } else if (Array.isArray(year) && year.length > 0) {
            query.$expr = { $in: [{ $year: { $dateFromString: { dateString: '$date' } } }, year] };
        }

        // Advanced search filter
        if (allFilters && allFilters.length > 0) {
            const conditions = allFilters.map(filter =>
                filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))
                    ? createFilterCondition(filter.column, filter.condition, filter.value)
                    : null
            ).filter(Boolean);

            if (conditions.length > 0) {
                query[logicOperator === "AND" ? "$and" : "$or"] = conditions;
            }
        }

        // Search query
        if (searchQuery) {
            const searchTermsArray = searchQuery.split(" ");
            const regexTerms = searchTermsArray.map(term => new RegExp(term, "i"));
            const orConditions = regexTerms.map(regex => ({
                $or: [
                    { project: regex },
                    { category: regex },
                    { subcategory: regex },
                    { total: regex },
                    { date: regex },
                    { time: regex },
                    { assignedby: regex },
                    { assignedmode: regex },
                    { ticket: regex },
                    { duedate: regex },
                    { duetime: regex },
                    { estimation: regex },
                    { estimationtime: regex },
                ],
            }));

            query = { $and: [query, ...orConditions] };
        }

        // Check if query is empty
        const isEmpty = Object.keys(query).length === 0;

        // Use aggregation to get totalProjects and results in a single query
        const aggregationPipeline = [
            { $match: isEmpty ? {} : query },
            {
                $facet: {
                    totalProjects: [{ $count: "count" }],
                    results: [
                        { $skip: (page - 1) * pageSize },
                        { $limit: parseInt(pageSize) },
                        {
                            $project: {
                                assignedby: 1,
                                assignedmode: 1,
                                category: 1,
                                project: 1,
                                subcategory: 1,
                                total: 1,
                                date: 1,
                                time: 1,
                                duedate: 1,
                                duetime: 1,
                                estimation: 1,
                                estimationtime: 1,
                                ticket: 1,
                                orate: 1,
                                conversion: 1,
                                mrate: 1,
                                flagcount: 1,
                                oratetotal: 1,
                            }
                        },
                    ],
                }
            },
        ];

        const [aggregationResult] = await Manageothertask.aggregate(aggregationPipeline);
        const totalProjects = aggregationResult.totalProjects[0]?.count || 0;
        const results = aggregationResult.results;

        return res.status(200).json({
            totalProjects,
            result: isEmpty ? [] : results,
            currentPage: page,
            totalProjectsOverall: [],
            totalPages: Math.ceil(totalProjects / pageSize),
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});

exports.getOverallOthertaskCompanySortExport = catchAsyncErrors(async (req, res, next) => {
    const { project, searchQuery, category, allFilters, logicOperator, subcategory, assignedby, assignedmode, fromdate, todate, month, year } = req.body;

    try {
        let query = {};

        // Apply filters for other fields
        if (Array.isArray(project) && project.length > 0) query.project = { $in: project };
        if (Array.isArray(category) && category.length > 0) query.category = { $in: category };
        if (Array.isArray(subcategory) && subcategory.length > 0) query.subcategory = { $in: subcategory };
        if (Array.isArray(assignedby) && assignedby.length > 0) query.assignedby = { $in: assignedby };
        if (Array.isArray(assignedmode) && assignedmode.length > 0) query.assignedmode = { $in: assignedmode };

        // Date filtering
        if (fromdate && todate) query.date = { $gte: fromdate, $lte: todate };
        else if (fromdate) query.date = { $gte: fromdate };
        else if (todate) query.date = { $lte: todate };

        // Month and Year filtering
        if (Array.isArray(month) && month.length > 0 && Array.isArray(year) && year.length > 0) {
            const monthIndices = month.map(m => new Date(`${m} 01, 2000`).getMonth() + 1);
            query.$expr = {
                $and: [
                    { $in: [{ $month: { $dateFromString: { dateString: '$date' } } }, monthIndices] },
                    { $in: [{ $year: { $dateFromString: { dateString: '$date' } } }, year] }
                ]
            };
        } else if (Array.isArray(month) && month.length > 0) {
            const monthIndices = month.map(m => new Date(`${m} 01, 2000`).getMonth() + 1);
            query.$expr = { $in: [{ $month: { $dateFromString: { dateString: '$date' } } }, monthIndices] };
        } else if (Array.isArray(year) && year.length > 0) {
            query.$expr = { $in: [{ $year: { $dateFromString: { dateString: '$date' } } }, year] };
        }

        // Advanced search filter
        if (allFilters && allFilters.length > 0) {
            const conditions = allFilters.map(filter =>
                filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))
                    ? createFilterCondition(filter.column, filter.condition, filter.value)
                    : null
            ).filter(Boolean);

            if (conditions.length > 0) {
                query[logicOperator === "AND" ? "$and" : "$or"] = conditions;
            }
        }

        // Search query
        if (searchQuery) {
            const searchTermsArray = searchQuery.split(" ");
            const regexTerms = searchTermsArray.map(term => new RegExp(term, "i"));
            const orConditions = regexTerms.map(regex => ({
                $or: [
                    { project: regex },
                    { category: regex },
                    { subcategory: regex },
                    { total: regex },
                    { date: regex },
                    { time: regex },
                    { assignedby: regex },
                    { assignedmode: regex },
                    { ticket: regex },
                    { duedate: regex },
                    { duetime: regex },
                    { estimation: regex },
                    { estimationtime: regex },
                ],
            }));

            query = { $and: [query, ...orConditions] };
        }

        // Check if query is empty
        const isEmpty = Object.keys(query).length === 0;

        // Fetch and sort unitsrate within MongoDB
        const unitsrate = await Unitrate.find({}, {
            category: 1,
            subcategory: 1,
            mrate: 1,
            trate: 1,
            flagcount: 1,
            flagstatus: 1,
            points: 1,
            project: 1,
            conversion: 1,
            orate: 1,
        })
            .sort({ category: 1, subcategory: 1 }) // Sorting in MongoDB
            .lean();

        // Convert to a Map for fast lookup
        const unitsrateMap = new Map(
            unitsrate.map(puc => [`${puc.project}-${puc.category}-${puc.subcategory}`, puc])
        );

        // Fetch data
        const totalProjectsOverall = isEmpty ? [] : await Manageothertask.find(query).select({
            assignedby: 1,
            assignedmode: 1,
            category: 1,
            project: 1,
            subcategory: 1,
            total: 1,
            date: 1,
            time: 1,
            duedate: 1,
            duetime: 1,
            estimation: 1,
            estimationtime: 1,
            ticket: 1,
            orate: 1,
            conversion: 1,
            mrate: 1,
            flagcount: 1,
            oratetotal: 1,
        }).lean();

        // Update totalProjectsOverall
        const updatedTotalProjectsOverall = totalProjectsOverall.map(item => {
            const key = `${item.project}-${item.category}-${item.subcategory}`;
            const isUnitProdExist = unitsrateMap.get(key);

            if (isUnitProdExist) {
                return {
                    ...item,
                    orate: isUnitProdExist.orate,
                    conversion: isUnitProdExist.conversion,
                    points: isUnitProdExist.points,
                    total: isUnitProdExist.flagcount,
                    oratetotal: isUnitProdExist.mrate * isUnitProdExist.flagcount,
                };
            }

            return {
                ...item,
                points: (item.orate * item.conversion).toFixed(4),
            };
        });

        const mappedResponse = updatedTotalProjectsOverall.map((item, index) => ({
            id: item._id,
            serialNumber: index + 1, // Assigning serial number dynamically
            project: item.project,
            category: item.category,
            subcategory: item.subcategory,
            total: item.total,
            date: moment(item.date).format("DD-MM-YYYY"),
            time: moment(`${new Date().toDateString()} ${item.time}`, "ddd MMM DD YYYY HH:mm").format("hh:mm:ss A"),
            assignedby: item.assignedby,
            assignedmode: item.assignedmode,
            ticket: item.ticket,
            duedate: moment(item.duedate).format("DD-MM-YYYY"),
            duetime: moment(`${new Date().toDateString()} ${item.duetime}`, "ddd MMM DD YYYY HH:mm").format("hh:mm:ss A"),
            estimation: item.estimation,
            estimationtime: item.estimationtime,
            orate: item.orate,
            flagcount: item.flagcount,
            conversion: item.conversion,
            points: item.points,
            totalflag: item.totalflag,
            oratetotal: item.oratetotal ? Number(item.oratetotal).toFixed(4) : "",
        }));

        return res.status(200).json({
            totalProjectsOverall: mappedResponse,
        });


    } catch (err) {
        console.log(err);
        return next(new ErrorHandler("Records not found!", 404));
    }
});

exports.getOverallOthertaskEmployeeSort = catchAsyncErrors(async (req, res, next) => {
    const { page, pageSize, project, category, searchQuery, allFilters, logicOperator, subcategory, assignedby, assignedmode, fromdate, todate, month, year } = req.body;

    try {
        let query = {};

        // Apply filters for other fields
        if (Array.isArray(project) && project.length > 0) {
            query.project = { $in: project };
        }

        if (Array.isArray(category) && category.length > 0) {
            query.category = { $in: category };
        }

        if (Array.isArray(subcategory) && subcategory.length > 0) {
            query.subcategory = { $in: subcategory };
        }

        if (Array.isArray(assignedby) && assignedby.length > 0) {
            query.assignedby = { $in: assignedby };
        }

        if (Array.isArray(assignedmode) && assignedmode.length > 0) {
            query.assignedmode = { $in: assignedmode };
        }

        // Date filtering
        if (fromdate && todate) {
            query.date = { $gte: fromdate, $lte: todate };
        } else if (fromdate) {
            query.date = { $gte: fromdate };
        } else if (todate) {
            query.date = { $lte: todate };
        }

        // Month and Year filtering
        // Convert month names to numerical values
        const monthIndices = month.map(m => ({
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
            July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
        }[m]));

        // Ensure monthIndices is valid
        if (monthIndices.includes(undefined)) {
            return next(new ErrorHandler("Invalid month format", 400));
        }

        // Apply Month and Year filtering
        if (Array.isArray(month) && month.length > 0 && Array.isArray(year) && year.length > 0) {
            query.$expr = {
                $and: [
                    {
                        $in: [
                            { $month: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } },
                            monthIndices
                        ]
                    },
                    {
                        $in: [
                            { $year: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } },
                            year
                        ]
                    }
                ]
            };
        } else if (Array.isArray(month) && month.length > 0) {
            query.$expr = {
                $in: [
                    { $month: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } },
                    monthIndices
                ]
            };
        } else if (Array.isArray(year) && year.length > 0) {
            query.$expr = {
                $in: [
                    { $year: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } },
                    year
                ]
            };
        }


        // Advanced search filter
        if (allFilters && allFilters.length > 0) {
            const conditions = allFilters.map(filter =>
                filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))
                    ? createFilterCondition(filter.column, filter.condition, filter.value)
                    : null
            ).filter(Boolean);

            if (conditions.length > 0) {
                query[logicOperator === "AND" ? "$and" : "$or"] = conditions;
            }
        }

        // Search query
        if (searchQuery) {
            const searchTermsArray = searchQuery.split(" ");
            const regexTerms = searchTermsArray.map(term => new RegExp(term, "i"));
            const orConditions = regexTerms.map(regex => ({
                $or: [
                    { project: regex },
                    { category: regex },
                    { subcategory: regex },
                    { total: regex },
                    { date: regex },
                    { time: regex },
                    { assignedby: regex },
                    { assignedmode: regex },
                    { ticket: regex },
                    { duedate: regex },
                    { duetime: regex },
                    { estimation: regex },
                    { estimationtime: regex },
                ],
            }));

            query = { $and: [query, ...orConditions] };
        }

        // Check if query is empty
        const isEmpty = Object.keys(query).length === 0;

        // Use aggregation to get totalProjects and results in a single query
        const aggregationPipeline = [
            { $match: isEmpty ? {} : query },
            {
                $facet: {
                    totalProjects: [{ $count: "count" }],
                    results: [
                        { $skip: (page - 1) * pageSize },
                        { $limit: parseInt(pageSize) },
                        {
                            $project: {
                                assignedby: 1,
                                assignedmode: 1,
                                category: 1,
                                project: 1,
                                subcategory: 1,
                                total: 1,
                                date: 1,
                                time: 1,
                                duedate: 1,
                                duetime: 1,
                                estimation: 1,
                                estimationtime: 1,
                                ticket: 1,
                                orate: 1,
                                conversion: 1,
                                mrate: 1,
                                flagcount: 1,
                                mratetotal: 1,
                            }
                        },
                    ],
                }
            },
        ];

        const [aggregationResult] = await Manageothertask.aggregate(aggregationPipeline);
        const totalProjects = aggregationResult.totalProjects[0]?.count || 0;
        const results = aggregationResult.results;

        return res.status(200).json({
            totalProjects,
            result: isEmpty ? [] : results,
            currentPage: page,
            totalProjectsOverall: [],
            totalPages: Math.ceil(totalProjects / pageSize),
        });

    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }
});
exports.getOverallOthertaskEmployeeSortExport = catchAsyncErrors(async (req, res, next) => {
    try {
        const {
            project, category, subcategory, assignedby, assignedmode, fromdate, todate,
            month, year, allFilters, logicOperator, searchQuery
        } = req.body;

        let query = {};

        // General filters
        if (project?.length) query.project = { $in: project };
        if (category?.length) query.category = { $in: category };
        if (subcategory?.length) query.subcategory = { $in: subcategory };
        if (assignedby?.length) query.assignedby = { $in: assignedby };
        if (assignedmode?.length) query.assignedmode = { $in: assignedmode };

        // Date filtering
        if (fromdate || todate) {
            query.date = {};
            if (fromdate) query.date.$gte = fromdate;
            if (todate) query.date.$lte = todate;
        }

        // Month and Year filtering
        // Convert month names to numerical values
        const monthIndices = month.map(m => ({
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
            July: 7, August: 8, September: 9, October: 10, November: 11, December: 12
        }[m]));

        // Ensure monthIndices is valid
        if (monthIndices.includes(undefined)) {
            return next(new ErrorHandler("Invalid month format", 400));
        }

        // Apply Month and Year filtering
        if (Array.isArray(month) && month.length > 0 && Array.isArray(year) && year.length > 0) {
            query.$expr = {
                $and: [
                    {
                        $in: [
                            { $month: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } },
                            monthIndices
                        ]
                    },
                    {
                        $in: [
                            { $year: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } },
                            year
                        ]
                    }
                ]
            };
        } else if (Array.isArray(month) && month.length > 0) {
            query.$expr = {
                $in: [
                    { $month: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } },
                    monthIndices
                ]
            };
        } else if (Array.isArray(year) && year.length > 0) {
            query.$expr = {
                $in: [
                    { $year: { $dateFromString: { dateString: "$date", format: "%Y-%m-%d" } } },
                    year
                ]
            };
        }


        // Advanced filter conditions
        if (allFilters?.length) {
            const conditions = allFilters.map(filter =>
                filter.column && filter.condition && filter.value
                    ? createFilterCondition(filter.column, filter.condition, filter.value)
                    : null
            ).filter(Boolean);

            if (conditions.length) {
                query[logicOperator === "AND" ? "$and" : "$or"] = conditions;
            }
        }

        // Search query
        if (searchQuery) {
            const regexTerms = searchQuery.split(" ").map(term => new RegExp(term, "i"));
            query.$or = regexTerms.map(regex => ({
                $or: [
                    { project: regex }, { category: regex }, { subcategory: regex }, { total: regex },
                    { date: regex }, { time: regex }, { assignedby: regex }, { assignedmode: regex },
                    { ticket: regex }, { duedate: regex }, { duetime: regex }, { estimation: regex },
                    { estimationtime: regex }
                ]
            }));
        }

        // Skip database query if no filters are applied
        if (Object.keys(query).length === 0) {
            return res.status(200).json({ totalProjectsOverall: [] });
        }

        // Fetch and sort unitsrate within MongoDB
        const unitsrate = await Unitrate.find({}, {
            category: 1,
            subcategory: 1,
            mrate: 1,
            trate: 1,
            flagcount: 1,
            flagstatus: 1,
            points: 1,
            project: 1,
            conversion: 1,
            orate: 1,
        })
            .sort({ category: 1, subcategory: 1 }) // Sorting in MongoDB
            .lean();

        // Convert to a Map for fast lookup
        const unitsrateMap = new Map(
            unitsrate.map(puc => [`${puc.project}-${puc.category}-${puc.subcategory}`, puc])
        );

        // Fetch data
        const totalProjectsOverall = await Manageothertask.find(query).select({
            assignedby: 1, assignedmode: 1, category: 1, project: 1, subcategory: 1, total: 1,
            date: 1, time: 1, duedate: 1, duetime: 1, estimation: 1, estimationtime: 1,
            ticket: 1, orate: 1, conversion: 1, mrate: 1, flagcount: 1, mratetotal: 1,
        }).lean(); // Using `.lean()` for faster query response


        // Update totalProjectsOverall
        const updatedTotalProjectsOverall = totalProjectsOverall.map(item => {
            const key = `${item.project}-${item.category}-${item.subcategory}`;
            const isUnitProdExist = unitsrateMap.get(key);

            if (isUnitProdExist) {
                return {
                    ...item,
                    mrate: isUnitProdExist.mrate,
                    conversion: isUnitProdExist.conversion,
                    points: isUnitProdExist.points,
                    total: isUnitProdExist.flagcount,
                    mratetotal: isUnitProdExist.mrate * isUnitProdExist.flagcount
                };
            }

            return {
                ...item,
                points: (item.mrate * item.conversion).toFixed(4),
            };
        });

        const mappedResponse = updatedTotalProjectsOverall.map((item, index) => ({
            id: item._id,
            serialNumber: index + 1, // Assigning serial number dynamically
            project: item.project,
            category: item.category,
            subcategory: item.subcategory,
            total: item.total,
            date: moment(item.date).format("DD-MM-YYYY"),
            time: moment(`${new Date().toDateString()} ${item.time}`, "ddd MMM DD YYYY HH:mm").format("hh:mm:ss A"),
            assignedby: item.assignedby,
            assignedmode: item.assignedmode,
            ticket: item.ticket,
            duedate: moment(item.duedate).format("DD-MM-YYYY"),
            duetime: moment(`${new Date().toDateString()} ${item.duetime}`, "ddd MMM DD YYYY HH:mm").format("hh:mm:ss A"),
            estimation: item.estimation,
            estimationtime: item.estimationtime,
            mrate: item.mrate,
            flagcount: item.flagcount,
            conversion: item.conversion,
            points: item.points,
            totalflag: item.totalflag,
            mratetotal: item.mratetotal ? Number(item.mratetotal).toFixed(4) : "",
        }));

        return res.status(200).json({
            totalProjectsOverall: mappedResponse,
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});
exports.getOverallOthertaskSortFlag = catchAsyncErrors(async (req, res, next) => {
    try {
        const { page, pageSize, project, logicOperator, allFilters, searchQuery, category, subcategory, fromdate, todate } = req.body;
        let query = {};

        // Construct query with filters
        if (project?.length) query.project = { $in: project };
        if (category?.length) query.category = { $in: category };
        if (subcategory?.length) query.subcategory = { $in: subcategory };
        if (fromdate || todate) {
            query.date = {};
            if (fromdate) query.date.$gte = fromdate;
            if (todate) query.date.$lte = todate;
        }

        if (Object.keys(query).length === 0) {
            return res.status(200).json({ result: [], totalProjects: 0, totalPages: 0 });
        }

        // Advanced search filter
        if (allFilters && allFilters.length > 0) {
            const conditions = allFilters.map(filter =>
                filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))
                    ? createFilterCondition(filter.column, filter.condition, filter.value)
                    : null
            ).filter(Boolean);

            if (conditions.length > 0) {
                query[logicOperator === "AND" ? "$and" : "$or"] = conditions;
            }
        }

        // Search query
        if (searchQuery) {
            const searchTermsArray = searchQuery.split(" ");
            const regexTerms = searchTermsArray.map(term => new RegExp(term, "i"));
            const orConditions = regexTerms.map(regex => ({
                $or: [
                    { project: regex },
                    { category: regex },
                    { subcategory: regex },
                    { total: regex },
                    { date: regex },

                ],
            }));

            query = { $and: [query, ...orConditions] };
        }

        // Apply pagination BEFORE calling map
        const [productionUnmatched, totalProjects, unitRates] = await Promise.all([
            Manageothertask.find(query, {
                project: 1,
                category: 1,
                subcategory: 1,
                date: 1,
                total: 1
            })
                .skip((page - 1) * pageSize)
                .limit(parseInt(pageSize))
                .lean(),
            Manageothertask.countDocuments(query),
            ProductionIndividual.find({}, { vendor: 1, fromdate: 1, time: 1, category: 1, filename: 1, flagcount: 1 }).lean()
        ]);

        // Create a map for unitRates for quick lookup
        const unitRateMap = new Map();
        for (const item of unitRates) {
            const key = `${item.fromdate}-${item.vendor.split('-')[0]}-${item.filename}-${item.category}`;
            if (!unitRateMap.has(key)) unitRateMap.set(key, []);
            unitRateMap.get(key).push(item);
        }

        const today = new Date().toDateString(); // Cache today's date to avoid redundant calls

        // Process data efficiently
        const result = productionUnmatched.map((obj, index) => {
            const matchUnitrate = unitRateMap.get(`${obj.date}-${obj.project}-${obj.category}-${obj.subcategory}`) || [];
            const manualFlagCount = matchUnitrate.reduce((sum, item) => sum + Number(item.flagcount), 0);
            const finalFlagCount = Number(obj.total) || 0;
            const diffFlagCount = finalFlagCount - manualFlagCount;
            const status = manualFlagCount === finalFlagCount ? "Reached" : "Not Reached";

            return {
                id: obj._id,
                project: obj.project,
                category: obj.category,
                subcategory: obj.subcategory,
                total: obj.total,
                status,
                date: moment(obj.date)?.format("DD-MM-YYYY"),
                diffflagcount: diffFlagCount,
                manualflagcount: manualFlagCount
            };
        });

        // Return response
        return res.status(200).json({
            totalProjects,
            currentPage: page,
            totalPages: Math.ceil(totalProjects / pageSize),
            result
        });

    } catch (err) {
        console.log(err, "err");
        return next(new ErrorHandler("Data not found", 404));
    }
});

exports.getOverallOthertaskSortFlagExport = catchAsyncErrors(async (req, res, next) => {
    try {
        const { project, category, subcategory, fromdate, todate } = req.body;
        let query = {};

        // Apply filters
        if (project?.length) query.project = { $in: project };
        if (category?.length) query.category = { $in: category };
        if (subcategory?.length) query.subcategory = { $in: subcategory };
        if (fromdate || todate) {
            query.date = {};
            if (fromdate) query.date.$gte = fromdate;
            if (todate) query.date.$lte = todate;
        }

        // Fetch productionunmatched and unitRates in parallel
        const [productionunmatched, unitRates] = await Promise.all([
            Manageothertask.find(query, { project: 1, category: 1, subcategory: 1, date: 1, total: 1 }).lean(),
            ProductionIndividual.find({}, { vendor: 1, fromdate: 1, time: 1, category: 1, filename: 1, flagcount: 1 }).lean(),
        ]);

        // Create a map for unitRates for quick lookup
        const unitRateMap = new Map();
        for (const item of unitRates) {
            const key = `${item.fromdate}-${item.vendor.split('-')[0]}-${item.filename}-${item.category}`;
            if (!unitRateMap.has(key)) unitRateMap.set(key, []);
            unitRateMap.get(key).push(item);
        }

        const todayDateString = new Date().toDateString(); // Cache today's date

        // Process productionunmatched data
        const result = productionunmatched.map((obj, index) => {
            const matchUnitrate = unitRateMap.get(`${obj.date}-${obj.project}-${obj.category}-${obj.subcategory}`) || [];
            const manualflagcount = matchUnitrate.reduce((sum, item) => sum + Number(item.flagcount), 0);
            const finalflagcount = Number(obj.total) || 0;
            const diffflagcount = finalflagcount - manualflagcount;

            return {
                id: obj._id,
                serialNumber: index + 1,
                project: obj.project,
                category: obj.category,
                subcategory: obj.subcategory,
                total: obj.total,
                status: manualflagcount === finalflagcount ? "Reached" : "Not Reached",
                date: moment(obj.date).format("DD-MM-YYYY"),
                time: moment(`${todayDateString} ${obj.time}`, "ddd MMM DD YYYY HH:mm").format("hh:mm:ss A"),
                assignedby: obj.assignedby,
                assignedmode: obj.assignedmode,
                ticket: obj.ticket,
                duedate: obj.duedate ? moment(obj.duedate).format("DD-MM-YYYY") : null,
                duetime: moment(`${todayDateString} ${obj.duetime}`, "ddd MMM DD YYYY HH:mm").format("hh:mm:ss A"),
                estimation: obj.estimation,
                estimationtime: obj.estimationtime,
                diffflagcount,
                manualflagcount,
            };
        });

        return res.status(200).json({ result });

    } catch (err) {
        console.error("Error:", err);
        return next(new ErrorHandler("Data not found", 404));
    }
});


// Helper function to create filter condition
function createFilterCondition(column, condition, value) {
    switch (condition) {
        case "Contains":
            return { [column]: new RegExp(value, 'i') };
        case "Does Not Contain":
            return { [column]: { $not: new RegExp(value, 'i') } };
        case "Equals":
            return { [column]: value };

        case "Does Not Equal":
            return { [column]: { $ne: value } };
        case "Begins With":
            return { [column]: new RegExp(`^${value}`, 'i') };
        case "Ends With":
            return { [column]: new RegExp(`${value}$`, 'i') };
        case "Blank":
            return { [column]: { $exists: false } };
        case "Not Blank":
            return { [column]: { $exists: true } };
        default:
            return {};
    }
}





