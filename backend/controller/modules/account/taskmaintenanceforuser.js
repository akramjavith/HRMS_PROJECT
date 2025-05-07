const TaskMaintenanceForUser = require("../../../model/modules/account/taskmaintenanceforuser");
const ErrorHandler = require("../../../utils/errorhandler");
const Team = require("../../../model/modules/teams");
const User = require("../../../model/login/auth");
const Hirerarchi = require("../../../model/modules/setup/hierarchy");
const Designationgroup = require("../../../model/modules/designationgroup");
const Designation = require("../../../model/modules/designation");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Maintenance = require("../../../model/modules/account/maintenance");
const TaskMaintenanceNonScheduleGrouping = require("../../../model/modules/account/taskmaintenancenongrouping");
const axios = require("axios");
const moment = require("moment");
// get All TaskMaintenanceForUser => /api/taskschedulegroupings
exports.getAllTaskMaintenanceForUser = catchAsyncErrors(async (req, res, next) => {
    let taskmaintenanceforuser;
    try {
        taskmaintenanceforuser = await TaskMaintenanceForUser.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!taskmaintenanceforuser) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        taskmaintenanceforuser,
    });
});

exports.getAllTaskMaintenanceForUserPanelView = catchAsyncErrors(async (req, res, next) => {
    let taskmaintenanceforuser;
    try {
        taskmaintenanceforuser = await TaskMaintenanceForUser.find({ username: req.body.username, state: "running" }, {
            taskstatus: 1,
            state: 1,
            taskassigneddate: 1,
            date: 1,
            frequency: 1, monthdate: 1, weekdays: 1, annumonth: 1, timetodo: 1, taskassign: 1,
            taskname: 1,
            taskdate: 1,
            completedbyuser: 1,
            username: 1,
            assetmaterial: 1,
            subcategory: 1,
            schedule: 1,
            tasktime: 1,
            priority: 1,
            duration: 1,
            type: 1,
            taskdetails: 1,
            required: 1,
            breakup: 1,
            description: 1
        }).lean();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!taskmaintenanceforuser) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        taskmaintenanceforuser,
    });
});






exports.addTaskMaintenanceForUserOnProgress = catchAsyncErrors(async (req, res, next) => {
    let taskmaintenanceforuser;
    try {
        taskmaintenanceforuser = await TaskMaintenanceForUser.find({ taskstatus: ["Paused", "Pending", "Postponed"], username: req.body.username }, {
            taskstatus: 1, monthdate: 1, weekdays: 1, annumonth: 1, timetodo: 1,
            completedbyuser: 1,
            taskassigneddate: 1,
            frequency: 1,
            assetmaterial: 1,
            subcategory: 1,
            subsubcategory: 1,
            priority: 1,
            schedule: 1,
            duration: 1,
            type: 1,
            required: 1,
            taskdetails: 1,
            tasktime: 1,
            breakup: 1,
            description: 1,
            taskname: 1,
            taskdate: 1,
            username: 1
        });
        // taskmaintenanceforuser
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!taskmaintenanceforuser) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        taskmaintenanceforuser,
    });
});


exports.addTaskMaintenanceForUserCompleted = catchAsyncErrors(async (req, res, next) => {
    let taskmaintenanceforuser;
    try {
        taskmaintenanceforuser = await TaskMaintenanceForUser.find({ taskstatus: ["Completed", "Finished By Others", "Not Applicable to Me"], username: req.body.username }, {
            taskstatus: 1, monthdate: 1, weekdays: 1, annumonth: 1, timetodo: 1,
            taskassigneddate: 1,
            frequency: 1,
            assetmaterial: 1,
            completedbyuser: 1,
            priority: 1,
            subcategory: 1,
            subsubcategory: 1,
            schedule: 1,
            duration: 1,
            type: 1,
            taskname: 1,
            taskdate: 1,
            username: 1,
            required: 1,
            taskdetails: 1,
            tasktime: 1,
            breakup: 1,
            description: 1
        }).lean();

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!taskmaintenanceforuser) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        taskmaintenanceforuser,
    });
});







exports.getAllTaskUserReports = catchAsyncErrors(async (req, res, next) => {
    let taskmaintenanceforuser, result;
    let frequency = req.body.frequency
    try {
        taskmaintenanceforuser = await TaskMaintenanceForUser.find();
        result = taskmaintenanceforuser?.filter(data => frequency?.includes(data.frequency))

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!taskmaintenanceforuser) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        result,
    });
});



exports.getAllTaskMaintenanceForUserAutoGenerate = catchAsyncErrors(async (req, res, next) => {
    let taskmaintenanceforuser;
    let { userPostCall, ExtraNonScheduleTasks, CheckExtraTasksSchedule, shiftEndTime } = req.body
    let ans = []
    try {

        userPostCall.forEach((employeeName) => {
            CheckExtraTasksSchedule.forEach((category) => {
                ans.push({
                    assetmaterial: assetmaterial,
                    employeename: employeeName,
                    priority: category.priority,
                    timetodo: category?.timetodo?.length > 0 ? category?.timetodo : [],
                    monthdate: category?.timetodo ? category.monthdate : "",
                    weekdays: category?.weekdays?.length > 0 ? category?.weekdays : [],
                    annumonth: category.annuday ? category.annuday : "",
                    annuday: category.annumonth ? category.annumonth : "",
                    schedule: String(category.schedule),
                    frequency: String(category.frequency),
                    required: category?.required,
                    description: category?.description ? category?.description : "",
                    documentfiles: category?.documentfiles ? category?.documentfiles : "",
                    orginalid: category?._id ? category?._id : category?.orginalid,
                    taskstatus: "Assigned",

                });
            });
        });
        const answer = await Promise.all(ans?.map((data) => {
            axios.post(
                `${`http://localhost:7001/api/taskmaintenanceforusers/new`}`,
                {
                    assetmaterial: String(data.assetmaterial),
                    timetodo: data?.timetodo?.length > 0 ? data?.timetodo : [],
                    monthdate: data?.timetodo ? data.monthdate : "",
                    weekdays: data?.weekdays?.length > 0 ? data?.weekdays : [],
                    annumonth: data.annuday ? data.annuday : "",
                    annuday: data.annumonth ? data.annumonth : "",
                    schedule: String(data.schedule),
                    username: data?.employeename,
                    frequency: String(data.frequency),
                    priority: String(data.priority),

                    orginalid: data.orginalid,

                    required: data?.required,
                    description: data?.description,
                    documentfiles: data?.documentfiles,
                    taskstatus: "Assigned",
                    created: new Date(),
                    taskdetails: "schedule",
                    shiftEndTime: shiftEndTime,
                    taskassigneddate: moment(new Date()).format("DD-MM-YYYY")
                }
            );
        }));

        if (ExtraNonScheduleTasks?.length > 0) {
            await Promise.all(ExtraNonScheduleTasks?.map((data) => {
                axios.post(
                    `${`http://localhost:7001/api/taskmaintenanceforusers/new`}`,
                    {
                        assetmaterial: String(data.assetmaterial),
                        username: data?.username,
                        frequency: "",
                        description: "",
                        duration: String(data.duration),
                        orginalid: data.orginalid,
                        taskdate: moment(data?.taskdate).format("YYYY-MM-DD"),
                        tasktime: String(data.tasktime),
                        breakupcount: String(data.breakupcount),
                        breakup: data?.breakup,
                        schedule: String(data.schedule),
                        required: data?.required,
                        priority: String(data.priority),
                        taskstatus: "Assigned",
                        created: new Date(),
                        taskdetails: data?.taskdetails,
                        shiftEndTime: shiftEndTime,
                        taskassigneddate: moment(new Date()).format("DD-MM-YYYY")
                    }
                );

            }))
        }


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        taskmaintenanceforuser,
    });
});


