const Task = require("../../../model/modules/project/task");
const Role = require("../../../model/modules/role/role");
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
// const dateFormat = require('dateformat');
// import dateFormat from dateformat;

//get All Task =>/api/Tasks
exports.getAllTask = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  try {
    tasks = await Task.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
  });
});

//get All Role =>/api/roles
exports.getAllFilterTask = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  let taskfilter;
  try {
    tasks = await Task.find(
      {},
      {
        projectname: 1,
        subprojectname: 1,
        module: 1,
        assignedbyprofileimg: 1,
        submodule: 1,
        mainpage: 1,
        subpageone: 1,
        subpagetwo: 1,
        subpagethree: 1,
        subpagefour: 1,
        subpagefive: 1,
        taskname: 1,
        taskid: 1,
        calculatedtime: 1,
        assignedby: 1,
        assignedmode: 1,
        assigneddate: 1,
        assignedtodeveloper: 1,
        description: 1,
        assignedtotester: 1,
        descriptiontester: 1,
        taskstatus: 1,
      }
    );

    taskfilter = tasks.filter((data, index) => {
      if (req.body.userrole == "Teammember") {
        return req.body.userid == data.assignedbyprofileimg;
      } else if (req.body.userrole == "all") {
        return data;
      }
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!taskfilter) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    taskfilter,
  });
});

//get All Role =>/api/roles
exports.getParticularUsersTasks = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  let taskfilter;
  try {
    tasks = await Task.find(
      {},
      {
        projectname: 1,
        subprojectname: 1,
        module: 1,
        assignedbyprofileimg: 1,
        submodule: 1,
        mainpage: 1,
        subpageone: 1,
        subpagetwo: 1,
        subpagethree: 1,
        subpagefour: 1,
        subpagefive: 1,
        taskname: 1,
        taskid: 1,
        calculatedtime: 1,
        assignedby: 1,
        assignedmode: 1,
        assigneddate: 1,
        assignedtodeveloper: 1,
        description: 1,
        assignedtotester: 1,
        descriptiontester: 1,
        taskstatus: 1,
      }
    );

    taskfilter = tasks.filter((data, index) => {
      if (req.body.userrole == "Teammember") {
        return req.body.userid == data.assignedbyprofileimg;
      } else if (req.body.userrole == "all") {
        return data;
      }
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!taskfilter) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    taskfilter,
  });
});

// get overall delete functionality
exports.getProjectToTask = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  try {
    tasks = await Task.find();

    let query = {
      projectname: req.body.checkprojecttotask,
    };
    tasks = await Task.find(query, {
      taskname: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
  });
});

exports.getSubProjectToTask = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  try {
    tasks = await Task.find();

    let query = {
      subprojectname: req.body.checksubprojecttotask,
    };
    tasks = await Task.find(query, {
      taskname: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
  });
});

exports.getModuleToTask = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  try {
    tasks = await Task.find();

    let query = {
      module: req.body.checkmodulettotask,
    };
    tasks = await Task.find(query, {
      taskname: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
  });
});

exports.getSubModuleToTask = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  try {
    tasks = await Task.find();

    let query = {
      submodule: req.body.checksubmodulettotask,
    };
    tasks = await Task.find(query, {
      taskname: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
  });
});

exports.getPriorityToTask = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  try {
    // tasks = await Task.find()

    const query = {
      assignedtodeveloper: {
        $elemMatch: {
          prioritystatus: req.body.checkpriorityttotask,
        },
      },
    };
    tasks = await Task.find(query, {
      taskname: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
  });
});

exports.getAllUserToTask = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  try {
    tasks = await Task.find();

    let query = {
      $or: [
        {
          assignedtodeveloper: {
            $elemMatch: {
              label: req.body.checkusertotask,
            },
          },
        },
        {
          assignedtotester: req.body.checkusertotask,
        },
        {
          assignedby: req.body.checkusertotask,
        },
      ],
    };
    tasks = await Task.find(query, {
      taskname: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
  });
});

exports.getAllFilterTaskcreatepage = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  let taskfilter;
  try {
    tasks = await Task.find(
      {},
      {
        projectname: 1,
        subprojectname: 1,
        module: 1,
        assignedbyprofileimg: 1,
        submodule: 1,
        mainpage: 1,
        subpageone: 1,
        subpagetwo: 1,
        subpagethree: 1,
        subpagefour: 1,
        subpagefive: 1,
        taskname: 1,
        taskid: 1,
        calculatedtime: 1,
        assignedby: 1,
        assignedmode: 1,
        assigneddate: 1,
        assignedtodeveloper: 1,
        description: 1,
        assignedtotester: 1,
        descriptiontester: 1,
        taskstatus: 1,
      }
    );

    taskfilter = tasks.filter((data, index) => {
      if (req.body.userrole == "Teammember") {
        return req.body.userid == data.assignedby;
      } else if (req.body.userrole == "all") {
        return data;
      }
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!taskfilter) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    taskfilter,
  });
});

