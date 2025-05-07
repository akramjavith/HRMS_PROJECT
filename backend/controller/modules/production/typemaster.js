const TypeMaster = require('../../../model/modules/production/typemaster');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All TypeMaster =>/api/TypeMaster
exports.getAllTypeMaster = catchAsyncErrors(async (req, res, next) => {
    let typemasters;
    try {
        typemasters = await TypeMaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!typemasters) {
        return next(new ErrorHandler('TypeMaster not found!', 404));
    }
    return res.status(200).json({
        typemasters
    });
})


//create new TypeMaster => /api/TypeMaster/new
exports.addTypeMaster = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aTypeMaster = await TypeMaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single TypeMaster => /api/TypeMaster/:id
exports.getSingleTypeMaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let stypemaster = await TypeMaster.findById(id);
    if (!stypemaster) {
        return next(new ErrorHandler('TypeMaster not found', 404));
    }
    return res.status(200).json({
        stypemaster
    })
})

//update TypeMaster by id => /api/TypeMaster/:id
exports.updateTypeMaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let utypemaster = await TypeMaster.findByIdAndUpdate(id, req.body);
    if (!utypemaster) {
        return next(new ErrorHandler('TypeMaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete TypeMaster by id => /api/TypeMaster/:id
exports.deleteTypeMaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dtypemaster = await TypeMaster.findByIdAndRemove(id);
    if (!dtypemaster) {
        return next(new ErrorHandler('TypeMaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
