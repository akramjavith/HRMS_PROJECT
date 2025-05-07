
const PenaltyClientError = require('../../../model/modules/penalty/penaltyclienterror');
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");

exports.getAllPenaltyClientError = catchAsyncErrors(async (req, res, next) => {
    const {assignbranch } = req.body;
    const query = {
        $or: assignbranch.map(item => ({
          company: item.company,
          branch: item.branch,
          unit: item.unit
        }))
      };
    let penaltyclienterror;
    try {
        penaltyclienterror = await PenaltyClientError.find(query);
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!penaltyclienterror) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        // count: products.length,
        penaltyclienterror,
    });
});




// Create new penaltyclienterror=> /api/penaltyclienterror/new
exports.addPenaltyClientError = catchAsyncErrors(async (req, res, next) => {

    const { project,category,subcategory,loginid,company,branch,unit,team,employeename,date,line,errorvalue,correctvalue,clienterror  } = req.body;

    let filteredData = await PenaltyClientError.findOne({ project,category,subcategory,loginid,company,branch,unit,team,employeename,date,line: { $regex: `\\b${line}\\b`, $options: 'i' } , errorvalue ,correctvalue, clienterror: { $regex: `\\b${clienterror}\\b`, $options: 'i' } });



    if (!filteredData) {
        let apenaltyerrorcontrol = await PenaltyClientError.create(req.body);

        return res.status(200).json({
            message: "Successfully added!",
        });
    }

    return next(new ErrorHandler("Data Already Exist!", 404));

});

// get Signle PenaltyClientError => /api/penaltyclienterror/:id
exports.getSinglePenaltyClientError = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let spenaltyclienterror = await PenaltyClientError.findById(id);

    if (!spenaltyclienterror) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({
        spenaltyclienterror,
    });
});

// update PenaltyClientError by id => /api/penaltyclienterror/:id
exports.updatePenaltyClientError = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    const { project,category,subcategory,loginid,company,branch,unit,team,employeename,date,line,errorvalue,correctvalue,clienterror  } = req.body;

    // let filteredData = await PenaltyClientError.findOne({ _id: { $ne: id }, projectvendor,process ,mode: { $regex: `\\b${mode}\\b`, $options: 'i' } , rate: rate , islock: { $regex: `\\b${islock}\\b`, $options: 'i' } });

    let filteredData = await PenaltyClientError.findOne({_id: { $ne: id }, project,category,subcategory,loginid,company,branch,unit,team,employeename,date,line: { $regex: `\\b${line}\\b`, $options: 'i' } , errorvalue ,correctvalue, clienterror: { $regex: `\\b${clienterror}\\b`, $options: 'i' } });

    if (!filteredData) {
        let upenaltyerrorcontrol = await PenaltyClientError.findByIdAndUpdate(id, req.body);
        if (!upenaltyerrorcontrol) {
            return next(new ErrorHandler("Data not found!", 404));
        }
        return res.status(200).json({ message: "Updated successfully" });
    }
    return next(new ErrorHandler("Data Already Exist!", 404));

});

// delete PenaltyClientError by id => /api/penaltyclienterror/:id
exports.deletePenaltyClientError = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let dpenaltyerrorcontrol = await PenaltyClientError.findByIdAndRemove(id);

    if (!dpenaltyerrorcontrol) {
        return next(new ErrorHandler("Data not found!", 404));
    }
    return res.status(200).json({ message: "Deleted successfully" });
});