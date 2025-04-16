const ProductionTempConsolidated = require("../../../model/modules/production/productionTempConsolidated");
const TempPointsUpload = require("../../../model/modules/production/daypointsuploadtemp");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ProductionTempConsolidated Name => /api/productiontempConsolidateds
exports.getAllProductionTempConsolidated = catchAsyncErrors(async (req, res, next) => {
    let productiontempConsolidated;
    try {
        productiontempConsolidated = await ProductionTempConsolidated.find().sort({ fromdate: -1 });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!productiontempConsolidated) {
        return next(new ErrorHandler("Production Temp Consolidated  not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        productiontempConsolidated,
    });
});


// get All ProductionTempConsolidated Name => /api/productiontempConsolidateds
exports.getFilterProductionTempConsolidated = catchAsyncErrors(async (req, res, next) => {
    let productiontempConsolidated, daypoints, ans;
    try {
        productiontempConsolidated = await ProductionTempConsolidated.find({ _id: req.body.id });
        // daypoints = await TempPointsUpload.find();
        // let answer = daypoints.map((data) => data.uploaddata).flat();
        // ans = answer.filter(data => data.date >= productiontempConsolidated[0].fromdate && data.date <= productiontempConsolidated[0].todate)


        let daypointsuploadall = await TempPointsUpload.find({ date: { $gte: productiontempConsolidated.fromdate, $lte: productiontempConsolidated.todate } }, { uploaddata: 1 });


        ans = daypointsuploadall.map(data => data.uploaddata).flat()
            .reduce((acc, current) => {
                const existingItemIndex = acc.findIndex(
                    (item) =>
                        item.name === current.name
                    //  && item.companyname === current.companyname && item.branch === current.branch &&
                    //     item.unit === current.unit && item.team === current.team &&
                    //     item.empcode === current.empcode
                );


                if (existingItemIndex !== -1) {
                    // Update existing item
                    const existingItem = acc[existingItemIndex];

                    existingItem.point += Number(current.point);
                    // existingItem.daypoint += Number(current.daypoint);
                    existingItem.target += current.daypointsts != "WEEKOFF" ? Number(current.target) : 0;
                    existingItem.date.push(current.date);

                    existingItem.allowancepoint += current.conshiftpoints && current.shiftsts === 'Enable' ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0;
                    if ((current.conshiftpoints >= 1 && current.shiftsts === 'Enable') || current.allowancepoint >= 1) {
                        existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
                    }

                    existingItem.avgpoint = existingItem.target > 0 ? (existingItem.point / existingItem.target) * 100 : 0;

                    // Convert the dates array to Date objects
                    const dateObjects = existingItem.date.map((date) => new Date(date));

                    // Find the earliest (from) and latest (to) dates
                    const fromDate = new Date(Math.min(...dateObjects));
                    const toDate = new Date(Math.max(...dateObjects));
                    // Update start and end date
                    existingItem.startDate = fromDate;
                    existingItem.endDate = toDate;
                } else {
                    // Add new item
                    acc.push({
                        ...current._doc,
                        companyname: current.companyname,
                        manual: current.manual,
                        avgpoint: (Number(current.point) / Number(current.target)) * 100,
                        point: Number(current.point),
                        target: Number(current.target),
                        _id: current.id,
                        exper: current.exper,
                        branch: current.branch,
                        date: [current.date],
                        unit: current.unit,
                        team: current.team,
                        empcode: current.empcode,
                        weekoff: current.daypointstatus,
                        // doj: current.doj,
                        // department: current.department,
                        production: current.production,
                        startDate: current.date,
                        endDate: current.date,
                        allowancepoint: current.conshiftpoints && current.shiftsts === 'Enable' ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0,
                        // noallowancepoint:Number(current.noallowancepoint),
                        noallowancepoint: (current.conshiftpoints && current.shiftsts === 'Enable' ? Number(current.conshiftpoints) : current.allowancepoint ? Number(current.allowancepoint) : 0) > 0 ? 1 : 0,
                    });
                }
                return acc;
            }, []);

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        productiontempConsolidated, ans
    });
});
// Create new ProductionTempConsolidated=> /api/productiontempConsolidated/new
exports.addProductionTempConsolidated = catchAsyncErrors(async (req, res, next) => {
    let aproductiontempConsolidated = await ProductionTempConsolidated.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle ProductionTempConsolidated => /api/productiontempConsolidated/:id
exports.getSingleProductionTempConsolidated = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sproductiontempConsolidated = await ProductionTempConsolidated.findById(id);

    if (!sproductiontempConsolidated) {
        return next(new ErrorHandler("Production Temp Consolidated  not found!", 404));
    }
    return res.status(200).json({
        sproductiontempConsolidated,
    });
});

// update ProductionTempConsolidated by id => /api/productiontempConsolidated/:id
exports.updateProductionTempConsolidated = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    if (!uproductiontempConsolidated) {
        return next(new ErrorHandler("Production Temp Consolidated  not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete ProductionTempConsolidated by id => /api/productiontempConsolidated/:id
exports.deleteProductionTempConsolidated = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dproductiontempConsolidated = await ProductionTempConsolidated.findByIdAndRemove(id);

    if (!dproductiontempConsolidated) {
        return next(new ErrorHandler("Production Temp Consolidated  not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});
