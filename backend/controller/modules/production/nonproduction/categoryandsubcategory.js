const CategoryAndSubcategory = require('../../../../model/modules/production/nonproduction/categoryandsubcategory');
const ErrorHandler = require('../../../../utils/errorhandler');
const catchAsyncErrors = require('../../../../middleware/catchAsyncError');

// get all categoryandsubcategory => /api/categoryandsubcategory

exports.getAllCategoryAndSubcategory = catchAsyncErrors(async (req, res, next) => {
    let categoryandsubcategory
    try {
        categoryandsubcategory = await CategoryAndSubcategory.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!categoryandsubcategory) {
        return next(new ErrorHandler('category not found', 404));
    }
    // Add serial numbers to the doccategory
    const allcategoryandsubcategory = categoryandsubcategory.map((data, index) => ({
        serialNumber: index + 1,
        ...data.toObject()
    }));

    return res.status(200).json({
        categoryandsubcategory: allcategoryandsubcategory
    });

})


exports.addCategoryAndSubcategory = catchAsyncErrors(async (req, res, next) => {
    await CategoryAndSubcategory.create(req.body);
    return res.status(200).json({
        message: 'Successfully added'
    })
})

exports.getSingleCategoryAndSubcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let scategoryandsubcategory = await CategoryAndSubcategory.findById(id);
    if (!scategoryandsubcategory) {
        return next(new ErrorHandler('Data not found'));

    }
    return res.status(200).json({
        scategoryandsubcategory
    });

});

exports.updateCategoryAndSubcategory = catchAsyncErrors(async (req, res, next) => {

    const id = req.params.id

    let ucategoryandsubcategory = await CategoryAndSubcategory.findByIdAndUpdate(id, req.body);

    if (!ucategoryandsubcategory) {
        return next(new ErrorHandler('Data not found'));
    }
    return res.status(200).json({
        message: 'Update Successfully', ucategoryandsubcategory
    });
});



//delete ujobopening by id => /api/jobopening/:id
exports.deleteCategoryAndSubcategory = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcategoryandsubcategory = await CategoryAndSubcategory.findByIdAndRemove(id);
    if (!dcategoryandsubcategory) {
        return next(new ErrorHandler('Data not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})



exports.getOverAllEditDocuments = catchAsyncErrors(async (req, res, next) => {
    let documentsall, query, documents, docindex
    try {

        documentsall = await Document.find(query, {});

        documents = documentsall.filter(item => item.categoryname == req.body.oldname && req.body.oldnamesub.includes(item.subcategoryname))

        docindex = documentsall.findIndex(item => req.body.oldnamesub.includes(item.subcategoryname));
       
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }


    return res.status(200).json({
        count: documents.length,

        documents, docindex
    });
});



