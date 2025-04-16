const Checkpointticketmaster = require('../../../model/modules/tickets/checkpointticketmaster');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Checkpointticketmaster =>/api/Checkpointticketmaster
exports.getAllCheckpointticketmaster = catchAsyncErrors(async (req, res, next) => {
    let checkpointticketmasters;
    try {
        checkpointticketmasters = await Checkpointticketmaster.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!checkpointticketmasters) {
        return next(new ErrorHandler('Checkpointticketmaster not found!', 404));
    }
    return res.status(200).json({
        checkpointticketmasters
    });
})


//create new Checkpointticketmaster => /api/Checkpointticketmaster/new
exports.addCheckpointticketmaster = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aCheckpointticketmaster = await Checkpointticketmaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Checkpointticketmaster => /api/Checkpointticketmaster/:id
exports.getSingleCheckpointticketmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let scheckpointticketmaster = await Checkpointticketmaster.findById(id);
    if (!scheckpointticketmaster) {
        return next(new ErrorHandler('Checkpointticketmaster not found', 404));
    }
    return res.status(200).json({
        scheckpointticketmaster
    })
})

//update Checkpointticketmaster by id => /api/Checkpointticketmaster/:id
exports.updateCheckpointticketmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ucheckpointticketmaster = await Checkpointticketmaster.findByIdAndUpdate(id, req.body);
    if (!ucheckpointticketmaster) {
        return next(new ErrorHandler('Checkpointticketmaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Checkpointticketmaster by id => /api/Checkpointticketmaster/:id
exports.deleteCheckpointticketmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcheckpointticketmaster = await Checkpointticketmaster.findByIdAndRemove(id);
    if (!dcheckpointticketmaster) {
        return next(new ErrorHandler('Checkpointticketmaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
