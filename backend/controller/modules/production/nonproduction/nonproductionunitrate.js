const NonProductionUnitRate = require('../../../../model/modules/production/nonproduction/nonproductionunitrate');
const ErrorHandler = require('../../../../utils/errorhandler');
const catchAsyncErrors = require('../../../../middleware/catchAsyncError');

// get all nonproductionunitrate => /api/nonproductionunitrate

exports.getAllNonProductionUnitRate = catchAsyncErrors(async (req, res, next) => {
    let nonproductionunitrate
    try {
        nonproductionunitrate = await NonProductionUnitRate.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!nonproductionunitrate) {
        return next(new ErrorHandler('category not found', 404));
    }

    return res.status(200).json({
        nonproductionunitrate
    });

})


exports.addNonProductionUnitRate = catchAsyncErrors(async (req, res, next) => {
    

    const { categoryname, subcategory, base, process, mindays, minhours, minminutes, maxdays, maxhours, maxminutes, rate } = req.body;

    let filteredData = await NonProductionUnitRate.findOne({ categoryname, subcategory, base, process, mindays, minhours, minminutes, maxdays, maxhours, maxminutes, rate });
    if (!filteredData) {
        await NonProductionUnitRate.create(req.body);
        return res.status(200).json({
            message: 'Successfully added'
        })
    }
    
    return next(new ErrorHandler('Data Already Exist!'));
})

exports.getSingleNonProductionUnitRate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let snonproductionunitrate = await NonProductionUnitRate.findById(id);
    if (!snonproductionunitrate) {
        return next(new ErrorHandler('Data not found'));

    }
    return res.status(200).json({
        snonproductionunitrate
    });

});

exports.updateNonProductionUnitRate = catchAsyncErrors(async (req, res, next) => {

    const id = req.params.id

    const { categoryname, subcategory, base, process, mindays, minhours, minminutes, maxdays, maxhours, maxminutes, rate } = req.body;

    let filteredData = await NonProductionUnitRate.findOne({ _id: { $ne: id }, categoryname, subcategory, base, process, mindays, minhours, minminutes, maxdays, maxhours, maxminutes, rate });
    if (!filteredData) {

        let unonproductionunitrate = await NonProductionUnitRate.findByIdAndUpdate(id, req.body);
        if (!unonproductionunitrate){
            return next(new ErrorHandler('Data Not Found!'));
        }
        return res.status(200).json({
            message: 'Update Successfully', unonproductionunitrate
        });
        
    }
    return next(new ErrorHandler('Data Already Exist!'));


});



//delete ujobopening by id => /api/jobopening/:id
exports.deleteNonProductionUnitRate = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcategoryandsubcategory = await NonProductionUnitRate.findByIdAndRemove(id);
    if (!dcategoryandsubcategory) {
        return next(new ErrorHandler('Data not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

