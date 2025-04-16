const PosterGenerate = require('../../../model/modules/greetinglayout/postergenerate');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const User = require('../../../model/login/auth');
const moment = require('moment');

//get All PosterGenerate =>/api/PosterGenerate
exports.getAllPosterGenerate = catchAsyncErrors(async (req, res, next) => {
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

    let postergenerates;
    try {
        postergenerates = await PosterGenerate.find(filterQuery)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!postergenerates) {
        return next(new ErrorHandler('PosterGenerate not found!', 404));
    }
    return res.status(200).json({
        postergenerates
    });
})
exports.getAllPosterGenerateGroup = catchAsyncErrors(async (req, res, next) => {
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

    let postergenerates;
    try {
        postergenerates = await PosterGenerate.aggregate(
            [
                {
                    '$group': {
                        '_id': '$employeegroupid',
                        'alldatas': {
                            '$push': '$employeename'
                        },
                        'alldatasid': {
                            '$push': '$employeedbid'
                        },
                        'objid': {
                            '$push': '$_id'
                        },
                        'originalData': {
                            '$first': '$$ROOT'
                        }
                    }
                }, {
                    '$addFields': {
                        'originalData': {
                            '$mergeObjects': [
                                '$originalData', {
                                    'alldatas': '$alldatas',
                                    'alldatasid': '$alldatasid',
                                    'objid': '$objid'
                                }
                            ]
                        }
                    }
                }, {
                    '$replaceRoot': {
                        'newRoot': '$originalData'
                    }
                }
            ]
        )
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!postergenerates) {
        return next(new ErrorHandler('PosterGenerate not found!', 404));
    }
    return res.status(200).json({
        postergenerates
    });
})


//create new PosterGenerate => /api/PosterGenerate/new
exports.addPosterGenerate = catchAsyncErrors(async (req, res, next) => {

    let aPosterGenerate = await PosterGenerate.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single PosterGenerate => /api/PosterGenerate/:id
exports.getSinglePosterGenerate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let spostergenerate = await PosterGenerate.findById(id);
    if (!spostergenerate) {
        return next(new ErrorHandler('PosterGenerate not found', 404));
    }
    return res.status(200).json({
        spostergenerate
    })
})

