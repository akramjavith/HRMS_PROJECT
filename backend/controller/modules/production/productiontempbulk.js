const ProductiontempBulk = require('../../../model/modules/production/productiontempbulk');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All ProductiontempBulk =>/api/ProductiontempBulk
exports.getAllProductiontempBulk = catchAsyncErrors(async (req, res, next) => {
    let productiontempbulks;
    try {
        productiontempbulks = await ProductiontempBulk.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productiontempbulks) {
        return next(new ErrorHandler('ProductiontempBulk not found!', 404));
    }
    return res.status(200).json({
        productiontempbulks
    });
})


exports.getAllProductiontempBulkFilter = catchAsyncErrors(async (req, res, next) => {
    let productiontempbulks;

    const { fromdate, todate } = req.body
    let query = {}

    if (fromdate && todate) {
        query.$and = [
            { selectedfromdate: { $lte: todate } },
            { selectedtodate: { $gte: fromdate } },
        ];
    }
    try {
        productiontempbulks = await ProductiontempBulk.find(
            // { selectedfromdate: { $gte: req.body.fromdate }, selectedtodate: { $lte: req.body.todate } }
            query
        )
        console.log(productiontempbulks, "productiontempbulks")
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productiontempbulks) {
        return next(new ErrorHandler('ProductiontempBulk not found!', 404));
    }
    return res.status(200).json({
        productiontempbulks
    });
})


exports.getAllProductiontempBulkUndo = catchAsyncErrors(async (req, res, next) => {
    let productiontempbulks;
    try {
        const { rows } = req.body

        // let query = {
        //     $or: rows
        // }

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


        // console.log(query, "udno")
        productiontempbulks = await ProductiontempBulk.deleteMany(query)

    } catch (err) {
        console.log(err, "udnoerr")
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productiontempbulks) {
        return next(new ErrorHandler('ProductiontempBulk not found!', 404));
    }
    return res.status(200).json({
        productiontempbulks
    });
})








//create new ProductiontempBulk => /api/ProductiontempBulk/new
exports.addProductiontempBulk = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aProductiontempBulk = await ProductiontempBulk.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single ProductiontempBulk => /api/ProductiontempBulk/:id
exports.getSingleProductiontempBulk = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sproductiontempbulk = await ProductiontempBulk.findById(id);
    if (!sproductiontempbulk) {
        return next(new ErrorHandler('ProductiontempBulk not found', 404));
    }
    return res.status(200).json({
        sproductiontempbulk
    })
})

//update ProductiontempBulk by id => /api/ProductiontempBulk/:id
exports.updateProductiontempBulk = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uproductiontempbulk = await ProductiontempBulk.findByIdAndUpdate(id, req.body);
    if (!uproductiontempbulk) {
        return next(new ErrorHandler('ProductiontempBulk not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete ProductiontempBulk by id => /api/ProductiontempBulk/:id
exports.deleteProductiontempBulk = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dproductiontempbulk = await ProductiontempBulk.findByIdAndRemove(id);
    if (!dproductiontempbulk) {
        return next(new ErrorHandler('ProductiontempBulk not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})


















