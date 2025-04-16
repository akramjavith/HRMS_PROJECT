const Accuracymaster = require('../../../model/modules/accuracy/accuracymaster');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const AcheivedAccuracy = require('../../../model/modules/accuracy/acheivedaccuracy');
const ExpectedAccuracy = require('../../../model/modules/accuracy/expectedaccuracy');
const AchievedAccuracyIndividual = require("../../../model/modules/accuracy/achievedaccuracyindividual");
const User = require("../../../model/login/auth");
const ClientUserID = require("../../../model/modules/production/ClientUserIDModel");

const AchievedAccuracyIndividualUploaddata = require("../../../model/modules/accuracy/achievedaccuracyindividualuploaddata");

exports.getAchievedAccuracyFilteredData = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body);
    console.time("Total Function Execution Time");
    try {
        console.time("Pipeline Aggregation");
        // Fetch all the data in a single efficient query using aggregation
        const [minimumaccuracyArray, expArray, achievedaccuracyindividual, users, allottedList] = await Promise.all([
            Accuracymaster.find({}),
            ExpectedAccuracy.find({}),
            AchievedAccuracyIndividualUploaddata.aggregate([

                {
                    $project: {
                        id: "$_id",
                        date: 1,
                        project: 1,
                        vendor: 1,
                        queue: 1,
                        loginid: { $trim: { input: '$loginid' } },
                        accuracy: 1,
                        totalfield: 1,
                        projectvendor: {
                            $replaceAll: {
                                input: '$vendor',
                                find: '[-_ ]', // Use a string here
                                replacement: ''
                            }
                        }
                    }
                }
            ]),
            User.find({
                resonablestatus: { $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"] }
            }, { company: 1, companyname: 1, branch: 1, unit: 1, team: 1 }),
            ClientUserID.find({ allotted: "allotted" })
        ]);


        console.timeEnd("Pipeline Aggregation");
        console.time("step3");

        let definedUsers = users.reduce((acc, data) => {
            acc[data.companyname] = {
                employeename: data.companyname,
                company: data.company,
                branch: data.branch,
                unit: data.unit,
                team: data.team
            };
            return acc;
        }, {});
        console.timeEnd("step3");
        // Fetch allotted list
        console.time("step5");

        // Preprocess allottedList into a Set with normalized keys
        const allottedSet = new Set(
            allottedList.map(item => `${item.userid}_${item.projectvendor.replace(/[-_ ]/g, "")}`)
        );

        // Filter achievedaccuracyindividual using the preprocessed Set
        const collectedAllotedList = achievedaccuracyindividual.filter(data =>
            allottedSet.has(`${data.loginid}_${data.projectvendor.replace(/[-_ ]/g, "")}`)
        );

        // let collectedAllotedList = achievedaccuracyindividual.filter((data) =>
        //     allottedList.some((item) => (item.userid === data.loginid
        //         &&
        //         item.projectvendor.replace(/[-_ ]/g, "") === data.projectvendor.replace(/[-_ ]/g, "")
        //     )
        //     )
        // );
        console.timeEnd("step5");
        console.time("step6");
        // Combine data with allotted info
        let combinedWithAllotted = collectedAllotedList.map((data) => {
            let foundData = allottedList.find((item) => item.userid === data.loginid);
            if (foundData) {
                return {
                    ...data,
                    ...foundData,
                    accuracy: data.accuracy,
                    listdate: data.date
                };
            }
        }).filter(Boolean);

        console.timeEnd("step6");
        console.time("step7");
        // Prepare final allotted data
        let finalAllottedList = allottedList.flatMap((data) =>
            data.loginallotlog?.map((item) => {
                let foundData = definedUsers[item.empname];
                return {
                    company: foundData?.company || '',
                    branch: foundData?.branch || '',
                    unit: foundData?.unit || '',
                    team: foundData?.team || '',
                    employeename: foundData?.employeename || '',
                    date: item.date || '',
                    loginid: item.userid || '',
                    projectvendor: data.projectvendor || ''
                };
            }) || []
        );
        console.timeEnd("step7");
        console.time("step8");
        // Combine allotted and unallotted data
        let allottedCombinedData = combinedWithAllotted.map((data) => {
            let sameLoginID = finalAllottedList.filter((id) => data.loginid === id.loginid);
            let lessthanorEq = sameLoginID.filter((item) => new Date(item.date) <= new Date(data.listdate));

            let sortedLessEq = lessthanorEq.sort((a, b) => new Date(b.date) - new Date(a.date));
            if (lessthanorEq.length > 0) {

                return {
                    id: data.id,
                    date: data.date,
                    project: data.project,
                    vendor: data.vendor,
                    queue: data.queue,
                    loginid: data.loginid,
                    accuracy: data.accuracy,
                    totalfield: data.totalfield,
                    company: sortedLessEq[0]?.company,
                    branch: sortedLessEq[0]?.branch,
                    unit: sortedLessEq[0]?.unit,
                    team: sortedLessEq[0]?.team,
                    employeename: sortedLessEq[0]?.employeename
                };
            } else {
                return null;
            }
        }).filter(item => item !== null);
        console.timeEnd("step8");
        console.time("step9");
        // Create a Set of IDs from allottedCombinedData
        const allottedIds = new Set(allottedCombinedData.map(item => item.id));

        const unAllottedCombinedData = achievedaccuracyindividual
            .filter(data => !allottedIds.has(data.id))
            .map(data => ({
                id: data.id,
                date: data.date,
                project: data.project,
                vendor: data.vendor,
                queue: data.queue,
                loginid: data.loginid,
                accuracy: data.accuracy,
                totalfield: data.totalfield,
                company: null,
                branch: null,
                unit: null,
                team: null,
                employeename: null
            }));


        console.timeEnd("step9");

        let toShowList = [...allottedCombinedData, ...unAllottedCombinedData];
        console.time("step10");
        // Fetch minimum accuracy and expected accuracy data

        console.timeEnd("step10");
        console.time("step11");
        let finalList = toShowList.map((data) => {
            let minimumAccuracy = minimumaccuracyArray.find((item) => item.projectvendor === data.project && item.queue === data.queue);
            let foundData = expArray.filter((item) => data.project === item.project && data.queue === item.queue && (data.accuracy <= item.expectedaccuracyto && data.accuracy >= item.expectedaccuracyfrom));

            let object = {};
            if (foundData.length > 0) {
                foundData.forEach((dataNew) => {
                    if (dataNew.mode === "Client") {
                        object.clientstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
                    }
                    if (dataNew.mode === "Internal") {
                        object.internalstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
                    }
                });
            } else {
                object.clientstatus = "NIL";
                object.internalstatus = "NIL";
            }

            return {
                ...data,
                minimumaccuracy: minimumAccuracy ? minimumAccuracy.minimumaccuracy : '',
                ...object
            };
        });

        console.timeEnd("step11");
        // Apply filters based on request body
        const { company, branch, unit, team, employeename, type, fromDate, toDate, compare, fromWhere, project, vendor, queue } = req.body;

        let incomingValue = finalList;
        if (fromWhere === "Client") {
            incomingValue = finalList.filter((item) => item.clientstatus !== "NIL");
            incomingValue.forEach((obj) => delete obj.internalstatus);
        } else if (fromWhere === "Internal") {
            incomingValue = finalList.filter((item) => item.internalstatus !== "NIL");
            incomingValue.forEach((obj) => delete obj.clientstatus);
        }

        // Filter by company, branch, unit, etc.
        let filteredData = incomingValue.filter(entry => {
            const companyMatch = !company || company.includes(entry.company);
            const branchMatch = !branch || branch.includes(entry.branch);
            const unitMatch = !unit || unit.includes(entry.unit);
            const teamMatch = !team || team.includes(entry.team);

            const projMatch = !project || project.includes(entry.project);
            const vendorMatch = !vendor || vendor.includes(entry.vendor);
            const queueMatch = !queue || queue.includes(entry.queue);

            const employeeMatch = !employeename || employeename.includes(entry.employeename);
            const typeMatch = !type || (containsAnyValue(entry.clientstatus, type) || containsAnyValue(entry.internalstatus, type));
            const dateMatch = (!fromDate || entry.date >= fromDate) && (!toDate || entry.date <= toDate);
            return companyMatch && branchMatch && unitMatch && teamMatch && employeeMatch && dateMatch && typeMatch && projMatch && vendorMatch && queueMatch;
        });
        console.time("step12");
        // Apply comparison filters
        if (compare && compare !== 'All') {
            const filterValue = parseFloat(req.body[`${compare.toLowerCase()}Value`]);
            filteredData = filteredData.filter(entry => parseFloat(entry.accuracy) <= filterValue);
        }
        console.timeEnd("step12");
        console.timeEnd("Total Function Execution Time");
        res.json({
            len: filteredData.length, filteredData,
        });

    } catch (err) {
        console.error(err);
        return next(new ErrorHandler('An error occurred while fetching data!', 500));
    }
});

