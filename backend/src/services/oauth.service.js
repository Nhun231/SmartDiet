const passport = require("passport");
const jwt = require("jsonwebtoken");
const ms = require("ms");
const handleLoginByGooglePassport = passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
});
const handleGoogleCallback = (req, res, next) => {
    passport.authenticate("google", {failureRedirect: "/login",session:false}
 ,  async (err, user, info) => {
        console.log(err);
    if (err || !user) {
        const errorMessage = info?.message || "Đăng nhập OAuth thất bại";
        return res.redirect(
            `${process.env.FRONTEND_URL}/login?error=${encodeURIComponent(errorMessage)}`
        );
    }
    // this part set 2 token like usual
    const accessToken = jwt.sign(
        { email: user.email,
                      username: user.username,
                      role: user.role || 'customer',
                      id: user._id, },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_LIFE }
    );

    const refreshToken = jwt.sign(
        { email: user.email,
                      username: user.username,
                      role: user.role || 'customer',
                      id: user._id, },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_LIFE }
    );

    user.refreshToken = refreshToken;
    await user.save();
    //save to httpOnly cookie
    res.cookie('jwt', refreshToken, {
        httpOnly: true,
        // secure: true, uncomment when deploy
        sameSite: 'none',
        maxAge:ms(process.env.REFRESH_TOKEN_LIFE)}) ;// convert to ms
       console.log(`Callback URL with access token: ${process.env.FRONTEND_URL}/oauth-callback?access_token=${accessToken}`)
    res.redirect(`${process.env.FRONTEND_URL}/oauth-callback?access_token=${accessToken}`);

})(req, res, next)
}
module.exports = {handleLoginByGooglePassport, handleGoogleCallback};
