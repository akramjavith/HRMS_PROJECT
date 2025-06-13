const TempcategoryTimeLog = require("../../../model/modules/production/tempcategorytimelog");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const ProductionTempUploadAll = require("../../../model/modules/production/productiontempuploadall");
const ClientUserid = require("../../../model/modules/production/ClientUserIDModel");
const ProducionIndividual = require("../../../model/modules/production/productionindividual");
const Users = require("../../../model/login/auth");
const TimePoints = require("../../../model/modules/setup/timepoints");
const DayPointsUploadTemp = require("../../../model/modules/production/daypointsuploadtemp");


function addTime(time, count) {
  // Split and convert time to seconds
  const [hours, minutes, seconds] = time.split(":").map(Number);
  const totalSeconds = (hours * 3600 + minutes * 60 + seconds) * count;

  // Convert back to HH:mm:ss
  const finalHours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const finalMinutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const finalSeconds = String(totalSeconds % 60).padStart(2, "0");

  return `${finalHours}:${finalMinutes}:${finalSeconds}`;
}


function compareDateTimes(dateT, shiftFrom, shiftEnd) {
  // Parse the datetime strings into Date objects
  const dateTimeObj = new Date(dateT);
  const shiftFromTimeObj = new Date(shiftFrom);
  const shiftEndTimeObj = new Date(shiftEnd);
  // Perform the comparisons
  const isWithinShift = dateTimeObj >= shiftFromTimeObj && dateTimeObj <= shiftEndTimeObj;

  return isWithinShift;
}


// get All TempcategoryTimeLog Name => /api/alltempcategorytimelog
exports.getAllTempcategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    let tempcategorytimelog;
    try {
      tempcategorytimelog = await TempcategoryTimeLog.find();
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
      // count: products.length,
      tempcategorytimelog,
    });
  }
);



