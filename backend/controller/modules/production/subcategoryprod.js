const SubCategoryprod = require("../../../model/modules/production/subcategoryprodmodel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All subcategoryprod => /api/subcategoryprod
exports.getAllSubCategoryprod = catchAsyncErrors(async (req, res, next) => {
  let subcategoryprod;
  try {
    subcategoryprod = await SubCategoryprod.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!subcategoryprod) {
    return next(new ErrorHandler("SubCategoryprod not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    subcategoryprod,
  });
});

// get All subcategoryprod => /api/subcategoryprod
exports.subCategoryProdLimitedUnallot = catchAsyncErrors(async (req, res, next) => {
  let subcategoryprod;
  try {
    subcategoryprod = await SubCategoryprod.find({ project: { $in: req.body.project }, categoryname: { $in: req.body.category } }, { name: 1, _id: 0 });
  } catch (err) {
    console.log(err.message);
  }
  if (!subcategoryprod) {
    return next(new ErrorHandler("SubCategoryprod not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    subcategoryprod,
  });
});

// get All subcategoryprod => /api/subcategoryprod
exports.subcategoryAllLimitedByProjCate = catchAsyncErrors(async (req, res, next) => {
  let subcategoryprod;
  try {
    const { project, category } = req.body;
    subcategoryprod = await SubCategoryprod.find({ project: project.split("-")[0], categoryname: category }, { name: 1, _id: 0 });
  } catch (err) {
    console.log(err.message);
  }
  if (!subcategoryprod) {
    return next(new ErrorHandler("SubCategoryprod not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    subcategoryprod,
  });
});
// get All subcategoryprod => /api/subcategoryprod
exports.getListSubcaegoryprodLimited = catchAsyncErrors(async (req, res, next) => {
  let subcategoryprod;
  try {
    // subcategoryprod = await SubCategoryprod.find({},{name:1, categoryname:1, project:1, mode:1 });
    subcategoryprod = await SubCategoryprod.aggregate([
      {
        $group: {
          _id: {
            categoryname: "$categoryname",
            name: "$name"
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
          name: 1, categoryname: 1, project: 1, mode: 1
        }
      }
    ]);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!subcategoryprod) {
    return next(new ErrorHandler("SubCategoryprod not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    subcategoryprod,
  });
});
exports.getUnitrateAllSubCategoryprod = catchAsyncErrors(async (req, res, next) => {
  let subcategoryprod;
  try {
    subcategoryprod = await SubCategoryprod.find({ categoryname: req.body.category, project: req.body.project });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!subcategoryprod) {
    return next(new ErrorHandler("SubCategoryprod not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    subcategoryprod,
  });
});

// get All subcategoryprod => /api/subcategoryprod
exports.getAllSubCategoryprodLimited = catchAsyncErrors(async (req, res, next) => {
  let subcategoryprod;
  try {
    subcategoryprod = await SubCategoryprod.find({}, { name: 1, categoryname: 1, project: 1 });
  } catch (err) {
    console.log(err.message);
  }
  if (!subcategoryprod) {
    return next(new ErrorHandler("SubCategoryprod not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    subcategoryprod,
  });
});

// Create new subcategoryprod=> /api/subcategoryprod/new
exports.addSubCategoryprod = catchAsyncErrors(async (req, res, next) => {
  let asubcategoryprod = await SubCategoryprod.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle subcategoryprod => /api/subcategoryprod/:id
exports.getSingleSubCategoryprod = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let ssubcategoryprod = await SubCategoryprod.findById(id);

  if (!ssubcategoryprod) {
    return next(new ErrorHandler("SubCategoryprod not found!", 404));
  }
  return res.status(200).json({
    ssubcategoryprod,
  });
});

// update subcategoryprod by id => /api/subcategoryprod/:id
exports.updateSubCategoryprod = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let usubcategoryprod = await SubCategoryprod.findByIdAndUpdate(id, req.body);
  if (!usubcategoryprod) {
    return next(new ErrorHandler("SubCategoryprod not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete subcategoryprod by id => /api/subcategoryprod/:id
exports.deleteSubCategoryprod = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dsubcategoryprod = await SubCategoryprod.findByIdAndRemove(id);

  if (!dsubcategoryprod) {
    return next(new ErrorHandler("SubCategoryprod not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

// get All subcategoryprod => /api/subcategoryprod
// get All subcategoryprod => /api/subcategoryprod
exports.getListSubcaegoryprodLimitedPagination = catchAsyncErrors(async (req, res, next) => {
  let subcategoryprod;
  try {
    const page = req.body.page || 1; // Get this value from the client request
    const limit = req.body.pageSize || 100; // Set a reasonable limit for the number of documents per page
    const searchTerm = req.body.searchterm; // Get this value from the client request (e.g., from a query parameter)

    // Build the search criteria conditionally
    let searchCriteria = {};
    if (searchTerm) {
      const searchTermsArray = searchTerm.split(" ");
      const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

      // searchCriteria = {
      //   $or: [
      //     { project: { $in: regexTerms } },
      //     { categoryname: { $in: regexTerms } }, // Match any word in categoryname
      //     { name: { $in: regexTerms } }, // Match any word in name
      //     { mismatchmode: { $in: regexTerms } }, // Match any word in name
      //   ],
      // };
      searchCriteria = {
        $and: regexTerms.map((regex) => ({
          $or: [
            { project: regex },
            { categoryname: regex },
            { name: regex },
            { mismatchmode: regex },
          ],
        })),
      };
    }
    // Fetch all matching documents to get total count
    totalCount = await SubCategoryprod.countDocuments(searchCriteria);

    // Fetch all matching documents for the search criteria if searchTerm is provided, otherwise fetch all documents
    const allMatchingDocs = searchTerm ? await SubCategoryprod.find(searchCriteria).select("_id name categoryname project mode mismatchmode").lean().exec() : await SubCategoryprod.find().select("_id name categoryname project mode mismatchmode").lean().exec();

    // Perform pagination on all matching documents
    subcategoryprod = allMatchingDocs.slice((page - 1) * limit, page * limit);
  } catch (err) {
    console.log(err.message);
  }
  if (!subcategoryprod) {
    return next(new ErrorHandler("SubCategoryprod not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    subcategoryprod,
    totalCount,
  });
});
// get All subcategoryprod => /api/subcategoryprod
exports.checkSubCategoryForManualCreation = catchAsyncErrors(async (req, res, next) => {
  let subcategoryprod;
  try {
    const { project, category, subcategory, id } = req.body;

    const query = {
      project: project,
      categoryname: category,
      name: new RegExp(`^${subcategory}`, "i"),
      ...(id && { _id: { $ne: id } }),
    };

    subcategoryprod = await SubCategoryprod.countDocuments(query);

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    subcategoryprod,
  });
});



// get All subcategoryprod => /api/subcategoryprod
exports.checkSubCategoryForProdUpload = catchAsyncErrors(async (req, res, next) => {
  let subcategoryprod;
  try {
    const { project, subs } = req.body;
    // Construct the query to use $and for each sub
    const query = {
      project,
      $or: subs.map(sub => ({
        categoryname: sub.filename,
        name: sub.Category
      }))
    };
    // console.log(query)
    subcategoryprod = await SubCategoryprod.find(query);
  } catch (err) {
    console.log(err.message);
  }

  return res.status(200).json({
    // count: products.length,
    subcategoryprod,
  });
});

// get All subcategoryprod => /api/subcategoryprod
exports.getListSubcategoryProdLimitedReport = catchAsyncErrors(async (req, res, next) => {
  let subcategoryprod;
  try {
    subcategoryprod = await SubCategoryprod.find({}, { name: 1, categoryname: 1, project: 1 }).lean();
  } catch (err) {
    console.log(err.message);
  }
  if (!subcategoryprod) {
    return next(new ErrorHandler("SubCategoryprod not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    subcategoryprod,
  });
});

// get All subcategoryprod => /api/subcategoryprod
exports.subCategoryProdLimitedReportsMulti = catchAsyncErrors(async (req, res, next) => {
  let subcategoryprod;
  try {
    subcategoryprod = await SubCategoryprod.find({ project: { $in: req.body.project }, categoryname: { $in: req.body.category } }, { name: 1, _id: 0 });
  } catch (err) {
    console.log(err.message);
  }
  if (!subcategoryprod) {
    return next(new ErrorHandler("SubCategoryprod not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    subcategoryprod,
  });
});

