const DayPointsUpload = require("../../../model/modules/production/dayPointsUpload");
const DayPointsUploadTemp = require("../../../model/modules/production/daypointsuploadtemp");
const ProductionConsolidated = require("../../../model/modules/production/productionConsolidated");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const { ObjectId } = require("mongodb");
const MinimumPoints = require("../../../model/modules/production/minimumpoints");
const Department = require("../../../model/modules/department");
const User = require("../../../model/login/auth");
const SalarySlabs = require("../../../model/modules/setup/SalarySlabModel");
const ShortageMaster = require("../../../model/modules/production/Shortagemaster");
const RevenueAmount = require("../../../model/modules/production/RevenueAmountModel");
const AcPointVal = require("../../../model/modules/production/acpointscalculation");
const DepartmentMonth = require("../../../model/modules/departmentmonthset");
const ExcelJS = require("exceljs");
const fastCsv = require("fast-csv");
const PdfPrinter = require("pdfmake");

// get All ClientUserID Name => /api/clientuserids
exports.getAllDayPointsUpload = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload;
  try {
    daypointsupload = await DayPointsUpload.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!daypointsupload) {
    return next(new ErrorHandler("Day Points Upload not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    daypointsupload,
  });
});

//document preparation
exports.getDocumentPrepProductionDate = catchAsyncErrors(
  async (req, res, next) => {
    let daypointsupload;
    const { user, date } = req.body;
    try {
      const uplodedData = await DayPointsUpload.findOne({ date: date }, {});
      daypointsupload = uplodedData
        ? uplodedData?.uploaddata?.filter(
            (data) =>
              data?.name === user?.value &&
              data?.companyname === user?.company &&
              data?.branch === user?.branch &&
              data?.unit === user?.unit &&
              data?.team === user?.team
          )
        : console.log(daypointsupload, "daypointsupload");
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
      // count: products.length,
      daypointsupload,
    });
  }
);

// get All ClientUserID Name => /api/clientuserids
exports.checkDayPointdate = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload;
  try {
    daypointsupload = await DayPointsUpload.find(
      { date: req.body.date },
      { _id: 1 }
    );
  } catch (err) {
    console.log(err.message);
  }
  if (!daypointsupload) {
    return next(new ErrorHandler("Day Points Upload not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    daypointsupload,
  });
});
// get All ClientUserID Name => /api/clientuserids
exports.getAllDayPointsUploadLimited = catchAsyncErrors(
  async (req, res, next) => {
    let daypointsupload;
    try {
      daypointsupload = await DayPointsUpload.find(
        {},
        { filename: 1, date: 1, type: 1 }
      );
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!daypointsupload) {
      return next(new ErrorHandler("Day Points Upload not found!", 404));
    }
    return res.status(200).json({
      // count: products.length,
      daypointsupload,
    });
  }
);

