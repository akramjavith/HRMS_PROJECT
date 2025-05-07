const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const AttendanceControlCriteria = require("../../../model/modules/settings/Attendancecontrolcriteria");

// Get all attendancecontrolcriteria  => /api/allattendancecontrolcriteria
exports.getAllAttendanceControlCriteria = catchAsyncErrors(
  async (req, res, next) => {
    let attendancecontrolcriteria;
    try {
      attendancecontrolcriteria = await AttendanceControlCriteria.find();
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!attendancecontrolcriteria) {
      return next(new ErrorHandler("Data not found", 404));
    }
    return res.status(200).json({
      count: attendancecontrolcriteria.length,
      attendancecontrolcriteria,
    });
  }
);

// Create attendancecontrolcriteria  => /api/createattendancecontrolcriteria
exports.createAttendanceControlCriteria = catchAsyncErrors(
  async (req, res, next) => {
    await AttendanceControlCriteria.create(req.body);
    return res.status(200).json({
      message: "Successfully added",
    });
  }
);

// get single attendancecontrolcriteria =>/api/singleattendancecontrolcriteria/:id
exports.getSingleAttendanceControlCriteria = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let sattendancecontrolcriteria = await AttendanceControlCriteria.findById(
      id
    );
    if (!sattendancecontrolcriteria) {
      return next(new ErrorHandler("Id not found"));
    }
    return res.status(200).json({
      sattendancecontrolcriteria,
    });
  }
);

// update attendancecontrolcriteria to all users => /api/singleattendancecontrolcriteria/:id
exports.updateAttendanceControlCriteria = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let uattendancecontrolcriteria =
      await AttendanceControlCriteria.findByIdAndUpdate(id, req.body);

    if (!uattendancecontrolcriteria) {
      return next(new ErrorHandler("Id not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
  }
);

exports.getAllAttendanceControlCriteriaLastIndex = catchAsyncErrors(
  async (req, res, next) => {
    let attendancecontrolcriteria;
    try {
      attendancecontrolcriteria = await AttendanceControlCriteria.findOne()
        .sort({ createdAt: -1 })
        .exec();
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!attendancecontrolcriteria) {
      return next(new ErrorHandler("Data not found", 404));
    }
    return res.status(200).json({
      count: attendancecontrolcriteria.length,
      attendancecontrolcriteria,
    });
  }
);

exports.getAllAttendanceControlCriteriaAssignBranch = catchAsyncErrors(

  async (req, res, next) => {
    const { assignbranch } = req.body;

    // Create a query array for company and branch
    const query = assignbranch.map(item => ({
      company: item.company,
      branch: item.branch, // Assuming `branch` is an array in `assignbranch`
      unit: item.unit, // Assuming `branch` is an array in `assignbranch`
    }));

    let Attendancecontrolcriteria;
    try {
      Attendancecontrolcriteria = await AttendanceControlCriteria.find();
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!Attendancecontrolcriteria) {
      return next(new ErrorHandler("Data not found", 404));
    }

    const attendancecontrolcriteria = Attendancecontrolcriteria.map(setting => {
      return {
        ...setting._doc, // Spread the existing setting properties
        todos: setting.todos.filter(todo =>
          query.some(q => q.company === todo.company && q.branch === todo.branch && q.unit === todo.unit)
        )
      };
    });

    return res.status(200).json({
      count: attendancecontrolcriteria.length,
      attendancecontrolcriteria,
    });
  }
);