const ClientUserid = require("../../../model/modules/production/ClientUserIDModel")
const ProductionIndividual = require("../../../model/modules/production/productionindividual")
const Users = require("../../../model/login/auth")
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Hirerarchi = require("../../../model/modules/setup/hierarchy");


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


// get All ProductionIndividual => /api/ProductionIndividuals
exports.getAllProductionIndividual = catchAsyncErrors(async (req, res, next) => {
    let productionIndividual;
    try {
        productionIndividual = await ProductionIndividual.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionIndividual) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        productionIndividual,
    });
});

exports.getAllProductionIndividualLimited = catchAsyncErrors(async (req, res, next) => {
    let result, prodresult;
    try {

        prodresult = await ProductionIndividual.find({},
            {
                vendor: 1,
                datemode: 1,
                fromdate: 1,
                time: 1,
                filename: 1,
                category: 1,
                unitid: 1,
                user: 1,
                section: 1,
                flagcount: 1,
                alllogin: 1,
                docnumber: 1,
                doclink: 1,
                approvalstatus: 1,
                lateentrystatus: 1,
                startmode: 1,
                startdate: 1,
                starttime: 1,
                status: 1,
                totalpages: 1,
                flagcount: 1,
                pendingpages: 1,
                startpage: 1,
                reason: 1,
                statusmode: 1,
                enddate: 1,
                endtime: 1,
                notes: 1,
                addedby: 1,
                _id: 1
            }
        );


        let results = prodresult.filter((data, index) => {

            if (req?.body?.username === data?.addedby[0]?.name) {
                return data
            }
        })

        result = req?.body?.access.includes("Manager") ? prodresult : results;
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!result) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        result
    });
});

exports.getAllProductionIndividualDateFilter = catchAsyncErrors(async (req, res, next) => {
    let productionIndividualdate;
    try {
        productionIndividualdate = await ProductionIndividual.find({
            status: req.body.status,
            fromdate: { $gte: req.body.fromdate, $lte: req.body.todate }
        }, {});

        console.log(req.body.status, "status")
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionIndividualdate) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        productionIndividualdate,
    });
});







// Create new ProductionIndividual=> /api/ProductionIndividual/new
exports.addProductionIndividual = catchAsyncErrors(async (req, res, next) => {

    let aProductionIndividual = await ProductionIndividual.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle ProductionIndividual => /api/ProductionIndividual/:id
exports.getSingleProductionIndividual = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sProductionIndividual = await ProductionIndividual.findById(id);

    if (!sProductionIndividual) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        sProductionIndividual,
    });
});

// update ProductionIndividual by id => /api/ProductionIndividual/:id
exports.updateProductionIndividual = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uProductionIndividual = await ProductionIndividual.findByIdAndUpdate(id, req.body);
    if (!uProductionIndividual) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete ProductionIndividual by id => /api/ProductionIndividual/:id
