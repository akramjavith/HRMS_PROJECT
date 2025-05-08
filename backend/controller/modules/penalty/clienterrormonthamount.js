const ClientErrorMonthAmounts = require("../../../model/modules/penalty/clienterrormonthamount");
const PenaltyClientError = require('../../../model/modules/penalty/penaltyclienterror');
const ProductionClientRate = require('../../../model/modules/production/productionclientrate');
const DepartmentMonth = require("../../../model/modules/departmentmonthset");
const ClientUserID = require("../../../model/modules/production/ClientUserIDModel");
const Hirerarchi = require('../../../model/modules/setup/hierarchy');
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ClientErrorMonthAmounts => /api/ClientErrorMonthAmounts
exports.getAllClienterrormonthamounts = catchAsyncErrors(async (req, res, next) => {
    let clienterrormonthamounts;
    try {
        clienterrormonthamounts = await ClientErrorMonthAmounts.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!clienterrormonthamounts) {
        return next(new ErrorHandler("Client Error Month Amounts not found!", 404));
    }
    return res.status(200).json({
        clienterrormonthamounts,
    });
});

// Create new ClientErrorMonthAmounts=> /api/ClientErrorMonthAmounts/new
exports.addClienterrormonthamounts = catchAsyncErrors(async (req, res, next) => {
    let aclienterrormonthamounts = await ClientErrorMonthAmounts.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle clienterrormonthamounts => /api/clienterrormonthamounts/:id
exports.getSingleClienterrormonthamounts = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sclienterrormonthamounts = await ClientErrorMonthAmounts.findById(id);

    if (!sclienterrormonthamounts) {
        return next(new ErrorHandler("Client Error Month Amounts not found!", 404));
    }
    return res.status(200).json({
        sclienterrormonthamounts,
    });
});

