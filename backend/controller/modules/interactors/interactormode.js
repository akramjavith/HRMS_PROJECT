const InteractorMode = require("../../../model/modules/interactors/interactormode");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const VisitorType = require("../../../model/modules/interactors/visitor");

// get All interactor mode Name => /api/interactormode
exports.getAllInteractorMode = catchAsyncErrors(async (req, res, next) => {
  let interactormode;
  try {
    interactormode = await InteractorMode.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!interactormode) {
    return next(new ErrorHandler("Interactory mode Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    interactormode,
  });
});

// Create new interactormode=> /api/interactormode/new
exports.addInteractorMode= catchAsyncErrors(async (req, res, next) => {
  let checkloc = await InteractorMode.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Interactor Mode Name already exist!", 400));
  }

  let aInteractorMode = await InteractorMode.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single interactormode => /api/interactormode/:id
exports.getSingleInteractorMode = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sinteractormode = await InteractorMode.findById(id);

  if (!sinteractormode) {
    return next(new ErrorHandler("Interactor Mode Name not found!", 404));
  }
  return res.status(200).json({
    sinteractormode,
  });
});

// update Interactor Mode by id => /api/interactormode/:id
// exports.updateInteractorMode = catchAsyncErrors(async (req, res, next) => {
//   const id = req.params.id;
//   let uinteractormode = await InteractorMode.findByIdAndUpdate(id, req.body);
//   if (!uinteractormode) {
//     return next(new ErrorHandler("Interactor Mode Name not found!", 404));
//   }
//   return res.status(200).json({ message: "Updated successfully" });
// });

exports.updateInteractorMode = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let interactorMode = await InteractorMode.findByIdAndUpdate(id, {
    name: req.body.name,
  }, { new: true });
  
  if (!interactorMode) {
    return next(new ErrorHandler('Data not found'));
  }

  const updatedCategory = req.body.prevprojectname;

  const raiseProblemsToUpdate = await VisitorType.find({
    visitormode: updatedCategory
  });
  
  const filteredRaiseProblems = raiseProblemsToUpdate.filter(item =>
    item.followuparray.some(followup => followup.visitormode === updatedCategory)
  );
  

  // const  ManageTypeToUpdate = await ManageTypePG.find({
  //   interactorstype: updatedCategory,
  // });

  for (const raiseProblem of filteredRaiseProblems) {
    raiseProblem.visitormode = req.body.name;
    raiseProblem.followuparray = raiseProblem.followuparray.map(item => {
      if (item.visitormode === updatedCategory) {
        item.visitormode = req.body.name;
      }
      return item;
    });
    await raiseProblem.save();
  }
  
  // for (const  ManageType of  ManageTypeToUpdate) {
  //   ManageType.interactorstype = req.body.name;
  //   await  ManageType.save();
  // }

  return res.status(200).json({
    message: 'Update Successfully',
    interactorMode
  });
});

// delete interactor mode by id => /api/interactormode/:id
exports.deleteInteractorMode = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dinteractormode = await InteractorMode.findByIdAndRemove(id);

  if (!dinteractormode) {
    return next(new ErrorHandler("Interactor Mode Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});