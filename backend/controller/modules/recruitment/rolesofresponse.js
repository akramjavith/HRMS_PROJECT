const Roleofresponse = require('../../../model/modules/recruitment/rolesofresponse');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All Roleofresponse  Details => /api/queue
exports.getAllRoleandres = catchAsyncErrors(async (req, res, next) => {
    let roleandresponsibilities;
    try {
        roleandresponsibilities = await Roleofresponse.find()
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

// Create new Roleofresponse => /api/queue/new
exports.addRoleandres = catchAsyncErrors(async (req, res, next) => {
    // let queuegroup = await Roleofresponse.findOne({ name: req.body.name });
    // if (queuegroup) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aapprovevacancies = await Roleofresponse.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Roleofresponse => /api/queue/:id
exports.getSingleRoleandres = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sroleandresponsibilities = await Roleofresponse.findById(id);
    if (!sroleandresponsibilities) {
        return next(new ErrorHandler('Role And Responsibilities not found', 404));
    }
    return res.status(200).json({
        sroleandresponsibilities
    })
})

// update Roleofresponse by id => /api/queue/:id
exports.updateRoleandres = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uroleandresponsibilities = await Roleofresponse.findByIdAndUpdate(id, req.body);
    if (!uroleandresponsibilities) {
        return next(new ErrorHandler('Role And Responsibilities Details not found', 404));
    }
    return res.status(200).json({ message: 'Updates successfully' });
})
// delete Roleofresponse by id => /api/queue/:id
exports.deleteRoleandres = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let droleandresponsibilities = await Roleofresponse.findByIdAndRemove(id);
    if (!droleandresponsibilities) {
        return next(new ErrorHandler('Role And Responsibilities Details not found', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})