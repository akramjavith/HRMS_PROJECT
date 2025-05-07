const Controlsgrouping = require("../../../model/modules/role/controlgrouping");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");


//get All Controlsgrouping =>/api/Controlsgrouping
exports.getAllControlsgrouping = catchAsyncErrors(async (req, res, next) => {
    let controlsgroupings;
    try {
        controlsgroupings = await Controlsgrouping.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!controlsgroupings) {
        return next(new ErrorHandler('Controlsgrouping not found!', 404));
    }
    return res.status(200).json({
        controlsgroupings
    });
})


//create new Controlsgrouping => /api/Controlsgrouping/new
exports.addControlsgrouping = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aControlsgrouping = await Controlsgrouping.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Controlsgrouping => /api/Controlsgrouping/:id
exports.getSingleControlsgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let scontrolsgrouping = await Controlsgrouping.findById(id);
    if (!scontrolsgrouping) {
        return next(new ErrorHandler('Controlsgrouping not found', 404));
    }
    return res.status(200).json({
        scontrolsgrouping
    })
})

//update Controlsgrouping by id => /api/Controlsgrouping/:id
exports.updateControlsgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ucontrolsgrouping = await Controlsgrouping.findByIdAndUpdate(id, req.body);
    if (!ucontrolsgrouping) {
        return next(new ErrorHandler('Controlsgrouping not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Controlsgrouping by id => /api/Controlsgrouping/:id
exports.deleteControlsgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcontrolsgrouping = await Controlsgrouping.findByIdAndRemove(id);
    if (!dcontrolsgrouping) {
        return next(new ErrorHandler('Controlsgrouping not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
