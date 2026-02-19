import "dotenv/config";

const env = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || "15m",
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || "7d",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:3000",
  NODE_ENV: process.env.NODE_ENV || "development",
};

if (!env.MONGODB_URI) {
  throw new Error("MONGODB_URI must be set (e.g. MongoDB Atlas connection string)");
}
if (!env.JWT_ACCESS_SECRET || !env.JWT_REFRESH_SECRET) {
  throw new Error("JWT secrets must be set in environment variables");
}

export default env;
