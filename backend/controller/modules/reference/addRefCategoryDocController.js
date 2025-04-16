const ReferenceCategory = require("../../../model/modules/reference/addRefCategoryDocModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const ReferenceSubCategory = require("../../../model/modules/reference/referenceCategoryDocModel");
const ReferenceDoc = require("../../../model/modules/reference/referenceCategoryDocModel");

// get all ref documents = > /api/allrefdocuments
exports.getAllDocument = catchAsyncErrors(async (req, res, next) => {
  let document;
  try {
    document = await ReferenceCategory.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!document) {
    return next(new ErrorHandler("Document not found", 404));
  }
  // Add serial numbers to the doccategory
  const alldoccategory = document.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));

  return res.status(200).json({
    document: alldoccategory,
  });
});

//add new ref documents => /api/refdocuments/new
exports.addDocument = catchAsyncErrors(async (req, res, next) => {
  try {
    await ReferenceCategory.create(req.body);
    return res.status(200).json({
      message: "Successfully added",
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

// get single ref document => /api/refdocument/:id
exports.getSingleDocument = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sdocument = await ReferenceCategory.findById(id);
  if (!sdocument) {
    return next(new ErrorHandler("Document not found", 404));
  }
  return res.status(200).json({
    sdocument,
  });
});

// update single ref document => /api/refdocument/:id
exports.updateDocument = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let udocument = await ReferenceCategory.findByIdAndUpdate(id, req.body);

  if (!udocument) {
    return next(new ErrorHandler("Document not found", 404));
  }
  return res.status(200).json({
    message: "Update Successfully",
    udocument,
  });
});

//delete document  by id => /api/refdocument/:id
exports.deleteDocument = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ddocument = await ReferenceCategory.findByIdAndRemove(id);
  if (!ddocument) {
    return next(new ErrorHandler("Document not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

//get sub category based on category =>/api/getsubcategoryref
exports.getsubcategory = catchAsyncErrors(async (req, res, next) => {
  let subcat;
  try {
    subcat = await ReferenceSubCategory.find({ categoryname: { $eq: req.body.categoryname } });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!subcat) {
    return next(new ErrorHandler("Category  not found!", 404));
  }
  return res.status(200).json({
    subcat,
  });
});

exports.getOverAllEditRefDocuments = catchAsyncErrors(async (req, res, next) => {
  let documentsall, query, documents, docindex;
  try {
    documentsall = await Document.find(query, {});

    documents = documentsall.filter((item) => item.categoryname == req.body.oldname && req.body.oldnamesub.includes(item.subcategoryname));

    docindex = documentsall.findIndex((item) => req.body.oldnamesub.includes(item.subcategoryname));
   
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    count: documents.length,

    documents,
    docindex,
  });
});

// get overall delete functionlity
exports.getAllRefDocumentcategoryCheck = catchAsyncErrors(async (req, res, next) => {
  let refdocumnetcat;
  try {
    let query = {
      categoryname: req.body.checkcategory,
    };
    refdocumnetcat = await ReferenceCategory.find(query, {
      categorycode: 1,
      _id: 1,
    });
  } catch (err) {}
  if (!refdocumnetcat) {
    return next(new ErrorHandler("RefDocument not found!", 404));
  }
  return res.status(200).json({
    refdocumnetcat,
  });
});
