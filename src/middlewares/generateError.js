exports.generatedError = (err,req,res,next)=>{
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        Errname : err.name,
        message: err.message,
    });
}