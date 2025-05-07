const ScheduleEvents = require("../../../model/modules/setup/eventsModel");
const User = require("../../../model/login/auth");
const Teams = require("../../../model/modules/teams");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Unit = require("../../../model/modules/unit");
const moment = require("moment");

//get All ScheduleEventss =>/api/scheduleevent
//get All ScheduleEventss =>/api/scheduleevent
exports.getAllScheduleEvents = catchAsyncErrors(async (req, res, next) => {
  let scheduleevent;
  try {
    const { assignbranch } = req.body;

    const branchFilter = assignbranch.map((branchObj) => ({
      $and: [
        { company: { $elemMatch: { $eq: branchObj.company } } },
        { branch: { $elemMatch: { $eq: branchObj.branch } } },
        { unit: { $elemMatch: { $eq: branchObj.unit } } },
      ],
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    const filterQuery = { $or: branchFilter };

    scheduleevent = await ScheduleEvents.find(filterQuery);
    // scheduleevent = await ScheduleEvents.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!scheduleevent) {
    return next(new ErrorHandler("ScheduleEvents not found!", 404));
  }
  return res.status(200).json({
    scheduleevent,
  });
});


exports.getAllScheduleEventsHome = catchAsyncErrors(async (req, res, next) => {
  let scheduleevent;
  try {
    const { assignbranch } = req.body;

    const branchFilter = assignbranch.map((branchObj) => ({
      $and: [
        { company: { $elemMatch: { $eq: branchObj.company } } },
        { branch: { $elemMatch: { $eq: branchObj.branch } } },
        { unit: { $elemMatch: { $eq: branchObj.unit } } },
      ],
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    const filterQuery = { $or: branchFilter };

    scheduleevent = await ScheduleEvents.find(filterQuery, { eventname: 1, eventdescription: 1 });
    // scheduleevent = await ScheduleEvents.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!scheduleevent) {
    return next(new ErrorHandler("ScheduleEvents not found!", 404));
  }
  return res.status(200).json({
    scheduleevent,
  });
});

//create new scheduleevent => /api/scheduleevent/new
exports.addScheduleEvents = catchAsyncErrors(async (req, res, next) => {
  let ascheduleevent = await ScheduleEvents.create(req.body);
  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Single scheduleevent=> /api/scheduleevent/:id
exports.getSingleScheduleEvents = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let sscheduleevent = await ScheduleEvents.findById(id);
  if (!sscheduleevent) {
    return next(new ErrorHandler("ScheduleEvents not found", 404));
  }
  return res.status(200).json({
    sscheduleevent,
  });
});
//update scheduleevent by id => /api/scheduleevent/:id
exports.updateScheduleEvents = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let uscheduleevent = await ScheduleEvents.findByIdAndUpdate(id, req.body);
  if (!uscheduleevent) {
    return next(new ErrorHandler("ScheduleEvents not found", 404));
  }

  return res.status(200).json({ message: "Updated successfully" });
});
//delete scheduleevent by id => /api/scheduleevent/:id
exports.deleteScheduleEvents = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  let dscheduleevent = await ScheduleEvents.findByIdAndRemove(id);
  if (!dscheduleevent) {
    return next(new ErrorHandler("ScheduleEvents not found", 404));
  }

  return res.status(200).json({ message: "Deleted successfully" });
});

//get unit based on branch =>/api/getunitbybranch
exports.getUnit = catchAsyncErrors(async (req, res, next) => {
  let unitbybranch;
  try {
    unitbybranch = await Unit.find({ branch: { $eq: req.body.branch } });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  if (!unitbybranch) {
    return next(new ErrorHandler("Branch not found!", 404));
  }
  return res.status(200).json({
    unitbybranch,
  });
});

//get team based on branch and unit =>/api/getteambybranchandunit
exports.getTeam = catchAsyncErrors(async (req, res, next) => {
  let teambyunit;
  try {
    if (req.body.unit === "ALL") {
      teambyunit = await Teams.find({ branch: { $eq: req.body.branch } });
    } else {
      teambyunit = await Teams.find({
        $and: [{ branch: { $eq: req.body.branch } }, { unit: { $eq: req.body.unit } }],
      });
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!teambyunit) {
    return next(new ErrorHandler("Branch not found!", 404));
  }
  return res.status(200).json({
    teambyunit,
  });
});

exports.getParticipants = catchAsyncErrors(async (req, res, next) => {
  let participants, users;
  try {
    users = await User.find(
      {
        enquirystatus: {
          $nin: ["Enquiry Purpose"]
        },
        resonablestatus: {
          $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
        }
      },
      { resonablestatus: 1, companyname: 1, branch: 1, unit: 1, team: 1, _id: 1 }
    );
    if (req.body.unit === "ALL" && req.body.team === "ALL") {
      participants = users.filter((user) => user.branch === req.body.branch).map((user) => ({ companyname: user.companyname }));
    } else if (req.body.unit === "ALL" && req.body.team !== "ALL") {
      participants = users.filter((user) => user.branch === req.body.branch && user.team === req.body.team).map((user) => ({ companyname: user.companyname }));
    } else if (req.body.unit !== "ALL" && req.body.team === "ALL") {
      participants = users.filter((user) => user.branch === req.body.branch && user.unit === req.body.unit).map((user) => ({ companyname: user.companyname }));
    } else if (req.body.unit !== "ALL" && req.body.team !== "ALL") {
      participants = users.filter((user) => user.branch === req.body.branch && user.unit === req.body.unit && user.team === req.body.team).map((user) => ({ companyname: user.companyname }));
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!participants) {
    return next(new ErrorHandler("Participants not found!", 404));
  }
  return res.status(200).json({
    participants,
  });
});

exports.getAllScheduleEventsFilter = catchAsyncErrors(async (req, res, next) => {
  let scheduleevent, filteredscheduleevent, filteredscheduleeventmeeting;
  try {
    scheduleevent = await ScheduleEvents.find();
    const employeeName = req.body.companyname;
    const filteredEventMeetings = scheduleevent.filter((meeting) => meeting.participants.includes(employeeName));

    if (req.body.role.includes("Manager")) {
      filteredscheduleevent = scheduleevent;
    } else {
      filteredscheduleevent = filteredEventMeetings;
    }

    const selectedFilter = req.body.selectedfilter;

    if (selectedFilter === "Today") {
      const today = moment().startOf("day");
      filteredscheduleeventmeeting = filteredscheduleevent.filter((meeting) => moment(meeting.date).isSame(today, "day"));
    } else if (selectedFilter === "Weekly") {
      const startOfWeek = moment().startOf("week");
      filteredscheduleeventmeeting = filteredscheduleevent.filter((meeting) => moment(meeting.date).isSame(startOfWeek, "week"));
    } else if (selectedFilter === "Monthly") {
      const startOfMonth = moment().startOf("month");
      filteredscheduleeventmeeting = filteredscheduleevent.filter((meeting) => moment(meeting.date).isSame(startOfMonth, "month"));
    } else if (selectedFilter === "Yearly") {
      const startOfYear = moment().startOf("year");
      filteredscheduleeventmeeting = filteredscheduleevent.filter((meeting) => moment(meeting.date).isSame(startOfYear, "year"));
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!scheduleevent) {
    return next(new ErrorHandler("ScheduleEvents not found!", 404));
  }
  return res.status(200).json({
    filteredscheduleevent,
    filteredscheduleeventmeeting,
  });
});
