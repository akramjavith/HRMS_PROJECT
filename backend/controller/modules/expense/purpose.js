const Purpose = require('../../../model/modules/expense/purpose');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Purpose =>/api/Purpose
exports.getAllPurpose = catchAsyncErrors(async (req, res, next) => {
    let purpose;
    try {
        purpose = await Purpose.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!purpose) {
        return next(new ErrorHandler('Purpose not found!', 404));
    }
    return res.status(200).json({
        purpose
    });
})


//create new Purpose => /api/Purpose/new
exports.addPurpose = catchAsyncErrors(async (req, res, next) => {
    
    let purpose = await Purpose.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Purpose => /api/Purpose/:id
exports.getSinglePurpose = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let purpose = await Purpose.findById(id);
    if (!purpose) {
        return next(new ErrorHandler('Purpose not found', 404));
    }
    return res.status(200).json({
        purpose
    })
})

//update Purpose by id => /api/Purpose/:id
exports.updatePurpose = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let purpose = await Purpose.findByIdAndUpdate(id, req.body);
    if (!purpose) {
        return next(new ErrorHandler('Purpose not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Purpose by id => /api/Purpose/:id
exports.deletePurpose = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let purpose = await Purpose.findByIdAndRemove(id);
    if (!purpose) {
        return next(new ErrorHandler('Purpose not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