exports.getAchievedAccuracyFilteredDataHome = catchAsyncErrors(async (req, res, next) => {
    console.log(req.body);
    console.time("Total Function Execution Time");
    let achievedaccuracyindividual, filteredData;
    try {
        console.time("Pipeline Aggregation");

        let fromdate, todate
        const today = new Date();
        const selectedFilter = req.body.selectedFilter
        // const formatDate = (date) => date.toISOString().split("T")[0];
        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        switch (selectedFilter) {


            case "Last Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
                todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
                break;
            case "Last Week":
                const startOfLastWeek = new Date(today);
                startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
                const endOfLastWeek = new Date(startOfLastWeek);
                endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
                fromdate = formatDate(startOfLastWeek);
                todate = formatDate(endOfLastWeek);
                break;
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromdate = todate = formatDate(yesterday);
                break;

            case "Today":
                fromdate = todate = formatDate(today);
                break;
            case "Tomorrow":
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                fromdate = todate = formatDate(tomorrow);
                break;
            case "This Week":
                const startOfThisWeek = new Date(today);
                startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
                const endOfThisWeek = new Date(startOfThisWeek);
                endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
                fromdate = formatDate(startOfThisWeek);
                todate = formatDate(endOfThisWeek);
                break;
            case "This Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
                todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));


                break;

            default:
                fromdate = "";
        }




        // Fetch all the data in a single efficient query using aggregation
        const [minimumaccuracyArray, expArray, achievedaccuracyindividual, users, allottedList] = await Promise.all([
            Accuracymaster.find({}),
            ExpectedAccuracy.find({}),
            AchievedAccuracyIndividualUploaddata.aggregate([
                {
                    $match: {
                        ...(fromdate && todate
                            ? { date: { $gte: fromdate, $lte: todate } }
                            : fromdate
                                ? { date: { $eq: fromdate } }
                                : {}),
                    } // Match the document with name 'name1'
                },
                {
                    $sort: { date: -1 } // Sort by date in descending order to get the latest document first
                },
                {
                    $limit: 1 // Limit the result to only one document
                },
                {
                    $project: {
                        id: "$_id",
                        date: 1,
                        project: 1,
                        vendor: 1,
                        queue: 1,
                        loginid: { $trim: { input: '$loginid' } },
                        accuracy: 1,
                        totalfield: 1,
                        projectvendor: {
                            $replaceAll: {
                                input: '$vendor',
                                find: '[-_ ]', // Use a string here
                                replacement: ''
                            }
                        }
                    }
                }
            ]),
            User.find({
                resonablestatus: { $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"] }
            }, { company: 1, companyname: 1, branch: 1, unit: 1, team: 1 }),
            ClientUserID.find({ allotted: "allotted" })
        ]);


        console.timeEnd("Pipeline Aggregation");
        console.time("step3");

        let definedUsers = users.reduce((acc, data) => {
            acc[data.companyname] = {
                employeename: data.companyname,
                company: data.company,
                branch: data.branch,
                unit: data.unit,
                team: data.team
            };
            return acc;
        }, {});
        console.timeEnd("step3");
        // Fetch allotted list
        console.time("step5");

        // Preprocess allottedList into a Set with normalized keys
        const allottedSet = new Set(
            allottedList.map(item => `${item.userid}_${item.projectvendor.replace(/[-_ ]/g, "")}`)
        );

        // Filter achievedaccuracyindividual using the preprocessed Set
        const collectedAllotedList = achievedaccuracyindividual.filter(data =>
            allottedSet.has(`${data.loginid}_${data.projectvendor.replace(/[-_ ]/g, "")}`)
        );

        // let collectedAllotedList = achievedaccuracyindividual.filter((data) =>
        //     allottedList.some((item) => (item.userid === data.loginid
        //         &&
        //         item.projectvendor.replace(/[-_ ]/g, "") === data.projectvendor.replace(/[-_ ]/g, "")
        //     )
        //     )
        // );
        console.timeEnd("step5");
        console.time("step6");
        // Combine data with allotted info
        let combinedWithAllotted = collectedAllotedList.map((data) => {
            let foundData = allottedList.find((item) => item.userid === data.loginid);
            if (foundData) {
                return {
                    ...data,
                    ...foundData,
                    accuracy: data.accuracy,
                    listdate: data.date
                };
            }
        }).filter(Boolean);

        console.timeEnd("step6");
        console.time("step7");
        // Prepare final allotted data
        let finalAllottedList = allottedList.flatMap((data) =>
            data.loginallotlog?.map((item) => {
                let foundData = definedUsers[item.empname];
                return {
                    company: foundData?.company || '',
                    branch: foundData?.branch || '',
                    unit: foundData?.unit || '',
                    team: foundData?.team || '',
                    employeename: foundData?.employeename || '',
                    date: item.date || '',
                    loginid: item.userid || '',
                    projectvendor: data.projectvendor || ''
                };
            }) || []
        );
        console.timeEnd("step7");
        console.time("step8");
        // Combine allotted and unallotted data
        let allottedCombinedData = combinedWithAllotted.map((data) => {
            let sameLoginID = finalAllottedList.filter((id) => data.loginid === id.loginid);
            let lessthanorEq = sameLoginID.filter((item) => new Date(item.date) <= new Date(data.listdate));

            let sortedLessEq = lessthanorEq.sort((a, b) => new Date(b.date) - new Date(a.date));
            if (lessthanorEq.length > 0) {

                return {
                    id: data.id,
                    date: data.date,
                    project: data.project,
                    vendor: data.vendor,
                    queue: data.queue,
                    loginid: data.loginid,
                    accuracy: data.accuracy,
                    totalfield: data.totalfield,
                    company: sortedLessEq[0]?.company,
                    branch: sortedLessEq[0]?.branch,
                    unit: sortedLessEq[0]?.unit,
                    team: sortedLessEq[0]?.team,
                    employeename: sortedLessEq[0]?.employeename
                };
            } else {
                return null;
            }
        }).filter(item => item !== null);
        console.timeEnd("step8");
        console.time("step9");
        // Create a Set of IDs from allottedCombinedData
        const allottedIds = new Set(allottedCombinedData.map(item => item.id));

        const unAllottedCombinedData = achievedaccuracyindividual
            .filter(data => !allottedIds.has(data.id))
            .map(data => ({
                id: data.id,
                date: data.date,
                project: data.project,
                vendor: data.vendor,
                queue: data.queue,
                loginid: data.loginid,
                accuracy: data.accuracy,
                totalfield: data.totalfield,
                company: null,
                branch: null,
                unit: null,
                team: null,
                employeename: null
            }));


        console.timeEnd("step9");

        let toShowList = [...allottedCombinedData, ...unAllottedCombinedData];
        console.time("step10");
        // Fetch minimum accuracy and expected accuracy data

        console.timeEnd("step10");
        console.time("step11");
        let finalList = toShowList.map((data) => {
            let minimumAccuracy = minimumaccuracyArray.find((item) => item.projectvendor === data.project && item.queue === data.queue);
            let foundData = expArray.filter((item) => data.project === item.project && data.queue === item.queue && (data.accuracy <= item.expectedaccuracyto && data.accuracy >= item.expectedaccuracyfrom));

            let object = {};
            if (foundData.length > 0) {
                foundData.forEach((dataNew) => {
                    if (dataNew.mode === "Client") {
                        object.clientstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
                    }
                    if (dataNew.mode === "Internal") {
                        object.internalstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
                    }
                });
            } else {
                object.clientstatus = "NIL";
                object.internalstatus = "NIL";
            }

            return {
                ...data,
                minimumaccuracy: minimumAccuracy ? minimumAccuracy.minimumaccuracy : '',
                ...object
            };
        });

        console.timeEnd("step11");
        // Apply filters based on request body
        // const { company, branch, unit, team, employeename, type, fromDate, toDate, compare, fromWhere, project, vendor, queue } = req.body;
        let fromWhere;
        let incomingValue = finalList;
        if (fromWhere === "Client") {
            incomingValue = finalList.filter((item) => item.clientstatus !== "NIL");
            incomingValue.forEach((obj) => delete obj.internalstatus);
        } else if (fromWhere === "Internal") {
            incomingValue = finalList.filter((item) => item.internalstatus !== "NIL");
            incomingValue.forEach((obj) => delete obj.clientstatus);
        }

        // Filter by company, branch, unit, etc.
        let filteredData = incomingValue.filter(entry => {
            // const companyMatch = !company || company.includes(entry.company);
            // const branchMatch = !branch || branch.includes(entry.branch);
            // const unitMatch = !unit || unit.includes(entry.unit);
            // const teamMatch = !team || team.includes(entry.team);

            // const projMatch = !project || project.includes(entry.project);
            // const vendorMatch = !vendor || vendor.includes(entry.vendor);
            // const queueMatch = !queue || queue.includes(entry.queue);

            // const employeeMatch = !employeename || employeename.includes(entry.employeename);
            // const typeMatch = !type || (containsAnyValue(entry.clientstatus, type) || containsAnyValue(entry.internalstatus, type));
            const dateMatch = (!fromdate || entry.date >= fromdate) && (!todate || entry.date <= todate);
            return dateMatch;
        });
        console.time("step12");
        let compare = "All"
        // Apply comparison filters
        if (compare && compare !== 'All') {
            const filterValue = parseFloat(req.body[`${compare.toLowerCase()}Value`]);
            filteredData = filteredData.filter(entry => parseFloat(entry.accuracy) <= filterValue);
        }
        console.timeEnd("step12");
        console.timeEnd("Total Function Execution Time");
        res.json({
            len: filteredData.length, filteredData,
        });

    } catch (err) {
        console.error(err);
        return next(new ErrorHandler('An error occurred while fetching data!', 500));
    }
});



