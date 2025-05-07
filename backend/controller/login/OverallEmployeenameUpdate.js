const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");

const Hirerarchi = require("../../model/modules/setup/hierarchy");
const AssignBranch = require("../../model/modules/assignbranch");
const EmployeeDocuments = require("../../model/login/employeedocuments");
const Noticeperiodapply = require("../../model/modules/recruitment/noticeperiodapply");
const Holiday = require("../../model/modules/setup/holidayModel");
const ScheduleMeeting = require("../../model/modules/setup/schedulemeeting");
const Events = require("../../model/modules/setup/eventsModel");
const DocumentPreparation = require("../../model/modules/documentpreparation");
const IdCardpreparation = require("../../model/modules/documents/Idcardtemplate");
const Addcandidate = require("../../model/modules/recruitment/addcandidate");
const Excelmaprespersondata = require("../../model/modules/excel/excelmapresperson");
const TicketGrouping = require("../../model/modules/clientSupport/manageTicketGrouping");
const IndividualSettings = require("../../model/modules/settings/IndividualSettingsModel");
const AttendanceControlCriteria = require("../../model/modules/settings/Attendancecontrolcriteria");
const AutoLogout = require("../../model/modules/settings/autologout");
const Templatelist = require("../../model/modules/settings/Templatelist");
const FileShare = require("../../model/modules/setup/announcement/FileShareModel");
const Visitor = require("../../model/modules/interactors/visitor");
const Checklistverificationmaster = require("../../model/modules/interview/checklistverificationmaster");
const MyCheckList = require("../../model/modules/interview/Myinterviewchecklist");
const Assignedinterviewer = require("../../model/modules/interview/assigninterviewer");
const Leavecriteria = require("../../model/modules/leave/leavecriteria");
const ApplyLeave = require("../../model/modules/leave/applyleave");
const Permission = require("../../model/modules/permission/permission");
const LeaveVerification = require("../../model/modules/leave/leaveverification");
const AssignDocument = require("../../model/modules/documents/assigndocuments");
const Maintenance = require("../../model/modules/account/maintenance");
const TaskMaintenanceNonScheduleGrouping = require("../../model/modules/account/taskmaintenancenongrouping");
const Employeeasset = require("../../model/modules/account/employeeassetdistribution");
const Addpassword = require("../../model/modules/password/addPasswordModel");
const TaskNonScheduleGrouping = require("../../model/modules/task/nonschedulegrouping");
const TaskMaintenanceForUser = require("../../model/modules/account/taskmaintenanceforuser");
const TaskForUser = require("../../model/modules/task/taskforuser");
const Teamgrouping = require("../../model/modules/tickets/teamgrouping");
const Raiseticketmaster = require("../../model/modules/tickets/raiseticketmaster");
const Payruncontrol = require("../../model/modules/production/payruncontrol");
const Loan = require("../../model/modules/loan");
const TaskAssignBoardList = require("../../model/modules/project/taskassignboardlist");
const Templatecontrolpanel = require("../../model/modules/documents/Templatecontrolpnael");
const ProductionOriginal = require("../../model/modules/production/productionoriginal");
const ProductionTemp = require("../../model/modules/production/productiontemp");
const ClientUserID = require("../../model/modules/production/ClientUserIDModel");
const Nonproduction = require("../../model/modules/production/nonproduction/nonproduction");
const NonProductionunitAllot = require("../../model/modules/production/nonproduction/NonProductionunitallotModel");
const TrainingNonSchedule = require("../../model/modules/task/tasknonscheduletraining");
const ProductionDayList = require("../../model/modules/production/productiondaylist");
const ProductionDay = require("../../model/modules/production/productionday");
const PenaltyClientError = require("../../model/modules/penalty/penaltyclienterror");
const TrainingUserResponse = require("../../model/modules/task/trainingUserResponse");
const Weekoffpresent = require("../../model/modules/weekoffcontrolpanel");
const User = require("../../model/login/auth");
const TempPointsUpload = require("../../model/modules/production/tempPointsUpload");
const PenaltyDayUpload = require("../../model/modules/penalty/penaltydayupload");
const PenaltyClientAmountUpload = require("../../model/modules/production/penaltyclienterrorupload");
const TrainingForUser = require("../../model/modules/task/trainingforuser");
const TaskDesignationGrouping = require("../../model/modules/task/taskdesignationgrouping");
const TrainingDetails = require("../../model/modules/task/trainingdetails");