exports.deleteProductionIndividual = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dProductionIndividual = await ProductionIndividual.findByIdAndRemove(id);

    if (!dProductionIndividual) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAllProductionHierarchyList = catchAsyncErrors(
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
            reportingusers;

        const vendorNames = req.body.vendor.map((vendor) => vendor.value);
        try {
            const { listpageaccessmode } = req.body;
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

            let prodresult = await ProductionIndividual.find(
                {
                    vendor: { $in: vendorNames },

                    status: {
                        $nin: ["Approved", "Rejected"],
                    },
                    ...(listpageaccessmode === "Reporting to Based"
                        ? { user: { $in: clientidsmap } }
                        : {}),
                },
                {
                    vendor: 1,
                    filename: 1,
                    category: 1,
                    unitid: 1,
                    user: 1,
                    fromdate: 1,
                    time: 1,
                    section: 1,
                    flagcount: 1,
                    alllogin: 1,
                    docnumber: 1,
                    status: 1,
                    approvalstatus: 1,
                    lateentrystatus: 1,
                    createdAt: 1,
                    _id: 1,
                }
            );

            clientuserid = await ClientUserid.find(
                { loginallotlog: { $exists: true, $ne: [] } },
                { empname: 1, userid: 1, loginallotlog: 1 }
            ).lean();

            result = prodresult.map((item) => {
                // const matchuser = clientuserid.find(d =>
                //     d.userid == item.user

                // )

                const loginInfo = clientuserid.find((d) => d.userid == item.user);
                let loginallot =
                    loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

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
                            lastItemsForEachDateTime[i].date +
                            " " +
                            lastItemsForEachDateTime[i].time;
                        // let datevalsplit = item.mode === "Manual" ? "" : upload.dateval.split(" IST");
                        let datevalsplitfinal = item.fromdate + " " + item.time;
                        if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                            filteredDataDateTime = lastItemsForEachDateTime[i];
                        } else {
                            break;
                        }
                    }
                }

                let logininfoname =
                    loginallot.length > 0 && filteredDataDateTime
                        ? filteredDataDateTime.empname
                        : loginInfo
                            ? loginInfo.empname
                            : "";

                return {
                    vendor: item.vendor,
                    filename: item.filename,
                    category: item.category,
                    unitid: item.unitid,
                    user: item.user,
                    fromdate: item.fromdate,
                    time: item.time,
                    section: item.section,
                    flagcount: item.flagcount,
                    alllogin: item.alllogin,
                    docnumber: item.docnumber,
                    approvalstatus: item.approvalstatus,
                    lateentrystatus: item.lateentrystatus,
                    status: item.status,
                    createdAt: item.createdAt,
                    _id: item._id,
                    companyname: logininfoname,
                };
            });

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
                            vendor: userObj.vendor,
                            filename: userObj.filename,
                            category: userObj.category,
                            unitid: userObj.unitid,
                            user: userObj.user,
                            fromdate: userObj.fromdate,
                            time: userObj.time,
                            section: userObj.section,
                            flagcount: userObj.flagcount,
                            alllogin: userObj.alllogin,
                            docnumber: userObj.docnumber,
                            status: userObj.status,
                            approvalstatus: userObj.approvalstatus,
                            lateentrystatus: userObj.lateentrystatus,
                            createdAt: userObj.createdAt,
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
                            vendor: userObj.vendor,
                            filename: userObj.filename,
                            category: userObj.category,
                            unitid: userObj.unitid,
                            user: userObj.user,
                            fromdate: userObj.fromdate,
                            time: userObj.time,
                            createdAt: userObj.createdAt,
                            section: userObj.section,
                            flagcount: userObj.flagcount,
                            approvalstatus: userObj.approvalstatus,
                            lateentrystatus: userObj.lateentrystatus,
                            alllogin: userObj.alllogin,
                            docnumber: userObj.docnumber,
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

                filteredoverall = result
                    .map((userObj) => {
                        const matchingHierarchycontrol = filteredOverallItem.find(
                            (hierarchyObj) =>
                                hierarchyObj.employeename[0] == userObj.companyname
                        );
                        return {
                            companyname: userObj.companyname,
                            vendor: userObj.vendor,
                            filename: userObj.filename,
                            category: userObj.category,
                            unitid: userObj.unitid,
                            approvalstatus: userObj.approvalstatus,
                            lateentrystatus: userObj.lateentrystatus,
                            user: userObj.user,
                            fromdate: userObj.fromdate,
                            time: userObj.time,
                            section: userObj.section,
                            flagcount: userObj.flagcount,
                            alllogin: userObj.alllogin,
                            docnumber: userObj.docnumber,
                            status: userObj.status,
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
                        vendor: userObj.vendor,
                        filename: userObj.filename,
                        category: userObj.category,
                        unitid: userObj.unitid,
                        user: userObj.user,
                        fromdate: userObj.fromdate,
                        time: userObj.time,
                        createdAt: userObj.createdAt,
                        section: userObj.section,
                        flagcount: userObj.flagcount,
                        approvalstatus: userObj.approvalstatus,
                        lateentrystatus: userObj.lateentrystatus,
                        alllogin: userObj.alllogin,
                        docnumber: userObj.docnumber,
                        status: userObj.status,
                        _id: userObj._id,
                        level: "",
                        control: "",
                    };
                });
            }

            // resultAccessFilter =
            //   req.body.hierachy === "myhierarchy" &&
            //     (listpageaccessmode === "Hierarchy Based" ||
            //       listpageaccessmode === "Overall")
            //     ? resulted
            //     : req.body.hierachy === "allhierarchy" &&
            //       (listpageaccessmode === "Hierarchy Based" ||
            //         listpageaccessmode === "Overall")
            //       ? resultedTeam
            //       : req.body.hierachy === "myallhierarchy" &&
            //         (listpageaccessmode === "Hierarchy Based" ||
            //           listpageaccessmode === "Overall")
            //         ? filteredoverall
            //         : reportingtobaseduser;


            let finalsupervisor = req.body.hierachy == "myhierarchy" ? resulted?.map(Data => Data?.companyname) : req.body.hierachy == "allhierarchy" ? resultedTeam?.map(Data => Data?.companyname) : filteredoverall?.map(Data => Data?.companyname)
            // console.log(finalsupervisor, "finalsupervisor")
            // console.log(req?.body, "page")
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
            const resultAccessFilterHierarchy = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : filteredoverall;
            resultAccessFilter = restrictListTeam?.length > 0 ? resultAccessFilterHierarchy?.filter(data => restrictListTeam?.includes(data?.companyname)) : [];


        } catch (err) {
            console.log(err, "error")
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





//Secondary Work Order - Hierarchy based Filter
exports.getAllProductionHierarchyListanother = catchAsyncErrors(async (req, res, next) => {
    let result, clientuserid, hierarchy, primaryhierarchy, secondaryhierarchy, hierarchyMap, resulted, tertiaryhierarchy;

    try {
        let prodresult = await ProductionIndividual.find(
            {

                // vendor: {
                //     $eq: req.body.vendor,
                // },
                vendor: { $in: req.body.vendor },
                status: {
                    $nin: ["Approved", "Rejected"]
                }
            },
            {

                vendor: 1,
                filename: 1,
                category: 1,
                unitid: 1,
                user: 1,
                fromdate: 1,
                time: 1,
                section: 1,
                flagcount: 1,
                alllogin: 1,
                docnumber: 1,
                _id: 1
            }
        );

        clientuserid = await ClientUserid.find({}, { userid: 1, empname: 1 })

        let result = prodresult.map(item => {

            const matchuser = clientuserid.find(d =>
                d.userid == item.user

            )
            return {
                vendor: item.vendor,
                filename: item.filename,
                category: item.category,
                unitid: item.unitid,
                user: item.user,
                fromdate: item.fromdate,
                time: item.time,
                section: item.section,
                flagcount: item.flagcount,
                alllogin: item.alllogin,
                docnumber: item.docnumber,
                _id: item._id,
                companyname: matchuser.empname
            }
        })
        hierarchy = await Hirerarchi.find({ supervisorchoose: req.body.username, level: "Primary" });
        hierarchyMap = hierarchy.length > 0 ? [].concat(...hierarchy.map((item) => item.employeename)) : [];

        let hierarchyfilternew = await Hirerarchi.find({ supervisorchoose: req.body.username, level: "Primary" });
        primaryhierarchy = hierarchyfilternew.map((item) => item.employeename[0]);

        let hierarchyfilternew1 = await Hirerarchi.find({ supervisorchoose: req.body.username, level: "Secondary" });
        secondaryhierarchy = hierarchyfilternew1.map((item) => item.employeename[0]);

        let hierarchyfilternew2 = await Hirerarchi.find({ supervisorchoose: req.body.username, level: "Tertiary" });
        tertiaryhierarchy = hierarchyfilternew2.map((item) => item.employeename[0]);

        //solo
        // resulted = result.filter((data) => hierarchyMap.includes(data.companyname));

        resulted = result
            .map((userObj) => {
                const matchingHierarchy = hierarchy.find((hierarchyObj) => hierarchyObj.employeename[0] == userObj.companyname);
                return {
                    companyname: userObj.companyname,
                    vendor: userObj.vendor,
                    filename: userObj.filename,
                    category: userObj.category,
                    unitid: userObj.unitid,
                    user: userObj.user,
                    fromdate: userObj.fromdate,
                    time: userObj.time,
                    section: userObj.section,
                    flagcount: userObj.flagcount,
                    alllogin: userObj.alllogin,
                    docnumber: userObj.docnumber,
                    status: userObj.status,
                    _id: userObj._id,
                    control: matchingHierarchy ? matchingHierarchy.control : "",
                };
            })
            .filter((data) => hierarchyMap.includes(data.companyname));
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!result) {
        return next(new ErrorHandler("No data found!", 404));
    }
    return res.status(200).json({
        result,
        resulted,
        primaryhierarchy,
        secondaryhierarchy,
        tertiaryhierarchy,
    });
});










// get All subcategoryprod => /api/subcategoryprod
// exports.ProductionIndividualSort = catchAsyncErrors(async (req, res, next) => {
//   let subcategoryprod;
//   try {
//     const page = req.body.page || 1; // Get this value from the client request
//     const limit = req.body.pageSize || 100; // Set a reasonable limit for the number of documents per page
//     const searchTerm = req.body.searchterm; // Get this value from the client request (e.g., from a query parameter)


//     let query = {};
//     if (!req.body.role.includes("Admin") &&
//       !req.body.role.includes("Manager")
//     ) {
//       query["addedby.name"] = { $eq: companyname };
//     }


//     // Build the search criteria conditionally
//     let searchCriteria = {};
//     if (searchTerm) {
//       const searchTermsArray = searchTerm.split(" ");
//       const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

//       // searchCriteria = {
//       //   $or: [
//       //     { project: { $in: regexTerms } },
//       //     { categoryname: { $in: regexTerms } }, // Match any word in categoryname
//       //     { name: { $in: regexTerms } }, // Match any word in name
//       //     { mismatchmode: { $in: regexTerms } }, // Match any word in name
//       //   ],
//       // };
//       searchCriteria = {
//         $and: regexTerms.map((regex) => ({
//           $or: [
//             { vendor: regex }, { datemode: regex }, { approvalstatus: regex }, { lateentrystatus: regex },
//             { fromdate: regex }, { time: regex }, { filename: regex }, { category: regex },
//             { unitid: regex }, { user: regex }, { section: regex }, { flagcount: regex },
//             { alllogin: regex }, { docnumber: regex }, { doclink: regex }, { startdate: regex },
//             { starttime: regex }, { status: regex }, { totalpages: regex }, { completedpages: regex },
//             { pendingpages: regex }, { startpage: regex }, { startmode: regex }, { statusmode: regex },
//             { notes: regex }, { category: regex }, { filename: regex }, { mode: regex },
//             { subcategory: regex }, { unitrate: regex }, { originalunitrate: regex },
//             { section: regex },

//           ],
//         })),
//       };
//     }
//     // Fetch all matching documents to get total count
//     totalCount = await ProductionIndividual.countDocuments(searchCriteria);

//     // Fetch all matching documents for the search criteria if searchTerm is provided, otherwise fetch all documents
//     const allMatchingDocs = searchTerm
//       ? await ProductionIndividual.find(searchCriteria).lean().exec()
//       : await ProductionIndividual.find().lean().exec();

//     // Perform pagination on all matching documents
//     subcategoryprod = allMatchingDocs.slice((page - 1) * limit, page * limit);
//   } catch (err) {
//     console.log(err.message);
//   }
//   if (!subcategoryprod) {
//     return next(new ErrorHandler("SubCategoryprod not found!", 404));
//   }
//   return res.status(200).json({
//     // count: products.length,
//     subcategoryprod,
//     totalCount,
//   });
// });


exports.ProductionIndividualExcelOverall = catchAsyncErrors(async (req, res, next) => {
    let result;
    try {
        // Get this value from the client request (e.g., from a query parameter)

        let query = {};
        if (!req.body.role.includes("Admin") &&
            !req.body.role.includes("Manager")
        ) {
            query["addedby.name"] = { $eq: req.body.companyname };
        }


        result = await ProductionIndividual.find(query).lean().exec()


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({

        result,
    });

});






exports.getAllProductionLoginAllotHierarchyList = catchAsyncErrors(
    async (req, res, next) => {
        let result,
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
            reportingtobaseduser,
            hierarchyFinal,
            hierarchyDefault,
            reportingusers;

        try {
            const { listpageaccessmode } = req.body;

            clientuserid = await ClientUserid.find(
                { loginallotlog: { $exists: true, $ne: [] }, allotted: "allotted" },
                { projectvendor: 1, loginallotlog: 1 }
            ).lean();
            if (listpageaccessmode === "Reporting to Based") {
                reportingusers = await User.find(
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
                        ...(listpageaccessmode === "Reporting to Based"
                            ? { reportingto: req.body.username }
                            : {}),
                    },
                    {
                        empcode: 1,
                        companyname: 1,
                    }
                );
            }

            //  prodresult = clientuserid.map(item => item.loginallotlog[item.loginallotlog.length - 1]).flat();

            let prodresult = clientuserid.map((item) => {
                const lastLog = item.loginallotlog[item.loginallotlog.length - 1];
                return {
                    ...lastLog,
                    projectvendor: item.projectvendor,
                };
            });

            result = prodresult
                .filter((item) => {
                    if (listpageaccessmode === "Reporting to Based") {
                        return reportingusers.some(
                            (user) => user.companyname === item.empname
                        );
                    }
                    return true;
                })
                .map((item) => {
                    return {
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        empname: item.empname,
                        team: item.team,
                        empcode: item.empcode,
                        userid: item.userid,
                        date: item.date,
                        time: item.time,
                        projectvendor: item.projectvendor,
                        _id: item._id,
                    };
                });
            //myhierarchy dropdown
            if (
                (req.body.hierachy === "myhierarchy" &&
                    listpageaccessmode === "Hierarchy Based") ||
                listpageaccessmode === "Overall"
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
                            (hierarchyObj) => hierarchyObj.employeename[0] == userObj.empname
                        );
                        return {
                            company: userObj.company,
                            branch: userObj.branch,
                            unit: userObj.unit,
                            empname: userObj.empname,
                            team: userObj.team,
                            empcode: userObj.empcode,
                            userid: userObj.userid,
                            date: userObj.date,
                            time: userObj.time,
                            projectvendor: userObj.projectvendor,
                            _id: userObj._id,
                            level: matchingHierarchy ? matchingHierarchy.level : "",
                            control: matchingHierarchy ? matchingHierarchy.control : "",
                        };
                    })
                    .filter((data) => hierarchyMap.includes(data.empname));
            }

            if (
                (req.body.hierachy === "allhierarchy" &&
                    listpageaccessmode === "Hierarchy Based") ||
                listpageaccessmode === "Overall"
            ) {
                hierarchySecond = await Hirerarchi.find(
                    {},
                    { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
                );
                hierarchyDefault = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
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
                        req.body.sector == "all"
                            ? ["Primary", "Secondary", "Tertiary"].includes(data.level)
                            : data.level == req.body.sector
                    )
                    .map((item) => item.employeename[0]);

                resultedTeam = result
                    .map((userObj) => {
                        const matchingHierarchycontrol = filteredOverallItem.find(
                            (hierarchyObj) => hierarchyObj.employeename[0] == userObj.empname
                        );
                        return {
                            company: userObj.company,
                            branch: userObj.branch,
                            unit: userObj.unit,
                            empname: userObj.empname,
                            team: userObj.team,
                            empcode: userObj.empcode,
                            userid: userObj.userid,
                            date: userObj.date,
                            time: userObj.time,
                            projectvendor: userObj.projectvendor,
                            _id: userObj._id,
                            level: matchingHierarchycontrol
                                ? matchingHierarchycontrol.level
                                : "",
                            control: matchingHierarchycontrol
                                ? matchingHierarchycontrol.control
                                : "",
                        };
                    })
                    .filter((data) => answerDeoverall.includes(data.empname));

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

            //my + all hierarchy list dropdown

            if (
                (req.body.hierachy === "myallhierarchy" &&
                    listpageaccessmode === "Hierarchy Based") ||
                listpageaccessmode === "Overall"
            ) {
                hierarchySecond = await Hirerarchi.find(
                    {},
                    { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
                );
                hierarchyDefault = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
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

                filteredoverall = result
                    .map((userObj) => {
                        const matchingHierarchycontrol = filteredOverallItem.find(
                            (hierarchyObj) => hierarchyObj.employeename[0] == userObj.empname
                        );
                        return {
                            company: userObj.company,
                            branch: userObj.branch,
                            unit: userObj.unit,
                            empname: userObj.empname,
                            team: userObj.team,
                            projectvendor: userObj.projectvendor,
                            empcode: userObj.empcode,
                            userid: userObj.userid,
                            date: userObj.date,
                            time: userObj.time,
                            _id: userObj._id,
                            level: matchingHierarchycontrol
                                ? matchingHierarchycontrol.level
                                : "",
                            control: matchingHierarchycontrol
                                ? matchingHierarchycontrol.control
                                : "",
                        };
                    })
                    .filter((data) => answerDeoverall.includes(data.empname));

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
                reportingtobaseduser = result.map((item) => {
                    return {
                        company: item.company,
                        branch: item.branch,
                        unit: item.unit,
                        empname: item.empname,
                        team: item.team,
                        empcode: item.empcode,
                        userid: item.userid,
                        date: item.date,
                        time: item.time,
                        projectvendor: item.projectvendor,
                        _id: item._id,
                        level: "",
                        control: "",
                    };
                });
            }

            resultAccessFilter =
                req.body.hierachy === "myhierarchy" &&
                    (listpageaccessmode === "Hierarchy Based" ||
                        listpageaccessmode === "Overall")
                    ? resulted
                    : req.body.hierachy === "allhierarchy" &&
                        (listpageaccessmode === "Hierarchy Based" ||
                            listpageaccessmode === "Overall")
                        ? resultedTeam
                        : req.body.hierachy === "myallhierarchy" &&
                            (listpageaccessmode === "Hierarchy Based" ||
                                listpageaccessmode === "Overall")
                            ? filteredoverall
                            : reportingtobaseduser;
        } catch (err) {
            return next(new ErrorHandler("Records not found!", 404));
        }
        if (!resultAccessFilter) {
            return next(new ErrorHandler("No data found!", 404));
        }
        return res.status(200).json({
            resultAccessFilter,
            resultedTeam
        });
    }
);


