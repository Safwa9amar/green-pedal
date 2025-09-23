
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '../../../lib/auth';
import { z } from 'zod';

const prisma = new PrismaClient();

const endRideSchema = z.object({
  rentalId: z.number(),
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
    const { rentalId } = endRideSchema.parse(body);

    const rental = await prisma.rental.findUnique({ where: { id: rentalId } });
    if (!rental || rental.status !== 'ONGOING' || rental.userId !== decoded.userId) {
      return NextResponse.json({ message: 'Invalid rental' }, { status: 400 });
    }

    const endTime = new Date();
    const duration = (endTime.getTime() - rental.startTime.getTime()) / (1000 * 60); // in minutes
    const totalCost = duration * 0.5; // $0.5 per minute

    const updatedRental = await prisma.rental.update({
      where: { id: rentalId },
      data: {
        endTime,
        totalCost,
        status: 'COMPLETED',
      },
    });

    await prisma.bike.update({
      where: { id: rental.bikeId },
      data: { status: 'AVAILABLE' },
    });

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { balance: { decrement: totalCost } },
    });

    return NextResponse.json(updatedRental);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.errors }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