// update clienterrormonthamounts by id => /api/clienterrormonthamounts/:id
exports.updateClienterrormonthamounts = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uclienterrormonthamounts = await ClientErrorMonthAmounts.findByIdAndUpdate(id, req.body);
    if (!uclienterrormonthamounts) {
        return next(new ErrorHandler("Client Error Month Amounts not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete clienterrormonthamounts by id => /api/clienterrormonthamounts/:id
exports.deleteClienterrormonthamounts = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dclienterrormonthamounts = await ClientErrorMonthAmounts.findByIdAndRemove(id);

    if (!dclienterrormonthamounts) {
        return next(new ErrorHandler("Client Error Month Amounts not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});

// Client error month amount's view page
exports.getAllClientErrorMonthAmountConsolidate = catchAsyncErrors(async (req, res, next) => {
    const { fromdate, todate } = req.body;

    let approvedpenaltyclienterror;
    let penaltyclienterrorrate;
    let clientuserid;
    let filteredData;
    let finalData;
    let aggregatedData;

    try {
        penaltyclienterrorrate = await ProductionClientRate.find({}, { project: 1, category: 1, subcategory: 1, rate: 1 });
        approvedpenaltyclienterror = await PenaltyClientError.find({ date: { $gte: fromdate, $lte: todate },
        // errorstatus: { $eq: "Approved" }, history: { $elemMatch: { mode: "Percentage", status: "Approved" } }, 
         });
        clientuserid = await ClientUserID.find({ allotted: "allotted" });

        // compare with penaltyrate and get matched data's client rate
        filteredData = penaltyclienterrorrate.flatMap((rateData) => {
            // Find all matching approved penalty client errors
            const matchedItems = approvedpenaltyclienterror.filter((item) =>
                rateData.project === item.project &&
                rateData.category === item.category &&
                rateData.subcategory === item.subcategory
            );

            // Map each matched item to include the client amount
            return matchedItems.map((matchedItem) => ({
                _id: matchedItem?._id,
                project: matchedItem?.project,
                category: matchedItem?.category,
                subcategory: matchedItem?.subcategory,
                loginid: matchedItem?.loginid,
                vendor: matchedItem?.vendor,
                company: matchedItem?.company,
                branch: matchedItem?.branch,
                unit: matchedItem?.unit,
                team: matchedItem?.team,
                department: matchedItem?.department,
                employeename: matchedItem?.employeename,
                employeeid: matchedItem?.employeeid,
                date: matchedItem?.date,
                documentnumber: matchedItem?.documentnumber,
                documentlink: matchedItem?.documentlink,
                fieldname: matchedItem?.fieldname,
                line: matchedItem?.line,
                errorvalue: matchedItem?.errorvalue,
                correctvalue: matchedItem?.correctvalue,
                clienterror: matchedItem?.clienterror,
                errorstatus: matchedItem?.errorstatus,
                clientamount: rateData.rate,
                history: matchedItem?.history,
                amount: matchedItem?.amount,
            }));
        });

        // find recently used id matched data
        finalData = filteredData?.map((item) => {
            let concatProjectVendor = `${item.project}-${item.vendor}`;

            const loginInfo = clientuserid.filter((d) => d.userid == item.loginid && d.projectvendor == concatProjectVendor);

            let loginallot = loginInfo.length > 0 ? loginInfo.map(d => d.loginallotlog).flat() : [];

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

                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break;
                    }
                }
            }

            return {
                ...item
            };
        });

        // Aggregate clientamount by employeeid
        aggregatedData = finalData.reduce((acc, item) => {
            const existingEmployee = acc.find((entry) => entry.employeeid === item.employeeid);
            if (existingEmployee) {
                existingEmployee.clientamount += item.clientamount;
                existingEmployee.amount += item.amount;
            } else {
                acc.push({
                    fromdate: fromdate,
                    todate: todate,
                    employeeid: item.employeeid,
                    employeename: item.employeename,
                    clientamount: item.clientamount,
                    amount: item.amount || 0.00,
                });
            }
            return acc;
        }, []);

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!aggregatedData) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({
        aggregatedData
    });
});

// Client error waiver page filter
exports.getAllClientErrorWaiver = catchAsyncErrors(async (req, res, next) => {
    const { fromdate, todate, companyname } = req.body;

    let approvedpenaltyclienterror;
    let penaltyclienterrorrate;
    let clientuserid;
    let filteredData;
    let finalData;

    try {
        penaltyclienterrorrate = await ProductionClientRate.find({}, { project: 1, category: 1, subcategory: 1, rate: 1 });
        approvedpenaltyclienterror = await PenaltyClientError.find({ date: { $gte: fromdate, $lte: todate }, errorstatus: { $eq: "Approved" }, employeename: { $eq: companyname } });
        // clientuserid = await ClientUserID.find({ allotted: "allotted" });
        clientuserid = await ClientUserID.find(
            { loginallotlog: { $exists: true, $ne: [] } },
            { empname: 1, userid: 1, loginallotlog: 1, projectvendor: 1 }
        ).lean();

        // compare with penaltyrate and get matched data's client rate
        filteredData = penaltyclienterrorrate.flatMap((rateData) => {
            // Find all matching approved penalty client errors
            const matchedItems = approvedpenaltyclienterror.filter((item) =>
                rateData.project === item.project &&
                rateData.category === item.category &&
                rateData.subcategory === item.subcategory
            );

            // Map each matched item to include the client amount
            return matchedItems.map((matchedItem) => ({
                _id: matchedItem?._id,
                project: matchedItem?.project,
                category: matchedItem?.category,
                subcategory: matchedItem?.subcategory,
                loginid: matchedItem?.loginid,
                vendor: matchedItem?.vendor,
                company: matchedItem?.company,
                branch: matchedItem?.branch,
                unit: matchedItem?.unit,
                team: matchedItem?.team,
                department: matchedItem?.department,
                employeename: matchedItem?.employeename,
                employeeid: matchedItem?.employeeid,
                date: matchedItem?.date,
                documentnumber: matchedItem?.documentnumber,
                documentlink: matchedItem?.documentlink,
                fieldname: matchedItem?.fieldname,
                line: matchedItem?.line,
                errorvalue: matchedItem?.errorvalue,
                correctvalue: matchedItem?.correctvalue,
                clienterror: matchedItem?.clienterror,
                errorstatus: matchedItem?.errorstatus,
                clientamount: rateData?.rate,
                percentage: matchedItem?.percentage,
                amount: matchedItem?.amount ? matchedItem?.amount : 0,
                history: matchedItem?.history,
            }));
        });
        // console.log(filteredData, 'filteredData')
        // find recently used id matched data
        // finalData = filteredData?.map((val) => {
        //     const relevantUser = clientuserid?.find((item) => val.loginid === item.userid);
        //     clientuserid?.find((item) => console.log(val.loginid, item.userid, val.loginid === item.userid));
        //     // console.log(val.loginid, 'relevantUser')

        //     if (relevantUser) {
        //         // Remove duplicate entries with the most recent entry
        //         const uniqueEntriesAllotId = {};
        //         relevantUser?.loginallotlog?.forEach((entry) => {
        //             const entryDate = new Date(entry.date); // Parse the date into a date object
        //             const key = entry.date;
        //             if (!(key in uniqueEntriesAllotId)) {
        //                 uniqueEntriesAllotId[key] = entry;
        //             }
        //         });

        //         const uniqueAllotId = Object.values(uniqueEntriesAllotId);

        //         // Find the relevant log entry for the given date     
        //         const relevantAllotIdEntry = uniqueAllotId
        //             .filter((log) => log.date <= val.date)
        //             .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

        //         if (relevantAllotIdEntry && relevantAllotIdEntry.userid === val.loginid && val.employeename === companyname) {
        //             return val;
        //         }
        //     }

        //     return null;
        // });

        finalData = filteredData?.map((item) => {
            let concatProjectVendor = `${item.project}-${item.vendor}`;

            const loginInfo = clientuserid.filter((d) => d.userid == item.loginid && d.projectvendor == concatProjectVendor);

            let loginallot = loginInfo.length > 0 ? loginInfo.map(d => d.loginallotlog).flat() : [];

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

                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break;
                    }
                }
            }

            return {
                ...item._doc,
                _id: item?._id,
                project: item?.project,
                category: item?.category,
                subcategory: item?.subcategory,
                loginid: item?.loginid,
                vendor: item?.vendor,
                company: item?.company,
                branch: item?.branch,
                unit: item?.unit,
                team: item?.team,
                department: item?.department,
                employeename: item?.employeename,
                employeeid: item?.employeeid,
                date: item?.date,
                documentnumber: item?.documentnumber,
                documentlink: item?.documentlink,
                fieldname: item?.fieldname,
                line: item?.line,
                errorvalue: item?.errorvalue,
                correctvalue: item?.correctvalue,
                clienterror: item?.clienterror,
                errorstatus: item?.errorstatus,
                clientamount: item?.clientamount,
                companyname: item?.employeename,
                percentage: item?.percentage,
                amount: item?.amount ? item?.amount : 0,
                history: item?.history,
            };
        });
        // console.log(finalData, 'finalData')
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!finalData) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({ finalData });
});

// Client error forward page hierarchy filter