exports.dayPointsMonthYearFilter = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload, answer;
  try {
    const { ismonth, isyear } = req.body;

    const from_date = new Date(isyear, ismonth - 1, 1);

    // Calculate the last day of the previous month
    const last_day_prev_month = new Date(
      from_date.getFullYear(),
      from_date.getMonth(),
      0
    );

    // Get the 15th day of the previous month
    const before_month_date = new Date(
      last_day_prev_month.getFullYear(),
      last_day_prev_month.getMonth(),
      25
    );

    // Get the 15th day of the next month
    const next_month = new Date(
      from_date.getFullYear(),
      from_date.getMonth() + 1,
      5
    );

    let fromdate = before_month_date.toISOString().split("T")[0];
    let todate = next_month.toISOString().split("T")[0];
    const conditions = [];

    if (fromdate && todate) {
      conditions.push({
        $and: [
          { $gte: [{ $toDate: "$$upload.date" }, { $toDate: fromdate }] },
          { $lte: [{ $toDate: "$$upload.date" }, { $toDate: todate }] },
        ],
      });
    }

    const cond = {
      $and: conditions,
    };

    daypointsupload = await DayPointsUpload.aggregate([
      {
        $project: {
          uploaddata: {
            $filter: {
              input: "$uploaddata",
              as: "upload",
              cond: cond,
            },
          },
        },
      },
    ]);

    answer = daypointsupload.flatMap((data) => data.uploaddata);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!answer) {
    return next(new ErrorHandler("Day Points Upload not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    answer,
  });
});
exports.dayPointsMonthYearFilterNxtMonth = catchAsyncErrors(
  async (req, res, next) => {
    let daypointsupload, answer;
    try {
      const { ismonth, isyear } = req.body;

      const from_date = new Date(isyear, ismonth - 1, 1);

      // Calculate the last day of the previous month
      const last_day_prev_month = new Date(
        from_date.getFullYear(),
        from_date.getMonth(),
        0
      );

      // Get the 15th day of the previous month
      const before_month_date = new Date(
        last_day_prev_month.getFullYear(),
        last_day_prev_month.getMonth(),
        20
      );

      // Get the 15th day of the next month
      const next_month = new Date(
        from_date.getFullYear(),
        from_date.getMonth() + 1,
        10
      );

      let fromdate = before_month_date.toISOString().split("T")[0];
      let todate = next_month.toISOString().split("T")[0];

      const conditions = [];

      if (fromdate && todate) {
        conditions.push({
          $and: [
            { $gte: [{ $toDate: "$$upload.date" }, { $toDate: fromdate }] },
            { $lte: [{ $toDate: "$$upload.date" }, { $toDate: todate }] },
          ],
        });
      }

      const cond = {
        $and: conditions,
      };

      daypointsupload = await DayPointsUpload.aggregate([
        {
          $project: {
            uploaddata: {
              $filter: {
                input: "$uploaddata",
                as: "upload",
                cond: cond,
              },
            },
          },
        },
      ]);

      answer = daypointsupload.flatMap((data) => data.uploaddata);
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!answer) {
      return next(new ErrorHandler("Day Points Upload not found!", 404));
    }
    return res.status(200).json({
      // count: products.length,
      answer,
    });
  }
);
// get All ClientUserID Name => /api/clientuserids
exports.dayPointsfilter = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload, minipoints, productionupload;
  try {
    const {
      fromdate,
      todate,
      less,
      greater,
      compare,
      betweenfrom,
      betweento,
      company,
      unit,
      team,
      branch,
      empnames,
    } = req.body;
    console.log(fromdate, todate, "llllll");

    // minpoints = await MinimumPoints.find({}, { name: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, month: 1, year: 1, daypoint: 1, department: 1 });
    let departments = await Department.find({}, { deptname: 1, prod: 1 });
    let users = await User.find(
      {
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
      },
      {
        department: 1,
        company: 1,
        branch: 1,
        unit: 1,
        team: 1,
        empcode: 1,
        companyname: 1,
        assignExpLog: 1,
        processlog: 1,
        doj: 1,
      }
    );
    let salSlabs = await SalarySlabs.find(
      {},
      {
        company: 1,
        branch: 1,
        salarycode: 1,
        basic: 1,
        hra: 1,
        salaryslablimited: 1,
        medicalallowance: 1,
        conveyance: 1,
        productionallowance: 1,
        otherallowance: 1,
      }
    );
    let manageshortagemasters = await ShortageMaster.find(
      {},
      { department: 1, from: 1, to: 1, amount: 1 }
    );
    let revenueAmount = await RevenueAmount.find(
      {},
      { branch: 1, company: 1, processcode: 1, amount: 1 }
    );
    let acPointCal = await AcPointVal.find(
      {},
      { branch: 1, company: 1, department: 1, dividevalue: 1, multiplevalue: 1 }
    );

    const conditions = [];

    if (fromdate && todate) {
      conditions.push({
        $and: [
          { $gte: ["$$upload.date", fromdate] },
          { $lte: ["$$upload.date", todate] },
        ],
      });
    }

    if (company && company.length > 0) {
      conditions.push({ $in: ["$$upload.companyname", company] });
    }

    if (branch && branch.length > 0) {
      conditions.push({ $in: ["$$upload.branch", branch] });
    }

    if (unit && unit.length > 0) {
      conditions.push({ $in: ["$$upload.unit", unit] });
    }

    if (team && team.length > 0) {
      conditions.push({ $in: ["$$upload.team", team] });
    }

    if (empnames && empnames.length > 0) {
      conditions.push({ $in: ["$$upload.name", empnames] });
    }

    const cond = {
      $and: conditions,
    };

    daypointsupload = await DayPointsUpload.aggregate([
      {
        $project: {
          uploaddata: {
            $filter: {
              input: "$uploaddata",
              as: "upload",
              cond: cond,
            },
          },
        },
      },
    ]);

    let answer = daypointsupload.flatMap((data) =>
      data.uploaddata.map((upload) => ({
        companyname: upload.companyname,
        name: upload.name,
        empcode: upload.empcode,
        branch: upload.branch,
        unit: upload.unit,
        team: upload.team,
        date: upload.date,
        target: upload.target,
        point: upload.point,
        avgpoint: upload.avgpoint,
        id: upload._id,
        mainid: data._id,
      }))
    );

    const filteredArray = answer.map((obj1) => {
      const splitDate = obj1.date.split("-");
      const oldyear = splitDate[0];
      const oldmonth = splitDate[1];

      // const matchingMinpoint = minpoints.find((obj2) => {
      //   return (
      //     obj1.name === obj2.name &&
      //     obj1.branch === obj2.branch &&
      //     // obj1.companyname === obj2.company
      //     // && obj1.empcode === obj2.empcode
      //     // &&
      //     obj1.unit === obj2.unit &&
      //     Number(oldmonth) === Number(obj2.month) &&
      //     Number(oldyear) === Number(obj2.year) &&
      //     obj1.team === obj2.team
      //   );
      // });

      // if (matchingMinpoint) {
      //   obj1.daypoint = matchingMinpoint.daypoint;
      // }

      const matchingMinpointuser = users.find((obj2) => {
        return (
          obj1.name === obj2.companyname &&
          obj1.branch === obj2.branch &&
          // obj1.companyname === obj2.company
          //  && obj1.empcode === obj2.empcode
          // &&
          obj1.unit === obj2.unit &&
          obj1.team === obj2.team
        );
      });

      if (matchingMinpointuser) {
        obj1.department = matchingMinpointuser.department;
        obj1.assignExpLog = matchingMinpointuser.assignExpLog;
        obj1.processlog = matchingMinpointuser.processlog;
        obj1.doj = matchingMinpointuser.doj;
      }

      const matchingMinpointdept = departments.find((obj2) => {
        return obj1.department === obj2.deptname;
      });

      if (matchingMinpointdept) {
        obj1.prod = matchingMinpointdept.prod;
      }

      return obj1;
    });
    const itemsWithSerialNumber = filteredArray?.map((item, index) => {
      const groupedByMonth = {};
      // Group items by month
      item.assignExpLog &&
        item.assignExpLog.forEach((d) => {
          const monthYear = d.updatedate.split("-").slice(0, 2).join("-");
          if (!groupedByMonth[monthYear]) {
            groupedByMonth[monthYear] = [];
          }
          groupedByMonth[monthYear].push(d);
        });

      // Extract the last item of each group
      const lastItemsForEachMonth = Object.values(groupedByMonth).map(
        (group) => group[group.length - 1]
      );

      // Filter the data array based on the month and year
      lastItemsForEachMonth.sort((a, b) => {
        return new Date(a.updatedate) - new Date(b.updatedate);
      });

      // Find the first item in the sorted array that meets the criteria
      let filteredDataMonth = null;
      for (let i = 0; i < lastItemsForEachMonth.length; i++) {
        const date = lastItemsForEachMonth[i].updatedate;

        if (item.date >= date) {
          filteredDataMonth = lastItemsForEachMonth[i];
        } else {
          break;
        }
      }
      // let modevalue = item.assignExpLog[item.assignExpLog.length - 1];
      let modevalue = filteredDataMonth;

      // Calculate difference in months between findDate and item.doj

      let differenceInMonths, differenceInMonthsexp, differenceInMonthstar;
      if (modevalue) {
        //findexp end difference yes/no
        if (modevalue.endexp === "Yes") {
          differenceInMonthsexp = Math.floor(
            (new Date(modevalue.endexpdate) - new Date(item.doj)) /
              (30 * 24 * 60 * 60 * 1000)
          );
          if (modevalue.expmode === "Add") {
            differenceInMonthsexp += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthsexp -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthsexp = parseInt(modevalue.expval);
          }
        } else {
          differenceInMonthsexp = Math.floor(
            (new Date(item.date) - new Date(item.doj)) /
              (30 * 24 * 60 * 60 * 1000)
          );
          if (modevalue.expmode === "Add") {
            differenceInMonthsexp += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthsexp -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthsexp = parseInt(modevalue.expval);
          } else {
            // differenceInMonths = parseInt(modevalue.expval);
            differenceInMonthsexp = Math.floor(
              (new Date(item.date) - new Date(item.doj)) /
                (30 * 24 * 60 * 60 * 1000)
            );
          }
        }

        //findtar end difference yes/no
        if (modevalue.endtar === "Yes") {
          differenceInMonthstar = Math.floor(
            (new Date(modevalue.endtardate) - new Date(item.doj)) /
              (30 * 24 * 60 * 60 * 1000)
          );
          if (modevalue.expmode === "Add") {
            differenceInMonthstar += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthstar -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthstar = parseInt(modevalue.expval);
          }
        } else {
          differenceInMonthstar = Math.floor(
            (new Date(item.date) - new Date(item.doj)) /
              (30 * 24 * 60 * 60 * 1000)
          );
          if (modevalue.expmode === "Add") {
            differenceInMonthstar += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthstar -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthstar = parseInt(modevalue.expval);
          } else {
            // differenceInMonths = parseInt(modevalue.expval);
            differenceInMonthstar = Math.floor(
              (new Date(item.date) - new Date(item.doj)) /
                (30 * 24 * 60 * 60 * 1000)
            );
          }
        }

        differenceInMonths = Math.floor(
          (new Date(item.date) - new Date(item.doj)) /
            (30 * 24 * 60 * 60 * 1000)
        );
        if (modevalue.expmode === "Add") {
          differenceInMonths += parseInt(modevalue.expval);
        } else if (modevalue.expmode === "Minus") {
          differenceInMonths -= parseInt(modevalue.expval);
        } else if (modevalue.expmode === "Fix") {
          differenceInMonths = parseInt(modevalue.expval);
        } else {
          // differenceInMonths = parseInt(modevalue.expval);
          differenceInMonths = Math.floor(
            (new Date(item.date) - new Date(item.doj)) /
              (30 * 24 * 60 * 60 * 1000)
          );
        }
      } else {
        differenceInMonthsexp = Math.floor(
          (new Date(item.date) - new Date(item.doj)) /
            (30 * 24 * 60 * 60 * 1000)
        );
        differenceInMonthstar = Math.floor(
          (new Date(item.date) - new Date(item.doj)) /
            (30 * 24 * 60 * 60 * 1000)
        );
        differenceInMonths = Math.floor(
          (new Date(item.date) - new Date(item.doj)) /
            (30 * 24 * 60 * 60 * 1000)
        );
      }

      const groupedByMonthProcs = {};

      // Group items by month
      item.processlog &&
        item.processlog.forEach((d) => {
          const monthYear = d.date.split("-").slice(0, 2).join("-");
          if (!groupedByMonthProcs[monthYear]) {
            groupedByMonthProcs[monthYear] = [];
          }
          groupedByMonthProcs[monthYear].push(d);
        });

      // Extract the last item of each group
      const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map(
        (group) => group[group.length - 1]
      );

      // Filter the data array based on the month and year
      lastItemsForEachMonthPros.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      // Find the first item in the sorted array that meets the criteria
      let filteredItem = null;

      for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
        const date = lastItemsForEachMonthPros[i].date;
        // const splitedDate = date.split("-");
        // const itemYear = splitedDate[0];
        // const itemMonth = splitedDate[1]; // Adding 1 because getMonth() returns 0-indexed month
        // if (Number(itemYear) === selectedYear && Number(itemMonth) === Number(selectedMonthNum)) {
        //   filteredItem = lastItemsForEachMonthPros[i];
        //   break;
        // } else if (Number(itemYear) < selectedYear || (Number(itemYear) === selectedYear && Number(itemMonth) < Number(selectedMonthNum))) {
        //   filteredItem = lastItemsForEachMonthPros[i]; // Keep updating the filteredItem until the criteria is met
        // } else {
        //   break; // Break the loop if we encounter an item with year and month greater than selected year and month
        // }
        if (item.date >= date) {
          filteredItem = lastItemsForEachMonthPros[i];
        }
        //  else if (date <= item.date) {
        //   filteredItem = lastItemsForEachMonthPros[i];
        // }
        else {
          break;
        }
      }

      let getprocessCode = filteredItem ? filteredItem.process : "";

      // let procCodecheck = item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : 0) : "";
      let processcodeexpvalue =
        item.doj && modevalue && modevalue.expmode == "Manual"
          ? modevalue.salarycode +
            (differenceInMonthsexp > 0
              ? differenceInMonthsexp <= 9
                ? `0${differenceInMonthsexp}`
                : differenceInMonthsexp
              : "00")
          : item.doj
          ? getprocessCode +
            (differenceInMonthsexp > 0
              ? differenceInMonthsexp <= 9
                ? `0${differenceInMonthsexp}`
                : differenceInMonthsexp
              : "00")
          : "";
      //findsalary from salaryslab
      let findSalDetails = salSlabs.find(
        (d) =>
          d.company === item.companyname &&
          d.branch === item.branch &&
          d.salarycode === processcodeexpvalue
      );
      //shortageamount from shortage master
      let findShortage = manageshortagemasters.find(
        (d) =>
          d.department === item.department &&
          differenceInMonths >= Number(d.from) &&
          differenceInMonths <= Number(d.to)
      );
      //revenue amount from revenue  master
      let findRevenueAllow = revenueAmount.find(
        (d) =>
          d.company === item.companyname &&
          d.branch === item.branch &&
          d.processcode === processcodeexpvalue
      );

      let findAcPointVal = acPointCal.find(
        (d) =>
          d.company === item.companyname &&
          d.branch === item.branch &&
          d.department === item.department
      );

      // GROSS VALUE
      let grossValue =
        modevalue && modevalue.expmode == "Manual"
          ? modevalue.gross
          : findSalDetails
          ? Number(findSalDetails.basic) +
            Number(findSalDetails.hra) +
            Number(findSalDetails.conveyance) +
            Number(findSalDetails.medicalallowance) +
            Number(findSalDetails.productionallowance) +
            Number(findSalDetails.otherallowance)
          : "";

      let egvalue =
        Number(grossValue) + (findShortage ? Number(findShortage.amount) : 0);

      let hfvalue =
        egvalue - (findRevenueAllow ? Number(findRevenueAllow.amount) : 0);
      // let i60value = Number(hfvalue) / 60;
      // let j85value = (i60value * 8.5) / 27;
      let i60value =
        Number(hfvalue) /
        (findAcPointVal && Number(findAcPointVal.multiplevalue));
      let j85value =
        (i60value * (findAcPointVal && Number(findAcPointVal.dividevalue))) /
        27;

      return {
        assignExpLog: item.assignExpLog,
        branch: item.branch,
        department: item.department,
        empcode: item.empcode,
        name: item.name,
        point: item.point,
        companyname: item.companyname,
        processlog: item.processlog,
        prod: item.prod,
        doj: item.doj,
        date: item.date,
        target: item.target,
        team: item.team,
        unit: item.unit,
        id: item.id,
        daypoint: Number(j85value),
      };
    });
    // let filtereary = filteredArray.map(item => item[0])
    let belowMin = itemsWithSerialNumber.reduce((acc, current) => {
      const existingItemIndex = acc.findIndex(
        (item) =>
          item.name === current.name &&
          // && item.companyname === current.companyname
          item.branch === current.branch &&
          item.unit === current.unit &&
          item.team === current.team &&
          item.empcode === current.empcode
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const existingItem = acc[existingItemIndex];

        existingItem.point += Number(current.point);
        existingItem.daypoint += Number(current.daypoint);
        existingItem.target += Number(current.target);
        existingItem.date.push(current.date);

        existingItem.avgpoint =
          (existingItem.point / existingItem.target) * 100;

        // Convert the dates array to Date objects
        const dateObjects = existingItem.date.map((date) => new Date(date));

        // Find the earliest (from) and latest (to) dates
        const fromDate = new Date(Math.min(...dateObjects));
        const toDate = new Date(Math.max(...dateObjects));

        // Format the dates as strings in "YYYY-MM-DD" format
        const formattedFromDate = fromDate.toISOString().split("T")[0];
        const formattedToDate = toDate.toISOString().split("T")[0];

        // Update start and end date
        existingItem.startDate = fromDate;
        existingItem.endDate = toDate;
      } else {
        // Add new item
        acc.push({
          companyname: current.companyname,
          name: current.name,
          daypoint: Number(current.daypoint),
          avgpoint: (Number(current.point) / Number(current.target)) * 100,
          point: Number(current.point),
          target: Number(current.target),
          _id: current.id,
          branch: current.branch,
          date: [current.date],
          unit: current.unit,
          team: current.team,
          empcode: current.empcode,
          doj: current.doj,
          department: current.department,
          prod: current.prod,
          startDate: current.date,
          endDate: current.date,
        });
      }
      return acc;
    }, []);

    if (compare == "Below Minimum Points") {
      productionupload = belowMin.filter(
        (item) =>
          Number(item.daypoint) > Number(item.point) && item.prod === true
      );
    } else if (compare == "Below Target Points") {
      productionupload = belowMin.filter(
        (item) => Number(item.target) > Number(item.point) && item.prod === true
      );
    } else if (compare == "Less than") {
      productionupload = belowMin.filter(
        (item) => Number(item.avgpoint) < Number(less) && item.prod === true
      );
    } else if (compare == "Greater than") {
      productionupload = belowMin.filter(
        (item) => Number(item.avgpoint) > Number(greater) && item.prod === true
      );
    } else if (compare == "Between") {
      productionupload = belowMin.filter(
        (item) =>
          Number(item.avgpoint) >= Number(betweenfrom) &&
          Number(item.avgpoint) <= Number(betweento) &&
          item.prod === true
      );
    } else {
      productionupload = belowMin.filter((item) => item.prod === true);
    }
    console.log(productionupload, "productionuploadmne");
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return next(new ErrorHandler("Internal Server Error", 500));
  }
  if (!productionupload) {
    return next(new ErrorHandler("Day Points Upload not found!", 404));
  }
  return res.status(200).json(productionupload);
});

