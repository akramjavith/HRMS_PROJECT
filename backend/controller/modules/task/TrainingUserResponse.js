const TrainingUserResponse = require('../../../model/modules/task/trainingUserResponse');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All TrainingUserResponse =>/api/TrainingUserResponse
exports.getAllTrainingUserResponse = catchAsyncErrors(async (req, res, next) => {
    let traininguserresponses;
    try {
        traininguserresponses = await TrainingUserResponse.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!traininguserresponses) {
        return next(new ErrorHandler('Training User Response not found!', 404));
    }
    return res.status(200).json({
        traininguserresponses
    });
})


//create new TrainingUserResponse => /api/TrainingUserResponse/new
exports.addTrainingUserResponse = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let atraininguserresponses = await TrainingUserResponse.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single TrainingUserResponse => /api/TrainingUserResponse/:id
exports.getSingleTrainingUserResponse = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let straininguserresponses = await TrainingUserResponse.findById(id);
    if (!straininguserresponses) {
        return next(new ErrorHandler('Training User Response not found', 404));
    }
    return res.status(200).json({
        straininguserresponses
    })
})

//update TrainingUserResponse by id => /api/TrainingUserResponse/:id
exports.updateTrainingUserResponse = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let utraininguserresponses = await TrainingUserResponse.findByIdAndUpdate(id, req.body);
    if (!utraininguserresponses) {
        return next(new ErrorHandler('Training User Response not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete TrainingUserResponse by id => /api/TrainingUserResponse/:id
exports.deleteTrainingUserResponse = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dtraininguserresponses = await TrainingUserResponse.findByIdAndRemove(id);
    if (!dtraininguserresponses) {
        return next(new ErrorHandler('Training User Response not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