exports.getAllSortedTaskMaintenanceForUser = catchAsyncErrors(async (req, res, next) => {
    let taskmaintenanceforuser, sortedTasks;

    let username = req.body?.username;
    let todaysDate = req.body?.todaysDate;
    let PresentDate = req.body.date;

    try {
        taskmaintenanceforuser = await TaskMaintenanceForUser.find({ username: username }, {
            taskstatus: 1,
            taskassigneddate: 1,
            date: 1,
            frequency: 1, monthdate: 1, weekdays: 1, annumonth: 1, timetodo: 1, taskassign: 1,
            taskname: 1,
            taskdate: 1,
            completedbyuser: 1,
            username: 1,
            category: 1,
            assetmaterial: 1,
            subcategory: 1,
            subsubcategory: 1,
            schedule: 1,
            tasktime: 1,
            priority: 1,
            duration: 1,
            type: 1,
            taskdetails: 1,
            required: 1,
            breakup: 1,
            description: 1
        });
        const frequencyOrder = {
            Daily: 1,
            "Date wise": 2,
            "Day wise": 3,
            Weekly: 4,
            Monthly: 5,
            Annually: 6,
        };
        const priorityOrder = {
            High: 1,
            Medium: 2,
            Low: 3,
        };

        function compareTimeNonSchedule(a, b) {
            if (a?.tasktime === b?.tasktime) {
                return 0;
            } else if (a.tasktime === "") {
                return 1;
            } else if (b.tasktime === "") {
                return -1;
            } else {
                const timeA = a.tasktime.split(":");
                const timeB = b.tasktime.split(":");
                const hourDiff = parseInt(timeA[0]) - parseInt(timeB[0]);
                if (hourDiff !== 0) {
                    return hourDiff;
                } else {
                    return parseInt(timeA[1]) - parseInt(timeB[1]);
                }
            }
        }

        let anstaskOnProgress = taskmaintenanceforuser?.length > 0 ? taskmaintenanceforuser?.filter(data => data?.username === username && data.taskdetails !== "Manual" && data.taskstatus === "OnProgress") : []

        let anstaskUserPanelSchedule = taskmaintenanceforuser?.length > 0 ? taskmaintenanceforuser?.filter(data => data?.username === username && data.taskdetails !== "Manual" && data?.taskdetails === "schedule" && data.taskstatus === "Assigned") : []

        let anstaskUserPanelNonScheduleFixed = taskmaintenanceforuser?.length > 0 ? taskmaintenanceforuser?.filter(data => data?.username === username && data.taskdetails !== "Manual" && data?.taskdate === PresentDate && data?.frequency === "Time Based" && data.taskstatus === "Assigned").sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]) : [];
        let anstaskUserPanelNonScheduleAnyTime = taskmaintenanceforuser?.length > 0 ? taskmaintenanceforuser?.filter(data => data?.username === username && data.taskdetails !== "Manual" && data?.taskdate === PresentDate && data?.frequency !== "Time Based" && data.taskstatus === "Assigned") : [];
        anstaskUserPanelNonScheduleAnyTime?.sort((a, b) => compareTimeNonSchedule(a, b));

        //Assigned
        let finalSchedule = anstaskUserPanelSchedule?.length > 0 ? anstaskUserPanelSchedule?.sort((a, b) => frequencyOrder[a.frequency] - frequencyOrder[b.frequency]) : [];
        let onProgressTask = anstaskOnProgress?.length > 0 ? anstaskOnProgress : []

        let final = [...onProgressTask, ...finalSchedule, ...anstaskUserPanelNonScheduleFixed, ...anstaskUserPanelNonScheduleAnyTime]


        const uniqueObjects = [];
        const uniqueKeys = new Set();
        final?.forEach(obj => {
            const key = `${obj.assetmaterial}-${obj.username}-${obj.frequency}-${obj.taskassigneddate}`;
            if (!uniqueKeys.has(key)) {
                uniqueObjects.push(obj);
                uniqueKeys.add(key);

            }
            return uniqueObjects;
        });


        // Filter today's tasks
        const todayTasks = final?.filter(task => task?.taskassigneddate === todaysDate);

        // Filter tasks for other dates
        const otherTasks = final?.filter(task => task?.taskassigneddate !== todaysDate);

        // Sort tasks by both date and time
        otherTasks?.sort((a, b) => {
            // Convert date string to Date object
            const dateA = new Date(a.taskassigneddate);
            const dateB = new Date(b.taskassigneddate);

            // Compare dates first
            if (dateA < dateB) return -1;
            if (dateA > dateB) return 1;
            return dateA - dateB;
        });


        function compareTime(a, b) {
            if (a?.timetodo?.length === 0 && b?.timetodo?.length === 0) {
                return 0; // Both have no time specified
            } else if (a.timetodo.length === 0) {
                return 1; // a has no time, move it to the end
            } else if (b.timetodo.length === 0) {
                return -1; // b has no time, move it to the end
            } else {
                // Compare time based on hour, minute, and time type (AM/PM)
                const timeA = a.timetodo[0];
                const timeB = b.timetodo[0];

                // Convert hour to 24-hour format for comparison
                const hourA = parseInt(timeA.hour) + (timeA.timetype.toUpperCase() === 'PM' ? 12 : 0);
                const hourB = parseInt(timeB.hour) + (timeB.timetype.toUpperCase() === 'PM' ? 12 : 0);

                const hourDiff = hourA - hourB;

                if (hourDiff !== 0) {
                    return hourDiff;
                } else {
                    // If hours are the same, compare minutes
                    const minDiff = parseInt(timeA.min) - parseInt(timeB.min);
                    if (minDiff !== 0) {
                        return minDiff;
                    } else {
                        // If minutes are also the same, compare time type
                        if (timeA.timetype.toUpperCase() === 'AM' && timeB.timetype.toUpperCase() === 'PM') {
                            return -1;
                        } else if (timeA.timetype.toUpperCase() === 'PM' && timeB.timetype.toUpperCase() === 'AM') {
                            return 1;
                        } else {
                            return 0; // Both time types are the same
                        }
                    }
                }
            }
        }

        // Sort the uniqueElements array using the compareTime function
        todayTasks.sort(compareTime);
        sortedTasks = otherTasks?.concat(todayTasks);


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!sortedTasks) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        sortedTasks,
    });
});



