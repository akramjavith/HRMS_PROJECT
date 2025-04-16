const ClientUserid = require("../../../model/modules/production/ClientUserIDModel")
const ProductionIndividual = require("../../../model/modules/production/productionindividual")
const Users = require("../../../model/login/auth")
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Hirerarchi = require("../../../model/modules/setup/hierarchy");
const DepartmentMonth = require("../../../model/modules/departmentmonthset");
const ExcelJS = require("exceljs");
const fastCsv = require("fast-csv");
const PdfPrinter = require("pdfmake");


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

// get All ProductionIndividual => /api/ProductionIndividuals
exports.getAllProductionIndividual = catchAsyncErrors(async (req, res, next) => {
  let productionIndividual;
  try {
    productionIndividual = await ProductionIndividual.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!productionIndividual) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productionIndividual,
  });
});

exports.getAllProductionIndividualLimited = catchAsyncErrors(async (req, res, next) => {
  let result, prodresult;
  try {

    prodresult = await ProductionIndividual.find({},
      {
        vendor: 1,
        datemode: 1,
        fromdate: 1,
        time: 1,
        filename: 1,
        category: 1,
        unitid: 1,
        user: 1,
        section: 1,
        flagcount: 1,
        alllogin: 1,
        docnumber: 1,
        doclink: 1,
        approvalstatus: 1,
        lateentrystatus: 1,
        startmode: 1,
        startdate: 1,
        starttime: 1,
        status: 1,
        totalpages: 1,
        flagcount: 1,
        pendingpages: 1,
        startpage: 1,
        reason: 1,
        statusmode: 1,
        enddate: 1,
        endtime: 1,
        notes: 1,
        addedby: 1,
        _id: 1
      }
    );


    let results = prodresult.filter((data, index) => {

      if (req?.body?.username === data?.addedby[0]?.name || req?.body?.companyname === data?.addedby[0]?.name) {
        return data
      }
    })

    result = req?.body?.access.includes("Manager") ? prodresult : results;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    result
  });
});

exports.getAllProductionIndividualDateFilter = catchAsyncErrors(async (req, res, next) => {
  let productionIndividualdate;
  try {
    productionIndividualdate = await ProductionIndividual.find({
      status: req.body.status,
      fromdate: { $gte: req.body.fromdate, $lte: req.body.todate }
    }, {});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!productionIndividualdate) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productionIndividualdate,
  });
});