// get All ClientUserID Name => /api/clientuserids
exports.dayPointsDatasFetch = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload,
    minpoints,
    productionupload,
    productionuploads,
    users,
    departments;
  try {
    const { fromdate, todate } = req.body;
    // console.log(req.body, "req")
    minpoints = await MinimumPoints.find(
      {},
      {
        name: 1,
        company: 1,
        branch: 1,
        unit: 1,
        team: 1,
        empcode: 1,
        month: 1,
        year: 1,
        daypoint: 1,
        department: 1,
      }
    );
    departments = await Department.find({}, { deptname: 1, prod: 1 });
    users = await User.find(
      {
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
      },
      {
        department: 1,
        company: 1,
        branch: 1,
        unit: 1,
        team: 1,
        empcode: 1,
        companyname: 1,
      }
    );

    const conditions = [];

    if (fromdate && todate) {
      conditions.push({
        $and: [
          { $gte: ["$$upload.date", fromdate] },
          { $lte: ["$$upload.date", todate] },
        ],
      });
    }

    const cond = {
      $and: conditions,
    };

    daypointsupload = await DayPointsUpload.aggregate([
      {
        $project: {
          uploaddata: {
            $filter: {
              input: "$uploaddata",
              as: "upload",
              cond: cond,
            },
          },
        },
      },
    ]);

    let answer = daypointsupload.flatMap((data) =>
      data.uploaddata.map((upload) => ({
        companyname: upload.companyname,
        name: upload.name,
        empcode: upload.empcode,
        branch: upload.branch,
        unit: upload.unit,
        team: upload.team,
        date: upload.date,
        target: upload.target,
        point: upload.point,
        avgpoint: upload.avgpoint,
        id: upload._id,
        mainid: data._id,
      }))
    );

    const filteredArray = answer.map((obj1) => {
      const splitDate = obj1.date.split("-");
      const oldyear = splitDate[0];
      const oldmonth = splitDate[1];

      const matchingMinpoint = minpoints.find((obj2) => {
        return (
          obj1.name === obj2.name &&
          obj1.branch === obj2.branch &&
          obj1.companyname === obj2.company &&
          obj1.empcode === obj2.empcode &&
          obj1.unit === obj2.unit &&
          Number(oldmonth) === Number(obj2.month) &&
          Number(oldyear) === Number(obj2.year) &&
          obj1.team === obj2.team
        );
      });

      if (matchingMinpoint) {
        obj1.daypoint = matchingMinpoint.daypoint;
      }

      const matchingMinpointuser = users.find((obj2) => {
        return (
          obj1.name === obj2.companyname &&
          obj1.branch === obj2.branch &&
          obj1.companyname === obj2.company &&
          obj1.unit === obj2.unit &&
          obj1.team === obj2.team
        );
      });

      if (matchingMinpointuser) {
        obj1.department = matchingMinpointuser.department;
      }

      const matchingMinpointdept = departments.find((obj2) => {
        return obj1.department === obj2.deptname;
      });

      if (matchingMinpointdept) {
        obj1.prod = matchingMinpointdept.prod;
      }

      return obj1;
    });

    productionuploads = filteredArray.reduce((acc, current) => {
      const existingItemIndex = acc.findIndex(
        (item) =>
          item.name === current.name &&
          item.company === current.company &&
          item.branch === current.branch &&
          item.unit === current.unit &&
          item.team === current.team &&
          item.empcode === current.empcode
      );

      if (existingItemIndex !== -1) {
        // Update existing item
        const existingItem = acc[existingItemIndex];
        existingItem.daypoint += Number(current.daypoint);
        // existingItem.avgpoint += Number(current.avgpoint);
        existingItem.point += Number(current.point);
        existingItem.target += Number(current.target);
        existingItem.date.push(current.date);

        // Convert the dates array to Date objects
        const dateObjects = existingItem.date.map((date) => new Date(date));

        // Find the earliest (from) and latest (to) dates
        const fromDate = new Date(Math.min(...dateObjects));
        const toDate = new Date(Math.max(...dateObjects));

        // Format the dates as strings in "YYYY-MM-DD" format
        const formattedFromDate = fromDate.toISOString().split("T")[0];
        const formattedToDate = toDate.toISOString().split("T")[0];

        // Update start and end date
        existingItem.startDate = fromDate;
        existingItem.endDate = toDate;
        existingItem.avgpoint =
          (existingItem.point / existingItem.target) * 100;
      } else {
        // Add new item
        acc.push({
          companyname: current.companyname,
          name: current.name,
          daypoint: Number(current.daypoint),
          avgpoint: Number(current.avgpoint),
          point: Number(current.point),
          target: Number(current.target),
          date: [current.date], // Store date as an array
          _id: current.id,
          branch: current.branch,
          unit: current.unit,
          team: current.team,
          empcode: current.empcode,
          department: current.department,
          startDate: current.date, // Initial start date
          endDate: current.date, // Initial end date
        });
      }

      return acc;
    }, []);
    productionupload = productionuploads.filter((item) => item.prod === true);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!productionupload) {
    return next(new ErrorHandler("Day Points Upload not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    productionupload,
  });
});
// Create new DayPointsUpload=> /api/clientuserid/new
exports.addDayPointsUpload = catchAsyncErrors(async (req, res, next) => {
  let adaypointsupload = await DayPointsUpload.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle DayPointsUpload => /api/clientuserid/:id
exports.getSingleDayPointsUpload = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sdaypointsupload = await DayPointsUpload.findById(id);

  if (!sdaypointsupload) {
    return next(new ErrorHandler("Day Points Upload not found!", 404));
  }
  return res.status(200).json({
    sdaypointsupload,
  });
});

