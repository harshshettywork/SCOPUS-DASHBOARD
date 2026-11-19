import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

function getLocalScopusKey(): string {
  try {
    const keyPath = path.join(process.cwd(), 'SPPU ALL CODES', 'scopuskey.text');
    if (fs.existsSync(keyPath)) {
      return fs.readFileSync(keyPath, 'utf-8').trim();
    }
  } catch {
    // fallback
  }
  return '';
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || 'AF-ID(60014953)';
    const start = searchParams.get('start') || '0';
    const count = searchParams.get('count') || '25';
    const sort = searchParams.get('sort') || '-coverDate';
    const field = searchParams.get('field') || 'dc:title,dc:creator,prism:publicationName,prism:coverDate,citedby-count,prism:doi,dc:identifier,affiliation,author';

    const apiKey =
      req.headers.get('x-els-apikey') ||
      searchParams.get('apiKey') ||
      getLocalScopusKey();

    const targetUrl = `https://api.elsevier.com/content/search/scopus?query=${encodeURIComponent(query)}&start=${start}&count=${count}&sort=${encodeURIComponent(sort)}&field=${encodeURIComponent(field)}`;

    const response = await fetch(targetUrl, {
      headers: {
        'X-ELS-APIKey': apiKey,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Scopus API proxy failed', message: error.message },
      { status: 502 }
    );
  }
}
