
const Accounthead = require('../../../model/modules/account/accounthead');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');




// get All accounthead => /api/accountes
exports.getAllAccount = catchAsyncErrors(async (req, res, next) => {
    let accounthead;
    try {
        accounthead = await Accounthead.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!accounthead) {
        return next(new ErrorHandler('Accounthead not found!', 404));
    }
    return res.status(200).json({
        accounthead
    });
})

exports.getAccountAddress = catchAsyncErrors(async (req, res, next) => {
    let accountaddress
    try {
        accountaddress = await Accounthead.find({ name: req.body.accounthead })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!accountaddress) {
        return next(new ErrorHandler('Accounthead not found!', 404));
    }
    return res.status(200).json({
        accountaddress
    });
})





// Create new accounthead => /api/accounthead/new
exports.addAccount = catchAsyncErrors(async (req, res, next) => {



    let aaccount = await Accounthead.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Accounthead => /api/accounthead/:id
exports.getSingleAccount = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let saccount = await Accounthead.findById(id);

    if (!saccount) {
        return next(new ErrorHandler('Accounthead not found!', 404));
    }
    return res.status(200).json({
        saccount
    })
})
// update accounthead by id => /api/accounthead/:id
exports.updateAccount = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uaccount = await Accounthead.findByIdAndUpdate(id, req.body);

    if (!uaccount) {
        return next(new ErrorHandler('Accounthead not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})
// delete accounthead by id => /api/accounthead/:id
exports.deleteAccount = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let daccount = await Accounthead.findByIdAndRemove(id);

    if (!daccount) {
        return next(new ErrorHandler('Accounthead not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})


