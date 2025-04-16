const Managematerial = require('../../../model/modules/eb/managematerial');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Managematerial =>/api/Managematerial
exports.getAllManagematerial = catchAsyncErrors(async (req, res, next) => {
    let managematerials;
    try {
        managematerials = await Managematerial.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!managematerials) {
        return next(new ErrorHandler('Managematerial not found!', 404));
    }
    return res.status(200).json({
        managematerials
    });
})


//create new Managematerial => /api/Managematerial/new
exports.addManagematerial = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aManagematerial = await Managematerial.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Managematerial => /api/Managematerial/:id
exports.getSingleManagematerial = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let smanagematerial = await Managematerial.findById(id);
    if (!smanagematerial) {
        return next(new ErrorHandler('Managematerial not found', 404));
    }
    return res.status(200).json({
        smanagematerial
    })
})

//update Managematerial by id => /api/Managematerial/:id
exports.updateManagematerial = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let umanagematerial = await Managematerial.findByIdAndUpdate(id, req.body);
    if (!umanagematerial) {
        return next(new ErrorHandler('Managematerial not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Managematerial by id => /api/Managematerial/:id
exports.deleteManagematerial = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dmanagematerial = await Managematerial.findByIdAndRemove(id);
    if (!dmanagematerial) {
        return next(new ErrorHandler('Managematerial not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})