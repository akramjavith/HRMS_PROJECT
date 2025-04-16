const Expenses = require("../../../model/modules/expense/expenses");
const Income = require("../../../model/modules/expense/income");
const StockPurchase = require("../../../model/modules/stockpurchase/stock");
const SchedulePayment = require("../../../model/modules/account/otherpayment");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const moment = require("moment");

//get Location wise filter=>/api/locationwiseall
exports.getAllIncomeandExpenses = catchAsyncErrors(async (req, res, next) => {
  try {
    const { company, assignbranch } = req.body;

    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch
      .filter((data) => data.company === req.body.company)
      .map((branchObj) => ({
        branch: branchObj.branch,
        company: branchObj.company,
        unit: branchObj.unit,
      }));
    const filterQueryIncomeData = {
      $and: [{ modeDrop: "Received" }, { $or: branchFilter }],
    };

    // Fetch income and expense data based on company
    //company,branch,unit
    const incomeData = await Income.find(filterQueryIncomeData);

    const filterQueryExpenseData = {
      $and: [
        { paidstatus: "Paid" }, // Ensure interactorstatus is "visitor"
        { $or: branchFilter }, // Match any of the branch, company, and unit combinations
      ],
    };

    //company,branch,unit
    const expenseData = await Expenses.find(filterQueryExpenseData);

    // const schedulePaymentData = await SchedulePayment.find({
    //   company: req.body.company,
    //   paidstatus: "Paid",
    // });
    const filterQuerystockPurchaseData = { $or: branchFilter };
    //company,branch,unit
    const stockPurchaseData = await StockPurchase.find(
      filterQuerystockPurchaseData
    );

    if (!incomeData && !expenseData && !stockPurchaseData) {
      return next(new ErrorHandler("Data not found!", 404));
    }

    // Combine income and expense data
    const bankStatement = [
      ...incomeData,
      ...expenseData,
      // ...schedulePaymentData,
      ...stockPurchaseData,
    ];

    // bankStatement.sort((a, b) => new Date(a.sortdate) - new Date(b.sortdate));
    bankStatement.sort((a, b) => {
      const dateA = a.sortdate ? new Date(a.sortdate) : new Date(a.billdate);
      const dateB = b.sortdate ? new Date(b.sortdate) : new Date(b.billdate);
      return dateA - dateB;
    });
    const result = [];
    // Calculate balance for each entry
    let uniqueIdCounter = 1;
    let balance = 0;
    for (const entry of bankStatement) {
      const {
        sortdate,
        amount,
        paidamount,
        branch,
        unit,
        company,
        purpose,
        expansenote,
        notes,
        // dueamount,
        // branchname,
        rate,
        billdate,
      } = entry;
      const uniqueId = uniqueIdCounter++;
      if (amount !== undefined) {
        balance += amount;
        result.push({
          _id: uniqueId,
          date: moment(sortdate).format("DD-MM-YYYY"),
          company,
          branch,
          unit,
          notes,
          income: amount,
          source: "Income",
          expense: 0,
          balance,
        });
      } else if (paidamount !== undefined) {
        balance -= paidamount;
        result.push({
          _id: uniqueId,
          date: moment(sortdate).format("DD-MM-YYYY"),
          company,
          branch,
          unit,
          purpose,
          expansenote,
          income: 0,
          expense: paidamount,
          source: "Expense",
          balance,
        });
      } else if (rate !== undefined) {
        balance -= rate;
        result.push({
          _id: uniqueId,
          date: moment(billdate).format("DD-MM-YYYY"),
          company,
          branch,
          unit,
          income: 0,
          expense: rate,
          source: "Stock Purchase",
          balance,
        });
      }
      //  else if (dueamount !== undefined) {
      //   balance -= dueamount;
      //   result.push({
      //     _id: uniqueId,
      //     date: moment(sortdate).format("DD-MM-YYYY"),
      //     company,
      //     branch: branchname,
      //     unit,
      //     income: 0,
      //     expense: dueamount,
      //     source: "Scheduled Payment",
      //     balance,
      //   });
      // }
    }

    return res.status(200).json({
      allincomeandexpense: result,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});