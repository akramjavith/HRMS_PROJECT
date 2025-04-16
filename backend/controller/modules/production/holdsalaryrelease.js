const HoldSalaryRelease = require("../../../model/modules/production/holdsalaryrelease");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All holdsalaryrelease => /api/holdsalaryrelease
exports.getAllHoldSalaryRelease = catchAsyncErrors(async (req, res, next) => {
    let holdsalaryrelease;
    try {
        holdsalaryrelease = await HoldSalaryRelease.find();
    } catch (err) {
        console.log(err.message);
    }
    if (!holdsalaryrelease) {
        return next(new ErrorHandler("HoldSalaryRelease not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        holdsalaryrelease,
    });
});


// Create new holdsalaryrelease=> /api/holdsalaryrelease/new
exports.addHoldSalaryRelease = catchAsyncErrors(async (req, res, next) => {
    try {
        // Create new HoldSalaryRelease entry
        let aholdsalaryrelease = await HoldSalaryRelease.create(req.body);
        return res.status(200).json({
            message: 'Successfully added!'
        });
    } catch (error) {
        // Pass any errors to the centralized error handler
        next(error);
    }
});

// get Signle holdsalaryrelease => /api/holdsalaryrelease/:id
exports.getSingleHoldSalaryRelease = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sholdsalaryrelease = await HoldSalaryRelease.findById(id);

    if (!sholdsalaryrelease) {
        return next(new ErrorHandler("HoldSalaryRelease not found!", 404));
    }
    return res.status(200).json({
        sholdsalaryrelease,
    });
});

// update holdsalaryrelease by id => /api/holdsalaryrelease/:id
exports.updateHoldSalaryRelease = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uholdsalaryrelease = await HoldSalaryRelease.findByIdAndUpdate(id, req.body);
    if (!uholdsalaryrelease) {
        return next(new ErrorHandler("HoldSalaryRelease not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete holdsalaryrelease by id => /api/holdsalaryrelease/:id
exports.deleteHoldSalaryRelease = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dholdsalaryrelease = await HoldSalaryRelease.findByIdAndRemove(id);

    if (!dholdsalaryrelease) {
        return next(new ErrorHandler("HoldSalaryRelease not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});

// get All holdsalaryrelease => /api/holdsalaryrelease
exports.holdSalaryYetToConfirmList = catchAsyncErrors(async (req, res, next) => {
    let holdsalaryrelease;
    try {
        const { month, year, employees } = req.body

        holdsalaryrelease = await HoldSalaryRelease.find({ paymonth: month, payyear: year, companyname: { $in: employees } }, {});
    } catch (err) {
        console.log(err.message);
    }
    if (!holdsalaryrelease) {
        return next(new ErrorHandler("HoldSalaryRelease not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        holdsalaryrelease,
    });
});