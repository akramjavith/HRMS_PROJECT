const Holiday = require("../../../model/modules/setup/holidayModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const moment = require("moment");

var today = new Date();
var dd = String(today.getDate()).padStart(2, "0");
var mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
var yyyy = today.getFullYear();
today = yyyy + "-" + mm + "-" + dd;

// get All Holiday => /api/holidays
exports.getAllHoliday = catchAsyncErrors(async (req, res, next) => {
  let holiday;
  try {
    const { assignbranch } = req.body;

    const branchFilter = assignbranch.map((branchObj) => ({
      $and: [
        { company: { $elemMatch: { $eq: branchObj.company } } }, 
        { applicablefor: { $elemMatch: { $eq: branchObj.branch } } },   
        { unit: { $elemMatch: { $eq: branchObj.unit } } },       
      ],
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    const filterQuery = { $or: branchFilter };

    holiday = await Holiday.find(filterQuery);
    // holiday = await Holiday.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!holiday) {
    return next(new ErrorHandler("Holiday Name not found!", 404));
  }
  return res.status(200).json({
    holiday,
  });
});

// get All Today Holiday => /api/holidays
exports.todayHolidayFilter = catchAsyncErrors(async (req, res, next) => {
  let holiday;
  try {
    holiday = await Holiday.find({date:today});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!holiday) {
    return next(new ErrorHandler("Holiday Name not found!", 404));
  }
  return res.status(200).json({
    holiday,
  });
});

// Create new Holiday=> /api/holiday/new
exports.addHoliday = catchAsyncErrors(async (req, res, next) => {
  let aproduct = await Holiday.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Holiday => /api/holiday/:id
exports.getSingleHoliday = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sholiday = await Holiday.findById(id);

  if (!sholiday) {
    return next(new ErrorHandler("Holiday not found!", 404));
  }
  return res.status(200).json({
    sholiday,
  });
});

// update Holiday by id => /api/holiday/:id
exports.updateHoliday = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uholiday = await Holiday.findByIdAndUpdate(id, req.body);

  if (!uholiday) {
    return next(new ErrorHandler("Holiday not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Holiday by id => /api/holiday/:id
exports.deleteHoliday = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dholiday = await Holiday.findByIdAndRemove(id);

  if (!dholiday) {
    return next(new ErrorHandler("Holiday not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.HolidayFilter = catchAsyncErrors(async (req, res, next) => {
  let holidayfilter, holidayfilternew;
  try {
    holidayfilter = await Holiday.find();

    // Apply date filter based on selectedFilter
    const selectedFilter = req.body.selectedfilter;

    // Apply date filter based on selectedFilter
    if (selectedFilter === "Today") {
      const today = moment().startOf("day");
      holidayfilternew = holidayfilter.filter((meeting) =>
        moment(meeting.date).isSame(today, "day")
      );
    } else if (selectedFilter === "Weekly") {
      const startOfWeek = moment().startOf("week");
      holidayfilternew = holidayfilter.filter((meeting) =>
        moment(meeting.date).isSame(startOfWeek, "week")
      );
    } else if (selectedFilter === "Monthly") {
      const startOfMonth = moment().startOf("month");
      holidayfilternew = holidayfilter.filter((meeting) =>
        moment(meeting.date).isSame(startOfMonth, "month")
      );
    } else if (selectedFilter === "Yearly") {
      const startOfYear = moment().startOf("year");
      holidayfilternew = holidayfilter.filter((meeting) =>
        moment(meeting.date).isSame(startOfYear, "year")
      );
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!holidayfilter) {
    return next(new ErrorHandler("Holidays not found!", 404));
  }

  return res.status(200).json({
    holidayfilternew,
  });
});




