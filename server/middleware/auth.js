import jwt from 'jsonwebtoken';
// dotenv.config();
export const verifyToken = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token
    if (!token) return res.status(403).json({ error: "Access Denied: No Token" });

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🚀 > verifyToken > process.env.JWT_SECRET:", process.env.JWT_SECRET);
    req.user = verified; // Attach user data to request
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid Token" , err});
  }
};
