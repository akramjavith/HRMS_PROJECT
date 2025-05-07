
const ManageCategoryPercentage = require('../../../model/modules/production/managecategorypercentage');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ManageCategoryPercentage => /api/managecategorypercentage
exports.getAllManageCategoryPercentage = catchAsyncErrors(async (req, res, next) => {
    let managecategorypercentage;
    try {
        managecategorypercentage = await ManageCategoryPercentage.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!managecategorypercentage) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        managecategorypercentage,
    });
});


// Create new managecategorypercentage=> /api/managecategorypercentage/new
exports.addManageCategoryPercentage = catchAsyncErrors(async (req, res, next) => {

    const { projectvendor, process, percentage  } = req.body;

    let filteredData = await ManageCategoryPercentage.findOne({ projectvendor,process, percentage });



    if (!filteredData) {
        let apenaltymanagecategorypercentage = await ManageCategoryPercentage.create(req.body);

        return res.status(200).json({
            message: "Successfully added!",
        });
    }

    return next(new ErrorHandler("Data Already Exist!", 404));

});

// get Signle managecategorypercentage => /api/managecategorypercentage/:id
exports.getSingleManageCategoryPercentage = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let smanagecategorypercentage = await ManageCategoryPercentage.findById(id);

    if (!smanagecategorypercentage) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        smanagecategorypercentage,
    });
});

// update ManageCategoryPercentage by id => /api/managecategorypercentage/:id
exports.updateManageCategoryPercentage = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    const { projectvendor, process, percentage  } = req.body;

    let filteredData = await ManageCategoryPercentage.findOne({ _id:{$ne:id}, projectvendor,process , percentage });

    if (!filteredData) {
        let umanagecategorypercentage = await ManageCategoryPercentage.findByIdAndUpdate(id, req.body);
        if (!umanagecategorypercentage) {
            return next(new ErrorHandler("Data not found!", 404));
        }
        return res.status(200).json({ message: "Updated successfully" });
    }
    return next(new ErrorHandler("Data Already Exist!", 404));

});

// delete ManageCategoryPercentage by id => /api/managecategorypercentage/:id
exports.deleteManageCategoryPercentage = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dmanagecategorypercentage = await ManageCategoryPercentage.findByIdAndRemove(id);

    if (!dmanagecategorypercentage) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});