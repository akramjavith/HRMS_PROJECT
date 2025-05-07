const TrainingForUser = require("../../../model/modules/task/trainingforuser");
const Team = require("../../../model/modules/teams");
const User = require("../../../model/login/auth");
const Hirerarchi = require("../../../model/modules/setup/hierarchy");
const Designationgroup = require("../../../model/modules/designationgroup");
const Designation = require("../../../model/modules/designation");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const TrainingDetails = require('../../../model/modules/task/trainingdetails');
const OnlineTestMaster = require('../../../model/modules/interview/onlinetestmaster');
// get All TrainingForUser => /api/trainingforusers
exports.getAllTrainingForUser = catchAsyncErrors(async (req, res, next) => {
  let trainingforuser;
  try {
    trainingforuser = await TrainingForUser.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!trainingforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    trainingforuser,
  });
});
exports.getAllTrainingForUserPostponed = catchAsyncErrors(async (req, res, next) => {
  let trainingforuser , training;
  let username = req.body.username;
  let status = req.body.status;

  try {
    training = await TrainingForUser.find();
    trainingforuser = training?.filter(data => data.username === username && status === data.taskstatus)
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!training) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    trainingforuser,
  });
});
exports.getAllTrainingForUserOnprogress = catchAsyncErrors(async (req, res, next) => {
  let trainingforuser , training;
  let username = req.body.username;
  let status = req.body.status;
 

  try {
    training = await TrainingForUser.find({},{
      username : 1,
      taskstatus:1,
      taskassigneddate:1,
      taskdetails:1,
      timetodo:1,
      frequency:1,
      schedule:1,
      trainingdetails:1,
      duration:1,
      mode:1,
      testnames:1,
      priority:1,

    });
    trainingforuser = training?.filter(data => data.username === username && status.includes(data.taskstatus))
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!training) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    trainingforuser,
  });
});
exports.getAllTrainingForUserReports = catchAsyncErrors(async (req, res, next) => {
  let trainingforuser , training , totalProjects , totalPages;

  let {required  , page , pageSize} = req.body;
  const skip = (page - 1) * pageSize; // Calculate the number of items to skip
  const limit = pageSize; // The number of items to take
  try {
    training = await TrainingForUser.find({},{
      username : 1,
      taskstatus:1,
      taskassigneddate:1,
      taskdetails:1,
      timetodo:1,
      frequency:1,
      schedule:1,
      trainingdetails:1,
      duration:1,
      mode:1,
      testnames:1,
      priority:1,
      required:1,
      breakup:1,
      description:1,
      trainingdetails:1,

    });
   
    totalProjects =  training?.filter(data => data.required?.some(data => required?.includes(data)))?.length
    trainingforuser = training?.filter(data => data.required?.some(data => required?.includes(data)))?.slice(skip, skip + limit);




  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!training) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    totalProjects : totalProjects, 
    currentPage: page,
    trainingforuser,
    totalPages: Math.ceil(totalProjects / pageSize),
 
  });
});
exports.getAllTrainingForUserReportsOverall = catchAsyncErrors(async (req, res, next) => {
  let trainingforuser , training , totalProjects , totalPages;
  let required = req.body.required;

  try {

  
    training = await TrainingForUser.find({},{
      username : 1,
      taskstatus:1,
      taskassigneddate:1,
      taskdetails:1,
      timetodo:1,
      frequency:1,
      schedule:1,
      trainingdetails:1,
      duration:1,
      mode:1,
      testnames:1,
      priority:1,
      required:1,
      breakup:1,
      description:1,
      trainingdetails:1,

    });


    trainingforuser = training?.filter(data => data.required?.some(data => required?.includes(data)))


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!training) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    trainingforuser,
  });
});
exports.getAllTrainingForUserCompleted = catchAsyncErrors(async (req, res, next) => {
  let trainingforuser , training;
  let username = req.body.username;
  let status = req.body.status;

  try {
    training = await TrainingForUser.find({},{
      username : 1,
      taskstatus:1,
      taskassigneddate:1,
      taskdetails:1,
      taskdetails:1,
      trainingdetails:1,
      totalmarks:1,
      totalmarksobtained:1,
      timetodo:1,
      frequency:1,
      schedule:1,
      duration:1,
      mode:1,
      testnames:1,
      priority:1,

    });

    trainingforuser = training?.filter(data => data.username === username && status?.includes(data.taskstatus))
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!training) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    trainingforuser,
  });});


  exports.getAllTrainingForUserAssignId = catchAsyncErrors(async (req, res, next) => {
    let taskforuser;
    let assignid = req.body.assignId
    try {
      const task = await TrainingForUser.find({assignId:assignid ,taskassign:"Team" },{});
      taskforuser = task?.filter(data => data?.username !== req.body.username)
  
    } catch (err) {
       return next(new ErrorHandler("Records not found", 404));
    }
    return res.status(200).json({
      // count: products.length,
      taskforuser
    });
  });

  exports.getAllTrainingHierarchyReports = catchAsyncErrors(async (req, res, next) => {
    let taskforuser,result,
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
  
  let uniqueElements , nonscheduledata ;
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
        result = await TrainingForUser.find({
          taskassigneddate: req.body.date,
          username: { $in: companyNames }, // Use companyNames array here
        });
      } else {
        result = await TrainingForUser.find({taskassigneddate:req.body.date});
      }

  
    
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
      resultAccessFilter
    });
  });