function containsAnyValue(str, array) {


    // Creating a regular expression pattern to match any of the values
    const pattern = new RegExp(array.join('|'), 'i'); // 'i' for case-insensitive match

    // Checking if the string contains any of the values
    return pattern.test(str);
}

exports.getAchievedAccuracyFilteredDataHome1 = catchAsyncErrors(async (req, res, next) => {

    let achievedaccuracyindividual, filteredData;
    try {
        // let today = new Date().toISOString().split("T")[0];

        let fromdate, todate
        const today = new Date();
        const selectedFilter = req.body.selectedFilter
        // const formatDate = (date) => date.toISOString().split("T")[0];
        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
            const year = date.getFullYear();
            return `${year}-${month}-${day}`;
        };

        switch (selectedFilter) {


            case "Last Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)); // 1st of last month
                todate = formatDate(new Date(today.getFullYear(), today.getMonth(), 0)); // Last day of last month
                break;
            case "Last Week":
                const startOfLastWeek = new Date(today);
                startOfLastWeek.setDate(today.getDate() - (today.getDay() + 6) % 7 - 7); // Last Monday
                const endOfLastWeek = new Date(startOfLastWeek);
                endOfLastWeek.setDate(startOfLastWeek.getDate() + 6); // Last Sunday
                fromdate = formatDate(startOfLastWeek);
                todate = formatDate(endOfLastWeek);
                break;
            case "Yesterday":
                const yesterday = new Date(today);
                yesterday.setDate(today.getDate() - 1);
                fromdate = todate = formatDate(yesterday);
                break;

            case "Today":
                fromdate = todate = formatDate(today);
                break;
            case "Tomorrow":
                const tomorrow = new Date(today);
                tomorrow.setDate(today.getDate() + 1);
                fromdate = todate = formatDate(tomorrow);
                break;
            case "This Week":
                const startOfThisWeek = new Date(today);
                startOfThisWeek.setDate(today.getDate() - (today.getDay() + 6) % 7); // Monday
                const endOfThisWeek = new Date(startOfThisWeek);
                endOfThisWeek.setDate(startOfThisWeek.getDate() + 6); // Sunday
                fromdate = formatDate(startOfThisWeek);
                todate = formatDate(endOfThisWeek);
                break;
            case "This Month":
                fromdate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
                todate = formatDate(new Date(today.getFullYear(), today.getMonth() + 1, 0));


                break;

            default:
                fromdate = "";
        }

        achievedaccuracyindividual = await AchievedAccuracyIndividual.aggregate([
            {
                $match: {
                    ...(fromdate && todate
                        ? { date: { $gte: fromdate, $lte: todate } }
                        : fromdate
                            ? { date: { $eq: fromdate } }
                            : {}),
                } // Match the document with name 'name1'
            },
            {
                $sort: { date: -1 } // Sort by date in descending order to get the latest document first
            },
            {
                $limit: 1 // Limit the result to only one document
            },
            {
                $project: {
                    date: 1,
                    uploaddata: 1
                    // uploaddata: { $slice: ["$uploaddata", 6] } // Slice the 'data' array to only include the first 2 elements
                }
            }
        ]);
        let data_emp = achievedaccuracyindividual.flatMap((data) => {
            return data.uploaddata.map((item) => {
                return {
                    id: item?._id,
                    date: item?.date,
                    project: item?.project,
                    vendor: item?.vendor,
                    queue: item?.queue,
                    loginid: item?.loginid.trim(),
                    accuracy: item?.accuracy,
                    totalfield: item?.totalfield,
                    projectvendor: item?.vendor.replace(/[-_ ]/g, "")
                }
            })
        });
        // console.log(data_emp.length, "dataemp")

        let users = await User.find({
            resonablestatus: {
                $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
            }
        }, { company: 1, companyname: 1, branch: 1, unit: 1, team: 1 });
        let definedUsers = users.map((data) => {
            return {
                employeename: data?.companyname,
                company: data?.company,
                branch: data?.branch,
                unit: data?.unit,
                team: data?.team,
            }
        })




        let allottedList = await ClientUserID.find({ allotted: "allotted" });


        let collectedAllotedList = data_emp.filter((data) => allottedList.some((item) => item.userid === data.loginid && item.projectvendor.replace(/[-_ ]/g, "") === data.projectvendor));


        let combinedWithallotted = collectedAllotedList.map((data) => {
            let foundData = allottedList.find((item) => item.userid === data.loginid);

            if (foundData) {
                let {
                    accuracy,
                    date,
                    id,
                    loginid,
                    project,
                    projectvendor,
                    queue,
                    totalfield,
                    vendor
                } = data;

                let {
                    userid,
                    allotted,
                    empname,
                    empcode,
                    loginallotlog,
                    time
                } = foundData;

                return {
                    ...data,
                    accuracy,
                    listdate: date,
                    id,
                    loginid,
                    project,
                    projectvendor,
                    queue,
                    totalfield,
                    vendor,
                    userid,
                    allotted,
                    empname,
                    empcode,
                    loginallotlog,
                    time
                };
            }
        });







        let finalAllottedList = allottedList.flatMap((data) => {
            return data?.loginallotlog?.map((item) => {
                let foundData = definedUsers.find((item1) => item1.employeename === item.empname);
                return {
                    company: foundData ? foundData.company : "",
                    branch: foundData ? foundData.branch : "",
                    unit: foundData ? foundData.unit : "",
                    team: foundData ? foundData.team : "",
                    employeename: foundData ? foundData.employeename : "",
                    date: item.date || "",
                    loginid: item.userid || "",
                    projectvendor: data.projectvendor || ""
                };
            });
        });




        // first Data to show
        let allottedCombinedData = combinedWithallotted.map((data) => {


            let sameLoginID = finalAllottedList.filter((id) => {
                return data.userid === id.loginid
            });
            let lessthanorEq = sameLoginID.filter((item) => new Date(item.date) <= new Date(data.listdate));



            let sortedLessEq = lessthanorEq.sort((a, b) => new Date(b.date) - new Date(a.date));

            if (lessthanorEq.length > 0) { // Check if lessthanorEq is not empty
                return {
                    id: data.id,
                    date: data.date,
                    project: data.project,
                    vendor: data.vendor,
                    queue: data.queue,
                    loginid: data.loginid,
                    accuracy: data.accuracy,
                    totalfield: data.totalfield,
                    company: sortedLessEq[0]?.company,
                    branch: sortedLessEq[0]?.branch,
                    unit: sortedLessEq[0]?.unit,
                    team: sortedLessEq[0]?.team,
                    employeename: sortedLessEq[0]?.employeename,
                };
            } else {
                return null;
            }
        }).filter(item => item !== null);










        let unAllottedCombinedData = data_emp.filter((data) => {
            let notfounddata = allottedCombinedData.some((item) => item.id === data.id);


            if (!notfounddata) {
                return {
                    id: data?.id,
                    date: data?.date,
                    project: data?.project,
                    vendor: data?.vendor,
                    queue: data?.queue,
                    loginid: data?.loginid,
                    accuracy: data?.accuracy,
                    totalfield: data?.totalfield,
                    company: null,
                    branch: null,
                    unit: null,
                    team: null,
                    employeename: null,
                };
            }

        });

        let toShowList = [...allottedCombinedData, ...unAllottedCombinedData]

        let minimumaccuracyArray = await Accuracymaster.find({ projectvendor: "SDS_Quickclaim", }, {});

        let getShowList = toShowList.map((data) => {
            let newone = minimumaccuracyArray.find((item) => item.projectvendor === data.project && item.queue === data.queue);
            if (newone) {
                return {
                    ...data, minimumaccuracy: newone.minimumaccuracy
                }
            } else {
                return {
                    ...data, minimumaccuracy: ""
                }
            }

        })

        let expArray = await ExpectedAccuracy.find({}, {});

        let finalList = getShowList.map((data, index) => {
            let foundData = expArray.filter((item) => data.project === item.project && data.queue === item.queue && (data.accuracy <= item.expectedaccuracyto && data.accuracy >= item.expectedaccuracyfrom));

            let object = {};
            if (foundData.length > 0) {
                foundData.forEach((dataNew) => { // Use forEach instead of map
                    if (dataNew.mode === "Client") {
                        object.clientstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
                    }
                    if (dataNew.mode === "Internal") {
                        object.internalstatus = `${dataNew.statusmode} ${dataNew.percentage} %`;
                    }
                });


                return {
                    ...data,
                    ...object
                };

            } else {
                return {
                    ...data,
                    clientstatus: "NIL",
                    internalstatus: "NIL"
                };
            }
        });

        // const { company, branch, unit, team, employeename, type, fromDate, toDate, compare, fromWhere } = req.body;

        const fromWhere = "Internal";

        const fromDate = fromdate;
        const toDate = todate ? todate : fromdate
        const compare = "All"

        const type = ['Penalty', 'Bonus']

        let incomingValue;
        if (fromWhere == "Client") {

            incomingValue = finalList.filter((item) => item.clientstatus !== "NIL" && item.clientstatus !== "" && item.clientstatus !== undefined)

            const fieldToRemove1 = 'internalstatus';

            incomingValue.forEach(obj => delete obj[fieldToRemove1]);
        } else if (fromWhere == "Internal") {
            incomingValue = finalList.filter((item) => item.internalstatus !== "NIL" && item.internalstatus !== "" && item.internalstatus !== undefined)

            const fieldToRemove = 'clientstatus';

            incomingValue.forEach(obj => delete obj[fieldToRemove]);
        }




        let gotList;
        if (fromWhere == "Both") {
            gotList = finalList
        } else if (fromWhere == "Client") {
            gotList = incomingValue;
        } else {
            gotList = incomingValue;
        }
        // console.log(gotList, "gotList")
        filteredData = gotList.filter(entry => {

            const dateMatch = (!fromDate || entry.date >= fromDate) && (!toDate || entry.date <= toDate);

            return dateMatch;
        });


    } catch (err) {
        console.log(err, "accuracy")
    }
    // if (!achievedaccuracyindividual) {
    //     return next(new ErrorHandler('Expected accuracy not found!', 404));
    // }
    return res.status(200).json({
        len: filteredData.length, filteredData
        // achievedaccuracyindividual
    });
})