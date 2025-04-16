const Manualstock = require("../../../model/modules/stockpurchase/manualstockentry");
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

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

//get All Manualstocks =>/api/manualstock
exports.getAllManualstock = catchAsyncErrors(async (req, res, next) => {
  let manualstock;
  try {
    manualstock = await Manualstock.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!manualstock) {
    return next(new ErrorHandler("Manualstock not found!", 404));
  }
  return res.status(200).json({
    manualstock,
  });
});

exports.getAllManualstockExcelLimitedAsset = catchAsyncErrors(async (req, res, next) => {
  let manualstock;
  try {
    manualstock = await Manualstock.find({ requestmode: "Asset Material" }, {
      company: 1,
      branch: 1,
      unit: 1,
      floor: 1,
      totalbillamount: 1,
      area: 1,
      location: 1,
      requestmode: 1,
      gstno: 1,
      assettype: 1,
      producthead: 1,
      productdetails: 1,
      productname: 1,
      vendorname: 1,
      vendorgroup: 1,
      billno: 1,
      billdate: 1,
      quantity: 1,
      uom: 1,
      rate: 1,
      warrantydetails: 1,
      warranty: 1,
      purchasedate: 1,
      asset: 1,
      material: 1
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    manualstock,
  });
});

exports.getAllManualstockExcelLimitedStock = catchAsyncErrors(async (req, res, next) => {
  let manualstock;
  try {
    manualstock = await Manualstock.find({ requestmode: "Stock Material" }, {
      company: 1,
      branch: 1,
      unit: 1,
      floor: 1,
      area: 1,
      location: 1,
      requestmode: 1,
      vendorgroup: 1,
      totalbillamount: 1,
      stockcategory: 1,
      stocksubcategory: 1,
      stockmaterialarray: 1,
      uomnew: 1,
      quantitynew: 1,
      materialnew: 1,
      productdetailsnew: 1,
      gstno: 1,
      billno: 1,
      warrantydetails: 1,
      warranty: 1,
      purchasedate: 1,
      billdate: 1,
      rate: 1,
      vendorname: 1
    });
  } catch (err) {
    console.log(err, "err")
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    manualstock,
  });
});

exports.getAllManualstockLimited = catchAsyncErrors(async (req, res, next) => {
  let manualstock;
  try {

    manualstock = await Manualstock.find({
      requestmode: req.body.assetmat, company: req.body.companyto,
      branch: { $in: req.body.branchto }, unit: { $in: req.body.unitto },
      handover: { $exists: false }
    },
      {
        requestmode: 1, company: 1, branch: 1, unit: 1,
        floor: 1, area: 1, location: 1, productname: 1, quantity: 1, stockmaterialarray: 1
      });
    // console.log(stock, "stockelskfj")

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!manualstock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    manualstock,
  });
});

exports.getAllManualstockHandover = catchAsyncErrors(async (req, res, next) => {
  let manualstock;
  try {

    manualstock = await Manualstock.find({ handover: "handover" },
      { company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1, employeenameto: 1 });
    // console.log(stock, "stock")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!manualstock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    manualstock,
  });
});


exports.getAllManualstockLimitedUsageCount = catchAsyncErrors(async (req, res, next) => {
  let manualstock;
  try {

    manualstock = await Manualstock.find({ handover: "usagecount" },
      {
        company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1,
        employeenameto: 1, usagedate: 1, usagetime: 1, usercompany: 1, userbranch: 1, userunit: 1,
        userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1, description: 1, filesusagecount: 1, requestmode: 1
      });
    // console.log(stock.length, "stockisag")

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!manualstock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    manualstock,
  });
});

