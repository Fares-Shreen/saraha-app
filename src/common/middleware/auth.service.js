import jwt from "jsonwebtoken";
import * as db_service from "../../DB/DB.service.js"
import userModel from "../../DB/models/user.model.js";
export const authMiddleware = async (req, res, next) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    throw new Error("Unauthorized", { cause: 401 });
  }
  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "jwt_super_secret_key",
    );

    req.user = decoded;
    const userExist = await db_service.findById({model:userModel,id:req.user.id})
    
    if (!userExist) {
      throw new Error("user not found", { cause: 401 });
    }
    req.userInfo = userExist;
    next();
  } catch (error) {
    throw new Error(error.message, { cause: 401 });
  }
};
