const Salaryslab = require("../../model/modules/setup/SalarySlabModel")
const Applyleave = require('../../model/modules/leave/applyleave');
const RevenueAmount = require("../../model/modules/production/RevenueAmountModel");
const { format } = require('date-fns');
const ClientUserid = require("../../model/modules/production/ClientUserIDModel")
const User = require("../../model/login/auth");
const ErrorHandler = require("../../utils/errorhandler");
const catchAsyncErrors = require("../../middleware/catchAsyncError");
const bcrypt = require("bcryptjs");
const sendToken = require("../../utils/jwttokentocookie");
const checksendToken = require("../../utils/checkjson");
const sendEmail = require("../../utils/pwdresetmail");
const ProcessTeam = require("../../model/modules/production/ProcessTeamModel");
const Targetpoints = require("../../model/modules/production/targetpoints");
const Noticeperiod = require("../../model/modules/recruitment/noticeperiodapply");
const AssignBranch = require("../../model/modules/assignbranch");
const AutoLogout = require("../../model/modules/settings/autologout");
const { ObjectId } = require("mongodb");
const crypto = require("crypto");
const qrcode = require("qrcode");
const moment = require("moment");
const { authenticator } = require("otplib");
const Token = require("../../model/login/token");
const sendVerificationEmail = require("./sendEmail");
const AdminOverAllSettings = require("../../model/modules/settings/AdminOverAllSettingsModel");
const IndividualSettings = require("../../model/modules/settings/IndividualSettingsModel");
const ClockinIP = require("../../model/modules/settings/clockinipModel");
const ControlCriteria = require("../../model/modules/settings/Attendancecontrolcriteria");
const Shift = require('../../model/modules/shift');
const Attendance = require("../../model/modules/attendance/attendance");
const DepartmentMonth = require("../../model/modules/departmentmonthset");
const ApplyLeave = require('../../model/modules/leave/applyleave');
const Holiday = require('../../model/modules/setup/holidayModel');
const Hirerarchi = require('../../model/modules/setup/hierarchy');
const Designation = require("../../model/modules/designation");
const Leavetype = require('../../model/modules/leave/leavetype');
const Permission = require('../../model/modules/permission/permission');
const EmployeeDocuments = require('../../model/login/employeedocuments');
const MyCheckList = require("../../model/modules/interview/Myinterviewchecklist");
const Company = require("../../model/modules/setup/company");
const workStation = require("../../model/modules/workstationmodel");
const Branch = require("../../model/modules/branch");
const Unit = require("../../model/modules/unit");
const currentDateAttStatus = new Date();
const faceapi = require("face-api.js");
const ShiftGrouping = require('../../model/modules/shiftgrouping');
const Leavecriteria = require("../../model/modules/leave/leavecriteria");





//total employee hierarchy based