exports.getAllManualstockLimitedReturn = catchAsyncErrors(async (req, res, next) => {
  let manualstock;
  try {

    manualstock = await Manualstock.find({ handover: "return" },
      { company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!manualstock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    manualstock,
  });
});








exports.getAllManualstockAccess = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery, requestmode, company, branch, unit } = req.body;
  // console.log(req.body, "bodypurchase")
  let query = {};
  // Construct the filter query based on the assignbranch array
  const branchFilter = assignbranch.map((branchObj) => ({
    branch: branchObj.branch,
    company: branchObj.company,
    unit: branchObj.unit,
  }));

  query = {
    $or: branchFilter,
    requestmode: "Asset Material"

  };

  if (company && company?.length > 0) {
    query.company = { $in: company }
  }

  if (branch && branch?.length > 0) {
    query.branch = { $in: branch }
  }
  if (unit && unit?.length > 0) {
    query.unit = { $in: unit }
  }

  let queryoverall = {};
  // Construct the filter query based on the assignbranch array
  const branchFilterOverall = assignbranch.map((branchObj) => ({
    branch: branchObj.branch,
    company: branchObj.company,
    unit: branchObj.unit,
  }));

  queryoverall = { $or: branchFilterOverall, requestmode: "Asset Material" };

  if (company && company?.length > 0) {
    queryoverall.company = { $in: company }
  }
  if (branch && branch?.length > 0) {
    queryoverall.branch = { $in: branch }
  }
  if (unit && unit?.length > 0) {
    queryoverall.unit = { $in: unit }
  }

  let conditions = [];

  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach(filter => {
      console.log(filter, "filter")
      if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
        if (filter.column == "purchasedate" || filter.column == "billdate") {
          const [day, month, year] = filter.value.split("/")
          let formattedValue = `${year}-${month}-${day}`
          conditions.push(createFilterCondition(filter.column, filter.condition, formattedValue));
        }
        else {

          conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
        }
      }
    });
  }



  if (searchQuery && searchQuery !== undefined) {
    const searchTermsArray = searchQuery.split(" ").filter(term => term.trim() !== ""); // Remove empty terms
    const regexTerms = searchTermsArray.map((term) => {
      if (!isNaN(term)) {
        return parseInt(term, 10); // Convert numeric term to Number
      }



      // Check if the term is in the date format DD/MM/YYYY
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (dateRegex.test(term)) {
        // Convert DD/MM/YYYY to YYYY-MM-DD
        const [day, month, year] = term.split("/");
        const formattedDate = `${year}-${month}-${day}`;
        return new RegExp(formattedDate, "i");
      }

      return new RegExp(term, "i"); // Default case: string regex
    });

    const regexFields = [
      "company",
      "branch",
      "unit",
      "floor",
      "area",
      "location",
      "requestmode",
      "producthead",
      "productname",
      "warranty",
      "purchasedate",
      "vendorname",
      "gstno",
      // "billno",
      "productdetails",
      "warrantydetails",
      // "quantity",
      "uom",
      // "rate",
      "billdate",
      "vendorgroup",
      "vendorname",
      //"totalbillamount"
    ];

    const orConditions = regexTerms.map((regex) => {
      // if (typeof regex === "number") {
      // Special case for numeric values
      // return {
      //  $or: [{ quantity: regex }, { billno: regex }, { rate: regex },////{totalbillamount:regex}], // Match numeric fields
      // };
      //}


      // General regex case
      return {
        $or: [
          ...regexFields.map(field => ({ [field]: regex })),


          // {
          //   // Add condition for array `stockmaterialarray`
          //   stockmaterialarray: {
          //     $elemMatch: {
          //       $or: [
          //         { uomnew: regex },
          //         { quantitynew: regex },
          //         { materialnew: regex },
          //         { productdetailsnew: regex },
          //         { uomcodenew: regex }
          //       ],
          //     },
          //   },
          // },
        ],
      };
    });

    query = {
      $and: [
        { requestmode: "Asset Material" },
        {
          $or: assignbranch.map((branchObj) => ({
            branch: branchObj.branch,
            company: branchObj.company,
            unit: branchObj.unit,
          })),
        },
        ...orConditions,
      ],
    };
  }

  console.log(query, "query")
  // Apply logicOperator to combine conditions
  if (conditions.length > 0) {
    if (logicOperator === "AND") {
      query.$and = conditions;
    } else if (logicOperator === "OR") {
      query.$or = conditions;
    }
  }
  // console.log(conditions, "conditions")
  try {

    const totalProjects = await Manualstock.countDocuments(query);

    // const totalProjectsData = await Manualstock.find(queryoverall, {
    //   company: 1,
    //   branch: 1,
    //   unit: 1,
    //   floor: 1,
    //   area: 1,
    //   location: 1,
    //   requestmode: 1,
    //   vendorgroup: 1,
    //   totalbillamount: 1,
    //   vendor: 1,
    //   gstno: 1,
    //   billno: 1,
    //   assettype: 1,
    //   producthead: 1,
    //   productname: 1,
    //   warranty: 1,
    //   purchasedate: 1,
    //   productdetails: 1,
    //   warrantydetails: 1,
    //   quantity: 1,
    //   uom: 1,
    //   rate: 1,
    //   billdate: 1

    // }).lean();

    const result = await Manualstock.find(query, {
      company: 1,
      branch: 1,
      unit: 1,
      floor: 1,
      area: 1,
      vendorname: 1,
      location: 1,
      requestmode: 1,
      vendorgroup: 1,
      vendor: 1,
      gstno: 1,
      billno: 1,
      assettype: 1,
      producthead: 1,
      totalbillamount: 1,
      productname: 1,
      warranty: 1,
      purchasedate: 1,
      productdetails: 1,
      warrantydetails: 1,
      quantity: 1,
      uom: 1,
      rate: 1,
      billdate: 1
    })
      .select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    console.log(result.length, 'resultpurchase')
    res.status(200).json({
      totalProjects,
      totalProjectsData: [],
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    console.log(err, "stock")
    return next(new ErrorHandler("Records not found!", 404));
  }
});




