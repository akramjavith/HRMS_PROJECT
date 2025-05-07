const ManualClientInfo = require("../../../model/modules/production/manualclientinfo");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const Users = require("../../../model/login/auth");
const ClientUserid = require("../../../model/modules/production/ClientUserIDModel");
const AttendanceControlCriteria = require("../../../model/modules/settings/Attendancecontrolcriteria");
const DepartmentMonth = require("../../../model/modules/departmentmonthset");
const Shift = require("../../../model/modules/shift");
const Attendances = require("../../../model/modules/attendance/attendance");
const moment = require("moment");

const formatDate = (inputDate) => {
    if (!inputDate) {
        return "";
    }
    // Assuming inputDate is in the format "dd-mm-yyyy"
    const [day, month, year] = inputDate?.split("/");

    // Use padStart to add leading zeros
    const formattedDay = String(day)?.padStart(2, "0");
    const formattedMonth = String(month)?.padStart(2, "0");

    return `${formattedDay} /${formattedMonth}/${year} `;
};

// get week for month's start to end

const getShiftForDate = (column, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, boardingLog, isWeekOff, matchingDoubleShiftItem, department, overAllDepartment) => {
    // const selectedDateIndex = createdUserDates.findIndex(dateObj => dateObj.formattedDate === column.formattedDate);

    // if (selectedDateIndex === -1) {
    //     return !isWeekOff ? actualShiftTiming : "Week Off";
    // }

    if (matchingItem && matchingItem?._doc?.adjstatus === "Adjustment") {
        return "Pending...";
    } else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "Shift Weekoff Swap") {
        return matchingDoubleShiftItem?._doc?.todateshiftmode;
    } else if (matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjstatus === "Approved" && matchingDoubleShiftItem && matchingDoubleShiftItem?._doc?.adjustmenttype === "WeekOff Adjustment") {
        return matchingDoubleShiftItem?._doc?.todateshiftmode;
    } else if (matchingItem && matchingItem?._doc?.adjstatus === "Approved") {
        if (matchingItem?._doc?.adjustmenttype === "Add On Shift" || matchingItem?._doc?.adjustmenttype === "Shift Adjustment" || matchingItem?._doc?.adjustmenttype === "Shift Weekoff Swap") {
            if (column.shiftMode === "Main Shift") {
                return `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]} `;
            } else if (column.shiftMode === "Second Shift") {
                return `${matchingItem?._doc?.pluseshift.split(" - ")[0]}to${matchingItem?._doc?.pluseshift.split(" - ")[1]} `;
            }
        } else {
            return isWeekOffWithAdjustment
                ? `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]} `
                : `${matchingItem?._doc?.adjchangeshiftime.split(" - ")[0]}to${matchingItem?._doc?.adjchangeshiftime.split(" - ")[1]} `;
        }
    } else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Manual") {
        return isWeekOffWithManual
            ? `${matchingItemAllot._doc?.firstshift.split(" - ")[0]}to${matchingItemAllot?._doc?.firstshift.split(" - ")[1]} `
            : `${matchingItemAllot?._doc?.firstshift.split(" - ")[0]}to${matchingItemAllot?._doc?.firstshift.split(" - ")[1]} `;
    } else if (matchingItemAllot && matchingItemAllot?._doc?.status === "Week Off") {
        return "Week Off";
    } else if (matchingItem && matchingItem?._doc?.adjstatus === "Reject" && isWeekOff) {
        // If the adjustment status is 'Reject' and it's a week off, return 'Week Off'
        return "Week Off";
    }
    // before add shifttype condition working code
    // else if (boardingLog?.length > 0) {

    //     const [columnDay, columnMonth, columnYear] = column.formattedDate?.split('/');
    //     const finalDate = `${ columnYear } -${ columnMonth } -${ columnDay } `;

    //     // Filter boardingLog entries for the same start date
    //     const entriesForDate = boardingLog.filter(log => log.startdate === finalDate);

    //     // If there are entries for the date, return the shift timing of the second entry
    //     if (entriesForDate.length > 1) {
    //         return entriesForDate[1].shifttiming;
    //     }

    //     // Find the most recent boarding log entry that is less than or equal to the selected date
    //     const recentLogEntry = boardingLog
    //         .filter(log => log.startdate < finalDate)
    //         .sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

    //     // If a recent log entry is found, return its shift timing
    //     if (recentLogEntry) {
    //         return !isWeekOff ? recentLogEntry.shifttiming : "Week Off";
    //     } else {
    //         // If no relevant boarding log entry is found, return the previous shift timing or 'Week Off' if it's a week off
    //         return !isWeekOff ? actualShiftTiming : "Week Off";
    //     }
    // }
    else if (boardingLog.length > 0) {
        // Remove duplicate entries with recent entry
        const uniqueEntries = {};
        boardingLog.forEach((entry) => {
            const key = entry.startdate;
            if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
                uniqueEntries[key] = entry;
            }
        });
        const uniqueBoardingLog = Object.values(uniqueEntries);

        const [columnDay, columnMonth, columnYear] = column.formattedDate?.split("/");
        const finalDate = `${columnYear} -${columnMonth} -${columnDay} `;

        // Find the relevant log entry for the given date
        const relevantLogEntry = uniqueBoardingLog.filter((log) => log.startdate <= finalDate).sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

        const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName);

        if (relevantLogEntry) {
            // Daily
            if (relevantLogEntry.shifttype === "Standard" || relevantLogEntry.shifttype === undefined) {
                // If shift type is 'Daily', return the same shift timing for each day
                //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
                return !logWeekOff ? relevantLogEntry.shifttiming : "Week Off";
            }

            // 1 Week Rotation 2nd try working code
            if (relevantLogEntry.shifttype === "Daily") {
                for (const data of relevantLogEntry.todo) {
                    const columnWeek =
                        column.weekNumberInMonth === "2nd Week" ? "1st Week" : column.weekNumberInMonth === "3rd Week" ? "1st Week" : column.weekNumberInMonth === "4th Week" ? "1st Week" : column.weekNumberInMonth === "5th Week" ? "1st Week" : "1st Week";
                    if (data.week === columnWeek && data.day === column.dayName) {
                        return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                    }
                }
            }

            // 2 Week Rotation 2nd try working code
            if (relevantLogEntry.shifttype === "1 Week Rotation") {
                const startDate = new Date(relevantLogEntry.startdate); // Get the start date

                // Get the day name of the start date
                const startDayName = startDate.toLocaleDateString("en-US", { weekday: "long" });

                // Calculate the day count until the next Sunday
                let dayCount = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(startDayName);

                // Calculate the week number based on the day count
                let weekNumber = Math.ceil((7 - dayCount) / 7);

                // Adjust the week number considering the two-week rotation
                const logStartDate = new Date(relevantLogEntry.startdate);
                const currentDate = new Date(finalDate);

                const diffTime = Math.abs(currentDate - logStartDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

                // Determine the final week based on the calculated week number
                const finalWeek = weekNumber % 2 === 0 ? "1st Week" : "2nd Week";

                for (const data of relevantLogEntry.todo) {
                    // Check if the adjusted week matches the column week and day
                    if (data.week === finalWeek && data.day === column.dayName) {
                        return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                    }
                }
            }

            //just 2wk rotation
            if (relevantLogEntry.shifttype === "2 Week Rotation") {
                // Find the matching department entry
                const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

                // Use the fromdate of the matching department as the startDate
                let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

                // Calculate month lengths
                const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                // Function to determine if a year is a leap year
                const isLeapYear = (year) => {
                    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                };

                const currentDate = new Date(finalDate);

                // Determine the effective month for the start date
                let effectiveMonth = startDate.getMonth();
                if (startDate.getDate() > 15) {
                    // Consider the next month if the start date is after the 15th
                    effectiveMonth = (effectiveMonth + 1) % 12;
                }

                // Calculate total days for 1-month rotation based on the effective month
                let totalDays = monthLengths[effectiveMonth];

                // Set the initial endDate by adding totalDays to the startDate
                let endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

                // Adjust February for leap years
                if (isLeapYear(endDate.getFullYear())) {
                    monthLengths[1] = 29;
                }

                // Adjust startDate and endDate if the currentDate is beyond the initial endDate
                while (currentDate > endDate) {
                    // Set startDate to the next matchingDepartment.fromdate for each cycle
                    startDate = new Date(endDate);
                    startDate.setDate(startDate.getDate() + 1); // Move to the next day

                    // Determine the new effective month for the next cycle
                    effectiveMonth = startDate.getMonth();
                    if (startDate.getDate() > 15) {
                        effectiveMonth = (effectiveMonth + 1) % 12;
                    }

                    totalDays = monthLengths[effectiveMonth];

                    // Set the new endDate by adding totalDays to the new startDate
                    endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                    // Adjust February for leap years
                    if (isLeapYear(endDate.getFullYear())) {
                        monthLengths[1] = 29;
                    }
                }

                // Calculate the difference in days correctly
                const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

                // Determine the start day of the first week
                let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                // Adjust the start day so that Monday is considered the start of the week
                let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                // Calculate the week number based on Monday to Sunday cycle
                let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day

                // Calculate the week number within the rotation month based on 7-day intervals from start date
                // const weekNumber = Math.ceil(diffDays / 7);
                let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

                const weekNames = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week", "7th Week", "8th Week", "9th Week"];
                const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

                // console.log({
                //     startDate,
                //     currentDate,
                //     endDate,
                //     diffTime,
                //     diffDays,
                //     weekNumber,
                //     finalWeek,
                // });

                for (const data of relevantLogEntry.todo) {
                    if (data.week === finalWeek && data.day === column.dayName) {
                        return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                    }
                }
            }

            //just 1mont rota
            if (relevantLogEntry.shifttype === "1 Month Rotation") {
                // Find the matching department entry
                const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

                // Use the fromdate of the matching department as the startDate
                let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

                const currentDate = new Date(finalDate);

                // Function to determine if a year is a leap year
                const isLeapYear = (year) => {
                    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                };

                // Calculate month lengths with leap year check for a given year
                const calculateMonthLengths = (year) => {
                    return [31, isLeapYear(year) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                };

                // Determine the effective month and year for the start date
                let effectiveMonth = startDate.getMonth();
                let effectiveYear = startDate.getFullYear();
                if (startDate.getDate() > 15) {
                    // Consider the next month if the start date is after the 15th
                    effectiveMonth = (effectiveMonth + 1) % 12;
                    if (effectiveMonth === 0) {
                        effectiveYear += 1; // Move to the next year if month resets
                    }
                }

                // Calculate total days for the current two-month cycle
                let totalDays = 0;
                for (let i = 0; i < 2; i++) {
                    const monthIndex = (effectiveMonth + i) % 12;
                    const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
                    const currentYear = effectiveYear + yearAdjustment;
                    const monthLengthsForYear = calculateMonthLengths(currentYear);
                    totalDays += monthLengthsForYear[monthIndex];
                }

                // Set the endDate by adding totalDays to the startDate
                let endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                // Recalculate if currentDate is beyond the initial endDate
                while (currentDate > endDate) {
                    startDate = new Date(endDate);
                    startDate.setDate(startDate.getDate() + 1); // Move to the next day

                    // Determine the new effective month and year for the next cycle
                    effectiveMonth = startDate.getMonth();
                    effectiveYear = startDate.getFullYear();
                    if (startDate.getDate() > 15) {
                        effectiveMonth = (effectiveMonth + 1) % 12;
                        if (effectiveMonth === 0) {
                            effectiveYear += 1;
                        }
                    }

                    totalDays = 0;
                    for (let i = 0; i < 2; i++) {
                        const monthIndex = (effectiveMonth + i) % 12;
                        const yearAdjustment = Math.floor((effectiveMonth + i) / 12);
                        const currentYear = effectiveYear + yearAdjustment;
                        const monthLengthsForYear = calculateMonthLengths(currentYear);
                        totalDays += monthLengthsForYear[monthIndex];
                    }

                    // Set the new endDate by adding totalDays to the new startDate
                    endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period
                }

                // console.log(calculateMonthLengths(startDate.getFullYear()), 'monthLengths for current period');

                // Calculate the difference in days including the start date
                const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

                // Determine the start day of the first week
                let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                // Adjust the start day so that Monday is considered the start of the week
                let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                // Calculate the week number based on Monday to Sunday cycle
                let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
                let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

                // Define week names for first and second month of the cycle
                const weekNamesFirstMonth = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week"];

                const weekNamesSecondMonth = ["7th Week", "8th Week", "9th Week", "10th Week", "11th Week", "12th Week"];

                // Determine which month we are in
                const daysInFirstMonth = calculateMonthLengths(startDate.getFullYear())[effectiveMonth];
                let finalWeek;

                if (diffDays <= daysInFirstMonth) {
                    // We're in the first month of the cycle
                    weekNumber = ((weekNumber - 1) % weekNamesFirstMonth.length) + 1;
                    finalWeek = weekNamesFirstMonth[weekNumber - 1];
                } else {
                    // We're in the second month of the cycle
                    const secondMonthDay = diffDays - daysInFirstMonth;

                    // Calculate week number based on Monday-Sunday for the second month
                    const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
                    const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
                    const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
                    const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

                    finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
                }

                for (const data of relevantLogEntry.todo) {
                    if (data.week === finalWeek && data.day === column.dayName) {
                        return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                    }
                }
            }
        }
    }
};

