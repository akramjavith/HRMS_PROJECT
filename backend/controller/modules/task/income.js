const Income = require('../../../model/modules/task/income');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Income =>/api/Income
exports.getAllIncome = catchAsyncErrors(async (req, res, next) => {
    let incomes;
    try {
        incomes = await Income.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!incomes) {
        return next(new ErrorHandler('Income not found!', 404));
    }
    return res.status(200).json({
        incomes
    });
})


//create new Income => /api/Income/new
exports.addIncome = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aIncome = await Income.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Income => /api/Income/:id
exports.getSingleIncome = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sincome = await Income.findById(id);
    if (!sincome) {
        return next(new ErrorHandler('Income not found', 404));
    }
    return res.status(200).json({
        sincome
    })
})

//update Income by id => /api/Income/:id
exports.updateIncome = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uincome = await Income.findByIdAndUpdate(id, req.body);
    if (!uincome) {
        return next(new ErrorHandler('Income not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Income by id => /api/Income/:id
exports.deleteIncome = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dincome = await Income.findByIdAndRemove(id);
    if (!dincome) {
        return next(new ErrorHandler('Income not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})


