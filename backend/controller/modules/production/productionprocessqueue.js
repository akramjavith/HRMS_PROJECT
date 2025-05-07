
const ProductionProcessQueue = require('../../../model/modules/production/productionprocessqueue');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ProductionProcessQueue => /api/productionprocessqueue
exports.getAllProductionProcessQueue = catchAsyncErrors(async (req, res, next) => {
    let productionprocessqueue;
    try {
        productionprocessqueue = await ProductionProcessQueue.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionprocessqueue) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        productionprocessqueue,
    });
});


// Create new ProductionProcessQueue=> /api/productionprocessqueue/new
exports.addProductionProcessQueue = catchAsyncErrors(async (req, res, next) => {

    const { projectvendor, processqueue } = req.body;

    let filteredData = await ProductionProcessQueue.findOne({ projectvendor, processqueue: { $regex: `\\b${processqueue}\\b`, $options: 'i' } });



    if (!filteredData) {
        let aproductionprocessqueue = await ProductionProcessQueue.create(req.body);

        return res.status(200).json({
            message: "Successfully added!",
        });
    }

    return next(new ErrorHandler("Name Already Exists!", 404));

});

// get Signle ProductionProcessQueue => /api/productionprocessqueue/:id
exports.getSingleProductionProcessQueue = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sproductionprocessqueue = await ProductionProcessQueue.findById(id);

    if (!sproductionprocessqueue) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        sproductionprocessqueue,
    });
});

// update ProductionProcessQueue by id => /api/productionprocessqueue/:id
exports.updateProductionProcessQueue = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    const { projectvendor, processqueue } = req.body;
    let filteredData = await ProductionProcessQueue.findOne({ _id: { $ne: id }, projectvendor, processqueue: { $regex: `\\b${processqueue}\\b`, $options: 'i' } });

    if (!filteredData) {
        let uproductionprocessqueue = await ProductionProcessQueue.findByIdAndUpdate(id, req.body);
        if (!uproductionprocessqueue) {
            return next(new ErrorHandler("Data not found!", 404));
        }
        return res.status(200).json({ message: "Updated successfully" });
    }
    return next(new ErrorHandler("Name Already Exisits!", 404));

});

// delete ProductionProcessQueue by id => /api/productionprocessqueue/:id
exports.deleteProductionProcessQueue = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dproductionprocessqueue = await ProductionProcessQueue.findByIdAndRemove(id);

    if (!dproductionprocessqueue) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});