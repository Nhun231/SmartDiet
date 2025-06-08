const bcrypt = require('bcrypt');
const User = require('../models/user.model.js');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const validator = require('validator')
const ms = require('ms')
const handleLogin = async (req, res) => {
    //Destructuring request body
    const {emailOrName, password} = req.body;
    if(!emailOrName || !password) {
        return res.status(StatusCodes.BAD_REQUEST).json({'message': 'Bạn cần điền cả email và mật khẩu'});
    }
    //Check the login information is email or username
    let isEmail = validator.isEmail(emailOrName);
    //find user in db
    const user = await User.findOne(isEmail ? {email: emailOrName} : {username: emailOrName});
    //if user notfound throw error
    if(!user) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ 'message': 'Tài khoản không tồn tại' });
    }
    //check with password in db
    const match = await bcrypt.compare(password, user.password);
    if(!match) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Mật khẩu không đúng' });
    }else{
        // create JWTs
        const accessToken = jwt.sign(
            {"email": user.email},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: process.env.ACCESS_TOKEN_LIFE}
        );
        const refreshToken = jwt.sign(
            {"email": user.email},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: process.env.REFRESH_TOKEN_LIFE}
        );
        // Save user with refresh token
        user.refreshToken = refreshToken;
        user.save();
        //save to httpOnly cookie
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
        // secure: true, uncomment when deploy
        sameSite: 'none',
        maxAge:ms(process.env.REFRESH_TOKEN_LIFE)}) // convert to ms
        res.json({accessToken, emailOrName, password})
    }
}
const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    //search for jwt in cookies appearance
    if(!cookies?.jwt) {
        return res.status(StatusCodes.UNAUTHORIZED).json({'message': 'Cookie không tồn tại'});
    }
    console.log(cookies.jwt);
    //This is the refresh token have set in auth.service.js
    const refreshToken = cookies.jwt;
    //find user in db
    const user = await User.findOne({refreshToken: refreshToken});
    //if user notfound throw error
    if(!user) {
        return res.status(StatusCodes.FORBIDDEN).json({ 'message': 'Tài khoản không tồn tại' });
    }
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || user.email !== decoded.email){
                return res.status(StatusCodes.FORBIDDEN).json(`Lỗi xảy ra khi kiểm tra refresh token: ${err}`)
            }
            const accessToken = jwt.sign(
                {email: decoded.email},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: process.env.ACCESS_TOKEN_LIFE}
            );
            res.json({accessToken})
        }
    )


}
const handleLogout = async (req, res) => {
    //On front-end also delete access token in memory
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(StatusCodes.NO_CONTENT)
    const refreshToken = cookies.jwt;

    // Check if refresh token in db
    const user = await User.findOne({refreshToken: refreshToken});
    if (!user) {
        res.clearCookie('jwt',{httpOnly: true,  sameSite: 'none', maxAge:ms(process.env.REFRESH_TOKEN_LIFE)}); // add , secure: true when deploy
        return res.status(StatusCodes.NO_CONTENT).json({'message':'Lỗi xảy ra khi xóa refresh token: Không tìm thấy user '})
    }
    //delete refreshToken in db
    await User.updateOne({refreshToken: refreshToken}, {refreshToken: ``});
    res.clearCookie('jwt',{httpOnly: true,  sameSite: 'none', maxAge:ms(process.env.REFRESH_TOKEN_LIFE)});// add , secure: true when deploy
    res.status(StatusCodes.OK).json({'message':'Xoa cookie roi'})

}


module.exports = {handleLogin, handleRefreshToken, handleLogout};