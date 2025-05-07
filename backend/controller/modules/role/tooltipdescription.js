const ToolTipDescription = require("../../../model/modules/role/tooltipdescription");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
//get All ToolTipDescription =>/api/roles
exports.getAllDescription = catchAsyncErrors(async (req, res, next) => {
  let tooldescription;
  try {
    tooldescription = await ToolTipDescription.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!tooldescription) {
    return next(new ErrorHandler("ToolTipDescription not found!", 404));
  }
  return res.status(200).json({
    tooldescription,
  });
});

exports.getAllDescriptionByAggregation = catchAsyncErrors(async (req, res, next) => {
  let tooldescription;
  try {
    tooldescription = await ToolTipDescription.aggregate(
      [
        {
          $group: {
            _id: "$modulename",
            submodules: { $push: "$$ROOT" } 
          }
        },
        {
          $addFields: {
            modulename: "$_id",
            submodules: "$submodules"
          }
        },
        {
          $project: {
            _id: 0, 
          }
        }
      ]
    );

   
   
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!tooldescription) {
    return next(new ErrorHandler("ToolTipDescription not found!", 404));
  }
  return res.status(200).json({
    tooldescription,
  });
});


//create new role => /api/role/new
exports.addToolDescription = catchAsyncErrors(async (req, res, next) => {
  const { modulename, submodulename, mainpagename, subpagename, subsubpagename } = req.body;

  try {
    let foundData = await ToolTipDescription.findOneAndUpdate(
      { modulename, submodulename, mainpagename, subpagename, subsubpagename },
      { $setOnInsert: req.body },
      { upsert: true, new: false }
    );

    if (foundData) {
      return next(new ErrorHandler("Data Already Exist!", 409));
    }

    return res.status(200).json({
      message: "Successfully added!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
// get Single role => /api/role/:id
exports.getSingleToolDescription = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let stooldesc = await ToolTipDescription.findById(id);
  if (!stooldesc) {
    return next(new ErrorHandler("ToolTipDescription not found", 404));
  }
  return res.status(200).json({
    stooldesc,
  });
});
//update role by id => /api/role/:id
exports.updateToolDescription = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let utooldesc = await ToolTipDescription.findByIdAndUpdate(id, req.body);
  if (!utooldesc) {
    return next(new ErrorHandler("Data not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});
//delete role by id => /api/role/:id
exports.deleteToolDescription = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dtooldesc = await ToolTipDescription.findByIdAndRemove(id);
  if (!dtooldesc) {
    return next(new ErrorHandler("ToolTipDescription not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});