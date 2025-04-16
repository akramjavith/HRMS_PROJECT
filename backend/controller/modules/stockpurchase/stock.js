const Stock = require("../../../model/modules/stockpurchase/stock");
const User = require("../../../model/login/auth");
const Managestockitems = require("../../../model/modules/stockpurchase/managestockitems");
const Manualstock = require("../../../model/modules/stockpurchase/manualstockentry");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const ExcelJS = require("exceljs");
const { PassThrough } = require("stream");
const PDFDocument = require('pdfkit');
const multer = require("multer");
const upload = multer();
const fs = require("fs");
const path = require("path");
const mime = require('mime-types');
// const mergeChunks = require("../../../mergeChunks");

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

//get All Stocks =>/api/stock
exports.getAllStock = catchAsyncErrors(async (req, res, next) => {
  let stock;
  try {
    stock = await Stock.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});

exports.getAllStockBillno = catchAsyncErrors(async (req, res, next) => {
  let stock;
  try {
    stock = await Stock.countDocuments({ billno: req.body.billno });
    // console.log(stock, "stock")
  } catch (err) {

    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    stock,
  });
});



exports.getAllStockAccess = catchAsyncErrors(async (req, res, next) => {
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



  // console.log(query, "query")

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
      // console.log(filter, "filter")
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
      "vendorgroup",
      "vendor",
      "gstno",
      "billno",
      "assettype",
      "producthead",
      "productname",
      "warranty",
      "purchasedate",
      "productdetails",
      "warrantydetails",
      "quantity",
      "uom",
      "rate",
      "billdate",
    ];

    const orConditions = regexTerms.map((regex) => {


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

  // console.log(query, "query")
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


    const [totalProjects, result,] = await Promise.all([
      Stock.countDocuments(query),
      Stock.find(query, {
        company: 1,
        branch: 1,
        unit: 1,
        floor: 1,
        area: 1,
        location: 1,
        requestmode: 1,
        vendorgroup: 1,
        vendor: 1,
        gstno: 1,
        billno: 1,
        assettype: 1,
        producthead: 1,
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
        .exec()
    ]);


    res.status(200).json({
      totalProjects,
      totalProjectsData: [],
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    // console.log(err, "stock")
    return next(new ErrorHandler("Records not found!", 404));
  }
});


exports.getAllStockAccessStock = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery, company, branch, unit } = req.body;

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
      // console.log(filter, "filter")
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
      "billno",
      "warrantydetails",
      "warranty",
      "purchasedate",
      "billdate",
      "rate",
      "vendorgroup",
      "vendor",
    ];

    const orConditions = regexTerms.map((regex) => {


      // General regex case
      return {
        $or: [
          ...regexFields.map(field => ({ [field]: regex })),
          {
            // Add condition for array `stockmaterialarray`
            tododetails: {
              $elemMatch: {
                $or: [
                  { uomnew: regex },
                  { category: regex },
                  { subcategory: regex },
                  { rate: regex },
                  { quantitynew: regex },
                  { materialnew: regex },
                  { productdetailsnew: regex },
                  { uomcodenew: regex }
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

    const [totalProjects, result, totalProjectsData,] = await Promise.all([
      Stock.countDocuments(query),



      Stock.find(query, {
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
        quantitynew: 1,
        tododetails: 1

      })
        .select("")
        .lean()
        .skip((page - 1) * pageSize)
        .limit(parseInt(pageSize))
        .exec(),

      // Stock.find(queryoverall, {
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
      // }),


    ]);

    // Now, totalProjects, totalProjectsData, and result are available for use.

    console.log(result.length, 'resultstock')
    res.status(200).json({
      totalProjects,
      totalProjectsData: [],
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    // console.log(err, "stock")
    return next(new ErrorHandler("Records not found!", 404));
  }
});


//create new stock => /api/stock/new
exports.addStock = catchAsyncErrors(async (req, res, next) => {
  let astock = await Stock.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single stock=> /api/stock/:id
exports.getSingleStock = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sstock = await Stock.findById(id);
  if (!sstock) {
    return next(new ErrorHandler("Stock not found", 404));
  }
  return res.status(200).json({
    sstock,
  });
});
//update stock by id => /api/stock/:id
exports.updateStock = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ustock = await Stock.findByIdAndUpdate(id, req.body);
  if (!ustock) {
    return next(new ErrorHandler("Stock not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});
//delete stock by id => /api/stock/:id
exports.deleteStock = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dstock = await Stock.findByIdAndRemove(id);
  if (!dstock) {
    return next(new ErrorHandler("Stock not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

exports.Stocktrasnferfilter = catchAsyncErrors(async (req, res, next) => {
  let stocks;
  try {
    stocks = await Stock.find({ productname: req.body.productname, branch: req.body.branch, producthead: req.body.producthead }, { productname: 1, producthead: 1, quantity: 1 });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stocks) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stocks,
  });
});


exports.getAllStockPurchaseLimitedTransfer = catchAsyncErrors(async (req, res, next) => {
  let stock;
  try {

    stock = await Stock.find({ status: "Transfer" },
      { requestmode: 1, company: 1, status: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, stockmaterialarray: 1, quantity: 1 });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});

exports.getAllStockPurchaseLimitedTransferLog = catchAsyncErrors(async (req, res, next) => {
  let stock;
  try {

    stock = await Stock.find({
      $or: [
        { status: "Transfer", },
        { handover: "handover", requestmode: "Stock Material", productname: req.body.material }
      ],
      company: req.body.company, branch: req.body.branch, unit: req.body.unit, floor: req.body.floor, area: req.body.area, location: req.body.location
    },
      {
        requestmode: 1, company: 1, status: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, employeenameto: 1, countquantity: 1,
        stockmaterialarray: 1, quantity: 1, addedby: 1
      });
    // console.log(stock, "viewstock")
  } catch (err) {
    // console.log(err, "viewser")
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!stock) {
  //   return next(new ErrorHandler("Stock not found!", 404));
  // }
  return res.status(200).json({
    stock,
  });
});





exports.getAllStockPurchaseLimitedAssetDetails = catchAsyncErrors(async (req, res, next) => {
  let stock = [];
  try {


    const [stocklimited] = await Promise.all([
      Stock.aggregate([
        {
          $match: {
            requestmode: req.body.assetmat,

          }
        },
        {
          $project: {
            requestmode: 1, company: 1, branch: 1, unit: 1,
            floor: 1, area: 1, location: 1, productname: 1,
            quantity: 1, stockmaterialarray: 1,

          }
        }
      ]),

    ]);

    stock = stocklimited;


    // console.log(stock[15], "stocklimited")

  } catch (err) {
    console.log(err, "err"

    )
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});

exports.getAllStockPurchaseLimited = catchAsyncErrors(async (req, res, next) => {
  let stock = [];
  try {
    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        {
          $match: {
            requestmode: req.body.assetmat,
            company: req.body.companyto,
            branch: { $in: req.body.branchto },
            unit: { $in: req.body.unitto },
            handover: { $exists: false },
            status: { $ne: "Transfer" }
          }
        },
        {
          $project: {
            requestmode: 1, company: 1, branch: 1, unit: 1,
            floor: 1, area: 1, location: 1, productname: 1,
            quantity: 1, stockmaterialarray: 1,
            status: { $literal: "Stock" } // Adding status directly
          }
        }
      ]),
      Manualstock.aggregate([
        {
          $match: {
            requestmode: req.body.assetmat,
            company: req.body.companyto,
            branch: { $in: req.body.branchto },
            unit: { $in: req.body.unitto },
            handover: { $exists: false },
            status: { $ne: "Transfer" }
          }
        },
        {
          $project: {
            requestmode: 1, company: 1, branch: 1, unit: 1,
            floor: 1, area: 1, location: 1, productname: 1,
            quantity: 1, stockmaterialarray: 1,
            status: { $literal: "Manual" }
          }
        }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];


    // console.log(stock[15], "stocklimited")

  } catch (err) {
    console.log(err, "err"

    )
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});


exports.getAllStockPurchaseLimitedBalanceCount = catchAsyncErrors(async (req, res, next) => {
  let stock = [], manual = [];
  try {
    let filterConditions = {}
    console.log(req.body.requestmode, "requestmode")
    if (req.body.requestmode === "Asset Material") {
      filterConditions = {
        requestmode: req.body.requestmode,
        productname: req.body.productname,
        handover: { $exists: false },
        status: { $ne: "Transfer" }
      };
    } else {
      filterConditions = {
        requestmode: req.body.requestmode,
        "stockmaterialarray.materialnew": req.body.productname,
        handover: { $exists: false },
        status: { $ne: "Transfer" }
      };
    }

    let filterreturnhandover = {
      requestmode: req.body.requestmode,
      productname: req.body.productname,
      // handover: { $in: ["handover", "return"] },
      $or: [
        { handover: { $in: ["handover", "return"] } },
        { status: "Transfer" }

      ]

    }

    console.log(filterreturnhandover, "filterreturnhandover")


    const [stocklimited, stockhandovereturn, manuallimited, manualhandoverreturn] = await Promise.all([

      Stock.find(filterConditions, {
        requestmode: 1, company: 1, branch: 1, unit: 1,
        floor: 1, area: 1, location: 1, productname: 1,
        quantity: 1, stockmaterialarray: 1, status: 1

      }),
      Stock.find(filterreturnhandover, {
        requestmode: 1, company: 1, branch: 1, unit: 1,
        floor: 1, area: 1, location: 1, productname: 1, status: 1,
        quantity: 1, stockmaterialarray: 1, countquantity: 1, handover: 1
      }
      ),
      Manualstock.find(filterConditions, {
        requestmode: 1, company: 1, branch: 1, unit: 1,
        floor: 1, area: 1, location: 1, productname: 1,
        quantity: 1, stockmaterialarray: 1,
      }),

      Manualstock.find(filterreturnhandover, {
        requestmode: 1, company: 1, branch: 1, unit: 1,
        floor: 1, area: 1, location: 1, productname: 1,
        quantity: 1, stockmaterialarray: 1, countquantity: 1, handover: 1
      }),

    ]);

    if (req.body.requestmode === "Asset Material") {
      stock = stocklimited;
      manual = manuallimited;

      // console.log(stocklimited, manual, "ooo")

    }
    else {
      // stock = stocklimited.flatMap(item => item.stockmaterialarray).reduce((sum, item) => sum + Number(item.quantitynew), 0);
      // manual = manuallimited.flatMap(item => item.stockmaterialarray).reduce((sum, item) => sum + Number(item.quantitynew), 0);

      stock = stocklimited.flatMap(item => item.stockmaterialarray.map(d => {
        return {
          ...d,
          _id: item._id,
          company: item.company, branch: item.branch,
          unit: item.unit, floor: item.floor,
          area: item.area, location: item.location, productname: d.materialnew, requestmode: item.requestmode, quantity: d.quantitynew
        }
      }));


      // manual = manuallimited.flatMap(item => item.stockmaterialarray);
      manual = manuallimited.flatMap(item => item.stockmaterialarray.map(d => {
        return {
          ...d,
          _id: item._id,
          company: item.company, branch: item.branch,
          unit: item.unit, floor: item.floor,
          area: item.area, location: item.location, productname: d.materialnew, requestmode: item.requestmode, quantity: d.quantitynew
        }
      }));
    }


    const groupedArray = Object.values(
      stock.reduce((acc, item) => {
        const { company, branch, unit, floor, area, location, productname, requestmode, quantity, _id, status } = item;

        // Generate a unique key based on vendor, filenameupdated, and category
        const key = `${company}-${branch}-${unit}-${floor}-${area}-${location}-${productname}-${requestmode}`;

        // If this key doesn't exist, initialize it
        if (!acc[key]) {
          acc[key] = { company, branch, unit, floor, area, location, productname, _id, requestmode, quantity: 0 };
        }

        // Sum the flagcount
        acc[key].quantity += Number(quantity);
        acc[key].status = "Stock";

        return acc;
      }, {})
    );

    let stocks = groupedArray.map((item, index) => {

      let stockhandover = stockhandovereturn.filter(d => item.company == d.company &&
        item.branch == d.branch &&
        item.unit == d.unit &&
        item.floor == d.floor &&
        item.area == d.area &&
        item.location == d.location &&
        item.productname == d.productname &&
        item.requestmode == d.requestmode &&
        d.handover == "handover").reduce((sum, item) => sum + Number(item.countquantity), 0);


      let stockreturn = stockhandovereturn.filter(d => item.company == d.company &&
        item.branch == d.branch &&
        item.unit == d.unit &&
        item.floor == d.floor &&
        item.area == d.area &&
        item.location == d.location &&
        item.productname == d.productname &&
        item.requestmode == d.requestmode &&
        d.handover == "return").reduce((sum, item) => sum + Number(item.countquantity), 0);

      let stocktransfer = 0;


      stocktransfer = stockhandovereturn.filter(d => item.company == d.company &&
        item.branch == d.branch &&
        item.unit == d.unit &&
        item.floor == d.floor &&
        item.area == d.area &&
        item.location == d.location &&
        item.productname == d.productname &&
        item.requestmode == d.requestmode &&
        d.status == "Transfer").reduce((sum, item) => sum + Number(item.quantity), 0);

      console.log(stocktransfer, "stocktransfer")

      const allused = (stockhandover - stockreturn)
      // console.log(allused1, "allused1")
      // console.log(stocktransfer, "www")
      // const allused = (allused1 - stocktransfer)

      // console.log(allused, "allu")

      return {
        ...item,
        balancedcount:
          Number(item.quantity) - Number(allused),
      };

    });


    const groupedArrayManual = Object.values(
      manual.reduce((acc, item) => {
        const { company, branch, unit, floor, area, location, productname, requestmode, quantity, _id } = item;

        // Generate a unique key based on vendor, filenameupdated, and category
        const key = `${company}-${branch}-${unit}-${floor}-${area}-${location}-${productname}-${requestmode}`;

        // If this key doesn't exist, initialize it
        if (!acc[key]) {
          acc[key] = { company, branch, unit, floor, area, location, productname, requestmode, _id, quantity: 0 };
        }

        // Sum the flagcount
        acc[key].quantity += Number(quantity);
        acc[key].status = "Manual";

        return acc;
      }, {})
    );

    let stocksmanual = groupedArrayManual.map((item, index) => {

      let stockhandovermanual = manualhandoverreturn.filter(d => item.company == d.company &&
        item.branch == d.branch &&
        item.unit == d.unit &&
        item.floor == d.floor &&
        item.area == d.area &&
        item.location == d.location &&
        item.productname == d.productname &&
        item.requestmode == d.requestmode &&
        d.handover == "handover").reduce((sum, item) => sum + Number(item.countquantity), 0);


      let stockreturnmanual = manualhandoverreturn.filter(d => item.company == d.company &&
        item.branch == d.branch &&
        item.unit == d.unit &&
        item.floor == d.floor &&
        item.area == d.area &&
        item.location == d.location &&
        item.productname == d.productname &&
        item.requestmode == d.requestmode &&
        d.handover == "return").reduce((sum, item) => sum + Number(item.countquantity), 0);

      const allusedmanual = stockhandovermanual - stockreturnmanual

      return {
        ...item,

        balancedcountmanual:
          Number(item.quantity) - Number(allusedmanual),
      };

    });




    // // let stockhandover = stockhandovereturn.filter(item => item.handover == "handover").reduce((sum, item) => sum + Number(item.countquantity), 0);
    // // let stockreturn = stockhandovereturn.filter(item => item.handover == "return").reduce((sum, item) => sum + Number(item.countquantity), 0);


    // // let stockhandovermanual = manualhandoverreturn.filter(item => item.handover == "handover").reduce((sum, item) => sum + Number(item.countquantity), 0);
    // // let stockreturnmanual = manualhandoverreturn.filter(item => item.handover == "return").reduce((sum, item) => sum + Number(item.countquantity), 0);



    // let allused = Number(stockhandover) - Number(stockreturn)

    // let allusedmanual = Number(stockhandovermanual) - Number(stockreturnmanual)
    // const balancedcount = Number(stock) - Number(allused)
    // const balancedcountmanual = Number(manual) - Number(allusedmanual)

    return res.status(200).json({
      stocks,
      stocksmanual
    });


  } catch (err) {
    console.log(err, "errr")
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!stock) {
  //   return next(new ErrorHandler("Stock not found!", 404));
  // }

});


exports.getAllStockPurchaseLimitedHandover = catchAsyncErrors(async (req, res, next) => {
  let stock = [], stocklimited, manuallimited;
  try {

    // stocklimited = await Stock.find({ handover: "handover" },
    //   { company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1, employeenameto: 1 });


    // manuallimited = await Manualstock.find({ handover: "handover" },
    //   { company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1, employeenameto: 1 });


    //   stock = [...stocklimited, ...manuallimited]

    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        {
          $match: { handover: "handover" }
        },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1,
            location: 1, productname: 1, countquantity: 1,
            employeenameto: 1,
            status: { $literal: "Stock" } // Adding status field
          }
        }
      ]),
      Manualstock.aggregate([
        {
          $match: { handover: "handover" }
        },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1,
            location: 1, productname: 1, countquantity: 1,
            employeenameto: 1,
            status: { $literal: "Manual" } // Adding status field
          }
        }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];



  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});


exports.getAllStockPurchaseLimitedUsageCount = catchAsyncErrors(async (req, res, next) => {
  let stock = [], stocklimited, manuallimited;
  try {

    // stocklimited = await Stock.find({ handover: "usagecount" },
    //   {
    //     company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1,
    //     employeenameto: 1, usagedate: 1, usagetime: 1, usercompany: 1, userbranch: 1, userunit: 1,
    //     userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1, description: 1, filesusagecount: 1, requestmode: 1
    //   });

    // manuallimited = await Manualstock.find({ handover: "usagecount" },
    //   {
    //     company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1,
    //     employeenameto: 1, usagedate: 1, usagetime: 1, usercompany: 1, userbranch: 1, userunit: 1,
    //     userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1, description: 1, filesusagecount: 1, requestmode: 1
    //   });

    // stock = [...stocklimited, manuallimited]
    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        {
          $match: { handover: "usagecount" }
        },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1,
            employeenameto: 1, usagedate: 1, usagetime: 1, usercompany: 1, userbranch: 1, userunit: 1,
            userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1, description: 1,
            filesusagecount: 1, requestmode: 1,
            status: { $literal: "Stock" } // Adding status field
          }
        }
      ]),
      Manualstock.aggregate([
        {
          $match: { handover: "usagecount" }
        },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1,
            employeenameto: 1, usagedate: 1, usagetime: 1, usercompany: 1, userbranch: 1, userunit: 1,
            userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1, description: 1,
            filesusagecount: 1, requestmode: 1,
            status: { $literal: "Manual" } // Adding status field
          }
        }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});

exports.getAllStockPurchaseLimitedReturn = catchAsyncErrors(async (req, res, next) => {
  let stock = [], stocklimited, manuallimited;
  try {

    // stocklimited = await Stock.find({ handover: "return" },
    //   { company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1 });
    // manuallimited = await Manualstock.find({ handover: "return" },
    //   { company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1 });
    // stock = [...stocklimited, ...manuallimited]

    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        {
          $match: { handover: "return" }
        },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1,
            productname: 1, countquantity: 1,
            status: { $literal: "Stock" } // Adding status field
          }
        }
      ]),
      Manualstock.aggregate([
        {
          $match: { handover: "return" }
        },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1,
            productname: 1, countquantity: 1,
            status: { $literal: "Manual" } // Adding status field
          }
        }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];



  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});


exports.getAllStockPurchaseLimitedUsageCountNotification = catchAsyncErrors(async (req, res, next) => {
  let stock;
  try {

    stock = await Stock.countDocuments({ employeenameto: req.body.username, handover: "handover" });



  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});

exports.getAllStockPurchaseLimitedUsageCountCreateList = catchAsyncErrors(async (req, res, next) => {
  let stock = [], stocklimited, manuallimited;
  try {


    //     const query = {
    //       "addedby.name": req.body.username,
    //       handover: "usagecount",
    //       company: req.body.company, branch: req.body.branch, unit: req.body.unit, floor: req.body.floor, area: req.body.area,
    //       location: req.body.location, productname: req.body.productname, requestmode: req.body.requestmode
    //     };


    //     stocklimited = await Stock.find(query,
    //       {
    //         company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1,
    //         employeenameto: 1, usagedate: 1, usagetime: 1, description: 1, usercompany: 1, userbranch: 1, userunit: 1,
    //         userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1, description: 1, requestmode: 1, filesusagecount: 1, addedby: 1
    //       });
    //       manuallimited = await Manualstock.find(query,
    //         {
    //           company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1,
    //           employeenameto: 1, usagedate: 1, usagetime: 1, description: 1, usercompany: 1, userbranch: 1, userunit: 1,
    //           userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1, description: 1, requestmode: 1, filesusagecount: 1, addedby: 1
    //         });

    // stock=[...stocklimited,manuallimited]

    const queryMatch = {
      "addedby.name": req.body.username,
      handover: "usagecount",
      company: req.body.company,
      branch: req.body.branch,
      unit: req.body.unit,
      floor: req.body.floor,
      area: req.body.area,
      location: req.body.location,
      productname: req.body.productname,
      requestmode: req.body.requestmode
    };

    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1,
            productname: 1, countquantity: 1, employeenameto: 1, usagedate: 1,
            usagetime: 1, description: 1, usercompany: 1, userbranch: 1, userunit: 1,
            userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1,
            requestmode: 1, filesusagecount: 1, addedby: 1,
            status: { $literal: "Stock" } // Adding status field
          }
        }
      ]),
      Manualstock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1,
            productname: 1, countquantity: 1, employeenameto: 1, usagedate: 1,
            usagetime: 1, description: 1, usercompany: 1, userbranch: 1, userunit: 1,
            userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1,
            requestmode: 1, filesusagecount: 1, addedby: 1,
            status: { $literal: "Manual" } // Adding status field
          }
        }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});

exports.getAllStockPurchaseLimitedUsageCountNotificationList = catchAsyncErrors(async (req, res, next) => {
  let stock = [];
  try {
    //     const query = {}
    //     query.employeenameto = { $in: req.body.username };
    //     query.handover = {
    //       $in: ["handover", "usagecount"],

    //     },


    //       stocklimited = await Stock.find(query,
    //         {
    //           company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1,
    //           employeenameto: 1, usagedate: 1, usagetime: 1, description: 1, usercompany: 1, userbranch: 1, userunit: 1,
    //           userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1, description: 1, requestmode: 1, filesusagecount: 1
    //         });
    //         manuallimited = await Manualstock.find(query,
    //           {
    //             company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1,
    //             employeenameto: 1, usagedate: 1, usagetime: 1, description: 1, usercompany: 1, userbranch: 1, userunit: 1,
    //             userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1, description: 1, requestmode: 1, filesusagecount: 1
    //           });


    const queryMatch = {
      employeenameto: req.body.username,
      handover: { $in: ["handover", "usagecount"] }
    };
    console.log(queryMatch, "queryMatch")

    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1,
            productname: 1, countquantity: 1, employeenameto: 1, usagedate: 1,
            usagetime: 1, description: 1, usercompany: 1, userbranch: 1, userunit: 1,
            userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1,
            requestmode: 1, filesusagecount: 1,
            status: { $literal: "Stock" } // Adding status field
          }
        }
      ]),
      Manualstock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1,
            productname: 1, countquantity: 1, employeenameto: 1, usagedate: 1,
            usagetime: 1, description: 1, usercompany: 1, userbranch: 1, userunit: 1,
            userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1,
            requestmode: 1, filesusagecount: 1,
            status: { $literal: "Manual" } // Adding status field
          }
        }
      ])
    ]);
    console.log()
    stock = [...stocklimited, ...manuallimited];

    console.log(stock, "stock")


  } catch (err) {
    console.log(err, "errr")
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});


