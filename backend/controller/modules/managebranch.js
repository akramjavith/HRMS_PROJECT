const Managebranch = require('../../model/modules/Managebranch');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');


// get All Manage Branch => /api/manages
exports.getAllManage = catchAsyncErrors(async (req, res, next) => {
    let manage;
    try {
        manage = await Managebranch.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!manage) {
        return next(new ErrorHandler('Manage not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        manage
    });
})
// Create new manage branch => /api/manage/new
exports.addManage = catchAsyncErrors(async (req, res, next) => {


    let amanage = await Managebranch.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})
// get Signle manage branch => /api/manage/:id
exports.getSingleManage = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let smanage = await Managebranch.findById(id);

    if (!smanage) {
        return next(new ErrorHandler('Manage not found!', 404));
    }
    return res.status(200).json({
        smanage
    })
})
// update manage branch by id => /api/manage/:id
exports.updateManage = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let umanage = await Managebranch.findByIdAndUpdate(id, req.body);

    if (!umanage) {
        return next(new ErrorHandler('Manage not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})
// delete manage branch by id => /api/manage/:id
exports.deleteManage = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dmanage = await Managebranch.findByIdAndRemove(id);

    if (!dmanage) {
        return next(new ErrorHandler('Manage not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})