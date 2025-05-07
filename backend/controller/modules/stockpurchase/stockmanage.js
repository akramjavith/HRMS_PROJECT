const Stockmanage = require("../../../model/modules/stockpurchase/stockmanage");
const Managestockitems = require("../../../model/modules/stockpurchase/managestockitems");
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


//get All Stockmanages =>/api/stockmanage
exports.getAllStockmanage = catchAsyncErrors(async (req, res, next) => {
  let stockmanage;
  try {
    stockmanage = await Stockmanage.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stockmanage) {
    return next(new ErrorHandler("Stockmanage not found!", 404));
  }
  return res.status(200).json({
    stockmanage,
  });
});

exports.getAllStockmanageOldQty = catchAsyncErrors(async (req, res, next) => {
  let stockmanage;
  try {
    stockmanage = await Stockmanage.find({ "stockmaterialarray.materialnew": req.body.material }, { stockmaterialarray: 1 });
    console.log(stockmanage, req.body, "stockmanage")
    let oldtotalqty = stockmanage.flatMap(item => item.stockmaterialarray).filter(d => d.materialnew == req.body.material).reduce((sum, item) => sum + Number(item.quantitynew), 0);
    console.log(oldtotalqty, "oldtotalqty")
    return res.status(200).json({
      oldtotalqty,
    });

  } catch (err) {
    console.log(err, "err")
    return next(new ErrorHandler("Records not found!", 404));
  }

});

exports.getAllStockmanageOldQtyEdit = catchAsyncErrors(async (req, res, next) => {
  let stockmanage;
  try {
    stockmanage = await Stockmanage.find({ "stockmaterialarray.materialnew": req.body.material, _id: { $ne: req.body.id } }, { stockmaterialarray: 1 });
    let oldtotalqty = stockmanage.flatMap(item => item.stockmaterialarray).filter(d => d.materialnew == req.body.material).reduce((sum, item) => sum + Number(item.quantitynew), 0);
    return res.status(200).json({
      oldtotalqty,
    });

  } catch (err) {
    console.log(err, "err")
    return next(new ErrorHandler("Records not found!", 404));
  }

});

exports.getAllStockmanageAlertCount = catchAsyncErrors(async (req, res, next) => {
  let stockmanage, stockitems;

  try {
    // stockmanage = await Stockmanage.find({}, { requestmode: 1, stockmaterialarray: 1 });
    stockmanage = await Managestockitems.find({ itemname: req.body.itemname }, { maximumquantity: 1 });
    // console.log(stockmanage)
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!stockmanage) {
    return next(new ErrorHandler("Stockmanage not found!", 404));
  }



  return res.status(200).json({
    stockmanage,
  });
});