// Create new TaskMaintenanceForUser=> /api/taskmaintenanceforuser/new
exports.addTaskMaintenanceForUser = catchAsyncErrors(async (req, res, next) => {

    const { assetmaterial, username, frequency, duration, taskassigneddate, taskdetails, taskdate, tasktime, timetodo } = req.body;

    const existingRecords = taskdetails === "schedule" ? await TaskMaintenanceForUser.find({
        assetmaterial,
        username,
        frequency,
        duration,
        taskassigneddate,
        taskdetails,
        timetodo

    }) : await TaskMaintenanceForUser.find({
        assetmaterial,
        username,
        taskdate,
        tasktime,
        taskdetails

    });

    if (existingRecords?.filter(data => data.taskdetails !== "Manual")?.length > 0) {
        return res.status(400).json({
            message: 'Task Already Scheduled!'
        });
    }

    let ataskforuser = await TaskMaintenanceForUser.create(req.body);

    return res.status(200).json({
        message: 'Successfully added!',
        data: ataskforuser
    });

});


// Create new TaskMaintenanceForUser=> /api/taskmaintenanceforuser/new
exports.addTaskMaintenanceForUserAutoGenerate = catchAsyncErrors(async (req, res, next) => {

    let { final, dateNow, username } = req.body

    let taskforuser;
    let uniqueElements, userStatus;
    const existingRecords = await TaskMaintenanceForUser.find({}, {
        assetmaterial: 1, frequency: 1, schedule: 1, username: 1, date: 1, shiftEndTime: 1,
        taskdetails: 1, taskstatus: 1, taskassigneddate: 1, timetodo: 1, taskdate: 1, taskassign: 1, assignId: 1,
        monthdate: 1, weekdays: 1, annumonth: 1, duration: 1, priority: 1
    }).lean();


    uniqueElements = final?.filter(obj1 => !existingRecords?.some(obj2 =>
        obj1.assetmaterial === obj2.assetmaterial
        && obj1.frequency === obj2.frequency
        && obj1.schedule === obj2.schedule
        && obj2.username === username
        && dateNow <= new Date(obj2.shiftEndTime) && obj2?.taskdetails === "schedule"
    ));


    return res.status(200).json({
        uniqueElements, userStatus,
    });

});
exports.getAllMaintenanceForUserAssignId = catchAsyncErrors(async (req, res, next) => {
    let taskforuser;
    let assignid = req.body.assignId

    try {
        const task = await TaskMaintenanceForUser.find({ assignId: assignid, taskassign: "Team" }, {});
        taskforuser = task?.filter(data => data?.username !== req.body.username)

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        taskforuser
    });
});
exports.getAllHierarchyMaintenanceReports = catchAsyncErrors(async (req, res, next) => {
    let taskforuser, result,
        resultArray,
        user,
        result1,
        ans1D,
        i = 1,
        result2,
        result3,
        result4,
        result5,
        result6,
        result7,
        result8,
        dataCheck,
        userFilter,
        excelmapdata,
        excelmapdataresperson,

        hierarchyFilter,
        excels,
        answerDef,
        hierarchyFinal,
        hierarchy,
        hierarchyDefault,
        hierarchyDefList,
        resultAccessFilter,
        branch,
        hierarchySecond,
        overallMyallList,
        hierarchyMap,
        resulted,
        resultedTeam,
        myallTotalNames;

    let uniqueElements, nonscheduledata;
    try {
        result = await TaskMaintenanceForUser.find({ taskassigneddate: req.body.date });


        // Accordig to sector and list filter process
        hierarchyFilter = await Hirerarchi.find({ level: req.body.sector });
        userFilter = hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

        hierarchyDefList = await Hirerarchi.find();
        user = await User.find({ companyname: req.body.username });
        const userFilt = user.length > 0 && user[0].designation;
        const desiGroup = await Designation.find();
        let HierarchyFilt = req.body.sector === "all" ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup) : hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
        const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
        const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
        const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;
        //Default Loading of List
        answerDef = hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

        hierarchyFinal = req.body.sector === "all" ? (answerDef.length > 0 ? [].concat(...answerDef) : []) : hierarchyFilter.length > 0 ? [].concat(...userFilter) : [];

        hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];
        //solo
        ans1D = req.body.sector === "all" ? (answerDef.length > 0 ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)) : []) : hierarchyFilter.length > 0 ? hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];
        result1 =
            ans1D.length > 0
                ? result
                    .map((item1) => {
                        const matchingItem2 = ans1D.find((item2) => item2.employeename.includes(item1.username));
                        if (matchingItem2) {
                            return item1;
                        }
                    })
                    .filter((item) => item !== undefined)
                : [];

        resulted = result1;

        //team
        let branches = [];
        hierarchySecond = await Hirerarchi.find();

        const subBranch =
            hierarchySecond.length > 0
                ? hierarchySecond
                    .filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name)))
                    .map((item) => item.employeename)
                    .flat()
                : "";

        const answerFilterExcel = hierarchySecond.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name))) : [];

        result2 =
            answerFilterExcel.length > 0
                ? result
                    .map((item1) => {
                        const matchingItem2 = answerFilterExcel.find((item2) => item2.employeename.includes(item1.username));
                        if (matchingItem2) {
                            // If a match is found, inject the control property into the corresponding item in an1
                            // return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
                            return item1
                        }
                    })
                    .filter((item) => item !== undefined)
                : [];
        branches.push(...subBranch);

        const ans =
            subBranch.length > 0
                ? hierarchySecond
                    .filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name)))
                    .map((item) => item.employeename)
                    .flat()
                : "";
        const answerFilterExcel2 = subBranch.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name))) : [];

        result3 =
            answerFilterExcel2.length > 0
                ? result
                    .map((item1) => {
                        const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.username));
                        if (matchingItem2) {
                            // If a match is found, inject the control property into the corresponding item in an1
                            return item1
                        }
                    })
                    .filter((item) => item !== undefined)
                : [];
        branches.push(...ans);

        const loop3 =
            ans.length > 0
                ? hierarchySecond
                    .filter((item) => item.supervisorchoose.some((name) => ans.includes(name)))
                    .map((item) => item.employeename)
                    .flat()
                : "";

        const answerFilterExcel3 = ans.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => ans.includes(name))) : [];

        result4 =
            answerFilterExcel3.length > 0
                ? result
                    .map((item1) => {
                        const matchingItem2 = answerFilterExcel3?.find((item2) => item2.employeename.includes(item1.username));
                        if (matchingItem2) {
                            // If a match is found, inject the control property into the corresponding item in an1
                            return item1
                        }
                    })
                    .filter((item) => item !== undefined)
                : [];
        branches.push(...loop3);

        const loop4 =
            loop3.length > 0
                ? hierarchySecond
                    .filter((item) => item.supervisorchoose.some((name) => loop3.includes(name)))
                    .map((item) => item.employeename)
                    .flat()
                : [];
        const answerFilterExcel4 = loop3.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop3.includes(name))) : [];
        result5 =
            answerFilterExcel4.length > 0
                ? result
                    .map((item1) => {
                        const matchingItem2 = answerFilterExcel4?.find((item2) => item2.employeename.includes(item1.username));
                        if (matchingItem2) {
                            // If a match is found, inject the control property into the corresponding item in an1
                            return item1
                        }
                    })
                    .filter((item) => item !== undefined)
                : [];
        branches.push(...loop4);

        const loop5 =
            loop4.length > 0
                ? hierarchySecond
                    .filter((item) => item.supervisorchoose.some((name) => loop4.includes(name)))
                    .map((item) => item.employeename)
                    .flat()
                : "";
        const answerFilterExcel5 = loop4.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop4.includes(name))) : [];
        result6 =
            answerFilterExcel5.length > 0
                ? result
                    .map((item1) => {
                        const matchingItem2 = answerFilterExcel5?.find((item2) => item2.employeename.includes(item1.username));
                        if (matchingItem2) {
                            // If a match is found, inject the control property into the corresponding item in an1
                            return item1
                        }
                    })
                    .filter((item) => item !== undefined)
                : [];
        branches.push(...loop5);

        resultedTeam = [...result2, ...result3, ...result4, ...result5, ...result6];
        //overall Teams List
        myallTotalNames = [...hierarchyMap, ...branches];
        overallMyallList = [...resulted, ...resultedTeam];
        resultAccessFilter = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : overallMyallList;




    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        resultAccessFilter
    });
});