const getWeekOffDay = (column, boardingLog, department, overAllDepartment) => {
    if (boardingLog.length > 0) {
        // Remove duplicate entries with recent entry
        const uniqueEntries = {};
        boardingLog.forEach((entry) => {
            const key = entry.startdate;
            if (!(key in uniqueEntries) || uniqueEntries[key].time <= entry.time) {
                uniqueEntries[key] = entry;
            }
        });
        const uniqueBoardingLog = Object.values(uniqueEntries);

        const [columnDay, columnMonth, columnYear] = column.formattedDate?.split("/");
        const finalDate = `${columnYear} -${columnMonth} -${columnDay} `;

        // Find the relevant log entry for the given date
        const relevantLogEntry = uniqueBoardingLog.filter((log) => log.startdate <= finalDate).sort((a, b) => new Date(b.startdate) - new Date(a.startdate))[0];

        const logWeekOff = relevantLogEntry && relevantLogEntry.weekoff.includes(column.dayName);

        if (relevantLogEntry) {
            // Daily
            if (relevantLogEntry.shifttype === "Standard" || relevantLogEntry.shifttype === undefined) {
                // If shift type is 'Daily', return the same shift timing for each day
                //    return !isWeekOff ? relevantLogEntry.shifttiming : 'Week Off';
                return !logWeekOff ? relevantLogEntry.shifttiming : "Week Off";
            }

            // 1 Week Rotation 2nd try working code
            if (relevantLogEntry.shifttype === "Daily") {
                for (const data of relevantLogEntry.todo) {
                    const columnWeek =
                        column.weekNumberInMonth === "2nd Week" ? "1st Week" : column.weekNumberInMonth === "3rd Week" ? "1st Week" : column.weekNumberInMonth === "4th Week" ? "1st Week" : column.weekNumberInMonth === "5th Week" ? "1st Week" : "1st Week";
                    if (data.week === columnWeek && data.day === column.dayName) {
                        return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                    }
                }
            }

            // 2 Week Rotation 2nd try working code
            if (relevantLogEntry.shifttype === "1 Week Rotation") {
                const startDate = new Date(relevantLogEntry.startdate); // Get the start date

                // Get the day name of the start date
                const startDayName = startDate.toLocaleDateString("en-US", { weekday: "long" });

                // Calculate the day count until the next Sunday
                let dayCount = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].indexOf(startDayName);

                // Calculate the week number based on the day count
                let weekNumber = Math.ceil((7 - dayCount) / 7);

                // Adjust the week number considering the two-week rotation
                const logStartDate = new Date(relevantLogEntry.startdate);
                const currentDate = new Date(finalDate);

                const diffTime = Math.abs(currentDate - logStartDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                weekNumber += Math.floor((diffDays - (7 - dayCount)) / 7); // Adjust for complete 2-week cycles passed

                // Determine the final week based on the calculated week number
                const finalWeek = weekNumber % 2 === 0 ? "1st Week" : "2nd Week";

                for (const data of relevantLogEntry.todo) {
                    // Check if the adjusted week matches the column week and day
                    if (data.week === finalWeek && data.day === column.dayName) {
                        return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                    }
                }
            }

            //just 2wk rotation
            if (relevantLogEntry.shifttype === "2 Week Rotation") {
                // Find the matching department entry
                const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

                // Use the fromdate of the matching department as the startDate
                let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

                // Calculate month lengths
                const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                // Function to determine if a year is a leap year
                const isLeapYear = (year) => {
                    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                };

                const currentDate = new Date(finalDate);

                // Determine the effective month for the start date
                let effectiveMonth = startDate.getMonth();
                if (startDate.getDate() > 15) {
                    // Consider the next month if the start date is after the 15th
                    effectiveMonth = (effectiveMonth + 1) % 12;
                }

                // Calculate total days for 1-month rotation based on the effective month
                let totalDays = monthLengths[effectiveMonth];

                // Set the initial endDate by adding totalDays to the startDate
                let endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

                // Adjust February for leap years
                if (isLeapYear(endDate.getFullYear())) {
                    monthLengths[1] = 29;
                }

                // Adjust startDate and endDate if the currentDate is beyond the initial endDate
                while (currentDate > endDate) {
                    // Set startDate to the next matchingDepartment.fromdate for each cycle
                    startDate = new Date(endDate);
                    startDate.setDate(startDate.getDate() + 1); // Move to the next day

                    // Determine the new effective month for the next cycle
                    effectiveMonth = startDate.getMonth();
                    if (startDate.getDate() > 15) {
                        effectiveMonth = (effectiveMonth + 1) % 12;
                    }

                    totalDays = monthLengths[effectiveMonth];

                    // Set the new endDate by adding totalDays to the new startDate
                    endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                    // Adjust February for leap years
                    if (isLeapYear(endDate.getFullYear())) {
                        monthLengths[1] = 29;
                    }
                }

                // Calculate the difference in days correctly
                const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include start date

                // Determine the start day of the first week
                let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                // Adjust the start day so that Monday is considered the start of the week
                let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                // Calculate the week number based on Monday to Sunday cycle
                let adjustedDiffDays = diffDays + startDayOffset; // Adjust diffDays to account for start day

                // Calculate the week number within the rotation month based on 7-day intervals from start date
                // const weekNumber = Math.ceil(diffDays / 7);
                let weekNumber = Math.floor((adjustedDiffDays - 1) / 7) + 1; // Divide by 7 to get the week count

                const weekNames = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week", "7th Week", "8th Week", "9th Week"];
                const finalWeek = weekNames[(weekNumber - 1) % weekNames.length];

                // console.log({
                //     startDate,
                //     currentDate,
                //     endDate,
                //     diffTime,
                //     diffDays,
                //     weekNumber,
                //     finalWeek,
                // });

                for (const data of relevantLogEntry.todo) {
                    if (data.week === finalWeek && data.day === column.dayName) {
                        return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                    }
                }
            }

            //just 1mont rota
            if (relevantLogEntry.shifttype === "1 Month Rotation") {
                // Find the matching department entry
                const matchingDepartment = overAllDepartment.find((dep) => dep.department === department && new Date(dep.fromdate) <= new Date(relevantLogEntry.startdate) && new Date(relevantLogEntry.startdate) <= new Date(dep.todate));

                // Use the fromdate of the matching department as the startDate
                let startDate = matchingDepartment ? new Date(matchingDepartment.fromdate) : new Date(relevantLogEntry.startdate);

                const currentDate = new Date(finalDate);

                // Calculate month lengths
                const monthLengths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

                // Function to determine if a year is a leap year
                const isLeapYear = (year) => {
                    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
                };

                // Determine the effective month for the start date
                let effectiveMonth = startDate.getMonth();
                if (startDate.getDate() > 15) {
                    // Consider the next month if the start date is after the 15th
                    effectiveMonth = (effectiveMonth + 1) % 12;
                }

                let totalDays = 0;

                // Calculate total days for 2-month rotation based on the effective month
                for (let i = 0; i < 2; i++) {
                    const monthIndex = (effectiveMonth + i) % 12;
                    totalDays += monthLengths[monthIndex];
                }

                // Set the initial endDate by adding totalDays to the startDate
                let endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + totalDays - 1); // Subtract 1 to account for zero-indexing

                // Adjust February for leap years
                if (isLeapYear(endDate.getFullYear())) {
                    monthLengths[1] = 29;
                }

                // Adjust startDate and endDate if the currentDate is beyond the initial endDate
                while (currentDate > endDate) {
                    startDate = new Date(endDate);
                    startDate.setDate(startDate.getDate() + 1); // Move to the next day

                    // Determine the new effective month for the next cycle
                    effectiveMonth = startDate.getMonth();
                    if (startDate.getDate() > 15) {
                        effectiveMonth = (effectiveMonth + 1) % 12;
                    }

                    totalDays = 0;
                    for (let i = 0; i < 2; i++) {
                        const monthIndex = (effectiveMonth + i) % 12;
                        totalDays += monthLengths[monthIndex];
                    }

                    // Set the new endDate by adding totalDays to the new startDate
                    endDate = new Date(startDate);
                    endDate.setDate(endDate.getDate() + totalDays - 1); // Include entire period

                    // Adjust February for leap years
                    if (isLeapYear(endDate.getFullYear())) {
                        monthLengths[1] = 29;
                    }
                }

                // Calculate the difference in days including the start date
                const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Add 1 to include the start date

                // Determine the start day of the first week
                let startDayOfWeek = startDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

                // Adjust the start day so that Monday is considered the start of the week
                let startDayOffset = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

                // Calculate the week number based on Monday to Sunday cycle
                let adjustedDiffDays = diffDays - 1 + startDayOffset; // Adjust diffDays to account for start day
                let weekNumber = Math.floor(adjustedDiffDays / 7) + 1; // Divide by 7 to get the week count

                // Define week names for first and second month of the cycle
                const weekNamesFirstMonth = ["1st Week", "2nd Week", "3rd Week", "4th Week", "5th Week", "6th Week"];

                const weekNamesSecondMonth = ["7th Week", "8th Week", "9th Week", "10th Week", "11th Week", "12th Week"];

                // Determine which month we are in
                const daysInFirstMonth = monthLengths[effectiveMonth];
                let finalWeek;

                if (diffDays <= daysInFirstMonth) {
                    // We're in the first month of the cycle
                    weekNumber = ((weekNumber - 1) % weekNamesFirstMonth.length) + 1;
                    finalWeek = weekNamesFirstMonth[weekNumber - 1];
                } else {
                    // We're in the second month of the cycle
                    const daysInSecondMonth = totalDays - daysInFirstMonth;
                    const secondMonthDay = diffDays - daysInFirstMonth;

                    // Calculate week number based on Monday-Sunday for the second month
                    const secondMonthStartDayOffset = new Date(startDate.getTime() + daysInFirstMonth * 24 * 60 * 60 * 1000).getDay();
                    const secondMonthStartOffset = secondMonthStartDayOffset === 0 ? 6 : secondMonthStartDayOffset - 1;
                    const secondMonthAdjustedDays = secondMonthDay - 1 + secondMonthStartOffset;
                    const secondMonthWeekNumber = Math.floor(secondMonthAdjustedDays / 7) + 1;

                    finalWeek = weekNamesSecondMonth[secondMonthWeekNumber - 1];
                }

                // console.log({
                //     startDate,
                //     currentDate,
                //     endDate,
                //     diffTime,
                //     diffDays,
                //     weekNumber,
                //     finalWeek,
                // });

                for (const data of relevantLogEntry.todo) {
                    if (data.week === finalWeek && data.day === column.dayName) {
                        return data.shiftmode === "Shift" ? data.shifttiming : "Week Off";
                    }
                }
            }
        }
    }
};

