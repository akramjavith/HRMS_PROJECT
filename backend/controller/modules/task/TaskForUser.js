const TaskForUser = require("../../../model/modules/task/taskforuser");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Team = require("../../../model/modules/teams");
const User = require("../../../model/login/auth");
const Hirerarchi = require("../../../model/modules/setup/hierarchy");
const Designationgroup = require("../../../model/modules/designationgroup");
const Designation = require("../../../model/modules/designation");
const axios = require("axios");
const moment = require("moment");
// get All TaskForUser => /api/taskschedulegroupings


exports.getAllTaskForUser = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  try {
    taskforuser = await TaskForUser.find({ category: 1, subcategory: 1, frequency: 1, schedule: 1, username: 1, date: 1, shiftEndTime: 1, taskdetails: 1, taskstatus: 1, taskassigneddate: 1, taskdate: 1, taskassign: 1, assignId: 1, monthdate: 1, weekdays: 1, annumonth: 1, duration: 1, priority: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});


exports.getAllNonscheduleTaskLogReassign = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  try {
    taskforuser = await TaskForUser.find({
      category: req.body.category,
      subcategory: req.body.subcategory,
      username: { $in: req.body.username },
      taskdate: req.body.taskdate,
      tasktime: req.body.tasktime,
      taskdetails: "nonschedule"
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});
exports.getAllNonscheduleTaskLogForUser = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  try {
    taskforuser = await TaskForUser.find({ orginalid: req.body.originalid });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});
exports.getINDIVIDUALAllTaskForUser = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  try {
    taskforuser = await TaskForUser.find({ state: "running", username: req.body.username }, {});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});
exports.getCompletedAllTaskForUser = catchAsyncErrors(async (req, res, next) => {
  let taskforuser, result;
  let totalProjects;
  let frequency = ["Completed", "Finished By Others", "Not Applicable to Me"];
  let { username, page, pageSize } = req.body;
  const skip = (page - 1) * pageSize; // Calculate the number of items to skip
  const limit = pageSize; // The number of items to take
  try {
    result = await TaskForUser.find({ taskstatus: ["Completed", "Finished By Others", "Not Applicable to Me"], username: username }, {}).skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));


    totalProjects = await TaskForUser.find({ taskstatus: ["Completed", "Finished By Others", "Not Applicable to Me"], username: req.body.username }, {}).countDocuments()

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    totalProjects: totalProjects,
    currentPage: page,
    result,
    totalPages: Math.ceil(totalProjects / pageSize),
  });
});
exports.getOnprogressAllTaskForUser = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  try {
    taskforuser = await TaskForUser.find({ taskstatus: ["Paused", "Pending", "Postponed"], username: req.body.username }, {});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});
exports.getManualAllTaskForUser = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  try {
    taskforuser = await TaskForUser.find({ taskdetails: "Manual", username: req.body.username }, {});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});
exports.getAllManualAllTaskForUser = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  try {
    taskforuser = await TaskForUser.find({ taskdetails: "Manual" }, {});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});
exports.getAllTaskForUserOnprogress = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  let username = req.body.username;
  let anstaskUserPanel;
  try {
    taskforuser = await TaskForUser.find({ username: username, taskstatus: ["Paused", "Pending"] });
    anstaskUserPanel = taskforuser?.length > 0 ? taskforuser?.filter(data => data?.username
      === username && ["Paused", "Pending"]?.includes(data?.taskstatus) && data.taskdetails !== "Manual") : []
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    anstaskUserPanel,
  });
});
exports.getAllTaskForUserManual = catchAsyncErrors(async (req, res, next) => {
  let taskforuser, answer;
  let username = req.body.username;
  let role = req.body.role?.map(data => data?.toUpperCase());
  let anstaskUserPanel;
  try {
    const query = {
      taskdetails: "Manual",
      ...(role?.some(data => ["MANAGER", "SUPERADMIN", "SUPER ADMIN"].includes(data)) ? {} : { username })
    };
    taskforuser = await TaskForUser.find(query);
    answer = await TaskForUser.find({ taskdetails: "Manual" });

    anstaskUserPanel = answer
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!answer) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser, anstaskUserPanel
  });
});
exports.getAllTaskForUserCompleted = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  let username = req.body.username;
  let anstaskUserPanel;
  try {
    anstaskUserPanel = await TaskForUser.find({
      username: username,
      taskdetails: { $ne: "Manual" },
      taskstatus: { $in: ["Completed", "Finished By Others", "Not Applicable to Me"] }
    });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!anstaskUserPanel) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    anstaskUserPanel,
  });
});

