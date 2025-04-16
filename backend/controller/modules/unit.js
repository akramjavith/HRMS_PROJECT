const Unit = require("../../model/modules/unit");
const Excelmaprespersondata = require("../../model/modules/excel/excelmapresperson");
const Teams = require("../../model/modules/teams");
const Excel = require("../../model/modules/excel/excel");
const User = require("../../model/login/auth");
const Excelmapdata = require("../../model/modules/excel/excelmapdata");
const Branch = require("../../model/modules/branch");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");
const excel = require("../../model/modules/excel/excel");
const Hirerarchi = require("../../model/modules/setup/hierarchy");

// get All unit => /api/units
exports.getAllUnit = catchAsyncErrors(async (req, res, next) => {
  let units;
  try {
    units = await Unit.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!units) {
    return next(new ErrorHandler("Unit not found!", 404));
  }
  return res.status(200).json({
    units,
  });
});

// get All unit => /api/units
exports.getAllBranchUnits = catchAsyncErrors(async (req, res, next) => {
  let branchunits;
  try {
    branchunits = await Unit.find({ branch: req.body.branch });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!branchunits) {
    return next(new ErrorHandler("Data not found!", 404));
  }
  return res.status(200).json({
    branchunits,
  });
});

/// get overall edit
exports.getOverAllUnits = catchAsyncErrors(async (req, res, next) => {
  let users, team, excelmapresperson, hierarchy;
  try {
    users = await User.find({enquirystatus:{
      $nin: ["Enquiry Purpose"]
     }, unit: req.body.oldname }, {company:1, branch:1,unit:1});
    team = await Teams.find({ unit: req.body.oldname });
    hierarchy = await Hirerarchi.find({ unit: req.body.oldname });
    excelmapresperson = await Excelmaprespersondata.find({
      todo: {
        $elemMatch: {
          unit: req.body.oldname,
        },
      },
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!users) {
    return next(new ErrorHandler("Unit not found", 404));
  }
  return res.status(200).json({
    count: users.length + team.length + excelmapresperson.length + hierarchy.length,
    users,
    team,
    excelmapresperson,
    hierarchy,
  });
});

// get overall delete functionality
exports.getAllUnitCheck = catchAsyncErrors(async (req, res, next) => {
  let units;
  try {
    units = await Unit.find();
    let query = {
      branch: req.body.checkunit,
    };
    units = await Unit.find(query, {
      name: 1,
      code: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!units) {
    return next(new ErrorHandler("Unit not found!", 404));
  }
  return res.status(200).json({
    units,
  });
});

exports.getUnitResult = catchAsyncErrors(async (req, res, next) => {
  let unitRes;
  branchname = req.body.branchname;
  try {
    unitRes = branchname === "all" ? await Unit.find() : await Unit.find({ branch: req.body.branchname });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!unitRes) {
    return next(new ErrorHandler("Unit Res not found!", 404));
  }
  return res.status(200).json({
    unitRes,
  });
});

exports.getUnitarrayList = catchAsyncErrors(async (req, res, next) => {
  let unitRes;
  let Team;
  let teamsdata;
  let UnitsData;
  branchname = req.body.branchname;
  unitname = req.body.unitname;
  try {
    unitRes = branchname == "all" ? await Unit.find() : await Unit.find({ branch: branchname });
    teamsdata = unitRes.map((d) => d.name);
    Team = await Teams.find();
    UnitsData = Team.filter((item) => teamsdata.includes(item.unit));
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!unitRes) {
    return next(new ErrorHandler("Unit Res not found!", 404));
  }
  return res.status(200).json({
    unitRes,
    UnitsData,
  });
});
exports.getCustDropdowns = catchAsyncErrors(async (req, res, next) => {
  let unitRes;
  let Team;
  let teamsdata;
  let UnitsData;
  let teamlink;
  let branchlink;
  let unitlink;
  let Branchs;
  let excelDatas;
  let excelmap;
  let excelmapData;
  let match;
  let newFilteredData;
  let uniqueArrayedall;
  let result = [];
  let uniqueArrayed;
  let uniqueArray;
  let branchname = req.body.branchname;
  let unitname = req.body.unitname;
  try {
    unitRes = branchname == "all" && unitname == "all" ? await Unit.find() : branchname != "all" && unitname == "all" ? await Unit.find({ branch: req.body.branchname }) : await Unit.find({ branch: branchname, name: unitname });
    teamsdata = unitRes.map((d) => d.name);

    Team = await Teams.find();
    UnitsData = Team.filter((item) => teamsdata.includes(item.unit));
    Branchs = branchname == "all" ? await Branch.find() : await Branch.find({ name: branchname });

    branchlink = ["all", ...Branchs.map((d) => d.name)];

    unitlink = ["all", ...unitRes.map((d) => d.name)];
    teamlink = ["all", ...UnitsData.map((d) => d.teamname)];
    excelDatas = await Excel.find();
    excelmap = await Excelmapdata.find();
    excelmapData = excelDatas[excelDatas.length - 1].exceldata;
    match = excelmap.filter((item1) => {
      result.push(excelmapData.find((item2) => item1.customer === item2.customer && item1.process === item2.process));
      return result;
    });

    newFilteredData = match.filter((item) => branchlink.includes(item.branch) && unitlink.includes(item.unit) && teamlink.includes(item.team));

    uniqueArrayed = Array.from(new Set(newFilteredData?.map((obj) => obj.customer)))?.map((id) => {
      return newFilteredData.find((obj) => obj.customer === id);
    });

    uniqueArrayedall = [{ customer: "all" }, ...uniqueArrayed];
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!unitRes) {
    return next(new ErrorHandler("Unit Res not found!", 404));
  }
  return res.status(200).json({
    branchlink,
    unitlink,
    teamlink,
    result,
    newFilteredData,
    uniqueArrayedall,
  });
});

exports.getProcessDropdowns = catchAsyncErrors(async (req, res, next) => {
  let unitRes;
  let Team;
  let teamsdata;
  let UnitsData;
  let teamlink;
  let branchlink;
  let unitlink;
  let Branchs;
  let excelDatas;
  let excelmap;
  let excelmapData;
  let match;
  let newFilteredData;
  let uniqueArrayedall;
  let result = [];
  let uniqueArrayed;
  let uniqueArray;
  let custlink;
  let customerlink;
  let uniqueArrayall;

  let branchname = req.body.branchname;
  let unitname = req.body.unitname;
  let teamname = req.body.teamname;
  let customername = req.body.customername;
  let newfiltdata;

  try {
    unitRes = branchname == "all" && unitname == "all" ? await Unit.find() : branchname != "all" && unitname == "all" ? await Unit.find({ branch: branchname }) : await Unit.find({ branch: branchname, name: unitname });
    teamsdata = unitRes.map((d) => d.name);
    Team = await Teams.find();
    UnitsData = Team.filter((item) => teamsdata.includes(item.unit));
    Branchs = branchname == "all" ? await Branch.find() : await Branch.find({ name: branchname });
    branchlink = ["all", ...Branchs.map((d) => d.name)];
    unitlink = ["all", ...unitRes.map((d) => d.name)];
    teamlink = ["all", ...UnitsData.map((d) => d.teamname)];
    excelDatas = await Excel.find();
    excelmap = await Excelmapdata.find();
    excelmapData = excelDatas[excelDatas.length - 1].exceldata;
    match = excelmap.filter((item1) => {
      result.push(excelmapData.find((item2) => item1.customer === item2.customer && item1.process === item2.process));
      return result;
    });
    newFilteredData = match.filter((item) => branchlink.includes(item.branch) && unitlink.includes(item.unit) && teamlink.includes(item.team));

    custlink = customername == "all" ? newFilteredData : newFilteredData.filter((data) => data.customer === customername);
    customerlink = ["all", ...custlink.map((data) => data.customer)];
    newfiltdata = newFilteredData.filter((item) => branchlink.includes(item.branch) && unitlink.includes(item.unit) && teamlink.includes(item.team) && customerlink.includes(item.customer));
    uniqueArray = Array.from(new Set(newfiltdata.map((obj) => obj.process))).map((id) => {
      return newfiltdata.find((obj) => obj.process === id);
    });
    uniqueArrayall = [{ process: "all" }, ...uniqueArray];
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!unitRes) {
    return next(new ErrorHandler("Unit Res not found!", 404));
  }
  return res.status(200).json({
    customerlink,
    uniqueArrayall,
  });
});
exports.getQueueReports = catchAsyncErrors(async (req, res, next) => {
  let unitRes;
  let Team;
  let teamsdata;
  let UnitsData;
  let teamlink;
  let branchlink;
  let unitlink;
  let Branchs;
  let excelDatas;
  let excelmap;
  let excelmapData;
  let match;
  let newFilteredData;
  let uniqueArrayedall;
  let result = [];
  let uniqueArrayed;
  let uniqueArray;
  let custlink;
  let customerlink;
  let uniqueArrayall;

  //sumbit req
  let groupedDatased;
  let key;
  let data25555;
  let groupedData;
  let data24344;
  let grouped;
  let results;
  let groupeds;
  let groupedsresult;
  let reselse;
  let answer;
  let groupedDatased2;
  let key2;
  let data255556;
  let groupedenddata;
  let data255557;
  let answerlast;
  let resu;
  let groupedends;
  let unitRes2;
  let teamsdata2;
  let units2;
  let checkteam;

  let branchname = req.body.branchname;
  let unitname = req.body.unitname;
  let teamname = req.body.teamname;
  let customername = req.body.customername;
  let processname = req.body.processname;
  let newfiltdata;

  try {
    Branchs = branchname == "all" ? await Branch.find() : await Branch.find({ name: branchname });
    branchlink = ["all", ...Branchs.map((d) => d.name)];

    unitRes = branchname == "all" && unitname === "all" ? await Unit.find() : unitname == "all" ? await Unit.find({ branch: branchname }) : await Unit.find({ name: unitname });
    unitlink = ["all", ...unitRes.map((d) => d.name)];

    unitRes2 = await Unit.find({ branch: branchname });
    teamsdata2 = unitRes2.map((d) => d.name);
    Team = await Teams.find();
    UnitsData = Team.filter((item) => teamsdata2.includes(item.unit));

    checkteam = unitname == "all" && teamname == "all" && branchname == "all" ? await Teams.find() : unitname == "all" && branchname == "all" ? await Teams.find({ teamname: teamname }) : UnitsData;

    teamlink = teamname == "all" ? ["all", ...checkteam.map((d) => d.teamname)] : [teamname];
    excelDatas = await Excel.find();
    excelmap = await Excelmapdata.find();
    excelmapData = excelDatas[excelDatas.length - 1].exceldata;
    match = excelmap.filter((item1) => {
      result.push(excelmapData.find((item2) => item1.customer === item2.customer && item1.process === item2.process));
      return result;
    });

    newFilteredData = match.filter((item) => branchlink.includes(item.branch) && unitlink.includes(item.unit) && teamlink.includes(item.team));

    custlink = customername == "all" ? newFilteredData : newFilteredData.filter((data) => data.customer === customername);
    customerlink = ["all", ...custlink.map((data) => data.customer)];
    newfiltdata = newFilteredData.filter((item) => branchlink.includes(item.branch) && unitlink.includes(item.unit) && teamlink.includes(item.team) && customerlink.includes(item.customer));
    uniqueArray = Array.from(new Set(newfiltdata.map((obj) => obj.process))).map((id) => {
      return newfiltdata.find((obj) => obj.process === id);
    });
    uniqueArrayall = [{ process: "all" }, ...uniqueArray];

    //submit request filtering
    if (branchname === "all" && unitname === "all" && teamname === "all" && customername === "all" && processname === "all") {
      groupedDatased = excelmapData.reduce((acc, curr) => {
        key = curr.process;
        if (!acc[key]) {
          acc[key] = {
            count: +curr.count,
            customer: [curr.customer],
            process: curr.process,
          };
        } else {
          acc[key].count += +curr.count;
          if (!acc[key].customer.includes(curr.customer)) {
            acc[key].customer.push(curr.customer);
          }
        }
        return acc;
      }, {});
      data25555 = Object.values(groupedDatased);
      groupedData = excelmapData.reduce((acc, curr) => {
        key = curr.customer + curr.process;
        if (!acc[key]) {
          acc[key] = {
            count: curr.count,
            customer: curr.customer,
            process: curr.process,
            priority: curr.priority,
            created: curr.created,
            tat: curr.tat,
          };
        } else {
          acc[key].item += curr.item;
        }
        return acc;
      }, {});

      data24344 = Object.values(groupedData);
      grouped = excelmapData.filter((data) => {
        results = excelmap.find((res, index) => {
          if (data.customer === res.customer && data.process === res.process) {
            data.branch = res.branch;
            data.unit = res.unit;
            data.team = res.team;
            return res;
          }
        });
        return results;
      });
      groupeds = data24344.filter((data) => {
        groupedsresult = !excelmap.some((res, index) => data.customer === res.customer && data.process === res.process);
        return groupedsresult;
      });
    } else {
      if (customername === "all" && processname === "all") {
        reselse = excelmapData.filter((data) => {
          answer = newFilteredData.find((item) => item.process === data.process && item.customer === data.customer);
          return answer;
        });

        groupedDatased2 = reselse.reduce((acc, curr) => {
          key2 = curr.process;
          if (!acc[key2]) {
            acc[key2] = {
              count: +curr.count,
              customer: [curr.customer],
              process: curr.process,
            };
          } else {
            acc[key2].count += +curr.count;
            if (!acc[key2].customer.includes(curr.customer)) {
              acc[key2].customer.push(curr.customer);
            }
          }
          return acc;
        }, {});
        data255556 = Object.values(groupedDatased2);

        groupedenddata = excelmapData.filter((data) => {
          results = newFilteredData.find((res, index) => {
            if (data.customer === res.customer && data.process === res.process) {
              data.branch = res.branch;
              data.unit = res.unit;
              data.team = res.team;
              return res;
            }
          });
          return results;
        });
      } else {
        resu = excelmapData.filter((data) => {
          answerlast = newFilteredData.find((item) => item.process === data.process && item.customer === data.customer);
          return answerlast;
        });
        ans = resu.filter((data) => {
          if (data.customer === customername && data.process === processname) {
            return data;
          } else if (data.customer === customername && processname == "all") {
            return data;
          } else if (data.process === processname && customername == "all") {
            return data;
          }
        });

        groupedDatased = ans.reduce((acc, curr) => {
          key = curr.process;
          if (!acc[key]) {
            acc[key] = {
              count: +curr.count,
              customer: [curr.customer],
              process: curr.process,
            };
          } else {
            acc[key].count += +curr.count;
            if (!acc[key].customer.includes(curr.customer)) {
              acc[key].customer.push(curr.customer);
            }
          }
          return acc;
        }, {});
        data255557 = Object.values(groupedDatased);

        groupedends = ans.filter((data) => {
          result = newFilteredData.find((res, index) => {
            if (data.customer === res.customer && data.process === res.process) {
              data.branch = res.branch;
              data.unit = res.unit;
              data.team = res.team;
              return res;
            }
          });
          return result;
        });
      }
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!unitRes) {
    return next(new ErrorHandler("Unit Res not found!", 404));
  }
  return res.status(200).json({
    groupedDatased,
    data25555,
    reselse,
    results,
    groupedDatased2,
    grouped,
    groupeds,
    answer,
    data255556,
    groupedenddata,
    data255557,
    groupedends,
  });
});

// Create new unit => /api/unit/new
exports.addUnit = catchAsyncErrors(async (req, res, next) => {
  let aproduct = await Unit.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});
// get Single unit => /api/unit/:id
exports.getSingleUnit = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sunit = await Unit.findById(id);

  if (!sunit) {
    return next(new ErrorHandler("Unit not found!", 404));
  }
  return res.status(200).json({
    sunit,
  });
});
// update unit by id => /api/unit/:id
exports.updateUnit = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uunit = await Unit.findByIdAndUpdate(id, req.body);

  if (!uunit) {
    return next(new ErrorHandler("Unit not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});
// delete unit by id => /api/unit/:id
exports.deleteUnit = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dunit = await Unit.findByIdAndRemove(id);

  if (!dunit) {
    return next(new ErrorHandler("Unit not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});
