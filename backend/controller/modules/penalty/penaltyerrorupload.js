const PenaltyErrorUploadpoints = require("../../../model/modules/penalty/penaltyerrorupload");
const BulkErrorUploadpoints = require("../../../model/modules/penalty/bulkerrorupload");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");


exports.getAllPenaltyerroruploadpointsduplicatewithbulkerrorupload = catchAsyncErrors(async (req, res, next) => {
  let penaltyerroruploadpoints;
  try {
    const { projectvendor, process, loginid, dateformatted, errorfilename, documentnumber, documenttype, fieldname, line, errorvalue, correctvalue } = req.body;
    let query = {
      projectvendor: projectvendor,
      process: process,
      loginid: loginid,
      date: dateformatted,
      errorfilename: errorfilename,
      documentnumber: documentnumber,
      documenttype: documenttype,
      fieldname: fieldname,
      line: line,
      errorvalue: errorvalue,
      correctvalue: correctvalue
    }
    penaltyerroruploadpoints = await PenaltyErrorUploadpoints.countDocuments(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    penaltyerroruploadpoints,
  });
});

exports.getAllPenaltyerroruploadpointsduplicatewithbulkerroruploadFile = catchAsyncErrors(async (req, res, next) => {
  let penaltyerroruploadpoints;
  try {
    const { fromdate, todate } = req.body;


    const penaltyerroruploadpointsall = await PenaltyErrorUploadpoints.find(
      {
        // date: { $lte: fromdate, $gte: todate }
      }, {
      projectvendor: 1, process: 1, loginid: 1, date: 1, errorfilename: 1,
      documentnumber: 1, documenttype: 1, fieldname: 1, line: 1, errorvalue: 1, correctvalue: 1
    });


    const getKey = (item) =>
      `${item.projectvendor}-${item.process}-${item.loginid}-${item.date}-${item.errorfilename}-${item.documentnumber}-${item.documenttype}-${item.fieldname}-${item.line}-${item.errorvalue}-${item.correctvalue}`;

    // 2. Create Set of keys from DB results
    const existingKeys = new Set(penaltyerroruploadpointsall.map(getKey));

    return res.status(200).json({
      // count: products.length,
      penaltyerroruploadpoints: [...existingKeys],
    });


  } catch (err) {
    console.log(err, "erress")
    return next(new ErrorHandler("Records not found!", 404));
  }


});


//bulkerror upload
exports.getAllBulkerroruploadpointsduplicatewithbulkerrorupload = catchAsyncErrors(async (req, res, next) => {
  let penaltyerroruploadpoints;
  try {
    const { projectvendor, process, loginid, dateformatted, errorfilename, documentnumber, documenttype, fieldname, line, errorvalue, correctvalue } = req.body;
    let query = {
      projectvendor: projectvendor,
      process: process,
      loginid: loginid,
      date: dateformatted,
      errorfilename: errorfilename,
      documentnumber: documentnumber,
      documenttype: documenttype,
      fieldname: fieldname,
      line: line,
      errorvalue: errorvalue,
      correctvalue: correctvalue
    }
    penaltyerroruploadpoints = await BulkErrorUploadpoints.countDocuments(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    penaltyerroruploadpoints,
  });
});

exports.getAllBulkerroruploadpointsduplicatewithbulkerroruploadFile = catchAsyncErrors(async (req, res, next) => {
  let penaltyerroruploadpoints;
  try {
    const { fromdate, todate } = req.body;


    const penaltyerroruploadpointsall = await BulkErrorUploadpoints.find(
      {
        // date: { $lte: fromdate, $gte: todate }
      }, {
      projectvendor: 1, process: 1, loginid: 1, date: 1, errorfilename: 1,
      documentnumber: 1, documenttype: 1, fieldname: 1, line: 1, errorvalue: 1, correctvalue: 1, dateformatted: 1
    });


    const getKey = (item) =>
      `${item.projectvendor}-${item.process}-${item.loginid}-${item.mode == "Bulkupload" ? item.dateformatted : item.date}-${item.errorfilename}-${item.documentnumber}-${item.documenttype}-${item.fieldname}-${item.line}-${item.errorvalue}-${item.correctvalue}`;

    // 2. Create Set of keys from DB results
    const existingKeys = new Set(penaltyerroruploadpointsall.map(getKey));

    return res.status(200).json({
      // count: products.length,
      penaltyerroruploadpoints: [...existingKeys],
    });


  } catch (err) {
    console.log(err, "erress")
    return next(new ErrorHandler("Records not found!", 404));
  }


});


