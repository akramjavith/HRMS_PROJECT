const TempPointsUpload = require("../../../model/modules/production/daypointsuploadtemp");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const MinimumPoints = require("../../../model/modules/production/minimumpoints");
const Department = require("../../../model/modules/department");
const User = require("../../../model/login/auth");
const SalarySlabs = require("../../../model/modules/setup/SalarySlabModel");
const ShortageMaster = require("../../../model/modules/production/Shortagemaster");
const RevenueAmount = require("../../../model/modules/production/RevenueAmountModel");
const AcPointVal = require("../../../model/modules/production/acpointscalculation");
// get All ClientUserID Name => /api/clientuserids
exports.getAllTempPointsUpload = catchAsyncErrors(async (req, res, next) => {
  let temppointsupload;
  try {
    temppointsupload = await TempPointsUpload.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!temppointsupload) {
    return next(new ErrorHandler("Temp Points Upload not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    temppointsupload,
  });
});

// get All ClientUserID Name => /api/clientuserids
exports.tempPointsfilter = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload, minipoints, productionupload;
  try {
    const { fromdate, todate, less, greater, compare, betweenfrom, betweento, company, unit, team, branch, empnames } = req.body;
    // minpoints = await MinimumPoints.find({}, { name: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, month: 1, year: 1, daypoint: 1, department: 1 });
    let departments = await Department.find({}, { deptname: 1, prod: 1 });
    let users = await User.find({
      resonablestatus: {
        $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
      }
    }, { department: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, companyname: 1, assignExpLog: 1, processlog: 1, doj: 1 });
    let salSlabs = await SalarySlabs.find({}, { company: 1, branch: 1, salarycode: 1, basic: 1, hra: 1, salaryslablimited: 1, medicalallowance: 1, conveyance: 1, productionallowance: 1, otherallowance: 1 });
    let manageshortagemasters = await ShortageMaster.find({}, { department: 1, from: 1, to: 1, amount: 1 });
    let revenueAmount = await RevenueAmount.find({}, { branch: 1, company: 1, processcode: 1, amount: 1 });
    let acPointCal = await AcPointVal.find({}, { branch: 1, company: 1, department: 1, dividevalue: 1, multiplevalue: 1 });

    const conditions = [];

    if (fromdate && todate) {
      conditions.push({ $and: [{ $gte: ["$$upload.date", fromdate] }, { $lte: ["$$upload.date", todate] }] });
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

    daypointsupload = await TempPointsUpload.aggregate([
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
      const splitDate = obj1?.date?.split("-");
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
          const monthYear = d?.updatedate?.split("-")?.slice(0, 2)?.join("-");
          if (!groupedByMonth[monthYear]) {
            groupedByMonth[monthYear] = [];
          }
          groupedByMonth[monthYear].push(d);
        });

      // Extract the last item of each group
      const lastItemsForEachMonth = Object.values(groupedByMonth).map((group) => group[group.length - 1]);

      // Filter the data array based on the month and year
      lastItemsForEachMonth.sort((a, b) => {
        return new Date(a.updatedate) - new Date(b.updatedate);
      });

      // Find the first item in the sorted array that meets the criteria
      let filteredDataMonth = null;
      for (let i = 0; i < lastItemsForEachMonth.length; i++) {
        const date = lastItemsForEachMonth[i].updatedate;
        // const splitedDate = date.split("-");
        // const itemYear = splitedDate[0];
        // const itemMonth = splitedDate[1]; // Adding 1 because getMonth() returns 0-indexed month
        // if (Number(itemYear) === selectedYear && Number(itemMonth) === Number(selectedMonthNum)) {
        //   filteredDataMonth = lastItemsForEachMonth[i];
        //   break;
        // } else if (Number(itemYear) < selectedYear || (Number(itemYear) === selectedYear && Number(itemMonth) < Number(selectedMonthNum))) {
        //   filteredDataMonth = lastItemsForEachMonth[i]; // Keep updating the filteredDataMonth until the criteria is met
        // } else {
        //   break; // Break the loop if we encounter an item with year and month greater than selected year and month
        // }
        if (item.date >= date) {
          filteredDataMonth = lastItemsForEachMonth[i];
        }
        //  else if (date <= item.date) {
        //   filteredDataMonth = lastItemsForEachMonth[i];
        // }
        else {
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
          differenceInMonthsexp = Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthsexp += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthsexp -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthsexp = parseInt(modevalue.expval);
          }
        } else {
          differenceInMonthsexp = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthsexp += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthsexp -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthsexp = parseInt(modevalue.expval);
          } else {
            // differenceInMonths = parseInt(modevalue.expval);
            differenceInMonthsexp = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          }
        }

        //findtar end difference yes/no
        if (modevalue.endtar === "Yes") {
          differenceInMonthstar = Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthstar += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthstar -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthstar = parseInt(modevalue.expval);
          }
        } else {
          differenceInMonthstar = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthstar += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthstar -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthstar = parseInt(modevalue.expval);
          } else {
            // differenceInMonths = parseInt(modevalue.expval);
            differenceInMonthstar = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          }
        }

        differenceInMonths = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
        if (modevalue.expmode === "Add") {
          differenceInMonths += parseInt(modevalue.expval);
        } else if (modevalue.expmode === "Minus") {
          differenceInMonths -= parseInt(modevalue.expval);
        } else if (modevalue.expmode === "Fix") {
          differenceInMonths = parseInt(modevalue.expval);
        } else {
          // differenceInMonths = parseInt(modevalue.expval);
          differenceInMonths = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
        }
      } else {
        differenceInMonthsexp = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
        differenceInMonthstar = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
        differenceInMonths = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
      }

      const groupedByMonthProcs = {};

      // Group items by month
      item.processlog &&
        item.processlog.forEach((d) => {
          const monthYear = d?.date?.split("-")?.slice(0, 2)?.join("-");
          if (!groupedByMonthProcs[monthYear]) {
            groupedByMonthProcs[monthYear] = [];
          }
          groupedByMonthProcs[monthYear].push(d);
        });

      // Extract the last item of each group
      const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

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
      let processcodeexpvalue = item.doj && modevalue && modevalue.expmode == "Manual" ? modevalue.salarycode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "";
      //findsalary from salaryslab
      let findSalDetails = salSlabs.find((d) => d.company === item.companyname && d.branch === item.branch && d.salarycode === processcodeexpvalue);
      //shortageamount from shortage master
      let findShortage = manageshortagemasters.find((d) => d.department === item.department && differenceInMonths >= Number(d.from) && differenceInMonths <= Number(d.to));
      //revenue amount from revenue  master
      let findRevenueAllow = revenueAmount.find((d) => d.company === item.companyname && d.branch === item.branch && d.processcode === processcodeexpvalue);

      let findAcPointVal = acPointCal.find((d) => d.company === item.companyname && d.branch === item.branch && d.department === item.department);

      // GROSS VALUE
      let grossValue = modevalue && modevalue.expmode == "Manual" ? modevalue.gross : findSalDetails ? Number(findSalDetails.basic) + Number(findSalDetails.hra) + Number(findSalDetails.conveyance) + Number(findSalDetails.medicalallowance) + Number(findSalDetails.productionallowance) + Number(findSalDetails.otherallowance) : "";

      let egvalue = Number(grossValue) + (findShortage ? Number(findShortage.amount) : 0);

      let hfvalue = egvalue - (findRevenueAllow ? Number(findRevenueAllow.amount) : 0);
      // let i60value = Number(hfvalue) / 60;
      // let j85value = (i60value * 8.5) / 27;
      let i60value = Number(hfvalue) / (findAcPointVal && Number(findAcPointVal.multiplevalue));
      let j85value = (i60value * (findAcPointVal && Number(findAcPointVal.dividevalue)) / 27);

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

        existingItem.avgpoint = (existingItem.point / existingItem.target) * 100;

        // Convert the dates array to Date objects
        const dateObjects = existingItem.date.map((date) => new Date(date));

        // Find the earliest (from) and latest (to) dates
        const fromDate = new Date(Math.min(...dateObjects));
        const toDate = new Date(Math.max(...dateObjects));

        // Format the dates as strings in "YYYY-MM-DD" format
        const formattedFromDate = fromDate?.toISOString()?.split("T")[0];
        const formattedToDate = toDate?.toISOString()?.split("T")[0];

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
      productionupload = belowMin.filter((item) => Number(item.daypoint) > Number(item.point) && item.prod === true);
    } else if (compare == "Below Target Points") {
      productionupload = belowMin.filter((item) => Number(item.target) > Number(item.point) && item.prod === true);
    } else if (compare == "Less than") {
      productionupload = belowMin.filter((item) => Number(item.avgpoint) < Number(less) && item.prod === true);
    } else if (compare == "Greater than") {
      productionupload = belowMin.filter((item) => Number(item.avgpoint) > Number(greater) && item.prod === true);
    } else if (compare == "Between") {
      productionupload = belowMin.filter((item) => Number(item.avgpoint) >= Number(betweenfrom) && Number(item.avgpoint) <= Number(betweento) && item.prod === true);
    } else {
      productionupload = belowMin.filter((item) => item.prod === true);
    }
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
exports.tempPointsDatasFetch = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload, minpoints, productionupload;
  try {
    const { fromdate, todate } = req.body;
    minpoints = await MinimumPoints.find({}, { name: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, month: 1, year: 1, daypoint: 1, department: 1 });
    departments = await Department.find({}, { deptname: 1, prod: 1 });
    users = await User.find({
      resonablestatus: {
        $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
      }
    }, { department: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, companyname: 1 });

    const conditions = [];

    if (fromdate && todate) {
      conditions.push({ $and: [{ $gte: ["$$upload.date", fromdate] }, { $lte: ["$$upload.date", todate] }] });
    }

    const cond = {
      $and: conditions,
    };

    daypointsupload = await TempPointsUpload.aggregate([
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
      const splitDate = obj1?.date?.split("-");
      const oldyear = splitDate[0];
      const oldmonth = splitDate[1];

      const matchingMinpoint = minpoints.find((obj2) => {
        return obj1.name === obj2.name && obj1.branch === obj2.branch && obj1.companyname === obj2.company && obj1.empcode === obj2.empcode && obj1.unit === obj2.unit && Number(oldmonth) === Number(obj2.month) && Number(oldyear) === Number(obj2.year) && obj1.team === obj2.team;
      });

      if (matchingMinpoint) {
        obj1.daypoint = matchingMinpoint.daypoint;
      }

      const matchingMinpointuser = users.find((obj2) => {
        return obj1.name === obj2.companyname && obj1.branch === obj2.branch && obj1.companyname === obj2.company && obj1.unit === obj2.unit && obj1.team === obj2.team;
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
      const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.company === current.company && item.branch === current.branch && item.unit === current.unit && item.team === current.team && item.empcode === current.empcode);

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
        const formattedFromDate = fromDate?.toISOString()?.split("T")[0];
        const formattedToDate = toDate?.toISOString()?.split("T")[0];

        // Update start and end date
        existingItem.startDate = fromDate;
        existingItem.endDate = toDate;
        existingItem.avgpoint = (existingItem.point / existingItem.target) * 100;
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


// Create new TempPointsUpload=> /api/clientuserid/new
exports.addTempPointsUpload = catchAsyncErrors(async (req, res, next) => {
  let atemppointsupload = await TempPointsUpload.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle TempPointsUpload => /api/clientuserid/:id
exports.getSingleTempPointsUpload = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let stemppointsupload = await TempPointsUpload.findById(id);

  if (!stemppointsupload) {
    return next(new ErrorHandler("Temp Points Upload not found!", 404));
  }
  return res.status(200).json({
    stemppointsupload,
  });
});

// update TempPointsUpload by id => /api/clientuserid/:id
exports.updateTempPointsUpload = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let utemppointsupload = await TempPointsUpload.findByIdAndUpdate(
    id,
    req.body
  );
  if (!utemppointsupload) {
    return next(new ErrorHandler("Temp Points Upload not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

exports.updateTempPointsSingleUpload = catchAsyncErrors(
  async (req, res, next) => {
    const subid = req.params.id;
    req.body.id = subid;
    try {
      const uploaddata = await TempPointsUpload.findOneAndUpdate(
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

// delete TempPointsUpload by id => /api/clientuserid/:id
exports.deleteTempPointsUpload = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dtemppointsupload = await TempPointsUpload.findByIdAndRemove(id);

  if (!dtemppointsupload) {
    return next(new ErrorHandler("Temp Points Upload not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});



// get All ClientUserID Name => /api/clientuserids
exports.tempPointsfilterHome1 = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload, minipoints, productionupload;
  try {
    const { fromdate, todate, compare } = req.body;
    // console.log(fromdate, todate, "Temp")
    // minpoints = await MinimumPoints.find({}, { name: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, month: 1, year: 1, daypoint: 1, department: 1 });
    let departments = await Department.find({}, { deptname: 1, prod: 1 });
    let users = await User.find({
      resonablestatus: {
        $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
      }
    }, { department: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, companyname: 1, assignExpLog: 1, processlog: 1, doj: 1 });
    let salSlabs = await SalarySlabs.find({}, { company: 1, branch: 1, salarycode: 1, basic: 1, hra: 1, salaryslablimited: 1, medicalallowance: 1, conveyance: 1, productionallowance: 1, otherallowance: 1 });
    let manageshortagemasters = await ShortageMaster.find({}, { department: 1, from: 1, to: 1, amount: 1 });
    let revenueAmount = await RevenueAmount.find({}, { branch: 1, company: 1, processcode: 1, amount: 1 });
    let acPointCal = await AcPointVal.find({}, { branch: 1, company: 1, department: 1, dividevalue: 1, multiplevalue: 1 });

    const conditions = [];

    if (fromdate && todate) {
      conditions.push({ $and: [{ $gte: ["$$upload.date", fromdate] }, { $lte: ["$$upload.date", todate] }] });
    }



    const cond = {
      $and: conditions,
    };

    daypointsupload = await TempPointsUpload.aggregate([
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
      data.uploaddata.filter((item, index) => index <= 5).map((upload) => ({
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

    const filteredArray = answer.filter((item, index) => index <= 5).map((obj1) => {
      const splitDate = obj1?.date?.split("-");
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
    const itemsWithSerialNumber = filteredArray?.map((item, index) => {
      const groupedByMonth = {};
      // Group items by month
      item.assignExpLog &&
        item.assignExpLog.forEach((d) => {
          const monthYear = d?.updatedate?.split("-")?.slice(0, 2)?.join("-");
          if (!groupedByMonth[monthYear]) {
            groupedByMonth[monthYear] = [];
          }
          groupedByMonth[monthYear].push(d);
        });

      // Extract the last item of each group
      const lastItemsForEachMonth = Object.values(groupedByMonth).map((group) => group[group.length - 1]);

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
        }
        //  else if (date <= item.date) {
        //   filteredDataMonth = lastItemsForEachMonth[i];
        // }
        else {
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
          differenceInMonthsexp = Math.floor((new Date(modevalue.endexpdate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthsexp += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthsexp -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthsexp = parseInt(modevalue.expval);
          }
        } else {
          differenceInMonthsexp = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthsexp += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthsexp -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthsexp = parseInt(modevalue.expval);
          } else {
            // differenceInMonths = parseInt(modevalue.expval);
            differenceInMonthsexp = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          }
        }

        //findtar end difference yes/no
        if (modevalue.endtar === "Yes") {
          differenceInMonthstar = Math.floor((new Date(modevalue.endtardate) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthstar += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthstar -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthstar = parseInt(modevalue.expval);
          }
        } else {
          differenceInMonthstar = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          if (modevalue.expmode === "Add") {
            differenceInMonthstar += parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Minus") {
            differenceInMonthstar -= parseInt(modevalue.expval);
          } else if (modevalue.expmode === "Fix") {
            differenceInMonthstar = parseInt(modevalue.expval);
          } else {
            // differenceInMonths = parseInt(modevalue.expval);
            differenceInMonthstar = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
          }
        }

        differenceInMonths = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
        if (modevalue.expmode === "Add") {
          differenceInMonths += parseInt(modevalue.expval);
        } else if (modevalue.expmode === "Minus") {
          differenceInMonths -= parseInt(modevalue.expval);
        } else if (modevalue.expmode === "Fix") {
          differenceInMonths = parseInt(modevalue.expval);
        } else {
          // differenceInMonths = parseInt(modevalue.expval);
          differenceInMonths = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
        }
      } else {
        differenceInMonthsexp = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
        differenceInMonthstar = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
        differenceInMonths = Math.floor((new Date(item.date) - new Date(item.doj)) / (30 * 24 * 60 * 60 * 1000));
      }

      const groupedByMonthProcs = {};

      // Group items by month
      item.processlog &&
        item.processlog.forEach((d) => {
          const monthYear = d?.date?.split("-")?.slice(0, 2)?.join("-");
          if (!groupedByMonthProcs[monthYear]) {
            groupedByMonthProcs[monthYear] = [];
          }
          groupedByMonthProcs[monthYear].push(d);
        });

      // Extract the last item of each group
      const lastItemsForEachMonthPros = Object.values(groupedByMonthProcs).map((group) => group[group.length - 1]);

      // Filter the data array based on the month and year
      lastItemsForEachMonthPros.sort((a, b) => {
        return new Date(a.date) - new Date(b.date);
      });
      // Find the first item in the sorted array that meets the criteria
      let filteredItem = null;

      for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
        const date = lastItemsForEachMonthPros[i].date;

        if (item.date >= date) {
          filteredItem = lastItemsForEachMonthPros[i];
        }

        else {
          break;
        }
      }

      let getprocessCode = filteredItem ? filteredItem.process : "";

      // let procCodecheck = item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : 0) : "";
      let processcodeexpvalue = item.doj && modevalue && modevalue.expmode == "Manual" ? modevalue.salarycode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : item.doj ? getprocessCode + (differenceInMonthsexp > 0 ? (differenceInMonthsexp <= 9 ? `0${differenceInMonthsexp}` : differenceInMonthsexp) : "00") : "";
      //findsalary from salaryslab
      let findSalDetails = salSlabs.find((d) => d.company === item.companyname && d.branch === item.branch && d.salarycode === processcodeexpvalue);
      //shortageamount from shortage master
      let findShortage = manageshortagemasters.find((d) => d.department === item.department && differenceInMonths >= Number(d.from) && differenceInMonths <= Number(d.to));
      //revenue amount from revenue  master
      let findRevenueAllow = revenueAmount.find((d) => d.company === item.companyname && d.branch === item.branch && d.processcode === processcodeexpvalue);

      let findAcPointVal = acPointCal.find((d) => d.company === item.companyname && d.branch === item.branch && d.department === item.department);

      // GROSS VALUE
      let grossValue = modevalue && modevalue.expmode == "Manual" ? modevalue.gross : findSalDetails ? Number(findSalDetails.basic) + Number(findSalDetails.hra) + Number(findSalDetails.conveyance) + Number(findSalDetails.medicalallowance) + Number(findSalDetails.productionallowance) + Number(findSalDetails.otherallowance) : "";

      let egvalue = Number(grossValue) + (findShortage ? Number(findShortage.amount) : 0);

      let hfvalue = egvalue - (findRevenueAllow ? Number(findRevenueAllow.amount) : 0);
      // let i60value = Number(hfvalue) / 60;
      // let j85value = (i60value * 8.5) / 27;
      let i60value = Number(hfvalue) / (findAcPointVal && Number(findAcPointVal.multiplevalue));
      let j85value = (i60value * (findAcPointVal && Number(findAcPointVal.dividevalue)) / 27);

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

        existingItem.avgpoint = (existingItem.point / existingItem.target) * 100;

        // Convert the dates array to Date objects
        const dateObjects = existingItem.date.map((date) => new Date(date));

        // Find the earliest (from) and latest (to) dates
        const fromDate = new Date(Math.min(...dateObjects));
        const toDate = new Date(Math.max(...dateObjects));

        // Format the dates as strings in "YYYY-MM-DD" format
        const formattedFromDate = fromDate?.toISOString()?.split("T")[0];
        const formattedToDate = toDate?.toISOString()?.split("T")[0];

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



    productionupload = belowMin.filter((item) => item.prod === true);

  } catch (err) {
    console.log(err, "temp")
    return next(new ErrorHandler("Records not found!", 404));
    // return next(new ErrorHandler("Internal Server Error", 500));
  }
  if (!productionupload) {
    return next(new ErrorHandler("Day Points Upload not found!", 404));
  }
  return res.status(200).json(productionupload);
});

exports.tempPointsfilterHome = catchAsyncErrors(async (req, res, next) => {
  let daypointsupload, minipoints, productionupload;
  try {
    const { fromdate, todate, compare, } = req.body;
    // console.log(fromdate, todate, "llllll")

    // minpoints = await MinimumPoints.find({}, { name: 1, company: 1, branch: 1, unit: 1, team: 1, empcode: 1, month: 1, year: 1, daypoint: 1, department: 1 });
    const query = {};

    if (fromdate && todate) {
      query.date = { $gte: fromdate, $lte: todate }
    }




    const [
      users,
      // salSlabs,
      manageshortagemasters,
      // revenueAmount,
      acPointCal,
      departments,
      daypointsupload
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
      AcPointVal.find({}, { branch: 1, company: 1, department: 1, dividevalue: 1, multiplevalue: 1 }),
      Department.find({}, { deptname: 1, prod: 1 }),
      TempPointsUpload.find(query, { uploaddata: 1 }).limit(5),
    ]);



    // console.log(daypointsupload.length, query, "daypointsupload")
    if (daypointsupload.length > 0) {

      let answer = daypointsupload.flatMap((data) =>
        data.uploaddata.filter((item, index) => index <= 6)
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
      const filteredArray = answer.filter((item, index) => index <= 5).map((obj1) => {
        const splitDate = obj1.date.split("-");


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

          existingItem.avgpoint = (existingItem.point / existingItem.target) * 100;

          // Convert the dates array to Date objects
          const dateObjects = existingItem.date.map((date) => new Date(date));

          // Find the earliest (from) and latest (to) dates
          const fromDate = new Date(Math.min(...dateObjects));
          const toDate = new Date(Math.max(...dateObjects));

          // Format the dates as strings in "YYYY-MM-DD" format

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
        let findexpval = Number(item.exper) < 1 ? "00" : Number(item.exper) <= 9 ? `0${Number(item.exper)}` : item.exper;
        return `${item.processcode}${findexpval}`;
      })

      const [

        salSlabs,
        revenueAmount
      ] = await Promise.all([

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
        RevenueAmount.find({ processcode: { $in: processcodes } }, { branch: 1, company: 1, processcode: 1, amount: 1 }),
      ]);
      // console.log(salSlabs.length, revenueAmount.length, "elg")
      const itemsWithSerialNumber = belowMin?.map((item, index) => {
        const findUserDepartment = users.find((d) => d.companyname === item.name)?.department;
        const prodTrue = departments.find((data) => data.deptname === findUserDepartment)?.prod;

        let findexpval = Number(item.exper) < 1 ? "00" : Number(item.exper) <= 9 ? `0${Number(item.exper)}` : item.exper;
        let processcodeexpvalue = `${item.processcode}${findexpval}`;
        //findsalary from salaryslab
        let findSalDetails = salSlabs.find((d) => d.company === item.companyname && d.branch === item.branch && d.salarycode === processcodeexpvalue);
        //shortageamount from shortage master
        let findShortage = manageshortagemasters.find((d) => d.department === findUserDepartment && Number(item.exper) >= Number(d.from) && Number(item.exper) <= Number(d.to));
        //revenue amount from revenue  master
        let findRevenueAllow = revenueAmount.find((d) => d.company === item.companyname && d.branch === item.branch && d.processcode === processcodeexpvalue);

        let findAcPointVal = acPointCal.find((d) => d.company === item.companyname && d.branch === item.branch && d.department === findUserDepartment);

        // GROSS VALUE
        let grossValue = findSalDetails ? Number(findSalDetails.basic) + Number(findSalDetails.hra) + Number(findSalDetails.conveyance) + Number(findSalDetails.medicalallowance) + Number(findSalDetails.productionallowance) + Number(findSalDetails.otherallowance) : 0;

        let egvalue = Number(grossValue) + (findShortage ? Number(findShortage.amount) : 0);

        let hfvalue = egvalue - (findRevenueAllow ? Number(findRevenueAllow.amount) : 0);
        // let i60value = Number(hfvalue) / 60;
        // let j85value = (i60value * 8.5) / 27;
        let i60value = Number(hfvalue) / (findAcPointVal && Number(findAcPointVal.multiplevalue));
        let j85value = (i60value * (findAcPointVal && Number(findAcPointVal.dividevalue))) / 27;
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
      productionupload = []
    }

    return res.status(200).json(productionupload);
  } catch (err) {
    console.log(err, "erersk")
    return next(new ErrorHandler("Records not found!", 404));
  }


});
