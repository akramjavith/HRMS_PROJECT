const MyCheckList = require('../../../model/modules/interview/Myinterviewchecklist');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get All MyCheckList  Details => /api/mychecklist
exports.getAllMyCheckList = catchAsyncErrors(async (req, res, next) => {
    let mychecklist;
    try {
        mychecklist = await MyCheckList.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    if (!mychecklist) {
        return next(new ErrorHandler('Role And Responsibilities not found', 404));
    }
    return res.status(200).json({
        mychecklist
    });

})

// Create new MyCheckList => /api/mychecklist/new
exports.addMyCheckList = catchAsyncErrors(async (req, res, next) => {

    let aapprovevacancies = await MyCheckList.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Signle MyCheckList => /api/mychecklist/:id
exports.getSingleMyCheckList = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let smychecklist = await MyCheckList.findById(id);
    if (!smychecklist) {
        return next(new ErrorHandler('Role And Responsibilities not found', 404));
    }
    return res.status(200).json({
        smychecklist
    })
})

// update MyCheckList by id => /api/mychecklist/:id
exports.updateMyCheckList = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let umychecklist = await MyCheckList.findByIdAndUpdate(id, req.body);
    if (!umychecklist) {
        return next(new ErrorHandler('my checklist not found', 404));
    }
    return res.status(200).json({ message: 'Updates successfully' });
})
// delete MyCheckList by id => /api/mychecklist/:id
exports.deleteMyCheckList = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dmychecklist = await MyCheckList.findByIdAndRemove(id);
    if (!dmychecklist) {
        return next(new ErrorHandler('my check list not found', 404));
    }
    return res.status(200).json({ message: 'Deleted successfully' });
})


// exports.updateMyCheckListUsingObjectID = catchAsyncErrors(
//     async (req, res, next) => {
//       const id = req.params.id;
//       const { data, newFiles } = req.body;
  
//       let foundData = await MyCheckList.findOne(
//         { "groups._id": id },
//         { "groups.$": 1, _id: 0 }
//       );
//       if (!foundData) {
//         return next(new ErrorHandler("my checklist not found", 404));
//       }
  
//       let extractedData = foundData?.groups[0];
  
//       const updatedData = {
//         category: extractedData.category,
//         subcategory: extractedData.subcategory,
//         checklist: extractedData.checklist,
//         information: extractedData.information,
//         files: newFiles,
//         details: extractedData.details,
//         data: data,
//       };
  
//       // let updatedItem = await MyCheckList.updateOne(
//       //   { "groups._id": id },
//       //   { $set: { "groups.$": updatedData } }
//       // );
  
//       const updateObj = { $set: {} };
//       for (const key in updatedData) {
//         updateObj.$set[`groups.$.${key}`] = updatedData[key];
//       }
  
//       const uploaddata = await MyCheckList.findOneAndUpdate(
//         { "groups._id": id },
//         updateObj,
//         { new: true }
//       );
  
//       return res.status(200).json({ success: true });
//     }
//   );

exports.updateMyCheckListUsingObjectID = catchAsyncErrors(
    async (req, res, next) => {
      const id = req.params.id;
      const { data, newFiles, lastcheck,completedby,completedat } = req.body;
  
      let foundData = await MyCheckList.findOne(
        { "groups._id": id },
        { "groups.$": 1, _id: 0 }
      );
      if (!foundData) {
        return next(new ErrorHandler("my checklist not found", 404));
      }
  
      let extractedData = foundData?.groups[0];
  
      const updatedData = {
        category: extractedData.category,
        subcategory: extractedData.subcategory,
        checklist: extractedData.checklist,
        information: extractedData.information,
        files: newFiles,
        details: extractedData.details,
        data: data,
        completedby: completedby,
        completedat: completedat,
        lastcheck: lastcheck ? lastcheck : false,
      };
  
    
  
      const updateObj = { $set: {} };
      for (const key in updatedData) {
        updateObj.$set[`groups.$.${key}`] = updatedData[key];
      }
  
  
      const uploaddata = await MyCheckList.findOneAndUpdate(
        { "groups._id": id },
        updateObj,
        { new: true }
      );
  
      return res.status(200).json({ success: true });
    }
  );