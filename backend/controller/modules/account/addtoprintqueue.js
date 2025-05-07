const Addtoprintqueue = require('../../../model/modules/account/addtoprintqueue');
const Company = require('../../../model/modules/setup/company');
const Branch = require('../../../model/modules/branch');
const Unit = require('../../../model/modules/unit');
const Floor = require('../../../model/modules/floor');
const Area = require('../../../model/modules/area');
const Location = require('../../../model/modules/location');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');



//get All Addtoprintqueue =>/api/Addtoprintqueue
exports.getAllAddtoprintqueue = catchAsyncErrors(async (req, res, next) => {
    let addtoprintqueue;
    try {
        addtoprintqueue = await Addtoprintqueue.find()

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!addtoprintqueue) {
        return next(new ErrorHandler('Addtoprintqueue not found!', 404));
    }
    return res.status(200).json({
        addtoprintqueue
    });
})


exports.getAllDataAddtoprintqueue = catchAsyncErrors(async (req, res, next) => {
    let addtoprintqueue, companycode, branchcode, unitcode, floorcode, areacode, locationcode;
    try {
        // addtoprintqueue = await Addtoprintqueue.find() 
        let company = await Company.findOne({ name: req.body.company })
        let branch = await Branch.findOne({ name: req.body.branch })
        let unit = await Unit.findOne({ name: req.body.unit })
        let floor = await Floor.findOne({ name: req.body.floor })
        let area = await Area.findOne({ name: req.body.area })
        let location = await Location.findOne({ name: req.body.location })
        companycode = company.code
        branchcode = branch.code
        unitcode = unit.code
        floorcode = floor.code
        areacode = area.code
        locationcode = location.code


    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        companycode: companycode, branchcode: branchcode, unitcode: unitcode, floorcode: floorcode, areacode: areacode, locationcode: locationcode,
    });
})








exports.getAllAddtoprintqueueFilter = catchAsyncErrors(async (req, res, next) => {
    let addtoprintqueue;
    try {
        addtoprintqueue = await Addtoprintqueue.find({}, {
            company: 1,
            branch: 1,
            unit: 1,
            countquantity: 1,
            floor: 1,
            area: 1,
            location: 1,
            workstation: 1,
            asset: 1,
            assettype: 1,
            material: 1,
            component: 1,
            code: 1,
            countquantity: 1,
            rate: 1,
            labelstatus: 1,
            warranty: 1,
            purchasedate: 1,
            vendor: 1,
            files: 1,
            status: 1,
            assignedthrough: 1,
            repairproblem: 1

        })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!addtoprintqueue) {
        return next(new ErrorHandler('Addtoprintqueue not found!', 404));
    }
    return res.status(200).json({
        addtoprintqueue
    });
})




exports.getAllAddtoprintqueueLimited = catchAsyncErrors(async (req, res, next) => {
    let addtoprintqueue;
    try {
        addtoprintqueue = await Addtoprintqueue.find({ labelstatus: "Queue" })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!addtoprintqueue) {
        return next(new ErrorHandler('Addtoprintqueue not found!', 404));
    }
    return res.status(200).json({
        addtoprintqueue
    });
})

exports.getAllAddtoprintqueueLimitedPrinted = catchAsyncErrors(async (req, res, next) => {
    let addtoprintqueue;
    try {
        addtoprintqueue = await Addtoprintqueue.find({ labelstatus: "Printed" })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!addtoprintqueue) {
        return next(new ErrorHandler('Addtoprintqueue not found!', 404));
    }
    return res.status(200).json({
        addtoprintqueue
    });
})


//create new Addtoprintqueue => /api/Addtoprintqueue/new
exports.addAddtoprintqueue = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aAddtoprintqueues = await Addtoprintqueue.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Addtoprintqueue => /api/Addtoprintqueue/:id
exports.getSingleAddtoprintqueue = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sassetdetail = await Addtoprintqueue.findById(id);
    if (!sassetdetail) {
        return next(new ErrorHandler('Addtoprintqueue not found', 404));
    }
    return res.status(200).json({
        sassetdetail
    })
})

//update Addtoprintqueue by id => /api/Addtoprintqueue/:id
exports.updateAddtoprintqueue = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uassetdetails = await Addtoprintqueue.findByIdAndUpdate(id, req.body);
    if (!uassetdetails) {
        return next(new ErrorHandler('Addtoprintqueue not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Addtoprintqueue by id => /api/Addtoprintqueue/:id
exports.deleteAddtoprintqueue = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dgroup = await Addtoprintqueue.findByIdAndRemove(id);
    if (!dgroup) {
        return next(new ErrorHandler('Addtoprintqueue not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})



exports.getAllAddtoprintqueueLimitedAccess = catchAsyncErrors(async (req, res, next) => {
    let addtoprintqueue, query;
    try {
        const { assignbranch } = req.body;
        let filterQuery = {};
        // Construct the filter query based on the assignbranch array
        const branchFilter = assignbranch.map((branchObj) => ({
            branch: branchObj.branch,
            company: branchObj.company,
            unit: branchObj.unit,
        }));

        // Use $or to filter incomes that match any of the branch, company, and unit combinations
        if (branchFilter.length > 0) {
            filterQuery = { $or: branchFilter };
        }

        let query = {
            labelstatus: "Queue",
            ...filterQuery
        }

        addtoprintqueue = await Addtoprintqueue.find(query)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!addtoprintqueue) {
        return next(new ErrorHandler('Addtoprintqueue not found!', 404));
    }
    return res.status(200).json({
        addtoprintqueue
    });
})


exports.getAllAddtoprintqueueLimitedPrintedAccess = catchAsyncErrors(async (req, res, next) => {
    let addtoprintqueue, query;
    try {

        const { assignbranch } = req.body;
        let filterQuery = {};
        // Construct the filter query based on the assignbranch array
        const branchFilter = assignbranch.map((branchObj) => ({
            branch: branchObj.branch,
            company: branchObj.company,
            unit: branchObj.unit,
        }));

        // Use $or to filter incomes that match any of the branch, company, and unit combinations
        if (branchFilter.length > 0) {
            filterQuery = { $or: branchFilter };
        }

        query = {
            labelstatus: "Printed",
            ...filterQuery
        }
        addtoprintqueue = await Addtoprintqueue.find(query)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!addtoprintqueue) {
        return next(new ErrorHandler('Addtoprintqueue not found!', 404));
    }
    return res.status(200).json({
        addtoprintqueue
    });
})
