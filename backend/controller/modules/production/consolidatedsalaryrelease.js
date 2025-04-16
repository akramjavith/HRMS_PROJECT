const ConsolidatedSalaryRelease = require("../../../model/modules/production/consolidatedsalaryrelease");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All consolidatedsalary => /api/consolidatedsalary
exports.getAllConsolidatedSalaryRelease = catchAsyncErrors(async (req, res, next) => {
    let consolidatedsalary;
    try {
        consolidatedsalary = await ConsolidatedSalaryRelease.find();
    } catch (err) {
        console.log(err.message);
    }
    if (!consolidatedsalary) {
        return next(new ErrorHandler("ConsolidatedSalaryRelease not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        consolidatedsalary,
    });
});

// Create new consolidatedsalary=> /api/consolidatedsalary/new
exports.addConsolidatedSalaryRelease = catchAsyncErrors(async (req, res, next) => {
    try {
        // Create new ConsolidatedSalaryRelease entry
        let aconsolidatedsalary = await ConsolidatedSalaryRelease.create(req.body);
        return res.status(200).json({
            message: 'Successfully added!'
        });
    } catch (error) {
        // Pass any errors to the centralized error handler
        next(error);
    }
});

// get Signle consolidatedsalary => /api/consolidatedsalary/:id
exports.getSingleConsolidatedSalaryRelease = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sconsolidatedsalary = await ConsolidatedSalaryRelease.findById(id);

    if (!sconsolidatedsalary) {
        return next(new ErrorHandler("ConsolidatedSalaryRelease not found!", 404));
    }
    return res.status(200).json({
        sconsolidatedsalary,
    });
});

// update consolidatedsalary by id => /api/consolidatedsalary/:id
exports.updateConsolidatedSalaryRelease = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uconsolidatedsalary = await ConsolidatedSalaryRelease.findByIdAndUpdate(id, req.body);
    if (!uconsolidatedsalary) {
        return next(new ErrorHandler("ConsolidatedSalaryRelease not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete consolidatedsalary by id => /api/consolidatedsalary/:id
exports.deleteConsolidatedSalaryRelease = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dconsolidatedsalary = await ConsolidatedSalaryRelease.findByIdAndRemove(id);

    if (!dconsolidatedsalary) {
        return next(new ErrorHandler("ConsolidatedSalaryRelease not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});

// get monthwise ConsolidatedSalaryRelease => /api/ConsolidatedSalaryRelease
exports.consolidatedSalaryReleaseMonthWise = catchAsyncErrors(async (req, res, next) => {
    let consolidatedsalary;
    try {
        const { month, year, date } = req.body
        consolidatedsalary = await ConsolidatedSalaryRelease.find({ paymonth: month, payyear: year, paydate: date }, {});
    } catch (err) {
        console.log(err.message);
    }
    if (!consolidatedsalary) {
        return next(new ErrorHandler("ConsolidatedSalaryRelease not found!", 404));
    }
    return res.status(200).json({

        consolidatedsalary,
    });
});