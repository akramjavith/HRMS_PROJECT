const PosterMessage = require("../../../model/modules/greetinglayout/postermessage");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");
const PosterGenerate = require('../../../model/modules/greetinglayout/postergenerate');


//get All PosterMessage =>/api/PosterMessage
exports.getAllPosterMessage = catchAsyncErrors(async (req, res, next) => {
    let postermessage;
    try {
        postermessage = await PosterMessage.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!postermessage) {
        return next(new ErrorHandler('PosterMessage not found!', 404));
    }
    return res.status(200).json({
        count: postermessage.length,
        postermessage
    });
})


//create new PosterMessage => /api/PosterMessage/new
exports.addPosterMessage = catchAsyncErrors(async (req, res, next) => {
    let apostermessage = await PosterMessage.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

// get Single PosterMessage => /api/PosterMessage/:id
exports.getSinglePosterMessage  = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let spostermessage= await PosterMessage.findById(id);
    if (!spostermessage) {
        return next(new ErrorHandler('PosterMessage not found', 404));
    }
    return res.status(200).json({
        spostermessage
    })
})

//update PosterMessage by id => /api/PosterMessage/:id
exports.updatePosterMessage  = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let upostermessage = await PosterMessage.findByIdAndUpdate(id, req.body);
    if (!upostermessage) {
        return next(new ErrorHandler('PosterMessage not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

//delete PosterMessage by id => /api/PosterMessage/:id
exports.deletePosterMessage = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let dpostermessage = await PosterMessage.findByIdAndRemove(id);
    if (!dpostermessage) {
        return next(new ErrorHandler('PosterMessage not found', 404));
    }

    return res.status(200).json({ message: 'Deleted successfully' });
})

exports.PosterMessagesettingoverall = catchAsyncErrors(async (req, res, next) => {
    let  postergenerate;

    try {

        postergenerate = await PosterGenerate.find({
            categoryname: req.body.catname,
            subcategoryname: req.body.subcat });

    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }

    return res.status(200).json({
        count: postergenerate?.length ,
        postergenerate,
    });
});