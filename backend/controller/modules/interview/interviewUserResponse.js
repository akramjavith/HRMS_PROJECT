const Noticeperiodapply = require("../../../model/modules/recruitment/noticeperiodapply");
const Interviewuserresponse = require("../../../model/modules/interview/InterviewUserResponse");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const moment = require("moment");
const Addcandidate = require("../../../model/modules/recruitment/addcandidate");
const mongoose = require("mongoose");

//get All Interviewuserresponse =>/api/Interviewuserresponse
exports.getAllInterviewUserResponse = catchAsyncErrors(
  async (req, res, next) => {
    let interviewuserresponses;
    try {
      interviewuserresponses = await Interviewuserresponse.find();
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!interviewuserresponses) {
      return next(new ErrorHandler("Interview User Response not found!", 404));
    }
    return res.status(200).json({
      interviewuserresponses,
    });
  }
);

//create new Interviewuserresponse => /api/Interviewuserresponse/new
exports.addInterviewUserResponse = catchAsyncErrors(async (req, res, next) => {
  // let checkmain = await Addexists.findOne({ name: req.body.name });
  // if (checkmain) {
  //     return next(new ErrorHandler('Name already exist!', 400));
  // }
  let ainterviewuserresponse = await Interviewuserresponse.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single Interviewuserresponse => /api/Interviewuserresponse/:id
exports.getSingleInterviewUserResponse = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let sinterviewuserresponse = await Interviewuserresponse.findById(id);
    if (!sinterviewuserresponse) {
      return next(new ErrorHandler("Interview User Response not found", 404));
    }
    return res.status(200).json({
      sinterviewuserresponse,
    });
  }
);

//update Interviewuserresponse by id => /api/Interviewuserresponse/:id
exports.updateInterviewUserResponse = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let uinterviewuserresponse = await Interviewuserresponse.findByIdAndUpdate(
      id,
      req.body
    );
    if (!uinterviewuserresponse) {
      return next(new ErrorHandler("Interview User Response not found", 404));
    }

    return res.status(200).json({ message: "Updated successfully" });
  }
);

//delete Interviewuserresponse by id => /api/Interviewuserresponse/:id
exports.deleteInterviewUserResponse = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;
    let dinterviewuserresponse = await Interviewuserresponse.findByIdAndRemove(
      id
    );
    if (!dinterviewuserresponse) {
      return next(new ErrorHandler("Interview User Response not found", 404));
    }

    return res.status(200).json({ message: "Deleted successfully" });
  }
);

//interview login

