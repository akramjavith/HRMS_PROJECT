const OtherPayments = require("../../../model/modules/account/otherpayment");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All aotherpayments =>/api/allotherpayments
exports.getAllOtherPayments = catchAsyncErrors(async (req, res, next) => {
  let otherpayments;
  try {
    const { assignbranch } = req.body;

    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branchname: branchObj.branch,
      company: branchObj.company,
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    const filterQuery = { $or: branchFilter };
    otherpayments = await OtherPayments.find(filterQuery);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!otherpayments) {
    return next(new ErrorHandler("Company not found!", 404));
  }

  // Add serial numbers to the otherpayments
  const allotherpayments = otherpayments.map((payments, index) => ({
    serialNumber: index + 1,
    ...payments.toObject(),
  }));

  return res.status(200).json({
    otherpayments: allotherpayments,
  });
});
function createFilterCondition(column, condition, value) {
  const convertDate = (input) => {
    const parts = input.split("-");
    if (parts.length === 3 && !isNaN(Date.parse(`${parts[2]}-${parts[1]}-${parts[0]}`))) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return null;
  };

  // Attempt to parse value as a number
  const numberValue = !isNaN(parseFloat(value)) ? parseFloat(value) : null;
  const dateValue = convertDate(value);

  switch (condition) {
    case "Contains":
      if (column === "dueamount" || column === "billdate" || column === "receiptdate") return {}; // Prevent regex on numeric fields
      return { [column]: new RegExp(value, "i") };
    case "Does Not Contain":
      if (column === "amount" || column === "billdate" || column === "receiptdate") return {}; // Prevent regex on numeric fields
      return { [column]: { $not: new RegExp(value, "i") } };
    case "Equals":
      if (dateValue) return { [column]: dateValue };
      if (numberValue !== null) return { [column]: numberValue };
      return { [column]: value };
    case "Does Not Equal":
      if (dateValue) return { [column]: { $ne: dateValue } };
      if (numberValue !== null) return { [column]: { $ne: numberValue } };
      return { [column]: { $ne: value } };
    case "Begins With":
      if (column === "dueamount" || column === "billdate" || column === "receiptdate") return {}; // Prevent regex on numeric fields
      return { [column]: new RegExp(`^${value}`, "i") };
    case "Ends With":
      if (column === "dueamount" || column === "billdate" || column === "receiptdate") return {}; // Prevent regex on numeric fields
      return { [column]: new RegExp(`${value}$`, "i") };
    case "Blank":
      return { [column]: { $exists: false } };
    case "Not Blank":
      return { [column]: { $exists: true } };
    default:
      return {};
  }
}
exports.skippedOtherPayments = async (req, res) => {
  try {
    let totalProjects, result, totalProjectsDatas;
    const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery, } = req.body;

    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch?.map((branchObj) => ({
      branchname: branchObj.branch,
      company: branchObj.company,
    }));

    let query = {
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

    if (searchQuery) {
      const searchTermsArray = searchQuery.split(" ");

      // Convert search query to a date in 'YYYY-MM-DD' if it's in 'DD-MM-YYYY' format
      const convertDate = (input) => {
        const parts = input.split("-");
        if (parts.length === 3 && !isNaN(Date.parse(`${parts[2]}-${parts[1]}-${parts[0]}`))) {
          return `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
        return null;
      };


      const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

      const orConditions = regexTerms.map((regex, index) => {
        const term = searchTermsArray[index];
        const numberValue = parseFloat(term);
        const convertedDate = convertDate(term);

        return {
          $or: [
            { company: regex },
            { branchname: regex },
            { expensecategory: regex },
            { expensesubcategory: regex },
            { vendor: regex },
            { vendorfrequency: regex },
            { gstno: regex },
            { purpose: regex },
            { billno: regex },
            ...(numberValue
              ? [
                { dueamount: numberValue },
              ]
              : []),
            ...(convertedDate
              ? [
                { billdate: new RegExp(convertedDate, "i") },
                { receiptdate: new RegExp(convertedDate, "i") },
              ]
              : []),
            { paidthrough: regex },
            { bankname: regex },
            { ifsccode: regex },
            { paidstatus: regex },
          ],
        };
      });

      query = {
        $and: [
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

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    const filterQuery = { $or: branchFilter, ...query };
    const filterQueryALL = { $or: branchFilter };
    totalProjects = await OtherPayments.countDocuments(filterQuery);
    totalProjectsDatas = await OtherPayments.find(filterQueryALL);

    // Execute the filter query on the User model
    allusers = await OtherPayments.find(filterQuery)
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    result = allusers;
    return res.status(200).json({
      allusers,
      totalProjects,
      result,
      totalProjectsDatas,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};


//create new otherpayments => /api/otherpayment/new
exports.addOtherPayments = catchAsyncErrors(async (req, res, next) => {
  let aotherpayments = await OtherPayments.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single otherpayment => /api/otherpayment/:id
exports.getSingleotherpayment = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sotherpayment = await OtherPayments.findById(id);
  if (!sotherpayment) {
    return next(new ErrorHandler("company not found", 404));
  }
  return res.status(200).json({
    sotherpayment,
  });
});
//update sotherpayment by id => /api/otherpayment/:id
exports.updatesOtherpayment = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uotherpayment = await OtherPayments.findByIdAndUpdate(id, req.body);
  if (!uotherpayment) {
    return next(new ErrorHandler("company not found", 404));
  }

  return res
    .status(200)
    .json({ message: "Updated successfully", uotherpayment });
});

//delete dotherpayment by id => /api/otherpayment/:id
exports.deletesOtherpayment = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dotherpayment = await OtherPayments.findByIdAndRemove(id);
  if (!dotherpayment) {
    return next(new ErrorHandler("company not found", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});