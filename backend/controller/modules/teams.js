const Teams = require("../../model/modules/teams");
const Excelmaprespersondata = require("../../model/modules/excel/excelmapresperson");
const User = require("../../model/login/auth");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");
const Hirerarchi = require("../../model/modules/setup/hierarchy");
const DesignationLog = require("../../model/modules/departmentanddesignationgrouping");
const DesignationMaster = require("../../model/modules/designation");
const Controls = require("../../model/modules/controlName");
const Designationandcontrolgrouping = require("../../model/modules/designationandcontrolgrouping");

// get All Teams Details => /api/teams

exports.getAllTeamsDetails = catchAsyncErrors(async (req, res, next) => {
  let teamsdetails;

  try {
    teamsdetails = await Teams.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!teamsdetails) {
    return next(new ErrorHandler("Teams details not found", 404));
  }

  return res.status(200).json({
    // count: teams.length,
    teamsdetails,
  });
});

// Overall team edit
exports.getOverallTeamDetails = catchAsyncErrors(async (req, res, next) => {
  let users, excelmapresperson, hierarchy;

  try {
    users = await User.find({ enquirystatus:{
      $nin: ["Enquiry Purpose"]
     },team: req.body.oldname },{company:1, branch:1,unit:1, team:1});
    excelmapresperson = await Excelmaprespersondata.find({
      todo: {
        $elemMatch: {
          team: req.body.oldname,
        },
      },
    });

    hierarchy = await Hirerarchi.find({ team: req.body.oldname });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!users) {
    return next(new ErrorHandler("Team details not found", 404));
  }
  return res.status(200).json({
    count: users.length + excelmapresperson.length + hierarchy.length,
    users,
    excelmapresperson,
    hierarchy,
  });
});