exports.getAllStockPurchaseLimitedHandoverTodo = catchAsyncErrors(async (req, res, next) => {
  let stock = [];
  try {

    // stocklimited = await Stock.find({
    //   handover: "handover", productname: req.body.productname, company: req.body.company, branch: req.body.branch, unit: req.body.unit, floor: req.body.floor, area: req.body.area,
    //   location: req.body.location
    // },
    //   {
    //     company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1, employeenameto: 1,
    //     addedby: 1, usercompany: 1, userbranch: 1, userunit: 1, userteam: 1, requestmode: 1
    //   });
    //   manuallimited = await Manualstock.find({
    //     handover: "handover", productname: req.body.productname, company: req.body.company, branch: req.body.branch, unit: req.body.unit, floor: req.body.floor, area: req.body.area,
    //     location: req.body.location
    //   },
    //     {
    //       company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1, employeenameto: 1,
    //       addedby: 1, usercompany: 1, userbranch: 1, userunit: 1, userteam: 1, requestmode: 1
    //     });

    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        {
          $match: {
            handover: "handover",
            productname: req.body.productname,
            company: req.body.company,
            branch: req.body.branch,
            unit: req.body.unit,
            floor: req.body.floor,
            area: req.body.area,
            location: req.body.location
          }
        },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
            countquantity: 1, employeenameto: 1, addedby: 1, usercompany: 1, userbranch: 1,
            userunit: 1, userteam: 1, requestmode: 1,
            status: { $literal: "Stock" } // Adding status field
          }
        }
      ]),
      Manualstock.aggregate([
        {
          $match: {
            handover: "handover",
            productname: req.body.productname,
            company: req.body.company,
            branch: req.body.branch,
            unit: req.body.unit,
            floor: req.body.floor,
            area: req.body.area,
            location: req.body.location
          }
        },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
            countquantity: 1, employeenameto: 1, addedby: 1, usercompany: 1, userbranch: 1,
            userunit: 1, userteam: 1, requestmode: 1,
            status: { $literal: "Manual" } // Adding status field
          }
        }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});


