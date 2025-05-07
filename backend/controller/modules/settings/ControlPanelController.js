const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError')
const User = require('../../../model/login/auth');
const AdminOverAllSettings = require('../../../model/modules/settings/AdminOverAllSettingsModel')

// Get overallsettings  => /api/getoverallsettings
exports.getOverAllSettings = catchAsyncErrors(async (req, res, next) => {
    let overallsettings
    try {
        overallsettings = await AdminOverAllSettings.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!overallsettings) {
        return next(new ErrorHandler('Data not found', 404));
    }
    return res.status(200).json({
        count:overallsettings.length,
        overallsettings
    });

})

// Create overallsettings  => /api/createoverallsettings
exports.createOverAllSettings = catchAsyncErrors(async (req, res, next) => {
    await AdminOverAllSettings.create(req.body);
    return res.status(200).json({
        message: 'Successfully added'
    })
})

// get single overallsettings =>/api/singleoverallsettings/:id
exports.getSingleOverAllSettings = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let soverallsettings = await AdminOverAllSettings.findById(id);
    if (!soverallsettings) {
        return next(new ErrorHandler('Id not found'));
    }
    return res.status(200).json({
        soverallsettings
    });

});

// update overallsettings to all users => /api/singleoverallsettings/:id
exports.updateOverAllSettings = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id
    let uoverallsettings = await AdminOverAllSettings.findByIdAndUpdate(id, req.body);

    if (!uoverallsettings) {
        return next(new ErrorHandler('Id not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

exports.getOverAllSettingsLastIndex = catchAsyncErrors(async (req, res, next) => {
    let overallsettings
    try {
        overallsettings = await AdminOverAllSettings.findOne()
            .sort({ createdAt: -1 })
            .exec();

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!overallsettings) {
        return next(new ErrorHandler('Data not found', 404));
    }
    return res.status(200).json({
        count: overallsettings.length,
        overallsettings
    });

})
exports.getOverAllSettingsAssignBranch = catchAsyncErrors(async (req, res, next) => {
    const { assignbranch } = req.body;
  
    // Create a query array for company and branch
    const query = assignbranch.map(item => ({
      company: item.company,
      branch: item.branch, // Assuming `branch` is an array in `assignbranch`
    }));
  
    let overallsettings;
    try {
      overallsettings = await AdminOverAllSettings.find();
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    
    if (!overallsettings) {
      return next(new ErrorHandler("Data not found", 404));
    }
  
    // Filter the todos based on company and branch in the query
    const filteredSettings = overallsettings.map(setting => {
      return {
        ...setting._doc, // Spread the existing setting properties
        todos: setting.todos.filter(todo =>
          query.some(q => 
            q.company === todo.company && 
            q.branch.includes(todo.branch) // Check if todo.branch is in the array of branches
          )
        )
      };
    });
  
    return res.status(200).json({
      count: filteredSettings.length,
      overallsettings: filteredSettings,
    });
  });