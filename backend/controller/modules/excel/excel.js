const Excel = require("../../../model/modules/excel/excel");
const Branch = require("../../../model/modules/branch");
const Team = require("../../../model/modules/teams");
const User = require("../../../model/login/auth");
const Category = require("../../../model/modules/setup/category");
const Excelmapdata = require("../../../model/modules/excel/excelmapdata");
const Excelmaprespersondata = require("../../../model/modules/excel/excelmapresperson");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Hirerarchi = require("../../../model/modules/setup/hierarchy");
const Designationgroup = require("../../../model/modules/designationgroup");
const Designation = require("../../../model/modules/designation");
const Addcandidate = require("../../../model/modules/recruitment/addcandidate");

// get All excel => /api/excel
exports.getAllExcel = catchAsyncErrors(async (req, res, next) => {
  let excel;
  try {
    // excel = await Excel.find();
    excel = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!excel) {
    return next(new ErrorHandler("excel not found!", 404));
  }
  return res.status(200).json({
    excel,
  });
});

// get All excel => /api/excel
exports.getAllExcelfiltered = catchAsyncErrors(async (req, res, next) => {
  try {
    // Find the last Excel document based on a timestamp field (e.g., createdAt)
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry?.exceldata?.filter((item) => {
      return item.customer?.toLowerCase() !== "customer" && item.process?.toLowerCase() !== "process";
    });

    const excelsid = latestExcelEntry._id;
    const excelsupdatebyall = latestExcelEntry.updatedby;
    const excelsupdateby = excelsupdatebyall[excelsupdatebyall.length - 1];

    const response = {
      excels,
      excelsid,
      excelsupdateby,
      excelsupdatebyall,
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

exports.getAllExcelPrimaryworkorderovertat = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";

      if (item.tat?.includes(wordToCheck)) {
        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;
            const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

            if (matchedItems && matchedItems.length > 0) {
              return matchedItems.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      }
      return [];
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
  });
});

exports.getAllExcelPrimaryworkorderneartat = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')

    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "in";

      if (!item.tat?.includes("ago")) {
        if (item.tat?.includes("in an hour") || item.tat?.includes("in 2 hours") || item.tat?.includes("in 3 hours") || item.tat?.includes("in 4 hours") || item.tat?.includes("in 5 hours") || item.tat?.includes("in 6 hours") || item.tat?.includes("minute")) {
          if (matchingMappedItemcate) {
            const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
            const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
            const resultTimeInSeconds = totalTimeInSeconds * item.count;
            const newHours = Math.floor(resultTimeInSeconds / 3600);
            const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
            const newSeconds = resultTimeInSeconds % 60;
            const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

            if (matchingMappedItemperson) {
              const { todo } = matchingMappedItemperson;
              const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

              if (matchedItems && matchedItems.length > 0) {
                return matchedItems.map((priorityItem) => ({
                  project: item.project,
                  vendor: item.vendor,
                  date: item.date,
                  time: item.time,
                  customer: item.customer,
                  priority: item.priority,
                  process: item.process,
                  hyperlink: item.hyperlink,
                  count: item.count,
                  tat: item.tat,
                  created: item.created,
                  category: matchingMappedItemcate.category,
                  subcategory: matchingMappedItemcate.subcategory,
                  queue: matchingMappedItemcate.queue,
                  time: resulttime,
                  org: matchingMappedItemcate.points,
                  orgtime: matchingMappedItemcate.time,
                  points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                  branch: priorityItem.branch,
                  unit: priorityItem.unit,
                  team: priorityItem.team,
                  resperson: priorityItem.resperson,
                  prioritystatus: priorityItem.priority,
                }));
              }
              return [];
            }
            return [];
          }
          return [];
        }
        return [];
      }
      return [];
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
  });
});

exports.getAllExcelPrimaryworkorderall = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
  });
});

exports.getAllExcelSecondaryworkorderall = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result;
  try {
    excelmapdata = await Excelmapdata.find().lean();
    excelmapdataresperson = await Excelmaprespersondata.find().lean();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "secondary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
  });
});
exports.getAllExcelSecondaryworkorderallFilter = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result;
  try {
    excelmapdata = await Excelmapdata.find().lean();
    excelmapdataresperson = await Excelmaprespersondata.find().lean();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "secondary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
  });
});

exports.getAllExcelSecondaryworkorderallUnalloted = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "secondary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return [];
          } else {
            return {
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              org: matchingMappedItemcate.points,
              branch: "Unallotted",
              unit: "Unallotted",
              team: "Unallotted",
              resperson: "Unallotted",
              prioritystatus: "Unallotted",
            }; // If there's no matching item in mappeddata, return the original item
          }
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
  });
});

//tertiary Individual All List
exports.getExcelTertiaryIndividual = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultteam, finalresult;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')

    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "tertiary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.resperson === req.body.companyname);
          const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.team == req.body.team && task.priority?.toLowerCase() === "tertiary");

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    resultteam = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "tertiary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.resperson === req.body.companyname);
          const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "tertiary");

          if (matchedItemsteam && matchedItemsteam.length > 0) {
            return matchedItemsteam.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    finalresult = result.length > 0 ? result : resultteam;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resultteam,
    finalresult,
  });
});

exports.getAllExcelTertiaryworkorderall = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result;
  try {
    excelmapdata = await Excelmapdata.find().lean();
    excelmapdataresperson = await Excelmaprespersondata.find().lean();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "tertiary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
  });
});

exports.getAllExcelIndividualPrimaryworkorderall = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultteam, finalresult, excels;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";
      if (item.tat?.includes(wordToCheck)) {
        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;
            const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && task.resperson === req.body.companyname);

            if (matchedItems && matchedItems.length > 0) {
              return matchedItems.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      }
      return [];
    });

    resultteam = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";
      if (item.tat?.includes(wordToCheck)) {
        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && task.priority?.toLowerCase() === "primary");

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      }
      return [];
    });

    finalresult = result.length > 0 ? result : resultteam;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resultteam,
    finalresult,
  });
});

//primary Individual near tat
exports.getAllExcelIndividualPrimaryIndneartat = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultteam, finalresult;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const wordToCheck = "in";
      if (!item.tat?.includes("ago")) {
        if (item.tat?.includes("in an hour") || item.tat?.includes("in 2 hours") || item.tat?.includes("in 3 hours") || item.tat?.includes("in 4 hours") || item.tat?.includes("in 5 hours") || item.tat?.includes("in 6 hours") || item.tat?.includes("minute")) {
          if (matchingMappedItemcate) {
            const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
            const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
            const resultTimeInSeconds = totalTimeInSeconds * item.count;
            const newHours = Math.floor(resultTimeInSeconds / 3600);
            const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
            const newSeconds = resultTimeInSeconds % 60;
            const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

            if (matchingMappedItemperson) {
              const { todo } = matchingMappedItemperson;
              const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.resperson === req.body.companyname);
              const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "primary");

              if (matchedItems && matchedItems.length > 0) {
                return matchedItems.map((priorityItem) => ({
                  project: item.project,
                  vendor: item.vendor,
                  date: item.date,
                  time: item.time,
                  customer: item.customer,
                  priority: item.priority,
                  process: item.process,
                  hyperlink: item.hyperlink,
                  count: item.count,
                  tat: item.tat,
                  created: item.created,
                  category: matchingMappedItemcate.category,
                  subcategory: matchingMappedItemcate.subcategory,
                  queue: matchingMappedItemcate.queue,
                  time: resulttime,
                  org: matchingMappedItemcate.points,
                  orgtime: matchingMappedItemcate.time,
                  points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                  branch: priorityItem.branch,
                  unit: priorityItem.unit,
                  team: priorityItem.team,
                  resperson: priorityItem.resperson,
                  prioritystatus: priorityItem.priority,
                }));
              }
              return [];
            }
            return [];
          }
          return [];
        }
        return [];
      }
      return [];
    });

    resultteam = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        const wordToCheck = "in";
        if (item.tat?.includes("ago")) {
          if (item.tat?.includes("in an hour") || item.tat?.includes("in 2 hours") || item.tat?.includes("minute")) {
            if (matchingMappedItemperson) {
              const { todo } = matchingMappedItemperson;
              const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.resperson === req.body.companyname);
              const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "primary");

              if (matchedItemsteam && matchedItemsteam.length > 0) {
                return matchedItemsteam.map((priorityItem) => ({
                  project: item.project,
                  vendor: item.vendor,
                  date: item.date,
                  time: item.time,
                  customer: item.customer,
                  priority: item.priority,
                  process: item.process,
                  hyperlink: item.hyperlink,
                  count: item.count,
                  tat: item.tat,
                  created: item.created,
                  category: matchingMappedItemcate.category,
                  subcategory: matchingMappedItemcate.subcategory,
                  queue: matchingMappedItemcate.queue,
                  time: resulttime,
                  org: matchingMappedItemcate.points,
                  orgtime: matchingMappedItemcate.time,
                  points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                  branch: priorityItem.branch,
                  unit: priorityItem.unit,
                  team: priorityItem.team,
                  resperson: priorityItem.resperson,
                  prioritystatus: priorityItem.priority,
                }));
              }
              return [];
            }
            return [];
          }
          return [];
        }
        return [];
      }
      return [];
    });

    finalresult = result.length > 0 ? result : resultteam;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resultteam,
    finalresult,
  });
});

//primary Individual All Lsit
exports.getExcelPrimaryIndividual = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultteam, finalresult, excels;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && task.resperson === req.body.companyname);

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    resultteam = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;

          const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && task.priority?.toLowerCase() === "primary");

          if (matchedItemsteam && matchedItemsteam.length > 0) {
            return matchedItemsteam.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    finalresult = result.length > 0 ? result : resultteam;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resultteam,
    finalresult,
  });
});

//EXCELFILTER

//OTHER WORK ORDER
exports.getAllExcelPrimaryworkorderOther = catchAsyncErrors(async (req, res, next) => {
  let excel, totLength,
    excelmapdata, totalProjects, excelmapdataresperson, result, results, excels, resulted, resultSecond;

  let { page, pageSize, value } = req.body;
  const skip = (page - 1) * pageSize; // Calculate the number of items to skip
  const limit = pageSize; // The number of items to take
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')

    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    results = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.branch?.toLowerCase() === "other" && ["other"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers" && !["page", 'pageSize', 'value'].includes(key)) {
        const value = req.body[key];
        if (value !== "") {
          query[key] = value.toString();
        }
      }

    });

    resultSecond = results.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    })?.slice(skip, skip + limit);


    function isEmpty(obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    }
    result = results?.slice(skip, skip + limit);
    resulted = (["cleared"]?.includes(value) || isEmpty(query)) ? result : resultSecond
    totLength = (["cleared"]?.includes(value) || isEmpty(query)) ? results?.length : results?.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    })?.length

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    totalProjects: totLength,
    currentPage: page,
    result,
    resulted,
    totalPages: Math.ceil(totLength / pageSize),
  });
});

exports.getAllExcelPrimaryworkorderOtherList = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, excels;
  let resulted;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.branch?.toLowerCase() === "other" && ["other"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
  });
});

//CONSOLIDATED WORK ORDER
exports.getAllExcelConsWorkDataList = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result;
  let resulted;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });
    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers") {
        const value = req.body[key];
        if (value !== "") {
          query[key] = value.toString();
        }
      }

    });
    resulted = result.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!resulted) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    resulted,
    result,
  });
});

exports.getAllExcelConsWorkDataListFilter = catchAsyncErrors(async (req, res, next) => {
  let excel, totLength,
    excelmapdata, totalProjects, excelmapdataresperson, result, results, excels, resulted, resultSecond;

  let { page, pageSize, value } = req.body;
  const skip = (page - 1) * pageSize; // Calculate the number of items to skip
  const limit = pageSize; // The number of items to take
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    results = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });


    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers" && !["page", 'pageSize', 'value'].includes(key)) {
        const value = req.body[key];
        if (value !== "") {
          query[key] = value.toString();
        }
      }
    });
    resultSecond = results?.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    })?.slice(skip, skip + limit);


    function isEmpty(obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    }
    result = results?.slice(skip, skip + limit);
    resulted = (["cleared"]?.includes(value) || isEmpty(query)) ? result : resultSecond
    totLength = (["cleared"]?.includes(value) || isEmpty(query)) ? results?.length : results?.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    })?.length

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    totalProjects: totLength,
    currentPage: page,
    result,
    resulted,
    totalPages: Math.ceil(totLength / pageSize),
  });
});


