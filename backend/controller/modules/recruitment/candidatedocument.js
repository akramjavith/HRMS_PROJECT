const Candidatedocument = require('../../../model/modules/recruitment/candidatedocument');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
//get All Candidatedocument =>/api/Candidatedocument
exports.getAllCandidatedocument = catchAsyncErrors(async (req, res, next) => {
    let candidatedocuments;
    try { 
        candidatedocuments = await Candidatedocument.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!candidatedocuments) {
        return next(new ErrorHandler('Candidatedocument not found!', 404));
    }
    return res.status(200).json({
        candidatedocuments
    });
})


//create new Candidatedocument => /api/Candidatedocument/new
exports.addCandidatedocument = catchAsyncErrors(async (req, res, next) => {
    let checkloc = await Candidatedocument.findOne({ code: req.body.code, });

    // if (checkloc) {
    //     return next(new ErrorHandler('Code already exist!', 400));
    // }
    // let checklocname = await Candidatedocument.findOne({ name: req.body.name });

    // if (checklocname) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aCandidatedocument = await Candidatedocument.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single Candidatedocument => /api/Candidatedocument/:id
exports.getSingleCandidatedocument = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let scandidatedocument = await Candidatedocument.findById(id);
    if (!scandidatedocument) {
        return next(new ErrorHandler('Candidatedocument not found', 404));
    }
    return res.status(200).json({
        scandidatedocument
    })
})
//update Candidatedocument by id => /api/Candidatedocument/:id
exports.updateCandidatedocument = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ucandidatedocument = await Candidatedocument.findByIdAndUpdate(id, req.body);
    if (!ucandidatedocument) {
        return next(new ErrorHandler('Candidatedocument not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})
//delete Candidatedocument by id => /api/Candidatedocument/:id 
exports.deleteCandidatedocument = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcandidatedocument = await Candidatedocument.findByIdAndRemove(id);
    if (!dcandidatedocument) {
        return next(new ErrorHandler('Candidatedocument not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})