// update DayPointsUpload by id => /api/clientuserid/:id
exports.updateDayPointsUpload = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let udaypointsupload = await DayPointsUpload.findByIdAndUpdate(id, req.body);
  if (!udaypointsupload) {
    return next(new ErrorHandler("Day Points Upload not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

exports.updateDayPointsSingleUpload = catchAsyncErrors(
  async (req, res, next) => {
    const subid = req.params.id;
    req.body.id = subid;
    try {
      const uploaddata = await DayPointsUpload.findOneAndUpdate(
        { "uploaddata._id": subid },
        { $set: { "uploaddata.$": req.body } },
        { new: true }
      );

      if (uploaddata) {
        return res.status(200).json({ message: "Updated successfully" });
      } else {
        return next(new ErrorHandler("Something went wrong", 500));
      }
    } catch (err) {
      return next(new ErrorHandler("Internal Server Error", 500)); // Handle internal server error
    }
  }
);

// delete DayPointsUpload by id => /api/clientuserid/:id
exports.deleteDayPointsUpload = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let ddaypointsupload = await DayPointsUpload.findByIdAndRemove(id);

  if (!ddaypointsupload) {
    return next(new ErrorHandler("Day Points Upload not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
// get All ClientUserID Name => /api/clientuserids
exports.getEmployeeProductionLastThreeMonths = catchAsyncErrors(
  async (req, res, next) => {
    let daypointsupload = [];
    try {
      const { empname, department } = req.body;

      let dateNow = new Date();
      let datevalue = dateNow.toISOString().split("T")[0];

      const findCurrdeptMonthSets = await DepartmentMonth.find(
        {
          fromdate: { $lte: datevalue },
          todate: { $gte: datevalue },
          year: dateNow.getFullYear(),
          department: department,
        },
        { monthname: 1, year: 1 }
      );

      let currMonthYear = findCurrdeptMonthSets[0];

      // Function to get previous months
      const getPreviousMonths = (currentMonth, currentYear, monthsBack) => {
        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        let monthIndex = months.indexOf(currentMonth);
        let previousMonths = [];

        for (let i = 1; i <= monthsBack; i++) {
          monthIndex -= 1;

          if (monthIndex < 0) {
            monthIndex = 11; // wrap around to December
            currentYear -= 1; // go back a year
          }
          previousMonths.push({
            monthname: months[monthIndex],
            year: currentYear,
          });
        }

        return previousMonths;
      };

      // Get the three previous months
      const previousMonths = getPreviousMonths(
        currMonthYear.monthname,
        currMonthYear.year,
        3
      );

      let query = {
        // $or: previousMonths,
        $or: [
          ...previousMonths,
          { monthname: currMonthYear.monthname, year: currMonthYear.year },
        ],
        department: department,
      };

      const lastThreedeptMonthSets = await DepartmentMonth.find(query, {
        _id: 0,
        fromdate: 1,
        todate: 1,
      });

      let finalFromToDate = lastThreedeptMonthSets.sort(
        (a, b) => new Date(a.fromdate) - new Date(b.fromdate)
      );

      const result = {
        fromdate: finalFromToDate[0].fromdate,
        // todate: finalFromToDate[finalFromToDate.length - 1].todate
        todate: datevalue,
      };

      daypointsupload = await DayPointsUpload.find(
        { date: { $gte: result.fromdate, $lte: result.todate } },
        { uploaddata: 1, date: 1 }
      );

      return res.status(200).json({
        // count: products.length,
        daypointsupload,
        finalFromToDate,
        query,
        result,
      });
    } catch (err) {
      console.log(err.message);
    }
  }
);

exports.getAllDayPointsUploadLimitedDateOnly = catchAsyncErrors(
  async (req, res, next) => {
    let daypointsupload;
    try {
      daypointsupload = await DayPointsUpload.find({}, { date: 1 });
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!daypointsupload) {
      return next(new ErrorHandler("Day Points Upload not found!", 404));
    }
    return res.status(200).json({
      // count: products.length,
      daypointsupload,
    });
  }
);

exports.getDayPointIdByDate = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload;
  try {
    daypointsupload = await DayPointsUpload.findOne(
      { date: req.body.date },
      { _id: 1 }
    );
    console.log(daypointsupload, "daypointsupload");
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!daypointsupload) {
    return next(new ErrorHandler("Day Points Upload not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    daypointsupload,
  });
});

exports.dayPointsfilterHome = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload, minipoints, productionupload;
  try {
    const { fromdate, todate, compare } = req.body;

    // minpoints = await MinimumPoints.find({}, { name: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, month: 1, year: 1, daypoint: 1, department: 1 });
    const query = {};

    if (fromdate && todate) {
      query.date = { $gte: fromdate, $lte: todate };
      // conditions.push({ $and: [{ $gte: ["$$upload.date", fromdate] }, { $lte: ["$$upload.date", todate] }] });
    }

    // let users = await User.find({
    //   resonablestatus: {
    //     $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
    //   }
    // }, { department: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, companyname: 1, assignExpLog: 1, processlog: 1, doj: 1 });

    // let salSlabs = await SalarySlabs.find({}, { company: 1, branch: 1, salarycode: 1, basic: 1, hra: 1, salaryslablimited: 1, medicalallowance: 1, conveyance: 1, productionallowance: 1, otherallowance: 1 });
    // let manageshortagemasters = await ShortageMaster.find({}, { department: 1, from: 1, to: 1, amount: 1 });
    // let revenueAmount = await RevenueAmount.find({}, { branch: 1, company: 1, processcode: 1, amount: 1 });
    // let acPointCal = await AcPointVal.find({}, { branch: 1, company: 1, department: 1, dividevalue: 1, multiplevalue: 1 });
    // let departments = await Department.find({}, { deptname: 1, prod: 1 });

    // daypointsupload = await DayPointsUpload.find(query, { uploaddata: 1 }).limit(6);

    const [
      users,
      // salSlabs,
      manageshortagemasters,
      // revenueAmount,
      acPointCal,
      departments,
      daypointsupload,
    ] = await Promise.all([
      User.find(
        {
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
        },
        {
          department: 1,
          company: 1,
          branch: 1,
          unit: 1,
          team: 1,
          empcode: 1,
          companyname: 1,
          assignExpLog: 1,
          processlog: 1,
          doj: 1,
        }
      ),
      // SalarySlabs.find(
      //   {},
      //   {
      //     company: 1,
      //     branch: 1,
      //     salarycode: 1,
      //     basic: 1,
      //     hra: 1,
      //     salaryslablimited: 1,
      //     medicalallowance: 1,
      //     conveyance: 1,
      //     productionallowance: 1,
      //     otherallowance: 1,
      //   }
      // ),
      ShortageMaster.find({}, { department: 1, from: 1, to: 1, amount: 1 }),
      // RevenueAmount.find({}, { branch: 1, company: 1, processcode: 1, amount: 1 }),
      AcPointVal.find(
        {},
        {
          branch: 1,
          company: 1,
          department: 1,
          dividevalue: 1,
          multiplevalue: 1,
        }
      ),
      Department.find({}, { deptname: 1, prod: 1 }),
      DayPointsUpload.find(query, { uploaddata: 1 }).limit(5),
    ]);

    // console.log(daypointsupload.length, query, "daypointsupload")
    if (daypointsupload.length > 0) {
      let answer = daypointsupload.flatMap((data) =>
        data.uploaddata
          .filter((item, index) => index <= 6)
          .map((upload) => ({
            companyname: upload.companyname,
            name: upload.name,
            empcode: upload.empcode,
            branch: upload.branch,
            unit: upload.unit,
            team: upload.team,
            date: upload.date,
            processcode: upload.processcode,
            exper: upload.exper,

            target: upload.target,
            point: upload.point,
            avgpoint: upload.avgpoint,
            id: upload._id,
            mainid: data._id,
          }))
      );
      const filteredArray = answer
        .filter((item, index) => index <= 5)
        .map((obj1) => {
          const splitDate = obj1.date.split("-");
          const oldyear = splitDate[0];
          const oldmonth = splitDate[1];

          const matchingMinpointuser = users.find((obj2) => {
            return (
              obj1.name === obj2.companyname &&
              obj1.branch === obj2.branch &&
              // obj1.companyname === obj2.company
              //  && obj1.empcode === obj2.empcode
              // &&
              obj1.unit === obj2.unit &&
              obj1.team === obj2.team
            );
          });

          if (matchingMinpointuser) {
            obj1.department = matchingMinpointuser.department;
            obj1.assignExpLog = matchingMinpointuser.assignExpLog;
            obj1.processlog = matchingMinpointuser.processlog;
            obj1.doj = matchingMinpointuser.doj;
          }

          const matchingMinpointdept = departments.find((obj2) => {
            return obj1.department === obj2.deptname;
          });

          if (matchingMinpointdept) {
            obj1.prod = matchingMinpointdept.prod;
          }

          return obj1;
        });
      console.log(filteredArray.length, "filteredArray");
      // let filtereary = filteredArray.map(item => item[0])
      let belowMin = filteredArray.reduce((acc, current) => {
        const existingItemIndex = acc.findIndex(
          (item) =>
            item.name === current.name &&
            // && item.companyname === current.companyname
            item.branch === current.branch &&
            item.unit === current.unit &&
            item.team === current.team &&
            item.empcode === current.empcode
        );

        if (existingItemIndex !== -1) {
          // Update existing item
          const existingItem = acc[existingItemIndex];

          existingItem.point += Number(current.point);
          existingItem.daypoint += Number(current.daypoint);
          existingItem.target += Number(current.target);
          existingItem.date.push(current.date);

          existingItem.avgpoint =
            (existingItem.point / existingItem.target) * 100;

          // Convert the dates array to Date objects
          const dateObjects = existingItem.date.map((date) => new Date(date));

          // Find the earliest (from) and latest (to) dates
          const fromDate = new Date(Math.min(...dateObjects));
          const toDate = new Date(Math.max(...dateObjects));

          // Format the dates as strings in "YYYY-MM-DD" format
          const formattedFromDate = fromDate.toISOString().split("T")[0];
          const formattedToDate = toDate.toISOString().split("T")[0];

          // Update start and end date
          existingItem.startDate = fromDate;
          existingItem.endDate = toDate;
        } else {
          // Add new item
          acc.push({
            companyname: current.companyname,
            name: current.name,
            daypoint: Number(current.daypoint),
            avgpoint: (Number(current.point) / Number(current.target)) * 100,
            point: Number(current.point),
            target: Number(current.target),
            _id: current.id,
            branch: current.branch,
            date: [current.date],
            unit: current.unit,
            team: current.team,
            empcode: current.empcode,
            processcode: current.processcode,
            exper: current.exper,
            doj: current.doj,
            department: current.department,
            prod: current.prod,
            startDate: current.date,
            endDate: current.date,
          });
        }
        return acc;
      }, []);

      const processcodes = belowMin?.map((item, index) => {
        let findexpval =
          Number(item.exper) < 1
            ? "00"
            : Number(item.exper) <= 9
            ? `0${Number(item.exper)}`
            : item.exper;
        return `${item.processcode}${findexpval}`;
      });

      const [salSlabs, revenueAmount] = await Promise.all([
        SalarySlabs.find(
          { salarycode: { $in: processcodes } },
          {
            company: 1,
            branch: 1,
            salarycode: 1,
            basic: 1,
            hra: 1,
            salaryslablimited: 1,
            medicalallowance: 1,
            conveyance: 1,
            productionallowance: 1,
            otherallowance: 1,
          }
        ),
        RevenueAmount.find(
          { processcode: { $in: processcodes } },
          { branch: 1, company: 1, processcode: 1, amount: 1 }
        ),
      ]);
      // console.log(salSlabs.length, revenueAmount.length, "elg")
      const itemsWithSerialNumber = belowMin?.map((item, index) => {
        const findUserDepartment = users.find(
          (d) => d.companyname === item.name
        )?.department;
        const prodTrue = departments.find(
          (data) => data.deptname === findUserDepartment
        )?.prod;

        let findexpval =
          Number(item.exper) < 1
            ? "00"
            : Number(item.exper) <= 9
            ? `0${Number(item.exper)}`
            : item.exper;
        let processcodeexpvalue = `${item.processcode}${findexpval}`;
        //findsalary from salaryslab
        let findSalDetails = salSlabs.find(
          (d) =>
            d.company === item.companyname &&
            d.branch === item.branch &&
            d.salarycode === processcodeexpvalue
        );
        //shortageamount from shortage master
        let findShortage = manageshortagemasters.find(
          (d) =>
            d.department === findUserDepartment &&
            Number(item.exper) >= Number(d.from) &&
            Number(item.exper) <= Number(d.to)
        );
        //revenue amount from revenue  master
        let findRevenueAllow = revenueAmount.find(
          (d) =>
            d.company === item.companyname &&
            d.branch === item.branch &&
            d.processcode === processcodeexpvalue
        );

        let findAcPointVal = acPointCal.find(
          (d) =>
            d.company === item.companyname &&
            d.branch === item.branch &&
            d.department === findUserDepartment
        );

        // GROSS VALUE
        let grossValue = findSalDetails
          ? Number(findSalDetails.basic) +
            Number(findSalDetails.hra) +
            Number(findSalDetails.conveyance) +
            Number(findSalDetails.medicalallowance) +
            Number(findSalDetails.productionallowance) +
            Number(findSalDetails.otherallowance)
          : 0;

        let egvalue =
          Number(grossValue) + (findShortage ? Number(findShortage.amount) : 0);

        let hfvalue =
          egvalue - (findRevenueAllow ? Number(findRevenueAllow.amount) : 0);
        // let i60value = Number(hfvalue) / 60;
        // let j85value = (i60value * 8.5) / 27;
        let i60value =
          Number(hfvalue) /
          (findAcPointVal && Number(findAcPointVal.multiplevalue));
        let j85value =
          (i60value * (findAcPointVal && Number(findAcPointVal.dividevalue))) /
          27;
        // console.log(j85value, "j85value")
        return {
          // assignExpLog: item.assignExpLog,
          branch: item.branch,
          department: findUserDepartment,
          empcode: item.empcode,
          name: item.name,
          point: item.point,
          companyname: item.companyname,
          avgpoint: item.avgpoint,
          // processlog: item.processlog,
          prod: prodTrue,
          // doj: item.doj,
          date: item.date,
          exper: item.exper,
          target: item.target,

          team: item.team,
          unit: item.unit,
          id: item.id,
          startDate: item.startDate,
          endDate: item.endDate,
          // daystatus: item.daystatus,
          // weekoff: item.weekoff,
          daypoint: Number(j85value),
        };
      });

      // console.log(itemsWithSerialNumber[0], "itemsWithSerialNumber")
      productionupload = itemsWithSerialNumber;
    } else {
      productionupload = [];
    }

    return res.status(200).json(productionupload);
  } catch (err) {
    console.log(err, "erersk");
    return next(new ErrorHandler("Records not found!", 404));
  }
});

exports.getAllDayPointByDate = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload;
  try {
    let daypointsuploadall = await DayPointsUpload.find(
      { date: { $gte: req.body.fromdate, $lte: req.body.todate } },
      { uploaddata: 1 }
    );

    daypointsupload = daypointsuploadall
      .map((data) => data.uploaddata)
      .flat()
      .reduce((acc, current) => {
        const existingItemIndex = acc.findIndex(
          (item) => item.name === current.name
          // &&
          // item.companyname === current.companyname && item.branch === current.branch &&
          //   item.unit === current.unit && item.team === current.team &&
          //   item.empcode === current.empcode
        );

        if (existingItemIndex !== -1) {
          // Update existing item
          const existingItem = acc[existingItemIndex];

          existingItem.point += Number(current.point);
          existingItem.manual += Number(current.manual);
          existingItem.production += Number(current.production);
          // existingItem.daypoint += Number(current.daypoint);
          existingItem.target +=
            current.daypointsts != "WEEKOFF" ? Number(current.target) : 0;
          existingItem.date.push(current.date);

          existingItem.allowancepoint +=
            current.conshiftpoints && current.shiftsts === "Enable"
              ? Number(current.conshiftpoints)
              : current.allowancepoint
              ? Number(current.allowancepoint)
              : 0;
          if (
            (current.conshiftpoints >= 1 && current.shiftsts === "Enable") ||
            current.allowancepoint >= 1
          ) {
            existingItem.noallowancepoint++; // Increment count only if allowancepoint is present
          }

          existingItem.avgpoint =
            existingItem.target > 0
              ? (existingItem.point / existingItem.target) * 100
              : 0;

          // Convert the dates array to Date objects
          const dateObjects = existingItem.date.map((date) => new Date(date));

          // Find the earliest (from) and latest (to) dates
          const fromDate = new Date(Math.min(...dateObjects));
          const toDate = new Date(Math.max(...dateObjects));
          // Update start and end date
          existingItem.startDate = fromDate;
          existingItem.endDate = toDate;
        } else {
          // Add new item
          acc.push({
            ...current._doc,
            companyname: current.companyname,
            manual: current.manual,
            avgpoint: (Number(current.point) / Number(current.target)) * 100,
            point: Number(current.point),
            target: Number(current.target),
            _id: current.id,
            exper: current.exper,
            branch: current.branch,
            date: [current.date],
            unit: current.unit,
            team: current.team,
            empcode: current.empcode,
            weekoff: current.daypointstatus,
            production: current.production,
            startDate: current.date,
            endDate: current.date,
            allowancepoint:
              current.conshiftpoints && current.shiftsts === "Enable"
                ? Number(current.conshiftpoints)
                : current.allowancepoint
                ? Number(current.allowancepoint)
                : 0,
            noallowancepoint:
              (current.conshiftpoints && current.shiftsts === "Enable"
                ? Number(current.conshiftpoints)
                : current.allowancepoint
                ? Number(current.allowancepoint)
                : 0) > 0
                ? 1
                : 0,
          });
        }
        return acc;
      }, []);

    // console.log(daypointsupload[0])
  } catch (err) {
    console.log(err, "daypointsupload");
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!daypointsupload) {
    return next(new ErrorHandler("Day Points Upload not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    daypointsupload,
  });
});

exports.getCheckDaypointIsCreated = catchAsyncErrors(async (req, res, next) => {
  let count;
  try {
    count = await DayPointsUpload.countDocuments({ date: req.body.date });
  } catch (err) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    count,
  });
});