exports.getAllStockPurchaseStockCount = catchAsyncErrors(async (req, res, next) => {
  let stock = [];
  try {

    //     stocklimited = await Stock.find({
    //       handover: { $in: ["usagcount", "return"] }, employeenameto: req.body.username,
    //     },
    //       {
    //         company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
    //         countquantity: 1, handover: 1
    //       });

    //       manuallimited = await Manualstock.find({
    //         handover: { $in: ["usagcount", "return"] }, employeenameto: req.body.username,
    //       },
    //         {
    //           company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
    //           countquantity: 1, handover: 1
    //         });
    // stock=[...stocklimited,...manuallimited]

    const { username } = req.body;

    const queryMatch = {
      handover: { $in: ["usagecount", "return"] },
      employeenameto: username
    };

    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
            countquantity: 1, handover: 1,
            source: { $literal: "Stock" } // Identify the collection
          }
        }
      ]),
      Manualstock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
            countquantity: 1, handover: 1,
            source: { $literal: "ManualStock" } // Identify the collection
          }
        }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];




    // console.log(stock.length, "stockcount")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});

exports.getAllStockPurchaseStockCountUsage = catchAsyncErrors(async (req, res, next) => {
  let stock = [];
  try {



    // stocklimited = await Stock.find({
    //       handover: "usagecount",
    //       "addedby.name": req.body.username,
    //     },
    //       {
    //         company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
    //         countquantity: 1, handover: 1
    //       });

    //       manuallimited = await Manualstock.find({
    //         handover: "usagecount",
    //         "addedby.name": req.body.username,
    //       },
    //         {
    //           company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
    //           countquantity: 1, handover: 1
    //         });

    // stock=[...stocklimted,...manuallimited]

    const { username } = req.body;

    const queryMatch = {
      handover: "usagecount",
      "addedby.name": username
    };

    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
            countquantity: 1, handover: 1,
            status: { $literal: "Stock" } // Identify the collection
          }
        }
      ]),
      Manualstock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
            countquantity: 1, handover: 1,
            status: { $literal: "Manual" } // Identify the collection
          }
        }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];

    // console.log(stock);


    // console.log(req.body.username, stock.length, "stockcoun112t")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});

