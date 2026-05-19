const adminMiddleware = (req, res, next) => {
  if (req.user && (req.user.admin || req.user.role === 'admin')) {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden: Admin privileges are required to perform this action' });
  }
};

module.exports = adminMiddleware;