// get Signle TaskMaintenanceForUser => /api/taskmaintenanceforuser/:id
exports.getSingleTaskMaintenanceForUser = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let staskmaintenanceforuser = await TaskMaintenanceForUser.findById(id);

    if (!staskmaintenanceforuser) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        staskmaintenanceforuser,
    });
});

// update TaskMaintenanceForUser by id => /api/taskmaintenanceforuser/:id
exports.updateTaskMaintenanceForUser = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let utaskmaintenanceforuser = await TaskMaintenanceForUser.findByIdAndUpdate(id, req.body);
    if (!utaskmaintenanceforuser) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete TaskMaintenanceForUser by id => /api/taskmaintenanceforuser/:id
exports.deleteTaskMaintenanceForUser = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dtaskschedulegrouping = await TaskMaintenanceForUser.findByIdAndRemove(id);

    if (!dtaskschedulegrouping) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});

// exports.getAllSortedTaskMaintenanceForUserHome = catchAsyncErrors(async (req, res, next) => {
//     let taskmaintenanceforuser, taskmaintenanceforuserstatus, filteruser, result, maintenancenonschedule;


//     try {

//         const dayvalue = req.body.selectedFilter; // Change to "Today" for today's values

//         function getDatesForDayValue(dayvalue) {
//             const today = new Date();
//             const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
//             const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//             if (dayvalue === "Today") {
//                 // For "Today"
//                 const day = [daysOfWeek[dayOfWeek]];
//                 const date = [today.getDate()];
//                 const fulldate = [today.toISOString().split("T")[0]]; // "YYYY-MM-DD"
//                 return { day, date, fulldate };
//             } else if (dayvalue === "Tomorrow") {
//                 // For "Tomorrow"
//                 const tomorrow = new Date(today);
//                 tomorrow.setDate(today.getDate() + 1);
//                 const day = [daysOfWeek[tomorrow.getDay()]];
//                 const date = [tomorrow.getDate()];
//                 const fulldate = [tomorrow.toISOString().split("T")[0]]; // "YYYY-MM-DD"
//                 return { day, date, fulldate };
//             } else if (dayvalue === "This Week") {
//                 // For "This Week" (Monday to Sunday)
//                 const startOfWeek = new Date(today);
//                 startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Adjust to Monday

//                 let day = [];
//                 let date = [];
//                 let fulldate = [];

//                 for (let i = 0; i < 7; i++) {
//                     const currentDate = new Date(startOfWeek);
//                     currentDate.setDate(startOfWeek.getDate() + i);

