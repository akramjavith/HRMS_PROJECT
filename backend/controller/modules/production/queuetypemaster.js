const QueueTypeMaster = require('../../../model/modules/production/queuetypemaster');
const Unitrate = require('../../../model/modules/production/productionunitrate');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Vendormaster = require('../../../model/modules/setup/vendor');

//get All QueueTypeMaster =>/api/QueueTypeMaster
exports.getAllQueueTypeMaster = catchAsyncErrors(async (req, res, next) => {
    let queuetypemasters;
    try {
        queuetypemasters = await QueueTypeMaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!queuetypemasters) {
        return next(new ErrorHandler('QueueTypeMaster not found!', 404));
    }
    return res.status(200).json({
        queuetypemasters
    });
})


exports.getAllQueueTypeMasterDuplicate = catchAsyncErrors(async (req, res, next) => {
    let queuetypemasters;
    try {
        const { category, subcategory, type, id } = req.body

        const query = {
            category: category, subcategory: { $in: subcategory }, type: { $in: type },
            ...(req.body.id ? { _id: { $ne: req.body.id } } : {})

        }

        queuetypemasters = await QueueTypeMaster.countDocuments(query)

        console.log(queuetypemasters, "dup1")
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        queuetypemasters
    });
})

exports.getAllQueueTypeMasterUnitRate = catchAsyncErrors(async (req, res, next) => {
    let queuetypemasters;
    try {
        let queuetypemastersall = await QueueTypeMaster.find()


        const unitRates = await Unitrate.find({}, { category: 1, subcategory: 1, orate: 1 }).lean();

        // Create a Map for quick lookups by "category-subcategory"
        const unitRateMap = new Map(unitRates.map(item => [`${item.category}-${item.subcategory}`, item]));

        // Map over queuetypemastersall to enrich each object
        queuetypemasters = queuetypemastersall.map(item => {
            // Find a matching entry in the Map
            const matchUnitrate = unitRateMap.get(`${item.category}-${item.subcategory}`);

            // Extract the orate value (default to null if not found)
            const mrateval = matchUnitrate ? Number(matchUnitrate.orate) : null;

            // Return the updated object
            return {
                ...item._doc,
                orate: mrateval,
            };
        });


        // console.log(queuetypemasters[0], "queuetypemasters")


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!queuetypemasters) {
        return next(new ErrorHandler('QueueTypeMaster not found!', 404));
    }
    return res.status(200).json({
        queuetypemasters
    });
})


exports.fetchORateValueQueuemaster = catchAsyncErrors(async (req, res, next) => {
    let queuetypemasters;
    try {


        queuetypemasters = await Unitrate.findOne({ project: req.body.project, category: req.body.category, subcategory: req.body.subcategory, }, { orate: 1, mrate: 1 }).lean();

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        queuetypemasters
    });
})



//create new QueueTypeMaster => /api/QueueTypeMaster/new
exports.addQueueTypeMaster = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aQueueTypeMaster = await QueueTypeMaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single QueueTypeMaster => /api/QueueTypeMaster/:id
exports.getSingleQueueTypeMaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let squeuetypemaster = await QueueTypeMaster.findById(id);
    if (!squeuetypemaster) {
        return next(new ErrorHandler('QueueTypeMaster not found', 404));
    }
    return res.status(200).json({
        squeuetypemaster
    })
})

