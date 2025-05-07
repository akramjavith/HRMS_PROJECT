const ScheduleMeeting = require("../../../model/modules/setup/schedulemeeting");
const Teams = require("../../../model/modules/teams");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const User = require("../../../model/login/auth");
const Role = require("../../../model/modules/role/role");
const moment = require("moment");

// get All Schedule Meeting => /api/allschedulemeetings
exports.getAllScheduleMeeting = catchAsyncErrors(async (req, res, next) => {
  let schedulemeeting;
  try {
    const { assignbranch } = req.body;

    const branchFilter = assignbranch.map((branchObj) => ({
      $and: [
        { company: { $elemMatch: { $eq: branchObj.company } } },
        { branch: { $elemMatch: { $eq: branchObj.branch } } },
        // { unit: { $elemMatch: { $eq: branchObj.unit } } },       
      ],
    }));

    // Use $or to filter incomes that match any of the branch, company, and unit combinations
    const filterQuery = { $or: branchFilter };

    schedulemeeting = await ScheduleMeeting.find(filterQuery);
    // schedulemeeting = await ScheduleMeeting.find();
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!schedulemeeting) {
    return next(new ErrorHandler("Meeting not found!", 404));
  }
  return res.status(200).json({
    schedulemeeting,
  });
});
// Create new Schedule Meeting=> /api/schedulemeeting/new
exports.addScheduleMeeting = catchAsyncErrors(async (req, res, next) => {
  const {
    company,
    branch,
    department,
    team,
    meetingcategory,
    meetingtype,
    branchvenue,
    floorvenue,
    venue,
    link,
    title,
    meetingmode,
    date,
    time,
    duration,
    timezone,
    reminder,
    recuringmeeting,
    repeattype,
    agenda,
    participants,
    uniqueid,
    addedby,
    hostcompany,
    hostbranch,
    hostdepartment,
    hostteam,
    interviewer,
    interviewscheduledby,
    participantsid,
    meetinghostid,
  } = req.body;
  try {
    if (repeattype === "Once") {
      let ascheduleMeeting = await ScheduleMeeting.create(req.body);
    } else if (
      repeattype === "Daily" ||
      repeattype === "Weekly" ||
      repeattype === "Monthly"
    ) {
      const currentDate = new Date();
      const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
      let meetingDate = new Date(date);
      let tempDate = new Date(date);

      while (meetingDate < endOfYear) {
        let day = meetingDate.getDate().toString().padStart(2, "0");
        let month = (meetingDate.getMonth() + 1).toString().padStart(2, "0");
        let year = meetingDate.getFullYear();
        let meetDate = `${year}-${month}-${day}`;
        const scheduleMeeting = new ScheduleMeeting({
          company,
          branch,
          department,
          team,
          meetingcategory,
          meetingtype,
          branchvenue,
          floorvenue,
          venue,
          link,
          title,
          time,
          duration,
          meetingmode,
          timezone,
          reminder,
          recuringmeeting,
          participants,
          date: meetDate,
          repeattype,
          agenda,
          addedby,
          uniqueid,
          hostcompany,
          hostbranch,
          hostdepartment,
          hostteam,
          interviewer,
          interviewscheduledby,
          participantsid,
          meetinghostid,
        });
        await scheduleMeeting.save();
        if (repeattype === "Daily") {
          if (meetingDate.getDay() === 6) {
            meetingDate.setDate(meetingDate.getDate() + 2);
          } else {
            meetingDate.setDate(meetingDate.getDate() + 1);
          }
        } else if (repeattype === "Weekly") {
          meetingDate.setDate(meetingDate.getDate() + 7);
        } else if (repeattype === "Monthly") {
          let meetMonth = new Date(meetingDate);
          meetMonth.setMonth(meetMonth.getMonth() + 1);
          if (meetMonth.getDay() === 0) {
            meetingDate.setMonth(meetingDate.getMonth() + 1);
            meetingDate.setDate(meetingDate.getDate() + 1);
          } else if (meetMonth.getDay() !== tempDate.getDay()) {
            meetingDate.setMonth(meetingDate.getMonth() + 1);
            meetingDate.setDate(tempDate.getDate());
          } else {
            meetingDate.setMonth(meetingDate.getMonth() + 1);
          }
        }
      }
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    message: "Successfully added!",
  });
});

// get Signle Schedule Meeting => /api/schedulemeeting/:id
exports.getSingleScheduleMeeting = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let sschedulemeeting = await ScheduleMeeting.findById(id);

  if (!sschedulemeeting) {
    return next(new ErrorHandler("Meeting not found!", 404));
  }
  return res.status(200).json({
    sschedulemeeting,
  });
});

// get Schedule Meeting log => /api/schedulemeetinglog/:id
exports.getSingleScheduleMeetingLog = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;

    let schedulemeetinglog = await ScheduleMeeting.find({ uniqueid: id });

    if (!schedulemeetinglog) {
      return next(new ErrorHandler("Meeting not found!", 404));
    }
    return res.status(200).json({
      schedulemeetinglog,
    });
  }
);