// get All PenaltyErrorUploadpoints => /api/PenaltyErrorUploadpoints
exports.getAllPenaltyerroruploadpoints = catchAsyncErrors(async (req, res, next) => {
  let penaltyerroruploadpoints;
  try {
    penaltyerroruploadpoints = await PenaltyErrorUploadpoints.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!penaltyerroruploadpoints) {
    return next(new ErrorHandler("PenaltyErrorUploadpoints not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    penaltyerroruploadpoints,
  });
});

// Create new PenaltyErrorUploadpoints=> /api/PenaltyErrorUploadpoints/new
exports.addPenaltyerroruploadpoints = catchAsyncErrors(async (req, res, next) => {
  let apenaltyerroruploadpoints = await PenaltyErrorUploadpoints.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle penaltyerroruploadpoints => /api/penaltyerroruploadpoints/:id
exports.getSinglePenaltyerroruploadpoints = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let spenaltyerroruploadpoints = await PenaltyErrorUploadpoints.findById(id);

  if (!spenaltyerroruploadpoints) {
    return next(new ErrorHandler("PenaltyErrorUploadpoints not found!", 404));
  }
  return res.status(200).json({
    spenaltyerroruploadpoints,
  });
});

// update penaltyerroruploadpoints by id => /api/penaltyerroruploadpoints/:id
exports.updatePenaltyerroruploadpoints = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let upenaltyerroruploadpoints = await PenaltyErrorUploadpoints.findByIdAndUpdate(id, req.body);
  if (!upenaltyerroruploadpoints) {
    return next(new ErrorHandler("PenaltyErrorUploadpoints not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete penaltyerroruploadpoints by id => /api/penaltyerroruploadpoints/:id
exports.deletePenaltyerroruploadpoints = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dpenaltyerroruploadpoints = await PenaltyErrorUploadpoints.findByIdAndRemove(id);

  if (!dpenaltyerroruploadpoints) {
    return next(new ErrorHandler("PenaltyErrorUploadpoints not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});


exports.deleteMultiplePenaltyErrorUpload = catchAsyncErrors(
  async (req, res, next) => {
    const ids = req.body.ids;
    if (!Array.isArray(ids) || ids.length === 0) {
      return next(new ErrorHandler("Invalid IDs provided", 400));
    }

    // Define a batch size for deletion
    // const batchSize = Math.ceil(ids.length / 10);
    const batchSize = 10000;

    // Loop through IDs in batches
    for (let i = 0; i < ids.length; i += batchSize) {
      const batchIds = ids.slice(i, i + batchSize);

      // Delete records in the current batch
      await PenaltyErrorUploadpoints.deleteMany({ _id: { $in: batchIds } });
    }

    return res
      .status(200)
      .json({ message: "Deleted successfully", success: true });
  }
);

exports.getAllPenaltyerroruploadpointsDateFilter = catchAsyncErrors(async (req, res, next) => {
  const { fromdate, todate } = req.body;
  let penaltyerroruploadpoints;
  try {
    penaltyerroruploadpoints = await PenaltyErrorUploadpoints.find({ date: { $gte: fromdate, $lte: todate } }, { fromdate: 1, todate: 1, projectvendor: 1, process: 1, filename: 1, addedby: 1, mode: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!penaltyerroruploadpoints) {
    return next(new ErrorHandler("PenaltyErrorUploadpoints not found!", 404));
  }
  return res.status(200).json({
    penaltyerroruploadpoints,
  });
});

exports.getAllPenaltyerroruploadpointsProjectBasedFilter = catchAsyncErrors(async (req, res, next) => {
  let penaltyerroruploadpoints;
  try {
    const { projectvendor, process, loginid } = req.body;
    let query = {};

    if (projectvendor && projectvendor.length > 0) {
      query.projectvendor = { $in: projectvendor };
    }

    if (process && process.length > 0) {
      query.process = { $in: process };
    }

    if (loginid && loginid.length > 0) {
      query.loginid = { $in: loginid };
    }

    penaltyerroruploadpoints = await PenaltyErrorUploadpoints.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!penaltyerroruploadpoints) {
    return next(new ErrorHandler('Ebreadingdetails not found!', 404));
  }
  return res.status(200).json({
    penaltyerroruploadpoints
  });
})

exports.PenaltyErrorUploadSort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalProjectsAllData;

  const { page, pageSize, allFilters, logicOperator, searchQuery, projectvendor, process, loginid } = req.body;

  try {

    let query = {};

    if (projectvendor && projectvendor.length > 0) {
      query.projectvendor = { $in: projectvendor };
    }

    if (process && process.length > 0) {
      query.process = { $in: process };
    }

    if (loginid && loginid.length > 0) {
      query.loginid = { $in: loginid };
    }

    const conditions = [];

    // Advanced search filter
    if (allFilters && allFilters.length > 0) {
      allFilters.forEach(filter => {
        if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
          conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
        }
      });
    }

    if (searchQuery && searchQuery !== undefined) {
      const searchTermsArray = searchQuery.split(" ");
      const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

      const orConditions = regexTerms.map((regex) => ({
        $or: [
          { projectvendor: regex },
          { process: regex },
          { loginid: regex },
          // { date: regex },
          { errorfilename: regex },
          { documentnumber: regex },
          { documenttype: regex },
          { fieldname: regex },
          { line: regex },
          { errorvalue: regex },
          { correctvalue: regex },
          { link: regex },
          { doclink: regex },
        ],
      }));

      query = {
        $and: [
          query,
          // {
          //     $or: assignbranch.map(item => ({
          //         company: item.company,
          //         branch: item.branch,
          //     }))
          // },
          ...orConditions,
        ],
      };
    }

    // Apply logicOperator to combine conditions
    if (conditions.length > 0) {
      if (logicOperator === "AND") {
        query.$and = conditions;
      } else if (logicOperator === "OR") {
        query.$or = conditions;
      }
    }

    // const branchFilters = assignbranch?.map(branchObj => ({
    //     company: branchObj.company,
    //     branch: branchObj.branch,
    // }));

    const combinedFilter = {
      $and: [
        query,
        // { $or: branchFilters },
      ],
    };

    totalProjects = await PenaltyErrorUploadpoints.countDocuments(combinedFilter);
    totalProjectsAllData = await PenaltyErrorUploadpoints.find(combinedFilter, { projectvendor: 1, process: 1, loginid: 1, date: 1, errorfilename: 1, documentnumber: 1, documenttype: 1, fieldname: 1, line: 1, errorvalue: 1, correctvalue: 1, link: 1, doclink: 1 }).lean();

    result = await PenaltyErrorUploadpoints.find(combinedFilter, { projectvendor: 1, process: 1, loginid: 1, date: 1, errorfilename: 1, documentnumber: 1, documenttype: 1, fieldname: 1, line: 1, errorvalue: 1, correctvalue: 1, link: 1, doclink: 1 }).lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    totalProjects,
    result,
    totalProjectsAllData,
    currentPage: page,
    totalPages: Math.ceil(totalProjects / pageSize),
  });
});

function createFilterCondition(column, condition, value) {
  switch (condition) {
    case "Contains":
      return { [column]: new RegExp(value, 'i') };
    case "Does Not Contain":
      return { [column]: { $not: new RegExp(value, 'i') } };
    case "Equals":
      return { [column]: value };
    case "Does Not Equal":
      return { [column]: { $ne: value } };
    case "Begins With":
      return { [column]: new RegExp(`^${value}`, 'i') };
    case "Ends With":
      return { [column]: new RegExp(`${value}$`, 'i') };
    case "Blank":
      return { [column]: { $exists: false } };
    case "Not Blank":
      return { [column]: { $exists: true } };
    default:
      return {};
  }
}
