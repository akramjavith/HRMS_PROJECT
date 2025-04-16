const Roleandresponsibilities = require('../../../model/modules/recruitment/roleandresponse');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Roleandresponsibilities  Details => /api/queue
exports.getAllRoleandresponsibilities = catchAsyncErrors(async (req, res, next) => {
    let roleandresponsibilities;
    try {
        roleandresponsibilities = await Roleandresponsibilities.find()
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

// Create new Roleandresponsibilities => /api/queue/new
exports.addRoleandresponsibilities = catchAsyncErrors(async (req, res, next) => {
    // let queuegroup = await Roleandresponsibilities.findOne({ name: req.body.name });
    // if (queuegroup) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aapprovevacancies = await Roleandresponsibilities.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Roleandresponsibilities => /api/queue/:id
exports.getSingleRoleandresponsibilities = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sroleandresponsibilities = await Roleandresponsibilities.findById(id);
    if (!sroleandresponsibilities) {
        return next(new ErrorHandler('Role And Responsibilities not found', 404));
    }
    return res.status(200).json({
        sroleandresponsibilities
    })
})

// update Roleandresponsibilities by id => /api/queue/:id
exports.updateRoleandresponsibilities = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uroleandresponsibilities = await Roleandresponsibilities.findByIdAndUpdate(id, req.body);
    if (!uroleandresponsibilities) {
        return next(new ErrorHandler('Role And Responsibilities Details not found', 404));
    }
    return res.status(200).json({ message: 'Updates successfully' });
})
// delete Roleandresponsibilities by id => /api/queue/:id
exports.deleteRoleandresponsibilities = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let droleandresponsibilities = await Roleandresponsibilities.findByIdAndRemove(id);
    if (!droleandresponsibilities) {
        return next(new ErrorHandler('Role And Responsibilities Details not found', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})