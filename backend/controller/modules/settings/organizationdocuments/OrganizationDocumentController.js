const OrganizationDocument = require("../../../../model/modules/settings/organisationdocuments/OrganizationDocumentModel");
const ErrorHandler = require("../../../../utils/errorhandler");
const catchAsyncErrors = require("../../../../middleware/catchAsyncError");
const OrganizationCategory = require("../../../../model/modules/settings/organisationdocuments/OrganizationDocCategoryModel");

// get all org documents = > /api/allrefdocuments
exports.getAllOrgDocument = catchAsyncErrors(async (req, res, next) => {
  let document;
  try {
    document = await OrganizationDocument.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!document) {
    return next(new ErrorHandler("Document not found", 404));
  }
  // Add serial numbers to the allorgdocument
  const allorgdocument = document.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));

  return res.status(200).json({
    document: allorgdocument,
  });
});
exports.getImageAllOrgDocument = catchAsyncErrors(async (req, res, next) => {
  let document;
  try {
    document = await OrganizationDocument.find({fileoptionname:"Image-png"},{});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!document) {
    return next(new ErrorHandler("Document not found", 404));
  }
  // Add serial numbers to the allorgdocument
  const allorgdocument = document.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));

  return res.status(200).json({
    document: allorgdocument,
  });
});
//add new org documents => /api/refdocuments/new
exports.addOrgDocument = catchAsyncErrors(async (req, res, next) => {
  try {
    await OrganizationDocument.create(req.body);
    return res.status(200).json({
      message: "Successfully added",
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

// get single org document => /api/refdocument/:id
exports.getSingleOrgDocument = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sdocument = await OrganizationDocument.findById(id);
  if (!sdocument) {
    return next(new ErrorHandler("Document not found", 404));
  }
  return res.status(200).json({
    sdocument,
  });
});

// update single org document => /api/refdocument/:id
exports.updateOrgDocument = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let udocument = await OrganizationDocument.findByIdAndUpdate(id, req.body);

  if (!udocument) {
    return next(new ErrorHandler("Document not found", 404));
  }
  return res.status(200).json({
    message: "Update Successfully",
    udocument,
  });
});

//delete org document  by id => /api/refdocument/:id
exports.deleteOrgDocument = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ddocument = await OrganizationDocument.findByIdAndRemove(id);
  if (!ddocument) {
    return next(new ErrorHandler("Document not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

//get org sub category based on category =>/api/getsubcategoryref
exports.getorgsubcategory = catchAsyncErrors(async (req, res, next) => {
  let subcat;
  try {
    subcat = await OrganizationCategory.find({ categoryname: { $eq: req.body.categoryname } });
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

exports.getOverAllEditOrgDocuments = catchAsyncErrors(async (req, res, next) => {
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
exports.getAllOrgDocumentcategoryCheck = catchAsyncErrors(async (req, res, next) => {
  let refdocumnetcat;
  try {
    let query = {
      categoryname: req.body.checkcategory,
    };
    refdocumnetcat = await OrganizationDocument.find(query, {
      categorycode: 1,
      _id: 1,
    });
  } catch (err) {}
  if (!refdocumnetcat) {
    return next(new ErrorHandler("Document not found!", 404));
  }
  return res.status(200).json({
    refdocumnetcat,
  });
});