exports.getAllStockPurchaseLimitedHandoverTodoReturn = catchAsyncErrors(async (req, res, next) => {
  let stock = [];
  try {

    // stocklimited = await Stock.find({
    //   handover: "return", productname: req.body.productname, company: req.body.company, branch: req.body.branch, unit: req.body.unit, floor: req.body.floor, area: req.body.area,
    //   location: req.body.location
    // },
    //   {
    //     company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
    //     countquantity: 1, employeenameto: 1, addedby: 1, usercompany: 1, userbranch: 1, userunit: 1, userteam: 1, requestmode: 1
    //   });
    //   manuallimited = await Manualstock.find({
    //     handover: "return", productname: req.body.productname, company: req.body.company, branch: req.body.branch, unit: req.body.unit, floor: req.body.floor, area: req.body.area,
    //     location: req.body.location
    //   },
    //     {
    //       company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
    //       countquantity: 1, employeenameto: 1, addedby: 1, usercompany: 1, userbranch: 1, userunit: 1, userteam: 1, requestmode: 1
    //     });

    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        {
          $match: {
            handover: "return",
            productname: req.body.productname,
            company: req.body.company,
            branch: req.body.branch,
            unit: req.body.unit,
            floor: req.body.floor,
            area: req.body.area,
            location: req.body.location
          }
        },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
            countquantity: 1, employeenameto: 1, addedby: 1, usercompany: 1, userbranch: 1,
            userunit: 1, userteam: 1, requestmode: 1,
            status: { $literal: "Stock" } // Adding status field
          }
        }
      ]),
      Manualstock.aggregate([
        {
          $match: {
            handover: "return",
            productname: req.body.productname,
            company: req.body.company,
            branch: req.body.branch,
            unit: req.body.unit,
            floor: req.body.floor,
            area: req.body.area,
            location: req.body.location
          }
        },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1,
            countquantity: 1, employeenameto: 1, addedby: 1, usercompany: 1, userbranch: 1,
            userunit: 1, userteam: 1, requestmode: 1,
            status: { $literal: "Manual" } // Adding status field
          }
        }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});

