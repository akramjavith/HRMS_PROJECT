const DocumentPreparation = require("../../model/modules/documentpreparation");
const Company = require("../../model/modules/setup/company");
const Branch = require("../../model/modules/branch");
const Unit = require("../../model/modules/unit");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");

// get All DocumentPreparation  => /api/DocumentPreparations
// get All DocumentPreparation  => /api/DocumentPreparations
exports.getAllDocumentPreparation = catchAsyncErrors(async (req, res, next) => {
  let documentPreparation;
  try {
    documentPreparation = await DocumentPreparation.find({},{date:1,printingstatus:1,pagesize:1,pageheight:1,pagewidth:1,template:1,templateno:1,referenceno:1,employeemode:1,department:1,company:1,issuingauthority:1,branch:1,unit:1,team:1,person:1,proption:1,tempcode:1,sign:1,sealing:1,email:1,frommailemail:1,mail:1,addedby:1,issuedpersondetails:1,updatedby:1,createdAt:1,});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!documentPreparation) {
    return next(new ErrorHandler("Document Preparation not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    documentPreparation,
  });
});
exports.getAccessibleBranchAllDocumentPreparation = catchAsyncErrors(async (req, res, next) => {
  let documentPreparation;
  try {
    const { assignbranch } = req.body;

    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
    }));
    const filterQuery = { $or: branchFilter };

    documentPreparation = await DocumentPreparation.find(filterQuery,{date:1,printingstatus:1,pagesize:1,pageheight:1,pagewidth:1,template:1,templateno:1,referenceno:1,employeemode:1,department:1,company:1,issuingauthority:1,branch:1,unit:1,team:1,person:1,proption:1,tempcode:1,sign:1,sealing:1,email:1,frommailemail:1,mail:1,addedby:1,issuedpersondetails:1,updatedby:1,createdAt:1,});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!documentPreparation) {
    return next(new ErrorHandler("Document Preparation not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    documentPreparation,
  });
});
exports.getLastAutoIdDocumentPrep = catchAsyncErrors(async (req, res, next) => {
  let documentPreparation;
  try {
    documentPreparation = await DocumentPreparation.aggregate([
      {
        $sort: { _id: -1 }  // Sort by _id in descending order
      },
      {
        $limit: 1            // Limit to the last document
      },{
        $project: {
          templateno:1,
          _id:0
        }
      }
    ]);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!documentPreparation) {
    return next(new ErrorHandler("Document Preparation not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    documentPreparation,
  });
});
exports.getLastAutoIdCompanyDocumentPrep = catchAsyncErrors(async (req, res, next) => {
  let documentPreparation;
  try {
    documentPreparation = await DocumentPreparation.aggregate([
      {
        $sort: { _id: -1 }  // Sort by _id in descending order
      },
      {
        $limit: 1            // Limit to the last document
      },{
        $project: {
          templateno:1,
          _id:0
        }
      }
    ]);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!documentPreparation) {
    return next(new ErrorHandler("Document Preparation not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    documentPreparation,
  });
});
exports.getALLUserAttendanceDateStatus = catchAsyncErrors(async (req, res, next) => {
  let result;

  const {person , date} = req.body;
  console.log(person , date , 'person , date')
  try {
} catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
      result 
  });
})


exports.getDocumentPreparationCodes = catchAsyncErrors(async (req, res, next) => {
  let documentPreparation;
  try {

    const company = await Company.findOne({name: req.body.company})
    const branch = await Branch.findOne({name: req.body.branch})
    const unit = await Unit.findOne({name: req.body.unit})
    documentPreparation = company?.code?.slice(0,3)+branch?.code?.slice(0,3)+ unit?.code?.slice(0,3)

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    documentPreparation,
  });
});
exports.getCompanyDocumentPreparationCodes = catchAsyncErrors(async (req, res, next) => {
  let documentPreparation;
  try {

    const company = await Company.findOne({name: req.body.company})
    const branch = await Branch.findOne({name: req.body.branch})
    documentPreparation = company?.code?.slice(0,3)+branch?.code?.slice(0,3)

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    documentPreparation,
  });
});

// Create new DocumentPreparation=> /api/DocumentPreparation/new
exports.addDocumentPreparation = catchAsyncErrors(async (req, res, next) => {
  const { template, person } = req.body;
    // Use an aggregation pipeline to check for duplicates
    const existingDocument = await DocumentPreparation.aggregate([
      {
        $match: {
          template: { $regex: new RegExp(`^${template}$`, 'i') }, // Case-insensitive match
          person: person,
        },
      },
      { $limit: 1 } // Limit to one document to check existence
    ]);

    if (existingDocument.length > 0) {
      return res.status(400).json({
        message: "Duplicate entry found!",
      })
    }

  let aDocumentPreparation = await DocumentPreparation.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle DocumentPreparation => /api/documentPreparation/:id
exports.getSingleDocumentPreparation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sdocumentPreparation = await DocumentPreparation.findById(id);

  if (!sdocumentPreparation) {
    return next(new ErrorHandler("Document Preparation not found!", 404));
  }
  return res.status(200).json({
    sdocumentPreparation,
  });
});

// update DocumentPreparation by id => /api/documentPreparation/:id
exports.updateDocumentPreparation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let udocumentPreparation = await DocumentPreparation.findByIdAndUpdate(id, req.body);
  if (!udocumentPreparation) {
    return next(new ErrorHandler("DocumentPreparation not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete DocumentPreparation by id => /api/documentPreparation/:id
exports.deleteDocumentPreparation = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dDocumentPreparation = await DocumentPreparation.findByIdAndRemove(id);

  if (!dDocumentPreparation) {
    return next(new ErrorHandler("Document Preparation not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});