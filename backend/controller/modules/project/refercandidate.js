const Refercandidate = require('../../../model/modules/project/refercandidate');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Refercandidate =>/api/Refercandidate
exports.getAllRefercandidate = catchAsyncErrors(async (req, res, next) => {
    let refercandidates;
    try {
        refercandidates = await Refercandidate.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!refercandidates) {
        return next(new ErrorHandler('Refercandidate not found!', 404));
    }
    return res.status(200).json({
        refercandidates
    });
})
exports.getAllUserRefercandidate = catchAsyncErrors(async (req, res, next) => {
    let refercandidates;
    try {
        refercandidates = await Refercandidate.find({companyname:req.body.companyname}) 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!refercandidates) {
        return next(new ErrorHandler('Refercandidate not found!', 404));
    }
    return res.status(200).json({
        refercandidates
    });
})


//create new Refercandidate => /api/Refercandidate/new
exports.addRefercandidate = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aRefercandidate = await Refercandidate.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single refercandidate => /api/Refercandidate/:id
exports.getSingleRefercandidate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let srefercandidate= await Refercandidate.findById(id);
    if (!srefercandidate) {
        return next(new ErrorHandler('Refercandidate not found', 404));
    }
    return res.status(200).json({
        srefercandidate
    })
})

//update Refercandidate by id => /api/Refercandidate/:id
exports.updateRefercandidate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let urefercandidate = await Refercandidate.findByIdAndUpdate(id, req.body);
    if (!urefercandidate) {
        return next(new ErrorHandler('Refercandidate not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Refercandidate by id => /api/Noticereason/:id
exports.deleteRefercandidate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let drefercandidate = await Refercandidate.findByIdAndRemove(id);
    if (!drefercandidate) {
        return next(new ErrorHandler('Refercandidate not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
