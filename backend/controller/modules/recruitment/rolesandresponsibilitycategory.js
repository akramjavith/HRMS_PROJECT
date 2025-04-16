const Rolesndresponsibilitycategory = require('../../../model/modules/recruitment/rolesandresponsibilitycategory');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Rolesndresponsibilitycategory  Details => /api/queue
exports.getAllRoleandresponsibilitiesCat = catchAsyncErrors(async (req, res, next) => {
    let roleandresponsibilities;
    try {
        roleandresponsibilities = await Rolesndresponsibilitycategory.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!roleandresponsibilities) {
        return next(new ErrorHandler('Role And Responsibilities not found', 404));
    }
    return res.status(200).json({
        roleandresponsibilities
    });

})

// Create new Rolesndresponsibilitycategory => /api/queue/new
exports.addRoleandresponsibilitiesCat = catchAsyncErrors(async (req, res, next) => {
    let arolesandresponsibilitycategory = await Rolesndresponsibilitycategory.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Rolesndresponsibilitycategory => /api/queue/:id
exports.getSingleRoleandresponsibilitiesCat = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sroleandresponsibilities = await Rolesndresponsibilitycategory.findById(id);
    if (!sroleandresponsibilities) {
        return next(new ErrorHandler('Role And Responsibilities not found', 404));
    }
    return res.status(200).json({
        sroleandresponsibilities
    })
})

// update Rolesndresponsibilitycategory by id => /api/queue/:id
exports.updateRoleandresponsibilitiesCat = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uroleandresponsibilities = await Rolesndresponsibilitycategory.findByIdAndUpdate(id, req.body);
    if (!uroleandresponsibilities) {
        return next(new ErrorHandler('Role And Responsibilities Details not found', 404));
    }
    return res.status(200).json({ message: 'Updates successfully' });
})



// delete Rolesndresponsibilitycategory by id => /api/queue/:id
exports.deleteRoleandresponsibilitiesCat = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let droleandresponsibilities = await Rolesndresponsibilitycategory.findByIdAndRemove(id);
    if (!droleandresponsibilities) {
        return next(new ErrorHandler('Role And Responsibilities Details not found', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})