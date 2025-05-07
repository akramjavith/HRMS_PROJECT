const Floor = require('../../model/modules/floor');
const User = require('../../model/login/auth');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');
//get All Floor =>/api/floors
exports.getAllFloor = catchAsyncErrors(async (req, res, next) => {
    let floors;
    try {
        floors = await Floor.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!floors) {
        return next(new ErrorHandler('Floor not found!', 404));
    }
    return res.status(200).json({
        floors
    });
})

//get OverAll Floor =>/api/floors
exports.getOverAllFloor = catchAsyncErrors(async (req, res, next) => {
    let users;
    try {
        users = await User.find({ enquirystatus:{
            $nin: ["Enquiry Purpose"]
           },floor: req.body.oldname },{company:1, branch:1,unit:1,floor:1})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!users) {
        return next(new ErrorHandler('Floor not found!', 404));
    }
    return res.status(200).json({
        users, count: users.length
    });
})

// get overall delete functionality
exports.getAllFloorCheck = catchAsyncErrors(async (req, res, next) => {
    let floors;
    try {
        floors = await Floor.find()
        let query = {
            branch: req.body.checkfloor,
        };
        floors = await Floor.find(query, {
            name: 1,
            code: 1,
            _id: 1,
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!floors) {
        return next(new ErrorHandler('Floor not found!', 404));
    }
    return res.status(200).json({
        floors
    });
})



//create new floor => /api/floor/new
exports.addFloor = catchAsyncErrors(async (req, res, next) => {

    let afloor = await Floor.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})
// get Single floor => /api/floor/:id
exports.getSingleFloor = catchAsyncErrors(async (req, res, next) => {

    const id = req.params.id;
    let sfloor = await Floor.findById(id);
    if (!sfloor) {
        return next(new ErrorHandler('Floor not found', 404));
    }
    return res.status(200).json({
        sfloor
    })
})
//update floor by id => /api/floor/:id
exports.updateFloor = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ufloor = await Floor.findByIdAndUpdate(id, req.body);
    if (!ufloor) {
        return next(new ErrorHandler('Floor not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})
//delete floor by id => /api/floor/:id
exports.deleteFloor = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dfloor = await Floor.findByIdAndRemove(id);
    if (!dfloor) {
        return next(new ErrorHandler('Floor not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})