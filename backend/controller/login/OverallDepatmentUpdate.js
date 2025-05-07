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
const Hirerarchi = require("../../model/modules/setup/hierarchy");
const Draft = require("../../model/modules/draft");
const Deptmonthauto = require("../../model/modules/departmentmonthsetauto");
const Departmentmonth = require("../../model/modules/departmentmonthset");
const Departmentanddesignationgrouping = require("../../model/modules/departmentanddesignationgrouping");
const Teams = require("../../model/modules/teams");
const Departmentgrouping = require("../../model/modules/recruitment/departmentgrouping");
const Designationrequirement = require("../../model/modules/recruitment/designationrequirement");
const Paidstatusfix = require("../../model/modules/production/paidstatusfix");
const Paiddatefix = require("../../model/modules/production/paiddatefix");
const Paiddatemode = require("../../model/modules/production/paiddatemode");
const Manageshortagemaster = require("../../model/modules/production/Shortagemaster");
const Typeticketmaster = require("../../model/modules/tickets/typetickermaster");
const LeaveCriteria = require("../../model/modules/leave/leavecriteria");
const TaskMaintenanceNonScheduleGrouping = require("../../model/modules/account/taskmaintenancenongrouping");
const TrainingDeatils = require("../../model/modules/task/trainingdetails");
const TaskDesignationGroupingSchema = require("../../model/modules/task/taskdesignationgrouping");
const Department = require("../../model/modules/department");


const batchSize = 5; // Define a batch size