exports.productionIndividualPDFDownload = catchAsyncErrors(async (req, res, next) => {
  const { vendor, category, filename, fromdate, statusmode, user } = req.body;
  try {
    let query = {

    };
    query.vendor = { $in: vendor };
    query.category = { $in: category };
    query.filename = { $in: filename };
    query.fromdate = fromdate;
    query.user = { $in: user };
    // query.statusmode = { $in: statusmode };

    const cursor = ProductionIndividual.aggregate([
      { $match: query },
      {
        $project: {
          _id: 0,
          vendor: 1,
          datemode: 1,
          fromdate: 1,
          time: 1,
          filename: 1,
          category: 1,
          unitid: 1,
          user: 1,
          section: 1,
          flagcount: 1,
          alllogin: 1,
          docnumber: 1,
          doclink: 1,
          startmode: 1,
          startdate: 1,
          starttime: 1,
          statusmode: 1,
          totalpages: 1,
          pendingpages: 1,
          startpage: 1,
          notes: 1

        },
      },
    ]);

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
      "Vendor", "Date Mode", "Date", "Time", "Category", "SubCategory",
      "Identifier", "Login Id", "Section", "Flag Count", "All Login", "Doc Number",
      "Doc Link", "Start Mode", "Start Date", "Start Time", "Status Mode",
      "Total Pages", "Pending Pages", "Start Page", "Remark/Notes"
    ];
    content.push({ text: "Production Report", font: "Helvetica", alignment: "center" });
    content.push({ text: `Generated on: ${new Date().toLocaleString()}`, font: "Helvetica", alignment: "right" });
    content.push("\n");

    let tableData = [headers];

    for await (const doc of cursor) {
      tableData.push([
        doc.vendor ?? "", doc.datemode ?? "", doc.fromdate ?? "", doc.time ?? "", doc.filename ?? "", doc.category ?? "",
        doc.unitid ?? "", doc.user ?? "", doc.section ?? "", doc.flagcount ?? "", doc.alllogin ?? "", doc.docnumber ?? "",
        doc.doclink ?? "", doc.startmode ?? "", doc.startdate ?? "", doc.starttime ?? "", doc.statusmode ?? "",
        doc.totalpages ?? "", doc.pendingpages ?? "", doc.startpage ?? "", doc.notes ?? ""
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







// Create new ProductionIndividual=> /api/ProductionIndividual/new
exports.addProductionIndividual = catchAsyncErrors(async (req, res, next) => {

  let aProductionIndividual = await ProductionIndividual.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle ProductionIndividual => /api/ProductionIndividual/:id
exports.getSingleProductionIndividual = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sProductionIndividual = await ProductionIndividual.findById(id);

  if (!sProductionIndividual) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    sProductionIndividual,
  });
});

// update ProductionIndividual by id => /api/ProductionIndividual/:id
exports.updateProductionIndividual = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uProductionIndividual = await ProductionIndividual.findByIdAndUpdate(id, req.body);
  if (!uProductionIndividual) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete ProductionIndividual by id => /api/ProductionIndividual/:id
exports.deleteProductionIndividual = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dProductionIndividual = await ProductionIndividual.findByIdAndRemove(id);

  if (!dProductionIndividual) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
function convertTo24HourFormat(time) {
  // Check if the time contains "AM/PM/am/pm"
  if (/am|pm/i.test(time)) {
    // Convert to 24-hour format
    const [hours, minutes, secondsPart] = time.split(/[: ]/);
    const period = time.slice(-2).toUpperCase(); // Extract AM/PM
    let hours24 = parseInt(hours, 10);

    if (period === 'PM' && hours24 !== 12) {
      hours24 += 12;
    } else if (period === 'AM' && hours24 === 12) {
      hours24 = 0;
    }

    // Format the time in 24-hour format
    return `${hours24.toString().padStart(2, '0')}:${minutes}:${secondsPart.slice(0, 2)}`;
  }
  // If already in 24-hour format, return as is
  return time;
}

exports.getAllProductionHierarchyList = catchAsyncErrors(
  async (req, res, next) => {
    let result,
      reportingtobaseduser,
      clientuserid,
      hierarchy,
      resultAccessFilter,
      secondaryhierarchyfinal,
      tertiaryhierarchyfinal,
      primaryhierarchyfinal,
      hierarchyfilter,
      filteredoverall,
      primaryhierarchy,
      hierarchyfilter1,
      secondaryhierarchy,
      hierarchyfilter2,
      tertiaryhierarchy,
      primaryhierarchyall,
      secondaryhierarchyall,
      tertiaryhierarchyall,
      branch,
      hierarchySecond,
      overallMyallList,
      hierarchyMap,
      resulted,
      resultedTeam,
      myallTotalNames,
      hierarchyFinal,
      hierarchyDefault,
      reportingusers, hierarchyfirstlevel;
    let resultAccessFilterHierarchy = [];
    let resultsectorother = []
    let filteredoverallsectorall = []

    const vendorNames = req.body.vendor.map((vendor) => vendor.value);
    try {
      const { listpageaccessmode } = req.body;
      let clientidsmap;
      let levelFinal = req.body?.sector === "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body?.sector]

      let finalDataRestrictList = []
      if (listpageaccessmode === "Reporting to Based") {
        let usersss = await User.find(
          {
            enquirystatus: {
              $nin: ["Enquiry Purpose"],
            },
            resonablestatus: {
              $nin: [
                "Not Joined",
                "Postponed",
                "Rejected",
                "Closed",
                "Releave Employee",
                "Absconded",
                "Hold",
                "Terminate",
              ],
            },
            reportingto: req.body.username,
          },
          {
            empcode: 1,
            companyname: 1,
          }
        ).lean();
        const companyNames = usersss.map((user) => user.companyname);
        let clientids = await ClientUserid.find(
          {
            // projectvendor: { $in: vendorNames },
            empname: { $in: companyNames },
          },
          { userid: 1 }
        ).lean();
        clientidsmap = clientids.map((user) => user.userid);
      }

      let prodresult = await ProductionIndividual.find(
        {
          vendor: { $in: vendorNames },

          status: {
            $nin: ["Approved", "Rejected"],
          },
          ...(listpageaccessmode === "Reporting to Based"
            ? { user: { $in: clientidsmap } }
            : {}),
        },
        {
          vendor: 1,
          filename: 1,
          category: 1,
          unitid: 1,
          user: 1,
          fromdate: 1,
          time: 1,
          section: 1,
          flagcount: 1,
          alllogin: 1,
          docnumber: 1,
          status: 1,
          approvalstatus: 1,
          lateentrystatus: 1,
          createdAt: 1,
          _id: 1,
        }
      );

      clientuserid = await ClientUserid.find(
        { loginallotlog: { $exists: true, $ne: [] } },
        { empname: 1, userid: 1, loginallotlog: 1, projectvendor: 1 }
      ).lean();

      result = prodresult.map((item) => {
        // const matchuser = clientuserid.find(d =>
        //     d.userid == item.user

        // )
        const uploadtime = convertTo24HourFormat(item.time)
        const loginInfo = clientuserid.find((d) => d.userid == item.user && d.projectvendor === item.vendor);
        let loginallot =
          loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

        let filteredDataDateTime = null;
        if (loginallot.length > 0) {
          const groupedByDateTime = {};

          // Group items by date and time
          loginallot.forEach((item) => {
            const dateTime = item.date + " " + item.time;
            if (!groupedByDateTime[dateTime]) {
              groupedByDateTime[dateTime] = [];
            }
            groupedByDateTime[dateTime].push(item);
          });

          // Extract the last item of each group
          const lastItemsForEachDateTime = Object.values(groupedByDateTime).map(
            (group) => group[group.length - 1]
          );

          // Sort the last items by date and time
          lastItemsForEachDateTime.sort((a, b) => {
            return (
              new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
            );
          });

          // Find the first item in the sorted array that meets the criteria

          for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
            const dateTime =
              lastItemsForEachDateTime[i].date +
              " " +
              lastItemsForEachDateTime[i].time;
            // let datevalsplit = item.mode === "Manual" ? "" : upload.dateval.split(" IST");
            let datevalsplitfinal = `${item.fromdate}T${uploadtime}Z`;
            if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
              filteredDataDateTime = lastItemsForEachDateTime[i];
            } else {
              break;
            }
          }
        }

        let logininfoname =
          loginallot.length > 0 && filteredDataDateTime
            ? filteredDataDateTime.empname
            : loginInfo
              ? loginInfo.empname
              : "";

        return {
          vendor: item.vendor,
          filename: item.filename,
          category: item.category,
          unitid: item.unitid,
          user: item.user,
          fromdate: item.fromdate,
          time: item.time,
          section: item.section,
          flagcount: item.flagcount,
          alllogin: item.alllogin,
          docnumber: item.docnumber,
          approvalstatus: item.approvalstatus,
          lateentrystatus: item.lateentrystatus,
          status: item.status,
          createdAt: item.createdAt,
          _id: item._id,
          companyname: logininfoname,
        };
      });
      resultsectorother = result
      //myhierarchy dropdown
      if (
        req.body.hierachy === "myhierarchy" &&
        (listpageaccessmode === "Hierarchy Based" ||
          listpageaccessmode === "Overall")
      ) {
        hierarchy = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: req.body.sector,
        });
        hierarchyDefault = await Hirerarchi.find({
          supervisorchoose: req.body.username,
        });

        let answerDef = hierarchyDefault.map((data) => data.employeename);

        hierarchyFinal =
          req.body.sector === "all"
            ? answerDef.length > 0
              ? [].concat(...answerDef)
              : []
            : hierarchy.length > 0
              ? [].concat(...hierarchy.map((item) => item.employeename))
              : [];

        hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

        hierarchyfilter = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: "Primary",
        });
        primaryhierarchy = hierarchyfilter.map((item) => item.employeename[0])
          ? hierarchyfilter.map((item) => item.employeename[0])
          : [];

        hierarchyfilter1 = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: "Secondary",
        });
        secondaryhierarchy = hierarchyfilter1.map(
          (item) => item.employeename[0]
        )
          ? hierarchyfilter1.map((item) => item.employeename[0])
          : [];

        hierarchyfilter2 = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: "Tertiary",
        });
        tertiaryhierarchy = hierarchyfilter2.map((item) => item.employeename[0])
          ? hierarchyfilter2.map((item) => item.employeename[0])
          : [];

        resulted = result
          .map((userObj) => {
            const matchingHierarchy = hierarchyDefault.find(
              (hierarchyObj) =>
                hierarchyObj.employeename[0] == userObj.companyname
            );
            return {
              companyname: userObj.companyname,
              vendor: userObj.vendor,
              filename: userObj.filename,
              category: userObj.category,
              unitid: userObj.unitid,
              user: userObj.user,
              fromdate: userObj.fromdate,
              time: userObj.time,
              section: userObj.section,
              flagcount: userObj.flagcount,
              alllogin: userObj.alllogin,
              docnumber: userObj.docnumber,
              status: userObj.status,
              approvalstatus: userObj.approvalstatus,
              lateentrystatus: userObj.lateentrystatus,
              createdAt: userObj.createdAt,
              _id: userObj._id,
              level: matchingHierarchy ? matchingHierarchy.level : "",
              control: matchingHierarchy ? matchingHierarchy.control : "",
            };
          })
          .filter((data) => hierarchyMap.includes(data.companyname));
      }

      if (
        req.body.hierachy === "allhierarchy" &&
        (listpageaccessmode === "Hierarchy Based" ||
          listpageaccessmode === "Overall")
      ) {
        hierarchySecond = await Hirerarchi.find(
          {},
          { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
        );


        // let sectorFinal = req.body.sector == "all"
        //   ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

        // hierarchyDefault = await Hirerarchi.find({
        //   supervisorchoose: req.body.username,
        //   level: { $in: sectorFinal },

        // });


        let sectorFinal = req.body.sector == "all"
          ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

        let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
          supervisorchoose: req.body.username,
        }, { level: 1 });

        FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

        hierarchyDefault = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: { $in: FirstSuphierarchyDefaultLevel },
        });

        let answerDef = hierarchyDefault
          .map((data) => data.employeename)
          .flat();

        function findEmployeesRecursive(
          currentSupervisors,
          processedSupervisors,
          result
        ) {
          const filteredData = hierarchySecond.filter((item) =>
            item.supervisorchoose.some(
              (supervisor) =>
                currentSupervisors.includes(supervisor) &&
                FirstSuphierarchyDefaultLevel.includes(item.level) &&
                !processedSupervisors.has(supervisor)
            )
          );

          if (filteredData.length === 0) {
            return result;
          }

          const newEmployees = filteredData.reduce((employees, item) => {
            employees.push(...item.employeename);
            processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
            return employees;
          }, []);

          const uniqueNewEmployees = [...new Set(newEmployees)];
          result = [...result, ...filteredData];

          return findEmployeesRecursive(
            uniqueNewEmployees,
            processedSupervisors,
            result
          );
        }

        const processedSupervisors = new Set();
        const filteredOverallItem = findEmployeesRecursive(
          answerDef,
          processedSupervisors,
          []
        );
        let answerDeoverall = filteredOverallItem
          .filter((data) =>
            FirstSuphierarchyDefaultLevel.includes(data.level)
          )
          .map((item) => item.employeename[0]);

        resultedTeam = result
          .map((userObj) => {
            const matchingHierarchycontrol = filteredOverallItem.find(
              (hierarchyObj) =>
                hierarchyObj.employeename[0] == userObj.companyname
            );
            return {
              companyname: userObj.companyname,
              vendor: userObj.vendor,
              filename: userObj.filename,
              category: userObj.category,
              unitid: userObj.unitid,
              user: userObj.user,
              fromdate: userObj.fromdate,
              time: userObj.time,
              createdAt: userObj.createdAt,
              section: userObj.section,
              flagcount: userObj.flagcount,
              approvalstatus: userObj.approvalstatus,
              lateentrystatus: userObj.lateentrystatus,
              alllogin: userObj.alllogin,
              docnumber: userObj.docnumber,
              status: userObj.status,
              _id: userObj._id,
              level: matchingHierarchycontrol
                ? matchingHierarchycontrol.level
                : "",
              control: matchingHierarchycontrol
                ? matchingHierarchycontrol.control
                : "",
            };
          })
          .filter((data) => answerDeoverall.includes(data.companyname));

        if (resultedTeam.length == 0) {

          let sectorFinal = req.body.sector == "all"
            ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

          let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
            supervisorchoose: req.body.username,
          }, { level: 1 });

          FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

          hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: { $in: FirstSuphierarchyDefaultLevel }, });
          //  let hierarchySecond2 = await Hirerarchi.find({});
          hierarchySecond = await Hirerarchi.find(
            {},
            { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
          );

          hierarchyDefault = await Hirerarchi.find({
            supervisorchoose: req.body.username,
            //  level: { $nin: sectorFinal },

          });

          console.log(hierarchySecond.length, "hierarchyDefault")

          let answerDef = hierarchyDefault
            .map((data) => data.employeename)
            .flat();

          console.log(answerDef, "answerDef")

          function findEmployeesRecursive(
            currentSupervisors,
            processedSupervisorsallsector,
            resultsectorother
          ) {
            const filteredData = hierarchySecond.filter((item) =>
              item.supervisorchoose.some(
                (supervisor) =>
                  currentSupervisors.includes(supervisor) &&
                  !processedSupervisorsallsector.has(supervisor)
              )
            );

            if (filteredData.length === 0) {
              return resultsectorother;
            }

            const newEmployees = filteredData.reduce((employees, item) => {
              employees.push(...item.employeename);
              processedSupervisorsallsector.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
              return employees;
            }, []);

            const uniqueNewEmployees = [...new Set(newEmployees)];
            resultsectorother = [...resultsectorother, ...filteredData];
            // console.log(result, "result")
            return findEmployeesRecursive(
              uniqueNewEmployees,
              processedSupervisorsallsector,
              resultsectorother
            );
          }

          const processedSupervisorsallsector = new Set();
          const filteredOverallItem = findEmployeesRecursive(
            answerDef,
            processedSupervisorsallsector,
            []
          );

          console.log(processedSupervisorsallsector, "processedSupervisorsallsector");
          //  console.log(filteredOverallItem.map((item) => item.employeename), "filteredOverallItem");

          let answerDeoverall = filteredOverallItem.map((item) => item.employeename ? item.employeename[0] : "");

          console.log("Count of data in other sectors:", answerDeoverall);

          filteredoverallsectorall = resultsectorother.filter((data) =>
            answerDeoverall.includes(data.companyname)
          ).length;

          console.log("filteredoverallsectorall:", filteredoverallsectorall);
        }




        // let hierarchyallfinal = await Hirerarchi.find({
        //   employeename: { $in: answerDeoverall.map((item) => item) },
        //   level: req.body.sector,
        // });
        // hierarchyFinal =
        //   req.body.sector === "all"
        //     ? answerDeoverall.length > 0
        //       ? [].concat(...answerDeoverall)
        //       : []
        //     : hierarchyallfinal.length > 0
        //       ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
        //       : [];

        // primaryhierarchyall = resultedTeam
        //   .filter((item) => item.level == "Primary")
        //   .map((item) => item.companyname);

        // secondaryhierarchyall = resultedTeam
        //   .filter((item) => item.level == "Secondary")
        //   .map((item) => item.companyname);

        // tertiaryhierarchyall = resultedTeam
        //   .filter((item) => item.level == "Tertiary")
        //   .map((item) => item.companyname);
      }

      //my + all hierarchy list dropdown

      if (
        req.body.hierachy === "myallhierarchy" &&
        (listpageaccessmode === "Hierarchy Based" ||
          listpageaccessmode === "Overall")
      ) {
        hierarchySecond = await Hirerarchi.find(
          {},
          { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
        );

        let sectorFinal = req.body.sector == "all"
          ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector]

        let FirstSuphierarchyDefaultLevel = await Hirerarchi.find({
          supervisorchoose: req.body.username,
        }, { level: 1 });

        FirstSuphierarchyDefaultLevel = req.body.sector == "all" ? FirstSuphierarchyDefaultLevel.map(item => item.level) : [req.body.sector]

        hierarchyDefault = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: { $in: FirstSuphierarchyDefaultLevel },
        });

        let answerDef = hierarchyDefault.map((data) => data.employeename);

        function findEmployeesRecursive(
          currentSupervisors,
          processedSupervisors,
          result
        ) {
          const filteredData = hierarchySecond.filter((item) =>
            item.supervisorchoose.some(
              (supervisor) =>
                currentSupervisors.includes(supervisor) &&
                FirstSuphierarchyDefaultLevel.includes(item.level) &&
                !processedSupervisors.has(supervisor)
            )
          );

          if (filteredData.length === 0) {
            return result;
          }

          const newEmployees = filteredData.reduce((employees, item) => {
            employees.push(...item.employeename);
            processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
            return employees;
          }, []);

          const uniqueNewEmployees = [...new Set(newEmployees)];
          result = [...result, ...filteredData];

          return findEmployeesRecursive(
            uniqueNewEmployees,
            processedSupervisors,
            result
          );
        }

        const processedSupervisors = new Set();
        const filteredOverallItem = findEmployeesRecursive(
          [req.body.username],
          processedSupervisors,
          []
        );
        let answerDeoverall = filteredOverallItem
          .filter((data) =>
            FirstSuphierarchyDefaultLevel.includes(data.level)
          )
          .map((item) => item.employeename[0]);

        filteredoverall = result
          .map((userObj) => {
            const matchingHierarchycontrol = filteredOverallItem.find(
              (hierarchyObj) =>
                hierarchyObj.employeename[0] == userObj.companyname
            );
            return {
              companyname: userObj.companyname,
              vendor: userObj.vendor,
              filename: userObj.filename,
              category: userObj.category,
              unitid: userObj.unitid,
              approvalstatus: userObj.approvalstatus,
              lateentrystatus: userObj.lateentrystatus,
              user: userObj.user,
              fromdate: userObj.fromdate,
              time: userObj.time,
              section: userObj.section,
              flagcount: userObj.flagcount,
              alllogin: userObj.alllogin,
              docnumber: userObj.docnumber,
              status: userObj.status,
              _id: userObj._id,
              createdAt: userObj.createdAt,
              level: matchingHierarchycontrol
                ? matchingHierarchycontrol.level
                : "",
              control: matchingHierarchycontrol
                ? matchingHierarchycontrol.control
                : "",
            };
          })
          .filter((data) => answerDeoverall.includes(data.companyname));



        //alert there is no sector
        if (filteredoverall.length == 0) {

          let hierarchySecond2 = await Hirerarchi.find();
          hierarchyfirstlevel = await Hirerarchi.countDocuments({ supervisorchoose: req.body.username, level: req.body.sector, });
          console.log(hierarchyfirstlevel, "hierarchyfirstlevel")

          function findEmployeesRecursive(currentSupervisors, processedSupervisorsallsector, resultsectorother) {
            const filteredData = hierarchySecond2.filter((item) =>
              item.supervisorchoose.some(
                (supervisor) =>
                  currentSupervisors.includes(supervisor) &&
                  !processedSupervisorsallsector.has(supervisor)
              )
            );

            console.log(filteredData.length, "l;lp");
            if (filteredData.length === 0) {
              return resultsectorother; // No more employees to process
            }

            // Collect new employees
            const newEmployees = filteredData.reduce((employees, item) => {
              employees.push(...item.employeename);
              processedSupervisorsallsector.add(item.supervisorchoose[0]); // Track processed supervisors
              return employees;
            }, []);

            // Prevent duplicates
            const uniqueNewEmployees = [...new Set(newEmployees)];

            // **Modify `resultall` in place** instead of reassigning it
            resultsectorother.push(...filteredData);

            // console.log(result, "resultall1");

            // Recursive call with new employees
            return findEmployeesRecursive(uniqueNewEmployees, processedSupervisorsallsector, resultsectorother);
          }

          const processedSupervisorsallsector = new Set();
          // const resultall = []; // Define `resultall` outside to maintain reference

          const filteredOverallItem = findEmployeesRecursive(
            [req.body.username],
            processedSupervisorsallsector,
            resultsectorother // Pass the reference instead of a new array
          );

          console.log(processedSupervisorsallsector, "processedSupervisorsallsector");
          //   console.log(filteredOverallItem.map((item) => item.employeename), "filteredOverallItem");

          let answerDeoverall = filteredOverallItem.map((item) => item.employeename ? item.employeename[0] : "");

          console.log("Count of data in other sectors:", answerDeoverall);

          filteredoverallsectorall = resultsectorother.filter((data) =>
            answerDeoverall.includes(data.companyname)
          ).length;

          console.log("filteredoverallsectorall:", filteredoverallsectorall);
        }

        // let hierarchyallfinal = await Hirerarchi.find({
        //   employeename: { $in: answerDeoverall.map((item) => item) },
        //   level: req.body.sector,
        // });
        // hierarchyFinal =
        //   req.body.sector === "all"
        //     ? answerDeoverall.length > 0
        //       ? [].concat(...answerDeoverall)
        //       : []
        //     : hierarchyallfinal.length > 0
        //       ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
        //       : [];

        // primaryhierarchyfinal = filteredoverall
        //   .filter((item) => item.level == "Primary")
        //   .map((item) => item.companyname);

        // secondaryhierarchyfinal = filteredoverall
        //   .filter((item) => item.level == "Secondary")
        //   .map((item) => item.companyname);

        // tertiaryhierarchyfinal = filteredoverall
        //   .filter((item) => item.level == "Tertiary")
        //   .map((item) => item.companyname);
      }

      if (listpageaccessmode === "Reporting to Based") {
        reportingtobaseduser = result.map((userObj) => {
          return {
            companyname: userObj.companyname,
            vendor: userObj.vendor,
            filename: userObj.filename,
            category: userObj.category,
            unitid: userObj.unitid,
            user: userObj.user,
            fromdate: userObj.fromdate,
            time: userObj.time,
            createdAt: userObj.createdAt,
            section: userObj.section,
            flagcount: userObj.flagcount,
            approvalstatus: userObj.approvalstatus,
            lateentrystatus: userObj.lateentrystatus,
            alllogin: userObj.alllogin,
            docnumber: userObj.docnumber,
            status: userObj.status,
            _id: userObj._id,
            level: "",
            control: "",
          };
        });
      }

      // resultAccessFilter =
      //   req.body.hierachy === "myhierarchy" &&
      //     (listpageaccessmode === "Hierarchy Based" ||
      //       listpageaccessmode === "Overall")
      //     ? resulted
      //     : req.body.hierachy === "allhierarchy" &&
      //       (listpageaccessmode === "Hierarchy Based" ||
      //         listpageaccessmode === "Overall")
      //       ? resultedTeam
      //       : req.body.hierachy === "myallhierarchy" &&
      //         (listpageaccessmode === "Hierarchy Based" ||
      //           listpageaccessmode === "Overall")
      //         ? filteredoverall
      //         : reportingtobaseduser;


      let finalsupervisor = req.body.hierachy == "myhierarchy" ? resulted?.map(Data => Data?.companyname) : req.body.hierachy == "allhierarchy" ? resultedTeam?.map(Data => Data?.companyname) : filteredoverall?.map(Data => Data?.companyname)

      const restrictTeam = await Hirerarchi.aggregate([
        {
          $match: {
            $or: [
              {
                supervisorchoose: { $in: finalsupervisor } // Matches if supervisorchoose field has a value in finalsupervisor
              },
              {
                employeename: { $in: finalsupervisor }     // Matches if employeename field has a value in finalsupervisor
              }
            ],
            level: { $in: levelFinal } // Matches if level field has a value in levelFinal
          },
        },
        {
          $lookup: {
            from: "reportingheaders",
            let: {
              teamControlsArray: {
                $ifNull: ["$pagecontrols", []]
              }
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      {
                        $in: [
                          "$name",
                          "$$teamControlsArray"
                        ]
                      }, // Check if 'name' is in 'teamcontrols' array
                      {
                        $in: [
                          req?.body?.pagename,
                          "$reportingnew" // Check if 'menuteamloginstatus' is in 'reportingnew' array
                        ]
                      } // Additional condition for reportingnew array
                    ]
                  }
                }
              }
            ],
            as: "reportData" // The resulting matched documents will be in this field
          }
        },
        {
          $project: {
            supervisorchoose: 1,
            employeename: 1,
            reportData: 1
          }
        }
      ]);
      let restrictListTeam = restrictTeam?.filter(data => data?.reportData?.length > 0)?.flatMap(Data => Data?.employeename)
      console.log(restrictListTeam, resultedTeam, "restrictListTeam")
      resultAccessFilterHierarchy = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : filteredoverall;
      resultAccessFilter = restrictListTeam?.length > 0 ? resultAccessFilterHierarchy?.filter(data => restrictListTeam?.includes(data?.companyname)) : [];

      console.log(resultAccessFilter, resultAccessFilterHierarchy.length, filteredoverallsectorall, "oooo")
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
      // result
      // resulted,
      // resultedTeam,
      // branch,
      // hierarchy,
      // overallMyallList,
      hierarchyfirstlevel,
      filteredoverallsectorall,
      resultAccessFilterHierarchy: resultAccessFilterHierarchy.length,
      resultAccessFilter,
      // primaryhierarchy,
      //  secondaryhierarchy,
      //  tertiaryhierarchy,
      //  primaryhierarchyall,
      //  secondaryhierarchyall,
      //  tertiaryhierarchyall,
      //  primaryhierarchyfinal,
      //  secondaryhierarchyfinal, tertiaryhierarchyfinal,
    });
  }
);




