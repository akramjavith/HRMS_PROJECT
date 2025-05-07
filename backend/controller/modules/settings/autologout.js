const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const AutoLogout = require("../../../model/modules/settings/autologout");

// Get all autologout  => /api/allautologout
exports.getAllAutoLogout = catchAsyncErrors(async (req, res, next) => {
  let autologout;
  try {
    autologout = await AutoLogout.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!autologout) {
    return next(new ErrorHandler("Data not found", 404));
  }
  return res.status(200).json({
    count: autologout.length,
    autologout,
  });
});

// Create autologout  => /api/createautologout
exports.createAutoLogout = catchAsyncErrors(async (req, res, next) => {
  await AutoLogout.create(req.body);
  return res.status(200).json({
    message: "Successfully added",
  });
});

// get single autologout =>/api/singleautologout/:id
exports.getSingleAutoLogout = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sautologout = await AutoLogout.findById(id);
  if (!sautologout) {
    return next(new ErrorHandler("Id not found"));
  }
  return res.status(200).json({
    sautologout,
  });
});

// update autologout to all users => /api/singleautologout/:id
exports.updateAutoLogout = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uautologout = await AutoLogout.findByIdAndUpdate(id, req.body);

  if (!uautologout) {
    return next(new ErrorHandler("Id not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

exports.getAllAutoLogoutassignbranch = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;

    // Create a query array for company and branch
    const query = assignbranch.map(item => ({
      company: item.company,
      branch: item.branch, // Assuming `branch` is an array in `assignbranch`
      unit: item.unit, // Assuming `branch` is an array in `assignbranch`
    }));
  
  let AAutologout;
  try {
    AAutologout = await AutoLogout.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!AAutologout) {
    return next(new ErrorHandler("Data not found", 404));
  }

  const autologout = AAutologout.map(setting => {
    return {
      ...setting._doc, // Spread the existing setting properties
      todos: setting.todos.filter(todo =>
        query.some(q => q.company === todo.company && q.branch === todo.branch && q.unit === todo.unit)
      )
    };
  });


  return res.status(200).json({
    count: autologout.length,
    autologout,
  });
});