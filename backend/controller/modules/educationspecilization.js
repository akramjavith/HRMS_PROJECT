const Educationspecilization = require('../../model/modules/educationspecilization');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError'); 

//get All Educationspecilization =>/api/Educationspecilization
exports.getAllEducationspecilization = catchAsyncErrors(async (req, res, next) => {
    let educationspecilizations;
    try {
        educationspecilizations = await Educationspecilization.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!educationspecilizations) {
        return next(new ErrorHandler('Educationspecilization not found!', 404));
    }
    return res.status(200).json({
        educationspecilizations
    });
})


//create new Educationspecilization => /api/Educationspecilization/new
exports.addEducationspecilization = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aEducationspecilizationr = await Educationspecilization.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Educationspecilization => /api/Educationspecilization/:id
exports.getSingleEducationspecilization = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let seducationspecilization = await Educationspecilization.findById(id);
    if (!seducationspecilization) {
        return next(new ErrorHandler('Educationspecilization not found', 404));
    }
    return res.status(200).json({
        seducationspecilization
    })
})

//update Educationspecilization by id => /api/Educationspecilization/:id
exports.updateEducationspecilization = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ueducationspecilization = await Educationspecilization.findByIdAndUpdate(id, req.body);
    if (!ueducationspecilization) {
        return next(new ErrorHandler('Educationspecilization not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Educationspecilization by id => /api/Educationspecilization/:id
exports.deleteEducationspecilization = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let deducationspecilization = await Educationspecilization.findByIdAndRemove(id);
    if (!deducationspecilization) {
        return next(new ErrorHandler('Educationspecilization not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