//                     day.push(daysOfWeek[currentDate.getDay()]);
//                     date.push(currentDate.getDate());
//                     fulldate.push(currentDate.toISOString().split("T")[0]); // "YYYY-MM-DD"
//                 }
//                 const daysOfWeek2 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",];

//                 let fulldatewithdays = fulldate.map((d, ind) => ({

//                     day: daysOfWeek2[ind],
//                     date: d
//                 }))
//                 return { day, date, fulldate, fulldatewithdays };
//             }
//             else if (dayvalue === "This Month") {
//                 // For "This Month"

//                 const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // October 1st
//                 const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // October 31st

//                 const startOfWeek = new Date(startOfMonth);
//                 startOfWeek.setDate(startOfMonth.getDate() + 1); // Adjust to the Monday of the current week
//                 const endOfWeek = new Date(endOfMonth);
//                 endOfWeek.setDate(endOfMonth.getDate() + 1);
//                 let day = [];
//                 let date = [];
//                 let fulldate = [];

//                 // Loop from the start of the week (which could be in the previous month) until the end of the current month
//                 let currentDate = new Date(startOfWeek);
//                 let endOfMonthDate = new Date(endOfWeek);


//                 while (currentDate <= endOfMonthDate) {
//                     day.push(daysOfWeek[currentDate.getDay()]); // Day of the week (e.g., Monday, Tuesday)
//                     date.push(currentDate.getDate()); // Date of the day (e.g., 30, 1, 2, etc.)
//                     fulldate.push(currentDate.toISOString().split("T")[0]); // "YYYY-MM-DD"

//                     // Move to the next day
//                     currentDate.setDate(currentDate.getDate() + 1);
//                 }

//                 const daysOfWeek2 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

//                 // Generate fulldatewithdays combining the date with the day of the week
//                 let fulldatewithdays = fulldate.map((d, ind) => ({
//                     day: daysOfWeek2[new Date(d).getDay()],
//                     date: d
//                 }));

//                 return { day, date, fulldate, fulldatewithdays };
//             }
//         }

//         // Example usage:
//         const { day, date, fulldate, fulldatewithdays } = getDatesForDayValue(dayvalue);

//         taskmaintenanceforuser = await Maintenance.find({}, { employeenameto: 1, assetmaterial: 1, weekdays: 1, monthdate: 1, annumonth: 1, annuday: 1, frequency: 1, schedule: 1, timetodo: 1, });

//         maintenancenonschedule = await TaskMaintenanceNonScheduleGrouping.find({}, { assetmaterial: 1, schedule: 1, date: 1, type: 1, employeenames: 1 });

//         let combinedData = [...taskmaintenanceforuser, ...maintenancenonschedule]


//         filteruser = combinedData.map(d => {
//             const monthdateAsNumber = parseInt(d.monthdate, 10);
//             const isToday = (dayvalue === "Today" && ((d.type && fulldate.includes(d.date)) || d.frequency === "Daily"

//                 || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))
//                 || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
//                 || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
//                 || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
//             ));


//             const isTomorrow = (dayvalue === "Tomorrow" && ((d.type && fulldate.includes(d.date))
//                 || d.frequency === "Daily"
//                 || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

//                 || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
//                 || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
//                 || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))

//             ));


//             const isThisWeek = (dayvalue === "This Week" && ((d.type && fulldate.includes(d.date))
//                 || d.frequency === "Daily"
//                 || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
//                 || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

//                 || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
//                 || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))

//             ));


//             const isThisMonth = (dayvalue === "This Month" && ((d.type && fulldate.includes(d.date))
//                 || d.frequency === "Daily"
//                 || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

//                 || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
//                 || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
//                 || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
//             ));
//             // Add logging for debugging

//             if (isToday) {
//                 return { ...d._doc, date: fulldate[0] };
//             } else if (isTomorrow) {
//                 return { ...d._doc, date: fulldate[0] };
//             } else if (isThisWeek) {
//                 return {
//                     ...d._doc,
//                     date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
//                         : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
//                             : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
//                                 : "")
//                 };
//             } else if (isThisMonth) {
//                 return {
//                     ...d._doc,
//                     date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
//                         : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
//                             : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
//                                 : "")
//                 };
//             } else {
//                 return null;
//             }
//         }).filter(Boolean);  // Filter out null values

//         let result1 = [];

//         filteruser.forEach(d => {
//             d.type ?
//                 d.employeenames.forEach(employee => {
//                     result1.push({
//                         ...d,
//                         employeenameto: employee
//                     });
//                 })
//                 :
//                 d.employeenameto.forEach(employee => {
//                     result1.push({
//                         ...d,
//                         employeenameto: employee
//                     });
//                 });
//         });

//         let findtaskstatus = result1.map(d => ({ id: d._id, username: d.employeenameto }))


//         let query = {};

//         if (findtaskstatus.length > 0) {
//             query.$or = findtaskstatus.map(d => ({

//                 orginalid: String(d.id),
//                 username: d.username
//             }));
//         }
//         taskmaintenanceforuserstatus = await TaskMaintenanceForUser.find(query, {
//             orginalid: 1, username: 1, taskstatus: 1
//         });


//         result = result1.map(item => {

//             let findstatus = taskmaintenanceforuserstatus.find(d =>
//                 d.orginalid == String(item._id) && d.username == item.employeenameto)?.taskstatus

//             return {
//                 ...item,
//                 status: findstatus ? findstatus : "Pending"
//             }
//         })

//     } catch (err) {
//         return next(new ErrorHandler("Records not found!", 404));
//     }
//     if (!result) {
//         return next(new ErrorHandler("Data not found!", 404));
//     }
//     return res.status(200).json({
//         // count: products.length,
//         result,
//     });
// });


