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
const Teams = require("../../model/modules/teams");
const Departmentgrouping = require("../../model/modules/recruitment/departmentgrouping");
const Designationrequirement = require("../../model/modules/recruitment/designationrequirement");
const Paidstatusfix = require("../../model/modules/production/paidstatusfix");
const Paiddatefix = require("../../model/modules/production/paiddatefix");
const Paiddatemode = require("../../model/modules/production/paiddatemode");
const Manageshortagemaster = require("../../model/modules/production/Shortagemaster");
const Typeticketmaster = require("../../model/modules/tickets/typetickermaster");
const LeaveCriteria = require("../../model/modules/leave/leavecriteria");
const DesignationMonthSet = require("../../model/modules/DesignationMonthSetModel");
const Departmentanddesignationgrouping = require("../../model/modules/departmentanddesignationgrouping");
const Candidatedocument = require("../../model/modules/recruitment/candidatedocument");
const Candidate = require("../../model/modules/recruitment/addcandidate");
const Roleofresponse = require("../../model/modules/recruitment/rolesofresponse");
const Documentgrouping = require("../../model/modules/documents/documentsgrouping");
const InterviewFormDesign = require("../../model/modules/interview/interviewformdesign");
const Interviewgroupingmaster = require("../../model/modules/interview/interviewquestiongrouping");
const InterviewQuestionsOrder = require("../../model/modules/interview/InterviewQuestionsOrderModel");
const Interviewroundorderr = require("../../model/modules/interview/interviewroundorder");
const TaskMaintenanceNonScheduleGrouping = require("../../model/modules/account/taskmaintenancenongrouping");
const TaskDesignationGroupingSchema = require("../../model/modules/task/taskdesignationgrouping");
const TrainingDeatils = require("../../model/modules/task/trainingdetails");

const batchSize = 5; // Define a batch size