//Secondary Work Order - Hierarchy based Filter
exports.getAllProductionHierarchyListanother = catchAsyncErrors(async (req, res, next) => {
  let result, clientuserid, hierarchy, primaryhierarchy, secondaryhierarchy, hierarchyMap, resulted, tertiaryhierarchy;

  try {
    let prodresult = await ProductionIndividual.find(
      {

        // vendor: {
        //     $eq: req.body.vendor,
        // },
        vendor: { $in: req.body.vendor },
        status: {
          $nin: ["Approved", "Rejected"]
        }
      },
      {

        vendor: 1,
        filename: 1,
        category: 1,
        unitid: 1,
        user: 1,
        fromdate: 1,
        time: 1,
        section: 1,
        flagcount: 1,
        alllogin: 1,
        docnumber: 1,
        _id: 1
      }
    );

    clientuserid = await ClientUserid.find({}, { userid: 1, empname: 1 })

    let result = prodresult.map(item => {

      const matchuser = clientuserid.find(d =>
        d.userid == item.user

      )
      return {
        vendor: item.vendor,
        filename: item.filename,
        category: item.category,
        unitid: item.unitid,
        user: item.user,
        fromdate: item.fromdate,
        time: item.time,
        section: item.section,
        flagcount: item.flagcount,
        alllogin: item.alllogin,
        docnumber: item.docnumber,
        _id: item._id,
        companyname: matchuser.empname
      }
    })
    hierarchy = await Hirerarchi.find({ supervisorchoose: req.body.username, level: "Primary" });
    hierarchyMap = hierarchy.length > 0 ? [].concat(...hierarchy.map((item) => item.employeename)) : [];

    let hierarchyfilternew = await Hirerarchi.find({ supervisorchoose: req.body.username, level: "Primary" });
    primaryhierarchy = hierarchyfilternew.map((item) => item.employeename[0]);

    let hierarchyfilternew1 = await Hirerarchi.find({ supervisorchoose: req.body.username, level: "Secondary" });
    secondaryhierarchy = hierarchyfilternew1.map((item) => item.employeename[0]);

    let hierarchyfilternew2 = await Hirerarchi.find({ supervisorchoose: req.body.username, level: "Tertiary" });
    tertiaryhierarchy = hierarchyfilternew2.map((item) => item.employeename[0]);

    //solo
    // resulted = result.filter((data) => hierarchyMap.includes(data.companyname));

    resulted = result
      .map((userObj) => {
        const matchingHierarchy = hierarchy.find((hierarchyObj) => hierarchyObj.employeename[0] == userObj.companyname);
        return {
          companyname: userObj.companyname,
          vendor: userObj.vendor,
          filename: userObj.filename,
          category: userObj.category,
          unitid: userObj.unitid,
          user: userObj.user,
          fromdate: userObj.fromdate,
          time: userObj.time,
          section: userObj.section,
          flagcount: userObj.flagcount,
          alllogin: userObj.alllogin,
          docnumber: userObj.docnumber,
          status: userObj.status,
          _id: userObj._id,
          control: matchingHierarchy ? matchingHierarchy.control : "",
        };
      })
      .filter((data) => hierarchyMap.includes(data.companyname));
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resulted,
    primaryhierarchy,
    secondaryhierarchy,
    tertiaryhierarchy,
  });
});



// exports.ProductionIndividualSort = catchAsyncErrors(async (req, res, next) => {
//   let totalProjects, totalProjectsDatas, result, totalPages, currentPage;

//   const { page, pageSize, companyname } = req.body;
//   try {
//     // Get this value from the client request (e.g., from a query parameter)

//     let query = {};
//     if (!req.body.role.includes("Admin") &&
//       !req.body.role.includes("Manager")
//     ) {
//       query["addedby.name"] = { $eq: companyname };
//     }

//     totalProjects = await ProductionIndividual.countDocuments(query);
//     totalProjectsDatas = await ProductionIndividual.find(query)

//     result = await ProductionIndividual.find(query)
//       .skip((page - 1) * pageSize)
//       .limit(parseInt(pageSize));


//   } catch (err) {
//     return next(new ErrorHandler("Records not found!", 404));
//   }

//   return res.status(200).json({
//     totalProjects,
//     result,
//     totalProjectsDatas,
//     currentPage: page,
//     totalPages: Math.ceil(totalProjects / pageSize),
//   });
// });