const updateOperations = (oldname, newname) => [
    //facility

    Hirerarchi.updateMany({ department: oldname }, { $set: { department: newname } }),
    Noticeperiodapply.updateMany({ department: oldname }, { $set: { department: newname } }),
    Deptmonthauto.updateMany({ department: oldname }, { $set: { department: newname } }),
    Departmentmonth.updateMany({ department: oldname }, { $set: { department: newname } }),
    Departmentanddesignationgrouping.updateMany({ department: oldname }, { $set: { department: newname } }),
    Teams.updateMany({ department: oldname }, { $set: { department: newname } }),
    ShiftRoaster.updateMany({ department: oldname }, { $set: { department: newname } }),
    Documentpreperation.updateMany({ department: oldname }, { $set: { department: newname } }),
    Designationrequirement.updateMany({ department: oldname }, { $set: { department: newname } }),
    Acpointcalculation.updateMany({ department: oldname }, { $set: { department: newname } }),
    MinimumPoints.updateMany({ department: oldname }, { $set: { department: newname } }),
    Payrunlist.updateMany({ department: oldname }, { $set: { department: newname } }),
    Manageshortagemaster.updateMany({ department: oldname }, { $set: { department: newname } }),
    Typeticketmaster.updateMany({ department: oldname }, { $set: { department: newname } }),

    //Array
    FileShare.updateMany(
        { department: oldname },
        { $set: { "department.$[departments]": newname } },
        { arrayFilters: [{ departments: oldname }] }
    ),
    Leavecriteria.updateMany(
        { department: oldname },
        { $set: { "department.$[leavecriteria]": newname } },
        { arrayFilters: [{ leavecriteria: oldname }] }
    ),
    TrainingDeatils.updateMany(
        { department: oldname },
        { $set: { "department.$[trainingdeatils]": newname } },
        { arrayFilters: [{ trainingdeatils: oldname }] }
    ),
    TaskMaintenanceNonScheduleGrouping.updateMany(
        { department: oldname },
        { $set: { "department.$[tasknonschedulegrouping]": newname } },
        { arrayFilters: [{ tasknonschedulegrouping: oldname }] }
    ),
    TaskNonScheduleGrouping.updateMany(
        { department: oldname },
        { $set: { "department.$[tasknonscheduleg]": newname } },
        { arrayFilters: [{ tasknonscheduleg: oldname }] }
    ),
    LeaveCriteria.updateMany(
        { department: oldname },
        { $set: { "department.$[leavecriteriapay]": newname } },
        { arrayFilters: [{ leavecriteriapay: oldname }] }
    ),
    Paiddatemode.updateMany(
        { department: oldname },
        { $set: { "department.$[paiddatemodepay]": newname } },
        { arrayFilters: [{ paiddatemodepay: oldname }] }
    ),
    Paiddatefix.updateMany(
        { department: oldname },
        { $set: { "department.$[paiddatefixpay]": newname } },
        { arrayFilters: [{ paiddatefixpay: oldname }] }
    ),
    Paidstatusfix.updateMany(
        { department: oldname },
        { $set: { "department.$[paidstatusfixpay]": newname } },
        { arrayFilters: [{ paidstatusfixpay: oldname }] }
    ),
    payrun.updateMany(
        { department: oldname },
        { $set: { "department.$[departmentpay]": newname } },
        { arrayFilters: [{ departmentpay: oldname }] }
    ),
    payrun.updateMany(
        { userdepartment: oldname },
        { $set: { "userdepartment.$[userdepartmentpay]": newname } },
        { arrayFilters: [{ userdepartmentpay: oldname }] }
    ),
    Departmentgrouping.updateMany(
        { departments: oldname },
        { $set: { "departments.$[departmentstick]": newname } },
        { arrayFilters: [{ departmentstick: oldname }] }
    ),
    ScheduleMeeting.updateMany(
        { department: oldname },
        { $set: { "department.$[departmenttick]": newname } },
        { arrayFilters: [{ departmenttick: oldname }] }
    ),
    ScheduleMeeting.updateMany(
        { hostdepartment: oldname },
        { $set: { "hostdepartment.$[hostdepartmenttick]": newname } },
        { arrayFilters: [{ hostdepartmenttick: oldname }] }
    ),
    TaskDesignationGroupingSchema.updateMany(
        { department: oldname },
        { $set: { "department.$[depgropde]": newname } },
        { arrayFilters: [{ depgropde: oldname }] }
    ),
    TaskDesignationGroupingSchema.updateMany(
        {
            "taskdesignationlog.department": oldname,
        },
        {
            $set: {
                "taskdesignationlog.$[talogde].department": newname,
            },
        },
        {
            arrayFilters: [{ "talogde.department": oldname }],
        }
    ),
    Visitors.updateMany({ meetingpersondepartment: oldname }, { $set: { meetingpersondepartment: newname } }),
    Visitors.updateMany(
        {
            "followuparray.meetingpersondepartment": oldname,
        },
        {
            $set: {
                "followuparray.$[deslogbranch].meetingpersondepartment.$[mpd]": newname,
            },
        },
        {
            arrayFilters: [
                { "deslogbranch.meetingpersondepartment": oldname },
                { "mpd": oldname },
            ],
        }
    ),

    Payrunlist.updateMany(
        {
            "data.department": oldname,
        },
        {
            $set: {
                "data.$[departmentlog].department": newname,
            },
        },
        {
            arrayFilters: [{ "departmentlog.department": oldname }],
        }
    ),
    User.updateMany(
        {
            department: oldname,
        },
        {
            $set: {
                department: newname,
            },
        }
    ),
    User.updateMany(
        {
            "departmentlog.department": oldname,
        },
        {
            $set: {
                "departmentlog.$[depallot].department": newname,
            },
        },
        {
            arrayFilters: [{ "depallot.department": oldname }],
        }
    ),
    User.updateMany(
        {
            "departmentlogdates.department": oldname,
        },
        {
            $set: {
                "departmentlogdates.$[depdatallot].department": newname,
            },
        },
        {
            arrayFilters: [{ "depdatallot.department": oldname }],
        }
    ),
    User.updateMany(
        {
            "shiftallot.department": oldname,
        },
        {
            $set: {
                "shiftallot.$[shiftallotdep].department": newname,
            },
        },
        {
            arrayFilters: [{ "shiftallotdep.department": oldname }],
        }
    ),
    Draft.updateMany(
        {
            department: oldname,
        },
        {
            $set: {
                department: newname,
            },
        }
    ),
    Draft.updateMany(
        {
            "departmentlog.department": oldname,
        },
        {
            $set: {
                "departmentlog.$[depallot].department": newname,
            },
        },
        {
            arrayFilters: [{ "depallot.department": oldname }],
        }
    ),
    Draft.updateMany(
        {
            "departmentlogdates.department": oldname,
        },
        {
            $set: {
                "departmentlogdates.$[depdatallot].department": newname,
            },
        },
        {
            arrayFilters: [{ "depdatallot.department": oldname }],
        }
    ),
    Draft.updateMany(
        {
            "shiftallot.department": oldname,
        },
        {
            $set: {
                "shiftallot.$[shiftallotdep].department": newname,
            },
        },
        {
            arrayFilters: [{ "shiftallotdep.department": oldname }],
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


exports.updateOverallDepartmentname = catchAsyncErrors(async (req, res, next) => {
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

exports.getAllDepartmentCheck = catchAsyncErrors(async (req, res, next) => {
    let noticeperiod, minimumpoints, hierarchy, teams, users, deptmonthauto, departmentanddesignationgrouping
        ;
    try {
        // Check for floors
        let Query = {
            department: req.body.department,
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

        hierarchy = await Hirerarchi.find(Query, {
            _id: 1,
        });

        deptmonthauto = await Deptmonthauto.find(Query, {
            _id: 1,
        });

        teams = await Teams.find(Query, {
            _id: 1,
        });

        departmentanddesignationgrouping = await Departmentanddesignationgrouping.find(Query, {
            _id: 1,
        });

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
            deptmonthauto.length +
            hierarchy.length +
            users.length +
            departmentanddesignationgrouping.length +
            teams.length,
        noticeperiod,
        minimumpoints,
        deptmonthauto,
        hierarchy,
        teams,
        users
    });
});


exports.DepartmentOverallCheckBulkdelete = catchAsyncErrors(
    async (req, res, next) => {
        let managety,
            raiseproblem,
            result,
            noticeperiod,
            departmentmontset,
            user,
            minimumpoints,
            hirerarchi,
            depmonthauto,
            teams,
            departmentdesignationgrouping,

            count;
        let id = req.body.id;
        try {
            managety = await Department.find();

            const answerBothtypegroup = managety?.filter((data) =>
                id?.includes(data._id?.toString())
            );

            [
                noticeperiod,
                departmentmontset,

                user,
                minimumpoints,
                hirerarchi,
                depmonthauto,
                teams,
                departmentdesignationgrouping,
            ] = await Promise.all([
                Noticeperiodapply.find(),
                Departmentmonth.find(),

                User.find(),
                MinimumPoints.find(),
                Hirerarchi.find(),
                Deptmonthauto.find(),
                Teams.find(),
                Departmentanddesignationgrouping.find(),

            ]);


            const noticeperiodType = answerBothtypegroup
                .filter((answers) =>
                    noticeperiod.some(
                        (sub) =>
                            sub.department === answers.deptname
                    )
                )
                ?.map((data) => data._id?.toString());

            const departmentmontsetType = answerBothtypegroup
                .filter((answers) =>
                    departmentmontset.some(
                        (sub) =>
                            sub.department === answers.deptname
                    )
                )
                ?.map((data) => data._id?.toString());

            const userType = answerBothtypegroup
                .filter((answers) =>
                    user.some(
                        (sub) =>
                            sub.department === answers.deptname
                    )
                )
                ?.map((data) => data._id?.toString());


            const minimumpointsType = answerBothtypegroup
                .filter((answers) =>
                    minimumpoints.some(
                        (sub) =>
                            sub.department === answers.deptname
                    )
                )
                ?.map((data) => data._id?.toString());

            const hirerarchiType = answerBothtypegroup
                .filter((answers) =>
                    hirerarchi.some(
                        (sub) =>
                            sub.department === answers.deptname
                    )
                )
                ?.map((data) => data._id?.toString());

            const depmonthautoType = answerBothtypegroup
                .filter((answers) =>
                    depmonthauto.some(
                        (sub) =>
                            sub.department === answers.deptname
                    )
                )
                ?.map((data) => data._id?.toString());

            const teamsType = answerBothtypegroup
                .filter((answers) =>
                    teams.some(
                        (sub) =>
                            sub.department === answers.deptname
                    )
                )
                ?.map((data) => data._id?.toString());

            const departmentdesignationgroupingType = answerBothtypegroup
                .filter((answers) =>
                    departmentdesignationgrouping.some(
                        (sub) =>
                            sub.department === answers.deptname
                    )
                )
                ?.map((data) => data._id?.toString());


            const duplicateId = [
                ...noticeperiodType,
                ...departmentmontsetType,
                ...userType,
                ...minimumpointsType,
                ...hirerarchiType,
                ...depmonthautoType,
                ...teamsType,
                ...departmentdesignationgroupingType,
            ];
            result = id?.filter((data) => !duplicateId?.includes(data));
            count = id?.filter((data) => !duplicateId?.includes(data))?.length;

        } catch (err) {
            return next(new ErrorHandler("Records Not Found", 500));
        }

        return res.status(200).json({
            count: count,
            result,
        });
    }
);