exports.getCompletedAllTaskForUserOverall = catchAsyncErrors(async (req, res, next) => {
  let result;

  let { username } = req.body;
  try {


    result = await TaskForUser.find({ taskstatus: ["Completed", "Finished By Others", "Not Applicable to Me"], username: username }, {});

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    result,
  });
});

exports.getAllTaskUserReportsOverall = catchAsyncErrors(async (req, res, next) => {
  let result;

  const { frequency } = req.body;
  try {


    result = await TaskForUser.find({
      frequency: { $in: frequency },
    })

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    result,
  });
});

exports.getAllTaskUserReports = catchAsyncErrors(async (req, res, next) => {
  let result, totalProjects, overall;
  const { frequency, page, pageSize } = req.body;
  const skip = (page - 1) * pageSize; // Calculate the number of items to skip
  console.log(frequency, 'frequency')
  try {
    // First, count the total number of projects matching the frequency criteria
    totalProjects = await TaskForUser.countDocuments({
      frequency: { $in: frequency }
    });
    overall = await TaskForUser.find({
      frequency: { $in: frequency }
    });

    // Then, find the projects with pagination
    result = await TaskForUser.find({
      frequency: { $in: frequency }
    })
      .skip(skip)
      .limit(pageSize);

    if (!result || result.length === 0) {
      return next(new ErrorHandler("Data not found!", 404));
    }

    return res.status(200).json({
      totalProjects,
      currentPage: page,
      result,
      overall,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

exports.getAllTaskForUserAutoGenerate = catchAsyncErrors(async (req, res, next) => {
  const { updatedAns, dateNow, username } = req.body;
  let uniqueElements, nonscheduledata;

  try {
    // Query to fetch matching tasks for uniqueElements
    const existingTasks = await TaskForUser.find({
      username: username,
      taskdetails: "schedule",
      shiftEndTime: { $gte: dateNow }
    });

    // Filter updatedAns based on the existingTasks query
    uniqueElements = updatedAns?.filter(obj1 =>
      !existingTasks.some(obj2 =>
        obj1.category === obj2.category &&
        obj1.subcategory === obj2.subcategory &&
        obj1.frequency === obj2.frequency &&
        obj1.schedule === obj2.schedule
      )
    );

    // Query to fetch non-scheduled tasks
    nonscheduledata = await TaskForUser.find({
      username: username,
      taskdetails: "nonschedule",
      taskdate: moment(new Date()).format("YYYY-MM-DD")
    });

    if (!uniqueElements && !nonscheduledata) {
      return next(new ErrorHandler("Records not found", 404));
    }

    return res.status(200).json({
      uniqueElements,
      nonscheduledata,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found", 404));
  }
});

exports.getAllTaskHierarchyReports = catchAsyncErrors(
  async (req, res, next) => {
    let taskforuser,
      result,
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
      reportingusers,
      myallTotalNames;

    let uniqueElements, nonscheduledata;
    try {
      const { listpageaccessmode } = req.body;
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
            reportingto: req.body.username,
          },
          {
            empcode: 1,
            companyname: 1,
          }
        ).lean();
        const companyNames = reportingusers.map((user) => user.companyname);
        result = await TaskForUser.find({
          taskassigneddate: req.body.date,
          username: { $in: companyNames }, // Use companyNames array here
        });
      } else {
        result = await TaskForUser.find({ taskassigneddate: req.body.date });
      }

      // Accordig to sector and list filter process
      hierarchyFilter = await Hirerarchi.find({ level: req.body.sector });
      userFilter = hierarchyFilter
        .filter((data) => data.supervisorchoose.includes(req.body.username))
        .map((data) => data.employeename);

      hierarchyDefList = await Hirerarchi.find();
      user = await User.find({ companyname: req.body.username });
      const userFilt = user.length > 0 && user[0].designation;
      const desiGroup = await Designation.find();
      let HierarchyFilt =
        req.body.sector === "all"
          ? hierarchyDefList
            .filter((data) =>
              data.supervisorchoose.includes(req.body.username)
            )
            .map((data) => data.designationgroup)
          : hierarchyFilter
            .filter((data) =>
              data.supervisorchoose.includes(req.body.username)
            )
            .map((data) => data.designationgroup);
      const DesifFilter = desiGroup.filter((data) =>
        HierarchyFilt.includes(data.group)
      );
      const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
      const SameDesigUser = HierarchyFilt.includes("All")
        ? true
        : userFilt === desigName;
      //Default Loading of List
      answerDef = hierarchyDefList
        .filter((data) => data.supervisorchoose.includes(req.body.username))
        .map((data) => data.employeename);

      hierarchyFinal =
        req.body.sector === "all"
          ? answerDef.length > 0
            ? [].concat(...answerDef)
            : []
          : hierarchyFilter.length > 0
            ? [].concat(...userFilter)
            : [];

      hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];
      //solo
      ans1D =
        req.body.sector === "all"
          ? answerDef.length > 0
            ? hierarchyDefList.filter((data) =>
              data.supervisorchoose.includes(req.body.username)
            )
            : []
          : hierarchyFilter.length > 0
            ? hierarchyFilter.filter((data) =>
              data.supervisorchoose.includes(req.body.username)
            )
            : [];

      result1 =
        ans1D.length > 0
          ? result
            .map((item1) => {
              const matchingItem2 = ans1D.find((item2) =>
                item2.employeename.includes(item1.username)
              );
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
            .filter((item) =>
              item.supervisorchoose.some((name) =>
                hierarchyMap.includes(name)
              )
            )
            .map((item) => item.employeename)
            .flat()
          : "";

      const answerFilterExcel =
        hierarchySecond.length > 0
          ? hierarchySecond.filter((item) =>
            item.supervisorchoose.some((name) => hierarchyMap.includes(name))
          )
          : [];

      result2 =
        answerFilterExcel.length > 0
          ? result
            .map((item1) => {
              const matchingItem2 = answerFilterExcel.find((item2) =>
                item2.employeename.includes(item1.username)
              );
              if (matchingItem2) {
                // If a match is found, inject the control property into the corresponding item in an1
                // return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
                return item1;
              }
            })
            .filter((item) => item !== undefined)
          : [];
      branches.push(...subBranch);

      const ans =
        subBranch.length > 0
          ? hierarchySecond
            .filter((item) =>
              item.supervisorchoose.some((name) => subBranch.includes(name))
            )
            .map((item) => item.employeename)
            .flat()
          : "";
      const answerFilterExcel2 =
        subBranch.length > 0
          ? hierarchySecond.filter((item) =>
            item.supervisorchoose.some((name) => subBranch.includes(name))
          )
          : [];

      result3 =
        answerFilterExcel2.length > 0
          ? result
            .map((item1) => {
              const matchingItem2 = answerFilterExcel2.find((item2) =>
                item2.employeename.includes(item1.username)
              );
              if (matchingItem2) {
                // If a match is found, inject the control property into the corresponding item in an1
                return item1;
              }
            })
            .filter((item) => item !== undefined)
          : [];
      branches.push(...ans);

      const loop3 =
        ans.length > 0
          ? hierarchySecond
            .filter((item) =>
              item.supervisorchoose.some((name) => ans.includes(name))
            )
            .map((item) => item.employeename)
            .flat()
          : "";

      const answerFilterExcel3 =
        ans.length > 0
          ? hierarchySecond.filter((item) =>
            item.supervisorchoose.some((name) => ans.includes(name))
          )
          : [];

      result4 =
        answerFilterExcel3.length > 0
          ? result
            .map((item1) => {
              const matchingItem2 = answerFilterExcel3?.find((item2) =>
                item2.employeename.includes(item1.username)
              );
              if (matchingItem2) {
                // If a match is found, inject the control property into the corresponding item in an1
                return item1;
              }
            })
            .filter((item) => item !== undefined)
          : [];
      branches.push(...loop3);

      const loop4 =
        loop3.length > 0
          ? hierarchySecond
            .filter((item) =>
              item.supervisorchoose.some((name) => loop3.includes(name))
            )
            .map((item) => item.employeename)
            .flat()
          : [];
      const answerFilterExcel4 =
        loop3.length > 0
          ? hierarchySecond.filter((item) =>
            item.supervisorchoose.some((name) => loop3.includes(name))
          )
          : [];
      result5 =
        answerFilterExcel4.length > 0
          ? result
            .map((item1) => {
              const matchingItem2 = answerFilterExcel4?.find((item2) =>
                item2.employeename.includes(item1.username)
              );
              if (matchingItem2) {
                // If a match is found, inject the control property into the corresponding item in an1
                return item1;
              }
            })
            .filter((item) => item !== undefined)
          : [];
      branches.push(...loop4);

      const loop5 =
        loop4.length > 0
          ? hierarchySecond
            .filter((item) =>
              item.supervisorchoose.some((name) => loop4.includes(name))
            )
            .map((item) => item.employeename)
            .flat()
          : "";
      const answerFilterExcel5 =
        loop4.length > 0
          ? hierarchySecond.filter((item) =>
            item.supervisorchoose.some((name) => loop4.includes(name))
          )
          : [];
      result6 =
        answerFilterExcel5.length > 0
          ? result
            .map((item1) => {
              const matchingItem2 = answerFilterExcel5?.find((item2) =>
                item2.employeename.includes(item1.username)
              );
              if (matchingItem2) {
                // If a match is found, inject the control property into the corresponding item in an1
                return item1;
              }
            })
            .filter((item) => item !== undefined)
          : [];
      branches.push(...loop5);

      resultedTeam = [
        ...result2,
        ...result3,
        ...result4,
        ...result5,
        ...result6,
      ];
      //overall Teams List
      myallTotalNames = [...hierarchyMap, ...branches];
      overallMyallList = [...resulted, ...resultedTeam];

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
              ? overallMyallList
              : result;
    } catch (err) {
      return next(new ErrorHandler("Records not found", 404));
    }
    return res.status(200).json({
      resultAccessFilter,
    });
  }
);


exports.getAllTaskForUserAssignId = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  let assignid = req.body.assignId
  let orginalid = req.body.orginalid
  try {
    const task = await TaskForUser.find({ assignId: assignid, orginalid: orginalid, taskassign: "Team" }, {});
    taskforuser = task?.filter(data => data?.username !== req.body.username)

  } catch (err) {
    return next(new ErrorHandler("Records not found", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser
  });
});

exports.getAllSortedTaskForUser = catchAsyncErrors(async (req, res, next) => {
  let taskforuser, sortedTasks;
  let username = req.body?.username;
  let todaysDate = req.body?.todaysDate;
  let PresentDate = req.body.date;
  try {
    taskforuser = await TaskForUser.find({ username: username });

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

    let anstaskOnProgress = taskforuser?.length > 0 ? taskforuser?.filter(data => data?.username === username && data.taskdetails !== "Manual" && data.taskstatus === "OnProgress") : []
    let anstaskUserPanelSchedule = taskforuser?.length > 0 ? taskforuser?.filter(data => data?.username === username && data.taskdetails !== "Manual" && data?.taskdetails === "schedule" && data.taskstatus === "Assigned") : []
    let anstaskUserPanelNonScheduleFixed = taskforuser?.length > 0 ? taskforuser?.filter(data => data?.username === username && data.taskdetails !== "Manual" && data?.taskdetails === "nonschedule" && data?.taskdate === PresentDate && data?.frequency === "Fixed" && data.taskstatus === "Assigned").sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]) : [];
    let anstaskUserPanelNonScheduleAnyTime = taskforuser?.length > 0 ? taskforuser?.filter(data => data?.username === username && data.taskdetails !== "Manual" && data?.taskdetails === "nonschedule" && data?.taskdate === PresentDate && data?.frequency !== "Fixed" && data.taskstatus === "Assigned") : [];
    anstaskUserPanelNonScheduleAnyTime?.sort((a, b) => compareTimeNonSchedule(a, b));
    //Assigned
    let finalSchedule = anstaskUserPanelSchedule?.length > 0 ? anstaskUserPanelSchedule?.sort((a, b) => frequencyOrder[a.frequency] - frequencyOrder[b.frequency]) : [];
    let onProgressTask = anstaskOnProgress?.length > 0 ? anstaskOnProgress : []

    let final = [...onProgressTask, ...finalSchedule, ...anstaskUserPanelNonScheduleFixed, ...anstaskUserPanelNonScheduleAnyTime]


    const uniqueObjects = [];
    const uniqueKeys = new Set();
    final?.forEach(obj => {
      const key = `${obj.category}-${obj.subcategory}-${obj.username}-${obj.frequency}-${obj.duration}-${obj.taskassigneddate}`;
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



// Create new TaskForUser=> /api/taskforuser/new
exports.addTaskForUser = catchAsyncErrors(async (req, res, next) => {

  const { category, subcategory, username, frequency, duration, taskassigneddate, taskdetails, taskdate, tasktime, timetodo } = req.body;

  const existingRecords = taskdetails === "schedule" ? await TaskForUser.find({
    category,
    subcategory,
    username,
    frequency,
    duration,
    taskassigneddate,
    taskdetails,
    timetodo

  }) : await TaskForUser.find({
    category,
    subcategory,
    username,
    taskdate,
    tasktime,
    taskdetails

  });

  if (existingRecords?.filter(data => data.taskdetails !== "Manual")?.length > 0) {
    return res.status(400).json({
      message: 'This Data is Already Exists!'
    });
  }

  let ataskforuser = await TaskForUser.create(req.body);

  return res.status(200).json({
    message: 'Successfully added!',
    data: ataskforuser
  });

});

// get Signle TaskForUser => /api/taskforuser/:id
exports.getSingleTaskForUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let staskforuser = await TaskForUser.findById(id);

  if (!staskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    staskforuser,
  });
});

// update TaskForUser by id => /api/taskforuser/:id
exports.updateTaskForUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let utaskforuser = await TaskForUser.findByIdAndUpdate(id, req.body);
  if (!utaskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete TaskForUser by id => /api/taskforuser/:id
exports.deleteTaskForUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dtaskschedulegrouping = await TaskForUser.findByIdAndRemove(id);

  if (!dtaskschedulegrouping) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAllTaskForUserUsername = catchAsyncErrors(async (req, res, next) => {
  let taskforuser, task;
  let username = req.body.username;
  let state = req.body.state;
  let id = req.body.id
  try {
    task = await TaskForUser.find({ username: username, state: state });
    taskforuser = task?.find(data => data?._id?.toString() !== id)
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});



//to get pending task count
exports.getPendingTaskCount = catchAsyncErrors(async (req, res, next) => {
  let task;
  let username = req.query.username;
  try {
    task = await TaskForUser.countDocuments({
      username: username,
      // taskstatus: { $ne: "Completed" },
      taskstatus: {
        $nin: ["Completed", "Not Applicable to Me", "Finished By Others"],
      },
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
    count: task,
  });
});



// exports.getAllTaskForAssingnedhome = catchAsyncErrors(async (req, res, next) => {

//   try {
//   let  taskforuserAssigned = await TaskForUser.countDocuments({ taskstatus: "Assigned" }, {});
//   let  taskforuserPending = await TaskForUser.countDocuments({ taskstatus: "Pending" }, {});
//   let  taskforuserFinished = await TaskForUser.countDocuments({ taskstatus: "Finished By Others" }, {});
//   let  taskforuserApplicable = await TaskForUser.countDocuments({ taskstatus: "Not Applicable to Me" }, {});
//   let  taskforuserPostponed = await TaskForUser.countDocuments({ taskstatus: "Postponed" }, {});
//   let  taskforuserPaused = await TaskForUser.countDocuments({ taskstatus: "Paused" }, {});
//   let taskforuserCompleted = await TaskForUser.countDocuments({ taskstatus: "Completed" }, {});


//     console.log(taskforuser, "assinged")

//   } catch (err) {
//     return next(new ErrorHandler("Records not found!", 404));
//   }

//   return res.status(200).json({
//     // count: products.length,
//     taskforuserCompleted,taskforuserPaused,taskforuserPostponed,taskforuserApplicable,taskforuserFinished,taskforuserPending,taskforuserAssigned
//   });
// });


exports.getAllTaskForAssingnedhome = catchAsyncErrors(async (req, res, next) => {
  let fromdate, todate;
  const today = new Date();
  const selectedFilter = req.body.selectedfilter;

  // Utility function to format date as 'YYYY-MM-DD'
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Set date ranges based on the selected filter
  switch (selectedFilter) {


    case "Last Month":
      fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
      todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
      break;
    case "Last Week":
      const startOfLastWeek = new Date(today);
      startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
      const endOfLastWeek = new Date(startOfLastWeek);
      endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
      fromdate = formatDate(startOfLastWeek);
      todate = formatDate(endOfLastWeek);
      break;
    case "Yesterday":
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      fromdate = todate = formatDate(yesterday);
      break;

    case "Today":
      fromdate = todate = formatDate(today);
      break;
    case "Tomorrow":
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      fromdate = todate = formatDate(tomorrow);
      break;
    case "This Week":
      const startOfThisWeek = new Date(today);
      startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
      const endOfThisWeek = new Date(startOfThisWeek);
      endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
      fromdate = formatDate(startOfThisWeek);
      todate = formatDate(endOfThisWeek);
      break;
    case "This Month":
      fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
      todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));


      break;

    default:
      fromdate = "";
  }




  let taskforuser;

  try {
    const statuses = ["Assigned", "Pending", "Finished By Others", "Not Applicable to Me", "Postponed", "Paused", "Completed"];

    let query = {

    }

    // console.log(query, "query")

    const [
      taskforuserAssigned,
      taskforuserPending,
      taskforuserFinished,
      taskforuserApplicable,
      taskforuserPostponed,
      taskforuserPaused,
      taskforuserCompleted
    ] = await Promise.all(
      statuses.map(status => TaskForUser.countDocuments({
        ...(fromdate && todate
          ? { taskassigneddate: { $gte: fromdate, $lte: todate } }
          : fromdate
            ? { taskassigneddate: { $eq: fromdate } }
            : {}),
        taskstatus: status
      }))
    );

    taskforuser = {
      taskforuserAssigned,
      taskforuserPending,
      taskforuserFinished,
      taskforuserApplicable,
      taskforuserPostponed,
      taskforuserPaused,
      taskforuserCompleted
    }

    // console.log(taskforuser, "status")

    return res.status(200).json({
      taskforuser
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});



exports.getAllTaskForPendinghome = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  try {
    taskforuser = await TaskForUser.countDocuments({ taskstatus: "Pending" }, {});
    console.log(taskforuser, "pending")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});


exports.getAllTaskForFinishedhome = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  try {
    taskforuser = await TaskForUser.countDocuments({ taskstatus: "Finished By Others" }, {});
    console.log(taskforuser, "Finished By Others")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});

exports.getAllTaskForNotApplicablehome = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  try {
    taskforuser = await TaskForUser.countDocuments({ taskstatus: "Not Applicable to Me" }, {});
    console.log(taskforuser, "Not Applicable to Me")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});

exports.getAllTaskForCompletedhome = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  try {
    taskforuser = await TaskForUser.countDocuments({ taskstatus: "Completed" }, {});
    console.log(taskforuser, "Completed")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});

exports.getAllTaskForPausedhome = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  try {
    taskforuser = await TaskForUser.countDocuments({ taskstatus: "Paused" }, {});
    console.log(taskforuser, "Paused")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});

exports.getAllTaskForPostponedhome = catchAsyncErrors(async (req, res, next) => {
  let taskforuser;
  try {
    taskforuser = await TaskForUser.countDocuments({ taskstatus: "Postponed" }, {});
    console.log(taskforuser, "Postponed")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    taskforuser,
  });
});


