const Managecmpany = require('../../model/modules/managecompany');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');


// get All managecompany Branch => /api/managecompanys
exports.getAllManagecompany = catchAsyncErrors(async (req, res, next) => {
    let managecompany;
    try {
        managecompany = await Managecmpany.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!managecompany) {
        return next(new ErrorHandler('managecompany not found!', 404));
    }
    return res.status(200).json({
        // count: products.length,
        managecompany
    });
})
// Create new managecompany branch => /api/managecompany/new
exports.addManagecompany = catchAsyncErrors(async (req, res, next) => {

    let amanagecompany = await Managecmpany.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})
// get Signle managecompany branch => /api/managecompany/:id
exports.getSingleManagecompany = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let smanagecompany = await Managecmpany.findById(id);

    if (!smanagecompany) {
        return next(new ErrorHandler('managecompany not found!', 404));
    }
    return res.status(200).json({
        smanagecompany
    })
})
// update managecompany branch by id => /api/managecompany/:id
exports.updateManagecompany = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let umanagecompany = await Managecmpany.findByIdAndUpdate(id, req.body);

    if (!umanagecompany) {
        return next(new ErrorHandler('managecompany not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})
// delete managecompany branch by id => /api/managecompany/:id
exports.deleteManagecompany = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dmanagecompany = await Managecmpany.findByIdAndRemove(id);

    if (!dmanagecompany) {
        return next(new ErrorHandler('managecompany not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})