//Manual overall report
//Manual overall report
exports.getAllManualUploadFilter = catchAsyncErrors(async (req, res, next) => {
    let productionupload = [];
    let producionIndividual = [];
    let attendances, users, loginids, mergedData, mergedDataall, depMonthSet,
        finaluser = [];
    let allData = [];
    let datesArray = [];
    let userDates = req.body.userDates;
    const { batchNumber, batchSize } = req.body;

    try {


        const getDatesBetween = (startDate, endDate) => {
            const dates = [];
            let currentDate = new Date(startDate);
            let currentEndDate = new Date(endDate);

            // Add one day before the start date
            currentDate.setDate(currentDate.getDate() - 1);
            dates.push(currentDate.toISOString().split('T')[0]); // Format: YYYY-MM-DD

            // Loop through the dates between start and end date
            while (currentDate <= new Date(endDate)) {
                dates.push(currentDate.toISOString().split('T')[0]); // Format: YYYY-MM-DD
                currentDate.setDate(currentDate.getDate() + 1);
            }


            return dates;
        };


        let dates = getDatesBetween(req.body.fromdate, req.body.todate);

        let finalDates = [...new Set(dates)]

        const dateObj = new Date(req.body.fromdate);
        // Extract day, month, and year components
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();

        // Format the date components into the desired format
        const formattedDate = `${day}-${month}-${year}`;

        const dateObjto = new Date(req.body.todate);

        // Extract day, month, and year components
        const dayto = String(dateObjto.getDate()).padStart(2, "0");
        const monthto = String(dateObjto.getMonth() + 1).padStart(2, "0");
        const yearto = dateObjto.getFullYear();

        // Format the date components into the desired format
        const formattedDateTo = `${dayto}-${monthto}-${yearto}`;

        const skip = (batchNumber - 1) * 50000;
        const limit = 50000;

        let fromYear = req.body.fromYear;  // Assuming you're sending these values from the frontend
        let fromMonth = req.body.fromMonth;


        if (req.body.shift === "Month Based") {
            const fromYear = parseInt(req.body.fromYear, 10);
            const fromMonth = parseInt(req.body.fromMonth, 10) - 1; // Subtract 1 to get the correct month index

            let startDate = new Date(fromYear, fromMonth, 1);
            let endDate = new Date(fromYear, fromMonth + 1, 0);

            let datesm = [];

            // Loop through each day of the month
            for (let day = startDate.getDate() + 1; day <= endDate.getDate(); day++) {
                datesm.push(new Date(fromYear, fromMonth, day));
            }

            datesArray = datesm.map(d => d.toISOString().split("T")[0]);
        }

        let queryManual = {}

        if (req.body.user.length > 0) {
            queryManual.user = { $in: req.body.user }
        }
        if (req.body.projectvendor.length > 0) {
            queryManual.vendor = { $in: req.body.projectvendor }
        }
        // queryManual.status = "Approved"
        if (finalDates.length > 0 && req.body.shift === "Date Based") {
            queryManual.fromdate = { $gte: req.body.fromdate, $lte: req.body.todate }

        }
        if (datesArray.length > 0 && req.body.shift === "Month Based") {
            queryManual.fromdate = { $in: datesArray }

        }
        producionIndividual = await ProductionIndividual.find(queryManual, { approvalstatus: 1, approvaldate: 1, createdAt: 1, fromdate: 1, time: 1, vendor: 1, lateentrystatus: 1, status: 1, unitid: 1, time: 1, filename: 1, user: 1, alllogin: 1, category: 1 }).skip(skip).limit(limit).lean();

        users = await Users.find({}, { company: 1, branch: 1, unit: 1, team: 1, empname: 1, companyname: 1, username: 1, empcode: 1 });

        let loginids = await ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] } }, { empname: 1, userid: 1, loginallotlog: 1 }).lean();



        allData = producionIndividual


        if (req.body.shift == "Date Based") {
            let mergedDataallfirst = allData.map((upload) => {
                const loginInfo = loginids.find((login) => login.userid === upload.user);

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
                        let datevalsplitfinal = upload.fromdate + " " + upload.time;
                        if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                            filteredDataDateTime = lastItemsForEachDateTime[i];
                        } else {
                            break;
                        }

                    }
                }
                // const userInfo = loginInfo ? users.find(user => user.companyname === loginInfo.empname) : "";
                let logininfoname = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
                const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : "";
                const userArray = loginInfo ? users.filter((user) => user.companyname === logininfoname) : "";

                // const filenamelistviewAll = upload.filename && upload.filename?.split(".x");
                // const filenamelist = filenamelistviewAll && filenamelistviewAll[0];

                const filenamelist = upload.filename;



                const FindProjectvendor = upload.vendor && upload.vendor?.split("-");
                const getproject = FindProjectvendor && FindProjectvendor[0];
                const getvendor = FindProjectvendor && FindProjectvendor[1];

                const findshifttime = userInfo && userInfo.shifttiming && userInfo.shifttiming.split("to");

                const getshift = findshifttime && findshifttime[0];



                const comparedate = upload.fromdate;
                const comparetime = upload.time;
                const dateTime = new Date(`${comparedate}T${comparetime}Z`);

                const includesValue = (array, value) => {
                    return array && array.length > 0 ? array.includes(value) : true;
                };

                const isConditionsMet =
                    includesValue(req.body.company, userInfo?.company) &&
                    includesValue(req.body.branch, userInfo?.branch) &&
                    includesValue(req.body.unit, userInfo?.unit) &&
                    includesValue(req.body.team, userInfo?.team) &&
                    includesValue(req.body.empname, userInfo?.companyname)

                if (isConditionsMet &&

                    (req.body.subsmanual && req.body.subsmanual.length > 0
                        ? req.body.subsmanual.some(sub => sub.category === filenamelist && sub.subcategory === upload.category)
                        : true)

                ) {
                    return {
                        user: upload.user,
                        fromdate: upload.fromdate,
                        todate: upload.todate,
                        vendor: upload.vendor,
                        category: upload.category,
                        dateval: `${upload.fromdate} ${upload.time}:00`,
                        olddateval: `${upload.fromdate}T${upload.time}:00`,
                        approvalstatus: upload.approvalstatus,
                        lateentrystatus: upload.lateentrystatus,
                        approvaldate: upload.approvaldate,
                        createdAt: upload.createdAt,
                        status: upload.status,
                        time: upload.time,

                        filename: upload.filename,
                        mode: upload.mode == "Manual" ? "Manual" : "Production",
                        empname: logininfoname,
                        empcode: userInfo && userInfo.empcode,
                        company: userInfo && userInfo.company,
                        unit: userInfo && userInfo.unit,
                        branch: userInfo && userInfo.branch,
                        team: userInfo && userInfo.team,
                        username: userInfo && userInfo.username,
                        empcode: userInfo && userInfo.empcode,
                        _id: upload._id,
                        unitid: upload.unitid,
                        filename: upload.filename,
                        section: upload.section,
                        csection: upload.updatedsection ? upload.updatedsection : "",
                        flagcount: upload.flagcount,
                        cflagcount: upload.updatedflag ? upload.updatedflag : "",
                        unitid: upload.unitid,
                        filename: upload.filename,
                        points: Number(upload.unitrate) * 8.333333333333333,
                        cpoints: upload.updatedunitrate ? Number(upload.updatedunitrate) * 8.333333333333333 : "",
                        unitrate: Number(upload.unitrate),
                        cunitrate: upload.updatedunitrate ? Number(upload.updatedunitrate) : "",
                    };
                }
            });

            mergedDataall = mergedDataallfirst.filter((item) => item !== undefined)
        }


        else if (req.body.shift == "Month Based") {
            let mergedDataallfirst = allData.map((upload) => {
                const loginInfo = loginids.find((login) => login.userid === upload.user);

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
                        let datevalsplitfinal = upload.fromdate + " " + upload.time;
                        if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                            filteredDataDateTime = lastItemsForEachDateTime[i];
                        } else {
                            break;
                        }

                    }
                }
                // const userInfo = loginInfo ? users.find(user => user.companyname === loginInfo.empname) : "";
                let logininfoname = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
                const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : "";
                const userArray = loginInfo ? users.filter((user) => user.companyname === logininfoname) : "";

                // const filenamelistviewAll = upload.filename && upload.filename?.split(".x");
                // const filenamelist = filenamelistviewAll && filenamelistviewAll[0];

                const filenamelist = upload.filename;



                const FindProjectvendor = upload.vendor && upload.vendor?.split("-");
                const getproject = FindProjectvendor && FindProjectvendor[0];
                const getvendor = FindProjectvendor && FindProjectvendor[1];

                const findshifttime = userInfo && userInfo.shifttiming && userInfo.shifttiming.split("to");

                const getshift = findshifttime && findshifttime[0];



                const comparedate = upload.fromdate;
                const comparetime = upload.time;
                const dateTime = new Date(`${comparedate}T${comparetime}Z`);

                const includesValue = (array, value) => {
                    return array && array.length > 0 ? array.includes(value) : true;
                };

                const isConditionsMet =
                    includesValue(req.body.company, userInfo?.company) &&
                    includesValue(req.body.branch, userInfo?.branch) &&
                    includesValue(req.body.unit, userInfo?.unit) &&
                    includesValue(req.body.team, userInfo?.team) &&
                    includesValue(req.body.empname, userInfo?.companyname)

                if (isConditionsMet &&

                    (req.body.subsmanual && req.body.subsmanual.length > 0
                        ? req.body.subsmanual.some(sub => sub.category === filenamelist && sub.subcategory === upload.category)
                        : true)

                ) {
                    return {
                        user: upload.user,
                        fromdate: upload.fromdate,
                        todate: upload.todate,
                        vendor: upload.vendor,
                        category: upload.category,
                        dateval: `${upload.fromdate} ${upload.time}:00`,
                        olddateval: `${upload.fromdate}T${upload.time}:00`,
                        approvalstatus: upload.approvalstatus,
                        lateentrystatus: upload.lateentrystatus,
                        approvaldate: upload.approvaldate,
                        createdAt: upload.createdAt,
                        status: upload.status,
                        time: upload.time,
                        filename: upload.filename,
                        mode: upload.mode == "Manual" ? "Manual" : "Production",
                        empname: logininfoname,
                        empcode: userInfo && userInfo.empcode,
                        company: userInfo && userInfo.company,
                        unit: userInfo && userInfo.unit,
                        branch: userInfo && userInfo.branch,
                        team: userInfo && userInfo.team,
                        username: userInfo && userInfo.username,
                        empcode: userInfo && userInfo.empcode,
                        _id: upload._id,
                        unitid: upload.unitid,
                        filename: upload.filename,
                        section: upload.section,
                        csection: upload.updatedsection ? upload.updatedsection : "",
                        flagcount: upload.flagcount,
                        cflagcount: upload.updatedflag ? upload.updatedflag : "",
                        unitid: upload.unitid,
                        filename: upload.filename,
                        points: Number(upload.unitrate) * 8.333333333333333,
                        cpoints: upload.updatedunitrate ? Number(upload.updatedunitrate) * 8.333333333333333 : "",
                        unitrate: Number(upload.unitrate),
                        cunitrate: upload.updatedunitrate ? Number(upload.updatedunitrate) : "",
                    };
                }
            });

            mergedDataall = mergedDataallfirst.filter((item) => item !== undefined)
        }


        mergedData = mergedDataall && mergedDataall.length > 0 ? mergedDataall.filter((item) => item != null) : [];


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!productionupload) {
    //   return next(new ErrorHandler("Data not found!", 404));
    // }
    return res.status(200).json({
        // count: products.length,
        mergedData,
        count: allData.length
    });
});


