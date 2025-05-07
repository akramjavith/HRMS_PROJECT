const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError')
const User = require('../../../model/login/auth');
const TemplatecontrolpanelModel = require('../../../model/modules/documents/Templatecontrolpnael')
const mongoose = require('mongoose');
// Get TemplatecontrolpanelModel  => /api/TemplatecontrolpanelModel
exports.getAllTemplatecontrolpanelModel = catchAsyncErrors(async (req, res, next) => {
    let templatecontrolpanel
    try {
        templatecontrolpanel = await TemplatecontrolpanelModel.find({},{company:1,branch:1,_id:1,companyurl:1,companyname:1,address:1})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!templatecontrolpanel) {
        return next(new ErrorHandler('Data not found', 404));
    }
    return res.status(200).json({
        templatecontrolpanel
    });

})
exports.getAaccessibleBranchAllTemplatecontrolpanelModel = catchAsyncErrors(async (req, res, next) => {
    let templatecontrolpanel
    try {
        const { assignbranch } = req.body;
        // Construct the filter query based on the assignbranch array
    const branchFilter = assignbranch.map((branchObj) => ({
        branch: branchObj.branch,
        company: branchObj.company,
      }));
        templatecontrolpanel = await TemplatecontrolpanelModel.find({$or: branchFilter},{company:1,branch:1,_id:1,companyurl:1,companyname:1,address:1})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!templatecontrolpanel) {
        return next(new ErrorHandler('Data not found', 404));
    }
    return res.status(200).json({
        templatecontrolpanel
    });

})
exports.getAllFilterTemplatecontrolpanelModel = catchAsyncErrors(async (req, res, next) => {
    let templatecontrolpanel
    try {
        templatecontrolpanel = await TemplatecontrolpanelModel.find({company:req.body.company, branch:req.body.branch})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!templatecontrolpanel) {
        return next(new ErrorHandler('Data not found', 404));
    }
    return res.status(200).json({
        templatecontrolpanel
    });

})
exports.getAllDuplicateTemplatecontrolpanel = catchAsyncErrors(async (req, res, next) => {
    let templatecontrolpanel
    try {
        templatecontrolpanel = await TemplatecontrolpanelModel.find({},{company:1,branch:1,_id:1})
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!templatecontrolpanel) {
        return next(new ErrorHandler('Data not found', 404));
    }
    return res.status(200).json({
        templatecontrolpanel
    });

})
exports.getAllUserDetailsDocuments = catchAsyncErrors(async (req, res, next) => {
    let result , templatecontrolpanel , checkLog
  //     user : userFind
    const user = req?.body?.user;
    try {
        templatecontrolpanel = await TemplatecontrolpanelModel.find()
        checkLog = templatecontrolpanel?.map(data => data?.templatecontrolpanellog[ data?.templatecontrolpanellog?.length - 1]);
        result =user != "none" ?  checkLog?.filter(data => data?.company == user?.company &&  data?.branch === user?.branch):[]
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    return res.status(200).json({
        result 
    });
})

// Create TemplatecontrolpanelModel  => /api/TemplatecontrolpanelModel
exports.createTemplatecontrolpanelModel = catchAsyncErrors(async (req, res, next) => {
    let data =  await TemplatecontrolpanelModel.create(req.body); 
    return res.status(200).json({
        message: 'Successfully added'
    })
})

// get single TemplatecontrolpanelModel =>/api/TemplatecontrolpanelModel/:id
exports.getSingleTemplatecontrolpanelModel = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let stemplatecontrolpanel = await TemplatecontrolpanelModel.findById(id);
    if (!stemplatecontrolpanel) {
        return next(new ErrorHandler('Id not found'));
    }
    return res.status(200).json({
        stemplatecontrolpanel
    });

});

// update TemplatecontrolpanelModel to all users => /api/TemplatecontrolpanelModel/:id
exports.updateTemplatecontrolpanelModel = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id
    let utemplatecontrolpanel = await TemplatecontrolpanelModel.findByIdAndUpdate(id, req.body);

    if (!utemplatecontrolpanel) {
        return next(new ErrorHandler('Id not found!', 404));
    }
    return res.status(200).json({ message: 'Updated successfully' });
})

exports.deleteTemplatecontrolpanelModel = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let templatecontrolpanel = await TemplatecontrolpanelModel.findByIdAndRemove(id);
    if (!templatecontrolpanel) {
      return next(new ErrorHandler("Data not found", 404));
    }
  
    return res.status(200).json({ message: "Deleted successfully" });
  });

  exports.deleteSingleObject = catchAsyncErrors(async (req, res, next) => {
    const { parentId, itemId } = req.params;

    // Validate the IDs
    if (!mongoose.Types.ObjectId.isValid(parentId) || !mongoose.Types.ObjectId.isValid(itemId)) {
        return res.status(400).send({ message: 'Invalid ID format' });
    }

    try {
        // Find the document
        const document = await TemplatecontrolpanelModel.findById(parentId);
        if (!document) {
            return res.status(404).send({ message: 'Parent document not found' });
        }
        // Check if the item exists in the array
        const itemIndex = document.templatecontrolpanellog.findIndex(item => item._id.equals(itemId));
        if (itemIndex === -1) {
            return res.status(404).send({ message: 'Item not found in the array' });
        }

        document.templatecontrolpanellog.splice(itemIndex, 1);

        await document.save();

        res.status(200).send({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: 'An error occurred', error });
    }
});