const PowerStation = require("../../model/modules/powerstationModel");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");
const moment = require("moment");

// get All Holiday => /api/holidays
exports.getAllPowerStation = catchAsyncErrors(async (req, res, next) => {
  let powerstation;
  try {
    powerstation = await PowerStation.find();
  } catch (err) {
  }
  if (!powerstation) {
    return next(new ErrorHandler("Status Master Name not found!", 404));
  }
  return res.status(200).json({
    powerstation,
  });
});

// Create new Holiday=> /api/powerstation/new
exports.addPowerStation = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await PowerStation.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Status Master Name already exist!", 400));
  }

  let aproduct = await PowerStation.create(req.body);


  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Holiday => /api/powerstation/:id
exports.getSinglePowerStation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  
  let spowerstation = await PowerStation.findById(id);
  


  if (!spowerstation) {
    return next(new ErrorHandler("Status Master Name not found!", 404));
  }
  return res.status(200).json({
    spowerstation,
  });
});

// update Holiday by id => /api/powerstation/:id
exports.updatePowerStation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let upowerstation = await PowerStation.findByIdAndUpdate(id, req.body);


  if (!upowerstation) {
    return next(new ErrorHandler("Status Master Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Holiday by id => /api/powerstation/:id
exports.deletePowerStation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dpowerstation = await PowerStation.findByIdAndRemove(id);


  if (!dpowerstation) {
    return next(new ErrorHandler("Status Master Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.PowerStationFilter = catchAsyncErrors(async (req, res, next) => {
  let powerStationfilter, PowerStationfilternew;
  try {
    powerStationfilter = await PowerStation.find();

    // Apply date filter based on selectedFilter
    const selectedFilter = req.body.selectedfilter;

    // Apply date filter based on selectedFilter
    if (selectedFilter === "Today") {
      const today = moment().startOf("day");
      PowerStationfilternew = powerStationfilter.filter((meeting) => moment(meeting.date).isSame(today, "day"));
    } else if (selectedFilter === "Weekly") {
      const startOfWeek = moment().startOf("week");
      PowerStationfilternew = powerStationfilter.filter((meeting) => moment(meeting.date).isSame(startOfWeek, "week"));
    } else if (selectedFilter === "Monthly") {
      const startOfMonth = moment().startOf("month");
      PowerStationfilternew = powerStationfilter.filter((meeting) => moment(meeting.date).isSame(startOfMonth, "month"));
    } else if (selectedFilter === "Yearly") {
      const startOfYear = moment().startOf("year");
      PowerStationfilternew = powerStationfilter.filter((meeting) => moment(meeting.date).isSame(startOfYear, "year"));
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!powerStationfilter) {
    return next(new ErrorHandler("PowerStation not found!", 404));
  }

  return res.status(200).json({
    PowerStationfilternew,
  });
});
