const AssetProblemmaster = require('../../../model/modules/account/Assetproblemmaster');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All AssetProblemmaster =>/api/AssetProblemmaster
exports.getAllAssetProblemmaster = catchAsyncErrors(async (req, res, next) => {
    let assetproblemmaster;
    try {
        assetproblemmaster = await AssetProblemmaster.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!assetproblemmaster) {
        return next(new ErrorHandler('AssetProblemmaster not found!', 404));
    }
    return res.status(200).json({
        assetproblemmaster
    });
})


//create new AssetProblemmaster => /api/AssetProblemmaster/new
exports.addAssetProblemmaster= catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let assetproblemmaster = await AssetProblemmaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single AssetProblemmaster => /api/AssetProblemmaster/:id
exports.getSingleAssetProblemmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sassetproblemmaster = await AssetProblemmaster.findById(id);
    if (!sassetproblemmaster) {
        return next(new ErrorHandler('AssetProblemmaster not found', 404));
    }
    return res.status(200).json({
        sassetproblemmaster
    })
})

//update AssetProblemmaster by id => /api/AssetProblemmaster/:id
exports.updateAssetProblemmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uassetproblemmaster = await AssetProblemmaster.findByIdAndUpdate(id, req.body);
    if (!uassetproblemmaster) {
        return next(new ErrorHandler('AssetProblemmaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete AssetProblemmaster by id => /api/AssetProblemmaster/:id
exports.deleteAssetProblemmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dassetproblemmaster = await AssetProblemmaster.findByIdAndRemove(id);
    if (!dassetproblemmaster) {
        return next(new ErrorHandler('AssetProblemmaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})