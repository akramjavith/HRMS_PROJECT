
const SalarySlab = require("../../../model/modules/setup/SalarySlabModel");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const ExcelJS = require("exceljs");
const fastCsv = require("fast-csv");
const PdfPrinter = require("pdfmake");

// get All SalarySlab => /api/salaryslabs
exports.getAllSalarySlab = catchAsyncErrors(async (req, res, next) => {
  let salaryslab;
  try {
    salaryslab = await SalarySlab.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!salaryslab) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    salaryslab,
  });
});

exports.getAllSalarySlabExport = catchAsyncErrors(async (req, res, next) => {
  let salaryslab;

  try {
    const { page, pageSize, allFilters, logicOperator, searchQuery, assignbranch, companies, branches, process } = req.body;
    let query = {
      $or: req.body.assignbranch.map(item => ({
        company: item.company,
        branch: item.branch,
      }))
    };

    if (companies?.length > 0) {
      query.company = { $in: companies };
    }
    if (branches?.length > 0) {
      query.branch = { $in: branches };
    }
    if (process?.length > 0) {
      query.processqueue = { $in: process };
    }

    console.log(query, "qeruy")
    salaryslab = await SalarySlab.find(query, {});
  } catch (err) {
    console.log(err, "salexport")
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!salaryslab) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    salaryslab,
  });
});

// get All SalarySlab => /api/salaryslabs
exports.getsalarySlabProcessFilter = catchAsyncErrors(async (req, res, next) => {
  let salaryslab, uniqueSalarySlab;
  try {
    salaryslab = await SalarySlab.find({ processqueue: req.body.process }, { salarycode: 1, processqueue: 1 });
    // uniqueSalarySlab = Array.from(new Set(salaryslab.map(item => item.salarycode)));

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!salaryslab) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    salaryslab,
  });
});

// get All SalarySlab => /api/salaryslabs
exports.salarySlabFilter = catchAsyncErrors(async (req, res, next) => {
  let salaryslab;
  try {

    salaryslab = await SalarySlab.find({}, {
      company: 1, branch: 1, salarycode: 1, basic: 1, hra: 1, salaryslablimited: 1,
      medicalallowance: 1, conveyance: 1, productionallowance: 1, productionallowancetwo: 1, otherallowance: 1, esipercentage: 1, esimaxsalary: 1,
      pfpercentage: 1, pfemployeepercentage: 1, esiemployeepercentage: 1

    });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!salaryslab) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    salaryslab,
  });
});


// Create new SalarySlab=> /api/salaryslab/new
exports.addSalarySlab = catchAsyncErrors(async (req, res, next) => {

  let asalaryslab = await SalarySlab.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle SalarySlab => /api/salaryslab/:id
exports.getSingleSalarySlab = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let ssalaryslab = await SalarySlab.findById(id);

  if (!ssalaryslab) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    ssalaryslab,
  });
});

// update SalarySlab by id => /api/salaryslab/:id
exports.updateSalarySlab = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let usalaryslab = await SalarySlab.findByIdAndUpdate(id, req.body);
  if (!usalaryslab) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete SalarySlab by id => /api/salaryslab/:id
exports.deleteSalarySlab = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dsalaryslab = await SalarySlab.findByIdAndRemove(id);

  if (!dsalaryslab) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});