// Login candidate => api/interviewlogin
exports.interviewLogin = catchAsyncErrors(async (req, res, next) => {
  const { username, password, linkid, by } = req.body;

  // Check if username & password entered by user
  if (!username || !password) {
    return next(new ErrorHandler("Please enter username and password", 400));
  }

  // Finding if candidate exists in database
  const user = await Addcandidate.findOne({ username }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Username or Password", 401));
  }

  // If checks password is correct or not
  // const isPwdMatched = await bcrypt.compare(password, user.password);
  const isPwdMatched = password === user.password ? true : false;

  if (!isPwdMatched) {
    return next(new ErrorHandler("Invalid Password", 401));
  }

  const filteredItem = user?.interviewrounds?.find((item) => {
    // Extract the ID from the link
    // const linkParts = item?.roundlink?.split("/");
    // const id = linkParts[linkParts?.length - 1];
    const id = item?._id?.toString();
    return (
      id === linkid &&
      (by === "HR"
        ? item?.roundstatus === "Interview Scheduled" ||
          item?.roundstatus === "Candidate Completed"
        : item?.roundstatus === "Interview Scheduled")
    );
  });

  if (!filteredItem) {
    return next(new ErrorHandler("No Test Scheduled For You", 401));
  }

  const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
  const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false }); // Get current time in HH:MM format

  const interviewDate = moment(filteredItem?.roundCreatedAt).format(
    "YYYY-MM-DD"
  );
  const interviewTime = moment(filteredItem?.roundCreatedAt).format("HH:mm");
  const deadlineDate = filteredItem?.deadlinedate;
  const deadlineTime = filteredItem?.deadlinetime;

  // // Parse the individual components of interviewDate
  const [interviewYear, interviewMonth, interviewDay] = interviewDate
    ?.split("-")
    .map(Number);

  // Parse the individual components of interviewTime
  const [interviewHour, interviewMinute] = interviewTime.split(":").map(Number);

  // Create a new Date object for interviewDateTime
  const interviewDateTime = new Date(
    interviewYear,
    interviewMonth - 1,
    interviewDay,
    interviewHour,
    interviewMinute
  );
  // const interviewDateTime = new Date(filteredItem?.roundCreatedAt);

  // Parse the individual components of deadlineDate
  const [deadlineYear, deadlineMonth, deadlineDay] = deadlineDate
    ?.split("-")
    .map(Number);

  // Parse the individual components of deadlineTime
  const [deadlineHour, deadlineMinute] = deadlineTime?.split(":").map(Number);

  // Create a new Date object for deadlineDateTime
  const deadlineDateTime = new Date(
    deadlineYear,
    deadlineMonth - 1,
    deadlineDay,
    deadlineHour,
    deadlineMinute
  );
  // Current date and time
  const currentDateTime = new Date();

  // Check if the current date and time are within the interview window
  if (
    currentDateTime >= interviewDateTime &&
    currentDateTime <= deadlineDateTime
  ) {
    return res.status(200).json({
      message: "Login Successful",
      loginstatus: true,
      candidate: user,
      candidateroundid: filteredItem?._id,
      candidateround: filteredItem,
    });
  } else if (currentDateTime > deadlineDateTime) {
    return next(new ErrorHandler("Test Expired", 401));
  } else if (currentDateTime < interviewDateTime) {
    return next(
      new ErrorHandler(
        `Your Test Starts at ${moment(interviewDateTime).format(
          "hh:mm A on DD-MM-YYYY"
        )}`,
        401
      )
    );
  } else {
    return next(new ErrorHandler("No Test Scheduled Today", 401));
  }
});

exports.getInterviewRoundById = catchAsyncErrors(async (req, res, next) => {
  const { candidateid, roundids } = req.params;

  try {
    const result = await Addcandidate.findOne(
      { _id: candidateid },
      { interviewrounds: { $elemMatch: { _id: roundids } } }
    );

    if (!result) {
      return next(new ErrorHandler("No Test Scheduled For You", 401));
    }

    const interviewRound = result.interviewrounds[0];

    return res.status(200).json({ interviewRound });
  } catch (err) {
    return next(new ErrorHandler("Internal Server Error", 500));
  }
});

//update interview round data

