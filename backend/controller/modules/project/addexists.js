const Addexists = require('../../../model/modules/project/addexists');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Addexists =>/api/Addexists
exports.getAllAddexists = catchAsyncErrors(async (req, res, next) => {
    let addexists;
    try {
        addexists = await Addexists.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!addexists) {
        return next(new ErrorHandler('Addexists not found!', 404));
    }
    return res.status(200).json({
        addexists
    });
})


//create new Addexists => /api/Addexists/new
exports.addAddexists = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aAddexists = await Addexists.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Addexists => /api/Addexists/:id
exports.getSingleAddexists = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let saddexists = await Addexists.findById(id);
    if (!saddexists) {
        return next(new ErrorHandler('Addexists not found', 404));
    }
    return res.status(200).json({
        saddexists
    })
})

//update Addexists by id => /api/Addexists/:id
exports.updateAddexists = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uaddexists = await Addexists.findByIdAndUpdate(id, req.body);
    if (!uaddexists) {
        return next(new ErrorHandler('Addexists not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Addexists by id => /api/Addexists/:id
exports.deleteAddexists = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let daddexists = await Addexists.findByIdAndRemove(id);
    if (!daddexists) {
        return next(new ErrorHandler('Addexists not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
