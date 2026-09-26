import { NextResponse } from 'next/server';
import { db } from '@/db/db';
import { calculateGlobalAccessIndex } from '@/lib/scoring';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cities = db.getCities();
    const routes = db.getRoutes();
    const rankings = calculateGlobalAccessIndex();

    const uniqueDestCountries = new Set(routes.map((r) => r.dest_country.trim())).size;
    const uniqueDestAirports = new Set(routes.map((r) => r.dest_iata.toUpperCase())).size;
    const topCity = rankings.length > 0 ? rankings[0] : null;

    const avgScore =
      rankings.length > 0
        ? Number(
            (
              rankings.reduce((sum, r) => sum + r.index_score, 0) / rankings.length
            ).toFixed(1)
          )
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalCities: cities.length,
        totalRoutes: routes.length,
        uniqueCountries: uniqueDestCountries,
        uniqueAirports: uniqueDestAirports,
        topCity: topCity ? topCity.city_name : 'N/A',
        topIata: topCity ? topCity.airport_iata : 'N/A',
        topScore: topCity ? topCity.index_score : 0,
        avgScore,
        lastCalculated: topCity?.calculated_at || new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to get stats' },
      { status: 500 }
    );
  }
}
