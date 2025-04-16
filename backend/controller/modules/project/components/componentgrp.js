const Componentsgrouping = require('../../../../model/modules/project/components/componentgrp');
const ErrorHandler = require('../../../../utils/errorhandler');
const catchAsyncErrors = require('../../../../middleware/catchAsyncError');


// get All Componentsgrouping => /api/Componentsgrouping
exports.getAllComponentsgrouping = catchAsyncErrors(async (req, res, next) => {
    let compgrouping;
    try {
        compgrouping = await Componentsgrouping.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!compgrouping) {
        return next(new ErrorHandler('Componentsgrouping not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        compgrouping
    });
})



// Create new Componentsgrouping=> /api/componentsgrouping/new
exports.addcompgrouping = catchAsyncErrors(async (req, res, next) => {
    let checkloc = await Componentsgrouping.findOne({ name: req.body.name });

    if (checkloc) {
        return next(new ErrorHandler('Componentsgrouping already exist!', 400));
    }

    let aproduct = await Componentsgrouping.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'

    });
})

// get Signle Componentsgrouping => /api/componentsgrouping/:id
exports.getSinglecompgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let scompgrouping = await Componentsgrouping.findById(id);

    if (!scompgrouping) {
        return next(new ErrorHandler('Componentsgrouping not found!', 404));
    }
    return res.status(200).json({
        scompgrouping
    })
})

// update Componentsgrouping by id => /api/componentsgrouping/:id
exports.updatecompgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ucompgrouping = await Componentsgrouping.findByIdAndUpdate(id, req.body);

    if (!ucompgrouping) {
        return next(new ErrorHandler('Componentsgrouping not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

// delete Componentsgrouping by id => /api/componentsgrouping/:id
exports.deletecompgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dcompgrouping = await Componentsgrouping.findByIdAndRemove(id);

    if (!dcompgrouping) {
        return next(new ErrorHandler('Componentsgrouping not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})