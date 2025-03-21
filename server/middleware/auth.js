import jwt from 'jsonwebtoken';
export const verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) return res.status(403).json({ error: "Access Denied: No Token" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid Token" , err});
  }
};
