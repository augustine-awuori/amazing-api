module.exports = (req, res, next) => {
  const user = req.user;

  if (!user?.isAdmin)
    return res
      .status(401)
      .send({ error: "Access denied. You're not an admin." });

  next();
};
