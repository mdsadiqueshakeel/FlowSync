module.exports = (model) => {
  return async (req, res, next) => {
    req.queryFilter = { customerId: req.user.customerId };
    req.model = model;
    next();
  };
};
