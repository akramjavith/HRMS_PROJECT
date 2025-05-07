const ERAAmount = require("../../../model/modules/production/EraAmountModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");


// Helper function to create filter condition
function createFilterCondition(column, condition, value) {
  switch (condition) {
    case "Contains":
      return { [column]: new RegExp(value, 'i') };
    case "Does Not Contain":
      return { [column]: { $not: new RegExp(value, 'i') } };
    case "Equals":
      return { [column]: value };
    case "Does Not Equal":
      return { [column]: { $ne: value } };
    case "Begins With":
      return { [column]: new RegExp(`^${value}`, 'i') };
    case "Ends With":
      return { [column]: new RegExp(`${value}$`, 'i') };
    case "Blank":
      return { [column]: { $exists: false } };
    case "Not Blank":
      return { [column]: { $exists: true } };
    default:
      return {};
  }
}

// get All ERAAmount => /api/eraamounts
exports.getAllEraAmount = catchAsyncErrors(async (req, res, next) => {
  let eraamounts;
  try {
    eraamounts = await ERAAmount.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!eraamounts) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    eraamounts,
  });
});

// get All ERAAmount => /api/eraamounts
exports.getAllEraAmountLimited = catchAsyncErrors(async (req, res, next) => {
  let eraamounts;
  try {
    eraamounts = await ERAAmount.find({}, { company: 1, branch: 1, processcode: 1, amount: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!eraamounts) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    eraamounts,
  });
});

// Create new ERAAmount=> /api/eraamount/new
exports.addEraAmount = catchAsyncErrors(async (req, res, next) => {
  let aeraamount = await ERAAmount.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ERAAmount => /api/eraamount/:id
exports.getSingleEraAmount = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let seraamount = await ERAAmount.findById(id);

  if (!seraamount) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    seraamount,
  });
});

// update ERAAmount by id => /api/eraamount/:id
exports.updateEraAmount = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ueraamount = await ERAAmount.findByIdAndUpdate(id, req.body);
  if (!ueraamount) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ERAAmount by id => /api/eraamount/:id
exports.deleteEraAmount = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let deraamount = await ERAAmount.findByIdAndRemove(id);

  if (!deraamount) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getOverallERAAmountBySort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalPages, currentPage;

  const { page, pageSize } = req.body;
  try {

    totalProjects = await ERAAmount.countDocuments();

    result = await ERAAmount.find()
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

exports.geterabulkdel = catchAsyncErrors(
  async (req, res, next) => {
    const ids = req.body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return next(new ErrorHandler("Invalid IDs provided", 400));
    }

    // Define a batch size for deletion
    // const batchSize = Math.ceil(ids.length / 10);
    const batchSize = 10000;

    // Loop through IDs in batches
    for (let i = 0; i < ids.length; i += batchSize) {
      const batchIds = ids.slice(i, i + batchSize);

      // Delete records in the current batch
      await ERAAmount.deleteMany({ _id: { $in: batchIds } });
    }

    return res
      .status(200)
      .json({ message: "Deleted successfully", success: true });
  }
);

exports.getAllEraAmountAssignBranch = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;
  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
    }))
  };

  let eraamounts;
  try {
    eraamounts = await ERAAmount.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!eraamounts) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    eraamounts,
  });
});


exports.getOverallERAAmountBySort = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery } = req.body;

  let query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
    }))
  };

  let conditions = [];

  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach(filter => {
      if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
        conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
      }
    });
  }

  if (searchQuery && searchQuery !== undefined) {
    const searchTermsArray = searchQuery.split(" ");
    const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

    const orConditions = regexTerms.map((regex) => ({
      $or: [
        { company: regex },
        { branch: regex },
        { processcode: regex },
        { amount: regex }
      ],
    }));

    query = {
      $and: [
        {
          $or: assignbranch.map(item => ({
            company: item.company,
            branch: item.branch,
          }))
        },
        ...orConditions,
      ],
    };
  }
  // Apply logicOperator to combine conditions
  if (conditions.length > 0) {
    if (logicOperator === "AND") {
      query.$and = conditions;
    } else if (logicOperator === "OR") {
      query.$or = conditions;
    }
  }

  try {

    const totalProjects = await ERAAmount.countDocuments(query);

    const result = await ERAAmount.find(query)
      .select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    console.log(totalProjects, 'totap')
    res.status(200).json({
      totalProjects,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});