exports.getsalarySlabProcessFilterSort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalPages, currentPage;

  const { frequency, page, pageSize } = req.body;
  try {

    totalProjects = await SalarySlab.countDocuments();


    result = await SalarySlab.find()
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


exports.getAllSalarySlabListFilter = catchAsyncErrors(async (req, res, next) => {
  let salaryslab;
  try {

    const { company, branch, process } = req.body;
    let query = {};

    if (company && company.length > 0) {
      query.company = { $in: company };
    }

    if (branch && branch.length > 0) {
      query.branch = { $in: branch };
    }

    if (process && process.length > 0) {
      query.processqueue = { $in: process };
    }



    salaryslab = await SalarySlab.find(query);

    return res.status(200).json({
      salaryslab,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

exports.salarySlabFilterAssignbranch = catchAsyncErrors(async (req, res, next) => {
  const { assignbranch } = req.body;



  const query = {}
  if (assignbranch.length > 0) {
    query.$or = assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
    }))
  };

  let salaryslab;
  try {

    salaryslab = await SalarySlab.find(query, {
      company: 1, branch: 1, salarycode: 1, basic: 1, hra: 1, salaryslablimited: 1,
      medicalallowance: 1, conveyance: 1, productionallowance: 1, productionallowancetwo: 1, otherallowance: 1, esipercentage: 1, esimaxsalary: 1,
      pfpercentage: 1, pfemployeepercentage: 1, esiemployeepercentage: 1

    });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!salaryslab) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    salaryslab,
  });
});


exports.getsalarySlabProcessFilterSortByAssignBranch = catchAsyncErrors(async (req, res, next) => {

  const { page, pageSize, allFilters, logicOperator, searchQuery, assignbranch, companies, branches, process } = req.body;

  let query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
    }))
  };



  let queryoverall = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
    }))
  };

  let conditions = [];


  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach(filter => {
      if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
        conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
      }
    });
  }

  if (searchQuery) {
    const searchTermsArray = searchQuery.split(" ");
    const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

    const orConditions = regexTerms.map((regex) => {
      const numValue = parseFloat(searchQuery); // Attempt to convert the searchQuery to a number
      const numericConditions = [];

      // Add numeric fields if conversion is successful
      if (!isNaN(numValue)) {
        numericConditions.push(
          { basic: numValue },
          { hra: numValue },
          { conveyance: numValue },
          { medicalallowance: numValue },
          { productionallowance: numValue },
          { productionallowancetwo: numValue },
          { otherallowance: numValue },
          { shiftallowance: numValue },
          { esipercentage: numValue },
          { esimaxsalary: numValue },
          { esiemployeepercentage: numValue },
          { pfpercentage: numValue },
          { pfemployeepercentage: numValue },

        );
      }

      return {
        $or: [
          { company: regex },
          { branch: regex },
          { salarycode: regex },   // String comparison for text-based fields
          { processqueue: regex },
          { checkinput: regex },
          ...numericConditions      // Add numeric comparisons
        ],
      };
    });

    query = {
      $and: [
        {
          $or: assignbranch.map(item => ({
            company: item.company,
            branch: item.branch,
          }))
        },
        ...orConditions,
      ],
    };
  }


  // Adding companies, branches, and processes filters if they exist
  if (companies?.length > 0) {
    query.company = { $in: companies };
    queryoverall.company = { $in: companies };
  }
  if (branches?.length > 0) {
    query.branch = { $in: branches };
    queryoverall.branch = { $in: branches };
  }
  if (process?.length > 0) {
    query.processqueue = { $in: process };
    queryoverall.processqueue = { $in: process };
  }



  // Apply logicOperator to combine conditions
  if (conditions.length > 0) {
    if (logicOperator === "AND") {
      query.$and = conditions;
    } else if (logicOperator === "OR") {
      query.$or = conditions;
    }
  }

  console.log(query);
  try {

    const totalProjects = await SalarySlab.countDocuments(query);
    const overallitems = await SalarySlab.find(queryoverall, { company: 1, branch: 1, processqueue: 1, salarycode: 1, basic: 1, hra: 1, conveyance: 1, medicalallownace: 1, productionallowance: 1, otherallowance: 1, shiftallowance: 1, esieducation: 1, pfeducation: 1, }).lean();
    const result = await SalarySlab.find(query)
      .select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();

    res.status(200).json({
      totalProjects,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
      overallitems
    });


  } catch (err) {
    console.log(err)
    return next(new ErrorHandler("Records not found!", 404));
  }
});




exports.salarySlabFilterAssignbranchHome = catchAsyncErrors(async (req, res, next) => {

  let salaryslab;
  try {

    salaryslab = await SalarySlab.find({ salarycode: { $in: req.body.processcode } }, {
      company: 1, branch: 1, salarycode: 1, basic: 1, hra: 1, salaryslablimited: 1,
      medicalallowance: 1, conveyance: 1, productionallowance: 1, productionallowancetwo: 1, otherallowance: 1, esipercentage: 1, esimaxsalary: 1,
      pfpercentage: 1, pfemployeepercentage: 1, esiemployeepercentage: 1

    });

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!salaryslab) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    salaryslab,
  });
});



//exports
// const extractNumbers = (str) => {
//   const numbers = str.match(/\d+/g);
//   return numbers ? numbers.map(Number)[0] : [];
// };

const extractNumbers = (str) => {
  const match = str.match(/\d+/);
  return match ? Number(match[0]) : null;
};
const extractText = (str) => {
  return str.replace(/\d+/g, '');
};


