const Applyleave = require('../../../model/modules/leave/applyleave');
const ErrorHandler = require('../../../utils/errorhandler');
const User = require("../../../model/login/auth");
const catchAsyncErrors = require('../../../middleware/catchAsyncError');
const Leavetype = require('../../../model/modules/leave/leavetype');
const LeaveVerification = require("../../../model/modules/leave/leaveverification");


//get All Applyleave =>/api/Applyleave
exports.getAllApplyleave = catchAsyncErrors(async (req, res, next) => {
    let applyleaves;
    try {
        applyleaves = await Applyleave.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!applyleaves) {
        return next(new ErrorHandler('Applyleave not found!', 404));
    }
    return res.status(200).json({
        applyleaves
    });
})
exports.getActiveApplyleave = catchAsyncErrors(async (req, res, next) => {
    let applyleaves;
    let users;
    try {
        users = await User.find(
            {

                resonablestatus: {
                    $in: ["Not Joined", "Postponed", "Rejected", "Closed", "Releave Employee", "Absconded", "Hold", "Terminate"],
                },
            },
            {

                companyname: 1,
            }
        );

        let companyname = users.map(d => d.companyname)
        applyleaves = await Applyleave.find({ employeename: { $nin: companyname }, status: "Applied" }, {});
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!applyleaves) {
        return next(new ErrorHandler('Data not found!', 404));
    }
    return res.status(200).json({
        applyleaves
    });
})
//get All Applyleave =>/api/Applyleavefilter
exports.getAllApplyleaveFilter = catchAsyncErrors(async (req, res, next) => {
    let applyleaves;
    try {
        applyleaves = await Applyleave.find(
            {},
            {
                company: 1,
                branch: 1,
                unit: 1,
                team: 1,
                department: 1,
                date: 1,
                status: 1,
                employeename: 1,
                employeeid: 1,
                leavetype: 1,
                reasonforleave: 1,
                rejectedreason: 1,
                numberofdays: 1,
            }
        );
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!applyleaves) {
        return next(new ErrorHandler("Applyleave not found!", 404));
    }
    return res.status(200).json({
        applyleaves,
    });
});

//create new Applyleave => /api/Applyleave/new
exports.addApplyleave = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aApplyleave = await Applyleave.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Applyleave => /api/Applyleave/:id
exports.getSingleApplyleave = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sapplyleave = await Applyleave.findById(id);
    if (!sapplyleave) {
        return next(new ErrorHandler('Applyleave not found', 404));
    }
    return res.status(200).json({
        sapplyleave
    })
})

