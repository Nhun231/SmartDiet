const jwt = require('jsonwebtoken');
const { StatusCodes } = require("http-status-codes");

const verifyJWTs = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Thiếu header Authorization' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token hết hạn' });
            }
            return res.status(StatusCodes.FORBIDDEN).json({ message: 'Token không hợp lệ' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = verifyJWTs;
