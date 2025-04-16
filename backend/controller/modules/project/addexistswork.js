const Addexistswork = require('../../../model/modules/project/addexistswork');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Addexistswork =>/api/Addexistswork
exports.getAllAddexistswork = catchAsyncErrors(async (req, res, next) => {
    let addexistswork;
    try {
        addexistswork = await Addexistswork.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!addexistswork) {
        return next(new ErrorHandler('Addexistswork not found!', 404));
    }
    return res.status(200).json({
        addexistswork
    });
})


//create new Addexistswork => /api/Addexistswork/new
exports.addAddexistswork = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aAddexistswork = await Addexistswork.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Addexistswork => /api/Addexistswork/:id
exports.getSingleAddexistswork = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let saddexistswork = await Addexistswork.findById(id);
    if (!saddexistswork) {
        return next(new ErrorHandler('Addexistswork not found', 404));
    }
    return res.status(200).json({
        saddexistswork
    })
})

//update Addexistswork by id => /api/Addexistswork/:id
exports.updateAddexistswork = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uaddexistswork = await Addexistswork.findByIdAndUpdate(id, req.body);
    if (!uaddexistswork) {
        return next(new ErrorHandler('Addexistswork not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Addexistswork by id => /api/Addexistswork/:id
exports.deleteAddexistswork = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let daddexistswork = await Addexistswork.findByIdAndRemove(id);
    if (!daddexistswork) {
        return next(new ErrorHandler('Addexistswork not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