// get All Tasks => /api/taskslimit
exports.getallTasktime = catchAsyncErrors(async (req, res, next) => {
  let task;

  try {
    task = await Task.find(
      {},
      {
        projectname: 1,
        subprojectname: 1,
        module: 1,
        submodule: 1,
        mainpage: 1,
        subpageone: 1,
        subpagetwo: 1,
        subpagethree: 1,
        subpagefour: 1,
        subpagefive: 1,
        taskname: 1,
        taskid: 1,
        calculatedtime: 1,
        assignedby: 1,
        assignedmode: 1,
        assigneddate: 1,
        assignedtodeveloper: 1,
        assignedtotester: 1,
        usecasetester: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!task) {
    return next(new ErrorHandler("Task not found", 400));
  }

  return res.status(200).json({ count: task.length, task });
});

// get All Tasks => /api/taskslimit
exports.getDevtaskcheckpoints = catchAsyncErrors(async (req, res, next) => {
  let task;

  try {
    task = await Task.find(
      {},
      {
        projectname: 1,
        subprojectname: 1,
        module: 1,
        submodule: 1,
        mainpage: 1,
        subpageone: 1,
        subpagetwo: 1,
        subpagethree: 1,
        subpagefour: 1,
        subpagefive: 1,
        taskname: 1,
        taskid: 1,
        calculatedtime: 1,
        priority: 1,
        assignedby: 1,
        assignedmode: 1,
        assigneddate: 1,
        assignedtodeveloper: 1,
        description: 1,
        assignedtotester: 1,
        descriptiontester: 1,
        usecasetester: 1,
        status: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!task) {
    return next(new ErrorHandler("Task not found", 400));
  }

  return res.status(200).json({ count: task.length, task });
});

//getboard task=> /api/taskboardlist
exports.getBoardtask = catchAsyncErrors(async (req, res, next) => {
  const todayDate = new Date().toISOString().split("T")[0]; // Get today's date in 'YYYY-MM-DD' format

  const data = await Task.find();
  let newData = [];
  try {
    newData = data
      .filter((item) => item.assigneddate == todayDate)
      .map((item) => {
        const incompleteTasks = item.assignedtodeveloper.filter((task) => task.status === "incomplete");
        return { id: item.id, assignedtodeveloper: incompleteTasks, assigneddate: item.assigneddate, checkpointsdev: item.checkpointsdev, assignedtotester: item.assignedtotester, taskstatus: item.taskstatus };
      });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("An error occurred", 500));
  }
  return res.status(200).json({
    newData,
  });
});

//TASKBOARD 4 STATUS

// get All Tasks => /api/tasksboard

exports.getTaskBoarddevincomplete = catchAsyncErrors(async (req, res, next) => {
  let taskboardincomplete, high, medium, low;
  let result2;
  let highPriority;
  let lowPriority;
  let mediumPriority;

  try {
    taskboardincomplete = await Task.find(
      {
        assignedtodeveloper: {
          $elemMatch: {
            label: req.body.userlogin,
            status: { $eq: "incomplete" },
          },
        },
      },
      {
        assigneddate: 1,
        assignedby: 1,
        assignedtotester: 1,
        taskstatus: 1,
        taskid: 1,
        assignedmode: 1,
        assignedbyprofileimg: 1,
        checkpointsdev: 1,
        taskname: 1,
        assignedtodeveloper: 1,
        _id: 1,
      }
    );
    priorityTasks = taskboardincomplete.map((d, index) => {
      const { checkpointsdev } = d;
      const priorityStatusCounts = {};

      // Count prioritystatus values within assignedtodeveloper
      checkpointsdev.forEach((dev) => {
        const priorityStatus = dev.priority === "high2" || dev.priority === "high3" ? "high1" : dev.priority === "medium1" || dev.priority === "medium2" || dev.priority === "medium3" ? "medium" : dev.priority === "low1" || dev.priority === "low2" || dev.priority === "low3" ? "low" : "high";
        if (priorityStatusCounts[priorityStatus]) {
          priorityStatusCounts[priorityStatus]++;
        } else {
          priorityStatusCounts[priorityStatus] = 1;
        }
      });
      let maxPriority = null;
      let maxCount = 0;
      let maxValue = -1;

      const desiredOrder = ["high1", "high", "medium", "low"];

      // Sort the keys based on the desired order
      const sortedKeys = Object.keys(priorityStatusCounts).sort((a, b) => desiredOrder.indexOf(a) - desiredOrder.indexOf(b));

      // Create a new object with sorted keys and values
      const sortedData = {};
      sortedKeys.forEach((key) => {
        sortedData[key] = priorityStatusCounts[key];
      });
      // Check if all counts are the same
      const counts = Object.values(sortedData);
      const areAllCountsSame = counts.every((count) => count === counts[0]);
      const array = Object.values(sortedData).filter((count) => count);
      const maxNumber = Math.max(...array);
      const Maxoccurrences = array.reduce((count, num) => count + (num === maxNumber ? 1 : 0), 0);
      const minNumber = Math.max(...Object.values(array));
      const Minoccurrences = array.reduce((count, num) => count + (num === minNumber ? 1 : 0), 0);
      const anyTwo = Object.values(sortedData).filter((count) => count === maxCount).length >= 2;
      // Determine the maximum occurring status
      let maxStatus = "";
      let duplicateValue;
      if ("high1" in sortedData) {
        maxStatus = "high";
      } else if (areAllCountsSame & (counts.length > 2)) {
        maxStatus = "medium";
      } else if (areAllCountsSame && "medium" in sortedData && "high" in sortedData) {
        maxStatus = "high";
      } else if (areAllCountsSame && "medium" in sortedData && "low" in sortedData) {
        maxStatus = "medium";
      } else if (areAllCountsSame && "low" in sortedData && "high" in sortedData) {
        maxStatus = "high";
      } else if (!areAllCountsSame && (Maxoccurrences > 1 || Minoccurrences > 1)) {
        if (counts.includes(maxNumber) && counts.filter((count) => count === maxNumber).length >= 2) {
          const duplicateValue = counts.find((count) => counts.filter((c) => c === count).length >= 2);
          maxStatus = Object.keys(sortedData).find((status) => sortedData[status] === duplicateValue);
          maxValue = duplicateValue;
        } else {
          // Find the status with the highest value
          for (const status in sortedData) {
            if (sortedData[status] > maxValue) {
              maxStatus = status;
            }
          }
        }
      } else {
        let maxCount = -1;
        for (const status in sortedData) {
          if (sortedData[status] > maxCount) {
            maxCount = sortedData[status];
            maxStatus = status;
          }
        }
      }

      return { d, maxStatus };
    });

    //high Priority staus for developer incomplete
    high = priorityTasks.filter((item) => item.maxStatus === "high");
    medium = priorityTasks.filter((item) => item.maxStatus === "medium");
    low = priorityTasks.filter((item) => item.maxStatus === "low");

    return res.status(200).json({ taskboardincomplete, priorityTasks, high, medium, low });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("An error occurred while fetching task board", 500));
  }
});

//assignedto developer complete...
exports.getTaskBoarddevcomplete = catchAsyncErrors(async (req, res, next) => {
  let taskboarddevelopertestercomplete;
  let result1;
  try {
    taskboarddevelopertestercomplete = await Task.find(
      {
        assignedtodeveloper: {
          $elemMatch: {
            label: req.body.userlogin,
            status: { $eq: "complete" },
          },
        },
      },
      {
        assigneddate: 1,
        assignedby: 1,
        subprojectname: 1,
        assignedtotester: 1,
        taskstatus: 1,
        taskid: 1,
        assignedmode: 1,
        assignedbyprofileimg: 1,
        taskname: 1,
        assignedtodeveloper: 1,
        _id: 1,
      }
    );

    return res.status(200).json({ taskboarddevelopertestercomplete });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("An error occurred while fetching task board", 500));
  }
});

//assignedtotester incomplete
exports.getTaskBoardtesterincomplete = catchAsyncErrors(async (req, res, next) => {
  let taskboardtesterincomplete;
  let result4;
  try {
    taskboardtesterincomplete = await Task.find(
      {
        assignedtodeveloper: {
          $not: {
            $elemMatch: {
              status: { $ne: "complete" },
            },
          },
        },
        taskstatus: "incomplete",
        assignedtotester: req.body.userlogin,
      },
      {
        assigneddate: 1,
        assignedby: 1,
        subprojectname: 1,
        assignedtotester: 1,
        taskstatus: 1,
        taskid: 1,
        assignedmode: 1,
        assignedbyprofileimg: 1,
        taskname: 1,
        assignedtodeveloper: 1,
        _id: 1,
      }
    ).sort({ assigneddate: -1 });

    return res.status(200).json({ taskboardtesterincomplete });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("An error occurred while fetching task board", 500));
  }
});