const batchSize = 5; // Define a batch size

const updateOperations = (oldname, newname) => [
  Hirerarchi.updateMany(
    { employeename: oldname },
    { $set: { employeename: newname } }
  ),
  AssignBranch.updateMany(
    { employee: oldname },
    { $set: { employee: newname } }
  ),
  EmployeeDocuments.updateMany(
    { companyname: oldname },
    { $set: { companyname: newname } }
  ), // STRING

  Noticeperiodapply.updateMany(
    { empname: oldname },
    { $set: { empname: newname } }
  ),

  Holiday.updateMany(
    { employee: oldname },
    { $set: { "employee.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  ScheduleMeeting.updateMany(
    {
      $or: [{ participants: oldname }, { interviewer: oldname }],
    },
    {
      $set: {
        "participants.$[elemFrom]": newname,
        "interviewer.$[elemTo]": newname,
      },
    },
    {
      arrayFilters: [{ elemFrom: oldname }, { elemTo: oldname }],
    }
  ),
  Events.updateMany(
    { participants: oldname },
    { $set: { "participants.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  DocumentPreparation.updateMany(
    //  two STRING VARIALES
    { $or: [{ issuingauthority: oldname }, { person: oldname }] },
    [
      {
        $set: {
          issuingauthority: {
            $cond: {
              if: { $eq: ["$issuingauthority", oldname] },
              then: newname,
              else: "$issuingauthority",
            },
          },
          person: {
            $cond: {
              if: { $eq: ["$person", oldname] },
              then: newname,
              else: "$person",
            },
          },
        },
      },
    ]
  ),
  IdCardpreparation.updateMany(
    { person: oldname },
    { $set: { "person.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  Addcandidate.updateMany(
    //ARRAY INSIDE AN ARRAY OF OBJECTS
    { "interviewrounds.interviewer": oldname },
    { $set: { "interviewrounds.$[round].interviewer.$[int]": newname } },
    {
      arrayFilters: [{ "round.interviewer": oldname }, { int: oldname }],
    }
  ),
  Excelmaprespersondata.updateMany(
    //STRING INSIDE AN ARRAY OF OBJECTS
    { "todo.resperson": oldname },
    { $set: { "todo.$[round].resperson": newname } },
    {
      arrayFilters: [{ "round.resperson": oldname }],
    }
  ),

  TicketGrouping.updateMany(
    { employee: oldname },
    { $set: { "employee.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  IndividualSettings.updateMany(
    { companyname: oldname },
    { $set: { "companyname.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  AttendanceControlCriteria.updateMany(
    { "todos.employeename": oldname },
    { $set: { "todos.$[round].employeename": newname } },
    {
      arrayFilters: [{ "round.employeename": oldname }],
    }
  ),
  AutoLogout.updateMany(
    { "todos.employeename": oldname },
    { $set: { "todos.$[round].employeename": newname } },
    {
      arrayFilters: [{ "round.employeename": oldname }],
    }
  ),
  Templatelist.updateMany(
    { employeename: oldname },
    { $set: { "employeename.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  FileShare.updateMany(
    { employeename: oldname },
    { $set: { "employeename.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  Visitor.updateMany(
    {
      $or: [
        { meetingpersonemployeename: oldname },
        { detailsaddedby: oldname },
        { "followuparray.meetingpersonemployeename": oldname },
      ],
    },
    {
      $set: {
        meetingpersonemployeename: newname,
        detailsaddedby: newname,
        "followuparray.$[elem].meetingpersonemployeename": newname,
      },
    },
    {
      arrayFilters: [{ "elem.meetingpersonemployeename": oldname }],
    }
  ),
  Checklistverificationmaster.updateMany(
    { employee: oldname },
    { $set: { "employee.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),

  MyCheckList.updateMany(
    //ARRAY INSIDE AN ARRAY OF OBJECTS
    { "groups.employee": oldname },
    { $set: { "groups.$[user].employee.$[int]": newname } },
    {
      arrayFilters: [{ "user.employee": oldname }, { int: oldname }],
    }
  ),
  Assignedinterviewer.updateMany(
    { employee: oldname },
    { $set: { "employee.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  Leavecriteria.updateMany(
    { employee: oldname },
    { $set: { "employee.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  ApplyLeave.updateMany(
    { $or: [{ employeename: oldname }, { reportingto: oldname }] },
    [
      {
        $set: {
          employeename: {
            $cond: {
              if: { $eq: ["$employeename", oldname] },
              then: newname,
              else: "$employeename",
            },
          },
          reportingto: {
            $cond: {
              if: { $eq: ["$reportingto", oldname] },
              then: newname,
              else: "$reportingto",
            },
          },
        },
      },
    ]
  ),
  Permission.updateMany(
    { $or: [{ employeename: oldname }, { reportingto: oldname }] },
    [
      {
        $set: {
          employeename: {
            $cond: {
              if: { $eq: ["$employeename", oldname] },
              then: newname,
              else: "$employeename",
            },
          },
          reportingto: {
            $cond: {
              if: { $eq: ["$reportingto", oldname] },
              then: newname,
              else: "$reportingto",
            },
          },
        },
      },
    ]
  ),
  LeaveVerification.updateMany(
    {
      $or: [{ employeenamefrom: oldname }, { employeenameto: oldname }],
    },
    {
      $set: {
        "employeenamefrom.$[elemFrom]": newname,
        "employeenameto.$[elemTo]": newname,
      },
    },
    {
      arrayFilters: [{ elemFrom: oldname }, { elemTo: oldname }],
    }
  ),
  AssignDocument.updateMany(
    { employeename: oldname },
    { $set: { "employeename.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  Maintenance.updateMany(
    { employeenameto: oldname },
    { $set: { "employeenameto.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  TaskMaintenanceNonScheduleGrouping.updateMany(
    { employeenames: oldname },
    { $set: { "employeenames.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  Employeeasset.updateMany(
    { employeenameto: oldname },
    { $set: { "employeenameto.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  Addpassword.updateMany(
    { employeename: oldname },
    { $set: { employeename: newname } }
  ),
  TaskNonScheduleGrouping.updateMany(
    { employeenames: oldname },
    { $set: { "employeenames.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),

  TaskMaintenanceForUser.updateMany(
    { username: oldname },
    { $set: { username: newname } }
  ),

  TaskForUser.updateMany(
    {
      $or: [{ username: oldname }, { completedbyuser: oldname }],
    },
    {
      $set: {
        username: oldname,
        ...(oldname && { completedbyuser: newname }),
      },
    },
    {
      arrayFilters: [{ "elem.completedbyuser": oldname }],
    }
  ),
  Teamgrouping.updateMany(
    //  TWO DIFFERENT ARRAYS
    {
      $or: [{ employeenamefrom: oldname }, { employeenameto: oldname }],
    },
    {
      $set: {
        "employeenamefrom.$[elemFrom]": newname,
        "employeenameto.$[elemTo]": newname,
      },
    },
    {
      arrayFilters: [{ elemFrom: oldname }, { elemTo: oldname }],
    }
  ),
  Raiseticketmaster.updateMany(
    //  ALL TYPE OF
    {
      $or: [
        { raisedby: oldname },
        { employeename: oldname },
        { employeenameRaise: oldname },
        { forwardedemployee: oldname },
        { "forwardedlog.forwardedby": oldname },
        { ticketclosed: oldname },
      ],
    },
    {
      $set: {
        raisedby: newname,
        "employeename.$[elem]": newname,
        "employeenameRaise.$[elem]": newname,
        "forwardedemployee.$[elem]": newname,
        "forwardedlog.$[log].forwardedby": newname,
        ticketclosed: newname,
      },
    },
    {
      arrayFilters: [{ elem: oldname }, { "log.forwardedby": oldname }],
    }
  ),
  Payruncontrol.updateMany(
    { empname: oldname },
    { $set: { "empname.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  Loan.updateMany({ companyname: oldname }, { $set: { companyname: newname } }),
  TaskAssignBoardList.updateMany(
    {
      $or: [
        { "uidesign.taskdev": oldname },
        { "testing.taskdev": oldname },
        { "develop.taskdev": oldname },
        { "testinguidesign.taskdev": oldname },
      ],
    },
    {
      $set: {
        "uidesign.$[uidesignElem].taskdev": newname,
        "testing.$[testingElem].taskdev": newname,
        "develop.$[developElem].taskdev": newname,
        "testinguidesign.$[testinguidesignElem].taskdev": newname,
      },
    },
    {
      arrayFilters: [
        { "uidesignElem.taskdev": oldname },
        { "testingElem.taskdev": oldname },
        { "developElem.taskdev": oldname },
        { "testinguidesignElem.taskdev": oldname },
      ],
    }
  ),

  Templatecontrolpanel.updateMany(
    //array of object inside an array of object
    {
      "templatecontrolpanellog.documentsignature.employee": oldname,
    },
    {
      $set: {
        "templatecontrolpanellog.$[log].documentsignature.$[signature].employee":
          newname,
      },
    },
    {
      arrayFilters: [
        { "log.documentsignature.employee": oldname },
        { "signature.employee": oldname },
      ],
    }
  ),
  ProductionOriginal.updateMany(
    //STRING INSIDE AN ARRAY OF OBJECTS
    { "addedby.companyname": oldname },
    { $set: { "addedby.$[user].companyname": newname } },
    {
      arrayFilters: [{ "user.companyname": oldname }],
    }
  ),
  ProductionTemp.updateMany(
    //STRING INSIDE AN ARRAY OF OBJECTS
    { "addedby.companyname": oldname },
    { $set: { "addedby.$[user].companyname": newname } },
    {
      arrayFilters: [{ "user.companyname": oldname }],
    }
  ),
  ClientUserID.updateMany(
    //string outside and inside an array of object
    {
      $or: [{ empname: oldname }, { "loginallotlog.empname": oldname }],
    },
    {
      $set: {
        empname: newname,
        "loginallotlog.$[log].empname": newname,
      },
    },
    {
      arrayFilters: [{ "log.empname": oldname }],
    }
  ),
  Nonproduction.updateMany({ name: oldname }, { $set: { name: newname } }),
  NonProductionunitAllot.updateMany(
    { employeename: oldname },
    { $set: { employeename: newname } }
  ),
  TrainingNonSchedule.updateMany(
    { employeenames: oldname },
    { $set: { "employeenames.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] }
  ),
  ProductionDayList.updateMany(
    { empname: oldname },
    { $set: { empname: newname } }
  ),
  ProductionDay.updateMany(
    { companyname: oldname },
    { $set: { companyname: newname } }
  ),
  PenaltyClientError.updateMany(
    { employeename: oldname },
    { $set: { employeename: newname } }
  ),
  TrainingUserResponse.updateMany(
    { username: oldname },
    { $set: { username: newname } }
  ),
  Weekoffpresent.updateMany(
    { employee: oldname },
    { $set: { "employee.$[elem]": newname } },
    { arrayFilters: [{ elem: oldname }] } //ARRAY
  ),
  TempPointsUpload.updateMany(
    //STRING INSIDE AN ARRAY OF OBJECTS
    { "uploaddata.name": oldname },
    { $set: { "uploaddata.$[user].name": newname } },
    {
      arrayFilters: [{ "user.name": oldname }],
    }
  ),
  PenaltyDayUpload.updateMany(
    //STRING INSIDE AN ARRAY OF OBJECTS
    { "uploaddata.name": oldname },
    { $set: { "uploaddata.$[user].name": newname } },
    {
      arrayFilters: [{ "user.name": oldname }],
    }
  ),
  PenaltyClientAmountUpload.updateMany(
    //STRING INSIDE AN ARRAY OF OBJECTS
    { "uploaddata.name": oldname },
    { $set: { "uploaddata.$[user].name": newname } },
    {
      arrayFilters: [{ "user.name": oldname }],
    }
  ),

  User.updateMany(
    {
      $or: [
        { reportingto: oldname },
        { "shiftallot.username": oldname },
        { "designationlog.username": oldname },
        { "departmentlog.username": oldname },
        { "processlog.empname": oldname },
      ],
    },
    {
      $set: {
        reportingto: newname,
        "shiftallot.$[elem].username": newname,
        "designationlog.$[deslog].username": newname,
        "departmentlog.$[deplog].username": newname,
        "processlog.$[prolog].empname": newname,
      },
    },
    {
      arrayFilters: [
        { "elem.username": oldname },
        { "deslog.username": oldname },
        { "deplog.username": oldname },
        // { "prolog.empname": oldname },
      ],
    }
  ),
  TaskDesignationGrouping.updateMany(
    {
      $or: [
        { employeenames: oldname },
        { "taskdesignationlog.employeenames": oldname },
      ],
    },
    {
      $set: {
        "employeenames.$[elem]": newname,
        "taskdesignationlog.$[task].employeenames.$[taskElem]": newname,
      },
    },
    {
      arrayFilters: [
        { elem: oldname },
        { "task.employeenames": { $exists: true } },
        { taskElem: oldname },
      ],
    }
  ),
  TrainingDetails.updateMany(
    {
      $or: [
        { employeenames: oldname },
        { "trainingdetailslog.employeenames": oldname },
      ],
    },
    {
      $set: {
        "employeenames.$[elem]": newname,
        "trainingdetailslog.$[train].employeenames.$[trainElem]": newname,
      },
    },
    {
      arrayFilters: [
        { elem: oldname },
        { "train.employeenames": { $exists: true } },
        { trainElem: oldname },
      ],
    }
  ),
  TrainingForUser.updateMany(
    { username: oldname },
    { $set: { username: newname } }
  ),
];

const runBatchUpdates = async (operations, batchSize, from) => {
  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize);
    try {
      await Promise.all(batch);
    } catch (error) {
      if (error.response) {
        return next(
          new ErrorHandler(
            error.response.data.message || "An error occurred",
            error.response.status || 500
          )
        );
      } else if (error.request) {
        return next(new ErrorHandler("No response received from server", 500));
      } else {
        return next(new ErrorHandler("Error Updating Employee Names!", 500));
      }
    }
  }
};
const runEmpCodeBatchUpdates = async (operations, batchSize, from) => {
  for (let i = 0; i < operations.length; i += batchSize) {
    const batch = operations.slice(i, i + batchSize);
    try {
      await Promise.all(batch);
    } catch (error) {
      if (error.response) {
        return next(
          new ErrorHandler(
            error.response.data.message || "An error occurred",
            error.response.status || 500
          )
        );
      } else if (error.request) {
        return next(new ErrorHandler("No response received from server", 500));
      } else {
        return next(new ErrorHandler("Error Updating Employee Names!", 500));
      }
    }
  }
};

exports.updateOverallEmployeename = catchAsyncErrors(async (req, res, next) => {
  const { oldname, newname } = req.body;
  try {
    await runBatchUpdates(
      updateOperations(oldname, newname),
      batchSize,
      "empname"
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    if (error.response) {
      return next(
        new ErrorHandler(
          error.response.data.message || "An error occurred",
          error.response.status || 500
        )
      );
    } else if (error.request) {
      return next(new ErrorHandler("No response received from server", 500));
    } else {
      return next(new ErrorHandler("Error Updating Employee Names!", 500));
    }
  }
});

const updateEmployeeCodeOperations = (oldempcode, newempcode) => [
  Hirerarchi.updateMany(
    { empcode: oldempcode },
    { $set: { empcode: newempcode } }
  ),
  AssignBranch.updateMany(
    { employeecode: oldempcode },
    { $set: { employeecode: newempcode } }
  ),
  EmployeeDocuments.updateMany(
    { empcode: oldempcode },
    { $set: { empcode: newempcode } }
  ),
  Noticeperiodapply.updateMany(
    { empcode: oldempcode },
    { $set: { empcode: newempcode } }
  ),
  ApplyLeave.updateMany(
    { employeeid: oldempcode },
    { $set: { employeeid: newempcode } }
  ),
  Permission.updateMany(
    { employeeid: oldempcode },
    { $set: { employeeid: newempcode } }
  ),
  IdCardpreparation.updateMany(
    { "idcard.empcode": oldempcode },
    { $set: { "idcard.$[user].empcode": newempcode } },
    {
      arrayFilters: [{ "user.empcode": oldempcode }],
    }
  ),
  Permission.updateMany(
    { employeeid: oldempcode },
    { $set: { employeeid: newempcode } }
  ),
  Raiseticketmaster.updateMany(
    { employeecode: oldempcode },
    { $set: { "employeecode.$[elem]": newempcode } },
    { arrayFilters: [{ elem: oldempcode }] } //ARRAY
  ),
  Loan.updateMany({ empcode: oldempcode }, { $set: { empcode: newempcode } }),
  ClientUserID.updateMany(
    {
      $or: [{ empcode: oldempcode }, { "loginallotlog.empcode": oldempcode }],
    },
    {
      $set: {
        empcode: newempcode,
        "loginallotlog.$[log].empcode": newempcode,
      },
    },
    {
      arrayFilters: [{ "log.empcode": oldempcode }],
    }
  ),
  Nonproduction.updateMany(
    { empcode: oldempcode },
    { $set: { empcode: newempcode } }
  ),
  NonProductionunitAllot.updateMany(
    { employeecode: oldempcode },
    { $set: { employeecode: newempcode } }
  ),
  ProductionDayList.updateMany(
    { empcode: oldempcode },
    { $set: { empcode: newempcode } }
  ),
  TempPointsUpload.updateMany(
    //STRING INSIDE AN ARRAY OF OBJECTS
    { "uploaddata.empcode": oldempcode },
    { $set: { "uploaddata.$[user].empcode": newempcode } },
    {
      arrayFilters: [{ "user.empcode": oldempcode }],
    }
  ),
  PenaltyDayUpload.updateMany(
    //STRING INSIDE AN ARRAY OF OBJECTS
    { "uploaddata.empcode": oldempcode },
    { $set: { "uploaddata.$[user].empcode": newempcode } },
    {
      arrayFilters: [{ "user.empcode": oldempcode }],
    }
  ),
  PenaltyClientAmountUpload.updateMany(
    //STRING INSIDE AN ARRAY OF OBJECTS
    { "uploaddata.empcode": oldempcode },
    { $set: { "uploaddata.$[user].empcode": newempcode } },
    {
      arrayFilters: [{ "user.empcode": oldempcode }],
    }
  ),
  User.updateMany(
    {
      $or: [
        { "shiftallot.empcode": oldempcode },
        { "departmentlog.userid": oldempcode },
      ],
    },
    {
      $set: {
        "shiftallot.$[elem].empcode": newempcode,
        "departmentlog.$[deplog].userid": newempcode,
      },
    },
    {
      arrayFilters: [
        { "elem.empcode": oldempcode },
        { "deplog.userid": oldempcode },
      ],
    }
  ),
];

exports.updateOverallEmployeeCode = catchAsyncErrors(async (req, res, next) => {
  const { oldempcode, newempcode } = req.body;
  try {
    await runEmpCodeBatchUpdates(
      updateEmployeeCodeOperations(oldempcode, newempcode),
      batchSize,
      "empcode"
    );

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    if (error.response) {
      return next(
        new ErrorHandler(
          error.response.data.message || "An error occurred",
          error.response.status || 500
        )
      );
    } else if (error.request) {
      return next(new ErrorHandler("No response received from server", 500));
    } else {
      return next(new ErrorHandler("Error Updating Employee Names!", 500));
    }
  }
});