// exports.getAllDayPointsUploadProductionListPointsFilter = catchAsyncErrors(
//   async (req, res, next) => {
//     let daypointsupload;
//     const {
//       company,
//       branch,
//       unit,
//       team,
//       username,
//       page,
//       pageSize,
//       fromdate,
//       todate,
//       allFilters,
//       logicOperator,
//       searchQuery,
//     } = req.body;

//     try {
//       let query = {};
//       let queryfirst = {};
//       if (fromdate && todate) {
//         queryfirst.date = { $gte: fromdate, $lte: todate };
//       }
//       if (company?.length) query["uploaddata.companyname"] = { $in: company };
//       if (branch?.length) query["uploaddata.branch"] = { $in: branch };
//       if (unit?.length) query["uploaddata.unit"] = { $in: unit };
//       if (team?.length) query["uploaddata.team"] = { $in: team };
//       if (username?.length) query["uploaddata.name"] = { $in: username };

//       //   daypointsupload = await DayPointsUpload.find();

//       const skip = (page - 1) * pageSize;
//       const limit = pageSize;

//       // Build the search criteria conditionally
//       // if (searchQuery) {
//       //   // const searchTermsArray = searchQuery.split(" ")
//       //   const searchTermsArray = searchQuery.trim().split(/\s+/).filter(Boolean);
//       //   const regexTerms = searchTermsArray.map(
//       //     (term) => new RegExp(term, "i")
//       //   );

//       //   query["$and"] = regexTerms.map((regex) => ({
//       //     $or: [
//       //       { "uploaddata.name": regex },
//       //       { "uploaddata.date": regex },
//       //       { "uploaddata.empcode": regex },
//       //       { "uploaddata.companyname": regex },
//       //       { "uploaddata.branch": regex },
//       //       { "uploaddata.unit": regex },
//       //       { "uploaddata.team": regex },
//       //       { "uploaddata.exper": regex },
//       //       { "uploaddata.target": regex },
//       //       { "uploaddata.weekoff": regex },
//       //       { "uploaddata.production": regex },
//       //       { "uploaddata.manual": regex },
//       //       { "uploaddata.nonproduction": regex },
//       //       { "uploaddata.point": regex },
//       //       { "uploaddata.allowancepoint": regex },
//       //       { "uploaddata.nonallowancepoint": regex },
//       //       { "uploaddata.avgpoint": regex },
//       //     ],
//       //   }));


   
//       // }
//       if (searchQuery) {
//   const searchTermsArray = searchQuery.trim().split(/\s+/).filter(Boolean);
//   const regexTerms = searchTermsArray.map(term => new RegExp(term, "i"));

//   query["$and"] = regexTerms.map(regex => ({
//     $or: [
//       { "uploaddata.name": regex },
//       { "uploaddata.date": regex },
//       { "uploaddata.empcode": regex },
//       { "uploaddata.companyname": regex },
//       { "uploaddata.branch": regex },
//       { "uploaddata.unit": regex },
//       { "uploaddata.team": regex },
//       { "uploaddata.exper": regex },
//       { "uploaddata.target": regex },
//       { "uploaddata.weekoff": regex },
//       { "uploaddata.production": regex },
//       { "uploaddata.manual": regex },
//       { "uploaddata.nonproduction": regex },
//       { "uploaddata.point": regex },
//       { "uploaddata.allowancepoint": regex },
//       { "uploaddata.nonallowancepoint": regex },
//       { "uploaddata.avgpoint": regex },
//     ],
//   }));
// }


//       //  console.log(query.$and[0].$or, "query")
//       const [result, totalCountAgg] = await Promise.all([
//         DayPointsUpload.aggregate([
//           { $match: queryfirst },
//           { $unwind: "$uploaddata" },
//           { $match: query },
//           {
//             $project: {
//               companyname: "$uploaddata.companyname",
//               branch: "$uploaddata.branch",
//               unit: "$uploaddata.unit",
//               empcode: "$uploaddata.empcode",
//               name: "$uploaddata.name",
//               team: "$uploaddata.team",
//               date: "$uploaddata.date",
//               exper: "$uploaddata.exper",

//               target: "$uploaddata.target",
//               weekoff: "$uploaddata.weekoff",
//               production: "$uploaddata.production",
//               manual: "$uploaddata.manual",
//               nonproduction: { $ifNull: ["$uploaddata.manual", 0] },
//               point:{
//                     $round: [ { $toDouble: "$uploaddata.point" }, 2 ],
//                   },
//               allowancepoint: {
//                 $cond: {
//                   if: { $eq: ["$uploaddata.shiftsts", "Enable"] },
//                then: {
//       $round: [
//         { $ifNull: [{ $toDouble: "$uploaddata.conshiftpoints" }, 0] },
//         2
//       ]
//     },
//                   else: { $ifNull: ["$uploaddata.allowancepoint", 0] },
//                 },
//               },

