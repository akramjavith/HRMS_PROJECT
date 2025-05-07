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
const Categoryprocessmap = require("../../model/modules/production/categoryprocessmap");
const Nonproduction = require("../../model/modules/production/nonproduction/nonproduction");
const Nonproductionunitallot = require("../../model/modules/production/nonproduction/NonProductionunitallotModel");
const DayPointsUpload = require("../../model/modules/production/dayPointsUpload");
const DayPointsUploadTemp = require("../../model/modules/production/daypointsuploadtemp");
const Penaltyclienterror = require("../../model/modules/penalty/penaltyclienterror");
const Penaltydayupload = require("../../model/modules/penalty/penaltydayupload");
const Advance = require("../../model/modules/advance");
const Loan = require("../../model/modules/loan");
const ProfessionalTaxMaster = require("../../model/modules/setup/ProfessionalTaxMasterModel");
const SalarySlab = require("../../model/modules/setup/SalarySlabModel");
const Expenses = require("../../model/modules/expense/expenses");
const Income = require("../../model/modules/expense/income");
const SchedulePaymentMaster = require("../../model/modules/expense/SchedulePaymentMaster");
const SchedulePaymentBill = require("../../model/modules/expense/NotaddedBills");
const Assetdetail = require("../../model/modules/account/assetdetails");
const AssetMaterialip = require("../../model/modules/account/assetmaterialip");
const Assetworkgrp = require("../../model/modules/account/assetworkstationgrouping");
const Maintenance = require("../../model/modules/account/maintenance");
const TaskMaintenanceNonScheduleGrouping = require("../../model/modules/account/taskmaintenancenongrouping");
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
const Payrunlist = require("../../model/modules/production/payrunlist");
const Teamgrouping = require("../../model/modules/tickets/teamgrouping");

const batchSize = 5; // Define a batch size

