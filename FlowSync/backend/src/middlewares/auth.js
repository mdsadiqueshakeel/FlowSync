const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).send("Access Denied");

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).send("Forbidden");
      }
      req.user = decoded;
      next();
    } catch (err) {
      res.status(400).send("Invalid Token");
    }
  };
};

module.exports = auth;
