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
const Assetip = require("../../model/modules/account/assetmaterialip");
const Events = require("../../model/modules/setup/eventsModel");
const Designation = require("../../model/modules/designation");
const TaskMaintenanceNonScheduleGrouping = require("../../model/modules/account/taskmaintenancenongrouping");
const Addtoprintqueue = require("../../model/modules/account/addtoprintqueue");

const batchSize = 5; // Define a batch size

const updateOperations = (oldname, newname) => [
    //facility
    workStation.updateMany({ location: oldname }, { $set: { location: newname } }),
    User.updateMany({ location: oldname }, { $set: { location: newname } }),
    Assetdetail.updateMany({ location: oldname }, { $set: { location: newname } }),
    Assetip.updateMany({ location: oldname }, { $set: { location: newname } }),
    Assetworkgrp.updateMany({ location: oldname }, { $set: { location: newname } }),
    TaskMaintenanceNonScheduleGrouping.updateMany({ locationto: oldname }, { $set: { locationto: newname } }),
    Employeeasset.updateMany({ location: oldname }, { $set: { location: newname } }),
    Stockmanage.updateMany({ location: oldname }, { $set: { location: newname } }),
    Stock.updateMany({ location: oldname }, { $set: { location: newname } }),
    Manualstock.updateMany({ location: oldname }, { $set: { location: newname } }),
    EbUseInstrument.updateMany({ location: oldname }, { $set: { location: newname } }),
    Ebmaterialdetails.updateMany({ location: oldname }, { $set: { location: newname } }),
    Addtoprintqueue.updateMany({ location: oldname }, { $set: { location: newname } }),

    Locationgrouping.updateMany(
        { location: oldname },
        { $set: { "location.$[locationgrp]": newname } },
        { arrayFilters: [{ locationgrp: oldname }] }
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


exports.updateOverallLocationname = catchAsyncErrors(async (req, res, next) => {
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


exports.getAllCheckDeleteLocation = catchAsyncErrors(async (req, res, next) => {
    let users, workstation,
        locationgrouping, areagrouping;



    try {
        // Check for floors
        let Query = {
            location: req.body.location,
        };
        areagrouping = await Areagrouping.find(Query, {
            _id: 1,
        });

        locationgrouping = await Locationgrouping.find(Query, {
            _id: 1,
        });

        workstation = await workStation.find(Query, {
            _id: 1,
        });

        users = await User.find(Query, {
            _id: 1,
        });


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!areagrouping && !locationgrouping) {
        return next(new ErrorHandler('Floors and Units not found!', 404));
    }

    return res.status(200).json({
        count: areagrouping.length + locationgrouping.length + workstation.length + users.length,
        areagrouping,
        locationgrouping,
        workstation,
        users
    });
});