function getWeekNumberInMonth(date) {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)

    // If the first day of the month is not Monday (1), calculate the adjustment
    const adjustment = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    // Calculate the day of the month adjusted for the starting day of the week
    const dayOfMonthAdjusted = date.getDate() + adjustment;

    // Calculate the week number based on the adjusted day of the month
    const weekNumber = Math.ceil(dayOfMonthAdjusted / 7);

    return weekNumber;
}

// get All ManualClientInfo => /api/manualclientinfo
exports.getAllManualClientInfo = catchAsyncErrors(async (req, res, next) => {
    let manualclientinfo;
    try {
        manualclientinfo = await ManualClientInfo.find();
    } catch (err) {
        console.log(err.message);
    }
    if (!manualclientinfo) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        manualclientinfo,
    });
});

// Create new manualclientinfo=> /api/manualclientinfo/new
exports.addManualClientInfo = catchAsyncErrors(async (req, res, next) => {
    const { project, category, subcategory, loginid, company, branch, unit, team, employeename, date, line, errorvalue, correctvalue, clienterror } = req.body;

    let filteredData = await ManualClientInfo.findOne({
        project,
        category,
        subcategory,
        loginid,
        company,
        branch,
        unit,
        team,
        employeename,
        date,
        line: { $regex: `\\b${line}\\b`, $options: "i" },
        errorvalue,
        correctvalue,
        clienterror: { $regex: `\\b${clienterror}\\b`, $options: "i" },
    });

    if (!filteredData) {
        let apenaltyerrorcontrol = await ManualClientInfo.create(req.body);

        return res.status(200).json({
            message: "Successfully added!",
        });
    }

    return next(new ErrorHandler("Data Already Exist!", 404));
});

// get Signle ManualClientInfo => /api/manualclientinfo/:id
exports.getSingleManualClientInfo = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let smanualclientoinfo = await ManualClientInfo.findById(id);

    if (!smanualclientoinfo) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        smanualclientoinfo,
    });
});

// update ManualClientInfo by id => /api/manualclientinfo/:id
exports.updateManualClientInfo = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    const { project, category, subcategory, loginid, company, branch, unit, team, employeename, date, line, errorvalue, correctvalue, clienterror } = req.body;

    // let filteredData = await ManualClientInfo.findOne({ _id: { $ne: id }, projectvendor,process ,mode: { $regex: `\\b${mode}\\b`, $options: 'i' } , rate: rate , islock: { $regex: `\\b${islock}\\b`, $options: 'i' } });

    let filteredData = await ManualClientInfo.findOne({
        _id: { $ne: id },
        project,
        category,
        subcategory,
        loginid,
        company,
        branch,
        unit,
        team,
        employeename,
        date,
        line: { $regex: `\\b${line}\\b`, $options: "i" },
        errorvalue,
        correctvalue,
        clienterror: { $regex: `\\b${clienterror}\\b`, $options: "i" },
    });

    if (!filteredData) {
        let upenaltyerrorcontrol = await ManualClientInfo.findByIdAndUpdate(id, req.body);
        if (!upenaltyerrorcontrol) {
            return next(new ErrorHandler("Data not found!", 404));
        }
        return res.status(200).json({ message: "Updated successfully" });
    }
    return next(new ErrorHandler("Data Already Exist!", 404));
});

// delete ManualClientInfo by id => /api/manualclientinfo/:id
exports.deleteManualClientInfo = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dpenaltyerrorcontrol = await ManualClientInfo.findByIdAndRemove(id);

    if (!dpenaltyerrorcontrol) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});
// get All ManualClientInfo => /api/manualclientinfo
exports.getAllManualClientInfoLimited = catchAsyncErrors(async (req, res, next) => {
    let manualclientinfo;
    try {
        manualclientinfo = await ManualClientInfo.find();
    } catch (err) {
        console.log(err.message);
    }
    if (!manualclientinfo) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        manualclientinfo,
    });
});

