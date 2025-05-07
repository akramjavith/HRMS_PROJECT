const Meetingmaster = require('../../../model/modules/tickets/meetingmaster');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError'); 

//get All Meetingmaster =>/api/Meetingmaster
exports.getAllMeetingmaster = catchAsyncErrors(async (req, res, next) => {
    let meetingmasters;
    try {
        meetingmasters = await Meetingmaster.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!meetingmasters) {
        return next(new ErrorHandler('Meetingmaster not found!', 404));
    }
    return res.status(200).json({
        meetingmasters
    });
})


//create new Meetingmaster => /api/Meetingmaster/new
exports.addMeetingmaster = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aMeetingmaster = await Meetingmaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Meetingmaster => /api/Meetingmaster/:id
exports.getSingleMeetingmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let smeetingmaster = await Meetingmaster.findById(id);
    if (!smeetingmaster) {
        return next(new ErrorHandler('Meetingmaster not found', 404));
    }
    return res.status(200).json({
        smeetingmaster
    })
})

//update Meetingmaster by id => /api/Meetingmaster/:id
exports.updateMeetingmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let umeetingmaster = await Meetingmaster.findByIdAndUpdate(id, req.body);
    if (!umeetingmaster) {
        return next(new ErrorHandler('Meetingmaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Meetingmaster by id => /api/Meetingmaster/:id
exports.deleteMeetingmaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dmeetingmaster = await Meetingmaster.findByIdAndRemove(id);
    if (!dmeetingmaster) {
        return next(new ErrorHandler('Meetingmaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
