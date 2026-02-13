import userModel from "../../DB/models/user.model.js";
import * as db_service from "../../DB/DB.service.js";
import {
  decrypt,
  encrypt,
} from "../../common/utils/security/encrypt.security.js";
import { successResponse } from "../../common/success.response.js";
import jwt from "jsonwebtoken";
import { compare, hash } from "../../common/utils/security/hash.security.js";

export const signup = async (req, res, next) => {
  const {
    fristName,
    lastName,
    email,
    password,
    age,
    gender,
    phone,
    confirmPassword,
  } = req.body;
  if (confirmPassword === undefined) {
    throw new Error("Confirm password is required", { cause: 400 });
  }
  if (password !== confirmPassword) {
    throw new Error("Password not match", { cause: 400 });
  }
  const emailExist = await db_service.findOne({
    model: userModel,
    filter: { email },
  });
  if (emailExist) {
    throw new Error("Email already exist", { cause: 400 });
  }
  const hashedPassword = hash({ plainText: password, saltRounds: 12 });
  const encryptedPhone = encrypt(phone);
  
  const user = await db_service.create({
    model: userModel,
    data: {
      fristName,
      lastName,
      email,
      password:hashedPassword,
      age,
      gender,
      phone: encryptedPhone,
      confirm: true,
    },
    options: {
      runValidators: true,
      select: "fristName lastName email age gender ",
    },
  });
  successResponse({
    res,
    status: 201,
    message: "User created successfully",
    data: user,
  });
};
export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await db_service.findOne({
    model: userModel,
    filter: { email },
  });
  if (!user) {
    throw new Error("User not found", { cause: 404 });
  }
  const isPasswordMatch = compare({
    plainText: password,
    cipherText: user.password,
  });
  if (!isPasswordMatch) {
    throw new Error("Password not match", { cause: 400 });
  }
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET || "jwt_super_secret_key",
    { expiresIn: "1h" },
  );
  successResponse({
    res,
    status: 200,
    message: "Login successfully",
    data: { token },
  });
};

export const getProfile = async (req, res, next) => {
  const userInfo = await req.userInfo;
  console.log("gggggggggg",userInfo);
  successResponse({
    res,
    status: 200,
    message: "Get profile successfully",
    data: { ...userInfo._doc, phone: decrypt(userInfo.phone) },
  });
};