//assignedtotester complate
exports.getTaskBoardtestercomplete = catchAsyncErrors(async (req, res, next) => {
  let taskboarddevelopertestercomplete;
  let result1;
  try {
    taskboarddevelopertestercomplete = await Task.find(
      {
        assignedtodeveloper: {
          $not: {
            $elemMatch: {
              status: { $ne: "complete" },
            },
          },
        },
        taskstatus: "complete",
        assignedtotester: req.body.userlogin,
      },
      {
        assigneddate: 1,
        assignedby: 1,
        subprojectname: 1,
        assignedtotester: 1,
        taskstatus: 1,
        taskid: 1,
        assignedmode: 1,
        assignedbyprofileimg: 1,
        taskname: 1,
        assignedtodeveloper: 1,
        _id: 1,
      }
    );

    return res.status(200).json({ taskboarddevelopertestercomplete });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("An error occurred while fetching task board", 500));
  }
});

//assignedto developer complete...
exports.getTaskBoarddevcompletemanageraccess = catchAsyncErrors(async (req, res, next) => {
  let taskboarddevelopertestercomplete;
  let result1;
  try {
    taskboarddevelopertestercomplete = await Task.find(
      {
        assignedtodeveloper: {
          $elemMatch: {
            // label: req.body.userlogin,
            status: { $eq: "complete" },
          },
        },
      },
      {
        assigneddate: 1,
        assignedby: 1,
        subprojectname: 1,
        assignedtotester: 1,
        taskstatus: 1,
        taskid: 1,
        assignedmode: 1,
        assignedbyprofileimg: 1,
        taskname: 1,
        assignedtodeveloper: {
          $filter: {
            input: "$assignedtodeveloper",
            as: "developer",
            cond: { $eq: ["$$developer.status", "complete"] },
          },
        },
        _id: 1,
      }
    ).sort({ assigneddate: -1 });

    return res.status(200).json({ taskboarddevelopertestercomplete });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("An error occurred while fetching task board", 500));
  }
});

//assignedtotester incomplete
exports.getTaskBoardtesterincompletemanageraccess = catchAsyncErrors(async (req, res, next) => {
  let taskboardtesterincomplete;
  let result4;
  try {
    taskboardtesterincomplete = await Task.find(
      {
        assignedtodeveloper: {
          $not: {
            $elemMatch: {
              status: { $ne: "complete" },
            },
          },
        },
        taskstatus: "incomplete",
        // assignedtotester: req.body.userlogin
      },
      {
        assigneddate: 1,
        assignedby: 1,
        subprojectname: 1,
        assignedtotester: 1,
        taskstatus: 1,
        taskid: 1,
        assignedmode: 1,
        assignedbyprofileimg: 1,
        taskname: 1,
        assignedtodeveloper: 1,
        _id: 1,
      }
    ).sort({ assigneddate: -1 });

    return res.status(200).json({ taskboardtesterincomplete });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("An error occurred while fetching task board", 500));
  }
});

//assignedtotester complate
exports.getTaskBoardtestercompletemanageraccess = catchAsyncErrors(async (req, res, next) => {
  let taskboarddevelopertestercomplete;
  let result1;
  try {
    taskboarddevelopertestercomplete = await Task.find(
      {
        assignedtodeveloper: {
          $not: {
            $elemMatch: {
              status: { $ne: "complete" },
            },
          },
        },
        taskstatus: "complete",
        // assignedtotester: req.body.userlogin
      },
      {
        assigneddate: 1,
        assignedby: 1,
        subprojectname: 1,
        assignedtotester: 1,
        taskstatus: 1,
        taskid: 1,
        assignedmode: 1,
        assignedbyprofileimg: 1,
        taskname: 1,
        assignedtodeveloper: 1,
        _id: 1,
      }
    ).sort({ assigneddate: -1 });

    return res.status(200).json({ taskboarddevelopertestercomplete });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("An error occurred while fetching task board", 500));
  }
});

//assignedto developer complete...
exports.getTaskBoardcompleteallmanageraccess = catchAsyncErrors(async (req, res, next) => {
  let taskboardcompleteall;
  let result1;
  try {
    taskboardcompleteall = await Task.find(
      {
        assignedtodeveloper: {
          $elemMatch: {
            status: { $eq: "complete" },
          },
        },
        taskstatus: "complete",
      },
      {
        assigneddate: 1,
        assignedby: 1,
        subprojectname: 1,
        assignedtotester: 1,
        taskstatus: "complete",
        taskid: 1,
        assignedmode: 1,
        assignedbyprofileimg: 1,
        taskname: 1,
        assignedtodeveloper: {
          $filter: {
            input: "$assignedtodeveloper",
            as: "developer",
            cond: { $eq: ["$$developer.status", "complete"] },
          },
        },
        _id: 1,
      }
    ).sort({ assigneddate: -1 });

    return res.status(200).json({ taskboardcompleteall });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("An error occurred while fetching task board", 500));
  }
});

