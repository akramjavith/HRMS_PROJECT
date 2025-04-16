const Payruncontrol = require("../../../model/modules/production/payruncontrol");
const DepartmentMonth = require("../../../model/modules/departmentmonthset");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const User = require("../../../model/login/auth");

// get All payruncontrol => /api/payruncontrol
exports.getAllpayruncontrol = catchAsyncErrors(async (req, res, next) => {
    let payruncontrol;
    try {
        payruncontrol = await Payruncontrol.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!payruncontrol) {
        return next(new ErrorHandler("Payruncontrol not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        payruncontrol,
    });
});
// get All getUserNamesBasedOnStatus => /api/usernamesbasedonstatus
exports.getUserNamesbasedOnStatusPayRun = catchAsyncErrors(async (req, res, next) => {
    let users;
    let { name, empstatus, status, company } = req.body;
    try {
        const generateMongoQuery = (query) => {
            const mongoQuery = {};
            // Add department to the query if it exists
            if (query.department) {
                mongoQuery.department = { "$in": query.department }
            };
            if (query.company) {
                mongoQuery.company = query.company
            };
            if (query.empstatus) {
                mongoQuery.resonablestatus = query.empstatus
            };
            if (query.branch) {
                mongoQuery.branch = { "$in": query.branch }
            };
            if (query.unit) {
                mongoQuery.unit = { "$in": query.unit }
            };
            if (query.team) {
                mongoQuery.team = { "$in": query.team }
            };

            return mongoQuery;
        };
        const generateMongoQueryLive = (query) => {
            const mongoQuery = {};
            // Add department to the query if it exists
            if (query.department) {
                mongoQuery.department = { "$in": query.department }
            };
            if (query.company) {
                mongoQuery.company = query.company
            };
            if (query.empstatus) {
                mongoQuery.resonablestatus = undefined
            };
            if (query.branch) {
                mongoQuery.branch = { "$in": query.branch }
            };
            if (query.unit) {
                mongoQuery.unit = { "$in": query.unit }
            };
            if (query.team) {
                mongoQuery.team = { "$in": query.team }
            };

            return mongoQuery;
        };
        let query = {};
        Object.keys(req.body).forEach((key) => {
            if (key !== "headers" && !['status'].includes(key)) {
                const value = req.body[key];
                if (value !== "" && value?.length > 0 ) {
                    query[key] = value;
                }
            }

        });
        const mongoQueryTeam = generateMongoQuery(query);
        const mongoQueryTeamLive = generateMongoQueryLive(query);
        const teamWise = req.body.empstatus === "Live Employee" ?   await User.find(mongoQueryTeamLive, {
            companyname: 1, _id: 1, company: 1, branch: 1, unit: 1, team: 1, department: 1
        }) : await User.find(mongoQueryTeam, {
            companyname: 1, _id: 1, company: 1, branch: 1, unit: 1, team: 1, department: 1
        });
        users = teamWise


    } catch (err) {

        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        users
    });
});

//Employee Names based on the Dropdowns Chooosing
exports.getFilterPayRunEmployeenamesData = catchAsyncErrors(async (req, res, next) => {
    let users;
    try {

        const generateMongoQuery = (query) => {
            const mongoQuery = {};
            // Add department to the query if it exists
            if (query.department) {
                mongoQuery.department = { "$in": query.department }
            };
            if (query.company) {
                mongoQuery.company = { "$in": query.company }
            };
            if (query.branch) {
                mongoQuery.branch = { "$in": query.branch }
            };
            if (query.unit) {
                mongoQuery.unit = { "$in": query.unit }
            };
            if (query.team) {
                mongoQuery.team = { "$in": query.team }
            };
            if (query.empstatus) {
                mongoQuery.resonablestatus = query.empstatus
            };

            return mongoQuery;
        };
        const generateMongoQueryRun = (query) => {
            const mongoQuery = {};
            // Add department to the query if it exists
            if (query.department) {
                mongoQuery.department = { "$in": query.department }
            };
            if (query.company) {
                mongoQuery.company = { "$in": query.company }
            };
            if (query.branch) {
                mongoQuery.branch = { "$in": query.branch }
            };
            if (query.unit) {
                mongoQuery.unit = { "$in": query.unit }
            };
            if (query.team) {
                mongoQuery.team = { "$in": query.team }
            };


            return mongoQuery;
        };
        let query = {};
        Object.keys(req.body).forEach((key) => {
            if (key !== "headers" && !['status'].includes(key)) {
                const value = req.body[key];
                if (value !== "" && (value?.length > 0 || key === "empstatus")) {
                    query[key] = value;
                }
            }

        });
        const mongoQueryTeam = generateMongoQuery(query);
        const mongoQueryLive = generateMongoQueryRun(query);
        const teamWise = req.body?.empstatus === "Live Employee" ?
            await User.find(mongoQueryLive, {
                companyname: 1, _id: 1, company: 1, branch: 1, unit: 1, team: 1, department: 1
            }) : await User.find(mongoQueryTeam, {
                companyname: 1, _id: 1, company: 1, branch: 1, unit: 1, team: 1, department: 1
            });
        users = teamWise


    } catch (err) {

        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        users
    });
});