// CONSOLIDATED WORK ORDER ALL
exports.getAllExcelConsWorkDataAllList = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result;
  let resulted;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary", "not for us", "other-nfu", "other", "web-nfu"].includes(task.priority?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });

    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers") {
        const value = req.body[key];
        if (value !== "") {
          query[key] = value.toString();
        }
      }
      // const value = req.body[key];
      //  if (value !== '') {
      //     query[key] = { $eq: value.toString() };
      // }
    });
    resulted = result.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!resulted) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    resulted,
    result,
  });
});

exports.getAllExcelConsWorkDataAllListFilter = catchAsyncErrors(async (req, res, next) => {
  let excel, totLength,
    excelmapdata, totalProjects, excelmapdataresperson, result, results, excels, resulted, resultSecond;

  let { page, pageSize, value } = req.body;
  const skip = (page - 1) * pageSize; // Calculate the number of items to skip
  const limit = pageSize; // The number of items to take
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    results = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary", "not for us", "other-nfu", "other", "web-nfu"].includes(task.priority?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });


    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers" && !["page", 'pageSize', 'value'].includes(key)) {
        const value = req.body[key];
        if (value !== "") {
          query[key] = value.toString();
        }
      }
    });
    resultSecond = results?.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    })?.slice(skip, skip + limit);


    function isEmpty(obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    }
    result = results?.slice(skip, skip + limit);
    resulted = (["cleared"]?.includes(value) || isEmpty(query)) ? result : resultSecond
    totLength = (["cleared"]?.includes(value) || isEmpty(query)) ? results?.length : results?.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    })?.length

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    totalProjects: totLength,
    currentPage: page,
    result,
    resulted,
    totalPages: Math.ceil(totLength / pageSize),
  });
});

//Secondary Individual All List
exports.getExcelSecondaryIndividual = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultteam, finalresult, excels;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "secondary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.resperson === req.body.companyname);
          const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "secondary");

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    resultteam = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "secondary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.resperson === req.body.companyname);
          const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "secondary");

          if (matchedItemsteam && matchedItemsteam.length > 0) {
            return matchedItemsteam.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    finalresult = result.length > 0 ? result : resultteam;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resultteam,
    finalresult,
  });
});

//Others Individual All List
exports.getExcelothersIndividualList = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultteam, finalresult;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.branch?.toLowerCase() === "other" && task.resperson === req.body.companyname);
          const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && task.branch?.toLowerCase() === "other");

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    resultteam = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.branch?.toLowerCase() === "other" && task.resperson === req.body.companyname);
          const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && task.branch?.toLowerCase() === "other");

          if (matchedItemsteam && matchedItemsteam.length > 0) {
            return matchedItemsteam.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    finalresult = result.length > 0 ? result : resultteam;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resultteam,
    finalresult,
  });
});

//Others Individual All List FILTER POST CALL
exports.getExcelothersIndividualListFilter = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultteam, finalresult, resulted;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.branch?.toLowerCase() === "other" && task.resperson === req.body.companyname);
          const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && task.branch?.toLowerCase() === "other");

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    resultteam = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.branch?.toLowerCase() === "other" && task.resperson === req.body.companyname);
          const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && task.branch?.toLowerCase() === "other");

          if (matchedItemsteam && matchedItemsteam.length > 0) {
            return matchedItemsteam.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    finalresult = result.length > 0 ? result : resultteam;

    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers") {
        const value = req.body[key];
        if (value !== "") {
          query[key] = value.toString();
        }
      }
    });
    resulted = finalresult.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resultteam,
    finalresult,
    resulted,
  });
});

//CONSOLIDATED  Individual PRIMARY , SECONDARY , TERTIARY List
exports.getExcelConsolidatedIndividualList = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultteam, finalresult, excels;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase()) && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.resperson === req.body.companyname);

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    resultteam = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;

          const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase()));

          if (matchedItemsteam && matchedItemsteam.length > 0) {
            return matchedItemsteam.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    finalresult = result.length > 0 ? result : resultteam;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resultteam,
    finalresult,
  });
});

//CONSOLIDATED  Individual PRIMARY , SECONDARY , TERTIARY List
exports.getExcelConsolidatedIndividualListFilter = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultteam, finalresult, resulted;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase()) && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.resperson === req.body.companyname);

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    resultteam = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;

          const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase()));

          if (matchedItemsteam && matchedItemsteam.length > 0) {
            return matchedItemsteam.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    finalresult = result.length > 0 ? result : resultteam;
    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers" && key !== "companyname") {
        const value = req.body[key];
        if (value !== "") {
          query[key] = value.toString();
        }
      }
    });
    resulted = finalresult.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resultteam,
    finalresult,
    resulted,
  });
});

//CONSOLIDATED  Individual ALL  List
exports.getExcelConsolidatedIndividualListAll = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultteam, finalresult;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.resperson === req.body.companyname);
          // const matchedItemsteam = todo?.filter((task) =>
          //     (task.resperson != req.body.companyname) && ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase()) ||
          //     (["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase())) && (task.branch.toLowerCase() != "other") && (task.team == req.body.team) && ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase())
          // );

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    resultteam = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;

          const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team);

          if (matchedItemsteam && matchedItemsteam.length > 0) {
            return matchedItemsteam.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    finalresult = result.length > 0 ? result : resultteam;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resultteam,
    finalresult,
  });
});

//CONSOLIDATED  Individual ALL List
exports.getExcelConsolidatedIndividualListAllFilter = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultteam, resulted, finalresult;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.resperson === req.body.companyname);

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    resultteam = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;

          const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team);

          if (matchedItemsteam && matchedItemsteam.length > 0) {
            return matchedItemsteam.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    finalresult = result.length > 0 ? result : resultteam;

    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers" && key !== "companyname") {
        const value = req.body[key];
        if (value !== "") {
          query[key] = value.toString();

        }
      }
    });

    resulted = finalresult.filter((item) => {
      for (const key in query) {
        if ((item[key] === query[key]) || (query[key] === "ALL" && ["project", "subcategory"]?.includes(key))) {

          return true;
        }
      }
      return false;
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resultteam,
    finalresult,
    resulted,
  });
});

// REPORTS BRANCH, CATEGORY, QUEUE, TEAM, RESPERSON---------------------------------------------------
// get All excel => /api/excel
exports.getAllExcelBranchReportCount = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultoutput, branches, resultNewdata;

  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    branches = await Branch.find();

    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary", "not for us", "other-nfu", "other", "web-nfu"].includes(task.priority?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });

    // Use Array.reduce to aggregate values by branch
    const resultteamdata = result.reduce((acc, item) => {
      const branch = item.branch;
      if (!acc[branch]) {
        acc[branch] = {
          branch,
          count: 0,
          points: 0,
          time: [0, 0, 0], // Initialize time as an array of numbers [hh, mm, ss]
        };
      }

      if (branch === "Unallotted") {
        acc[branch].count += parseInt(item.count) || 0;
        const pointsValue = parseFloat(item.points) || 0;
        // Truncate the "points" value to exactly four decimal places
        const truncatedPoints = Math.floor(pointsValue * 10000) / 10000;
        acc[branch].points += truncatedPoints;

        const timeParts = item.time == "Unallotted" ? "00:00:00".split(":").map(Number) : item.time.split(":").map(Number);
        // acc[customer].time = parseInt(item.points) || [0, 0, 0];
        for (let i = 0; i < 3; i++) {
          acc[branch].time[i] += timeParts[i];
        }
      }
      if (branch !== "Unallotted") {
        acc[branch].count += parseInt(item.count) || 0;
        const pointsValue = parseFloat(item.points) || 0;
        // Truncate the "points" value to exactly four decimal places
        const truncatedPoints = Math.floor(pointsValue * 10000) / 10000;
        acc[branch].points += truncatedPoints;
        const timeParts = item.time == "Unallotted" ? "00:00:00".split(":").map(Number) : item.time.split(":").map(Number);

        for (let i = 0; i < 3; i++) {
          acc[branch].time[i] += timeParts[i];
        }
      }

      return acc;
    }, {});

    const formattedResult = Object.keys(resultteamdata).map((branch) => {
      const totalTimeInSeconds = resultteamdata[branch].time[0] * 3600 + resultteamdata[branch].time[1] * 60 + resultteamdata[branch].time[2];

      const newHours = Math.floor(totalTimeInSeconds / 3600);
      const newMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
      const newSeconds = totalTimeInSeconds % 60;

      return {
        branch,
        points: resultteamdata[branch].points,
        count: resultteamdata[branch].count,
        time: `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`,
      };
    });

    resultNewdata = formattedResult.filter((item) => !["NOT FOR US", "WEB-NFU", "OTHER-NFU"].includes(item.branch));

    resultoutput = resultNewdata;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!resultoutput) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    resultoutput,
    result,
    branches,
  });
});

// get All excel => /api/excel
exports.getAllExcelTeamReportCount = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultoutput, teams, resultNewdata;

  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    teams = await Team.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary", "not for us", "other-nfu", "other", "web-nfu"].includes(task.priority?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });

    const resultteamdata = result.reduce((acc, item) => {
      const team = item.team;

      if (!acc[team]) {
        acc[team] = {
          team,
          count: 0,
          points: 0,
          time: [0, 0, 0], // Initialize time as an array of numbers [hh, mm, ss]
        };
      }

      if (team === "Unallotted") {
        acc[team].count += parseInt(item.count) || 0;
        const pointsValue = parseFloat(item.points) || 0;
        // Truncate the "points" value to exactly four decimal places
        const truncatedPoints = Math.floor(pointsValue * 10000) / 10000;
        acc[team].points += truncatedPoints;

        const timeParts = item.time == "Unallotted" ? "00:00:00".split(":").map(Number) : item.time.split(":").map(Number);
        // acc[customer].time = parseInt(item.points) || [0, 0, 0];
        for (let i = 0; i < 3; i++) {
          acc[team].time[i] += timeParts[i];
        }
      }
      if (team !== "Unallotted") {
        acc[team].count += parseInt(item.count) || 0;
        const pointsValue = parseFloat(item.points) || 0;
        // Truncate the "points" value to exactly four decimal places
        const truncatedPoints = Math.floor(pointsValue * 10000) / 10000;
        acc[team].points += truncatedPoints;
        const timeParts = item.time == "Unallotted" ? "00:00:00".split(":").map(Number) : item.time.split(":").map(Number);

        for (let i = 0; i < 3; i++) {
          acc[team].time[i] += timeParts[i];
        }
      }

      return acc;
    }, {});

    const formattedResult = Object.keys(resultteamdata).map((team) => {
      const totalTimeInSeconds = resultteamdata[team].time[0] * 3600 + resultteamdata[team].time[1] * 60 + resultteamdata[team].time[2];

      const newHours = Math.floor(totalTimeInSeconds / 3600);
      const newMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
      const newSeconds = totalTimeInSeconds % 60;

      return {
        team,
        points: resultteamdata[team].points,
        count: resultteamdata[team].count,
        time: `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`,
      };
    });

    resultNewdata = formattedResult.filter((item) => !["NOT FOR US", "WEB-NFU", "OTHER-NFU"].includes(item.team));

    resultoutput = resultNewdata;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!resultoutput) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    resultoutput,
    result,
    teams,
  });
});

