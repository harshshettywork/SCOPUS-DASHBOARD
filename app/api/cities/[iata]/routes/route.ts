import { NextResponse } from 'next/server';
import { getCityRoutesDetail } from '@/lib/scoring';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { iata: string } }
) {
  try {
    const iata = params.iata;
    if (!iata || iata.length < 3) {
      return NextResponse.json(
        { success: false, error: 'Invalid airport IATA code provided.' },
        { status: 400 }
      );
    }

    const cityDetails = getCityRoutesDetail(iata);
    if (!cityDetails) {
      return NextResponse.json(
        { success: false, error: `City with airport IATA '${iata.toUpperCase()}' not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: cityDetails,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch city routes' },
      { status: 500 }
    );
  }
}
