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
const Holiday = require("../../model/modules/setup/holidayModel");
const Assignbranch = require("../../model/modules/assignbranch");
const Draft = require("../../model/modules/draft");
const Events = require("../../model/modules/setup/eventsModel");
const Announcement = require("../../model/modules/setup/announcement/AnnouncementModel");
const payrun = require("../../model/modules/production/payruncontrol");
const Addtoprintqueue = require("../../model/modules/account/addtoprintqueue");
const IpMaster = require("../../model/modules/account/ipmodel");
const AddPassword = require("../../model/modules/password/addPasswordModel");
const TaskNonScheduleGrouping = require("../../model/modules/task/nonschedulegrouping");
const TaskDesignationGrouping = require("../../model/modules/task/taskdesignationgrouping");
const Leavecriteria = require("../../model/modules/leave/leavecriteria");
const LeaveVerification = require("../../model/modules/leave/leaveverification");
const Checklistverificationmaster = require("../../model/modules/interview/checklistverificationmaster");
const FileShare = require("../../model/modules/setup/announcement/FileShareModel");
const Applyleave = require("../../model/modules/leave/applyleave");
const TicketGrouping = require("../../model/modules/clientSupport/manageTicketGrouping");
const Raiseticketmaster = require("../../model/modules/tickets/raiseticketmaster");
const Teamgrouping = require("../../model/modules/tickets/teamgrouping");
const Payrunlist = require("../../model/modules/production/payrunlist");
const TaskDesignationGroupingSchema = require("../../model/modules/task/taskdesignationgrouping");
const TrainingDeatils = require("../../model/modules/task/taskdesignationgrouping");


const batchSize = 5; // Define a batch size

