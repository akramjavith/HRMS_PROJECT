const ErrorHandler = require('../utils/errorhandler');

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV === 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            error: err,
            errorMessage: err.message,
            stack: err.stack
        });
    }

    if (process.env.NODE_ENV === 'PRODUCTION') {
        let error = { ...err };

        error.message = err.message;

        // Wrong Mongoose ObjectId Error
        if (err.name === 'CastError') {
            const message = `Resource not found. Invalid: ${err.path}`;
            error = new ErrorHandler(message, 400);
        }

        // Mongoose Validation Error
        if (err.name === 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message);
            error = new ErrorHandler(message, 400);
        }

        // Mongoose Duplicate Key Error
        if (err.code === 11000) {
            const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
            error = new ErrorHandler(message, 400);
        }

        // JWT Error
        if (err.name === 'JsonWebTokenError') {
            const message = 'JSON Web Token is invalid. Try again.';
            error = new ErrorHandler(message, 401);
        }

        // JWT Expired Error
        if (err.name === 'TokenExpiredError') {
            const message = 'JSON Web Token has expired. Try again.';
            error = new ErrorHandler(message, 401);
        }

        // Multer File Size Error
        if (err.code === 'LIMIT_FILE_SIZE') {
            const message = 'File size is too large!';
            error = new ErrorHandler(message, 413);
        }

        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
};
