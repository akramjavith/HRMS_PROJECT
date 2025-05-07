const ProductionConsolidated = require("../../../model/modules/production/productionConsolidated");
const DayPointsUpload = require("../../../model/modules/production/dayPointsUpload");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ProductionConsolidated Name => /api/productionconsolidateds
exports.getAllProductionConsolidated = catchAsyncErrors(async (req, res, next) => {
  let productionconsolidated;
  try {
    productionconsolidated = await ProductionConsolidated.find().sort({ fromdate: -1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!productionconsolidated) {
    return next(new ErrorHandler("Production Consolidated  not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productionconsolidated,
  });
});


// get All ProductionConsolidated Name => /api/productionconsolidateds
exports.getFilterProductionConsolidated = catchAsyncErrors(async (req, res, next) => {
  let productionconsolidated, daypoints, ans;
  try {
    productionconsolidated = await ProductionConsolidated.findOne({ _id: req.body.id });
    // daypoints = await DayPointsUpload.find();
    // let answer = daypoints.map((data) => data.uploaddata).flat();
    // ans = answer.filter(data => data.date >= productionconsolidated[0].fromdate && data.date <= productionconsolidated[0].todate)



    let daypointsuploadall = await DayPointsUpload.find({ date: { $gte: productionconsolidated.fromdate, $lte: productionconsolidated.todate } }, { uploaddata: 1 });


    ans = daypointsuploadall.map(data => data.uploaddata).flat()
      .reduce((acc, current) => {
        const existingItemIndex = acc.findIndex(
          (item) =>
            item.name === current.name
          // &&
          // item.companyname === current.companyname && item.branch === current.branch &&
          // item.unit === current.unit && item.team === current.team &&
          // item.empcode === current.empcode
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
    productionconsolidated, ans
  });
});
// Create new ProductionConsolidated=> /api/productionconsolidated/new
exports.addProductionConsolidated = catchAsyncErrors(async (req, res, next) => {
  let aproductionconsolidated = await ProductionConsolidated.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ProductionConsolidated => /api/productionconsolidated/:id
exports.getSingleProductionConsolidated = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sproductionconsolidated = await ProductionConsolidated.findById(id);

  if (!sproductionconsolidated) {
    return next(new ErrorHandler("Production Consolidated not found!", 404));
  }
  return res.status(200).json({
    sproductionconsolidated,
  });
});

// update ProductionConsolidated by id => /api/productionconsolidated/:id
exports.updateProductionConsolidated = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  if (!uproductionconsolidated) {
    return next(new ErrorHandler("Production Consolidated not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ProductionConsolidated by id => /api/productionconsolidated/:id
exports.deleteProductionConsolidated = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dproductionconsolidated = await ProductionConsolidated.findByIdAndRemove(id);

  if (!dproductionconsolidated) {
    return next(new ErrorHandler("Production Consolidated  not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
