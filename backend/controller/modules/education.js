const Education = require('../../model/modules/education');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');

// get All Skillset => /api/Skillsets
exports.getAllEducation = catchAsyncErrors(async (req, res, next) => {
    let educations;
    try {
        educations = await Education.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!educations) {
        return next(new ErrorHandler('Certification not found!', 404));
    }
    return res.status(200).json({
        educations
    });
})
// Create new Skillset => /api/Skillset/new
exports.addEducation = catchAsyncErrors(async (req, res, next) => {


    let aeducation = await Education.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})
// get Single Skillset => /api/Skillset/:id
exports.getSingleEducation = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let seducation = await Education.findById(id);

    if (!seducation) {
        return next(new ErrorHandler('Education not found!', 404));
    }
    return res.status(200).json({
        seducation
    })
})
// update Skillset by id => /api/Skillset/:id
exports.updateEducation = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ueducation = await Education.findByIdAndUpdate(id, req.body);

    if (!ueducation) {
        return next(new ErrorHandler('Education not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})
// delete Skillset by id => /api/Skillset/:id
exports.deleteEducation = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let deducation = await Education.findByIdAndRemove(id);

    if (!deducation) {
        return next(new ErrorHandler('Education not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})