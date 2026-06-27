import jwt, { Secret } from "jsonwebtoken";

type JwtPayload = {
  id: string;
  email: string;
  role: string;
};

export const createToken = (
  payload: JwtPayload,
  secret: Secret,
  expireTime: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn: expireTime as any,
  });
};

export const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
