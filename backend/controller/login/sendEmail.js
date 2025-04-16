const nodemailer = require ("nodemailer");

module.exports = async(email,subject,text) =>{
    try {
        const transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            service:"gmail",
            port:587,
            secure:true,
            auth: {
                user: "cshankari27@gmail.com",
                pass: "srgvavrpyvkznjyl",
              },
        });

        await transporter.sendMail({
            from: "cshankari27@gmail.com",
            to:email,
            subject:subject,
            text:text
        });
    } catch (err) {
        return next(new ErrorHandler("Records not found!", 404));
    }
}