exports.getUserIdManual = catchAsyncErrors(async (req, res, next) => {
    let manual, productionupload, producionIndividual;
    let finaluser = []

    const { name } = req.body;
    // console.log(name, "name")
    try {

        const loginids = await ClientUserid.find({ "loginallotlog.empname": name, allotted: "allotted" }, { projectvendor: 1, empname: 1, userid: 1, loginallotlog: 1 }).lean();

        let userids = loginids.map(d => d.userid)
        // console.log(userids)
        producionIndividual = await ProductionIndividual.find({
            user: { $in: userids }
        },
            {
            }
        )

        // console.log(producionIndividual.length, loginids.length, "producionIndividual")
        manual = producionIndividual.map((upload) => {

            const loginInfo = loginids.find((login) => login.userid === upload.user && login.projectvendor === upload.vendor);
            // console.log(loginInfo, "loginInfo")

            let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

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
                const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);

                // Sort the last items by date and time
                lastItemsForEachDateTime.sort((a, b) => {
                    return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
                });

                // Find the first item in the sorted array that meets the criteria
                for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                    const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;
                    // let datevalsplit = upload.mode == "Manual" ? "" : upload.formatteddatetime.split(" ");
                    let datevalsplitfinal = upload.mode == "Manual" ? `${upload.fromdate}T${upload.time}Z` : `${upload.formatteddate}T${upload.formattedtime}Z`;
                    if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                        filteredDataDateTime = lastItemsForEachDateTime[i];
                    } else {
                        break;
                    }
                }
            }

            let logininfoname = (loginallot.length > 0 && filteredDataDateTime) ? filteredDataDateTime.empname : (loginInfo ? loginInfo.empname : "");


            if (name === logininfoname) {
                return {
                    ...upload._doc
                };
            }
        });
        productionupload = manual.filter(d => d != undefined)
        // console.log(productionupload, "productionupload")
    } catch (err) {
        return next(new ErrorHandler("Records Not Found", 500));
    }

    return res.status(200).json({
        productionupload,
    });
});




