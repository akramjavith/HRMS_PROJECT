const Paiddatefix = require("../../../model/modules/production/paiddatefix");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

const ExcelJS = require("exceljs");
const fastCsv = require("fast-csv");
const PdfPrinter = require("pdfmake");

// get All Paiddatefix => /api/Paiddatefix
exports.getAllPaiddatefix = catchAsyncErrors(async (req, res, next) => {
  let paiddatefixs;
  try {
    paiddatefixs = await Paiddatefix.find();
  } catch (err) {
    return next(new ErrorHandler("Data not found", 404));
  }
  if (!paiddatefixs) {
    return next(new ErrorHandler("Paiddatefix not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    paiddatefixs,
  });
});
// get All Paiddatefix => /api/Paiddatefix
exports.paidDateFixedFutureDatesOnly = catchAsyncErrors(async (req, res, next) => {
  let paiddatefixs;

  try {
    let currentDate = new Date().toISOString().split("T")[0];
    const { month, year } = req.body;
    const oldDate = new Date(`${year}-${month}-01`).toISOString().split("T")[0];
    let query = {}
    query.$or = [
      { date: { $gte: currentDate } }, // Current date check without afterexpiry
      { date: { $gte: oldDate }, afterexpiry: "Enable" } // Old date check with afterexpiry: "Enable"
    ]
    paiddatefixs = await Paiddatefix.find(query, { department: 1, date: 1, paymode: 1, });
  } catch (err) {
    return next(new ErrorHandler("Data not found", 404));
  }
  if (!paiddatefixs) {
    return next(new ErrorHandler("Paiddatefix not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    paiddatefixs,
  });
});

// get All Paiddatefix => /api/Paiddatefix
exports.getAllPaiddatefixFiltered = catchAsyncErrors(async (req, res, next) => {
  let paiddatefixs;
  const { month, year } = req.body
  try {
    paiddatefixs = await Paiddatefix.find({ month: month, year: year }, { department: 1, date: 1, paymode: 1, afterexpiry: 1 });
  } catch (err) {
    return next(new ErrorHandler("Data not found", 404));
  }
  if (!paiddatefixs) {
    return next(new ErrorHandler("Paiddatefix not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    paiddatefixs,
  });
});

// Create new Paiddatefix => /api/Paiddatefix/new
exports.addPaiddatefix = catchAsyncErrors(async (req, res, next) => {
  let aPaiddatefix = await Paiddatefix.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Paiddatefix => /api/Paiddatefix/:id
exports.getSinglePaiddatefix = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let spaiddatefix = await Paiddatefix.findById(id);

  if (!spaiddatefix) {
    return next(new ErrorHandler("Paiddatefix not found!", 404));
  }
  return res.status(200).json({
    spaiddatefix,
  });
});

// update Paiddatefix by id => /api/Paiddatefix/:id
exports.updatePaiddatefix = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let upaiddatefix = await Paiddatefix.findByIdAndUpdate(id, req.body);
  if (!upaiddatefix) {
    return next(new ErrorHandler("Paiddatefix not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Paiddatefix by id => /api/Paiddatefix/:id
exports.deletePaiddatefix = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dpaiddatefix = await Paiddatefix.findByIdAndRemove(id);

  if (!dpaiddatefix) {
    return next(new ErrorHandler("Paiddatefix not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.PaiddatefixSort = catchAsyncErrors(async (req, res, next) => {
  let totalProjects, result, totalPages, currentPage, totalCount, overallitems, totalDatas;

  const { allFilters, searchQuery, logicOperator } = req.body;
  try {
    const page = req.body.page || 1; // Get this value from the client request
    const limit = req.body.pageSize || 100; // Set a reasonable limit for the number of documents per page
    const searchTerm = req.body.searchQuery; // Get this value from the client request (e.g., from a query parameter)

    // Build the search criteria conditionally
    let searchCriteria = {};
    if (searchTerm) {
      const searchTermsArray = searchTerm.split(" ");
      const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

      searchCriteria = {
        $and: regexTerms.map((regex) => ({
          $or: [
            { department: regex },
            { month: regex },
            { year: regex },
            { date: regex },
            { paymode: regex },
          ],
        })),
      };
    }

    let conditions = [];

    // Advanced search filter
    if (allFilters && allFilters.length > 0) {
      allFilters.forEach(filter => {
        if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
          conditions.push(createFilterCondition(filter.column, filter.condition, filter.value));
        }
      });
    }

    if (searchQuery && searchQuery !== undefined) {
      const searchTermsArray = searchQuery.split(" ");
      const regexTerms = searchTermsArray.map((term) => new RegExp(term, "i"));

      const orConditions = regexTerms.map((regex) => ({
        $or: [
          { department: regex },
          { month: regex },
          { year: regex },
          { date: regex },
          { date: regex },
          { paymode: regex },
          { afterexpiry: regex },
        ],
      }));

      searchCriteria = {
        $and: [
          searchCriteria,
          // {
          //     $or: assignbranch.map(item => ({
          //         company: item.company,
          //         branch: item.branch,
          //     }))
          // },
          ...orConditions,
        ],
      };
    }

    // Apply logicOperator to combine conditions
    if (conditions.length > 0) {
      if (logicOperator === "AND") {
        searchCriteria.$and = conditions;
      } else if (logicOperator === "OR") {
        searchCriteria.$or = conditions;
      }
    }


    // Fetch all matching documents to get total count
    totalCount = await Paiddatefix.countDocuments(searchCriteria);
    totalDatas = await Paiddatefix.countDocuments();
    overallitems = await Paiddatefix.find({ department: 1, month: 1, year: 1, date: 1, paymode: 1, afterexpiry: 1 }).lean();

    // Fetch all matching documents for the search criteria if searchTerm is provided, otherwise fetch all documents
    const allMatchingDocs = searchTerm ? await Paiddatefix.find(searchCriteria).select("_id department month afterexpiry year date paymode").lean().exec() : await Paiddatefix.find(searchCriteria).select("_id department month afterexpiry year date paymode").lean().exec();

    // Perform pagination on all matching documents
    result = allMatchingDocs.slice((page - 1) * limit, page * limit);

    // if (!result) {
    //  return next(new ErrorHandler("SubCategoryprod not found!", 404));
    // }
    return res.status(200).json({
      // count: products.length,
      result,
      totalCount,
      totalDatas,
      overallitems
    });
  } catch (err) {
    console.log(err)
    return next(new ErrorHandler("Data not found", 404));
  }

});

// / get Signle Paiddatefix => /api/Paiddatefix/:id
exports.paidDateFixUpdateSingle = catchAsyncErrors(async (req, res, next) => {
  const { id, afterexpiry, name, date } = req.body;
  let spaiddatefix;
  try {
    const update = {
      $push: {
        updatedby: { name, date }
      },
      $set: {
        afterexpiry: afterexpiry
      }
    };

    const options = {
      new: true
    };

    spaiddatefix = await Paiddatefix.findOneAndUpdate(
      { _id: id },
      update,
      options
    );
  }
  catch (err) {

  }
  return res.status(200).json({
    spaiddatefix,
  });
});




exports.getpaiddatefixExcelDownload = catchAsyncErrors(async (req, res, next) => {

  try {

    const cursor = Paiddatefix.aggregate().cursor({ batchSize: 1000 });

    const workbook = new ExcelJS.stream.xlsx.WorkbookWriter({
      stream: res,
      useStyles: false, // Disable styles to reduce size
      useSharedStrings: false, // Reduce memory usage
    });

    let sheetIndex = 1;
    let rowCount = 0;
    let sheet = workbook.addWorksheet(`Sheet${sheetIndex}`);

    // Add headers
    let headers = ["Department",
      "Month",
      "Year",
      "Date",
      "Paymode",
      "After Expiry"];
    sheet.addRow(headers).commit();

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=PaidstatusList.xlsx");

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
          doc.department ?? "",
          doc.month ?? "",
          doc.year ?? "",
          doc.date ?? "",
          doc.paymode ?? "",
          doc.afterexpiry ?? ""

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

exports.getpaiddatefixCsvDownload = catchAsyncErrors(async (req, res, next) => {

  try {

    const cursor = Paiddatefix.aggregate().cursor({ batchSize: 1000 });

    // Set headers for CSV download
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=PaidstatusList.csv");

    const csvStream = fastCsv.format({ headers: true });

    csvStream.pipe(res); // Stream the CSV data directly to response


    for await (const doc of cursor) {
      csvStream.write({
        "department": doc.department ?? "",
        "month": doc.month ?? "",
        "year": doc.year ?? "",
        "date": doc.date ?? "",
        "paymode": doc.paymode ?? "",
      });
    }

    csvStream.end(); // Finalize the stream
  } catch (error) {
    console.error("Error generating CSV:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

exports.getAllpaiddatefixPdflDownload = catchAsyncErrors(async (req, res, next) => {

  try {

    const cursor = await Paiddatefix.aggregate().cursor({ batchSize: 1000 });

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
    let headers = ["Department",
      "Month",
      "Year",
      "Date",
      "Paymode",
      "After Expiry"];
    content.push({ text: "Salary Slab Process Report", font: "Helvetica", alignment: "center" });
    content.push({ text: `Generated on: ${new Date().toLocaleString()}`, font: "Helvetica", alignment: "right" });
    content.push("\n");

    let tableData = [headers];

    for await (const doc of cursor) {
      tableData.push([
        doc.department ?? "",
        doc.month ?? "",
        doc.year ?? "",
        doc.date ?? "",
        doc.paymode ?? "",
        doc.afterexpiry ?? ""
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
    res.setHeader("Content-Disposition", "attachment; filename=PaidstatusList.pdf");

    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(res); // ✅ Stream PDF directly to client
    pdfDoc.end();
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