exports.getAllSortedTaskMaintenanceForUserHome = catchAsyncErrors(async (req, res, next) => {
    let taskmaintenanceforuser, taskmaintenanceforuserstatus, filteruser, result, maintenancenonschedule;


    try {

        const dayvalue = req.body.selectedFilter; // Change to "Today" for today's values



        function getDatesForDayValue(dayvalue) {
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            if (dayvalue === "Last Month") {
                // Last Month
                const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
                let day = [];
                let date = [];
                let fulldate = [];
                let currentDate = new Date(startOfLastMonth);
                while (currentDate <= endOfLastMonth) {
                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                const fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek[new Date(d).getDay()],
                    date: d
                }));
                return { day, date, fulldate, fulldatewithdays };
            }
            else if (dayvalue === "Last Week") {
                // Last Week (Monday to Sunday)
                const lastWeekStart = new Date(today);
                lastWeekStart.setDate(today.getDate() - dayOfWeek - 6); // Monday of last week
                let day = [];
                let date = [];
                let fulldate = [];
                for (let i = 0; i < 7; i++) {
                    const currentDate = new Date(lastWeekStart);
                    currentDate.setDate(lastWeekStart.getDate() + i);
                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]);
                }
                const fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek[new Date(d).getDay()],
                    date: d
                }));
                return { day, date, fulldate, fulldatewithdays };
            }
            else if (dayvalue === "Yesterday") {
                // Yesterday
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const day = [daysOfWeek[yesterday.getDay()]];
                const date = [yesterday.getDate()];
                const fulldate = [yesterday.toISOString().split("T")[0]]; // "YYYY-MM-DD"
                return { day, date, fulldate };
            }
            else if (dayvalue === "Today") {
                // Today
                const day = [daysOfWeek[dayOfWeek]];
                const date = [today.getDate()];
                const fulldate = [today.toISOString().split("T")[0]]; // "YYYY-MM-DD"
                return { day, date, fulldate };
            } else if (dayvalue === "Tomorrow") {
                // Tomorrow
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                const day = [daysOfWeek[tomorrow.getDay()]];
                const date = [tomorrow.getDate()];
                const fulldate = [tomorrow.toISOString().split("T")[0]]; // "YYYY-MM-DD"
                return { day, date, fulldate };
            } else if (dayvalue === "This Week") {
                // This Week (Monday to Sunday)
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Adjust to Monday
                let day = [];
                let date = [];
                let fulldate = [];
                for (let i = 0; i < 7; i++) {
                    const currentDate = new Date(startOfWeek);
                    currentDate.setDate(startOfWeek.getDate() + i);
                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]);
                }
                const fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek[new Date(d).getDay()],
                    date: d
                }));
                return { day, date, fulldate, fulldatewithdays };
            } else if (dayvalue === "This Month") {
                // This Month
                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                let day = [];
                let date = [];
                let fulldate = [];
                let currentDate = new Date(startOfMonth);
                while (currentDate <= endOfMonth) {
                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]);
                    currentDate.setDate(currentDate.getDate() + 1);
                }
                const fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek[new Date(d).getDay()],
                    date: d
                }));
                return { day, date, fulldate, fulldatewithdays };
            }

        }


        // Example usage:
        const { day, date, fulldate, fulldatewithdays } = getDatesForDayValue(dayvalue);

        taskmaintenanceforuser = await Maintenance.find({}, { employeenameto: 1, assetmaterial: 1, weekdays: 1, monthdate: 1, annumonth: 1, annuday: 1, frequency: 1, schedule: 1, timetodo: 1, });

        maintenancenonschedule = await TaskMaintenanceNonScheduleGrouping.find({}, { assetmaterial: 1, schedule: 1, date: 1, type: 1, employeenames: 1 });

        let combinedData = [...taskmaintenanceforuser, ...maintenancenonschedule]

        filteruser = combinedData.map(d => {
            const monthdateAsNumber = parseInt(d.monthdate, 10);
            const isToday = (dayvalue === "Today" && ((d.type && fulldate.includes(d.date)) || d.frequency === "Daily"

                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))
                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));


            const isTomorrow = (dayvalue === "Tomorrow" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))

            ));


            const isThisWeek = (dayvalue === "This Week" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))

            ));


            const isThisMonth = (dayvalue === "This Month" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));
            // Add logging for debugging

            if (isToday) {
                return { ...d._doc, date: fulldate[0] };
            } else if (isTomorrow) {
                return { ...d._doc, date: fulldate[0] };
            } else if (isThisWeek) {
                return {
                    ...d._doc,
                    date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
                        : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
                            : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
                                : "")
                };
            } else if (isThisMonth) {
                return {
                    ...d._doc,
                    date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
                        : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
                            : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
                                : "")
                };
            } else {
                return null;
            }
        }).filter(Boolean);  // Filter out null values

        let result1 = [];

        filteruser.forEach(d => {
            d.type ?
                d.employeenames.forEach(employee => {
                    result1.push({
                        ...d,
                        employeenameto: employee
                    });
                })
                :
                d.employeenameto.forEach(employee => {
                    result1.push({
                        ...d,
                        employeenameto: employee
                    });
                });
        });

        let findtaskstatus = result1.map(d => ({ id: d._id, username: d.employeenameto }))


        let query = {};

        if (findtaskstatus.length > 0) {
            query.$or = findtaskstatus.map(d => ({

                orginalid: String(d.id),
                username: d.username
            }));
        }
        taskmaintenanceforuserstatus = await TaskMaintenanceForUser.find(query, {
            orginalid: 1, username: 1, taskstatus: 1
        });


        result = result1.map(item => {

            let findstatus = taskmaintenanceforuserstatus.find(d =>
                d.orginalid == String(item._id) && d.username == item.employeenameto)?.taskstatus

            return {
                ...item,
                status: findstatus ? findstatus : "Pending"
            }
        })

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!result) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        result,
    });
});