exports.getAllOnprogressIndividualLimited = catchAsyncErrors(async (req, res, next) => {
    let result, prodresult;
    try {

        prodresult = await ProductionIndividual.find({ statusmode: "Started" },
            {
                // vendor: 1,
                // datemode: 1,
                // filename: 1,
                // category: 1,
                // unitid: 1,
                // unitrate: 1,
                // user: 1,
                // mode: 1,
                // fromdate: 1,
                // time: 1,
                // section: 1,
                // flagcount: 1,
                // alllogin: 1,
                // statusmode: 1,
                // status: 1,
                // approvalstatus: 1,
                // lateentrystatus: 1,
                // docnumber: 1,
                // doclink: 1,
                // status: 1,
                // addedby: 1,
                // _id: 1
            }
        );


        let results = prodresult.filter((data, index) => {

            if (req?.body?.username === data?.addedby[0]?.name) {
                return data
            }
        })

        result = req?.body?.access.includes("Manager") ? prodresult : results;
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!result) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        result
    });
});

exports.getAllPendingIndividualLimited = catchAsyncErrors(async (req, res, next) => {
    let result, prodresult;
    try {

        prodresult = await ProductionIndividual.find({ statusmode: { $in: ["Pause", "Stop", "In Complete", "Partial Complete"] } },
            {
                vendor: 1,
                datemode: 1,
                filename: 1,
                category: 1,
                unitid: 1,
                unitrate: 1,
                user: 1,
                mode: 1,
                fromdate: 1,
                time: 1,
                section: 1,
                flagcount: 1,
                alllogin: 1,
                docnumber: 1,
                doclink: 1,
                status: 1,
                addedby: 1,
                _id: 1
            }
        );


        let results = prodresult.filter((data, index) => {

            if (req?.body?.username === data?.addedby[0]?.name) {
                return data
            }
        })

        result = req?.body?.access.includes("Manager") ? prodresult : results;
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!result) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        result
    });
});

exports.getAllCompleteIndividualLimited = catchAsyncErrors(async (req, res, next) => {
    let result, prodresult;
    try {

        prodresult = await ProductionIndividual.find({ statusmode: { $in: ["", "Completed"] } },
            {
                vendor: 1,
                datemode: 1,
                fromdate: 1,
                time: 1,
                filename: 1,
                category: 1,
                unitid: 1,
                user: 1,
                section: 1,
                flagcount: 1,
                alllogin: 1,
                docnumber: 1,
                doclink: 1,
                approvalstatus: 1,
                lateentrystatus: 1,
                startmode: 1,
                startdate: 1,
                starttime: 1,
                status: 1,
                totalpages: 1,
                flagcount: 1,
                pendingpages: 1,
                startpage: 1,
                reason: 1,
                statusmode: 1,
                enddate: 1,
                endtime: 1,
                notes: 1,
                addedby: 1,
                _id: 1
            }
        );


        let results = prodresult.filter((data, index) => {

            if (req?.body?.username === data?.addedby[0]?.name) {
                return data
            }
        })

        result = req?.body?.access.includes("Manager") ? prodresult : results;
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!result) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        result
    });
});










