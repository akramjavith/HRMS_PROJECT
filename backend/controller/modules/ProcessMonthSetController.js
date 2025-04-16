const ProcessMonthSet = require("../../model/modules/ProcessMonthSetModel");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");

// get All ProcessMonthSet Details => /api/processmonthsets

exports.getAllProcessMonthSet = catchAsyncErrors(async (req, res, next) => {
  let processmonthsets;

  try {
    processmonthsets = await ProcessMonthSet.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!processmonthsets) {
    return next(new ErrorHandler("ProcessMonthSet details not found", 404));
  }

  return res.status(200).json({
    processmonthsets,
  });
});

// Create new ProcessMonthSet => /api/processmonthset/new
exports.addProcessMonthSet = catchAsyncErrors(async (req, res, next) => {
  let aprocessmonthset = await ProcessMonthSet.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ProcessMonthSet => /api/processmonthset/:id

exports.getSingleProcessMonthSet = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sprocessmonthset = await ProcessMonthSet.findById(id);

  if (!sprocessmonthset) {
    return next(new ErrorHandler("ProcessMonthSet not found", 404));
  }

  return res.status(200).json({
    sprocessmonthset,
  });
});

// update ProcessMonthSet by id => /api/processmonthset/:id

exports.updateProcessMonthSet = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uprocessmonthset = await ProcessMonthSet.findByIdAndUpdate(id, req.body);

  if (!uprocessmonthset) {
    return next(new ErrorHandler("ProcessMonthSet Details not found", 404));
  }

  return res.status(200).json({ message: "Updates successfully" });
});

// delete ProcessMonthSet by id => /api/processmonthset/:id
exports.deleteProcessMonthSet = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dprocessmonthset = await ProcessMonthSet.findByIdAndRemove(id);
  if (!dprocessmonthset) {
    return next(new ErrorHandler("ProcessMonthSet Month Set not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
exports.getAllProcessmonthByPagination = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, searchQuery } = req.body;

  let processmonthsets;
  let totalDatas, paginatedData, isEmptyData, result;

  try {
    const anse = await ProcessMonthSet.find()
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    const filteredDatas = anse?.filter((item, index) => {
      const itemString = JSON.stringify(item)?.toLowerCase();
      return searchOverTerms.every((term) => itemString.includes(term));
    })
    isEmptyData = searchOverTerms?.every(item => item.trim() === '');
    const pageSized = parseInt(pageSize);
    const pageNumberd = parseInt(page);

    paginatedData = filteredDatas.slice((pageNumberd - 1) * pageSized, pageNumberd * pageSize);

    totalDatas = await ProcessMonthSet.countDocuments();
    processmonthsets = await ProcessMonthSet.find().skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    result = isEmptyData ? processmonthsets : paginatedData
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!processmonthsets) {
    return next(new ErrorHandler("ProcessMonthSet details not found", 404));
  }

  return res.status(200).json({
    processmonthsets,
    totalDatas,
    paginatedData,
    result,
    currentPage: (isEmptyData ? page : 1),
    totalPages: Math.ceil((isEmptyData ? totalDatas : paginatedData?.length) / pageSize),
  });
});