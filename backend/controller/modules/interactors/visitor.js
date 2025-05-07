const Visitors = require("../../../model/modules/interactors/visitor");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All visitors => /api/allvisitors
exports.getAllVisitors = catchAsyncErrors(async (req, res, next) => {
  let visitors;
  try {
    const { assignbranch } = req.body;

    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    const filterQuery = { $or: branchFilter };
    visitors = await Visitors.find(filterQuery);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!visitors) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    visitors,
  });
});


exports.getAllVisitorsdata = catchAsyncErrors(async (req, res, next) => {
  let visitors;
  try {

    visitors = await Visitors.find();
    console.log(visitors.length, "viisi")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!visitors) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    visitors,
  });
});

exports.getAllVisitorsRegister = catchAsyncErrors(async (req, res, next) => {
  let visitors;
  try {

    visitors = await Visitors.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!visitors) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    visitors,
  });
});


//visitor scan
exports.getAllVisitorsCheckout = catchAsyncErrors(async (req, res, next) => {
  let visitors;
  try {
    visitors = await Visitors.find(
      { checkout: false, company: req.body.company, branch: req.body.branch },
      { visitorname: 1, date: 1, intime: 1 }
    );
  } catch (err) {
    console.log(err.message);
  }
  if (!visitors) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    visitors,
  });
});

exports.getAllVisitorsFilteredId = catchAsyncErrors(async (req, res, next) => {
  let visitors;
  try {
    visitors = await Visitors.find({}, { _id: 0, visitorid: 1 });
  } catch (err) {
    console.log(err.message);
  }
  if (!visitors) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    visitors,
  });
});
exports.getAllVisitorUpdateId = catchAsyncErrors(async (req, res, next) => {
  const { outerId, outtime } = req.body;

  // Update the nested array element using array filters
  let user = await Visitors.findOneAndUpdate(
    { _id: outerId },
    {
      $set: {
        outtime: outtime,
        checkout: true,
        "followuparray.$[].outtime": outtime,
      },
    }, // Set the matched array element to updateData
    { new: true } // Return the updated document
  );

  if (!user) {
    return next(new ErrorHandler("Data not found!", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

exports.getLastIndexVisitors = catchAsyncErrors(async (req, res, next) => {
  let visitor;
  try {
    visitor = await Visitors.findOne().sort({ _id: -1 });
  } catch (err) {
    return next(new ErrorHandler("Record not found!", 404));
  }
  if (!visitor) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    visitor,
  });
});

// Create new Connectivity=> /api/visitors/new
exports.addVisitors = catchAsyncErrors(async (req, res, next) => {
  let avisitors = await Visitors.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single interactortype => /api/visitors/:id
exports.getSingleVisitors = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let svisitors = await Visitors.findById(id);

  if (!svisitors) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    svisitors,
  });
});

// update Interactor Type by id => /api/visitors/:id
exports.updateVisitors = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uvisitors = await Visitors.findByIdAndUpdate(id, req.body);
  if (!uvisitors) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

//patching the visitors
exports.updatePatchVisitors = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uvisitors = await Visitors.updateOne({ _id: id }, { $set: req.body });
  if (!uvisitors) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete interactor type by id => /api/visitors/:id
exports.deleteVisitors = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dvisitors = await Visitors.findByIdAndRemove(id);

  if (!dvisitors) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
exports.skippedVisitors = async (req, res) => {
  try {
    let totalProjects, result;
    const { page, pageSize, assignbranch } = req.body;

    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    const filterQuery = {
      $and: [
        { interactorstatus: "visitor" }, // Ensure interactorstatus is "visitor"
        { $or: branchFilter }, // Match any of the branch, company, and unit combinations
      ],
    };

    totalProjects = await Visitors.countDocuments(filterQuery);

    // Execute the filter query on the User model
    allusers = await Visitors.find(filterQuery)
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    result = allusers;
    return res.status(200).json({
      allusers,
      totalProjects,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
exports.skippedAllVisitors = async (req, res) => {
  try {
    let totalProjects, result;
    const { page, pageSize, assignbranch } = req.body;

    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    const filterQuery = { $or: branchFilter };

    totalProjects = await Visitors.countDocuments(filterQuery);

    // Execute the filter query on the User model
    allusers = await Visitors.find(filterQuery)
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    result = allusers;
    return res.status(200).json({
      allusers,
      totalProjects,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};