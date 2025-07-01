const Idletimework = require("../../../model/modules/production/idletimework");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const moment = require("moment");

// get All Idletimework => /api/Idletimework
exports.getAllIdletimework = catchAsyncErrors(async (req, res, next) => {
    let idletimeworks;
    try {
        idletimeworks = await Idletimework.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!idletimeworks) {
        return next(new ErrorHandler("Managecategory not found!", 404));
    }
    return res.status(200).json({
        idletimeworks,
    });
});

exports.getAllIdletimeworkemployee = catchAsyncErrors(async (req, res, next) => {
    let idletimeworks;
    try {
        const { empname } = req.body;
        idletimeworks = await Idletimework.find({"addedby.name":empname},{});
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
   
    return res.status(200).json({
        idletimeworks,
    });
});

// Create new Idletimework=> /api/Idletimework/new
exports.addIdletimework = catchAsyncErrors(async (req, res, next) => {

    let aIdletimework = await Idletimework.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle Idletimework => /api/Idletimework/:id
exports.getSingleIdletimework = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sidletimework = await Idletimework.findById(id);

    if (!sidletimework) {
        return next(new ErrorHandler("Idletimework not found!", 404));
    }
    return res.status(200).json({
        sidletimework,
    });
});

// update Idletimework by id => /api/Idletimework/:id
exports.updateIdletimework = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uidletimework = await Idletimework.findByIdAndUpdate(id, req.body);

    if (!uidletimework) {
        return next(new ErrorHandler("Idletimework not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete Idletimework by id => /api/Idletimework/:id
exports.deleteIdletimework = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let didletimework = await Idletimework.findByIdAndRemove(id);

    if (!didletimework) {
        return next(new ErrorHandler("Idletimework Name not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});



exports.getAllIdletimeworkCheckListReport = catchAsyncErrors(async (req, res, next) => {
    let idletimeworks;
    try {

        const {fromdate,todate} = req.body
let query ={
status: { $nin: ["Approve", "Reject"] },
    date:{$gte:fromdate, $lte:todate}
}

        idletimeworks = await Idletimework.find(query,{});
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
  
    return res.status(200).json({
        idletimeworks,
    });
});


exports.getAllIdletimeworkCheckListReportApproveReject = catchAsyncErrors(async (req, res, next) => {
    let idletimeworks;
    try {

        const {fromdate,todate} = req.body
let query ={
status: { $in: ["Approve", "Reject"] },
    date:{$gte:fromdate, $lte:todate}
}

        idletimeworks = await Idletimework.find(query,{});
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
  
    return res.status(200).json({
        idletimeworks,
    });
});
