import jwt from "jsonwebtoken";
import env from "../config/env.js";

export default function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(header.split(" ")[1], env.JWT_ACCESS_SECRET);
    req.userId = decoded.sub;
    next();
  } catch {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
}
