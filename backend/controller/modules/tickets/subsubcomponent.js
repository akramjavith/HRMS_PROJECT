const Subsubcomponent = require('../../../model/modules/tickets/subsubcomponent');
const Reasonmaster = require('../../../model/modules/tickets/reasonmaster');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 


//get All Subsubcomponent =>/api/Subsubcomponent
exports.getAllSubsubcomponent = catchAsyncErrors(async (req, res, next) => {
    let subsubcomponents;
    try {
        subsubcomponents = await Subsubcomponent.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!subsubcomponents) {
        return next(new ErrorHandler('Subsubcomponent not found!', 404));
    }
    return res.status(200).json({
        subsubcomponents
    });
})



  

//create new Subsubcomponent => /api/Subsubcomponent/new
exports.addSubsubcomponent = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aSubsubcomponent = await Subsubcomponent.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Subsubcomponent => /api/Subsubcomponent/:id
exports.getSingleSubsubcomponent = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ssubsubcomponent = await Subsubcomponent.findById(id);
    if (!ssubsubcomponent) {
        return next(new ErrorHandler('Subsubcomponent not found', 404));
    }
    return res.status(200).json({
        ssubsubcomponent
    })
})

//update Subsubcomponent by id => /api/Subsubcomponent/:id
exports.updateSubsubcomponent = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let usubsubcomponent = await Subsubcomponent.findByIdAndUpdate(id, req.body);
    if (!usubsubcomponent) {
        return next(new ErrorHandler('Subsubcomponent not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Subsubcomponent by id => /api/Subsubcomponent/:id
exports.deleteSubsubcomponent = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dsubsubcomponent = await Subsubcomponent.findByIdAndRemove(id);
    if (!dsubsubcomponent) {
        return next(new ErrorHandler('Subsubcomponent not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
