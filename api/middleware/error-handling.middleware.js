const errorHandlingMiddleware = (err, req, res, next) => {
    console.error('Error', err.stack || err);

    if (res.headersSent) {
        return next(err);
    }

    res.status(500).send({
        message: 'An error occured',
        error: err,
        stack: err.stack
    });
};

export default errorHandlingMiddleware;