//               nonallowancepoint: {
//                 $cond: {
//                   if: { $eq: ["$uploaddata.shiftsts", "Enable"] },
//                   then: {
//                     $round: [
//                       {
//                         $subtract: [
//                           { $ifNull: [{ $toDouble: "$uploaddata.point" }, 0] },
//                           {
//                             $ifNull: [
//                               { $toDouble: "$uploaddata.conshiftpoints" },
//                               0,
//                             ],
//                           },
//                         ],
//                       },
//                       2, // <- two decimal places
//                     ],
//                   },
//                   else: { $ifNull: ["$uploaddata.noallowancepoint", 0] },
//                 },
//               },

//                  avgpoint:{
//                     $round: [ { $toDouble: "$uploaddata.avgpoint" }, 2 ],
//                   },
//               id: "$uploaddata._id",
//             },
//           },
//           { $skip: skip },
//           { $limit: limit },
//         ]),
//         DayPointsUpload.aggregate([
//           { $match: queryfirst },
//           { $unwind: "$uploaddata" },
//           { $match: query },
//           { $count: "total" },
//         ]),
//       ]);

//       const totalCount = totalCountAgg[0]?.total || 0;
//       console.log(totalCount, "query");
//       return res.status(200).json({ result, totalCount });
//     } catch (err) {
//       console.log(err, "daypointsupload");
//       return next(new ErrorHandler("Records not found!", 404));
//     }
//   }
// );


// exports.getAllDayPointsUploadProductionListPointsFilter = catchAsyncErrors(
//   async (req, res, next) => {
//     let daypointsupload;
//     const {
//       company,
//       branch,
//       unit,
//       team,
//       username,
//       page,
//       pageSize,
//       fromdate,
//       todate,
//       allFilters,
//       logicOperator,
//       searchQuery,
//     } = req.body;

//     try {
//       let query = {};
//       let queryfirst = {};
//       if (fromdate && todate) {
//         queryfirst.date = { $gte: fromdate, $lte: todate };
//       }
//       if (company?.length) query["uploaddata.companyname"] = { $in: company };
//       if (branch?.length) query["uploaddata.branch"] = { $in: branch };
//       if (unit?.length) query["uploaddata.unit"] = { $in: unit };
//       if (team?.length) query["uploaddata.team"] = { $in: team };
//       if (username?.length) query["uploaddata.name"] = { $in: username };

//       //   daypointsupload = await DayPointsUpload.find();



    
   


//       //  console.log(query.$and[0].$or, "query")
//       const [result, totalCountAgg] = await Promise.all([
//         DayPointsUpload.aggregate([
//           { $match: queryfirst },
//           { $unwind: "$uploaddata" },
//           { $match: query },
//           {
//             $project: {
//               companyname: "$uploaddata.companyname",
//               branch: "$uploaddata.branch",
//               unit: "$uploaddata.unit",
//               empcode: "$uploaddata.empcode",
//               name: "$uploaddata.name",
//               team: "$uploaddata.team",
//               date: "$uploaddata.date",
//               exper: "$uploaddata.exper",

//               target: "$uploaddata.target",
//               weekoff: "$uploaddata.weekoff",
//               production: "$uploaddata.production",
//               manual: "$uploaddata.manual",
//               nonproduction: { $ifNull: ["$uploaddata.manual", 0] },
//               point:{
//                     $round: [ { $toDouble: "$uploaddata.point" }, 2 ],
//                   },
//               allowancepoint: {
//                 $cond: {
//                   if: { $eq: ["$uploaddata.shiftsts", "Enable"] },
//                then: {
//       $round: [
//         { $ifNull: [{ $toDouble: "$uploaddata.conshiftpoints" }, 0] },
//         2
//       ]
//     },
//                   else: { $ifNull: ["$uploaddata.allowancepoint", 0] },
//                 },
//               },

//               nonallowancepoint: {
//                 $cond: {
//                   if: { $eq: ["$uploaddata.shiftsts", "Enable"] },
//                   then: {
//                     $round: [
//                       {
//                         $subtract: [
//                           { $ifNull: [{ $toDouble: "$uploaddata.point" }, 0] },
//                           {
//                             $ifNull: [
//                               { $toDouble: "$uploaddata.conshiftpoints" },
//                               0,
//                             ],
//                           },
//                         ],
//                       },
//                       2, // <- two decimal places
//                     ],
//                   },
//                   else: { $ifNull: ["$uploaddata.noallowancepoint", 0] },
//                 },
//               },

//                  avgpoint:{
//                     $round: [ { $toDouble: "$uploaddata.avgpoint" }, 2 ],
//                   },
//               id: "$uploaddata._id",
//             },
//           },
         
//         ]),
//         DayPointsUpload.aggregate([
//           { $match: queryfirst },
//           { $unwind: "$uploaddata" },
//           { $match: query },
//           { $count: "total" },
//         ]),
//       ]);

//       const totalCount = totalCountAgg[0]?.total || 0;
//       console.log(totalCount, "query");
//       return res.status(200).json({ result, totalCount });
//     } catch (err) {
//       console.log(err, "daypointsupload");
//       return next(new ErrorHandler("Records not found!", 404));
//     }
//   }
// );

exports.getAllDayPointsUploadProductionListPointsFilter = catchAsyncErrors(async (req, res, next) => {
  const {
    company,
    branch,
    unit,
    team,
    username,
    page = 1,
    pageSize = 10,
    fromdate,
    todate,
    searchQuery,
  } = req.body;

  try {
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    // Build main filters
    let queryfirst = {};
    if (fromdate && todate) {
      queryfirst.date = { $gte: fromdate, $lte: todate };
    }

    let query = {};

    if (company?.length) query["uploaddata.companyname"] = { $in: company };
    if (branch?.length) query["uploaddata.branch"] = { $in: branch };
    if (unit?.length) query["uploaddata.unit"] = { $in: unit };
    if (team?.length) query["uploaddata.team"] = { $in: team };
    if (username?.length) query["uploaddata.name"] = { $in: username };

    // Apply search terms (globally)
    if (searchQuery) {
      const terms = searchQuery.trim().split(/\s+/).filter(Boolean);
      const regexTerms = terms.map(term => new RegExp(term, "i"));

      query["$and"] = regexTerms.map(regex => ({
        $or: [
          { "uploaddata.name": regex },
          { "uploaddata.date": regex },
          { "uploaddata.empcode": regex },
          { "uploaddata.companyname": regex },
          { "uploaddata.branch": regex },
          { "uploaddata.unit": regex },
          { "uploaddata.team": regex },
          { "uploaddata.exper": regex },
          { "uploaddata.target": regex },
          { "uploaddata.weekoff": regex },
          { "uploaddata.production": regex },
          { "uploaddata.manual": regex },
          { "uploaddata.nonproduction": regex },
          { "uploaddata.point": regex },
          { "uploaddata.allowancepoint": regex },
          { "uploaddata.nonallowancepoint": regex },
          { "uploaddata.avgpoint": regex },
        ],
      }));
    }

    const basePipeline = [
      { $match: queryfirst },
      { $unwind: "$uploaddata" },
      { $match: query },
      {
        $project: {
          companyname: "$uploaddata.companyname",
          branch: "$uploaddata.branch",
          unit: "$uploaddata.unit",
          empcode: "$uploaddata.empcode",
          name: "$uploaddata.name",
          team: "$uploaddata.team",
          date: "$uploaddata.date",
          exper: "$uploaddata.exper",
          target: "$uploaddata.target",
          weekoff: "$uploaddata.weekoff",
          production: "$uploaddata.production",
          manual: "$uploaddata.manual",
          nonproduction: { $ifNull: ["$uploaddata.manual", 0] },
          point: { $round: [{ $toDouble: "$uploaddata.point" }, 2] },
          allowancepoint: {
            $cond: {
              if: { $eq: ["$uploaddata.shiftsts", "Enable"] },
              then: {
                $round: [{ $ifNull: [{ $toDouble: "$uploaddata.conshiftpoints" }, 0] }, 2],
              },
              else: { $ifNull: ["$uploaddata.allowancepoint", 0] },
            },
          },
          nonallowancepoint: {
            $cond: {
              if: { $eq: ["$uploaddata.shiftsts", "Enable"] },
              then: {
                $round: [
                  {
                    $subtract: [
                      { $ifNull: [{ $toDouble: "$uploaddata.point" }, 0] },
                      { $ifNull: [{ $toDouble: "$uploaddata.conshiftpoints" }, 0] },
                    ],
                  },
                  2,
                ],
              },
              else: { $ifNull: ["$uploaddata.noallowancepoint", 0] },
            },
          },
          avgpoint: { $round: [{ $toDouble: "$uploaddata.avgpoint" }, 2] },
          id: "$uploaddata._id",
        },
      },
    ];

    // Clone the pipeline for pagination
    const paginatedPipeline = [...basePipeline, { $skip: skip }, { $limit: limit }];
    const countPipeline = [...basePipeline, { $count: "total" }];

    const [result, totalCountAgg] = await Promise.all([
      DayPointsUpload.aggregate(paginatedPipeline),
      DayPointsUpload.aggregate(countPipeline),
    ]);

    const totalCount = totalCountAgg[0]?.total || 0;

    return res.status(200).json({ result, totalCount });
  } catch (err) {
    console.error("Error in daypointsupload:", err);
    return next(new ErrorHandler("Records not found!", 404));
  }
});