// Create new TrainingForUser=> /api/trainingforuser/new
exports.addTrainingForUser = catchAsyncErrors(async (req, res, next) => {

  const { category, subcategory, username,frequency,duration,taskassigneddate ,trainingdetails, taskdetails , taskdate, tasktime,timetodo} = req.body;
        
  const existingRecords = taskdetails === "Mandatory" ?  await TrainingForUser.find({ 
    username, 
    trainingdetails,
    frequency,
    duration,
    taskassigneddate,
    taskdetails,
    timetodo
    
  }) : await TrainingForUser.find({ 
    trainingdetails,
    username, 
    taskdate,
    tasktime,
    taskdetails
      
  });

  if (existingRecords?.length > 0) {
      return res.status(400).json({
          message: 'This Data is Already Exists!'
      });
  }

  let atrainingforuser = await TrainingForUser.create(req.body);

  return res.status(200).json({
      message: 'Successfully added!',
      data: atrainingforuser
  });

});

// get Signle TrainingForUser => /api/trainingforuser/:id
exports.getSingleTrainingForUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let strainingforuser = await TrainingForUser.findById(id);

  if (!strainingforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    strainingforuser,
  });
});

exports.getAllSortedTrainingUsers = catchAsyncErrors(async (req, res, next) => {
  let taskforuser , sortedTasks;
  let username = req.body?.username;
  let todaysDate = req.body?.todaysDate;
  let PresentDate = req.body.date;
  try {
    taskforuser = await TrainingForUser.find({},{
      taskstatus:1 ,
      taskdetails:1 ,
      timetodo:1 ,
      username:1 ,
      priority:1 ,
      trainingdetails:1 ,
      frequency:1 ,
      schedule:1 ,
      questioncount:1 ,
      typequestion:1 ,
      category:1 ,
      subcategory:1 ,
      duration:1 ,
      breakup:1 ,
      description:1 ,
      required:1 ,
      taskassigneddate:1 ,
      // trainingdocuments:1 ,

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


  let anstaskOnProgress = taskforuser?.length > 0 ? taskforuser?.filter(data => data?.username === username && data.taskdetails !== "Manual" && data.taskstatus === "OnProgress") : []
  let anstaskUserPanelSchedule = taskforuser?.length > 0 ? taskforuser?.filter(data => data?.username === username && data.taskdetails !== "Manual" && data?.taskdetails === "Mandatory" && data.taskstatus === "Assigned") : []
  let anstaskUserPanelOther = taskforuser?.length > 0 ? taskforuser?.filter(data => data?.username === username && data.taskdetails !== "Manual" && data?.taskdetails !== "Mandatory" && data.taskstatus === "Assigned") : []
  //Assigned
  let finalSchedule = anstaskUserPanelSchedule?.length > 0 ? anstaskUserPanelSchedule?.sort((a, b) => frequencyOrder[a.frequency] - frequencyOrder[b.frequency]) : [];
  let onProgressTask = anstaskOnProgress?.length > 0 ? anstaskOnProgress : []

  let final = [...onProgressTask, ...finalSchedule , ...anstaskUserPanelOther]


  const uniqueObjects = [];
  const uniqueKeys = new Set();
  final?.forEach(obj => {
      const key = `${obj.trainingdetails}-${obj.username}-${obj.frequency}-${obj.duration}-${obj.taskassigneddate}`;
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
exports.getAllTrainingOnlineTestQuestions = catchAsyncErrors(async (req, res, next) => {
let trainingdetails , trainingforuser , taskforuser;
  let data = req.body.data;
  try {
    trainingforuser = await TrainingForUser.aggregate([
      {
        $match: {
          typequestion: data?.type,
          taskstatus: "Assigned",
          testnames:  `${data?.testname}-(${data?.category}-${data?.subcategory})`
        }
      },
      {
        $project: {
          taskstatus: 1,
          taskdetails: 1,
          timetodo: 1,
          username: 1,
          priority: 1,
          testnames: 1,
          trainingdetails: 1,
          frequency: 1,
          schedule: 1,
          questioncount: 1,
          typequestion: 1,
          category: 1,
          subcategory: 1,
          duration: 1,
          breakup: 1,
          description: 1,
          required: 1,
          taskassigneddate: 1
        }
      }
    ])
    trainingdetails = await TrainingDetails.aggregate([
      {
        $match: {
          typequestion: data?.type,
          status: "Active",
          testnames:  `${data?.testname}-(${data?.category}-${data?.subcategory})`
        }
      },
      {
        $project: {
          _id:1,
          questioncount: 1,
          typequestion: 1,
          testnames:1,
          trainingdetailslog:1
        }
      }
    ])
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
    trainingforuser, 
    trainingdetails
  });
});
exports.getAllTrainingOnlineTestQuestionsBulkDelete = catchAsyncErrors(async (req, res, next) => {
let trainingdetails , trainingforuser , result , count;
  let ids = req.body.id;
  try {

    const orgDataas = await OnlineTestMaster.find();
    const orgTrainUser = await TrainingForUser.find({},{
      typequestion: 1,
      taskstatus:1,
      testnames:1
    });
    const orgTrainDetails = await TrainingDetails.find({status: "Active"},{
      typequestion: 1,
      status:1,
      testnames:1
    });

    const datas = orgDataas?.filter(data => ids?.includes(data._id?.toString()));

    const unmatchedTrainingUser = datas.filter(answers => orgTrainUser.some(sub => 
      sub.typequestion === answers.type && sub.taskstatus === "Assigned" && 
      sub.testnames === `${answers?.testname}-(${answers?.category}-${answers?.subcategory})`))
      ?.map(data => data._id?.toString());

    const unmatchedTrainingDetails = datas.filter(answers => orgTrainDetails.some(sub => 
      sub.typequestion === answers.type && sub.status === "Active" && 
      sub.testnames === `${answers?.testname}-(${answers?.category}-${answers?.subcategory})`))
      ?.map(data => data._id?.toString());

    const duplicateId = [...unmatchedTrainingUser , ...unmatchedTrainingDetails]
    result = ids?.filter(data => !duplicateId?.includes(data))
    count = ids?.filter(data => !duplicateId?.includes(data))?.length



  } catch (err) {

    return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
    result, 
    count
  });
});

// update TrainingForUser by id => /api/trainingforuser/:id
exports.updateTrainingForUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let utrainingforuser = await TrainingForUser.findByIdAndUpdate(id, req.body);
  if (!utrainingforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete TrainingForUser by id => /api/trainingforuser/:id
exports.deleteTrainingForUser = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dtrainingforuser = await TrainingForUser.findByIdAndRemove(id);

  if (!dtrainingforuser) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});