const Categoryprocessmap = require("../../../model/modules/production/categoryprocessmap");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Categoryprocessmap => /api/Categoryprocessmap
exports.getAllCategoryprocessmap = catchAsyncErrors(async (req, res, next) => {
  let categoryprocessmaps;
  try {
    categoryprocessmaps = await Categoryprocessmap.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!categoryprocessmaps) {
    return next(new ErrorHandler("Categoryprocessmap not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    categoryprocessmaps,
  });
});

// get All Categoryprocessmap => /api/Categoryprocessmap
exports.getAllcategoryprocessmapslimited = catchAsyncErrors(async (req, res, next) => {
  let categoryprocessmaps;
  try {
    categoryprocessmaps = await Categoryprocessmap.find({},{company:1, branch:1, categoryname:1,process:1,project:1, processtypes:1});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!categoryprocessmaps) {
    return next(new ErrorHandler("Categoryprocessmap not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    categoryprocessmaps,
  });
});

// Create new Categoryprocessmap => /api/Categoryprocessmap/new
exports.addCategoryprocessmap = catchAsyncErrors(async (req, res, next) => {
  let aCategoryprocessmap = await Categoryprocessmap.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Categoryprocessmap => /api/Categoryprocessmap/:id
exports.getSingleCategoryprocessmap = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;

    let scategoryprocessmap = await Categoryprocessmap.findById(id);

    if (!scategoryprocessmap) {
      return next(new ErrorHandler("Categoryprocessmap not found!", 404));
    }
    return res.status(200).json({
      scategoryprocessmap,
    });
  }
);

// update Categoryprocessmap by id => /api/Categoryprocessmap/:id
exports.updateCategoryprocessmap = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ucategoryprocessmap = await Categoryprocessmap.findByIdAndUpdate(
    id,
    req.body
  );
  if (!ucategoryprocessmap) {
    return next(new ErrorHandler("Categoryprocessmap not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Categoryprocessmap by id => /api/Categoryprocessmap/:id

exports.deleteCategoryprocessmap = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dcategoryprocessmap = await Categoryprocessmap.findByIdAndRemove(id);

  if (!dcategoryprocessmap) {
    return next(new ErrorHandler("Categoryprocessmap not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.deleteMultipleCategoryprocessmap = catchAsyncErrors(
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
      await Categoryprocessmap.deleteMany({ _id: { $in: batchIds } });
    }

    return res
      .status(200)
      .json({ message: "Deleted successfully", success: true });
  }
);

exports.categoryprocessmapSort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalPages, currentPage;

  const { page, pageSize } = req.body;
  try {

      totalProjects = await Categoryprocessmap.countDocuments();

      result = await Categoryprocessmap.find()
          .skip((page - 1) * pageSize)
          .limit(parseInt(pageSize));

  } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
      totalProjects,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
  });
});

exports.getAllCategoryprocessmapAssignBranch = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;
  
  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
    }))
  };

  
  let categoryprocessmaps;
  try {
    categoryprocessmaps = await Categoryprocessmap.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!categoryprocessmaps) {
    return next(new ErrorHandler("Categoryprocessmap not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    categoryprocessmaps,
  });
});