exports.ManualstatusviceIndividualExcelOverall = catchAsyncErrors(async (req, res, next) => {
    let result;
    try {
        // Get this value from the client request (e.g., from a query parameter)

        let query = { statusmode: { $in: req.body.statusmode } }
        if (!req.body.role.includes("Admin") &&
            !req.body.role.includes("Manager")
        ) {
            query["addedby.name"] = { $eq: req.body.companyname };
        }


        result = await ProductionIndividual.find(query).lean().exec()


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({

        result,
    });

});



exports.getAllProductionHierarchyListHome = catchAsyncErrors(
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
            reportingusers;

        try {
            const { listpageaccessmode } = req.body;
            let clientidsmap;
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

            let prodresult = await ProductionIndividual.find(
                {
                    vendor: { $nin: [undefined, "undefined"] },

                    status: {
                        $nin: ["Approved", "Rejected"],
                    },
                    ...(listpageaccessmode === "Reporting to Based"
                        ? { user: { $in: clientidsmap } }
                        : {}),
                },
                {
                    // vendor: 1,
                    // filename: 1,
                    // category: 1,
                    // unitid: 1,
                    // user: 1,
                    // fromdate: 1,
                    // time: 1,
                    // section: 1,
                    // flagcount: 1,
                    // alllogin: 1,
                    // docnumber: 1,
                    // status: 1,
                    // approvalstatus: 1,
                    // lateentrystatus: 1,
                    // createdAt: 1,
                    // _id: 1,
                }
            );


            clientuserid = await ClientUserid.find(
                { loginallotlog: { $exists: true, $ne: [] } },
                { empname: 1, userid: 1, loginallotlog: 1 }
            ).lean();

            result = prodresult.map((item) => {
                // const matchuser = clientuserid.find(d =>
                //     d.userid == item.user

                // )

                const loginInfo = clientuserid.find((d) => d.userid == item.user);
                let loginallot =
                    loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

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
                            lastItemsForEachDateTime[i].date +
                            " " +
                            lastItemsForEachDateTime[i].time;
                        // let datevalsplit = item.mode === "Manual" ? "" : upload.dateval.split(" IST");
                        let datevalsplitfinal = item.fromdate + " " + item.time;
                        if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                            filteredDataDateTime = lastItemsForEachDateTime[i];
                        } else {
                            break;
                        }
                    }
                }

                let logininfoname =
                    loginallot.length > 0 && filteredDataDateTime
                        ? filteredDataDateTime.empname
                        : loginInfo
                            ? loginInfo.empname
                            : "";

                return {
                    vendor: item.vendor,
                    filename: item.filename,
                    category: item.category,
                    unitid: item.unitid,
                    user: item.user,
                    fromdate: item.fromdate,
                    time: item.time,
                    section: item.section,
                    flagcount: item.flagcount,
                    alllogin: item.alllogin,
                    docnumber: item.docnumber,
                    approvalstatus: item.approvalstatus,
                    lateentrystatus: item.lateentrystatus,
                    status: item.status,
                    createdAt: item.createdAt,
                    _id: item._id,
                    companyname: logininfoname,
                };
            });


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
                hierarchyDefault = await Hirerarchi.find({
                    supervisorchoose: req.body.username,
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

                filteredoverall = result
                    .map((userObj) => {
                        const matchingHierarchycontrol = filteredOverallItem.find(
                            (hierarchyObj) =>
                                hierarchyObj.employeename[0] == userObj.companyname
                        );
                        return {
                            companyname: userObj.companyname,
                            vendor: userObj.vendor,
                            filename: userObj.filename,
                            category: userObj.category,
                            unitid: userObj.unitid,
                            approvalstatus: userObj.approvalstatus,
                            lateentrystatus: userObj.lateentrystatus,
                            user: userObj.user,
                            fromdate: userObj.fromdate,
                            time: userObj.time,
                            section: userObj.section,
                            flagcount: userObj.flagcount,
                            alllogin: userObj.alllogin,
                            docnumber: userObj.docnumber,
                            status: userObj.status,
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

                // primaryhierarchyfinal = filteredoverall
                //   .filter((item) => item.level == "Primary")
                //   .map((item) => item.companyname);

                // secondaryhierarchyfinal = filteredoverall
                //   .filter((item) => item.level == "Secondary")
                //   .map((item) => item.companyname);

                // tertiaryhierarchyfinal = filteredoverall
                //   .filter((item) => item.level == "Tertiary")
                //   .map((item) => item.companyname);
            }

            if (listpageaccessmode === "Reporting to Based") {
                reportingtobaseduser = result.map((userObj) => {
                    return {
                        companyname: userObj.companyname,
                        vendor: userObj.vendor,
                        filename: userObj.filename,
                        category: userObj.category,
                        unitid: userObj.unitid,
                        user: userObj.user,
                        fromdate: userObj.fromdate,
                        time: userObj.time,
                        createdAt: userObj.createdAt,
                        section: userObj.section,
                        flagcount: userObj.flagcount,
                        approvalstatus: userObj.approvalstatus,
                        lateentrystatus: userObj.lateentrystatus,
                        alllogin: userObj.alllogin,
                        docnumber: userObj.docnumber,
                        status: userObj.status,
                        _id: userObj._id,
                        level: "",
                        control: "",
                    };
                });
            }

            resultAccessFilter =

                req.body.hierachy === "myallhierarchy" &&
                    (listpageaccessmode === "Hierarchy Based" ||
                        listpageaccessmode === "Overall")
                    ? filteredoverall.filter(d => d != undefined && d != null)
                    : reportingtobaseduser.filter(d => d != undefined && d != null);


        } catch (err) {
            return next(new ErrorHandler("Records not found!", 404));
        }
        // if (!resultAccessFilter) {
        //   return next(new ErrorHandler("No data found!", 404));
        // }
        return res.status(200).json({
            // result
            // resulted,
            // resultedTeam,
            // branch,
            // hierarchy,
            // overallMyallList,
            resultAccessFilter: resultAccessFilter,
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


// get All ProductionIndividual => /api/ProductionIndividuals
exports.productionIndividualDupeCheck = catchAsyncErrors(async (req, res, next) => {
    let productionIndividual;
    try {
        const { vendor, filename, unitid, user, category, fromdate, time } = req.body;

        let query = {
            vendor,
            filename,
            unitid: {
                $in: unitid, // Correcting the syntax for regex
            },
            user,
            category,
            fromdate,
            // time,
        };

        // console.log(
        //   query
        //   // {
        //   //   vendor: { $regex: new RegExp(`^${vendor}$`, "i") },
        //   //   filename: { $regex: new RegExp(`^${filename}$`, "i") },
        //   //   unitid: {
        //   //     $in: unitid.map((d) => new RegExp(`^${d}$`, "i")), // Correcting the syntax for regex
        //   //   },
        //   //   user: { $regex: new RegExp(`^${user}$`, "i") },
        //   //   category: { $regex: new RegExp(`^${category}$`, "i") },
        //   //   fromdate,
        //   //   time,
        //   // },

        //   // "time24"
        // );
        productionIndividual = await ProductionIndividual.countDocuments(query);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!productionIndividual) {
    //   return next(new ErrorHandler("Data not found!", 404));
    // }
    return res.status(200).json({
        productionIndividual,
    });
});

// Create new ProductionIndividual=> /api/ProductionIndividual/new
exports.productionIndividualCreateBulk = catchAsyncErrors(async (req, res, next) => {
    let productionIndividual;
    try {
        const {
            vendor,
            datemode,
            fromdate,
            time,
            todate,
            totime,
            filename,
            category,
            unitid,
            user,
            creationstatus,
            remarks,
            startbuttonstatus,
            enddatemode,
            mode,
            section,
            flagcount,
            alllogin,
            docnumber,
            doclink,
            startmode,
            startdate,
            starttime,
            statusmode,
            totalpages,
            pendingpages,
            startpage,
            reason,
            notes,
            approvalstatus,
            approvaldate,
            lateentrystatus,
            files,
            addedby,
        } = req.body;

        // Helper function to convert time (HH:mm:ss) to seconds
        function timeToSeconds(time) {
            const [hours, minutes, seconds] = time.split(":").map(Number);
            return hours * 3600 + minutes * 60 + (seconds || 0);
        }

        // Helper function to convert seconds back to time (HH:mm:ss)
        function secondsToTime(seconds) {
            const hours = Math.floor(seconds / 3600)
                .toString()
                .padStart(2, "0");
            seconds %= 3600;
            const minutes = Math.floor(seconds / 60)
                .toString()
                .padStart(2, "0");
            const secs = (seconds % 60).toString().padStart(2, "0");
            return `${hours}:${minutes}:${secs}`;
        }

        // Calculate the time intervals
        function getTimeIntervals(startTime, endTime, length) {
            const startInSeconds = timeToSeconds(startTime);
            const endInSeconds = timeToSeconds(endTime);
            const totalSeconds = endInSeconds - startInSeconds;

            const interval = Math.floor(totalSeconds / (length - 1));

            const intervals = [];
            for (let i = 0; i < length; i++) {
                intervals.push(secondsToTime(startInSeconds + interval * i));
            }

            return intervals;
        }

        // Get time intervals based on unitIds length
        const timeIntervals = getTimeIntervals(time, totime, unitid.length);
        console.log(`${fromdate}${time}` == `${todate}${totime}`);
        // Create the final result array
        const result = unitid.map((id, index) => ({
            id,
            fromdate: fromdate,
            time: `${fromdate}${time}` == `${todate}${totime}` ? `${time}:00` : timeIntervals[index],
        }));
        console.log(result[0]);
        // Map over the unitid array to create an array of documents
        const documentsToInsert = result.map((d) => ({
            vendor,
            datemode,
            fromdate: d.fromdate,
            time: d.time.slice(0, -3),
            filename,
            category,
            fromtotime: `${fromdate}$${time}$${todate}$${totime}`,
            unitid: d.id, // Use the current id from the unitid array
            user,
            creationstatus,
            remarks,
            startbuttonstatus,
            enddatemode,
            mode,
            section,
            flagcount,
            alllogin,
            docnumber,
            doclink,
            startmode,
            startdate,
            starttime,
            statusmode,
            totalpages,
            pendingpages,
            startpage,
            reason,
            notes,
            approvalstatus,
            approvaldate,
            lateentrystatus,
            files,
            addedby,
        }));
        console.log(documentsToInsert[0], "sdf");
        let aProductionIndividual = await ProductionIndividual.insertMany(documentsToInsert);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        message: "Successfully added!",
    });
});




exports.getAllProductionIndividualLimitedExcel = catchAsyncErrors(async (req, res, next) => {
    let result;
    try {

        result = await ProductionIndividual.find({ statusmode: { $in: ["", "Completed"] } },
            {
                vendor: 1,
                datemode: 1,
                fromdate: 1,
                time: 1,
                filename: 1,
                category: 1,
                unitid: 1,
                user: 1,
                section: 1,
                flagcount: 1,
                alllogin: 1,
                docnumber: 1,
                doclink: 1,
                approvalstatus: 1,
                lateentrystatus: 1,
                startmode: 1,
                startdate: 1,
                starttime: 1,
                status: 1,
                totalpages: 1,
                flagcount: 1,
                pendingpages: 1,
                startpage: 1,
                reason: 1,
                statusmode: 1,
                enddate: 1,
                endtime: 1,
                notes: 1,
                addedby: 1,
                _id: 1
            }
        );


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!result) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        result
    });
});




exports.getAllProductionIndividualLimitedOverallExcel = catchAsyncErrors(async (req, res, next) => {
    let result, prodresult;
    try {

        result = await ProductionIndividual.find({},
            {
                vendor: 1,
                datemode: 1,
                fromdate: 1,
                time: 1,
                filename: 1,
                category: 1,
                unitid: 1,
                user: 1,
                section: 1,
                flagcount: 1,
                alllogin: 1,
                docnumber: 1,
                doclink: 1,
                approvalstatus: 1,
                lateentrystatus: 1,
                startmode: 1,
                startdate: 1,
                starttime: 1,
                status: 1,
                totalpages: 1,
                flagcount: 1,
                pendingpages: 1,
                startpage: 1,
                reason: 1,
                statusmode: 1,
                enddate: 1,
                endtime: 1,
                notes: 1,
                addedby: 1,
                _id: 1
            }
        );


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!result) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        result
    });
});



exports.getAllProductionIndividualManualOverallExcel = catchAsyncErrors(async (req, res, next) => {
    let result, prodresult;
    try {

        let query = { statusmode: req.body.statusmode }

        result = await ProductionIndividual.find(query,
            {
                vendor: 1,
                datemode: 1,
                fromdate: 1,
                time: 1,
                filename: 1,
                category: 1,
                unitid: 1,
                user: 1,
                section: 1,
                flagcount: 1,
                alllogin: 1,
                docnumber: 1,
                doclink: 1,
                approvalstatus: 1,
                lateentrystatus: 1,
                startmode: 1,
                startdate: 1,
                starttime: 1,
                status: 1,
                totalpages: 1,
                flagcount: 1,
                pendingpages: 1,
                startpage: 1,
                reason: 1,
                statusmode: 1,
                enddate: 1,
                endtime: 1,
                notes: 1,
                addedby: 1,
                _id: 1
            }
        );


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!result) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        result
    });
});





