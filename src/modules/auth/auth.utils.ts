import jwt from "jsonwebtoken";

// create a token
export const createToken = (
  jwtPayload: Record<string, unknown>,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, { expiresIn });
};

// verify token
export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};
