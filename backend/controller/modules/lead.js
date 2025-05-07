// const User = require('../../model/login/auth');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');
const Lead = require("../../model/modules/lead")

//get All lead =>/api/lead
exports.getAllLead = catchAsyncErrors(async (req, res, next) => {
    let leads;
    try {
        leads = await Lead.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!leads) {
        return next(new ErrorHandler('Shift not found!', 404));
    }
    return res.status(200).json({
        leads
    });
})


// Overall Shift edit
exports.getOverallLeadDetails = catchAsyncErrors(async (req, res, next) => {
    let users;

    try {
        users = await User.find({ shifttiming: req.body.oldname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!users) {
        return next(new ErrorHandler('Shift details not found', 404));
    }
    return res.status(200).json({
        users, count: users.length
    });
})

exports.getSingleuserLeadtime = catchAsyncErrors(async (req, res, next) => {
    let shifts;

    try {
        shifts = await Lead.find({ name: req.body.shiftname })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        shifts
    });
})



//create new shift => /api/lead/new
exports.addLead = catchAsyncErrors(async (req, res, next) => {
    let ashift = await Lead.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})


// get Single shift=> /api/shift/:id
exports.getSingleLead = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let slead = await Lead.findById(id);
    if (!slead) {
        return next(new ErrorHandler('Lead not found', 404));
    }
    return res.status(200).json({
        slead
    })
})
//update shift by id => /api/shift/:id
exports.updateLead = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ulead = await Lead.findByIdAndUpdate(id, req.body);
  
  
    if (!ulead) {
      return next(new ErrorHandler("Lead not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
  });
//delete shift by id => /api/shift/:id
exports.deleteLead = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dlead = await Lead.findByIdAndRemove(id);
    

    return res.status(200).json({ message: 'Deleted successfully' });
})