exports.getAllStockmanageAccess = catchAsyncErrors(async (req, res, next) => {
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
        // if (filter.column == "purchasedate") {
        //   const [day, month, year] = filter.value.split("/")
        //   let formattedValue = `${year}-${month}-${day}`
        //   conditions.push(createFilterCondition(filter.column, filter.condition, formattedValue));
        // }
        // else {

        conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
        // }
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
      "company", "branch", "unit", "floor", "area", "location", "material",
      "workstation", "requestmode", "asset", "assettype", "requesttime", "requestdate", "expectdays", "duedate",
      "material", "component", "productdetails", "uom"
    ];

    const orConditions = regexTerms.map((regex) => {

      if (typeof regex === "number") {
        // Special case for numeric values
        return {
          $or: [{ quantity: regex }], // Match numeric fields
        };
      }

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

    const totalProjects = await Stockmanage.countDocuments(query);

    // const totalProjectsData = await Stockmanage.find(queryoverall, {
    //   company: 1,
    //   branch: 1,
    //   unit: 1,
    //   requesttime: 1,
    //   requestdate: 1,
    //   duedate: 1,
    //   expectdays: 1,
    //   floor: 1,
    //   area: 1,
    //   location: 1,
    //   workstation: 1,
    //   requestmode: 1,
    //   asset: 1,
    //   assettype: 1,
    //   material: 1,
    //   component: 1,
    //   subcomponent: 1,
    //   productdetails: 1,
    //   stockmaterialarray: 1,
    //   uom: 1,
    //   quantity: 1
    // }).lean();

    const result = await Stockmanage.find(query, {
      company: 1,
      branch: 1,
      unit: 1,
      requesttime: 1,
      requestdate: 1,
      material: 1,
      duedate: 1,
      expectdays: 1,
      floor: 1,
      area: 1,
      location: 1,
      workstation: 1,
      requestmode: 1,
      asset: 1,
      assettype: 1,
      material: 1,
      component: 1,
      subcomponent: 1,
      productdetails: 1,
      stockmaterialarray: 1,
      uom: 1,
      quantity: 1
    })
      .select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    console.log(result.length, 'resultstock')
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



exports.getAllStockmanageAccessStock = catchAsyncErrors(async (req, res, next) => {
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
    requestmode: "Stock Material"

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

  queryoverall = { $or: branchFilterOverall, requestmode: "Stock Material" };


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
  // if (allFilters && allFilters.length > 0) {
  //   allFilters.forEach(filter => {
  //     console.log(filter, "filterstock")
  //     if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {


  //       conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));

  //     }
  //   });
  // }

  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach(filter => {
      // console.log(filter, "filterstock");

      if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {

        // Handle special case for `stockmaterialarray`
        if (["uomnew", "quantitynew", "materialnew", "productdetailsnew", "uomcodenew"].includes(filter.column)) {
          const condition = {};

          // Convert numeric filter values to string if required (e.g., for quantitynew)
          const filterValue = typeof filter.value === "number" ? filter.value.toString() : filter.value;

          condition["stockmaterialarray"] = {
            $elemMatch: createFilterCondition(filter.column, filter.condition, filterValue),
          };

          conditions.push(condition);
        } else {
          // Handle regular fields
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
      "requesttime", "requestdate", "expectdays", "duedate", "warrantydetails", "uom"
    ];

    const orConditions = regexTerms.map((regex) => {
      console.log(regex, "regex")



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
                  // {
                  //   quantitynew: typeof regex === "number"
                  //     ? regex.toString() // Convert number to string
                  //     : regex, // Use regex directly if not a number
                  // },
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
  // console.log(conditions, "conditionsstock")
  try {

    const totalProjects = await Stockmanage.countDocuments(query);

    // const totalProjectsData = await Stockmanage.find(queryoverall, {
    //   company: 1,
    //   branch: 1,
    //   unit: 1,
    //   requesttime: 1,
    //   requestdate: 1,
    //   duedate: 1,
    //   expectdays: 1,
    //   floor: 1,
    //   area: 1,
    //   location: 1,
    //   workstation: 1,
    //   requestmode: 1,
    //   asset: 1,
    //   assettype: 1,
    //   material: 1,
    //   component: 1,
    //   subcomponent: 1,
    //   productdetails: 1,
    //   stockmaterialarray: 1,
    //   stockcategory: 1,
    //   stocksubcategory: 1,
    //   uom: 1,
    //   quantity: 1
    // }).lean();

    const result = await Stockmanage.find(query, {
      company: 1,
      branch: 1,
      unit: 1,
      requesttime: 1,
      requestdate: 1,
      duedate: 1,
      expectdays: 1,
      floor: 1,
      area: 1,
      location: 1,
      workstation: 1,
      requestmode: 1,
      asset: 1,
      assettype: 1,
      material: 1,
      component: 1,
      subcomponent: 1,
      productdetails: 1,
      stockmaterialarray: 1,
      stockcategory: 1,
      stocksubcategory: 1,
      uom: 1,
      quantity: 1
    })
      .select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    console.log(result.length, 'resultasset')
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













exports.getAllStockmanageFiltered = catchAsyncErrors(async (req, res, next) => {
  let stockmanage;
  try {
    stockmanage = await Stockmanage.find({ updating: "" });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stockmanage) {
    return next(new ErrorHandler("Stockmanage not found!", 404));
  }
  return res.status(200).json({
    stockmanage,
  });
});



exports.getAllStockmanageFilteredAccess = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery, company, branch, unit, requestmode } = req.body;

  let query = {};
  // Construct the filter query based on the assignbranch array
  const branchFilter = assignbranch.map((branchObj) => ({
    branch: branchObj.branch,
    company: branchObj.company,
    unit: branchObj.unit
  }));
  filterQuery = { $or: branchFilter };

  query = {
    // $or: [
    //   { updating: "" },
    //   { updating: { $exists: false } }
    // ],
    updating: "",
    mode: "Rejected",
    ...filterQuery,


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
  if (requestmode && requestmode?.length > 0) {
    query.requestmode = { $in: requestmode }
  }

  let queryoverall = {};
  // Construct the filter query based on the assignbranch array
  const branchFilterOverall = assignbranch.map((branchObj) => ({
    branch: branchObj.branch,
    company: branchObj.company,
    unit: branchObj.unit,

  }));
  let filterQueryoverall = { $or: branchFilterOverall };

  queryoverall = {
    // $or: [
    //   { updating: "" },
    //   { updating: { $exists: false } }
    // ],
    updating: "",
    mode: "Rejected",
    ...filterQueryoverall,
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
  if (requestmode && requestmode?.length > 0) {
    queryoverall.requestmode = { $in: requestmode }
  }
  let conditions = [];

  // Advanced search filter
  // if (allFilters && allFilters.length > 0) {
  //   allFilters.forEach(filter => {
  //     console.log(filter, "filterstock")
  //     if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {


  //       conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));

  //     }
  //   });
  // }

  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach(filter => {
      // console.log(filter, "filterstock");

      if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {

        // Handle special case for `stockmaterialarray`
        if (["uomnew", "quantitynew", "materialnew", "productdetailsnew", "uomcodenew"].includes(filter.column)) {
          const condition = {};

          // Convert numeric filter values to string if required (e.g., for quantitynew)
          const filterValue = typeof filter.value === "number" ? filter.value.toString() : filter.value;

          condition["stockmaterialarray"] = {
            $elemMatch: createFilterCondition(filter.column, filter.condition, filterValue),
          };

          conditions.push(condition);
        } else {
          // Handle regular fields
          conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
        }
      }
    });
  }

  // if (allFilters && allFilters.length > 0) {

  //   allFilters.forEach(filter => {
  //     console.log("Processing filter:", filter);

  //     if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
  //       let filterValue = filter.value;

  //       // Convert Date Format for date fields (DD/MM/YYYY -> YYYY-MM-DD)
  //       const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  //       if (["requestdate", "duedate"].includes(filter.column) && dateRegex.test(filter.value)) {
  //         const [day, month, year] = filter.value.split("/");
  //         filterValue = `${year}-${month}-${day}`;
  //       }

  //       // Handle `stockmaterialarray` fields
  //       if (["uomnew", "quantitynew", "materialnew", "productdetailsnew", "uomcodenew"].includes(filter.column)) {
  //         const condition = {};
  //         condition["stockmaterialarray"] = {
  //           $elemMatch: createFilterCondition(filter.column, filter.condition, filterValue),
  //         };
  //         conditions.push(condition);
  //       }
  //       // Handle `materialmode`
  //       else if (filter.column === "materialmode") {
  //         conditions.push({
  //           $or: [
  //             createFilterCondition("material", filter.condition, filterValue),
  //             { stockmaterialarray: { $elemMatch: createFilterCondition("materialnew", filter.condition, filterValue) } }
  //           ]
  //         });
  //       }
  //       // Handle `requestmode`
  //       else if (filter.column === "requestmode") {
  //         conditions.push(createFilterCondition("requestmode", filter.condition, filterValue));
  //       }
  //       // Regular fields
  //       else {
  //         conditions.push(createFilterCondition(filter.column, filter.condition, filterValue));
  //       }
  //     }
  //   });

  // }






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
      "company", "branch", "unit", "floor", "area", "location", "material",
      "workstation", "requestmode", "asset", "assettype", "duedate", "requestdate",
      "material", "component", "productdetails", "uom"
    ];

    const orConditions = regexTerms.map((regex) => {

      console.log(regex, "popo")
      if (typeof regex === "number") {

        // Special case for numeric values
        return {
          $or: [
            {
              requestmode: "Asset Material", quantity: regex
            }, // Match numeric fields (e.g., `quantity`)
            {
              // Add condition for array `stockmaterialarray`
              requestmode: "Stock Material",
              stockmaterialarray: {
                $elemMatch: {
                  // Convert quantitynew (string) to a number for comparison
                  quantitynew: {
                    $eq: regex.toString(), // Ensure we're comparing as strings if stored as string in DB
                  },
                },
              },
            },
          ],
        };
      }
      else {
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
                    { uomcodenew: regex }
                  ],
                },
              },
            },
          ],
        };
      }
    });

    query = {
      $and: [
        { updating: "" },
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
  // console.log(conditions, "conditionsstock")
  try {

    const totalProjects = await Stockmanage.countDocuments(query);

    // const totalProjectsData = await Stockmanage.find(queryoverall, {
    //   company: 1,
    //   requesttime: 1,
    //   requestdate: 1,
    //   duedate: 1,
    //   branch: 1,
    //   unit: 1,
    //   floor: 1,
    //   area: 1,
    //   location: 1,
    //   requestmode: 1,
    //   productdetails: 1,
    //   uom: 1,
    //   quantity: 1,
    //   uomnew: 1,
    //   quantitynew: 1,
    //   productdetailsnew: 1,
    //   stockmaterialarray: 1
    // });

    const result = await Stockmanage.find(query, {
      company: 1,
      requesttime: 1,
      requestdate: 1,
      duedate: 1,
      material: 1,
      branch: 1,
      unit: 1,
      floor: 1,
      area: 1,
      location: 1,
      requestmode: 1,
      productdetails: 1,
      uom: 1,
      quantity: 1,
      uomnew: 1,
      quantitynew: 1,
      productdetailsnew: 1,
      stockmaterialarray: 1
    })
      .select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    console.log(result.length, 'resultstock123')
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

exports.getAllStockmanageFilteredAccessHome = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery, company, branch, unit, requestmode } = req.body;

  let query = {};
  // Construct the filter query based on the assignbranch array
  const branchFilter = assignbranch.map((branchObj) => ({
    branch: branchObj.branch,
    company: branchObj.company,
    unit: branchObj.unit
  }));
  filterQuery = { $or: branchFilter };

  query = {
    // $or: [
    //   { updating: "" },
    //   { updating: { $exists: false } }
    // ],
    updating: "",
    mode: "Rejected",
    ...filterQuery,


  };


  let queryoverall = {};
  // Construct the filter query based on the assignbranch array
  const branchFilterOverall = assignbranch.map((branchObj) => ({
    branch: branchObj.branch,
    company: branchObj.company,
    unit: branchObj.unit,

  }));
  let filterQueryoverall = { $or: branchFilterOverall };

  queryoverall = {
    // $or: [
    //   { updating: "" },
    //   { updating: { $exists: false } }
    // ],
    updating: "",
    mode: "Rejected",
    ...filterQueryoverall,
  };


  let conditions = [];

  // Advanced search filter
  // if (allFilters && allFilters.length > 0) {
  //   allFilters.forEach(filter => {
  //     console.log(filter, "filterstock")
  //     if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {


  //       conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));

  //     }
  //   });
  // }

  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach(filter => {
      // console.log(filter, "filterstock");

      if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {

        // Handle special case for `stockmaterialarray`
        if (["uomnew", "quantitynew", "materialnew", "productdetailsnew", "uomcodenew"].includes(filter.column)) {
          const condition = {};

          // Convert numeric filter values to string if required (e.g., for quantitynew)
          const filterValue = typeof filter.value === "number" ? filter.value.toString() : filter.value;

          condition["stockmaterialarray"] = {
            $elemMatch: createFilterCondition(filter.column, filter.condition, filterValue),
          };

          conditions.push(condition);
        } else {
          // Handle regular fields
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
      "company", "branch", "unit", "floor", "area", "location", "material",
      "workstation", "requestmode", "asset", "assettype", "duedate", "requestdate",
      "material", "component", "productdetails", "uom"
    ];

    const orConditions = regexTerms.map((regex) => {

      if (typeof regex === "number") {

        // Special case for numeric values
        return {
          $or: [
            {
              requestmode: "Asset Material", quantity: regex
            }, // Match numeric fields (e.g., `quantity`)
            {
              // Add condition for array `stockmaterialarray`
              requestmode: "Stock Material",
              stockmaterialarray: {
                $elemMatch: {
                  // Convert quantitynew (string) to a number for comparison
                  quantitynew: {
                    $eq: regex.toString(), // Ensure we're comparing as strings if stored as string in DB
                  },
                },
              },
            },
          ],
        };
      }
      else {
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
                    { uomcodenew: regex }
                  ],
                },
              },
            },
          ],
        };
      }
    });

    query = {
      $and: [
        { updating: "" },
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
  // console.log(conditions, "conditionsstock")
  try {

    const totalProjects = await Stockmanage.countDocuments(query);


    const result = await Stockmanage.find(query, {
      company: 1,
      requesttime: 1,
      requestdate: 1,
      duedate: 1,
      material: 1,
      branch: 1,
      unit: 1,
      floor: 1,
      area: 1,
      location: 1,
      requestmode: 1,
      productdetails: 1,
      uom: 1,
      quantity: 1,
      uomnew: 1,
      quantitynew: 1,
      productdetailsnew: 1,
      stockmaterialarray: 1
    })
      .select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    console.log(result.length, 'resultstock123')
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


exports.getAllStockmanageFilteredAccessVerification = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery, company, branch, unit, requestmode } = req.body;

  let query = {};
  // Construct the filter query based on the assignbranch array
  const branchFilter = assignbranch.map((branchObj) => ({
    branch: branchObj.branch,
    company: branchObj.company,
    unit: branchObj.unit,
  }));
  filterQuery = { $or: branchFilter };

  query = {
    // $or: [
    //   { updating: "" },
    //   { updating: { $exists: false } }
    // ],
    mode: { $ne: "Rejected" },
    updating: "",
    ...filterQuery,


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
  if (requestmode && requestmode?.length > 0) {
    query.requestmode = { $in: requestmode }
  }

  let queryoverall = {};
  // Construct the filter query based on the assignbranch array
  const branchFilterOverall = assignbranch.map((branchObj) => ({
    branch: branchObj.branch,
    company: branchObj.company,
    unit: branchObj.unit,

  }));
  let filterQueryoverall = { $or: branchFilterOverall };

  queryoverall = {
    // $or: [
    //   { updating: "" },
    //   { updating: { $exists: false } }
    // ],
    mode: { $ne: "Rejected" },
    updating: "",
    ...filterQueryoverall,
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
  if (requestmode && requestmode?.length > 0) {
    queryoverall.requestmode = { $in: requestmode }
  }
  let conditions = [];



  // Advanced search filter
  // if (allFilters && allFilters.length > 0) {
  //   allFilters.forEach(filter => {
  //     // console.log(filter, "filterstock");

  //     if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {

  //       // Handle special case for `stockmaterialarray`
  //       if (["uomnew", "quantitynew", "materialnew", "productdetailsnew", "uomcodenew"].includes(filter.column)) {
  //         const condition = {};

  //         // Convert numeric filter values to string if required (e.g., for quantitynew)
  //         const filterValue = typeof filter.value === "number" ? filter.value.toString() : filter.value;

  //         condition["stockmaterialarray"] = {
  //           $elemMatch: createFilterCondition(filter.column, filter.condition, filterValue),
  //         };

  //         conditions.push(condition);
  //       } else {
  //         // Handle regular fields
  //         conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
  //       }
  //     }
  //   });
  // }

  // if (allFilters && allFilters.length > 0) {
  //   allFilters.forEach(filter => {
  //     if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {

  //       let filterValue = filter.value;

  //       // Check if the filter is for a date field
  //       const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  //       if (filter.column === "requestdate" || filter.column === "duedate" && dateRegex.test(filter.value)) {
  //         // Convert DD/MM/YYYY to YYYY-MM-DD
  //         const [day, month, year] = filter.value.split("/");
  //         filterValue = `${year}-${month}-${day}`;
  //       }
  //       console.log(filter.column, "cl")
  //       if (filter.column === "materialmode") {
  //         conditions.push({
  //           $or: [
  //             createFilterCondition("material", filter.condition, filterValue),
  //             createFilterCondition("materialnew", filter.condition, filterValue)
  //           ]
  //         });
  //       }

  //       // Handle special case for `stockmaterialarray`
  //       if (["uomnew", "quantitynew", "materialnew", "productdetailsnew", "uomcodenew"].includes(filter.column)) {
  //         const condition = {};
  //         condition["stockmaterialarray"] = {
  //           $elemMatch: createFilterCondition(filter.column, filter.condition, filterValue),
  //         };
  //         conditions.push(condition);
  //       } else {
  //         // Handle regular fields
  //         conditions.push(createFilterCondition(filter.column, filter.condition, filterValue));
  //       }
  //     }
  //   });
  // }

  if (allFilters && allFilters.length > 0) {

    allFilters.forEach(filter => {
      console.log("Processing filter:", filter);

      if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
        let filterValue = filter.value;

        // Convert Date Format for date fields (DD/MM/YYYY -> YYYY-MM-DD)
        const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
        if (["requestdate", "duedate"].includes(filter.column) && dateRegex.test(filter.value)) {
          const [day, month, year] = filter.value.split("/");
          filterValue = `${year}-${month}-${day}`;
        }

        // Handle `stockmaterialarray` fields
        if (["uomnew", "quantitynew", "materialnew", "productdetailsnew", "uomcodenew"].includes(filter.column)) {
          const condition = {};
          condition["stockmaterialarray"] = {
            $elemMatch: createFilterCondition(filter.column, filter.condition, filterValue),
          };
          conditions.push(condition);
        }
        // Handle `materialmode`
        else if (filter.column === "materialmode") {
          conditions.push({
            $or: [
              createFilterCondition("material", filter.condition, filterValue),
              { stockmaterialarray: { $elemMatch: createFilterCondition("materialnew", filter.condition, filterValue) } }
            ]
          });
        }
        // Handle `requestmode`
        else if (filter.column === "requestmode") {
          conditions.push(createFilterCondition("requestmode", filter.condition, filterValue));
        }
        // Regular fields
        else {
          conditions.push(createFilterCondition(filter.column, filter.condition, filterValue));
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
      "company", "branch", "unit", "floor", "area", "location", "requestdate", "duedate", "requesttime",
      "workstation", "requestmode", "asset", "assettype", "materialnew",
      "material", "component", "productdetails", "uom"
    ];

    const orConditions = regexTerms.map((regex) => {


      if (typeof regex === "number") {

        // Special case for numeric values
        return {
          $or: [
            {
              requestmode: "Asset Material", quantity: regex
            }, // Match numeric fields (e.g., `quantity`)
            {
              // Add condition for array `stockmaterialarray`
              requestmode: "Stock Material",
              stockmaterialarray: {
                $elemMatch: {
                  // Convert quantitynew (string) to a number for comparison
                  quantitynew: {
                    $eq: regex.toString(), // Ensure we're comparing as strings if stored as string in DB
                  },
                },
              },
            },
          ],
        };
      }
      else {
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
                    { uomcodenew: regex }
                  ],
                },
              },
            },
          ],
        };
      }
    });

    query = {
      $and: [
        { updating: "" },
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
  console.log(searchQuery, "searchQuery")

  // Apply logicOperator to combine conditions
  if (conditions.length > 0) {
    if (logicOperator === "AND") {
      query.$and = conditions;
    } else if (logicOperator === "OR") {
      query.$or = conditions;
    }
  }
  // console.log(conditions, "conditionsstock")
  try {

    const totalProjects = await Stockmanage.countDocuments(query);


    const result = await Stockmanage.find(query, {
      company: 1,
      requesttime: 1,
      requestdate: 1,
      duedate: 1,
      material: 1,
      branch: 1,
      unit: 1,
      floor: 1,
      area: 1,
      location: 1,
      requestmode: 1,
      productdetails: 1,
      uom: 1,
      quantity: 1,
      uomnew: 1,
      quantitynew: 1,
      productdetailsnew: 1,
      stockmaterialarray: 1
    })
      .select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    console.log(result.length, 'resultstock123')
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


exports.getAllStockmanageFilteredUpdateMove = catchAsyncErrors(async (req, res, next) => {
  let stockmanage;
  try {
    // stockmanage = await Stockmanage.find({ id: id });
    stockmanage = await Stockmanage.updateMany(
      { _id: req.body.id },
      { $set: { mode: "Rejected" } },
      { new: true }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!stockmanage) {
    return next(new ErrorHandler("Stockmanage not found!", 404));
  }
  return res.status(200).json({
    stockmanage,
  });
});


//create new stockmanage => /api/stockmanage/new
exports.addStockmanage = catchAsyncErrors(async (req, res, next) => {
  let astockmanage = await Stockmanage.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single stockmanage=> /api/stockmanage/:id
exports.getSingleStockmanage = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sstockmanage = await Stockmanage.findById(id);
  if (!sstockmanage) {
    return next(new ErrorHandler("Stockmanage not found", 404));
  }
  return res.status(200).json({
    sstockmanage,
  });
});
//update stockmanage by id => /api/stockmanage/:id
exports.updateStockmanage = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let ustockmanage = await Stockmanage.findByIdAndUpdate(id, req.body);
  if (!ustockmanage) {
    return next(new ErrorHandler("Stockmanage not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});
//delete stockmanage by id => /api/stockmanage/:id
exports.deleteStockmanage = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dstockmanage = await Stockmanage.findByIdAndRemove(id);
  if (!dstockmanage) {
    return next(new ErrorHandler("Stockmanage not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});


















