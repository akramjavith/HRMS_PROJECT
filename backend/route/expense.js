const express = require("express");
const expenseRoute = express.Router();

const {
  getAllExpenses, getAllExpensesHome,
  getLocwiseBranch,
  addExpenses,
  updateExpenses,
  getSingleExpenses,
  deleteExpenses,
  getExpenseSubCat,
  skippedExpense, ExpenseAutoId
} = require("../controller/modules/expense/expenses");
expenseRoute.route("/allexpenses").post(getAllExpenses);
expenseRoute.route("/allexpenseshome").post(getAllExpensesHome);
expenseRoute.route("/skippedexpenses").post(skippedExpense);
expenseRoute.route("/locationwisebranch").post(getLocwiseBranch);
expenseRoute.route("/expensesubcat").post(getExpenseSubCat);
expenseRoute.route("/expenses/new").post(addExpenses);
expenseRoute.route("/expenses/:id").get(getSingleExpenses).put(updateExpenses).delete(deleteExpenses);
expenseRoute.route("/expensesautoid").get(ExpenseAutoId);

//  Expense Category backend route
const { getAllExpCategory, addExpCategory, ExpenseCategoryAutoId, updateExpCategory, getSingleExpCategory, deleteExpCategory } = require("../controller/modules/expense/expensecategory");
expenseRoute.route("/expensecategories").get(getAllExpCategory);
expenseRoute.route("/expensecategory/new").post(addExpCategory);
expenseRoute.route("/expensecategory/:id").get(getSingleExpCategory).put(updateExpCategory).delete(deleteExpCategory);
expenseRoute.route("/expensecategoriesautoid").get(ExpenseCategoryAutoId);

//  All Income and Expense  backend route
const { getAllIncomeandExpenses } = require("../controller/modules/expense/AllIncomeandExpensesController");
expenseRoute.route("/allincomeandexpenses").post(getAllIncomeandExpenses);

//  Expense Reminder backend route
const { addExpenseReminder, deleteExpenseReminder, getAllExpenseReminder, getSingleExpenseReminder, updateExpenseReminder } = require("../controller/modules/expense/ExpenseReminderController");
expenseRoute.route("/expensereminders").get(getAllExpenseReminder);
expenseRoute.route("/expensereminder/new").post(addExpenseReminder);
expenseRoute.route("/expensereminder/:id").get(getSingleExpenseReminder).put(updateExpenseReminder).delete(deleteExpenseReminder);


//  All Reminder backend route
const {
  getAllReminder,
  getPaymentDueReminder,
} = require("../controller/modules/expense/AllReminderController");
expenseRoute.route("/allreminder").post(getAllReminder);
expenseRoute.route("/paymentduereminder").post(getPaymentDueReminder);


const { getAllPurpose, getSinglePurpose, addPurpose, updatePurpose, deletePurpose } = require("../controller/modules/expense/purpose");
expenseRoute.route("/purpose").get(getAllPurpose);
expenseRoute.route("/purpose/new").post(addPurpose);
expenseRoute.route("/purpose/:id").get(getSinglePurpose).put(updatePurpose).delete(deletePurpose);

const { getAllSourceofPy, getSingleSourceofPy, addSourceofPy, updateSourceofPy, deleteSourceofPy } = require("../controller/modules/expense/sourceofpayment");
expenseRoute.route("/sourceofpayment").get(getAllSourceofPy);
expenseRoute.route("/sourceofpayment/new").post(addSourceofPy);
expenseRoute.route("/sourceofpayment/:id").get(getSingleSourceofPy).put(updateSourceofPy).delete(deleteSourceofPy);


//schedulepayment master
const {
  addSchedulePaymentMaster,
  deleteSchedulePaymentMaster,
  getAllSchedulePaymentMaster,
  getSingleSchedulePaymentMaster,
  updateSchedulePaymentMaster,
} = require("../controller/modules/expense/SchedulePaymentMaster");
expenseRoute
  .route("/allschedulepaymentmasters")
  .post(getAllSchedulePaymentMaster);
expenseRoute.route("/schedulepaymentmaster/new").post(addSchedulePaymentMaster);
expenseRoute
  .route("/schedulepaymentmaster/:id")
  .get(getSingleSchedulePaymentMaster)
  .put(updateSchedulePaymentMaster)
  .delete(deleteSchedulePaymentMaster);

//schedulepayment notpaidbills
const {
  addNotAddedBills,
  deleteNotAddedBills,
  getAllNotAddedBills,
  getSingleNotAddedBills,
  updateNotAddedBills,
  getAllIgnoredNotAddedBills,
  getAllIndividualNotAddedBills
} = require("../controller/modules/expense/NotAddedBills");
expenseRoute.route("/allschedulepaymentnotaddedbills").post(getAllNotAddedBills);
expenseRoute.route("/ignorednotaddedbills").get(getAllIgnoredNotAddedBills);
expenseRoute.route("/notaddednotaddedbills").get(getAllIndividualNotAddedBills);
expenseRoute.route("/schedulepaymentnotaddedbills/new").post(addNotAddedBills);
expenseRoute
  .route("/schedulepaymentnotaddedbills/:id")
  .get(getSingleNotAddedBills)
  .put(updateNotAddedBills)
  .delete(deleteNotAddedBills);


module.exports = expenseRoute;
