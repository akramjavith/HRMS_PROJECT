const InteractorType = require("../../../model/modules/interactors/interactortype");
const VisitorType = require("../../../model/modules/interactors/visitor");
const ManageTypePG = require("../../../model/modules/interactors/managetypepurposegrouping");

// const Visitor = require("../../../model/modules/interactors/visitorsModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All interactor type Name => /api/interactortype
exports.getAllInteractorType = catchAsyncErrors(async (req, res, next) => {
  let interactorType;
  try {
    interactorType = await InteractorType.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!interactorType) {
    return next(new ErrorHandler("Interactory type Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    interactorType,
  });
});

// Create new Connectivity=> /api/interactortype/new
exports.addInteractorType= catchAsyncErrors(async (req, res, next) => {
  let checkloc = await InteractorType.findOne({ name: req.body.name });

  if (checkloc) {
    return next(new ErrorHandler("Interactor Type Name already exist!", 400));
  }

  let aInteractorType = await InteractorType.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single interactortype => /api/interactortype/:id
exports.getSingleInteractorType = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sinteractortype = await InteractorType.findById(id);

  if (!sinteractortype) {
    return next(new ErrorHandler("Interactor Type Name not found!", 404));
  }
  return res.status(200).json({
    sinteractortype,
  });
});

// update Interactor Type by id => /api/interactortype/:id
// exports.updateInteractorType = catchAsyncErrors(async (req, res, next) => {
//   const id = req.params.id;
//   let uinteractortype = await InteractorType.findByIdAndUpdate(id, req.body);
//   if (!uinteractortype) {
//     return next(new ErrorHandler("Interactor Type Name not found!", 404));
//   }
//   return res.status(200).json({ message: "Updated successfully" });
// });

exports.updateInteractorType = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let interactorType = await InteractorType.findByIdAndUpdate(id, {
    name: req.body.name,
  }, { new: true });
  
  if (!interactorType) {
    return next(new ErrorHandler('Data not found'));
  }

  const updatedCategory = req.body.prevprojectname;

  const raiseProblemsToUpdate = await VisitorType.find({
    visitortype: updatedCategory
  });
  
  const filteredRaiseProblems = raiseProblemsToUpdate.filter(item =>
    item.followuparray.some(followup => followup.visitortype === updatedCategory)
  );
  

  const  ManageTypeToUpdate = await ManageTypePG.find({
    interactorstype: updatedCategory,
  });

  for (const raiseProblem of filteredRaiseProblems) {
    raiseProblem.visitortype = req.body.name;
    raiseProblem.followuparray = raiseProblem.followuparray.map(item => {
      if (item.visitortype === updatedCategory) {
        item.visitortype = req.body.name;
      }
      return item;
    });
    await raiseProblem.save();
  }
  
  for (const  ManageType of  ManageTypeToUpdate) {
    ManageType.interactorstype = req.body.name;
    await  ManageType.save();
  }

  return res.status(200).json({
    message: 'Update Successfully',
    interactorType,
    updatecount: raiseProblemsToUpdate.length +ManageTypeToUpdate.length
  });
});


// delete interactor type by id => /api/interactortype/:id
exports.deleteInteractorType = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dinteractortype = await InteractorType.findByIdAndRemove(id);

  if (!dinteractortype) {
    return next(new ErrorHandler("Interactor Type Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});