// update Schedule Meeting by id => /api/schedulemeeting/:id
exports.updateScheduleMeeting = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;
  const { edittype } = req.body;
  if (edittype === "single") {
    let uschedulemeeting = await ScheduleMeeting.findByIdAndUpdate(
      id,
      req.body
    );

    if (!uschedulemeeting) {
      return next(new ErrorHandler("Meeting not found!", 404));
    }
    return res.status(200).json({ message: "Meeting Updated successfully" });
  } else if (edittype === "multiple") {
    const uschedulemeeting = await ScheduleMeeting.updateMany(
      { uniqueid: id },
      { $set: req.body },
      { new: true }
    );

    if (!uschedulemeeting) {
      return next(new ErrorHandler("Meeting not found!", 404));
    }
    return res.status(200).json({ message: "Meeting Updated successfully" });
  }
});

// delete Schedule Meeting by id => /api/schedulemeeting/:id
exports.deleteScheduleMeeting = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  let dscheduleMeeting = await ScheduleMeeting.findByIdAndRemove(id);

  if (!dscheduleMeeting) {
    return next(new ErrorHandler("Schedule Meeting not found!", 404));
  }
  return res.status(200).json({ message: "Meeting Deleted successfully" });
});

// delete Schedule Meeting by id => /api/deletemultipleschedulemeeting/:id
exports.deleteMultipleScheduleMeeting = catchAsyncErrors(
  async (req, res, next) => {
    const uniqueid = req.params.id;

    let dscheduleMeeting = await ScheduleMeeting.deleteMany({ uniqueid });

    if (!dscheduleMeeting) {
      return next(new ErrorHandler("Schedule Meeting not found!", 404));
    }
    return res.status(200).json({ message: "Meeting Deleted successfully" });
  }
);

