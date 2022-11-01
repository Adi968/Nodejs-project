const jwt = require("jsonwebtoken");
module.exports = {
  checkToken: (req, res, next) => {
   
    let token = req.header(process.env.JWT_HEADER);
    if (token) {
      jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
          return res.json({
            success: 0,
            message: "Invalid Token..."
          });
        }
         else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.json({
        success: 0,
        message: "Access Denied! Unauthorized User"
      });
    }
  }
};
