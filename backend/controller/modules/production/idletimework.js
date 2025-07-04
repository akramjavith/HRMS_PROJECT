const Idletimework = require("../../../model/modules/production/idletimework");
const User = require("../../../model/login/auth");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const moment = require("moment");
const { ObjectId } = require("mongodb");

// get All Idletimework => /api/Idletimework
exports.getAllIdletimework = catchAsyncErrors(async (req, res, next) => {
  let idletimeworks;
  try {
    idletimeworks = await Idletimework.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!idletimeworks) {
    return next(new ErrorHandler("Managecategory not found!", 404));
  }
  return res.status(200).json({
    idletimeworks,
  });
});

exports.getAllIdletimeworkemployee = catchAsyncErrors(async (req, res, next) => {
  let idletimeworks;
  try {
    const { empname } = req.body;
    idletimeworks = await Idletimework.find({ "addedby.name": empname }, {});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    idletimeworks,
  });
});

// Create new Idletimework=> /api/Idletimework/new
exports.addIdletimework = catchAsyncErrors(async (req, res, next) => {
  let aIdletimework = await Idletimework.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Idletimework => /api/Idletimework/:id
exports.getSingleIdletimework = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sidletimework = await Idletimework.findById(id);

  if (!sidletimework) {
    return next(new ErrorHandler("Idletimework not found!", 404));
  }
  return res.status(200).json({
    sidletimework,
  });
});

