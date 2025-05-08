const Penaltywaivermaster = require("../../../model/modules/penalty/penaltywaivermaster");
const ProcessQueueName = require("../../../model/modules/production/ProcessQueueNameModel");
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const moment = require("moment");

// get All Penaltywaivermaster => /api/Penaltywaivermaster
exports.getAllPenaltywaivermaster = catchAsyncErrors(async (req, res, next) => {
  let penaltywaivermasters;
  try {
    penaltywaivermasters = await Penaltywaivermaster.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!penaltywaivermasters) {
    return next(new ErrorHandler("Penaltywaivermaster not found!", 404));
  }
  return res.status(200).json({
    // count: products.length,
    penaltywaivermasters,
  });
});

// Create new Penaltywaivermaster=> /api/Penaltywaivermaster/new
exports.addPenaltywaivermaster = catchAsyncErrors(async (req, res, next) => {
  let aPenaltywaivermaster = await Penaltywaivermaster.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Penaltywaivermaster => /api/Penaltywaivermaster/:id
exports.getSinglePenaltywaivermaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let spenaltywaivermaster = await Penaltywaivermaster.findById(id);

  if (!spenaltywaivermaster) {
    return next(new ErrorHandler("Penaltywaivermaster not found!", 404));
  }
  return res.status(200).json({
    spenaltywaivermaster,
  });
});