// get All excel => /api/excel
exports.getAllExcelRespersonReportCount = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultoutput, resultNewdata;

  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();

    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary", "not for us", "other-nfu", "other", "web-nfu"].includes(task.priority?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });

    const resultteamdata = result.reduce((acc, item) => {
      const resperson = item.resperson;

      if (!acc[resperson]) {
        acc[resperson] = {
          resperson,
          count: 0,
          points: 0,
          time: [0, 0, 0], // Initialize time as an array of numbers [hh, mm, ss]
        };
      }

      if (resperson === "Unallotted") {
        acc[resperson].count += parseInt(item.count) || 0;
        // acc[customer].points += parseInt(item.points) || 0;
        const pointsValue = parseFloat(item.points) || 0;
        // Truncate the "points" value to exactly four decimal places
        const truncatedPoints = Math.floor(pointsValue * 10000) / 10000;
        acc[resperson].points += truncatedPoints;

        const timeParts = item.time == "Unallotted" ? "00:00:00".split(":").map(Number) : item.time.split(":").map(Number);
        // acc[customer].time = parseInt(item.points) || [0, 0, 0];
        for (let i = 0; i < 3; i++) {
          acc[resperson].time[i] += timeParts[i];
        }
      }
      if (resperson !== "Unallotted") {
        acc[resperson].count += parseInt(item.count) || 0;
        const pointsValue = parseFloat(item.points) || 0;
        // Truncate the "points" value to exactly four decimal places
        const truncatedPoints = Math.floor(pointsValue * 10000) / 10000;
        acc[resperson].points += truncatedPoints;

        const timeParts = item.time === "Unallotted" ? "00:00:00".split(":").map(Number) : item.time.split(":").map(Number);
        for (let i = 0; i < 3; i++) {
          acc[resperson].time[i] += timeParts[i];
        }
      }

      return acc;
    }, {});

    const formattedResult = Object.keys(resultteamdata).map((resperson) => {
      const totalTimeInSeconds = resultteamdata[resperson].time[0] * 3600 + resultteamdata[resperson].time[1] * 60 + resultteamdata[resperson].time[2];

      const newHours = Math.floor(totalTimeInSeconds / 3600);
      const newMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
      const newSeconds = totalTimeInSeconds % 60;

      return {
        resperson,
        points: resultteamdata[resperson].points,
        count: resultteamdata[resperson].count,
        time: `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`,
      };
    });

    resultNewdata = formattedResult.filter((item) => !["NOT FOR US", "WEB-NFU", "OTHER-NFU"].includes(item.resperson));

    resultoutput = resultNewdata;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!resultoutput) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    resultoutput,
    result,
  });
});

// get All excel => /api/excel
exports.getAllExcelCategoryReportCount = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultoutput, categories;

  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    categories = await Category.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary", "not for us", "other-nfu", "other", "web-nfu"].includes(task.priority?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });

    const resultteamdata = result.reduce((acc, item) => {
      const category = item.category;

      if (!acc[category]) {
        acc[category] = {
          category,
          count: 0,
          points: 0,
          time: [0, 0, 0], // Initialize time as an array of numbers [hh, mm, ss]
        };
      }

      if (category === "Unallotted") {
        acc[category].count += parseInt(item.count) || 0;
        // acc[customer].points += parseInt(item.points) || 0;
        const pointsValue = parseFloat(item.points) || 0;
        // Truncate the "points" value to exactly four decimal places
        const truncatedPoints = Math.floor(pointsValue * 10000) / 10000;
        acc[category].points += truncatedPoints;

        const timeParts = item.time == "Unallotted" ? "00:00:00".split(":").map(Number) : item.time.split(":").map(Number);
        // acc[customer].time = parseInt(item.points) || [0, 0, 0];
        for (let i = 0; i < 3; i++) {
          acc[category].time[i] += timeParts[i];
        }
      }
      if (category !== "Unallotted") {
        acc[category].count += parseInt(item.count) || 0;
        const pointsValue = parseFloat(item.points) || 0;
        // Truncate the "points" value to exactly four decimal places
        const truncatedPoints = Math.floor(pointsValue * 10000) / 10000;
        acc[category].points += truncatedPoints;
        const timeParts = item.time === "Unallotted" ? "00:00:00".split(":").map(Number) : item.time.split(":").map(Number);

        for (let i = 0; i < 3; i++) {
          acc[category].time[i] += timeParts[i];
        }
      }

      return acc;
    }, {});

    const formattedResult = Object.keys(resultteamdata).map((category) => {
      const totalTimeInSeconds = resultteamdata[category].time[0] * 3600 + resultteamdata[category].time[1] * 60 + resultteamdata[category].time[2];

      const newHours = Math.floor(totalTimeInSeconds / 3600);
      const newMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
      const newSeconds = totalTimeInSeconds % 60;

      return {
        category,
        points: resultteamdata[category].points,
        count: resultteamdata[category].count,
        time: `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`,
      };
    });

    resultoutput = formattedResult;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!resultoutput) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    resultoutput,
    result,
    categories,
  });
});

// get All excel => /api/excel
exports.getAllExcelQueueReportCount = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultoutput, teams;

  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    teams = await Team.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary", "not for us", "other-nfu", "other", "web-nfu"].includes(task.priority?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });
    const resultteamdata = result.reduce((acc, item) => {
      const queue = item.queue;

      if (!acc[queue]) {
        acc[queue] = {
          queue,
          count: 0,
          points: 0,
          time: [0, 0, 0], // Initialize time as an array of numbers [hh, mm, ss]
        };
      }

      if (queue === "Unallotted") {
        acc[queue].count += parseInt(item.count) || 0;
        // acc[customer].points += parseInt(item.points) || 0;
        const pointsValue = parseFloat(item.points) || 0;
        // Truncate the "points" value to exactly four decimal places
        const truncatedPoints = Math.floor(pointsValue * 10000) / 10000;
        acc[queue].points += truncatedPoints;

        const timeParts = item.time == "Unallotted" ? "00:00:00".split(":").map(Number) : item.time.split(":").map(Number);
        // acc[customer].time = parseInt(item.points) || [0, 0, 0];
        for (let i = 0; i < 3; i++) {
          acc[queue].time[i] += timeParts[i];
        }
      }
      if (queue !== "Unallotted") {
        acc[queue].count += parseInt(item.count) || 0;
        const pointsValue = parseFloat(item.points) || 0;
        // Truncate the "points" value to exactly four decimal places
        const truncatedPoints = Math.floor(pointsValue * 10000) / 10000;
        acc[queue].points += truncatedPoints;
        const timeParts = item.time === "Unallotted" ? "00:00:00".split(":").map(Number) : item.time.split(":").map(Number);

        for (let i = 0; i < 3; i++) {
          acc[queue].time[i] += timeParts[i];
        }
      }

      return acc;
    }, {});

    const formattedResult = Object.keys(resultteamdata).map((queue) => {
      const totalTimeInSeconds = resultteamdata[queue].time[0] * 3600 + resultteamdata[queue].time[1] * 60 + resultteamdata[queue].time[2];

      const newHours = Math.floor(totalTimeInSeconds / 3600);
      const newMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
      const newSeconds = totalTimeInSeconds % 60;

      return {
        queue,
        points: resultteamdata[queue].points,
        count: resultteamdata[queue].count,
        time: `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`,
      };
    });

    resultoutput = formattedResult;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!resultoutput) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    resultoutput,
    result,
    teams,
  });
});

// get All excel => /api/excel
exports.getAllExcelCustomerReportCount = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdata, excelmapdataresperson, result, resultoutput;

  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary", "not for us", "other-nfu", "other", "web-nfu"].includes(task.priority?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });

    const resultteamdata = result.reduce((acc, item) => {
      const customer = item.customer;

      if (!acc[customer]) {
        acc[customer] = {
          customer,
          count: 0,
          points: 0,
          time: [0, 0, 0], // Initialize time as an array of numbers [hh, mm, ss]
        };
      }

      if (customer === "Unallotted") {
        acc[customer].count += parseInt(item.count) || 0;
        // acc[customer].points += parseInt(item.points) || 0;
        const pointsValue = parseFloat(item.points) || 0;
        // Truncate the "points" value to exactly four decimal places
        const truncatedPoints = Math.floor(pointsValue * 10000) / 10000;
        acc[customer].points += truncatedPoints;
        const timeParts = item.time === "Unallotted" ? "00:00:00".split(":").map(Number) : item.time.split(":").map(Number);
        // acc[customer].time = parseInt(item.points) || [0, 0, 0];
        for (let i = 0; i < 3; i++) {
          acc[customer].time[i] += timeParts[i];
        }
      }
      if (customer !== "Unallotted") {
        acc[customer].count += parseInt(item.count) || 0;
        const pointsValue = parseFloat(item.points) || 0;
        // Truncate the "points" value to exactly four decimal places
        const truncatedPoints = Math.floor(pointsValue * 10000) / 10000;
        acc[customer].points += truncatedPoints;
        const timeParts = item.time === "Unallotted" ? "00:00:00".split(":").map(Number) : item.time.split(":").map(Number);

        for (let i = 0; i < 3; i++) {
          acc[customer].time[i] += timeParts[i];
        }
      }

      return acc;
    }, {});

    const formattedResult = Object.keys(resultteamdata).map((customer) => {
      const totalTimeInSeconds = resultteamdata[customer].time[0] * 3600 + resultteamdata[customer].time[1] * 60 + resultteamdata[customer].time[2];

      const newHours = Math.floor(totalTimeInSeconds / 3600);
      const newMinutes = Math.floor((totalTimeInSeconds % 3600) / 60);
      const newSeconds = totalTimeInSeconds % 60;

      return {
        customer,
        points: resultteamdata[customer].points,
        count: resultteamdata[customer].count,
        time: `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`,
      };
    });

    resultoutput = formattedResult;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!resultoutput) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    resultoutput,
    result,
  });
});

//WORKORDER LIVE PAGE

