const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");

const Approvevacancies = require("../../model/modules/recruitment/vacancyposition")
const Unit = require("../../model/modules/unit")
const Hierarchy = require("../../model/modules/setup/hierarchy")
const Areagrouping = require("../../model/modules/areagrouping")
const Locationgrouping = require("../../model/modules/locationgrouping")
const Floor = require("../../model/modules/floor")
const workStation = require("../../model/modules/workstationmodel")
const Manpower = require("../../model/modules/manpower")
const User = require("../../model/login/auth");
const Teams = require("../../model/modules/teams");
const Idcardpreparation = require("../../model/modules/documents/Idcardtemplate");
const Documentpreperation = require("../../model/modules/documentpreparation");
const Noticeperiodapply = require("../../model/modules/recruitment/noticeperiodapply");
const Weekoffpresent = require("../../model/modules/weekoffcontrolpanel");
const TemplateControlPanel = require("../../model/modules/documents/Templatecontrolpnael");
const Processqueuename = require("../../model/modules/production/ProcessQueueNameModel");
const ClientuserId = require("../../model/modules/production/ClientUserIDModel");
const Targetpoints = require("../../model/modules/production/targetpoints");
const EraAmount = require("../../model/modules/production/EraAmountModel");
const RevenueAmount = require("../../model/modules/production/RevenueAmountModel");
const ProcessTeam = require("../../model/modules/production/ProcessTeamModel");
const Acpointcalculation = require("../../model/modules/production/acpointscalculation");
const MinimumPoints = require("../../model/modules/production/minimumpoints");
const DayPointsUpload = require("../../model/modules/production/dayPointsUpload");
const DayPointsUploadTemp = require("../../model/modules/production/daypointsuploadtemp");
const Penaltyclienterror = require("../../model/modules/penalty/penaltyclienterror");
const Penaltydayupload = require("../../model/modules/penalty/penaltydayupload");
const Advance = require("../../model/modules/advance");
const Loan = require("../../model/modules/loan");
const Employeeasset = require("../../model/modules/account/employeeassetdistribution");
const Stockmanage = require("../../model/modules/stockpurchase/stockmanage");
const Stock = require("../../model/modules/stockpurchase/stock");
const Manualstock = require("../../model/modules/stockpurchase/manualstockentry");
const Ebservicemaster = require("../../model/modules/eb/ebservicemaster");
const EbUseInstrument = require("../../model/modules/eb/ebuseinstrument");
const Ebrates = require("../../model/modules/eb/ebrates");
const Ebreadingdetail = require("../../model/modules/eb/ebreadingdetails");
const Powerstation = require("../../model/modules/eb/powerstation");
const AddPermission = require("../../model/modules/permission/permission");
const Ebmaterialdetails = require("../../model/modules/eb/ebmaterialdetails");
const Assigninterviewer = require("../../model/modules/interview/assigninterviewer");
const Visitors = require("../../model/modules/interactors/visitor");
const IndividualSettings = require("../../model/modules/settings/IndividualSettingsModel");
const Clockinip = require("../../model/modules/settings/clockinipModel");
const Attendancecontrolcriteria = require("../../model/modules/settings/Attendancecontrolcriteria");
const AutoLogout = require("../../model/modules/settings/autologout");
const Designation = require("../../model/modules/designation");
const Assignbranch = require("../../model/modules/assignbranch");
const Draft = require("../../model/modules/draft");
const Holiday = require("../../model/modules/setup/holidayModel");
const ScheduleMeeting = require("../../model/modules/setup/schedulemeeting");
const Events = require("../../model/modules/setup/eventsModel");
const Announcement = require("../../model/modules/setup/announcement/AnnouncementModel");
const ShiftRoaster = require("../../model/modules/shiftroaster");
const Shift = require("../../model/modules/shift");
const jobOpenings = require("../../model/modules/recruitment/jobopenings");
const Candidate = require("../../model/modules/recruitment/addcandidate");
const IpMaster = require("../../model/modules/account/ipmodel");
const AddPassword = require("../../model/modules/password/addPasswordModel");
const LeaveVerification = require("../../model/modules/leave/leaveverification");
const Checklistverificationmaster = require("../../model/modules/interview/checklistverificationmaster");
const AdminOverAllSettings = require("../../model/modules/settings/AdminOverAllSettingsModel");
const FileShare = require("../../model/modules/setup/announcement/FileShareModel");
const TicketGrouping = require("../../model/modules/clientSupport/manageTicketGrouping");
const Raiseticketmaster = require("../../model/modules/tickets/raiseticketmaster");
const payrun = require("../../model/modules/production/payruncontrol");
const Addtoprintqueue = require("../../model/modules/account/addtoprintqueue");
const TaskNonScheduleGrouping = require("../../model/modules/task/nonschedulegrouping");
const TaskDesignationGrouping = require("../../model/modules/task/taskdesignationgrouping");
const Leavecriteria = require("../../model/modules/leave/leavecriteria");
const Applyleave = require("../../model/modules/leave/applyleave");
const Teamgrouping = require("../../model/modules/tickets/teamgrouping");
const TempPoints = require("../../model/modules/production/tempPointsUpload");
const AssignDocument = require("../../model/modules/documents/assigndocuments");
const TemplateList = require("../../model/modules/settings/Templatelist");
const Payrunlist = require("../../model/modules/production/payrunlist");
const Myverification = require("../../model/modules/settings/Myverification");
const Excel = require("../../model/modules/excel/excel");
const Excelmapdataresperson = require("../../model/modules/excel/excelmapresperson");
const Nonproductionunitallot = require("../../model/modules/production/nonproduction/NonProductionunitallotModel");
const TaskDesignationGroupingSchema = require("../../model/modules/task/taskdesignationgrouping");
const TrainingDeatils = require("../../model/modules/task/trainingdetails");

