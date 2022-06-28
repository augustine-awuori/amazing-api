module.exports = (req, res, next) => {
  const user = req.user;

  if (!user?.isAdmin)
    return res
      .status(401)
      .send({ error: "Access denied. User is not an admin." });

  next();
};
