module.exports = (err, req, res, next) => {
    const status = err.status || 500;

    let errorResponse = {
        message: err.message || 'Internal Server Error',
    };

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
        errorResponse.details = Object.values(err.errors).map(e => e.message);
        errorResponse.type = 'ValidationError';
    }

    // Mongoose bad ObjectId
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        errorResponse.message = 'Invalid ID format';
        errorResponse.type = 'CastError';
        errorResponse.details = err.reason || undefined;
    }

    // Duplicate key error
    if (err.code && err.code === 11000) {
        errorResponse.message = 'Duplicate value error';
        errorResponse.type = 'DuplicateError';
        errorResponse.details = err.keyValue;
    }

    // Show stack in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
    }

    res.status(status).json(errorResponse);
};