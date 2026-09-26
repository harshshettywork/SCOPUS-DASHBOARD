import { NextResponse } from 'next/server';
import { calculateGlobalAccessIndex } from '@/lib/scoring';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rankings = calculateGlobalAccessIndex();
    return NextResponse.json({
      success: true,
      count: rankings.length,
      data: rankings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch rankings' },
      { status: 500 }
    );
  }
}
