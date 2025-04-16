const ControlName = require('../../model/modules/controlName')
// const Vendor = require('../../../model/modules/setup/vendor');
// const Category = require('../../../model/modules/setup/category');
// const Subcategory = require('../../../model/modules/setup/subcategory');
// const Timepoints = require('../../../model/modules/setup/timepoints');
// // const Designation = require('../../model/modules/designation');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError')


// get All Projectmaster => /api/controlName
exports.getAllControlName = catchAsyncErrors(async (req, res, next) => {
    let projmaster;
    try {
        projmaster = await ControlName.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!projmaster) {
        return next(new ErrorHandler('Control Name not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        projmaster
    });
})


// Create new Projectmaster=> /api/controlName/new
exports.addcontrolname = catchAsyncErrors(async (req, res, next) => {
    let checkloc = await ControlName.findOne({ name: req.body.name });

    if (checkloc) {
        return next(new ErrorHandler('Control Name already exist!', 400));
    }

    let aproduct = await ControlName.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'

    });
})

// get Signle Projectmaster => /api/projectmaster/:id
exports.getSingleControlName = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sprojmaster = await ControlName.findById(id);

    if (!sprojmaster) {
        return next(new ErrorHandler('Control Name not found!', 404));
    }
    return res.status(200).json({
        sprojmaster
    })
})

// update Projectmaster by id => /api/projmaster/:id
exports.updatecontrolname = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uprojmaster = await ControlName.findByIdAndUpdate(id, req.body);

    if (!uprojmaster) {
        return next(new ErrorHandler('Control Name not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})


// delete Projectmaster by id => /api/projectmaster/:id
exports.deletecontrolname = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dprojmaster = await ControlName.findByIdAndRemove(id);

    if (!dprojmaster) {
        return next(new ErrorHandler('ControlName not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})