// To calculate month error data compared with departmentmonth in Client error waiver approval page
exports.getDepartmentBasedOnDateFilter = catchAsyncErrors(async (req, res, next) => {
    let departmentdetails;
    // const { fromdate, todate } = req.body;
    const { department } = req.body;

    try {
        
        departmentdetails = await DepartmentMonth.find({ 
        // department: { $eq: department } 
        
        }, { department: 1, year: 1, month: 1, monthname: 1, fromdate: 1, todate: 1 });
        
         return res.status(200).json({ departmentdetails, });

    } catch (err) {
    console.log(err,"sdfsdfs")
        return next(new ErrorHandler("Records not found!", 404));
    }
 
    
   
}
);
exports.getAllClientErrorForwardHierarchyFilter = catchAsyncErrors(async (req, res, next) => {
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
        hierarchySecond,

        hierarchyMap,
        resulted,
        resultedTeam,
        hierarchyFinal,
        hierarchyDefault,
        penaltyresult,
        approvedpenaltyclienterror, penaltyclienterrorrate, hierarchyfirstlevel;
    let resultAccessFilterHierarchy = [];
    let resultsectorother = []
    let filteredoverallsectorall = []


    try {
        const { listpageaccessmode } = req.body;
        let clientidsmap;
        let levelFinal = req.body?.sector === "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body?.sector]

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

            let clientids = await ClientUserID.find(
                {
                    empname: { $in: companyNames },
                },
                { userid: 1 }
            ).lean();

            clientidsmap = clientids.map((user) => user.userid);
        }

        let querypenalty = {
            errorstatus: "Approved",
            history: { $elemMatch: { status: "Sent" } },
            ...(listpageaccessmode === "Reporting to Based"
                ? { user: { $in: clientidsmap } }
                : {}),
        }

        approvedpenaltyclienterror = await PenaltyClientError.find(querypenalty, {});
        penaltyclienterrorrate = await ProductionClientRate.find({}, { project: 1, category: 1, subcategory: 1, rate: 1 });

        clientuserid = await ClientUserID.find(
            { loginallotlog: { $exists: true, $ne: [] } },
            { empname: 1, userid: 1, loginallotlog: 1, projectvendor: 1 }
        ).lean();

        // compare with penaltyrate and get matched data's client rate
        penaltyresult = penaltyclienterrorrate.flatMap((rateData) => {
            // Find all matching approved penalty client errors
            const matchedItems = approvedpenaltyclienterror.filter((item) =>
                rateData.project === item.project &&
                rateData.category === item.category &&
                rateData.subcategory === item.subcategory
            );

            // Map each matched item to include the client amount
            return matchedItems.map((matchedItem) => ({
                _id: matchedItem?._id,
                project: matchedItem?.project,
                category: matchedItem?.category,
                subcategory: matchedItem?.subcategory,
                loginid: matchedItem?.loginid,
                vendor: matchedItem?.vendor,
                company: matchedItem?.company,
                branch: matchedItem?.branch,
                unit: matchedItem?.unit,
                team: matchedItem?.team,
                department: matchedItem?.department,
                employeename: matchedItem?.employeename,
                employeeid: matchedItem?.employeeid,
                date: matchedItem?.date,
                documentnumber: matchedItem?.documentnumber,
                documentlink: matchedItem?.documentlink,
                fieldname: matchedItem?.fieldname,
                line: matchedItem?.line,
                errorvalue: matchedItem?.errorvalue,
                correctvalue: matchedItem?.correctvalue,
                clienterror: matchedItem?.clienterror,
                errorstatus: matchedItem?.errorstatus,
                clientamount: rateData?.rate,
                percentage: matchedItem?.percentage,
                amount: matchedItem?.amount ? matchedItem?.amount : 0,
                history: matchedItem?.history,
            }));
        });

        result = penaltyresult.map((item) => {
            let concatProjectVendor = `${item.project}-${item.vendor}`;

            const loginInfo = clientuserid.filter((d) => d.userid == item.loginid && d.projectvendor == concatProjectVendor);

            let loginallot = loginInfo.length > 0 ? loginInfo.map(d => d.loginallotlog).flat() : [];

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

                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break;
                    }
                }
            }

            return {
                ...item._doc,
                _id: item?._id,
                project: item?.project,
                category: item?.category,
                subcategory: item?.subcategory,
                loginid: item?.loginid,
                vendor: item?.vendor,
                company: item?.company,
                branch: item?.branch,
                unit: item?.unit,
                team: item?.team,
                department: item?.department,
                employeename: item?.employeename,
                employeeid: item?.employeeid,
                date: item?.date,
                documentnumber: item?.documentnumber,
                documentlink: item?.documentlink,
                fieldname: item?.fieldname,
                line: item?.line,
                errorvalue: item?.errorvalue,
                correctvalue: item?.correctvalue,
                clienterror: item?.clienterror,
                errorstatus: item?.errorstatus,
                clientamount: item?.clientamount,
                companyname: item?.employeename,
                percentage: item?.percentage,
                amount: item?.amount ? item?.amount : 0,
                history: item?.history,
            };
        });
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
                        _id: userObj?._id,
                        project: userObj?.project,
                        category: userObj?.category,
                        subcategory: userObj?.subcategory,
                        loginid: userObj?.loginid,
                        vendor: userObj?.vendor,
                        company: userObj?.company,
                        branch: userObj?.branch,
                        unit: userObj?.unit,
                        team: userObj?.team,
                        department: userObj?.department,
                        employeename: userObj?.employeename,
                        employeeid: userObj?.employeeid,
                        date: userObj?.date,
                        documentnumber: userObj?.documentnumber,
                        documentlink: userObj?.documentlink,
                        fieldname: userObj?.fieldname,
                        line: userObj?.line,
                        errorvalue: userObj?.errorvalue,
                        correctvalue: userObj?.correctvalue,
                        clienterror: userObj?.clienterror,
                        errorstatus: userObj?.errorstatus,
                        clientamount: userObj.clientamount,
                        companyname: userObj?.companyname,
                        percentage: userObj?.percentage,
                        amount: userObj?.amount ? userObj?.amount : 0,
                        history: userObj?.history,
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


            // let sectorFinal = req.body.sector == "all"
            //   ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

            // hierarchyDefault = await Hirerarchi.find({
            //   supervisorchoose: req.body.username,
            //   level: { $in: sectorFinal },

            // });


            let sectorFinal = req.body.sector == "all"
                ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

            let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
                supervisorchoose: req.body.username,
            }, { level: 1 });

            FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

            hierarchyDefault = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: { $in: FirstSuphierarchyDefaultLevel },
            });

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
                            FirstSuphierarchyDefaultLevel.includes(item.level) &&
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
                answerDef,
                processedSupervisors,
                []
            );
            let answerDeoverall = filteredOverallItem
                .filter((data) =>
                    FirstSuphierarchyDefaultLevel.includes(data.level)
                )
                .map((item) => item.employeename[0]);


            resultedTeam = result
                .map((userObj) => {
                    const matchingHierarchycontrol = filteredOverallItem.find(
                        (hierarchyObj) =>
                            hierarchyObj.employeename[0] == userObj.companyname
                    );
                    return {
                        _id: userObj?._id,
                        project: userObj?.project,
                        category: userObj?.category,
                        subcategory: userObj?.subcategory,
                        loginid: userObj?.loginid,
                        vendor: userObj?.vendor,
                        company: userObj?.company,
                        branch: userObj?.branch,
                        unit: userObj?.unit,
                        team: userObj?.team,
                        department: userObj?.department,
                        employeename: userObj?.employeename,
                        employeeid: userObj?.employeeid,
                        date: userObj?.date,
                        documentnumber: userObj?.documentnumber,
                        documentlink: userObj?.documentlink,
                        fieldname: userObj?.fieldname,
                        line: userObj?.line,
                        errorvalue: userObj?.errorvalue,
                        correctvalue: userObj?.correctvalue,
                        clienterror: userObj?.clienterror,
                        errorstatus: userObj?.errorstatus,
                        clientamount: userObj.clientamount,
                        companyname: userObj?.companyname,
                        percentage: userObj?.percentage,
                        amount: userObj?.amount ? userObj?.amount : 0,
                        history: userObj?.history,
                        level: matchingHierarchycontrol
                            ? matchingHierarchycontrol.level
                            : "",
                        control: matchingHierarchycontrol
                            ? matchingHierarchycontrol.control
                            : "",
                    };
                })
                .filter((data) => answerDeoverall.includes(data.companyname));

            if (resultedTeam.length == 0) {

                let sectorFinal = req.body.sector == "all"
                    ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

                let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
                }, { level: 1 });

                FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

                hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: { $in: FirstSuphierarchyDefaultLevel }, });
                //  let hierarchySecond2 = await Hirerarchi.find({});
                hierarchySecond = await Hirerarchi.find(
                    {},
                    { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
                );

                hierarchyDefault = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
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

            // primaryhierarchyall = resultedTeam
            //     .filter((item) => item.level == "Primary")
            //     .map((item) => item.companyname);

            // secondaryhierarchyall = resultedTeam
            //     .filter((item) => item.level == "Secondary")
            //     .map((item) => item.companyname);

            // tertiaryhierarchyall = resultedTeam
            //     .filter((item) => item.level == "Tertiary")
            //     .map((item) => item.companyname);
        }

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

            let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
                supervisorchoose: req.body.username,
            }, { level: 1 });

            FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

            hierarchyDefault = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: { $in: FirstSuphierarchyDefaultLevel },
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
                            FirstSuphierarchyDefaultLevel.includes(item.level) &&
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
                    FirstSuphierarchyDefaultLevel.includes(data.level)
                )
                .map((item) => item.employeename[0]);


            filteredoverall = result
                .map((userObj) => {
                    const matchingHierarchycontrol = filteredOverallItem.find(
                        (hierarchyObj) =>
                            hierarchyObj.employeename[0] == userObj.companyname
                    );
                    return {
                        _id: userObj?._id,
                        project: userObj?.project,
                        category: userObj?.category,
                        subcategory: userObj?.subcategory,
                        loginid: userObj?.loginid,
                        vendor: userObj?.vendor,
                        company: userObj?.company,
                        branch: userObj?.branch,
                        unit: userObj?.unit,
                        team: userObj?.team,
                        department: userObj?.department,
                        employeename: userObj?.employeename,
                        employeeid: userObj?.employeeid,
                        date: userObj?.date,
                        documentnumber: userObj?.documentnumber,
                        documentlink: userObj?.documentlink,
                        fieldname: userObj?.fieldname,
                        line: userObj?.line,
                        errorvalue: userObj?.errorvalue,
                        correctvalue: userObj?.correctvalue,
                        clienterror: userObj?.clienterror,
                        errorstatus: userObj?.errorstatus,
                        clientamount: userObj.clientamount,
                        companyname: userObj?.companyname,
                        percentage: userObj?.percentage,
                        amount: userObj?.amount ? userObj?.amount : 0,
                        history: userObj?.history,
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
                    _id: userObj?._id,
                    project: userObj?.project,
                    category: userObj?.category,
                    subcategory: userObj?.subcategory,
                    loginid: userObj?.loginid,
                    vendor: userObj?.vendor,
                    company: userObj?.company,
                    branch: userObj?.branch,
                    unit: userObj?.unit,
                    team: userObj?.team,
                    department: userObj?.department,
                    employeename: userObj?.employeename,
                    employeeid: userObj?.employeeid,
                    date: userObj?.date,
                    documentnumber: userObj?.documentnumber,
                    documentlink: userObj?.documentlink,
                    fieldname: userObj?.fieldname,
                    line: userObj?.line,
                    errorvalue: userObj?.errorvalue,
                    correctvalue: userObj?.correctvalue,
                    clienterror: userObj?.clienterror,
                    errorstatus: userObj?.errorstatus,
                    clientamount: userObj.clientamount,
                    companyname: userObj?.companyname,
                    percentage: userObj?.percentage,
                    amount: userObj?.amount ? userObj?.amount : 0,
                    history: userObj?.history,
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
        resultAccessFilterHierarchy = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : filteredoverall;
        resultAccessFilter = restrictListTeam?.length > 0 ? resultAccessFilterHierarchy?.filter(data => restrictListTeam?.includes(data?.companyname)) : [];
      console.log(resultAccessFilter.length,resultAccessFilterHierarchy.length,"clienterapp")
    } catch (err) {
        console.log(err.message, "err");
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!resultAccessFilter) {
        return next(new ErrorHandler("No data found!", 404));
    }
    return res.status(200).json({
        hierarchyfirstlevel,
        filteredoverallsectorall,
        resultAccessFilterHierarchy: resultAccessFilterHierarchy.length,
        resultAccessFilter,
    });
}
);

