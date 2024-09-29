exports.SendToken = (user,statuCode,res)=>{

    const token = user.generateJWT();
    
    const options={
        expires: new Date(Date.now() + 24*60*60*1000),
        httpOnly: true,
        secure:true
    }

    res.status(statuCode).cookie("token",token,options).json({
        status:"success",
        id : user._id,
        token
    })
}