//Secondary Individual All List
exports.getExcelWorkOrderLiveIndividual = catchAsyncErrors(async (req, res, next) => {
  let excelmapdata, excelmapdataresperson, result, resultteam, resultunit, resultbranch, resultallprimary, resultsecondary, resultsecondaryteam, resultsecondaryunit, resultsecondarybranch, resultallsecondary, resulttertiary, resulttertiaryteam, resulttertiaryunit, resulttertiarybranch, resultoveralldata, resultalltertiary, finalresult;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.resperson === req.body.companyname);

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    if (result.length === 0) {
      resultteam = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "primary");

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }

    if (result.length === 0 && resultteam.length === 0) {
      resultunit = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team != req.body.team && task.unit == req.body.unit && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "primary");

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }

    if (result.length === 0 && resultteam.length === 0 && resultunit.length === 0) {
      resultbranch = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team != req.body.team && task.unit != req.body.unit && task.branch == req.body.branch && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "primary");

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }

    if (result.length === 0 && resultteam.length === 0 && resultunit.length === 0 && resultbranch.length === 0) {
      resultallprimary = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "primary");

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }

    if (result.length === 0 && resultteam.length === 0 && resultunit.length === 0 && resultbranch.length === 0 && resultallprimary.length === 0) {
      resultsecondary = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;
            const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "secondary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.resperson === req.body.companyname);

            if (matchedItems && matchedItems.length > 0) {
              return matchedItems.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }
    if (result.length === 0 && resultteam.length === 0 && resultunit.length === 0 && resultbranch.length === 0 && resultallprimary.length === 0 && resultsecondary.length === 0) {
      resultsecondaryteam = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "secondary");

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }
    if (result.length === 0 && resultteam.length === 0 && resultunit.length === 0 && resultbranch.length === 0 && resultallprimary.length === 0 && resultsecondary.length === 0 && resultsecondaryteam.length === 0) {
      resultsecondaryunit = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team != req.body.team && task.unit == req.body.unit && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "secondary");

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }
    if (result.length === 0 && resultteam.length === 0 && resultunit.length === 0 && resultbranch.length === 0 && resultallprimary.length === 0 && resultsecondary.length === 0 && resultsecondaryteam.length === 0 && resultsecondaryunit.length === 0) {
      resultsecondarybranch = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team != req.body.team && task.unit != req.body.unit && task.branch == req.body.branch && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "secondary");

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }
    if (result.length === 0 && resultteam.length === 0 && resultunit.length === 0 && resultbranch.length === 0 && resultallprimary.length === 0 && resultsecondary.length === 0 && resultsecondaryteam.length === 0 && resultsecondaryunit.length === 0 && resultsecondarybranch.length === 0) {
      resultallsecondary = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "secondary");

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }
    if (result.length === 0 && resultteam.length === 0 && resultunit.length === 0 && resultbranch.length === 0 && resultallprimary.length === 0 && resultsecondary.length === 0 && resultsecondaryteam.length === 0 && resultsecondaryunit.length === 0 && resultsecondarybranch.length === 0 && resultallsecondary.length === 0) {
      resulttertiary = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;
            const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "tertiary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.resperson === req.body.companyname);

            if (matchedItems && matchedItems.length > 0) {
              return matchedItems.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }
    if (result.length === 0 && resultteam.length === 0 && resultunit.length === 0 && resultbranch.length === 0 && resultallprimary.length === 0 && resultsecondary.length === 0 && resultsecondaryteam.length === 0 && resultsecondaryunit.length === 0 && resultsecondarybranch.length === 0 && resultallsecondary.length === 0 && resulttertiary.length === 0) {
      resulttertiaryteam = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team == req.body.team && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "tertiary");

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }
    if (result.length === 0 && resultteam.length === 0 && resultunit.length === 0 && resultbranch.length === 0 && resultallprimary.length === 0 && resultsecondary.length === 0 && resultsecondaryteam.length === 0 && resultsecondaryunit.length === 0 && resultsecondarybranch.length === 0 && resultallsecondary.length === 0 && resulttertiary.length === 0 && resulttertiaryteam.length === 0) {
      resulttertiaryunit = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team != req.body.team && task.unit == req.body.unit && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "tertiary");

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }
    if (result.length === 0 && resultteam.length === 0 && resultunit.length === 0 && resultbranch.length === 0 && resultallprimary.length === 0 && resultsecondary.length === 0 && resultsecondaryteam.length === 0 && resultsecondaryunit.length === 0 && resultsecondarybranch.length === 0 && resultallsecondary.length === 0 && resulttertiary.length === 0 && resulttertiaryteam.length === 0 && resulttertiaryunit.length == 0) {
      resulttertiarybranch = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => task.resperson != req.body.companyname && task.team != req.body.team && task.unit != req.body.unit && task.branch == req.body.branch && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "tertiary");

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }
    if (result.length === 0 && resultteam.length === 0 && resultunit.length === 0 && resultbranch.length === 0 && resultallprimary.length === 0 && resultsecondary.length === 0 && resultsecondaryteam.length === 0 && resultsecondaryunit.length === 0 && resultsecondarybranch.length === 0 && resultallsecondary.length === 0 && resulttertiary.length === 0 && resulttertiaryteam.length === 0 && resulttertiaryunit.length == 0 && resulttertiarybranch.length === 0) {
      resultalltertiary = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()) && task.priority?.toLowerCase() === "tertiary");

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }
    if (result.length === 0 && resultteam.length === 0 && resultunit.length === 0 && resultbranch.length === 0 && resultallprimary.length === 0 && resultsecondary.length === 0 && resultsecondaryteam.length === 0 && resultsecondaryunit.length === 0 && resultsecondarybranch.length === 0 && resultallsecondary.length === 0 && resulttertiary.length === 0 && resulttertiaryteam.length === 0 && resulttertiaryunit.length == 0 && resulttertiarybranch.length === 0 && resultalltertiary.length === 0) {
      resultoveralldata = excels.flatMap((item) => {
        const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;

            const matchedItemsteam = todo?.filter((task) => !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

            if (matchedItemsteam && matchedItemsteam.length > 0) {
              return matchedItemsteam.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      });
    }

    finalresult =
      result.length > 0 ? result : resultteam.length > 0 ? resultteam : resultunit.length > 0 ? resultunit : resultbranch.length > 0 ? resultbranch : resultallprimary.length > 0 ? resultallprimary : resultsecondary.length > 0 ? resultsecondary : resultsecondaryteam.length > 0 ? resultsecondaryteam : resultsecondaryunit.length > 0 ? resultsecondaryunit : resultsecondarybranch.length > 0 ? resultsecondarybranch : resultallsecondary.length > 0 ? resultallsecondary : resulttertiary.length > 0 ? resulttertiary : resulttertiaryteam.length > 0 ? resulttertiaryteam : resulttertiaryunit.length > 0 ? resulttertiaryunit : resulttertiarybranch.length > 0 ? resulttertiarybranch : resultalltertiary.length > 0 ? resultalltertiary : resultoveralldata;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!finalresult) {
  //     return next(new ErrorHandler('No data found!', 404));
  // }
  return res.status(200).json({
    result,
    resultteam,
    finalresult,
  });
});

//secondary and tertiary pages consolidated
//Secondary Work Order Filter
exports.getAllSecondaryWokOrderFilter = catchAsyncErrors(async (req, res, next) => {
  let excel, totLength,
    excelmapdata, totalProjects, excelmapdataresperson, result, results, excels, resulted, resultSecond;

  let { page, pageSize, value } = req.body;
  const skip = (page - 1) * pageSize; // Calculate the number of items to skip
  const limit = pageSize; // The number of items to take
  try {
    excel = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();
    excelmapdata = await Excelmapdata.find().lean();
    excelmapdataresperson = await Excelmaprespersondata.find().lean();
    excels = (excel?.exceldata).filter((item) => item.customer?.toLowerCase() !== "customer" && item.process?.toLowerCase() !== "process");
    // Your existing code here
    results = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "secondary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });

    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers" && !["page", 'pageSize', 'value'].includes(key)) {
        const value = req.body[key];
        if (value !== "") {
          query[key] = value.toString();
        }
      }
    });

    resultSecond = results?.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    })?.slice(skip, skip + limit);


    function isEmpty(obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    }
    result = results?.slice(skip, skip + limit);
    resulted = (["cleared"]?.includes(value) || isEmpty(query)) ? result : resultSecond
    totLength = (["cleared"]?.includes(value) || isEmpty(query)) ? results?.length : results?.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    })?.length

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    totalProjects: totLength,
    currentPage: page,
    result,
    resulted,
    totalPages: Math.ceil(totLength / pageSize),
  });
});

//Without Secondary Work Order
exports.getAllExcelWithoutSecondaryConsolidated = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdataresperson, uniqueIds, matchedData, excelmapPerson, uniqueObjects, filteredAnswer, result, excels, resultSecond, matchedItems, answer, matchingMappedItemperson;
  try {
    excelmapdataresperson = await Excelmaprespersondata.find();

    excelmapPerson = excelmapdataresperson.filter((item) => {
      if (item.todo && item.todo.some((todoItem) => todoItem.priority.toLowerCase() === "secondary" && todoItem.unit.toLowerCase() != "unallotted" && todoItem.team.toLowerCase() != "unallotted" && todoItem.resperson.toLowerCase() != "unallotted")) {
        // If any todo item has priority "Tertiary," exclude this object
        return false;
      }
      return true;
    });

    matchedData = excelmapPerson.filter((item) => {
      if (["not for us", "other-nfu", "other", "web-nfu"].includes(item.category?.toLowerCase())) {
        return false;
      }
      return true;
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!excelmapdataresperson) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    excelmapPerson,
    matchedData,
  });
});

exports.getAllExcelWithoutTertiaryConsolidated = catchAsyncErrors(async (req, res, next) => {
  let excel, excelmapdataresperson, uniqueIds, matchedData, excelmapPerson, uniqueObjects, filteredAnswer, result, excels, resultSecond, matchedItems, answer, matchingMappedItemperson;
  try {
    excelmapdataresperson = await Excelmaprespersondata.find();
    excelmapPerson = excelmapdataresperson.filter((item) => {
      if (item.todo && item.todo.some((todoItem) => todoItem.priority.toLowerCase() === "tertiary" && todoItem.unit.toLowerCase() != "unallotted" && todoItem.team.toLowerCase() != "unallotted" && todoItem.resperson.toLowerCase() != "unallotted")) {
        // If any todo item has priority "Tertiary," exclude this object
        return false;
      }
      return true;
    });

    matchedData = excelmapPerson.filter((item) => {
      if (["not for us", "other-nfu", "other", "web-nfu"].includes(item.category?.toLowerCase())) {
        return false;
      }
      return true;
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!excelmapdataresperson) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    excelmapPerson,
    matchedData,
  });
});

// Tertiary Work Order Filter
exports.getAllTertiaryWokOrderFilter = catchAsyncErrors(async (req, res, next) => {
  let excel, totLength,
    excelmapdata, totalProjects, excelmapdataresperson, result, results, excels, resulted, resultSecond;

  let { page, pageSize, value } = req.body;
  const skip = (page - 1) * pageSize; // Calculate the number of items to skip
  const limit = pageSize; // The number of items to take
  try {
    excel = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();
    excelmapdata = await Excelmapdata.find().lean();
    excelmapdataresperson = await Excelmaprespersondata.find().lean();
    excels = (excel?.exceldata).filter((item) => item.customer?.toLowerCase() !== "customer" && item.process?.toLowerCase() !== "process");
    // Your existing code here
    results = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "tertiary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });



    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers" && !["page", 'pageSize', 'value'].includes(key)) {
        const value = req.body[key];
        if (value !== "") {
          query[key] = value.toString();
        }
      }
    });
    resultSecond = results?.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    })?.slice(skip, skip + limit);


    function isEmpty(obj) {
      return Object.keys(obj).length === 0 && obj.constructor === Object;
    }
    result = results?.slice(skip, skip + limit);
    resulted = (["cleared"]?.includes(value) || isEmpty(query)) ? result : resultSecond
    totLength = (["cleared"]?.includes(value) || isEmpty(query)) ? results?.length : results?.filter((item) => {
      for (const key in query) {
        if (item[key] !== query[key]) {
          return false;
        }
      }
      return true;
    })?.length

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    totalProjects: totLength,
    currentPage: page,
    result,
    resulted,
    totalPages: Math.ceil(totLength / pageSize),
  });
});

//UNALLOTED QUEUE LIST FETCH ---------------------------

// get All excel => /api/excel
exports.getAllExcelUnallotedQueueList = catchAsyncErrors(async (req, res, next) => {
  let latestExcelEntry, excels, totalProjects, filteredData, excelmapdata, finalResult, resultData;

  let { page, pageSize } = req.body;
  const skip = (page - 1) * pageSize; // Calculate the number of items to skip
  const limit = pageSize; // The number of items to take

  try {
    excelmapdata = await Excelmapdata.find().lean();
    latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    excels = latestExcelEntry?.exceldata?.filter((item) => {
      return item.customer?.toLowerCase() !== "customer" && item.process?.toLowerCase() !== "process";
    });

    filteredData = excels?.filter((value, index, self) => self.findIndex((v) => v.customer === value.customer && v.process === value.process) === index);
    resultData = filteredData?.filter((item2) => !excelmapdata.some((item1) => item1.customer === item2.customer && item1.process === item2.process));

    finalResult = resultData?.slice(skip, skip + limit)?.map((item, i) => ({
      // ...item,
      _id: item._id,
      customer: item.customer,
      priority: item.priority,
      process: item.process,
      hyperlink: item.hyperlink,
      project: item.project,
      vendor: item.vendor,
      time: item.time,
      count: item.count,
      tat: item.tat,
      created: item.created,
      category: "",
      subcategory: "",
      queue: "",
      id: i,
    }));

    totalProjects = resultData?.length;



  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    finalResult,
    totalProjects,
    currentPage: page,
    totalPages: Math.ceil(totalProjects / pageSize),
  });
});
exports.getAllExcelUnallotedQueueListOverall = catchAsyncErrors(async (req, res, next) => {
  let latestExcelEntry, excels, totalProjects, filteredData, excelmapdata, finalResult, resultData;
  try {
    excelmapdata = await Excelmapdata.find();
    latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    excels = latestExcelEntry?.exceldata?.filter((item) => {
      return item.customer?.toLowerCase() !== "customer" && item.process?.toLowerCase() !== "process";
    });

    filteredData = excels?.filter((value, index, self) => self.findIndex((v) => v.customer === value.customer && v.process === value.process) === index);
    resultData = filteredData?.filter((item2) => !excelmapdata.some((item1) => item1.customer === item2.customer && item1.process === item2.process));

    finalResult = resultData?.map((item, i) => ({
      // ...item,
      _id: item._id,
      customer: item.customer,
      priority: item.priority,
      process: item.process,
      hyperlink: item.hyperlink,
      project: item.project,
      vendor: item.vendor,
      time: item.time,
      count: item.count,
      tat: item.tat,
      created: item.created,
      category: "",
      subcategory: "",
      queue: "",
      id: i,
    }));

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    finalResult,

  });
});

