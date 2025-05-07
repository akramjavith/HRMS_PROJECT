const FooterMessage = require("../../../model/modules/greetinglayout/footermessage");
const ErrorHandler = require("../../../utils/errorhandler");
const catchAsyncErrors = require("../../../middleware/catchAsyncError");


//get All FooterMessage =>/api/FooterMessage
exports.getAllFooterMessage = catchAsyncErrors(async (req, res, next) => {
    let footermessage;
    try {
        footermessage = await FooterMessage.find()
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
    if (!footermessage) {
        return next(new ErrorHandler('FooterMessage not found!', 404));
    }
    return res.status(200).json({
        count: footermessage.length,
        footermessage
    });
})


//create new FooterMessage => /api/FooterMessage/new
exports.addFooterMessage = catchAsyncErrors(async (req, res, next) => {
    let afootermessage= await FooterMessage.create(req.body);
    return res.status(200).json({
        message: 'Successfully added!'
    });
})

//update FooterMessage by id => /api/FooterMessage/:id
exports.updateFooterMessage  = catchAsyncErrors(async (req, res, next) => {
    const id = req.params.id;
    let ufootermessage= await FooterMessage.findByIdAndUpdate(id, req.body);
    if (!ufootermessage) {
        return next(new ErrorHandler('FooterMessage not found', 404));
    }

    return res.status(200).json({ message: 'Updated successfully' });
})