//nofification return

exports.getAllStockPurchaseLimitedHandoverTodoNotification = catchAsyncErrors(async (req, res, next) => {
  let stock = [], manuallimited, stocklimited;
  try {

    // stocklimited = await Stock.find({
    //   handover: "handover", productname: req.body.productname, branch: req.body.branch, unit: req.body.unit, floor: req.body.floor, area: req.body.area,
    //   location: req.body.location, employeenameto: req.body.employeenameto
    // },
    //   {
    //     company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1, employeenameto: 1,
    //     addedby: 1, usercompany: 1, userbranch: 1, userunit: 1, userteam: 1, requestmode: 1
    //   });
    //   manuallimited = await Manualstock.find({
    //     handover: "handover", productname: req.body.productname, branch: req.body.branch, unit: req.body.unit, floor: req.body.floor, area: req.body.area,
    //     location: req.body.location, employeenameto: req.body.employeenameto
    //   },
    //     {
    //       company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1, employeenameto: 1,
    //       addedby: 1, usercompany: 1, userbranch: 1, userunit: 1, userteam: 1, requestmode: 1
    //     });

    //      stock = [...stocklimited,...manuallimited]

    const queryMatch = {
      handover: "handover",
      productname: req.body.productname,
      branch: req.body.branch,
      unit: req.body.unit,
      floor: req.body.floor,
      area: req.body.area,
      location: req.body.location,
      employeenameto: req.body.employeenameto
    };

    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1,
            employeenameto: 1, addedby: 1, usercompany: 1, userbranch: 1, userunit: 1, userteam: 1, requestmode: 1,
            status: { $literal: "Stock" } // Adding status field
          }
        }
      ]),
      Manualstock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1,
            employeenameto: 1, addedby: 1, usercompany: 1, userbranch: 1, userunit: 1, userteam: 1, requestmode: 1,
            status: { $literal: "Manual" } // Adding status field
          }
        }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];



  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});


exports.getAllStockPurchaseLimitedHandoverTodoReturnNotification = catchAsyncErrors(async (req, res, next) => {
  let stock = [];
  try {

    const queryMatch = {
      handover: "return",
      productname: req.body.productname,
      branch: req.body.branch,
      unit: req.body.unit,
      floor: req.body.floor,
      area: req.body.area,
      location: req.body.location,
      employeenameto: req.body.employeenameto
    };

    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1,
            employeenameto: 1, addedby: 1, usercompany: 1, userbranch: 1, userunit: 1, userteam: 1, requestmode: 1,
            status: { $literal: "Stock" } // Adding status field
          }
        }
      ]),
      Manualstock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1,
            employeenameto: 1, addedby: 1, usercompany: 1, userbranch: 1, userunit: 1, userteam: 1, requestmode: 1,
            status: { $literal: "Manual" } // Adding status field
          }
        }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});



exports.getAllStockPurchaseLimitedHandoverandReturn = catchAsyncErrors(async (req, res, next) => {
  let stock;
  try {

    stock = await Stock.find({
      handover: { $in: ["handover", "return"] }, productname: req.body.productname, branch: req.body.branch, unit: req.body.unit, floor: req.body.floor, area: req.body.area,
      location: req.body.location
    },
      { company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, countquantity: 1, employeenameto: 1, addedby: 1, handover: 1 });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});




exports.getOverallStockTableSort = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, searchQuery } = req.body;

  let allusers;
  let totalProjects, paginatedData, isEmptyData, result;

  try {
    // const query = searchQuery ? { companyname: { $regex: searchQuery, $options: 'i' } } : {};
    const anse = await Stock.find()
    const searchOverTerms = searchQuery?.toLowerCase()?.split(" ");
    const filteredDatas = anse?.filter((item, index) => {
      const itemString = JSON.stringify(item)?.toLowerCase();
      return searchOverTerms.every((term) => itemString.includes(term));
    })
    isEmptyData = searchOverTerms?.every(item => item.trim() === '');
    const pageSized = parseInt(pageSize);
    const pageNumberd = parseInt(page);

    paginatedData = filteredDatas.slice((pageNumberd - 1) * pageSized, pageNumberd * pageSize);

    totalProjects = await Stock.countDocuments();

    allusers = await Stock.find()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize));

    result = isEmptyData ? allusers : paginatedData

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  // return res.status(200).json({ count: allusers.length, allusers });
  return res.status(200).json({
    allusers,
    totalProjects,
    paginatedData,
    result,
    currentPage: (isEmptyData ? page : 1),
    totalPages: Math.ceil((isEmptyData ? totalProjects : paginatedData?.length) / pageSize),
  });
});



exports.getAllStockManagementViewDate = catchAsyncErrors(async (req, res, next) => {
  let stock;
  try {

    const { company, branch, unit, floor, area, location, productname, quantity, requestmode, status } = req.body;

    let query = {



      company: company,
      branch: branch,
      unit: unit,
      floor: floor,
      area: area,
      location: location,
      productname: productname,
      requestmode: requestmode,
      handover: { $exists: false }
    }
    // console.log(query, "qu")
    if (status == "Stock") {
      stock = await Stock.find(query, { company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, requestmode: 1, quantity: 1, addedby: 1 });
    } else {
      stock = await Manualstock.find(query, { company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, requestmode: 1, quantity: 1, addedby: 1 });

    }
  } catch (err) {
    console.log(err, "errecv")
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {

    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});

exports.getAllStockManagementViewDateStockMaterial = catchAsyncErrors(async (req, res, next) => {
  let stocklimited, manuallimited, stock = [];
  try {

    const { company, branch, unit, floor, area, location, productname, quantity, requestmode, status } = req.body;

    let query = {



      company: company,
      branch: branch,
      unit: unit,
      floor: floor,
      area: area,
      location: location,
      "stockmaterialarray.materialnew": productname,
      requestmode: requestmode,
      handover: { $exists: false }
    }
    // console.log(query, "qu")
    if (status == "Stock") {
      stock = await Stock.find(query, {
        company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, requestmode: 1, quantity: 1,
        addedby: 1, stockmaterialarray: 1
      });
    } else {
      stock = await Manualstock.find(query, {
        company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, requestmode: 1, quantity: 1,
        addedby: 1, stockmaterialarray: 1
      });
    }

    // console.log(stock, "stock")
  } catch (err) {
    // console.log(err, "errecv")
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {

    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});


exports.getAllStockManagementViewDateIndividual = catchAsyncErrors(async (req, res, next) => {
  let stock = [];
  try {

    // const {productname, requestmode } = req.body;

    // let query = {
    //   productname: productname,
    //   requestmode: requestmode,
    //   handover: "return"
    // }
    // stocklimited = await Stock.find(query, {
    //   company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, usercompany: 1, userbranch: 1, userunit: 1,
    //   userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1, countquantity: 1,
    //   requestmode: 1, quantity: 1, addedby: 1
    // });
    // manaullimited = await Manualstock.find(query, {
    //   company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, usercompany: 1, userbranch: 1, userunit: 1,
    //   userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1, countquantity: 1,
    //   requestmode: 1, quantity: 1, addedby: 1
    // });
    // stock =[...stocklimited,...manuallimited]
    const { productname, requestmode } = req.body;

    const queryMatch = {
      productname: productname,
      requestmode: requestmode,
      handover: "return"
    };

    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, usercompany: 1, userbranch: 1,
            userunit: 1, userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1, countquantity: 1,
            requestmode: 1, quantity: 1, addedby: 1,
            status: { $literal: "Stock" } // Adding status field
          }
        }
      ]),
      Manualstock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, usercompany: 1, userbranch: 1,
            userunit: 1, userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1, countquantity: 1,
            requestmode: 1, quantity: 1, addedby: 1,
            status: { $literal: "Manual" } // Adding status field
          }
        }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];


  } catch (err) {
    console.log(err, "errecv")
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {

    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});