// get All excel => /api/excel
exports.getAllExcelUnallotedRespersonList = catchAsyncErrors(async (req, res, next) => {
  let latestExcelEntry, excelmapdataresperson, filteredData, excelsmapdata, finalResult, resultData;
  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();

    filteredData = excelsmapdata?.filter((value, index, self) => self.findIndex((v) => v.customer === value.customer && v.process === value.process) === index);

    resultData = filteredData?.filter((item2) => !excelmapdataresperson.some((item1) => item1.customer === item2.customer && item1.process === item2.process));

    finalResult = resultData?.map((item, i) => ({
      // ...item,
      _id: item._id,
      customer: item.customer,
      priority: item.priority,
      process: item.process,
      hyperlink: item.hyperlink,
      project: item.project,
      vendor: item.vendor,
      category: item.category,
      subcategory: item.subcategory,
      queue: item.queue,
      time: item.time,
      points: item.points,
      tat: item.tat,
      created: item.created,
      todo: [],
      errorMessage: "",
      id: i,
    }));
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    finalResult,
  });
});

//Secondary Work Order - Hierarchy based Filter
exports.getAllSecondaryHierarchyList = catchAsyncErrors(async (req, res, next) => {
  let excel,
    resultArray,
    user,
    result1,
    ans1D,
    i = 1,
    result2,
    result3,
    result4,
    result5,
    result6,
    result7,
    result8,
    dataCheck,
    userFilter,
    excelmapdata,
    excelmapdataresperson,
    result,
    hierarchyFilter,
    excels,
    answerDef,
    hierarchyFinal,
    hierarchy,
    hierarchyDefault,
    hierarchyDefList,
    resultAccessFilter,
    branch,
    hierarchySecond,
    overallMyallList,
    hierarchyMap,
    resulted,
    resultedTeam,
    myallTotalNames;

  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    }); // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "secondary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });

    // Accordig to sector and list filter process
    hierarchyFilter = await Hirerarchi.find({ level: req.body.sector });
    userFilter = hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyDefList = await Hirerarchi.find();
    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = req.body.sector === "all" ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup) : hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;
    //Default Loading of List
    answerDef = hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyFinal = req.body.sector === "all" ? (answerDef.length > 0 ? [].concat(...answerDef) : []) : hierarchyFilter.length > 0 ? [].concat(...userFilter) : [];

    hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

    //solo
    ans1D = req.body.sector === "all" ? (answerDef.length > 0 ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)) : []) : hierarchyFilter.length > 0 ? hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];
    result1 =
      ans1D.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = ans1D.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];

    resulted = result1;

    //team
    let branches = [];
    hierarchySecond = await Hirerarchi.find();

    const subBranch =
      hierarchySecond.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel = hierarchySecond.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name))) : [];

    result2 =
      answerFilterExcel.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...subBranch);

    const ans =
      subBranch.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel2 = subBranch.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name))) : [];

    result3 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...ans);

    const loop3 =
      ans.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => ans.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel3 = ans.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => ans.includes(name))) : [];

    result4 =
      answerFilterExcel3.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel3?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop3);

    const loop4 =
      loop3.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop3.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : [];
    const answerFilterExcel4 = loop3.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop3.includes(name))) : [];
    result5 =
      answerFilterExcel4.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel4?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop4);

    const loop5 =
      loop4.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop4.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel5 = loop4.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop4.includes(name))) : [];
    result6 =
      answerFilterExcel5.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel5?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop5);

    resultedTeam = [...result2, ...result3, ...result4, ...result5, ...result6];
    //overall Teams List
    myallTotalNames = [...hierarchyMap, ...branches];
    overallMyallList = [...resulted, ...resultedTeam];
    resultAccessFilter = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : overallMyallList;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    ans1D,
    result1,
    resulted,
    resultedTeam,
    branch,
    hierarchy,
    overallMyallList,
    resultAccessFilter,
    hierarchyFilter,
    user,
    dataCheck,
    userFilter,
    resultArray,
  });
});

// Tertiary Work Order Filter
exports.getAllTertiaryHierarchyFilter = catchAsyncErrors(async (req, res, next) => {
  let excel,
    resultArray,
    user,
    result1,
    ans1D,
    i = 1,
    result2,
    result3,
    result4,
    result5,
    result6,
    result7,
    result8,
    dataCheck,
    userFilter,
    excelmapdata,
    excelmapdataresperson,
    result,
    hierarchyFilter,
    excels,
    answerDef,
    hierarchyFinal,
    hierarchy,
    hierarchyDefault,
    hierarchyDefList,
    resultAccessFilter,
    branch,
    hierarchySecond,
    overallMyallList,
    hierarchyMap,
    resulted,
    resultedTeam,
    myallTotalNames;

  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    }); // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "tertiary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });

    // Accordig to sector and list filter process
    hierarchyFilter = await Hirerarchi.find({ level: req.body.sector });
    userFilter = hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyDefList = await Hirerarchi.find();
    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = req.body.sector === "all" ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup) : hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;
    //Default Loading of List
    answerDef = hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyFinal = req.body.sector === "all" ? (answerDef.length > 0 ? [].concat(...answerDef) : []) : hierarchyFilter.length > 0 ? [].concat(...userFilter) : [];

    hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

    //solo
    ans1D = req.body.sector === "all" ? (answerDef.length > 0 ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)) : []) : hierarchyFilter.length > 0 ? hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];
    result1 =
      ans1D.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = ans1D.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];

    resulted = result1;

    //team
    let branches = [];
    hierarchySecond = await Hirerarchi.find();

    const subBranch =
      hierarchySecond.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel = hierarchySecond.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name))) : [];

    result2 =
      answerFilterExcel.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...subBranch);

    const ans =
      subBranch.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel2 = subBranch.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name))) : [];

    result3 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...ans);

    const loop3 =
      ans.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => ans.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel3 = ans.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => ans.includes(name))) : [];

    result4 =
      answerFilterExcel3.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel3?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop3);

    const loop4 =
      loop3.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop3.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : [];
    const answerFilterExcel4 = loop3.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop3.includes(name))) : [];
    result5 =
      answerFilterExcel4.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel4?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop4);

    const loop5 =
      loop4.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop4.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel5 = loop4.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop4.includes(name))) : [];
    result6 =
      answerFilterExcel5.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel5?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop5);

    resultedTeam = [...result2, ...result3, ...result4, ...result5, ...result6];
    //overall Teams List
    myallTotalNames = [...hierarchyMap, ...branches];
    overallMyallList = [...resulted, ...resultedTeam];
    resultAccessFilter = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : overallMyallList;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    ans1D,
    result1,
    resulted,
    resultedTeam,
    branch,
    hierarchy,
    overallMyallList,
    resultAccessFilter,
    hierarchyFilter,
    user,
    dataCheck,
    userFilter,
    resultArray,
  });
});

//OTHER WORK ORDER HIERARCHY
exports.getAllOtherHierarchyWorkOrder = catchAsyncErrors(async (req, res, next) => {
  let excel,
    resultArray,
    user,
    result1,
    ans1D,
    i = 1,
    result2,
    result3,
    result4,
    result5,
    result6,
    result7,
    result8,
    dataCheck,
    userFilter,
    excelmapdata,
    excelmapdataresperson,
    result,
    hierarchyFilter,
    excels,
    answerDef,
    hierarchyFinal,
    hierarchy,
    hierarchyDefault,
    hierarchyDefList,
    resultAccessFilter,
    branch,
    hierarchySecond,
    overallMyallList,
    hierarchyMap,
    resulted,
    resultedTeam,
    myallTotalNames;
  try {
    // excel = await Excel.find();
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')

    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.branch?.toLowerCase() === "other" && ["other"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    // Accordig to sector and list filter process
    hierarchyFilter = await Hirerarchi.find({ level: req.body.sector });
    userFilter = hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyDefList = await Hirerarchi.find();
    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = req.body.sector === "all" ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup) : hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;

    //Default Loading of List
    answerDef = hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyFinal = req.body.sector === "all" ? (answerDef.length > 0 ? [].concat(...answerDef) : []) : hierarchyFilter.length > 0 ? [].concat(...userFilter) : [];

    hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

    //solo
    ans1D = req.body.sector === "all" ? (answerDef.length > 0 ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)) : []) : hierarchyFilter.length > 0 ? hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];
    result1 =
      ans1D.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = ans1D.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];

    resulted = result1;

    //team
    let branches = [];
    hierarchySecond = await Hirerarchi.find();

    const subBranch =
      hierarchySecond.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel = hierarchySecond.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name))) : [];

    result2 =
      answerFilterExcel.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...subBranch);

    const ans =
      subBranch.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel2 = subBranch.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name))) : [];

    result3 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...ans);

    const loop3 =
      ans.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => ans.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel3 = ans.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => ans.includes(name))) : [];

    result4 =
      answerFilterExcel3.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel3?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop3);

    const loop4 =
      loop3.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop3.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : [];
    const answerFilterExcel4 = loop3.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop3.includes(name))) : [];
    result5 =
      answerFilterExcel4.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel4?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop4);

    const loop5 =
      loop4.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop4.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel5 = loop4.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop4.includes(name))) : [];
    result6 =
      answerFilterExcel5.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel5?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop5);

    resultedTeam = [...result2, ...result3, ...result4, ...result5, ...result6];
    //overall Teams List
    myallTotalNames = [...hierarchyMap, ...branches];
    overallMyallList = [...resulted, ...resultedTeam];
    resultAccessFilter = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : overallMyallList;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    ans1D,
    result1,
    resulted,
    resultedTeam,
    branch,
    hierarchy,
    overallMyallList,
    resultAccessFilter,
    hierarchyFilter,
    user,
    dataCheck,
    userFilter,
    resultArray,
  });
});

//CONSOLIDATED WORK ORDER HIERARCHY(PRI/SEC/TER)
exports.getAllConsolidateHierarchyPrimSecTer = catchAsyncErrors(async (req, res, next) => {
  let excel,
    resultArray,
    user,
    result1,
    ans1D,
    i = 1,
    result2,
    result3,
    result4,
    result5,
    result6,
    result7,
    result8,
    dataCheck,
    userFilter,
    excelmapdata,
    excelmapdataresperson,
    result,
    hierarchyFilter,
    excels,
    answerDef,
    hierarchyFinal,
    hierarchy,
    hierarchyDefault,
    hierarchyDefList,
    resultAccessFilter,
    branch,
    hierarchySecond,
    overallMyallList,
    hierarchyMap,
    resulted,
    resultedTeam,
    myallTotalNames;
  try {
    // excel = await Excel.find();
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    // Accordig to sector and list filter process
    hierarchyFilter = await Hirerarchi.find({ level: req.body.sector });
    userFilter = hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyDefList = await Hirerarchi.find();
    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = req.body.sector === "all" ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup) : hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;
    //Default Loading of List
    answerDef = hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyFinal = req.body.sector === "all" ? (answerDef.length > 0 ? [].concat(...answerDef) : []) : hierarchyFilter.length > 0 ? [].concat(...userFilter) : [];

    hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

    //solo
    ans1D = req.body.sector === "all" ? (answerDef.length > 0 ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)) : []) : hierarchyFilter.length > 0 ? hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];
    result1 =
      ans1D.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = ans1D.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];

    resulted = result1;

    //team
    let branches = [];
    hierarchySecond = await Hirerarchi.find();

    const subBranch =
      hierarchySecond.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel = hierarchySecond.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name))) : [];

    result2 =
      answerFilterExcel.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...subBranch);

    const ans =
      subBranch.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel2 = subBranch.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name))) : [];

    result3 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...ans);

    const loop3 =
      ans.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => ans.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel3 = ans.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => ans.includes(name))) : [];

    result4 =
      answerFilterExcel3.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel3?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop3);

    const loop4 =
      loop3.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop3.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : [];
    const answerFilterExcel4 = loop3.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop3.includes(name))) : [];
    result5 =
      answerFilterExcel4.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel4?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop4);

    const loop5 =
      loop4.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop4.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel5 = loop4.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop4.includes(name))) : [];
    result6 =
      answerFilterExcel5.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel5?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop5);

    resultedTeam = [...result2, ...result3, ...result4, ...result5, ...result6];
    //overall Teams List
    myallTotalNames = [...hierarchyMap, ...branches];
    overallMyallList = [...resulted, ...resultedTeam];
    resultAccessFilter = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : overallMyallList;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    ans1D,
    result1,
    resulted,
    resultedTeam,
    branch,
    hierarchy,
    overallMyallList,
    resultAccessFilter,
    hierarchyFilter,
    user,
    dataCheck,
    userFilter,
    resultArray,
  });
});

