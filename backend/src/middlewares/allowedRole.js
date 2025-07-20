const { StatusCodes } = require("http-status-codes");

const allowedRoles = (...roles) => {
    return (req, res, next) => {
        // if (!req?.user?.role || !roles.includes(req.user.role)) {
        //     return res.status(StatusCodes.UNAUTHORIZED).json({
        //         message: "Người dùng không được truy cập đường dẫn này"
        //     });
        // }
        next();
    };
};

module.exports = allowedRoles;