//getting the Report to get the PayRun Data
exports.getFilterPayRunreportData = catchAsyncErrors(async (req, res, next) => {
    let users, departmentmonthset, payrunControl, usernames, UsersFilters;
    let { month, yearfiltered, department } = req.body;
    let { company, branch, unit, team, employeenames } = req.body;
    try {
        function getMonthNumber(month) {
            const monthMap = {
                January: "1",
                February: "2",
                March: "3",
                April: "4",
                May: "5",
                June: "6",
                July: "7",
                August: "8",
                September: "9",
                October: "10",
                November: "11",
                December: "12"
            };

            return monthMap[month];
        }
        const monthNumber = getMonthNumber(req.body.month)
        const january2014 = new Date(`${req.body.year}-${monthNumber}-01T00:00:00Z`);

        const generateMongoQueryPayRun = (query) => {
            const mongoQuery = {};
            // Add department to the query if it exists
            if (query.department) {
                mongoQuery.department = { "$in": query.department }
            };
            if (query.company) {
                mongoQuery.company = { "$in": query.company }
            };
            if (query.branch) {
                mongoQuery.branch = { "$in": query.branch }
            };
            if (query.unit) {
                mongoQuery.unit = { "$in": query.unit }
            };
            if (query.empstatus) {
                mongoQuery.empstatus = query.empstatus
            };
            if (query.filtertype) {
                mongoQuery.filtertype = query.filtertype
            };
            if (query.team) {
                mongoQuery.team = { "$in": query.team }
            };
            if (query.employeenames) {
                mongoQuery.empname = { "$in": query.employeenames }
            };

            return mongoQuery;
        };
        const generateMongoQueryUserData = (query) => {
            const mongoQuery = {};
            if (query.company) {
                mongoQuery.company = { "$in": query.company }
            };
            if (query.department) {
                mongoQuery.department = { "$in": query.department }
            };
            if (query.branch) {
                mongoQuery.branch = { "$in": query.branch }
            };
            if (query.unit) {
                mongoQuery.unit = { "$in": query.unit }
            };
            if (query.empstatus) {
                mongoQuery.resonablestatus = query.empstatus
            };
            if (query.team) {
                mongoQuery.team = { "$in": query.team }
            };
            if (query.employeenames) {
                mongoQuery.companyname = { "$in": query.employeenames }
            };

            return mongoQuery;
        };
        const generateMongoQueryUserDataLive = (query) => {
            const mongoQuery = {};
            if (query.company) {
                mongoQuery.company = { "$in": query.company }
            };
            if (query.department) {
                mongoQuery.department = { "$in": query.department }
            };
            if (query.branch) {
                mongoQuery.branch = { "$in": query.branch }
            };
            if (query.unit) {
                mongoQuery.unit = { "$in": query.unit }
            };
            if (query.team) {
                mongoQuery.team = { "$in": query.team }
            };
            if (query.empstatus) {
                mongoQuery.resonablestatus = undefined
            };
            if (query.employeenames) {
                mongoQuery.companyname = { "$in": query.employeenames }
            };

            return mongoQuery;
        };
        let query = {};
        Object.keys(req.body).forEach((key) => {
            if (key !== "headers" && !['status'].includes(key)) {
                const value = req.body[key];
                if (value !== "" && value?.length > 0) {
                    query[key] = value;
                }
            }

        });

        const mongoQueryTeamPayRun = generateMongoQueryPayRun(query)
        const mongoQueryUserData = generateMongoQueryUserData(query)
        const mongoQueryUserDataLive = generateMongoQueryUserDataLive(query)
        const usersData = req.body.empstatus === "Live Employee" ?
            await User.find(mongoQueryUserDataLive, { companyname: 1, branch: 1, unit: 1, team: 1, department: 1, company: 1, boardingLog: 1, departmentlog: 1, reasondate: 1, resonablestatus: 1 }).lean()
            :
            await User.find(mongoQueryUserData, { companyname: 1, branch: 1, unit: 1, team: 1, department: 1, company: 1, boardingLog: 1, departmentlog: 1, reasondate: 1, resonablestatus: 1 }).lean()
        departmentmonthset = await Payruncontrol.find(mongoQueryTeamPayRun).lean();
        // Individual 
        const fetchIndividualPayrun = departmentmonthset?.length > 0 ? departmentmonthset?.filter(data => data?.filtertype === "Individual" && 
            data?.empname?.some(data => req.body?.empname?.includes(data)) &&
            data?.branch?.some(data => req.body?.branch?.includes(data)) &&
            data?.unit?.some(data => req.body?.unit?.includes(data)) &&
            data?.team?.some(data => req.body?.team?.includes(data)) 
        ) : [];




        // Team Wise
        const filteredUsers = usersData?.filter(data =>
            !fetchIndividualPayrun?.some(items => items?.empname?.includes(data.companyname))
        );
        const fetchTeamPayRun = (departmentmonthset?.length > 0 && filteredUsers?.length > 0) ?
            req.body.empstatus === "Live Employee" ?
                filteredUsers?.filter(item => item?.boardingLog?.length > 0).map(item => {
                    const boardingLogLength = item?.boardingLog?.length;
                    if (boardingLogLength > 0) {
                        const logData = item?.boardingLog?.filter(item => req.body?.team?.includes(item?.team));;
                        const currentYear = Number(yearfiltered);
                        const currentMonth = Number(monthNumber);
                        const targetDate = new Date(currentYear, currentMonth);
                        const filtered = logData
                            .filter(item => new Date(item.startdate) <= targetDate)
                            .sort((a, b) => new Date(b.startdate) - new Date(a.startdate)); // Sort in descending order to get the closest date
                        if (filtered?.length > 0) {
                            return {
                                branch: [filtered[0].branch],
                                department: [item.department],
                                unit: [filtered[0].unit],
                                team: [filtered[0].team],
                                empname: [item.companyname]
                            };
                        }
                    }
                    return null;
                }).filter(result => result !== null) :
                filteredUsers?.map(item => {
                    if (req?.body?.team?.includes(item.team)) {
                        const startDate = new Date(item.reasondate);
                        const currentYear = Number(yearfiltered);
                        const currentMonth = Number(monthNumber);
                        const isWithinRange = startDate.getFullYear() <= currentYear &&
                            (startDate.getFullYear() === currentYear ? startDate.getMonth() + 1 <= currentMonth : true);

                        const hasMatchingLog = isWithinRange
                        if (hasMatchingLog) {

                            return {
                                branch: [item.branch],
                                department: [item.department],
                                unit: [item.unit],
                                team: [item.team],
                                empname: [item.companyname]
                            };
                        }
                    }
                }).filter(result => result !== null) : [];

        const TeamWiseFilter = fetchTeamPayRun?.map(data => {
            const matchingData = departmentmonthset?.find(item => item?.team?.some(ite => data?.team?.includes(ite)))
            if (matchingData) {
                return {
                    ...data,
                    deductiontype: matchingData?.deductiontype,
                    company: matchingData?.company,
                    achieved: matchingData?.achieved,
                    achievedfrom: matchingData?.achievedfrom,
                    achievedsymbol: matchingData?.achievedsymbol,
                    achievedto: matchingData?.achievedto,
                    empstatus: matchingData?.empstatus,
                    filtertype: matchingData?.filtertype,
                    newgross: matchingData?.newgross,
                    newgrossfrom: matchingData?.newgrossfrom,
                    newgrosssymbol: matchingData?.newgrosssymbol,
                    salraytype: matchingData?.salraytype,
                    uniqueid: matchingData?.uniqueid,
                }
            }
        })?.filter(data => data !== null && data !== undefined)



        // Uni Wise
        const filteredUnitUsers = (departmentmonthset?.length > 0 && (TeamWiseFilter?.length > 0 || filteredUsers?.length > 0)) ? 
        filteredUsers?.filter(data =>
            !TeamWiseFilter?.some(items => items?.empname?.includes(data.companyname))
        ) : [];

        const fetchUnitPayRun = (departmentmonthset?.length > 0 && filteredUnitUsers?.length > 0) ?
            req.body.empstatus === "Live Employee" ?
                filteredUnitUsers?.filter(item => item?.boardingLog?.length > 0).map(item => {
                    const boardingLogLength = item?.boardingLog?.length;
                    if (boardingLogLength > 1) {
                        const logData = item?.boardingLog?.filter(item => req?.body?.unit?.includes(item?.unit));;
                        const currentYear = Number(yearfiltered);
                        const currentMonth = Number(monthNumber);
                        const targetDate = new Date(currentYear, currentMonth);
                        const filtered = logData
                            .filter(item => new Date(item.startdate) <= targetDate)
                            .sort((a, b) => new Date(b.startdate) - new Date(a.startdate)); // Sort in descending order to get the closest date

                        if (filtered?.length > 0) {
                            return {
                                company: [filtered[0].company],
                                branch: [filtered[0].branch],
                                department: [item.department],
                                unit: [filtered[0].unit],
                                team: [filtered[0].team],
                                empname: [item.companyname]
                            };
                        }
                    }
                    return null;
                }).filter(result => result !== null) :
                filteredUnitUsers?.map(item => {
                    if (req?.body?.unit?.includes(item.unit)) {
                        const startDate = new Date(item.reasondate);
                        const currentYear = Number(yearfiltered);
                        const currentMonth = Number(monthNumber);
                        const isWithinRange = startDate.getFullYear() <= currentYear &&
                            (startDate.getFullYear() === currentYear ? startDate.getMonth() + 1 <= currentMonth : true);

                        const hasMatchingLog = isWithinRange
                        if (hasMatchingLog) {

                            return {
                                branch: [item.branch],
                                department: [item.department],
                                unit: [item.unit],
                                team: [item.team],
                                empname: [item.companyname]
                            };
                        }
                    }
                }).filter(result => result !== null) : []; // Remove null values

        const UnitWiseFilter = fetchUnitPayRun?.map(data => {
            const matchingData = departmentmonthset?.find(item => item?.unit?.some(ite => data?.unit?.includes(ite)))
            if (matchingData) {
                return {
                    ...data,
                    deductiontype: matchingData?.deductiontype,
                    company: matchingData?.company,
                    achieved: matchingData?.achieved,
                    achievedfrom: matchingData?.achievedfrom,
                    achievedsymbol: matchingData?.achievedsymbol,
                    achievedto: matchingData?.achievedto,
                    empstatus: matchingData?.empstatus,
                    filtertype: matchingData?.filtertype,
                    newgross: matchingData?.newgross,
                    newgrossfrom: matchingData?.newgrossfrom,
                    newgrosssymbol: matchingData?.newgrosssymbol,
                    salraytype: matchingData?.salraytype,
                    uniqueid: matchingData?.uniqueid,
                }
            }
        })?.filter(data => data !== null && data !== undefined)


















        // Branch
        const filteredBranchUsers = (departmentmonthset?.length > 0 && (UnitWiseFilter?.length > 0 || filteredUnitUsers?.length > 0)) ?
        filteredUnitUsers?.filter(data =>
                !UnitWiseFilter?.some(items => items?.empname?.includes(data.companyname))
            ) : [];
        const fetchBranchPayRun = (departmentmonthset?.length > 0 && filteredBranchUsers?.length > 0) ?
            req.body.empstatus === "Live Employee" ?
                filteredBranchUsers?.filter(item => item?.boardingLog?.length > 0).map(item => {
                    const boardingLogLength = item?.boardingLog?.length;

                    if (boardingLogLength > 1) {
                        const logData = item?.boardingLog?.filter(item => req?.body?.branch?.includes(item?.branch));;
                        const currentYear = Number(yearfiltered);
                        const currentMonth = Number(monthNumber);
                        const targetDate = new Date(currentYear, currentMonth);
                        const filtered = logData
                            .filter(item => new Date(item.startdate) <= targetDate)
                            .sort((a, b) => new Date(b.startdate) - new Date(a.startdate)); // Sort in descending order to get the closest date

                        if (filtered?.length > 0) {
                            return {
                                // ...data,
                                branch: [filtered[0].branch],
                                department: [item.department],
                                unit: [filtered[0].unit],
                                team: [filtered[0].team],
                                empname: [item.companyname]
                            };
                        }
                    }


                    return null;
                }).filter(result => result !== null) :
                filteredBranchUsers?.map(item => {
                    if (req?.body?.branch?.includes(item.branch)) {
                        const startDate = new Date(item.reasondate);
                        const currentYear = Number(yearfiltered);
                        const currentMonth = Number(monthNumber);
                        const isWithinRange = startDate.getFullYear() <= currentYear &&
                            (startDate.getFullYear() === currentYear ? startDate.getMonth() + 1 <= currentMonth : true);

                        const hasMatchingLog = isWithinRange
                        if (hasMatchingLog) {

                            return {
                                branch: [item.branch],
                                department: [item.department],
                                unit: [item.unit],
                                team: [item.team],
                                empname: [item.companyname]
                            };
                        }
                    }
                }).filter(result => result !== null) : []; // Remove null values

        const BranchWiseFilter = fetchBranchPayRun?.map(data => {
            const matchingData = departmentmonthset?.find(item => item?.branch?.some(ite => data?.branch?.includes(ite)))
            if (matchingData) {
                return {
                    ...data,
                    deductiontype: matchingData?.deductiontype,
                    company: matchingData?.company,
                    achieved: matchingData?.achieved,
                    achievedfrom: matchingData?.achievedfrom,
                    achievedsymbol: matchingData?.achievedsymbol,
                    achievedto: matchingData?.achievedto,
                    empstatus: matchingData?.empstatus,
                    filtertype: matchingData?.filtertype,
                    newgross: matchingData?.newgross,
                    newgrossfrom: matchingData?.newgrossfrom,
                    newgrosssymbol: matchingData?.newgrosssymbol,
                    salraytype: matchingData?.salraytype,
                    uniqueid: matchingData?.uniqueid,
                }
            }
        })?.filter(data => data !== null && data !== undefined)















        // Department
        const filteredDepartmentUsers = (departmentmonthset?.length > 0 && (filteredBranchUsers?.length > 0 || BranchWiseFilter?.length > 0)) ?
            filteredBranchUsers?.filter(data =>
                !BranchWiseFilter?.some(items => items?.empname?.includes(data.companyname))
            ) : [];
        const fetchDepartmentPayRun = (departmentmonthset?.length > 0 && filteredBranchUsers?.length > 0) ?
            req.body.empstatus === "Live Employee" ?
                filteredDepartmentUsers?.filter(item => item?.departmentlog?.length > 0).map(item => {
                    const boardingLogLength = item?.departmentlog?.length;
                    if (boardingLogLength > 0) {
                        const logData = item?.departmentlog?.filter(item => req.body?.department?.includes(item?.department));
                        const currentYear = Number(yearfiltered);
                        const currentMonth = Number(monthNumber);
                        const targetDate = new Date(currentYear, currentMonth);

                        const filtered = logData
                            .filter(item => new Date(item.startdate) <= targetDate)
                            .sort((a, b) => new Date(b.startdate) - new Date(a.startdate)); // Sort in descending order to get the closest date

                        if (filtered?.length > 0) {
                            // console.log(filtered, 'filtered')
                            return {
                                branch: [filtered[0].branch],
                                department: [filtered[0].department],
                                unit: [filtered[0].unit],
                                team: [filtered[0].team],
                                empname: [item.companyname]
                            };
                        }
                    }
                    return null;
                }).filter(result => result !== null) :
                filteredDepartmentUsers?.map(item => {
                    if (req.body?.department?.includes(item.department)) {
                        const startDate = new Date(item.reasondate);
                        const currentYear = Number(yearfiltered);
                        const currentMonth = Number(monthNumber);
                        const isWithinRange = startDate.getFullYear() <= currentYear &&
                            (startDate.getFullYear() === currentYear ? startDate.getMonth() + 1 <= currentMonth : true);

                        const hasMatchingLog = isWithinRange
                        if (hasMatchingLog) {
                            return {
                                branch: [item.branch],
                                department: [item.department],
                                unit: [item.unit],
                                team: [item.team],
                                empname: [item.companyname]
                            };
                        }
                    }
                }).filter(result => result !== null) : [];

        const departMEntFilter = fetchDepartmentPayRun?.map(data => {
            const matchingData = departmentmonthset?.find(item => item?.department?.some(ite => data?.department?.includes(ite)))
            if (matchingData) {
                return {
                    ...data,
                    deductiontype: matchingData?.deductiontype,
                    company: matchingData?.company,
                    achieved: matchingData?.achieved,
                    achievedfrom: matchingData?.achievedfrom,
                    achievedsymbol: matchingData?.achievedsymbol,
                    achievedto: matchingData?.achievedto,
                    empstatus: matchingData?.empstatus,
                    filtertype: matchingData?.filtertype,
                    newgross: matchingData?.newgross,
                    newgrossfrom: matchingData?.newgrossfrom,
                    newgrosssymbol: matchingData?.newgrosssymbol,
                    salraytype: matchingData?.salraytype,
                    uniqueid: matchingData?.uniqueid,
                }
            }
        })?.filter(data => data !== null && data !== undefined)




        users = [...fetchIndividualPayrun,
        ...TeamWiseFilter,
        ...UnitWiseFilter,
        ...BranchWiseFilter,
        ...departMEntFilter
        ]

    } catch (err) {
console.log(err , 'err')
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        users,
        departmentmonthset,
        payrunControl,
        usernames,
        UsersFilters
    });
});