exports.TempCategoryTimelogCalculationold = catchAsyncErrors(
  async (req, res, next) => {
    let categorytimelog;
    try {
      const { fromdate, branch, username } = req.body;

      let logidQuery = {
        loginallotlog: { $exists: true, $ne: [] },
      };

      let userQuery = {
        enquirystatus: {
          $nin: ["Enquiry Purpose"],
        },

        $or: [
          { reasondate: { $exists: false } },
          { reasondate: { $eq: "" } },
          { reasondate: { $lte: fromdate } },
        ],
      };

      let query = { fromdate: fromdate };

      const [loginids, ProductionUploads, users, timepoints] =
        await Promise.all([
          ClientUserid.find(logidQuery, {
            empname: 1,
            userid: 1,
            projectvendor: 1,
            loginallotlog: 1,
          }).lean(),
          ProductionTempUploadAll.find(query, {
            filenameupdated: 1,
            category: 1,
            vendor: 1,
            user: 1,
            formatteddate: 1,
            formattedtime: 1,
            unallotcategory: 1,
            unallotsubcategory: 1,
          }),
          Users.find(userQuery, {
            companyname: 1,
            empcode: 1,
            company: 1,
            departmentlog: 1,
            unit: 1,
            branch: 1,
            team: 1,
            username: 1,
            processlog: 1,
            shifttiming: 1,
            department: 1,
            doj: 1,
            assignExpLog: 1,
            shiftallot: 1,
            boardingLog: 1,
            intStartDate: 1,
          }),
          TimePoints.find(
            {},
            {
              category: 1,
              subcategory: 1,
              time: 1,
              
            }
          ),
        ]);
      console.log(loginids.length, users.length, "dfdf");
      let logs = loginids.flatMap((user) =>
        user.loginallotlog.map((log) => ({
          userid: user.userid,
          projectvendor: user.projectvendor,
          date: log.date,
          time: log.time,
          empname: log.empname,
          empcode: log.empcode,
          enddate: log.enddate ? log.enddate : null,
        }))
      );

      // Step 2: Sort logs by date and time (ascending order)
      logs.sort((a, b) => {
        if (a.date === b.date) {
          return a.time.localeCompare(b.time);
        }
        return new Date(a.date) - new Date(b.date);
      });

      // Step 3: Calculate the enddate for each log (except the last log for each userid)
      const userLogsMap = {};
      logs.forEach((log) => {
        if (!userLogsMap[log.userid]) {
          userLogsMap[log.userid] = {};
        }

        if (!userLogsMap[log.userid][log.projectvendor]) {
          userLogsMap[log.userid][log.projectvendor] = [];
        }

        userLogsMap[log.userid][log.projectvendor].push(log);
      });

      Object.values(userLogsMap).forEach((userLogs) => {
        Object.values(userLogs).forEach((logsArray) => {
          logsArray.forEach((log, idx) => {
            if (idx < logsArray.length - 1) {
              log.enddate = logsArray[idx + 1].date;
            }
          });
        });
      });
      // Step 4: Filter logs based on input date
      const filteredLogs = logs.filter((log) => {
        return (
          new Date(log.date) <= new Date(req.body.fromdate) &&
          (!log.enddate || new Date(log.enddate) >= new Date(req.body.fromdate))
        );
      });

      // Step 5: Sort the filtered logs by date and time (descending order)
      filteredLogs.sort((a, b) => {
        if (a.date === b.date) {
          return b.time.localeCompare(a.time);
        }
        return new Date(b.date) - new Date(a.date);
      });

      console.log(ProductionUploads.length, filteredLogs.length, "peroe");

      let mergedDataallfirst = ProductionUploads.map((upload) => {
        const loginInfo = filteredLogs.filter(
          (login) =>
            login.userid === upload.user &&
            login.projectvendor === upload.vendor
        );

        let loginallot = loginInfo ? loginInfo : [];
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
          const lastItemsForEachDateTime = Object.values(groupedByDateTime).map(
            (group) => group[group.length - 1]
          );

          // Sort the last items by date and time
          lastItemsForEachDateTime.sort((a, b) => {
            return (
              new Date(b.date + " " + b.time) - new Date(a.date + " " + a.time)
            );
          });

          // Find the first item in the sorted array that meets the criteria
          for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
            const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;
            // let datevalsplit = upload.mode == "Manual" ? "" : upload.formatteddatetime.split(" ");
            let datevalsplitfinal =
              upload.mode == "Manual"
                ? `${upload.fromdate}T${convertTo24HourFormat(upload.time)}Z`
                : `${upload.formatteddate}T${upload.formattedtime}Z`;
            if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
              filteredDataDateTime = lastItemsForEachDateTime[i];
            } else {
              break;
            }
          }
        }
        // console.log(loginallot.length,filteredDataDateTime,"datetime")
        let logininfoname =
          loginallot.length > 0 &&
          filteredDataDateTime &&
          filteredDataDateTime.empname
            ? filteredDataDateTime.empname
            : loginInfo
            ? loginInfo.empname
            : "";
  logininfoname &&   console.log(logininfoname,"logininfoname")
        // const comparedate = upload.mode == 'Manual' ? upload.fromdate : upload.formatteddate;
        // const comparetime = upload.mode == 'Manual' ? convertTo24HourFormat(upload.time) : upload.formattedtime;

        // const fromdatetime = `${date}T${"00:00:00"}Z`;
        // const todatetime = `${date}T${"11:59:59"}Z`;

        // const dateTime = `${comparedate}T${comparetime}Z`;

        const userInfo = users.find(
          (user) => logininfoname === user.companyname
        );

        // console.log(userInfo,"userInfo")

        const finalcategory = upload.unallotcategory
          ? upload.unallotcategory
          : upload.mode == "Manual"
          ? upload.filename
          : upload.filenameupdated;

        const finalsubcategory = upload.unallotsubcategory
          ? upload.unallotsubcategory
          : upload.category;

        // console.log(todatetime,'todatetime')
        if (branch.length === 0 || branch.includes(userInfo?.branch)) {
          return {
            user: upload.user,
            vendor: upload.vendor,
            category: finalsubcategory,
            fromdate: fromdate,
            filename: finalcategory,
            empname: userInfo && userInfo.companyname,
            branch: userInfo && userInfo.branch,
            empcode: userInfo && userInfo.empcode,
          };
        }
      });

      mergedDataallfirst = mergedDataallfirst.filter(
        (d) => d !== null && d !== undefined
      );
      console.log(mergedDataallfirst[0], "mergedDataallfirst");

      categorytimelog = mergedDataallfirst.reduce((acc, current) => {
        const existingItem = acc.find(
          (item) =>
            item.filename === current.filename &&
            item.empname === current.empname &&
            item.branch === current.branch &&
            item.category === current.category
        );

        if (existingItem) {
          existingItem.count += 1;
        } else {
          acc.push({
            category: current.category,
            filename: current.filename,
            fromdate: current.fromdate,
            todate: current.fromdate,
            empname: current.empname,
            // empcode: current.filename,
            vendor: current.vendor,
            user: current.user,
            branch: current.branch, // include this since you're using it in `find`
            count: 1,
          });
        }

        return acc;
      }, []);
     const categorytimelogs = categorytimelog.map((current) => {
        let timedata = timepoints.find(
          (d) =>
          
            d.category == current.filename &&
            (d.subcategory === current.category || d.subcategory === "ALL")
        );
      // timedata ?  console.log(timedata,"timedata") : "ioko"
      const  timevalue = timedata ? timedata.time : "00:00:00";

        const finalTime = addTime(timevalue, Number(current.count));
        // console.log(finalTime);

        return {
          category: current.category,
          filename: current.filename,
          fromdate: current.fromdate,
          todate: current.fromdate,
          empname: current.empname,
          // empcode: current.filename,
          vendor: current.vendor,
          user: current.user,
          branch: current.branch, // include this since you're using it in `find`
          count: current.count,
          allothours: finalTime ? finalTime : "00:00:00",
        };
      });

      const finalData = branch.map((d) => {
        const filtered = categorytimelogs.filter((item) => item.branch === d);
        return {
          branch: d,
          fromdate: fromdate,
          username: username,
          addedby: [
            {
              name: username,
              // date:date.now,
            },
          ],

          data: filtered,
        };
      });
      if (categorytimelog.length > 0) {
        await TempcategoryTimeLog.insertMany(finalData, {
          ordered: false, // continue inserting even if some docs fail
        });
      }
      // console.log(categorytimelog.length, "categorytimelog");
      return res.status(200).json({
        // count: products.length,
        message: "Added Successfully",
        count: categorytimelog.length,
      });
    } catch (err) {
      console.log(err, "errerered");
      return next(new ErrorHandler("Records not found!", 404));
    }
  }
);


