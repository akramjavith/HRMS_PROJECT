const jwt = require('jsonwebtoken')

// Generate web tockens
const generateToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    })
}

// create and save jwt and save in cookie for get expiry time
const sendToken = (user, statusCode, res) => {

    // create jwt token
    const token = generateToken(user._id);

    // options for cookie
    const options = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
            ),
        httpOnly: true
    };

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        token,
        user
    })

    // res.status(statusCode).cookie(String(user.id), token, options).json({
    //     success: true,
    //     token,
    //     user
    // })
}

module.exports = sendToken;