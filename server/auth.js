module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status = 401;
    res.send({ status: "Not Authorized" });
  },

  forwardAuthenticated: (req, res, next) => {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.status = 200; // if auth
    res.send({ status: "Authorized" });
  },
};