// TASK report PAGE
//get All Task =>/api/Tasks => assigneddev incomplete task status purpose

exports.taskReportstyle = catchAsyncErrors(async (req, res, next) => {
  let taskss;
  let query;
  let totalcount = 0; // Initialize totalcount to 0
  const startdate = req.body.startdate;
  let enddate = req.body.enddate;

  try {
    if (req.body.loginreportacess === "Teammember") {
      query = {
        assignedtodeveloper: {
          $elemMatch: {
            label: req.body.loginname,
          },
        },
        assigneddate: { $gte: startdate, $lte: enddate },
      };
    } else {
      query = {
        assigneddate: { $gte: startdate, $lte: enddate },
      };
    }

    taskss = await Task.find(query, {
      assignedby: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      assignedmode: 1,
      assignedbyprofileimg: 1,
      taskname: 1,
      assignedtodeveloper: {
        $filter: {
          input: "$assignedtodeveloper",
          as: "developer",
          cond: { $eq: ["$$developer.status", "incomplete"] },
        },
      },
      _id: 1,
    });

    // Calculate totalcount based on the tasks and access
    if (req.body.loginreportacess === "Teammember") {
      // Count only when access is team member and label matches
      totalcount = taskss.reduce((count, task) => {
        return count + (task.assignedtodeveloper.find((dev) => dev.label === req.body.loginname) ? 1 : 0);
      }, 0);
    } else {
      // Count all tasks for non-team members
      totalcount = taskss.reduce((count, task) => {
        return count + task.assignedtodeveloper.length;
      }, 0);
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("Task not found!", 404));
  }

  if (!taskss) {
    return next(new ErrorHandler("Task not found!", 404));
  }

  return res.status(200).json({
    taskss,
    totalcount: totalcount,
  });
});

//get All Task =>/api/Tasks => assigneddevcomplete task status purpose
exports.taskReportstyle1 = catchAsyncErrors(async (req, res, next) => {
  let taskss;
  let query;
  let totalcount = 0; // Initialize totalcount to 0
  const startdate = req.body.startdate;
  let enddate = req.body.enddate;

  try {
    if (req.body.loginreportacess === "Teammember") {
      query = {
        assignedtodeveloper: {
          $elemMatch: {
            label: req.body.loginname,
            status: "complete",
          },
        },
        assigneddate: { $gte: startdate, $lte: enddate },
      };
    } else {
      query = {
        assignedtodeveloper: {
          $elemMatch: {
            status: "complete",
          },
        },
        assigneddate: { $gte: startdate, $lte: enddate },
      };
    }

    taskss = await Task.find(query, {
      assignedby: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      assignedmode: 1,
      assignedbyprofileimg: 1,
      taskname: 1,
      assignedtodeveloper: {
        $filter: {
          input: "$assignedtodeveloper",
          as: "developer",
          cond: { $eq: ["$$developer.status", "complete"] },
        },
      },
      _id: 1,
    });

    // Calculate totalcount based on the tasks and access
    if (req.body.loginreportacess == "Teammember") {
      // Count only when access is team member and label matches
      totalcount = taskss.reduce((count, task) => {
        return count + (task.assignedtodeveloper.find((dev) => dev.label === req.body.loginname) ? 1 : 0);
      }, 0);
    } else {
      // Count all tasks for non-team members
      totalcount = taskss.reduce((count, task) => {
        return count + task.assignedtodeveloper.length;
      }, 0);
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("Task not found!", 404));
  }

  if (!taskss) {
    return next(new ErrorHandler("Task not found!", 404));
  }

  return res.status(200).json({
    taskss,
    totalcount: totalcount,
  });
});

