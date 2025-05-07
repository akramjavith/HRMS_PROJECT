const Ebservicemaster = require('../../../model/modules/eb/ebservicemaster');
const ErrorHandler = require('../../../utils/errorhandler');
// const Task = require('../../../model/modules/project/task');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

const Ebuseinstrument = require('../../../model/modules/eb/ebuseinstrument');
const EbReading = require('../../../model/modules/eb/ebreadingdetails');
const EbMaterialusage = require('../../../model/modules/eb/ebmaterialdetails');

//get All Ebservicemaster =>/api/Ebservicemaster
exports.getAllEbservicemaster = catchAsyncErrors(async (req, res, next) => {
    let ebservicemasters;


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
        // if (branchFilter.length > 0) {
        filterQuery = { $or: branchFilter };
        // }

        ebservicemasters = await Ebservicemaster.find(filterQuery)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebservicemasters) {
        return next(new ErrorHandler('Ebservicemaster not found!', 404));
    }
    return res.status(200).json({
        ebservicemasters
    });
})

exports.getAllEbservicemasterFilter = catchAsyncErrors(async (req, res, next) => {
    let ebservicemasters;


    try {
        const { company, branch, unit } = req.body;
        let query = {};


        if (company && company?.length > 0) {
            query.company = { $in: company }
        }

        if (branch && branch?.length > 0) {
            query.branch = { $in: branch }
        }
        if (unit && unit?.length > 0) {
            query.unit = { $in: unit }
        }

        ebservicemasters = await Ebservicemaster.find(query, {
            company: 1,
            branch: 1,
            unit: 1,
            floor: 1,
            area: 1,
            servicenumber: 1,
            vendor: 1,
            servicedate: 1,
            startdate: 1,
            ebservicepurposes: 1,
            nickname: 1,
            openkwh: 1,
            kvah: 1,
            sectionid: 1,
            sectionname: 1,
            contractedload: 1,
            powerfactor: 1,
            metertype: 1,
            billmonth: 1,
            allowedunit: 1,
            allowedunitmonth: 1,
            kwrs: 1,
            maxdem: 1,
            tax: 1,
            phase: 1,
            selectCTtypes: 1,
            solars: 1,
            weldings: 1,
            status: 1,
            billingcycles: 1,
            tariff: 1,
            servicelog: 1
        })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebservicemasters) {
        return next(new ErrorHandler('Ebservicemaster not found!', 404));
    }
    return res.status(200).json({
        ebservicemasters
    });
})

exports.getAllLiveEbservicemaster = catchAsyncErrors(async (req, res, next) => {
    let ebservicemasters;


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
        // if (branchFilter.length > 0) {
        filterQuery = { $or: branchFilter, status: "LIVE" };

        // }

        ebservicemasters = await Ebservicemaster.find(filterQuery)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebservicemasters) {
        return next(new ErrorHandler('Ebservicemaster not found!', 404));
    }
    return res.status(200).json({
        ebservicemasters
    });
})

exports.getAallBoardingEbservicemaster = catchAsyncErrors(async (req, res, next) => {
    let ebservicemasters;
    try {
        ebservicemasters = await Ebservicemaster.find({ branch: req.body.branch, floor: req.body.floor, area: { $in: req.body.area } })
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebservicemasters) {
        return next(new ErrorHandler('Ebservicemaster not found!', 404));
    }
    return res.status(200).json({
        ebservicemasters
    });
})


// get overall Edit functionality
exports.getOverAllEditEBServiceCheck = catchAsyncErrors(async (req, res, next) => {
    let ebuse, ebread, ebmaterial;
    try {

        ebuse = await Ebuseinstrument.find({ servicenumber: { $in: req.body.oldname } })
        ebread = await EbReading.find({ servicenumber: { $in: req.body.oldname } })
        ebmaterial = await EbMaterialusage.find({ servicenumber: { $in: req.body.oldname } })



    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebuse) {
        return next(new ErrorHandler("Ebservicemaster not found!", 404));
    }
    return res.status(200).json({
        count: ebuse.length + ebread.length + ebmaterial.length,
        ebuse,
        ebread,
        ebmaterial
    });
});





/// get overall edit
exports.getOverAllEditEBService = catchAsyncErrors(async (req, res, next) => {
    let ipmaster
    try {

        ipmaster = await Ipmaster.find({ categoryname: req.body.oldname });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!ipmaster) {
        return next(new ErrorHandler("Ipcategory not found", 404));
    }
    return res.status(200).json({
        count: ipmaster.length,
        ipmaster,

    });
});








//create new Ebservicemaster => /api/Ebservicemaster/new
exports.addEbservicemaster = catchAsyncErrors(async (req, res, next) => {
    // let checkmain = await Addexists.findOne({ name: req.body.name });
    // if (checkmain) {
    //     return next(new ErrorHandler('Name already exist!', 400));
    // }
    let aEbservicemaster = await Ebservicemaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single Ebservicemaster => /api/Ebservicemaster/:id
exports.getSingleEbservicemaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sebservicemaster = await Ebservicemaster.findById(id);
    if (!sebservicemaster) {
        return next(new ErrorHandler('Ebservicemaster not found', 404));
    }
    return res.status(200).json({
        sebservicemaster
    })
})

//update Ebservicemaster by id => /api/Ebservicemaster/:id
exports.updateEbservicemaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uebservicemaster = await Ebservicemaster.findByIdAndUpdate(id, req.body);
    if (!uebservicemaster) {
        return next(new ErrorHandler('Ebservicemaster not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete Ebservicemaster by id => /api/Ebservicemaster/:id
exports.deleteEbservicemaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let debservicemaster = await Ebservicemaster.findByIdAndRemove(id);
    if (!debservicemaster) {
        return next(new ErrorHandler('Ebservicemaster not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})
