const Certification = require('../../model/modules/certification');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');

// get All Skillset => /api/Skillsets
exports.getAllCertification = catchAsyncErrors(async (req, res, next) => {
    let certifications;
    try {
        certifications = await Certification.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!certifications) {
        return next(new ErrorHandler('Certification not found!', 404));
    }
    return res.status(200).json({
        certifications
    });
})
// Create new Skillset => /api/Skillset/new
exports.addCertification = catchAsyncErrors(async (req, res, next) => {


    let acertification = await Certification.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})
// get Single Skillset => /api/Skillset/:id
exports.getSingleCertification = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let scertification = await Certification.findById(id);

    if (!scertification) {
        return next(new ErrorHandler('Certification not found!', 404));
    }
    return res.status(200).json({
        scertification
    })
})
// update Skillset by id => /api/Skillset/:id
exports.updateCertification = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ucertification = await Certification.findByIdAndUpdate(id, req.body);

    if (!ucertification) {
        return next(new ErrorHandler('Certification not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})
// delete Skillset by id => /api/Skillset/:id
exports.deleteCertification = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcertification = await Certification.findByIdAndRemove(id);

    if (!dcertification) {
        return next(new ErrorHandler('Certification not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})