exports.getAllStockManagementViewDateStockMaterialIndividual = catchAsyncErrors(async (req, res, next) => {
  let stock;
  try {

    // const { company, branch, unit, floor, area, location, productname,  requestmode } = req.body;

    // let query = {



    //   company: company,
    //   branch: branch,
    //   unit: unit,
    //   floor: floor,
    //   area: area,
    //   location: location,
    //   "stockmaterialarray.materialnew": productname,
    //   requestmode: requestmode,
    //   handover: "return"
    // }

    // stocklimited = await Stock.find(query, {
    //   company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, usercompany: 1, userbranch: 1, userunit: 1,
    //   userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1,
    //   requestmode: 1, quantity: 1, addedby: 1
    // });
    // manuallimited = await Manualstock.find(query, {
    //   company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, usercompany: 1, userbranch: 1, userunit: 1,
    //   userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1,
    //   requestmode: 1, quantity: 1, addedby: 1
    // });
    // stock = [...stocklimited, ...manuallimited]
    const { company, branch, unit, floor, area, location, productname, requestmode } = req.body;

    const queryMatch = {
      company: company,
      branch: branch,
      unit: unit,
      floor: floor,
      area: area,
      location: location,
      "stockmaterialarray.materialnew": productname,
      requestmode: requestmode,
      handover: "return"
    };

    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, usercompany: 1, userbranch: 1,
            userunit: 1, userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1,
            requestmode: 1, quantity: 1, addedby: 1,
            status: { $literal: "Stock" } // Adding a status field for identification
          }
        }
      ]),
      Manualstock.aggregate([
        { $match: queryMatch },
        {
          $project: {
            company: 1, branch: 1, unit: 1, floor: 1, area: 1, location: 1, productname: 1, usercompany: 1, userbranch: 1,
            userunit: 1, userfloor: 1, userarea: 1, userlocation: 1, useremployee: 1, userteam: 1,
            requestmode: 1, quantity: 1, addedby: 1,
            status: { $literal: "Manual" } // Adding a status field for identification
          }
        }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];


  } catch (err) {
    console.log(err, "errecv")
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {

    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});