const updateOperations = (oldname, newname) => [
    //facility
    Assignbranch.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Assignbranch.updateMany({ fromunit: oldname }, { $set: { fromunit: newname } }),
    Areagrouping.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Locationgrouping.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    workStation.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    User.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Draft.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Addtoprintqueue.updateMany({ unit: oldname }, { $set: { unit: newname } }),

    Noticeperiodapply.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Teams.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Weekoffpresent.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Documentpreperation.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Idcardpreparation.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Hierarchy.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Hierarchy.updateMany({ empunit: oldname }, { $set: { empunit: newname } }),
    ProcessTeam.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    MinimumPoints.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Nonproduction.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Nonproductionunitallot.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Penaltyclienterror.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Advance.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Loan.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Expenses.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Income.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Assetdetail.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    AssetMaterialip.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Assetworkgrp.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    TaskMaintenanceNonScheduleGrouping.updateMany({ unitto: oldname }, { $set: { unitto: newname } }),
    Employeeasset.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Stockmanage.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Stock.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Stock.updateMany({ unitto: oldname }, { $set: { unitto: newname } }),
    Stock.updateMany({ userunit: oldname }, { $set: { userunit: newname } }),
    Manualstock.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Ebservicemaster.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    EbUseInstrument.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Ebreadingdetail.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Powerstation.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Ebmaterialdetails.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    AddPermission.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Assigninterviewer.updateMany({ tounit: oldname }, { $set: { tounit: newname } }),
    Visitors.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    IndividualSettings.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Raiseticketmaster.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    Raiseticketmaster.updateMany({ unitRaise: oldname }, { $set: { unitRaise: newname } }),
    LeaveVerification.updateMany(
        { unitto: oldname },
        { $set: { "unitto.$[unittoleav]": newname } },
        { arrayFilters: [{ unittoleav: oldname }] }
    ),
    LeaveVerification.updateMany(
        { unitfrom: oldname },
        { $set: { "unitfrom.$[unitfromleavfrm]": newname } },
        { arrayFilters: [{ unitfromleavfrm: oldname }] }
    ),
    Teamgrouping.updateMany(
        { unitfrom: oldname },
        { $set: { "unitfrom.$[unitfromup]": newname } },
        { arrayFilters: [{ unitfromup: oldname }] }
    ),
    Teamgrouping.updateMany(
        { unitto: oldname },
        { $set: { "unitto.$[unittoup]": newname } },
        { arrayFilters: [{ unittoup: oldname }] }
    ),


    Applyleave.updateMany(
        { unit: oldname },
        { $set: { "unit.$[unitleaveapp]": newname } },
        { arrayFilters: [{ unitleaveapp: oldname }] }
    ),
    Assigninterviewer.updateMany(
        { fromunit: oldname },
        { $set: { "fromunit.$[unitfrom]": newname } },
        { arrayFilters: [{ unitfrom: oldname }] }
    ),
    Checklistverificationmaster.updateMany(
        { unit: oldname },
        { $set: { "unit.$[unitcheck]": newname } },
        { arrayFilters: [{ unitcheck: oldname }] }
    ),
    Maintenance.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    TrainingDeatils.updateMany(
        { unit: oldname },
        { $set: { "unit.$[teamgrop]": newname } },
        { arrayFilters: [{ teamgrop: oldname }] }
    ),
    TrainingDeatils.updateMany(
        {
            "trainingdetailslog.unit": oldname,
        },
        {
            $set: {
                "trainingdetailslog.$[talog].unit": newname,
            },
        },
        {
            arrayFilters: [{ "talog.unit": oldname }],
        }
    ),
    Maintenance.updateMany(
        { unit: oldname },
        {
            $set: { unit: newname },
            "maintenancelog.$[log].unit": newname
        },
        {
            arrayFilters: [{ "log.unit": oldname }]
        }
    ),
    payrun.updateMany(
        { unit: oldname },
        { $set: { "unit.$[unitfrom]": newname } },
        { arrayFilters: [{ unitfrom: oldname }] }
    ),
    payrun.updateMany(
        { userunit: oldname },
        { $set: { "userunit.$[unituserfrom]": newname } },
        { arrayFilters: [{ unituserfrom: oldname }] }
    ),
    TaskNonScheduleGrouping.updateMany(
        { unit: oldname },
        { $set: { "unit.$[unitschgrop]": newname } },
        { arrayFilters: [{ unitschgrop: oldname }] }
    ),

    TaskDesignationGrouping.updateMany(
        { unit: oldname },
        { $set: { "unit.$[unitdesgrop]": newname } },
        { arrayFilters: [{ unitdesgrop: oldname }] }
    ),
    Leavecriteria.updateMany(
        { unit: oldname },
        { $set: { "unit.$[unitleave]": newname } },
        { arrayFilters: [{ unitleave: oldname }] }
    ),
    TaskDesignationGroupingSchema.updateMany(
        { unit: oldname },
        { $set: { "unit.$[teamgrop]": newname } },
        { arrayFilters: [{ teamgrop: oldname }] }
    ),
    TaskDesignationGroupingSchema.updateMany(
        {
            "taskdesignationlog.unit": oldname,
        },
        {
            $set: {
                "taskdesignationlog.$[talog].unit": newname,
            },
        },
        {
            arrayFilters: [{ "talog.team": oldname }],
        }
    ),
    Payrunlist.updateMany(
        {
            "data.unit": oldname,
        },
        {
            $set: {
                "data.$[unitlog].unit": newname,
            },
        },
        {
            arrayFilters: [{ "unitlog.unit": oldname }],
        }
    ),

    TaskDesignationGrouping.updateMany(
        {
            "taskdesignationlog.unit": oldname,
        },
        {
            $set: {
                "taskdesignationlog.$[taskdes].unit": newname,
            },
        },
        {
            arrayFilters: [{ "taskdes.unit": oldname }],
        }
    ),
    AutoLogout.updateMany(
        {
            "todos.unit": oldname,
        },
        {
            $set: {
                "todos.$[autologunit].unit": newname,
            },
        },
        {
            arrayFilters: [{ "autologunit.unit": oldname }],
        }
    ),

    IpMaster.updateMany(
        {
            "ipconfig.unit": oldname,
        },
        {
            $set: {
                "ipconfig.$[ip].unit": newname,
            },
        },
        {
            arrayFilters: [{ "ip.unit": oldname }],
        }
    ),
    AddPassword.updateMany(
        { unit: oldname },
        { $set: { "unit.$[unitpass]": newname } },
        { arrayFilters: [{ unitpass: oldname }] }
    ),
    Visitors.updateMany({ meetingpersonunit: oldname }, { $set: { meetingpersonunit: newname } }),
    Visitors.updateMany({ meetinglocationunit: oldname }, { $set: { meetinglocationunit: newname } }),
    Visitors.updateMany(
        {
            "followuparray.meetingpersonunit": oldname,
        },
        {
            $set: {
                "followuparray.$[deslogbranch].meetingpersonunit": newname,
            },
        },
        {
            arrayFilters: [{ "deslogbranch.meetingpersonunit": oldname }],
        }
    ),
    Visitors.updateMany(
        {
            "followuparray.meetinglocationunit": oldname,
        },
        {
            $set: {
                "followuparray.$[deslogbranchloc].meetinglocationunit": newname,
            },
        },
        {
            arrayFilters: [{ "deslogbranchloc.meetinglocationunit": oldname }],
        }
    ),

    ClientuserId.updateMany({ unit: oldname }, { $set: { unit: newname } }),
    ClientuserId.updateMany(
        {
            "loginallotlog.unit": oldname,
        },
        {
            $set: {
                "loginallotlog.$[log].unit": newname,
            },
        },
        {
            arrayFilters: [{ "log.unit": oldname }],
        }
    ),

    Holiday.updateMany(
        { unit: oldname },
        { $set: { "unit.$[un]": newname } },
        { arrayFilters: [{ un: oldname }] }
    ),
    Events.updateMany(
        { unit: oldname },
        { $set: { "unit.$[unitname]": newname } },
        { arrayFilters: [{ unitname: oldname }] }
    ),
    Announcement.updateMany(
        { unit: oldname },
        { $set: { "unit.$[unitann]": newname } },
        { arrayFilters: [{ unitann: oldname }] }
    ),

    User.updateMany(
        {
            "designationlog.unit": oldname,
        },
        {
            $set: {
                "designationlog.$[deslog].unit": newname,
            },
        },
        {
            arrayFilters: [{ "deslog.unit": oldname }],
        }
    ),
    // Update departmentlog array
    User.updateMany(
        {
            "departmentlog.unit": oldname,
        },
        {
            $set: {
                "departmentlog.$[deplog].unit": newname,
            },
        },
        {
            arrayFilters: [{ "deplog.unit": oldname }],
        }
    ),
    User.updateMany(
        {
            "boardingLog.unit": oldname,
        },
        {
            $set: {
                "boardingLog.$[bordlog].unit": newname,
            },
        },
        {
            arrayFilters: [{ "bordlog.unit": oldname }],
        }
    ),
    User.updateMany(
        {
            "shiftallot.unit": oldname,
        },
        {
            $set: {
                "shiftallot.$[shiftallot].unit": newname,
            },
        },
        {
            arrayFilters: [{ "shiftallot.unit": oldname }],
        }
    ),
    User.updateMany(
        {
            "processlog.unit": oldname,
        },
        {
            $set: {
                "processlog.$[processalot].unit": newname,
            },
        },
        {
            arrayFilters: [{ "processalot.unit": oldname }],
        }
    ),
    Penaltydayupload.updateMany(
        {
            "uploaddata.unit": oldname,
        },
        {
            $set: {
                "uploaddata.$[penaltyupload].unit": newname,
            },
        },
        {
            arrayFilters: [{ "penaltyupload.unit": oldname }],
        }
    ),
    FileShare.updateMany(
        { unit: oldname },
        { $set: { "unit.$[unitfiles]": newname } },
        { arrayFilters: [{ unitfiles: oldname }] }
    ),
    TicketGrouping.updateMany(
        { unit: oldname },
        { $set: { "unit.$[unittick]": newname } },
        { arrayFilters: [{ unittick: oldname }] }
    ),
    Attendancecontrolcriteria.updateMany(
        {
            "todos.unit": oldname,
        },
        {
            $set: {
                "todos.$[attcreunit].unit": newname,
            },
        },
        {
            arrayFilters: [{ "attcreunit.unit": oldname }],
        }
    ),
    TemplateControlPanel.updateMany(
        {
            "documentsignature.unit": oldname,
        },
        {
            $set: {
                "documentsignature.$[taskdoc].unit": newname,
            },
        },
        {
            arrayFilters: [{ "taskdoc.unit": oldname }],
        }
    ),
    TemplateControlPanel.updateMany(
        {
            "templatecontrolpanellog.documentsignature.unit": oldname,
        },
        {
            $set: {
                "templatecontrolpanellog.$[].documentsignature.$[taskdes].unit": newname,
            },
        },
        {
            arrayFilters: [{ "taskdes.unit": oldname }],
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


exports.updateOverallUnitname = catchAsyncErrors(async (req, res, next) => {
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

exports.getAllCheckDeleteUnit = catchAsyncErrors(async (req, res, next) => {
    let floors, units, designation, users, areagrouping,
        locationgrouping,
        workstation,
        manpower
        ;
    try {
        // Check for floors
        let Query = {
            unit: req.body.unit,
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


