const Leavecriteria = require("../../../model/modules/leave/leavecriteria");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All Leavecriteria =>/api/Leavecriteria
exports.getAllLeavecriteria = catchAsyncErrors(async (req, res, next) => {
  let leavecriterias;
  try {
    leavecriterias = await Leavecriteria.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!leavecriterias) {
    return next(new ErrorHandler("Leavecriteria not found!", 404));
  }
  return res.status(200).json({
    leavecriterias,
  });
});

exports.getAllLeavecriteriaForApplyLeave = catchAsyncErrors(async (req, res, next) => {
  let leavecriterias;
  try {
    resemp = await Leavecriteria.find({ mode: "Employee", });
    resdes = await Leavecriteria.find({ mode: "Designation", });
    resdpt = await Leavecriteria.find({ mode: "Department", });

    let resultemp = resemp.find((d) => d.employee?.includes(req.body.empname) && d.leavetype === req.body.leavetype);
    let resultdesg = resdes.find((d) => d.designation?.includes(req.body.empdesg) && d.leavetype === req.body.leavetype);
    let resultdept = resdpt.find((d) => d.department?.includes(req.body.empdept) && d.leavetype === req.body.leavetype);


    let filteredresultemp = resemp.filter((d) => d.employee?.includes(req.body.empname) && d.leavetype === req.body.leavetype);
    let filteredresultdesg = resdes.filter((d) => d.designation?.includes(req.body.empdesg) && d.leavetype === req.body.leavetype);
    let filteredresultdept = resdpt.filter((d) => d.department?.includes(req.body.empdept) && d.leavetype === req.body.leavetype);

    leavecriterias = resultemp ? filteredresultemp : resultdesg ? filteredresultdesg : resultdept ? filteredresultdept : [];

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!leavecriterias) {
    return next(new ErrorHandler("Leavecriteria not found!", 404));
  }
  return res.status(200).json({
    leavecriterias,
  });
});


//create new Leavecriteria => /api/Leavecriteria/new
exports.addLeavecriteria = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let aLeavecriteria = await Leavecriteria.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Leavecriteria => /api/Leavecriteria/:id
exports.getSingleLeavecriteria = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sleavecriteria = await Leavecriteria.findById(id);
  if (!sleavecriteria) {
    return next(new ErrorHandler("Leavecriteria not found", 404));
  }
  return res.status(200).json({
    sleavecriteria,
  });
});

//update Leavecriteria by id => /api/Leavecriteria/:id
exports.updateLeavecriteria = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uleavecriteria = await Leavecriteria.findByIdAndUpdate(id, req.body);
  if (!uleavecriteria) {
    return next(new ErrorHandler("Leavecriteria not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete Leavecriteria by id => /api/Leavecriteria/:id
exports.deleteLeavecriteria = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dleavecriteria = await Leavecriteria.findByIdAndRemove(id);
  if (!dleavecriteria) {
    return next(new ErrorHandler("Leavecriteria not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
