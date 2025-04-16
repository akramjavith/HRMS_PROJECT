const Assetcategorygrouping = require('../../../model/modules/tickets/assetcategorygrouping');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Assetcategorygrouping =>/api/Assetcategorygrouping
exports.getAllAssetcategorygrouping = catchAsyncErrors(async (req, res, next) => {
    let assetcategorygroupings;
    try {
        assetcategorygroupings = await Assetcategorygrouping.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!assetcategorygroupings) {
        return next(new ErrorHandler('Assetcategorygrouping not found!', 404));
    }
    return res.status(200).json({
        assetcategorygroupings
    });
})


//create new Assetcategorygrouping => /api/Assetcategorygrouping/new
exports.addAssetcategorygrouping = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aAssetcategorygrouping = await Assetcategorygrouping.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Assetcategorygrouping => /api/Assetcategorygrouping/:id
exports.getSingleAssetcategorygrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sassetcategorygrouping = await Assetcategorygrouping.findById(id);
    if (!sassetcategorygrouping) {
        return next(new ErrorHandler('Assetcategorygrouping not found', 404));
    }
    return res.status(200).json({
        sassetcategorygrouping
    })
})

//update Assetcategorygrouping by id => /api/Assetcategorygrouping/:id
exports.updateAssetcategorygrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uassetcategorygrouping = await Assetcategorygrouping.findByIdAndUpdate(id, req.body);
    if (!uassetcategorygrouping) {
        return next(new ErrorHandler('Assetcategorygrouping not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Assetcategorygrouping by id => /api/Assetcategorygrouping/:id
exports.deleteAssetcategorygroupingt = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dassetcategorygrouping = await Assetcategorygrouping.findByIdAndRemove(id);
    if (!dassetcategorygrouping) {
        return next(new ErrorHandler('Assetcategorygrouping not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
