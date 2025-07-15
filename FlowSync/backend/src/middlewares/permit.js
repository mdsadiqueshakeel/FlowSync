// permit.js

module.exports = function permit(...allowedRoles) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole) {
      return res.status(401).json({ message: "Unauthorized: No role found" });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden: You don't have access" });
    }

    next(); // ✅ Allow if role is permitted
  };
};