//CONSOLIDATED WORK ORDER ALL HIERARCHY
exports.getAllHierarchyConsolidatedWorkOrderAll = catchAsyncErrors(async (req, res, next) => {
  let excel,
    resultArray,
    user,
    result1,
    ans1D,
    i = 1,
    result2,
    result3,
    result4,
    result5,
    result6,
    result7,
    result8,
    dataCheck,
    userFilter,
    excelmapdata,
    excelmapdataresperson,
    result,
    hierarchyFilter,
    excels,
    answerDef,
    hierarchyFinal,
    hierarchy,
    hierarchyDefault,
    hierarchyDefList,
    resultAccessFilter,
    branch,
    hierarchySecond,
    overallMyallList,
    hierarchyMap,
    resulted,
    resultedTeam,
    myallTotalNames;
  try {
    // excel = await Excel.find();
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase()) || ["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
        }
      }

      // If no match is found, return an empty array
      return [];
    });

    // Accordig to sector and list filter process
    hierarchyFilter = await Hirerarchi.find({ level: req.body.sector });
    userFilter = hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyDefList = await Hirerarchi.find();
    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = req.body.sector === "all" ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup) : hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;

    //Default Loading of List
    answerDef = hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyFinal = req.body.sector === "all" ? (answerDef.length > 0 ? [].concat(...answerDef) : []) : hierarchyFilter.length > 0 ? [].concat(...userFilter) : [];

    hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

    //solo
    ans1D = req.body.sector === "all" ? (answerDef.length > 0 ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)) : []) : hierarchyFilter.length > 0 ? hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];
    result1 =
      ans1D.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = ans1D.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];

    resulted = result1;

    //team
    let branches = [];
    hierarchySecond = await Hirerarchi.find();

    const subBranch =
      hierarchySecond.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel = hierarchySecond.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name))) : [];

    result2 =
      answerFilterExcel.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...subBranch);

    const ans =
      subBranch.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel2 = subBranch.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name))) : [];

    result3 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...ans);

    const loop3 =
      ans.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => ans.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel3 = ans.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => ans.includes(name))) : [];

    result4 =
      answerFilterExcel3.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel3?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop3);

    const loop4 =
      loop3.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop3.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : [];
    const answerFilterExcel4 = loop3.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop3.includes(name))) : [];
    result5 =
      answerFilterExcel4.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel4?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop4);

    const loop5 =
      loop4.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop4.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel5 = loop4.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop4.includes(name))) : [];
    result6 =
      answerFilterExcel5.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel5?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop5);

    resultedTeam = [...result2, ...result3, ...result4, ...result5, ...result6];
    //overall Teams List
    myallTotalNames = [...hierarchyMap, ...branches];
    overallMyallList = [...resulted, ...resultedTeam];
    resultAccessFilter = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : overallMyallList;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    ans1D,
    result1,
    resulted,
    resultedTeam,
    branch,
    hierarchy,
    overallMyallList,
    resultAccessFilter,
    hierarchyFilter,
    user,
    dataCheck,
    userFilter,
    resultArray,
  });
});

exports.getAllHierarchyPrimaryworkorderovertat = catchAsyncErrors(async (req, res, next) => {
  let excel,
    resultArray,
    user,
    result1,
    ans1D,
    i = 1,
    result2,
    result3,
    result4,
    result5,
    result6,
    result7,
    result8,
    dataCheck,
    userFilter,
    excelmapdata,
    excelmapdataresperson,
    result,
    hierarchyFilter,
    excels,
    answerDef,
    hierarchyFinal,
    hierarchy,
    hierarchyDefault,
    hierarchyDefList,
    resultAccessFilter,
    branch,
    hierarchySecond,
    overallMyallList,
    hierarchyMap,
    resulted,
    resultedTeam,
    myallTotalNames;
  try {
    // excel = await Excel.find();
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";

      if (item.tat?.includes(wordToCheck)) {
        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;
            const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

            if (matchedItems && matchedItems.length > 0) {
              return matchedItems.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      }
      return [];
    });

    // Accordig to sector and list filter process
    hierarchyFilter = await Hirerarchi.find({ level: req.body.sector });
    userFilter = hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyDefList = await Hirerarchi.find();
    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = req.body.sector === "all" ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup) : hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;

    //Default Loading of List
    answerDef = hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyFinal = req.body.sector === "all" ? (answerDef.length > 0 ? [].concat(...answerDef) : []) : hierarchyFilter.length > 0 ? [].concat(...userFilter) : [];

    hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

    //solo
    ans1D = req.body.sector === "all" ? (answerDef.length > 0 ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)) : []) : hierarchyFilter.length > 0 ? hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];
    result1 =
      ans1D.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = ans1D.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];

    resulted = result1;

    //team
    let branches = [];
    hierarchySecond = await Hirerarchi.find();

    const subBranch =
      hierarchySecond.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel = hierarchySecond.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name))) : [];

    result2 =
      answerFilterExcel.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...subBranch);

    const ans =
      subBranch.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel2 = subBranch.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name))) : [];

    result3 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...ans);

    const loop3 =
      ans.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => ans.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel3 = ans.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => ans.includes(name))) : [];

    result4 =
      answerFilterExcel3.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel3?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop3);

    const loop4 =
      loop3.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop3.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : [];
    const answerFilterExcel4 = loop3.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop3.includes(name))) : [];
    result5 =
      answerFilterExcel4.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel4?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop4);

    const loop5 =
      loop4.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop4.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel5 = loop4.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop4.includes(name))) : [];
    result6 =
      answerFilterExcel5.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel5?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop5);

    resultedTeam = [...result2, ...result3, ...result4, ...result5, ...result6];
    //overall Teams List
    myallTotalNames = [...hierarchyMap, ...branches];
    overallMyallList = [...resulted, ...resultedTeam];
    resultAccessFilter = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : overallMyallList;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    ans1D,
    result1,
    resulted,
    resultedTeam,
    branch,
    hierarchy,
    overallMyallList,
    resultAccessFilter,
    hierarchyFilter,
    user,
    dataCheck,
    userFilter,
    resultArray,
  });
});

exports.getAllHierarchyPrimaryworkorderneartat = catchAsyncErrors(async (req, res, next) => {
  let excel,
    resultArray,
    user,
    result1,
    ans1D,
    i = 1,
    result2,
    result3,
    result4,
    result5,
    result6,
    result7,
    result8,
    dataCheck,
    userFilter,
    excelmapdata,
    excelmapdataresperson,
    result,
    hierarchyFilter,
    excels,
    answerDef,
    hierarchyFinal,
    hierarchy,
    hierarchyDefault,
    hierarchyDefList,
    resultAccessFilter,
    branch,
    hierarchySecond,
    overallMyallList,
    hierarchyMap,
    resulted,
    resultedTeam,
    myallTotalNames;
  try {
    // excel = await Excel.find();
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "in";

      if (!item.tat?.includes("ago")) {
        if (item.tat?.includes("in an hour") || item.tat?.includes("in 2 hours") || item.tat?.includes("in 3 hours") || item.tat?.includes("in 4 hours") || item.tat?.includes("in 5 hours") || item.tat?.includes("in 6 hours") || item.tat?.includes("minute")) {
          if (matchingMappedItemcate) {
            const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
            const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
            const resultTimeInSeconds = totalTimeInSeconds * item.count;
            const newHours = Math.floor(resultTimeInSeconds / 3600);
            const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
            const newSeconds = resultTimeInSeconds % 60;
            const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

            if (matchingMappedItemperson) {
              const { todo } = matchingMappedItemperson;
              const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

              if (matchedItems && matchedItems.length > 0) {
                return matchedItems.map((priorityItem) => ({
                  project: item.project,
                  vendor: item.vendor,
                  date: item.date,
                  time: item.time,
                  customer: item.customer,
                  priority: item.priority,
                  process: item.process,
                  hyperlink: item.hyperlink,
                  count: item.count,
                  tat: item.tat,
                  created: item.created,
                  category: matchingMappedItemcate.category,
                  subcategory: matchingMappedItemcate.subcategory,
                  queue: matchingMappedItemcate.queue,
                  time: resulttime,
                  org: matchingMappedItemcate.points,
                  orgtime: matchingMappedItemcate.time,
                  points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                  branch: priorityItem.branch,
                  unit: priorityItem.unit,
                  team: priorityItem.team,
                  resperson: priorityItem.resperson,
                  prioritystatus: priorityItem.priority,
                }));
              }
              return [];
            }
            return [];
          }
          return [];
        }
        return [];
      }
      return [];
    });

    // Accordig to sector and list filter process
    hierarchyFilter = await Hirerarchi.find({ level: req.body.sector });
    userFilter = hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyDefList = await Hirerarchi.find();
    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = req.body.sector === "all" ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup) : hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;

    //Default Loading of List
    answerDef = hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyFinal = req.body.sector === "all" ? (answerDef.length > 0 ? [].concat(...answerDef) : []) : hierarchyFilter.length > 0 ? [].concat(...userFilter) : [];

    hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

    //solo
    ans1D = req.body.sector === "all" ? (answerDef.length > 0 ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)) : []) : hierarchyFilter.length > 0 ? hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];
    result1 =
      ans1D.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = ans1D.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];

    resulted = result1;

    //team
    let branches = [];
    hierarchySecond = await Hirerarchi.find();

    const subBranch =
      hierarchySecond.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel = hierarchySecond.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name))) : [];

    result2 =
      answerFilterExcel.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...subBranch);

    const ans =
      subBranch.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel2 = subBranch.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name))) : [];

    result3 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...ans);

    const loop3 =
      ans.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => ans.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel3 = ans.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => ans.includes(name))) : [];

    result4 =
      answerFilterExcel3.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel3?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop3);

    const loop4 =
      loop3.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop3.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : [];
    const answerFilterExcel4 = loop3.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop3.includes(name))) : [];
    result5 =
      answerFilterExcel4.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel4?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop4);

    const loop5 =
      loop4.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop4.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel5 = loop4.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop4.includes(name))) : [];
    result6 =
      answerFilterExcel5.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel5?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop5);

    resultedTeam = [...result2, ...result3, ...result4, ...result5, ...result6];
    //overall Teams List
    myallTotalNames = [...hierarchyMap, ...branches];
    overallMyallList = [...resulted, ...resultedTeam];
    resultAccessFilter = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : overallMyallList;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    ans1D,
    result1,
    resulted,
    resultedTeam,
    branch,
    hierarchy,
    overallMyallList,
    resultAccessFilter,
    hierarchyFilter,
    user,
    dataCheck,
    userFilter,
    resultArray,
  });
});

exports.getAllHierarchyPrimaryworkorderall = catchAsyncErrors(async (req, res, next) => {
  let excel,
    resultArray,
    user,
    result1,
    ans1D,
    i = 1,
    result2,
    result3,
    result4,
    result5,
    result6,
    result7,
    result8,
    dataCheck,
    userFilter,
    excelmapdata,
    excelmapdataresperson,
    result,
    hierarchyFilter,
    excels,
    answerDef,
    hierarchyFinal,
    hierarchy,
    hierarchyDefault,
    hierarchyDefList,
    resultAccessFilter,
    branch,
    hierarchySecond,
    overallMyallList,
    hierarchyMap,
    resulted,
    resultedTeam,
    myallTotalNames;
  try {
    // excel = await Excel.find();
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });

    // Accordig to sector and list filter process
    hierarchyFilter = await Hirerarchi.find({ level: req.body.sector });
    userFilter = hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyDefList = await Hirerarchi.find();
    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = req.body.sector === "all" ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup) : hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;

    //Default Loading of List
    answerDef = hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.employeename);

    hierarchyFinal = req.body.sector === "all" ? (answerDef.length > 0 ? [].concat(...answerDef) : []) : hierarchyFilter.length > 0 ? [].concat(...userFilter) : [];

    hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

    //solo
    ans1D = req.body.sector === "all" ? (answerDef.length > 0 ? hierarchyDefList.filter((data) => data.supervisorchoose.includes(req.body.username)) : []) : hierarchyFilter.length > 0 ? hierarchyFilter.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];
    result1 =
      ans1D.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = ans1D.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];

    resulted = result1;

    //team
    let branches = [];
    hierarchySecond = await Hirerarchi.find();

    const subBranch =
      hierarchySecond.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel = hierarchySecond.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => hierarchyMap.includes(name))) : [];

    result2 =
      answerFilterExcel.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...subBranch);

    const ans =
      subBranch.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel2 = subBranch.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => subBranch.includes(name))) : [];

    result3 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...ans);

    const loop3 =
      ans.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => ans.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";

    const answerFilterExcel3 = ans.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => ans.includes(name))) : [];

    result4 =
      answerFilterExcel3.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel3?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop3);

    const loop4 =
      loop3.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop3.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : [];
    const answerFilterExcel4 = loop3.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop3.includes(name))) : [];
    result5 =
      answerFilterExcel4.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel4?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop4);

    const loop5 =
      loop4.length > 0
        ? hierarchySecond
          .filter((item) => item.supervisorchoose.some((name) => loop4.includes(name)))
          .map((item) => item.employeename)
          .flat()
        : "";
    const answerFilterExcel5 = loop4.length > 0 ? hierarchySecond.filter((item) => item.supervisorchoose.some((name) => loop4.includes(name))) : [];
    result6 =
      answerFilterExcel5.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel5?.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: req.body.sector + "-" + matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    branches.push(...loop5);

    resultedTeam = [...result2, ...result3, ...result4, ...result5, ...result6];
    //overall Teams List
    myallTotalNames = [...hierarchyMap, ...branches];
    overallMyallList = [...resulted, ...resultedTeam];
    resultAccessFilter = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : overallMyallList;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    ans1D,
    result1,
    resulted,
    resultedTeam,
    branch,
    hierarchy,
    overallMyallList,
    resultAccessFilter,
    hierarchyFilter,
    user,
    dataCheck,
    userFilter,
    resultArray,
  });
});

