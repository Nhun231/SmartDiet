const { StatusCodes } = require("http-status-codes");

const allowedRoles = (...roles) => {
    return (req, res, next) => {
        // Flatten the roles array in case it's nested
        const flatRoles = roles.flat();
        console.log('Role check - User role:', req?.user?.role, 'Required roles:', flatRoles);
        
        if (!req?.user?.role || !flatRoles.includes(req.user.role)) {
            console.log('Access denied - User role not in allowed roles');
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "Người dùng không được truy cập đường dẫn này"
            });
        }
        console.log('Access granted');
        next();
    };
};

module.exports = allowedRoles;
