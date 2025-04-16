const AssignBranch = require("../../model/modules/assignbranch");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");
const User = require("../../model/login/auth")
// get All assignbranch => /api/branches
// get All assignbranch => /api/branches
exports.getAllAssignBranch = catchAsyncErrors(async (req, res, next) => {
  let assignbranch;
  try {
    let query = {};
    Object.keys(req.body).forEach((key) => {
      if (key !== "headers") {
        const value = req.body[key];
        if (value !== "ALL") {
          query[key] = value.toString();
        }
      }
    });
    query.resonablestatus = {
      $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"]
    };
    query.enquirystatus = {
      $nin: ["Enquiry Purpose"]
     };

     const users = await User.find(query, {
      empcode: 1,
      companyname: 1, 
 

});
   // Extract the relevant companynames and empcodes from the found users
   const companyNames = users.map(user => user.companyname);
   const empCodes = users.map(user => user.empcode);

   // Find assign branches where the companyname and empcode match those in the users
    assignbranch = await AssignBranch.find({
      employee: { $in: companyNames },
      employeecode: { $in: empCodes }
   });


    // assignbranch = await AssignBranch.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assignbranch) {
    return next(new ErrorHandler("AssignBranch not found!", 404));
  }
  return res.status(200).json({
    assignbranch,
  }); 
});
exports.usersAssignBranch = catchAsyncErrors(async (req, res, next) => {
  let assignbranch;
  try {
    assignbranch = await AssignBranch.find(
      { employee: req.body.empname, employeecode: req.body.empcode },
      { 
      }
    );
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!assignbranch) {
    return next(new ErrorHandler("AssignBranch not found!", 404));
  }
  return res.status(200).json({
    assignbranch,
  });
});



// Create new assignbranch => /api/assignbranch/new
exports.addAssignBranch = catchAsyncErrors(async (req, res, next) => {
  let checkloc = await AssignBranch.findOne({ code: req.body.code });

  // if (checkloc) {
  //     return next(new ErrorHandler("Code already exist!", 400));
  // }

  let aassignbranch = await AssignBranch.create(req.body);

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single AssignBranch => /api/assignbranch/:id
exports.getSingleAssignBranch = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sassignbranch = await AssignBranch.findById(id);

  if (!sassignbranch) {
    return next(new ErrorHandler("AssignBranch not found!", 404));
  }
  return res.status(200).json({
    sassignbranch,
  });
});
// update assignbranch by id => /api/assignbranch/:id
exports.updateAssignBranch = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let uassignbranch = await AssignBranch.findByIdAndUpdate(id, req.body);

  if (!uassignbranch) {
    return next(new ErrorHandler("AssignBranch not found!", 404));
  }
  return res.status(200).json({ message: "Updated successfully" });
});
// delete assignbranch by id => /api/assignbranch/:id
exports.deleteAssignBranch = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dassignbranch = await AssignBranch.findByIdAndRemove(id);

  if (!dassignbranch) {
    return next(new ErrorHandler("AssignBranch not found!", 404));
  }
  return res.status(200).json({ message: "Deleted successfully" });
});

exports.getSingleUserbranch = catchAsyncErrors(async (req, res, next)=>{
  
  const {empcode,companyname} = req.body;
  const assignbranch = await AssignBranch.find({employeecode:empcode,employee:companyname});

  if (!assignbranch) {
      return next(new ErrorHandler('assignbranch not found', 404)); 
  }

  return res.status(200).json({
      success: true,
      assignbranch
  })
})

// this is un assigned user data
exports.getAllUnAssignBranch = catchAsyncErrors(async (req, res, next) => {
  let unassignedUsers = []; // Array to store users who don't have assigned branches

  try {
    let query = {};

    // Destructure assignbranch from the request body
    const { assignbranch, role } = req.body;
    console.log(role)
    // Construct the branch/company filter using $or
    if (assignbranch && assignbranch.length > 0 && !role.includes("Manager")) {

      query.$or = assignbranch;
    }

    // Apply status filters
    query.resonablestatus = {
      $nin: [
        "Not Joined",
        "Postponed",
        "Rejected",
        "Closed",
        "Releave Employee",
        "Absconded",
        "Hold",
        "Terminate"
      ]
    };
    query.enquirystatus = {
      $nin: ["Enquiry Purpose"]
    };
    const users = await User.find(query, {
      empcode: 1,
      company: 1,
      companyname: 1,
      branch: 1,
      unit: 1,
      username: 1,
    });

    const companyNames = users.map(user => user.companyname);
    const empCodes = users.map(user => user.empcode);


    const assignedBranches = await AssignBranch.find({
      employee: { $in: companyNames },
      employeecode: { $in: empCodes }
    });

    const assignedEmpCodes = new Set(assignedBranches.map(branch => branch.employeecode));

    users.forEach(user => {
      if (!assignedEmpCodes.has(user.empcode)) {
        unassignedUsers.push({
          empcode: user.empcode,
          company: user.company,
          companyname: user.companyname,
          branch: user.branch,
          unit: user.unit,
          username: user.username,
        });
      }
    });

  } catch (err) {
    console.log(err, 'err')

    return next(new ErrorHandler("Records not found!", 404));
  }

  // Return only unassigned users
  if (unassignedUsers.length === 0) {
    return next(new ErrorHandler("No unassigned users found!", 404));
  }

  return res.status(200).json({
    unassignedUsers
  });
});