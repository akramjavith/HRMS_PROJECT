const Weekoffpresent = require('../../model/modules/weekoffcontrolpanel');
const User = require('../../model/login/auth');
const ErrorHandler = require('../../utils/errorhandler');
const catchAsyncErrors = require('../../middleware/catchAsyncError');
const Daypoint = require('../../model/modules/production/dayPointsUpload');
const Temppoint = require('../../model/modules/production/daypointsuploadtemp');
const Attendance = require('../../model/modules/attendance/attendance');

//get All Weekoffpresent =>/api/Weekoffpresent
exports.getAllWeekoffpresent = catchAsyncErrors(async (req, res, next) => {
    let weekoffpresents;
    try {
        weekoffpresents = await Weekoffpresent.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!weekoffpresents) {
        return next(new ErrorHandler('Weekoffpresent not found!', 404));
    }
    return res.status(200).json({
        weekoffpresents
    });
})

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

const generateDateArrayAfter = (startDateStr, endDateStr) => {
    const dateArray = [];
    const [startDay, startMonth, startYear] = startDateStr.split("/").map(Number);
    
    const [endDay, endMonth, endYear] = endDateStr.split("/").map(Number);

    let currentDate = new Date(startYear, startMonth - 1, startDay);
    const endDate = new Date(endYear, endMonth - 1, endDay);

    while (currentDate <= endDate) {
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();

        dateArray.push(`${day}/${month}/${year}`);
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dateArray;
};

const formatDateAtt = (date) => {
    const [day, month, year] = date.split('-');
    return `${day}/${month}/${year}`;
}

// Map days of the week to indices
const dayIndices = {
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6
};

exports.getAllWeekoffpresentFilter = catchAsyncErrors(async (req, res, next) => {
    let weekoffpresent;
    let users;
    let daypoints;
    let attandances;
    let filterdaypoints = [];
    let filtertemppoints = [];
    let attResult = [];
    let weekoffpresents = [];
    let finalweekoffpresents = [];
    let finalheading = [];
    let dateArray = [];
    
    try {
        const fromDate = new Date(req.body.fromdate);
        const toDate = new Date(req.body.todate);

        const query = {
            companyname: { $in: req.body.employee },
            enquirystatus: {
                    $nin: ["Enquiry Purpose"],
                },
                resonablestatus: {
                    $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
                },
        }
        const dquery = {
            uploaddata: {
                $elemMatch: {
                    name: { $in: req.body.employee }
                }
            }
        }
        const [users, daypoints, temppoints, weekoffpresentall] = await Promise.all([
            User.find(query, { company: 1, branch: 1, unit: 1, team: 1, department: 1, departmentlog: 1, empcode: 1, companyname: 1, username: 1, _id: 1 }).lean(),
            Daypoint.find(dquery, { date: 1, uploaddata: 1 }).lean(),
            Temppoint.find(dquery, { date: 1, uploaddata: 1 }).lean(),
            Weekoffpresent.find({ shiftstatus: req.body.shiftstatus }, { company: 1, filtertype: 1, branch: 1, unit: 1, team: 1, employee: 1, shiftstartday: 1, shiftendday: 1, shiftdaytotal: 1, calstartday: 1, calendday: 1, caldaytotal: 1, weekoffpresentday: 1, shiftstatus: 1 }).lean()
        ]);
        
        let unmatchedUsers = users.flatMap(user => user.companyname);  // Store all employees initially
        
        // Extract the list of _ids from users
        const userIds = users.map(user => user._id);

        // Now query the Attendance collection with the filtered userIds
        attandances = await Attendance.find(
            { userid: { $in: userIds }, },
            { userid: 1, date: 1, weekoffpresentstatus: 1 }
        ).lean();

        // Convert users to a map for quick lookup
        const userMap = new Map(users.map(user => [user.companyname, user]));

        // Helper function to check if a user matches a given filter type
        const matchesFilter = (user, filter, filtertype) => {
            switch (filtertype) {
                case 'Team':
                    return (
                        filter.company === user.company &&
                        filter.branch.includes(user.branch) &&
                        filter.unit.includes(user.unit) &&
                        filter.team.includes(user.team)
                    );
                case 'Unit':
                    return (
                        filter.company === user.company &&
                        filter.branch.includes(user.branch) &&
                        filter.unit.includes(user.unit)
                    );
                case 'Branch':
                    return (
                        filter.company === user.company &&
                        filter.branch.includes(user.branch)
                    );
                default:
                    return false;
            }
        };

        // Function to process matching data for different filter types
        const processWeekoffPresent = (weekoffpresent, filtertype) => {
            let matchedEmployees = [];

            if (filtertype === 'Individual') {
                // For Individual filter, we directly filter by employee names
                matchedEmployees = weekoffpresent.employee.filter(emp => unmatchedUsers.includes(emp));
            } else {
                // For Team, Unit, Branch filters, we filter based on company, branch, etc.
                matchedEmployees = unmatchedUsers.filter(emp => {
                    const user = userMap.get(emp);
                    return user && matchesFilter(user, weekoffpresent, filtertype);
                });
            }

            if (matchedEmployees.length > 0) {
                matchedEmployees.forEach(emp => {
                    const user = userMap.get(emp);
                    if (user) {
                        // Push matched user data to weekoffpresents array
                        weekoffpresents.push({
                            id: user._id.toString(),
                            userid: user._id.toString(),
                            empcode: user.empcode,
                            username: user.companyname,
                            rowusername: user.username,
                            company: user.company,
                            branch: user.branch,
                            unit: user.unit,
                            team: user.team,
                            department: user.department,
                            shiftstartday: weekoffpresent.shiftstartday,
                            shiftendday: weekoffpresent.shiftendday,
                            startdate: weekoffpresent.startdate,
                            shiftstatus: weekoffpresent.shiftstatus,
                            shiftdaytotal: weekoffpresent.shiftdaytotal,
                            calstartday: weekoffpresent.calstartday,
                            calendday: weekoffpresent.calendday,
                            caldaytotal: weekoffpresent.caldaytotal,
                            weekoffpresentday: weekoffpresent.weekoffpresentday,
                        });
                    }
                });

                // Remove matched employees from unmatchedUsers to avoid rechecking
                unmatchedUsers = unmatchedUsers.filter(user => !matchedEmployees.includes(user));
            }
        };

        // Check for 'Individual' filter first
        weekoffpresentall.filter(data => data.filtertype === 'Individual').forEach((weekoffpresent) => {
            processWeekoffPresent(weekoffpresent, 'Individual');
        });

        // Check for remaining unmatched users in 'Team' filter
        weekoffpresentall.filter(data => data.filtertype === 'Team').forEach((weekoffpresent) => {
            processWeekoffPresent(weekoffpresent, 'Team');
        });

        // Check for remaining unmatched users in 'Unit' filter
        weekoffpresentall.filter(data => data.filtertype === 'Unit').forEach((weekoffpresent) => {
            processWeekoffPresent(weekoffpresent, 'Unit');
        });

        // Finally, check for remaining unmatched users in 'Branch' filter
        weekoffpresentall.filter(data => data.filtertype === 'Branch').forEach((weekoffpresent) => {
            processWeekoffPresent(weekoffpresent, 'Branch');
        });

        // Filter daypoints based on date range
        daypoints.forEach(data => {
            if (new Date(data.date) >= fromDate && new Date(data.date) <= toDate) {
                filterdaypoints.push(...data.uploaddata);
            }
        });

        temppoints.forEach(data => {
            if (new Date(data.date) >= fromDate && new Date(data.date) <= toDate) {
                filtertemppoints.push(...data.uploaddata);
            }
        });

        weekoffpresents.map((item) => {
            attandances.forEach(data => {
                const [day, month, year] = data.date.split('-');
                const formatAttDate = `${year}-${month}-${day}`;
                if (data.userid === item.userid && new Date(formatAttDate) >= fromDate && new Date(formatAttDate) <= toDate) {
                    attResult.push(data);
                }
            });
        })

        // Pre-compute date ranges for each week
        const calculateWeekRanges = (empcode, userid, rowusername, shiftstartday, startdate, shiftendday, shiftdaytotal, shiftstatus, calstartday, calendday, caldaytotal, weekoffpresentday) => {
            // const startDay = new Date(startdate);
            const startDay = new Date(req.body.fromdate);
            const endDate = new Date(req.body.todate);
            const weekRanges = [];
            const calday = (parseInt(shiftdaytotal) - 1);

            while (startDay <= endDate) {
                const weekStart = new Date(startDay);
                const weekEnd = new Date(startDay);
                weekEnd.setDate(weekEnd.getDate() + calday);

                weekRanges.push({
                    week: `${weekRanges.length + 1}${['st', 'nd', 'rd'][weekRanges.length] || 'th'} Week`,
                    empcode, userid, rowusername, shiftstartday, startdate, shiftendday, shiftdaytotal, shiftstatus, calstartday, calendday, caldaytotal, weekoffpresentday,
                    weekStart: formatDate(weekStart),
                    weekEnd: formatDate(weekEnd),
                });

                startDay.setDate(startDay.getDate() + 7);
            }
            return weekRanges;
        };

        // Reduce weekoffpresents to aggregate data
        const result = weekoffpresents.reduce((acc, user) => {
            const { empcode, userid, rowusername, shiftstartday, startdate, shiftendday, shiftdaytotal, shiftstatus, calstartday, calendday, caldaytotal, weekoffpresentday } = user;

            if (!acc[empcode]) {
                acc[empcode] = {
                    ...user,
                    weekRanges: calculateWeekRanges(empcode, userid, rowusername, shiftstartday, startdate, shiftendday, shiftdaytotal, shiftstatus, calstartday, calendday, caldaytotal, weekoffpresentday),
                    weekdays: []
                };
            }
            acc[empcode].weekdays.push(user);

            return acc;
        }, {});

        let target = 0;

        // Construct finalweekoffpresents
        finalweekoffpresents = Object.values(result).map(userData => {
            const { id, userid, company, branch, unit, team, department, username, empcode, shiftstatus, startdate, shiftstartday, shiftendday, calstartday, calendday, weekRanges } = userData;

            const weeksColumns = weekRanges.map((weekRange, index) => {
                // const [stday, stmonth, styear] = weekRange.weekStart.split('/');
                // const [enday, enmonth, enyear] = weekRange.weekEnd.split('/');
                // const formatStartDate = `${styear}-${stmonth}-${stday}`;
                // const formatEndDate = `${enyear}-${enmonth}-${enday}`;

                finalheading.push(`${weekRange.weekStart}-${weekRange.weekEnd}`);
                dateArray = generateDateArrayAfter(weekRange.weekStart, weekRange.weekEnd);

                let targetPoints = 0;
                let weekPoints = 0;
                let tempWeekPoints = 0;

                // Calculate start and end indices for day range
                const startDayIndex = dayIndices[weekRange.calstartday];
                const endDayIndex = dayIndices[weekRange.calendday];

                // Calculate actual dates for start and end days
                // const actualStartDate = new Date(weekRange.startdate);
                const actualStartDate = new Date(req.body.fromdate);
                actualStartDate.setDate(actualStartDate.getDate() + (startDayIndex - actualStartDate.getDay() + 7) % 7);
                const actualEndDate = new Date(actualStartDate);
                actualEndDate.setDate(actualStartDate.getDate() + ((endDayIndex - startDayIndex + 7) % 7));

                // Summing targetPoints and weekPoints based on shift status and actual date range
                filterdaypoints.forEach(user => {
                    const userDate = new Date(user.date);
                    if (user.empcode === empcode) {
                        targetPoints = parseInt(user.target) * parseInt(weekRange.caldaytotal);
                        target = parseInt(user.target);
                        if (weekRange.shiftstatus === 'Day Shift' && userDate >= actualStartDate && userDate <= actualEndDate) {
                            // targetPoints += parseInt(user.target);
                            weekPoints += parseFloat(user.point);
                        } else if (weekRange.shiftstatus === 'Night Shift' && userDate >= actualStartDate && userDate <= actualEndDate) {
                            // targetPoints += parseInt(user.target);
                            weekPoints += parseFloat(user.point);
                        }
                    }
                });

                // temp
                filtertemppoints.forEach(user => {
                    const userDate = new Date(user.date);
                    if (user.empcode === empcode) {
                        targetPoints = parseInt(user.target) * parseInt(weekRange.caldaytotal);
                        target = parseInt(user.target);
                        if (weekRange.shiftstatus === 'Day Shift' && userDate >= actualStartDate && userDate <= actualEndDate) {
                            // targetPoints += parseInt(user.target);
                            tempWeekPoints += parseFloat(user.point);
                        } else if (weekRange.shiftstatus === 'Night Shift' && userDate >= actualStartDate && userDate <= actualEndDate) {
                            // targetPoints += parseInt(user.target);
                            tempWeekPoints += parseFloat(user.point);
                        }
                    }
                });

                const filterAtt = attResult?.filter((d) => d.userid === weekRange.userid && d.weekoffpresentstatus === true);
                const attMatchingItem = filterAtt.some((item) => dateArray.includes(formatDateAtt(item.date)));

                return {
                    ...weekRange,
                    week: `${index + 1}${['st', 'nd', 'rd'][index] || 'th'} Week`,
                    date: `${weekRange.weekStart}-${weekRange.weekEnd}`,
                    target,
                    targetPoints,
                    weekPoints,
                    tempWeekPoints,
                    adjstatus: attMatchingItem ? 'Verified' : ((weekPoints >= targetPoints && weekPoints !== 0) ? 'Achieved' : 'Not Achieved'),
                    tempadjstatus: attMatchingItem ? 'Verified' : ((tempWeekPoints >= targetPoints && tempWeekPoints !== 0) ? 'Achieved' : 'Not Achieved'),
                };
            });

            return {
                id, userid, company, branch, unit, team, department, username, empcode, shiftstatus, startdate, shiftstartday, shiftendday, calstartday, calendday, weeksColumns, target
            };
        });

    }
    catch (err) {
        console.error(err.message);
    }
    if (!finalweekoffpresents) {
        return next(new ErrorHandler('Weekoffpresent not found!', 404));
    }

    return res.status(200).json({ finalweekoffpresents, finalheading });
});

//create new Weekoffpresent => /api/Weekoffpresent/new
exports.addWeekoffpresent = catchAsyncErrors(async (req, res, next) => {

    let checkloc = await Weekoffpresent.findOne({ code: req.body.code, });

    // if (checkloc) {
    //     return next(new ErrorHandler('Code already exist!', 400));
    // }
    // let checklocname = await Weekoffpresent.findOne({ name: req.body.name });

    // if (checklocname) {

    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aWeekoffpresent = await Weekoffpresent.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

})

// get Single Weekoffpresent => /api/Weekoffpresent/:id
exports.getSingleWeekoffpresent = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sweekoffpresent = await Weekoffpresent.findById(id);
    if (!sweekoffpresent) {
        return next(new ErrorHandler('Weekoffpresent not found', 404));
    }
    return res.status(200).json({
        sweekoffpresent
    })
})


//update Weekoffpresent by id => /api/Weekoffpresent/:id
exports.updateWeekoffpresent = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uweekoffpresent = await Weekoffpresent.findByIdAndUpdate(id, req.body);
    if (!uweekoffpresent) {
        return next(new ErrorHandler('Weekoffpresent not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Weekoffpresent by id => /api/Weekoffpresent/:id
exports.deleteWeekoffpresent = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dweekoffpresent = await Weekoffpresent.findByIdAndRemove(id);

    if (!dweekoffpresent) {
        return next(new ErrorHandler('Weekoffpresent not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})