// update Idletimework by id => /api/Idletimework/:id
exports.updateIdletimework = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uidletimework = await Idletimework.findByIdAndUpdate(id, req.body);

  if (!uidletimework) {
    return next(new ErrorHandler("Idletimework not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Idletimework by id => /api/Idletimework/:id
exports.deleteIdletimework = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let didletimework = await Idletimework.findByIdAndRemove(id);

  if (!didletimework) {
    return next(new ErrorHandler("Idletimework Name not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAllIdletimeworkCheckListReport = catchAsyncErrors(async (req, res, next) => {
  let idletimeworks;
  try {
    const { fromdate, todate } = req.body;
    let query = {
    $or:[
      { completed:  {$exists:false}},
      {  completed: {$nin:["Completed"]}}
    ],
      date: { $gte: fromdate, $lte: todate },
    };
console.log(query,"qaru")
    idletimeworks = await Idletimework.find(query, {});
    console.log(idletimeworks.length,"qaru")
  } catch (err) {
    console.log(err,"list")
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    idletimeworks,
  });
});

exports.getAllIdletimeworkCheckListReportApproveReject = catchAsyncErrors(async (req, res, next) => {
  let idletimeworks;
  try {
    const { fromdate, todate } = req.body;
    let query = {
    //   status: { $in: ["Approve", "Reject"] },
  data:{$exists:true,$ne:[]},
      date: { $gte: fromdate, $lte: todate },
    };

  

    idletimeworks = await Idletimework.find(query, {});
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    idletimeworks,
  });
});

exports.getAllIdletimeworkCheckListReportViewWaitForApprove = catchAsyncErrors(async (req, res, next) => {
  let idletimeworks;
  try {
    const { appliedfor, employee, company, branch, unit, team, process, date,id } = req.body;
    console.log(req.body, "body");
    let userQuery = {
      enquirystatus: {
        $nin: ["Enquiry Purpose"],
      },
      //  companyname: 'JOSUVA.RAMACHANDRAN',
      $or: [{ reasondate: { $exists: false } }, { reasondate: { $eq: "" } }, { reasondate: { $gte: date } }],
    };

    const users = await User.find(userQuery, {
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
    });
    console.log(users.length, "dfsdf");
    let users1 = users.map((item) => {
      let findUserTeam = item.team;
      let findUserProcess = item.process;
      // Handling team change with boardingLog
      if (item.boardingLog && item.boardingLog.length > 0) {
        // Check if there's any team change
        const teamChangeLog = item.boardingLog.filter((log) => log.logcreation !== "shift" && log.ischangeteam === true);

        if (teamChangeLog.length > 0) {
          // Sort by startdate descending
          const sortedTeamLog = teamChangeLog.sort((a, b) => {
            // First, compare startdate
            const startDateComparison = new Date(b.startdate) - new Date(a.startdate);
            if (startDateComparison !== 0) {
              return startDateComparison;
            }

            // If startdate is the same, compare createdat
            return b.updateddatetime - a.updateddatetime;
          });

          // Find the relevant team change based on the 'date'
          const findTeam = sortedTeamLog.find((log) => new Date(date) >= new Date(log.startdate));
          findUserTeam = findTeam ? findTeam.team : item.team;
        }
      }
      if (item && item.processlog) {
        const groupedByMonthProcs = {};

        // Group items by month
        item.processlog &&
          item.processlog
            ?.sort((a, b) => {
              return new Date(a.date) - new Date(b.date);
            })
            ?.forEach((d) => {
              const monthYear = d.date?.split("-").slice(0, 2).join("-");
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

        for (let i = 0; i < lastItemsForEachMonthPros.length; i++) {
          const date = lastItemsForEachMonthPros[i].date;

          if (new Date(req.body.date) >= new Date(date)) {
            findUserProcess = lastItemsForEachMonthPros[i];
          } else {
            break;
          }
        }
      }
      let findUserProcessFinal = findUserProcess ? findUserProcess.process : item.process;
      return {
        ...item._doc,
        team: findUserTeam,
        process: findUserProcessFinal,
      };
    });

    idletimeworks = users1.filter((d) =>
      appliedfor === "Employee"
   ? d.company === company && d.branch === branch && d.unit === unit && d.team === team  && (d.companyname === employee || employee === "ALL")
        : appliedfor === "Team"
        ? d.company === company && d.branch === branch && d.unit === unit && (d.team === team || team === "ALL")
        : appliedfor === "Unit"
        ? d.company === company && d.branch === branch && (d.unit === unit || unit === "ALL")
        : appliedfor === "Branch"
        ? d.company === company && (d.branch === branch || branch === "ALL")
        : appliedfor === "Company"
        ? d.company === company
        : appliedfor === "Process"
        ? d.company === company && d.branch === branch && (d.process === process || process === "ALL")
        : false
    );
let oldidletimeworks = await Idletimework.findOne({_id:id},
    {data:1}
);
const olddata = oldidletimeworks ? oldidletimeworks.data.map(d => d.employee): []

idletimeworks = idletimeworks.filter(item => !olddata.includes(item.companyname))

console.log(idletimeworks.length,"olddata")
  } catch (err) {
    console.log(err, "errr");
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    idletimeworks,
  });
});

exports.getAllIdleTimeWorkApproveUpdate = catchAsyncErrors(async (req, res, next) => {
  let idletimeworks;
  try {
    const {
      id,
      employee,
      date,
      explanation,
      fromtime,
      totime,
      appliedfor,
      idlework,
      company,
      branch,
      unit,
      team,
      process,
      aname,
      name,
      status,
      completed,
      rejectreason,
    } = req.body;

    console.log(req.body, "params");

    // const query = {
    //   _id: new ObjectId(id),
    // };

    // const update = {
    //   $push: {
    //     data: [
    //       {
    //         employee: employee,
    //         date: date,
    //         explanation: explanation,
    //         fromtime: fromtime,
    //         totime: totime,
    //         appliedfor: appliedfor,
    //         idlework: idlework,
    //         company: company,
    //         branch: branch,
    //         unit: unit,
    //         team: team,
    //         process: process,
    //         status:status,
    //         rejectreason:rejectreason,
    //         approvedby: name,
    //         approvedate: new Date(),
    //       },
    //     ],
    //   },
    // //   $set: {
    // //     status:status,
    // //     approvedby: name,
    // //       rejectreason:rejectreason,
    // //     approvedate: new Date(),
    // //   },
    // };
    // const options = {
    //   new: true,
    // };

    // let idletimeworks = await Idletimework.findOneAndUpdate(query, update, options);

    if (employee.length > 0) {
      const bulkOps = employee.map((name) => ({
        updateOne: {
          filter: { _id: id },
          update: {
            $push: {
              data: [
                {
                  employee: name,
                  date: date,
                  explanation: explanation,
                  fromtime: fromtime,
                  totime: totime,
                  appliedfor: appliedfor,
                  idlework: idlework,
                  company: company,
                  branch: branch,
                  unit: unit,
                  team: team,
                  aname:aname,
                  process: process,
                  status: status,
                  rejectreason: rejectreason,
                  approveby: name,
               
                  approvedate: new Date(),
                },
              ],
            },
            $set:{
                   completed,
            }
          },
        },
      }));

      // Perform bulk write operation
      await Idletimework.bulkWrite(bulkOps);
    }

    // console.log(idletimeworks, "idletimeworks");
  } catch (err) {
    console.log(err, "errparams");
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    idletimeworks,
  });
});




exports.getAllIdletimeworkStatusListReport = catchAsyncErrors(async (req, res, next) => {
  let idletimeworks;
  try {
    const { fromdate, todate } = req.body;
    let query = {
      date: { $gte: fromdate, $lte: todate },
    
    };
    console.log(query,"query")
    idletimeworks = await Idletimework.find(query, {data:1});
    idletimeworks = idletimeworks.flatMap(item => item.data) 
    // console.log(idletimeworks[0],"idletimeworks")
  } catch (err) {
    console.log(err,"list")
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    idletimeworks,
  });
});





exports.getAllIdletimeworkStatusListIndividualReport = catchAsyncErrors(async (req, res, next) => {
  let idletimeworks;
  try {
    const { fromdate, todate } = req.body;
    let query = {
      date: { $gte: fromdate, $lte: todate }, 
    };
    // console.log(query,"query")
    idletimeworks = await Idletimework.find(query, {data:1});
    idletimeworks = idletimeworks.flatMap(item => item.data) 
    // console.log(idletimeworks[0],"idletimeworks")
  } catch (err) {
    console.log(err,"list")
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    idletimeworks,
  });
});