exports.getsalarySlabSearchExcelDownload = catchAsyncErrors(async (req, res, next) => {

  try {
    const {
      salaryrange,
      type,
      process,
      amountvalue,
      fromamount,
      toamount,
      company,
      branch,
      page,
      team,
      unit,
      pageSize,
    } = req.body;

    const amountValue = parseFloat(amountvalue);
    const fromAmount = parseFloat(fromamount);
    const toAmount = parseFloat(toamount);


    // Define the match conditions based on the inputs
    let matchConditions = {
      company: { $in: company },
      branch: { $in: branch },
    };

    let matchConditionsteamunit = {
      team: { $in: team },
      unit: { $in: unit },
    };


    if (type === "Process Wise") {
      matchConditions.processqueue = process;
    }
    let matchConditionsWithSalary = {}
    switch (salaryrange) {
      case "Less Than":
        matchConditionsWithSalary.grosstotal = { $lt: amountValue };
        break;
      case "Greater Than":
        matchConditionsWithSalary.grosstotal = { $gt: amountValue };
        break;
      case "Exact":
        matchConditionsWithSalary.grosstotal = { $eq: amountValue };
        break;
      case "Between":
        matchConditionsWithSalary.grosstotal = { $gte: fromAmount, $lte: toAmount };
        break;
      default: { }
    }




    const cursor = SalarySlab.aggregate([
      { $match: matchConditions },

      ...(type === "Amount Wise" ? [{ $match: { grosstotal: matchConditionsWithSalary.grosstotal } }] : []),


      // Lookup to fetch matching processteams based on company and branch
      {
        $lookup: {
          from: "processteams",
          let: { company: "$company", branch: "$branch", processqueue: "$processqueue" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$company", "$$company"] },
                    { $eq: ["$branch", "$$branch"] },
                    { $eq: ["$process", "$$processqueue"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0, // Exclude _id
                unit: 1,
                team: 1,
              },
            },
          ],
          as: "processteams",
        },
      },

      // Unwind to create multiple rows for each unit and team combination
      { $unwind: "$processteams" },

      // Add unit and team fields from the processteams array
      {
        $addFields: {
          unit: "$processteams.unit",
          team: "$processteams.team",
        },
      },

      // Remove the processteams array since we extracted the needed fields
      { $project: { processteams: 0 } },


      { $match: matchConditionsteamunit },

      {
        $lookup: {
          from: "targetpoints",
          let: { company: "$company", branch: "$branch", salarycode: "$salarycode" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$company", "$$company"] },
                    { $eq: ["$branch", "$$branch"] },
                    { $eq: ["$processcode", "$$salarycode"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                points: 1,
              },
            },
          ],
          as: "targetpoints",
        },
      },
      {
        $addFields: {
          targetPointsValue: {
            $ifNull: [{ $arrayElemAt: ["$targetpoints.points", 0] }, 0],
          },
        },
      },



      {
        $project: {

          targetPointsValue: 1,
          totalValue: "$grosstotal",
          salarycode: 1,
          company: 1,
          branch: 1,
          unit: 1, // Include unit in output
          team: 1, // Include team in output
          processqueue: 1,

        },
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
    let headers = ["Salary Amount", "Experience", "Process Code", "Target Points"];

    sheet.addRow(headers).commit();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=SalarySlabProcess.xlsx");

    for await (const doc of cursor) {
      // If row count exceeds 1 lakh, create a new sheet
      if (rowCount >= 100000) {
        sheetIndex++;
        rowCount = 0;
        sheet = workbook.addWorksheet(`Sheet${sheetIndex}`);
        sheet.addRow(headers).commit();
      }

      // Add row data
      sheet
        .addRow([
          doc.totalValue ?? "",

          extractNumbers(doc.salarycode) ?? "",
          extractText(doc.salarycode) ?? "",
          doc.targetPointsValue ?? "",
        ])
        .commit();

      rowCount++;
    }

    await workbook.commit(); // Finalize the workbook
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getsalarySlabSearchCsvDownload = catchAsyncErrors(async (req, res, next) => {

  try {
    const {
      salaryrange,
      type,
      process,
      amountvalue,
      fromamount,
      toamount,
      company,
      branch,
      page,
      team,
      unit,
      pageSize,
    } = req.body;

    const amountValue = parseFloat(amountvalue);
    const fromAmount = parseFloat(fromamount);
    const toAmount = parseFloat(toamount);


    // Define the match conditions based on the inputs
    let matchConditions = {
      company: { $in: company },
      branch: { $in: branch },
    };

    let matchConditionsteamunit = {
      team: { $in: team },
      unit: { $in: unit },
    };


    if (type === "Process Wise") {
      matchConditions.processqueue = process;
    }
    let matchConditionsWithSalary = {}
    switch (salaryrange) {
      case "Less Than":
        matchConditionsWithSalary.grosstotal = { $lt: amountValue };
        break;
      case "Greater Than":
        matchConditionsWithSalary.grosstotal = { $gt: amountValue };
        break;
      case "Exact":
        matchConditionsWithSalary.grosstotal = { $eq: amountValue };
        break;
      case "Between":
        matchConditionsWithSalary.grosstotal = { $gte: fromAmount, $lte: toAmount };
        break;
      default: { }
    }




    const cursor = SalarySlab.aggregate([
      { $match: matchConditions },

      ...(type === "Amount Wise" ? [{ $match: { grosstotal: matchConditionsWithSalary.grosstotal } }] : []),


      // Lookup to fetch matching processteams based on company and branch
      {
        $lookup: {
          from: "processteams",
          let: { company: "$company", branch: "$branch", processqueue: "$processqueue" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$company", "$$company"] },
                    { $eq: ["$branch", "$$branch"] },
                    { $eq: ["$process", "$$processqueue"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0, // Exclude _id
                unit: 1,
                team: 1,
              },
            },
          ],
          as: "processteams",
        },
      },

      // Unwind to create multiple rows for each unit and team combination
      { $unwind: "$processteams" },

      // Add unit and team fields from the processteams array
      {
        $addFields: {
          unit: "$processteams.unit",
          team: "$processteams.team",
        },
      },

      // Remove the processteams array since we extracted the needed fields
      { $project: { processteams: 0 } },


      { $match: matchConditionsteamunit },

      {
        $lookup: {
          from: "targetpoints",
          let: { company: "$company", branch: "$branch", salarycode: "$salarycode" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$company", "$$company"] },
                    { $eq: ["$branch", "$$branch"] },
                    { $eq: ["$processcode", "$$salarycode"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                points: 1,
              },
            },
          ],
          as: "targetpoints",
        },
      },
      {
        $addFields: {
          targetPointsValue: {
            $ifNull: [{ $arrayElemAt: ["$targetpoints.points", 0] }, 0],
          },
        },
      },



      {
        $project: {

          targetPointsValue: 1,
          totalValue: "$grosstotal",
          salarycode: 1,
          company: 1,
          branch: 1,
          unit: 1, // Include unit in output
          team: 1, // Include team in output
          processqueue: 1,

        },
      },
    ]).cursor({ batchSize: 1000 });
    // Set headers for CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=SalarySlabProcess.csv");

    const csvStream = fastCsv.format({ headers: true });

    csvStream.pipe(res); // Stream the CSV data directly to response


    for await (const doc of cursor) {
      csvStream.write({
        "Salary Amount": doc.totalValue,
        Experience: extractNumbers(doc.salarycode),
        "Process Code": extractText(doc.salarycode),

        "Target Points": doc.targetPointsValue,
      });
    }

    csvStream.end(); // Finalize the stream
  } catch (error) {
    console.error("Error generating CSV:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getAllSalarySlabSearchPdflDownload = catchAsyncErrors(async (req, res, next) => {

  try {
    const {
      salaryrange,
      type,
      process,
      amountvalue,
      fromamount,
      toamount,
      company,
      branch,
      page,
      team,
      unit,
      pageSize,
    } = req.body;

    const amountValue = parseFloat(amountvalue);
    const fromAmount = parseFloat(fromamount);
    const toAmount = parseFloat(toamount);


    // Define the match conditions based on the inputs
    let matchConditions = {
      company: { $in: company },
      branch: { $in: branch },
    };

    let matchConditionsteamunit = {
      team: { $in: team },
      unit: { $in: unit },
    };


    if (type === "Process Wise") {
      matchConditions.processqueue = process;
    }
    let matchConditionsWithSalary = {}
    switch (salaryrange) {
      case "Less Than":
        matchConditionsWithSalary.grosstotal = { $lt: amountValue };
        break;
      case "Greater Than":
        matchConditionsWithSalary.grosstotal = { $gt: amountValue };
        break;
      case "Exact":
        matchConditionsWithSalary.grosstotal = { $eq: amountValue };
        break;
      case "Between":
        matchConditionsWithSalary.grosstotal = { $gte: fromAmount, $lte: toAmount };
        break;
      default: { }
    }




    const cursor = SalarySlab.aggregate([
      { $match: matchConditions },

      ...(type === "Amount Wise" ? [{ $match: { grosstotal: matchConditionsWithSalary.grosstotal } }] : []),


      // Lookup to fetch matching processteams based on company and branch
      {
        $lookup: {
          from: "processteams",
          let: { company: "$company", branch: "$branch", processqueue: "$processqueue" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$company", "$$company"] },
                    { $eq: ["$branch", "$$branch"] },
                    { $eq: ["$process", "$$processqueue"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0, // Exclude _id
                unit: 1,
                team: 1,
              },
            },
          ],
          as: "processteams",
        },
      },

      // Unwind to create multiple rows for each unit and team combination
      { $unwind: "$processteams" },

      // Add unit and team fields from the processteams array
      {
        $addFields: {
          unit: "$processteams.unit",
          team: "$processteams.team",
        },
      },

      // Remove the processteams array since we extracted the needed fields
      { $project: { processteams: 0 } },


      { $match: matchConditionsteamunit },

      {
        $lookup: {
          from: "targetpoints",
          let: { company: "$company", branch: "$branch", salarycode: "$salarycode" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$company", "$$company"] },
                    { $eq: ["$branch", "$$branch"] },
                    { $eq: ["$processcode", "$$salarycode"] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 0,
                points: 1,
              },
            },
          ],
          as: "targetpoints",
        },
      },
      {
        $addFields: {
          targetPointsValue: {
            $ifNull: [{ $arrayElemAt: ["$targetpoints.points", 0] }, 0],
          },
        },
      },



      {
        $project: {

          targetPointsValue: 1,
          totalValue: "$grosstotal",
          salarycode: 1,
          company: 1,
          branch: 1,
          unit: 1, // Include unit in output
          team: 1, // Include team in output
          processqueue: 1,

        },
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
    let headers = ["Salary Amount", "Experience", "Process Code", "Target Points"];

    content.push({ text: "Salary Slab Process Report", font: "Helvetica", alignment: "center" });
    content.push({ text: `Generated on: ${new Date().toLocaleString()}`, font: "Helvetica", alignment: "right" });
    content.push("\n");

    let tableData = [headers];

    for await (const doc of cursor) {
      tableData.push([
        doc.totalValue ?? "-", extractNumbers(doc.salarycode) ?? "-",
        extractText(doc.salarycode) ?? "-", doc.targetPointsValue ?? "-"]);
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



exports.getsalarySlabListExcelDownload = catchAsyncErrors(async (req, res, next) => {

  try {
    const { frequency, page, pageSize, assignbranch, companies, branches, process } = req.body;

    const query = {
      $or: assignbranch.map(item => ({
        company: item.company,
        branch: item.branch,
      }))
    };
    // Adding companies, branches, and processes filters if they exist
    if (companies?.length > 0) {
      query.company = { $in: companies };
    }
    if (branches?.length > 0) {
      query.branch = { $in: branches };
    }
    if (process?.length > 0) {
      query.processqueue = { $in: process };
    }



    const cursor = SalarySlab.aggregate(query).cursor({ batchSize: 1000 });

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: false, // Disable styles to reduce size
      useSharedStrings: false, // Reduce memory usage
    });

    let sheetIndex = 1;
    let rowCount = 0;
    let sheet = workbook.addWorksheet(`Sheet${sheetIndex}`);

    // Add headers
    let headers = ["Company",
      "Branch",
      "Process Queue",
      "Salary Code",
      "Basic",
      "HRA",
      "Conveyance",
      "Medical Allowance",
      "Production Allowance",
      "Production Allowance 2",
      "Other Allowance",
      "Shift Allowance",
      "ESI Deduction",
      "PF Deduction",
      // "Salary Amount",
      "Experience",
      "Process Code",
      // "Target Points"
    ];

    sheet.addRow(headers).commit();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=SalarySlabProcess.xlsx");

    for await (const doc of cursor) {
      // If row count exceeds 1 lakh, create a new sheet
      if (rowCount >= 100000) {
        sheetIndex++;
        rowCount = 0;
        sheet = workbook.addWorksheet(`Sheet${sheetIndex}`);
        sheet.addRow(headers).commit();
      }

      // Add row data
      sheet
        .addRow([
          doc.company ?? "",
          doc.branch ?? "",
          doc.processqueue ?? "",
          doc.salarycode ?? "",
          doc.basic ?? "",
          doc.hra ?? "",
          doc.conveyance ?? "",
          doc.medicalallowance ?? "",
          doc.productionallowance ?? "",
          doc.productionallowancetwo ?? "",
          doc.otherallowance ?? "",
          doc.shiftallowance ?? "",
          doc.esideduction ?? "",
          doc.pfdeduction ?? "",
          // doc.totalValue ?? "", 
          doc.experience ?? "",
          doc.salarycode ?? "",
          // doc.targetPointsValue ?? ""
        ])
        .commit();

      rowCount++;
    }

    await workbook.commit(); // Finalize the workbook
  } catch (error) {
    console.error("Error generating Excel:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getsalarySlabListCsvDownload = catchAsyncErrors(async (req, res, next) => {

  try {
    const { frequency, page, pageSize, assignbranch, companies, branches, process } = req.body;

    const query = {
      $or: assignbranch.map(item => ({
        company: item.company,
        branch: item.branch,
      }))
    };
    // Adding companies, branches, and processes filters if they exist
    if (companies?.length > 0) {
      query.company = { $in: companies };
    }
    if (branches?.length > 0) {
      query.branch = { $in: branches };
    }
    if (process?.length > 0) {
      query.processqueue = { $in: process };
    }



    const cursor = SalarySlab.aggregate(query).cursor({ batchSize: 1000 });

    // Set headers for CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=SalarySlabProcess.csv");

    const csvStream = fastCsv.format({ headers: true });

    csvStream.pipe(res); // Stream the CSV data directly to response


    for await (const entry of cursor) {
      csvStream.write({
        "Company": entry.company,
        "Branch": entry.branch,
        "Process Queue": entry.processqueue,
        "Salary Code": entry.salarycode,
        "Basic": entry.basic,
        "HRA": entry.hra,
        "Conveyance": entry.conveyance,
        "Medical Allowance": entry.medicalallowance,
        "Production Allowance": entry.productionallowance,
        "Production Allowance 2": entry.productionallowancetwo,
        "Other Allowance": entry.otherallowance,
        "Shift Allowance": entry.shiftallowance,
        "ESI Deduction": entry.esideduction,
        "PF Deduction": entry.pfdeduction,
        // "Salary Amount": entry.totalValue, // Mapped to totalValue
        "Experience": entry.experience,
        "Process Code": entry.salarycode, // Using salarycode for Process Code
        // "Target Points": entry.targetPointsValue
      });
    }

    csvStream.end(); // Finalize the stream
  } catch (error) {
    console.error("Error generating CSV:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getAllSalarySlabListPdflDownload = catchAsyncErrors(async (req, res, next) => {

  try {
    const { frequency, page, pageSize, assignbranch, companies, branches, process } = req.body;

    const query = {
      $or: assignbranch.map(item => ({
        company: item.company,
        branch: item.branch,
      }))
    };
    // Adding companies, branches, and processes filters if they exist
    if (companies?.length > 0) {
      query.company = { $in: companies };
    }
    if (branches?.length > 0) {
      query.branch = { $in: branches };
    }
    if (process?.length > 0) {
      query.processqueue = { $in: process };
    }



    const cursor = SalarySlab.aggregate(query).cursor({ batchSize: 1000 });


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
    let headers = ["Company",
      "Branch",
      "Process Queue",
      "Salary Code",
      "Basic",
      "HRA",
      "Conveyance",
      "Medical Allowance",
      "Production Allowance",
      "Production Allowance 2",
      "Other Allowance",
      "Shift Allowance",
      "ESI Deduction",
      "PF Deduction",
      // "Salary Amount",
      "Experience",
      "Process Code",
      // "Target Points"
    ];
    content.push({ text: "Salary Slab Process Report", font: "Helvetica", alignment: "center" });
    content.push({ text: `Generated on: ${new Date().toLocaleString()}`, font: "Helvetica", alignment: "right" });
    content.push("\n");

    let tableData = [headers];

    for await (const doc of cursor) {
      tableData.push([
        doc.company ?? "",
        doc.branch ?? "",
        doc.processqueue ?? "",
        doc.salarycode ?? "",
        doc.basic ?? "",
        doc.hra ?? "",
        doc.conveyance ?? "",
        doc.medicalallowance ?? "",
        doc.productionallowance ?? "",
        doc.productionallowancetwo ?? "",
        doc.otherallowance ?? "",
        doc.shiftallowance ?? "",
        doc.esideduction ?? "",
        doc.pfdeduction ?? "",
        // doc.totalValue ?? "", 
        doc.experience ?? "",
        doc.salarycode ?? "",
        // doc.targetPointsValue ?? ""
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