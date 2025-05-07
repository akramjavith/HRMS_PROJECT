const EbUseInstrument = require('../../../model/modules/eb/ebuseinstrument');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

//get All EbuseInstrument =>/api/EbuseInstrument
exports.getAllEbUseInstrument = catchAsyncErrors(async (req, res, next) => {
    let ebuseinstruments;
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

        ebuseinstruments = await EbUseInstrument.find(filterQuery)
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebuseinstruments) {
        return next(new ErrorHandler('Eb Use Instrument not found!', 404));
    }
    return res.status(200).json({
        ebuseinstruments
    });
})

//overall delete functionality

exports.getOverAllEbuseintrument = catchAsyncErrors(async (req, res, next) => {
    let ebuse;
    try {
        let query = {
            servicenumber: { $in: req.body.checkebuse },

        };
        ebuse = await EbUseInstrument.find(query, {
            servicenumber: 1,
            _id: 0,
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebuse) {
        return next(new ErrorHandler("Eb Use Instrument not found!", 404));
    }
    return res.status(200).json({
        ebuse,
    });
});





exports.getAllEbUseInstrumentFilter = catchAsyncErrors(async (req, res, next) => {
    let ebuseinstrumentsfilter, resulted;
    try {

        let query = {};
        Object.keys(req.body).forEach((key) => {
            if (key !== "headers") {
                const value = req.body[key];
                if (value !== "") {
                    query[key] = value.toString();
                }
            }
        })
        ebuseinstrumentsfilter = await EbUseInstrument.find();
        resulted = ebuseinstrumentsfilter.filter((item) => {
            for (const key in query) {
                if (item[key] !== query[key]) {
                    return false;
                }
            }
            return true;
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!ebuseinstrumentsfilter) {
        return next(new ErrorHandler('Eb Use Instrument not found!', 404));
    }
    return res.status(200).json({
        resulted
    });
})


//create new EbuseInstrument => /api/EbuseInstrument/new
exports.addEbUseInstrument = catchAsyncErrors(async (req, res, next) => {
    let aebuseinstrument = await EbUseInstrument.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single EbuseInstrument => /api/EbuseInstrument/:id
exports.getSingleEbUseInstrument = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let sebuseinstrument = await EbUseInstrument.findById(id);
    if (!sebuseinstrument) {
        return next(new ErrorHandler('Eb Use Instrument not found', 404));
    }
    return res.status(200).json({
        sebuseinstrument
    })
})

//update EbuseInstrument by id => /api/EbuseInstrument/:id
exports.updateEbUseInstrument = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let uebuseinstrument = await EbUseInstrument.findByIdAndUpdate(id, req.body);
    if (!uebuseinstrument) {
        return next(new ErrorHandler('Eb Use Instrument not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete EbuseInstrument by id => /api/EbuseInstrument/:id
exports.deleteEbUseInstrument = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let debuseinstrument = await EbUseInstrument.findByIdAndRemove(id);
    if (!debuseinstrument) {
        return next(new ErrorHandler('Eb Use Instrument not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})