exports.getAllManualClientInfoFilter = catchAsyncErrors(async (req, res, next) => {
    let productionupload = [];
    let producionIndividual = [];
    let attendances,
        users,
        loginids,
        mergedData,
        mergedDataall,
        depMonthSet,
        finaluser = [];
    let allData = [];
    let datesArray = [];
    let userDates = req.body.userDates;
    const { batchNumber, batchSize } = req.body;

    try {
        const getDatesBetween = (startDate, endDate) => {
            const dates = [];
            let currentDate = new Date(startDate);
            let currentEndDate = new Date(endDate);

            // Add one day before the start date
            currentDate.setDate(currentDate.getDate() - 1);
            dates.push(currentDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD

            // Loop through the dates between start and end date
            while (currentDate <= new Date(endDate)) {
                dates.push(currentDate.toISOString().split("T")[0]); // Format: YYYY-MM-DD
                currentDate.setDate(currentDate.getDate() + 1);
            }

            return dates;
        };

        let dates = getDatesBetween(req.body.fromdate, req.body.todate);

        let finalDates = [...new Set(dates)];

        const dateObj = new Date(req.body.fromdate);
        // Extract day, month, and year components
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();

        // Format the date components into the desired format
        const formattedDate = `${day}-${month}-${year}`;

        const dateObjto = new Date(req.body.todate);

        // Extract day, month, and year components
        const dayto = String(dateObjto.getDate()).padStart(2, "0");
        const monthto = String(dateObjto.getMonth() + 1).padStart(2, "0");
        const yearto = dateObjto.getFullYear();

        // Format the date components into the desired format
        const formattedDateTo = `${dayto}-${monthto}-${yearto}`;

        const skip = (batchNumber - 1) * batchSize;
        const limit = batchSize;

        let fromYear = req.body.fromYear; // Assuming you're sending these values from the frontend
        let fromMonth = req.body.fromMonth;

        if (req.body.shift === "Month Based") {
            const fromYear = parseInt(req.body.fromYear, 10);
            const fromMonth = parseInt(req.body.fromMonth, 10) - 1; // Subtract 1 to get the correct month index

            let startDate = new Date(fromYear, fromMonth, 1);
            let endDate = new Date(fromYear, fromMonth + 1, 0);

            let datesm = [];

            // Loop through each day of the month
            for (let day = startDate.getDate() + 1; day <= endDate.getDate(); day++) {
                datesm.push(new Date(fromYear, fromMonth, day));
            }

            datesArray = datesm.map((d) => d.toISOString().split("T")[0]);
        }

        let queryManual = {};

        if (req.body.user.length > 0) {
            queryManual.user = { $in: req.body.user };
        }
        if (req.body.projectvendor.length > 0) {
            queryManual.vendor = { $in: req.body.projectvendor };
        }
        // queryManual.status = "Approved"
        if (finalDates.length > 0 && req.body.shift === "Date Based") {
            queryManual.fromdate = { $gte: req.body.fromdate, $lte: req.body.todate };
        }
        if (datesArray.length > 0 && req.body.shift === "Month Based") {
            queryManual.fromdate = { $in: datesArray };
        }
        if (req.body.filename.length > 0) {
            queryManual.filename = { $in: req.body.filename };
        }
        producionIndividual = await ManualClientInfo.find(queryManual, {
            approvalstatus: 1,
            approvaldate: 1,
            createdAt: 1,
            fromdate: 1,
            time: 1,
            vendor: 1,
            lateentrystatus: 1,
            status: 1,
            unitid: 1,
            time: 1,
            filename: 1,
            user: 1,
            alllogin: 1,
            category: 1,
        })
            .skip(skip)
            .limit(limit)
            .lean();

        let userQuery = {
            $or: [{ reasondate: { $exists: false } }, { reasondate: { $eq: "" } }, { reasondate: { $gte: req.body.todate } }],
        };
        console.log(producionIndividual.length, "producionIndividual");

        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        let fromMonthName = monthNames[req.body.fromMonth - 1];

        let deptMonthQuery = {};

        if (req.body.shift === "Month Based") {
            deptMonthQuery.monthname = fromMonthName;
            deptMonthQuery.year = String(req.body.fromYear);
        } else {
            deptMonthQuery.fromdate = { $lte: req.body.fromdate };
            deptMonthQuery.todate = { $gte: req.body.fromdate };
        }
        // console.log(deptMonthQuery, "deptMonthQuery");
        // users = await Users.find({}, { company: 1, branch: 1, unit: 1, team: 1, empname: 1, companyname: 1, username: 1, empcode: 1 });

        // let loginids = await ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] } }, { empname: 1, userid: 1, loginallotlog: 1 }).lean();
        let [usersAll, loginids, depMonthSet] = await Promise.all([
            Users.find(
                userQuery,
                // {}
                { companyname: 1, empcode: 1, company: 1, departmentlog: 1, unit: 1, branch: 1, team: 1, username: 1, processlog: 1, shifttiming: 1, department: 1, doj: 1, assignExpLog: 1, shiftallot: 1, boardingLog: 1 }
            ),
            ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] } }, { empname: 1, userid: 1, loginallotlog: 1, projectvendor: 1 }).lean(),
            DepartmentMonth.find(deptMonthQuery, { fromdate: 1, department: 1 }),
        ]);

        allData = producionIndividual;

        if (req.body.shift == "Date Based") {
            users = usersAll
                .map((item) => {
                    let findUserDeprtment = item.department;
                    let findUserTeam = item.team;

                    if (item.boardingLog) {
                        if (item.boardingLog && item.boardingLog.length > 0 && item.boardingLog.some((item) => item.ischangeteam === true)) {
                            const sortedTeamLog = item.boardingLog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));

                            const findDept = sortedTeamLog.find((dept) => new Date(req.body.fromdate) >= new Date(dept.startdate));

                            findUserTeam = findDept ? findDept.team : "";
                            // } else if (item.boardingLog && item.boardingLog.length == 1 && item.boardingLog.some((item) => item.ischangeteam === true)) {
                            //   findUserDeprtment = new Date(req.body.fromdate) >= new Date(item.boardingLog[0].startdate) ? item.boardingLog[0].team : "";
                        } else {
                            findUserTeam = item.team;
                        }
                    }

                    if (item.departmentlog) {
                        if (item.departmentlog && item.departmentlog.length > 1) {
                            const sortedDepartmentLog = item.departmentlog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));
                            const findDept = sortedDepartmentLog.find((dept) => new Date(req.body.fromdate) >= new Date(dept.startdate));
                            findUserDeprtment = findDept ? findDept.department : "";
                        } else if (item.departmentlog && item.departmentlog.length == 1) {
                            findUserDeprtment = new Date(req.body.fromdate) >= new Date(item.departmentlog[0].startdate) ? item.departmentlog[0].department : "";
                        } else {
                            findUserDeprtment = item.department;
                        }
                    }
                    return {
                        ...item._doc,
                        department: findUserDeprtment,
                        team: findUserTeam,
                    };
                })
                .filter((item) => item !== null);
            let mergedDataallfirst = allData.map((upload) => {
                const loginInfo = loginids.find((login) => login.userid === upload.user);

                let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];
                let filteredDataDateTime = null;
                if (loginallot.length > 0) {
                    const groupedByDateTime = {};

                    // Group items by date and time
                    loginallot.forEach((item) => {
                        const dateTime = item.date + " " + item.time; // Assuming item.updatetime contains time in HH:mm format
                        if (!groupedByDateTime[dateTime]) {
                            groupedByDateTime[dateTime] = [];
                        }
                        groupedByDateTime[dateTime].push(item);
                    });

                    // Extract the last item of each group
                    const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);
                    // Sort the last items by date and time
                    lastItemsForEachDateTime.sort((a, b) => {
                        return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
                    });

                    // Find the first item in the sorted array that meets the criteria

                    for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                        const dateTime = lastItemsForEachDateTime[i].date + " " + lastItemsForEachDateTime[i].time;
                        let datevalsplitfinal = upload.fromdate + " " + upload.time;
                        if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                            filteredDataDateTime = lastItemsForEachDateTime[i];
                        } else {
                            break;
                        }
                    }
                }
                // const userInfo = loginInfo ? users.find(user => user.companyname === loginInfo.empname) : "";
                let logininfoname = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
                const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : "";
                const userArray = loginInfo ? users.filter((user) => user.companyname === logininfoname) : "";

                // const filenamelistviewAll = upload.filename && upload.filename?.split(".x");
                // const filenamelist = filenamelistviewAll && filenamelistviewAll[0];

                const filenamelist = upload.filename;

                const FindProjectvendor = upload.vendor && upload.vendor?.split("-");
                const getproject = FindProjectvendor && FindProjectvendor[0];
                const getvendor = FindProjectvendor && FindProjectvendor[1];

                // const findshifttime = userInfo && userInfo.shifttiming && userInfo.shifttiming.split("to");

                // const getshift = findshifttime && findshifttime[0];

                const comparedate = upload.fromdate;
                const comparetime = upload.time;
                const dateTime = new Date(`${comparedate}T${comparetime}Z`);

                const includesValue = (array, value) => {
                    return array && array.length > 0 ? array.includes(value) : true;
                };

                // const isConditionsMet =
                //   includesValue(req.body.company, userInfo?.company) &&
                //   includesValue(req.body.branch, userInfo?.branch) &&
                //   includesValue(req.body.unit, userInfo?.unit) &&
                //   includesValue(req.body.team, userInfo?.team) &&
                //   includesValue(req.body.empname, userInfo?.companyname);

                if (
                    // isConditionsMet &&

                    (req.body.company.length > 0 ? req.body.company.includes(userInfo ? userInfo.company : "") : true) &&
                    (req.body.branch.length > 0 ? req.body.branch.includes(userInfo ? userInfo.branch : "") : true) &&
                    (req.body.unit.length > 0 ? req.body.unit.includes(userInfo ? userInfo.unit : "") : true) &&
                    (req.body.team.length > 0 ? req.body.team.includes(userInfo ? userInfo.team : "") : true) &&
                    (req.body.empname.length > 0 ? req.body.empname.includes(userInfo ? userInfo.companyname : "") : true) &&
                    (req.body.subsmanual && req.body.subsmanual.length > 0 ? req.body.subsmanual.some((sub) => sub.category === filenamelist && sub.subcategory === upload.category) : true)
                ) {
                    return {
                        user: upload.user,
                        fromdate: upload.fromdate,
                        todate: upload.todate,
                        vendor: upload.vendor,
                        category: upload.category,
                        dateval: `${upload.fromdate} ${upload.time}`,
                        olddateval: `${upload.fromdate}T${upload.time}`,
                        approvalstatus: upload.approvalstatus,
                        lateentrystatus: upload.lateentrystatus,
                        approvaldate: upload.approvaldate,
                        createdAt: upload.createdAt,
                        status: upload.status,
                        time: upload.time,

                        filename: upload.filename,
                        mode: upload.mode == "Manual" ? "Manual" : "Production",
                        empname: logininfoname,
                        empcode: userInfo && userInfo.empcode,
                        company: userInfo && userInfo.company,
                        unit: userInfo && userInfo.unit,
                        branch: userInfo && userInfo.branch,
                        team: userInfo && userInfo.team,
                        username: userInfo && userInfo.username,
                        empcode: userInfo && userInfo.empcode,
                        _id: upload._id,
                        unitid: upload.unitid,
                        filename: upload.filename,
                        section: upload.section,
                        csection: upload.updatedsection ? upload.updatedsection : "",
                        flagcount: upload.flagcount,
                        cflagcount: upload.updatedflag ? upload.updatedflag : "",
                        unitid: upload.unitid,
                        filename: upload.filename,
                        points: Number(upload.unitrate) * 8.333333333333333,
                        cpoints: upload.updatedunitrate ? Number(upload.updatedunitrate) * 8.333333333333333 : "",
                        unitrate: Number(upload.unitrate),
                        cunitrate: upload.updatedunitrate ? Number(upload.updatedunitrate) : "",
                    };
                }
            });

            mergedDataall = mergedDataallfirst.filter((item) => item !== undefined);
        } else if (req.body.shift == "Month Based") {
            users = usersAll
                .map((item) => {
                    let findUserDeprtment = item.department;
                    let findUserTeam = item.team;
                    let findFromDateMonth = [...new Set(depMonthSet.map((d) => d.fromdate))];
                    console.log(findFromDateMonth, "findFromDateMonth");
                    if (item.departmentlog) {
                        if (item.departmentlog && item.departmentlog.length > 1) {
                            const sortedDepartmentLog = item.departmentlog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));
                            const findDept = sortedDepartmentLog.find((dept) => findFromDateMonth.includes(dept.startdate));
                            findUserDeprtment = findDept ? findDept.department : "";
                        } else if (item.departmentlog && item.departmentlog.length == 1) {
                            findUserDeprtment = findFromDateMonth.some((d) => new Date(item.departmentlog[0].startdate) >= new Date(d)) ? item.departmentlog[0].department : "";
                        } else {
                            findUserDeprtment = item.department;
                        }
                    }
                    console.log(findUserDeprtment, "findUserDeprtment");
                    let findFromDate = depMonthSet.find((d) => d.department === findUserDeprtment)?.fromdate;
                    console.log(findFromDate, "findFromDate");
                    if (item.boardingLog) {
                        if (item.boardingLog && item.boardingLog.length > 1 && item.boardingLog.some((item) => item.ischangeteam === true)) {
                            const sortedTeamLog = item.boardingLog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));
                            const findDept = sortedTeamLog.find((dept) => new Date(findFromDate) > new Date(dept.startdate));
                            findUserTeam = findDept ? findDept.team : "";
                        } else if (item.boardingLog && item.boardingLog.length == 1 && item.boardingLog.some((item) => item.ischangeteam === true)) {
                            findUserTeam = new Date(item.boardingLog[0].startdate) >= new Date(findFromDate) ? item.boardingLog[0].team : "";
                        } else {
                            findUserTeam = item.team;
                        }
                    }

                    return {
                        ...item._doc,
                        department: findUserDeprtment,
                        team: findUserTeam,
                    };
                })
                .filter((item) => item !== null);

            let mergedDataallfirst = allData.map((upload) => {
                const loginInfo = loginids.find((login) => login.userid === upload.user);

                let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];
                let filteredDataDateTime = null;
                if (loginallot.length > 0) {
                    const groupedByDateTime = {};

                    // Group items by date and time
                    loginallot.forEach((item) => {
                        const dateTime = item.date + " " + item.time; // Assuming item.updatetime contains time in HH:mm format
                        if (!groupedByDateTime[dateTime]) {
                            groupedByDateTime[dateTime] = [];
                        }
                        groupedByDateTime[dateTime].push(item);
                    });

                    // Extract the last item of each group
                    const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);
                    // Sort the last items by date and time
                    lastItemsForEachDateTime.sort((a, b) => {
                        return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
                    });

                    // Find the first item in the sorted array that meets the criteria

                    for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                        const dateTime = lastItemsForEachDateTime[i].date + " " + lastItemsForEachDateTime[i].time;
                        let datevalsplitfinal = upload.fromdate + " " + upload.time;
                        if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                            filteredDataDateTime = lastItemsForEachDateTime[i];
                        } else {
                            break;
                        }
                    }
                }
                // const userInfo = loginInfo ? users.find(user => user.companyname === loginInfo.empname) : "";
                let logininfoname = loginallot.length > 0 && filteredDataDateTime ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";
                const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : "";
                const userArray = loginInfo ? users.filter((user) => user.companyname === logininfoname) : "";

                // const filenamelistviewAll = upload.filename && upload.filename?.split(".x");
                // const filenamelist = filenamelistviewAll && filenamelistviewAll[0];

                const filenamelist = upload.filename;

                const comparedate = upload.fromdate;
                const comparetime = upload.time;
                const dateTime = new Date(`${comparedate}T${comparetime}Z`);

                const includesValue = (array, value) => {
                    return array && array.length > 0 ? array.includes(value) : true;
                };

                const isConditionsMet =
                    includesValue(req.body.company, userInfo?.company) &&
                    includesValue(req.body.branch, userInfo?.branch) &&
                    includesValue(req.body.unit, userInfo?.unit) &&
                    includesValue(req.body.team, userInfo?.team) &&
                    includesValue(req.body.empname, userInfo?.companyname);

                if (isConditionsMet && (req.body.subsmanual && req.body.subsmanual.length > 0 ? req.body.subsmanual.some((sub) => sub.category === upload.filename && sub.subcategory === upload.category) : true)) {
                    return {
                        user: upload.user,
                        fromdate: upload.fromdate,
                        todate: upload.todate,
                        vendor: upload.vendor,
                        category: upload.category,
                        dateval: `${upload.fromdate} ${upload.time}:00`,
                        olddateval: `${upload.fromdate}T${upload.time}:00`,
                        approvalstatus: upload.approvalstatus,
                        lateentrystatus: upload.lateentrystatus,
                        approvaldate: upload.approvaldate,
                        createdAt: upload.createdAt,
                        status: upload.status,
                        time: upload.time,
                        filename: upload.filename,
                        mode: upload.mode == "Manual" ? "Manual" : "Production",
                        empname: logininfoname,
                        empcode: userInfo && userInfo.empcode,
                        company: userInfo && userInfo.company,
                        unit: userInfo && userInfo.unit,
                        branch: userInfo && userInfo.branch,
                        team: userInfo && userInfo.team,
                        username: userInfo && userInfo.username,
                        empcode: userInfo && userInfo.empcode,
                        _id: upload._id,
                        unitid: upload.unitid,
                        filename: upload.filename,
                        section: upload.section,
                        csection: upload.updatedsection ? upload.updatedsection : "",
                        flagcount: upload.flagcount,
                        cflagcount: upload.updatedflag ? upload.updatedflag : "",
                        unitid: upload.unitid,
                        filename: upload.filename,
                        points: Number(upload.unitrate) * 8.333333333333333,
                        cpoints: upload.updatedunitrate ? Number(upload.updatedunitrate) * 8.333333333333333 : "",
                        unitrate: Number(upload.unitrate),
                        cunitrate: upload.updatedunitrate ? Number(upload.updatedunitrate) : "",
                    };
                }
            });

            mergedDataall = mergedDataallfirst.filter((item) => item !== undefined);
        }

        mergedData = mergedDataall && mergedDataall.length > 0 ? mergedDataall.filter((item) => item != null) : [];
    } catch (err) {
        console.log(err);
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!productionupload) {
    //   return next(new ErrorHandler("Data not found!", 404));
    // }
    return res.status(200).json({
        // count: products.length,
        mergedData,
        count: mergedData.length,
    });
});

