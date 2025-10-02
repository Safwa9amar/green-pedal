import jwt from "jsonwebtoken";

export interface DecodedToken {
  userId: string;
  role: string;
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch (error) {
    console.log(error);
    return null;
  }
}