exports.getAllManualstockAccessStock = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery, requestmode, company, branch, unit } = req.body;

  let query = {};
  // Construct the filter query based on the assignbranch array
  const branchFilter = assignbranch.map((branchObj) => ({
    branch: branchObj.branch,
    company: branchObj.company,
    unit: branchObj.unit,
  }));

  query = {
    $or: branchFilter,
    requestmode: "Stock Material",
    // status: "Transfer"
  };

  if (company && company?.length > 0) {
    query.company = { $in: company }
  }
  if (branch && branch?.length > 0) {
    query.branch = { $in: branch }
  }
  if (unit && unit?.length > 0) {
    query.unit = { $in: unit }
  }

  let queryoverall = {};
  // Construct the filter query based on the assignbranch array
  const branchFilterOverall = assignbranch.map((branchObj) => ({
    branch: branchObj.branch,
    company: branchObj.company,
    unit: branchObj.unit,
  }));

  queryoverall = {
    $or: branchFilterOverall, requestmode: "Stock Material"
    // , status: "Transfer"
  };

  if (company && company?.length > 0) {
    queryoverall.company = { $in: company }
  }
  if (branch && branch?.length > 0) {
    queryoverall.branch = { $in: branch }
  }
  if (unit && unit?.length > 0) {
    queryoverall.unit = { $in: unit }
  }

  let conditions = [];

  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach(filter => {
      console.log(filter, "filter")
      if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
        if (filter.column == "purchasedate" || filter.column == "billdate") {
          const [day, month, year] = filter.value.split("/")
          let formattedValue = `${year}-${month}-${day}`
          conditions.push(createFilterCondition(filter.column, filter.condition, formattedValue));
        }
        else {

          conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
        }
      }
    });
  }



  if (searchQuery && searchQuery !== undefined) {
    const searchTermsArray = searchQuery.split(" ").filter(term => term.trim() !== ""); // Remove empty terms
    const regexTerms = searchTermsArray.map((term) => {
      if (!isNaN(term)) {
        return parseInt(term, 10); // Convert numeric term to Number
      }

      // Check if the term is in the date format DD/MM/YYYY
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (dateRegex.test(term)) {
        // Convert DD/MM/YYYY to YYYY-MM-DD
        const [day, month, year] = term.split("/");
        const formattedDate = `${year}-${month}-${day}`;
        return new RegExp(formattedDate, "i");
      }

      return new RegExp(term, "i"); // Default case: string regex
    });

    const regexFields = [
      "company",
      "branch",
      "unit",
      "floor",
      "area",
      "location",
      "requestmode",
      "stockcategory",
      "stocksubcategory",
      "quantitynew",
      "uomnew",
      "materialnew",
      "productdetailsnew",
      "gstno",
      // "billno",
      "warrantydetails",
      "warranty",
      "purchasedate",
      //"billdate",
      //  "rate",
      "vendorgroup",
      "vendorname",
      // "totalbillamount"
    ];

    const orConditions = regexTerms.map((regex) => {


      // General regex case
      return {
        $or: [
          ...regexFields.map(field => ({ [field]: regex })),
          {
            // Add condition for array `stockmaterialarray`
            stockmaterialarray: {
              $elemMatch: {
                $or: [
                  { uomnew: regex },
                  { quantitynew: regex },
                  { materialnew: regex },
                  { productdetailsnew: regex },
                  { uomcodenew: regex },
                  { totalbillamount: regex }
                ],
              },
            },
          },
        ],
      };
    });

    query = {
      $and: [
        { requestmode: "Stock Material" },
        {
          $or: assignbranch.map((branchObj) => ({
            branch: branchObj.branch,
            company: branchObj.company,
            unit: branchObj.unit,
          })),
        },
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
  // console.log(conditions, "conditions")
  try {

    const totalProjects = await Manualstock.countDocuments(query);

    // const totalProjectsData = await Manualstock.find(queryoverall, {
    //   company: 1,
    //   branch: 1,
    //   unit: 1,
    //   floor: 1,
    //   area: 1,
    //   location: 1,
    //   requestmode: 1,
    //   stockcategory: 1,
    //   stocksubcategory: 1,
    //   quantitynew: 1,
    //   uomnew: 1,
    //   materialnew: 1,
    //   productdetailsnew: 1,
    //   gstno: 1,
    //   billno: 1,
    //   warrantydetails: 1,
    //   warranty: 1,
    //   purchasedate: 1,
    //   billdate: 1,
    //   rate: 1,
    //   vendorgroup: 1,
    //   vendor: 1,
    //   stockmaterialarray: 1,
    //   quantitynew: 1
    // }).lean();

    const result = await Manualstock.find(query, {
      company: 1,
      branch: 1,
      unit: 1,
      floor: 1,
      area: 1,
      location: 1,
      requestmode: 1,
      stockcategory: 1,
      stocksubcategory: 1,
      quantitynew: 1,
      uomnew: 1,
      totalbillamount: 1,
      materialnew: 1,
      productdetailsnew: 1,
      gstno: 1,
      billno: 1,
      warrantydetails: 1,
      warranty: 1,
      purchasedate: 1,
      billdate: 1,
      rate: 1,
      vendorgroup: 1,
      vendor: 1,
      stockmaterialarray: 1,
      quantitynew: 1
    })
      .select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    console.log(result[3], 'resultstock')
    res.status(200).json({
      totalProjects,
      totalProjectsData: [],
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    console.log(err, "stock")
    return next(new ErrorHandler("Records not found!", 404));
  }
});




//create new manualstock => /api/manualstock/new
exports.addManualstock = catchAsyncErrors(async (req, res, next) => {
  let amanualstock = await Manualstock.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single manualstock=> /api/manualstock/:id
exports.getSingleManualstock = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let smanualstock = await Manualstock.findById(id);
  if (!smanualstock) {
    return next(new ErrorHandler("Manualstock not found", 404));
  }
  return res.status(200).json({
    smanualstock,
  });
});
//update manualstock by id => /api/manualstock/:id
exports.updateManualstock = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let umanualstock = await Manualstock.findByIdAndUpdate(id, req.body);
  if (!umanualstock) {
    return next(new ErrorHandler("Manualstock not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});
//delete manualstock by id => /api/manualstock/:id
exports.deleteManualstock = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dmanualstock = await Manualstock.findByIdAndRemove(id);
  if (!dmanualstock) {
    return next(new ErrorHandler("Manualstock not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

exports.Manualstocktrasnferfilter = catchAsyncErrors(async (req, res, next) => {
  let manualstocks;
  try {
    manualstocks = await Manualstock.find({ productname: req.body.productname, branch: req.body.branch, producthead: req.body.producthead }, { productname: 1, producthead: 1, quantity: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!manualstocks) {
    return next(new ErrorHandler("Manualstock not found!", 404));
  }
  return res.status(200).json({
    manualstocks,
  });
});
