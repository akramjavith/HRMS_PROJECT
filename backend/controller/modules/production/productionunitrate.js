const Unitrate = require("../../../model/modules/production/productionunitrate");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const QueueTypeMaster = require('../../../model/modules/production/queuetypemaster');


// get All unitsrate => /api/unitsrate
exports.getAllUnitrate = catchAsyncErrors(async (req, res, next) => {
  let unitsrate;
  try {
    //   unitsrate = await Unitrate.aggregate([
    //     {
    //         $group: {
    //             _id: {
    //                 category: "$category",
    //                 subcategory: "$subcategory"
    //             },
    //            doc: { $first: "$$ROOT" }
    //        }
    //    },
    //    {
    //         $replaceRoot: { newRoot: "$doc" }
    //     },
    //     {
    //       $project: {
    //          _id: 1, 
    //          category: 1, 
    //         subcategory: 1,
    //          mrate: 1, 
    //         trate: 1, 
    //         flagcount: 1, 
    //        flagstatus: 1,
    //         points: 1,
    //        project: 1, 
    //        conversion: 1, 
    //        orate: 1, 

    //   }
    //]);
    unitsrate = await Unitrate.find({}, {
      category: 1,
      subcategory: 1,
      mrate: 1,
      trate: 1,
      flagcount: 1,
      flagstatus: 1,
      points: 1,
      project: 1,
      conversion: 1,
      orate: 1,
    });



  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!unitsrate) {
    return next(new ErrorHandler("Unitrate not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    unitsrate,
  });
});
exports.unitrateSort = catchAsyncErrors(async (req, res, next) => {
  const { page = 1, pageSize = 10 } = req.body;  // Default values for page and pageSize
  let totalProjects, result, totalPages, currentPage;

  try {
    // Step 1: Aggregate the unitrate documents
    const aggregatedUnitsrate = await Unitrate.aggregate([
      {
        $group: {
          _id: {
            category: "$category",
            subcategory: "$subcategory"
          },
          doc: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" }
      },
      {
        $project: {
          _id: 1,
          project: 1,
          category: 1, // Include the category field
          subcategory: 1, // Include the subcategory field
          mrate: 1, // Include the mrate field
          flagcount: 1, // Include the flagcount field
          // Add other fields you want to include here
        }
      }
    ]);

    // Step 2: Count total documents after aggregation
    totalProjects = aggregatedUnitsrate.length;

    // Step 3: Implement pagination
    currentPage = parseInt(page, 10);
    totalPages = Math.ceil(totalProjects / pageSize);
    result = aggregatedUnitsrate.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return res.status(500).json({ error: err.message });
  }

  return res.status(200).json({
    totalProjects,
    result,
    currentPage,
    totalPages,
  });
});
// get All unitsrate => /api/unitsrate
// get All unitsrate => /api/unitsrate
exports.getprodunitrategetmulti = catchAsyncErrors(async (req, res, next) => {
  let unitsrate;
  try {
    // Create the $or query array
    const orQuery = req.body.uniqueItems;
    unitsrate = await Unitrate.find({ $or: orQuery }, { _id: 1, mrate: 1, category: 1, subcategory: 1 })
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!unitsrate) {
    return next(new ErrorHandler("Unitrate not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    unitsrate,
  });
});

// get All unitsrate => /api/unitsrate
exports.getProductionUnitrateProUploadLimited = catchAsyncErrors(async (req, res, next) => {
  let unitsrate;
  try {
    unitsrate = await Unitrate.aggregate([
      {
        $group: {
          _id: {
            category: "$category",
            subcategory: "$subcategory"
          },
          doc: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" }
      },
      {
        $project: {
          _id: 1,
          category: 1,
          subcategory: 1,
          mrate: 1,
          trate: 1,
          flagcount: 1,
          orate: 1,
          project: 1,
          updatedby: 1,
          flagstatus: 1,
          oratelog: 1
        }
      }
    ]);

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!unitsrate) {
    return next(new ErrorHandler("Unitrate not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    unitsrate,
  });
});


// get All unitsrate => /api/unitsrate
exports.getAllUnitrateProdLimited = catchAsyncErrors(async (req, res, next) => {
  let unitsrate;
  try {
    unitsrate = await Unitrate.aggregate([
      {
        $group: {
          _id: {
            category: "$category",
            subcategory: "$subcategory"
          },
          doc: { $first: "$$ROOT" }
        }
      },
      {
        $replaceRoot: { newRoot: "$doc" }
      },
      {
        $project: {
          _id: 1,
          project: 1,
          category: 1, // Include the category field
          subcategory: 1, // Include the subcategory field
          mrate: 1, // Include the subcategory field
          flagcount: 1, // Include the subcategory field
          // Add other fields you want to include here
        }
      }
    ]);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!unitsrate) {
    return next(new ErrorHandler("Unitrate not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    unitsrate,
  });
});

// Create new unitsrate=> /api/unitsrate/new
exports.addUnitrate = catchAsyncErrors(async (req, res, next) => {
  let aunitsrate = await Unitrate.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle unitsrate => /api/unitsrate/:id
exports.getSingleUnitrate = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sunitsrate = await Unitrate.findById(id);

  if (!sunitsrate) {
    return next(new ErrorHandler("Unitrate not found!", 404));
  }
  return res.status(200).json({
    sunitsrate,
  });
});

// update unitsrate by id => /api/unitsrate/:id
exports.updateUnitrate = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uunitsrate = await Unitrate.findByIdAndUpdate(id, req.body);
  if (!uunitsrate) {
    return next(new ErrorHandler("Unitrate not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete unitsrate by id => /api/unitsrate/:id
exports.deleteUnitrate = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dunitsrate = await Unitrate.findByIdAndRemove(id);

  if (!dunitsrate) {
    return next(new ErrorHandler("Unitrate not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

// get All unitsrate => /api/unitsrate
exports.unitrateFilterLimited = catchAsyncErrors(async (req, res, next) => {
  let unitsrate;
  try {
    unitsrate = await Unitrate.find({ category: req.body.category, subcategory: req.body.subcategory }, { flagcount: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!unitsrate) {
    return next(new ErrorHandler("Unitrate not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    unitsrate,
  });
});
// get All unitsrate => /api/unitsrate
exports.unitrateFilterCategoryLimited = catchAsyncErrors(async (req, res, next) => {
  let unitsrate;
  try {
    unitsrate = await Unitrate.find({ category: req.body.category }, { category: 1, subcategory: 1, flagcount: 1, mrate: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!unitsrate) {
    return next(new ErrorHandler("Unitrate not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    unitsrate,
  });
});
// get All unitsrate => /api/unitsrate
exports.unitrateFilterCategoriesLimited = catchAsyncErrors(async (req, res, next) => {
  let unitsrate;
  try {
    unitsrate = await Unitrate.find({ category: { $in: req.body.category } }, { category: 1, project: 1, subcategory: 1, flagcount: 1, mrate: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!unitsrate) {
    return next(new ErrorHandler("Unitrate not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    unitsrate,
  });
});
// get All unitsrate => /api/unitsrate
exports.checkUnitrateForManualCreation = catchAsyncErrors(async (req, res, next) => {
  let unitsrate;
  try {
    const { project, category, subcategory } = req.body;
    // unitsrate = await Unitrate.countDocuments({ project: project, category: category, subcategory: subcategory }, {});

    unitsrate = await Unitrate.countDocuments({
      project: project,
      category: category,
      subcategory: new RegExp(`^${subcategory}`, "i"),
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    unitsrate,
  });
});


// get All subcategoryprod => /api/subcategoryprod
exports.checkUnitRateForProdUpload = catchAsyncErrors(async (req, res, next) => {
  let unitsrate;
  try {
    const { project, subs } = req.body;
    // Construct the query to use $and for each sub
    const query = {
      project,
      $or: subs.map(sub => ({
        category: sub.filename,
        subcategory: sub.Category
      }))
    };

    unitsrate = await Unitrate.find(query);
  } catch (err) {
    console.log(err.message);
  }

  return res.status(200).json({
    // count: products.length,
    unitsrate,
  });
});





exports.getAllUnitrateOrateCategory = catchAsyncErrors(async (req, res, next) => {
  let unitsrate;
  try {
    unitsrate = await Unitrate.find({
      project: req.body.project,
      category: req.body.category,

      //  $and: [
      //      { orate: { $ne: 0 } },
      //      { orate: { $ne: "" } },
      //      { orate: { $ne: "0" } },
      //      { orate: { $ne: "0.000" } },
      //      { orate: { $ne: "0.0000" } },
      //       // ],
      //      // $and: [
      //      { mrate: { $ne: 0 } },
      //      { mrate: { $ne: "" } },
      //      { mrate: { $ne: "0" } },
      ////      { mrate: { $ne: "0.000" } },
      //     { mrate: { $ne: "0.0000" } }
      //    ]
    }, {
      orate: 1, _id: 0, mrate: 1

    });

    // console.log(unitsrate, "unitsrate")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    unitsrate,
  });
});


exports.getAllUnitrateOrateSubCategory = catchAsyncErrors(async (req, res, next) => {
  let unitsrate, queuetypemaster;
  try {

    let query = {
      project: req.body.project,
      category: req.body.category
    }

    if (req.body.type.includes("Other task queues")) {

      query.mrate = { $in: req.body.orate.includes("0") || req.body.orate.includes(0) ? [...req.body.orate, "0.000", "", "0.00",] : req.body.orate }
    } else {
      query.orate = { $in: req.body.orate.includes("0") || req.body.orate.includes(0) ? [...req.body.orate, "0.000", "", "0.00"] : req.body.orate }

    }

    let unitsrateall = await Unitrate.find(query, {
      subcategory: 1,
      orate: 1,
      mrate: 1
    });

    queuetypemaster = await QueueTypeMaster.find({
      vendor: req.body.project,
      type: { $in: req.body.type },
      category: req.body.category
    }, { subcategory: 1, _id: 0 })

    const excludedSubCategories = queuetypemaster.map((item) => item.subcategory);

    unitsrate = unitsrateall.filter(
      (item) => !excludedSubCategories.includes(item.subcategory)
    );

    // console.log(unitsrate, "unitratesub")
  } catch (err) {
    console.log(err, "subuni")
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    // count: products.length,
    unitsrate,
  });
});