const updateOperations = (oldname, newname) => [
  //facility
  Floor.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Unit.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Designation.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  User.updateMany({ branch: oldname, }, { $set: { branch: newname } }),
  Assignbranch.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Assignbranch.updateMany({ frombranch: oldname }, { $set: { frombranch: newname } }),
  Areagrouping.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Locationgrouping.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  workStation.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Manpower.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Noticeperiodapply.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Teams.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Weekoffpresent.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Documentpreperation.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Idcardpreparation.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Approvevacancies.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Hierarchy.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Processqueuename.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Targetpoints.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  EraAmount.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  RevenueAmount.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  ProcessTeam.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Acpointcalculation.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  MinimumPoints.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Categoryprocessmap.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Nonproduction.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Nonproductionunitallot.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Penaltyclienterror.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Advance.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Loan.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  ProfessionalTaxMaster.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Expenses.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Income.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  SalarySlab.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Assetdetail.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  AssetMaterialip.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Assetworkgrp.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  TaskMaintenanceNonScheduleGrouping.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Employeeasset.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Stockmanage.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Stock.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Manualstock.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Ebservicemaster.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  EbUseInstrument.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Ebrates.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Ebreadingdetail.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Powerstation.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Ebmaterialdetails.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  AddPermission.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Visitors.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  IndividualSettings.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Clockinip.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Raiseticketmaster.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Raiseticketmaster.updateMany({ branchRaise: oldname }, { $set: { branchRaise: newname } }),
  Addtoprintqueue.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  TemplateControlPanel.updateMany(
    { branch: oldname },
    {
      $set: { branch: newname },
      "templatecontrolpanellog.$[log].branch": newname
    },
    {
      arrayFilters: [{ "log.branch": oldname }]
    }
  ),
  SchedulePaymentBill.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  SchedulePaymentMaster.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  SchedulePaymentMaster.updateMany(
    { branch: oldname },
    {
      $set: { branch: newname },
      "statuslog.$[log].branch": newname
    },
    {
      arrayFilters: [{ "log.branch": oldname }]
    }
  ),
  Maintenance.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Maintenance.updateMany(
    { branch: oldname },
    {
      $set: { branch: newname },
      "maintenancelog.$[log].branch": newname
    },
    {
      arrayFilters: [{ "log.branch": oldname }]
    }
  ),
  // Update the main branch field

  User.updateMany(
    {
      "designationlog.branch": oldname,
    },
    {
      $set: {
        "designationlog.$[deslog].branch": newname,
      },
    },
    {
      arrayFilters: [{ "deslog.branch": oldname }],
    }
  ),
  Payrunlist.updateMany(
    {
      "data.branch": oldname,
    },
    {
      $set: {
        "data.$[datalog].branch": newname,
      },
    },
    {
      arrayFilters: [{ "datalog.branch": oldname }],
    }
  ),
  Visitors.updateMany({ meetingpersonbranch: oldname }, { $set: { meetingpersonbranch: newname } }),
  Visitors.updateMany({ meetinglocationbranch: oldname }, { $set: { meetinglocationbranch: newname } }),
  Visitors.updateMany(
    {
      "followuparray.meetingpersonbranch": oldname,
    },
    {
      $set: {
        "followuparray.$[deslogbranch].meetingpersonbranch": newname,
      },
    },
    {
      arrayFilters: [{ "deslogbranch.meetingpersonbranch": oldname }],
    }
  ),
  Visitors.updateMany(
    {
      "followuparray.meetinglocationbranch": oldname,
    },
    {
      $set: {
        "followuparray.$[deslogbranchloc].meetinglocationbranch": newname,
      },
    },
    {
      arrayFilters: [{ "deslogbranchloc.meetinglocationbranch": oldname }],
    }
  ),

  // Update departmentlog array
  User.updateMany(
    {
      "departmentlog.branch": oldname,
    },
    {
      $set: {
        "departmentlog.$[deplog].branch": newname,
      },
    },
    {
      arrayFilters: [{ "deplog.branch": oldname }],
    }
  ),
  User.updateMany(
    {
      "boardingLog.branch": oldname,
    },
    {
      $set: {
        "boardingLog.$[bordlog].branch": newname,
      },
    },
    {
      arrayFilters: [{ "bordlog.branch": oldname }],
    }
  ),
  User.updateMany(
    {
      "shiftallot.branch": oldname,
    },
    {
      $set: {
        "shiftallot.$[shiftallot].branch": newname,
      },
    },
    {
      arrayFilters: [{ "shiftallot.branch": oldname }],
    }
  ),
  User.updateMany(
    {
      "processlog.branch": oldname,
    },
    {
      $set: {
        "processlog.$[processalot].branch": newname,
      },
    },
    {
      arrayFilters: [{ "processalot.branch": oldname }],
    }
  ),
  AdminOverAllSettings.updateMany(
    {
      "todos.branch": oldname,
    },
    {
      $set: {
        "todos.$[todosbranch].branch": newname,
      },
    },
    {
      arrayFilters: [{ "todosbranch.branch": oldname }],
    }
  ),

  // Repeat similar updateMany calls for other arrays like shiftallot, processlog, etc.



  Draft.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Assigninterviewer.updateMany({ tobranch: oldname }, { $set: { tobranch: newname } }),

  //Array update

  Teamgrouping.updateMany(
    { branchfrom: oldname },
    { $set: { "branchfrom.$[branchfromup]": newname } },
    { arrayFilters: [{ branchfromup: oldname }] }
  ),
  Teamgrouping.updateMany(
    { branchto: oldname },
    { $set: { "branchto.$[branchtoup]": newname } },
    { arrayFilters: [{ branchtoup: oldname }] }
  ),
  Applyleave.updateMany(
    { branch: oldname },
    { $set: { "branch.$[branchleaveapp]": newname } },
    { arrayFilters: [{ branchleaveapp: oldname }] }
  ),
  Leavecriteria.updateMany(
    { branch: oldname },
    { $set: { "branch.$[branchleave]": newname } },
    { arrayFilters: [{ branchleave: oldname }] }
  ),
  TaskNonScheduleGrouping.updateMany(
    { branch: oldname },
    { $set: { "branch.$[branchschgrop]": newname } },
    { arrayFilters: [{ branchschgrop: oldname }] }
  ),
  Assigninterviewer.updateMany(
    { frombranch: oldname },
    { $set: { "frombranch.$[branchfrom]": newname } },
    { arrayFilters: [{ branchfrom: oldname }] }
  ),
  payrun.updateMany(
    { branch: oldname },
    { $set: { "branch.$[branchpay]": newname } },
    { arrayFilters: [{ branchpay: oldname }] }
  ),
  payrun.updateMany(
    { userbranch: oldname },
    { $set: { "userbranch.$[branchuserpay]": newname } },
    { arrayFilters: [{ branchuserpay: oldname }] }
  ),
  TicketGrouping.updateMany(
    { branch: oldname },
    { $set: { "branch.$[branchtick]": newname } },
    { arrayFilters: [{ branchtick: oldname }] }
  ),
  FileShare.updateMany(
    { branch: oldname },
    { $set: { "branch.$[branchfiles]": newname } },
    { arrayFilters: [{ branchfiles: oldname }] }
  ),
  Holiday.updateMany(
    { applicablefor: oldname },
    { $set: { "applicablefor.$[branch]": newname } },
    { arrayFilters: [{ branch: oldname }] }
  ),
  ScheduleMeeting.updateMany(
    { branch: oldname },
    { $set: { "branch.$[branchname]": newname } },
    { arrayFilters: [{ branchname: oldname }] }
  ),
  ScheduleMeeting.updateMany(
    { branchvenue: oldname },
    { $set: { "branchvenue.$[branchven]": newname } },
    { arrayFilters: [{ branchven: oldname }] }
  ),
  ScheduleMeeting.updateMany(
    { hostbranch: oldname },
    { $set: { "hostbranch.$[branchhost]": newname } },
    { arrayFilters: [{ branchhost: oldname }] }
  ),
  Events.updateMany(
    { branch: oldname },
    { $set: { "branch.$[branchname]": newname } },
    { arrayFilters: [{ branchname: oldname }] }
  ),
  Announcement.updateMany(
    { branch: oldname },
    { $set: { "branch.$[branchann]": newname } },
    { arrayFilters: [{ branchann: oldname }] }
  ),
  AddPassword.updateMany(
    { branch: oldname },
    { $set: { "branch.$[branchpass]": newname } },
    { arrayFilters: [{ branchpass: oldname }] }
  ),
  LeaveVerification.updateMany(
    { branchto: oldname },
    { $set: { "branchto.$[branchtoleav]": newname } },
    { arrayFilters: [{ branchtoleav: oldname }] }
  ),
  LeaveVerification.updateMany(
    { branchfrom: oldname },
    { $set: { "branchfrom.$[branchfromleavfrm]": newname } },
    { arrayFilters: [{ branchfromleavfrm: oldname }] }
  ),
  Checklistverificationmaster.updateMany(
    { branch: oldname },
    { $set: { "branch.$[branchcheck]": newname } },
    { arrayFilters: [{ branchcheck: oldname }] }
  ),
  IpMaster.updateMany(
    {
      "ipconfig.branch": oldname,
    },
    {
      $set: {
        "ipconfig.$[ip].branch": newname,
      },
    },
    {
      arrayFilters: [{ "ip.branch": oldname }],
    }
  ),
  ShiftRoaster.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Shift.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Approvevacancies.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  jobOpenings.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  Candidate.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  TaskDesignationGrouping.updateMany(
    { branch: oldname },
    { $set: { "branch.$[branchdesgrop]": newname } },
    { arrayFilters: [{ branchdesgrop: oldname }] }
  ),

  TaskDesignationGrouping.updateMany(
    {
      "taskdesignationlog.branch": oldname,
    },
    {
      $set: {
        "taskdesignationlog.$[taskdes].branch": newname,
      },
    },
    {
      arrayFilters: [{ "taskdes.branch": oldname }],
    }
  ),
  Candidate.updateMany(
    {
      "interviewrounds.branch": oldname,
    },
    {
      $set: {
        "interviewrounds.$[interview].branch": newname,
      },
    },
    {
      arrayFilters: [{ "interview.branch": oldname }],
    }
  ),
  Candidate.updateMany(
    {
      "interviewrounds.branchvenue": oldname,
    },
    {
      $set: {
        "interviewrounds.$[interviewbranchvenue].branchvenue": newname,
      },
    },
    {
      arrayFilters: [{ "interviewbranchvenue.branchvenue": oldname }],
    }
  ),
  Candidate.updateMany(
    {
      "interviewrounds.hostbranch": oldname,
    },
    {
      $set: {
        "interviewrounds.$[interviewhostbranch].hostbranch": newname,
      },
    },
    {
      arrayFilters: [{ "interviewhostbranch.hostbranch": oldname }],
    }
  ),

  ClientuserId.updateMany({ branch: oldname }, { $set: { branch: newname } }),
  ClientuserId.updateMany(
    {
      "loginallotlog.branch": oldname,
    },
    {
      $set: {
        "loginallotlog.$[loginallot].branch": newname,
      },
    },
    {
      arrayFilters: [{ "loginallot.branch": oldname }],
    }
  ),
  Penaltydayupload.updateMany(
    {
      "uploaddata.branch": oldname,
    },
    {
      $set: {
        "uploaddata.$[penaltyupload].branch": newname,
      },
    },
    {
      arrayFilters: [{ "penaltyupload.branch": oldname }],
    }
  ),
  DayPointsUpload.updateMany(
    { branch: oldname },
    {
      $set: { branch: newname },
      "uploaddata.$[log].branch": newname
    },
    {
      arrayFilters: [{ "log.branch": oldname }]
    }
  ),
  DayPointsUploadTemp.updateMany(
    { branch: oldname },
    {
      $set: { branch: newname },
      "uploaddata.$[log].branch": newname
    },
    {
      arrayFilters: [{ "log.branch": oldname }]
    }
  ),


  AutoLogout.updateMany(
    {
      "todos.branch": oldname,
    },
    {
      $set: {
        "todos.$[autologbranch].branch": newname,
      },
    },
    {
      arrayFilters: [{ "autologbranch.branch": oldname }],
    }
  ),
  Attendancecontrolcriteria.updateMany(
    {
      "todos.branch": oldname,
    },
    {
      $set: {
        "todos.$[attcrebranch].branch": newname,
      },
    },
    {
      arrayFilters: [{ "attcrebranch.branch": oldname }],
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


exports.updateOverallBranchname = catchAsyncErrors(async (req, res, next) => {
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

exports.getAllBranchCheck = catchAsyncErrors(async (req, res, next) => {
  let floors, units, designation, users, areagrouping,
    locationgrouping,
    workstation,
    manpower
    ;
  try {
    // Check for floors
    let Query = {
      branch: req.body.checkbranch,
    };

    floors = await Floor.find(Query, {
      _id: 1,
    });

    units = await Unit.find(Query, {
      _id: 1,
    });

    designation = await Designation.find(Query, {
      _id: 1,
    });

    users = await User.find(Query, {
      _id: 1,
    });

    areagrouping = await Areagrouping.find(Query, {
      _id: 1,
    });

    locationgrouping = await Locationgrouping.find(Query, {
      _id: 1,
    });
    workstation = await workStation.find(Query, {
      _id: 1,
    });

    manpower = await Manpower.find(Query, {
      _id: 1,
    });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!floors && !units) {
    return next(new ErrorHandler('Floors and Units not found!', 404));
  }

  return res.status(200).json({
    floors,
    units,
    designation,
    users,
    areagrouping,
    locationgrouping,
    workstation,
    manpower
  });
});


