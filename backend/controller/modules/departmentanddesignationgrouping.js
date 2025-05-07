const Departmentanddesignationgrouping = require('../../model/modules/departmentanddesignationgrouping');
const User = require('../../model/login/auth');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');

//get All Departmentanddesignationgrouping =>/api/Departmentanddesignationgrouping
exports.getAllDepartmentanddesignationgrouping = catchAsyncErrors(async (req, res, next) => {
    let departmentanddesignationgroupings;
    try {
        departmentanddesignationgroupings = await Departmentanddesignationgrouping.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!departmentanddesignationgroupings) {
        return next(new ErrorHandler('Departmentanddesignationgrouping not found!', 404));
    }
    return res.status(200).json({
        departmentanddesignationgroupings
    });
})


//create new Departmentanddesignationgrouping => /api/Departmentanddesignationgrouping/new
exports.addDepartmentanddesignationgrouping = catchAsyncErrors(async (req, res, next) => {
    let checkloc = await Departmentanddesignationgrouping.findOne({ code: req.body.code, });

    let aDepartmentanddesignationgrouping = await Departmentanddesignationgrouping.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single Departmentanddesignationgrouping => /api/Departmentanddesignationgrouping/:id
exports.getSingleDepartmentanddesignationgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sdepartmentanddesignationgrouping = await Departmentanddesignationgrouping.findById(id);
    if (!sdepartmentanddesignationgrouping) {
        return next(new ErrorHandler('Departmentanddesignationgrouping not found', 404));
    }
    return res.status(200).json({
        sdepartmentanddesignationgrouping
    })
})
//update Departmentanddesignationgrouping by id => /api/Departmentanddesignationgrouping/:id
exports.updateDepartmentanddesignationgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let udepartmentanddesignationgrouping = await Departmentanddesignationgrouping.findByIdAndUpdate(id, req.body);
    if (!udepartmentanddesignationgrouping) {
        return next(new ErrorHandler('Departmentanddesignationgrouping not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})
//delete Departmentanddesignationgrouping by id => /api/Departmentanddesignationgrouping/:id
exports.deleteDepartmentanddesignationgrouping = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ddepartmentanddesignationgrouping = await Departmentanddesignationgrouping.findByIdAndRemove(id);
    if (!ddepartmentanddesignationgrouping) {
        return next(new ErrorHandler('Departmentanddesignationgrouping not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})