import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface SkyMapPDF {
  title: string;
  url: string;
  filename: string;
  hemisphere: 'Northern' | 'Equatorial' | 'Southern';
  date: string;
  monthYear: string;
}

export async function GET() {
  try {
    const targetUrl = 'https://www.skymaps.com/downloads.html';
    const { data: html } = await axios.get(targetUrl);
    const $ = cheerio.load(html);

    const pdfLinks: SkyMapPDF[] = [];

    // Extract all PDF links
    $('a[href*=".pdf"]').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;

      // Extract filename from href
      const filename = href.split('/').pop() || '';
      
      // Construct proper full URL (PDFs are in /skymaps/ directory)
      const fullUrl = `https://www.skymaps.com/skymaps/${filename}`;
      
      const linkText = $(element).text().trim();

      // Parse filename for metadata
      let hemisphere: 'Northern' | 'Equatorial' | 'Southern' = 'Northern';
      if (filename.includes('tesmn')) hemisphere = 'Northern';
      else if (filename.includes('tesme')) hemisphere = 'Equatorial';
      else if (filename.includes('tesms')) hemisphere = 'Southern';

      // Extract date from filename (format: YYMM)
      const dateMatch = filename.match(/(\d{4})\.pdf/);
      const dateStr = dateMatch ? dateMatch[1] : '';
      const year = dateStr ? `20${dateStr.substring(0, 2)}` : '';
      const month = dateStr ? dateStr.substring(2, 4) : '';

      // Format month name
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
      const monthName = month ? monthNames[parseInt(month) - 1] : 'Unknown';

      pdfLinks.push({
        title: linkText || `${hemisphere} - ${monthName} ${year}`,
        url: fullUrl,
        filename,
        hemisphere,
        date: year && month ? `${year}-${month}` : 'Unknown',
        monthYear: year && month ? `${monthName} ${year}` : 'Unknown'
      });
    });

    // Sort by date (newest first)
    pdfLinks.sort((a, b) => b.date.localeCompare(a.date));

    return NextResponse.json({ 
      success: true, 
      count: pdfLinks.length,
      data: pdfLinks 
    });
  } catch (error) {
    console.error('Scraping error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to scrape sky maps',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
