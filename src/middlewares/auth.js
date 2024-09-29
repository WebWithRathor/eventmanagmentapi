const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/ErrorHandler');

exports.isAuthenticated = (req,res,next)=>{

    if(!req.cookies.token){
        return next(new ErrorHandler(401, 'Please login to access'));
    }
    const {id} = jwt.verify(req.cookies.token,process.env.JWT_SECRET);
    req.id = id;

    return next();
}