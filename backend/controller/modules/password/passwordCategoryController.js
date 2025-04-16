const PasswordCategory = require('../../../model/modules/password/passwordCategoryModel');
const AddPassword = require('../../../model/modules/password/addPasswordModel');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get all passwordcategory => /api/passwordcategories
exports.getAllPassCategory = catchAsyncErrors(async (req, res, next) => {
    let passcategory
    try {
        passcategory = await PasswordCategory.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!passcategory) {
        return next(new ErrorHandler('category not found', 404));
    }
    // Add serial numbers to the passcategory
    const allpasscategory = passcategory.map((data, index) => ({
        serialNumber: index + 1,
        ...data.toObject()
    }));

    return res.status(200).json({
        passcategory: allpasscategory
    });

})

// add passwordcategory =>/api/passwordcategory/new
exports.addPassCategory = catchAsyncErrors(async (req, res, next) => {
    await PasswordCategory.create(req.body);
    return res.status(200).json({
        message: 'Successfully added'
    })
})

// get single passwordcategory =>/api/passwordcategory/:id
exports.getSinglePassCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let spasscategory = await PasswordCategory.findById(id);
    if (!spasscategory) {
        return next(new ErrorHandler('category not found', 404));

    }
    return res.status(200).json({
        spasscategory
    });

});

// update single passwordcategory =>/api/passwordcategory/:id
exports.updatePassCategory = catchAsyncErrors(async (req, res, next) => {

    const id = req.params.id

    let upasscategory = await PasswordCategory.findByIdAndUpdate(id, req.body);

    if (!upasscategory) {
        return next(new ErrorHandler('category not found', 404));
    }
    return res.status(200).json({
        message: 'Update Successfully', upasscategory
    });
});

// delete single passwordcategory =>/api/passwordcategory/:id
exports.deletePassCategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dpasscategory = await PasswordCategory.findByIdAndRemove(id);
    if (!dpasscategory) {
        return next(new ErrorHandler('category not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})


// get overall delete functionality
exports.getOverAllPasswordCategoryCheck = catchAsyncErrors(async (req, res, next) => {
    let ipcat;
    try {
        // ipcat = await ipCategory.find();
        let query = {
            category: { $in: req.body.checkunit },
        };
        ipcat = await AddPassword.find(query, {
            category: 1,

            _id: 0,
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ipcat) {
        return next(new ErrorHandler("Ipcategory not found!", 404));
    }
    return res.status(200).json({
        ipcat,
    });
});


/// get overall edit
exports.getOverAllEditPasswordcategory = catchAsyncErrors(async (req, res, next) => {
    let password
    try {
        // password = await AddPassword.find({ categoryname: req.body.oldname });

        password = await AddPassword.find({ category: req.body.oldname });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!password) {
        return next(new ErrorHandler("Password not found", 404));
    }
    return res.status(200).json({
        count: password.length,
        password,

    });
});