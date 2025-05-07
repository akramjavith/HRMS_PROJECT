const Income = require("../../../model/modules/expense/income");
const ErrorHandler = require("../../../utils/errorhandler");
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All Income =>/api/Income
exports.getAllIncome = catchAsyncErrors(async (req, res, next) => {
  let incomes;
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

    incomes = await Income.find(filterQuery);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!incomes) {
    return next(new ErrorHandler("Income not found!", 404));
  }
  return res.status(200).json({
    incomes,
  });
});

exports.skippedIncomes = async (req, res) => {
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

    totalProjects = await Income.countDocuments(filterQuery);

    // Execute the filter query on the User model
    allusers = await Income.find(filterQuery)
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

//create new Income => /api/Income/new
exports.addIncome = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let aIncome = await Income.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Income => /api/Income/:id
exports.getSingleIncome = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sincome = await Income.findById(id);
  if (!sincome) {
    return next(new ErrorHandler("Income not found", 404));
  }
  return res.status(200).json({
    sincome,
  });
});

//update Income by id => /api/Income/:id
exports.updateIncome = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uincome = await Income.findByIdAndUpdate(id, req.body);
  if (!uincome) {
    return next(new ErrorHandler("Income not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});

//delete Income by id => /api/Income/:id
exports.deleteIncome = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dincome = await Income.findByIdAndRemove(id);
  if (!dincome) {
    return next(new ErrorHandler("Income not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});


exports.getAllIncomeHome = catchAsyncErrors(async (req, res, next) => {
  let incomes;


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
  // switch (selectedFilter) {
  //   case "Today":
  //     fromdate = todate = formatDate(today);
  //     break;

  //   case "This Week":
  //     const startOfThisWeek = new Date(today);
  //     startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
  //     const endOfThisWeek = new Date(startOfThisWeek);
  //     endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
  //     fromdate = formatDate(startOfThisWeek);
  //     todate = formatDate(endOfThisWeek);
  //     break;
  //   case "This Month":
  //     fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
  //     todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));


  //     break;

  //   default:
  //     fromdate = "";
  // }

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

  // console.log(query, "query")

  try {
    incomes = await Income.find(query, { amount: 1 })
    // console.log(incomes, "incomes")
    total = incomes.reduce((acc, item) => acc + parseFloat(item.amount), 0);
    // console.log(total, "total")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!incomes) {
  //     return next(new ErrorHandler('Income not found!', 404));
  // }
  return res.status(200).json({
    total
  });
})
