const Managepenaltymonth = require("../../../model/modules/penalty/penaltymonth");
const Penaltydayupload = require("../../../model/modules/penalty/penaltydayupload");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

// get All Managepenaltymonth Name => /api/Managepenaltymonth
exports.getAllManagepenaltymonth = catchAsyncErrors(async (req, res, next) => {
    let managepenaltymonth;
    try {
        managepenaltymonth = await Managepenaltymonth.find().sort({ fromdate: -1 });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!managepenaltymonth) {
        return next(new ErrorHandler("Managepenaltymonth  not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        managepenaltymonth,
    });
});


// get All Managepenaltymonth Name => /api/Managepenaltymonth
exports.getFilterManagepenaltymonth = catchAsyncErrors(async (req, res, next) => {
    let managepenaltymonth, daypoints, ans;
    try {
        managepenaltymonth = await Managepenaltymonth.find({ _id: req.body.id });
        daypoints = await Penaltydayupload.find();
        let answer = daypoints.map((data) => data.uploaddata).flat();
        ans = answer.filter(data => data.date >= managepenaltymonth[0].fromdate && data.date <= managepenaltymonth[0].todate)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        managepenaltymonth, ans
    });
});
// Create new Managepenaltymonth=> /api/Managepenaltymonth/new
exports.addManagepenaltymonth = catchAsyncErrors(async (req, res, next) => {
    let aManagepenaltymonth = await Managepenaltymonth.create(req.body);

    return res.status(200).json({
        message: "Successfully added!",
    });
});

// get Signle Managepenaltymonth => /api/Managepenaltymonth/:id
exports.getSingleManagepenaltymonth = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let smanagepenaltymonth = await Managepenaltymonth.findById(id);

    if (!smanagepenaltymonth) {
        return next(new ErrorHandler("Managepenaltymonth  not found!", 404));
    }
    return res.status(200).json({
        smanagepenaltymonth,
    });
});

// update Managepenaltymonth by id => /api/Managepenaltymonth/:id
exports.updateManagepenaltymonth = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    if (!umanagepenaltymonth) {
        return next(new ErrorHandler("Managepenaltymonth not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

// delete Managepenaltymonth by id => /api/Managepenaltymonth/:id
exports.deleteManagepenaltymonth = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dmanagepenaltymonth = await Managepenaltymonth.findByIdAndRemove(id);

    if (!dmanagepenaltymonth) {
        return next(new ErrorHandler("Managepenaltymonth  not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});


exports.getAllPenaltyMonthView = catchAsyncErrors(async (req, res, next) => {

    try {
        const penaltymonthall = await Penaltydayupload.find({ date: { $gte: req.body.fromdate, $lte: req.body.todate } }, { uploaddata: 1 })


        let penaltymonth = penaltymonthall
            .map((data) => data.uploaddata)
            .flat()
            .reduce((acc, current) => {
                const existingItemIndex = acc.findIndex((item) => item.name === current.name && item.company === current.company && item.vendorname === current.vendorname && item.process === current.process && item.branch === current.branch);

                if (existingItemIndex !== -1) {
                    // Update existing item
                    const existingItem = acc[existingItemIndex];
                    existingItem.totalfield += Number(current.totalfield);
                    existingItem.autoerror += Number(current.autoerror);
                    existingItem.manualerror += Number(current.manualerror);
                    existingItem.uploaderror += Number(current.uploaderror);
                    existingItem.moved += Number(current.moved);
                    existingItem.notupload += Number(current.notupload);
                    existingItem.penalty += Number(current.penalty);
                    existingItem.nonpenalty += Number(current.nonpenalty);
                    existingItem.bulkupload += Number(current.bulkupload);
                    existingItem.bulkkeying += Number(current.bulkkeying);
                    existingItem.edited1 += Number(current.edited1);
                    existingItem.edited2 += Number(current.edited2);
                    existingItem.edited3 += Number(current.edited3);
                    existingItem.edited4 += Number(current.edited4);
                    existingItem.reject1 += Number(current.reject1);
                    existingItem.reject2 += Number(current.reject2);
                    existingItem.reject3 += Number(current.reject3);
                    existingItem.reject4 += Number(current.reject4);
                    existingItem.notvalidate += Number(current.notvalidate);
                    existingItem.validateerror += Number(current.validateerror);
                    existingItem.waivererror += Number(current.waivererror);
                    existingItem.neterror += Number(current.neterror);
                    existingItem.percentage += Number(current.percentage);
                    existingItem.amount += Number(current.amount);
                    existingItem.fromdate = req.body.fromdate;
                    existingItem.todate = req.body.todate;


                } else {
                    // Add new item
                    acc.push({


                        company: current.company,
                        branch: current.branch,
                        unit: current.unit,
                        team: current.team,
                        empcode: current.empcode,
                        name: current.name,
                        processcode: current.processcode,
                        vendorname: current.vendorname,
                        process: current.process,

                        totalfield: Number(current.totalfield),
                        autoerror: Number(current.autoerror),
                        manualerror: Number(current.manualerror),
                        uploaderror: Number(current.uploaderror),
                        moved: Number(current.moved),
                        notupload: Number(current.notupload),
                        penalty: Number(current.penalty),
                        nonpenalty: Number(current.nonpenalty),
                        bulkupload: Number(current.bulkupload),

                        bulkkeying: Number(current.bulkkeying),
                        edited1: Number(current.edited1),
                        edited2: Number(current.edited2),
                        edited3: Number(current.edited3),
                        edited4: Number(current.edited4),


                        reject1: Number(current.reject1),
                        reject2: Number(current.reject2),
                        reject3: Number(current.reject3),
                        reject4: Number(current.reject4),
                        notvalidate: Number(current.notvalidate),

                        validateerror: Number(current.validateerror),
                        waivererror: Number(current.waivererror),
                        neterror: Number(current.neterror),
                        percentage: Number(current.percentage),
                        amount: Number(current.amount),
                        fromdate: req.body.fromdate,
                        todate: req.body.todate,

                    });
                }
                return acc;
            }, []);
        penaltymonth = penaltymonth.filter(item => item != null && item != undefined)
        // console.log(penaltymonth[0], "dffdf")
        return res.status(200).json({
            penaltymonth,
        });
    } catch (err) {
        console.log(err, "penaltymonth");
        return next(new ErrorHandler("Records not found!", 404));
    }

});


exports.getAllPenaltyMonthViewIndividual = catchAsyncErrors(async (req, res, next) => {

    try {
        const penaltymonthall = await Penaltydayupload.find({ date: { $gte: req.body.fromdate, $lte: req.body.todate } }, { uploaddata: 1 })


        let penaltymonth = penaltymonthall
            .map((data) => data.uploaddata)
            .flat().filter(t => t.name === req.body.name && t.vendorname === req.body.vendorname && t.process === req.body.process)

        penaltymonth = penaltymonth.filter(item => item != null && item != undefined)
        return res.status(200).json({
            penaltymonth,
        });
    } catch (err) {
        console.log(err, "penaltymonth");
        return next(new ErrorHandler("Records not found!", 404));
    }

});


