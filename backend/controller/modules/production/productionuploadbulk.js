const ProductionuploadBulk = require('../../../model/modules/production/productionuploadbulk');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All ProductionuploadBulk =>/api/ProductionuploadBulk
exports.getAllProductionuploadBulk = catchAsyncErrors(async (req, res, next) => {
    let productionuploadbulks;
    try {
        productionuploadbulks = await ProductionuploadBulk.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionuploadbulks) {
        return next(new ErrorHandler('ProductionuploadBulk not found!', 404));
    }
    return res.status(200).json({
        productionuploadbulks
    });
})


exports.getAllProductionuploadBulkFilter = catchAsyncErrors(async (req, res, next) => {
    let productionuploadbulks;
    const { fromdate, todate } = req.body
    let query = {}

    if (fromdate && todate) {
        query.$and = [
            { selectedfromdate: { $lte: todate } },
            { selectedtodate: { $gte: fromdate } },
        ];
    }

    // console.log(query, fromdate, todate, "query")
    try {

        productionuploadbulks = await ProductionuploadBulk.find(query)
        console.log(productionuploadbulks, "productionuploadbulks")
    } catch (err) {
        console.log(err, "builkder")
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionuploadbulks) {
        return next(new ErrorHandler('ProductionuploadBulk not found!', 404));
    }
    return res.status(200).json({
        productionuploadbulks
    });
})


exports.getAllProductionuploadBulkUndo = catchAsyncErrors(async (req, res, next) => {
    let productionuploadbulks;
    try {
        const { rows } = req.body

        // let query = {
        //     $or: rows}

        let query = {
            $or: rows.map(item => ({
                project: item.project,
                vendor: item.vendor,
                filenameupdated: item.filenameupdated,
                category: item.category,

                $and: [
                    { selectedfromdate: { $lte: item.selectedtodate } },
                    { selectedtodate: { $gte: item.selectedfromdate } },
                ],
            })),
        };


        console.log(query, "udno")
        productionuploadbulks = await ProductionuploadBulk.deleteMany(query)
        // console.log(productionuploadbulks, "productionuploadbulks")
    } catch (err) {
        console.log(err, "udnoerr")
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productionuploadbulks) {
        return next(new ErrorHandler('ProductionuploadBulk not found!', 404));
    }
    return res.status(200).json({
        productionuploadbulks
    });
})








//create new ProductionuploadBulk => /api/ProductionuploadBulk/new
exports.addProductionuploadBulk = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aProductionuploadBulk = await ProductionuploadBulk.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single ProductionuploadBulk => /api/ProductionuploadBulk/:id
exports.getSingleProductionuploadBulk = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sproductionuploadbulk = await ProductionuploadBulk.findById(id);
    if (!sproductionuploadbulk) {
        return next(new ErrorHandler('ProductionuploadBulk not found', 404));
    }
    return res.status(200).json({
        sproductionuploadbulk
    })
})

//update ProductionuploadBulk by id => /api/ProductionuploadBulk/:id
exports.updateProductionuploadBulk = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uproductionuploadbulk = await ProductionuploadBulk.findByIdAndUpdate(id, req.body);
    if (!uproductionuploadbulk) {
        return next(new ErrorHandler('ProductionuploadBulk not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete ProductionuploadBulk by id => /api/ProductionuploadBulk/:id
exports.deleteProductionuploadBulk = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dproductionuploadbulk = await ProductionuploadBulk.findByIdAndRemove(id);
    if (!dproductionuploadbulk) {
        return next(new ErrorHandler('ProductionuploadBulk not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})


















