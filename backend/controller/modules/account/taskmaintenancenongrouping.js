const TaskMaintenanceNonScheduleGrouping = require("../../../model/modules/account/taskmaintenancenongrouping");
const AssetMaterialIP = require("../../../model/modules/account/assetmaterialip");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All TaskMaintenanceNonScheduleGrouping => /api/tasknonschedulegroupings
exports.getAllTaskMaintenanceNonScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
    let taskmaintenancenonschedulegrouping;
    try {
        taskmaintenancenonschedulegrouping = await TaskMaintenanceNonScheduleGrouping.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!taskmaintenancenonschedulegrouping) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        taskmaintenancenonschedulegrouping,
    });
});

exports.getAllTaskMaintenanceNonScheduleGroupingAssetIP = catchAsyncErrors(async (req, res, next) => {
    let assetmaterialip;
    try {
        assetmaterialip = await AssetMaterialIP.find({}, { component: 1 });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!assetmaterialip) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        assetmaterialip,
    });
});


// Create new TaskMaintenanceNonScheduleGrouping=> /api/taskmaintenancenonschedulegrouping/new
exports.addTaskMaintenanceNonScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
    let ataskmaintenancenonschedulegrouping = await TaskMaintenanceNonScheduleGrouping.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle TaskMaintenanceNonScheduleGrouping => /api/taskmaintenancenonschedulegrouping/:id
exports.getSingleTaskMaintenanceNonScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let staskmaintenancenonschedulegrouping = await TaskMaintenanceNonScheduleGrouping.findById(id);

    if (!staskmaintenancenonschedulegrouping) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        staskmaintenancenonschedulegrouping,
    });
});

// update TaskMaintenanceNonScheduleGrouping by id => /api/taskmaintenancenonschedulegrouping/:id
exports.updateTaskMaintenanceNonScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let utaskmaintenancenonschedulegrouping = await TaskMaintenanceNonScheduleGrouping.findByIdAndUpdate(id, req.body);
    if (!utaskmaintenancenonschedulegrouping) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete TaskMaintenanceNonScheduleGrouping by id => /api/taskmaintenancenonschedulegrouping/:id
exports.deleteTaskMaintenanceNonScheduleGrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dtaskmaintenancenonschedulegrouping = await TaskMaintenanceNonScheduleGrouping.findByIdAndRemove(id);

    if (!dtaskmaintenancenonschedulegrouping) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});


exports.getAllTaskMaintenanceNonScheduleGroupingAccess = catchAsyncErrors(async (req, res, next) => {
    let taskmaintenancenonschedulegrouping;
    try {

        const { assignbranch, company, branch, unit, material } = req.body;
        let filterQuery = {};
        // Construct the filter query based on the assignbranch array
        const branchFilter = assignbranch.map((branchObj) => ({
            branch: branchObj.branch,
            company: branchObj.company,
            unit: branchObj.unit,
        }));
        const branchFilterTo = assignbranch.map((branchObj) => ({
            branchto: branchObj.branch,
            companyto: branchObj.company,
            unitto: branchObj.unit,
        }));

        // Use $or to filter incomes that match any of the branch, company, and unit combinations
        // Use $or to filter incomes that match any of the branch, company, and unit combinations
        if (branchFilter.length > 0 || branchFilterTo.length > 0) {
            filterQuery = {
                $or: [...branchFilter, ...branchFilterTo],
            };
        }
        if (company && company?.length > 0) {
            filterQuery.companyto = { $in: company }
        }

        if (branch && branch?.length > 0) {
            filterQuery.branchto = { $in: branch }
        }
        if (unit && unit?.length > 0) {
            filterQuery.unitto = { $in: unit }
        }
        if (material && material?.length > 0) {
            filterQuery.assetmaterial = { $in: material.flat() }
        }

        // console.log(filterQuery, "filterQuery")


        taskmaintenancenonschedulegrouping = await TaskMaintenanceNonScheduleGrouping.find(filterQuery, {
            companyto: 1,
            branchto: 1,
            unitto: 1,
            floorto: 1,
            areato: 1,
            locationto: 1,
            assetmaterial: 1,
            subcategory: 1,
            duration: 1,
            breakup: 1,
            breakupcount: 1,
            required: 1,
            schedule: 1,
            priority: 1,
            actions: 1,
            designation: 1,
            department: 1,
            branch: 1,
            company: 1,
            unit: 1,
            team: 1,
            date: 1,
            time: 1,
            employeenames: 1,
            type: 1
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!taskmaintenancenonschedulegrouping) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        taskmaintenancenonschedulegrouping,
    });
});