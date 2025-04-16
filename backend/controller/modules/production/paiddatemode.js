const Paiddatemode = require("../../../model/modules/production/paiddatemode");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Paiddatefix = require("../../../model/modules/production/paiddatefix");

// get All Paiddatemode => /api/Paiddatemode
exports.getAllPaiddatemode = catchAsyncErrors(async (req, res, next) => {
  let paiddatemodes;
  try {
    paiddatemodes = await Paiddatemode.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!paiddatemodes) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    paiddatemodes,
  });
});
exports.getXeoxFilterPaiddatemode = catchAsyncErrors(async (req, res, next) => {
  let paiddatemodes;
  try {
    paiddatemodes = await Paiddatemode.find({
      paymode:{
        $in: req.body.paymode
      },
      department:{
        $in: req.body.department
      },
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!paiddatemodes) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    paiddatemodes,
  });
});


// Create new Paiddatemode => /api/Paiddatemode/new
exports.addPaiddatemode = catchAsyncErrors(async (req, res, next) => {
  let aPaiddatemode = await Paiddatemode.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Paiddatemode => /api/Paiddatemode/:id
exports.getSinglePaiddatemode = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let spaiddatemode = await Paiddatemode.findById(id);

  if (!spaiddatemode) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    spaiddatemode,
  });
});

// update Paiddatemode by id => /api/Paiddatemode/:id
exports.updatePaiddatemode = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let upaiddatemode = await Paiddatemode.findByIdAndUpdate(id, req.body);
  if (!upaiddatemode) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Paiddatemode by id => /api/Paiddatemode/:id
exports.deletePaiddatemode = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dpaiddatemode = await Paiddatemode.findByIdAndRemove(id);

  if (!dpaiddatemode) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

// get overall delete functionlity 
exports.getAllPaiddatefixCheck = catchAsyncErrors(async (req, res, next) => {
  let paiddatefixs;

  try {
    let query = {
      department: {$in: req.body.checkpaiddatefixdepartment},
      paymode: req.body.checkpaiddatefixpaymode,
    };

    paiddatefixs = await Paiddatefix.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!paiddatefixs) {
    return next(new ErrorHandler("Paiddatefix not found!", 404));
  }
  return res.status(200).json({
    paiddatefixs, 
  });
});


// get All Paiddate fix  =>overall edit 
exports.getOverAllEditPaiddatefix = catchAsyncErrors(async (req, res, next) => {
  let paiddatefixs;
  try {

    paiddatefixs = await Paiddatefix.find({ 
      department: { $in: req.body.oldname }, 
      paymode: req.body.oldname2 
    });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  } 

  if (!paiddatefixs) {
    return next(new ErrorHandler("Data not found", 404));
  }
  return res.status(200).json({
    count: paiddatefixs.length ,
    paiddatefixs,
  });
});