exports.getDashboardtHierarchyTeam = catchAsyncErrors(async (req, res, next) => {
  let result, hierarchy, resultAccessFilter,hierarchyfilter,reportingtobaseduser, filteredoverall, hierarchySecond, hierarchyMap, resulted, resultedTeam, hierarchyFinal, hierarchyDefault;

  try {
    const { listpageaccessmode } = req.body;

    let levelFinal = req.body?.sector === "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body?.sector];

    if (listpageaccessmode === "Reporting to Based") {
      let usersss = await Users.find(
        {
          enquirystatus: {
            $nin: ["Enquiry Purpose"],
          },
          resonablestatus: {
            $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
          },
          reportingto: req.body.username,
        },
        {
          empcode: 1,
          companyname: 1,
        }
      ).lean();
    }

    result = await User.find(
      {
        enquirystatus: {
          $nin: ["Enquiry Purpose"],
        },
        // resonablestatus: {
        //   $nin: ["Releave Employee", "Absconded", "Hold", "Terminate"],
        // },
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
    if (req.body.hierachy === "myhierarchy" && (listpageaccessmode === "Hierarchy Based" || listpageaccessmode === "Overall")) {
      hierarchy = await Hirerarchi.find({
        supervisorchoose: req.body.username,
        level: req.body.sector,
      });
      hierarchyDefault = await Hirerarchi.find({
        supervisorchoose: req.body.username,
      });

      let answerDef = hierarchyDefault.map((data) => data.employeename);

      hierarchyFinal = req.body.sector === "all" ? (answerDef.length > 0 ? [].concat(...answerDef) : []) : hierarchy.length > 0 ? [].concat(...hierarchy.map((item) => item.employeename)) : [];
      hierarchyMap = hierarchyFinal.length > 0 ? hierarchyFinal : [];

      hierarchyfilter = await Hirerarchi.find({
        supervisorchoose: req.body.username,
        level: "Primary",
      });
      resulted = result.filter((data) => hierarchyMap.includes(data.companyname));
    }
    // all hierarchy list dropdown
    if (req.body.hierachy === "allhierarchy" && (listpageaccessmode === "Hierarchy Based" || listpageaccessmode === "Overall")) {
      hierarchySecond = await Hirerarchi.find({}, { employeename: 1, supervisorchoose: 1, level: 1, control: 1 });

      let sectorFinal = req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector];

      hierarchyDefault = await Hirerarchi.find({
        supervisorchoose: req.body.username,
        level: { $in: sectorFinal },
      });

      let answerDef = hierarchyDefault.map((data) => data.employeename).flat();

      function findEmployeesRecursive(currentSupervisors, processedSupervisors, result) {
        const filteredData = hierarchySecond.filter((item) => item.supervisorchoose.some((supervisor) => currentSupervisors.includes(supervisor) && !processedSupervisors.has(supervisor)));

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
      let answerDeoverall = filteredOverallItem.filter((data) => (req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"].includes(data.level) : data.level == req.body.sector)).map((item) => item.employeename[0]);

      resultedTeam = result.filter((data) => answerDeoverall.includes(data.companyname));

      let hierarchyallfinal = await Hirerarchi.find({
        employeename: { $in: answerDeoverall.map((item) => item) },
        level: req.body.sector,
      });
      hierarchyFinal = req.body.sector === "all" ? (answerDeoverall.length > 0 ? [].concat(...answerDeoverall) : []) : hierarchyallfinal.length > 0 ? [].concat(...hierarchyallfinal.map((item) => item.employeename)) : [];
    }
    //my + all hierarchy list dropdown
    if (req.body.hierachy === "myallhierarchy" && (listpageaccessmode === "Hierarchy Based" || listpageaccessmode === "Overall")) {
      hierarchySecond = await Hirerarchi.find({}, { employeename: 1, supervisorchoose: 1, level: 1, control: 1 });

      let sectorFinal = req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"] : [req.body.sector];

      hierarchyDefault = await Hirerarchi.find({
        supervisorchoose: req.body.username,
        level: { $in: sectorFinal },
      });

      let answerDef = hierarchyDefault.map((data) => data.employeename);

      function findEmployeesRecursive(currentSupervisors, processedSupervisors, result) {
        const filteredData = hierarchySecond.filter((item) => item.supervisorchoose.some((supervisor) => currentSupervisors.includes(supervisor) && (req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"].includes(item.level) : req.body.sector == item.level) && !processedSupervisors.has(supervisor)));

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
      let answerDeoverall = filteredOverallItem.filter((data) => (req.body.sector == "all" ? ["Primary", "Secondary", "Tertiary"].includes(data.level) : data.level == req.body.sector)).map((item) => item.employeename[0]);

      filteredoverall = result.filter((data) => answerDeoverall.includes(data.companyname));
    }

    if (listpageaccessmode === "Reporting to Based") {
      reportingtobaseduser = result;
    }

    let finalsupervisor = req.body.hierachy == "myhierarchy" ? resulted?.map((Data) => Data?.companyname) : req.body.hierachy == "allhierarchy" ? resultedTeam?.map((Data) => Data?.companyname) : filteredoverall?.map((Data) => Data?.companyname);

    const restrictTeam = await Hirerarchi.aggregate([
      {
        $match: {
          $or: [
            {
              supervisorchoose: { $in: finalsupervisor }, // Matches if supervisorchoose field has a value in finalsupervisor
            },
            {
              employeename: { $in: finalsupervisor }, // Matches if employeename field has a value in finalsupervisor
            },
          ],
          level: { $in: levelFinal }, // Matches if level field has a value in levelFinal
        },
      },
      {
        $lookup: {
          from: "reportingheaders",
          let: {
            teamControlsArray: {
              $ifNull: ["$pagecontrols", []],
            },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $in: ["$name", "$$teamControlsArray"],
                    }, // Check if 'name' is in 'teamcontrols' array
                    {
                      $in: [
                        req?.body?.pagename,
                        "$reportingnew", // Check if 'menuteamloginstatus' is in 'reportingnew' array
                      ],
                    }, // Additional condition for reportingnew array
                  ],
                },
              },
            },
          ],
          as: "reportData", // The resulting matched documents will be in this field
        },
      },
      {
        $project: {
          supervisorchoose: 1,
          employeename: 1,
          reportData: 1,
        },
      },
    ]);
  //  console.log(filteredoverall, "filteredoverall");
    let restrictListTeam = restrictTeam?.filter((data) => data?.reportData?.length > 0)?.flatMap((Data) => Data?.employeename);
    const resultAccessFilterHierarchy = req.body.hierachy === "myhierarchy" ? resulted : req.body.hierachy === "allhierarchy" ? resultedTeam : filteredoverall;
    resultAccessFilter = restrictListTeam?.length > 0 ? resultAccessFilterHierarchy?.filter((data) => restrictListTeam?.includes(data?.companyname)).map(d => d.companyname) : [];
    // console.log(filteredoverall.length, resultAccessFilter, "filteredoverall");
  } catch (err) {
    console.log(err, "err");
    return next(new ErrorHandler("Records not found!", 404));
  }
  return res.status(200).json({
    resultAccessFilter,
  });
});



exports.getUserWithStatusHomeCountTeam = catchAsyncErrors(async (req, res, next) => {
  let allusers;
  try {
    const { pageName, assignbranch,hierarchyempnames } = req.body;
console.log(hierarchyempnames,"hierarchyempnames")
    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));
    let Query = { $or: branchFilter };
    // Define the past 3 days range
    const today = moment();
    const pastThreeAttendaysDays = [today.clone().subtract(1, 'days').format('DD-MM-YYYY'), today.clone().subtract(2, 'days').format('DD-MM-YYYY'), today.clone().subtract(3, 'days').format('DD-MM-YYYY')];
    const pastThreeLeaveDays = [today.clone().subtract(1, 'days').format('DD/MM/YYYY'), today.clone().subtract(2, 'days').format('DD/MM/YYYY'), today.clone().subtract(3, 'days').format('DD/MM/YYYY')];
    const pastThreeDaysISO = [today.clone().subtract(1, 'days').format('YYYY-MM-DD'), today.clone().subtract(2, 'days').format('YYYY-MM-DD'), today.clone().subtract(3, 'days').format('YYYY-MM-DD')];
    // Fetch relevant attendance records for the past 3 days
    let attendance = await Attendance.find(
      {

        date: {
          $in: pastThreeAttendaysDays,
        },
      },
      { date: 1, userid: 1 }
    ).lean();
    // Fetch relevant leave records
    let allLeaveStatus = await ApplyLeave.find(
      {
employeename:{$in:hierarchyempnames},
        date: { $in: pastThreeLeaveDays },
        status: { $nin: ['Rejected', 'Cancel'] },
      },
      { employeename: 1, employeeid: 1, date: 1 }
    ).lean();

    let holidays = await Holiday.find(
      {
        employee:{$in:hierarchyempnames},
        date: { $in: pastThreeDaysISO },
      },
      { date: 1, employee: 1 }
    ).lean();

    let noticeperiodstatus = await Noticeperiod.find(
      { empname:{$in:hierarchyempnames}},
      {
        empname: 1,
        empcode: 1,
        status: 1,
        rejectStatus: 1,
        cancelstatus: 1,
        approvedStatus: 1,
        continuestatus: 1,
        recheckStatus: 1,
      }
    ).lean();

    // Create a map for fast lookup of attendance records
    const attendanceMap = attendance.reduce((acc, item) => {
      const userId = item.userid.toString();
      const date = moment(item.date, 'DD-MM-YYYY').format('DD/MM/YYYY');
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(date);
      return acc;
    }, {});

    // Create a map for fast lookup of leave records
    const myCheckList = await MyCheckList.find({}).lean();
    let leaveWithCheckList = allLeaveStatus
      .map((item) => {
        let foundData = myCheckList?.find((dataNew) => dataNew.commonid == item._id);
        let areAllGroupsCompleted = foundData?.groups?.every((itemNew) => (itemNew.data !== undefined && itemNew.data !== '') || itemNew.files !== undefined);

        if (areAllGroupsCompleted) {
          return {
            ...item,
            updatestatus: 'Completed',
          };
        }
        return null;
      })
      .filter((item) => item);

    // Create a map for fast lookup of leave records
    const leaveMap = leaveWithCheckList.reduce((acc, item) => {
      const userKey = `${item.employeeid}_${item.employeename}`;
      const leaveDates = item.date.map((date) => moment(date, 'DD/MM/YYYY').format('DD/MM/YYYY'));
      if (!acc[userKey]) {
        acc[userKey] = [];
      }
      acc[userKey].push(...leaveDates);
      return acc;
    }, {});

    // Create a map for fast lookup of holiday records
    const holidayMap = holidays.reduce((acc, item) => {
      const date = moment(item.date).format('DD/MM/YYYY');
      item.employee.forEach((employee) => {
        if (!acc[employee]) {
          acc[employee] = [];
        }
        acc[employee].push(date);
      });
      return acc;
    }, {});

    let filterQuery = {
      enquirystatus: {
        $nin: ['Enquiry Purpose'],
      },
      companyname:{$in:hierarchyempnames},
      resonablestatus: {
        $nin: ['Not Joined', 'Postponed', 'Rejected', 'Closed', 'Releave Employee', 'Absconded', 'Hold', 'Terminate'],
      },
      ...Query,
    };

    
    filterQuery.workmode = {
      $ne: 'Internship',
    };
   
    if (branchFilter.length > 0) {
      allusers = await User.countDocuments(filterQuery).lean();
    } else {
      allusers = [];
    }
  } catch (err) {
    return next(new ErrorHandler('Records not found!', 404));
  }



  return res.status(200).json({
    allusers,
  });
});




exports.getAllApplyleaveHomeTeam = catchAsyncErrors(async (req, res, next) => {
  let applyleaves;
  try {

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
    const { assignbranch,hierarchyempnames } = req.body;

    const branchFilter = assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));

    let Query = { $or: branchFilter };

    let filterQuery = {
      status: 'Approved',
      employeename:{$in:hierarchyempnames},
      date: { $in: formattedDate },
      ...Query,
    };
    applyleaves = await Applyleave.countDocuments(filterQuery, { date: 1 });
  } catch (err) {
    return next(new ErrorHandler('Records not found!', 404));
  }

  return res.status(200).json({
    applyleaves,
  });
});




