const Accountgroup = require('../../../model/modules/account/accontgroup');
const Accounthead = require('../../../model/modules/account/accounthead');

const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');



//overall delete
exports.getOverAllDeleteAccountHead = catchAsyncErrors(async (req, res, next) => {
    let accountgroups;
    try {
        let query = {
            groupname: { $in: req.body.under },

        };

        accountgroups = await Accounthead.find(query, {
            groupname: 1,
            _id: 0,
        });
        accountgroups = accountgroups.filter(
            (item, index, self) =>
                index === self.findIndex((t) => t.groupname === item.groupname)
        );

    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        accountgroups,
    });
});


//overall edit
exports.getOverAllEditAccountHead = catchAsyncErrors(async (req, res, next) => {
    let accountgroups;
    try {
        accountgroups = await Accounthead.find({ groupname: { $in: req.body.oldname } })

    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: accountgroups.length,
        accountgroups,
    });
});




//get All Accountgroup =>/api/Accountgroup
exports.getAllAccountgroup = catchAsyncErrors(async (req, res, next) => {
    let accountgroups;
    try {
        accountgroups = await Accountgroup.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!accountgroups) {
        return next(new ErrorHandler('Accountgroup not found!', 404));
    }
    return res.status(200).json({
        accountgroups
    });
})


//create new Accountgroup => /api/Accountgroup/new
exports.addAccountgroup = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aAccountgroup = await Accountgroup.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Accountgroup => /api/Accountgroup/:id
exports.getSingleAccountgroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let saccountgroup = await Accountgroup.findById(id);
    if (!saccountgroup) {
        return next(new ErrorHandler('Accountgroup not found', 404));
    }
    return res.status(200).json({
        saccountgroup
    })
})

//update Accountgroup by id => /api/Accountgroup/:id
exports.updateAccountgroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uaccountgroup = await Accountgroup.findByIdAndUpdate(id, req.body);
    if (!uaccountgroup) {
        return next(new ErrorHandler('Accountgroup not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Accountgroup by id => /api/Accountgroup/:id
exports.deleteAccountgroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let daccountgroup = await Accountgroup.findByIdAndRemove(id);
    if (!daccountgroup) {
        return next(new ErrorHandler('Accountgroup not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