//Secondary Work Order - Hierarchy based Filter
exports.getAllSecondaryHierarchyDefault = catchAsyncErrors(async (req, res, next) => {
  let excel, user, result1, userFilter, excelmapdata, excelmapdataresperson, result, hierarchyFilter, excels, answerDef, hierarchyFinal, hierarchy, hierarchyDefault, hierarchyDefList, resultAccessFilter, branch, hierarchySecond, overallMyallList, hierarchyMap, resulted, resultedTeam, myallTotalNames;

  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "secondary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });

    // Accordig to sector and list filter process
    hierarchy = await Hirerarchi.find({ level: "Primary" });

    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;

    hierarchyMap =
      hierarchy.length > 0
        ? hierarchy
          .filter((data) => data.supervisorchoose.includes(req.body.username))
          .map((data) => data.employeename)
          .flat()
        : [];

    const answerFilterExcel2 = hierarchy.length > 0 ? hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];

    result1 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: matchingItem2.control + "-" + "Primary" };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    //solo
    resulted = result1;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resulted,
  });
});

// Tertiary Work Order Filter
exports.getAllTertiaryHierarchyDefault = catchAsyncErrors(async (req, res, next) => {
  let excel, user, result1, userFilter, excelmapdata, excelmapdataresperson, result, hierarchyFilter, excels, answerDef, hierarchyFinal, hierarchy, hierarchyDefault, hierarchyDefList, resultAccessFilter, branch, hierarchySecond, overallMyallList, hierarchyMap, resulted, resultedTeam, myallTotalNames;

  try {
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    }); // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "tertiary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });

    // Accordig to sector and list filter process
    hierarchy = await Hirerarchi.find({ level: "Primary" });

    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;

    hierarchyMap =
      hierarchy.length > 0
        ? hierarchy
          .filter((data) => data.supervisorchoose.includes(req.body.username))
          .map((data) => data.employeename)
          .flat()
        : [];

    const answerFilterExcel2 = hierarchy.length > 0 ? hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];

    result1 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: matchingItem2.control + "-" + "Primary" };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    //solo
    resulted = result1;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resulted,
  });
});

//OTHER WORK ORDER HIERARCHY
exports.getAllOtherHierarchyWorkOrderDefault = catchAsyncErrors(async (req, res, next) => {
  let excel, user, result1, userFilter, excelmapdata, excelmapdataresperson, result, hierarchyFilter, excels, answerDef, hierarchyFinal, hierarchy, hierarchyDefault, hierarchyDefList, resultAccessFilter, branch, hierarchySecond, overallMyallList, hierarchyMap, resulted, resultedTeam, myallTotalNames;
  try {
    // excel = await Excel.find();
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')

    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.branch?.toLowerCase() === "other" && ["other"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });

    // Accordig to sector and list filter process
    hierarchy = await Hirerarchi.find({ level: "Primary" });

    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;

    hierarchyMap =
      hierarchy.length > 0
        ? hierarchy
          .filter((data) => data.supervisorchoose.includes(req.body.username))
          .map((data) => data.employeename)
          .flat()
        : [];

    const answerFilterExcel2 = hierarchy.length > 0 ? hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];

    result1 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: matchingItem2.control + "-" + "Primary" };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    //solo
    resulted = result1;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resulted,
  });
});

//CONSOLIDATED WORK ORDER HIERARCHY(PRI/SEC/TER)
exports.getAllConsolidateHierarchyPrimSecTerDefault = catchAsyncErrors(async (req, res, next) => {
  let excel, user, result1, userFilter, excelmapdata, excelmapdataresperson, result, hierarchyFilter, excels, answerDef, hierarchyFinal, hierarchy, hierarchyDefault, hierarchyDefList, resultAccessFilter, branch, hierarchySecond, overallMyallList, hierarchyMap, resulted, resultedTeam, myallTotalNames;
  try {
    // excel = await Excel.find();
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        }
        return [];
      }
      return [];
    });
    // Accordig to sector and list filter process
    hierarchy = await Hirerarchi.find({ level: "Primary" });

    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;

    hierarchyMap =
      hierarchy.length > 0
        ? hierarchy
          .filter((data) => data.supervisorchoose.includes(req.body.username))
          .map((data) => data.employeename)
          .flat()
        : [];

    const answerFilterExcel2 = hierarchy.length > 0 ? hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];

    result1 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: matchingItem2.control + "-" + "Primary" };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    //solo
    resulted = result1;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resulted,
  });
});

//CONSOLIDATED WORK ORDER ALL HIERARCHY
exports.getAllHierarchyConsolidatedWorkOrderAllDefault = catchAsyncErrors(async (req, res, next) => {
  let excel, user, result1, userFilter, excelmapdata, excelmapdataresperson, result, hierarchyFilter, excels, answerDef, hierarchyFinal, hierarchy, hierarchyDefault, hierarchyDefList, resultAccessFilter, branch, hierarchySecond, overallMyallList, hierarchyMap, resulted, resultedTeam, myallTotalNames;
  try {
    // excel = await Excel.find();
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });

    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => ["primary", "secondary", "tertiary"].includes(task.priority?.toLowerCase()) || ["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
        }
      }

      // If no match is found, return an empty array
      return [];
    });

    // Accordig to sector and list filter process
    hierarchy = await Hirerarchi.find({ level: "Primary" });

    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;

    hierarchyMap =
      hierarchy.length > 0
        ? hierarchy
          .filter((data) => data.supervisorchoose.includes(req.body.username))
          .map((data) => data.employeename)
          .flat()
        : [];

    const answerFilterExcel2 = hierarchy.length > 0 ? hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];

    result1 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: matchingItem2.control + "-" + "Primary" };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    //solo
    resulted = result1;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resulted,
  });
});

exports.getAllHierarchyPrimaryworkorderovertatDefault = catchAsyncErrors(async (req, res, next) => {
  let excel, user, result1, userFilter, excelmapdata, excelmapdataresperson, result, hierarchyFilter, excels, answerDef, hierarchyFinal, hierarchy, hierarchyDefault, hierarchyDefList, resultAccessFilter, branch, hierarchySecond, overallMyallList, hierarchyMap, resulted, resultedTeam, myallTotalNames;
  try {
    // excel = await Excel.find();
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "ago";

      if (item.tat?.includes(wordToCheck)) {
        if (matchingMappedItemcate) {
          const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
          const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
          const resultTimeInSeconds = totalTimeInSeconds * item.count;
          const newHours = Math.floor(resultTimeInSeconds / 3600);
          const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
          const newSeconds = resultTimeInSeconds % 60;
          const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

          if (matchingMappedItemperson) {
            const { todo } = matchingMappedItemperson;
            const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

            if (matchedItems && matchedItems.length > 0) {
              return matchedItems.map((priorityItem) => ({
                project: item.project,
                vendor: item.vendor,
                date: item.date,
                time: item.time,
                customer: item.customer,
                priority: item.priority,
                process: item.process,
                hyperlink: item.hyperlink,
                count: item.count,
                tat: item.tat,
                created: item.created,
                category: matchingMappedItemcate.category,
                subcategory: matchingMappedItemcate.subcategory,
                queue: matchingMappedItemcate.queue,
                time: resulttime,
                org: matchingMappedItemcate.points,
                orgtime: matchingMappedItemcate.time,
                points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                branch: priorityItem.branch,
                unit: priorityItem.unit,
                team: priorityItem.team,
                resperson: priorityItem.resperson,
                prioritystatus: priorityItem.priority,
              }));
            }
            return [];
          }
          return [];
        }
        return [];
      }
      return [];
    });

    // Accordig to sector and list filter process
    hierarchy = await Hirerarchi.find({ level: "Primary" });

    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;

    hierarchyMap =
      hierarchy.length > 0
        ? hierarchy
          .filter((data) => data.supervisorchoose.includes(req.body.username))
          .map((data) => data.employeename)
          .flat()
        : [];

    const answerFilterExcel2 = hierarchy.length > 0 ? hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];

    result1 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: matchingItem2.control + "-" + "Primary" };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    //solo
    resulted = result1;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resulted,
  });
});

exports.getAllHierarchyPrimaryworkorderneartatDefault = catchAsyncErrors(async (req, res, next) => {
  let excel, user, result1, userFilter, excelmapdata, excelmapdataresperson, result, hierarchyFilter, excels, answerDef, hierarchyFinal, hierarchy, hierarchyDefault, hierarchyDefList, resultAccessFilter, branch, hierarchySecond, overallMyallList, hierarchyMap, resulted, resultedTeam, myallTotalNames;
  try {
    // excel = await Excel.find();
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);
      const wordToCheck = "in";

      if (!item.tat?.includes("ago")) {
        if (item.tat?.includes("in an hour") || item.tat?.includes("in 2 hours") || item.tat?.includes("in 3 hours") || item.tat?.includes("in 4 hours") || item.tat?.includes("in 5 hours") || item.tat?.includes("in 6 hours") || item.tat?.includes("minute")) {
          if (matchingMappedItemcate) {
            const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
            const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
            const resultTimeInSeconds = totalTimeInSeconds * item.count;
            const newHours = Math.floor(resultTimeInSeconds / 3600);
            const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
            const newSeconds = resultTimeInSeconds % 60;
            const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

            if (matchingMappedItemperson) {
              const { todo } = matchingMappedItemperson;
              const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

              if (matchedItems && matchedItems.length > 0) {
                return matchedItems.map((priorityItem) => ({
                  project: item.project,
                  vendor: item.vendor,
                  date: item.date,
                  time: item.time,
                  customer: item.customer,
                  priority: item.priority,
                  process: item.process,
                  hyperlink: item.hyperlink,
                  count: item.count,
                  tat: item.tat,
                  created: item.created,
                  category: matchingMappedItemcate.category,
                  subcategory: matchingMappedItemcate.subcategory,
                  queue: matchingMappedItemcate.queue,
                  time: resulttime,
                  org: matchingMappedItemcate.points,
                  orgtime: matchingMappedItemcate.time,
                  points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
                  branch: priorityItem.branch,
                  unit: priorityItem.unit,
                  team: priorityItem.team,
                  resperson: priorityItem.resperson,
                  prioritystatus: priorityItem.priority,
                }));
              }
              return [];
            }
            return [];
          }
          return [];
        }
        return [];
      }
      return [];
    });

    // Accordig to sector and list filter process
    hierarchy = await Hirerarchi.find({ level: "Primary" });

    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;

    hierarchyMap =
      hierarchy.length > 0
        ? hierarchy
          .filter((data) => data.supervisorchoose.includes(req.body.username))
          .map((data) => data.employeename)
          .flat()
        : [];

    const answerFilterExcel2 = hierarchy.length > 0 ? hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];

    result1 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: matchingItem2.control + "-" + "Primary" };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    //solo
    resulted = result1;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resulted,
  });
});

