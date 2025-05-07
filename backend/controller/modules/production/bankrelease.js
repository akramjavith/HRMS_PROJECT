const BankRelease = require("../../../model/modules/production/bankrelease");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All bankrelease => /api/bankrelease
exports.getAllBankRelease = catchAsyncErrors(async (req, res, next) => {
    let bankrelease;
    try {
        bankrelease = await BankRelease.find();
    } catch (err) {
        console.log(err.message);
    }
    if (!bankrelease) {
        return next(new ErrorHandler("BankRelease not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        bankrelease,
    });
});


// Create new bankrelease=> /api/bankrelease/new
exports.addBankRelease = catchAsyncErrors(async (req, res, next) => {
    try {
        // Create new BankRelease entry
        let abankrelease = await BankRelease.create(req.body);
        return res.status(200).json({
            message: 'Successfully added!'
        });
    } catch (error) {
        // Pass any errors to the centralized error handler
        next(error);
    }
});

// get Signle bankrelease => /api/bankrelease/:id
exports.getSingleBankRelease = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sbankrelease = await BankRelease.findById(id);

    if (!sbankrelease) {
        return next(new ErrorHandler("BankRelease not found!", 404));
    }
    return res.status(200).json({
        sbankrelease,
    });
});

// update bankrelease by id => /api/bankrelease/:id
exports.updateBankRelease = catchAsyncErrors(async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(id, 'fgh')
        let ubankrelease = await BankRelease.findByIdAndUpdate(id, req.body);

        if (!ubankrelease) {
            return next(new ErrorHandler("BankRelease not found!", 404));
        }
        return res.status(200).json({ message: "Updated successfully" });
    }
    catch (err) {
        console.log(err)
    }
});

// delete bankrelease by id => /api/bankrelease/:id
exports.deleteBankRelease = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dbankrelease = await BankRelease.findByIdAndRemove(id);

    if (!dbankrelease) {
        return next(new ErrorHandler("BankRelease not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});


// get All bankrelease => /api/bankrelease
exports.checkWithBankRelease = catchAsyncErrors(async (req, res, next) => {
    let bankrelease;
    try {
        const { month, year } = req.body

        bankrelease = await BankRelease.find({ month: month, year: year }, { date: 1 });
        // console.log(bankrelease, 'bankrelease')
    } catch (err) {
        console.log(err.message);
    }
    if (!bankrelease) {
        return next(new ErrorHandler("BankRelease not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        bankrelease,
    });
});

// get All bankrelease => /api/bankrelease
exports.bankReleaseLimited = catchAsyncErrors(async (req, res, next) => {
    let bankrelease;
    try {
        bankrelease = await BankRelease.find({}, { month: 1, year: 1, date: 1, bankclose: 1 });
    } catch (err) {
        console.log(err.message);
    }
    if (!bankrelease) {
        return next(new ErrorHandler("BankRelease not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        bankrelease,
    });
});