module.exports = function(requiredRoles) {
  return function(req, res, next) {
    const allowedRoles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
