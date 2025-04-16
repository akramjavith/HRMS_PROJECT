const Notification = require('../../../model/modules/project/notification')
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


// get All Notification Details => /api/notifications

exports.getAllNotificationDetails = catchAsyncErrors(async (req, res, next) => {
    let notificationdetails;

    try {
        notificationdetails = await Notification.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!notificationdetails) {
        return next(new ErrorHandler('Notification details not found', 404));
    }

    return res.status(200).json({
        // count: Departments.length,
        notificationdetails
    });
})

// Create new Notification => /api/notification/new
exports.addNotificationDetails = catchAsyncErrors(async (req, res, next) => {
    // let checkloc = await Notification.findOne({ time: req.body.time });

    // if(checkloc){
    //     return next(new ErrorHandler(' Notification time already exist!', 400));
    // }

    let anotificationdetails = await Notification.create(req.body);

    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle Notification => /api/notification/:id

exports.getSingleNotificationDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let snotificationdetails = await Notification.findById(id);

    if (!snotificationdetails) {
        return next(new ErrorHandler('Notification not found', 404));
    }

    return res.status(200).json({
        snotificationdetails
    })
})

// update Notification by id => /api/notification/:id

exports.updateNotificationDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let upnotificationdetails = await Notification.findByIdAndUpdate(id, req.body);

    if (!upnotificationdetails) {
        return next(new ErrorHandler('Notification Details not found', 404));
    }

    return res.status(200).json({ message: 'Updates successfully' });
})

// delete Notification by id => /api/notification/:id

exports.deleteNotificationDetails = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dnotificationdetails = await Notification.findByIdAndRemove(id);

    if (!dnotificationdetails) {
        return next(new ErrorHandler('Notification  Details not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
