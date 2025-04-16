const TaskAssignBoardList = require("../../../model/modules/project/taskassignboardlist");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All TaskAssignBoardList Details => /api/taskAssignBoardList
exports.getAllTaskAssignBoardList = catchAsyncErrors(async (req, res, next) => {
  let taskAssignBoardList;
  try {
    taskAssignBoardList = await TaskAssignBoardList.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskAssignBoardList) {
    return next(new ErrorHandler("task Assign Board List details not found", 404));
  }
  return res.status(200).json({
    // count: Departments.length,
    taskAssignBoardList,
  });
});

// get All TaskAssignBoardList Details => /api/taskAssignBoardList
exports.getAllTaskAssignBoardListlimited = catchAsyncErrors(async (req, res, next) => {
  let taskAssignBoardList;
  try {
    taskAssignBoardList = await TaskAssignBoardList.find({}, { taskname: 1, taskid: 1, phase: 1, prevId: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskAssignBoardList) {
    return next(new ErrorHandler("task Assign Board List details not found", 404));
  }
  return res.status(200).json({
    // count: Departments.length,
    taskAssignBoardList,
  });
});
// get All TaskAssignBoardList Details => /api/taskAssignBoardList
exports.getAllNotTaskAssignBoardListtabledata = catchAsyncErrors(async (req, res, next) => {
  let taskAssignBoardList;
  try {
    taskAssignBoardList = await TaskAssignBoardList.find({ allotedstatus: false }, { allotedstatus: 1, taskname: 1, phase: 1, taskid: 1, project: 1, subproject: 1, module: 1, submodule: 1, mainpage: 1, pagetype: 1, subpage: 1, name: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskAssignBoardList) {
    return next(new ErrorHandler("task Assign Board List details not found", 404));
  }
  return res.status(200).json({
    // count: Departments.length,
    taskAssignBoardList,
  });
});

// get All TaskAssignBoardList Details => /api/taskAssignBoardList
exports.getAllTaskAssignBoardListtabledata = catchAsyncErrors(async (req, res, next) => {
  let taskAssignBoardList;
  try {
    taskAssignBoardList = await TaskAssignBoardList.find({ allotedstatus: true }, { allotedstatus: 1, taskname: 1, phase: 1, taskid: 1, project: 1, subproject: 1, module: 1, submodule: 1, mainpage: 1, pagetype: 1, subpage: 1, name: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskAssignBoardList) {
    return next(new ErrorHandler("task Assign Board List details not found", 404));
  }
  return res.status(200).json({
    // count: Departments.length,
    taskAssignBoardList,
  });
});

// get All TaskAssignBoardList Details => /api/taskAssignBoardList
exports.getAllTaskAssignBoardListFilter = catchAsyncErrors(async (req, res, next) => {
  let taskAssignBoardList;
  const { project, subproject, module, submodule, mainpage, subpage, subsubpage } = req.body;
  try {
    const query = {};
    if (project && project.length > 0) {
      query.project = { $in: project };
    }

    if (subproject && subproject.length > 0) {
      query.subproject = { $in: subproject };
    }

    if (module && module.length > 0) {
      query.module = { $in: module };
    }

    if (submodule && submodule.length > 0) {
      query.submodule = { $in: submodule };
    }

    if (mainpage && mainpage.length > 0) {
      query.mainpage = { $in: mainpage };
    }

    if (subpage && subpage.length > 0) {
      query.subpage = { $in: subpage };
    }

    if (subsubpage && subsubpage.length > 0) {
      query.name = { $in: subsubpage };
    }

    taskAssignBoardList = await TaskAssignBoardList.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskAssignBoardList) {
    return next(new ErrorHandler("task Assign Board List details not found", 404));
  }
  return res.status(200).json({
    // count: Departments.length,
    taskAssignBoardList,
  });
});

//GET SINGLE USERTASK LIST
//get All Role =>/api/roles
exports.getParticularUsersTask = catchAsyncErrors(async (req, res, next) => {
  let tasks, taskUI, taskDev, taskTest, tasksDevelop, tasksTest;
  try {
    tasks = await TaskAssignBoardList.find();
    tasksDevelop = await TaskAssignBoardList.find();
    tasksTest = await TaskAssignBoardList.find();
    //filter task UI BASED ON USERLOGIN
    taskUI = tasks
      .filter((task) => task.allotedstatus === true && task.phase == "UI")
      .map((task) => {
        task.uidesign = task.uidesign.filter((item) => {
          if (item.taskdev === req.body.user && item.checkpointsstatus !== "completed") {
            return item;
          }
        });
        return task;
      })
      .filter((task) => task.uidesign.some((item) => item.checkpointsstatus !== "completed"));
    //filter task DEV BASED ON USERLOGIN
    taskDev = tasksDevelop.filter((task) => {
      // Check if the task meets the conditions for Development and allotedstatus
      if (task.phase === "Development" && task.allotedstatus === true && task.develop.some((item) => item.taskdev === req.body.user && item.checkpointsstatus !== "completed")) {
        // Find the corresponding UI phase task
        const uiPhaseTask = tasksDevelop.find((uiTask) => uiTask.taskid === task.taskid && uiTask.phase === "UI");

        // Check if the UI phase task exists and if all uidesign checkpoints are completed
        if (uiPhaseTask && uiPhaseTask.uidesign.every((uiDesign) => uiDesign.checkpointsstatus === "completed")) {
          return true; // Include the task in the filtered result
        }
      }
      return false; // Exclude the task from the filtered result
    });
    //filter task TEST BASED ON USERLOGIN
    taskTest = tasksTest.filter((task) => {
      // Check if the task meets the conditions for Development and allotedstatus
      if ((task.phase === "Testing" && task.allotedstatus === true && task.testing.some((item) => item.taskdev === req.body.user && item.checkpointsstatus !== "completed")) || task.testinguidesign.some((item) => item.taskdev === req.body.user && item.checkpointsstatus !== "completed")) {
        // Find the corresponding UI phase task
        const devPhaseTask = tasksTest.find((devTask) => devTask.taskid === task.taskid && devTask.phase === "Development");
        // Check if the UI phase task exists and if all uidesign checkpoints are completed
        if (devPhaseTask && devPhaseTask.develop.every((dev) => dev.checkpointsstatus === "completed")) {
          return true; // Include the task in the filtered result
        }
      }
      return false; // Exclude the task from the filtered result
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!TaskAssignBoardList) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    taskUI,
    taskDev,
    taskTest,
  });
});

exports.getAlltasksadminview = catchAsyncErrors(async (req, res, next) => {
  let tasks, taskUI, taskDev, taskTest, tasksDevelop, tasksTest;
  try {

    tasks = await TaskAssignBoardList.find();
    tasksDevelop = await TaskAssignBoardList.find();
    tasksTest = await TaskAssignBoardList.find();
    //filter task UI BASED ON USERLOGIN
    taskUI = tasks
      .filter((task) => task.allotedstatus === true && task.phase == "UI")
      .map((task) => {
        task.uidesign = task.uidesign.filter((item) => {
          if (item.checkpointsstatus !== "completed") {
            return item;
          }
        });
        return task;
      })
      .filter((task) => task.uidesign.some((item) => item.checkpointsstatus !== "completed"));
    //filter task DEV BASED ON USERLOGIN
    taskDev = tasksDevelop.filter((task) => {
      // Check if the task meets the conditions for Development and allotedstatus
      if (task.phase === "Development" && task.allotedstatus === true && task.develop.some((item) => item.checkpointsstatus !== "completed")) {
        // Find the corresponding UI phase task
        const uiPhaseTask = tasksDevelop.find((uiTask) => uiTask.taskid === task.taskid && uiTask.phase === "UI");

        // Check if the UI phase task exists and if all uidesign checkpoints are completed
        if (uiPhaseTask && uiPhaseTask.uidesign.every((uiDesign) => uiDesign.checkpointsstatus === "completed")) {
          return true; // Include the task in the filtered result
        }
      }
      return false; // Exclude the task from the filtered result
    });
    //filter task TEST BASED ON USERLOGIN
    taskTest = tasksTest.filter((task) => {
      // Check if the task meets the conditions for Development and allotedstatus
      if ((task.phase === "Testing" && task.allotedstatus === true && task.testing.some((item) => item.checkpointsstatus !== "completed")) || task.testinguidesign.some((item) => item.checkpointsstatus !== "completed")) {
        // Find the corresponding UI phase task
        const devPhaseTask = tasksTest.find((devTask) => devTask.taskid === task.taskid && devTask.phase === "Development");
        // Check if the UI phase task exists and if all uidesign checkpoints are completed
        if (devPhaseTask && devPhaseTask.develop.every((dev) => dev.checkpointsstatus === "completed")) {
          return true; // Include the task in the filtered result
        }
      }
      return false; // Exclude the task from the filtered result
    });


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!TaskAssignBoardList) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    taskUI,
    taskDev,
    taskTest,
  });
});

exports.updateTasksSubArrays = catchAsyncErrors(async (req, res, next) => {
  try {
    const { taskid, todos } = req.body;
    // Construct an array of update operations for each item in changecheckedlabel
    const updateOperations = todos.map((todo) => ({
      updateOne: {
        filter: {
          "develop._id": taskid,
        },
        update: {
          $set: {
            "develop.$.state": "Re-Printed",
          },
        },
      },
    }));
    // Bulk write the update operations
    const result = await TaskAssignBoardList.bulkWrite(updateOperations);
    if (result.modifiedCount === 0) {
      return next(new ErrorHandler("Task not found!", 404));
    }
    return res.status(200).json({ message: "Task updated successfully" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("Error updating Task!", 500));
  }
});

// Create new TaskAssignBoardList => /api/taskAssignBoardList/new
exports.addTaskAssignBoardList = catchAsyncErrors(async (req, res, next) => {
  let ataskAssignBoardList = await TaskAssignBoardList.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle TaskAssignBoardList => /api/taskAssignBoardList/:id
exports.getSingleTaskAssignBoardList = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let staskAssignBoardList = await TaskAssignBoardList.findById(id);
  if (!staskAssignBoardList) {
    return next(new ErrorHandler("Task Assign Board List not found", 404));
  }
  return res.status(200).json({
    staskAssignBoardList,
  });
});
// get Single TaskAssignBoardList => /api/taskAssignBoardList/:id
exports.getSingleTaskAssignBoardListNew = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const user = req.body.user;
  let staskAssignBoardList, staskAssignBoardListnew, staskAssignBoardListnewDev, staskAssignBoardListnewTest, staskAssignBoardListnewTestui; // Assuming user is coming from the request body

  try {
    staskAssignBoardList = await TaskAssignBoardList.findById(id);
    // Filter the uidesign array to include only elements where taskdev matches user
    staskAssignBoardListnew = staskAssignBoardList.uidesign.filter((elem) => elem.taskdev === user);

    staskAssignBoardListnewDev = staskAssignBoardList.develop.filter((elem) => elem.taskdev === user);
    staskAssignBoardListnewTest = staskAssignBoardList.testing.filter((elem) => elem.taskdev === user);
    staskAssignBoardListnewTestui = staskAssignBoardList.testinguidesign.filter((elem) => elem.taskdev === user);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!staskAssignBoardList) {
    return next(new ErrorHandler("Task Assign Board List details not found", 404));
  }
  return res.status(200).json({
    staskAssignBoardList,
    staskAssignBoardListnew,
    staskAssignBoardListnewDev,
    staskAssignBoardListnewTest,
    staskAssignBoardListnewTestui,
  });
});

exports.taskassignchecktimer = catchAsyncErrors(async (req, res, next) => {
  let tasks, taskallcheck, prioritycheck, prioritycheckUI, prioritycheckDEV, prioritycheckTest;
  try {
    tasks = await TaskAssignBoardList.find({}, { taskname: 1, taskid: 1, phase: 1, allotedstatus: 1, uidesign: 1, develop: 1, testing: 1, testinguidesign: 1 });
    taskallcheck = tasks.filter((task) => {
      return (task.uidesign && task.uidesign.some((item) => item.taskdev === req.body.user && item.state === "running")) || (task.develop && task.develop.some((item) => item.taskdev === req.body.user && item.state === "running")) || (task.testing && task.testing.some((item) => item.taskdev === req.body.user && item.state === "running")) || (task.testinguidesign && task.testinguidesign.some((item) => item.taskdev === req.body.user && item.state === "running"));
    });
    prioritycheckUI = tasks
      .filter((task) => task.allotedstatus === true && task.phase == "UI")
      .map((task) => {
        task.uidesign = task.uidesign.filter((item) => {
          if (item.taskdev === req.body.user && item.checkpointsstatus !== "completed") {
            return item;
          }
        });
        return task;
      })
      .filter((task) => task.uidesign.some((item) => item.checkpointsstatus !== "completed" && (item.priority.toLowerCase() == "high" || item.priority.toLowerCase() == "veryhigh" || item.priority.toLowerCase() == "very high")));
    prioritycheckDEV = tasks.filter((task) => {
      // Check if the phase is "Development" and there is a matching condition in the develop array
      if (task.phase === "Development" && task.allotedstatus === true && task.develop.some((dev) => dev.taskdev === req.body.user && (dev.priority.toLowerCase() == "high" || dev.priority.toLowerCase() == "veryhigh" || dev.priority.toLowerCase() == "very high") && dev.checkpointsstatus !== "completed")) {
        const uiPhaseTask = tasks.find((uiTask) => uiTask.taskid === task.taskid && uiTask.phase === "UI");

        // Check if the UI phase task exists and if all uidesign checkpoints are completed
        if (uiPhaseTask && uiPhaseTask.uidesign.every((uiDesign) => uiDesign.checkpointsstatus === "completed")) {
          return true; // Include the task in the filtered result
        }
      }
      return false; //
    });
    prioritycheckTest = tasks.filter((task) => {
      // Check if the phase is "Development" and there is a matching condition in the develop array
      if (task.phase === "Testing" && task.allotedstatus === true && (task.testing.some((test) => test.tasktest === req.body.user && (test.priority.toLowerCase() == "high" || test.priority.toLowerCase() == "veryhigh" || test.priority.toLowerCase() == "very high") && test.checkpointsstatus !== "complete") || task.testinguidesign.some((test) => test.tasktest === req.body.user && (test.priority.toLowerCase() == "high" || test.priority.toLowerCase() == "veryhigh" || test.priority.toLowerCase() == "very high") && test.checkpointsstatus !== "complete"))) {
        const devPhaseTask = tasks.find((uiTask) => uiTask.taskid === task.taskid && uiTask.phase === "UI");
        // Check if the UI phase task exists and if all uidesign checkpoints are completed
        if (devPhaseTask && devPhaseTask.develop.every((dev) => dev.checkpointsstatus === "completed")) {
          return true; // Include the task in the filtered result
        }
      }
      return false; //
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!tasks) {
    return next(new ErrorHandler("Task Assign Board List details not found", 404));
  }
  return res.status(200).json({
    taskallcheck,
    prioritycheckUI,
    prioritycheckDEV,
    prioritycheckTest,
  });
});

// get All getTaskidstoUpdateRequirements Details => /api/taskAssignBoardList
exports.getTaskidstoUpdateRequirements = catchAsyncErrors(async (req, res, next) => {
  let taskUIid, taskDevid, taskTestid;
  try {
    taskUIid = await TaskAssignBoardList.find({ prevId: req.body.id, phase: "UI" }, { _id: 1 });
    taskDevid = await TaskAssignBoardList.find({ prevId: req.body.id, phase: "Development" }, { _id: 1 });
    taskTestid = await TaskAssignBoardList.find({ prevId: req.body.id, phase: "Testing" }, { _id: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!taskUIid) {
    return next(new ErrorHandler("task Assign Board List details not found", 404));
  }
  return res.status(200).json({
    // count: Departments.length,
    taskUIid,
    taskDevid,
    taskTestid,
  });
});

exports.getAllcompletedtask = catchAsyncErrors(async (req, res, next) => {
  let task, completedtask, filter;
  try {
    task = await TaskAssignBoardList.find();
    //filter task UI BASED ON USERLOGIN
    //filter task TEST BASED ON USERLOGIN
    filter = task.filter(
      (task) =>
        // Check if the task meets the conditions for Development and allotedstatus
        task.phase === "Testing" && task.allotedstatus === true && task.testing.every((item) => item.checkpointsstatus == "completed") && task.testinguidesign.every((item) => item.checkpointsstatus == "completed")
    );
    completedtask = filter.map((item) => item.taskname);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!TaskAssignBoardList) {
    return next(new ErrorHandler("Task not found!", 404));
  }
  return res.status(200).json({
    completedtask,
  });
});

// get All TaskAssignBoardList Details => /api/taskAssignBoardList
exports.getTaskboardviewlistFilter = catchAsyncErrors(async (req, res, next) => {
  let taskAssignBoardList;
  let tasks, taskUI, taskDev, taskTest, tasksDevelop, tasksTest;
  const { project, subproject, module, submodule, mainpage, subpage, subsubpage, access,accessdrop } = req.body;
  try {
    const query = {};
    if (project && project.length > 0) {
      query.project = { $in: project };
    }

    if (subproject && subproject.length > 0) {
      query.subproject = { $in: subproject };
    }

    if (module && module.length > 0) {
      query.module = { $in: module };
    }

    if (submodule && submodule.length > 0) {
      query.submodule = { $in: submodule };
    }

    if (mainpage && mainpage.length > 0) {
      query.mainpage = { $in: mainpage };
    }

    if (subpage && subpage.length > 0) {
      query.subpage = { $in: subpage };
    }

    if (subsubpage && subsubpage.length > 0) {
      query.name = { $in: subsubpage };
    }

    tasks = await TaskAssignBoardList.find(query);
    tasksDevelop = await TaskAssignBoardList.find(query);
    tasksTest = await TaskAssignBoardList.find(query);
  
    if (!access.includes("Manager") || (access.includes("Manager") && accessdrop === "Teammember")) {
      //filter task UI BASED ON USERLOGIN
      taskUI = tasks
        .filter((task) => task.allotedstatus === true && task.phase == "UI")
        .map((task) => {
          task.uidesign = task.uidesign.filter((item) => {
            if (item.taskdev === req.body.user && item.checkpointsstatus !== "completed") {
              return item;
            }
          });
          return task;
        })
        .filter((task) => task.uidesign.some((item) => item.checkpointsstatus !== "completed"));
      //filter task DEV BASED ON USERLOGIN
      taskDev = tasksDevelop.filter((task) => {
        // Check if the task meets the conditions for Development and allotedstatus
        if (task.phase === "Development" && task.allotedstatus === true && task.develop.some((item) => item.taskdev === req.body.user && item.checkpointsstatus !== "completed")) {
          // Find the corresponding UI phase task
          const uiPhaseTask = tasksDevelop.find((uiTask) => uiTask.taskid === task.taskid && uiTask.phase === "UI");

          // Check if the UI phase task exists and if all uidesign checkpoints are completed
          if (uiPhaseTask && uiPhaseTask.uidesign.every((uiDesign) => uiDesign.checkpointsstatus === "completed")) {
            return true; // Include the task in the filtered result
          }
        }
        return false; // Exclude the task from the filtered result
      });
      //filter task TEST BASED ON USERLOGIN
      taskTest = tasksTest.filter((task) => {
        // Check if the task meets the conditions for Development and allotedstatus
        if ((task.phase === "Testing" && task.allotedstatus === true && task.testing.some((item) => item.taskdev === req.body.user && item.checkpointsstatus !== "completed")) || task.testinguidesign.some((item) => item.taskdev === req.body.user && item.checkpointsstatus !== "completed")) {
          // Find the corresponding UI phase task
          const devPhaseTask = tasksTest.find((devTask) => devTask.taskid === task.taskid && devTask.phase === "Development");
          // Check if the UI phase task exists and if all uidesign checkpoints are completed
          if (devPhaseTask && devPhaseTask.develop.every((dev) => dev.checkpointsstatus === "completed")) {
            return true; // Include the task in the filtered result
          }
        }
        return false; // Exclude the task from the filtered result
      });
    }
    if (access.includes("Manager") && accessdrop === "all") {
      //filter task UI BASED ON USERLOGIN
      taskUI = tasks
        .filter((task) => task.allotedstatus === true && task.phase == "UI")
        .map((task) => {
          task.uidesign = task.uidesign.filter((item) => {
            if (item.checkpointsstatus !== "completed") {
              return item;
            }
          });
          return task;
        })
        .filter((task) => task.uidesign.some((item) => item.checkpointsstatus !== "completed"));
      //filter task DEV BASED ON USERLOGIN
      taskDev = tasksDevelop.filter((task) => {
        // Check if the task meets the conditions for Development and allotedstatus
        if (task.phase === "Development" && task.allotedstatus === true && task.develop.some((item) => item.checkpointsstatus !== "completed")) {
          // Find the corresponding UI phase task
          const uiPhaseTask = tasksDevelop.find((uiTask) => uiTask.taskid === task.taskid && uiTask.phase === "UI");

          // Check if the UI phase task exists and if all uidesign checkpoints are completed
          if (uiPhaseTask && uiPhaseTask.uidesign.every((uiDesign) => uiDesign.checkpointsstatus === "completed")) {
            return true; // Include the task in the filtered result
          }
        }
        return false; // Exclude the task from the filtered result
      });
      //filter task TEST BASED ON USERLOGIN
      taskTest = tasksTest.filter((task) => {
        // Check if the task meets the conditions for Development and allotedstatus
        if ((task.phase === "Testing" && task.allotedstatus === true && task.testing.some((item) => item.checkpointsstatus !== "completed")) || task.testinguidesign.some((item) => item.checkpointsstatus !== "completed")) {
          // Find the corresponding UI phase task
          const devPhaseTask = tasksTest.find((devTask) => devTask.taskid === task.taskid && devTask.phase === "Development");
          // Check if the UI phase task exists and if all uidesign checkpoints are completed
          if (devPhaseTask && devPhaseTask.develop.every((dev) => dev.checkpointsstatus === "completed")) {
            return true; // Include the task in the filtered result
          }
        }
        return false; // Exclude the task from the filtered result
      });
    }
    // taskAssignBoardList = await TaskAssignBoardList.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!taskAssignBoardList) {
  //   return next(new ErrorHandler("task Assign Board List details not found", 404));
  // }
  return res.status(200).json({
    // count: Departments.length,
    // taskAssignBoardList,
    taskUI,
    taskDev,
    taskTest,
  });
});

// update taskAssignBoardList by id => /api/taskAssignBoardList/:id
exports.updateTaskAssignBoardList = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uptaskAssignBoardList = await TaskAssignBoardList.findByIdAndUpdate(id, req.body);
  if (!uptaskAssignBoardList) {
    return next(new ErrorHandler("TaskAssignBoardList Details not found", 404));
  }
  return res.status(200).json({ message: "Updates successfully" });
});

// delete Task Assign Board List by id => /api/taskAssignBoardList/:id
exports.deleteTaskAssignBoardList = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dtaskAssignBoardList = await TaskAssignBoardList.findByIdAndRemove(id);
  if (!dtaskAssignBoardList) {
    return next(new ErrorHandler("task Assign Board List  Details not found", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

// delete workorder only
exports.deleteWorkOrders = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  try {
    const updatedDocument = await TaskAssignBoardList.findOneAndUpdate(
      { _id: id },
      {
        $unset: { assignby: 1, assignmode: 1, assigndate: 1, team: 1, calculatedtime: 1, workorders: 1 },
        $set: { taskassignboardliststatus: "Yet to assign" },
      },
      { new: true, returnOriginal: false } // Return the updated document
    );
    if (!updatedDocument) {
      // Handle the case where no document was found (possibly due to incorrect ID)
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Workorders deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});