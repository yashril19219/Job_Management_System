const jwt = require("jsonwebtoken");
require("dotenv").config({path : '../config/.env'});


//auth middleware to give access to only allowerdRoles peoples,
const auth = (allowedRoles) => {
    return  (req, res, next) => {
        try {

        //verifying the token, 
        const user = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET_TOKEN);

        //checking if the role of user is from allowed roles
        if (allowedRoles.includes(user.role)) {
            next(); // User has the required role, proceed to the next middleware or route
        } else {
            res.status(403).json({ message: "Access denied. You do not have the required role." });
        } 
        } catch (error) {
            res.status(403).json({ message: "Access denied.", error : error });
        }
    };
};

module.exports =auth;


