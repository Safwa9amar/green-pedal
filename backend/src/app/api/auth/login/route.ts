
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = loginSchema.parse(body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    return NextResponse.json({ token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