// get overall delete functionality
exports.getAllTeamsToUnit = catchAsyncErrors(async (req, res, next) => {
  let teamsdetails;

  try {
    teamsdetails = await Teams.find();

    teamsdetails = await Teams.find();
    let query = {
      unit: req.body.checkteam,
    };
    teamsdetails = await Teams.find(query, {
      teamname: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!teamsdetails) {
    return next(new ErrorHandler("Teams details not found", 404));
  }

  return res.status(200).json({
    // count: teams.length,
    teamsdetails,
  });
});

exports.getAllTeamsToDepartment = catchAsyncErrors(async (req, res, next) => {
  let teamsdetails;

  try {
    teamsdetails = await Teams.find();

    teamsdetails = await Teams.find();
    let query = {
      department: req.body.checkteamtodepartment,
    };
    teamsdetails = await Teams.find(query, {
      teamname: 1,
      _id: 1,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!teamsdetails) {
    return next(new ErrorHandler("Teams details not found", 404));
  }

  return res.status(200).json({
    // count: teams.length,
    teamsdetails,
  });
});

exports.getTeamResults = catchAsyncErrors(async (req, res, next) => {
  let teamresults;

  try {
    teamresults = await Teams.find({ name: req.body.unitname });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!teamresults) {
    return next(new ErrorHandler("Teams details not found", 404));
  }

  return res.status(200).json({
    // count: teams.length,
    teamresults,
  });
});

// Create new Teams => /api/team/new
exports.addTeamsDetails = catchAsyncErrors(async (req, res, next) => {
  let ateams = await Teams.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Teams => /api/team/:id

exports.getSingleTeamsDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let steamsdetails = await Teams.findById(id);

  if (!steamsdetails) {
    return next(new ErrorHandler("Teams not found", 404));
  }

  return res.status(200).json({
    steamsdetails,
  });
});

// update Teams by id => /api/Qualification/:id

exports.updateTeamsDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let upteamsdetails = await Teams.findByIdAndUpdate(id, req.body);

  if (!upteamsdetails) {
    return next(new ErrorHandler("Teams Details not found", 404));
  }

  return res.status(200).json({ message: "Updates successfully" });
});

// delete Teams by id => /api/Qualification/:id

exports.deleteTeamsDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dteamsdetails = await Teams.findByIdAndRemove(id);

  if (!dteamsdetails) {
    return next(new ErrorHandler("Teams Details not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});


exports.getAllTeamsDetailsDesignationLog = catchAsyncErrors(async (req, res, next) => {
  let teamsdetails, desiglog, designation;

  try {
    const { assignbranch } = req.body;
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
    return res.status(200).json({
      combinedResults,
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
});

exports.getNotAsssignHierarchyList = catchAsyncErrors(async (req, res, next) => {
  let teamsdetails, desiglog, designation, combinedResultsArray, overallNotassign, controls, combinedResultsArrayDepartment;

  try {
    const { assignbranch } = req.body;
    controls = await Controls.find();
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

    overallNotassign = combinedResults.flatMap((item) =>
      controls.flatMap((ctrl) =>
        Priorities.map((priority) => ({
          team: item.teamname,
          branch: item.branch,
          company: item.company,
          department: item.department,
          unit: item.unit,
          designation: item.designation,
          designationgroup: item.group,
          control: ctrl.name,
          level: priority
        }))
      )
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

    return res.status(200).json({
      combinedResultsArray,
    });
  } catch (err) {
    console.log(err)
    return next(new ErrorHandler("Records not found!", 404));
  }
});


exports.getNotAsssignHierarchyListFiltered = catchAsyncErrors(async (req, res, next) => {
  let teamsdetails, desiglog, designation, combinedResultsArray, overallNotassign, controls, combinedResultsArrayDepartment;

  try {
    const { assignbranch } = req.body;
    let Query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers") {
        const value = req.body[key];
        if (value !== "" && value !== "All" && value?.length > 0 && key !== "assignbranch") {
          Query[key] = value;
        }
      }
    });

    // console.log(deiggroup[0]?.group,Query, 'Query')
    const generateMongoQuery = (query) => {
      const mongoQuery = {};

      // Add company to the query if it exists
      if (query.company) {
        mongoQuery.company = query.company
      };

      if (query.branch) {
        mongoQuery.branch = query.branch;
      }
      if (query.unit) {
        mongoQuery.unit = query.unit;
      }
      if (query.team) {
        mongoQuery.team = query.team;
      }
      if (query.department) {
        mongoQuery.department = query.department;
      }
      if (query.designationgroup) {
        mongoQuery.designationgroup = query.designationgroup;
      }
      if (query.designation) {
        mongoQuery.designation = query.designation
      }
      if (query.controls) {
        mongoQuery.control = query.controls;
      }

      return mongoQuery;
    };





    const mongoQuery = generateMongoQuery(Query);
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
      const matchingDesignations = desiglog.filter(log => log.department === team.department);
      return matchingDesignations.map(desig => {
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


    // Convert query values to Sets for fast lookup
    const querySets = {};
    for (const key in mongoQuery) {
      if (Array.isArray(mongoQuery[key])) {
        querySets[key] = new Set(mongoQuery[key]);
      }
    }

    // Filter the array based on the dynamic keys in mongoQuery
    const filteredAnswer = combinedResultsArray.filter(item =>
      Object.keys(querySets).every(key => querySets[key].has(item[key]))
    );




    return res.status(200).json({
      combinedResultsArray,
      filteredAnswer
    });
  } catch (err) {
    console.log(err)
    return next(new ErrorHandler("Records not found!", 404));
  }
});


exports.getAllTeamsDetailsAssignBranch = catchAsyncErrors(async (req, res, next) => {
  
  const { assignbranch } = req.body;

  // Create a query array for company and branch
  const query = {
    $or: assignbranch.map(item => ({
      company: item.company,
      branch: item.branch,
      unit: item.unit, 
    }))
  };
  
  let teamsdetails;

  try {
    teamsdetails = await Teams.find(query);
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!teamsdetails) {
    return next(new ErrorHandler("Teams details not found", 404));
  }

  return res.status(200).json({
    // count: teams.length,
    teamsdetails,
  });
});