exports.TempCategoryTimelogCalculation = catchAsyncErrors(async (req, res, next) => {
  try {
     const { branch, date, username } = req.body;

    const dateObj = new Date(date);

    // Extract day, month, and year components
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();

    // Format the date components into the desired format
    const formattedDate = `${day}-${month}-${year}`;

    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    let newDateOnePlus = currentDate.toISOString().split("T")[0];

    const prodDayPoints = await DayPointsUploadTemp.findOne({ date: date }, { uploaddata: 1 });

    const filteredDaypoints = prodDayPoints ? prodDayPoints?.uploaddata.filter((d) => branch.includes(d.branch) ) : [];
    const userIds = [...new Set(filteredDaypoints.map((d) => d.users).flatMap((d) => d))];
    const userProdDayTimes = [...new Set(filteredDaypoints.map((d) => d.fromtodate))]
      .map((d) => {
        const fromdate = d.split("$")[0].split(".")[0];
        const todate = d.split("$")[1].split(".")[0];
        const checkfromtotimezero = fromdate === todate;
        return {
          fromdate: new Date(`${fromdate}Z`),
          todate: new Date(`${todate}Z`),
          checkfromtotimezero: checkfromtotimezero,
        };
      })
      .filter((d) => d.checkfromtotimezero == false);

    const { minStart, maxEnd } = userProdDayTimes
      .filter((d) => d.fromdate && d.todate)
      .reduce(
        (acc, obj) => {
          const startTime = new Date(obj.fromdate);
          const endTime = new Date(obj.todate);

          // Update minimum start time
          if (!acc.minStart || startTime < acc.minStart) {
            acc.minStart = startTime;
          }

          // Update maximum end time
          if (!acc.maxEnd || endTime > acc.maxEnd) {
            acc.maxEnd = endTime;
          }

          return acc;
        },
        { minStart: null, maxEnd: null } // Proper initialization
      );

    const fromdate = String(minStart).split("0")[0].split("T")[0];
    const fromtime = String(minStart).split("0")[0].split("T")[1];

    const enddate = String(maxEnd).split("0")[0].split("T")[0];
    const endtime = String(maxEnd).split("0")[0].split("T")[1];

    const prodIndQuery = {
      fromdate: { $gte: fromdate, $lte: enddate },
      time: { $gte: fromtime, $lte: endtime },
      user: {
        $in: filteredDaypoints.flatMap((d) => d.users),
        // ["TTS402"],
      },
    };

    const [ timepoints, productionUploads, productionIndividuals] = await Promise.all([
   
      TimePoints.find({}, {}),
      ProductionTempUploadAll.find(
        {
          dateobjformatdate: { $gte: minStart, $lte: maxEnd },
          user: {
            $in: filteredDaypoints.flatMap((d) => d.users),
         
          },
        },
        {
          filenameupdated: 1,
          category: 1,
          unallotcategory: 1,
          user: 1,
          unallotsubcategory: 1,
          formatteddate: 1,
          formattedtime: 1,
          dateobjformatdate: 1,
        }
      ),
      ProducionIndividual.find(prodIndQuery, {
        filename: 1,
        unallotcategory: 1,
        user: 1,
        unallotsubcategory: 1,
        fromdate: 1,
        time: 1,
        category: 1,
        mode: 1,
      }),
    ]);
    const allData = [...productionUploads, ...productionIndividuals];
    console.log(allData.length,"alldata");


    let productions = allData.map((item) => {
      const userInfoShifts = filteredDaypoints.filter((d) => d.users.includes(item.user));

      const userInfo = filteredDaypoints.find((d) => d.users.includes(item.user));
      const finalcategory = item.unallotcategory ? item.unallotcategory : item?.mode == "Manual" ? item.filename : item.filenameupdated;
      const finalsubcategory = item.unallotsubcategory ? item.unallotsubcategory : item.category;
      const comparedate = item?.mode == "Manual" ? item.fromdate : item.formatteddate;
      const comparetime = item?.mode == "Manual" ? convertTo24HourFormat(item.time) : item.formattedtime;
      const dateTime = `${comparedate}T${comparetime}Z`;

      let userShiftTimes = [...new Set(userInfoShifts.map((d) => d.fromtodate))]
        .map((d) => {
          const fromdate = d.split("$")[0].split(".")[0];
          const todate = d.split("$")[1].split(".")[0];
          const checkfromtotimezero = fromdate === todate;
          return {
            fromdate: new Date(`${fromdate}Z`),
            todate: new Date(`${todate}Z`),
            checkfromtotimezero: checkfromtotimezero,
          };
        })
        .filter((d) => d.checkfromtotimezero == false);

      const { minStart, maxEnd } = userShiftTimes
        .filter((d) => d.fromdate && d.todate)
        .reduce(
          (acc, obj) => {
            const startTime = new Date(obj.fromdate);
            const endTime = new Date(obj.todate);

            // Update minimum start time
            if (!acc.minStart || startTime < acc.minStart) {
              acc.minStart = startTime;
            }

            // Update maximum end time
            if (!acc.maxEnd || endTime > acc.maxEnd) {
              acc.maxEnd = endTime;
            }

            return acc;
          },
          { minStart: null, maxEnd: null } // Proper initialization
        );
      const shiftfromdatetime = minStart ? `${minStart?.toISOString()?.split(".")[0]}Z` : null;
      const shifttodatetime = maxEnd ? `${maxEnd?.toISOString()?.split(".")[0]}Z` : null;
      // console.log(dateTime, `${shiftfromdatetime}`, `${shifttodatetime}`);
      if (compareDateTimes(dateTime, `${shiftfromdatetime}`, `${shifttodatetime}`))
        return {
          empname: userInfo.name || "",
          empcode: userInfo.empcode || "",
          branch: userInfo.branch || "",
          filename: finalcategory|| "",
          category: finalsubcategory|| "",
          olddateval: dateTime,
          dateval: `${comparedate} ${comparetime}`,
        };
    });

productions = productions.filter((d) => d !== null && d !== undefined);
    console.log(productions[0], "productions");

    let categoryHoursDataAll = productions.reduce((acc, current) => {
      const existingItem = acc.find((item) => item.filename === current.filename &&
       item.empname === current.empname && item.branch === current.branch &&
        item.category === current.category);
      let timedata = timepoints.find((d) => d.category == current.filename && (d.subcategory === current.category || d.subcategory === "ALL"));
      const timevalue = timedata ? timedata.time : "00:00:00";
      // const finalTime = addTime(timevalue, Number(current.count));
   

      if (existingItem) {
        existingItem.count += 1;
        existingItem.allothours = timevalue ? addTime(timevalue, Number(existingItem.count)) : "00:00:00";
      } else {
        acc.push({
          category: current.category,
          filename: current.filename,
          empname: current.empname,
          fromdate: date,
          todate: date,
          branch: current.branch,
          count: 1,
          allothours: timevalue ? addTime(timevalue, Number(1)) : "00:00:00",
        });
      }
      return acc;
    }, []);

    const finalData = branch.map((d) => {
      const filtered = categoryHoursDataAll.filter((item) => item.branch === d);
      return {
        branch: d,
        fromdate: date,
        username: username,
        addedby: [
          {
            name: username,
            // date:date.now,
          },
        ],

        data: filtered,
      };
    });
    if (productions.length > 0) {
      await TempcategoryTimeLog.insertMany(finalData, {
        ordered: false, // continue inserting even if some docs fail
      });
    }
    // console.log(categorytimelog.length, "categorytimelog");
    return res.status(200).json({
      // count: products.length,
      message: "Added Successfully",
      count: categoryHoursDataAll.length,
    });
  } catch (err) {
    console.log(err, "errerered");
    return next(new ErrorHandler("Records not found!", 404));
  }
});




// Create new TempcategoryTimeLog=> /api/tempcategorytimelog/new
exports.addTempcategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    let atempcategorytimelog = await TempcategoryTimeLog.create(
      req.body
    );

    return res.status(200).json({
      message: "Successfully added!",
    });
  }
);

// get Signle TempcategoryTimeLog => /api/tempcategorytimelog/:id
exports.getSingleTempcategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;

    let stempcategorytimelog = await TempcategoryTimeLog.findById(id);

    if (!stempcategorytimelog) {
      return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
      stempcategorytimelog,
    });
  }
);

// update TempcategoryTimeLog by id => /api/tempcategorytimelog/:id
exports.updateTempcategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    if (!utempcategorytimelog) {
      return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
  }
);

// delete TempcategoryTimeLog by id => /api/tempcategorytimelog/:id
exports.deleteTempcategoryTimeLog= catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;

    let dtempcategorytimelog =
      await TempcategoryTimeLog.findByIdAndRemove(id);

    if (!dtempcategorytimelog) {
      return next(new ErrorHandler("Data  not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
  }
);


