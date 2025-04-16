const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Designationgroup = require("../../../model/modules/designationgroup");
const Department = require("../../../model/modules/department");
const Branch = require("../../../model/modules/branch");
const Unit = require("../../../model/modules/unit");
const Teams = require("../../../model/modules/teams");
const DesignationLog = require('../../../model/modules/departmentanddesignationgrouping');
const DesignationMaster = require('../../../model/modules/designation');

const User = require("../../../model/login/auth");
const Designation = require("../../../model/modules/designation");
const Hirerarchi = require("../../../model/modules/setup/hierarchy");
const Controls = require("../../../model/modules/controlName");
const Noticeperiod = require("../../../model/modules/recruitment/noticeperiodapply");

//get Location wise filter=>/api/locationwiseall
exports.getDesignationControl = catchAsyncErrors(async (req, res, next) => {
  let designationgroups;
  try {
    designationgroups = await Designationgroup.find({ name: { $eq: req.body.name } });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!designationgroups) {
    return next(new ErrorHandler("Details not found!", 404));
  }
  return res.status(200).json({
    designationgroups,
  });
});

//get Location wise filter=>/api/locationwiseall
exports.getLocationwiseFilter = catchAsyncErrors(async (req, res, next) => {
  let designationgroups, department, branch, branches, deesig;
  try {
    if (req.body.company == "All") {
      department = await Department.find();
      branch = await Branch.find();
    } else {
      department = await Department.find();
      branch = await Branch.find({ company: { $eq: req.body.company } });
    }


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!(department && branch)) {
    return next(new ErrorHandler("Details not found!", 404));
  }
  return res.status(200).json({
    department,
    branch,
  });
});
//get branch wise unit filter =>/api/areas
exports.getBranchWiseunit = catchAsyncErrors(async (req, res, next) => {
  let units;
  try {
    if (req.body.branch == "All") {
      units = await Unit.find({});
    } else {
      units = await Unit.find({ branch: { $eq: req.body.branch } });
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!units) {
    return next(new ErrorHandler("Details not found!", 404));
  }
  return res.status(200).json({
    units,
  });
});
//get unit wise Team filter =>/api/areas
exports.getUnitwiseTeam = catchAsyncErrors(async (req, res, next) => {
  let teams;
  try {
    if (req.body.unit == "All") {
      teams = await Teams.find({});
    } else {
      teams = await Teams.find({ unit: { $eq: req.body.unit } });
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!teams) {
    return next(new ErrorHandler("Details not found!", 404));
  }
  return res.status(200).json({
    teams,
  });
});

exports.getAllUserWiseFilter = catchAsyncErrors(async (req, res, next) => {
  let desig, designation, desigFinal, anwerFinal;
  try {
    let query = {};
    designation = await Designation.find();

    Object.keys(req.body).forEach((key) => {
      if (key !== "headers") {
        const value = req.body[key];
        if (value !== "" && value !== "All") {
          if (key === "designationgroup") {
            desigFinal = designation.filter((data) => value.includes(data.group));
            desig = desigFinal.map((item) => item.name);
          } else {
            query[key] = { $eq: value.toString() };
          }
        }
      }
    });


    const result = await User.find(query, { resonablestatus: 1, unit: 1, empcode: 1, companyname: 1, team: 1, username: 1, email: 1, branch: 1, designation: 1, team: 1 });

    anwerFinal = desig ? result.filter((data) => desig.includes(data.designation) && !["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"].includes(data.resonablestatus)) : result.filter((item) => !["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"].includes(item.resonablestatus));
    // Replace `User` with your user model
    return res.status(200).json({
      users: anwerFinal,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

// get All Hirerarchi => /api/hirerarchies
exports.getAllHirerarchi = catchAsyncErrors(async (req, res, next) => {
  let hirerarchi;
  try {
    hirerarchi = await Hirerarchi.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!hirerarchi) {
    return next(new ErrorHandler("Hirerarchi not found!", 404));
  }
  return res.status(200).json({
    hirerarchi,
  });
});

exports.getAllUserWiseFilteredit = catchAsyncErrors(async (req, res, next) => {
  let desig, designation, company, comps, desigFinal, anwerFinal, result;
  try {
    let query;
    designation = await Designation.find();
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers") {
        const value = req.body[key];

        if (value !== "" && value !== "All") {
          if (key === "designationgroup") {
            desigFinal = designation.filter((data) => value.includes(data.group));
            desig = desigFinal.map((item) => item.name);
          } else {
            query[key] = { $eq: value.toString() };
          }
        }
      }
    });
    let querynew = {
      resonablestatus: {
        $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"]
      },
    };

    let finalquery = query ? { $and: [query, querynew] } : querynew;

    result = await User.find(finalquery, {
      unit: 1,
      empcode: 1,
      companyname: 1,
      team: 1,
      username: 1,
      email: 1,
      branch: 1,
      designation: 1,
    });

    anwerFinal = desig && desig.length > 0 ? result.filter((data) => desig.includes(data.designation)) : result;

    // Replace `User` with your user model
    return res.status(200).json({
      users: anwerFinal,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

exports.checkHierarchyAddNewEmp = catchAsyncErrors(async (req, res, next) => {
  let hirerarchi, hierarchyupdate, resultString, desigFinal;
  try {
    const { company, department, designation, branch, team, unit } = req.body;
    hirerarchi = await Hirerarchi.find();

    designations = await Designation.find();

    designationGrp = designations.find((data) => designation.includes(data.name));

    condition1 = hirerarchi.filter((item) => {
      if (item.company === company && item.branch === "" && item.unit === "" && item.team === "" && item.department === "" && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All")) {
        return item;
      }
    });

    condition5 = hirerarchi.filter((item) => {
      if (item.branch === "" && item.unit === "" && item.team === "" && item.department === "" && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All") && (item.company === company || item.company === "All")) {
        return item;
      }
    });

    condition6 = hirerarchi.filter((item) => {
      if ((item.department === department || item.department == "All") && item.branch === "" && item.unit === "" && item.team === "" && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All") && (item.company === company || item.company === "All")) {
        return item;
      }
    });

    condition2 = hirerarchi.filter((item) => {
      if ((item.branch === branch || item.branch === "All") && item.unit === "" && item.team === "" && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All") && (item.company === company || item.company === "All")) {
        return item;
      }
    });

    condition3 = hirerarchi.filter((item) => {
      if ((item.unit === unit || item.unit === "All") && (item.branch === branch || item.branch === "All") && item.team === "" && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All") && (item.company === company || item.company === "All")) {
        return item;
      }
    });

    condition4 = hirerarchi.filter((item) => {
      // item.team === team && item.access === "all"
      if ((item.team === team || item.team === "All") && (item.unit === unit || item.unit === "All") && (item.branch === branch || item.branch === "All") && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All") && (item.company === company || item.company === "All")) {
        return item;
      }
    });

    let con1value = condition1 && condition1.length > 0 ? condition1 : [];
    let con2value = condition2 && condition2.length > 0 ? condition2 : [];
    let con3value = condition3 && condition3.length > 0 ? condition3 : [];
    let con4value = condition4 && condition4.length > 0 ? condition4 : [];
    let con5value = condition5 && condition5.length > 0 ? condition5 : [];
    let con6value = condition6 && condition6.length > 0 ? condition6 : [];
    resultString = [...con1value, ...con2value, ...con3value, ...con4value, ...con5value, ...con6value];
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!hirerarchi) {
    return next(new ErrorHandler("Hirerarchi not found!", 404));
  }
  return res.status(200).json({
    hierarchyupdate,
    resultString,
  });
});

exports.checkHierarchyEditEmpDetails = catchAsyncErrors(async (req, res, next) => {
  let hirerarchi, hierarchyupdate, resultString, desigFinal, condition1, condition2, condition3, condition4, allCondata, hirerarchiall;
  try {
    const { company, department, designation, branch, team, unit, companyname, empcode, oldcompany, oldbranch, oldunit, oldteam } = req.body;
    let query = {
      // employeename:req.body.companyname,
      employeename: {
        $in: req.body.companyname,
      },
      empcode: req.body.empcode,
    };
    hirerarchi = await Hirerarchi.find(query, {});
    hirerarchiall = await Hirerarchi.find();
    designations = await Designation.find();

    designationGrp = designations.find((data) => designation.includes(data.name));

    if (hirerarchi.length > 0) {
      if (company !== oldcompany) {
        condition1 = hirerarchiall.filter((item) => {
          if (item.company === company && item.branch === "" && item.unit === "" && item.team === "" && item.department === "" && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All")) {
            return item;
          }
        });
      }
      if (branch !== oldbranch) {
        condition2 = hirerarchiall.filter((item) => {
          if ((item.branch === branch || item.branch === "All") && item.unit === "" && item.team === "" && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All") && (item.company === company || item.company === "All")) {
            return item;
          }
        });
      }
      if (unit !== oldunit) {
        condition3 = hirerarchiall.filter((item) => {
          if ((item.unit === unit || item.unit === "All") && (item.branch === branch || item.branch === "All") && item.team === "" && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All") && (item.company === company || item.company === "All")) {
            return item;
          }
        });
      }
      if (team !== oldteam) {
        condition4 = hirerarchiall.filter((item) => {
          // item.team === team && item.access === "all"
          if ((item.team === team || item.team === "All") && (item.unit === unit || item.unit === "All") && (item.branch === branch || item.branch === "All") && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All") && (item.company === company || item.company === "All")) {
            return item;
          }
        });
      }
    }
    let con1value = condition1 && condition1.length > 0 ? condition1 : [];
    let con2value = condition2 && condition2.length > 0 ? condition2 : [];
    let con3value = condition3 && condition3.length > 0 ? condition3 : [];
    let con4value = condition4 && condition4.length > 0 ? condition4 : [];
    allCondata = [...con1value, ...con2value, ...con3value, ...con4value];
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!hirerarchi) {
    return next(new ErrorHandler("Hirerarchi not found!", 404));
  }
  return res.status(200).json({
    hirerarchi,
    allCondata,
  });
});



exports.getAllHierarchyTeamAndDesignation = catchAsyncErrors(async (req, res, next) => {
  let oldname = req.body.oldname;
  let newname = req.body.newname;
  let type = req.body.type;
  let username = req.body.username;
  let hierarchy, hierarchyfindchange, hierarchyold, hierarchyoldsupervisor, designation;

  try {


    hierarchy = await Hirerarchi.find()
    designation = (type === "Designation" && newname !== "All") ? await Designation.find({ name: newname }) : [];
    hierarchyold = hierarchy.filter(data => data.employeename?.includes(username))
    hierarchyoldsupervisor = hierarchy.filter(data => data.supervisorchoose?.includes(username))


    hierarchyfindchange = type === "Team" ? hierarchy.filter(data => data.team === newname && data.level === "Primary") :
      type === "Designation" ? hierarchy.filter(data => data?.designationgroup === (designation?.length > 0 ? designation[0]?.group : "") && data.level === "Primary") : []



  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!hierarchyold && !hierarchyfindchange && !hierarchyoldsupervisor) {
    return next(new ErrorHandler("Hirerarchi not found!", 404));
  }
  return res.status(200).json({
    hierarchyold,
    hierarchyfindchange,
    hierarchyoldsupervisor
  });
});

exports.checkHierarchyEditEmpDetailsDesignation = catchAsyncErrors(async (req, res, next) => {
  let hirerarchiall, allCondataold, allCondata, condition1, condition2, condition3, condition4, condition6;
  try {
    const { company, designation, olddesignation, companyname, branch, unit, team, department } = req.body;

    let query = {
      supervisorchoose: {
        $in: req.body.companyname,
      },
    };
    hirerarchi = await Hirerarchi.find(query, {});
    hirerarchiall = await Hirerarchi.find();
    designations = await Designation.find();

    designationGrp = designations.find((data) => designation == data.name);
    olddesignationGrp = designations.find((data) => olddesignation == data.name);

    allCondataolddata = hirerarchiall.filter((item) => {
      if ((item.company === company || item.company === "All") && item.branch === "" && item.unit === "" && item.team === "" && item.department === "" && item.access === "all" && item.employeename.includes(companyname) && (item.designationgroup === olddesignationGrp.group || item.designationgroup === "All")) {
        return item;
      }
    });

    if (designationGrp.group !== olddesignationGrp.group) {
      allCondataold = hirerarchiall.filter((item) => {
        if ((item.company === company || item.company === "All") && item.branch === "" && item.unit === "" && item.team === "" && item.department === "" && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All")) {
          return item;
        }
      });
      condition1 = hirerarchiall.filter((item) => {
        if (item.company === company && item.branch === "" && item.unit === "" && item.team === "" && item.department === "" && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All")) {
          return item;
        }
      });
      condition4 = hirerarchiall.filter((item) => {
        // item.team === team && item.access === "all"
        if ((item.team === team || item.team === "All") && (item.unit === unit || item.unit === "All") && (item.branch === branch || item.branch === "All") && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All") && (item.company === company || item.company === "All")) {
          return item;
        }
      });
      condition2 = hirerarchiall.filter((item) => {
        if ((item.branch === branch || item.branch === "All") && item.unit === "" && item.team === "" && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All") && (item.company === company || item.company === "All")) {
          return item;
        }
      });
      condition3 = hirerarchiall.filter((item) => {
        if ((item.unit === unit || item.unit === "All") && (item.branch === branch || item.branch === "All") && item.team === "" && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All") && (item.company === company || item.company === "All")) {
          return item;
        }
      });
      condition6 = hirerarchiall.filter((item) => {
        if ((item.department === department || item.department == "All") && item.branch === "" && item.unit === "" && item.team === "" && item.access === "all" && (item.designationgroup === designationGrp.group || item.designationgroup === "All") && (item.company === company || item.company === "All")) {
          return item;
        }
      });
    }

    let allCondataoldval = allCondataold && allCondataold.length > 0 ? allCondataold : [];
    let con1value = condition1 && condition1.length > 0 ? condition1 : [];
    let con2value = condition2 && condition2.length > 0 ? condition2 : [];
    let con3value = condition3 && condition3.length > 0 ? condition3 : [];
    let con4value = condition4 && condition4.length > 0 ? condition4 : [];
    let con6value = condition6 && condition6.length > 0 ? condition6 : [];
    allCondata = [...allCondataoldval, ...con1value, ...con2value, ...con3value, ...con4value, ...con6value];
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!hirerarchiall) {
    return next(new ErrorHandler("Hirerarchi not found!", 404));
  }
  return res.status(200).json({
    hirerarchiall,
    allCondata,
    hirerarchi,
    allCondataolddata,
  });
});


exports.hierarchyEditMatchcheck = catchAsyncErrors(async (req, res, next) => {
  let hirerarchi, hierarchyemp, hierarchysameempmodelevcont, hierarchysuplvl, hierarchysamesupemp;
  try {
    let query = req.body.department === "" ?
      {
        branch: req.body.branch,
        designationgroup: req.body.designationgroup,
        unit: req.body.unit,
        team: req.body.team,
        supervisorchoose: {
          $in: req.body.supervisorchoose,
        },
        mode: req.body.mode,
        level: req.body.level,
        employeename: {
          $in: req.body.employeename,
        },
        _id: {
          $nin: req.body.unids,
        },
      } : {
        designationgroup: req.body.designationgroup,
        department: req.body.department,
        supervisorchoose: {
          $in: req.body.supervisorchoose,
        },
        mode: req.body.mode,
        level: req.body.level,
        employeename: {
          $in: req.body.employeename,
        },
        _id: {
          $nin: req.body.unids,
        },
      };


    hirerarchi = await Hirerarchi.find(query, {});

    let queryemp = req.body.department === "" ? {
      branch: req.body.branch,
      designationgroup: req.body.designationgroup,
      unit: req.body.unit,
      team: req.body.team,
      level: req.body.level,
      supervisorchoose: {
        $in: req.body.supervisorchoose,
      },
      employeename: {
        $in: req.body.employeename,
      },
      _id: {
        $nin: req.body.unids,
      },
    } : {
      designationgroup: req.body.designationgroup,
      department: req.body.department,
      level: req.body.level,
      supervisorchoose: {
        $in: req.body.supervisorchoose,
      },
      employeename: {
        $in: req.body.employeename,
      },
      _id: {
        $nin: req.body.unids,
      },

    };

    hierarchyemp = await Hirerarchi.find(queryemp, {});

    let querysuplvl = req.body.department === "" ? {
      branch: req.body.branch,
      designationgroup: req.body.designationgroup,
      unit: req.body.unit,
      team: req.body.team,
      supervisorchoose: {
        $in: req.body.supervisorchoose,
      },
      employeename: {
        $in: req.body.employeename,
      },
      mode: req.body.mode,
      _id: {
        $nin: req.body.unids,
      },
    } : {
      designationgroup: req.body.designationgroup,
      department: req.body.department,
      mode: req.body.mode,
      supervisorchoose: {
        $in: req.body.supervisorchoose,
      },
      employeename: {
        $in: req.body.employeename,
      },
      _id: {
        $nin: req.body.unids,
      },
    };

    hierarchysuplvl = await Hirerarchi.find(querysuplvl, {});

    let querysamesupemp = req.body.department === "" ? {
      branch: req.body.branch,
      designationgroup: req.body.designationgroup,
      unit: req.body.unit,
      team: req.body.team,
      supervisorchoose: {
        $in: req.body.supervisorchoose,
      },
      employeename: {
        $in: req.body.employeename,
      },
      _id: {
        $nin: req.body.unids,
      },
    } : {
      designationgroup: req.body.designationgroup,
      department: req.body.department,
      supervisorchoose: {
        $in: req.body.supervisorchoose,
      },
      employeename: {
        $in: req.body.employeename,
      },
      _id: {
        $nin: req.body.unids,
      },
    };

    hierarchysamesupemp = await Hirerarchi.find(querysamesupemp, {});

    let queryControl = req.body.department === "" ?
      {
        branch: req.body.branch,
        designationgroup: req.body.designationgroup,
        unit: req.body.unit,
        team: req.body.team,
        mode: req.body.mode,
        level: req.body.level,
        control: req.body.control,
        employeename: {
          $in: req.body.employeename,
        },
        _id: {
          $nin: req.body.unids,
        },
      } : {
        designationgroup: req.body.designationgroup,
        department: req.body.department,
        control: req.body.control,
        mode: req.body.mode,
        level: req.body.level,
        employeename: {
          $in: req.body.employeename,
        },
        _id: {
          $nin: req.body.unids,
        },
      };

    hierarchysameempmodelevcont = await Hirerarchi.find(queryControl, {});

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
    hirerarchi,
    hierarchyemp,
    hierarchysuplvl,
    hierarchysamesupemp,
    hierarchysameempmodelevcont
  });
});


//get not assign hierarchy data
exports.getNotAssignHierarchyData = catchAsyncErrors(async (req, res, next) => {
  let hierarchy, removedDuplicates, teamall, filtered, filtered2, filtered1, flattenedFiltered, removedDuplicatesTeam, branchall, notassignlistteam, designationGrp, notassignlist, controls, overallNotassign;
  try {
    hierarchy = await Hirerarchi.find();
    const removeDuplicates = (arr) => {
      const seen = new Set();
      return arr.filter((obj) => {
        const key = `${obj.designationgroup}-${obj.department}-${obj.company}-${obj.branch}-${obj.unit}-${obj.team}-${obj.level}`;
        if (!seen.has(key)) {
          seen.add(key);
          return true;
        }
        return false;
      });
    };

    removedDuplicates = removeDuplicates(hierarchy);

    const Priorities = ["Primary", "Secondary", "Tertiary"];

    teamall = await Teams.find();
    designationGrp = await Designationgroup.find();
    branchall = await Branch.find();
    controls = await Controls.find();

    const removeDuplicatesTeam = (arr) => {
      const seen = new Set();
      return arr.filter((obj) => {
        const key = `${obj.department}-${obj.branch}-${obj.unit}`;
        if (!seen.has(key)) {
          seen.add(key);
          return true;
        }
        return false;
      });
    };

    removedDuplicatesTeam = removeDuplicatesTeam(teamall);

    const altered = removedDuplicatesTeam.map((item) => ({ branch: item.branch, teamname: "All", department: item.department, unit: item.unit }));

    let overallTeam = [...teamall, ...altered];

    notassignlistteam = overallTeam.flatMap((item) => Priorities.map((priority) => ({ team: item.teamname, branch: item.branch, company: branchall?.find((br) => br.name === item.branch)?.company, unit: item.unit, department: item.department, level: priority })));

    notassignlist = notassignlistteam.flatMap((item) => designationGrp.map((grp) => ({ team: item.team, branch: item.branch, company: item.company, department: item.department, unit: item.unit, level: item.level, designationgroup: grp.name })));

    overallNotassign = notassignlist.flatMap((item) => controls.map((ctrl) => ({ team: item.team, branch: item.branch, company: item.company, department: item.department, unit: item.unit, level: item.level, designationgroup: item.designationgroup, control: ctrl.name })));

    filtered = overallNotassign.filter((obj1) => !removedDuplicates.some((obj2) => `${obj2.designationgroup}-${obj2.department}-${obj2.company}-${obj2.branch}-${obj2.unit}-${obj2.team}-${obj2.level}` === `${obj1.designationgroup}-${obj2.department === "" ? "" : obj1.department}-${obj1.company}-${obj2.branch === "" ? "" : obj1.branch}-${obj2.unit === "" ? "" : obj1.unit}-${obj2.team === "" ? "" : obj1.team}-${obj1.level}`));
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!hierarchy) {
    return next(new ErrorHandler("Hierarchy not found!", 404));
  }
  return res.status(200).json({
    hierarchy,
    removedDuplicates,
    overallNotassign,
    filtered,
    flattenedFiltered,
  });
});

// Create new Hirerarchi => /api/hirerarchi/new
exports.addHirerarchi = catchAsyncErrors(async (req, res, next) => {
  let ahirerarchi = await Hirerarchi.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Hirerarchi => /api/hirerarchi/:id
exports.getSingleHirerarchi = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let shirerarchi = await Hirerarchi.findById(id);
  if (!shirerarchi) {
    return next(new ErrorHandler("Hirerarchi not found!", 404));
  }
  return res.status(200).json({
    shirerarchi,
  });
});

// update Hirerarchi by id => /api/hirerarchi/:id
exports.updateHirerarchi = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uhirerarchi = await Hirerarchi.findByIdAndUpdate(id, req.body);
  if (!uhirerarchi) {
    return next(new ErrorHandler("Hirerarchi not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});

// delete Hirerarchi by id => /api/hirerarchi/:id
exports.deleteHirerarchi = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dhirerarchi = await Hirerarchi.findByIdAndRemove(id);
  if (!dhirerarchi) {
    return next(new ErrorHandler("Hirerarchi not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getAllHierarchyListSalary = catchAsyncErrors(async (req, res, next) => {
  let result, hierarchy, resultAccessFilter, secondaryhierarchyfinal, tertiaryhierarchyfinal, primaryhierarchyfinal, hierarchyfilter, filteredoverall, primaryhierarchy, hierarchyfilter1, secondaryhierarchy, hierarchyfilter2, tertiaryhierarchy, primaryhierarchyall, secondaryhierarchyall, tertiaryhierarchyall, branch, hierarchySecond, overallMyallList, hierarchyMap, resulted, resultedTeam, myallTotalNames, hierarchyFinal, hierarchyDefault;
  try {
    const { listpageaccessmode = "Hierarchy Based" } = req.body;

    result = await User.find(
      {
        enquirystatus: {
          $nin: ["Enquiry Purpose"]
        },
        resonablestatus: {
          $nin: ["Releave Employee", "Absconded", "Hold", "Terminate"],
        },
        ...(listpageaccessmode === "Reporting to Based"
          ? { reportingto: req.body.username }
          : {}),
      },
      {
        companyname: 1,
        branch: 1,
        company: 1,
        unit: 1,
        team: 1,
        department: 1,
        originalpassword: 1,
        resonablestatus: 1,
        username: 1,
        // _id: 1
      }
    );

    //myhierarchy dropdown
    if ((req.body.hierachy === "myhierarchy") &&
      (listpageaccessmode === "Hierarchy Based" ||
        listpageaccessmode === "Overall")) {

      hierarchy = await Hirerarchi.find({ supervisorchoose: req.body.username, level: req.body.sector });
      hierarchyDefault = await Hirerarchi.find({ supervisorchoose: req.body.username });

      let answerDef = hierarchyDefault.map((data) => data.employeename);
      hierarchyFinal = req.body.sector === "all" ? (answerDef.length > 0 ? [].concat(...answerDef) : []) : hierarchy.length > 0 ? [].concat(...hierarchy.map((item) => item.employeename)) : [];
      hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];
      resulted = result
        .map((userObj) => {
          // const matchingHierarchy = hierarchyDefault.find((hierarchyObj) => hierarchyObj.employeename[0] == userObj.companyname);
          return {
            companyname: userObj.companyname,
            unit: userObj.unit,
            department: userObj.department,
            team: userObj.team,
            branch: userObj.branch,
            company: userObj.company,
            originalpassword: userObj.originalpassword,
            username: userObj.username,
            // _id: userObj._id,
            // control: matchingHierarchy ? matchingHierarchy.control : "",
          };
        })
        .filter((data) => hierarchyMap.includes(data.companyname));

    }

    if ((req.body.hierachy === "allhierarchy") &&
      (listpageaccessmode === "Hierarchy Based" ||
        listpageaccessmode === "Overall")) {
      hierarchySecond = await Hirerarchi.find({}, { employeename: 1, supervisorchoose: 1, level: 1, control: 1 });
      hierarchyDefault = await Hirerarchi.find({ supervisorchoose: req.body.username });

      let answerDef = hierarchyDefault.map((data) => data.employeename).flat();

      function findEmployeesRecursive(currentSupervisors, processedSupervisors, result) {
        const filteredData = hierarchySecond.filter((item) =>
          item.supervisorchoose.some((supervisor) => currentSupervisors.includes(supervisor) && !processedSupervisors.has(supervisor))
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

        return findEmployeesRecursive(uniqueNewEmployees, processedSupervisors, result);
      }

      const processedSupervisors = new Set();
      const filteredOverallItem = findEmployeesRecursive(answerDef, processedSupervisors, []);
      let answerDeoverall = filteredOverallItem.filter((data) => req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"].includes(data.level) : data.level == req.body.sector).map(item => item.employeename[0]);

      resultedTeam = result.map((userObj) => {
        // const matchingHierarchycontrol = filteredOverallItem.find(hierarchyObj => hierarchyObj.employeename[0] == userObj.companyname);
        return {
          companyname: userObj.companyname,
          unit: userObj.unit,
          department: userObj.department,
          team: userObj.team,
          branch: userObj.branch,
          company: userObj.company,
          originalpassword: userObj.originalpassword,
          username: userObj.username,
          // _id: userObj._id,
          // level: matchingHierarchycontrol ? matchingHierarchycontrol.level : "",
          // control: matchingHierarchycontrol ? matchingHierarchycontrol.control : "",
        };
      })
        .filter((data) => answerDeoverall.includes(data.companyname));

      let hierarchyallfinal = await Hirerarchi.find({ employeename: { $in: answerDeoverall.map(item => item) }, level: req.body.sector });
      hierarchyFinal = req.body.sector === "all" ? (answerDeoverall.length > 0 ? [].concat(...answerDeoverall) : []) : hierarchyallfinal.length > 0 ? [].concat(...hierarchyallfinal.map((item) => item.employeename)) : [];



      primaryhierarchyall = resultedTeam.filter(item => item.level == "Primary").map(item => item.companyname);


      secondaryhierarchyall = resultedTeam.filter(item => item.level == "Secondary").map(item => item.companyname);

      tertiaryhierarchyall = resultedTeam.filter(item => item.level == "Tertiary").map(item => item.companyname);



    }

    if ((req.body.hierachy === "myallhierarchy") &&
      (listpageaccessmode === "Hierarchy Based" ||
        listpageaccessmode === "Overall")) {
      hierarchySecond = await Hirerarchi.find({}, { employeename: 1, supervisorchoose: 1, level: 1, control: 1 });
      hierarchyDefault = await Hirerarchi.find({ supervisorchoose: req.body.username });

      let answerDef = hierarchyDefault.map((data) => data.employeename);


      function findEmployeesRecursive(currentSupervisors, processedSupervisors, result) {
        const filteredData = hierarchySecond.filter((item) =>
          item.supervisorchoose.some((supervisor) => currentSupervisors.includes(supervisor) && !processedSupervisors.has(supervisor))
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

        return findEmployeesRecursive(uniqueNewEmployees, processedSupervisors, result);
      }

      const processedSupervisors = new Set();
      const filteredOverallItem = findEmployeesRecursive([req.body.username], processedSupervisors, []);
      let answerDeoverall = filteredOverallItem.filter((data) => req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"].includes(data.level) : data.level == req.body.sector).map(item => item.employeename[0]);

      filteredoverall = result.map((userObj) => {
        // const matchingHierarchycontrol = filteredOverallItem.find(hierarchyObj => hierarchyObj.employeename[0] == userObj.companyname);
        return {
          companyname: userObj.companyname,
          unit: userObj.unit,
          department: userObj.department,
          team: userObj.team,
          branch: userObj.branch,
          company: userObj.company,
          originalpassword: userObj.originalpassword,
          username: userObj.username,
          // _id: userObj._id,
          // level: matchingHierarchycontrol ? matchingHierarchycontrol.level : "",
          // control: matchingHierarchycontrol ? matchingHierarchycontrol.control : "",
        };
      })
        .filter((data) => answerDeoverall.includes(data.companyname));

      let hierarchyallfinal = await Hirerarchi.find({ employeename: { $in: answerDeoverall.map(item => item) }, level: req.body.sector });
      hierarchyFinal = req.body.sector === "all" ? (answerDeoverall.length > 0 ? [].concat(...answerDeoverall) : []) : hierarchyallfinal.length > 0 ? [].concat(...hierarchyallfinal.map((item) => item.employeename)) : [];



      primaryhierarchyfinal = filteredoverall.filter(item => item.level == "Primary").map(item => item.companyname);

      secondaryhierarchyfinal = filteredoverall.filter(item => item.level == "Secondary").map(item => item.companyname);
      tertiaryhierarchyfinal = filteredoverall.filter(item => item.level == "Tertiary").map(item => item.companyname);
      resultAccessFilter = filteredoverall || [];
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
            ? overallMyallList
            : result;
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!result) {
    return next(new ErrorHandler("No data found!", 404));
  }
  return res.status(200).json({

    resultAccessFilter,
  });
});

exports.getAllNoticeHierarchyList = catchAsyncErrors(async (req, res, next) => {
  let resultAccessFilter, filteredoverall, hierarchySecond, hierarchyFinal;

  try {
    const { listpageaccessmode = "Hierarchy Based" } = req.body;

    let levelFinal = req.body?.sector === "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body?.sector]
    // console.log(levelFinal, "lof")

    let answer = await Hirerarchi.aggregate([
      {
        $match: {
          supervisorchoose:
            req?.body?.username, // Match supervisorchoose with username
          level: { $in: levelFinal } // Corrected unmatched quotation mark
        }
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


    // console.log(answer, "answer")
    let restrictList = answer?.filter(data => data?.reportData?.length > 0)?.flatMap(Data => Data?.employeename)

    // console.log(restrictList, "restrictList")

    let prodresult;
    if (listpageaccessmode === "Reporting to Based") {
      let reportingusers = await User.find(
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
      const companyNames = reportingusers.map((user) => user.companyname);
      prodresult = await Noticeperiod.find({
        empname: { $in: companyNames }, // Use companyNames array here
      });
    } else {
      prodresult = await Noticeperiod.find();
    }

    //myhierarchy dropdown
    // if (req.body.hierachy === "myallhierarchy") {
    hierarchySecond = await Hirerarchi.find(
      {},
      { employeename: 1, supervisorchoose: 1, level: 1, control: 1 }
    );
    let hierarchyDefault = await Hirerarchi.find(
      { supervisorchoose: { $in: [req.body.username] } },
      {}
    );

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

    filteredoverall = prodresult
      .map((userObj) => {
        const matchingHierarchycontrol = filteredOverallItem.find(
          (hierarchyObj) => hierarchyObj.employeename[0] == userObj.empname
        );
        return {
          empname: userObj.empname,
          empcode: userObj.empcode,
          company: userObj.company,
          branch: userObj.branch,
          unit: userObj.unit,
          team: userObj.team,
          department: userObj.department,
          reasonleavingname: userObj.reasonleavingname,
          approvenoticereq: userObj.approvenoticereq,
          status: userObj.status,
          noticedate: userObj.noticedate,
          files: userObj.files,
          requestdatestatus: userObj.requestdatestatus,
          cancelstatus: userObj.cancelstatus,
          continuestatus: userObj.continuestatus,
          meetingscheduled: userObj.meetingscheduled,
          requestdatereason: userObj.requestdatereason,
          approvedStatus: userObj.approvedStatus,
          approvedthrough: userObj.approvedthrough,
          rejectStatus: userObj.rejectStatus,
          recheckStatus: userObj.recheckStatus,
          rejectnoticereq: userObj.rejectnoticereq,
          cancelreason: userObj.cancelreason,
          continuereason: userObj.continuereason,
          _id: userObj._id,
        };
      })
      .filter((data) => answerDeoverall.includes(data.empname));

    // console.log(filteredoverall, "filteredoverall")

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

    let resultAccessFiltered = filteredoverall;

    resultAccessFiltered =
      listpageaccessmode === "Hierarchy Based" ||
        listpageaccessmode === "Overall"
        ? filteredoverall
        : prodresult;

    // console.log(resultAccessFiltered?.filter(data => restrictList?.includes(data?.companyname)), "condi")
    resultAccessFilter = restrictList?.length > 0 ? resultAccessFiltered?.filter(data => restrictList?.includes(data?.empname)) : [];

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  // if (!resultAccessFilter) {
  //   return next(new ErrorHandler("No data found!", 404));
  // }
  return res.status(200).json({
    resultAccessFilter,
  });
});




exports.getAllHierarchyReportingTo = catchAsyncErrors(async (req, res, next) => {
  let result;
  try {
    const { team } = req.body;
    result = await Hirerarchi.aggregate([
      {
        $facet: {
          matchedData: [
            { $match: { team: team } },
            { $unwind: "$supervisorchoose" },
            { $group: { _id: null, supervisorchoose: { $addToSet: "$supervisorchoose" } } },
            { $project: { _id: 0, supervisorchoose: 1 } }
          ],
          allData: [
            { $unwind: "$supervisorchoose" },
            { $group: { _id: null, supervisorchoose: { $addToSet: "$supervisorchoose" } } },
            { $project: { _id: 0, supervisorchoose: 1 } }
          ]
        }
      },
      {
        $project: {
          result: {
            $cond: {
              if: { $gt: [{ $size: "$matchedData" }, 0] },
              then: "$matchedData",
              else: "$allData"
            }
          }
        }
      },
      { $unwind: "$result" }
    ]
    );

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    result,
  });
});

// get All Hirerarchi Deisgnation Log Relation=> /api/getAllHierarchyDesignationLogRelations
exports.getAllHierarchyDesignationLogRelations = catchAsyncErrors(async (req, res, next) => {
  let newdata, olddata, olddataEmp;
  let { designation, desiggroup, user } = req.body;
  console.log(designation, desiggroup, user?.team, user?.branch, user?.unit, 'cer')
  try {

    //Supervisor
    //checking the data exist for new Hierarchy Group with conditions (department ? department : team )
    newdata = await Hirerarchi.aggregate([
      {
        $match: {
          designationgroup: desiggroup,
          employeename: { $ne: user?.companyname },
          supervisorchoose: { $ne: user?.companyname },
        }
      },
      {
        $facet: {
          nonEmptyDepartment: [
            {
              $match: {
                department: { $ne: "" }
              }
            },
            {
              $match: {
                department: {
                  $in: [user?.department, "All"]
                }
              }
            }
          ],
          emptyDepartment: [
            {
              $match: {
                department: { $eq: "" },
              }
            },
            {
              $match: {
                branch: { $in: [user?.branch, "All"] },
                unit: { $in: [user?.unit, "All"] },
                team: { $in: [user?.team] }
              }
            }
          ],
          emptyDepartmentAll: [
            {
              $match: {
                department: { $eq: "" },
              }
            },
            {
              $match: {
                branch: { $in: [user?.branch, "All"] },
                unit: { $in: [user?.unit, "All"] },
                team: { $in: ["All"] }
              }
            }
          ],
        }
      },
      {
        $project: {
          primaryDep: {
            $filter: {
              input: "$emptyDepartment",
              as: "item",
              cond: { $eq: ["$$item.level", "Primary"] }
            }
          },
          secondaryDep: {
            $filter: {
              input: "$emptyDepartment",
              as: "item",
              cond: { $eq: ["$$item.level", "Secondary"] }
            }
          },
          tertiaryDep: {
            $filter: {
              input: "$emptyDepartment",
              as: "item",
              cond: { $eq: ["$$item.level", "Tertiary"] }
            }
          },
          primaryDepAll: {
            $filter: {
              input: "$emptyDepartmentAll",
              as: "item",
              cond: { $eq: ["$$item.level", "Primary"] }
            }
          },
          secondaryDepAll: {
            $filter: {
              input: "$emptyDepartmentAll",
              as: "item",
              cond: { $eq: ["$$item.level", "Secondary"] }
            }
          },
          tertiaryDepAll: {
            $filter: {
              input: "$emptyDepartmentAll",
              as: "item",
              cond: { $eq: ["$$item.level", "Tertiary"] }
            }
          },
          primaryNotDep: {
            $filter: {
              input: "$nonEmptyDepartment",
              as: "item",
              cond: { $eq: ["$$item.level", "Primary"] }
            }
          },
          secondaryNotDep: {
            $filter: {
              input: "$nonEmptyDepartment",
              as: "item",
              cond: { $eq: ["$$item.level", "Secondary"] }
            }
          },
          tertiaryNotDep: {
            $filter: {
              input: "$nonEmptyDepartment",
              as: "item",
              cond: { $eq: ["$$item.level", "Tertiary"] }
            }
          }
        }
      }
    ]

    );



    //identify the user data related to the companyname to replace
    olddata = await Hirerarchi.aggregate([
      {
        "$match": {
          "supervisorchoose": user?.companyname,
          "$expr": {
            "$cond": [
              {
                "$ne": [
                  { "$ifNull": ["$department", ""] },
                  ""
                ]
              },
              {
                "$or": [
                  { "department": user?.department },
                  { "department": "All" }
                ]
              },
              {
                "$and": [
                  { "unit": user?.unit },
                  {
                    "$or": [
                      { "team": user?.team },
                      { "team": "All" }
                    ]
                  }
                ]
              }
            ]
          }
        }
      }
    ]
    );

    // Employee
    //identify the user data related to the companyname to replace
    olddataEmp = await Hirerarchi.aggregate([
      {
        "$match": {
          "employeename": user?.companyname,
        }
      }
    ]
    );


  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    newdata, olddata, olddataEmp
  });
});

exports.getAllHierarchyProcessTeamRelations = catchAsyncErrors(async (req, res, next) => {
  let newdata, olddata, supData;
  let { team, oldteam, user, desiggroup } = req.body;
  // console.log(team, oldteam, user.branch, user.unit, desiggroup,user?.companyname,  'Teasdssm')
  try {

    newdata = await Hirerarchi.aggregate([
      {
        $facet: {
          team: [
            {
              $match: {
                designationgroup: { $in: [desiggroup, "All"] },
                branch: { $in: [user?.branch, "All"] },
                unit: { $in: [user?.unit, "All"] },
                team: team
              }
            }
          ],
          all: [
            {
              $match: {
                designationgroup: { $in: [desiggroup, "All"] },
                branch: { $in: [user?.branch, "All"] },
                unit: { $in: [user?.unit, "All"] },
                team: "All"
              }
            }
          ]
        }
      },
    ]);


    // //identify the user data related to the companyname to replace
    olddata = await Hirerarchi.aggregate([
      {
        $match: {
          designationgroup: { $in: [desiggroup, "All"] },
          branch: { $in: [user?.branch, "All"] },
          unit: { $in: [user?.unit, "All"] },
          team: oldteam,
          employeename: user.companyname,
        }
      }
    ]);
    supData = await Hirerarchi.aggregate([
      {
        $match: {
          supervisorchoose: user.companyname,
        }
      }
    ]);

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    newdata, olddata, supData
    // olddataEmp
  });
});


exports.getNotAssignHierarchyDataBackend = catchAsyncErrors(async (req, res, next) => {
  let teamsdetails, desiglog, designation, combinedResultsArrayIndex, combinedResultsArray, overallNotassign, controls, combinedResultsArrayDepartment;

  try {
    const { assignbranch } = req.body;
    controls = await Designationandcontrolgrouping.find();
    let filterQuery = {};
    // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    if (branchFilter.length > 0) {
      filterQuery = { $or: branchFilter };
    }
    const ans1 = await Hirerarchi.find();
    // Fetch teams and designation logs from the database
    teamsdetails = await Teams.find(filterQuery, { company: 1, branch: 1, unit: 1, teamname: 1, department: 1 });
    desiglog = await DesignationLog.find({}, { department: 1, designation: 1 });
    designation = await DesignationMaster.find({}, { group: 1, name: 1 });

    if (!teamsdetails || !desiglog || !designation) {
      return next(new ErrorHandler("Teams details, Designation log, or Designation Master not found", 404));
    }

    // Combine the data
    const combinedResults = teamsdetails.map(team => {
      // Find the designation(s) that match the department of the current team
      const matchingDesignations = desiglog.filter(log => log.department === team.department);

      // Create a new object with all the necessary fields, matching designations, and group
      return matchingDesignations.map(desig => {
        // Find the matching group from the designation master based on the designation name
        const matchingGroup = designation.find(desigMaster => desigMaster.name === desig.designation);

        return {
          company: team.company,
          branch: team.branch,
          unit: team.unit,
          teamname: team.teamname,
          department: team.department,
          designation: desig.designation,
          group: matchingGroup ? matchingGroup.group : null, // Add group or null if no match is found
        };
      });
    }).flat(); // Flatten the array since map within map creates nested arrays
    const Priorities = ["Primary", "Secondary", "Tertiary"];

    overallNotassign = combinedResults.flatMap((item) => {
      const matchingItems = controls.filter(data => data.designationgroupname === item.group);
      if (matchingItems?.length > 0) {
        return matchingItems.flatMap((ctrl) =>
          Priorities.map((priority) => ({
            team: item.teamname,
            branch: item.branch,
            company: item.company,
            department: item.department,
            unit: item.unit,
            designation: item.designation,
            designationgroup: item.group,
            control: ctrl.controlname,
            level: priority
          }))
        )
      }
      return [];

    }


    );


    // Manual matching process
    combinedResultsArray = overallNotassign.filter(doc1 =>
      !ans1.some(doc2 => {
        if (doc2?.department === "All") {
          return doc1?.designationgroup === doc2?.designationgroup && doc1?.control === doc2?.control && doc1?.level === doc2?.level
        }
        else
          if (doc2?.department !== "All" && doc2?.department !== "") {
            return doc1?.designationgroup === doc2?.designationgroup && doc1?.department === doc2?.department && doc1?.control === doc2?.control && doc1?.level === doc2?.level
          }
          else if (doc2?.department === "") {
            if (doc2?.company === "All") {
              return doc1?.designationgroup === doc2?.designationgroup && doc1?.control === doc2?.control && doc1?.level === doc2?.level
                &&
                doc1?.control === doc2?.control
                && doc1?.level === doc2?.level && doc1?.control === doc2?.control && doc1?.level === doc2?.level
            }
            else if (doc2?.branch === "All") {
              return doc1?.designationgroup === doc2?.designationgroup
                && doc1?.company === doc2?.company && doc1?.control === doc2?.control && doc1?.level === doc2?.level
            }
            else if (doc2?.unit === "All") {
              return doc1?.designationgroup === doc2?.designationgroup && doc1?.company === doc2?.company
                && doc1?.branch === doc2?.branch && doc1?.control === doc2?.control && doc1?.level === doc2?.level
            }
            else if (doc2?.team === "All") {
              return doc1?.designationgroup === doc2?.designationgroup && doc1?.company === doc2?.company
                & doc1?.branch === doc2?.branch && doc1?.unit === doc2?.unit && doc1?.control === doc2.control
                && doc1?.level === doc2?.level
            }
            else if (doc2?.team !== "All" && doc2?.unit !== "All" && doc2?.branch !== "All" && doc2?.company !== "All") {
              return doc1?.designationgroup === doc2?.designationgroup && doc1?.company === doc2?.company
                && doc1?.branch === doc2?.branch && doc1?.unit === doc2?.unit && doc1?.team === doc2?.team
                && doc1?.control === doc2?.control && doc1?.level === doc2?.level
            }
          }
      }
      )
    );
    const index = Number(req?.body?.id);
    console.log(combinedResultsArray?.length)
    combinedResultsArrayIndex = combinedResultsArray[index - 1];


    return res.status(200).json({
      combinedResultsArray,
      combinedResultsArrayIndex
    });
  } catch (err) {
    console.log(err)
    return next(new ErrorHandler("Records not found!", 404));
  }
});

exports.getAllReportingToUserHierarchyRelation = catchAsyncErrors(async (req, res, next) => {
  let newdata, olddata, supData;
  let { team, oldteam, user, desiggroup } = req.body;
  try {
    newdata = await Hirerarchi.aggregate([
      {
        $facet: {
          team: [
            {
              $match: {
                designationgroup: { $in: [desiggroup, "All"] },
                branch: { $in: [user?.branch, "All"] },
                unit: { $in: [user?.unit, "All"] },
                team: team
              }
            }
          ],
          all: [
            {
              $match: {
                designationgroup: { $in: [desiggroup, "All"] },
                branch: { $in: [user?.branch, "All"] },
                unit: { $in: [user?.unit, "All"] },
                team: "All"
              }
            }
          ]
        }
      },
      {
        $project: {
          primaryDep: {
            $filter: {
              input: "$team",
              as: "item",
              cond: { $eq: ["$$item.level", "Primary"] }
            }
          },
          secondaryDep: {
            $filter: {
              input: "$team",
              as: "item",
              cond: { $eq: ["$$item.level", "Secondary"] }
            }
          },
          tertiaryDep: {
            $filter: {
              input: "$team",
              as: "item",
              cond: { $eq: ["$$item.level", "Tertiary"] }
            }
          },
          primaryDepAll: {
            $filter: {
              input: "$all",
              as: "item",
              cond: { $eq: ["$$item.level", "Primary"] }
            }
          },
          secondaryDepAll: {
            $filter: {
              input: "$all",
              as: "item",
              cond: { $eq: ["$$item.level", "Secondary"] }
            }
          },
          tertiaryDepAll: {
            $filter: {
              input: "$all",
              as: "item",
              cond: { $eq: ["$$item.level", "Tertiary"] }
            }
          },
        }
      },
      {
        $project: {
          primaryDepLength: { $size: "$primaryDep" },
          secondaryDepLength: { $size: "$secondaryDep" },
          tertiaryDepLength: { $size: "$tertiaryDep" },
          primaryDepAllLength: { $size: "$primaryDepAll" },
          secondaryDepAllLength: { $size: "$secondaryDepAll" },
          tertiaryDepAllLength: { $size: "$tertiaryDepAll" },
          primaryDep: 1,
          secondaryDep: 1,
          tertiaryDep: 1,
          primaryDepAll: 1,
          secondaryDepAll: 1,
          tertiaryDepAll: 1,
        }
      },
      {
        $project: {
          result: {
            $switch: {
              branches: [
                {
                  case: { $gt: ["$primaryDepLength", 0] },
                  then: "$primaryDep"
                },
                {
                  case: { $gt: ["$secondaryDepLength", 0] },
                  then: "$secondaryDep"
                },
                {
                  case: { $gt: ["$tertiaryDepLength", 0] },
                  then: "$tertiaryDep"
                },
                {
                  case: { $gt: ["$primaryDepAllLength", 0] },
                  then: "$primaryDepAll"
                },
                {
                  case: { $gt: ["$secondaryDepAllLength", 0] },
                  then: "$secondaryDepAll"
                },
                {
                  case: { $gt: ["$tertiaryDepAllLength", 0] },
                  then: "$tertiaryDepAll"
                }
              ],
              default: null
            }
          }
        }
      }
    ]);



    console.log(newdata, 'newData')
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    newdata, olddata, supData
    // olddataEmp
  });
});
// get All Hirerarchi Deisgnation Log Relation=> /api/getAllHierarchyDesignationLogRelations
exports.getAllReportingToDesignationUserHierarchyRelation = catchAsyncErrors(async (req, res, next) => {
  let newdata;
  let { designation, desiggroup, user } = req.body;
  try {

    //Supervisor
    //checking the data exist for new Hierarchy Group with conditions (department ? department : team )
    newdata = await Hirerarchi.aggregate([
      {
        $match: {
          designationgroup: desiggroup,
          employeename: { $ne: user?.companyname },
          supervisorchoose: { $ne: user?.companyname },
        }
      },
      {
        $facet: {
          nonEmptyDepartment: [
            {
              $match: {
                department: { $ne: "" }
              }
            },
            {
              $match: {
                department: {
                  $in: [user?.department, "All"]
                }
              }
            }
          ],
          emptyDepartment: [
            {
              $match: {
                department: { $eq: "" },
              }
            },
            {
              $match: {
                branch: { $in: [user?.branch, "All"] },
                unit: { $in: [user?.unit, "All"] },
                team: { $in: [user?.team] }
              }
            }
          ],
          emptyDepartmentAll: [
            {
              $match: {
                department: { $eq: "" },
              }
            },
            {
              $match: {
                branch: { $in: [user?.branch, "All"] },
                unit: { $in: [user?.unit, "All"] },
                team: { $in: ["All"] }
              }
            }
          ],
        }
      },
      {
        $project: {
          primaryDep: {
            $filter: {
              input: "$emptyDepartment",
              as: "item",
              cond: { $eq: ["$$item.level", "Primary"] }
            }
          },
          secondaryDep: {
            $filter: {
              input: "$emptyDepartment",
              as: "item",
              cond: { $eq: ["$$item.level", "Secondary"] }
            }
          },
          tertiaryDep: {
            $filter: {
              input: "$emptyDepartment",
              as: "item",
              cond: { $eq: ["$$item.level", "Tertiary"] }
            }
          },
          primaryDepAll: {
            $filter: {
              input: "$emptyDepartmentAll",
              as: "item",
              cond: { $eq: ["$$item.level", "Primary"] }
            }
          },
          secondaryDepAll: {
            $filter: {
              input: "$emptyDepartmentAll",
              as: "item",
              cond: { $eq: ["$$item.level", "Secondary"] }
            }
          },
          tertiaryDepAll: {
            $filter: {
              input: "$emptyDepartmentAll",
              as: "item",
              cond: { $eq: ["$$item.level", "Tertiary"] }
            }
          },
          primaryNotDep: {
            $filter: {
              input: "$nonEmptyDepartment",
              as: "item",
              cond: { $eq: ["$$item.level", "Primary"] }
            }
          },
          secondaryNotDep: {
            $filter: {
              input: "$nonEmptyDepartment",
              as: "item",
              cond: { $eq: ["$$item.level", "Secondary"] }
            }
          },
          tertiaryNotDep: {
            $filter: {
              input: "$nonEmptyDepartment",
              as: "item",
              cond: { $eq: ["$$item.level", "Tertiary"] }
            }
          }
        }
      },
      {
        $project: {
          primaryDepLength: { $size: "$primaryDep" },
          secondaryDepLength: { $size: "$secondaryDep" },
          tertiaryDepLength: { $size: "$tertiaryDep" },
          primaryDepAllLength: { $size: "$primaryDepAll" },
          secondaryDepAllLength: { $size: "$secondaryDepAll" },
          tertiaryDepAllLength: { $size: "$tertiaryDepAll" },
          primaryNotDepLength: { $size: "$primaryNotDep" },
          secondaryNotDepLength: { $size: "$secondaryNotDep" },
          tertiaryNotDepLength: { $size: "$tertiaryNotDep" },
          primaryDep: 1,
          secondaryDep: 1,
          tertiaryDep: 1,
          primaryDepAll: 1,
          secondaryDepAll: 1,
          tertiaryDepAll: 1,
          primaryNotDepLength: 1,
          secondaryNotDepLength: 1,
          tertiaryNotDepLength: 1,
        }
      },
      {
        $project: {
          result: {
            $switch: {
              branches: [
                {
                  case: { $gt: ["$primaryDepLength", 0] },
                  then: "$primaryDep"
                },
                {
                  case: { $gt: ["$secondaryDepLength", 0] },
                  then: "$secondaryDep"
                },
                {
                  case: { $gt: ["$tertiaryDepLength", 0] },
                  then: "$tertiaryDep"
                },
                {
                  case: { $gt: ["$primaryDepAllLength", 0] },
                  then: "$primaryDepAll"
                },
                {
                  case: { $gt: ["$secondaryDepAllLength", 0] },
                  then: "$secondaryDepAll"
                },
                {
                  case: { $gt: ["$tertiaryDepAllLength", 0] },
                  then: "$tertiaryDepAll"
                }
                ,
                {
                  case: { $gt: ["$primaryNotDepLength", 0] },
                  then: "$primaryNotDep"
                }
                ,
                {
                  case: { $gt: ["$secondaryNotDepLength", 0] },
                  then: "$secondaryNotDep"
                }
                ,
                {
                  case: { $gt: ["$tertiaryNotDepLength", 0] },
                  then: "$tertiaryNotDep"
                }
              ],
              default: null
            }
          }
        }
      }
    ]
    );

  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    newdata
  });
});