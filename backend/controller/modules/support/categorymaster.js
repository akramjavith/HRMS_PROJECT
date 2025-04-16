const CategoryMaster = require('../../../model/modules/support/categorymaster');
const Raiseproblem = require('../../../model/modules/support/raiseproblem');
const ErrorHandler = require('../../../utils/errorhandler');
const catchAsyncErrors = require('../../../middleware/catchAsyncError');

// get all categorymaster => /api/categorymaster

exports.getAllCategoryMaster = catchAsyncErrors(async (req, res, next) => {
    let categorymaster
    try {
        categorymaster = await CategoryMaster.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!categorymaster) {
        return next(new ErrorHandler('category not found', 404));
    }
    // Add serial numbers to the doccategory
    const allcategorymaster = categorymaster.map((data, index) => ({
        serialNumber: index + 1,
        ...data.toObject()
    }));

    return res.status(200).json({
        categorymaster: allcategorymaster
    });

})


exports.addCategoryMaster = catchAsyncErrors(async (req, res, next) => {
    await CategoryMaster.create(req.body);
    return res.status(200).json({
        message: 'Successfully added'
    })
})

exports.getSingleCategoryMaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let scategorymaster = await CategoryMaster.findById(id);
    if (!scategorymaster) {
        return next(new ErrorHandler('Data not found'));

    }
    return res.status(200).json({
        scategorymaster
    });

});


exports.updateCategoryMaster = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;

    let ucategorymaster = await CategoryMaster.findByIdAndUpdate(id, {
        categoryname: req.body.categoryname,
        subcategoryname: req.body.subcategoryname
    }, { new: true });
    
    if (!ucategorymaster) {
        return next(new ErrorHandler('Data not found'));
    }

    const prevCatSubCatObject = req.body.prevcatsubcat;

    const updatedCategory = prevCatSubCatObject.categoryname;
    // const subcategoryArray = prevCatSubCatObject.subcategoryname;
        
    
    const raiseproblemsToUpdate = await Raiseproblem.find({
        category: updatedCategory,
    });    

    for (const raiseproblem of raiseproblemsToUpdate) {
        raiseproblem.category = req.body.categoryname;
        // raiseproblem.subcategory = req.body.subcategoryname[subcatIndexChange];
        await raiseproblem.save();
    }

    return res.status(200).json({
        message: 'Update Successfully',
        ucategorymaster
    });
});



//delete ujobopening by id => /api/categorymaster/:id
exports.deleteCategoryMaster= catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dcategorymaster = await CategoryMaster.findByIdAndRemove(id);
    if (!dcategorymaster) {
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


