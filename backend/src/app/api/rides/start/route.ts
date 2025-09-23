
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../lib/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

const startRideSchema = z.object({
  bikeId: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { bikeId } = startRideSchema.parse(body);

    const bike = await prisma.bike.findUnique({ where: { id: bikeId } });
    if (!bike || bike.status !== 'AVAILABLE') {
      return NextResponse.json({ message: 'Bike not available' }, { status: 400 });
    }

    const rental = await prisma.rental.create({
      data: {
        userId: decoded.userId,
        bikeId,
        startTime: new Date(),
      },
    });

    await prisma.bike.update({
      where: { id: bikeId },
      data: { status: 'IN_USE' },
    });

    return NextResponse.json(rental, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
