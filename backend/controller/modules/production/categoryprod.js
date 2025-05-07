const Categoryprod = require("../../../model/modules/production/categoryprodmodel");
const Unitrate = require("../../../model/modules/production/productionunitrate");
const QueueTypeMaster = require('../../../model/modules/production/queuetypemaster');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const SubCategoryprod = require("../../../model/modules/production/subcategoryprodmodel");
const Projectmaster = require('../../../model/modules/setup/project');


// get All categoryprod => /api/categoryprod
exports.getAllCategoryprod = catchAsyncErrors(async (req, res, next) => {
  let categoryprod;
  try {
    categoryprod = await Categoryprod.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!categoryprod) {
    return next(new ErrorHandler("Categoryprod not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    categoryprod,
  });
});

exports.CategoryprodSort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalPages, currentPage;

  const { page, pageSize } = req.body;
  try {

    totalProjects = await Categoryprod.countDocuments();

    result = await Categoryprod.find()
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
// get All categoryprod => /api/categoryprod
exports.getAllCategoryprodLimited = catchAsyncErrors(async (req, res, next) => {
  let categoryprod;
  try {
    categoryprod = await Categoryprod.find({}, { name: 1, project: 1, flagstatus: 1, mismatchmode: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!categoryprod) {
    return next(new ErrorHandler("Categoryprod not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    categoryprod,
  });
});

// Create new categoryprod=> /api/categoryprod/new
exports.addCategoryprod = catchAsyncErrors(async (req, res, next) => {
  try {
    // Create new Categoryprod entry
    let acategoryprod = await Categoryprod.create(req.body);
    return res.status(200).json({
      message: 'Successfully added!',
      data: acategoryprod
    });
  } catch (error) {
    // Pass any errors to the centralized error handler
    next(error);
  }
});

// get Signle categoryprod => /api/categoryprod/:id
exports.getSingleCategoryprod = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let scategoryprod = await Categoryprod.findById(id);

  if (!scategoryprod) {
    return next(new ErrorHandler("Categoryprod not found!", 404));
  }
  return res.status(200).json({
    scategoryprod,
  });
});

// update categoryprod by id => /api/categoryprod/:id
exports.updateCategoryprod = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ucategoryprod = await Categoryprod.findByIdAndUpdate(id, req.body);
  if (!ucategoryprod) {
    return next(new ErrorHandler("Categoryprod not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete categoryprod by id => /api/categoryprod/:id
exports.deleteCategoryprod = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dcategoryprod = await Categoryprod.findByIdAndRemove(id);

  if (!dcategoryprod) {
    return next(new ErrorHandler("Categoryprod not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

// get All ProductionUpload => /api/productionuploads
exports.checkCategoryForProdUpload = catchAsyncErrors(async (req, res, next) => {
  let categoryprod;
  try {
    const { project, category } = req.body;
    categoryprod = await Categoryprod.find({ project: project, name: { $in: category } }, { project: 1, name: 1, flagstatus: 1 });
  } catch (err) {
    console.log(err.message);
  }
  return res.status(200).json({
    categoryprod,
  });
});



// get All categoryprod => /api/categoryprod
exports.categoryProdLimitedReportsMulti = catchAsyncErrors(async (req, res, next) => {
  let categoryprod;
  try {

    categoryprod = await Categoryprod.find({ project: { $in: req.body.projectvendor } }, { name: 1, _id: 0 });

  } catch (err) {
    console.log(err.message);
  }
  if (!categoryprod) {
    return next(new ErrorHandler("Categoryprod not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    categoryprod,
  });
});






exports.categoryProdLimitedProductionQueueType = catchAsyncErrors(async (req, res, next) => {
  let categoryprod, queuetypemaster, unitrate;

  try {
    // Fetch required data from the database
    categoryprod = await Categoryprod.find({ project: req.body.projectvendor }, { name: 1, _id: 0 });
    unitrate = await Unitrate.find({ project: req.body.projectvendor }, { project: 1, category: 1, subcategory: 1, _id: 0 });
    queuetypemaster = await QueueTypeMaster.find({ vendor: new RegExp("^" + req.body.projectvendor), type: { $in: req.body.type } }, { vendor: 1, category: 1, subcategory: 1, type: 1, _id: 0 });
    //   console.log(req.body.projectvendor, "queuetypemaster")
    // Function to group unitrate or queuetypemaster by project and category
    const getGroupedCategories = (data) => {
      return data.reduce((acc, item) => {
        const { project, category, subcategory } = item;
        // console.log(/)
        if (!acc[project]) acc[project] = {};
        if (!acc[project][category]) acc[project][category] = new Set();
        acc[project][category].add(subcategory);
        return acc;
      }, {});
    };


    const getAvailableCategories = (project, unitrate, queuetypemaster, categoryprod) => {

      const groupedUnitrate = getGroupedCategories(unitrate);
      const groupedQueuetypemaster = getGroupedCategories(queuetypemaster);


      return categoryprod.filter(({ name: category }) => {
        //  console.log(category, "cat")
        const subcategories = groupedUnitrate[project]?.[category] || new Set();
        const queueSubcategories = groupedQueuetypemaster[project]?.[category] || new Set();


        return [...subcategories].some(sub => !queueSubcategories.has(sub));
      }).map(({ name }) => name);
    };


    const availableCategories = getAvailableCategories(
      req.body.projectvendor,
      unitrate,
      queuetypemaster.map(d => ({ ...d._doc, project: d._doc.vendor.split("-")[0], type: d._doc.type })),
      categoryprod
    );


    return res.status(200).json({
      categoryprod: availableCategories,
    });
  } catch (err) {
    console.log(err, "cprod");
    return res.status(500).json({ error: "An error occurred while processing your request." });
  }
});



// get All ProductionUpload => /api/productionuploads
exports.categoryLimitedNameonly = catchAsyncErrors(async (req, res, next) => {
  let categoryprod;
  try {
    const projectName = req.body.project.split("-")[0];
    categoryprod = await Categoryprod.find({ project: projectName }, { name: 1, _id: 0 });
  } catch (err) {
    return next(new ErrorHandler('Data not found!', 404));
  }

  return res.status(200).json({
    categoryprod,
  });
});

exports.fetchEnbalePagesBasedProjCateSub = catchAsyncErrors(async (req, res, next) => {
  let result = false;
  try {
    const { project, category, subcategory } = req.body;
    const projectData = await Projectmaster.findOne({ name: project }, { enablepage: 1 });
    const categoryData = await Categoryprod.findOne({ project, name: category }, { enablepage: 1 });
    const subcategoryData = await SubCategoryprod.findOne({ project, categoryname: category, name: subcategory }, { enablepage: 1 });

    // Check the project enablepage
    if (projectData && projectData.enablepage) {
      result = true;
    }
    // Check the category enablepage
    else if (categoryData && categoryData.enablepage) {
      result = true;
    }
    // Check the subcategory enablepage
    else if (subcategoryData && subcategoryData.enablepage) {
      result = true;
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!result) {
  //   return next(new ErrorHandler("Project not found!", 404));
  // }
  return res.status(200).json({
    // count: products.length,
    result,
  });
});


// get All categoryprod => /api/categoryprod
exports.getAllCategoryprodLimitedOriginal = catchAsyncErrors(async (req, res, next) => {
  let categoryprod;
  try {
    categoryprod = await Categoryprod.find({ $or: [{ flagstatusorg: "Yes" }, { flagstatus: "Yes" }] }, { name: 1, project: 1, flagstatusorg: 1, flagstatus: 1 });
  } catch (err) {
    return next(new ErrorHandler('Data not found!', 404));
  }
  if (!categoryprod) {
    return next(new ErrorHandler("Categoryprod not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    categoryprod,
  });
});


// get All categoryprod => /api/categoryprod
exports.categoryProdLimitedOrgFlagCalc = catchAsyncErrors(async (req, res, next) => {
  let categoryprod = [];
  try {
    categoryprod = await Categoryprod.find({ flagmanualcalcorg: { $exists: true, $ne: "" }, flagstatusorg: "Yes" }, { name: 1, project: 1, flagmanualcalcorg: 1 });
    if (!categoryprod) {
      return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
      // count: products.length,
      categoryprod,
    });
  } catch (err) {
    return next(new ErrorHandler("Data not found!", 404));
  }

});


// get All ProductionUpload => /api/productionuploads
exports.categoryLimitedKeyword = catchAsyncErrors(async (req, res, next) => {
  let categoryprod;
  try {
    categoryprod = await Categoryprod.find({ keyword: { $exists: true, $ne: [] } }, { project: 1, name: 1, keyword: 1, _id: 0 });
  } catch (err) {
    return next(new ErrorHandler('Data not found!', 404));
  }

  return res.status(200).json({
    categoryprod,
  });
});
