
const ProductionClientRate = require('../../../model/modules/production/productionclientrate');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ProductionClientRate => /api/productionclientrate
exports.getAllProductionClientRate = catchAsyncErrors(async (req, res, next) => {
    let productionclientrate;
    try {
        productionclientrate = await ProductionClientRate.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionclientrate) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        productionclientrate,
    });
});


// Create new productionclientrate=> /api/productionclientrate/new
exports.addProductionClientRate = catchAsyncErrors(async (req, res, next) => {

    const { project,category,subcategory,rate  } = req.body;

    let filteredData = await ProductionClientRate.findOne({ project,category,subcategory,rate  });



    if (!filteredData) {
        let aproductionclientrate = await ProductionClientRate.create(req.body);

        return res.status(200).json({
            message: "Successfully added!",
        });
    }

    return next(new ErrorHandler("Data Already Exist!", 404));

});

// get Signle productionclientrate => /api/productionclientrate/:id
exports.getSingleProductionClientRate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sproductionclientrate = await ProductionClientRate.findById(id);

    if (!sproductionclientrate) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        sproductionclientrate,
    });
});

// update ProductionClientRate by id => /api/productionclientrate/:id
exports.updateProductionClientRate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    const { project,category,subcategory,rate  } = req.body;

    let filteredData = await ProductionClientRate.findOne({ _id:{$ne:id}, project,category,subcategory,rate });

    if (!filteredData) {
        let uproductionclientrate = await ProductionClientRate.findByIdAndUpdate(id, req.body);
        if (!uproductionclientrate) {
            return next(new ErrorHandler("Data not found!", 404));
        }
        return res.status(200).json({ message: "Updated successfully" });
    }
    return next(new ErrorHandler("Data Already Exist!", 404));

});

// delete ProductionClientRate by id => /api/productionclientrate/:id
exports.deleteProductionClientRate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dproductionclientrate = await ProductionClientRate.findByIdAndRemove(id);

    if (!dproductionclientrate) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});