exports.getAllHierarchyPrimaryworkorderallDefault = catchAsyncErrors(async (req, res, next) => {
  let excel, user, result1, userFilter, excelmapdata, excelmapdataresperson, result, hierarchyFilter, excels, answerDef, hierarchyFinal, hierarchy, hierarchyDefault, hierarchyDefList, resultAccessFilter, branch, hierarchySecond, overallMyallList, hierarchyMap, resulted, resultedTeam, myallTotalNames;
  try {
    // excel = await Excel.find();
    excelmapdata = await Excelmapdata.find();
    excelmapdataresperson = await Excelmaprespersondata.find();
    // excels = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')
    const latestExcelEntry = await Excel.findOne()
      .sort({ createdAt: -1 }) // Sorting in descending order to get the latest entry
      .exec();

    if (!latestExcelEntry) {
      return res.status(404).json({ message: "No Excel data found" });
    }

    const excels = latestExcelEntry.exceldata.filter((item) => {
      return item.customer.toLowerCase() !== "customer" && item.process.toLowerCase() !== "process";
    });
    // Your existing code here
    result = excels.flatMap((item) => {
      const matchingMappedItemcate = excelmapdata.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      const matchingMappedItemperson = excelmapdataresperson.find((mappedItem) => mappedItem.process === item.process && mappedItem.customer === item.customer);

      if (matchingMappedItemcate) {
        const [hours, minutes, seconds] = matchingMappedItemcate.time ? matchingMappedItemcate.time.split(":").map(Number) : String("00:00:00").split(":").map(Number);
        const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
        const resultTimeInSeconds = totalTimeInSeconds * item.count;
        const newHours = Math.floor(resultTimeInSeconds / 3600);
        const newMinutes = Math.floor((resultTimeInSeconds % 3600) / 60);
        const newSeconds = resultTimeInSeconds % 60;
        const resulttime = `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}:${String(newSeconds).padStart(2, "0")}`;

        if (matchingMappedItemperson) {
          const { todo } = matchingMappedItemperson;
          const matchedItems = todo?.filter((task) => task.priority?.toLowerCase() === "primary" && !["not for us", "other-nfu", "other", "web-nfu"].includes(task.branch?.toLowerCase()));

          if (matchedItems && matchedItems.length > 0) {
            return matchedItems.map((priorityItem) => ({
              project: item.project,
              vendor: item.vendor,
              date: item.date,
              time: item.time,
              customer: item.customer,
              priority: item.priority,
              process: item.process,
              hyperlink: item.hyperlink,
              count: item.count,
              tat: item.tat,
              created: item.created,
              category: matchingMappedItemcate.category,
              subcategory: matchingMappedItemcate.subcategory,
              queue: matchingMappedItemcate.queue,
              time: resulttime,
              org: matchingMappedItemcate.points,
              orgtime: matchingMappedItemcate.time,
              points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
              branch: priorityItem.branch,
              unit: priorityItem.unit,
              team: priorityItem.team,
              resperson: priorityItem.resperson,
              prioritystatus: priorityItem.priority,
            }));
          }
          return [];
        } else {
          return {
            project: item.project,
            vendor: item.vendor,
            date: item.date,
            time: item.time,
            customer: item.customer,
            priority: item.priority,
            process: item.process,
            hyperlink: item.hyperlink,
            count: item.count,
            tat: item.tat,
            created: item.created,
            category: matchingMappedItemcate.category,
            subcategory: matchingMappedItemcate.subcategory,
            queue: matchingMappedItemcate.queue,
            time: resulttime,
            orgtime: matchingMappedItemcate.time,
            points: (matchingMappedItemcate.points ? Number(item.count) * matchingMappedItemcate.points : 0).toFixed(4),
            org: matchingMappedItemcate.points,
            branch: "Unallotted",
            unit: "Unallotted",
            team: "Unallotted",
            resperson: "Unallotted",
            prioritystatus: "Unallotted",
          }; // If there's no matching item in mappeddata, return the original item
        }
      } else {
        return {
          project: item.project,
          vendor: item.vendor,
          date: item.date,
          time: item.time,
          customer: item.customer,
          priority: item.priority,
          process: item.process,
          hyperlink: item.hyperlink,
          count: item.count,
          tat: item.tat,
          created: item.created,
          category: "Unallotted",
          subcategory: "Unallotted",
          queue: "Unallotted",
          time: "Unallotted",
          points: "Unallotted",
          branch: "Unallotted",
          unit: "Unallotted",
          team: "Unallotted",
          resperson: "Unallotted",
          prioritystatus: "Unallotted",
        }; // If there's no matching item in mappeddata, return the original item
      }
    });
    // Accordig to sector and list filter process
    hierarchy = await Hirerarchi.find({ level: "Primary" });

    user = await User.find({ companyname: req.body.username });
    const userFilt = user.length > 0 && user[0].designation;
    const desiGroup = await Designation.find();
    let HierarchyFilt = hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)).map((data) => data.designationgroup);
    const DesifFilter = desiGroup.filter((data) => HierarchyFilt.includes(data.group));
    const desigName = DesifFilter.length > 0 && DesifFilter[0].name;
    const SameDesigUser = HierarchyFilt.includes("All") ? true : userFilt === desigName;

    hierarchyMap =
      hierarchy.length > 0
        ? hierarchy
          .filter((data) => data.supervisorchoose.includes(req.body.username))
          .map((data) => data.employeename)
          .flat()
        : [];

    const answerFilterExcel2 = hierarchy.length > 0 ? hierarchy.filter((data) => data.supervisorchoose.includes(req.body.username)) : [];

    result1 =
      answerFilterExcel2.length > 0
        ? result
          .map((item1) => {
            const matchingItem2 = answerFilterExcel2.find((item2) => item2.employeename.includes(item1.resperson));
            if (matchingItem2) {
              // If a match is found, inject the control property into the corresponding item in an1
              return { ...item1, level: matchingItem2.control };
            }
          })
          .filter((item) => item !== undefined)
        : [];
    //solo
    resulted = result1;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({
    result,
    resulted,
  });
});
// Create new excel => /api/excel/new
exports.addExcel = catchAsyncErrors(async (req, res, next) => {
  let aproduct = await Excel.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

//secondary and tertiary pages consolidated end
// get Single excel => /api/excel/:id
exports.getSingleExcel = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sexcel = await Excel.findById(id);

  if (!sexcel) {
    return next(new ErrorHandler("Excel not found!", 404));
  }
  return res.status(200).json({
    sexcel,
  });
});
// update excel by id => /api/excel/:id
exports.updateExcel = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uexcel = await Excel.findByIdAndUpdate(id, req.body);

  if (!uexcel) {
    return next(new ErrorHandler("Excel not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});
// delete excel by id => /api/excel/:id
exports.deleteExcel = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dexcel = await Excel.findByIdAndRemove(id);

  if (!dexcel) {
    return next(new ErrorHandler("Excel not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});


//dashboard


exports.getAllCandidateCountHome = catchAsyncErrors(async (req, res, next) => {
  let candidates;
  try {

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // console.log(sevenDaysAgo, "sevenDaysAgo")

    // const branchFilter = req.body.assignbranch.map((branchObj) => ({
    //   branch: branchObj.branch,
    //   company: branchObj.company,
    //   // unit: branchObj.unit
    // }));

    // let Query = { $or: branchFilter };


    let filterQuery = {
      overallstatus: "Applied", createdAt: { $gte: sevenDaysAgo },
      // ...Query
    }

    candidates = await Addcandidate.find(filterQuery, { fullname: 1, role: 1, gender: 1, time: 1, city: 1, uploadedimage: 1 })
      .sort({ createdAt: -1 }).limit(7) // Sorting in descending order to get the latest entry
      .exec();
    // console.log(candidates, "candidateshome")
  } catch (err) {
    console.log(err, "alalhome")
    console.log(err.message);
  }

  return res.status(200).json({
    candidates,
  });
});

exports.getAllCandidateUpcomingInterview = catchAsyncErrors(async (req, res, next) => {
  let candidates, filteredschedule, filteredschedulemeeting;
  try {

    // let fromdate, todate;
    // const selectedFilter = req.body.selectedfilter;

    // const formatDate = (date) => date.toISOString().split("T")[0];

    let fromdate, todate;
    const today = new Date();
    const selectedFilter = req.body.selectedfilter;

    // Utility function to format date as 'YYYY-MM-DD'
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    };



    switch (selectedFilter) {


      case "Last Month":
        fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
        todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
        break;
      case "Last Week":
        const startOfLastWeek = new Date(today);
        startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
        const endOfLastWeek = new Date(startOfLastWeek);
        endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
        fromdate = formatDate(startOfLastWeek);
        todate = formatDate(endOfLastWeek);
        break;
      case "Yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        fromdate = todate = formatDate(yesterday);
        break;

      case "Today":
        fromdate = todate = formatDate(today);
        break;
      case "Tomorrow":
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        fromdate = todate = formatDate(tomorrow);
        break;
      case "This Week":
        const startOfThisWeek = new Date(today);
        startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
        const endOfThisWeek = new Date(startOfThisWeek);
        endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
        fromdate = formatDate(startOfThisWeek);
        todate = formatDate(endOfThisWeek);
        break;
      case "This Month":
        fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
        todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));


        break;

      default:
        fromdate = "";
    }
    const branchFilter = req.body.assignbranch.map((branchObj) => ({
      "interviewrounds.branch": branchObj.branch,
      "interviewrounds.company": branchObj.company,
    }));
    let Query = { $or: branchFilter };
    candidates = await Addcandidate.aggregate([
      {
        $match: {
          ...Query,

          ...(fromdate && todate ? { "interviewrounds.date": { $gte: fromdate, $lte: todate } } :
            fromdate ? { "interviewrounds.date": { $eq: fromdate } } :
              {}
          ),
          "interviewrounds.roundstatus": "Interview Scheduled"


        }
      },
      {
        $sort: { "interviewrounds.roundCreatedAt": -1 } // Sorting in descending order to get the latest entry
      },
      {
        $project: {
          fullname: 1,
          role: 1,
          gender: 1,
          city: 1,
          uploadedimage: 1,
          interviewrounds: {

            $map: {
              input: "$interviewrounds", // Iterate over the interviewrounds array
              as: "round",
              in: {
                date: "$$round.date",
                timeRange: {
                  $concat: [
                    "$$round.time",
                    " to ",
                    {
                      $let: {
                        vars: {
                          startTime: { $substr: ["$$round.time", 0, 2] },
                          startMinutes: { $substr: ["$$round.time", 3, 2] },
                          durationHours: { $substr: ["$$round.duration", 0, 2] },
                          durationMinutes: { $substr: ["$$round.duration", 3, 2] }
                        },
                        in: {
                          $concat: [
                            // Calculate new hour
                            {
                              $toString: {
                                $mod: [
                                  {
                                    $add: [
                                      { $toInt: "$$startTime" },
                                      { $toInt: "$$durationHours" }
                                    ]
                                  },
                                  24
                                ]
                              }
                            },
                            ":",
                            // Calculate new minutes with padding for 2 digits
                            {
                              $cond: {
                                if: {
                                  $lt: [
                                    {
                                      $mod: [
                                        {
                                          $add: [
                                            { $toInt: "$$startMinutes" },
                                            { $toInt: "$$durationMinutes" }
                                          ]
                                        },
                                        60
                                      ]
                                    },
                                    10
                                  ]
                                },
                                then: {
                                  $concat: [
                                    "0",
                                    {
                                      $toString: {
                                        $mod: [
                                          {
                                            $add: [
                                              { $toInt: "$$startMinutes" },
                                              { $toInt: "$$durationMinutes" }
                                            ]
                                          },
                                          60
                                        ]
                                      }
                                    }
                                  ]
                                },
                                else: {
                                  $toString: {
                                    $mod: [
                                      {
                                        $add: [
                                          { $toInt: "$$startMinutes" },
                                          { $toInt: "$$durationMinutes" }
                                        ]
                                      },
                                      60
                                    ]
                                  }
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  ]
                },
                participants: "$$round.participants",
                duration: "$$round.duration"
              }
            }
          }
        }
      },

      {
        $limit: 6 // Limiting the results to 6 entries
      }
    ]);

    // console.log(candidates[0], "candidateshomeupcoming")
  } catch (err) {
    console.log(err.message);
  }

  return res.status(200).json({
    candidates,
  });
});
