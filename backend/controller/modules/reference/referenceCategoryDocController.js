const ReferenceCategory = require("../../../model/modules/reference/referenceCategoryDocModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const ReferenceDoc = require('../../../model/modules/reference/addRefCategoryDocModel');

// get all referencecategory => /api/referencecategories
exports.getAllRefCategory = catchAsyncErrors(async (req, res, next) => {
  let doccategory;
  try {
    doccategory = await ReferenceCategory.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!doccategory) {
    return next(new ErrorHandler("category not found", 404));
  }
  // Add serial numbers to the doccategory
  const alldoccategory = doccategory.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));

  return res.status(200).json({
    doccategory: alldoccategory,
  });
});

// add referencecategory =>/api/referencecategory/new
exports.addRefCategory = catchAsyncErrors(async (req, res, next) => {
  await ReferenceCategory.create(req.body);
  return res.status(200).json({
    message: "Successfully added",
  });
});

// get single referencecategory =>/api/referencecategory/:id
exports.getSingleRefCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sdoccategory = await ReferenceCategory.findById(id);
  if (!sdoccategory) {
    return next(new ErrorHandler("document not found"));
  }
  return res.status(200).json({
    sdoccategory,
  });
});

// update single referencecategory =>/api/referencecategory/:id
exports.updateRefCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let udoccategory = await ReferenceCategory.findByIdAndUpdate(id, req.body);

  if (!udoccategory) {
    return next(new ErrorHandler("document not found"));
  }
  return res.status(200).json({
    message: "Update Successfully",
    udoccategory,
  });
});

// delete single referencecategory =>/api/referencecategory/:id
exports.deleteRefCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ddoccategory = await ReferenceCategory.findByIdAndRemove(id);
  if (!ddoccategory) {
    return next(new ErrorHandler("company not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getOverAllEditrefdocuments = catchAsyncErrors(async (req, res, next) => {
  let refrefdocumentsall, query, refdocuments, refdocindex
  try {

    refrefdocumentsall = await ReferenceDoc.find(query, {});

    refdocuments = refrefdocumentsall.filter(item => item.categoryname == req.body.oldname && req.body.oldnamesub.includes(item.subcategoryname))

    refdocindex = refrefdocumentsall.findIndex(item => req.body.oldnamesub.includes(item.subcategoryname));
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }


  return res.status(200).json({
    count: refdocuments.length,

    refdocuments, refdocindex
  });
});