//timestudy report
exports.getAllTimeStudyReportSelfFilter = catchAsyncErrors(async (req, res, next) => {
    let productionupload, attendances, mergedData, producionIndividual, depMonthSet;
    let finaluser = [];
    let mergedDataall = [];
    let sortedProductionUpload = [];
    let userDates = req.body.userDates;
    try {
        const dateObj = new Date(req.body.fromdate);

        // Extract day, month, and year components
        const day = String(dateObj.getDate()).padStart(2, "0");
        const month = String(dateObj.getMonth() + 1).padStart(2, "0");
        const year = dateObj.getFullYear();

        // Format the date components into the desired format
        const formattedDate = `${day}-${month}-${year}`;

        let currentDateTodate = new Date(req.body.fromdate);
        let nextDaytodate = new Date(currentDateTodate);
        nextDaytodate.setDate(currentDateTodate.getDate() + 1);
        let nextDateFormatted = nextDaytodate.toISOString().split("T")[0];

        let dateoneafter = new Date(req.body.fromdate);
        dateoneafter.setDate(dateoneafter.getDate() + 1);
        let newDateOnePlus = dateoneafter.toISOString().split("T")[0];

        let datebefore = new Date(req.body.fromdate);
        datebefore.setDate(datebefore.getDate() - 1);
        let newDateOneMinus = datebefore.toISOString().split("T")[0];

        // producionIndividual = await ProducionIndividual.find({}, {});
        let loginids = await ClientUserid.find({ loginallotlog: { $exists: true, $ne: [] }, userid: { $in: req.body.allloginids } }, { empname: 1, userid: 1, loginallotlog: 1, projectvendor: 1 }).lean();
        // attendances = await Attendances.find({ date: { $eq: formattedDate }, username: req.body.username }, { clockintime: 1, date: 1, username: 1 });
        let usersAll = await Users.find(
            { username: req.body.username },
            { companyname: 1, empcode: 1, company: 1, unit: 1, branch: 1, team: 1, username: 1, processlog: 1, shifttiming: 1, department: 1, doj: 1, assignExpLog: 1, shiftallot: 1, boardingLog: 1 }
        );
        let shift = await Shift.find({}, { name: 1, fromhour: 1, tohour: 1, frommin: 1, tomin: 1, fromtime: 1, totime: 1, isallowance: 1 });
        depMonthSet = await DepartmentMonth.find({}, { department: 1, year: 1, month: 1, monthname: 1, fromdate: 1, todate: 1, totaldays: 1 });

        let queryManual = {};

        if (req.body.filename.length > 0) {
            queryManual.filename = { $in: req.body.filename.map((item) => `${item}`) };
        }
        if (req.body.category.length > 0) {
            queryManual.category = { $in: req.body.category };
        }
        if (req.body.allloginids.length > 0) {
            queryManual.user = { $in: req.body.allloginids };
        }
        if (req.body.projectvendor.length > 0) {
            queryManual.vendor = { $in: req.body.projectvendor };
        }

        queryManual.$or = [{ fromdate: { $eq: req.body.fromdate } }, { fromdate: { $eq: newDateOnePlus } }];

        producionIndividual = await ManualClientInfo.find(queryManual, {
            vendor: 1,
            fromdate: 1,
            time: 1,
            category: 1,
            filename: 1,
            unitid: 1,
            user: 1,
            section: 1,
            flagcount: 1,
            mode: 1,
            updatedflag: 1,
            updatedsection: 1,
            updatedunitrate: 1,
        });
        // console.log(producionIndividual, "producionIndividual");
        let attendenceControlCriteria = await AttendanceControlCriteria.findOne().sort({ createdAt: -1 }).exec();

        let dayShiftBeforeHrs = attendenceControlCriteria && attendenceControlCriteria.dayactive && attendenceControlCriteria.dayactive == true ? Number(attendenceControlCriteria.calcshifthourday) : 4;
        let dayShiftBeforeMin = attendenceControlCriteria && attendenceControlCriteria.dayactive && attendenceControlCriteria.dayactive == true ? Number(attendenceControlCriteria.calcshiftminday) : 0;
        let nightShiftBeforeHrs = attendenceControlCriteria && attendenceControlCriteria.nightactive && attendenceControlCriteria.nightactive == true ? Number(attendenceControlCriteria.calcshifthournight) : 4;
        let nightShiftBeforeMin = attendenceControlCriteria && attendenceControlCriteria.nightactive && attendenceControlCriteria.nightactive == true ? Number(attendenceControlCriteria.calcshiftminnight) : 0;

        let allData = producionIndividual;

        let users = usersAll
            .map((item) => {
                let findUserDeprtment = item.department;
                let findUserTeam = item.team;

                if (item.boardingLog) {
                    if (item.boardingLog && item.boardingLog.length > 0 && item.boardingLog.some((item) => item.ischangeteam === true)) {
                        const sortedTeamLog = item.boardingLog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));

                        const findDept = sortedTeamLog.find((dept) => new Date(req.body.fromdate) >= new Date(dept.startdate));

                        findUserTeam = findDept ? findDept.team : "";
                        // } else if (item.boardingLog && item.boardingLog.length == 1 && item.boardingLog.some((item) => item.ischangeteam === true)) {
                        //   findUserDeprtment = new Date(req.body.fromdate) >= new Date(item.boardingLog[0].startdate) ? item.boardingLog[0].team : "";
                    } else {
                        findUserTeam = item.team;
                    }
                }

                if (item.departmentlog) {
                    if (item.departmentlog && item.departmentlog.length > 1) {
                        const sortedDepartmentLog = item.departmentlog.sort((a, b) => new Date(b.startdate) - new Date(a.startdate));
                        const findDept = sortedDepartmentLog.find((dept) => new Date(req.body.fromdate) >= new Date(dept.startdate));
                        findUserDeprtment = findDept ? findDept.department : "";
                    } else if (item.departmentlog && item.departmentlog.length == 1) {
                        findUserDeprtment = new Date(req.body.fromdate) >= new Date(item.departmentlog[0].startdate) ? item.departmentlog[0].department : "";
                    } else {
                        findUserDeprtment = item.department;
                    }
                }
                return {
                    ...item._doc,
                    department: findUserDeprtment,
                    team: findUserTeam,
                };
            })
            .filter((item) => item !== null);

        if (req.body.shift == "Shift Based") {
            try {
                let mergedDataallfirst = allData.map((upload) => {
                    const loginInfo = loginids.find((login) => req.body.allloginids.includes(login.userid) && login.projectvendor == upload.vendor);
                    let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

                    let filteredDataDateTime = null;
                    if (loginallot.length > 0) {
                        const groupedByDateTime = {};

                        // Group items by date and time
                        loginallot.forEach((item) => {
                            const dateTime = item.date + " " + item.time;
                            if (!groupedByDateTime[dateTime]) {
                                groupedByDateTime[dateTime] = [];
                            }
                            groupedByDateTime[dateTime].push(item);
                        });

                        // Extract the last item of each group
                        const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);

                        // Sort the last items by date and time
                        lastItemsForEachDateTime.sort((a, b) => {
                            return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
                        });

                        // Find the first item in the sorted array that meets the criteria

                        for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                            const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;

                            // let datevalsplit = upload.mode == "Manual" ? upload.fromdate : upload.dateval.split(" ");
                            let datevalsplitfinal = `${upload.fromdate}T${upload.time}Z`;

                            if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                                filteredDataDateTime = lastItemsForEachDateTime[i];
                            } else {
                                break;
                            }
                        }
                    }

                    let logininfoname = loginallot.length > 0 && filteredDataDateTime && filteredDataDateTime.empname ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";

                    const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : "";
                    const userArray = loginInfo ? users.filter((user) => user.companyname === logininfoname) : "";

                    const comparedate = upload.fromdate;
                    const comparetime = upload.time;
                    let shiftEndTime = `${req.body.fromdate}T00:00:00.000Z`;
                    let shiftFromTime = `${req.body.fromdate}T00:00:00.000Z`;

                    let dateSelectedFormat = moment(req.body.fromdate).format("DD/MM/YYYY");
                    let dateSelectedFormatOnePlus = moment(newDateOnePlus).format("DD/MM/YYYY");
                    let dateSelectedFormatOneMinus = moment(newDateOneMinus).format("DD/MM/YYYY");
                    // console.log(dateSelectedFormat, dateSelectedFormatOnePlus, dateSelectedFormatOneMinus, 'sdfd')
                    let userShiftTimings = {};
                    if (userArray && userArray.length > 0) {
                        finaluser =
                            userArray &&
                            userArray.length > 0 &&
                            userArray?.flatMap((item, index) => {
                                const findShiftTiming = (shiftName) => {
                                    const foundShift = shift?.find((d) => d.name === shiftName);
                                    return foundShift ? `${foundShift.fromhour}:${foundShift.frommin}${foundShift.fromtime}to${foundShift.tohour}:${foundShift.tomin}${foundShift.totime} ` : "";
                                };
                                const findShiftTimingsts = (shiftName) => {
                                    const foundShift = shift?.find((d) => d.name === shiftName);
                                    return foundShift ? `${foundShift.isallowance}` : "";
                                };
                                // console.log(item)
                                const filteredMatchingDoubleShiftItem = item.shiftallot?.filter((val) => val && val.empcode === item.empcode && val.adjstatus === "Approved");

                                // Filter out the dates that have matching 'Shift Adjustment' todates
                                let removedUserDates = userDates.filter((date) => {
                                    // Check if there is no matching 'Shift Adjustment' for the current user and formattedDate
                                    const matchingShiftAdjustmentToDate = filteredMatchingDoubleShiftItem?.find((item) => item && item.todate === date.formattedDate && item.adjustmenttype === "Shift Adjustment");

                                    // If there is no matching 'Shift Adjustment', keep the date
                                    return !matchingShiftAdjustmentToDate;
                                });

                                // Create a Set to store unique entries based on formattedDate, dayName, dayCount, and shiftMode
                                let uniqueEntries = new Set();

                                // Iterate over removedUserDates and add unique entries to the Set
                                removedUserDates.forEach((date) => {
                                    uniqueEntries.add(
                                        JSON.stringify({
                                            formattedDate: date.formattedDate,
                                            dayName: date.dayName,
                                            dayCount: date.dayCount,
                                            shiftMode: "Main Shift",
                                            weekNumberInMonth: date.weekNumberInMonth,
                                        })
                                    );
                                });

                                // Iterate over filteredMatchingDoubleShiftItem and add unique entries to the Set
                                filteredMatchingDoubleShiftItem &&
                                    filteredMatchingDoubleShiftItem?.forEach((item) => {
                                        const [day, month, year] = item.adjdate?.split("/");
                                        let newFormattedDate = new Date(`${year}-${month}-${day}`);

                                        if (item.adjustmenttype === "Shift Adjustment" || item.adjustmenttype === "Add On Shift" || item.adjustmenttype === "Shift Weekoff Swap") {
                                            uniqueEntries.add(
                                                JSON.stringify({
                                                    formattedDate: item.adjdate,
                                                    dayName: moment(item.adjdate, "DD/MM/YYYY").format("dddd"),
                                                    dayCount: parseInt(moment(item.adjdate, "DD/MM/YYYY").format("DD")),
                                                    shiftMode: "Second Shift",
                                                    weekNumberInMonth:
                                                        getWeekNumberInMonth(newFormattedDate) === 1
                                                            ? `${getWeekNumberInMonth(newFormattedDate)}st Week`
                                                            : getWeekNumberInMonth(newFormattedDate) === 2
                                                                ? `${getWeekNumberInMonth(newFormattedDate)}nd Week`
                                                                : getWeekNumberInMonth(newFormattedDate) === 3
                                                                    ? `${getWeekNumberInMonth(newFormattedDate)}rd Week`
                                                                    : getWeekNumberInMonth(newFormattedDate) > 3
                                                                        ? `${getWeekNumberInMonth(newFormattedDate)}th Week`
                                                                        : "",
                                                })
                                            );
                                        }
                                    });

                                // Convert Set back to an array of objects
                                let createdUserDatesUnique = Array.from(uniqueEntries).map((entry) => JSON.parse(entry));

                                function sortUserDates(dates) {
                                    return dates.sort((a, b) => {
                                        if (a.formattedDate === b.formattedDate) {
                                            // If dates are the same, sort by shift mode
                                            if (a.shiftMode < b.shiftMode) return -1;
                                            if (a.shiftMode > b.shiftMode) return 1;
                                            return 0;
                                        } else {
                                            // Otherwise, sort by date
                                            const dateA = new Date(a.formattedDate.split("/").reverse().join("/"));
                                            const dateB = new Date(b.formattedDate.split("/").reverse().join("/"));
                                            return dateA - dateB;
                                        }
                                    });
                                }

                                // Sort the array
                                const sortedCreatedUserDates = sortUserDates(createdUserDatesUnique);
                                const createdUserDates = sortedCreatedUserDates?.filter((d) => {
                                    const filterData = userDates.some((val) => val.formattedDate === d.formattedDate);
                                    if (filterData) {
                                        return d;
                                    }
                                });

                                // Map each user date to a row
                                const userRows = createdUserDates?.map((date) => {
                                    let filteredRowData = item.shiftallot?.filter((val) => val?.empcode == item?.empcode);
                                    const matchingItem = filteredRowData?.find((item) => item && item?.adjdate == date.formattedDate);
                                    const matchingItemAllot = filteredRowData?.find((item) => item && formatDate(item.date) == date.formattedDate);
                                    const matchingDoubleShiftItem = filteredRowData?.find((item) => item && item?.todate === date.formattedDate);
                                    const filterBoardingLog =
                                        item?.boardingLog &&
                                        item?.boardingLog?.filter((item) => {
                                            // return item.logcreation === "user" || item.logcreation === "shift";
                                            return item;
                                        });

                                    // Check if the dayName is Sunday or Monday
                                    // const isWeekOff = item?._doc?.weekoff?.includes(date.dayName);
                                    const isWeekOff = getWeekOffDay(date, filterBoardingLog, item?.department, depMonthSet) === "Week Off" ? true : false;
                                    const isWeekOffWithAdjustment = isWeekOff && matchingItem;
                                    const isWeekOffWithManual = isWeekOff && matchingItemAllot;

                                    const actualShiftTiming = findShiftTiming(item?.shifttiming);

                                    const row = {
                                        company: item.company,
                                        branch: item.branch,
                                        unit: item.unit,
                                        team: item.team,
                                        companyname: item.companyname,
                                        empcode: item.empcode,
                                        username: item.username,
                                        shifttiming: getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet),
                                        date: date.formattedDate,
                                        shiftmode: date.shiftMode,
                                        shiftsts: findShiftTimingsts(getShiftForDate(date, matchingItem, matchingItemAllot, isWeekOffWithAdjustment, isWeekOffWithManual, filterBoardingLog, isWeekOff, matchingDoubleShiftItem, item?.department, depMonthSet)),
                                    };

                                    return row;
                                });
                                return userRows;
                            });
                        let dateSelectedFormat = moment(req.body.fromdate).format("DD/MM/YYYY");
                        let dateSelectedFormatOnePlus = moment(newDateOnePlus).format("DD/MM/YYYY");
                        let dateSelectedFormatOneMinus = moment(newDateOneMinus).format("DD/MM/YYYY");

                        // console.log(finaluser, "finaluser");
                        function filterData(data) {
                            const previousEntry = data.find((d) => d.date === dateSelectedFormatOneMinus);
                            const firstEntry = data.find((d) => d.date === dateSelectedFormat);
                            const secondEntry = data.find((d) => d.date === dateSelectedFormatOnePlus);

                            // if (!firstEntry) return [];
                            const ispreviousShiftWeekoff = previousEntry && previousEntry.shifttiming && previousEntry.shifttiming !== "" && previousEntry.shifttiming == "Week Off";
                            const isFirstShiftWeekoff = firstEntry && firstEntry.shifttiming && firstEntry.shifttiming !== "" && firstEntry.shifttiming == "Week Off";
                            const isSecondShiftWeekoff = secondEntry && secondEntry.shifttiming && secondEntry.shifttiming !== "" && secondEntry.shifttiming == "Week Off";
                            const isFirstShiftPM = firstEntry && firstEntry.shifttiming && firstEntry.shifttiming !== "" && firstEntry.shifttiming != "Week Off" ? firstEntry.shifttiming.split("to")[0].includes("PM") : "";
                            const isPreviousShiftPM = previousEntry && previousEntry.shifttiming && previousEntry.shifttiming !== "" && previousEntry.shifttiming != "Week Off" ? previousEntry.shifttiming.split("to")[0].includes("PM") : "";

                            const isMainShift = firstEntry.shiftmode === "Main Shift";
                            const isPlusShift = firstEntry.plusshift && firstEntry.plusshift != "";

                            function convertTo24Hour(time) {
                                // Remove any extra spaces or unexpected characters
                                time = time.trim();

                                // Use regular expression to capture time and AM/PM
                                const match = time.match(/^(\d{1,2}):(\d{2})(AM|PM)$/);
                                if (!match) return null; // Return null if the format is incorrect

                                let hours = parseInt(match[1], 10);
                                const minutes = match[2];
                                const period = match[3];

                                // Convert to 24-hour format
                                if (period === "PM" && hours < 12) {
                                    hours += 12;
                                }
                                if (period === "AM" && hours === 12) {
                                    hours = 0;
                                }

                                // Format the time as 'HH:MM'
                                return `${hours.toString().padStart(2, "0")}:${minutes}`;
                            }
                            if (isFirstShiftWeekoff && isSecondShiftWeekoff) {
                                // console.log("sd546", previousEntry)
                                let newFromTime = isPreviousShiftPM ? new Date(`${req.body.fromdate}T10:00:00Z`) : new Date(`${req.body.fromdate}T01:00:00Z`);
                                let newEndTime = isPreviousShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(previousEntry.shifttiming.split("to")[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(previousEntry.shifttiming.split("to")[0])}Z`);

                                // shiftOnlyFromTime = new Date(`${date}T00:00:00Z`);
                                // shiftOnlyEndTime = new Date(`${date}T00:00:00Z`);

                                let finalHrs = isPreviousShiftPM === "PM" ? nightShiftBeforeHrs : dayShiftBeforeHrs;
                                let finalMin = isPreviousShiftPM === "PM" ? nightShiftBeforeMin : dayShiftBeforeMin;
                                shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
                                shiftFromTime = new Date(newFromTime.getTime() + 60 * 1000);

                                shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

                                data = { shiftFromTime, shiftEndTime, shifttiming: firstEntry.shift };
                                // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTime111')
                            } else if (isFirstShiftWeekoff && ispreviousShiftWeekoff) {
                                // console.log("sdfsd", secondEntry)
                                let newFromTime = isPreviousShiftPM ? new Date(`${req.body.fromdate}T${convertTo24Hour(secondEntry.shifttiming.split("to")[0])}Z`) : new Date(`${req.body.fromdate}T${convertTo24Hour(secondEntry.shifttiming.split("to")[0])}Z`);
                                let newEndTime = isPreviousShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split("to")[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split("to")[0])}Z`);

                                // shiftOnlyFromTime = new Date(`${date}T00:00:00Z`);
                                // shiftOnlyEndTime = new Date(`${date}T00:00:00Z`);

                                let finalHrs = isPreviousShiftPM === "PM" ? nightShiftBeforeHrs : dayShiftBeforeHrs;
                                let finalMin = isPreviousShiftPM === "PM" ? nightShiftBeforeMin : dayShiftBeforeMin;
                                shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));
                                shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));

                                shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() - 1));

                                data = { shiftFromTime, shiftEndTime, shiftsts: "Disable", shifttiming: firstEntry.shift };
                                // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTime111')
                            } else if (isFirstShiftWeekoff) {
                                let newFromTime = isPreviousShiftPM ? new Date(`${req.body.fromdate}T10:00:00Z`) : new Date(`${req.body.fromdate}T01:00:00Z`);
                                let newEndTime = isPreviousShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split("to")[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split("to")[0])}Z`);

                                // shiftOnlyFromTime = new Date(`${req.body.fromdate}T00:00:00Z`);
                                // shiftOnlyEndTime = new Date(`${req.body.fromdate}T00:00:00Z`);

                                let finalHrs = isPreviousShiftPM === "PM" ? nightShiftBeforeHrs : dayShiftBeforeHrs;
                                let finalMin = isPreviousShiftPM === "PM" ? nightShiftBeforeMin : dayShiftBeforeMin;
                                shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
                                shiftFromTime = new Date(newFromTime.getTime() + 60 * 1000);

                                shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

                                data = { shiftFromTime, shiftEndTime, shiftsts: firstEntry.shiftsts, shifttiming: firstEntry.shifttiming };
                                // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTime111')
                            } else if (isSecondShiftWeekoff) {
                                let newFromTime = isFirstShiftPM ? new Date(`${req.body.fromdate}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`) : new Date(`${req.body.fromdate}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`);
                                let newEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T10:00:00Z`) : new Date(`${newDateOnePlus}T01:00:00Z`);

                                // shiftOnlyFromTime = isFirstShiftPM ? new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`)
                                // shiftOnlyEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntry.shifttiming.split("to")[1])}Z`) : new Date(`${date}T${convertTo24Hour(firstEntry.shifttiming.split("to")[1])}Z`)

                                let finalHrs = isPreviousShiftPM === "PM" ? nightShiftBeforeHrs : dayShiftBeforeHrs;
                                let finalMin = isPreviousShiftPM === "PM" ? nightShiftBeforeMin : dayShiftBeforeMin;
                                shiftEndTime = new Date(newEndTime);
                                shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));
                                shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

                                data = { shiftFromTime, shiftEndTime, shiftsts: firstEntry.shiftsts, shifttiming: firstEntry.shifttiming };
                                // console.log(shiftFromTime, shiftEndTime, newFromTime, newEndTime, 'shiftFromTimesec')
                            } else {
                                // return data.filter(entry => [dateSelectedFormat, dateSelectedFormatOnePlus].includes(entry.date) && entry.shiftmode === "Main Shift");
                                let newFromTime = isFirstShiftPM ? new Date(`${req.body.fromdate}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`) : new Date(`${req.body.fromdate}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`);
                                let newEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split("to")[0])}Z`) : new Date(`${newDateOnePlus}T${convertTo24Hour(secondEntry.shifttiming.split("to")[0])}Z`);

                                // shiftOnlyFromTime = isFirstShiftPM ? new Date(`${req.body.fromdate}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`) : new Date(`${req.body.fromdate}T${convertTo24Hour(firstEntry.shifttiming.split("to")[0])}Z`)
                                // shiftOnlyEndTime = isFirstShiftPM ? new Date(`${newDateOnePlus}T${convertTo24Hour(firstEntry.shifttiming.split("to")[1])}Z`) : new Date(`${req.body.fromdate}T${convertTo24Hour(firstEntry.shifttiming.split("to")[1])}Z`)

                                // console.log(newFromTime, newEndTime)
                                let finalHrs = isPreviousShiftPM === "PM" ? nightShiftBeforeHrs : dayShiftBeforeHrs;
                                let finalMin = isPreviousShiftPM === "PM" ? nightShiftBeforeMin : dayShiftBeforeMin;
                                shiftEndTime = new Date(newEndTime.getTime() - (finalHrs * 60 * 60 * 1000 + (finalMin + 1) * 60 * 1000));
                                shiftFromTime = new Date(newFromTime.getTime() - (finalHrs * 60 * 60 * 1000 + finalMin * 60 * 1000));

                                shiftEndTime = new Date(shiftEndTime.setSeconds(shiftEndTime.getSeconds() + 59));

                                // console.log(shiftFromTime, shiftEndTime, shiftOnlyFromTime, shiftOnlyEndTime, firstEntry.shifttiming.split("to")[1], 'shiftFromTimesec')
                                data = { shiftFromTime, shiftEndTime, shiftsts: firstEntry.shiftsts, shifttiming: firstEntry.shifttiming };
                                // console.log(data, 'data123')
                            }

                            return data; // Return the original data if conditions are not met
                        }
                        let finaluserFiltered = finaluser.filter((d) => d != undefined && d.shifttiming != undefined && d.companyname === userInfo.companyname);
                        // console.log(finaluserFiltered, 'finaluserFiltered')
                        userShiftTimings = finaluserFiltered.length >= 3 ? filterData(finaluserFiltered) : { shiftFromTime, shiftEndTime, shifttiming: "" };
                    }

                    const dateTime = `${comparedate}T${comparetime}`;
                    let LateEntryPointsDeduct = upload.mode == "Manual" && upload.lateentrystatus === "Late Entry";
                    let finalunitrate = upload.updatedunitrate ? Number(upload.updatedunitrate) : Number(upload.unitrate);
                    let finalflag = upload.updatedflag ? Number(upload.updatedflag) : Number(upload.flagcount);

                    let filteredItem = null;

                    if (userInfo && userInfo.processlog) {
                        const groupedByMonthProcs = {};

                        // Group items by month
                        // userInfo.processlog &&
                        userInfo.processlog.forEach((d) => {
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

                            if (req.body.date >= date) {
                                filteredItem = lastItemsForEachMonthPros[i];
                            } else {
                                break;
                            }
                        }
                    }

                    function compareDateTimes(dateT, shiftFrom, shiftEnd) {
                        // Parse the datetime strings into Date objects
                        const dateTimeObj = new Date(dateT);
                        const shiftFromTimeObj = new Date(shiftFrom);
                        const shiftEndTimeObj = new Date(shiftEnd);
                        // Perform the comparisons
                        const isWithinShift = dateTimeObj >= shiftFromTimeObj && dateTimeObj <= shiftEndTimeObj;

                        return isWithinShift;
                    }
                    console.log(dateTime, userShiftTimings.shiftFromTime, userShiftTimings.shiftEndTime);
                    if (compareDateTimes(dateTime, userShiftTimings.shiftFromTime, userShiftTimings.shiftEndTime)) {
                        return {
                            user: upload.user,
                            // fromdate: upload.fromdate,
                            // todate: upload.todate,
                            vendor: upload.vendor,
                            category: upload.category,
                            dateval: `${upload.fromdate} ${upload.time}`,
                            olddateval: `${upload.fromdate}T${upload.time}`,
                            time: upload.time,
                            filename: upload.filename,
                            empname: loginInfo && loginInfo.empname,
                            empcode: userInfo && userInfo.empcode,
                            company: userInfo && userInfo.company,
                            unit: userInfo && userInfo.unit,
                            branch: userInfo && userInfo.branch,
                            team: userInfo && userInfo.team,
                            shifttiming: userShiftTimings ? userShiftTimings.shifttiming : "",
                            username: userInfo && userInfo.username,
                            empcode: userInfo && userInfo.empcode,
                            _id: upload._id,
                            // section: upload.updatedsection ? upload.updatedsection : upload.section,
                            // flagcount: upload.updatedflag ? upload.updatedflag : upload.flagcount,
                            unitid: upload.unitid,
                            filename: upload.filename,
                            worktook: upload.worktook,
                            // points: LateEntryPointsDeduct ? 0 : finalunitrate * finalflag * 8.333333333333333,
                        };
                    }
                });
                mergedDataall = mergedDataallfirst;
                // function getTimeDifference(start, end) {
                //   // console.log(start, end, "startend");
                //   if (start && end) {
                //     const startDate = new Date(start);
                //     const endDate = new Date(end);

                //     if (startDate > endDate) {
                //       return "00:00:00";
                //     } else {
                //       const diff = new Date(endDate - startDate);
                //       return diff.toISOString().substr(11, 8);
                //     }
                //   }
                // }

                // let lastTimes = {};

                // const productionResult = [];
                // mergedDataallfirst = mergedDataallfirst.filter((d) => d !== null && d !== undefined);
                // mergedDataall = mergedDataallfirst.sort((a, b) => {
                //   // First sort by empname
                //   if (a.empname < b.empname) return -1;
                //   if (a.empname > b.empname) return 1;
                //   // If empnames are equal, sort by dateval
                //   //  return a.dateval.localeCompare(b.dateval);
                //   return new Date(a.olddateval) - new Date(b.olddateval);
                // });

                // mergedDataall.forEach((item, index) => {
                //   const originalDatetime = item.dateval;
                //   // const formattedDateTime = originalDatetime.toISOString().replace('T', ' ').slice(0, 19);
                //   const finddatevalue = originalDatetime && originalDatetime?.split(" ");
                //   const findtime = finddatevalue && finddatevalue[1];
                //   const finddate = finddatevalue && finddatevalue[0];

                //   const loginInfo = loginids.find((login) => login.userid === item.user && login.projectvendor == item.vendor);

                //   const userInfo = loginInfo ? users.find((user) => user.companyname === loginInfo.empname) : "";

                //   const findshifttime = userInfo && userInfo.shifttiming && userInfo.shifttiming.split("to");

                //   const getshift = item.shifttiming == "Week Off" ? findtime : findshifttime && findshifttime[0];
                //   let hours24 = "";
                //   const [time, period] = getshift.includes("AM") ? getshift.split("AM") : getshift.split("PM");
                //   let [hoursshift, minutesshift] = time.split(":");

                //   if (item.shifttiming != "Week Off") {
                //     // Converting hours to 24-hour format if the period is "PM" and not "12"
                //     hours24 = parseInt(hoursshift, 10);
                //     if (getshift.includes("PM") && hoursshift !== "12") {
                //       hours24 += 12;
                //     }
                //   } else {
                //     hours24 = parseInt(getshift.split(":")[0], 10);
                //     minutesshift = getshift.split(":")[1];
                //   }
                //   let secondssets = item.shifttiming == "Week Off" ? getshift.split(":")[0] : 0;
                //   // Creating a new Date object with the updated hours
                //   const date = new Date(finddate);
                //   date.setHours(hours24);
                //   date.setMinutes(parseInt(minutesshift, 10));
                //   date.setSeconds(secondssets);

                //   // Formatting the date to "hh:mm:ss" format
                //   const formattedTimeshift = date.toTimeString().split(" ")[0];

                //   const clockindate = attendances.find((d) => {
                //     const [day, month, year] = d.date.split("-"); // Split the date string from the attendance record
                //     const dateObject = new Date(year, month - 1, day); // Create a new Date object
                //     const formattedDateString = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, "0")}-${dateObject.getDate().toString().padStart(2, "0")}`; // Format the date

                //     return formattedDateString === finddate && userInfo.username == d.username;
                //   });

                //   const [timePart, ampm] = clockindate ? clockindate.clockintime.split(" ") : ""; // Split the time and AM/PM
                //   const [hours, minutes, seconds] = timePart ? timePart.split(":").map(Number) : ""; // Split hours, minutes, and seconds
                //   let formattedHours = hours;
                //   if (ampm === "PM" && hours < 12) {
                //     formattedHours += 12; // Convert hours to 24-hour format if PM and not 12 PM
                //   } else if (ampm === "AM" && hours === 12) {
                //     formattedHours = 0; // Convert 12 AM to 0 hours
                //   }
                //   const formattedTime = `${String(formattedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
                //   // return formattedTime;

                //   if (index == 0 || item.empname !== mergedDataall[index - 1].empname) {
                //     if (loginInfo) {
                //       if (!lastTimes.hasOwnProperty(loginInfo.empname)) {
                //         lastTimes[loginInfo.empname] = clockindate && formattedTime < formattedTimeshift ? formattedTime : formattedTimeshift;
                //       }

                //       item.worktook = getTimeDifference(`${finddate}T${lastTimes[loginInfo.empname]}`, `${finddate}T${findtime}`);
                //     }
                //   } else if (item.empname == mergedDataall[index - 1].empname) {
                //     // item.empname = loginInfo.empname;
                //     item.worktook = getTimeDifference(mergedDataall[index - 1].olddateval, item.olddateval);
                //     // lastTimes[loginInfo.empname] = findtime;
                //     //  productionResult.push(item);
                //   }
                // });
            } catch (err) {
                console.log(err, "err");
                // return next(new ErrorHandler("Records not found", 404));
            }
        } else if (req.body.shift == "Date Based") {
            try {
                let mergedDataallfirst = allData.map((upload) => {
                    const loginInfo = loginids.find((login) => req.body.allloginids.includes(login.userid) && login.projectvendor == upload.vendor);
                    let loginallot = loginInfo && loginInfo.loginallotlog ? loginInfo.loginallotlog : [];

                    let filteredDataDateTime = null;
                    if (loginallot.length > 0) {
                        const groupedByDateTime = {};

                        // Group items by date and time
                        loginallot.forEach((item) => {
                            const dateTime = item.date + " " + item.time;
                            if (!groupedByDateTime[dateTime]) {
                                groupedByDateTime[dateTime] = [];
                            }
                            groupedByDateTime[dateTime].push(item);
                        });

                        // Extract the last item of each group
                        const lastItemsForEachDateTime = Object.values(groupedByDateTime).map((group) => group[group.length - 1]);

                        // Sort the last items by date and time
                        lastItemsForEachDateTime.sort((a, b) => {
                            return new Date(a.date + " " + a.time) - new Date(b.date + " " + b.time);
                        });

                        // Find the first item in the sorted array that meets the criteria

                        for (let i = 0; i < lastItemsForEachDateTime.length; i++) {
                            const dateTime = `${lastItemsForEachDateTime[i].date}T${lastItemsForEachDateTime[i].time}Z`;

                            // let datevalsplit = upload.mode == "Manual" ? upload.fromdate : upload.dateval.split(" ");
                            let datevalsplitfinal = `${upload.fromdate}T${upload.time}Z`;

                            if (new Date(dateTime) <= new Date(datevalsplitfinal)) {
                                filteredDataDateTime = lastItemsForEachDateTime[i];
                            } else {
                                break;
                            }
                        }
                    }

                    let logininfoname = loginallot.length > 0 && filteredDataDateTime && filteredDataDateTime.empname ? filteredDataDateTime.empname : loginInfo ? loginInfo.empname : "";

                    const userInfo = loginInfo ? users.find((user) => user.companyname === logininfoname) : "";
                    const userArray = loginInfo ? users.filter((user) => user.companyname === logininfoname) : "";

                    // const filenamelistviewAll = upload.filename && upload.filename?.split(".x");

                    // const FindProjectvendor = upload.vendor && upload.vendor?.split("-");

                    // const finddatevalue = upload.dateval && upload.dateval?.split(" ");

                    const finddate = upload.fromdate;
                    const findtime = upload.time;

                    const comparedate = upload.mode == "Manual" ? upload.fromdate : finddate;
                    const comparetime = upload.mode == "Manual" ? upload.time : findtime;
                    // let shiftEndTime = `${req.body.fromdate}T${req.body.totime}.000Z`;
                    // let shiftFromTime = `${req.body.fromdate}T${req.body.fromtime}.000Z`;

                    // let dateSelectedFormat = moment(req.body.fromdate).format("DD/MM/YYYY");
                    // let dateSelectedFormatOnePlus = moment(newDateOnePlus).format("DD/MM/YYYY");
                    // let dateSelectedFormatOneMinus = moment(newDateOneMinus).format("DD/MM/YYYY");
                    // console.log(dateSelectedFormat, dateSelectedFormatOnePlus, dateSelectedFormatOneMinus, 'sdfd')

                    const dateTime = new Date(`${comparedate}T${comparetime}Z`);
                    const fromDateselected = new Date(`${req.body.fromdate}T${req.body.fromtime}Z`);
                    const toDateselected = new Date(`${req.body.todate}T${req.body.totime}Z`);
                    // console.log(dateTime, fromDateselected, toDateselected, "toDateselected");
                    if (userInfo && userInfo.processlog) {
                        const groupedByMonthProcs = {};

                        // Group items by month
                        // userInfo.processlog &&
                        userInfo.processlog.forEach((d) => {
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

                            if (req.body.date >= date) {
                                filteredItem = lastItemsForEachMonthPros[i];
                            } else {
                                break;
                            }
                        }
                    }

                    // function compareDateTimes(dateT, shiftFrom, shiftEnd) {
                    //   // Parse the datetime strings into Date objects
                    //   const dateTimeObj = dateT;
                    //   const shiftFromTimeObj = shiftFrom;
                    //   const shiftEndTimeObj = shiftEnd;
                    //   // Perform the comparisons
                    //   const isWithinShift = dateTimeObj >= shiftFromTimeObj && dateTimeObj <= shiftEndTimeObj;

                    //   return isWithinShift;
                    // }
                    if (dateTime >= fromDateselected && dateTime <= toDateselected) {
                        return {
                            user: upload.user,
                            fromdate: upload.fromdate,
                            todate: upload.todate,
                            vendor: upload.vendor,
                            category: upload.category,
                            dateval: `${upload.fromdate} ${upload.time} IST`,
                            olddateval: `${upload.fromdate} ${upload.time}`,
                            time: upload.time,
                            filename: upload.filename,
                            empname: loginInfo && loginInfo.empname,
                            empcode: userInfo && userInfo.empcode,
                            company: userInfo && userInfo.company,
                            unit: userInfo && userInfo.unit,
                            branch: userInfo && userInfo.branch,
                            team: userInfo && userInfo.team,
                            // shifttiming: userShiftTimings && userShiftTimings?.shifttiming ? userShiftTimings?.shifttiming : "",

                            username: userInfo && userInfo.username,
                            empcode: userInfo && userInfo.empcode,
                            _id: upload._id,
                            // section: upload.updatedsection ? upload.updatedsection : upload.section,
                            // flagcount: upload.updatedflag ? upload.updatedflag : upload.flagcount,
                            unitid: upload.unitid,
                            filename: upload.filename,
                            // worktook: upload.worktook,
                            // points: upload.updatedunitrate ? Number(upload.updatedunitrate) * 8.333333333333333 : Number(upload.unitrate) * 8.333333333333333,
                        };
                    }
                });
                mergedDataall = mergedDataallfirst;
                // Function to calculate time difference in HH:mm:ss format
                // function getTimeDifference(start, end) {
                //   const startDate = new Date("1970-01-01T" + start);
                //   const endDate = new Date("1970-01-01T" + end);
                //   const diff = new Date(endDate - startDate);
                //   return diff.toISOString().substr(11, 8);
                // }

                // let lastTimes = {};

                // const productionResult = [];

                // mergedDataall = mergedDataallfirst
                //   .filter((item) => item !== undefined && item.dateval && item.empname)
                //   .sort((a, b) => {
                //     if (a.dateval < b.dateval) return -1;
                //     if (a.dateval > b.dateval) return 1;
                //     if (a.empname < b.empname) return -1;
                //     if (a.empname > b.empname) return 1;
                //     return 0;
                //   });
                // mergedDataall.forEach((item, index) => {
                //   const finddatevalue = item.dateval && item.dateval?.split(" ");
                //   const finddate = finddatevalue && finddatevalue[0];
                //   const findtime = finddatevalue && finddatevalue[1];

                //   const findshifttime = item.shifttiming != "" ? item.shifttiming.split("to") : ["00:00AM", "23:59PM"];

                //   const getshift = item.shifttiming == "Week Off" ? findtime : findshifttime && findshifttime[0];
                //   let hours24 = "";
                //   const [time, period] = getshift.includes("AM") ? getshift.split("AM") : getshift.split("PM");
                //   let [hoursshift, minutesshift] = time.split(":");

                //   if (item.shifttiming != "Week Off") {
                //     // Converting hours to 24-hour format if the period is "PM" and not "12"
                //     hours24 = parseInt(hoursshift, 10);
                //     if (getshift.includes("PM") && hoursshift !== "12") {
                //       hours24 += 12;
                //     }
                //   } else {
                //     hours24 = parseInt(getshift.split(":")[0], 10);
                //     minutesshift = getshift.split(":")[1];
                //   }
                //   let secondssets = item.shifttiming == "Week Off" ? getshift.split(":")[0] : 0;
                //   // Creating a new Date object with the updated hours
                //   const date = new Date(finddate);
                //   date.setHours(hours24);
                //   date.setMinutes(parseInt(minutesshift, 10));
                //   date.setSeconds(secondssets);

                //   // Formatting the date to "hh:mm:ss" format
                //   const formattedTimeshift = date.toTimeString().split(" ")[0];

                //   const clockindate = attendances.find((d) => {
                //     const [day, month, year] = d.date.split("-"); // Split the date string from the attendance record
                //     const dateObject = new Date(year, month - 1, day); // Create a new Date object
                //     const formattedDateString = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, "0")}-${dateObject.getDate().toString().padStart(2, "0")}`; // Format the date

                //     return formattedDateString === finddate && item.username == d.username;
                //   });

                //   const [timePart, ampm] = clockindate ? clockindate.clockintime.split(" ") : ""; // Split the time and AM/PM
                //   const [hours, minutes, seconds] = timePart ? timePart.split(":").map(Number) : ""; // Split hours, minutes, and seconds
                //   let formattedHours = hours;
                //   if (ampm === "PM" && hours < 12) {
                //     formattedHours += 12; // Convert hours to 24-hour format if PM and not 12 PM
                //   } else if (ampm === "AM" && hours === 12) {
                //     formattedHours = 0; // Convert 12 AM to 0 hours
                //   }
                //   const formattedTime = `${String(formattedHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
                //   // return formattedTime;
                //   if (item.empname) {
                //     if (!lastTimes.hasOwnProperty(item.empname)) {
                //       lastTimes[item.empname] = clockindate && formattedTime < formattedTimeshift ? formattedTime : formattedTimeshift;
                //     }

                //     item.empname = item.empname;
                //     item.worktook = getTimeDifference(lastTimes[item.empname], findtime);
                //     lastTimes[item.empname] = findtime;
                //     productionResult.push(item);
                //   }
                // });
            } catch (err) {
                return next(new ErrorHandler("Records not found", 404));
            }
        }

        mergedData = mergedDataall.filter((item) => item != null);
    } catch (err) {
        console.log(err);
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!productionupload) {

    //   return next(new ErrorHandler("Data not found!", 404));
    // }
    return res.status(200).json({
        // count: products.length,
        mergedData,
    });
});