const batchSize = 5; // Define a batch size

const updateOperations = (oldname, newname) => [
  //facility
  Noticeperiodapply.updateMany({ team: oldname }, { $set: { team: newname } }),
  Weekoffpresent.updateMany({ team: oldname }, { $set: { team: newname } }),
  Documentpreperation.updateMany({ team: oldname }, { $set: { team: newname } }),
  Idcardpreparation.updateMany({ team: oldname }, { $set: { team: newname } }),
  ProcessTeam.updateMany({ team: oldname }, { $set: { team: newname } }),
  MinimumPoints.updateMany({ team: oldname }, { $set: { team: newname } }),
  Penaltyclienterror.updateMany({ team: oldname }, { $set: { team: newname } }),
  Advance.updateMany({ team: oldname }, { $set: { team: newname } }),
  Loan.updateMany({ team: oldname }, { $set: { team: newname } }),
  Assigninterviewer.updateMany({ toteam: oldname }, { $set: { toteam: newname } }),
  IndividualSettings.updateMany({ team: oldname }, { $set: { team: newname } }),
  Myverification.updateMany({ team: oldname }, { $set: { team: newname } }),
  ClientuserId.updateMany({ team: oldname }, { $set: { team: newname } }),
  Nonproductionunitallot.updateMany({ team: oldname }, { $set: { team: newname } }),
  DayPointsUpload.updateMany({ team: oldname }, { $set: { team: newname } }),
  Raiseticketmaster.updateMany({ team: oldname }, { $set: { team: newname } }),
  Raiseticketmaster.updateMany({ teamRaise: oldname }, { $set: { teamRaise: newname } }),
  AddPermission.updateMany({ team: oldname }, { $set: { team: newname } }),

  Applyleave.updateMany(
    { team: oldname },
    { $set: { "team.$[teamleaveapp]": newname } },
    { arrayFilters: [{ teamleaveapp: oldname }] }
  ),
  TaskNonScheduleGrouping.updateMany(
    { team: oldname },
    { $set: { "team.$[teamschgrop]": newname } },
    { arrayFilters: [{ teamschgrop: oldname }] }
  ),

  TaskDesignationGroupingSchema.updateMany(
    { team: oldname },
    { $set: { "team.$[teamgropde]": newname } },
    { arrayFilters: [{ teamgropde: oldname }] }
  ),
  TaskDesignationGroupingSchema.updateMany(
    {
      "taskdesignationlog.team": oldname,
    },
    {
      $set: {
        "taskdesignationlog.$[talogde].team": newname,
      },
    },
    {
      arrayFilters: [{ "talogde.team": oldname }],
    }
  ),
  TrainingDeatils.updateMany(
    { team: oldname },
    { $set: { "team.$[teamgrop]": newname } },
    { arrayFilters: [{ teamgrop: oldname }] }
  ),
  TrainingDeatils.updateMany(
    {
      "trainingdetailslog.team": oldname,
    },
    {
      $set: {
        "trainingdetailslog.$[talog].team": newname,
      },
    },
    {
      arrayFilters: [{ "talog.team": oldname }],
    }
  ),
  DayPointsUpload.updateMany(
    {
      "uploaddata.team": oldname,
    },
    {
      $set: {
        "uploaddata.$[uplog].team": newname,
      },
    },
    {
      arrayFilters: [{ "uplog.team": oldname }],
    }
  ),
  ClientuserId.updateMany(
    {
      "loginallotlog.team": oldname,
    },
    {
      $set: {
        "loginallotlog.$[log].team": newname,
      },
    },
    {
      arrayFilters: [{ "log.team": oldname }],
    }
  ),
  Excel.updateMany(
    {
      "exceldata.team": oldname,
    },
    {
      $set: {
        "exceldata.$[exlog].team": newname,
      },
    },
    {
      arrayFilters: [{ "exlog.team": oldname }],
    }
  ),
  Excelmapdataresperson.updateMany(
    {
      "todo.team": oldname,
    },
    {
      $set: {
        "todo.$[tolog].team": newname,
      },
    },
    {
      arrayFilters: [{ "tolog.team": oldname }],
    }
  ),
  Excelmapdataresperson.updateMany(
    {
      "updatedby.todo.team": oldname,
    },
    {
      $set: {
        "updatedby.$[].todo.$[des].team": newname,
      },
    },
    {
      arrayFilters: [{ "des.team": oldname }],
    }
  ),

  Myverification.updateMany(
    {
      "designationlog.team": oldname,
    },
    {
      $set: {
        "designationlog.$[deslog].team": newname,
      },
    },
    {
      arrayFilters: [{ "deslog.team": oldname }],
    }
  ),
  Myverification.updateMany(
    {
      "departmentlog.team": oldname,
    },
    {
      $set: {
        "departmentlog.$[deplog].team": newname,
      },
    },
    {
      arrayFilters: [{ "deplog.team": oldname }],
    }
  ),
  Myverification.updateMany(
    {
      "departmentlogdates.team": oldname,
    },
    {
      $set: {
        "departmentlogdates.$[depdatlog].team": newname,
      },
    },
    {
      arrayFilters: [{ "depdatlog.team": oldname }],
    }
  ),
  Myverification.updateMany(
    {
      "processlog.team": oldname,
    },
    {
      $set: {
        "processlog.$[procelog].team": newname,
      },
    },
    {
      arrayFilters: [{ "procelog.team": oldname }],
    }
  ),
  Myverification.updateMany(
    {
      "boardingLog.team": oldname,
    },
    {
      $set: {
        "boardingLog.$[bordlog].team": newname,
      },
    },
    {
      arrayFilters: [{ "bordlog.team": oldname }],
    }
  ),
  Myverification.updateMany(
    {
      "shiftallot.team": oldname,
    },
    {
      $set: {
        "shiftallot.$[shiftlog].team": newname,
      },
    },
    {
      arrayFilters: [{ "shiftlog.team": oldname }],
    }
  ),
  Penaltydayupload.updateMany(
    {
      "uploaddata.team": oldname,
    },
    {
      $set: {
        "uploaddata.$[penaltyupload].team": newname,
      },
    },
    {
      arrayFilters: [{ "penaltyupload.team": oldname }],
    }
  ),
  Payrunlist.updateMany(
    {
      "data.team": oldname,
    },
    {
      $set: {
        "data.$[teamlog].team": newname,
      },
    },
    {
      arrayFilters: [{ "teamlog.team": oldname }],
    }
  ),
  TempPoints.updateMany(
    {
      "uploaddata.team": oldname,
    },
    {
      $set: {
        "uploaddata.$[upteam].team": newname,
      },
    },
    {
      arrayFilters: [{ "upteam.team": oldname }],
    }
  ),
  Idcardpreparation.updateMany(
    {
      "idcard.team": oldname,
    },
    {
      $set: {
        "idcard.$[idteam].team": newname,
      },
    },
    {
      arrayFilters: [{ "idteam.team": oldname }],
    }
  ),

  User.updateMany(
    {
      team: oldname,
    },
    {
      $set: {
        team: newname,
      },
    }
  ),
  User.updateMany(
    {
      "designationlog.team": oldname,
    },
    {
      $set: {
        "designationlog.$[deslog].team": newname,
      },
    },
    {
      arrayFilters: [{ "deslog.team": oldname }],
    }
  ),
  User.updateMany(
    {
      "departmentlog.team": oldname,
    },
    {
      $set: {
        "departmentlog.$[deplog].team": newname,
      },
    },
    {
      arrayFilters: [{ "deplog.team": oldname }],
    }
  ),
  User.updateMany(
    {
      "boardingLog.team": oldname,
    },
    {
      $set: {
        "boardingLog.$[bordlog].team": newname,
      },
    },
    {
      arrayFilters: [{ "bordlog.team": oldname }],
    }
  ),
  User.updateMany(
    {
      "shiftallot.team": oldname,
    },
    {
      $set: {
        "shiftallot.$[shiftallot].team": newname,
      },
    },
    {
      arrayFilters: [{ "shiftallot.team": oldname }],
    }
  ),
  User.updateMany(
    {
      "processlog.team": oldname,
    },
    {
      $set: {
        "processlog.$[processalot].team": newname,
      },
    },
    {
      arrayFilters: [{ "processalot.team": oldname }],
    }
  ),
  Draft.updateMany({ team: oldname }, { $set: { team: newname } }),
  Draft.updateMany(
    {
      "designationlog.team": oldname,
    },
    {
      $set: {
        "designationlog.$[deslog].team": newname,
      },
    },
    {
      arrayFilters: [{ "deslog.team": oldname }],
    }
  ),
  Draft.updateMany(
    {
      "departmentlog.team": oldname,
    },
    {
      $set: {
        "departmentlog.$[deplog].team": newname,
      },
    },
    {
      arrayFilters: [{ "deplog.team": oldname }],
    }
  ),
  Draft.updateMany(
    {
      "departmentlogdates.team": oldname,
    },
    {
      $set: {
        "departmentlogdates.$[deplog].team": newname,
      },
    },
    {
      arrayFilters: [{ "deplog.team": oldname }],
    }
  ),
  Draft.updateMany(
    {
      "processlog.team": oldname,
    },
    {
      $set: {
        "processlog.$[deplog].team": newname,
      },
    },
    {
      arrayFilters: [{ "deplog.team": oldname }],
    }
  ),
  Draft.updateMany(
    {
      "boardingLog.team": oldname,
    },
    {
      $set: {
        "boardingLog.$[deplog].team": newname,
      },
    },
    {
      arrayFilters: [{ "deplog.team": oldname }],
    }
  ),
  Draft.updateMany(
    {
      "shiftallot.team": oldname,
    },
    {
      $set: {
        "shiftallot.$[deplog].team": newname,
      },
    },
    {
      arrayFilters: [{ "deplog.team": oldname }],
    }
  ),
  //Array update
  TicketGrouping.updateMany(
    { team: oldname },
    { $set: { "team.$[teamtick]": newname } },
    { arrayFilters: [{ teamtick: oldname }] }
  ),
  FileShare.updateMany(
    { team: oldname },
    { $set: { "team.$[teamfiles]": newname } },
    { arrayFilters: [{ teamfiles: oldname }] }
  ),
  TemplateList.updateMany(
    { team: oldname },
    { $set: { "team.$[teamann]": newname } },
    { arrayFilters: [{ teamann: oldname }] }
  ),
  Visitors.updateMany(
    { meetingpersonteam: oldname },
    { $set: { "meetingpersonteam.$[meetingpersonteamann]": newname } },
    { arrayFilters: [{ meetingpersonteamann: oldname }] }
  ),
  Checklistverificationmaster.updateMany(
    { team: oldname },
    { $set: { "team.$[teamcheck]": newname } },
    { arrayFilters: [{ teamcheck: oldname }] }
  ),
  Assigninterviewer.updateMany(
    { fromteam: oldname },
    { $set: { "fromteam.$[teamfrom]": newname } },
    { arrayFilters: [{ teamfrom: oldname }] }
  ),
  LeaveVerification.updateMany(
    { teamto: oldname },
    { $set: { "teamto.$[teamtoleav]": newname } },
    { arrayFilters: [{ teamtoleav: oldname }] }
  ),
  LeaveVerification.updateMany(
    { teamfrom: oldname },
    { $set: { "teamfrom.$[teamfromleavfrm]": newname } },
    { arrayFilters: [{ teamfromleavfrm: oldname }] }
  ),
  Leavecriteria.updateMany(
    { team: oldname },
    { $set: { "team.$[teamleave]": newname } },
    { arrayFilters: [{ teamleave: oldname }] }
  ),
  Teamgrouping.updateMany(
    { teamfrom: oldname },
    { $set: { "teamfrom.$[teamfromup]": newname } },
    { arrayFilters: [{ teamfromup: oldname }] }
  ),
  Teamgrouping.updateMany(
    { teamto: oldname },
    { $set: { "teamto.$[teamtoup]": newname } },
    { arrayFilters: [{ teamtoup: oldname }] }
  ),
  AddPassword.updateMany(
    { team: oldname },
    { $set: { "team.$[teampass]": newname } },
    { arrayFilters: [{ teampass: oldname }] }
  ),
  Employeeasset.updateMany(
    { teamto: oldname },
    { $set: { "teamto.$[teamempasset]": newname } },
    { arrayFilters: [{ teamempasset: oldname }] }
  ),
  AssignDocument.updateMany(
    { team: oldname },
    { $set: { "team.$[teamassig]": newname } },
    { arrayFilters: [{ teamassig: oldname }] }
  ),
  payrun.updateMany(
    { team: oldname },
    { $set: { "team.$[teampay]": newname } },
    { arrayFilters: [{ teampay: oldname }] }
  ),
  payrun.updateMany(
    { userteam: oldname },
    { $set: { "userteam.$[teamuserpay]": newname } },
    { arrayFilters: [{ teamuserpay: oldname }] }
  ),
  Holiday.updateMany(
    { team: oldname },
    { $set: { "team.$[teamover]": newname } },
    { arrayFilters: [{ teamover: oldname }] }
  ),
  ScheduleMeeting.updateMany(
    { team: oldname },
    { $set: { "team.$[teamname]": newname } },
    { arrayFilters: [{ teamname: oldname }] }
  ),
  ScheduleMeeting.updateMany(
    { hostteam: oldname },
    { $set: { "hostteam.$[hostteamven]": newname } },
    { arrayFilters: [{ hostteamven: oldname }] }
  ),
  Events.updateMany(
    { team: oldname },
    { $set: { "team.$[teamsname]": newname } },
    { arrayFilters: [{ teamsname: oldname }] }
  ),
  Announcement.updateMany(
    { team: oldname },
    { $set: { "team.$[teamann]": newname } },
    { arrayFilters: [{ teamann: oldname }] }
  ),
  AutoLogout.updateMany(
    {
      "todos.team": oldname,
    },
    {
      $set: {
        "todos.$[autologteam].team": newname,
      },
    },
    {
      arrayFilters: [{ "autologteam.team": oldname }],
    }
  ),
  Attendancecontrolcriteria.updateMany(
    {
      "todos.team": oldname,
    },
    {
      $set: {
        "todos.$[attcreteam].team": newname,
      },
    },
    {
      arrayFilters: [{ "attcreteam.team": oldname }],
    }
  ),
  Visitors.updateMany(
    {
      "followuparray.meetingpersonteam": oldname,
    },
    {
      $set: {
        "followuparray.$[deslogteam].meetingpersonteam": newname,
      },
    },
    {
      arrayFilters: [{ "deslogteam.meetingpersonteam": oldname }],
    }
  ),
  TemplateControlPanel.updateMany(
    {
      "documentsignature.team": oldname,
    },
    {
      $set: {
        "documentsignature.$[taskdoc].team": newname,
      },
    },
    {
      arrayFilters: [{ "taskdoc.team": oldname }],
    }
  ),
  TemplateControlPanel.updateMany(
    {
      "templatecontrolpanellog.documentsignature.team": oldname,
    },
    {
      $set: {
        "templatecontrolpanellog.$[].documentsignature.$[taskdes].team": newname,
      },
    },
    {
      arrayFilters: [{ "taskdes.team": oldname }],
    }
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


exports.updateOverallTeamname = catchAsyncErrors(async (req, res, next) => {
  const { oldname, newname } = req.body;

  try {
    await runBatchUpdates(
      updateOperations(oldname, newname),
      batchSize,
      "branchname"
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

exports.getAllTeamCheck = catchAsyncErrors(async (req, res, next) => {
  let noticeperiod, minimumpoints, loan, users, myverification, draft
    ;
  try {
    // Check for floors
    let Query = {
      team: req.body.team,
    };
    noticeperiod = await Noticeperiodapply.find(Query, {
      _id: 1,
    });

    users = await User.find(Query, {
      _id: 1,
    });

    minimumpoints = await MinimumPoints.find(Query, {
      _id: 1,
    });

    loan = await Loan.find(Query, {
      _id: 1,
    });

    myverification = await Myverification.find(Query, {
      _id: 1,
    });

    draft = await Draft.find(Query, {
      _id: 1,
    });

    // areagrouping = await Areagrouping.find(Query, {
    //   _id: 1,
    // });
    // locationgrouping = await Locationgrouping.find(Query, {
    //   _id: 1,
    // });
    // workstation = await workStation.find(Query, {
    //   _id: 1,
    // });
    // manpower = await Manpower.find(Query, {
    //   _id: 1,
    // });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!noticeperiod && !users) {
    return next(new ErrorHandler('Floors and Units not found!', 404));
  }

  return res.status(200).json({
    count:
      noticeperiod.length +
      minimumpoints.length +
      loan.length +
      myverification.length +
      draft.length +
      users.length,
    noticeperiod,
    minimumpoints,
    loan,
    users
  });
});

exports.allTeamBulkCheck = catchAsyncErrors(
  async (req, res, next) => {
    let teams,
      result,
      noticeperiodapply,
      minimumpoints,
      loan,
      myverification,
      draft,
      user,
      count;

    let id = req.body.id;
    try {
      teams = await Teams.find();

      const teamstype = teams?.filter((data) =>
        id?.includes(data._id?.toString())
      );

      [
        noticeperiodapply,
        user,
        minimumpoints,
        loan,
        myverification,
        draft,
      ] = await Promise.all([
        Noticeperiodapply.find(),
        User.find(),
        MinimumPoints.find(),
        Loan.find(),
        Myverification.find(),
        Draft.find(),
      ]);


      const noticeperiodapplyType = teamstype
        .filter((answers) =>
          noticeperiodapply.some(
            (sub) =>
              sub.team === answers.teamname
          )
        )
        ?.map((data) => data._id?.toString());

      const userType = teamstype
        .filter((answers) =>
          user.some(
            (sub) =>
              sub.team === answers.teamname
          )
        )
        ?.map((data) => data._id?.toString());

      const minimumpointsType = teamstype
        .filter((answers) =>
          minimumpoints.some(
            (sub) =>
              sub.team === answers.teamname
          )
        )
        ?.map((data) => data._id?.toString());

      const loanType = teamstype
        .filter((answers) =>
          loan.some(
            (sub) =>
              sub.team?.includes(answers.teamname)
          )
        )
        ?.map((data) => data._id?.toString());

      const myverificationType = teamstype
        .filter((answers) =>
          myverification.some(
            (sub) =>
              sub.team === answers.teamname
          )
        )
        ?.map((data) => data._id?.toString());

      const draftType = teamstype
        .filter((answers) =>
          draft.some(
            (sub) =>
              sub.team === answers.teamname
          )
        )
        ?.map((data) => data._id?.toString());



      const duplicateId = [
        ...noticeperiodapplyType,
        ...userType,
        ...minimumpointsType,
        ...loanType,
        ...myverificationType,
        ...draftType,
      ];
      result = id?.filter((data) => !duplicateId?.includes(data));
      count = id?.filter((data) => duplicateId?.includes(data))?.length;

    } catch (err) {
      return next(new ErrorHandler("Records Not Found", 500));
    }

    return res.status(200).json({
      count: count,
      result,
    });
  }
);



