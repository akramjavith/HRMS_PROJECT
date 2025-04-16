const Source = require('../../../model/modules/task/source');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Source =>/api/Source
exports.getAllSource = catchAsyncErrors(async (req, res, next) => {
    let sources;
    try {
        sources = await Source.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!sources) {
        return next(new ErrorHandler('Source not found!', 404));
    }
    return res.status(200).json({
        sources
    });
})


//create new Source => /api/Source/new
exports.addSource = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aSource = await Source.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Source => /api/Source/:id
exports.getSingleSource = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ssource = await Source.findById(id);
    if (!ssource) {
        return next(new ErrorHandler('Source not found', 404));
    }
    return res.status(200).json({
        ssource
    })
})

//update Source by id => /api/Source/:id
exports.updateSource = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let usource = await Source.findByIdAndUpdate(id, req.body);
    if (!usource) {
        return next(new ErrorHandler('Source not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Source by id => /api/Source/:id
exports.deleteSource = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dsource = await Source.findByIdAndRemove(id);
    if (!dsource) {
        return next(new ErrorHandler('Source not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