//get department based on branch and team =>/api/getdeptbybranch
exports.getBranchWiseDept = catchAsyncErrors(async (req, res, next) => {
  let deptbybranch;
  let { branch } = req.body;
  try {
    deptbybranch = await Teams.find({ branch });
    if (req.body.team === "ALL") {
      deptbybranch = await Teams.find({ branch: { $eq: req.body.branch } });
    } else {
      deptbybranch = await Teams.find({
        $and: [
          { branch: { $eq: req.body.branch } },
          { teamname: { $eq: req.body.team } },
        ],
      });
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!deptbybranch) {
    return next(new ErrorHandler("Branch not found!", 404));
  }
  return res.status(200).json({
    deptbybranch,
  });
});

//get  team based on branch =>/api/getteambybranchanddept
exports.getBranchAndDeptWiseTeam = catchAsyncErrors(async (req, res, next) => {
  let teambybranchanddept;
  try {
    teambybranchanddept = await Teams.find({
      branch: { $eq: req.body.branch },
    });
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!teambybranchanddept) {
    return next(new ErrorHandler("Branch not found!", 404));
  }
  return res.status(200).json({
    teambybranchanddept,
  });
});

exports.getParticipantsbyteam = catchAsyncErrors(async (req, res, next) => {
  let participants, users;
  try {
    users = await User.find(
      {
        resonablestatus: {
          $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"]
        },
      },
      {
        resonablestatus: 1,
        companyname: 1,
        branch: 1,
        department: 1,
        team: 1,
        _id: 1,
      }
    );
    if (req.body.department === "ALL" && req.body.team === "ALL") {
      participants = users
        .filter((user) => user.branch === req.body.branch)
        .map((user) => ({ companyname: user.companyname }));
    } else if (req.body.department === "ALL" && req.body.team !== "ALL") {
      participants = users
        .filter(
          (user) =>
            user.branch === req.body.branch && user.team === req.body.team
        )
        .map((user) => ({ companyname: user.companyname }));
    } else if (req.body.department !== "ALL" && req.body.team === "ALL") {
      participants = users
        .filter(
          (user) =>
            user.branch === req.body.branch &&
            user.department === req.body.department
        )
        .map((user) => ({ companyname: user.companyname }));
    } else if (req.body.department !== "ALL" && req.body.team !== "ALL") {
      participants = users
        .filter(
          (user) =>
            user.branch === req.body.branch &&
            user.department === req.body.department &&
            user.team === req.body.team
        )
        .map((user) => ({ companyname: user.companyname }));
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

exports.getAllScheduleMeetingFilter = catchAsyncErrors(
  async (req, res, next) => {
    let schedulemeeting, filteredschedule;

    try {
      schedulemeeting = await ScheduleMeeting.find();
      const employeeName = req.body.companyname;

      const filteredMeetings = schedulemeeting.filter((meeting) =>
        meeting.participants.includes(employeeName)
      );

      filteredschedule = req.body.role.includes("Manager")
        ? schedulemeeting
        : filteredMeetings;
    } catch (err) {
      return next(new ErrorHandler("Records not found!", 404));
    }
    if (!schedulemeeting) {
      return next(new ErrorHandler("Meeting not found!", 404));
    }
    return res.status(200).json({
      filteredschedule,
    });
  }
);

//getn single notice period data
exports.getNoticePeriodScheduleMeeting = catchAsyncErrors(
  async (req, res, next) => {
    const id = req.params.id;

    // Finding the schedule meeting based on notice period ID
    const nschedulemeeting = await ScheduleMeeting.findOne({
      noticeperiodid: id,
    });

    // Checking if the schedule meeting exists
    if (!nschedulemeeting) {
      return res.status(404).json({ error: "Meeting not found!" });
    }

    // Returning the found schedule meeting
    return res.status(200).json({ nschedulemeeting });
  }
);


exports.ScheduleMeetingFilter = catchAsyncErrors(async (req, res, next) => {
  let schedulemeeting, filteredschedule, filteredschedulemeeting;

  try {
    schedulemeeting = await ScheduleMeeting.find();
    // const employeeName = req.body.companyname;
    // const filteredMeetings = schedulemeeting.filter((meeting) =>
    //   meeting.participants.includes(employeeName)
    // );

    // if (req.body.role.includes("Manager")) {
    //   filteredschedule = schedulemeeting;
    // } else {
    //   filteredschedule = filteredMeetings;
    // }

    filteredschedule = schedulemeeting;

    // Apply date filter based on selectedFilter
    const selectedFilter = req.body.selectedfilter; // Get the selected filter from the request body
    if (selectedFilter === "Today") {
      const today = moment().startOf("day");
      filteredschedulemeeting = filteredschedule.filter((meeting) =>
        moment(meeting.date).isSame(today, "day")
      );
    } else if (selectedFilter === "Weekly") {
      const startOfWeek = moment().startOf("week");
      filteredschedulemeeting = filteredschedule.filter((meeting) =>
        moment(meeting.date).isSame(startOfWeek, "week")
      );
    } else if (selectedFilter === "Monthly") {
      const startOfMonth = moment().startOf("month");
      filteredschedulemeeting = filteredschedule.filter((meeting) =>
        moment(meeting.date).isSame(startOfMonth, "month")
      );
    } else if (selectedFilter === "Yearly") {
      const startOfYear = moment().startOf("year");
      filteredschedulemeeting = filteredschedule.filter((meeting) =>
        moment(meeting.date).isSame(startOfYear, "year")
      );
    }
  } catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }
  if (!schedulemeeting) {
    return next(new ErrorHandler("Meeting not found!", 404));
  }
  return res.status(200).json({
    filteredschedule,
    filteredschedulemeeting,
  });
});


exports.ScheduleMeetingFilterHome = catchAsyncErrors(async (req, res, next) => {
  let schedulemeeting, filteredschedule, filteredschedulemeeting;

  try {
    schedulemeeting = await ScheduleMeeting.find({}, { title: 1, agenda: 1, date: 1 });

    filteredschedule = schedulemeeting;


    const selectedFilter = req.body.selectedfilter;
    if (selectedFilter === "Today") {
      const today = moment().startOf("day");
      filteredschedulemeeting = filteredschedule.filter((meeting) =>
        moment(meeting.date).isSame(today, "day")
      );
    } else if (selectedFilter === "Weekly") {
      const startOfWeek = moment().startOf("week");
      filteredschedulemeeting = filteredschedule.filter((meeting) =>
        moment(meeting.date).isSame(startOfWeek, "week")
      );
    } else if (selectedFilter === "Monthly") {
      const startOfMonth = moment().startOf("month");
      filteredschedulemeeting = filteredschedule.filter((meeting) =>
        moment(meeting.date).isSame(startOfMonth, "month")
      );
    } else if (selectedFilter === "Yearly") {
      const startOfYear = moment().startOf("year");
      filteredschedulemeeting = filteredschedule.filter((meeting) =>
        moment(meeting.date).isSame(startOfYear, "year")
      );
    }
  }


  // try {
  //   const selectedFilter = req.body.selectedfilter;
  //   let dateQuery = {};

  // if (selectedFilter === "Today") {
  //   dateQuery.date = {
  //     $gte: moment().startOf("day").toDate(),
  //     $lte: moment().endOf("day").toDate(),
  //   };
  //   } else if (selectedFilter === "Weekly") {
  //     dateQuery.date = {
  //       $gte: moment().startOf("week").toDate(),
  //       $lte: moment().endOf("week").toDate(),
  //     };
  //   } else if (selectedFilter === "Monthly") {
  //     dateQuery.date = {
  //       $gte: moment().startOf("month").toDate(),
  //       $lte: moment().endOf("month").toDate(),
  //     };
  //   } else if (selectedFilter === "Yearly") {
  //     dateQuery.date = {
  //       $gte: moment().startOf("year").toDate(),
  //       $lte: moment().endOf("year").toDate(),
  //     };
  //   }

  //   filteredschedulemeeting = await ScheduleMeeting.find(dateQuery, { title: 1, agenda: 1, date: 1 });

  // }

  catch (err) {
    return next(new ErrorHandler("Records not found!", 404));
  }

  return res.status(200).json({
    filteredschedule,
    filteredschedulemeeting,
  });
});
