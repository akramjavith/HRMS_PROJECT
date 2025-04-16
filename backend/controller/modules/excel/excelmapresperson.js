const Excelmaprespersondata = require('../../../model/modules/excel/excelmapresperson');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Teams = require('../../../model/modules/teams');
const Branch = require('../../../model/modules/branch');
const User = require('../../../model/login/auth');

// get All excel => /api/excel
exports.getAllExcelmaprespersondata = catchAsyncErrors(async (req, res, next) => {
    let excelmaprespersondatas;
    try {
        excelmaprespersondatas = await Excelmaprespersondata.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!excelmaprespersondatas) {
        return next(new ErrorHandler('Excel Responsible  not found!', 404));
    }
    return res.status(200).json({
        excelmaprespersondatas
    });
})

// fetch data from excelmapdatarespeople db based on the login user or alocated team for the user
exports.getIndividualWorkOrderList = catchAsyncErrors(async (req, res, next) => {
    try {
        // Step 1: Fetch the logged-in user's companyname and team
        const { companyname, team } = req.body;
        // Step 2: Build the query to find data based on companyname or team
        //const query = {
        //$or: [
        // { 'todo.resperson': companyname }, // Check if companyname matches resperson
        //   { 'todo.team': team } // Check if team matches team
        // ]
        //};
        const queryindividual = {
            todo: {
                $elemMatch: {
                    resperson: req.body.companyname,
                    priority: "Primary",
                }
            }
        };
        const queryteam = {
            todo: {
                $elemMatch: {
                    team: req.body.team,
                    priority: "Primary",
                }
            }
        };
        // Step 3: Find data that matches the query
        const individuallist = await Excelmaprespersondata.find(queryindividual);
        const teamlist = await Excelmaprespersondata.find(queryteam);
        // Step 4: Transform the data into the desired format


        const transformedDataIndividual = [];
        const transformedDataTeam = [];

        individuallist.forEach((item) => {
            item.todo.forEach((todoItem) => {
                if (todoItem.resperson === companyname && todoItem.priority === "Primary") {

                    transformedDataIndividual.push({
                        project: item.project,
                        vendor: item.vendor,
                        priority: item.priority,
                        customer: item.customer,
                        process: item.process,
                        hyperlink: item.hyperlink == undefined ? "" : item.hyperlink,
                        count: item.count,
                        branch: todoItem.branch,
                        resperson: todoItem.resperson,
                        tat: item.tat,
                        created: item.created,
                        category: item.category,
                        subcategory: item.subcategory,
                        queue: item.queue,
                        unit: todoItem.unit,
                        team: todoItem.team,
                        prioritystatus: todoItem.priority,
                        points: item.points,
                        time: item.time,
                    });
                }

            });
        });


        teamlist.forEach((item) => {
            item.todo.forEach((todoItem) => {
                if (todoItem.team === team && todoItem.priority === "Primary") {

                    transformedDataTeam.push({
                        project: item.project,
                        vendor: item.vendor,
                        priority: item.priority,
                        customer: item.customer,
                        process: item.process,
                        hyperlink: item.hyperlink == undefined ? "" : item.hyperlink,
                        count: item.count,
                        branch: todoItem.branch,
                        resperson: todoItem.resperson,
                        tat: item.tat,
                        created: item.created,
                        category: item.category,
                        subcategory: item.subcategory,
                        queue: item.queue,
                        unit: todoItem.unit,
                        team: todoItem.team,
                        prioritystatus: todoItem.priority,
                        points: item.points,
                        time: item.time,
                    });
                }

            });
        });

        return res.status(200).json({
            individuallist: transformedDataIndividual.length > 0 ? transformedDataIndividual : transformedDataTeam,
        });
    } catch (err) {
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});
//category
exports.getCategoryReport = catchAsyncErrors(async (req, res, next) => {
    try {

        const categoryies = await Category.find({}, 'name');


        const categoryTotal = {};

        // Step 3: Initialize totals for each branch
        categoryies.forEach((cat) => {
            categoryTotal[cat.name] = {
                totalCount: 0,
                totalPoints: 0,
                time: { hours: 0, minutes: 0, seconds: 0 }
            };
        });


        // Fetch data from the database, replace this with your actual query
        const rawData = await Excelmapdata.find({});


        rawData.forEach((item) => {
            const timeParts = item.time.split(":");
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const seconds = parseInt(timeParts[2]);


            const category = item.category;
            const points = parseFloat(item.points);
            const count = BigInt(item.count);

            // Step 5: Check if the branch matches any of the fetched branches
            if (categoryTotal.hasOwnProperty(category)) {
                categoryTotal[category].totalCount += Number(count);
                categoryTotal[category].totalPoints += Number(points);

                // Update the time variables
                categoryTotal[category].time.hours += hours;
                categoryTotal[category].time.minutes += minutes;
                categoryTotal[category].time.seconds += seconds;
            }
        });

        // Prepare the response
        const categoryTotalArray = Object.keys(categoryTotal).map((categories) => ({
            categories,
            totalCount: categoryTotal[categories].totalCount,
            totalPoints: parseFloat(categoryTotal[categories].totalPoints.toFixed(4)),
            totalTime: `${categoryTotal[categories].time.hours.toString().padStart(2, '0')}:${categoryTotal[categories].time.minutes.toString().padStart(2, '0')}:${categoryTotal[categories].time.seconds.toString().padStart(2, '0')}`

        }));

        return res.status(200).json({
            categoryTotal: categoryTotalArray
        });
    } catch (err) {
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});

// get Filtered allotted Filter Responsible Queue Lit
exports.getAllottedResponsibleQueueList = catchAsyncErrors(async (req, res, next) => {
    let excelmaprespersondatas,totalProjectsd, result,totalProjects,excelmapdatas ,excelData,  query, filteredQuery, matchingData;
    let {page , pageSize , value} = req.body;
    const skip = (page - 1) * pageSize; // Calculate the number of items to skip
    const limit = pageSize;
    try {

        totalProjectsd =  await Excelmaprespersondata.countDocuments();
        excelData =  await Excelmaprespersondata.find().skip((page - 1) * pageSize)
        .limit(parseInt(pageSize)) 

        query = {
            project: req.body.project,
            vendor: req.body.vendor,
            category: req.body.category,
            subcategory: req.body.subcategory,
            queue: req.body.queue,
            todo: {
                $elemMatch: {
                    branch: req.body.branch,
                    unit: req.body.unit,
                    team: req.body.team,
                    resperson: req.body.resperson,
                    priority: req.body.prioritystatus,
                }

            }
            
        };


        function removeEmpty(obj) {
            const newObj = {};
            for (const key in obj) {
                if (obj[key] !== "" && obj[key] !== undefined) {
                    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
                        const nestedObj = removeEmpty(obj[key]); // Recursively remove empty values from nested objects
                        if (Object.keys(nestedObj).length > 0) {
                            newObj[key] = nestedObj;
                        }
                    } else {
                        newObj[key] = obj[key];
                    }
                }
            }
            return newObj;
        }
        

        // Remove empty values from the query
        filteredQuery = removeEmpty(query);

        excelmaprespersondatas = await Excelmaprespersondata.find(filteredQuery).lean();

        excelmapdatas = excelmaprespersondatas.slice(skip, skip + limit);

        function isEmpty(obj) {
            return Object.keys(obj).length === 0 && obj.constructor === Object;
        }

        result = (["cleared"]?.includes(value)  ||  isEmpty(filteredQuery) ) ? excelData : excelmapdatas
        totLength = (["cleared"]?.includes(value)  ||  isEmpty(filteredQuery) ) ? totalProjectsd : excelmapdatas?.length


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({

        result,
        totalProjects : totLength,
        currentPage: page,
        totalPages: Math.ceil(totLength / pageSize),    });
})

//queue
exports.getQueueReport = catchAsyncErrors(async (req, res, next) => {
    try {

        const queue = await Queue.find({}, 'name');


        const queueTotal = {};

        // Step 3: Initialize totals for each branch
        queue.forEach((cat) => {
            queueTotal[cat.name] = {
                totalCount: 0,
                totalPoints: 0,
                time: { hours: 0, minutes: 0, seconds: 0 }
            };
        });


        // Fetch data from the database, replace this with your actual query
        const rawData = await Excelmapdata.find({});


        rawData.forEach((item) => {
            const timeParts = item.time.split(":");
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const seconds = parseInt(timeParts[2]);


            const queue = item.queue;
            const points = parseFloat(item.points);
            const count = BigInt(item.count);

            // Step 5: Check if the branch matches any of the fetched branches
            if (queueTotal.hasOwnProperty(queue)) {
                queueTotal[queue].totalCount += Number(count);
                queueTotal[queue].totalPoints += Number(points);

                // Update the time variables
                queueTotal[queue].time.hours += hours;
                queueTotal[queue].time.minutes += minutes;
                queueTotal[queue].time.seconds += seconds;
            }
        });

        // Prepare the response
        const queueTotalArray = Object.keys(queueTotal).map((queues) => ({
            queues,
            totalCount: queueTotal[queues].totalCount,
            totalPoints: parseFloat(queueTotal[queues].totalPoints.toFixed(4)),
            totalTime: `${queueTotal[queues].time.hours.toString().padStart(2, '0')}:${queueTotal[queues].time.minutes.toString().padStart(2, '0')}:${queueTotal[queues].time.seconds.toString().padStart(2, '0')}`

        }));

        return res.status(200).json({
            queueTotal: queueTotalArray
        });
    } catch (err) {
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});

//customer
exports.getCustomerReport = catchAsyncErrors(async (req, res, next) => {
    try {

        const excel = await Excel.find();
        const customer = (excel[((excel).length) - 1]?.exceldata).filter(item => (item.customer)?.toLowerCase() !== 'customer' && (item.process)?.toLowerCase() !== 'process')

        const customerTotal = {};

        // Step 3: Initialize totals for each branch
        customer.forEach((cat) => {
            customerTotal[cat.customer] = {
                totalCount: 0,
                totalPoints: 0,
                time: { hours: 0, minutes: 0, seconds: 0 }
            };
        });


        // Fetch data from the database, replace this with your actual query
        const rawData = await Excelmapdata.find({});


        rawData.forEach((item) => {
            const timeParts = item.time.split(":");
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const seconds = parseInt(timeParts[2]);


            const customer = item.customer;
            const points = parseFloat(item.points);
            const count = BigInt(item.count);

            // Step 5: Check if the branch matches any of the fetched branches
            if (customerTotal.hasOwnProperty(customer)) {
                customerTotal[customer].totalCount += Number(count);
                customerTotal[customer].totalPoints += Number(points);

                // Update the time variables
                customerTotal[customer].time.hours += hours;
                customerTotal[customer].time.minutes += minutes;
                customerTotal[customer].time.seconds += seconds;
            }
        });

        // Prepare the response
        const customerTotalArray = Object.keys(customerTotal).map((customers) => ({
            customers,
            totalCount: customerTotal[customers].totalCount,
            totalPoints: parseFloat(customerTotal[customers].totalPoints.toFixed(4)),
            totalTime: `${customerTotal[customers].time.hours.toString().padStart(2, '0')}:${customerTotal[customers].time.minutes.toString().padStart(2, '0')}:${customerTotal[customers].time.seconds.toString().padStart(2, '0')}`

        }));
        return res.status(200).json({
            customerTotal: customerTotalArray
        });
    } catch (err) {
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});


//branch
exports.getBranchCount = catchAsyncErrors(async (req, res, next) => {
    try {
        // Step 1: Fetch branches from the Branch model
        const branches = await Branch.find({}, 'name'); // Assuming you have a 'name' field in your Branch model.

        // Step 2: Initialize an object to store branch totals
        const branchTotal = {};

        // Step 3: Initialize totals for each branch
        branches.forEach((branch) => {
            branchTotal[branch.name] = {
                totalCount: 0,
                totalPoints: 0,
                time: { hours: 0, minutes: 0, seconds: 0 }
            };
        });

        // Step 4: Process the fetched data
        const data = await Excelmaprespersondata.find();

        data.forEach((item) => {
            const timeParts = item.time.split(":");
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const seconds = parseInt(timeParts[2]);

            item.todo.forEach((todoItem) => {
                const branch = todoItem.branch;
                const points = parseFloat(item.points);
                const count = BigInt(item.count);

                // Step 5: Check if the branch matches any of the fetched branches
                if (branchTotal.hasOwnProperty(branch)) {
                    branchTotal[branch].totalCount += Number(count);
                    branchTotal[branch].totalPoints += Number(points);

                    // Update the time variables
                    branchTotal[branch].time.hours += hours;
                    branchTotal[branch].time.minutes += minutes;
                    branchTotal[branch].time.seconds += seconds;
                }
            });
        });


        // Prepare the response
        const branchTotalArray = Object.keys(branchTotal).map((branch) => ({
            branch,
            totalCount: branchTotal[branch].totalCount,
            totalPoints: parseFloat(branchTotal[branch].totalPoints.toFixed(4)),
            totalTime: `${branchTotal[branch].time.hours.toString().padStart(2, '0')}:${branchTotal[branch].time.minutes.toString().padStart(2, '0')}:${branchTotal[branch].time.seconds.toString().padStart(2, '0')}`
        }));


        return res.status(200).json({
            branchtotal: branchTotalArray,
        });
    } catch (err) {
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});

// compare resperson with user master role == "employee" and calculate count, point and time
exports.getResPersonCount = catchAsyncErrors(async (req, res, next) => {
    try {

        const employees = await User.find({ role: { $nin: ["Manager", "Director"] } }, 'companyname');


        // Step 2: Initialize an object to store resperson totals
        const respersonTotal = {};

        // Step 3: Initialize totals for each resperson
        employees.forEach((employee) => {
            respersonTotal[employee.companyname] = {
                totalCount: 0,
                totalPoints: 0,
                time: { hours: 0, minutes: 0, seconds: 0 }
            };
        });

        // Step 4: Process the fetched data from Excelmaprespersondata
        const data = await Excelmaprespersondata.find();

        data.forEach((item) => {
            const timeParts = item.time.split(":");
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const seconds = parseInt(timeParts[2]);

            item.todo.forEach((todoItem) => {
                const resperson = todoItem.resperson;
                const points = parseFloat(item.points);
                const count = BigInt(item.count);

                // Step 5: Check if the resperson matches any of the fetched employees
                if (respersonTotal.hasOwnProperty(resperson)) {
                    respersonTotal[resperson].totalCount += Number(count);
                    respersonTotal[resperson].totalPoints += Number(points);

                    // Update the time variables
                    respersonTotal[resperson].time.hours += hours;
                    respersonTotal[resperson].time.minutes += minutes;
                    respersonTotal[resperson].time.seconds += seconds;
                }
            });
        });

        // Prepare the response
        const respersonTotalArray = Object.keys(respersonTotal).map((resperson) => ({
            resperson,
            totalCount: respersonTotal[resperson].totalCount,
            totalPoints: parseFloat(respersonTotal[resperson].totalPoints.toFixed(4)),
            totalTime: `${respersonTotal[resperson].time.hours.toString().padStart(2, '0')}:${respersonTotal[resperson].time.minutes.toString().padStart(2, '0')}:${respersonTotal[resperson].time.seconds.toString().padStart(2, '0')}`
        }));

        return res.status(200).json({
            respersontotal: respersonTotalArray,
        });
    } catch (err) {
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});


//TEAMWISE REPORT
exports.getTeamCount = catchAsyncErrors(async (req, res, next) => {
    try {
        // Step 1: Fetch branches from the Branch model
        const teams = await Teams.find({}, 'teamname'); // Assuming you have a 'name' field in your Branch model.
        // Step 2: Initialize an object to store branch totals
        const teamTotal = {};
        // Step 3: Initialize totals for each branch
        teams.forEach((team) => {
            teamTotal[team.teamname] = {
                totalCount: 0,
                totalPoints: 0,
                time: { hours: 0, minutes: 0, seconds: 0 }
            };
        });

        // Fetch data from your MongoDB database
        const data = await Excelmaprespersondata.find();
        // Process the fetched data
        data.forEach((item) => {
            // Initialize variables outside the inner loop
            const timeParts = item.time.split(":");
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const seconds = parseInt(timeParts[2]);
            item.todo.forEach((todoItem) => {
                const team = todoItem.team;
                const points = parseFloat(item.points);
                const count = BigInt(item.count);
                if (teamTotal.hasOwnProperty(team)) {
                    teamTotal[team].totalCount += Number(count);
                    teamTotal[team].totalPoints += Number(points);
                    // Update the time variables
                    teamTotal[team].time.hours += hours;
                    teamTotal[team].time.minutes += minutes;
                    teamTotal[team].time.seconds += seconds;
                }
            });
        });
        // Calculate overall count, overall points, and overall time
        let overallCount = 0;
        let overallPoints = 0;
        let overallTime = { hours: 0, minutes: 0, seconds: 0 };
        for (const team in teamTotal) {
            overallCount += teamTotal[team].totalCount;
            overallPoints += teamTotal[team].totalPoints;
            const teamTime = teamTotal[team].time;
            overallTime.hours += teamTime.hours;
            overallTime.minutes += teamTime.minutes;
            overallTime.seconds += teamTime.seconds;
        }
        // Adjust overall time for carryovers
        let carry = 0;
        if (overallTime.seconds >= 60) {
            carry = Math.floor(overallTime.seconds / 60);
            overallTime.seconds = overallTime.seconds % 60;
        }
        if (overallTime.minutes + carry >= 60) {
            carry = Math.floor((overallTime.minutes + carry) / 60);
            overallTime.minutes = (overallTime.minutes + carry) % 60;
        }
        overallTime.hours += carry;
        // Format the overall time
        const overallTimeFormatted = `${overallTime.hours.toString().padStart(2, '0')}:${overallTime.minutes.toString().padStart(2, '0')}:${overallTime.seconds.toString().padStart(2, '0')}`;
        // Convert teamTotal object into an array of objects
        const teamTotalArray = Object.keys(teamTotal).map((team) => ({
            team,
            totalCount: teamTotal[team].totalCount,
            totalPoints: parseFloat(teamTotal[team].totalPoints),
            totalTime: `${teamTotal[team].time.hours.toString().padStart(2, '0')}:${teamTotal[team].time.minutes.toString().padStart(2, '0')}:${teamTotal[team].time.seconds.toString().padStart(2, '0')}`
        }));
        // Push the overall summary directly into the teamTotal array
        // teamTotalArray.push({
        //     overallCount,
        //     overallPoints,
        //     overallTime: overallTimeFormatted
        // });
        return res.status(200).json({
            teamtotal: teamTotalArray
        });
    } catch (err) {
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});

// compare resperson with user master role == "employee" and calculate count, point and time
exports.getResPersonCount = catchAsyncErrors(async (req, res, next) => {
    try {
       
        const employees = await User.find({ role: { $nin: ["Manager", "Director"] } }, 'companyname');


        // Step 2: Initialize an object to store resperson totals
        const respersonTotal = {};

        // Step 3: Initialize totals for each resperson
        employees.forEach((employee) => {
            respersonTotal[employee.companyname] = {
                totalCount: 0,
                totalPoints: 0,
                time: { hours: 0, minutes: 0, seconds: 0 }
            };
        });

        // Step 4: Process the fetched data from Excelmaprespersondata
        const data = await Excelmaprespersondata.find();

        data.forEach((item) => {
            const timeParts = item.time.split(":");
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const seconds = parseInt(timeParts[2]);

            item.todo.forEach((todoItem) => {
                const resperson = todoItem.resperson;
                const points = parseFloat(item.points);
                const count = parseInt(item.count);

                // Step 5: Check if the resperson matches any of the fetched employees
                if (respersonTotal.hasOwnProperty(resperson)) {
                    respersonTotal[resperson].totalCount += count;
                    respersonTotal[resperson].totalPoints += points;

                    // Update the time variables
                    respersonTotal[resperson].time.hours += hours;
                    respersonTotal[resperson].time.minutes += minutes;
                    respersonTotal[resperson].time.seconds += seconds;
                }
            });
        });

        // Prepare the response
        const respersonTotalArray = Object.keys(respersonTotal).map((resperson) => ({
            resperson,
            totalCount: respersonTotal[resperson].totalCount,
            totalPoints: parseFloat(respersonTotal[resperson].totalPoints.toFixed(4)),
            totalTime: `${respersonTotal[resperson].time.hours.toString().padStart(2, '0')}:${respersonTotal[resperson].time.minutes.toString().padStart(2, '0')}:${respersonTotal[resperson].time.seconds.toString().padStart(2, '0')}`
        }));

        return res.status(200).json({
            respersontotal: respersonTotalArray,
        });
    } catch (err) {
        return next(new ErrorHandler('An error occurred while fetching data.', 500));
    }
});


// Create new excel => /api/excel/new
exports.addExcelmaprespersondata = catchAsyncErrors(async (req, res, next) => {
    let checkproj = await Excelmaprespersondata.findOne({ $and: [{ customer: req.body.customer }, { process: req.body.process }] });
    if (checkproj) {
        return next(new ErrorHandler('Data already exist!', 400));
    }
    let aexcelmaprespersondata = await Excelmaprespersondata.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });

    //    let aexcelmaprespersondata = await Excelmaprespersondata.create(req.body)

    //     return res.status(200).json({ 
    //         message: 'Successfully added!' 
    //     });
})


// get Single excel => /api/excel/:id
exports.getSingleExcelmaprespersondata = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let sexcelmaprespersondata = await Excelmaprespersondata.findById(id);
    if (!sexcelmaprespersondata) {
        return next(new ErrorHandler('Excelmaprespersondata not found!', 404));
    }
    return res.status(200).json({
        sexcelmaprespersondata
    })
})


// update excel by id => /api/excel/:id
exports.updateExcelmaprespersondata = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let uexcelmaprespersondata = await Excelmaprespersondata.findByIdAndUpdate(id, req.body);

    if (!uexcelmaprespersondata) {
        return next(new ErrorHandler('Excel Responsible person not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})


// delete excel by id => /api/excel/:id
exports.deleteExcelmaprespersondata = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dexcelmaprespersondata = await Excelmaprespersondata.findByIdAndRemove(id);

    if (!dexcelmaprespersondata) {
        return next(new ErrorHandler('Excel not found!', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})