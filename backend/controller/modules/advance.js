
const Advance = require("../../model/modules/advance");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");

// get All Advance => /api/  
exports.getAllAdvance = catchAsyncErrors(async (req, res, next) => {
  let advance;
  try {
    advance = await Advance.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!advance) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    advance,
  });
});

// Create new Advance=> /api/Advance/new
exports.addAdvance = catchAsyncErrors(async (req, res, next) => {

  let aadvance = await Advance.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Advance => /api/Advance/:id
exports.getSingleAdvance = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sadvance = await Advance.findById(id);

  if (!sadvance) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sadvance,
  });
});

// update Advance by id => /api/Advance/:id
exports.updateAdvance = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uadvance = await Advance.findByIdAndUpdate(id, req.body);
  if (!uadvance) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Advance by id => /api/Advance/:id
exports.deleteAdvance = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dadvance = await Advance.findByIdAndRemove(id);

  if (!dadvance) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
exports.getAllAdvanceByAssignBranch = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;

  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
      unit: item.unit
    }))
  };
  let advance;
  try {
    advance = await Advance.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!advance) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    advance,
  });
});



exports.getAllAdvanceByAssignBranchHome = catchAsyncErrors(async (req, res, next) => {

  let advance;
  try {
    advance = await Advance.countDocuments({ status: "Applied" }, {});
    // console.log(advance, "advan")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!advance) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    advance,
  });
});


exports.getAllAdvanceByAssignBranchHomeList = catchAsyncErrors(async (req, res, next) => {


  let advance;
  try {

    const { assignbranch } = req.body;

    // console.log(req.body)
    let filterQuery = {};
    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));


    filterQuery = { $or: branchFilter };

    filterQuery.status = "Applied"
    // console.log(filterQuery)

    advance = await Advance.find(filterQuery);
    // console.log(advance.length, "advan")
  } catch (err) {
    // console.log(err)
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!advance) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    advance,
  });
});



