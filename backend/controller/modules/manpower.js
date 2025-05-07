const Manpower = require('../../model/modules/manpower');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');

//get All manpowers =>/api/allmanpowers
exports.getAllManpower = catchAsyncErrors(async (req, res, next) => {
    let manpowers;
    try {
        manpowers = await Manpower.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!manpowers) {
        return next(new ErrorHandler('Company not found!', 404));
    }

    // Add serial numbers to the manpowers
    const allmanpowers = manpowers.map((manpower, index) => ({
        serialNumber: index + 1,
        ...manpower.toObject()
    }));

    return res.status(200).json({
        manpowers: allmanpowers
    });
})



exports.getAllFilterfloorManpower = catchAsyncErrors(async (req, res, next) => {
    let filtermanpowers;
    try {
        filtermanpowers = await Manpower.find({ floor: { $eq: req.body.floor } })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!filtermanpowers) {
        return next(new ErrorHandler('Company not found!', 404));
    }
    return res.status(200).json({
        filtermanpowers
    });
})

exports.getAllFilterareaManpower = catchAsyncErrors(async (req, res, next) => {
    let allareas;
    try {
     
     
      allareas = await Manpower.find({ company: req.body.company, branch: req.body.branch, floor: req.body.floor });

    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!allareas) {
      return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        allareas,
    });
})

//create new manpwer => /api/manpwer/new
exports.addManpower = catchAsyncErrors(async (req, res, next) => {

    let acompany = await Manpower.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single manpower => /api/manpower/:id
exports.getSingleManpower = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let smanpower = await Manpower.findById(id);
    if (!smanpower) {
        return next(new ErrorHandler('company not found', 404));
    }
    return res.status(200).json({
        smanpower
    })
})
//update manpower by id => /api/manpower/:id
exports.updateManpower = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let umanpower = await Manpower.findByIdAndUpdate(id, req.body);
    if (!umanpower) {
        return next(new ErrorHandler('company not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully', umanpower });
})



//delete umanpower by id => /api/umanpower/:id
exports.deleteManpower = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dmanpower = await Manpower.findByIdAndRemove(id);
    if (!dmanpower) {
        return next(new ErrorHandler('company not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
