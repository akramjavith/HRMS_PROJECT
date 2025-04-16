const Templatelist = require("../../../model/modules/settings/Templatelist");
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');


// Create 
exports.addTemplateVerification = catchAsyncErrors(async (req, res, next) => {

    let atemplateList = await Templatelist.create(req.body)

    return res.status(200).json({
        message: 'Successfully added!'
    });
})


//Get
exports.getAllTemplateVerification = catchAsyncErrors(async (req, res, next) => {
    let templateList;
    try {
        templateList = await Templatelist.find()
    } catch (err) {
        console.log(err.message);
    }
    if (!templateList) {
        return next(new ErrorHandler('Templatelist not found!', 404));
    }
    return res.status(200).json({
        templateList
    });
})

//Get Single
exports.getSingleTemplateVerification = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let stemplateList = await Templatelist.findById(id);

    if (!stemplateList) {
        return next(new ErrorHandler("Templatelist not found!", 404));
    }
    return res.status(200).json({
        stemplateList,
    });
});

// update Single
exports.updateTemplateVerification = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let utemplateList = await Templatelist.findByIdAndUpdate(id, req.body);


    if (!utemplateList) {
        return next(new ErrorHandler("Templatelist not found!", 404));
    }
    return res.status(200).json({ message: "Updated successfully" });
});

exports.getAllTemplateVerificationAssignBranch = catchAsyncErrors(async (req, res, next) => {
    
    const { assignbranch } = req.body;

    console.log(assignbranch)

    const query = {
        $or: assignbranch.map(item => ({
          company: item.company,
          branch: item.branch,
          unit: item.unit
        }))
      };

    let templateList;
    try {
        templateList = await Templatelist.find(query);
    } catch (err) {
        console.log(err.message);
    }

    if (!templateList || templateList.length === 0) {
        return next(new ErrorHandler('Templatelist not found!', 404));
    }

    return res.status(200).json({
        templateList
    });
});