exports.updateCandidateStatus = catchAsyncErrors(async (req, res, next) => {
  const subid = req.params.id;
  const updateFields = req.body;

  try {
    // Construct the update object with $set operator
    const updateObj = { $set: {} };
    for (const key in updateFields) {
      updateObj.$set[`interviewrounds.$.${key}`] = updateFields[key];
    }

    const uploaddata = await Addcandidate.findOneAndUpdate(
      { "interviewrounds._id": subid },
      //   { $set: { "interviewrounds.$.roundstatus": req.body.roundstatus } },
      updateObj,
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
});

// exports.updateCandidateStatus = catchAsyncErrors(async (req, res, next) => {
//   const subid = req.params.id;
//   const updateFields = req.body;
//   try {
//     // Construct update operations for each edited field
//     const updateOperations = [];
//     for (const key in updateFields) {
//       updateOperations.push({
//         updateOne: {
//           filter: { "interviewrounds._id": subid },
//           update: { $set: { [`interviewrounds.$.${key}`]: updateFields[key] } },
//         },
//       });
//     }

//     // Execute bulk write to update the fields
//     const result = await Addcandidate.bulkWrite(updateOperations);

//     if (result.modifiedCount > 0) {
//       return res.status(200).json({ message: "Updated successfully" });
//     } else {
//       return next(new ErrorHandler("No matching document found", 404));
//     }
//   } catch (err) {
//     return next(new ErrorHandler("Internal Server Error", 500)); // Handle internal server error
//   }
// });

//get single round data to view

exports.deleteSingleInterviewRound = catchAsyncErrors(
  async (req, res, next) => {
    const subid = req.params.id;
    try {
      //   const singledatas = await Addcandidate.aggregate([
      //     {
      //       $match: {
      //         "interviewrounds._id": subid,
      //       },
      //     },
      //     {
      //       $project: {
      //         interviewrounds: {
      //           $filter: {
      //             input: "$interviewrounds",
      //             as: "round",
      //             cond: { $eq: ["$$round._id", subid] },
      //           },
      //         },
      //       },
      //     },
      //   ]);

      const deletedata = await Addcandidate.findOneAndUpdate(
        { "interviewrounds._id": subid },
        { $pull: { interviewrounds: { _id: subid } } },
        { new: true }
      );

      if (deletedata.interviewrounds.length > 0) {
        const lastIndex = deletedata.interviewrounds.length - 1;
        deletedata.interviewrounds[lastIndex].nextround = false;
        deletedata.overallstatus =
          deletedata.interviewrounds[lastIndex].roundname;
        await deletedata.save();
      } else if (deletedata.interviewrounds.length === 0) {
        deletedata.overallstatus = "Screened";
        await deletedata.save();
      }

      if (deletedata) {
        return res.status(200).json({ message: "Deleted successfully" });
      } else {
        return next(new ErrorHandler("Something went wrong", 500));
      }
    } catch (err) {
      return next(new ErrorHandler("Internal Server Error", 500)); // Handle internal server error
    }
  }
);


exports.exitInterviewLogin = catchAsyncErrors(async (req, res, next) => {
  const { username, password } = req.body;

  // Check if username & password entered by user
  if (!username || !password) {
    return next(new ErrorHandler("Please enter username and password", 400));
  }

  // Finding if candidate exists in database
  const user = await Noticeperiodapply.findOne({ username }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Username or Password", 401));
  }

  // If checks password is correct or not
  // const isPwdMatched = await bcrypt.compare(password, user.password);
  const isPwdMatched = password === user.password ? true : false;

  if (!isPwdMatched) {
    return next(new ErrorHandler("Invalid Password", 401));
  }

  if (!user?.date && !user?.time) {
    return next(new ErrorHandler("No Test Scheduled For You", 401));
  }


  const dateString = user?.date; // e.g., "2024-08-27"
  const timeString = user?.time; // e.g., "13:30"

  const dateTimeString = `${dateString} ${timeString}`;

  let isInterviewCompleted = user?.interviewForm?.length > 0;

  // Create the Date object
  const interviewDateTime = moment(dateTimeString, "YYYY-MM-DD HH:mm").toDate();

  // Current date and time
  const currentDateTime = new Date();

  if (isInterviewCompleted) {
    return next(new ErrorHandler("Exit Interview Already Completed", 401));
  }
  else if (
    currentDateTime >= interviewDateTime
    // &&
    // currentDateTime <= deadlineDateTime
  ) {
    return res.status(200).json({
      message: "Login Successful",
      loginstatus: true,
      candidate: user,
      // candidateroundid: filteredItem?._id,
      // candidateround: filteredItem,
    });
  }
  //  else if (currentDateTime > deadlineDateTime) {
  //   return next(new ErrorHandler("Test Expired", 401));
  // } 
  else if (currentDateTime < interviewDateTime) {
    return next(
      new ErrorHandler(
        `Your Test Starts at ${moment(interviewDateTime).format(
          "hh:mm A on DD-MM-YYYY"
        )}`,
        401
      )
    );
  } else {
    return next(new ErrorHandler("No Test Scheduled Today", 401));
  }
});
