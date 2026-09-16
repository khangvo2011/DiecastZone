const { getAuth } = require("firebase-admin/auth");
const db = require("../config/firebase");

const getBearerToken = (req) => {
  const header = req.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : null;
};

const requireAdmin = async (req, res, next) => {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    const userSnapshot = await db.collection("users").doc(decodedToken.uid).get();
    const role = userSnapshot.exists ? Number(userSnapshot.data().role) : 1;

    if (role !== 2) {
      return res.status(403).json({ message: "Admin role required" });
    }

    req.user = { ...decodedToken, role };
    return next();
  } catch (error) {
    console.error("Admin authentication failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired authentication" });
  }
};

module.exports = { requireAdmin };