//update Applyleave by id => /api/Applyleave/:id
exports.updateApplyleave = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uapplyleave = await Applyleave.findByIdAndUpdate(id, req.body);
    if (!uapplyleave) {
        return next(new ErrorHandler('Applyleave not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Applyleave by id => /api/Applyleave/:id
exports.deleteApplyleave = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dapplyleave = await Applyleave.findByIdAndRemove(id);
    if (!dapplyleave) {
        return next(new ErrorHandler('Applyleave not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.getAllApplyleaveApprovedForUserShiftRoaster = catchAsyncErrors(async (req, res, next) => {
    let applyleave;
    let leavetype;
    let applyleaves = [];
    try {
        applyleave = await Applyleave.find({}, { status: req.body.status, usershifts: 1, leavetype: 1, employeeid: 1 },);
        leavetype = await Leavetype.find();

        leavetype?.map((type) => {
            applyleave?.forEach((d) => {
                if (type.leavetype === d.leavetype) {
                    d.usershifts.forEach((shift) => {
                        applyleaves.push({
                            date: shift.formattedDate,
                            leavetype: d.leavetype,
                            status: d.status,
                            code: type.code,
                            tookleavecheckstatus: shift.tookleavecheckstatus,
                            leavestatus: shift.leavestatus,
                            shiftcount: shift.shiftcount,
                            empcode: d.employeeid,
                        });
                    });
                }
            });
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!applyleaves) {
        return next(new ErrorHandler('Applyleave not found!', 404));
    }
    return res.status(200).json({
        applyleaves
    });
})
exports.getAllApprovedLeave = catchAsyncErrors(async (req, res, next) => {
    let approvedleaves;
    try {
        approvedleaves = await Applyleave.find({ status: 'Approved' })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!approvedleaves) {
        return res.json({});
    }
    return res.status(200).json({
        approvedleaves
    });
});
exports.getAllApplyleaveApprovedForUserShiftRoasterAssignbranch = catchAsyncErrors(async (req, res, next) => {
    const { assignbranch } = req.body;


    const query = {}
    if (assignbranch.length > 0) {
        query.$or = assignbranch.map(item => ({
            company: item.company,
            branch: item.branch,
            unit: item.unit

        }))
    };

    let applyleave;
    let leavetype;
    let applyleaves = [];
    try {
        applyleave = await Applyleave.find(query, { status: req.body.status, usershifts: 1, leavetype: 1, employeeid: 1 },);
        leavetype = await Leavetype.find(query);

        leavetype?.map((type) => {
            applyleave?.forEach((d) => {
                if (type.leavetype === d.leavetype) {
                    d.usershifts.forEach((shift) => {
                        applyleaves.push({
                            date: shift.formattedDate,
                            leavetype: d.leavetype,
                            status: d.status,
                            code: type.code,
                            tookleavecheckstatus: shift.tookleavecheckstatus,
                            leavestatus: shift.leavestatus,
                            shiftcount: shift.shiftcount,
                            empcode: d.employeeid,
                        });
                    });
                }
            });
        });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!applyleaves) {
        return next(new ErrorHandler('Applyleave not found!', 404));
    }
    return res.status(200).json({
        applyleaves
    });
})



exports.getAllApplyleaveHome = catchAsyncErrors(async (req, res, next) => {
    let applyleaves;
    try {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

        // console.log(formattedDate, "formattedDateapp")
        const { assignbranch } = req.body;

        const branchFilter = assignbranch.map((branchObj) => ({
            branch: branchObj.branch,
            company: branchObj.company,
            unit: branchObj.unit
        }));

        let Query = { $or: branchFilter };

        let filterQuery = {
            status: "Approved",
            date: { $in: formattedDate },
            ...Query
        }


        applyleaves = await Applyleave.countDocuments(filterQuery, { date: 1 })
        // console.log(applyleaves, 'uihi')

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!applyleaves) {
    //     return next(new ErrorHandler('Applyleave not found!', 404));
    // }
    return res.status(200).json({
        applyleaves
    });
})



exports.getAllApplyleaveHomeList = catchAsyncErrors(async (req, res, next) => {
    let applyleaves;
    try {
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

        // console.log(formattedDate, "formattedDate") 
        applyleaves = await Applyleave.find({ status: "Approved", date: { $in: formattedDate } }, { employeename: 1, employeeid: 1, leavetype: 1, date: 1, noofshift: 1, reasonforleave: 1, status: 1 })
        // console.log(applyleaves)

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!applyleaves) {
        return next(new ErrorHandler('Applyleave not found!', 404));
    }
    return res.status(200).json({
        applyleaves
    });
})


exports.getAllApplyleaveFilterHome = catchAsyncErrors(async (req, res, next) => {
    let applyleaves, leaveverification;
    try {
        const branchFilter = req.body.assignbranch.map((branchObj) => ({
            branch: branchObj.branch,
            company: branchObj.company,
            unit: branchObj.unit
        }));

        let Query = { $or: branchFilter }

        // console.log(req.body, "request")
        if (!req.body.role.includes("Manager")) {
            leaveverification = await LeaveVerification.find({ employeenameto: { $in: req.body.username } }, { employeenamefrom: 1, _id: 0 })
            // console.log(leaveverification.map(d => d.employeenamefrom).flat(), "leaveveri")
            applyleaves = await Applyleave.countDocuments(
                {

                    status: "Applied",
                    employeename: { $in: leaveverification.map(d => d.employeenamefrom).flat() }
                },
                {
                    company: 1,
                    branch: 1,
                    unit: 1,
                    team: 1,
                    department: 1,
                    date: 1,
                    status: 1,
                    employeename: 1,
                    employeeid: 1,
                    leavetype: 1,
                    reasonforleave: 1,
                    rejectedreason: 1,
                    numberofdays: 1,
                }
            );

        } else {

            applyleaves = await Applyleave.countDocuments(
                { status: "Applied", },
                {
                    company: 1,
                    branch: 1,
                    unit: 1,
                    team: 1,
                    department: 1,
                    date: 1,
                    status: 1,
                    employeename: 1,
                    employeeid: 1,
                    leavetype: 1,
                    reasonforleave: 1,
                    rejectedreason: 1,
                    numberofdays: 1,
                }
            );


        }


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!applyleaves) {
        return next(new ErrorHandler("Applyleave not found!", 404));
    }
    return res.status(200).json({
        applyleaves,
    });
});


exports.getAllApplyleaveApprovedForUserShiftRoasterAssignbranchHome = catchAsyncErrors(async (req, res, next) => {


    let applyleave;
    let leavetype;
    let applyleaves = [];
    try {
        applyleave = await Applyleave.find({ status: "Approved" }, { status: 1, usershifts: 1, leavetype: 1, employeeid: 1 },);
        leavetype = await Leavetype.find();

        // leavetype?.map((type) => {
        //     applyleave?.forEach((d) => {
        //         if (type.leavetype === d.leavetype) {
        //             d.usershifts.forEach((shift) => {
        //                 applyleaves.push({
        //                     date: shift.formattedDate,
        //                     leavetype: d.leavetype,
        //                     status: d.status,
        //                     code: type.code,
        //                     tookleavecheckstatus: shift.tookleavecheckstatus,
        //                     leavestatus: shift.leavestatus,
        //                     shiftcount: shift.shiftcount,
        //                     empcode: d.employeeid,
        //                 });
        //             });
        //         }
        //     });
        // });


        applyleave?.forEach((d) => {
            d.usershifts.forEach((shift) => {
                applyleaves.push({
                    date: shift.formattedDate,
                    leavetype: d.leavetype,
                    status: d.status,
                    tookleavecheckstatus: shift.tookleavecheckstatus,
                    leavestatus: shift.leavestatus,
                    shiftcount: shift.shiftcount,
                    empcode: d.employeeid,
                });
            });
        });
    } catch (err) {
        console.log(err, "rr")
        return next(new ErrorHandler("Records not found!", 404));
    }
    // if (!applyleaves) {
    //     return next(new ErrorHandler('Applyleave not found!', 404));
    // }
    return res.status(200).json({
        applyleaves
    });
})
