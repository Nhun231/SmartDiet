const jwt = require('jsonwebtoken');
const {StatusCodes} = require("http-status-codes");

const verifyJWTs = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(StatusCodes.UNAUTHORIZED)
    }
    console.log(authHeader); // Bearer "token"
    const token = authHeader.split(' ')[1];
    jwt.verify(token,
                    process.env.ACCESS_TOKEN_SECRET,
            (err, decoded) => {
                    if (err) {
                        return res.status(StatusCodes.FORBIDDEN) // may not match access token
                    }
                    req.user = decoded.email;
                    next();
            }
        );

}
module.exports = verifyJWTs;