//get All Task =>/api/Tasks => assignedto tester incomplete task status purpose
exports.taskReportstyleincomplete = catchAsyncErrors(async (req, res, next) => {
  let taskss;
  let totalcount = 0;
  const logid = req.params.id;
  const startdate = req.body.startdate;
  const enddate = req.body.enddate;

  try {
    let query = {
      assignedtodeveloper: {
        $not: {
          $elemMatch: {
            status: { $ne: "complete" },
          },
        },
      },
      taskstatus: "incomplete",
      assigneddate: { $gte: startdate, $lte: enddate },
    };

    if (req.body.loginreportacess === "Teammember") {
      query.assignedtotester = req.body.loginname;
    }

    taskss = await Task.find(query, {
      assignedby: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      assignedmode: 1,
      assignedbyprofileimg: 1,
      taskname: 1,
      assignedtodeveloper: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  totalcount = taskss.length;

  if (!taskss) {
    return next(new ErrorHandler("Task not found!", 404));
  }

  return res.status(200).json({
    taskss,
    totalcount: totalcount,
  });
});

//get All Task =>/api/Tasks => assignedto tester complete task status purpose
exports.taskReportstylecomplete = catchAsyncErrors(async (req, res, next) => {
  let taskss;
  let totalcount = 0;
  const logid = req.params.id;
  const startdate = req.body.startdate;
  const enddate = req.body.enddate;

  try {
    let query = {
      taskstatus: "complete",
      assigneddate: { $gte: startdate, $lte: enddate },
    };

    if (req.body.loginreportacess === "Teammember") {
      query.assignedtotester = req.body.loginname;
    }

    taskss = await Task.find(query, {
      assignedby: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      assignedmode: 1,
      assignedbyprofileimg: 1,
      taskname: 1,
      assignedtodeveloper: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  totalcount = taskss.length;

  if (!taskss) {
    return next(new ErrorHandler("Task not found!", 404));
  }

  return res.status(200).json({
    taskss,
    totalcount: totalcount,
  });
});

//currentmonthincomplete....

exports.getincompletetaskcurrentmonth = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  let query;
  let totalcount = 0;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const formattedStartDate = `${year}-${month}-01`; // Start of current month
  const formattedEndDate = `${year}-${month}-31`; // End of current month

  try {
    if (req.body.homeuseraccess !== "Teammember") {
      query = {
        assignedtodeveloper: {
          $elemMatch: {
            status: { $eq: "incomplete" },
          },
        },
        assigneddate: {
          $gte: formattedStartDate, // Tasks assigned on or after the start of the month
          $lte: formattedEndDate, // Tasks assigned on or before the end of the month
        },
      };
    } else {
      query = {
        assignedtodeveloper: {
          $elemMatch: {
            label: req.body.homeuserlogin,
            status: { $eq: "incomplete" },
          },
        },
        assigneddate: {
          $gte: formattedStartDate, // Tasks assigned on or after the start of the month
          $lte: formattedEndDate, // Tasks assigned on or before the end of the month
        },
      };
    }
    tasks = await Task.find(query, {
      assignedby: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      assignedmode: 1,
      taskname: 1,
      assignedtodeveloper: 1,
      _id: 1,
    });
    // Calculate totalcount based on the tasks and access
    if (req.body.homeuseraccess === "Teammember") {
      // Count only when access is team member and label matches
      totalcount = tasks.reduce((count, task) => {
        return count + (task.assignedtodeveloper.find((dev) => dev.label === req.body.homeuserlogin) ? 1 : 0);
      }, 0);
    } else {
      // Count all tasks for non-team members
      totalcount = tasks.reduce((count, task) => {
        return count + task.assignedtodeveloper.length;
      }, 0);
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
    totalcount: totalcount,
  });
});

//currentmonthcomplete
exports.getcompletetaskcurrentmonth = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  let query;
  let totalcount = 0;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const formattedStartDate = `${year}-${month}-01`; // Start of current month
  const formattedEndDate = `${year}-${month}-31`; // End of current month

  try {
    if (req.body.homeuseraccess !== "Teammember") {
      query = {
        assignedtodeveloper: {
          $elemMatch: {
            status: { $eq: "complete" },
          },
        },
        assigneddate: {
          $gte: formattedStartDate, // Tasks assigned on or after the start of the month
          $lte: formattedEndDate, // Tasks assigned on or before the end of the month
        },
      };
    } else {
      query = {
        assignedtodeveloper: {
          $elemMatch: {
            label: req.body.homeuserlogin,
            status: { $eq: "complete" },
          },
        },
        assigneddate: {
          $gte: formattedStartDate, // Tasks assigned on or after the start of the month
          $lte: formattedEndDate, // Tasks assigned on or before the end of the month
        },
      };
    }

    tasks = await Task.find(query, {
      assignedby: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      assignedmode: 1,
      taskname: 1,
      assignedtodeveloper: 1,
      _id: 1,
    });

    // Calculate totalcount based on the tasks and access
    if (req.body.homeuseraccess === "Teammember") {
      // Count only when access is team member and label matches
      totalcount = tasks.reduce((count, task) => {
        return count + (task.assignedtodeveloper.find((dev) => dev.label === req.body.homeuserlogin) ? 1 : 0);
      }, 0);
    } else {
      // Count all tasks for non-team members
      totalcount = tasks.reduce((count, task) => {
        return count + task.assignedtodeveloper.length;
      }, 0);
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
    totalcount: totalcount,
  });
});

exports.getincompletetestertaskcurrentmonth = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  let query;
  let totalcount = 0;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const formattedStartDate = `${year}-${month}-01`; // Start of current month
  const formattedEndDate = `${year}-${month}-31`; // End of current month

  try {
    if (req.body.homeuseraccess !== "Teammember") {
      query = {
        assignedtodeveloper: {
          $not: {
            $elemMatch: {
              status: { $ne: "complete" },
            },
          },
        },
        taskstatus: "incomplete",

        assigneddate: {
          $gte: formattedStartDate, // Tasks assigned on or after the start of the month
          $lte: formattedEndDate, // Tasks assigned on or before the end of the month
        },
      };
    } else {
      query = {
        assignedtodeveloper: {
          $not: {
            $elemMatch: {
              status: { $ne: "complete" },
            },
          },
        },
        taskstatus: "incomplete",
        assignedtotester: req.body.homeuserlogin,
        assigneddate: {
          $gte: formattedStartDate, // Tasks assigned on or after the start of the month
          $lte: formattedEndDate, // Tasks assigned on or before the end of the month
        },
      };
    }

    tasks = await Task.find(query, {
      assignedby: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      assignedmode: 1,
      taskname: 1,
      assignedtodeveloper: 1,
      _id: 1,
    });

    totalcount = tasks.length;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
    totalcount: totalcount,
  });
});

//currentmonthcomplete
exports.getcompletetestertaskcurrentmonth = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  let query;
  let totalcount;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const formattedStartDate = `${year}-${month}-01`; // Start of current month
  const formattedEndDate = `${year}-${month}-31`; // End of current month

  try {
    if (req.body.homeuseraccess !== "Teammember") {
      query = {
        taskstatus: "complete",
        assigneddate: {
          $gte: formattedStartDate, // Tasks assigned on or after the start of the month
          $lte: formattedEndDate, // Tasks assigned on or before the end of the month
        },
      };
    } else {
      query = {
        taskstatus: "complete",
        assignedtotester: req.body.homeuserlogin,
        assigneddate: {
          $gte: formattedStartDate, // Tasks assigned on or after the start of the month
          $lte: formattedEndDate, // Tasks assigned on or before the end of the month
        },
      };
    }

    tasks = await Task.find(query, {
      assignedby: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      assignedmode: 1,
      taskname: 1,
      assignedtodeveloper: 1,
      _id: 1,
    });
    totalcount = tasks.length;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
    totalcount: totalcount,
  });
});

