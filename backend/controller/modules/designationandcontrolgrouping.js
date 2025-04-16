const Designationandcontrolgrouping = require("../../model/modules/designationandcontrolgrouping");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");

// get All Designationandcontrolgrouping => /api/Designationandcontrolgrouping
exports.getAllDesignationandcontrolgrouping = catchAsyncErrors(async (req, res, next) => {
  let designationandcontrolgroupings;
  try {
    designationandcontrolgroupings = await Designationandcontrolgrouping.find();
  } catch (err) {
    console.log(err)
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!designationandcontrolgroupings) {
    return next(new ErrorHandler("Designationandcontrolgrouping not found!", 404));
  }
  return res.status(200).json({
    designationandcontrolgroupings,
  });
});

// Create new Designationandcontrolgrouping=> /api/Designationandcontrolgrouping/new
exports.addDesignationandcontrolgrouping = catchAsyncErrors(async (req, res, next) => {
    let aDesignationandcontrolgrouping = await Designationandcontrolgrouping.create(req.body);
  
    return res.status(200).json({
      message: "Successfully added!",
    }); 
  });

// get Single Designationandcontrolgrouping => /api/singleDesignationandcontrolgrouping/:id
exports.getSingleDesignationandcontrolgrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sdesignationandcontrolgrouping = await Designationandcontrolgrouping.findById(id);

  if (!sdesignationandcontrolgrouping) {
    return next(new ErrorHandler("Designationandcontrolgrouping not found!", 404));
  }
  return res.status(200).json({
    sdesignationandcontrolgrouping,
  });
});

// update Designationandcontrolgrouping by id => /api/singleDesignationandcontrolgrouping/:id
exports.updateDesignationandcontrolgrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let udesignationandcontrolgrouping = await Designationandcontrolgrouping.findByIdAndUpdate(id, req.body);

  if (!udesignationandcontrolgrouping) {
    return next(new ErrorHandler("Designationandcontrolgrouping not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Designationandcontrolgrouping by id => /api/Designationandcontrolgrouping/:id
exports.deleteDesignationandcontrolgrouping = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let ddesignationandcontrolgrouping = await Designationandcontrolgrouping.findByIdAndRemove(id);

  if (!ddesignationandcontrolgrouping) {
    return next(new ErrorHandler("Designationandcontrolgrouping not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAllControlNamesBasedOnHierarchy = catchAsyncErrors(async (req, res, next) => {
  let controlnames;
  try {
    controlnames = await Designationandcontrolgrouping.aggregate([
      {
        $match: {
          "designationgroupname": req.body.designation
        }
      },{
        $project:{
          controlname:1,
          _id:1,
          designationgroupname:1,
        }
      }
    ])


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({

    controlnames,
  });
});