// Client error waiver approval page hierarchy with date filter
exports.getAllClientErrorWaiverApprovalHierarchyWithDateFilter = catchAsyncErrors(async (req, res, next) => {
    let result,
        reportingtobaseduser,
        clientuserid,
        hierarchy,
        hierarchyfirstlevel,
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
        hierarchySecond,
        hierarchyMap,
        resulted,
        resultedTeam,
        hierarchyFinal,
        hierarchyDefault,
        penaltyresult, alluser,
        approvedpenaltyclienterror, penaltyclienterrorrate;
    let resultAccessFilterHierarchy = [];
    let resultsectorother = []
    let filteredoverallsectorall = []

    try {
        const { listpageaccessmode } = req.body;
        let clientidsmap;
        let levelFinal = req.body?.sector === "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body?.sector]

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

            let clientids = await ClientUserID.find(
                {
                    empname: { $in: companyNames },
                },
                { userid: 1 }
            ).lean();

            clientidsmap = clientids.map((user) => user.userid);
        }

        let querypenalty = {
            errorstatus: "Approved",
            history: { $elemMatch: { status: "Sent" } },
            date: { $gte: req.body.fromdate, $lte: req.body.todate },
            ...(listpageaccessmode === "Reporting to Based"
                ? { user: { $in: clientidsmap } }
                : {}),
        }

        approvedpenaltyclienterror = await PenaltyClientError.find(querypenalty, {});
        penaltyclienterrorrate = await ProductionClientRate.find({}, { project: 1, category: 1, subcategory: 1, rate: 1 });

        clientuserid = await ClientUserID.find(
            { loginallotlog: { $exists: true, $ne: [] } },
            { empname: 1, userid: 1, loginallotlog: 1, projectvendor: 1 }
        ).lean();

        // compare with penaltyrate and get matched data's client rate
        penaltyresult = penaltyclienterrorrate.flatMap((rateData) => {
            // Find all matching approved penalty client errors
            const matchedItems = approvedpenaltyclienterror.filter((item) =>
                rateData.project === item.project &&
                rateData.category === item.category &&
                rateData.subcategory === item.subcategory
            );

            // Map each matched item to include the client amount
            return matchedItems.map((matchedItem) => ({
                _id: matchedItem?._id,
                project: matchedItem?.project,
                category: matchedItem?.category,
                subcategory: matchedItem?.subcategory,
                loginid: matchedItem?.loginid,
                vendor: matchedItem?.vendor,
                company: matchedItem?.company,
                branch: matchedItem?.branch,
                unit: matchedItem?.unit,
                team: matchedItem?.team,
                department: matchedItem?.department,
                employeename: matchedItem?.employeename,
                employeeid: matchedItem?.employeeid,
                date: matchedItem?.date,
                documentnumber: matchedItem?.documentnumber,
                documentlink: matchedItem?.documentlink,
                fieldname: matchedItem?.fieldname,
                line: matchedItem?.line,
                errorvalue: matchedItem?.errorvalue,
                correctvalue: matchedItem?.correctvalue,
                clienterror: matchedItem?.clienterror,
                errorstatus: matchedItem?.errorstatus,
                clientamount: rateData?.rate,
                percentage: matchedItem?.percentage,
                amount: matchedItem?.amount ? matchedItem?.amount : 0,
                history: matchedItem?.history,
            }));
        });

        result = penaltyresult.map((item) => {
            let concatProjectVendor = `${item.project}-${item.vendor}`;

            const loginInfo = clientuserid.filter((d) => d.userid == item.loginid && d.projectvendor == concatProjectVendor);

            let loginallot = loginInfo.length > 0 ? loginInfo.map(d => d.loginallotlog).flat() : [];

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

                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break;
                    }
                }
            }

            return {
                ...item._doc,
                _id: item?._id,
                project: item?.project,
                category: item?.category,
                subcategory: item?.subcategory,
                loginid: item?.loginid,
                vendor: item?.vendor,
                company: item?.company,
                branch: item?.branch,
                unit: item?.unit,
                team: item?.team,
                department: item?.department,
                employeename: item?.employeename,
                employeeid: item?.employeeid,
                date: item?.date,
                documentnumber: item?.documentnumber,
                documentlink: item?.documentlink,
                fieldname: item?.fieldname,
                line: item?.line,
                errorvalue: item?.errorvalue,
                correctvalue: item?.correctvalue,
                clienterror: item?.clienterror,
                errorstatus: item?.errorstatus,
                clientamount: item?.clientamount,
                companyname: item?.employeename,
                percentage: item?.percentage,
                amount: item?.amount ? item?.amount : 0,
                history: item?.history,
            };
        });
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
                        _id: userObj?._id,
                        project: userObj?.project,
                        category: userObj?.category,
                        subcategory: userObj?.subcategory,
                        loginid: userObj?.loginid,
                        vendor: userObj?.vendor,
                        company: userObj?.company,
                        branch: userObj?.branch,
                        unit: userObj?.unit,
                        team: userObj?.team,
                        department: userObj?.department,
                        employeename: userObj?.employeename,
                        employeeid: userObj?.employeeid,
                        date: userObj?.date,
                        documentnumber: userObj?.documentnumber,
                        documentlink: userObj?.documentlink,
                        fieldname: userObj?.fieldname,
                        line: userObj?.line,
                        errorvalue: userObj?.errorvalue,
                        correctvalue: userObj?.correctvalue,
                        clienterror: userObj?.clienterror,
                        errorstatus: userObj?.errorstatus,
                        clientamount: userObj.clientamount,
                        companyname: userObj?.companyname,
                        percentage: userObj?.percentage,
                        amount: userObj?.amount ? userObj?.amount : 0,
                        history: userObj?.history,
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


            // let sectorFinal = req.body.sector == "all"
            //   ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

            // hierarchyDefault = await Hirerarchi.find({
            //   supervisorchoose: req.body.username,
            //   level: { $in: sectorFinal },

            // });


            let sectorFinal = req.body.sector == "all"
                ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

            let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
                supervisorchoose: req.body.username,
            }, { level: 1 });

            FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

            hierarchyDefault = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: { $in: FirstSuphierarchyDefaultLevel },
            });

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
                            FirstSuphierarchyDefaultLevel.includes(item.level) &&
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
                answerDef,
                processedSupervisors,
                []
            );
            let answerDeoverall = filteredOverallItem
                .filter((data) =>
                    FirstSuphierarchyDefaultLevel.includes(data.level)
                )
                .map((item) => item.employeename[0]);


            resultedTeam = result
                .map((userObj) => {
                    const matchingHierarchycontrol = filteredOverallItem.find(
                        (hierarchyObj) =>
                            hierarchyObj.employeename[0] == userObj.companyname
                    );
                    return {
                        _id: userObj?._id,
                        project: userObj?.project,
                        category: userObj?.category,
                        subcategory: userObj?.subcategory,
                        loginid: userObj?.loginid,
                        vendor: userObj?.vendor,
                        company: userObj?.company,
                        branch: userObj?.branch,
                        unit: userObj?.unit,
                        team: userObj?.team,
                        department: userObj?.department,
                        employeename: userObj?.employeename,
                        employeeid: userObj?.employeeid,
                        date: userObj?.date,
                        documentnumber: userObj?.documentnumber,
                        documentlink: userObj?.documentlink,
                        fieldname: userObj?.fieldname,
                        line: userObj?.line,
                        errorvalue: userObj?.errorvalue,
                        correctvalue: userObj?.correctvalue,
                        clienterror: userObj?.clienterror,
                        errorstatus: userObj?.errorstatus,
                        clientamount: userObj.clientamount,
                        companyname: userObj?.companyname,
                        percentage: userObj?.percentage,
                        amount: userObj?.amount ? userObj?.amount : 0,
                        history: userObj?.history,
                        level: matchingHierarchycontrol
                            ? matchingHierarchycontrol.level
                            : "",
                        control: matchingHierarchycontrol
                            ? matchingHierarchycontrol.control
                            : "",
                    };
                })
                .filter((data) => answerDeoverall.includes(data.companyname));


            if (resultedTeam.length == 0) {

                let sectorFinal = req.body.sector == "all"
                    ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

                let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
                }, { level: 1 });

                FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

                hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: { $in: FirstSuphierarchyDefaultLevel }, });
                //  let hierarchySecond2 = await Hirerarchi.find({});
                hierarchySecond = await Hirerarchi.find(
                    {},
                    { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
                );

                hierarchyDefault = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
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

            // primaryhierarchyall = resultedTeam
            //     .filter((item) => item.level == "Primary")
            //     .map((item) => item.companyname);

            // secondaryhierarchyall = resultedTeam
            //     .filter((item) => item.level == "Secondary")
            //     .map((item) => item.companyname);

            // tertiaryhierarchyall = resultedTeam
            //     .filter((item) => item.level == "Tertiary")
            //     .map((item) => item.companyname);
        }

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

            let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
                supervisorchoose: req.body.username,
            }, { level: 1 });

            FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

            hierarchyDefault = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: { $in: FirstSuphierarchyDefaultLevel },
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
                            FirstSuphierarchyDefaultLevel.includes(item.level) &&
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
                    FirstSuphierarchyDefaultLevel.includes(data.level)
                )
                .map((item) => item.employeename[0]);

            filteredoverall = result
                .map((userObj) => {
                    const matchingHierarchycontrol = filteredOverallItem.find(
                        (hierarchyObj) =>
                            hierarchyObj.employeename[0] == userObj.companyname
                    );
                    return {
                        _id: userObj?._id,
                        project: userObj?.project,
                        category: userObj?.category,
                        subcategory: userObj?.subcategory,
                        loginid: userObj?.loginid,
                        vendor: userObj?.vendor,
                        company: userObj?.company,
                        branch: userObj?.branch,
                        unit: userObj?.unit,
                        team: userObj?.team,
                        department: userObj?.department,
                        employeename: userObj?.employeename,
                        employeeid: userObj?.employeeid,
                        date: userObj?.date,
                        documentnumber: userObj?.documentnumber,
                        documentlink: userObj?.documentlink,
                        fieldname: userObj?.fieldname,
                        line: userObj?.line,
                        errorvalue: userObj?.errorvalue,
                        correctvalue: userObj?.correctvalue,
                        clienterror: userObj?.clienterror,
                        errorstatus: userObj?.errorstatus,
                        clientamount: userObj.clientamount,
                        companyname: userObj?.companyname,
                        percentage: userObj?.percentage,
                        amount: userObj?.amount ? userObj?.amount : 0,
                        history: userObj?.history,
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
                    _id: userObj?._id,
                    project: userObj?.project,
                    category: userObj?.category,
                    subcategory: userObj?.subcategory,
                    loginid: userObj?.loginid,
                    vendor: userObj?.vendor,
                    company: userObj?.company,
                    branch: userObj?.branch,
                    unit: userObj?.unit,
                    team: userObj?.team,
                    department: userObj?.department,
                    employeename: userObj?.employeename,
                    employeeid: userObj?.employeeid,
                    date: userObj?.date,
                    documentnumber: userObj?.documentnumber,
                    documentlink: userObj?.documentlink,
                    fieldname: userObj?.fieldname,
                    line: userObj?.line,
                    errorvalue: userObj?.errorvalue,
                    correctvalue: userObj?.correctvalue,
                    clienterror: userObj?.clienterror,
                    errorstatus: userObj?.errorstatus,
                    clientamount: userObj.clientamount,
                    companyname: userObj?.companyname,
                    percentage: userObj?.percentage,
                    amount: userObj?.amount ? userObj?.amount : 0,
                    history: userObj?.history,
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
        resultAccessFilterHierarchy = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : filteredoverall;
        resultAccessFilter = restrictListTeam?.length > 0 ? resultAccessFilterHierarchy?.filter(data => restrictListTeam?.includes(data?.companyname)) : [];
      console.log(resultAccessFilter.length,resultAccessFilterHierarchy.length,"approve")
    } catch (err) {
        console.log(err.message, "err");
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!resultAccessFilter) {
        return next(new ErrorHandler("No data found!", 404));
    }
    return res.status(200).json({
        hierarchyfirstlevel,
        filteredoverallsectorall,
        resultAccessFilterHierarchy: resultAccessFilterHierarchy.length,
        resultAccessFilter,
    });
}
);