// get All ProductionIndividual => /api/ProductionIndividuals
exports.timeStudyDupeCheck = catchAsyncErrors(async (req, res, next) => {
    let timestudy;
    try {
        const { vendor, filename, unitid, user, category, fromdate, time } = req.body;

        let query = {
            vendor,
            filename,
            unitid,
            user,
            category,
            fromdate,
            // time,
        };
        console.log(query, "query");
        timestudy = await ManualClientInfo.countDocuments(query);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!productionIndividual) {
    //   return next(new ErrorHandler("Data not found!", 404));
    // }
    return res.status(200).json({
        timestudy,
    });
});

// get All ManualClientInfo => /api/manualclientinfo
exports.timeStudyCompletedList = catchAsyncErrors(async (req, res, next) => {
    let manualclientinfo;
    try {
        const { vendor, filename, category, user, fromdate, status } = req.body;

        let query = {
            // statusmode: { $in: status },
        };

        if (["Overall", "Completed"].map(item => status.includes(item))) {
            query.fromdate = fromdate;
        }
        if (!status.includes("Overall")) {
            query.statusmode = { $in: status };
        }

        if (vendor && vendor.length > 0) {
            query.vendor = { $in: vendor };
        }

        if (filename && filename.length > 0) {
            query.filename = { $in: filename };
        }

        if (category && category.length > 0) {
            query.category = { $in: category };
        }

        if (user && user.length > 0) {
            query.user = { $in: user };
        }


        manualclientinfo = await ManualClientInfo.find(query, {});

    } catch (err) {
        console.log(err);
    }
    // if (!manualclientinfo) {
    //   return next(new ErrorHandler("Data not found!", 404));
    // }
    return res.status(200).json({
        // count: products.length,
        manualclientinfo,
    });
});