exports.getAllDayPointsUploadProductionListPointsFilterTemp = catchAsyncErrors(
  async (req, res, next) => {
    let daypointsupload;
    const {
      company,
      branch,
      unit,
      team,
      username,
      page,
      pageSize,
      fromdate,
      todate,
      allFilters,
      logicOperator,
      searchQuery,
    } = req.body;

     try {
    const skip = (page - 1) * pageSize;
    const limit = pageSize;

    // Build main filters
    let queryfirst = {};
    if (fromdate && todate) {
      queryfirst.date = { $gte: fromdate, $lte: todate };
    }

    let query = {};

    if (company?.length) query["uploaddata.companyname"] = { $in: company };
    if (branch?.length) query["uploaddata.branch"] = { $in: branch };
    if (unit?.length) query["uploaddata.unit"] = { $in: unit };
    if (team?.length) query["uploaddata.team"] = { $in: team };
    if (username?.length) query["uploaddata.name"] = { $in: username };

    // Apply search terms (globally)
    if (searchQuery) {
      const terms = searchQuery.trim().split(/\s+/).filter(Boolean);
      const regexTerms = terms.map(term => new RegExp(term, "i"));

      query["$and"] = regexTerms.map(regex => ({
        $or: [
          { "uploaddata.name": regex },
          { "uploaddata.date": regex },
          { "uploaddata.empcode": regex },
          { "uploaddata.companyname": regex },
          { "uploaddata.branch": regex },
          { "uploaddata.unit": regex },
          { "uploaddata.team": regex },
          { "uploaddata.exper": regex },
          { "uploaddata.target": regex },
          { "uploaddata.weekoff": regex },
          { "uploaddata.production": regex },
          { "uploaddata.manual": regex },
          { "uploaddata.nonproduction": regex },
          { "uploaddata.point": regex },
          { "uploaddata.allowancepoint": regex },
          { "uploaddata.nonallowancepoint": regex },
          { "uploaddata.avgpoint": regex },
        ],
      }));
    }

    const basePipeline = [
      { $match: queryfirst },
      { $unwind: "$uploaddata" },
      { $match: query },
      {
        $project: {
          companyname: "$uploaddata.companyname",
          branch: "$uploaddata.branch",
          unit: "$uploaddata.unit",
          empcode: "$uploaddata.empcode",
          name: "$uploaddata.name",
          team: "$uploaddata.team",
          date: "$uploaddata.date",
          exper: "$uploaddata.exper",
          target: "$uploaddata.target",
          weekoff: "$uploaddata.weekoff",
          production: "$uploaddata.production",
          manual: "$uploaddata.manual",
          nonproduction: { $ifNull: ["$uploaddata.manual", 0] },
          point: { $round: [{ $toDouble: "$uploaddata.point" }, 2] },
          allowancepoint: {
            $cond: {
              if: { $eq: ["$uploaddata.shiftsts", "Enable"] },
              then: {
                $round: [{ $ifNull: [{ $toDouble: "$uploaddata.conshiftpoints" }, 0] }, 2],
              },
              else: { $ifNull: ["$uploaddata.allowancepoint", 0] },
            },
          },
          nonallowancepoint: {
            $cond: {
              if: { $eq: ["$uploaddata.shiftsts", "Enable"] },
              then: {
                $round: [
                  {
                    $subtract: [
                      { $ifNull: [{ $toDouble: "$uploaddata.point" }, 0] },
                      { $ifNull: [{ $toDouble: "$uploaddata.conshiftpoints" }, 0] },
                    ],
                  },
                  2,
                ],
              },
              else: { $ifNull: ["$uploaddata.noallowancepoint", 0] },
            },
          },
          avgpoint: { $round: [{ $toDouble: "$uploaddata.avgpoint" }, 2] },
          id: "$uploaddata._id",
        },
      },
    ];

    // Clone the pipeline for pagination
    const paginatedPipeline = [...basePipeline, { $skip: skip }, { $limit: limit }];
    const countPipeline = [...basePipeline, { $count: "total" }];

    const [result, totalCountAgg] = await Promise.all([
      DayPointsUploadTemp.aggregate(paginatedPipeline),
      DayPointsUploadTemp.aggregate(countPipeline),
    ]);

    const totalCount = totalCountAgg[0]?.total || 0;

    return res.status(200).json({ result, totalCount });
  } catch (err) {
      console.log(err, "daypointsupload");
      return next(new ErrorHandler("Records not found!", 404));
    }
  }
);

