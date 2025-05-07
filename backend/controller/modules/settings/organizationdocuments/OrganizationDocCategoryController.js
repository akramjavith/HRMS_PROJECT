const OrganizationCategory = require("../../../../model/modules/settings/organisationdocuments/OrganizationDocCategoryModel");
const ErrorHandler = require("../../../../utils/errorhandler");
const catchAsyncErrors = require("../../../../middleware/catchAsyncError");
const OrganizationDocument = require("../../../../model/modules/settings/organisationdocuments/OrganizationDocumentModel");

// get all organizationdocumentcategory => /api/organizationdocumentcategorys
exports.getAllOrgCategory = catchAsyncErrors(async (req, res, next) => {
  let orgcategory;
  try {
    orgcategory = await OrganizationCategory.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!orgcategory) {
    return next(new ErrorHandler("Data not found", 404));
  }
  // Add serial numbers to the organizationdocumentcategory
  const allorgcategory = orgcategory.map((data, index) => ({
    serialNumber: index + 1,
    ...data.toObject(),
  }));

  return res.status(200).json({
    orgcategory: allorgcategory,
  });
});

// add organizationdocumentcategory =>/api/organizationdocumentcategory/new
exports.addOrgCategory = catchAsyncErrors(async (req, res, next) => {
  await OrganizationCategory.create(req.body);
  return res.status(200).json({
    message: "Successfully added",
  });
});

// get single organizationdocumentcategory =>/api/organizationdocumentcategory/:id
exports.getSingleOrgCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sorgcategory = await OrganizationCategory.findById(id);
  if (!sorgcategory) {
    return next(new ErrorHandler("Data not found"));
  }
  return res.status(200).json({
    sorgcategory,
  });
});

// update single organizationdocumentcategory =>/api/organizationdocumentcategory/:id
exports.updateOrgCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uorgcategory = await OrganizationCategory.findByIdAndUpdate(id, req.body);

  if (!uorgcategory) {
    return next(new ErrorHandler("Data not found"));
  }
  return res.status(200).json({
    message: "Update Successfully",
    uorgcategory,
  });
});

// delete single referencecategory =>/api/referencecategory/:id
exports.deleteOrgCategory = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dorgcategory = await OrganizationCategory.findByIdAndRemove(id);
  if (!dorgcategory) {
    return next(new ErrorHandler("Data not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getOverAllEditOrgdocuments = catchAsyncErrors(
  async (req, res, next) => {
    let orgrefdocumentsall, query, orgdocuments, refdocindex;
    try {
      orgrefdocumentsall = await OrganizationDocument.find(query, {});

      orgdocuments = orgrefdocumentsall.filter(
        (item) =>
          item.categoryname == req.body.oldname &&
          req.body.oldnamesub?.includes(item.subcategoryname)
      );

      refdocindex = orgrefdocumentsall.findIndex((item) =>
        req.body.oldnamesub.includes(item.subcategoryname)
      );
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
      count: orgdocuments.length,

      orgdocuments,
      refdocindex,
    });
  }
);

//overall bulk delete category  => /api/overallbulkdelete/organizationcategory
exports.overallBulkDeleteOrganizationCategory = catchAsyncErrors(
  async (req, res, next) => {
    let organization, announcementcategory, result, count;
    let id = req.body.id;
    try {
      announcementcategory = await OrganizationCategory.find();
      const answerQuestion = announcementcategory?.filter((data) =>
        id?.includes(data._id?.toString())
      );

      organization = await OrganizationDocument.find();

      const unmatchedAnnouncement = answerQuestion
        .filter((answers) =>
          organization.some((sub) => sub.categoryname === answers.categoryname)
        )
        ?.map((data) => data._id?.toString());

      const duplicateId = [...unmatchedAnnouncement];
      result = id?.filter((data) => !duplicateId?.includes(data));
      count = id?.filter((data) => duplicateId?.includes(data))?.length;
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
      count: count,
      result,
    });
  }
);