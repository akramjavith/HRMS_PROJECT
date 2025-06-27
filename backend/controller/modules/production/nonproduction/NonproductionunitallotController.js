const NonProductionunitAllot = require("../../../../model/modules/production/nonproduction/NonProductionunitallotModel");
const ErrorHandler = require("../../../../utils/errorhandler");
const catchAsyncErrors = require("../../../../middleware/catchAsyncError");
const moment = require("moment");

// get All NonProductionunitAllot => /api/NonProductionunitAllot
exports.getAllNonproductionunitallot = catchAsyncErrors(async (req, res, next) => {
  let nonproductionunitallot;
  try {
    nonproductionunitallot = await NonProductionunitAllot.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!nonproductionunitallot) {
    return next(new ErrorHandler("NonProductionunitAllot not found!", 404));
  }
  return res.status(200).json({
    nonproductionunitallot,
  });
});

// Create new NonProductionunitAllot=> /api/NonProductionunitAllot/new
exports.addNonproductionunitallot = catchAsyncErrors(async (req, res, next) => {

  let aproduct = await NonProductionunitAllot.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle NonProductionunitAllot => /api/NonProductionunitAllot/:id
exports.getSingleNonproductionunitallot = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let nonproductionunitallot = await NonProductionunitAllot.findById(id);

  if (!nonproductionunitallot) {
    return next(new ErrorHandler("NonProductionunitAllot not found!", 404));
  }
  return res.status(200).json({
    nonproductionunitallot,
  });
});

// update NonProductionunitAllot by id => /api/NonProductionunitAllot/:id
exports.updateNonproductionunitallot = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let nonproductionunitallot = await NonProductionunitAllot.findByIdAndUpdate(id, req.body);

  if (!nonproductionunitallot) {
    return next(new ErrorHandler("NonProductionunitAllot not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete NonProductionunitAllot by id => /api/NonProductionunitAllot/:id
exports.deleteNonproductionunitallot = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let nonproductionunitallot = await NonProductionunitAllot.findByIdAndRemove(id);

  if (!nonproductionunitallot) {
    return next(new ErrorHandler("NonProductionunitAllot Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAllNonproductionunitallotProduction = catchAsyncErrors(async (req, res, next) => {
  const { 
    empid,
    page = 1, 
    pageSize = 10, 
    allFilters = [], 
    logicOperator = 'AND', 
    searchQuery 
  } = req.body;

  try {
    // Initialize base query with empid if provided
    let query = empid ? { empid } : {};

    // Process advanced filters
    const conditions = [];
    if (Array.isArray(allFilters)) {
      allFilters.forEach(filter => {
        if (filter?.column && filter?.condition && 
            (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
          const condition = createFilterCondition(
            filter.column, 
            filter.condition, 
            filter.value
          );
          if (condition && Object.keys(condition).length) {
            conditions.push(condition);
          }
        }
      });
    }

    // Process search query
    if (searchQuery && typeof searchQuery === 'string' && searchQuery.trim()) {
      const searchTerms = searchQuery.trim().split(/\s+/);
      const searchConditions = searchTerms.map(term => ({
        $or: [
          { category: new RegExp(term, "i") },
          { subcategory: new RegExp(term, "i") },
          { company: new RegExp(term, "i") },
          { branch: new RegExp(term, "i") },
          { unit: new RegExp(term, "i") },
          { team: new RegExp(term, "i") },
          { employeename: new RegExp(term, "i") },
          { employeecode: new RegExp(term, "i") }
        ]
      }));

      query.$and = (query.$and || []).concat(searchConditions);
    }

    // Combine conditions with the specified logic operator
    if (conditions.length > 0) {
      const operator = logicOperator.toUpperCase() === 'OR' ? '$or' : '$and';
      query[operator] = conditions;
    }

    // Execute count and find queries in parallel
    const [totalProjects, result] = await Promise.all([
      NonProductionunitAllot.countDocuments(query),
      NonProductionunitAllot.find(query)
        .select("") // Select all fields
        .lean()
        .skip((Math.max(1, page) - 1) * pageSize)
        .limit(parseInt(pageSize))
        .exec()
    ]);

    if (totalProjects === 0) {
      return res.status(200).json({
        success: true,
        result : [],
      });
    }

    return res.status(200).json({
      success: true,
      totalProjects,
      result,
      currentPage: Math.max(1, page),
      totalPages: Math.ceil(totalProjects / pageSize)
    });

  } catch (err) {
    console.error('Error fetching non-production unit allotments:', err);
    return next(new ErrorHandler("Error retrieving records", 500));
  }
});

// Helper function to create filter conditions
function createFilterCondition(column, condition, value) {
  switch (condition) {
    case "Contains":
      return { [column]: new RegExp(escapeRegex(value), 'i') };
    case "Does Not Contain":
      return { [column]: { $not: new RegExp(escapeRegex(value), 'i') } };
    case "Equals":
      return { [column]: value };
    case "Does Not Equal":
      return { [column]: { $ne: value } };
    case "Begins With":
      return { [column]: new RegExp(`^${escapeRegex(value)}`, 'i') };
    case "Ends With":
      return { [column]: new RegExp(`${escapeRegex(value)}$`, 'i') };
    case "Blank":
      return { [column]: { $in: [null, ''] } };
    case "Not Blank":
      return { [column]: { $nin: [null, ''] } };
    default:
      return {};
  }
}

// Helper function to escape regex special characters
function escapeRegex(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}



