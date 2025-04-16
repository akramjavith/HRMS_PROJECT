const Expenses = require("../../../model/modules/expense/expenses");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Branch = require("../../../model/modules/branch");
const ExpenseCategory = require("../../../model/modules/expense/expensecategory");

//get Location wise filter=>/api/locationwiseall
exports.getLocwiseBranch = catchAsyncErrors(async (req, res, next) => {
  let branch;
  try {
    branch = await Branch.find({ company: { $eq: req.body.company } });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!branch) {
    return next(new ErrorHandler("Branch not found!", 404));
  }
  return res.status(200).json({
    branch,
  });
});
//get Expense Sub category=>/api/expensesubcat
exports.getExpenseSubCat = catchAsyncErrors(async (req, res, next) => {
  let subcat;
  try {
    subcat = await ExpenseCategory.find({
      categoryname: { $eq: req.body.categoryname },
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!subcat) {
    return next(new ErrorHandler("Category Name not found!", 404));
  }
  return res.status(200).json({
    subcat,
  });
});
exports.skippedExpense = async (req, res) => {
  try {
    let totalProjects, result;
    const { page, pageSize, assignbranch, company, branch, unit } = req.body;
    // Check if arrays are empty and fallback to assignbranch if they are
    const companiesToFilter =
      company.length > 0
        ? company
        : assignbranch.map((branchObj) => branchObj.company);
    const branchesToFilter =
      branch.length > 0
        ? branch
        : assignbranch.map((branchObj) => branchObj.branch);
    const unitsToFilter =
      unit.length > 0 ? unit : assignbranch.map((branchObj) => branchObj.unit);

    // Construct the branch filter based on the filtered values
    const branchFilter = {
      $or: assignbranch
        .map((branchObj) => {
          const isOthersCompany = branchObj.company === "Others";

          return {
            company: companiesToFilter.includes(branchObj.company)
              ? branchObj.company
              : null,
            branch: isOthersCompany
              ? ""
              : branchesToFilter.includes(branchObj.branch)
                ? branchObj.branch
                : null,
            unit: isOthersCompany
              ? ""
              : unitsToFilter.includes(branchObj.unit)
                ? branchObj.unit
                : null,
          };
        })
        .filter(
          (obj) => obj.company && obj.branch !== null && obj.unit !== null
        ), // Filter out objects with null values
    };

    totalProjects = await Expenses.countDocuments(branchFilter);

    // Execute the filter query on the User model
    allusers = await Expenses.find(branchFilter)
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

//get All Expenses =>/api/expenses
exports.getAllExpenses = catchAsyncErrors(async (req, res, next) => {
  let expenses;
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
    expenses = await Expenses.find(filterQuery);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!expenses) {
    return next(new ErrorHandler("Expenses not found!", 404));
  }
  return res.status(200).json({
    expenses,
  });
});

//create new expenses => /api/expenses/new
exports.addExpenses = catchAsyncErrors(async (req, res, next) => {
  let aexpenses = await Expenses.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single expenses => /api/expenses/:id
exports.getSingleExpenses = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sexpenses = await Expenses.findById(id);
  if (!sexpenses) {
    return next(new ErrorHandler("Expenses not found", 404));
  }
  return res.status(200).json({
    sexpenses,
  });
});
//update expenses by id => /api/expenses/:id
exports.updateExpenses = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uexpenses = await Expenses.findByIdAndUpdate(id, req.body);
  if (!uexpenses) {
    return next(new ErrorHandler("Expenses not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete expenses by id => /api/expenses/:id
exports.deleteExpenses = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dexpenses = await Expenses.findByIdAndRemove(id);
  if (!dexpenses) {
    return next(new ErrorHandler("Expenses not found", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.ExpenseAutoId = catchAsyncErrors(async (req, res, next) => {
  let autoid;
  try {
    // Find the last expense category document sorted by _id in descending order
    const lastexpense = await Expenses.findOne().sort({ _id: -1 });

    // Check if there's any document in the collection
    if (!lastexpense) {
      // If no document found, start with EC0001
      autoid = "AE0001";
    } else {
      // If a document is found, get the last generated autoid
      let lastAutoId = lastexpense.referenceno; // Assuming you have 'autoid' field in the document

      // Extract the numeric part from the last autoid
      let codenum = lastAutoId ? lastAutoId.split("AE")[1] : "0000";
      // Increment the numeric part by 1
      let nextIdNum = parseInt(codenum, 10) + 1;

      // Convert the number back to a string and pad it with leading zeros
      let nextIdStr = String(nextIdNum).padStart(4, "0");

      // Form the next autoid
      autoid = "AE" + nextIdStr;
    }
  } catch (err) {
    return next(new ErrorHandler("Record not found!", 404));
  }

  return res.status(200).json({
    autoid,
  });
});



exports.getAllExpensesHome = catchAsyncErrors(async (req, res, next) => {
  let expenses, total;
  try {


    let fromdate, todate;
    const today = new Date();
    const selectedFilter = req.body.selectedfilter;

    // Utility function to format date as 'YYYY-MM-DD'
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };

    // Set date ranges based on the selected filter
    switch (selectedFilter) {


      case "Last Month":
        fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
        todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
        break;
      case "Last Week":
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
        fromdate = formatDate(startOfLastWeek);
        todate = formatDate(endOfLastWeek);
        break;
      case "Yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        fromdate = todate = formatDate(yesterday);
        break;

      case "Today":
        fromdate = todate = formatDate(today);
        break;
      case "Tomorrow":
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        fromdate = todate = formatDate(tomorrow);
        break;
      case "This Week":
        const startOfThisWeek = new Date(today);
        startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
        const endOfThisWeek = new Date(startOfThisWeek);
        endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
        fromdate = formatDate(startOfThisWeek);
        todate = formatDate(endOfThisWeek);
        break;
      case "This Month":
        fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
        todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));


        break;

      default:
        fromdate = "";
    }

    let query = {
      ...(fromdate && todate
        ? { date: { $gte: fromdate, $lte: todate } }
        : fromdate
          ? { date: { $eq: fromdate } }
          : {}),

    }
    // console.log(query, "quer")
    expenses = await Expenses.find(query, {});

    total = expenses.reduce((acc, item) => acc + parseFloat(item.totalbillamount), 0);
    console.log(total, "total")

    // console.log(expenses.length, "expenses")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!expenses) {
  //   return next(new ErrorHandler("Expenses not found!", 404));
  // }
  return res.status(200).json({
    total
  });
});