exports.getAllSortedTaskMaintenanceForUserHomeList = catchAsyncErrors(async (req, res, next) => {
    let taskmaintenanceforuser, taskmaintenanceforuserstatus, filteruser, result, maintenancenonschedule;


    try {

        const dayvalue = req.body.selectedFilter;
        function getDatesForDayValue(dayvalue) {
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
            const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

            if (dayvalue === "Today") {
                // For "Today"
                const day = [daysOfWeek[dayOfWeek]];
                const date = [today.getDate()];
                const fulldate = [today.toISOString().split("T")[0]]; // "YYYY-MM-DD"
                return { day, date, fulldate };
            } else if (dayvalue === "Tomorrow") {
                // For "Tomorrow"
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                const day = [daysOfWeek[tomorrow.getDay()]];
                const date = [tomorrow.getDate()];
                const fulldate = [tomorrow.toISOString().split("T")[0]]; // "YYYY-MM-DD"
                return { day, date, fulldate };
            }
            else if (dayvalue === "Yesterday") {
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                const day = [daysOfWeek[yesterday.getDay()]];
                const date = [yesterday.getDate()];
                const fulldate = [yesterday.toISOString().split("T")[0]]; // "YYYY-MM-DD"
                return { day, date, fulldate };
            }
            else if (dayvalue === "This Week") {
                // For "This Week" (Monday to Sunday)
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - dayOfWeek + 1); // Adjust to Monday

                let day = [];
                let date = [];
                let fulldate = [];

                for (let i = 0; i < 7; i++) {
                    const currentDate = new Date(startOfWeek);
                    currentDate.setDate(startOfWeek.getDate() + i);

                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]); // "YYYY-MM-DD"
                }
                const daysOfWeek2 = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday",];

                let fulldatewithdays = fulldate.map((d, ind) => ({

                    day: daysOfWeek2[ind],
                    date: d
                }))
                return { day, date, fulldate, fulldatewithdays };
            }
            else if (dayvalue === "Last Week") {
                const startOfLastWeek = new Date(today);
                startOfLastWeek.setDate(today.getDate() - dayOfWeek - 6); // Previous Monday
                const endOfLastWeek = new Date(startOfLastWeek);
                endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Previous Sunday

                let day = [];
                let date = [];
                let fulldate = [];

                for (let i = 0; i < 7; i++) {
                    const currentDate = new Date(startOfLastWeek);
                    currentDate.setDate(startOfLastWeek.getDate() + i);

                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]);
                }

                let fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek[ind],
                    date: d
                }));

                return { day, date, fulldate, fulldatewithdays };
            }
            else if (dayvalue === "This Month") {
                // For "This Month"

                const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // October 1st
                const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); // October 31st

                const startOfWeek = new Date(startOfMonth);
                startOfWeek.setDate(startOfMonth.getDate() + 1); // Adjust to the Monday of the current week
                const endOfWeek = new Date(endOfMonth);
                endOfWeek.setDate(endOfMonth.getDate() + 1);
                let day = [];
                let date = [];
                let fulldate = [];

                // Loop from the start of the week (which could be in the previous month) until the end of the current month
                let currentDate = new Date(startOfWeek);
                let endOfMonthDate = new Date(endOfWeek);


                while (currentDate <= endOfMonthDate) {
                    day.push(daysOfWeek[currentDate.getDay()]); // Day of the week (e.g., Monday, Tuesday)
                    date.push(currentDate.getDate()); // Date of the day (e.g., 30, 1, 2, etc.)
                    fulldate.push(currentDate.toISOString().split("T")[0]); // "YYYY-MM-DD"

                    // Move to the next day
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                const daysOfWeek2 = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

                // Generate fulldatewithdays combining the date with the day of the week
                let fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek2[new Date(d).getDay()],
                    date: d
                }));
                return { day, date, fulldate, fulldatewithdays };
            }
            else if (dayvalue === "Last Month") {
                const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1); // 1st of last month
                const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of last month

                let day = [];
                let date = [];
                let fulldate = [];

                let currentDate = new Date(startOfLastMonth);
                while (currentDate <= endOfLastMonth) {
                    day.push(daysOfWeek[currentDate.getDay()]);
                    date.push(currentDate.getDate());
                    fulldate.push(currentDate.toISOString().split("T")[0]);
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                let fulldatewithdays = fulldate.map((d, ind) => ({
                    day: daysOfWeek[new Date(d).getDay()],
                    date: d
                }));

                return { day, date, fulldate, fulldatewithdays };
            }
        }

        // Example usage:
        const { day, date, fulldate, fulldatewithdays } = getDatesForDayValue(dayvalue);
        taskmaintenanceforuser = await Maintenance.find({}, { employeenameto: 1, assetmaterial: 1, weekdays: 1, monthdate: 1, annumonth: 1, annuday: 1, frequency: 1, schedule: 1, timetodo: 1, });

        maintenancenonschedule = await TaskMaintenanceNonScheduleGrouping.find({}, { assetmaterial: 1, schedule: 1, date: 1, type: 1, employeenames: 1 });

        let combinedData = [...taskmaintenanceforuser, ...maintenancenonschedule]

        filteruser = combinedData.map(d => {
            const monthdateAsNumber = parseInt(d.monthdate, 10);
            const isToday = (dayvalue === "Today" && ((d.type && fulldate.includes(d.date)) || d.frequency === "Daily"

                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))
                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));


            const isTomorrow = (dayvalue === "Tomorrow" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))

            ));


            const isThisWeek = (dayvalue === "This Week" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))

            ));


            const isThisMonth = (dayvalue === "This Month" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))

                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));

            const isYesterday = (dayvalue === "Yesterday" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))
                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));

            const isLastWeek = (dayvalue === "Last Week" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))
                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));

            const isLastMonth = (dayvalue === "Last Month" && ((d.type && fulldate.includes(d.date))
                || d.frequency === "Daily"
                || (d.frequency === "Date Wise" && date.includes(monthdateAsNumber))
                || (d.frequency === "Day Wise" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Weekly" && day.map(item => (d.weekdays).includes(item)))
                || (d.frequency === "Monthly" && date.includes(monthdateAsNumber))
            ));
            // Add logging for debugging

            if (isToday) {
                return { ...d._doc, date: fulldate[0] };
            }
            else if (isTomorrow) {
                return { ...d._doc, date: fulldate[0] };
            }
            else if (isYesterday) {
                return { ...d._doc, date: fulldate[0] };
            }
            else if (isThisWeek) {
                return {
                    ...d._doc,
                    date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
                        : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
                            : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
                                : "")
                };
            }
            else if (isThisMonth) {
                return {
                    ...d._doc,
                    date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
                        : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
                            : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
                                : "")
                };
            }

            else if (isLastWeek) {
                return {
                    ...d._doc,
                    date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
                        : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
                            : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
                                : "")
                };
            }
            else if (isLastMonth) {
                return {
                    ...d._doc,
                    date: d.type ? d.date : (d.frequency === "Daily" ? fulldate[0]
                        : d.frequency === "Date Wise" || d.frequency === "Monthly" ? `${fulldate[0].split("-")[0]}-${fulldate[0].split("-")[1]}-${d.monthdate}`
                            : (d.frequency === "Day Wise" || d.frequency === "Weekly") ? fulldatewithdays.find(t => d.weekdays.includes(t.day)).date
                                : "")
                };
            }



            else {
                return null;
            }
        }).filter(Boolean);  // Filter out null values

        let result1 = [];

        filteruser.forEach(d => {
            d.type ?
                d.employeenames.forEach(employee => {
                    result1.push({
                        ...d,
                        employeenameto: employee
                    });
                })
                :
                d.employeenameto.forEach(employee => {
                    result1.push({
                        ...d,
                        employeenameto: employee
                    });
                });
        });
        let findtaskstatus = result1.map(d => ({ id: d._id, username: d.employeenameto }))


        let query = {};

        if (findtaskstatus.length > 0) {
            query.$or = findtaskstatus.map(d => ({

                orginalid: String(d.id),
                username: d.username
            }));
        }
        taskmaintenanceforuserstatus = await TaskMaintenanceForUser.find(query, {
            orginalid: 1, username: 1, taskstatus: 1
        });


        result = result1.map(item => {

            let findstatus = taskmaintenanceforuserstatus.find(d =>
                d.orginalid == String(item._id) && d.username == item.employeenameto)?.taskstatus

            return {
                ...item,
                status: findstatus ? findstatus : "Pending"
            }
        })

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        // count: products.length,
        result,
    });
});


