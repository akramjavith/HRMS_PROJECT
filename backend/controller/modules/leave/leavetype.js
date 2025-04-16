const Leavetype = require('../../../model/modules/leave/leavetype');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Leavetype =>/api/Leavetype
exports.getAllLeavetype = catchAsyncErrors(async (req, res, next) => {
    let leavetype;
    try {
        leavetype = await Leavetype.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!leavetype) {
        return next(new ErrorHandler('Leavetype not found!', 404));
    }
    return res.status(200).json({
        leavetype
    });
})


//create new Leavetype => /api/Leavetype/new
exports.addLeavetype = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aLeavetype = await Leavetype.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Leavetype => /api/Leavetype/:id
exports.getSingleLeavetype = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sleavetype = await Leavetype.findById(id);
    if (!sleavetype) {
        return next(new ErrorHandler('Leavetype not found', 404));
    }
    return res.status(200).json({
        sleavetype
    })
})

//update Leavetype by id => /api/Leavetype/:id
exports.updateLeavetype = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uleavetype = await Leavetype.findByIdAndUpdate(id, req.body);
    if (!uleavetype) {
        return next(new ErrorHandler('Leavetype not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Leavetype by id => /api/Leavetype/:id
exports.deleteLeavetype = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dleavetype = await Leavetype.findByIdAndRemove(id);
    if (!dleavetype) {
        return next(new ErrorHandler('Leavetype not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})