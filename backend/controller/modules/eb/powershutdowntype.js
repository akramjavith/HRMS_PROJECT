const Shutdowntypename = require('../../../model/modules/eb/powershutdowntype');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const PowerStation = require("../../../model/modules/eb/powerstation");

//get All managepowershutdowntypename =>/api/managepowershutdowntypename
exports.getAllManagepowershutdowntypename = catchAsyncErrors(async (req, res, next) => {
    let managepowershutdowntypename;
    try {
        managepowershutdowntypename = await Shutdowntypename.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!managepowershutdowntypename) {
        return next(new ErrorHandler('Managepowershutdowntypename not found!', 404));
    }
    return res.status(200).json({
        managepowershutdowntypename
    });
})


// get overall Edit functionality
exports.getOverAllEditPower = catchAsyncErrors(async (req, res, next) => {
    let ebuse;
    try {

        ebuse = await PowerStation.find({ powershutdowntype: { $in: req.body.oldname } })

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebuse) {
        return next(new ErrorHandler("Managepowershutdowntypename not found!", 404));
    }
    return res.status(200).json({
        count: ebuse.length,
        ebuse
    });
});


//create new managepowershutdowntypename => /api/managepowershutdowntypename/new
exports.addManagepowershutdowntypename = catchAsyncErrors(async (req, res, next) => {

    let managepowershutdowntypename = await Shutdowntypename.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single managepowershutdowntypename => /api/managepowershutdowntypename/:id
exports.getSingleManagepowershutdowntypename = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let managepowershutdowntypename = await Shutdowntypename.findById(id);
    if (!managepowershutdowntypename) {
        return next(new ErrorHandler('Managepowershutdowntypename not found', 404));
    }
    return res.status(200).json({
        managepowershutdowntypename
    })
})

//update managepowershutdowntypename by id => /api/managepowershutdowntypename/:id
exports.updateManagepowershutdowntypename = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let managepowershutdowntypename = await Shutdowntypename.findByIdAndUpdate(id, req.body);
    if (!managepowershutdowntypename) {
        return next(new ErrorHandler('Managepowershutdowntypename not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Assignedby by id => /api/Assignedby/:id
exports.deleteManagepowershutdowntypename = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let managepowershutdowntypename = await Shutdowntypename.findByIdAndRemove(id);
    if (!managepowershutdowntypename) {
        return next(new ErrorHandler('Managepowershutdowntypename not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})