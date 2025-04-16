const StockManagement = require("../../../model/modules/stockpurchase/stockmanagement");
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");





//get All StockManagements =>/api/stockmanagement
exports.getAllStockManagement = catchAsyncErrors(async (req, res, next) => {
    let stockmanagement;
    try {
        stockmanagement = await StockManagement.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!stockmanagement) {
        return next(new ErrorHandler("StockManagement not found!", 404));
    }
    return res.status(200).json({
        stockmanagement,
    });
});










//create new stockmanagement => /api/stockmanagement/new
exports.addStockManagement = catchAsyncErrors(async (req, res, next) => {
    let astockmanagement = await StockManagement.create(req.body);
    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Single stockmanagement=> /api/stockmanagement/:id
exports.getSingleStockManagement = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sstockmanagement = await StockManagement.findById(id);
    if (!sstockmanagement) {
        return next(new ErrorHandler("StockManagement not found", 404));
    }
    return res.status(200).json({
        sstockmanagement,
    });
});
//update stockmanagement by id => /api/stockmanagement/:id
exports.updateStockManagement = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ustockmanagement = await StockManagement.findByIdAndUpdate(id, req.body);
    if (!ustockmanagement) {
        return next(new ErrorHandler("StockManagement not found", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
});
//delete stockmanagement by id => /api/stockmanagement/:id
exports.deleteStockManagement = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dstockmanagement = await StockManagement.findByIdAndRemove(id);
    if (!dstockmanagement) {
        return next(new ErrorHandler("StockManagement not found", 404));
    }

    return res.status(200).json({ message: "Deleted successfully" });
});



