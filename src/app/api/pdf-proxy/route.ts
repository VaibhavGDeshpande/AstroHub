import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get('url');
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Only proxy the sky-map PDFs; anything else would make this an open proxy (SSRF)
    let target: URL;
    try {
      target = new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid url' }, { status: 400 });
    }
    if (target.protocol !== 'https:' || target.hostname !== 'www.skymaps.com') {
      return NextResponse.json({ error: 'Host not allowed' }, { status: 403 });
    }

    const response = await fetch(target, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NextJS/14.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    // Get the PDF data
    const pdfBuffer = await response.arrayBuffer();

    // Return the PDF with proper headers
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('PDF proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch PDF' },
      { status: 500 }
    );
  }
}