exports.getAllStockPurchaseLimitedOverallReport = catchAsyncErrors(async (req, res, next) => {
  let stock = [];
  try {

    // stocklimited = await Stock.find({
    //   requestmode: req.body.assetmat, company: req.body.companyto,
    //   branch: { $in: req.body.branchto }, unit: { $in: req.body.unitto }, handover: { $in: req.body.status }

    // },

    //   {
    //     requestmode: 1, company: 1, branch: 1, unit: 1,
    //     usercompany: 1, userbranch: 1, userunit: 1, userfloor: 1, userarea: 1, userlocation: 1, userteam: 1,
    //     floor: 1, area: 1, location: 1, productname: 1, quantity: 1, stockmaterialarray: 1, countquantity: 1, employeenameto: 1, handover: 1, addedby: 1
    //   });


    // manuallimited = await Manualstock.find({
    //   requestmode: req.body.assetmat, company: req.body.companyto,
    //   branch: { $in: req.body.branchto }, unit: { $in: req.body.unitto }, handover: { $in: req.body.status }

    // },

    //   {
    //     requestmode: 1, company: 1, branch: 1, unit: 1,
    //     usercompany: 1, userbranch: 1, userunit: 1, userfloor: 1, userarea: 1, userlocation: 1, userteam: 1,
    //     floor: 1, area: 1, location: 1, productname: 1, quantity: 1, stockmaterialarray: 1, countquantity: 1, employeenameto: 1, handover: 1, addedby: 1
    //   });

    // stock = [...stocklimited, ...manuallimited]
    const { assetmat, companyto, branchto, unitto, status } = req.body;

    const queryMatch = {
      requestmode: assetmat,
      company: companyto,
      branch: { $in: branchto },
      unit: { $in: unitto },
      handover: { $in: status }
    };

    const projectionFields = {
      requestmode: 1, company: 1, branch: 1, unit: 1,
      usercompany: 1, userbranch: 1, userunit: 1, userfloor: 1, userarea: 1, userlocation: 1, userteam: 1,
      floor: 1, area: 1, location: 1, productname: 1, quantity: 1, stockmaterialarray: 1,
      countquantity: 1, employeenameto: 1, handover: 1, addedby: 1
    };

    const [stocklimited, manuallimited] = await Promise.all([
      Stock.aggregate([
        { $match: queryMatch },
        { $project: projectionFields }
      ]),
      Manualstock.aggregate([
        { $match: queryMatch },
        { $project: projectionFields }
      ])
    ]);

    stock = [...stocklimited, ...manuallimited];


    console.log(stock, "stockelskfj")
    // console.log(req.body.status, "Status")
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});


exports.getAllStockExcelDownloadStock = catchAsyncErrors(async (req, res, next) => {
  let stock;
  try {
    stock = await Stock.find({}, {
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
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stock) {
    return next(new ErrorHandler("Stock not found!", 404));
  }
  return res.status(200).json({
    stock,
  });
});


const capitalizeHeader = (str) => {
  return str
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
};

// exports.getAllStockExcelDownloadAsset = catchAsyncErrors(async (req, res, next) => {
//   let stock;

//   try {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Data");

//     // Fetch the first document to define headers
//     const firstDoc = await Stock.findOne({}, {
//       company: 1,
//       branch: 1,
//       unit: 1,
//       floor: 1,
//       area: 1,
//       location: 1,
//       requestmode: 1,
//       stockcategory: 1,
//       stocksubcategory: 1,
//       quantitynew: 1,
//       uomnew: 1,
//       materialnew: 1,
//       productdetailsnew: 1,
//       gstno: 1,
//       billno: 1,
//       warrantydetails: 1,
//       warranty: 1,
//       purchasedate: 1,
//       billdate: 1,
//       rate: 1,
//       vendorgroup: 1,
//       vendor: 1,
//       stockmaterialarray: 1,
//       quantitynew: 1
//     }).lean();
//     if (!firstDoc) return res.status(404).send("No data found");

//     // Define headers dynamically
//     const headers = Object.keys(firstDoc).map((key) => ({
//       header: capitalizeHeader(key), // Capitalized Header
//       key,
//     }));
//     worksheet.columns = headers;

//     // Set response headers to stream the file
//     res.setHeader("Content-Disposition", "attachment; filename=data.xlsx");
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

//     // Create a stream
//     const stream = new PassThrough();
//     workbook.xlsx.write(stream).then(() => stream.end());

//     // Pipe the stream to response
//     stream.pipe(res);

//     // Stream data from MongoDB and write rows to Excel
//     const dataStream = Stock.find({}, {
//       company: 1,
//       branch: 1,
//       unit: 1,
//       floor: 1,
//       area: 1,
//       location: 1,
//       requestmode: 1,
//       stockcategory: 1,
//       stocksubcategory: 1,
//       quantitynew: 1,
//       uomnew: 1,
//       materialnew: 1,
//       productdetailsnew: 1,
//       gstno: 1,
//       billno: 1,
//       warrantydetails: 1,
//       warranty: 1,
//       purchasedate: 1,
//       billdate: 1,
//       rate: 1,
//       vendorgroup: 1,
//       vendor: 1,
//       stockmaterialarray: 1,
//       quantitynew: 1
//     }).cursor();
//     for await (let doc of dataStream) {
//       worksheet.addRow(doc);
//     }

//     await workbook.xlsx.write(res);
//   }
//   catch (err) {
//     console.log(err, "err")
//     return next(new ErrorHandler("Records not found!", 404));
//   }
//   if (!stock) {
//     return next(new ErrorHandler("Stock not found!", 404));
//   }
//   return res.status(200).json(
//     "download successfully",
//   );
// });



// Route to Export Large MongoDB Data to Excel


// exports.getAllStockExcelDownloadAsset = async (req, res, next) => {
//   try {
//     const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({ stream: new PassThrough() });
//     const worksheet = workbook.addWorksheet("Stock Data");

//     // Define Headers Dynamically
//     const firstDoc = await Stock.findOne({ requestmode: req.body.mode }).lean();
//     if (!firstDoc) return res.status(404).send("No data found");

//     const headers = Object.keys(firstDoc).map((key) => ({
//       header: key.charAt(0).toUpperCase() + key.slice(1), // Capitalized Header
//       key,
//     }));
//     worksheet.columns = headers;

//     // Set Response Headers for Streaming
//     res.setHeader("Content-Disposition", "attachment; filename=stock_data.xlsx");
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

//     // Create a Stream and Pipe It to Response
//     const stream = new PassThrough();
//     workbook.stream.pipe(res);

//     // MongoDB Cursor for Streaming Large Data Efficiently
//     const dataStream = Stock.find({ requestmode: req.body.mode })
//       .select(headers.map(h => h.key).join(" ")) // Fetch only necessary fields
//       .lean()
//       .cursor();

//     for await (let doc of dataStream) {
//       worksheet.addRow(doc).commit(); // Write each row to stream directly
//     }

//     await workbook.commit(); // Finish writing and flush the stream
//     stream.end();

//   } catch (err) {
//     console.error("Export error:", err);
//     return next(new ErrorHandler("Error exporting data", 500));
//   }
// };

// exports.getAllStockExcelDownloadAsset = async (req, res, next) => {
//   try {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Stock Data");

//     // Set response headers to stream the file
//     res.setHeader("Content-Disposition", "attachment; filename=stock_data.xlsx");
//     res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

//     // Aggregation pipeline to stream data directly
//     const dataStream = Stock.aggregate([
//       {
//         $match: { requestmode: req.body.mode }, // Filter based on mode or other parameters
//       },
//       {
//         $project: { // Only include the required fields
//           company: 1,
//           branch: 1,
//           unit: 1,
//           floor: 1,
//           area: 1,
//           location: 1,
//           requestmode: 1,
//           vendorgroup: 1,
//           vendor: 1,
//           gstno: 1,
//           billno: 1,
//           assettype: 1,
//           producthead: 1,
//           productname: 1,
//           warranty: 1,
//           purchasedate: 1,
//           productdetails: 1,
//           warrantydetails: 1,
//           quantity: 1,
//           uom: 1,
//           rate: 1,
//           billdate: 1
//         }
//       },
//     ]).cursor(); // MongoDB cursor for streaming data

//     // Stream data to Excel row by row
//     for await (let doc of dataStream) {
//       worksheet.addRow(doc); // Add each document as a row
//     }

//     // After all data has been written, send the Excel file to client
//     await workbook.xlsx.write(res); // Directly write Excel to response stream
//     res.end(); // End the response after data is written

//   } catch (err) {
//     console.error("Export error:", err);
//     return next(new ErrorHandler("Error exporting data", 500));
//   }
// };


exports.getAllStockExcelDownloadAsset = async (req, res, next) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Stock Data");

    // Set response headers to stream the file
    res.setHeader("Content-Disposition", "attachment; filename=stock_data.xlsx");
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

    // Aggregation pipeline to stream data directly from MongoDB
    // console.log(req.body.mode, "mode")
    const dataStream = Stock.aggregate([
      { $match: { requestmode: req.body.mode } },
      {
        $project: {
          company: 1,
          branch: 1,
          unit: 1,
          floor: 1,
          area: 1,
          location: 1,
          requestmode: 1,
          vendorgroup: 1,
          vendor: 1,
          gstno: 1,
          billno: 1,
          assettype: 1,
          producthead: 1,
          productname: 1,
          warranty: 1,
          purchasedate: 1,
          productdetails: 1,
          warrantydetails: 1,
          quantity: 1,
          uom: 1,
          rate: 1,
          billdate: 1
        }
      }
    ]).cursor();

    // Add headers dynamically if you want
    const headers = [
      { header: 'Company', key: 'company' },
      { header: 'Branch', key: 'branch' },
      { header: 'Unit', key: 'unit' },
      { header: 'Floor', key: 'floor' },
      { header: 'Area', key: 'area' },
      { header: 'Location', key: 'location' },
      { header: 'Request Mode', key: 'requestmode' },
      { header: 'Vendor Group', key: 'vendorgroup' },
      { header: 'Vendor', key: 'vendor' },
      { header: 'GST No', key: 'gstno' },
      { header: 'Bill No', key: 'billno' },
      { header: 'Asset Type', key: 'assettype' },
      { header: 'Product Head', key: 'producthead' },
      { header: 'Product Name', key: 'productname' },
      { header: 'Warranty', key: 'warranty' },
      { header: 'Purchase Date', key: 'purchasedate' },
      { header: 'Product Details', key: 'productdetails' },
      { header: 'Warranty Details', key: 'warrantydetails' },
      { header: 'Quantity', key: 'quantity' },
      { header: 'UOM', key: 'uom' },
      { header: 'Rate', key: 'rate' },
      { header: 'Bill Date', key: 'billdate' }
    ];

    worksheet.columns = headers;

    // Stream data to Excel row by row
    for await (let doc of dataStream) {
      // console.log(doc, "doc")
      worksheet.addRow(doc); // Add each document as a row in Excel
    }

    // Once all data is streamed, write the workbook to the response
    await workbook.xlsx.write(res);
    res.end(); // End the response to finalize the download

  } catch (err) {
    console.error("Export error:", err);
    return next(new ErrorHandler("Error exporting data", 500));
  }
};




exports.getAllStockPdfDownloadAssetPDF = async (req, res, next) => {
  try {
    // Create a new PDF document
    const doc = new PDFDocument();

    // Set response headers to stream the PDF file
    res.setHeader("Content-Disposition", "attachment; filename=stock_data.pdf");
    res.setHeader("Content-Type", "application/pdf");

    // Pipe the document to the response object
    doc.pipe(res);

    // Fetch data from MongoDB
    const dataStream = Stock.aggregate([
      { $match: { requestmode: req.body.mode } },
      {
        $project: {
          company: 1,
          branch: 1,
          unit: 1,
          floor: 1,
          area: 1,
          location: 1,
          requestmode: 1,
          vendorgroup: 1,
          vendor: 1,
          gstno: 1,
          billno: 1,
          assettype: 1,
          producthead: 1,
          productname: 1,
          warranty: 1,
          purchasedate: 1,
          productdetails: 1,
          warrantydetails: 1,
          quantity: 1,
          uom: 1,
          rate: 1,
          billdate: 1
        }
      }
    ]).cursor();

    // Add title or header to the PDF document
    doc.fontSize(18).text('Stock Data Report', { align: 'center' });
    doc.moveDown();

    // Add table headers
    const headers = [
      'Company', 'Branch', 'Unit', 'Floor', 'Area', 'Location', 'Request Mode',
      'Vendor Group', 'Vendor', 'GST No', 'Bill No', 'Asset Type', 'Product Head',
      'Product Name', 'Warranty', 'Purchase Date', 'Product Details', 'Warranty Details',
      'Quantity', 'UOM', 'Rate', 'Bill Date'
    ];

    doc.fontSize(12).text(headers.join(' | '), { align: 'center' });
    doc.moveDown();

    // Add data rows to the PDF
    for await (let docData of dataStream) {
      const row = [
        docData.company, docData.branch, docData.unit, docData.floor, docData.area,
        docData.location, docData.requestmode, docData.vendorgroup, docData.vendor,
        docData.gstno, docData.billno, docData.assettype, docData.producthead,
        docData.productname, docData.warranty, docData.purchasedate, docData.productdetails,
        docData.warrantydetails, docData.quantity, docData.uom, docData.rate, docData.billdate
      ];
      doc.text(row.join(' | '), { align: 'center' });
    }

    // Finalize the PDF document
    doc.end();
  } catch (err) {
    console.error("Export error:", err);
    return next(new ErrorHandler("Error exporting data", 500));
  }
};


//reorder
exports.getAllStockPurchaseLimitedReorder = catchAsyncErrors(async (req, res, next) => {

  try {

    const [stock, stockData, managestockitems] = await Promise.all([
      Stock.aggregate([
        {
          $match: {
            requestmode: req.body.assetmat,
            handover: { $exists: false },
            status: { $ne: "Transfer" },
          },
        },
        {
          $project: {
            requestmode: 1,
            company: 1,
            branch: 1,
            unit: 1,
            floor: 1,
            area: 1,
            location: 1,
            productname: 1,
            quantity: 1,
            stockmaterialarray: 1,
          },
        },
      ]),

      Stock.find(
        { handover: { $in: ["return", "handover", "usagecount"] }, requestmode: req.body.assetmat },
        {
          company: 1,
          branch: 1,
          unit: 1,
          floor: 1,
          area: 1,
          location: 1,
          productname: 1,
          countquantity: 1,
          employeenameto: 1,
          usagedate: 1,
          usagetime: 1,
          usercompany: 1,
          userbranch: 1,
          userunit: 1,
          userfloor: 1,
          userarea: 1,
          userlocation: 1,
          useremployee: 1,
          userteam: 1,
          description: 1,
          filesusagecount: 1,
          requestmode: 1,
          handover: 1, // Needed for filtering
        }
      ),
      Managestockitems.find({}, { itemname: 1, minimumquantity: 1 }),

    ]);

    // Split the data into separate arrays
    const stockreturn = stockData.filter((s) => s.handover === "return");
    const stockhand = stockData.filter((s) => s.handover === "handover");
    const stockusage = stockData.filter((s) => s.handover === "usagecount");


    return res.json({
      managestockitems,
      stock,
      stockreturn,
      stockhand,
      stockusage,
    });



  } catch (err) {
    console.log(err, "err"

    )
    return next(new ErrorHandler("Records not found!", 404));
  }

  // return res.status(200).json({
  //   stock,
  // });
});




const mergeChunksStock = async (fileName, totalChunks) => {
  const parentDir = path.join(__dirname, '..'); // C:/Users/backend
  const chunkDir = path.join(parentDir, '..', '..', 'mergeChunks');
  const mergedFilePath = path.join(parentDir, '..', '..', 'stock_files');

  console.log(parentDir, mergedFilePath, "parentDir")
  if (!fs.existsSync(mergedFilePath)) {
    fs.mkdirSync(mergedFilePath);
  }

  const writeStream = fs.createWriteStream(`${mergedFilePath}/${fileName}`);
  for (let i = 0; i < totalChunks; i++) {
    const chunkFilePath = `${chunkDir}/${fileName}.part_${i}`;
    const chunkBuffer = await fs.promises.readFile(chunkFilePath);
    writeStream.write(chunkBuffer);
    fs.unlinkSync(chunkFilePath); // Delete the individual chunk file after merging
  }

  writeStream.end();
  console.log("Chunks merged successfully");
};

exports.uploadChunkStock = [
  upload.single("file"),
  catchAsyncErrors(async (req, res, next) => {
    // console.log("Upload hit", req.file);

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const chunk = req.file.buffer;
    const chunkNumber = Number(req.body.chunkNumber);
    const totalChunks = Number(req.body.totalChunks);
    const fileName = req.body.originalname;
    const parentDir = path.join(__dirname, '..'); // C:/Users/backend
    const chunkDir = path.join(parentDir, '..', '..', 'mergeChunks');
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }

    const chunkFilePath = `${chunkDir}/${fileName}.part_${chunkNumber}`;

    try {
      await fs.promises.writeFile(chunkFilePath, chunk);

      if (chunkNumber === totalChunks - 1) {
        await mergeChunksStock(fileName, totalChunks);
        console.log("File merged successfully");
      }

      res.status(200).json({ message: "Chunk uploaded successfully" });
    } catch (error) {
      console.error("Error saving chunk:", error);
      res.status(500).json({ error: "Error saving chunk" });
    }
  }),
];






