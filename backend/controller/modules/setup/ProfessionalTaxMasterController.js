
const ProfessionalTaxMaster = require("../../../model/modules/setup/ProfessionalTaxMasterModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All ProfessionalTaxMaster => /api/professionaltaxmasters
exports.getAllProfessionalTaxMaster = catchAsyncErrors(async (req, res, next) => {
  let professionaltaxmaster;
  try {
    professionaltaxmaster = await ProfessionalTaxMaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!professionaltaxmaster) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    professionaltaxmaster,
  });
});

// Create new ProfessionalTaxMaster=> /api/professionaltaxmaster/new
exports.addProfessionalTaxMaster = catchAsyncErrors(async (req, res, next) => {

  let aprofessionaltaxmaster = await ProfessionalTaxMaster.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ProfessionalTaxMaster => /api/professionaltaxmaster/:id
exports.getSingleProfessionalTaxMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sprofessionaltaxmaster = await ProfessionalTaxMaster.findById(id);

  if (!sprofessionaltaxmaster) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sprofessionaltaxmaster,
  });
});

// update ProfessionalTaxMaster by id => /api/professionaltaxmaster/:id
exports.updateProfessionalTaxMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uprofessionaltaxmaster = await ProfessionalTaxMaster.findByIdAndUpdate(id, req.body);
  if (!uprofessionaltaxmaster) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ProfessionalTaxMaster by id => /api/professionaltaxmaster/:id
exports.deleteProfessionalTaxMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dprofessionaltaxmaster = await ProfessionalTaxMaster.findByIdAndRemove(id);

  if (!dprofessionaltaxmaster) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.ProfessionalTaxMasterSort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalPages, currentPage;

  const { page, pageSize } = req.body;
  try {

      totalProjects = await ProfessionalTaxMaster.countDocuments();

      result = await ProfessionalTaxMaster.find()
          .skip((page - 1) * pageSize)
          .limit(parseInt(pageSize));

  } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
      totalProjects,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
  });
});


exports.ProfessionalTaxMasterSortByAssignBranch = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch, page, pageSize } = req.body;

  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
    }))
  };

  let totalProjects, result, totalPages, currentPage;
  try {

    totalProjects = await ProfessionalTaxMaster.countDocuments(query);

    result = await ProfessionalTaxMaster.find(query)
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    totalProjects,
    result,
    currentPage: page,
    totalPages: Math.ceil(totalProjects / pageSize),
  });
});

exports.getAllProfessionalTaxMasterByAssignBranch = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;

  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
    }))
  };
  let professionaltaxmaster;
  try {
    professionaltaxmaster = await ProfessionalTaxMaster.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!professionaltaxmaster) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    professionaltaxmaster,
  });
});