exports.getAllTaskMaintenanceUserOverallReports = catchAsyncErrors(async (req, res, next) => {
    let result, totalProjects, overall;
    const { company, branch, unit, team, fromdate, todate, department, username, taskstatus, page, pageSize, allFilters, logicOperator, searchQuery } = req.body;
    const skip = (page - 1) * pageSize; // Calculate the number of items to skip
    let query = {
        taskstatus: { $in: taskstatus }
    };
    let overallQuery = {
        taskstatus: { $in: taskstatus }
    };
    let queryUser = {};
    if (company.length > 0) {
        queryUser.company = { $in: company };
    }
    if (branch.length > 0) {
        queryUser.branch = { $in: branch };
    }
    if (unit.length > 0) {
        queryUser.unit = { $in: unit };
    }
    if (team.length > 0) {
        queryUser.team = { $in: team };
    }
    if (department.length > 0) {
        queryUser.department = { $in: department };
    }
    if (username?.length > 0) {
        queryUser.companyname = { $in: username };
    }
    const usernamesfilter = await User.find(queryUser, { companyname: 1 }).lean();
    const UserNamesFromUser = usernamesfilter?.length > 0 ? usernamesfilter?.map(data => data?.companyname) : [];
    if (UserNamesFromUser?.length > 0) {
        query.username = { $in: UserNamesFromUser };
        overallQuery.username = { $in: UserNamesFromUser };


    }
    if (fromdate && todate) {
        query = {
            ...query,
            $expr: {
                $and: [
                    {
                        $gte: [
                            {
                                $dateFromString: {
                                    dateString: "$taskassigneddate",
                                    format: "%d-%m-%Y"
                                }
                            },
                            new Date(fromdate)
                        ]
                    },
                    {
                        $lte: [
                            {
                                $dateFromString: {
                                    dateString: "$taskassigneddate",
                                    format: "%d-%m-%Y"
                                }
                            },
                            new Date(todate)
                        ]
                    }
                ]
            }
        };
        overallQuery = {
            ...overallQuery,
            $expr: {
                $and: [
                    {
                        $gte: [
                            {
                                $dateFromString: {
                                    dateString: "$taskassigneddate",
                                    format: "%d-%m-%Y"
                                }
                            },
                            new Date(fromdate)
                        ]
                    },
                    {
                        $lte: [
                            {
                                $dateFromString: {
                                    dateString: "$taskassigneddate",
                                    format: "%d-%m-%Y"
                                }
                            },
                            new Date(todate)
                        ]
                    }
                ]
            }
        };

    }


    console.log(query['$expr']['$and'])

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
                { taskstatus: regex },
                { taskassigneddate: regex },
                { username: regex },
                { taskdetails: regex },
                { assetmaterial: regex },
                { frequency: regex },
                { completedbyuser: regex },
                { userdescription: regex },
                { duration: regex },
                { breakup: regex },
                { required: { $in: regex } },
                { schedule: regex },
            ],
        }));

        query = {
            ...query,
            $and: [
                ...orConditions,
            ]
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
    try {

        // First, count the total number of projects matching the frequency criteria
        totalProjects = UserNamesFromUser?.length > 0 ? await TaskMaintenanceForUser.countDocuments(query) : 0;
        overall = UserNamesFromUser?.length > 0 ? await TaskMaintenanceForUser.find(overallQuery,
            {

                frequency: 1,
                schedule: 1,
                username: 1,
                date: 1,
                shiftEndTime: 1,
                taskdetails: 1,
                timetodo: 1,
                description: 1,
                taskstatus: 1,
                taskassigneddate: 1, timetodo: 1,
                taskdate: 1,
                taskassign: 1,
                breakup: 1,
                assignId: 1,
                monthdate: 1,
                weekdays: 1,
                annumonth: 1,
                required: 1,
                duration: 1,
                priority: 1, assetmaterial: 1
            }).lean() : [];
        // Then, find the projects with pagination
        result = UserNamesFromUser?.length > 0 ? await TaskMaintenanceForUser.find(query,
            {

                frequency: 1,
                schedule: 1,
                username: 1,
                date: 1,
                shiftEndTime: 1,
                taskdetails: 1,
                timetodo: 1,
                description: 1,
                taskstatus: 1,
                taskassigneddate: 1, timetodo: 1,
                taskdate: 1,
                taskassign: 1,
                breakup: 1,
                assignId: 1,
                monthdate: 1,
                weekdays: 1,
                annumonth: 1,
                required: 1,
                duration: 1,
                priority: 1, assetmaterial: 1
            }).lean()
            .skip(skip)
            .limit(pageSize) : [];

        console.log(overall.length, result.length, "dsfl")

        return res.status(200).json({
            totalProjects,
            currentPage: page,
            result,
            overall,
            totalPages: Math.ceil(totalProjects / pageSize),
        });
    } catch (err) {
        console.log(err, 'errr')
        return next(new ErrorHandler("Records not found!", 404));
    }
});