//5month  incomplete...
exports.getfivemonthincomplete = catchAsyncErrors(async (req, res, next) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // Get the current month (0-11)
  const currentYear = currentDate.getFullYear(); // Get the current year

  const data = await Task.find();
  let newData = [];

  try {
    newData = data
      .filter((item) => {
        const itemDate = new Date(item.assigneddate);
        const itemMonth = itemDate.getMonth();
        const itemYear = itemDate.getFullYear();
        // Calculate the difference in months between the current date and the task's assigned date
        const monthDiff = (currentYear - itemYear) * 12 + (currentMonth - itemMonth);
        return monthDiff <= 5 && monthDiff > 0; //Include tasks for the last five months, excluding the current month
      })

      .map((item) => {
        const incompleteTasks = item.assignedtodeveloper.filter((task) => task.status === "incomplete");
        return { id: item.id, assignedtodeveloper: incompleteTasks, assigneddate: item.assigneddate };
      });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("An error occurred", 500));
  }

  return res.status(200).json({
    newData,
  });
});

exports.getTaskBoarddevincompletemanageraccess = catchAsyncErrors(async (req, res, next) => {
  let taskboardincomplete, priorityTasks, high, medium, low;

  try {
    taskboardincomplete = await Task.find(
      {
        assignedtodeveloper: {
          $elemMatch: {
            status: { $eq: "incomplete" },
          },
        },
      },
      {
        assigneddate: 1,
        subprojectname: 1,
        assignedby: 1,
        assignedtotester: 1,
        taskstatus: 1,
        taskid: 1,
        assignedmode: 1,
        assignedbyprofileimg: 1,
        taskname: 1,
        checkpointsdev: 1,
        assignedtodeveloper: {
          $filter: {
            input: "$assignedtodeveloper",
            as: "developer",
            cond: { $eq: ["$$developer.status", "incomplete"] },
          },
        },
        _id: 1,
      }
    ).sort({ assigneddate: -1 }); // Sort in descending order based on assigneddate

    priorityTasks = taskboardincomplete.map((d, index) => {
      const { checkpointsdev } = d;
      const priorityStatusCounts = {};

      // Count prioritystatus values within assignedtodeveloper
      checkpointsdev.forEach((dev) => {
        const priorityStatus = dev.priority === ("high2" || "High2" || "HIGH2") || dev.priority === ("high3" || "High3" || "HIGH3") ? "high1" : dev.priority === ("medium1" || "Medium1" || "MEDIUM1") || dev.priority === ("medium2" || "Medium2" || "MEDIUM2") || dev.priority === ("medium3" || "Medium3" || "MEDIUM3") ? "medium" : dev.priority === ("low1" || "Low1" || "LOW1") || dev.priority === ("low2" || "Low2" || "LOW2") || dev.priority === ("low3" || "Low3" || "LOW3") ? "low" : "high";
        if (priorityStatusCounts[priorityStatus]) {
          priorityStatusCounts[priorityStatus]++;
        } else {
          priorityStatusCounts[priorityStatus] = 1;
        }
      });
      let maxPriority = null;
      let maxCount = 0;
      let maxValue = -1;

      const desiredOrder = ["high1", "high", "medium", "low"];

      // Sort the keys based on the desired order
      const sortedKeys = Object.keys(priorityStatusCounts).sort((a, b) => desiredOrder.indexOf(a) - desiredOrder.indexOf(b));

      // Create a new object with sorted keys and values
      const sortedData = {};
      sortedKeys.forEach((key) => {
        sortedData[key] = priorityStatusCounts[key];
      });
      // Check if all counts are the same
      const counts = Object.values(sortedData);
      const areAllCountsSame = counts.every((count) => count === counts[0]);
      const array = Object.values(sortedData).filter((count) => count);
      const maxNumber = Math.max(...array);
      const Maxoccurrences = array.reduce((count, num) => count + (num === maxNumber ? 1 : 0), 0);
      const minNumber = Math.max(...Object.values(array));
      const Minoccurrences = array.reduce((count, num) => count + (num === minNumber ? 1 : 0), 0);
      const anyTwo = Object.values(sortedData).filter((count) => count === maxCount).length >= 2;
      // Determine the maximum occurring status
      let maxStatus = "";
      let duplicateValue;
      if ("high1" in sortedData) {
        maxStatus = "high";
      } else if (areAllCountsSame & (counts.length > 2)) {
        maxStatus = "medium";
      } else if (areAllCountsSame && "medium" in sortedData && "high" in sortedData) {
        maxStatus = "high";
      } else if (areAllCountsSame && "medium" in sortedData && "low" in sortedData) {
        maxStatus = "medium";
      } else if (areAllCountsSame && "low" in sortedData && "high" in sortedData) {
        maxStatus = "high";
      } else if (!areAllCountsSame && (Maxoccurrences > 1 || Minoccurrences > 1)) {
        if (counts.includes(maxNumber) && counts.filter((count) => count === maxNumber).length >= 2) {
          const duplicateValue = counts.find((count) => counts.filter((c) => c === count).length >= 2);
          maxStatus = Object.keys(sortedData).find((status) => sortedData[status] === duplicateValue);
          maxValue = duplicateValue;
        } else {
          // Find the status with the highest value
          for (const status in sortedData) {
            if (sortedData[status] > maxValue) {
              maxStatus = status;
            }
          }
        }
      } else {
        let maxCount = -1;
        for (const status in sortedData) {
          if (sortedData[status] > maxCount) {
            maxCount = sortedData[status];
            maxStatus = status;
          }
        }
      }

      return { d, maxStatus };
    });
    high = priorityTasks.filter((item) => item.maxStatus === "high");
    medium = priorityTasks.filter((item) => item.maxStatus === "medium");
    low = priorityTasks.filter((item) => item.maxStatus === "low");

    return res.status(200).json({ taskboardincomplete, priorityTasks, high, medium, low });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("An error occurred while fetching task board", 500));
  }
});

//5 month complete...
exports.getfivemonthcomplete = catchAsyncErrors(async (req, res, next) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth(); // Get the current month (0-11)
  const currentYear = currentDate.getFullYear(); // Get the current year

  const data = await Task.find();
  let newData = [];

  try {
    newData = data
      .filter((item) => {
        const itemDate = new Date(item.assigneddate);
        const itemMonth = itemDate.getMonth();
        const itemYear = itemDate.getFullYear();

        // Calculate the difference in months between the current date and the task's assigned date
        const monthDiff = (currentYear - itemYear) * 12 + (currentMonth - itemMonth);

        return monthDiff <= 5 && monthDiff > 0; // Include tasks for the last five months
      })
      .map((item) => {
        const incompleteTasks = item.assignedtodeveloper.filter((task) => task.status === "complete");
        return { id: item.id, assignedtodeveloper: incompleteTasks, assigneddate: item.assigneddate };
      });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("An error occurred", 500));
  }

  return res.status(200).json({
    newData,
  });
});