exports.getAllUserHomeCountNotClockInTeam = catchAsyncErrors(async (req, res, next) => {
  let user;

  try {
    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getFullYear()}`;


 let users = await User.find(
      {
        enquirystatus: {
          $nin: ["Enquiry Purpose"],
        },
        companyname:{$in:req.body.hierarchyempnames},
        // resonablestatus: {
        //   $nin: ["Releave Employee", "Absconded", "Hold", "Terminate"],
        // },
      },
      {
        companyname: 1,
        username: 1,
        // _id: 1
      }
    );

    const branchFilter = req.body.assignbranch.map((branchObj) => ({
      branch: branchObj.branch,
      company: branchObj.company,
      unit: branchObj.unit,
    }));
    // let Query = { $or: branchFilter };

    let filterquery = {
      date: formattedDate,
        username:users.map(d => d.username),
      // ...Query,
    };
console.log(formattedDate,users.map(d => d.username),"userssss")
    // if (branchFilter.length > 0) {
      user = await Attendance.countDocuments(filterquery).lean();
    // } else {
    //   user = 0;
    // }

    console.log(user,"user")
  } catch (err) {
    return next(new ErrorHandler('Records not found!', 404));
  }

  // if (!usersstatus) {
  //     return next(new ErrorHandler("Users not found", 400));
  // }

  return res.status(200).json({ user });
});


