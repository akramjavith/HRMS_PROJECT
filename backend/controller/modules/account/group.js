const Group = require('../../../model/modules/account/group');
const Accountgroup = require('../../../model/modules/account/accontgroup');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All Group =>/api/Group
exports.getAllGroup = catchAsyncErrors(async (req, res, next) => {
    let groups;
    try {
        groups = await Group.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!groups) {
        return next(new ErrorHandler('Group not found!', 404));
    }
    return res.status(200).json({
        groups
    });
})

//overall delete
exports.getOverAllDeleteAccountGroup = catchAsyncErrors(async (req, res, next) => {
    let groups;
    try {
        let query = {
            under: { $in: req.body.accountname },

        };
        // console.log(query, "body")
        groups = await Accountgroup.find(query, {
            under: 1,
            _id: 0,
        });
        console.log(groups, "groups")
    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        groups,
    });
});


//overall edit
exports.getOverAllEditAccountGroup = catchAsyncErrors(async (req, res, next) => {
    let under;
    try {
        under = await Accountgroup.find({ under: { $in: req.body.oldname } })
        // console.log(req.body.oldname, "under")
    } catch (err) {
        console.log(err)
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: under.length,
        under,
    });
});


//create new Group => /api/Group/new
exports.addGroup = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aGroup = await Group.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Group => /api/Group/:id
exports.getSingleGroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sgroup = await Group.findById(id);
    if (!sgroup) {
        return next(new ErrorHandler('Group not found', 404));
    }
    return res.status(200).json({
        sgroup
    })
})

//update Group by id => /api/Group/:id
exports.updateGroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ugroup = await Group.findByIdAndUpdate(id, req.body);
    if (!ugroup) {
        return next(new ErrorHandler('Group not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Group by id => /api/Group/:id
exports.deleteGroup = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dgroup = await Group.findByIdAndRemove(id);
    if (!dgroup) {
        return next(new ErrorHandler('Group not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