// get All Tasks => /api/taskslimit
exports.getTaskLimit = catchAsyncErrors(async (req, res, next) => {
  let task;

  try {
    task = await Task.find(
      {},
      {
        projectname: 1,
        subprojectname: 1,
        module: 1,
        submodule: 1,
        mainpage: 1,
        taskpageid: 1,
        taskpagename: 1,
        subpageone: 1,
        subpagetwo: 1,
        subpagethree: 1,
        subpagefour: 1,
        subpagefive: 1,
        taskname: 1,
        taskid: 1,
        calculatedtime: 1,
        priority: 1,
        assignedby: 1,
        assignedmode: 1,
        assigneddate: 1,
        assignedtodeveloper: 1,
        description: 1,
        assignedtotester: 1,
        descriptiontester: 1,
        usecasetester: 1,
        status: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!task) {
    return next(new ErrorHandler("Task not found", 400));
  }

  return res.status(200).json({ count: task.length, task });
});

// get All Tasks => /api/tasksboard
exports.getTaskBoard = catchAsyncErrors(async (req, res, next) => {
  let taskboard;

  try {
    taskboard = await Task.find(
      {},
      {
        assigneddate: 1,
        assignedby: 1,
        assignedtotester: 1,
        taskstatus: 1,
        taskid: 1,
        assignedmode: 1,
        assignedbyprofileimg: 1,
        taskname: 1,
        assignedtodeveloper: 1,
        _id: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!taskboard) {
    return next(new ErrorHandler("Task not found", 400));
  }

  return res.status(200).json({ count: taskboard.length, taskboard });
});

// get All Tasks => /api/taskslist
exports.getTaskList = catchAsyncErrors(async (req, res, next) => {
  let tasklist;

  try {
    tasklist = await Task.find(
      {},
      {
        assigneddate: 1,
        assignedbyprofileimg: 1,
        taskname: 1,
        taskid: 1,
        taskstatus: 1,
        calculatedtime: 1,
        assignedby: 1,
        assignedmode: 1,
        assignedtodeveloper: 1,
        assignedtotester: 1,
        usecasetester: 1,
        checkpointsdev: 1,
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!tasklist) {
    return next(new ErrorHandler("Task not found", 400));
  }

  return res.status(200).json({ count: tasklist.length, tasklist });
});

//HOMEPAGE TASKLISTTODAY-----------------------------------
exports.taskHomepageTodaydevincomplete = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  let taskss;
  let query;
  let query1;
  let totalcount = 0; // Initialize totalcount to 0
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  try {
    if (req.body.homeuseraccess == "Teammember") {
      query = {
        assignedtodeveloper: {
          $elemMatch: {
            label: req.body.homeuserlogin,
          },
        },
        assigneddate: formattedDate,
      };
    } else {
      query = {
        assigneddate: formattedDate,
      };
    }
    if (req.body.homeuseraccess == "Teammember") {
      query1 = {
        assignedtodeveloper: {
          $elemMatch: {
            label: req.body.homeuserlogin,
            status: { $eq: "incomplete" },
          },
        },
        assigneddate: formattedDate,
      };
    } else {
      query1 = {
        assigneddate: formattedDate,
      };
    }

    tasks = await Task.find(query, {
      assignedby: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      assigneddate: 1,
      assignedmode: 1,
      checkpointsdev: 1,
      assignedbyprofileimg: 1,
      taskname: 1,
      assignedtodeveloper: {
        $filter: {
          input: "$assignedtodeveloper",
          as: "developer",
          cond: { $eq: ["$$developer.status", "incomplete"] },
        },
      },
      _id: 1,
    });
    taskss = await Task.find(query1, {
      assignedby: 1,
      assignedtotester: 1,
      taskstatus: 1,
      assigneddate: 1,
      taskid: 1,
      assignedmode: 1,
      checkpointsdev: 1,
      assignedbyprofileimg: 1,
      taskname: 1,
      assignedtodeveloper: 1,
      _id: 1,
    });

    // Calculate totalcount based on the tasks and access
    if (req.body.homeuseraccess === "Teammember") {
      // Count only when access is team member and label matches
      totalcount = tasks.reduce((count, task) => {
        return count + (task.assignedtodeveloper.find((dev) => dev.label === req.body.homeuserlogin) ? 1 : 0);
      }, 0);
    } else {
      // Count all tasks for non-team members
      totalcount = tasks.reduce((count, task) => {
        return count + task.assignedtodeveloper.length;
      }, 0);
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("Task not found!", 404));
  }

  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }

  return res.status(200).json({
    tasks,
    taskss,
    totalcount: totalcount,
  });
});

exports.taskHomepageTodaytesterincomplete = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  let totalcount = 0;
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  try {
    let query = {
      assignedtodeveloper: {
        $not: {
          $elemMatch: {
            status: { $ne: "complete" },
          },
        },
      },
      assignedtotester: req.body.homeuserlogin,
      taskstatus: "incomplete",
      assigneddate: formattedDate,
    };

    if (req.body.homeuseraccess !== "Teammember") {
      query = {
        assignedstatus: "incomplete",
        assigneddate: formattedDate,
      };
    }

    tasks = await Task.find(query, {
      assignedby: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      assignedmode: 1,
      checkpointsdev: 1,
      usecasetester: 1,
      assignedbyprofileimg: 1,
      taskname: 1,
      assignedtodeveloper: 1,
      _id: 1,
    });

    totalcount = tasks.length;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
    totalcount: totalcount,
  });
});

