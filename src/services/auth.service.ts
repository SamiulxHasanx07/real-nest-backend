import bcrypt from "bcrypt";
import prisma from "../config/prisma";
import { ApiError } from "../utils/ApiError";
import { createToken, verifyToken } from "../utils/jwt";
import { env } from "../config/env";

export const registerUser = async (payload: any) => {
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(payload.password, salt);

  // Create user
  const newUser = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return newUser;
};

export const loginUser = async (payload: any) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatched) {
    throw new ApiError(401, "Invalid password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "User account is inactive");
  }

  // Create tokens
  const jwtPayload = { id: user.id, email: user.email, role: user.role };
  
  const accessToken = createToken(jwtPayload, env.JWT_ACCESS_SECRET, "1d");
  const refreshToken = createToken(jwtPayload, env.JWT_REFRESH_SECRET, "365d");

  // Exclude password from response
  const { password, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const refreshToken = async (token: string) => {
  let decodedToken;
  try {
    decodedToken = verifyToken(token, env.JWT_REFRESH_SECRET);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const user = await prisma.user.findUnique({
    where: { email: decodedToken.email },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const jwtPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = createToken(jwtPayload, env.JWT_ACCESS_SECRET, "1d");

  return { accessToken };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
