const ExpenseReminder = require("../../../model/modules/expense/ExpenseReminderModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

//get All ExpenseReminder =>/api/expensereminders
exports.getAllExpenseReminder = catchAsyncErrors(async (req, res, next) => {
    let expensereminders;
    try {
        expensereminders = await ExpenseReminder.find() 
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!expensereminders) {
        return next(new ErrorHandler('ExpenseReminder not found!', 404));
    }
    return res.status(200).json({
        expensereminders
    });
})


//create new ExpenseReminder => /api/ExpenseReminder/new
exports.addExpenseReminder = catchAsyncErrors(async (req, res, next) => {

    let aexpensereminder = await ExpenseReminder.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single ExpenseReminder => /api/ExpenseReminder/:id
exports.getSingleExpenseReminder = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sexpensereminder = await ExpenseReminder.findById(id);
    if (!sexpensereminder) {
        return next(new ErrorHandler('ExpenseReminder not found', 404));
    }
    return res.status(200).json({
        sexpensereminder
    })
})

//update ExpenseReminder by id => /api/ExpenseReminder/:id
exports.updateExpenseReminder = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uexpensereminder = await ExpenseReminder.findByIdAndUpdate(id, req.body);
    if (!uexpensereminder) {
        return next(new ErrorHandler('ExpenseReminder not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete ExpenseReminder by id => /api/ExpenseReminder/:id
exports.deleteExpenseReminder = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dexpensereminder = await ExpenseReminder.findByIdAndRemove(id);
    if (!dexpensereminder) {
        return next(new ErrorHandler('ExpenseReminder not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
