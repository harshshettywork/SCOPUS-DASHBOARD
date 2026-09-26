import { NextResponse } from 'next/server';
import { calculateGlobalAccessIndex } from '@/lib/scoring';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const refreshedRankings = calculateGlobalAccessIndex({ forceRecalculate: true });
    return NextResponse.json({
      success: true,
      message: 'Global Access Index successfully recalculated and cached.',
      recalculated_at: new Date().toISOString(),
      count: refreshedRankings.length,
      data: refreshedRankings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to recalculate index' },
      { status: 500 }
    );
  }
}
