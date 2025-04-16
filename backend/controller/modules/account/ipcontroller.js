const IpMaster = require("../../../model/modules/account/ipmodel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const IpCategory = require("../../../model/modules/account/ipcategory");
const Addpassword = require("../../../model/modules/password/addPasswordModel");
const ExcelJS = require("exceljs");
const fastCsv = require("fast-csv");
const PdfPrinter = require("pdfmake");

// get overall delete functionality
exports.getOverAllDeleteIP = catchAsyncErrors(async (req, res, next) => {
  let ipcat, ipcatmaster, countlength;
  try {

    ipcat = await Addpassword.find({ assignedip: { $in: req.body.checkunit } }, {});

    // ipcatmaster = await IpMaster.find({
    //   ipconfig: {
    //     $elemMatch: {
    //       status: "assigned",
    //       ipaddress: { $in: req.body.checkunit },
    //     },
    //   },
    // },
    //   {
    //     "ipconfig.$": 1, // This projects only the first matching element from the ipconfig array
    //   }
    // );

    ipcatmaster = await IpMaster.aggregate([
      {
        $match: {
          "ipconfig.status": "assigned",
          "ipconfig.ipaddress": { $in: req.body.checkunit }
        }
      },
      {
        $project: {
          ipconfig: {
            $filter: {
              input: "$ipconfig",
              as: "item",
              cond: {
                $and: [
                  { $eq: ["$$item.status", "assigned"] },
                  { $in: ["$$item.ipaddress", req.body.checkunit] }
                ]
              }
            }
          }
        }
      }
    ]);

    countlength = ipcatmaster.length + ipcat.length

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!countlength) {
  //   return next(new ErrorHandler("IpMaster not found!", 404));
  // }
  return res.status(200).json({
    countlength, ipcat, ipcatmaster
  });
});





// get All IpMaster Name => /api/ipmasters
exports.getAllIpMaster = catchAsyncErrors(async (req, res, next) => {
  let ipmaster;
  try {
    ipmaster = await IpMaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!ipmaster) {
    return next(new ErrorHandler("ipmaster Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    ipmaster,
  });
});

// exports.getAllIpMasterAssigned = catchAsyncErrors(async (req, res, next) => {
//   let ipmaster;
//   let { company, branch, unit, floor, area, location, assetmaterial, assetmaterialcode } = req.body;
//   try {
//     let query = {}

//     if (company && company?.length > 0) {
//       query["ipconfig.company"] = { $in: company }
//     }

//     if (branch && branch?.length > 0) {
//       query["ipconfig.branch"] = { $in: branch }
//     }
//     if (unit && unit?.length > 0) {
//       query["ipconfig.unit"] = { $in: unit }
//     }

//     if (floor && floor?.length > 0) {
//       query["ipconfig.floor"] = { $in: floor }
//     }

//     if (area && area?.length > 0) {
//       query["ipconfig.area"] = { $in: area }
//     }
//     if (location && location?.length > 0) {
//       query["ipconfig.location"] = { $in: location }
//     }
//     if (assetmaterial && assetmaterial?.length > 0) {
//       query["ipconfig.assetmaterial"] = { $in: assetmaterial }
//     }
//     if (assetmaterialcode && assetmaterialcode?.length > 0) {
//       query["ipconfig.assetmaterialcode"] = { $in: assetmaterialcode }
//     }
//     query["ipconfig.status"] = "assigned";

//     ipmaster = await IpMaster.find({ query }, { ipconfig: 1 });
//     console.log(ipmaster, "ipmaster")
//   } catch (err) {
//     return next(new ErrorHandler("Records not found!", 404));
//   }

//   return res.status(200).json({
//     // count: products.length,
//     ipmaster,
//   });
// });

exports.getAllIpMasterAssigned = catchAsyncErrors(async (req, res, next) => {
  let { company, branch, unit, floor, area, location, assetmaterial, assetmaterialcode } = req.body;

  try {
    let matchConditions = { "ipconfig.status": "assigned" };

    if (company && company.length > 0) {
      matchConditions["ipconfig.company"] = { $in: company };
    }
    if (branch && branch.length > 0) {
      matchConditions["ipconfig.branch"] = { $in: branch };
    }
    if (unit && unit.length > 0) {
      matchConditions["ipconfig.unit"] = { $in: unit };
    }
    if (floor && floor.length > 0) {
      matchConditions["ipconfig.floor"] = { $in: floor };
    }
    if (area && area.length > 0) {
      matchConditions["ipconfig.area"] = { $in: area };
    }
    if (location && location.length > 0) {
      matchConditions["ipconfig.location"] = { $in: location };
    }
    if (assetmaterial && assetmaterial.length > 0) {
      matchConditions["ipconfig.assetmaterial"] = { $in: assetmaterial };
    }
    if (assetmaterialcode && assetmaterialcode.length > 0) {
      matchConditions["ipconfig.assetmaterialcode"] = { $in: assetmaterialcode };
    }
    // console.log(matchConditions, "matchConditions")
    // let ipmaster = await IpMaster.aggregate([
    //   { $unwind: "$ipconfig" }, // Unwind ipconfig array
    //   { $unwind: "$ipconfig.company" }, // Unwind company array
    //   { $unwind: "$ipconfig.branch" }, // Unwind branch array
    //   { $unwind: "$ipconfig.unit" },
    //   { $match: matchConditions }, // Apply filtering
    //   {
    //     $project: {
    //       "ipconfig.company": 1,
    //       "ipconfig.branch": 1,
    //       "ipconfig.unit": 1,
    //       "ipconfig.floor": 1,
    //       "ipconfig.area": 1,
    //       "ipconfig.location": 1,
    //       "ipconfig.assetmaterial": 1,
    //       "ipconfig.assetmaterialcode": 1,
    //       "ipconfig.ipaddress": 1,
    //     }
    //   } // Project only ipconfig field
    // ]);


    let ipmaster = await IpMaster.aggregate([
      { $unwind: "$ipconfig" }, // Unwind ipconfig array
      { $match: matchConditions }, // Apply filtering
      {
        $project: {
          _id: 0,
          company: {
            $ifNull: [
              { $arrayElemAt: [company, 0] }, // Extract first value from req.body array
              { $cond: { if: { $isArray: "$ipconfig.company" }, then: { $arrayElemAt: ["$ipconfig.company", 0] }, else: "$ipconfig.company" } }
            ]
          },
          branch: {
            $ifNull: [
              { $arrayElemAt: [branch, 0] }, // Extract first value from req.body array
              { $cond: { if: { $isArray: "$ipconfig.branch" }, then: { $arrayElemAt: ["$ipconfig.branch", 0] }, else: "$ipconfig.branch" } }
            ]
          },
          unit: {
            $ifNull: [
              { $arrayElemAt: [unit, 0] }, // Extract first value from req.body array
              { $cond: { if: { $isArray: "$ipconfig.unit" }, then: { $arrayElemAt: ["$ipconfig.unit", 0] }, else: "$ipconfig.unit" } }
            ]
          },
          floor: {
            $cond: {
              if: { $or: [{ $eq: ["$ipconfig.floor", []] }, { $eq: ["$ipconfig.floor", null] }] },
              then: "",
              else: "$ipconfig.floor"
            }
          },
          location: {
            $cond: {
              if: { $or: [{ $eq: ["$ipconfig.location", []] }, { $eq: ["$ipconfig.location", null] }] },
              then: "",
              else: "$ipconfig.location"
            }
          },
          assetmaterial: {
            $cond: {
              if: { $or: [{ $eq: ["$ipconfig.assetmaterial", []] }, { $eq: ["$ipconfig.assetmaterial", null] }] },
              then: "",
              else: "$ipconfig.assetmaterial"
            }
          },
          assetmaterialcode: {
            $cond: {
              if: { $or: [{ $eq: ["$ipconfig.assetmaterialcode", []] }, { $eq: ["$ipconfig.assetmaterialcode", null] }] },
              then: "",
              else: "$ipconfig.assetmaterialcode"
            }
          },
          ipaddress: {
            $cond: {
              if: { $or: [{ $eq: ["$ipconfig.ipaddress", []] }, { $eq: ["$ipconfig.ipaddress", null] }] },
              then: "",
              else: "$ipconfig.ipaddress"
            }
          },
          area: {
            $cond: {
              if: { $or: [{ $eq: ["$ipconfig.area", []] }, { $eq: ["$ipconfig.area", null] }] },
              then: "",
              else: "$ipconfig.area"
            }
          }
        }
      }
    ]);
    // console.log(ipmaster[0], "ipmaster");

    return res.status(200).json({ ipmaster });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

exports.getAllIpMasterUnAssigned = catchAsyncErrors(async (req, res, next) => {
  let { categoryname, subcategoryname, ipaddress } = req.body;

  try {
    let matchConditions = { "ipconfig.status": { $ne: "assigned" } };

    if (categoryname && categoryname.length > 0) {
      matchConditions["ipconfig.categoryname"] = { $in: categoryname };
    }
    if (subcategoryname && subcategoryname.length > 0) {
      matchConditions["ipconfig.subcategoryname"] = { $in: subcategoryname };
    }
    if (ipaddress && ipaddress.length > 0) {
      matchConditions["ipconfig.ipaddress"] = { $in: ipaddress };
    }

    let ipmaster = await IpMaster.aggregate([
      { $unwind: "$ipconfig" }, // Unwind ipconfig array
      { $match: matchConditions }, // Apply filtering
      {
        $project: {
          _id: 0,

          categoryname: {
            $cond: {
              if: { $or: [{ $eq: ["$ipconfig.categoryname", []] }, { $eq: ["$ipconfig.categoryname", null] }] },
              then: "",
              else: "$ipconfig.categoryname"
            }
          },
          subcategoryname: {
            $cond: {
              if: { $or: [{ $eq: ["$ipconfig.subcategoryname", []] }, { $eq: ["$ipconfig.subcategoryname", null] }] },
              then: "",
              else: "$ipconfig.subcategoryname"
            }
          },
          assetmaterial: {
            $cond: {
              if: { $or: [{ $eq: ["$ipconfig.assetmaterial", []] }, { $eq: ["$ipconfig.assetmaterial", null] }] },
              then: "",
              else: "$ipconfig.assetmaterial"
            }
          },

          ipaddress: {
            $cond: {
              if: { $or: [{ $eq: ["$ipconfig.ipaddress", []] }, { $eq: ["$ipconfig.ipaddress", null] }] },
              then: "",
              else: "$ipconfig.ipaddress"
            }
          },
          subnet: {
            $cond: {
              if: { $or: [{ $eq: ["$ipconfig.subnet", []] }, { $eq: ["$ipconfig.subnet", null] }] },
              then: "",
              else: "$ipconfig.subnet"
            }
          },
          gateway: {
            $cond: {
              if: { $or: [{ $eq: ["$ipconfig.gateway", []] }, { $eq: ["$ipconfig.gateway", null] }] },
              then: "",
              else: "$ipconfig.gateway"
            }
          },
          dns1: {
            $cond: {
              if: { $or: [{ $eq: ["$ipconfig.dns1", []] }, { $eq: ["$ipconfig.dns1", null] }] },
              then: "",
              else: "$ipconfig.dns1"
            }
          }
        }
      }
    ]);
    console.log(ipmaster[0], "ipmaster");

    return res.status(200).json({ ipmaster });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});






exports.getAllIpMasterPaginationList1 = catchAsyncErrors(async (req, res, next) => {
  let { page, pageSize, searchTerm } = req.body;
  const skip = (page - 1) * pageSize;
  const limit = parseInt(pageSize);

  try {
    // let query = {
    //   project: req.body.project,
    //   vendor: req.body.vendor,
    //   category: req.body.category,
    //   subcategory: req.body.subcategory,
    //   queue: req.body.queue,
    //   "todo.branch": req.body.branch,
    //   "todo.unit": req.body.unit,
    //   "todo.team": req.body.team,
    //   "todo.resperson": req.body.resperson,
    //   "todo.priority": req.body.prioritystatus,
    // };

    function removeEmpty(obj) {
      const newObj = {};
      for (const key in obj) {
        if (obj[key] !== "" && obj[key] !== undefined) {
          newObj[key] = obj[key];
        }
      }
      return newObj;
    }

    // const filteredQuery = removeEmpty(query); // First filter based on direct fields

    let searchCriteriaTodo = {};
    if (searchTerm) {
      const searchTermsArray = searchTerm.split(" ");
      const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));
      searchCriteriaTodo = {
        $and: regexTerms.map((searchRegex) => ({
          $or: [
            { categoryname: searchRegex },
            { subcategoryname: searchRegex },
            { ipaddress: searchRegex },
            { type: searchRegex },
            { ipdetails: searchRegex },
            { subnet: searchRegex },
            { gateway: searchRegex },
            { dns1: searchRegex },
            { dns2: searchRegex },
            { dns3: searchRegex },
            { dns4: searchRegex },
            { dns5: searchRegex },
            { available: searchRegex },
            { starting: searchRegex },
            { ending: searchRegex },

          ],
        })),
      };
    }

    const pipeline = [
      { $match: filteredQuery }, // First filter data based on the combined query
      // { $unwind: "$todo" }, // Flatten the 'todo' array to create separate records
      {
        $match: removeEmpty({
          ...searchCriteriaTodo, // Apply search filter only if present
        }),
      },
      {
        $project: {
          _id: 1,
          categoryname: 1,
          subcategoryname: 1,
          ipaddress: 1,
          type: 1,
          ipdetails: 1,
          subnet: 1,
          gateway: 1,
          dns1: 1,
          dns2: 1,
          dns3: 1,
          dns4: 1,
          dns5: 1,
          available: 1,
          starting: 1,
          ending: 1,

        },
      },
      { $skip: skip }, // Pagination: Skip records
      { $limit: limit }, // Pagination: Limit records
    ];

    // Execute Aggregation Query
    const result = await IpMaster.aggregate(pipeline);

    // Get Total Count
    const totalProjects = await IpMaster.aggregate([
      { $match: filteredQuery },
      // { $unwind: "$todo" },
      {
        $match: removeEmpty({
          ...searchCriteriaTodo,
        }),
      },
      { $count: "total" },
    ]);

    const totalRecords = totalProjects.length > 0 ? totalProjects[0].total : 0;

    return res.status(200).json({
      result: result,
      totalProjects: totalRecords,
      currentPage: page,
      totalPages: Math.ceil(totalRecords / pageSize),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});


exports.getAllIpMasterPaginationList = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, searchTerm } = req.body;
  try {
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    let query = {}
    // Build the search criteria conditionally
    if (searchTerm) {
      const searchTermsArray = searchTerm.split(" ");
      const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

      // Try converting the search term to a number
      const numericValue = !isNaN(searchTerm) ? Number(searchTerm) : null;

      let searchConditions = regexTerms.map((searchRegex) => ({
        $or: [
          { categoryname: searchRegex },
          { subcategoryname: searchRegex },
          { ipaddress: searchRegex },
          { type: searchRegex },
          { ipdetails: searchRegex },
          { subnet: searchRegex },
          { gateway: searchRegex },
          { dns1: searchRegex },
          { dns2: searchRegex },
          { dns3: searchRegex },
          { dns4: searchRegex },
          { dns5: searchRegex },
          { available: searchRegex },
          { starting: searchRegex },
          { ending: searchRegex },

        ],
      }));

      // If the search term is a valid number, add conditions for numeric fields
      // if (numericValue !== null) {
      //   searchConditions.push({
      //     $or: [{ "Unit Rate": numericValue }, { "Flag Count": numericValue }],
      //   });
      // }

      query.$and = searchConditions;
    }
    console.log(query, "query")
    const [result, totalCount] = await Promise.all([IpMaster.find(query, {}).lean().skip(skip).limit(limit), IpMaster.countDocuments(query, {}).lean()]);
    console.log(result.length, "res")
    return res.status(200).json({ result, totalCount });
  } catch (err) {
    console.log(err);
  }
});





// Create new IpMaster=> /api/ipmaster/new
exports.addIpMaster = catchAsyncErrors(async (req, res, next) => {
  // let checkloc = await IpMaster.findOne({ name: req.body.name });

  // if (checkloc) {
  //     return next(new ErrorHandler("ipmaster Name already exist!", 400));
  // }

  let aipmaster = await IpMaster.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle IpMaster => /api/ipmaster/:id
exports.getSingleIpMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sipmaster = await IpMaster.findById(id);

  if (!sipmaster) {
    return next(new ErrorHandler("ipmaster Name not found!", 404));
  }
  return res.status(200).json({
    sipmaster,
  });
});

// update IpMaster by id => /api/ipmaster/:id
exports.updateIpMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uipmaster = await IpMaster.findByIdAndUpdate(id, req.body);
  if (!uipmaster) {
    return next(new ErrorHandler("ipmaster Name not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete IpMaster by id => /api/ipmaster/:id
exports.deleteIpMaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dipmaster = await IpMaster.findByIdAndRemove(id);

  if (!dipmaster) {
    return next(new ErrorHandler("ipmaster Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getipsubcategory = catchAsyncErrors(async (req, res, next) => {
  let subcatip;
  try {
    subcatip = await IpCategory.find({
      categoryname: { $eq: req.body.categoryname },
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!subcatip) {
    return next(new ErrorHandler("SubCategory  not found!", 404));
  }
  return res.status(200).json({
    subcatip,
  });
});

exports.updateIpObjects = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      updatevalue,
      company,
      branch,
      unit,
      team,
      employeename,
      assignedthrough,
      floor,
      area,
      location,
      assetmaterial,
      assetmaterialcode,
      addedby,
      ipaddress,
      status,
    } = req.body;
    // Construct an array of update operations for each item in changecheckedlabel
    const updateOperations =
    // changecheckedlabel.map(changedProduct => (
    {
      updateOne: {
        filter: {
          "ipconfig._id": updatevalue,
        },
        update: {
          $set: {
            "ipconfig.$.ipaddress": ipaddress,
            "ipconfig.$.company": company,
            "ipconfig.$.branch": branch,
            "ipconfig.$.unit": unit,
            "ipconfig.$.team": team,
            "ipconfig.$.employeename": employeename,
            "ipconfig.$.assignedthrough": assignedthrough,
            "ipconfig.$.floor": floor,
            "ipconfig.$.location": location,
            "ipconfig.$.area": area,
            "ipconfig.$.assetmaterial": assetmaterial,
            "ipconfig.$.assetmaterialcode": assetmaterialcode,
            "ipconfig.$.status": status,
            "ipconfig.$.addedby": addedby,
          },
        },
      },
    };
    // ));
    // Execute the update operations one by one to check and update the matching 'Printed' statuses to 'Re-Printed'
    // for (const operation of updateOperations) {
    const { filter, update } = updateOperations.updateOne;

    const ipmaster = await IpMaster.findOne(filter);

    if (ipmaster) {
      const product = ipmaster.ipconfig.id(filter["ipconfig._id"]);

      await IpMaster.updateOne(filter, update);
    }
    // }

    return res.status(200).json({ message: "IPmaster updated successfully" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("Error updating stock!", 500));
  }
});

exports.updateIpObjectsupdatedby = catchAsyncErrors(async (req, res, next) => {
  try {
    const {
      updatevalue,
      company,
      branch,
      unit,
      floor,
      area,
      location,
      assetmaterial,
      assetmaterialcode,
      updatedby,
      ipaddress,
    } = req.body;

    const updateOperations = {
      updateOne: {
        filter: {
          "ipconfig._id": updatevalue,
        },
        update: {
          $set: {
            "ipconfig.$.ipaddress": ipaddress,
            "ipconfig.$.company": company,
            "ipconfig.$.branch": branch,
            "ipconfig.$.unit": unit,
            "ipconfig.$.floor": floor,
            "ipconfig.$.location": location,
            "ipconfig.$.area": area,
            "ipconfig.$.assetmaterial": assetmaterial,
            "ipconfig.$.assetmaterialcode": assetmaterialcode,
            "ipconfig.$.status": "assigned",
            "ipconfig.$.updatedby": updatedby,
          },
        },
      },
    };
    // ));

    // Execute the update operations one by one to check and update the matching 'Printed' statuses to 'Re-Printed'
    // for (const operation of updateOperations) {
    const { filter, update } = updateOperations.updateOne;

    const ipmaster = await IpMaster.findOne(filter);

    if (ipmaster) {
      const product = ipmaster.ipconfig.id(filter["ipconfig._id"]);

      await IpMaster.updateOne(filter, update);
    }

    return res.status(200).json({ message: "IPmaster updated successfully" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("Error updating stock!", 500));
  }
});

exports.deleteIpObjects = catchAsyncErrors(async (req, res, next) => {
  try {
    const { updatevalue } = req.body;

    // Construct an array of update operations for each item in changecheckedlabel
    const updateOperations =
    // changecheckedlabel.map(changedProduct => (
    {
      updateOne: {
        filter: {
          "ipconfig._id": updatevalue,
        },
        update: {
          $set: {
            // "ipconfig.$.ipaddress": "getid",
            "ipconfig.$.company": "",
            "ipconfig.$.branch": "",
            "ipconfig.$.unit": "",
            "ipconfig.$.floor": "",
            "ipconfig.$.location": "",
            "ipconfig.$.area": "",
            "ipconfig.$.assetmaterial": "",
            "ipconfig.$.assetmaterialcode": "",
            "ipconfig.$.status": "",
          },
        },
      },
    };
    // ));

    // Execute the update operations one by one to check and update the matching 'Printed' statuses to 'Re-Printed'
    // for (const operation of updateOperations) {
    const { filter, update } = updateOperations.updateOne;

    const ipmaster = await IpMaster.findOne(filter);

    if (ipmaster) {
      const product = ipmaster.ipconfig.id(filter["ipconfig._id"]);

      await IpMaster.updateOne(filter, update);
    }
    // }

    return res.status(200).json({ message: "IPmaster updated successfully" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("Error updating stock!", 500));
  }
});


// get All IpMaster Name => /api/ipmasters
exports.getAllIpMasterAccess = catchAsyncErrors(async (req, res, next) => {
  let ipmaster;
  try {

    ipmaster = await IpMaster.find(filterQuery);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!ipmaster) {
    return next(new ErrorHandler("ipmaster Name not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    ipmaster,
  });
});


exports.getAllIpConfigunAssigned = catchAsyncErrors(async (req, res, next) => {
  let ipconfigArray;

  try {
    // Using aggregation to process and filter the data
    const result = await IpMaster.aggregate([
      {
        $project: {
          ipconfig: {
            $filter: {
              input: "$ipconfig", // The ipconfig array field
              as: "config", // Variable name for each element
              cond: { $ne: ["$$config.status", "assigned"] }, // Filter condition
            },
          },
        },
      },
      {
        $unwind: "$ipconfig", // Flatten the filtered ipconfig arrays
      },
      {
        $group: {
          _id: null, // Group all documents into a single group
          allIpConfigs: { $push: "$ipconfig" }, // Collect all ipconfig objects
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          allIpConfigs: 1, // Include the concatenated array
        },
      },
    ]);

    ipconfigArray = result.length > 0 ? result[0].allIpConfigs : [];
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    ipconfigArray, // Respond with the filtered concatenated array
  });
});



exports.IpMasterEXCELDownload = catchAsyncErrors(async (req, res, next) => {
  const { filename, id } = req.body;

  try {
    let query = {};

    const cursor = IpMaster.aggregate([
      { $match: query },
      {
        $project: {
          _id: 0,
          "Category Name": "$categoryname",
          "Subcategory Name": "$subcategoryname",
          "IP Address": "$ipaddress",
          "Type": "$type",
          "IP Details": "$ipdetails",
          "Subnet": "$subnet",
          "Gateway": "$gateway",
          "DNS1": "$dns1",
          "DNS2": "$dns2",
          "DNS3": "$dns3",
          "DNS4": "$dns4",
          "DNS5": "$dns5",
          "Available": "$available",
          "Starting": "$starting",
          "Ending": "$ending"
        }

      },
    ]).cursor({ batchSize: 1000 });

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: false, // Disable styles to reduce size
      useSharedStrings: false, // Reduce memory usage
    });

    let sheetIndex = 1;
    let rowCount = 0;
    let sheet = workbook.addWorksheet(`Sheet${sheetIndex}`);

    // Add headers
    const headers = [
      "Category Name", "Subcategory", "IP Address", "Type",
      "IP Details", "Subnet", "Gateway", "DNS1", "DNS2",
      "DNS3", "DNS4", "DNS5", "Available", "Starting", "Ending"
    ];
    sheet.addRow(headers).commit();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=Production_Month_Report.xlsx");

    for await (const doc of cursor) {
      // If row count exceeds 1 lakh, create a new sheet
      if (rowCount >= 100000) {
        sheetIndex++;
        rowCount = 0;
        sheet = workbook.addWorksheet(`Sheet${sheetIndex}`);
        sheet.addRow(headers).commit();
      }

      // Add row data
      sheet.addRow([
        doc["Category Name"], doc["Subcategory"], doc["IP Address"], doc["Type"],
        doc["IP Details"], doc["Subnet"], doc["Gateway"], doc["DNS1"], doc["DNS2"],
        doc["DNS3"], doc["DNS4"], doc["DNS5"], doc["Available"], doc["Starting"], doc["Ending"]
      ]).commit();

      rowCount++;
    }

    await workbook.commit(); // Finalize the workbook
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.IpMasterCSVDownload = catchAsyncErrors(async (req, res, next) => {
  const { projectvendor, filename, category, fromdate, todate } = req.body;

  try {
    let query = {};

    const cursor = IpMaster.aggregate([
      { $match: query },
      {
        $project: {
          _id: 0,
          "Category Name": "$categoryname",
          "Subcategory Name": "$subcategoryname",
          "IP Address": "$ipaddress",
          "Type": "$type",
          "IP Details": "$ipdetails",
          "Subnet": "$subnet",
          "Gateway": "$gateway",
          "DNS1": "$dns1",
          "DNS2": "$dns2",
          "DNS3": "$dns3",
          "DNS4": "$dns4",
          "DNS5": "$dns5",
          "Available": "$available",
          "Starting": "$starting",
          "Ending": "$ending"
        }
      },
    ]).cursor({ batchSize: 1000 });

    // Set headers for CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=Production_Month_Report.csv");

    const csvStream = fastCsv.format({ headers: true });

    csvStream.pipe(res); // Stream the CSV data directly to response

    for await (const doc of cursor) {
      csvStream.write({
        "Category Name": doc["Category Name"],
        "Subcategory Name": doc["Subcategory Name"],
        "IP Address": doc["IP Address"],
        "Type": doc["Type"],
        "IP Details": doc["IP Details"],
        "Subnet": doc["Subnet"],
        "Gateway": doc["Gateway"],
        "DNS1": doc["DNS1"],
        "DNS2": doc["DNS2"],
        "DNS3": doc["DNS3"],
        "DNS4": doc["DNS4"],
        "DNS5": doc["DNS5"],
        "Available": doc["Available"],
        "Starting": doc["Starting"],
        "Ending": doc["Ending"]
      });
    }

    csvStream.end(); // Finalize the stream
  } catch (error) {
    console.error("Error generating CSV:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.IpMasterPDFDownload = catchAsyncErrors(async (req, res, next) => {
  const { filename, id } = req.body;

  try {
    let query = {};

    const cursor = IpMaster.aggregate([
      { $match: query },
      {
        $project: {
          _id: 0,
          "Category Name": "$categoryname",
          "Subcategory Name": "$subcategoryname",
          "IP Address": "$ipaddress",
          "Type": "$type",
          "IP Details": "$ipdetails",
          "Subnet": "$subnet",
          "Gateway": "$gateway",
          "DNS1": "$dns1",
          "DNS2": "$dns2",
          "DNS3": "$dns3",
          "DNS4": "$dns4",
          "DNS5": "$dns5",
          "Available": "$available",
          "Starting": "$starting",
          "Ending": "$ending"
        }
      },
    ]).cursor({ batchSize: 1000 });


    // ✅ Define pdfmake with Basic Fonts (Helvetica)
    const fonts = {
      Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    };

    const printer = new PdfPrinter(fonts);

    let content = [];

    // ✅ Table Headers (No Bold)
    const headers = [
      "Category Name", "Subcategory", "IP Address", "Type",
      "IP Details", "Subnet", "Gateway", "DNS1", "DNS2",
      "DNS3", "DNS4", "DNS5", "Available", "Starting", "Ending"
    ];
    content.push({ text: "Production Report", font: "Helvetica", alignment: "center" });
    content.push({ text: `Generated on: ${new Date().toLocaleString()}`, font: "Helvetica", alignment: "right" });
    content.push("\n");

    let tableData = [headers];
    for await (const doc of cursor) {
      tableData.push([
        doc["Category Name"] ?? "-",
        doc["Subcategory Name"] ?? "-",
        doc["IP Address"] ?? "-",
        doc["Type"] ?? "-",
        doc["IP Details"] ?? "-",
        doc["Subnet"] ?? "-",
        doc["Gateway"] ?? "-",
        doc["DNS1"] ?? "-",
        doc["DNS2"] ?? "-",
        doc["DNS3"] ?? "-",
        doc["DNS4"] ?? "-",
        doc["DNS5"] ?? "-",
        doc["Available"] ?? "-",
        doc["Starting"] ?? "-",
        doc["Ending"] ?? "-"
      ]);
    }


    // ✅ Add table to PDF content
    content.push({ table: { body: tableData }, layout: "lightHorizontalLines" });

    // ✅ Define PDF Document (Using Helvetica)
    const docDefinition = {
      pageSize: "A4", // ✅ Standard A4 size
      pageOrientation: "landscape", // ✅ Change to landscape mode
      content,
      defaultStyle: {
        font: "Helvetica",
        fontSize: 8, // ✅ Reduce font size (default is 12)
      },
    };

    // ✅ Send PDF as Response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Production_Report.pdf");

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(res); // ✅ Stream PDF directly to client
    pdfDoc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});