const Listofdocument = require("../../../model/modules/documents/listofdocuments");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All Listofdocument =>/api/Listofdocument
exports.getAllListofdocument = catchAsyncErrors(async (req, res, next) => {
  let listofdocuments;
  try {
    listofdocuments = await Listofdocument.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!listofdocuments) {
    return next(new ErrorHandler("Listofdocument not found!", 404));
  }
  return res.status(200).json({
    listofdocuments,
  });
});

//create new Listofdocument => /api/Listofdocument/new
exports.addListofdocument = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let aListofdocument = await Listofdocument.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Listofdocument => /api/Listofdocument/:id
exports.getSingleListofdocument = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let slistofdocument = await Listofdocument.findById(id);
  if (!slistofdocument) {
    return next(new ErrorHandler("Listofdocument not found", 404));
  }
  return res.status(200).json({
    slistofdocument,
  });
});

//update Listofdocument by id => /api/Listofdocument/:id
exports.updateListofdocument = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ulistofdocument = await Listofdocument.findByIdAndUpdate(id, req.body);
  if (!ulistofdocument) {
    return next(new ErrorHandler("Listofdocument not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete Listofdocument by id => /api/Listofdocument/:id
exports.deleteListofdocument = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dlistofdocument = await Listofdocument.findByIdAndRemove(id);
  if (!dlistofdocument) {
    return next(new ErrorHandler("Listofdocument not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