// get All payruncontrol => /api/payruncontrol
exports.getAllpayruncontrolLimited = catchAsyncErrors(async (req, res, next) => {
    let payruncontrol;
    try {
        payruncontrol = await Payruncontrol.find({}, { company: 1, userdepartment: 1, userbranch: 1, userunit: 1, userteam: 1, empname: 1, achievedsymbol: 1, achieved: 1, newgrosssymbol: 1, achievedfrom: 1, achievedto: 1, newgrossfrom: 1, newgrossto: 1, newgross: 1, salraytype: 1, deductiontype: 1 });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!payruncontrol) {
        return next(new ErrorHandler("Payruncontrol not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        payruncontrol,
    });
});

// Create new payruncontrol=> /api/payruncontrol/new
exports.addpayruncontrol = catchAsyncErrors(async (req, res, next) => {
    let apayruncontrol = await Payruncontrol.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle payruncontrol => /api/payruncontrol/:id
exports.getSinglepayruncontrol = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let spayruncontrol = await Payruncontrol.findById(id);

    if (!spayruncontrol) {
        return next(new ErrorHandler("Payruncontrol not found!", 404));
    }
    return res.status(200).json({
        spayruncontrol,
    });
});

// update payruncontrol by id => /api/payruncontrol/:id
exports.updatepayruncontrol = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let upayruncontrol = await Payruncontrol.findByIdAndUpdate(id, req.body);
    if (!upayruncontrol) {
        return next(new ErrorHandler("Payruncontrol not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete payruncontrol by id => /api/payruncontrol/:id
exports.deletepayruncontrol = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dpayruncontrol = await Payruncontrol.findByIdAndRemove(id);

    if (!dpayruncontrol) {
        return next(new ErrorHandler("Payruncontrol not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});

//newly added

exports.getAllpayruncontrolByAssignBranch = catchAsyncErrors(async (req, res, next) => {
    const { assignbranch } = req.body;
    const query = {
        $or: assignbranch.map(item => ({
            company: item.company,
            branch: { $elemMatch: { $eq: item.branch } },
            unit: { $elemMatch: { $eq: item.unit } },
        })),
    };

    let payruncontrol;
    try {
        payruncontrol = await Payruncontrol.find(query);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!payruncontrol) {
        return next(new ErrorHandler("Payruncontrol not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        payruncontrol,
    });
});