exports.ProductionIndividualExcelOverall = catchAsyncErrors(async (req, res, next) => {
  let result;
  try {
    // Get this value from the client request (e.g., from a query parameter)

    let query = {};
    if (!req.body.role.includes("Admin") &&
      !req.body.role.includes("Manager")
    ) {
      query["addedby.name"] = { $eq: req.body.companyname };
    }


    result = await ProductionIndividual.find(query).lean().exec()


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({

    result,
  });

});






exports.getAllProductionLoginAllotHierarchyList = catchAsyncErrors(
  async (req, res, next) => {
    let result,
      clientuserid,
      hierarchy,
      resultAccessFilter,
      secondaryhierarchyfinal,
      tertiaryhierarchyfinal,
      primaryhierarchyfinal,
      hierarchyfilter,
      filteredoverall,
      primaryhierarchy,
      hierarchyfilter1,
      secondaryhierarchy,
      hierarchyfilter2,
      tertiaryhierarchy,
      primaryhierarchyall,
      secondaryhierarchyall,
      tertiaryhierarchyall,
      branch,
      hierarchySecond,
      overallMyallList,
      hierarchyMap,
      resulted,
      resultedTeam,
      myallTotalNames,
      reportingtobaseduser,
      hierarchyFinal,
      hierarchyDefault,
      reportingusers;

    try {
      const { listpageaccessmode } = req.body;

      clientuserid = await ClientUserid.find(
        { loginallotlog: { $exists: true, $ne: [] }, allotted: "allotted" },
        { projectvendor: 1, loginallotlog: 1 }
      ).lean();
      if (listpageaccessmode === "Reporting to Based") {
        reportingusers = await User.find(
          {
            enquirystatus: {
              $nin: ["Enquiry Purpose"],
            },
            resonablestatus: {
              $nin: [
                "Not Joined",
                "Postponed",
                "Rejected",
                "Closed",
                "Releave Employee",
                "Absconded",
                "Hold",
                "Terminate",
              ],
            },
            ...(listpageaccessmode === "Reporting to Based"
              ? { reportingto: req.body.username }
              : {}),
          },
          {
            empcode: 1,
            companyname: 1,
          }
        );
      }

      //  prodresult = clientuserid.map(item => item.loginallotlog[item.loginallotlog.length - 1]).flat();

      let prodresult1 = clientuserid
        .map((item) => {
          const lastLog = item.loginallotlog[item.loginallotlog.length - 1];
          return {
            ...lastLog,
            projectvendor: item.projectvendor,
          };
        });

      let prodresult = clientuserid.map(({ projectvendor, userid, loginallotlog }) => {
        // Filter entries where the date is before newdate
        const validEntries = loginallotlog.filter((log) => new Date(log.date) <= new Date());

        // Find the most recent entry
        if (validEntries.length > 0) {
          const recentEntry = validEntries.reduce((latest, current) =>
            latest.date > current.date ? latest : current
          );

          return {
            projectvendor,
            userid,
            ...recentEntry,
            empname: recentEntry.empname,
            date: recentEntry.date,
            empcode: recentEntry.empcode,
          };
        }
        return null; // If no valid entry exists, return null
      })
        .filter(Boolean);



      result = prodresult
        .filter((item) => {
          if (listpageaccessmode === "Reporting to Based") {
            return reportingusers.some(
              (user) => user.companyname === item.empname
            );
          }
          return true;
        })
        .map((item) => {
          return {
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            empname: item.empname,
            team: item.team,
            empcode: item.empcode,
            userid: item.userid,
            date: item.date,
            time: item.time,
            projectvendor: item.projectvendor,
            _id: item._id,
          };
        });
      //myhierarchy dropdown
      if (
        (req.body.hierachy === "myhierarchy" &&
          listpageaccessmode === "Hierarchy Based") ||
        listpageaccessmode === "Overall"
      ) {
        hierarchy = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: req.body.sector,
        });
        hierarchyDefault = await Hirerarchi.find({
          supervisorchoose: req.body.username,
        });

        let answerDef = hierarchyDefault.map((data) => data.employeename);

        hierarchyFinal =
          req.body.sector === "all"
            ? answerDef.length > 0
              ? [].concat(...answerDef)
              : []
            : hierarchy.length > 0
              ? [].concat(...hierarchy.map((item) => item.employeename))
              : [];
        hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

        hierarchyfilter = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: "Primary",
        });
        primaryhierarchy = hierarchyfilter.map((item) => item.employeename[0])
          ? hierarchyfilter.map((item) => item.employeename[0])
          : [];

        hierarchyfilter1 = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: "Secondary",
        });
        secondaryhierarchy = hierarchyfilter1.map(
          (item) => item.employeename[0]
        )
          ? hierarchyfilter1.map((item) => item.employeename[0])
          : [];

        hierarchyfilter2 = await Hirerarchi.find({
          supervisorchoose: req.body.username,
          level: "Tertiary",
        });
        tertiaryhierarchy = hierarchyfilter2.map((item) => item.employeename[0])
          ? hierarchyfilter2.map((item) => item.employeename[0])
          : [];

        resulted = result
          .map((userObj) => {
            const matchingHierarchy = hierarchyDefault.find(
              (hierarchyObj) => hierarchyObj.employeename[0] == userObj.empname
            );
            return {
              company: userObj.company,
              branch: userObj.branch,
              unit: userObj.unit,
              empname: userObj.empname,
              team: userObj.team,
              empcode: userObj.empcode,
              userid: userObj.userid,
              date: userObj.date,
              time: userObj.time,
              projectvendor: userObj.projectvendor,
              _id: userObj._id,
              level: matchingHierarchy ? matchingHierarchy.level : "",
              control: matchingHierarchy ? matchingHierarchy.control : "",
            };
          })
          .filter((data) => hierarchyMap.includes(data.empname));
      }

      if (
        (req.body.hierachy === "allhierarchy" &&
          listpageaccessmode === "Hierarchy Based") ||
        listpageaccessmode === "Overall"
      ) {
        hierarchySecond = await Hirerarchi.find(
          {},
          { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
        );
        hierarchyDefault = await Hirerarchi.find({
          supervisorchoose: req.body.username,
        });

        let answerDef = hierarchyDefault
          .map((data) => data.employeename)
          .flat();

        function findEmployeesRecursive(
          currentSupervisors,
          processedSupervisors,
          result
        ) {
          const filteredData = hierarchySecond.filter((item) =>
            item.supervisorchoose.some(
              (supervisor) =>
                currentSupervisors.includes(supervisor) &&
                !processedSupervisors.has(supervisor)
            )
          );

          if (filteredData.length === 0) {
            return result;
          }

          const newEmployees = filteredData.reduce((employees, item) => {
            employees.push(...item.employeename);
            processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
            return employees;
          }, []);

          const uniqueNewEmployees = [...new Set(newEmployees)];
          result = [...result, ...filteredData];

          return findEmployeesRecursive(
            uniqueNewEmployees,
            processedSupervisors,
            result
          );
        }

        const processedSupervisors = new Set();
        const filteredOverallItem = findEmployeesRecursive(
          answerDef,
          processedSupervisors,
          []
        );
        let answerDeoverall = filteredOverallItem
          .filter((data) =>
            req.body.sector == "all"
              ? ["Primary", "Secondary", "Tertiary"].includes(data.level)
              : data.level == req.body.sector
          )
          .map((item) => item.employeename[0]);

        resultedTeam = result
          .map((userObj) => {
            const matchingHierarchycontrol = filteredOverallItem.find(
              (hierarchyObj) => hierarchyObj.employeename[0] == userObj.empname
            );
            return {
              company: userObj.company,
              branch: userObj.branch,
              unit: userObj.unit,
              empname: userObj.empname,
              team: userObj.team,
              empcode: userObj.empcode,
              userid: userObj.userid,
              date: userObj.date,
              time: userObj.time,
              projectvendor: userObj.projectvendor,
              _id: userObj._id,
              level: matchingHierarchycontrol
                ? matchingHierarchycontrol.level
                : "",
              control: matchingHierarchycontrol
                ? matchingHierarchycontrol.control
                : "",
            };
          })
          .filter((data) => answerDeoverall.includes(data.empname));

        let hierarchyallfinal = await Hirerarchi.find({
          employeename: { $in: answerDeoverall.map((item) => item) },
          level: req.body.sector,
        });
        hierarchyFinal =
          req.body.sector === "all"
            ? answerDeoverall.length > 0
              ? [].concat(...answerDeoverall)
              : []
            : hierarchyallfinal.length > 0
              ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
              : [];

        primaryhierarchyall = resultedTeam
          .filter((item) => item.level == "Primary")
          .map((item) => item.companyname);

        secondaryhierarchyall = resultedTeam
          .filter((item) => item.level == "Secondary")
          .map((item) => item.companyname);

        tertiaryhierarchyall = resultedTeam
          .filter((item) => item.level == "Tertiary")
          .map((item) => item.companyname);
      }

      //my + all hierarchy list dropdown

      if (
        (req.body.hierachy === "myallhierarchy" &&
          listpageaccessmode === "Hierarchy Based") ||
        listpageaccessmode === "Overall"
      ) {
        hierarchySecond = await Hirerarchi.find(
          {},
          { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
        );
        hierarchyDefault = await Hirerarchi.find({
          supervisorchoose: req.body.username,
        });

        let answerDef = hierarchyDefault.map((data) => data.employeename);

        function findEmployeesRecursive(
          currentSupervisors,
          processedSupervisors,
          result
        ) {
          const filteredData = hierarchySecond.filter((item) =>
            item.supervisorchoose.some(
              (supervisor) =>
                currentSupervisors.includes(supervisor) &&
                !processedSupervisors.has(supervisor)
            )
          );

          if (filteredData.length === 0) {
            return result;
          }

          const newEmployees = filteredData.reduce((employees, item) => {
            employees.push(...item.employeename);
            processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
            return employees;
          }, []);

          const uniqueNewEmployees = [...new Set(newEmployees)];
          result = [...result, ...filteredData];

          return findEmployeesRecursive(
            uniqueNewEmployees,
            processedSupervisors,
            result
          );
        }

        const processedSupervisors = new Set();
        const filteredOverallItem = findEmployeesRecursive(
          [req.body.username],
          processedSupervisors,
          []
        );
        let answerDeoverall = filteredOverallItem
          .filter((data) =>
            req.body.sector == "all"
              ? ["Primary", "Secondary", "Tertiary"].includes(data.level)
              : data.level == req.body.sector
          )
          .map((item) => item.employeename[0]);

        filteredoverall = result
          .map((userObj) => {
            const matchingHierarchycontrol = filteredOverallItem.find(
              (hierarchyObj) => hierarchyObj.employeename[0] == userObj.empname
            );
            return {
              company: userObj.company,
              branch: userObj.branch,
              unit: userObj.unit,
              empname: userObj.empname,
              team: userObj.team,
              projectvendor: userObj.projectvendor,
              empcode: userObj.empcode,
              userid: userObj.userid,
              date: userObj.date,
              time: userObj.time,
              _id: userObj._id,
              level: matchingHierarchycontrol
                ? matchingHierarchycontrol.level
                : "",
              control: matchingHierarchycontrol
                ? matchingHierarchycontrol.control
                : "",
            };
          })
          .filter((data) => answerDeoverall.includes(data.empname));

        let hierarchyallfinal = await Hirerarchi.find({
          employeename: { $in: answerDeoverall.map((item) => item) },
          level: req.body.sector,
        });
        hierarchyFinal =
          req.body.sector === "all"
            ? answerDeoverall.length > 0
              ? [].concat(...answerDeoverall)
              : []
            : hierarchyallfinal.length > 0
              ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
              : [];

        primaryhierarchyfinal = filteredoverall
          .filter((item) => item.level == "Primary")
          .map((item) => item.companyname);

        secondaryhierarchyfinal = filteredoverall
          .filter((item) => item.level == "Secondary")
          .map((item) => item.companyname);

        tertiaryhierarchyfinal = filteredoverall
          .filter((item) => item.level == "Tertiary")
          .map((item) => item.companyname);
      }

      if (listpageaccessmode === "Reporting to Based") {
        reportingtobaseduser = result.map((item) => {
          return {
            company: item.company,
            branch: item.branch,
            unit: item.unit,
            empname: item.empname,
            team: item.team,
            empcode: item.empcode,
            userid: item.userid,
            date: item.date,
            time: item.time,
            projectvendor: item.projectvendor,
            _id: item._id,
            level: "",
            control: "",
          };
        });
      }

      resultAccessFilter =
        req.body.hierachy === "myhierarchy" &&
          (listpageaccessmode === "Hierarchy Based" ||
            listpageaccessmode === "Overall")
          ? resulted
          : req.body.hierachy === "allhierarchy" &&
            (listpageaccessmode === "Hierarchy Based" ||
              listpageaccessmode === "Overall")
            ? resultedTeam
            : req.body.hierachy === "myallhierarchy" &&
              (listpageaccessmode === "Hierarchy Based" ||
                listpageaccessmode === "Overall")
              ? filteredoverall
              : reportingtobaseduser;
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!resultAccessFilter) {
      return next(new ErrorHandler("No data found!", 404));
    }
    return res.status(200).json({
      resultAccessFilter,
      resultedTeam
    });
  }
);