const updateOperations = (oldname, newname) => [
    //facility

    DesignationMonthSet.updateMany({ designation: oldname }, { $set: { designation: newname } }),
    Departmentanddesignationgrouping.updateMany({ designation: oldname }, { $set: { designation: newname } }),
    Designationrequirement.updateMany({ designation: oldname }, { $set: { designation: newname } }),
    Approvevacancies.updateMany({ designation: oldname }, { $set: { designation: newname } }),
    Candidatedocument.updateMany({ designation: oldname }, { $set: { designation: newname } }),
    jobOpenings.updateMany({ designation: oldname }, { $set: { designation: newname } }),
    Documentgrouping.updateMany({ designation: oldname }, { $set: { designation: newname } }),
    Assigninterviewer.updateMany({ designation: oldname }, { $set: { designation: newname } }),
    Interviewgroupingmaster.updateMany({ designation: oldname }, { $set: { designation: newname } }),
    InterviewQuestionsOrder.updateMany({ designation: oldname }, { $set: { designation: newname } }),
    Interviewroundorderr.updateMany({ designation: oldname }, { $set: { designation: newname } }),

    TaskNonScheduleGrouping.updateMany(
        { designation: oldname },
        { $set: { "designation.$[tasknon]": newname } },
        { arrayFilters: [{ tasknon: oldname }] }
    ),
    Leavecriteria.updateMany(
        { designation: oldname },
        { $set: { "designation.$[leavecr]": newname } },
        { arrayFilters: [{ leavecr: oldname }] }
    ),
    TaskDesignationGroupingSchema.updateMany(
        { designation: oldname },
        { $set: { "designation.$[trainingd]": newname } },
        { arrayFilters: [{ trainingd: oldname }] }
    ),
    TrainingDeatils.updateMany(
        { designation: oldname },
        { $set: { "designation.$[train]": newname } },
        { arrayFilters: [{ train: oldname }] }
    ),
    TaskMaintenanceNonScheduleGrouping.updateMany(
        { designation: oldname },
        { $set: { "designation.$[tasknonschedulegrouping]": newname } },
        { arrayFilters: [{ tasknonschedulegrouping: oldname }] }
    ),
    InterviewFormDesign.updateMany(
        { designation: oldname },
        { $set: { "designation.$[interviewpay]": newname } },
        { arrayFilters: [{ interviewpay: oldname }] }
    ),
    LeaveCriteria.updateMany(
        { designation: oldname },
        { $set: { "designation.$[leaveCriteriapay]": newname } },
        { arrayFilters: [{ leaveCriteriapay: oldname }] }
    ),
    Roleofresponse.updateMany(
        { designation: oldname },
        { $set: { "designation.$[designationpay]": newname } },
        { arrayFilters: [{ designationpay: oldname }] }
    ),


    User.updateMany(
        {
            designation: oldname,
        },
        {
            $set: {
                designation: newname,
            },
        }
    ),
    TaskDesignationGrouping.updateMany(
        { designation: oldname },
        { $set: { "designation.$[taskdesignation]": newname } },
        { arrayFilters: [{ taskdesignation: oldname }] }
    ),

    TaskDesignationGroupingSchema.updateMany(
        {
            "taskdesignationlog.designation": oldname,
        },
        {
            $set: {
                "taskdesignationlog.$[taskdesgrolog].designation": newname,
            },
        },
        {
            arrayFilters: [{ "taskdesgrolog.designation": oldname }],
        }
    ),
    TrainingDeatils.updateMany(
        {
            "trainingdetailslog.designation": oldname,
        },
        {
            $set: {
                "trainingdetailslog.$[taskdeslog].designation": newname,
            },
        },
        {
            arrayFilters: [{ "taskdeslog.designation": oldname }],
        }
    ),
    TaskDesignationGrouping.updateMany(
        {
            "taskdesignationlog.designation": oldname,
        },
        {
            $set: {
                "taskdesignationlog.$[taskdesgro].designation": newname,
            },
        },
        {
            arrayFilters: [{ "taskdesgro.designation": oldname }],
        }
    ),
    User.updateMany(
        {
            "designationlog.designation": oldname,
        },
        {
            $set: {
                "designationlog.$[desallot].designation": newname,
            },
        },
        {
            arrayFilters: [{ "desallot.designation": oldname }],
        }
    ),
    Candidate.updateMany(
        {
            "interviewrounds.designation": oldname,
        },
        {
            $set: {
                "interviewrounds.$[intallot].designation": newname,
            },
        },
        {
            arrayFilters: [{ "intallot.designation": oldname }],
        }
    ),

    Draft.updateMany(
        {
            designation: oldname,
        },
        {
            $set: {
                designation: newname,
            },
        }
    ),
    Draft.updateMany(
        {
            "designationlog.designation": oldname,
        },
        {
            $set: {
                "designationlog.$[desallot].designation": newname,
            },
        },
        {
            arrayFilters: [{ "desallot.designation": oldname }],
        }
    ),






    Hirerarchi.updateMany({ department: oldname }, { $set: { department: newname } }),
    Noticeperiodapply.updateMany({ department: oldname }, { $set: { department: newname } }),
    Deptmonthauto.updateMany({ department: oldname }, { $set: { department: newname } }),
    Departmentmonth.updateMany({ department: oldname }, { $set: { department: newname } }),
    Departmentanddesignationgrouping.updateMany({ department: oldname }, { $set: { department: newname } }),
    Teams.updateMany({ department: oldname }, { $set: { department: newname } }),
    ShiftRoaster.updateMany({ department: oldname }, { $set: { department: newname } }),
    Documentpreperation.updateMany({ department: oldname }, { $set: { department: newname } }),
    Acpointcalculation.updateMany({ department: oldname }, { $set: { department: newname } }),
    MinimumPoints.updateMany({ department: oldname }, { $set: { department: newname } }),
    Payrunlist.updateMany({ department: oldname }, { $set: { department: newname } }),
    Manageshortagemaster.updateMany({ department: oldname }, { $set: { department: newname } }),
    Typeticketmaster.updateMany({ department: oldname }, { $set: { department: newname } }),

    //Array

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


exports.updateOverallDesignationname = catchAsyncErrors(async (req, res, next) => {
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

exports.getAllDesignationCheck = catchAsyncErrors(async (req, res, next) => {
    let candidate, documentgrouping, assigninterviewer, interviewgroupingmaster, interviewquestionsorder, interviewroundorderrapprovevacancies, designationrequirement, candidatedocument, departmentanddesignationgrouping, designationmonthset, interviewerr, appcancies, users;
    try {
        // Check for floors
        let Query = {
            designation: req.body.designation,
        };

        departmentanddesignationgrouping = await Departmentanddesignationgrouping.find(
            {
                designation: { $in: [req.body.designation] },
            },
            {
                _id: 1,
            }
        );


        designationmonthset = await DesignationMonthSet.find(Query, {
            _id: 1,
        });


        designationrequirement = await Designationrequirement.find(Query, {
            _id: 1,
        });

        appcancies = await Approvevacancies.find(Query, {
            _id: 1,
        });

        candidatedocument = await Candidatedocument.find(Query, {
            _id: 1,
        });

        candidate = await Candidate.find(Query, {
            _id: 1,
        });

        documentgrouping = await Documentgrouping.find(Query, {
            _id: 1,
        });

        assigninterviewer = await Assigninterviewer.find(Query, {
            _id: 1,
        });

        interviewgroupingmaster = await Interviewgroupingmaster.find(Query, {
            _id: 1,
        });

        interviewquestionsorder = await InterviewQuestionsOrder.find(Query, {
            _id: 1,
        });

        interviewerr = await Interviewroundorderr.find(Query, {
            _id: 1,
        });

        users = await User.find(Query, {
            _id: 1,
        });


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!designationmonthset && !candidate) {
        return next(new ErrorHandler('Floors and Units not found!', 404));
    }
    return res.status(200).json({
        count:
            candidate.length +
            documentgrouping.length +
            assigninterviewer.length +
            interviewgroupingmaster.length +
            interviewquestionsorder.length +
            candidatedocument.length +
            designationrequirement.length +
            departmentanddesignationgrouping.length +
            designationmonthset.length +
            users.length +
            interviewerr.length,
        candidate,
        documentgrouping,
        assigninterviewer,
        interviewgroupingmaster,
        interviewquestionsorder,
        interviewerr,
        candidatedocument,
        appcancies,
        designationrequirement,
        departmentanddesignationgrouping,
        designationmonthset,
        users,
    });
});


exports.designationbulkcheck = catchAsyncErrors(
    async (req, res, next) => {
        let designationgroup,
            result,
            designation,
            hierarchy,
            designationmonthset,
            designationrequirement,
            approvevacancies,
            candidatedocument,
            candidate,
            documentgrouping,
            assigninterviewer,
            interviewgroupingmaster,
            interviewquestionsorder,
            interviewroundoreder,
            departmentanddesignationgrouping,
            user,
            count;

        let id = req.body.id;
        try {
            designationgroup = await Designation.find();

            const answerBothtypegroup = designationgroup?.filter((data) =>
                id?.includes(data._id?.toString())
            );

            [
                designationmonthset,
                designationrequirement,
                approvevacancies,
                candidatedocument,
                candidate,
                documentgrouping,
                assigninterviewer,
                interviewgroupingmaster,
                interviewquestionsorder,
                interviewroundoreder,
                user,
                departmentanddesignationgrouping,
            ] = await Promise.all([
                DesignationMonthSet.find(),
                Designationrequirement.find(),
                Approvevacancies.find(),
                Candidatedocument.find(),
                Candidate.find(),
                Documentgrouping.find(),
                Assigninterviewer.find(),
                Interviewgroupingmaster.find(),
                InterviewQuestionsOrder.find(),
                Interviewroundorderr.find(),
                User.find(),
                Departmentanddesignationgrouping.find(),
            ]);


            const designationmonthsetType = answerBothtypegroup
                .filter((answers) =>
                    designationmonthset.some(
                        (sub) =>
                            sub.designation === answers.name
                    )
                )
                ?.map((data) => data._id?.toString());

            const designationrequirementType = answerBothtypegroup
                .filter((answers) =>
                    designationrequirement.some(
                        (sub) =>
                            sub.designation === answers.name
                    )
                )
                ?.map((data) => data._id?.toString());

            const approvevacanciesType = answerBothtypegroup
                .filter((answers) =>
                    approvevacancies.some(
                        (sub) =>
                            sub.designation === answers.name
                    )
                )
                ?.map((data) => data._id?.toString());

            const candidatedocumentType = answerBothtypegroup
                .filter((answers) =>
                    candidatedocument.some(
                        (sub) =>
                            sub.designation === answers.name
                    )
                )
                ?.map((data) => data._id?.toString());

            const candidateType = answerBothtypegroup
                .filter((answers) =>
                    candidate.some(
                        (sub) =>
                            sub.designation === answers.name
                    )
                )
                ?.map((data) => data._id?.toString());

            const documentgroupingType = answerBothtypegroup
                .filter((answers) =>
                    documentgrouping.some(
                        (sub) =>
                            sub.designation === answers.name
                    )
                )
                ?.map((data) => data._id?.toString());

            const assigninterviewerType = answerBothtypegroup
                .filter((answers) =>
                    assigninterviewer.some(
                        (sub) =>
                            sub.designation === answers.name
                    )
                )
                ?.map((data) => data._id?.toString());

            const interviewgroupingmasterType = answerBothtypegroup
                .filter((answers) =>
                    interviewgroupingmaster.some(
                        (sub) =>
                            sub.designation === answers.name
                    )
                )
                ?.map((data) => data._id?.toString());

            const interviewquestionsorderType = answerBothtypegroup
                .filter((answers) =>
                    interviewquestionsorder.some(
                        (sub) =>
                            sub.designation === answers.name
                    )
                )
                ?.map((data) => data._id?.toString());

            const interviewroundorederType = answerBothtypegroup
                .filter((answers) =>
                    interviewroundoreder.some(
                        (sub) =>
                            sub.designation === answers.name
                    )
                )
                ?.map((data) => data._id?.toString());

            const userType = answerBothtypegroup
                .filter((answers) =>
                    user.some(
                        (sub) =>
                            sub.designation === answers.name
                    )
                )
                ?.map((data) => data._id?.toString());

            const departmentanddesignationgroupingType = answerBothtypegroup
                .filter((answers) =>
                    departmentanddesignationgrouping.some(
                        (sub) =>
                            sub.designation === answers.name
                    )
                )
                ?.map((data) => data._id?.toString());


            const duplicateId = [
                ...designationmonthsetType,
                ...designationrequirementType,
                ...approvevacanciesType,
                ...candidatedocumentType,
                ...candidateType,
                ...documentgroupingType,
                ...assigninterviewerType,
                ...interviewgroupingmasterType,
                ...interviewquestionsorderType,
                ...interviewroundorederType,
                ...userType,
                ...departmentanddesignationgroupingType,
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