//individual list

// exports.ProductionIndividualSort = catchAsyncErrors(async (req, res, next) => {
//   let totalProjects, totalProjectsDatas, result, totalPages, currentPage;

//   const { page, pageSize, companyname } = req.body;
//   try {
//     // Get this value from the client request (e.g., from a query parameter)

//     let query = {};
//     if (!req.body.role.includes("Admin") &&
//       !req.body.role.includes("Manager")
//     ) {
//       query["addedby.name"] = { $eq: companyname };
//     }

//     totalProjects = await ProductionIndividual.countDocuments(query);
//     totalProjectsDatas = await ProductionIndividual.find(query)

//     result = await ProductionIndividual.find(query)
//       .skip((page - 1) * pageSize)
//       .limit(parseInt(pageSize));


//   } catch (err) {
//     return next(new ErrorHandler("Records not found!", 404));
//   }

//   return res.status(200).json({
//     totalProjects,
//     result,
//     totalProjectsDatas,
//     currentPage: page,
//     totalPages: Math.ceil(totalProjects / pageSize),
//   });
// });


//individual list
// exports.ProductionIndividualSort = catchAsyncErrors(async (req, res, next) => {
//   const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery } = req.body;

//   console.log(page, pageSize, "boduy")

//   let query = {};
//   if (!req.body.role.includes("Admin") &&
//     !req.body.role.includes("Manager")
//   ) {
//     query["addedby.name"] = { $eq: companyname };
//   }

//   // console.log(query, "ascd")

//   let conditions = [];

//   // Advanced search filter
//   if (allFilters && allFilters.length > 0) {
//     allFilters.forEach(filter => {
//       console.log(filter, "filter")
//       if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
//         conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
//       }
//     });
//   }


//   if (searchQuery && searchQuery !== undefined) {
//     const searchTermsArray = searchQuery.split(" ");
//     // const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

//     // const orConditions = regexTerms.map((regex) => ({
//     //   $or: [
//     //     { vendor: regex },
//     //     { datemode: regex },
//     //     { fromdate: regex },
//     //     { time: regex },
//     //     { filename: regex },
//     //     { category: regex },
//     //     { unitid: regex },
//     //     { user: regex },
//     //     { section: regex },
//     //     { alllogin: regex },
//     //     { docnumber: regex },
//     //     { doclink: regex },
//     //     { approvalstatus: regex },
//     //     { lateentrystatus: regex },
//     //     { startmode: regex },
//     //     { startdate: regex },
//     //     { starttime: regex },
//     //     { status: regex },
//     //     { totalpages: regex },
//     //     { flagcount: regex },
//     //     { pendingpages: regex },
//     //     { startpage: regex },
//     //     { reason: regex },
//     //     { statusmode: regex },
//     //     { enddate: regex },
//     //     { endtime: regex },
//     //     { notes: regex },
//     //   ],
//     // }));

//     const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

//     // Fetch a sample document to infer fields (pseudo-code for explanation)
//     const sampleDocument = await ProductionIndividual.findOne().sort({ createdAt: -1 });
//     const allFields = Object.keys(sampleDocument); // Get all field names dynamically

//     // Create dynamic regex query for all fields
//     const orConditions = regexTerms.map((regex) => ({
//       $or: allFields.map((field) => ({ [field]: regex })),
//     }));


//     query = {

//       $or: [
//         ...orConditions,
//       ],


//     }


//     if (!req.body.role.includes("Admin") &&
//       !req.body.role.includes("Manager")
//     ) {
//       query["addedby.name"] = { $eq: companyname };
//     }
//   }



//   // Apply logicOperator to combine conditions
//   if (conditions.length > 0) {
//     if (logicOperator === "AND") {
//       query.$and = conditions;
//     } else if (logicOperator === "OR") {
//       query.$or = conditions;
//     }
//   }
//   // console.log(query, "query")
//   try {

//     const totalProjects = await ProductionIndividual.countDocuments(query);

//     const result = await ProductionIndividual.find(query)
//       .select("")
//       .lean()
//       .skip((page - 1) * pageSize)
//       .limit(parseInt(pageSize))
//       .exec();
//     console.log(result.length, 'totap')
//     console.log(totalProjects, 'totalProjects')
//     res.status(200).json({
//       totalProjects,
//       result,
//       currentPage: page,
//       totalPages: Math.ceil(totalProjects / pageSize),
//     });
//   } catch (err) {
//     return next(new ErrorHandler("Records not found!", 404));
//   }
// });




exports.ProductionIndividualSort = catchAsyncErrors(async (req, res, next) => {
    const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery } = req.body;

    let query = {};
    if (!req.body.role.includes("Admin") &&
        !req.body.role.includes("Manager")
    ) {
        query["addedby.name"] = { $eq: companyname };
    }



    let queryoverall = {};
    if (!req.body.role.includes("Admin") &&
        !req.body.role.includes("Manager")
    ) {
        queryoverall["addedby.name"] = { $eq: companyname };
    }

    let conditions = [];

    // Advanced search filter
    if (allFilters && allFilters.length > 0) {
        allFilters.forEach(filter => {
            console.log(filter, "filter")
            if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
                if (filter.column == "fromdate" || filter.column == "startdate") {
                    const [day, month, year] = filter.value.split("/")
                    let formattedValue = `${year}-${month}-${day}`
                    conditions.push(createFilterCondition(filter.column, filter.condition, formattedValue));
                }
                else {

                    conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
                }
            }
        });
    }

    if (searchQuery && searchQuery !== undefined) {
        const searchTermsArray = searchQuery.split(" ");
        const regexTerms = searchTermsArray.map((term) => {

            // Check if the term is in the date format DD/MM/YYYY
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (dateRegex.test(term)) {
                // Convert DD/MM/YYYY to YYYY-MM-DD
                const [day, month, year] = term.split("/");
                const formattedDate = `${year}-${month}-${day}`;
                return new RegExp(formattedDate, "i");
            }
            return new RegExp(term, "i");
        });
        // console.log(regexTerms, "regexTerms")
        const orConditions = regexTerms.map((regex) => ({
            $or: [
                { vendor: regex },
                { datemode: regex },
                { fromdate: regex },
                { time: regex },
                { filename: regex },
                { category: regex },
                { unitid: regex },
                { user: regex },
                { section: regex },
                { alllogin: regex },
                { docnumber: regex },
                { doclink: regex },
                { approvalstatus: regex },
                { lateentrystatus: regex },
                { startmode: regex },
                { startdate: regex },
                { starttime: regex },
                { status: regex },
                { totalpages: regex },
                { flagcount: regex },
                { pendingpages: regex },
                { startpage: regex },
                { reason: regex },
                { statusmode: regex },
                { enddate: regex },
                { endtime: regex },
                { notes: regex },
            ],

        }));
        // console.log(searchQuery, "searchQuery")
        query = {
            $and: [
                ...orConditions,
            ],
        };
    }

    if (!req.body.role.includes("Admin") &&
        !req.body.role.includes("Manager")
    ) {
        query["addedby.name"] = { $eq: companyname };
    }
    // console.log(query, "query")

    // Apply logicOperator to combine conditions
    if (conditions.length > 0) {
        if (logicOperator === "AND") {
            query.$and = conditions;
        } else if (logicOperator === "OR") {
            query.$or = conditions;
        }
    }
    // console.log(conditions, "conditions")
    try {

        const totalProjects = await ProductionIndividual.countDocuments(query);
        const totalProjectsData = await ProductionIndividual.find(queryoverall);

        const result = await ProductionIndividual.find(query)
            .select("")
            .lean()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize))
            .exec();
        // console.log(result.length, 'result')
        res.status(200).json({
            totalProjects,
            totalProjectsData,
            result,
            currentPage: page,
            totalPages: Math.ceil(totalProjects / pageSize),
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
});

