
const OtherTaskUpload = require('../../../model/modules/production/othertaskupload');
const ProductionUpload = require("../../../model/modules/production/othertaskoriginalupload");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All OtherTaskUpload => /api/productionoriginals
exports.getAllOtherTaskUpload = catchAsyncErrors(async (req, res, next) => {
    let othertaskupload;
    try {
        othertaskupload = await OtherTaskUpload.find();
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!othertaskupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        othertaskupload,
    });
});

// get All OtherTaskUpload => /api/productionoriginals
exports.getAllOtherTaskUploadLimited = catchAsyncErrors(async (req, res, next) => {
    let othertaskupload;
    try {
        othertaskupload = await OtherTaskUpload.find({}, { datetimezone: 1, vendor: 1, fromdate: 1, todate: 1, overallcount: 1, percent: 1, createddate: 1, uniqueid: 1, addedby: 1 }).sort({ fromdate: -1, createdAt: -1 });
    } catch (err) {
        console.log(err.message);
    }
    if (!othertaskupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        othertaskupload,
    });
});

// get All OtherTaskUpload => /api/productionoriginals
exports.getAllOtherTaskUploadLimitedFilter = catchAsyncErrors(async (req, res, next) => {
    let othertaskupload;
    try {
        const { vendor, fromdate, todate } = req.body;

        let query = {};

        if (vendor.length > 0) {
            query.vendor = { $in: vendor };
        }
        // if (fromdate != "" && todate != "") {
        //     (query.fromdate = { $gte: fromdate }), (query.todate = { $lte: todate });
        // }
        if (fromdate && todate) {
            query.$and = [
                { fromdate: { $lte: todate } },
                { todate: { $gte: fromdate } },
            ];
        }
        // console.log(query, "othertask")
        othertaskupload = await OtherTaskUpload.find(query, { datetimezone: 1, vendor: 1, fromdate: 1, todate: 1, overallcount: 1, percent: 1, createddate: 1, uniqueid: 1, addedby: 1 }).sort({ fromdate: -1, createdAt: -1 });
    } catch (err) {
        console.log(err.message);
    }
    if (!othertaskupload) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    console.log(othertaskupload.length);
    return res.status(200).json({
        // count: products.length,
        othertaskupload,
    });
});

// get All OtherTaskUploadLIMITED => /api/productionoriginalslimited
exports.getAllOtherTaskUploadLimitedUniqid = catchAsyncErrors(async (req, res, next) => {
    let othertaskupload, productionoriginalid;
    try {
        // othertaskupload = await OtherTaskUpload.find();
        productionoriginalid = await OtherTaskUpload.findOne()
            .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
            .exec();

        othertaskupload = productionoriginalid && productionoriginalid.uniqueid

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!othertaskupload) {
    //   return next(new ErrorHandler("Data not found!", 404));
    // }
    return res.status(200).json({
        othertaskupload,
    });
});

// Create new OtherTaskUpload=> /api/othertaskupload/new
exports.addOtherTaskUpload = catchAsyncErrors(async (req, res, next) => {

    let aproductionoriginal = await OtherTaskUpload.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle OtherTaskUpload => /api/othertaskupload/:id
exports.getSingleOtherTaskUpload = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sproductionoriginal = await OtherTaskUpload.findById(id);

    if (!sproductionoriginal) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        sproductionoriginal,
    });
});

// update OtherTaskUpload by id => /api/othertaskupload/:id
exports.updateOtherTaskUpload = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uproductionoriginal = await OtherTaskUpload.findByIdAndUpdate(id, req.body);
    if (!uproductionoriginal) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete OtherTaskUpload by id => /api/othertaskupload/:id
exports.deleteOtherTaskUpload = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dproductionoriginal = await OtherTaskUpload.findByIdAndRemove(id);

    if (!dproductionoriginal) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});

// get All OtherTaskUpload => /api/productionoriginals
exports.getUniqidFromDateOtherTaskupload = catchAsyncErrors(async (req, res, next) => {
    let othertaskupload, productionUpload, totalSum;
    try {
        const { date } = req.body;

        let dateoneafter = new Date(date);
        dateoneafter.setDate(dateoneafter.getDate() + 1);
        let newDateOnePlus = dateoneafter.toISOString().split('T')[0];

        let datebefore = new Date(date);
        datebefore.setDate(datebefore.getDate() - 1);
        let newDateOneMinus = datebefore.toISOString().split('T')[0];

        //  othertaskupload = await OtherTaskUpload.find({ fromdate: { $in: [date, newDateOnePlus] } }, { overallcount: 1, _id: 0 }).lean();

        // productionUpload = await ProductionUpload.countDocuments({ fromdate: { $in: [date, newDateOnePlus] } });

        let [othertaskupload, productionUpload] = await Promise.all([
            OtherTaskUpload.find({ fromdate: { $in: [date, newDateOnePlus] } }, { overallcount: 1, _id: 0 }).lean(),
            ProductionUpload.countDocuments({ fromdate: { $in: [date, newDateOnePlus] } }),
        ]);

        totalSum = othertaskupload.reduce((acc, obj) => acc + Number(obj.overallcount), 0);

        // totalSum = othertaskupload.reduce((acc, obj) => acc + Number(obj.overallcount), 0);

        console.log(date, newDateOnePlus, newDateOneMinus, 'dfgdfg');

        // totalSum = othertaskupload.reduce((acc, obj) => acc + Number(obj.overallcount), 0);

        console.log(totalSum, productionUpload, 'productionoriginalcheck');
        return res.status(200).json({
            // count: products.length,
            totalSum,
            productionUpload,
        });
    } catch (err) {
        console.log(err.message);
    }
});

// get All OtherTaskUploadLIMITED => /api/productionoriginalslimited
exports.OtherTaskUploadLastThree = catchAsyncErrors(async (req, res, next) => {
    let othertaskupload;
    try {
        othertaskupload = await OtherTaskUpload.find({}, { vendor: 1, percent: 1, addedby: 1, fromdate: 1, todate: 1, createddate: 1, _id: 0 }).sort({ fromdate: -1, createdAt: -1 }).limit(4);
    } catch (err) {
        console.log(err.message);
    }
    // if (!othertaskupload) {
    //   return next(new ErrorHandler("Data not found!", 404));
    // }
    return res.status(200).json({
        othertaskupload,
    });
});