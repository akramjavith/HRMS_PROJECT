const DepartmentMonth = require("../../model/modules/departmentmonthset");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");

// get All DepartmentMonth Details => /api/Departments

exports.getAllDepartmentmonth = catchAsyncErrors(async (req, res, next) => {
  let departmentdetails;

  try {
    departmentdetails = await DepartmentMonth.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!departmentdetails) {
    return next(new ErrorHandler("DepartmentMonth details not found", 404));
  }

  return res.status(200).json({
    departmentdetails,
  });
});
exports.getAllDepartmentmonthLimitedForLeave = catchAsyncErrors(async (req, res, next) => {
  let departmentdetails;

  try {
    departmentdetails = await DepartmentMonth.find({ department: req.body.empdepartment, year: req.body.year });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!departmentdetails) {
    return next(new ErrorHandler("DepartmentMonth details not found", 404));
  }

  return res.status(200).json({
    departmentdetails,
  });
});

exports.getAllDepartmentmonthLimited = catchAsyncErrors(async (req, res, next) => {
  let departmentdetails;

  try {
    departmentdetails = await DepartmentMonth.find({monthname:req.body.monthname, year:req.body.year},{department:1, fromdate:1, todate:1, salary:1,proftaxstop:1
      ,penalty:1,esistop:1, pfstop:1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!departmentdetails) {
    return next(new ErrorHandler("DepartmentMonth details not found", 404));
  }

  return res.status(200).json({
    departmentdetails,
  });
});

// get All DepartmentMonth Details => /api/Departments
exports.getAllDepartmentmonthProdLimited = catchAsyncErrors(async (req, res, next) => {
  let departmentdetails;
  try {
    const { date } = req.body;
    // departmentdetails = await DepartmentMonth.find({fromdate: { $gte: date },  todate: { $lte: date }}, { fromdate: 1, todate: 1, monthname: 1, department: 1 });
    departmentdetails = await DepartmentMonth.aggregate([
      {
          $addFields: {
              fromdate: { $toDate: "$fromdate" }, // Convert fromdate to Date format
              todate: { $toDate: "$todate" } // Convert todate to Date format
          }
      },
      {
          $match: {
              fromdate: { $lte: new Date(date) }, // Compare fromdate
              todate: { $gte: new Date(date) } // Compare todate
          }
      },
      {
          $project: {
              fromdate: 1,
              todate: 1,
              monthname: 1,
              department: 1
          }
      }
  ]);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!departmentdetails) {
    return next(new ErrorHandler("DepartmentMonth details not found", 404));
  }
  return res.status(200).json({
    departmentdetails,
  });
});

// Create new DepartmentMonth => /api/department/new
exports.addDepartmentDetailsmonth = catchAsyncErrors(async (req, res, next) => {
  let adepartmentdetails = await DepartmentMonth.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle DepartmentMonth => /api/department/:id

exports.getSingleDepartmentDetailsmonth = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sdepartmentdetails = await DepartmentMonth.findById(id);

  if (!sdepartmentdetails) {
    return next(new ErrorHandler("DepartmentMonth not found", 404));
  }

  return res.status(200).json({
    sdepartmentdetails,
  });
});

// update DepartmentMonth by id => /api/customer/:id

exports.updateDepartmentDetailsmonth = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let updepartmentdetails = await DepartmentMonth.findByIdAndUpdate(id, req.body);

  if (!updepartmentdetails) {
    return next(new ErrorHandler("DepartmentMonth Details not found", 404));
  }

  return res.status(200).json({ message: "Updates successfully" });
});

// delete DepartmentMonth by id => /api/customer/:id

// exports.deleteDepartmentDetailsmonth = catchAsyncErrors(async (req, res, next) => {
//     const id = req.params.id;
//     let ddepartmentdetails = await DepartmentMonth.findByIdAndRemove(id);

//     if (!ddepartmentdetails) {
//         return next(new ErrorHandler('DepartmentMonth Details not found', 404));
//     }

//     return res.status(200).json({ message: 'Deleted successfully' });
// })

exports.deleteDepartmentDetailsmonth = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ddepartmentdetails = await DepartmentMonth.findByIdAndRemove(id);
  if (!ddepartmentdetails) {
    return next(new ErrorHandler("DepartmentMonth Month Set not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
exports.getAllDepartmentmonthByPagination = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, searchQuery } = req.body;

  let departmentdetails;
  let totalDatas, paginatedData, isEmptyData, result;

  try {
    const anse = await DepartmentMonth.find()
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    const filteredDatas = anse?.filter((item, index) => {
      const itemString = JSON.stringify(item)?.toLowerCase();
      return searchOverTerms.every((term) => itemString.includes(term));
    })
    isEmptyData = searchOverTerms?.every(item => item.trim() === '');
    const pageSized = parseInt(pageSize);
    const pageNumberd = parseInt(page);

    paginatedData = filteredDatas.slice((pageNumberd - 1) * pageSized, pageNumberd * pageSize);

    totalDatas = await DepartmentMonth.countDocuments();
    departmentdetails = await DepartmentMonth.find().skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    result = isEmptyData ? departmentdetails : paginatedData
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!departmentdetails) {
    return next(new ErrorHandler("DepartmentMonth details not found", 404));
  }

  return res.status(200).json({
    departmentdetails,
    totalDatas,
    paginatedData,
    result,
    currentPage: (isEmptyData ? page : 1),
    totalPages: Math.ceil((isEmptyData ? totalDatas : paginatedData?.length) / pageSize),
  });
});