exports.taskHomepagedevincomplete = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  let totalCount = 0; // Initialize totalCount to 0

  try {
    const query = {
      assignedtodeveloper: {
        $elemMatch: {
          status: { $eq: "incomplete" },
        },
      },
    };

    if (req.body.homeuseraccess === "Teammember") {
      query.assignedtodeveloper.$elemMatch.label = req.body.homeuserlogin;
    } else {
      query.assignedtodeveloper.$elemMatch.label = { $exists: true };
    }

    tasks = await Task.find(query, {
      assignedby: 1,
      assigneddate: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      checkpointsdev: 1,
      usecasetester: 1,
      assignedmode: 1,
      assignedbyprofileimg: 1,
      taskname: 1,
      assignedtodeveloper: 1,
      _id: 1,
    });

    if (req.body.homeuseraccess === "Teammember") {
      // Count only when access is team member and label matches
      totalCount = tasks.reduce((count, task) => {
        return count + (task.assignedtodeveloper.find((dev) => dev.label === req.body.homeuserlogin) ? 1 : 0);
      }, 0);
    } else {
      // Count all tasks for non-team members
      totalCount = tasks.reduce((count, task) => {
        return count + task.assignedtodeveloper.length;
      }, 0);
    }

    return res.status(200).json({
      tasks,
      totalcount: totalCount,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("Task not found!", 404));
  }
});

exports.taskHomepagedevincompleteaccess = catchAsyncErrors(async (req, res, next) => {
  let tasks;

  try {
    const query = {
      assignedtodeveloper: {
        $elemMatch: {
          label: req.body.homeuserlogin,
          status: { $eq: "incomplete" },
        },
      },
    };

    tasks = await Task.find(query, {
      assignedby: 1,
      assigneddate: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      checkpointsdev: 1,
      usecasetester: 1,
      assignedmode: 1,
      assignedbyprofileimg: 1,
      taskname: 1,
      assignedtodeveloper: 1,
      _id: 1,
    });
    return res.status(200).json({
      tasks,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("Task not found!", 404));
  }
});

exports.taskHomepagetesterincomplete = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  let totalcount;

  try {
    let query = {
      assignedtodeveloper: {
        $not: {
          $elemMatch: {
            status: { $ne: "complete" },
          },
        },
      },
      assignedtotester: req.body.homeuserlogin,
      taskstatus: "incomplete",
    };

    if (req.body.homeuseraccess !== "Teammember") {
      query = {
        taskstatus: "incomplete",
      };
    }

    tasks = await Task.find(query, {
      assignedby: 1,
      assigneddate: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      assignedmode: 1,
      checkpointsdev: 1,
      usecasetester: 1,
      assignedbyprofileimg: 1,
      taskname: 1,
      assignedtodeveloper: 1,
      _id: 1,
    });

    totalcount = tasks.length;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
    totalcount: totalcount,
  });
});

exports.taskHomepagetesterincompleteaccess = catchAsyncErrors(async (req, res, next) => {
  let tasks;

  try {
    let query = {
      assignedtodeveloper: {
        $not: {
          $elemMatch: {
            status: { $ne: "complete" },
          },
        },
      },
      assignedtotester: req.body.homeuserlogin,
      taskstatus: "incomplete",
    };

    tasks = await Task.find(query, {
      assignedby: 1,
      assigneddate: 1,
      assignedtotester: 1,
      taskstatus: 1,
      taskid: 1,
      checkpointsdev: 1,
      usecasetester: 1,
      assignedmode: 1,
      assignedbyprofileimg: 1,
      taskname: 1,
      assignedtodeveloper: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
  });
});

exports.taskHomepagedevincompletechecktimer = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  let totalCount = 0; // Initialize totalCount to 0

  try {
    const query = {
      $or: [
        {
          assignedtodeveloper: {
            $elemMatch: {
              status: { $eq: "incomplete" },
              label: req.body.homeuserloginchecktimer,
            },
          },
          checkpointsdev: {
            $elemMatch: {
              checkuser: req.body.homeuserloginchecktimer,
              state: { $eq: "running" },
            },
          },
        },
        {
          assignedtotester: req.body.homeuserloginchecktimer,
          taskstatus: "incomplete",
          usecasetester: {
            $elemMatch: {
              state: { $eq: "running" },
            },
          },
        },
      ],
    };

    tasks = await Task.find(query, {
      taskid: 1,
      taskname: 1,
      _id: 1,
    });

    // if (req.body.homeuseraccess === "Teammember") {
    //   // Count only when access is team member and label matches
    //   totalCount = tasks.reduce((count, task) => {
    //     return count + (task.assignedtodeveloper.find(dev => dev.label === req.body.homeuserlogin) ? 1 : 0);
    //   }, 0);
    // } else {
    //   // Count all tasks for non-team members
    //   totalCount = tasks.reduce((count, task) => {
    //     return count + task.assignedtodeveloper.length;
    //   }, 0);
    // }

    return res.status(200).json({
      tasks,
      // totalcount: totalCount
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("Task not found!", 404));
  }
});

//create new Task => /api/Task/new
exports.addTask = catchAsyncErrors(async (req, res, next) => {
  let ataskCheck = await Task.findOne({ taskname: req.body.taskname });
  if (ataskCheck) {
    return next(new ErrorHandler("Name already exist!", 400));
  }
  let aTask = await Task.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});
// get Single Task => /api/Task/:id
exports.getSingleTask = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let stask = await Task.findById(id);
  if (!stask) {
    return next(new ErrorHandler("Task not found", 404));
  }
  return res.status(200).json({
    stask,
  });
});

//update Task by id => /api/Task/:id
exports.updateTask = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let utask = await Task.findByIdAndUpdate(id, req.body);
  if (!utask) {
    return next(new ErrorHandler("Task Details not found", 404));
  }
  return res.status(200).json({ message: "Updates successfully" });
});

//delete Task by id => /api/Task/:id
exports.deleteTask = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dtask = await Task.findByIdAndRemove(id);
  if (!dtask) {
    return next(new ErrorHandler("Task not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getCheckpointgrpToTask = catchAsyncErrors(async (req, res, next) => {
  let tasks;
  try {
    const query = {
      checkpointsdev: {
        $elemMatch: {
          label: req.body.checkcheckpointgrptotask,
        },
      },
    };
    tasks = await Task.find(query, {
      taskname: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!tasks) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    tasks,
  });
});
