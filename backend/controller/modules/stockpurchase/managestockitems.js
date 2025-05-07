const Managestockitems = require("../../../model/modules/stockpurchase/managestockitems");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

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

// get All Managestockitems => /api/Managestockitems
exports.getAllManagestockitems = catchAsyncErrors(async (req, res, next) => {
  try {
    let managestockitems = await Managestockitems.find();
    if (!managestockitems) {
      return next(new ErrorHandler("Managestockitems not found!", 404));
    }
    return res.status(200).json({
      managestockitems,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});




exports.getAllManagestockitemsPagination = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery } = req.body;

  let query = {};
  let conditions = [];

  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach(filter => {
      console.log(filter, "filter")
      if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {


        conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
      }

    });
  }

  if (searchQuery && searchQuery !== undefined) {
    const searchTermsArray = searchQuery.split(" ");
    const regexTerms = searchTermsArray.map((term) => {

      // Check if the term is in the date format DD/MM/YYYY
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (dateRegex.test(term)) {
        // Convert DD/MM/YYYY to YYYY-MM-DD
        const [day, month, year] = term.split("/");
        const formattedDate = `${year}-${month}-${day}`;
        return new RegExp(formattedDate, "i");
      }
      return new RegExp(term, "i");
    });
    // console.log(regexTerms, "regexTerms")
    const orConditions = regexTerms.map((regex) => ({
      $or: [
        { stockcategory: regex },
        { stocksubcategory: regex },
        { itemname: regex },
        { uom: regex },
        // { minimumstockswitch: regex },
        { minimumquantity: regex },
        { maximumquantity: regex },
      ],

    }));
    // console.log(searchQuery, "searchQuery")
    query = {
      $and: [

        ...orConditions,
      ],
    };
  }


  // console.log(query, "query")

  // Apply logicOperator to combine conditions
  if (conditions.length > 0) {
    if (logicOperator === "AND") {
      query.$and = conditions;
    } else if (logicOperator === "OR") {
      query.$or = conditions;
    }
  }
  // console.log(conditions, "conditions")
  try {

    const totalProjects = await Managestockitems.countDocuments(query);

    const totalProjectsData = await Managestockitems.find();

    const result = await Managestockitems.find(query)
      .select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    // console.log(result.length, 'result')
    res.status(200).json({
      totalProjects,
      totalProjectsData,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    console.log(err, 'e')
    return next(new ErrorHandler("Records not found!", 404));
  }
});
//create new Managestockitems => /api/Managestockitems/new
exports.addManagestockitems = catchAsyncErrors(async (req, res, next) => {
  let managestockitems = await Managestockitems.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Managestockitems => /api/Managestockitems/:id
exports.getSingleManagestockitems = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let managestockitems = await Managestockitems.findById(id);
  if (!managestockitems) {
    return next(new ErrorHandler("Managestockitems not found", 404));
  }
  return res.status(200).json({
    managestockitems,
  });
});
//update Managestockitems by id => /api/Managestockitems/:id
exports.updateManagestockitems = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let managestockitems = await Managestockitems.findByIdAndUpdate(id, req.body);
  if (!managestockitems) {
    return next(new ErrorHandler("Managestockitems not found", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

//delete Managestockitems by id => /api/Managestockitems/:id
exports.deleteManagestockitems = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let managestockitems = await Managestockitems.findByIdAndRemove(id);
  if (!managestockitems) {
    return next(new ErrorHandler("Managestockitems not found", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