//update QueueTypeMaster by id => /api/QueueTypeMaster/:id
exports.updateQueueTypeMaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uqueuetypemaster = await QueueTypeMaster.findByIdAndUpdate(id, req.body);
    if (!uqueuetypemaster) {
        return next(new ErrorHandler('QueueTypeMaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete QueueTypeMaster by id => /api/QueueTypeMaster/:id
exports.deleteQueueTypeMaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dqueuetypemaster = await QueueTypeMaster.findByIdAndRemove(id);
    if (!dqueuetypemaster) {
        return next(new ErrorHandler('QueueTypeMaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})


exports.getAllQueueTypeMasterCatetoryWiseType = catchAsyncErrors(async (req, res, next) => {
    let queuetypemasters;
    try {

        queuetypemasters = await QueueTypeMaster.find({ vendor: { $in: req.body.vendor }, category: { $in: req.body.category }, type: { $ne: "Other task queues" } }, { type: 1 })

    } catch (err) {
        console.log(err, "errorororroro")
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!queuetypemasters) {
        return next(new ErrorHandler('QueueTypeMaster not found!', 404));
    }
    return res.status(200).json({
        queuetypemasters
    });
})

//old
// exports.getAllQueueTypeMasterSubCatetoryWiseType = catchAsyncErrors(async (req, res, next) => {
//     let queuetypemasters;
//     try {
//         queuetypemasters = await QueueTypeMaster.find({ category: req.body.category, type: req.body.type }, { subcategory: 1 })

//     } catch (err) {
//         console.log(err, "suberr")
//         return next(new ErrorHandler("Records not found!", 404));
//     }
//     if (!queuetypemasters) {
//         return next(new ErrorHandler('QueueTypeMaster not found!', 404));
//     }
//     return res.status(200).json({
//         queuetypemasters
//     });
// })

//new
exports.getAllQueueTypeMasterSubCatetoryWiseType = catchAsyncErrors(async (req, res, next) => {
    const { category, type } = req.body;
    try {
        // Query: category matches one of req.body.category AND type intersects with req.body.type
        const queuetypemasters = await QueueTypeMaster.find(
            {
                category: { $in: category }, // Matches any value in the category array
                type: { $in: type }         // Checks if any value in 'type' array matches DB
            },
            { subcategory: 1 } // Project only the 'subcategory' field
        );
        // If no records found
        if (!queuetypemasters || queuetypemasters.length === 0) {
            return next(new ErrorHandler('QueueTypeMaster not found!', 404));
        }
        // Return records
        return res.status(200).json({
            queuetypemasters
        });
    } catch (err) {
        console.log(err, "suberr");
        return next(new ErrorHandler("Records not found!", 404));
    }
});



//vendor dropdown queue report
exports.getAllQueueTypeMasterVendorDrop = catchAsyncErrors(async (req, res, next) => {
    let queuetypemasters;
    try {

        queuetypemasters = await QueueTypeMaster.find({}, { vendor: 1 })

    } catch (err) {
        console.log(err, "errorororroro")
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        queuetypemasters
    });
})

//category dropdown queue report
exports.getAllQueueTypeMasterCategoryDrop = catchAsyncErrors(async (req, res, next) => {
    let queuetypemasters;
    try {

        queuetypemasters = await QueueTypeMaster.find({ vendor: { $in: req.body.vendor } }, { category: 1 })

    } catch (err) {
        console.log(err, "errorororroro")
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        queuetypemasters
    });
})


//type dropdown queue report
exports.getAllQueueTypeMasterTypeDrop = catchAsyncErrors(async (req, res, next) => {
    let queuetypemasters;
    try {

        queuetypemasters = await QueueTypeMaster.find({ vendor: { $in: req.body.vendor }, type: { $in: req.body.type } }, { type: 1 })

    } catch (err) {
        console.log(err, "errorororroro")
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        queuetypemasters
    });
})



exports.getAllQueueTypeMasterVendorMasterDrop = catchAsyncErrors(async (req, res, next) => {
    let vendormasters;
    try {

        vendormasters = await Vendormaster.find({ projectname: { $in: req.body.project } }, { name: 1 })

        // console.log(vendormasters, req.body, "vendormasters")

    } catch (err) {
        console.log(err, "errorororroro")
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        vendormasters
    });
})

exports.checkQueueTypeForProdUpload = catchAsyncErrors(async (req, res, next) => {
    let unitsrate;
    try {
        const { project, subs } = req.body;

        // Construct the query to use $and for each sub
        const query = {

            vendor: project,
            // new RegExp("^" + value, "i");
            type: "Other task upload",
            $or: subs.map((sub) => ({
                category: sub.filename,
                subcategory: sub.Category,
            })),
        };
        console.log(query, "query")
        unitsrate = await QueueTypeMaster.find(query);
    } catch (err) {
        console.log(err.message);
    }

    return res.status(200).json({
        // count: products.length,
        unitsrate,
    });
});

exports.checkQueueTypeForProdUploadMatched = catchAsyncErrors(async (req, res, next) => {
    let unitsrate;
    try {
        const { project, subs, category } = req.body;

        // Construct the query to use $and for each sub
        const query = {

            vendor: project,
            // new RegExp("^" + value, "i");
            type: "Other task upload",
            category: { $in: category }
            // $or: subs.map((sub) => ({
            //     category: sub.filename,
            //     subcategory: sub.Category,
            // })),
        };

        unitsrate = await QueueTypeMaster.find(query);
    } catch (err) {
        console.log(err.message);
    }

    return res.status(200).json({
        // count: products.length,
        unitsrate,
    });
});


exports.checkQueueTypeForProdUploadCategoryCreate = catchAsyncErrors(async (req, res, next) => {
    let unitsrate;
    try {
        const { project, subs, category } = req.body;

        // Construct the query to use $and for each sub
        const query = {

            vendor: project,
            type: "Other task upload",
            category: { $in: category }
        };
        // console.log(query, "query")
        unitsrate = await QueueTypeMaster.find(query);
    } catch (err) {
        console.log(err.message);
    }

    return res.status(200).json({
        // count: products.length,
        unitsrate,
    });
});








