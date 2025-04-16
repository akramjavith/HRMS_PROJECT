const Addexistsall = require('../../../model/modules/project/addexistsall');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Addexistsall =>/api/Addexistsall
exports.getAllAddexistsall = catchAsyncErrors(async (req, res, next) => {
    let addexistsall;
    try {
        addexistsall = await Addexistsall.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!addexistsall) {
        return next(new ErrorHandler('Addexistsall not found!', 404));
    }
    return res.status(200).json({
        addexistsall
    });
})

//create new Addexists => /api/Addexists/new
exports.addAddexistsall = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aAddexistsall = await Addexistsall.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// // get Single Addexists => /api/Addexists/:id
// exports.getSingleAddexistsall = catchAsyncErrors(async (req, res, next) => {
//     const id = req.params.id;
//     let saddexistsall = await Addexistsall.findById(id);
//     if (!saddexistsall) {
//         return next(new ErrorHandler('Addexistsall not found', 404));
//     }
//     return res.status(200).json({
//         saddexistsall
//     })
// })

// get Single module => /api/module/:id
exports.getSingleAddexistsall = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let saddexistsall = await Addexistsall.findById(id);
    if (!saddexistsall) {
        return next(new ErrorHandler('Addexistsall not found', 404));
    }
    return res.status(200).json({
        saddexistsall
    })
})

//update Addexistsall by id => /api/Addexistsall/:id
exports.updateAddexistsall = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uaddexistsall = await Addexistsall.findByIdAndUpdate(id, req.body);
    if (!uaddexistsall) {
        return next(new ErrorHandler('Addexistsall not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Addexists by id => /api/Addexists/:id
exports.deleteAddexistsall = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let daddexistsall = await Addexistsall.findByIdAndRemove(id);
    if (!daddexistsall) {
        return next(new ErrorHandler('Addexistsall not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