//completed list

exports.ManualStatusviceIndividualSort = catchAsyncErrors(async (req, res, next) => {
    const { page, pageSize, allFilters, logicOperator, searchQuery, companyname } = req.body;

    // console.log(req.body, "completed")

    let query = { statusmode: { $in: req.body.statusmode } };
    if (!req.body.role.includes("Admin") &&
        !req.body.role.includes("Manager")
    ) {
        query["addedby.name"] = { $eq: companyname };
    }

    // console.log(query, "qucompay")

    let queryoverall = { statusmode: { $in: req.body.statusmode } };
    if (!req.body.role.includes("Admin") &&
        !req.body.role.includes("Manager")
    ) {
        queryoverall["addedby.name"] = { $eq: companyname };
    }

    let conditions = [];

    // Advanced search filter
    if (allFilters && allFilters.length > 0) {
        allFilters.forEach(filter => {
            console.log(filter, "filter")
            if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
                if (filter.column == "fromdate" || filter.column == "startdate") {
                    const [day, month, year] = filter.value.split("/")
                    let formattedValue = `${year}-${month}-${day}`
                    conditions.push(createFilterCondition(filter.column, filter.condition, formattedValue));
                }
                else {

                    conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
                }
            }
        });
    }

    if (searchQuery && searchQuery !== undefined) {
        const searchTermsArray = searchQuery.split(" ");
        const regexTerms = searchTermsArray.map((term) => {

            // Check if the term is in the date format DD/MM/YYYY
            const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
            if (dateRegex.test(term)) {
                // Convert DD/MM/YYYY to YYYY-MM-DD
                const [day, month, year] = term.split("/");
                const formattedDate = `${year}-${month}-${day}`;
                return new RegExp(formattedDate, "i");
            }
            return new RegExp(term, "i");
        });
        // console.log(regexTerms, "regexTerms")
        const orConditions = regexTerms.map((regex) => ({
            $or: [
                { vendor: regex },
                { datemode: regex },
                { fromdate: regex },
                { time: regex },
                { filename: regex },
                { category: regex },
                { unitid: regex },
                { user: regex },
                { section: regex },
                { alllogin: regex },
                { docnumber: regex },
                { doclink: regex },
                { approvalstatus: regex },
                { lateentrystatus: regex },
                { startmode: regex },
                { startdate: regex },
                { starttime: regex },
                { status: regex },
                { totalpages: regex },
                { flagcount: regex },
                { pendingpages: regex },
                { startpage: regex },
                { reason: regex },
                { statusmode: regex },
                { enddate: regex },
                { endtime: regex },
                { notes: regex },
            ],

        }));

        query = {
            statusmode: { $in: req.body.statusmode },
            $or: [
                ...orConditions,
            ]
        };
    }
    // console.log(searchQuery, "searchQuery")



    if (!req.body.role.includes("Admin") &&
        !req.body.role.includes("Manager")
    ) {
        query["addedby.name"] = { $eq: companyname };
    }
    // console.log(query, "querycomplete")

    // Apply logicOperator to combine conditions
    if (conditions.length > 0) {
        if (logicOperator === "AND") {
            query.$and = conditions;
        } else if (logicOperator === "OR") {
            query.$or = conditions;
        }
    }




    // console.log(query, "querycomplete")

    // console.log(conditions, "conditions")
    try {

        const totalProjects = await ProductionIndividual.countDocuments(query);
        const totalProjectsData = await ProductionIndividual.find(queryoverall);

        const result = await ProductionIndividual.find(query)
            .select("")
            .lean()
            .skip((page - 1) * pageSize)
            .limit(parseInt(pageSize))
            .exec();
        // console.log(result.length, 'resultcomp')
        res.status(200).json({
            totalProjects,
            totalProjectsData,
            result,
            currentPage: page,
            totalPages: Math.ceil(totalProjects / pageSize),
        });
    } catch (err) {
        console.log(err, "errcompleted")
        return next(new ErrorHandler("Records not found!", 404));
    }

});

// exports.ManualStatusviceIndividualSort = catchAsyncErrors(async (req, res, next) => {
//   let totalProjects, totalProjectsDatas, result, totalPages, currentPage;

//   const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery } = req.body;

//   try {
//     // Get this value from the client request (e.g., from a query parameter)

//     let query = { statusmode: { $in: req.body.statusmode } };
//     if (!req.body.role.includes("Admin") &&
//       !req.body.role.includes("Manager")
//     ) {
//       query["addedby.name"] = { $eq: companyname };
//     }

//     // console.log(query, "aaa")

//     let conditions = [];

//     // Advanced search filter
//     if (allFilters && allFilters.length > 0) {
//       allFilters.forEach(filter => {
//         console.log(filter, "filter")
//         if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
//           conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
//         }
//       });
//     }

//     if (searchQuery && searchQuery !== undefined) {
//       // const searchTermsArray = searchQuery.split(" ");
//       // const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

//       // const orConditions = regexTerms.map((regex) => ({
//       //   $or: [
//       //     { vendor: regex },
//       //     { datemode: regex },
//       //     { fromdate: regex },
//       //     { time: regex },
//       //     { filename: regex },
//       //     { category: regex },
//       //     { unitid: regex },
//       //     { user: regex },
//       //     { section: regex },
//       //     { alllogin: regex },
//       //     { docnumber: regex },
//       //     { doclink: regex },
//       //     { approvalstatus: regex },
//       //     { lateentrystatus: regex },
//       //     { startmode: regex },
//       //     { startdate: regex },
//       //     { starttime: regex },
//       //     { status: regex },
//       //     { totalpages: regex },
//       //     { flagcount: regex },
//       //     { pendingpages: regex },
//       //     { startpage: regex },
//       //     { reason: regex },
//       //     { statusmode: regex },
//       //     { enddate: regex },
//       //     { endtime: regex },
//       //     { notes: regex },
//       //   ],
//       // }));

//       const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

//       // Fetch a sample document to infer fields (pseudo-code for explanation)
//       const sampleDocument = await ProductionIndividual.findOne().sort({ createdAt: -1 });
//       const allFields = Object.keys(sampleDocument); // Get all field names dynamically

//       // Create dynamic regex query for all fields
//       const orConditions = regexTerms.map((regex) => ({
//         $or: allFields.map((field) => ({ [field]: regex })),
//       }));


//       query = {
//         statusmode: { $in: req.body.statusmode },
//         $or: [
//           ...orConditions,
//         ],


//       }

//       if (!req.body.role.includes("Admin") &&
//         !req.body.role.includes("Manager")
//       ) {
//         query["addedby.name"] = { $eq: companyname };
//       }
//     }

//     // Apply logicOperator to combine conditions
//     if (conditions.length > 0) {
//       if (logicOperator === "AND") {
//         query.$and = conditions;
//       } else if (logicOperator === "OR") {
//         query.$or = conditions;
//       }
//     }

//     totalProjects = await ProductionIndividual.countDocuments(query);
//     totalProjectsDatas = await ProductionIndividual.find(query)

//     result = await ProductionIndividual.find(query)
//       .select("")
//       .lean()
//       .skip((page - 1) * pageSize)
//       .limit(parseInt(pageSize))
//       .exec();
//     // console.log(result.length, 'totap')
//     // console.log(totalProjects, 'totalProjects')

//   } catch (err) {
//     return next(new ErrorHandler("Records not found!", 404));
//   }

//   return res.status(200).json({
//     totalProjects,
//     result,
//     totalProjectsDatas,
//     currentPage: page,
//     totalPages: Math.ceil(totalProjects / pageSize),
//   });
// });
