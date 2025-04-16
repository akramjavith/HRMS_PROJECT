const ListPageAccessMode = require("../../../model/modules/role/lispageaccessmode");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
//get All ListPageAccessMode =>/api/roles
exports.getAllListPageAccessMode = catchAsyncErrors(async (req, res, next) => {
  let listpageaccessmode;
  try {
    listpageaccessmode = await ListPageAccessMode.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!listpageaccessmode) {
    return next(new ErrorHandler("ListPageAccessMode not found!", 404));
  }
  return res.status(200).json({
    listpageaccessmode,
  });
});

exports.getAllListPageAccessModeByAggregation = catchAsyncErrors(
  async (req, res, next) => {
    let listpageaccessmode;
    try {
      listpageaccessmode = await ListPageAccessMode.aggregate([
        {
          $group: {
            _id: "$modulename",
            submodules: { $push: "$$ROOT" },
          },
        },
        {
          $addFields: {
            modulename: "$_id",
            submodules: "$submodules",
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ]);
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!listpageaccessmode) {
      return next(new ErrorHandler("ListPageAccessMode not found!", 404));
    }
    return res.status(200).json({
      listpageaccessmode,
    });
  }
);

// exports.getAllListPageAccessModeByAggregation = catchAsyncErrors(
//   async (req, res, next) => {
//     let listpageaccessmode;
//     try {
//       // Retrieve mergedObject from the request or any other source
//       // Assuming mergedObject is provided or computed elsewhere
//       const mergedObject = req.body.mergedObject;

//       // Construct the query to filter based on mergedObject
//       const query = {};

//       // Add filtering conditions based on mergedObject
//       if (mergedObject.modulename && mergedObject.modulename.length > 0) {
//         query.modulename = { $in: mergedObject.modulename };
//       }
//       if (mergedObject.submodulename && mergedObject.submodulename.length > 0) {
//         query.submodulename = { $in: mergedObject.submodulename };
//       }
//       if (mergedObject.mainpagename && mergedObject.mainpagename.length > 0) {
//         query.mainpagename = { $in: mergedObject.mainpagename };
//       }
//       if (mergedObject.subpagename && mergedObject.subpagename.length > 0) {
//         query.subpagename = { $in: mergedObject.subpagename };
//       }
//       if (
//         mergedObject.subsubpagename &&
//         mergedObject.subsubpagename.length > 0
//       ) {
//         query.subsubpagename = { $in: mergedObject.subsubpagename };
//       }

//       // Perform the aggregation with the constructed query
//       listpageaccessmode = await ListPageAccessMode.aggregate([
//         { $match: query },
//         {
//           $group: {
//             _id: "$modulename",
//             submodules: { $push: "$$ROOT" },
//           },
//         },
//         {
//           $addFields: {
//             modulename: "$_id",
//             submodules: "$submodules",
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//           },
//         },
//       ]);
//     } catch (err) {
//       return next(new ErrorHandler("Records not found!", 404));
//     }
//     if (!listpageaccessmode) {
//       return next(new ErrorHandler("ListPageAccessMode not found!", 404));
//     }
//     return res.status(200).json({
//       listpageaccessmode,
//     });
//   }
// );

//create new role => /api/role/new
exports.addListPageAccessMode = catchAsyncErrors(async (req, res, next) => {
  try {
    const pages = req.body.pages; // Receive the array of objects from the client
    if (!pages || pages.length === 0) {
      return next(new ErrorHandler("No data to insert.", 404));
    }

    // Extract fields to check for existing records
    const checks = pages.map((page) => ({
      modulename: page.modulename,
      submodulename: page.submodulename,
      mainpagename: page.mainpagename,
      subpagename: page.subpagename,
      subsubpagename: page.subsubpagename,
    }));

    // Query to find existing records
    const existingRecords = await ListPageAccessMode.find({
      $or: checks.map((check) => ({
        modulename: check.modulename,
        submodulename: check.submodulename,
        mainpagename: check.mainpagename,
        subpagename: check.subpagename,
        subsubpagename: check.subsubpagename,
      })),
    }).exec();

    // Check if any of the records already exist
    if (existingRecords.length > 0) {
      return next(new ErrorHandler("Some data already exists.", 404));
    }

    // If no existing records, proceed with the bulk insert
    await ListPageAccessMode.insertMany(pages);

    res.status(200).json({ message: "Data inserted successfully!" });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
// get Single role => /api/role/:id
exports.getSingleListPageAccessMode = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let slistpageaccessmode = await ListPageAccessMode.findById(id);
    if (!slistpageaccessmode) {
      return next(new ErrorHandler("ListPageAccessMode not found", 404));
    }
    return res.status(200).json({
      slistpageaccessmode,
    });
  }
);
//update role by id => /api/role/:id
exports.updateListPageAccessMode = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ulistpageaccessmode = await ListPageAccessMode.findByIdAndUpdate(
    id,
    req.body
  );
  if (!ulistpageaccessmode) {
    return next(new ErrorHandler("Data not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});
//delete role by id => /api/role/:id
exports.deleteListPageAccessMode = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dlistpageaccessmode = await ListPageAccessMode.findByIdAndRemove(id);
  if (!dlistpageaccessmode) {
    return next(new ErrorHandler("ListPageAccessMode not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});
