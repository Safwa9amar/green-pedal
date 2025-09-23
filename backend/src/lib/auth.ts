
import jwt from 'jsonwebtoken';

interface DecodedToken {
  userId: number;
  role: string;
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch (error) {
    return null;
  }
}