exports.getAllStockTodoDelete = catchAsyncErrors(async (req, res, next) => {
  const { filenames } = req.body; // Expect an array of filenames

  try {
    if (!filenames || filenames.length === 0) {
      return res.status(400).json({ error: "No filenames provided." });
    }
    console.log(filenames.length, filenames[0], __dirname, "filename");
    let deletedFiles = [];
    let notFoundFiles = [];

    filenames.forEach((file) => {
      const parentDir = path.join(__dirname, ".."); // C:/Users/backend
      const filePath = path.join(parentDir, "..", "..", "mergeChunks", file);
      // const filePath = path.join(__dirname, "../../../merged_files", file);
      console.log(filePath, "filePath");
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Delete the file
        deletedFiles.push(file);
      } else {
        notFoundFiles.push(file);
      }
    });

    res.json({
      message: "Deletion process completed.",
      deletedFiles,
      notFoundFiles,
    });
  } catch (err) {
    console.log(err, "errDEL");
  }
});

exports.getAllStockTodoEditFetch = catchAsyncErrors(async (req, res, next) => {
  try {
    const { filename } = req.body;

    const parentDir = path.join(__dirname, ".."); // C:/Users/backend
    const filePath = path.join(parentDir, "..", "..", "stock_files", filename);
    console.log(filename, "filename");
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }

    res.setHeader("Content-Type", mime.lookup(filename));
    res.setHeader("Content-Disposition", `inline; filename="${filename}"`);

    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.log(err, "erredtifetch");
  }
});