exports.getAllManualUploadFilter = catchAsyncErrors(async (req, res, next) => {
  let productionupload = [];
  let producionIndividual = [];
  let attendances,
    users,
    loginids,
    mergedData,
    mergedDataall,
    depMonthSet,
    total,
    finaluser = [];
  let allData = [];
  let datesArray = [];
  let userDates = req.body.userDates;
  const { batchNumber, batchSize } = req.body;

  try {
    const getDatesBetween = (startDate, endDate) => {
      const dates = [];
      let currentDate = new Date(startDate);
      let currentEndDate = new Date(endDate);

      // Add one day before the start date
      currentDate.setDate(currentDate.getDate() - 1);
      dates.push(currentDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD

      // Loop through the dates between start and end date
      while (currentDate <= new Date(endDate)) {
        dates.push(currentDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return dates;
    };

    let dates = getDatesBetween(req.body.fromdate, req.body.todate);

    let finalDates = [...new Set(dates)];

    const dateObj = new Date(req.body.fromdate);
    // Extract day, month, and year components
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    // Format the date components into the desired format
    const formattedDate = `${day}-${month}-${year}`;

    const dateObjto = new Date(req.body.todate);

    // Extract day, month, and year components
    const dayto = String(dateObjto.getDate()).padStart(2, "0");
    const monthto = String(dateObjto.getMonth() + 1).padStart(2, "0");
    const yearto = dateObjto.getFullYear();

    // Format the date components into the desired format
    const formattedDateTo = `${dayto}-${monthto}-${yearto}`;

    const skip = (batchNumber - 1) * 50000;
    const limit = 50000;

    if (req.body.shift === "Month Based") {
      const fromYear = parseInt(req.body.fromYear, 10);
      const fromMonth = parseInt(req.body.fromMonth, 10) - 1; // Subtract 1 to get the correct month index

      let startDate = new Date(fromYear, fromMonth, 1);
      let endDate = new Date(fromYear, fromMonth + 1, 0);

      let datesm = [];

      // Loop through each day of the month
      for (let day = startDate.getDate() + 1; day <= endDate.getDate() + 1; day++) {
        datesm.push(new Date(fromYear, fromMonth, day));
      }

      datesArray = datesm.map((d) => d.toISOString().split("T")[0]);
    }
    //console.log(datesArray,"datesArray")
    let queryManual = {};

    if (req.body.user.length > 0) {
      queryManual.user = { $in: req.body.user };
    }
    if (req.body.projectvendor.length > 0) {
      queryManual.vendor = { $in: req.body.projectvendor };
    }
    if (req.body.category.length > 0) {
      queryManual.filename = { $in: req.body.category };
    }
    if (req.body.subcategory.length > 0) {
      queryManual.category = { $in: req.body.subcategory };
    }
    // queryManual.status = "Approved"
    if (finalDates.length > 0 && req.body.shift === "Date Based") {
      queryManual.fromdate = { $gte: req.body.fromdate, $lte: req.body.todate };
    }
    if (datesArray.length > 0 && req.body.shift === "Month Based") {
      queryManual.fromdate = { $in: datesArray };
    }


    total = await ProductionIndividual.countDocuments(queryManual)
    console.log(total, "total")
    producionIndividual = await ProductionIndividual.find(queryManual, {
      approvalstatus: 1,
      approvaldate: 1,
      createdAt: 1,
      fromdate: 1,
      time: 1,
      vendor: 1,
      lateentrystatus: 1,
      status: 1,
      unitid: 1,
      time: 1,
      filename: 1,
      user: 1,
      alllogin: 1,
      category: 1,
    })
      .skip(skip)
      .limit(limit)
      .lean();

    let userQuery = {
      $or: [{ reasondate: { $exists: false } }, { reasondate: { $eq: "" } }, { reasondate: { $gte: req.body.todate } }],
    };

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let fromMonthName = monthNames[req.body.fromMonth - 1];

    let deptMonthQuery = {};

    if (req.body.shift === "Month Based") {
      deptMonthQuery.monthname = fromMonthName;
      deptMonthQuery.year = String(req.body.fromYear);
    } else {
      deptMonthQuery.fromdate = { $lte: req.body.fromdate };
      deptMonthQuery.todate = { $gte: req.body.fromdate };
    }
    // console.log(deptMonthQuery, "deptMonthQuery");
    // users = await Users.find({}, { company: 1, branch: 1, unit: 1, team: 1, empname: 1, companyname: 1, username: 1, empcode: 1 });

    // let loginids = await ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] } }, { empname: 1, userid: 1, loginallotlog: 1 }).lean();
    let [usersAll, loginids, depMonthSet] = await Promise.all([
      Users.find(
        userQuery,
        // {}
        { companyname: 1, empcode: 1, company: 1, departmentlog: 1, unit: 1, branch: 1, team: 1, username: 1, processlog: 1, shifttiming: 1, department: 1, doj: 1, assignExpLog: 1, shiftallot: 1, boardingLog: 1 }
      ),
      ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] } }, { empname: 1, userid: 1, loginallotlog: 1, projectvendor: 1 }).lean(),
      DepartmentMonth.find(deptMonthQuery, { fromdate: 1, department: 1 }),
    ]);
    // console.log(depMonthSet, "depMonthSet");
    // const fromDateSet = req.body.shift === "Month Based" ? [...new Set(datesArray)] : finalDates;
    // console.log(fromDateSet, "fromDateSet");

    allData = producionIndividual;
    console.log(allData.length, usersAll.length, loginids.length, "alldata");

    if (req.body.shift == "Date Based") {
      users = usersAll
        .map((item) => {
          let findUserDeprtment = item.department;
          let findUserTeam = item.team;

          if (item.boardingLog) {
            if (item.boardingLog && item.boardingLog.length > 0 && item.boardingLog.some((item) => item.ischangeteam === true)) {
              const sortedTeamLog = item.boardingLog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));

              const findDept = sortedTeamLog.find((dept) => new Date(req.body.fromdate) >= new Date(dept.startdate));

              findUserTeam = findDept ? findDept.team : "";
              // } else if (item.boardingLog && item.boardingLog.length == 1 && item.boardingLog.some((item) => item.ischangeteam === true)) {
              //   findUserDeprtment = new Date(req.body.fromdate) >= new Date(item.boardingLog[0].startdate) ? item.boardingLog[0].team : "";
            } else {
              findUserTeam = item.team;
            }
          }

          if (item.departmentlog) {
            if (item.departmentlog && item.departmentlog.length > 1) {
              const sortedDepartmentLog = item.departmentlog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));
              const findDept = sortedDepartmentLog.find((dept) => new Date(req.body.fromdate) >= new Date(dept.startdate));
              findUserDeprtment = findDept ? findDept.department : "";
            } else if (item.departmentlog && item.departmentlog.length == 1) {
              findUserDeprtment = new Date(req.body.fromdate) >= new Date(item.departmentlog[0].startdate) ? item.departmentlog[0].department : "";
            } else {
              findUserDeprtment = item.department;
            }
          }
          return {
            ...item._doc,
            department: findUserDeprtment,
            team: findUserTeam,
          };
        })
        .filter((item) => item !== null);

      let mergedDataallfirst = allData.map((upload) => {
        const loginInfo = loginids.find((login) => login.userid === upload.user && login.projectvendor === upload.vendor);

        let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

        let filteredDataDateTime = null;
        if (loginallot.length > 0) {
          const groupedByDateTime = {};

          loginallot.forEach((item) => {
            const dateTime = item.date + " " + item.time;
            if (!groupedByDateTime[dateTime]) {
              groupedByDateTime[dateTime] = [];
            }
            groupedByDateTime[dateTime].push(item);
          });

          // Extract the last item of each group
          const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);

          // Sort the last items by date and time
          lastItemsForEachDateTime.sort((a, b) => {
            return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
          });

          // Find the first item in the sorted array that meets the criteria
          for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
            const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}`;
            // let datevalsplit = upload.mode == "Manual" ? "" : upload.formatteddatetime.split(" ");
            let datevalsplitfinal = upload.mode == "Manual" ? `${upload.fromdate}T${upload.time}` : `${upload.formatteddate}T${upload.formattedtime}`;
            if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
              filteredDataDateTime = lastItemsForEachDateTime[i];
            } else {
              break;
            }
          }
        }

        // const userInfo = loginInfo ? users.find(user => user.companyname === loginInfo.empname) : "";
        let logininfoname = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
        console.log(users.length, logininfoname, "sdffd")
        const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : "";
        console.log(userInfo, "userInfo")
        if (
          (req.body.empname.length > 0 ? req.body.empname.includes(userInfo ? userInfo.companyname : "") : true) &&
          (req.body.company.length > 0 ? req.body.company.includes(userInfo ? userInfo.company : "") : true) &&
          (req.body.branch.length > 0 ? req.body.branch.includes(userInfo ? userInfo.branch : "") : true) &&
          (req.body.unit.length > 0 ? req.body.unit.includes(userInfo ? userInfo.unit : "") : true) &&
          (req.body.team.length > 0 ? req.body.team.includes(userInfo ? userInfo.team : "") : true) &&
          (req.body.subcategory && req.body.subcategory.length > 0 ? req.body.subcategory.includes(upload.category) : true)
        ) {
          return {
            user: upload.user,
            // fromdate: upload.fromdate,
            // todate: upload.todate,
            vendor: upload.vendor,
            category: upload.category,
            dateval: `${upload.fromdate} ${upload.time}`,
            olddateval: `${upload.fromdate}T${upload.time}`,
            approvalstatus: upload.approvalstatus,
            lateentrystatus: upload.lateentrystatus,
            approvaldate: upload.approvaldate,
            // createdAt: upload.createdAt,
            status: upload.status,
            time: upload.time,

            filename: upload.filename,
            mode: upload.mode == "Manual" ? "Manual" : "Production",
            empname: logininfoname,
            empcode: userInfo && userInfo.empcode,
            company: userInfo && userInfo.company,
            unit: userInfo && userInfo.unit,
            branch: userInfo && userInfo.branch,
            team: userInfo && userInfo.team,
            username: userInfo && userInfo.username,
            empcode: userInfo && userInfo.empcode,
            _id: upload._id,
            unitid: upload.unitid,
            filename: upload.filename,
            // section: upload.section,
            // csection: upload.updatedsection ? upload.updatedsection : "",
            // flagcount: upload.flagcount,
            // cflagcount: upload.updatedflag ? upload.updatedflag : "",
            unitid: upload.unitid,
            filename: upload.filename,
            // points: Number(upload.unitrate) * 8.333333333333333,
            // cpoints: upload.updatedunitrate ? Number(upload.updatedunitrate) * 8.333333333333333 : "",
            // unitrate: Number(upload.unitrate),
            // cunitrate: upload.updatedunitrate ? Number(upload.updatedunitrate) : "",
          };
        }
      });

      mergedDataall = mergedDataallfirst.filter((item) => item !== undefined);
    } else if (req.body.shift == "Month Based") {
      users = usersAll
        .map((item) => {
          let findUserDeprtment = item.department;
          let findUserTeam = item.team;
          let findFromDateMonth = [...new Set(depMonthSet.map((d) => d.fromdate))];
          console.log(findFromDateMonth, "findFromDateMonth");
          if (item.departmentlog) {
            if (item.departmentlog && item.departmentlog.length > 1) {
              const sortedDepartmentLog = item.departmentlog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));
              const findDept = sortedDepartmentLog.find((dept) => findFromDateMonth.includes(dept.startdate));
              findUserDeprtment = findDept ? findDept.department : "";
            } else if (item.departmentlog && item.departmentlog.length == 1) {
              findUserDeprtment = findFromDateMonth.some((d) => new Date(item.departmentlog[0].startdate) >= new Date(d)) ? item.departmentlog[0].department : "";
            } else {
              findUserDeprtment = item.department;
            }
          }
          console.log(findUserDeprtment, "findUserDeprtment");
          let findFromDate = depMonthSet.find((d) => d.department === findUserDeprtment)?.fromdate;
          console.log(findFromDate, "findFromDate");
          if (item.boardingLog) {
            if (item.boardingLog && item.boardingLog.length > 1 && item.boardingLog.some((item) => item.ischangeteam === true)) {
              const sortedTeamLog = item.boardingLog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));
              const findDept = sortedTeamLog.find((dept) => new Date(findFromDate) > new Date(dept.startdate));
              findUserTeam = findDept ? findDept.team : "";
            } else if (item.boardingLog && item.boardingLog.length == 1 && item.boardingLog.some((item) => item.ischangeteam === true)) {
              findUserTeam = new Date(item.boardingLog[0].startdate) >= new Date(findFromDate) ? item.boardingLog[0].team : "";
            } else {
              findUserTeam = item.team;
            }
          }

          return {
            ...item._doc,
            department: findUserDeprtment,
            team: findUserTeam,
          };
        })
        .filter((item) => item !== null);

      let mergedDataallfirst = allData.map((upload) => {
        const loginInfo = loginids.find((login) => login.userid === upload.user);

        let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];
        let filteredDataDateTime = null;
        if (loginallot.length > 0) {
          const groupedByDateTime = {};

          // Group items by date and time
          loginallot.forEach((item) => {
            const dateTime = item.date + " " + item.time; // Assuming item.updatetime contains time in HH:mm format
            if (!groupedByDateTime[dateTime]) {
              groupedByDateTime[dateTime] = [];
            }
            groupedByDateTime[dateTime].push(item);
          });

          // Extract the last item of each group
          const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);
          // Sort the last items by date and time
          lastItemsForEachDateTime.sort((a, b) => {
            return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
          });

          // Find the first item in the sorted array that meets the criteria

          for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
            const dateTime = lastItemsForEachDateTime[i].date + " " + lastItemsForEachDateTime[i].time;
            let datevalsplitfinal = upload.fromdate + " " + upload.time;
            if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
              filteredDataDateTime = lastItemsForEachDateTime[i];
            } else {
              break;
            }
          }
        }
        // const userInfo = loginInfo ? users.find(user => user.companyname === loginInfo.empname) : "";
        let logininfoname = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
        const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : "";
        const userArray = loginInfo ? users.filter((user) => user.companyname === logininfoname) : "";

        // const filenamelistviewAll = upload.filename && upload.filename?.split(".x");
        // const filenamelist = filenamelistviewAll && filenamelistviewAll[0];

        const filenamelist = upload.filename;

        // const FindProjectvendor = upload.vendor && upload.vendor?.split("-");
        // const getproject = FindProjectvendor && FindProjectvendor[0];
        // const getvendor = FindProjectvendor && FindProjectvendor[1];

        const findshifttime = userInfo && userInfo.shifttiming && userInfo.shifttiming.split("to");

        const getshift = findshifttime && findshifttime[0];

        const comparedate = upload.fromdate;
        const comparetime = upload.time;
        const dateTime = new Date(`${comparedate}T${comparetime}Z`);

        const includesValue = (array, value) => {
          return array && array.length > 0 ? array.includes(value) : true;
        };

        if (
          (req.body.empname.length > 0 ? req.body.empname.includes(userInfo ? userInfo.companyname : "") : true) &&
          (req.body.company.length > 0 ? req.body.company.includes(userInfo ? userInfo.company : "") : true) &&
          (req.body.branch.length > 0 ? req.body.branch.includes(userInfo ? userInfo.branch : "") : true) &&
          (req.body.unit.length > 0 ? req.body.unit.includes(userInfo ? userInfo.unit : "") : true) &&
          (req.body.team.length > 0 ? req.body.team.includes(userInfo ? userInfo.team : "") : true) &&
          (req.body.subcategory && req.body.subcategory.length > 0 ? req.body.subcategory.includes(upload.category) : true)
        ) {
          return {
            user: upload.user,
            // fromdate: upload.fromdate,
            // todate: upload.todate,
            vendor: upload.vendor,
            category: upload.category,
            dateval: `${upload.fromdate} ${upload.time}`,
            olddateval: `${upload.fromdate}T${upload.time}`,
            approvalstatus: upload.approvalstatus,
            lateentrystatus: upload.lateentrystatus,
            approvaldate: upload.approvaldate,
            createdAt: upload.createdAt,
            status: upload.status,
            time: upload.time,
            filename: upload.filename,
            mode: upload.mode == "Manual" ? "Manual" : "Production",
            empname: logininfoname,
            empcode: userInfo && userInfo.empcode,
            company: userInfo && userInfo.company,
            unit: userInfo && userInfo.unit,
            branch: userInfo && userInfo.branch,
            team: userInfo && userInfo.team,
            username: userInfo && userInfo.username,
            empcode: userInfo && userInfo.empcode,
            _id: upload._id,
            unitid: upload.unitid,
            filename: upload.filename,
            // section: upload.section,
            // csection: upload.updatedsection ? upload.updatedsection : "",
            // flagcount: upload.flagcount,
            // cflagcount: upload.updatedflag ? upload.updatedflag : "",
            unitid: upload.unitid,
            filename: upload.filename,
            // points: Number(upload.unitrate) * 8.333333333333333,
            // cpoints: upload.updatedunitrate ? Number(upload.updatedunitrate) * 8.333333333333333 : "",
            // unitrate: Number(upload.unitrate),
            // cunitrate: upload.updatedunitrate ? Number(upload.updatedunitrate) : "",
          };
        }
      });

      mergedDataall = mergedDataallfirst.filter((item) => item !== undefined);
    }

    mergedData = mergedDataall && mergedDataall.length > 0 ? mergedDataall.filter((item) => item != null) : [];
    console.log(mergedData.length, "merge")
  } catch (err) {
    console.log(err);
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!productionupload) {
  //   return next(new ErrorHandler("Data not found!", 404));
  // }
  return res.status(200).json({
    // count: products.length,
    mergedData,
    total,
    count: allData.length,
  });
});

exports.getUserIdManual = catchAsyncErrors(async (req, res, next) => {
  let manual, productionupload, producionIndividual;
  let finaluser = []

  const { name } = req.body;
  try {

    const loginids = await ClientUserid.find({ "loginallotlog.empname": name, allotted: "allotted" }, { projectvendor: 1, empname: 1, userid: 1, loginallotlog: 1 }).lean();

    let userids = loginids.map(d => d.userid)
    producionIndividual = await ProductionIndividual.find({
      user: { $in: userids }
    },
      {
        vendor: 1, datemode: 1, fromdate: 1, time: 1, filename: 1, category: 1, unitid: 1, user: 1, section: 1, flagcount: 1, alllogin: 1, docnumber: 1, doclink: 1, approvalstatus: 1, lateentrystatus: 1, startmode: 1, startdate: 1, statusmode: 1, totalpages: 1, flagcount: 1, startpage: 1, pendingpages: 1, reason: 1, enddate: 1, endtime: 1, notes: 1
      }
    ).lean();
    console.log(producionIndividual.length, "length")
    manual = producionIndividual.map((upload) => {

      const loginInfo = loginids.find((login) => login.userid === upload.user && login.projectvendor === upload.vendor);
      let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

      let filteredDataDateTime = null;

      if (loginallot.length > 0) {
        const groupedByDateTime = {};

        // Group items by date and time
        loginallot.forEach((item) => {
          const dateTime = item.date + " " + item.time;
          if (!groupedByDateTime[dateTime]) {
            groupedByDateTime[dateTime] = [];
          }
          groupedByDateTime[dateTime].push(item);
        });

        // Extract the last item of each group
        const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);

        // Sort the last items by date and time
        lastItemsForEachDateTime.sort((a, b) => {
          return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
        });

        // Find the first item in the sorted array that meets the criteria
        for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
          const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;
          // let datevalsplit = upload.mode == "Manual" ? "" : upload.formatteddatetime.split(" ");
          let datevalsplitfinal = upload.mode == "Manual" ? `${upload.fromdate}T${upload.time}Z` : `${upload.formatteddate}T${upload.formattedtime}Z`;
          if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
            filteredDataDateTime = lastItemsForEachDateTime[i];
          } else {
            break;
          }
        }
      }

      let logininfoname = (loginallot.length > 0 && filteredDataDateTime) ? filteredDataDateTime.empname : (loginInfo ? loginInfo.empname : "");


      if (name === logininfoname) {
        return {
          ...upload,
          vendor: upload.vendor,
          datemode: upload.datemode,
        };
      }
    });
    console.log(manual.length, "manual")
    productionupload = manual.filter(d => d != undefined)
    console.log(productionupload[0], "manual")
  } catch (err) {
    return next(new ErrorHandler("Records Not Found", 500));
  }

  return res.status(200).json({
    productionupload,
  });
});

exports.getAllOnprogressIndividualLimited = catchAsyncErrors(async (req, res, next) => {
  let result, prodresult;
  try {

    prodresult = await ProductionIndividual.find({ statusmode: "Started" },
      {
        vendor: 1,
        datemode: 1,
        filename: 1,
        category: 1,
        unitid: 1,
        unitrate: 1,
        user: 1,
        mode: 1,
        fromdate: 1,
        time: 1,
        section: 1,
        flagcount: 1,
        alllogin: 1,
        statusmode: 1,
        status: 1,
        approvalstatus: 1,
        lateentrystatus: 1,
        docnumber: 1,
        doclink: 1,
        status: 1,
        addedby: 1,
        _id: 1
      }
    ).lean();


    let results = prodresult.filter((data, index) => {

      if (req?.body?.username === data?.addedby[0]?.name || req?.body?.companyname === data?.addedby[0]?.name) {
        return data
      }
    })

    result = req?.body?.access.includes("Manager") ? prodresult : results;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    result
  });
});

exports.getAllPendingIndividualLimited = catchAsyncErrors(async (req, res, next) => {
  let result, prodresult;
  try {

    prodresult = await ProductionIndividual.find({ statusmode: { $in: ["Pause", "Stop", "In Complete", "Partial Complete"] } },
      {
        vendor: 1,
        datemode: 1,
        filename: 1,
        category: 1,
        unitid: 1,
        unitrate: 1,
        user: 1,
        mode: 1,
        fromdate: 1,
        time: 1,
        section: 1,
        flagcount: 1,
        alllogin: 1,
        docnumber: 1,
        doclink: 1,
        status: 1,
        addedby: 1,
        _id: 1
      }
    ).lean();


    let results = prodresult.filter((data, index) => {

      if (req?.body?.username === data?.addedby[0]?.name || req?.body?.companyname === data?.addedby[0]?.name) {
        return data
      }
    })

    result = req?.body?.access.includes("Manager") ? prodresult : results;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    result
  });
});

exports.getAllCompleteIndividualLimited = catchAsyncErrors(async (req, res, next) => {
  let result, prodresult;
  try {

    prodresult = await ProductionIndividual.find({ statusmode: { $in: ["", "Completed"] } },
      {
        vendor: 1,
        datemode: 1,
        fromdate: 1,
        time: 1,
        filename: 1,
        category: 1,
        unitid: 1,
        user: 1,
        section: 1,
        flagcount: 1,
        alllogin: 1,
        docnumber: 1,
        doclink: 1,
        approvalstatus: 1,
        lateentrystatus: 1,
        startmode: 1,
        startdate: 1,
        starttime: 1,
        status: 1,
        totalpages: 1,
        flagcount: 1,
        pendingpages: 1,
        startpage: 1,
        reason: 1,
        statusmode: 1,
        enddate: 1,
        endtime: 1,
        notes: 1,
        addedby: 1,
        _id: 1
      }
    ).lean();


    let results = prodresult.filter((data, index) => {

      if (req?.body?.username === data?.addedby[0]?.name || req?.body?.companyname === data?.addedby[0]?.name) {
        return data
      }
    })

    result = req?.body?.access.includes("Manager") ? prodresult : results;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    result
  });
});







// exports.ManualStatusviceIndividualSort = catchAsyncErrors(async (req, res, next) => {
//   let totalProjects, totalProjectsDatas, result, totalPages, currentPage;

//   const { page, pageSize, companyname, searchTerm } = req.body;
//   try {
//     // Get this value from the client request (e.g., from a query parameter)

//     let query = { statusmode: { $in: req.body.statusmode } };
//     if (!req.body.role.includes("Admin") &&
//       !req.body.role.includes("Manager")
//     ) {
//       query["addedby.name"] = { $eq: companyname };
//     }

//     totalProjects = await ProductionIndividual.countDocuments(query);
//     totalProjectsDatas = await ProductionIndividual.find(query)

//     result = await ProductionIndividual.find(query)
//       .skip((page - 1) * pageSize)
//       .limit(parseInt(pageSize));


//   } catch (err) {
//     return next(new ErrorHandler("Records not found!", 404));
//   }

//   return res.status(200).json({
//     totalProjects,
//     result,
//     totalProjectsDatas,
//     currentPage: page,
//     totalPages: Math.ceil(totalProjects / pageSize),
//   });
// });

exports.ManualstatusviceIndividualExcelOverall = catchAsyncErrors(async (req, res, next) => {
  let result;
  try {
    // Get this value from the client request (e.g., from a query parameter)

    let query = { statusmode: { $in: req.body.statusmode } }
    if (!req.body.role.includes("Admin") &&
      !req.body.role.includes("Manager")
    ) {
      query["addedby.name"] = { $eq: req.body.companyname };
    }


    result = await ProductionIndividual.find(query).lean().exec()


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({

    result,
  });

});

exports.getAllProductionHierarchyListHome = catchAsyncErrors(
  async (req, res, next) => {
    let result,
      reportingtobaseduser,
      clientuserid,
      hierarchy,
      resultAccessFilter,
      secondaryhierarchyfinal,
      tertiaryhierarchyfinal,
      primaryhierarchyfinal,
      hierarchyfilter,
      filteredoverall,
      primaryhierarchy,
      hierarchyfilter1,
      secondaryhierarchy,
      hierarchyfilter2,
      tertiaryhierarchy,
      primaryhierarchyall,
      secondaryhierarchyall,
      tertiaryhierarchyall,
      branch,
      hierarchySecond,
      overallMyallList,
      hierarchyMap,
      resulted,
      resultedTeam,
      myallTotalNames,
      hierarchyFinal,
      hierarchyDefault,
      reportingusers;

    try {
      const { listpageaccessmode } = req.body;
      let clientidsmap;
      if (listpageaccessmode === "Reporting to Based") {
        let usersss = await User.find(
          {
            enquirystatus: {
              $nin: ["Enquiry Purpose"],
            },
            resonablestatus: {
              $nin: [
                "Not Joined",
                "Postponed",
                "Rejected",
                "Closed",
                "Releave Employee",
                "Absconded",
                "Hold",
                "Terminate",
              ],
            },
            reportingto: req.body.username,
          },
          {
            empcode: 1,
            companyname: 1,
          }
        ).lean();
        const companyNames = usersss.map((user) => user.companyname);
        let clientids = await ClientUserid.find(
          {
            // projectvendor: { $in: vendorNames },
            empname: { $in: companyNames },
          },
          { userid: 1 }
        ).lean();
        clientidsmap = clientids.map((user) => user.userid);
      }

      let prodresult = await ProductionIndividual.find(
        {
          vendor: { $nin: [undefined, "undefined"] },

          status: {
            $nin: ["Approved", "Rejected"],
          },
          ...(listpageaccessmode === "Reporting to Based"
            ? { user: { $in: clientidsmap } }
            : {}),
        },
        {
          vendor: 1,
          filename: 1,
          category: 1,
          unitid: 1,
          user: 1,
          fromdate: 1,
          time: 1,
          section: 1,
          flagcount: 1,
          alllogin: 1,
          docnumber: 1,
          status: 1,
          approvalstatus: 1,
          lateentrystatus: 1,
          createdAt: 1,
          _id: 1,
        }
      );


      clientuserid = await ClientUserid.find(
        { loginallotlog: { $exists: true, $ne: [] } },
        { empname: 1, userid: 1, loginallotlog: 1 }
      ).lean();

      result = prodresult.map((item) => {
        // const matchuser = clientuserid.find(d =>
        //     d.userid == item.user

        // )
        const uploadtime = convertTo24HourFormat(item.time);

        const loginInfo = clientuserid.find((d) => d.userid == item.user);
        let loginallot =
          loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

        let filteredDataDateTime = null;
        if (loginallot.length > 0) {
          const groupedByDateTime = {};

          // Group items by date and time
          loginallot.forEach((item) => {
            const dateTime = item.date + " " + item.time;
            if (!groupedByDateTime[dateTime]) {
              groupedByDateTime[dateTime] = [];
            }
            groupedByDateTime[dateTime].push(item);
          });

          // Extract the last item of each group
          const lastItemsForEachDateTime = Object.values(groupedByDateTime).map(
            (group) => group[group.length - 1]
          );

          // Sort the last items by date and time
          lastItemsForEachDateTime.sort((a, b) => {
            return (
              new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time)
            );
          });

          // Find the first item in the sorted array that meets the criteria

          for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
            const dateTime =
              lastItemsForEachDateTime[i].date +
              " " +
              lastItemsForEachDateTime[i].time;
            // let datevalsplit = item.mode === "Manual" ? "" : upload.dateval.split(" IST");
            let datevalsplitfinal = `${item.fromdate}T${uploadtime}Z`;
            if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
              filteredDataDateTime = lastItemsForEachDateTime[i];
            } else {
              break;
            }
          }
        }

        let logininfoname =
          loginallot.length > 0 && filteredDataDateTime
            ? filteredDataDateTime.empname
            : loginInfo
              ? loginInfo.empname
              : "";

        return {
          vendor: item.vendor,
          filename: item.filename,
          category: item.category,
          unitid: item.unitid,
          user: item.user,
          fromdate: item.fromdate,
          time: item.time,
          section: item.section,
          flagcount: item.flagcount,
          alllogin: item.alllogin,
          docnumber: item.docnumber,
          approvalstatus: item.approvalstatus,
          lateentrystatus: item.lateentrystatus,
          status: item.status,
          createdAt: item.createdAt,
          _id: item._id,
          companyname: logininfoname,
        };
      });


      //my + all hierarchy list dropdown
      if (
        req.body.hierachy === "myallhierarchy" &&
        (listpageaccessmode === "Hierarchy Based" ||
          listpageaccessmode === "Overall")
      ) {
        hierarchySecond = await Hirerarchi.find(
          {},
          { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
        );
        hierarchyDefault = await Hirerarchi.find({
          supervisorchoose: req.body.username,
        });

        let answerDef = hierarchyDefault.map((data) => data.employeename);

        function findEmployeesRecursive(
          currentSupervisors,
          processedSupervisors,
          result
        ) {
          const filteredData = hierarchySecond.filter((item) =>
            item.supervisorchoose.some(
              (supervisor) =>
                currentSupervisors.includes(supervisor) &&
                !processedSupervisors.has(supervisor)
            )
          );

          if (filteredData.length === 0) {
            return result;
          }

          const newEmployees = filteredData.reduce((employees, item) => {
            employees.push(...item.employeename);
            processedSupervisors.add(item.supervisorchoose[0]); // Assuming each item has only one supervisorchoose
            return employees;
          }, []);

          const uniqueNewEmployees = [...new Set(newEmployees)];
          result = [...result, ...filteredData];

          return findEmployeesRecursive(
            uniqueNewEmployees,
            processedSupervisors,
            result
          );
        }

        const processedSupervisors = new Set();
        const filteredOverallItem = findEmployeesRecursive(
          [req.body.username],
          processedSupervisors,
          []
        );
        let answerDeoverall = filteredOverallItem
          .filter((data) =>
            req.body.sector == "all"
              ? ["Primary", "Secondary", "Tertiary"].includes(data.level)
              : data.level == req.body.sector
          )
          .map((item) => item.employeename[0]);

        filteredoverall = result
          .map((userObj) => {
            const matchingHierarchycontrol = filteredOverallItem.find(
              (hierarchyObj) =>
                hierarchyObj.employeename[0] == userObj.companyname
            );
            return {
              companyname: userObj.companyname,
              vendor: userObj.vendor,
              filename: userObj.filename,
              category: userObj.category,
              unitid: userObj.unitid,
              approvalstatus: userObj.approvalstatus,
              lateentrystatus: userObj.lateentrystatus,
              user: userObj.user,
              fromdate: userObj.fromdate,
              time: userObj.time,
              section: userObj.section,
              flagcount: userObj.flagcount,
              alllogin: userObj.alllogin,
              docnumber: userObj.docnumber,
              status: userObj.status,
              _id: userObj._id,
              createdAt: userObj.createdAt,
              level: matchingHierarchycontrol
                ? matchingHierarchycontrol.level
                : "",
              control: matchingHierarchycontrol
                ? matchingHierarchycontrol.control
                : "",
            };
          })
          .filter((data) => answerDeoverall.includes(data.companyname));

        let hierarchyallfinal = await Hirerarchi.find({
          employeename: { $in: answerDeoverall.map((item) => item) },
          level: req.body.sector,
        });
        hierarchyFinal =
          req.body.sector === "all"
            ? answerDeoverall.length > 0
              ? [].concat(...answerDeoverall)
              : []
            : hierarchyallfinal.length > 0
              ? [].concat(...hierarchyallfinal.map((item) => item.employeename))
              : [];

        // primaryhierarchyfinal = filteredoverall
        //   .filter((item) => item.level == "Primary")
        //   .map((item) => item.companyname);

        // secondaryhierarchyfinal = filteredoverall
        //   .filter((item) => item.level == "Secondary")
        //   .map((item) => item.companyname);

        // tertiaryhierarchyfinal = filteredoverall
        //   .filter((item) => item.level == "Tertiary")
        //   .map((item) => item.companyname);
      }

      if (listpageaccessmode === "Reporting to Based") {
        reportingtobaseduser = result.map((userObj) => {
          return {
            companyname: userObj.companyname,
            vendor: userObj.vendor,
            filename: userObj.filename,
            category: userObj.category,
            unitid: userObj.unitid,
            user: userObj.user,
            fromdate: userObj.fromdate,
            time: userObj.time,
            createdAt: userObj.createdAt,
            section: userObj.section,
            flagcount: userObj.flagcount,
            approvalstatus: userObj.approvalstatus,
            lateentrystatus: userObj.lateentrystatus,
            alllogin: userObj.alllogin,
            docnumber: userObj.docnumber,
            status: userObj.status,
            _id: userObj._id,
            level: "",
            control: "",
          };
        });
      }

      resultAccessFilter =

        req.body.hierachy === "myallhierarchy" &&
          (listpageaccessmode === "Hierarchy Based" ||
            listpageaccessmode === "Overall")
          ? filteredoverall.filter(d => d != undefined && d != null)
          : reportingtobaseduser.filter(d => d != undefined && d != null);


    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!resultAccessFilter) {
    //   return next(new ErrorHandler("No data found!", 404));
    // }
    return res.status(200).json({
      // result
      // resulted,
      // resultedTeam,
      // branch,
      // hierarchy,
      // overallMyallList,
      resultAccessFilter: resultAccessFilter,
      // primaryhierarchy,
      //  secondaryhierarchy,
      //  tertiaryhierarchy,
      //  primaryhierarchyall,
      //  secondaryhierarchyall,
      //  tertiaryhierarchyall,
      //  primaryhierarchyfinal,
      //  secondaryhierarchyfinal, tertiaryhierarchyfinal,
    });
  }
);

// get All ProductionIndividual => /api/ProductionIndividuals
exports.productionIndividualDupeCheck = catchAsyncErrors(async (req, res, next) => {
  let productionIndividual;
  try {
    const { vendor, filename, unitid, user, category, fromdate, time } = req.body;

    let query = {
      vendor,
      filename,
      unitid: {
        $in: unitid, // Correcting the syntax for regex
      },
      user,
      category,
      fromdate,
      // time,
    };

    productionIndividual = await ProductionIndividual.countDocuments(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!productionIndividual) {
  //   return next(new ErrorHandler("Data not found!", 404));
  // }
  return res.status(200).json({
    productionIndividual,
  });
});



// Create new ProductionIndividual=> /api/ProductionIndividual/new
exports.productionIndividualCreateBulk = catchAsyncErrors(async (req, res, next) => {
  let productionIndividual;
  try {
    const {
      vendor,
      datemode,
      fromdate,
      time,
      todate,
      totime,
      filename,
      category,
      unitid,
      user,
      creationstatus,
      remarks,
      startbuttonstatus,
      enddatemode,
      mode,
      section,
      flagcount,
      alllogin,
      docnumber,
      doclink,
      startmode,
      startdate,
      starttime,
      statusmode,
      totalpages,
      pendingpages,
      startpage,
      reason,
      notes,
      approvalstatus,
      approvaldate,
      lateentrystatus,
      files,
      addedby,
    } = req.body;

    // Helper function to convert time (HH:mm:ss) to seconds
    function timeToSeconds(time) {
      const [hours, minutes, seconds] = time.split(":").map(Number);
      return hours * 3600 + minutes * 60 + (seconds || 0);
    }

    // Helper function to convert seconds back to time (HH:mm:ss)
    function secondsToTime(seconds) {
      const hours = Math.floor(seconds / 3600)
        .toString()
        .padStart(2, "0");
      seconds %= 3600;
      const minutes = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
      const secs = (seconds % 60).toString().padStart(2, "0");
      return `${hours}:${minutes}:${secs}`;
    }

    // Calculate the time intervals
    function getTimeIntervals(startTime, endTime, length) {
      const startInSeconds = timeToSeconds(startTime);
      const endInSeconds = timeToSeconds(endTime);
      const totalSeconds = endInSeconds - startInSeconds;

      // Only calculate time for the middle elements (not first or last)
      const interval = Math.floor(totalSeconds / (length - 1));

      const intervals = [];
      for (let i = 0; i < length; i++) {
        if (i === 0) {
          // First element gets the startTime
          intervals.push(startTime);
        } else if (i === length - 1) {
          // Last element gets the endTime
          intervals.push(endTime);
        } else {
          // Calculate time for intermediate elements
          intervals.push(secondsToTime(startInSeconds + interval * i));
        }
      }

      return intervals;
    }

    // Get time intervals based on unitid length
    const timeIntervals = getTimeIntervals(time, totime, unitid.length);

    // Create the final result array
    const result = unitid.map((id, index) => ({
      id,
      fromdate: fromdate,
      time: timeIntervals[index],
    }));

    // Map over the unitid array to create an array of documents
    const documentsToInsert = result.map((d) => ({
      vendor,
      datemode,
      fromdate: d.fromdate,
      time: d.time,
      filename,
      category,
      fromtotime: `${fromdate}$${time}$${todate}$${totime}`,
      unitid: d.id, // Use the current id from the unitid array
      user,
      creationstatus,
      remarks,
      startbuttonstatus,
      enddatemode,
      mode,
      section,
      flagcount,
      alllogin,
      docnumber,
      doclink,
      startmode,
      startdate,
      starttime,
      statusmode,
      totalpages,
      pendingpages,
      startpage,
      reason,
      notes,
      approvalstatus,
      approvaldate,
      lateentrystatus,
      files,
      addedby,
    }));

    let aProductionIndividual = await ProductionIndividual.insertMany(documentsToInsert);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
    message: "Successfully added!",
  });
});

//Excel download
exports.getAllProductionIndividualLimitedExcel = catchAsyncErrors(async (req, res, next) => {
  let result;
  try {

    result = await ProductionIndividual.find({ statusmode: { $in: ["", "Completed"] } },
      {
        vendor: 1,
        datemode: 1,
        fromdate: 1,
        time: 1,
        filename: 1,
        category: 1,
        unitid: 1,
        user: 1,
        section: 1,
        flagcount: 1,
        alllogin: 1,
        docnumber: 1,
        doclink: 1,
        approvalstatus: 1,
        lateentrystatus: 1,
        startmode: 1,
        startdate: 1,
        starttime: 1,
        status: 1,
        totalpages: 1,
        flagcount: 1,
        pendingpages: 1,
        startpage: 1,
        reason: 1,
        statusmode: 1,
        enddate: 1,
        endtime: 1,
        notes: 1,
        addedby: 1,
        _id: 1
      }
    ).lean();


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    result
  });
});




exports.getAllProductionIndividualLimitedOverallExcel = catchAsyncErrors(async (req, res, next) => {
  let result, prodresult;
  try {

    result = await ProductionIndividual.find({},
      {
        vendor: 1,
        datemode: 1,
        fromdate: 1,
        time: 1,
        filename: 1,
        category: 1,
        unitid: 1,
        user: 1,
        section: 1,
        flagcount: 1,
        alllogin: 1,
        docnumber: 1,
        doclink: 1,
        approvalstatus: 1,
        lateentrystatus: 1,
        startmode: 1,
        startdate: 1,
        starttime: 1,
        status: 1,
        totalpages: 1,
        flagcount: 1,
        pendingpages: 1,
        startpage: 1,
        reason: 1,
        statusmode: 1,
        enddate: 1,
        endtime: 1,
        notes: 1,
        addedby: 1,
        _id: 1
      }
    ).lean();


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    result
  });
});



exports.getAllProductionIndividualManualOverallExcel = catchAsyncErrors(async (req, res, next) => {
  let result, prodresult;
  try {

    let query = { statusmode: req.body.statusmode }

    result = await ProductionIndividual.find(query,
      {
        vendor: 1,
        datemode: 1,
        fromdate: 1,
        time: 1,
        filename: 1,
        category: 1,
        unitid: 1,
        user: 1,
        section: 1,
        flagcount: 1,
        alllogin: 1,
        docnumber: 1,
        doclink: 1,
        approvalstatus: 1,
        lateentrystatus: 1,
        startmode: 1,
        startdate: 1,
        starttime: 1,
        status: 1,
        totalpages: 1,
        flagcount: 1,
        pendingpages: 1,
        startpage: 1,
        reason: 1,
        statusmode: 1,
        enddate: 1,
        endtime: 1,
        notes: 1,
        addedby: 1,
        _id: 1
      }
    ).lean();


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    result
  });
});


exports.ProductionIndividualSort = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, assignbranch, allFilters, logicOperator, searchQuery } = req.body;

  let query = {};
  if (!req.body.role.includes("Admin") &&
    !req.body.role.includes("Manager")
  ) {
    query["addedby.name"] = { $eq: companyname };
  }



  let queryoverall = {};
  if (!req.body.role.includes("Admin") &&
    !req.body.role.includes("Manager")
  ) {
    queryoverall["addedby.name"] = { $eq: companyname };
  }

  let conditions = [];

  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach(filter => {
      if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
        if (filter.column == "fromdate" || filter.column == "startdate") {
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
    const searchTermsArray = searchQuery.split(" ");
    const regexTerms = searchTermsArray.map((term) => {

      // Check if the term is in the date format DD/MM/YYYY
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (dateRegex.test(term)) {
        // Convert DD/MM/YYYY to YYYY-MM-DD
        const [day, month, year] = term.split("/");
        const formattedDate = `${year}-${month}-${day}`;
        return new RegExp(formattedDate, "i");
      }
      return new RegExp(term, "i");
    });
    const orConditions = regexTerms.map((regex) => ({
      $or: [
        { vendor: regex },
        { datemode: regex },
        { fromdate: regex },
        { time: regex },
        { filename: regex },
        { category: regex },
        { unitid: regex },
        { user: regex },
        { section: regex },
        { alllogin: regex },
        { docnumber: regex },
        { doclink: regex },
        { approvalstatus: regex },
        { lateentrystatus: regex },
        { startmode: regex },
        { startdate: regex },
        { starttime: regex },
        { status: regex },
        { totalpages: regex },
        { flagcount: regex },
        { pendingpages: regex },
        { startpage: regex },
        { reason: regex },
        { statusmode: regex },
        { enddate: regex },
        { endtime: regex },
        { notes: regex },
      ],

    }));
    query = {
      $and: [
        ...orConditions,
      ],
    };
  }

  if (!req.body.role.includes("Admin") &&
    !req.body.role.includes("Manager")
  ) {
    query["addedby.name"] = { $eq: companyname };
  }
  // Apply logicOperator to combine conditions
  if (conditions.length > 0) {
    if (logicOperator === "AND") {
      query.$and = conditions;
    } else if (logicOperator === "OR") {
      query.$or = conditions;
    }
  }
  try {

    const totalProjects = await ProductionIndividual.countDocuments(query);
    const totalProjectsData = await ProductionIndividual.find(queryoverall);

    const result = await ProductionIndividual.find(query)
      .select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    res.status(200).json({
      totalProjects,
      totalProjectsData,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

//completed list

exports.ManualStatusviceIndividualSort = catchAsyncErrors(async (req, res, next) => {
  const { page, pageSize, allFilters, logicOperator, searchQuery, companyname } = req.body;

  let query = { statusmode: { $in: req.body.statusmode } };
  if (!req.body.role.includes("Admin") &&
    !req.body.role.includes("Manager")
  ) {
    query["addedby.name"] = { $eq: companyname };
  }
  let queryoverall = { statusmode: { $in: req.body.statusmode } };
  if (!req.body.role.includes("Admin") &&
    !req.body.role.includes("Manager")
  ) {
    queryoverall["addedby.name"] = { $eq: companyname };
  }

  let conditions = [];

  // Advanced search filter
  if (allFilters && allFilters.length > 0) {
    allFilters.forEach(filter => {
      if (filter.column && filter.condition && (filter.value || ["Blank", "Not Blank"].includes(filter.condition))) {
        if (filter.column == "fromdate" || filter.column == "startdate") {
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
    const searchTermsArray = searchQuery.split(" ");
    const regexTerms = searchTermsArray.map((term) => {

      // Check if the term is in the date format DD/MM/YYYY
      const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
      if (dateRegex.test(term)) {
        // Convert DD/MM/YYYY to YYYY-MM-DD
        const [day, month, year] = term.split("/");
        const formattedDate = `${year}-${month}-${day}`;
        return new RegExp(formattedDate, "i");
      }
      return new RegExp(term, "i");
    });
    const orConditions = regexTerms.map((regex) => ({
      $or: [
        { vendor: regex },
        { datemode: regex },
        { fromdate: regex },
        { time: regex },
        { filename: regex },
        { category: regex },
        { unitid: regex },
        { user: regex },
        { section: regex },
        { alllogin: regex },
        { docnumber: regex },
        { doclink: regex },
        { approvalstatus: regex },
        { lateentrystatus: regex },
        { startmode: regex },
        { startdate: regex },
        { starttime: regex },
        { status: regex },
        { totalpages: regex },
        { flagcount: regex },
        { pendingpages: regex },
        { startpage: regex },
        { reason: regex },
        { statusmode: regex },
        { enddate: regex },
        { endtime: regex },
        { notes: regex },
      ],

    }));

    query = {
      statusmode: { $in: req.body.statusmode },
      $or: [
        ...orConditions,
      ]
    };
  }

  if (!req.body.role.includes("Admin") &&
    !req.body.role.includes("Manager")
  ) {
    query["addedby.name"] = { $eq: companyname };
  }

  // Apply logicOperator to combine conditions
  if (conditions.length > 0) {
    if (logicOperator === "AND") {
      query.$and = conditions;
    } else if (logicOperator === "OR") {
      query.$or = conditions;
    }
  }
  try {

    const totalProjects = await ProductionIndividual.countDocuments(query);
    // const totalProjectsData = await ProductionIndividual.find(queryoverall);

    const result = await ProductionIndividual.find(query, { vendor: 1, datemode: 1, fromdate: 1, time: 1, filename: 1, category: 1, unitid: 1, user: 1, section: 1, flagcount: 1, alllogin: 1, docnumber: 1, doclink: 1, startmode: 1, startdate: 1, starttime: 1, statusmode: 1, totalpages: 1, pendingpages: 1, startpage: 1, notes: 1, approvalstatus: 1, lateentrystatus: 1, status: 1, remarks: 1 })
      .select("")
      .lean()
      .skip((page - 1) * pageSize)
      .limit(parseInt(pageSize))
      .exec();
    res.status(200).json({
      totalProjects,
      // totalProjectsData,
      result,
      currentPage: page,
      totalPages: Math.ceil(totalProjects / pageSize),
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

});

exports.getAllProductionIndividualListFilter = catchAsyncErrors(async (req, res, next) => {
  let productionindividual;
  try {
    const { vendor, category, filename, fromdate, statusmode, user } = req.body;
    let query = {};
    // console.log(req.body, "bodey")
    if (vendor && vendor.length > 0) {
      query.vendor = { $in: vendor };
    }

    if (category && category.length > 0) {
      query.category = { $in: category };
    }

    if (filename && filename.length > 0) {
      query.filename = { $in: filename };
    }

    if (fromdate) {
      query.fromdate = fromdate;
    }

    if (user && user.length > 0) {
      query.user = { $in: user };
    }

    if (statusmode && statusmode.length > 0) {
      query.statusmode = { $in: statusmode };
    }


    productionindividual = await ProductionIndividual.find(query, { vendor: 1, datemode: 1, fromdate: 1, time: 1, filename: 1, category: 1, unitid: 1, user: 1, section: 1, flagcount: 1, alllogin: 1, docnumber: 1, doclink: 1, startmode: 1, startdate: 1, starttime: 1, statusmode: 1, totalpages: 1, pendingpages: 1, startpage: 1, notes: 1, approvalstatus: 1, lateentrystatus: 1 }).lean();
    // console.log(productionindividual.length)
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!productionindividual) {
  // return next(new ErrorHandler('Ebreadingdetails not found!', 404));
  // }
  return res.status(200).json({
    productionindividual
  });
})


// get All ProductionIndividual => /api/ProductionIndividuals
exports.productionManaulDupeCheck = catchAsyncErrors(async (req, res, next) => {
  let productionIndividual;
  try {
    const { vendor, filename, unitid, user, category, fromdate, time } = req.body;

    let query = {
      vendor,
      filename,
      unitid,
      user,
      category,
      fromdate,
      // time,
    };
    console.log(query, "query");
    productionIndividual = await ProductionIndividual.countDocuments(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!productionIndividual) {
  //   return next(new ErrorHandler("Data not found!", 404));
  // }
  return res.status(200).json({
    productionIndividual,
  });
});