// update Penaltywaivermaster by id => /api/Penaltywaivermaster/:id
exports.updatePenaltywaivermaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let upenaltywaivermaster = await Penaltywaivermaster.findByIdAndUpdate(id, req.body);
  if (!upenaltywaivermaster) {
    return next(new ErrorHandler("Penaltywaivermaster not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Penaltywaivermaster by id => /api/Penaltywaivermaster/:id
exports.deletePenaltywaivermaster = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dpenaltywaivermaster = await Penaltywaivermaster.findByIdAndRemove(id);

  if (!dpenaltywaivermaster) {
    return next(new ErrorHandler("Penaltywaivermaster not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAllPenaltywaivermasterForClientErrorRestrictions = catchAsyncErrors(async (req, res, next) => {
    const { fromdate, todate, department, employeename, company, branch, process } = req.body;
    let result, penaltywaivermasters, processqueuenames;
    try {
        result = await Penaltywaivermaster.find({ department: { $eq: department }, fromdate: { $lte: fromdate }, todate: { $gte: todate } }, {
            department: 1, year: 1, monthname: 1, fromdate: 1, todate: 1, company: 1, branch: 1,
            processcode: 1, process: 1, employee: 1, clienterrocountupto: 1, clienterroramount: 1, clienterrorpercentage: 1, waiverallowupto: 1, waiveramountupto: 1, waiverpercentageupto: 1, validitydays: 1,
        });
        processqueuenames = await ProcessQueueName.find({ company: { $eq: company }, branch: { $eq: branch }, name: { $eq: process } }, { company: 1, branch: 1, name: 1, code: 1 });

        let processNames = processqueuenames?.find((data) => data.company === company && data.branch === branch && data.name === process);

        const employeeMatch = result.filter((data) => data.employee === employeename);
        const processMatch = result.filter((data) => data.processcode === processNames.code);
        const branchMatch = result.filter((data) => data.branch === branch);
        const allEmpMatch = result.filter((data) => data.employee === 'All' && data.processcode === 'All' && data.branch === 'All');
        //const allProcessMatch = result.filter((data) => data.processcode === 'All');
        //const allBranMatch = result.filter((data) => data.branch === 'All');

        penaltywaivermasters =
            employeeMatch.length > 0 ? employeeMatch :
                processMatch.length > 0 ? processMatch :
                    branchMatch.length > 0 ? branchMatch :
                        allEmpMatch
                        //.length > 0 ? allEmpMatch :
                        //    allProcessMatch.length > 0 ? allProcessMatch :
                        //        allBranMatch;
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltywaivermasters) {
        return next(new ErrorHandler("Penaltywaivermaster not found!", 404));
    }
    return res.status(200).json({ penaltywaivermasters, });
});

exports.getAllPenaltywaivermasterForClientErrorRestrictionsApprovalPage = catchAsyncErrors(async (req, res, next) => {
    const { fromdate, todate, department, employeename, company, branch, rowformattedDate } = req.body;
    let users, result, penaltywaivermasters, processqueuenames;
    let query = {
        companyname: { $in: employeename },
        enquirystatus: {
            $nin: ["Enquiry Purpose"],
        },
    }
    try {
        users = await User.find(query, { processlog: 1 }).lean();
        result = await Penaltywaivermaster.find({ department: { $eq: department }, fromdate: { $lte: fromdate }, todate: { $gte: todate } }, {
            department: 1, year: 1, monthname: 1, fromdate: 1, todate: 1, company: 1, branch: 1,
            processcode: 1, process: 1, employee: 1, clienterrocountupto: 1, clienterroramount: 1, clienterrorpercentage: 1, waiverallowupto: 1, waiveramountupto: 1, waiverpercentageupto: 1, validitydays: 1,
        }).lean();

        let filteredProcess = users?.map((item) => {
            const uniqueEntriesProcess = {};
            item.processlog?.forEach(entry => {
                const entryDate = new Date(entry.date); // Parse the startdate into a date object
                const key = entry.date;
                if (!(key in uniqueEntriesProcess)) {
                    uniqueEntriesProcess[key] = entry;
                }
            });

            const uniqueProcessLog = Object.values(uniqueEntriesProcess);

            // Find the relevant log entry for the given date     
            const relevantProcessLogEntry = uniqueProcessLog
                .filter(log => log.date <= rowformattedDate)
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

            return {
                process: (relevantProcessLogEntry && relevantProcessLogEntry.process),
            }
        })
        const userProcess = filteredProcess.map(user => user.process);

        processqueuenames = await ProcessQueueName.find({ company: { $eq: company }, branch: { $eq: branch }, name: { $in: userProcess } }, { company: 1, branch: 1, name: 1, code: 1 }).lean();
        let processNames = processqueuenames?.find((data) => data.company === company && data.branch === branch && userProcess.includes(data.name));

        const employeeMatch = result.filter((data) => data.employee === employeename);
        const processMatch = result.filter((data) => data.processcode === processNames.code);
        const branchMatch = result.filter((data) => data.branch === branch);
        const allEmpMatch = result.filter((data) => data.employee === 'All' && data.processcode === 'All' && data.branch === 'All');
        //const allProcessMatch = result.filter((data) => data.processcode === 'All');
        //const allBranMatch = result.filter((data) => data.branch === 'All');

        penaltywaivermasters =
            employeeMatch.length > 0 ? employeeMatch :
                processMatch.length > 0 ? processMatch :
                    branchMatch.length > 0 ? branchMatch :
                        allEmpMatch
                        //.length > 0 ? allEmpMatch :
                        //    allProcessMatch.length > 0 ? allProcessMatch :
                        //        allBranMatch;
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltywaivermasters) {
        return next(new ErrorHandler("Penaltywaivermaster not found!", 404));
    }
    return res.status(200).json({ penaltywaivermasters, });
});

exports.getAllPenaltywaivermasterForPenaltyOverAllRestrictions = catchAsyncErrors(async (req, res, next) => {
    const { fromdate, todate, department, employeename, branch, processcode } = req.body;
    let result, penaltywaivermasters;
    try {
        result = await Penaltywaivermaster.find({ department: { $eq: department }, fromdate: { $lte: fromdate }, todate: { $gte: todate } }, {
            department: 1, year: 1, monthname: 1, fromdate: 1, todate: 1, company: 1, branch: 1,
            processcode: 1, process: 1, employee: 1, clienterrocountupto: 1, clienterroramount: 1, clienterrorpercentage: 1, waiverallowupto: 1, waiveramountupto: 1, waiverpercentageupto: 1, validitydays: 1,
        });

        const employeeMatch = result.filter((data) => data.employee === employeename);
        const processMatch = result.filter((data) => data.processcode === processcode);
        const branchMatch = result.filter((data) => data.branch === branch);
        const allEmpMatch = result.filter((data) => data.employee === 'All' && data.processcode === 'All' && data.branch === 'All');
        //const allProcessMatch = result.filter((data) => data.processcode === 'All');
        //const allBranMatch = result.filter((data) => data.branch === 'All');

        penaltywaivermasters =
            employeeMatch.length > 0 ? employeeMatch :
                processMatch.length > 0 ? processMatch :
                    branchMatch.length > 0 ? branchMatch :
                        allEmpMatch
                        //.length > 0 ? allEmpMatch :
                        //    allProcessMatch.length > 0 ? allProcessMatch :
                        //        allBranMatch;
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltywaivermasters) {
        return next(new ErrorHandler("Penaltywaivermaster not found!", 404));
    }
    return res.status(200).json({ penaltywaivermasters, });
});