exports.DayPointsUploadEXCELDownload = catchAsyncErrors(
  async (req, res, next) => {
    const { company, branch, unit, team, username, fromdate, todate } =
      req.body;

    try {
      let query = {};
      let queryfirst = {};
      if (fromdate && todate) {
        queryfirst.date = { $gte: fromdate, $lte: todate };
      }
      if (company?.length) query["uploaddata.companyname"] = { $in: company };
      if (branch?.length) query["uploaddata.branch"] = { $in: branch };
      if (unit?.length) query["uploaddata.unit"] = { $in: unit };
      if (team?.length) query["uploaddata.team"] = { $in: team };
      if (username?.length) query["uploaddata.name"] = { $in: username };

      // console.log(query,"queryexcel")
      const cursor = DayPointsUpload.aggregate([
        { $match: queryfirst },
        { $unwind: "$uploaddata" },
        { $match: query },
        {
          $project: {
            _id: 0,
            companyname: "$uploaddata.companyname",
            branch: "$uploaddata.branch",
            unit: "$uploaddata.unit",
            empcode: "$uploaddata.empcode",
            name: "$uploaddata.name",
            team: "$uploaddata.team",
            date: "$uploaddata.date",
            exper: "$uploaddata.exper",

            target: "$uploaddata.target",
            weekoff: "$uploaddata.weekoff",
            production: "$uploaddata.production",
            manual: "$uploaddata.manual",
            nonproduction: "$uploaddata.nonproduction",
            point: "$uploaddata.point",
            allowancepoint: "$uploaddata.allowancepoint",
            nonallowancepoint: "$uploaddata.nonallowancepoint",
            avgpoint: "$uploaddata.avgpoint",
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
      const headers = [
        "EmployeeCode",
        "EmployeeName",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Date",
        "Exper",
        "Target",
        "Weekoff",
        "Production",
        "Manual",
        "NonProduction",
        "Point",
        "AllowancePoint",
        "NonAllowancePoint",
        "AvgPoint",
      ];
      sheet.addRow(headers).commit();

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Production_Month_Report.xlsx"
      );

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
            doc["empcode"],
            doc["name"],
            doc["companyname"],
            doc["branch"],
            doc["unit"],
            doc["team"],
            doc["date"],
            doc["exper"],
            doc["target"],
            doc["weekoff"],
            doc["production"],
            doc["manual"],
            doc["nonproduction"],
            doc["point"],
            doc["allowancepoint"],
            doc["nonallowancepoint"],
            doc["avgpoint"],
          ])
          .commit();

        rowCount++;
      }

      await workbook.commit(); // Finalize the workbook
    } catch (error) {
      console.error("Error generating Excel:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

exports.DayPointsUploadCSVDownload = catchAsyncErrors(
  async (req, res, next) => {
    const {
      company,
      branch,
      unit,
      team,
      username,
      page,
      pageSize,
      fromdate,
      todate,
      allFilters,
      logicOperator,
      searchQuery,
    } = req.body;

    try {
      let query = {};
      let queryfirst = {};
      if (fromdate && todate) {
        queryfirst.date = { $gte: fromdate, $lte: todate };
      }
      if (company?.length) query["uploaddata.companyname"] = { $in: company };
      if (branch?.length) query["uploaddata.branch"] = { $in: branch };
      if (unit?.length) query["uploaddata.unit"] = { $in: unit };
      if (team?.length) query["uploaddata.team"] = { $in: team };
      if (username?.length) query["uploaddata.name"] = { $in: username };

      const cursor = DayPointsUpload.aggregate([
        { $match: query },
        { $unwind: "$uploaddata" },
        { $match: query },
        {
          $project: {
            _id: 0,
            companyname: "$uploaddata.companyname",
            branch: "$uploaddata.branch",
            unit: "$uploaddata.unit",
            empcode: "$uploaddata.empcode",
            name: "$uploaddata.name",
            team: "$uploaddata.team",
            date: "$uploaddata.date",
            exper: "$uploaddata.exper",

            target: "$uploaddata.target",
            weekoff: "$uploaddata.weekoff",
            production: "$uploaddata.production",
            manual: "$uploaddata.manual",
            nonproduction: "$uploaddata.nonproduction",
            point: "$uploaddata.point",
            allowancepoint: "$uploaddata.allowancepoint",
            nonallowancepoint: "$uploaddata.nonallowancepoint",
            avgpoint: "$uploaddata.avgpoint",
          },
        },
      ]).cursor({ batchSize: 1000 });

      // Set headers for CSV download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Production_Month_Report.csv"
      );

      const csvStream = fastCsv.format({ headers: true });

      csvStream.pipe(res); // Stream the CSV data directly to response

      for await (const doc of cursor) {
        csvStream.write({
          EmployeeCode: doc["empcode"],
          EmployeeName: doc["name"],
          Company: doc["companyname"],
          Branch: doc["branch"],
          Unit: doc["unit"],
          Team: doc["team"],
          Date: doc["date"],
          Exper: doc["exper"],
          Target: doc["target"],
          Weekoff: doc["weekoff"],
          Production: doc["production"],
          Manual: doc["manual"], // <-- make sure this is not wrongly set to unit
          NonProduction: doc["nonproduction"],
          Point: doc["point"],
          AllowancePoint: doc["allowancepoint"],
          NonAllowancePoint: doc["nonallowancepoint"],
          AvgPoint: doc["avgpoint"],
        });
      }

      csvStream.end(); // Finalize the stream
    } catch (error) {
      console.error("Error generating CSV:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

exports.DayPointsUploadPDFDownload = catchAsyncErrors(
  async (req, res, next) => {
    const {
      company,
      branch,
      unit,
      team,
      username,
      page,
      pageSize,
      fromdate,
      todate,
      allFilters,
      logicOperator,
      searchQuery,
    } = req.body;

    try {
      let query = {};

      const cursor = DayPointsUpload.aggregate([
        { $match: query },
        { $unwind: "$uploaddata" },
        { $match: query },
        {
          $project: {
            _id: 0,
            companyname: "$uploaddata.companyname",
            branch: "$uploaddata.branch",
            unit: "$uploaddata.unit",
            empcode: "$uploaddata.empcode",
            name: "$uploaddata.name",
            team: "$uploaddata.team",
            date: "$uploaddata.date",
            exper: "$uploaddata.exper",
            target: "$uploaddata.target",
            weekoff: "$uploaddata.weekoff",
            production: "$uploaddata.production",
            manual: "$uploaddata.manual",
            nonproduction: "$uploaddata.nonproduction",
            point: "$uploaddata.point",
            allowancepoint: "$uploaddata.allowancepoint",
            nonallowancepoint: "$uploaddata.nonallowancepoint",
            avgpoint: "$uploaddata.avgpoint",
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
      const headers = [
        "EmployeeCode",
        "EmployeeName",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Date",
        "Exper",
        "Target",
        "Weekoff",
        "Production",
        "Manual",
        "NonProduction",
        "Point",
        "AllowancePoint",
        "NonAllowancePoint",
        "AvgPoint",
      ];
      content.push({
        text: "Production Report",
        font: "Helvetica",
        alignment: "center",
      });
      content.push({
        text: `Generated on: ${new Date().toLocaleString()}`,
        font: "Helvetica",
        alignment: "right",
      });
      content.push("\n");

      let tableData = [headers];
      for await (const doc of cursor) {
        tableData.push([
          doc["empcode"] ?? "-",
          doc["name"] ?? "-",
          doc["companyname"] ?? "-",
          doc["branch"] ?? "-",
          doc["unit"] ?? "-",
          doc["team"] ?? "-",
          doc["date"] ?? "-",
          doc["exper"] ?? "-",
          doc["target"] ?? "-",
          doc["weekoff"] ?? "-",
          doc["production"] ?? "-",
          doc["manual"] ?? "-",
          doc["nonproduction"] ?? "-",
          doc["point"] ?? "-",
          doc["allowancepoint"] ?? "-",
          doc["nonallowancepoint"] ?? "-",
          doc["avgpoint"] ?? "-",
        ]);
      }

      // ✅ Add table to PDF content
      content.push({
        table: { body: tableData },
        layout: "lightHorizontalLines",
      });

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
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Production_Report.pdf"
      );

      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(res); // ✅ Stream PDF directly to client
      pdfDoc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

//temp
exports.DayPointsUploadTempEXCELDownload = catchAsyncErrors(
  async (req, res, next) => {
    const { company, branch, unit, team, username, fromdate, todate } =
      req.body;

    try {
      let query = {};
      let queryfirst = {};
      if (fromdate && todate) {
        queryfirst.date = { $gte: fromdate, $lte: todate };
      }
      if (company?.length) query["uploaddata.companyname"] = { $in: company };
      if (branch?.length) query["uploaddata.branch"] = { $in: branch };
      if (unit?.length) query["uploaddata.unit"] = { $in: unit };
      if (team?.length) query["uploaddata.team"] = { $in: team };
      if (username?.length) query["uploaddata.name"] = { $in: username };

      // console.log(query,"queryexcel")
      const cursor = DayPointsUploadTemp.aggregate([
        { $match: queryfirst },
        { $unwind: "$uploaddata" },
        { $match: query },
        {
          $project: {
            _id: 0,
            companyname: "$uploaddata.companyname",
            branch: "$uploaddata.branch",
            unit: "$uploaddata.unit",
            empcode: "$uploaddata.empcode",
            name: "$uploaddata.name",
            team: "$uploaddata.team",
            date: "$uploaddata.date",
            exper: "$uploaddata.exper",

            target: "$uploaddata.target",
            weekoff: "$uploaddata.weekoff",
            production: "$uploaddata.production",
            manual: "$uploaddata.manual",
            nonproduction: "$uploaddata.nonproduction",
            point: "$uploaddata.point",
            allowancepoint: "$uploaddata.allowancepoint",
            nonallowancepoint: "$uploaddata.nonallowancepoint",
            avgpoint: "$uploaddata.avgpoint",
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
      const headers = [
        "EmployeeCode",
        "EmployeeName",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Date",
        "Exper",
        "Target",
        "Weekoff",
        "Production",
        "Manual",
        "NonProduction",
        "Point",
        "AllowancePoint",
        "NonAllowancePoint",
        "AvgPoint",
      ];
      sheet.addRow(headers).commit();

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Production_Month_Report.xlsx"
      );

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
            doc["empcode"],
            doc["name"],
            doc["companyname"],
            doc["branch"],
            doc["unit"],
            doc["team"],
            doc["date"],
            doc["exper"],
            doc["target"],
            doc["weekoff"],
            doc["production"],
            doc["manual"],
            doc["nonproduction"],
            doc["point"],
            doc["allowancepoint"],
            doc["nonallowancepoint"],
            doc["avgpoint"],
          ])
          .commit();

        rowCount++;
      }

      await workbook.commit(); // Finalize the workbook
    } catch (error) {
      console.error("Error generating Excel:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

exports.DayPointsUploadTempCSVDownload = catchAsyncErrors(
  async (req, res, next) => {
    const {
      company,
      branch,
      unit,
      team,
      username,
      page,
      pageSize,
      fromdate,
      todate,
      allFilters,
      logicOperator,
      searchQuery,
    } = req.body;

    try {
      let query = {};
      let queryfirst = {};
      if (fromdate && todate) {
        queryfirst.date = { $gte: fromdate, $lte: todate };
      }
      if (company?.length) query["uploaddata.companyname"] = { $in: company };
      if (branch?.length) query["uploaddata.branch"] = { $in: branch };
      if (unit?.length) query["uploaddata.unit"] = { $in: unit };
      if (team?.length) query["uploaddata.team"] = { $in: team };
      if (username?.length) query["uploaddata.name"] = { $in: username };

      const cursor = DayPointsUploadTemp.aggregate([
        { $match: query },
        { $unwind: "$uploaddata" },
        { $match: query },
        {
          $project: {
            _id: 0,
            companyname: "$uploaddata.companyname",
            branch: "$uploaddata.branch",
            unit: "$uploaddata.unit",
            empcode: "$uploaddata.empcode",
            name: "$uploaddata.name",
            team: "$uploaddata.team",
            date: "$uploaddata.date",
            exper: "$uploaddata.exper",

            target: "$uploaddata.target",
            weekoff: "$uploaddata.weekoff",
            production: "$uploaddata.production",
            manual: "$uploaddata.manual",
            nonproduction: "$uploaddata.nonproduction",
            point: "$uploaddata.point",
            allowancepoint: "$uploaddata.allowancepoint",
            nonallowancepoint: "$uploaddata.nonallowancepoint",
            avgpoint: "$uploaddata.avgpoint",
          },
        },
      ]).cursor({ batchSize: 1000 });

      // Set headers for CSV download
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Production_Month_Report.csv"
      );

      const csvStream = fastCsv.format({ headers: true });

      csvStream.pipe(res); // Stream the CSV data directly to response

      for await (const doc of cursor) {
        csvStream.write({
          EmployeeCode: doc["empcode"],
          EmployeeName: doc["name"],
          Company: doc["companyname"],
          Branch: doc["branch"],
          Unit: doc["unit"],
          Team: doc["team"],
          Date: doc["date"],
          Exper: doc["exper"],
          Target: doc["target"],
          Weekoff: doc["weekoff"],
          Production: doc["production"],
          Manual: doc["manual"], // <-- make sure this is not wrongly set to unit
          NonProduction: doc["nonproduction"],
          Point: doc["point"],
          AllowancePoint: doc["allowancepoint"],
          NonAllowancePoint: doc["nonallowancepoint"],
          AvgPoint: doc["avgpoint"],
        });
      }

      csvStream.end(); // Finalize the stream
    } catch (error) {
      console.error("Error generating CSV:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

exports.DayPointsUploadTempPDFDownload = catchAsyncErrors(
  async (req, res, next) => {
    const {
      company,
      branch,
      unit,
      team,
      username,
      page,
      pageSize,
      fromdate,
      todate,
      allFilters,
      logicOperator,
      searchQuery,
    } = req.body;

    try {
      let query = {};

      const cursor = DayPointsUploadTemp.aggregate([
        { $match: query },
        { $unwind: "$uploaddata" },
        { $match: query },
        {
          $project: {
            _id: 0,
            companyname: "$uploaddata.companyname",
            branch: "$uploaddata.branch",
            unit: "$uploaddata.unit",
            empcode: "$uploaddata.empcode",
            name: "$uploaddata.name",
            team: "$uploaddata.team",
            date: "$uploaddata.date",
            exper: "$uploaddata.exper",
            target: "$uploaddata.target",
            weekoff: "$uploaddata.weekoff",
            production: "$uploaddata.production",
            manual: "$uploaddata.manual",
            nonproduction: "$uploaddata.nonproduction",
            point: "$uploaddata.point",
            allowancepoint: "$uploaddata.allowancepoint",
            nonallowancepoint: "$uploaddata.nonallowancepoint",
            avgpoint: "$uploaddata.avgpoint",
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
      const headers = [
        "EmployeeCode",
        "EmployeeName",
        "Company",
        "Branch",
        "Unit",
        "Team",
        "Date",
        "Exper",
        "Target",
        "Weekoff",
        "Production",
        "Manual",
        "NonProduction",
        "Point",
        "AllowancePoint",
        "NonAllowancePoint",
        "AvgPoint",
      ];
      content.push({
        text: "Production Report",
        font: "Helvetica",
        alignment: "center",
      });
      content.push({
        text: `Generated on: ${new Date().toLocaleString()}`,
        font: "Helvetica",
        alignment: "right",
      });
      content.push("\n");

      let tableData = [headers];
      for await (const doc of cursor) {
        tableData.push([
          doc["empcode"] ?? "-",
          doc["name"] ?? "-",
          doc["companyname"] ?? "-",
          doc["branch"] ?? "-",
          doc["unit"] ?? "-",
          doc["team"] ?? "-",
          doc["date"] ?? "-",
          doc["exper"] ?? "-",
          doc["target"] ?? "-",
          doc["weekoff"] ?? "-",
          doc["production"] ?? "-",
          doc["manual"] ?? "-",
          doc["nonproduction"] ?? "-",
          doc["point"] ?? "-",
          doc["allowancepoint"] ?? "-",
          doc["nonallowancepoint"] ?? "-",
          doc["avgpoint"] ?? "-",
        ]);
      }

      // ✅ Add table to PDF content
      content.push({
        table: { body: tableData },
        layout: "lightHorizontalLines",
      });

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
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Production_Report.pdf"
      );

      const pdfDoc = printer.createPdfKitDocument(docDefinition);
      pdfDoc.pipe(res); // ✅ Stream PDF directly to client
      pdfDoc.end();
    } catch (error) {
      console.error("Error generating PDF:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);
