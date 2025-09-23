
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../lib/auth';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const rentals = await prisma.rental.findMany({
      where: { userId: decoded.userId },
      include: { bike: true },
      orderBy: { startTime: 'desc' },
    });

    return NextResponse.json(rentals);
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
