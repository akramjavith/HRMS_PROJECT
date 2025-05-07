const DesignationMonthSet = require("../../model/modules/DesignationMonthSetModel");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");

// get All DesignationMonthSet Details => /api/designationmonthsets

exports.getAllDesignationMonthSet = catchAsyncErrors(async (req, res, next) => {
  let designationmonthsets;

  try {
    designationmonthsets = await DesignationMonthSet.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!designationmonthsets) {
    return next(new ErrorHandler("DesignationMonthSet details not found", 404));
  }

  return res.status(200).json({
    designationmonthsets,
  });
});

// Create new DesignationMonthSet => /api/designationmonthset/new
exports.addDesignationMonthSet = catchAsyncErrors(async (req, res, next) => {
  let adesignationmonthset = await DesignationMonthSet.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle DesignationMonthSet => /api/designationmonthset/:id

exports.getSingleDesignationMonthSet = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sdesignationmonthset = await DesignationMonthSet.findById(id);

  if (!sdesignationmonthset) {
    return next(new ErrorHandler("DesignationMonthSet not found", 404));
  }

  return res.status(200).json({
    sdesignationmonthset,
  });
});

// update DesignationMonthSet by id => /api/designationmonthset/:id

exports.updateDesignationMonthSet = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let udesignationmonthset = await DesignationMonthSet.findByIdAndUpdate(id, req.body);

  if (!udesignationmonthset) {
    return next(new ErrorHandler("DesignationMonthSet Details not found", 404));
  }

  return res.status(200).json({ message: "Updates successfully" });
});

// delete DesignationMonthSet by id => /api/designationmonthset/:id
exports.deleteDesignationMonthSet = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ddesignationmonthset = await DesignationMonthSet.findByIdAndRemove(id);
  if (!ddesignationmonthset) {
    return next(new ErrorHandler("DesignationMonthSet Month Set not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
exports.getAllDesignationmonthByPagination = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, searchQuery } = req.body;

  let designationmonthsets;
  let totalDatas, paginatedData, isEmptyData, result;

  try {
    const anse = await DesignationMonthSet.find()
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    const filteredDatas = anse?.filter((item, index) => {
      const itemString = JSON.stringify(item)?.toLowerCase();
      return searchOverTerms.every((term) => itemString.includes(term));
    })
    isEmptyData = searchOverTerms?.every(item => item.trim() === '');
    const pageSized = parseInt(pageSize);
    const pageNumberd = parseInt(page);

    paginatedData = filteredDatas.slice((pageNumberd - 1) * pageSized, pageNumberd * pageSize);

    totalDatas = await DesignationMonthSet.countDocuments();
    designationmonthsets = await DesignationMonthSet.find().skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    result = isEmptyData ? designationmonthsets : paginatedData
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!designationmonthsets) {
    return next(new ErrorHandler("DesignationMonthSet details not found", 404));
  }

  return res.status(200).json({
    designationmonthsets,
    totalDatas,
    paginatedData,
    result,
    currentPage: (isEmptyData ? page : 1),
    totalPages: Math.ceil((isEmptyData ? totalDatas : paginatedData?.length) / pageSize),
  });
});