exports.getAllClientErrorWaiverApprovalHierarchyWithDateFilterNanTable = catchAsyncErrors(async (req, res, next) => {
    let result,
        reportingtobaseduser,
        clientuserid,
        hierarchy,
        hierarchyfirstlevel,
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
        hierarchySecond,
        hierarchyMap,
        resulted,
        resultedTeam,
        hierarchyFinal,
        hierarchyDefault,
        penaltyresult, alluser,
        approvedpenaltyclienterror, penaltyclienterrorrate;
    let resultAccessFilterHierarchy = [];
    let resultsectorother = []
    let filteredoverallsectorall = []

    try {
        const { listpageaccessmode } = req.body;
        let clientidsmap;
        let levelFinal = req.body?.sector === "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body?.sector]

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

            let clientids = await ClientUserID.find(
                {
                    empname: { $in: companyNames },
                },
                { userid: 1 }
            ).lean();

            clientidsmap = clientids.map((user) => user.userid);
        }

        let querypenalty = {
            errorstatus: "Approved",
            $or: [
                { history: { $size: 0 } },
                { history: null },
                { history: { $exists: false } }
            ],
            date: { $gte: req.body.fromdate, $lte: req.body.todate },
            ...(listpageaccessmode === "Reporting to Based"
                ? { user: { $in: clientidsmap } }
                : {}),
        }

        approvedpenaltyclienterror = await PenaltyClientError.find(querypenalty, {});
        penaltyclienterrorrate = await ProductionClientRate.find({}, { project: 1, category: 1, subcategory: 1, rate: 1 });

        clientuserid = await ClientUserID.find(
            { loginallotlog: { $exists: true, $ne: [] } },
            { empname: 1, userid: 1, loginallotlog: 1, projectvendor: 1 }
        ).lean();

        // compare with penaltyrate and get matched data's client rate
        penaltyresult = penaltyclienterrorrate.flatMap((rateData) => {
            // Find all matching approved penalty client errors
            const matchedItems = approvedpenaltyclienterror.filter((item) =>
                rateData.project === item.project &&
                rateData.category === item.category &&
                rateData.subcategory === item.subcategory
            );

            // Map each matched item to include the client amount
            return matchedItems.map((matchedItem) => ({
                _id: matchedItem?._id,
                project: matchedItem?.project,
                category: matchedItem?.category,
                subcategory: matchedItem?.subcategory,
                loginid: matchedItem?.loginid,
                vendor: matchedItem?.vendor,
                company: matchedItem?.company,
                branch: matchedItem?.branch,
                unit: matchedItem?.unit,
                team: matchedItem?.team,
                department: matchedItem?.department,
                employeename: matchedItem?.employeename,
                employeeid: matchedItem?.employeeid,
                date: matchedItem?.date,
                documentnumber: matchedItem?.documentnumber,
                documentlink: matchedItem?.documentlink,
                fieldname: matchedItem?.fieldname,
                line: matchedItem?.line,
                errorvalue: matchedItem?.errorvalue,
                correctvalue: matchedItem?.correctvalue,
                clienterror: matchedItem?.clienterror,
                errorstatus: matchedItem?.errorstatus,
                clientamount: rateData?.rate,
                percentage: matchedItem?.percentage,
                amount: matchedItem?.amount ? matchedItem?.amount : 0,
                history: matchedItem?.history,
            }));
        });

        result = penaltyresult.map((item) => {
            let concatProjectVendor = `${item.project}-${item.vendor}`;

            const loginInfo = clientuserid.filter((d) => d.userid == item.loginid && d.projectvendor == concatProjectVendor);

            let loginallot = loginInfo.length > 0 ? loginInfo.map(d => d.loginallotlog).flat() : [];

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

                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break;
                    }
                }
            }

            return {
                ...item._doc,
                _id: item?._id,
                project: item?.project,
                category: item?.category,
                subcategory: item?.subcategory,
                loginid: item?.loginid,
                vendor: item?.vendor,
                company: item?.company,
                branch: item?.branch,
                unit: item?.unit,
                team: item?.team,
                department: item?.department,
                employeename: item?.employeename,
                employeeid: item?.employeeid,
                date: item?.date,
                documentnumber: item?.documentnumber,
                documentlink: item?.documentlink,
                fieldname: item?.fieldname,
                line: item?.line,
                errorvalue: item?.errorvalue,
                correctvalue: item?.correctvalue,
                clienterror: item?.clienterror,
                errorstatus: item?.errorstatus,
                clientamount: item?.clientamount,
                companyname: item?.employeename,
                percentage: item?.percentage,
                amount: item?.amount ? item?.amount : 0,
                history: item?.history,
            };
        });
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
                        _id: userObj?._id,
                        project: userObj?.project,
                        category: userObj?.category,
                        subcategory: userObj?.subcategory,
                        loginid: userObj?.loginid,
                        vendor: userObj?.vendor,
                        company: userObj?.company,
                        branch: userObj?.branch,
                        unit: userObj?.unit,
                        team: userObj?.team,
                        department: userObj?.department,
                        employeename: userObj?.employeename,
                        employeeid: userObj?.employeeid,
                        date: userObj?.date,
                        documentnumber: userObj?.documentnumber,
                        documentlink: userObj?.documentlink,
                        fieldname: userObj?.fieldname,
                        line: userObj?.line,
                        errorvalue: userObj?.errorvalue,
                        correctvalue: userObj?.correctvalue,
                        clienterror: userObj?.clienterror,
                        errorstatus: userObj?.errorstatus,
                        clientamount: userObj.clientamount,
                        companyname: userObj?.companyname,
                        percentage: userObj?.percentage,
                        amount: userObj?.amount ? userObj?.amount : 0,
                        history: userObj?.history,
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


            // let sectorFinal = req.body.sector == "all"
            //   ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

            // hierarchyDefault = await Hirerarchi.find({
            //   supervisorchoose: req.body.username,
            //   level: { $in: sectorFinal },

            // });


            let sectorFinal = req.body.sector == "all"
                ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

            let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
                supervisorchoose: req.body.username,
            }, { level: 1 });

            FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

            hierarchyDefault = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: { $in: FirstSuphierarchyDefaultLevel },
            });

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
                            FirstSuphierarchyDefaultLevel.includes(item.level) &&
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
                answerDef,
                processedSupervisors,
                []
            );
            let answerDeoverall = filteredOverallItem
                .filter((data) =>
                    FirstSuphierarchyDefaultLevel.includes(data.level)
                )
                .map((item) => item.employeename[0]);

            resultedTeam = result
                .map((userObj) => {
                    const matchingHierarchycontrol = filteredOverallItem.find(
                        (hierarchyObj) =>
                            hierarchyObj.employeename[0] == userObj.companyname
                    );
                    return {
                        _id: userObj?._id,
                        project: userObj?.project,
                        category: userObj?.category,
                        subcategory: userObj?.subcategory,
                        loginid: userObj?.loginid,
                        vendor: userObj?.vendor,
                        company: userObj?.company,
                        branch: userObj?.branch,
                        unit: userObj?.unit,
                        team: userObj?.team,
                        department: userObj?.department,
                        employeename: userObj?.employeename,
                        employeeid: userObj?.employeeid,
                        date: userObj?.date,
                        documentnumber: userObj?.documentnumber,
                        documentlink: userObj?.documentlink,
                        fieldname: userObj?.fieldname,
                        line: userObj?.line,
                        errorvalue: userObj?.errorvalue,
                        correctvalue: userObj?.correctvalue,
                        clienterror: userObj?.clienterror,
                        errorstatus: userObj?.errorstatus,
                        clientamount: userObj.clientamount,
                        companyname: userObj?.companyname,
                        percentage: userObj?.percentage,
                        amount: userObj?.amount ? userObj?.amount : 0,
                        history: userObj?.history,
                        level: matchingHierarchycontrol
                            ? matchingHierarchycontrol.level
                            : "",
                        control: matchingHierarchycontrol
                            ? matchingHierarchycontrol.control
                            : "",
                    };
                })
                .filter((data) => answerDeoverall.includes(data.companyname));


            if (resultedTeam.length == 0) {

                let sectorFinal = req.body.sector == "all"
                    ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

                let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
                }, { level: 1 });

                FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

                hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: { $in: FirstSuphierarchyDefaultLevel }, });
                //  let hierarchySecond2 = await Hirerarchi.find({});
                hierarchySecond = await Hirerarchi.find(
                    {},
                    { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
                );

                hierarchyDefault = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
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

            // primaryhierarchyall = resultedTeam
            //     .filter((item) => item.level == "Primary")
            //     .map((item) => item.companyname);

            // secondaryhierarchyall = resultedTeam
            //     .filter((item) => item.level == "Secondary")
            //     .map((item) => item.companyname);

            // tertiaryhierarchyall = resultedTeam
            //     .filter((item) => item.level == "Tertiary")
            //     .map((item) => item.companyname);
        }

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

            let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
                supervisorchoose: req.body.username,
            }, { level: 1 });

            FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

            hierarchyDefault = await Hirerarchi.find({
                supervisorchoose: req.body.username,
                level: { $in: FirstSuphierarchyDefaultLevel },
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
                            FirstSuphierarchyDefaultLevel.includes(item.level) &&
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
                    FirstSuphierarchyDefaultLevel.includes(data.level)
                )
                .map((item) => item.employeename[0]);


            filteredoverall = result
                .map((userObj) => {
                    const matchingHierarchycontrol = filteredOverallItem.find(
                        (hierarchyObj) =>
                            hierarchyObj.employeename[0] == userObj.companyname
                    );
                    return {
                        _id: userObj?._id,
                        project: userObj?.project,
                        category: userObj?.category,
                        subcategory: userObj?.subcategory,
                        loginid: userObj?.loginid,
                        vendor: userObj?.vendor,
                        company: userObj?.company,
                        branch: userObj?.branch,
                        unit: userObj?.unit,
                        team: userObj?.team,
                        department: userObj?.department,
                        employeename: userObj?.employeename,
                        employeeid: userObj?.employeeid,
                        date: userObj?.date,
                        documentnumber: userObj?.documentnumber,
                        documentlink: userObj?.documentlink,
                        fieldname: userObj?.fieldname,
                        line: userObj?.line,
                        errorvalue: userObj?.errorvalue,
                        correctvalue: userObj?.correctvalue,
                        clienterror: userObj?.clienterror,
                        errorstatus: userObj?.errorstatus,
                        clientamount: userObj.clientamount,
                        companyname: userObj?.companyname,
                        percentage: userObj?.percentage,
                        amount: userObj?.amount ? userObj?.amount : 0,
                        history: userObj?.history,
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
                    _id: userObj?._id,
                    project: userObj?.project,
                    category: userObj?.category,
                    subcategory: userObj?.subcategory,
                    loginid: userObj?.loginid,
                    vendor: userObj?.vendor,
                    company: userObj?.company,
                    branch: userObj?.branch,
                    unit: userObj?.unit,
                    team: userObj?.team,
                    department: userObj?.department,
                    employeename: userObj?.employeename,
                    employeeid: userObj?.employeeid,
                    date: userObj?.date,
                    documentnumber: userObj?.documentnumber,
                    documentlink: userObj?.documentlink,
                    fieldname: userObj?.fieldname,
                    line: userObj?.line,
                    errorvalue: userObj?.errorvalue,
                    correctvalue: userObj?.correctvalue,
                    clienterror: userObj?.clienterror,
                    errorstatus: userObj?.errorstatus,
                    clientamount: userObj.clientamount,
                    companyname: userObj?.companyname,
                    percentage: userObj?.percentage,
                    amount: userObj?.amount ? userObj?.amount : 0,
                    history: userObj?.history,
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
        resultAccessFilterHierarchy = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : filteredoverall;
        resultAccessFilter = restrictListTeam?.length > 0 ? resultAccessFilterHierarchy?.filter(data => restrictListTeam?.includes(data?.companyname)) : [];
        //console.log(resultAccessFilter.length)
    } catch (err) {
        console.log(err.message, "err");
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!resultAccessFilter) {
        return next(new ErrorHandler("No data found!", 404));
    }
    return res.status(200).json({
        hierarchyfirstlevel,
        filteredoverallsectorall,
        resultAccessFilterHierarchy: resultAccessFilterHierarchy.length,
        resultAccessFilter,
    });
}
);
// Client error waiver page filter
exports.getAllClientErrorOverallReport = catchAsyncErrors(async (req, res, next) => {
    const { project, vendor, loginid, fromdate, todate } = req.body;
    let finalData;

    try {
        finalData = await PenaltyClientError.find({ 
        date: { $gte: fromdate, $lte: todate }, 
       // errorstatus: { $eq: "Approved" }, 
        project: { $in: project }, vendor: { $in: vendor }, loginid: { $in: loginid }, 
       // history: { $exists: true, $ne: [] } 
       });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!finalData) {
        return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({ finalData });
});