//update PosterGenerate by id => /api/PosterGenerate/:id
exports.updatePosterGenerate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let upostergenerate = await PosterGenerate.findByIdAndUpdate(id, req.body);
    if (!upostergenerate) {
        return next(new ErrorHandler('PosterGenerate not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete PosterGenerate by id => /api/PosterGenerate/:id
exports.deletePosterGenerate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dpostergenerate = await PosterGenerate.findByIdAndRemove(id);
    if (!dpostergenerate) {
        return next(new ErrorHandler('PosterGenerate not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})


exports.getAllUsersDates = catchAsyncErrors(async (req, res, next) => {
    let users, userbirthdaythisweek, userslastmonthdob, usersLastWeekdob, usersthismonthbod;
    try {
        users = await User.find({
            enquirystatus: {
                $nin: ["Enquiry Purpose"]
            },
            resonablestatus: {
                $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
            }
        }, { companyname: 1, doj: 1, dob: 1, doj: 1, dom: 1, _id: 1 });
        // Function to check if a date is in the current week
        const currentDate = moment();
        const currDate = new Date();
        //thisweek
        const startOfWeek = moment().startOf('week');
        const endOfWeek = moment().endOf('week');

        //lastweek
        const startOfLastMonth = moment().subtract(1, 'month').startOf('month');
        const endOfLastMonth = moment().subtract(1, 'month').endOf('month');

        //lastmonth
        const startOfLastWeek = moment().subtract(1, 'week').startOf('week');
        const endOfLastWeek = moment().subtract(1, 'week').endOf('week');

        //thismonth
        const startOfMonth = moment().startOf('month');
        const endOfMonth = moment().endOf('month');


        userbirthdaythisweek = users.filter(user => {
            const userDobExist = user?.dob;
            if (!userDobExist) {
                return false;
            }
            const userDob = moment(userDobExist, 'YYYY-MM-DD');
            userDob.year(currentDate.year());
            return (
                userDob.isBetween(startOfWeek, endOfWeek, null, '[]')
            );
        })
            .map(user => ({ companyname: user.companyname, _id: user._id, dob: moment(user?.dob).year(currentDate.year()).format('MM-DD-YYYY') }));

        userslastmonthdob = users.filter(user => {
            const userDobExist = user?.dob;
            if (!userDobExist) {
                return false;
            }

            const userDob = moment(userDobExist, 'YYYY-MM-DD').year(currentDate.year());

            return userDob.isBetween(startOfLastMonth, endOfLastMonth, null, '[]');
        })
            .map(user => ({
                companyname: user.companyname,
                _id: user._id,
                dob: moment(user?.dob).year(currentDate.year()).format('MM-DD-YYYY')
            }));

        usersLastWeekdob = users.filter(user => {
            const userDobExist = user?.dob;
            if (!userDobExist) {
                return false;
            }

            // Parse user's DOB and set its year to the current year
            const userDob = moment(userDobExist, 'YYYY-MM-DD').year(currentDate.year());

            // Check if the user's DOB falls within the last week
            return userDob.isBetween(startOfLastWeek, endOfLastWeek, null, '[]');
        })
            .map(user => ({
                companyname: user.companyname,
                _id: user._id,
                dob: moment(user?.dob).year(currentDate.year()).format('MM-DD-YYYY')
            }));

        usersthismonthbod = users.filter(user => {
            const userDobExist = user?.dob;
            if (!userDobExist) {
                return false;
            }

            const userDob = moment(userDobExist, 'YYYY-MM-DD').year(currentDate.year());

            return userDob.isBetween(startOfMonth, endOfMonth, null, '[]');
        })
            .map(user => ({
                companyname: user.companyname,
                _id: user._id,
                dob: moment(user?.dob).year(currentDate.year()).format('MM-DD-YYYY')
            }));

        usersallbod = users.filter(user => {
            const userDobExist = user?.dob;
            if (!userDobExist) {
                return false;
            }

            const userDob = moment(userDobExist, 'YYYY-MM-DD').year(currentDate.year());

            return userDob;
        })
            .map(user => ({
                companyname: user.companyname,
                _id: user._id,
                dob: moment(user?.dob).year(currentDate.year()).format('MM-DD-YYYY')
            }));

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!users) {
        return next(new ErrorHandler('Users not found!', 404));
    }
    return res.status(200).json({
        userbirthdaythisweek,
        userslastmonthdob,
        usersLastWeekdob,
        usersthismonthbod,
        usersallbod
        //   userdateofmarriage
    });
})

exports.getAllUsersDatesWeddingAnniversary = catchAsyncErrors(async (req, res, next) => {
    let users, userweddingthisweek, userslastmonthdom, usersLastWeekdom, usersthismonthdom;
    try {
        users = await User.find({
            enquirystatus: {
                $nin: ["Enquiry Purpose"]
            },
            resonablestatus: {
                $nin: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
            }
        }, { companyname: 1, doj: 1, dob: 1, doj: 1, dom: 1, _id: 1 });
        // Function to check if a date is in the current week
        const currentDate = moment();
        const currDate = new Date();
        //thisweek
        const startOfWeek = moment().startOf('week');
        const endOfWeek = moment().endOf('week');

        //lastweek
        const startOfLastMonth = moment().subtract(1, 'month').startOf('month');
        const endOfLastMonth = moment().subtract(1, 'month').endOf('month');

        //lastmonth
        const startOfLastWeek = moment().subtract(1, 'week').startOf('week');
        const endOfLastWeek = moment().subtract(1, 'week').endOf('week');

        //thismonth
        const startOfMonth = moment().startOf('month');
        const endOfMonth = moment().endOf('month');


        userweddingthisweek = users.filter(user => {
            const userDobExist = user?.dom;
            if (!userDobExist) {
                return false;
            }
            const userDob = moment(userDobExist, 'YYYY-MM-DD');
            userDob.year(currentDate.year());
            return (
                userDob.isBetween(startOfWeek, endOfWeek, null, '[]')
            );
        })
            .map(user => ({ companyname: user.companyname, _id: user._id, dom: moment(user?.dom).year(currentDate.year()).format('MM-DD-YYYY') }));

        userslastmonthdom = users.filter(user => {
            const userDobExist = user?.dom;
            if (!userDobExist) {
                return false;
            }

            const userDob = moment(userDobExist, 'YYYY-MM-DD').year(currentDate.year());

            return userDob.isBetween(startOfLastMonth, endOfLastMonth, null, '[]');
        })
            .map(user => ({
                companyname: user.companyname,
                _id: user._id,
                dom: moment(user?.dom).year(currentDate.year()).format('MM-DD-YYYY')
            }));

        usersLastWeekdom = users.filter(user => {
            const userDobExist = user?.dom;
            if (!userDobExist) {
                return false;
            }

            // Parse user's DOB and set its year to the current year
            const userDob = moment(userDobExist, 'YYYY-MM-DD').year(currentDate.year());

            // Check if the user's DOB falls within the last week
            return userDob.isBetween(startOfLastWeek, endOfLastWeek, null, '[]');
        })
            .map(user => ({
                companyname: user.companyname,
                _id: user._id,
                dom: moment(user?.dom).year(currentDate.year()).format('MM-DD-YYYY')
            }));

        usersthismonthdom = users.filter(user => {
            const userDobExist = user?.dom;
            if (!userDobExist) {
                return false;
            }

            const userDob = moment(userDobExist, 'YYYY-MM-DD').year(currentDate.year());

            return userDob.isBetween(startOfMonth, endOfMonth, null, '[]');
        })
            .map(user => ({
                companyname: user.companyname,
                _id: user._id,
                dom: moment(user?.dom).year(currentDate.year()).format('MM-DD-YYYY')
            }));

        usersalldom = users.filter(user => {
            const userDobExist = user?.dom;
            if (!userDobExist) {
                return false;
            }

            const userDob = moment(userDobExist, 'YYYY-MM-DD').year(currentDate.year());

            return userDob;
        })
            .map(user => ({
                companyname: user.companyname,
                _id: user._id,
                dom: moment(user?.dom).year(currentDate.year()).format('MM-DD-YYYY')
            }));



    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!users) {
        return next(new ErrorHandler('Users not found!', 404));
    }
    return res.status(200).json({
        usersthismonthdom,
        userslastmonthdom,
        usersLastWeekdom,
        userweddingthisweek,
        usersalldom
        //   userdateofmarriage
    });
})
