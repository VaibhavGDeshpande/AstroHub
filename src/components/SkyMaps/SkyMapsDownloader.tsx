'use client';

import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import LoaderWrapper from '../Loader';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface SkyMapPDF {
  title: string;
  url: string;
  filename: string;
  hemisphere: string;
  date: string;
  monthYear: string;
}

const proxied = (url: string) => `/api/pdf-proxy?url=${encodeURIComponent(url)}`;

export default function SkyMapsDownloader() {
  const [skyMaps, setSkyMaps] = useState<SkyMapPDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHemisphere, setSelectedHemisphere] = useState<string>('all');

  useEffect(() => {
    fetchSkyMaps();
  }, []);

  const fetchSkyMaps = async () => {
    try {
      const response = await fetch('/api/scrape-skymaps');
      const result = await response.json();

      if (result.success) {
        setSkyMaps(result.data);
      } else {
        setError(result.error || 'Failed to load sky maps');
      }
    } catch {
      setError('Network error - please try again');
    } finally {
      setLoading(false);
    }
  };

  const getHemisphereDescription = (hemisphere: string) => {
    switch (hemisphere) {
      case 'Northern': return 'Optimized for latitudes 25°N to 55°N';
      case 'Equatorial': return 'Best for tropical latitudes near the equator';
      case 'Southern': return 'Optimized for latitudes 25°S to 55°S';
      default: return '';
    }
  };

  const filteredHemispheres = selectedHemisphere === 'all'
    ? ['Northern', 'Equatorial', 'Southern']
    : [selectedHemisphere];

  // The newest chart in the current filter is the one the hero shows as a plate.
  const newest = skyMaps
    .filter(map => filteredHemispheres.includes(map.hemisphere))
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  if (loading) {
    return (
      <LoaderWrapper/>
    );
  }

  if (error) {
    return (
      <div className="container sc-state" role="alert">
        <h2>Oops!</h2>
        <p className="label">{error}</p>
        <button type="button" onClick={fetchSkyMaps} className="sc-btn sc-btn--primary">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <main>
      <section className="container sc-hero">
        <div className="sc-hero__text">
          <h1>Sky Maps Collection</h1>
          <p className="lead">
            Explore the night sky with curated charts for every hemisphere.
          </p>
          <div className="sc-filter" role="group" aria-label="Hemisphere">
            {['all', 'Northern', 'Equatorial', 'Southern'].map((hemisphere) => (
              <button
                key={hemisphere}
                type="button"
                onClick={() => setSelectedHemisphere(hemisphere)}
                aria-pressed={selectedHemisphere === hemisphere}
                className="sc-btn"
              >
                {hemisphere === 'all' ? 'All' : hemisphere}
              </button>
            ))}
          </div>
        </div>
        {newest && <Plate key={newest.filename} map={newest} />}
      </section>

      <section className="sc-figures" aria-label="The collection in figures">
        <div className="container">
          <ul>
            <li>
              <b>{skyMaps.length}</b>
              <span className="label">Total maps</span>
            </li>
            <li>
              <b>3</b>
              <span className="label">Hemispheres</span>
            </li>
            <li>
              <b>HD</b>
              <span className="label">Quality</span>
            </li>
          </ul>
        </div>
      </section>

      {filteredHemispheres.map(hemisphere => {
        const hemisphereMaps = skyMaps
          .filter(map => map.hemisphere === hemisphere)
          .sort((a, b) => b.date.localeCompare(a.date));

        if (hemisphereMaps.length === 0) return null;

        return (
          <section key={hemisphere} className="container sc-index" aria-labelledby={`hemisphere-${hemisphere}`}>
            <div className="sc-index__head">
              <div>
                <h2 id={`hemisphere-${hemisphere}`}>{hemisphere} Hemisphere</h2>
                <p className="label">{getHemisphereDescription(hemisphere)}</p>
              </div>
              <p className="label">{hemisphereMaps.length} maps</p>
            </div>
            <ul className="sc-grid">
              {hemisphereMaps.map(map => (
                <li key={map.filename}>
                  <PDFThumbnailCard map={map} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {skyMaps.length === 0 && (
        <div className="container sc-state">
          <h2>No sky maps available</h2>
          <p>Please check back later for new celestial charts.</p>
        </div>
      )}
    </main>
  );
}

function Plate({ map }: { map: SkyMapPDF }) {
  const [failed, setFailed] = useState(false);

  return (
    <figure className="sc-plate">
      <a
        href={map.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Download the ${map.hemisphere} Hemisphere chart for ${map.monthYear}`}
      >
        <div className="sc-plate__page">
          {!failed ? (
            <Document
              file={proxied(map.url)}
              onLoadError={() => setFailed(true)}
              loading={<p className="sc-card__msg">Loading preview…</p>}
              error={<p className="sc-card__msg">Preview unavailable</p>}
            >
              <Page
                pageNumber={1}
                width={600}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={<p className="sc-card__msg">Rendering…</p>}
              />
            </Document>
          ) : (
            <p className="sc-card__msg">Sky Chart PDF</p>
          )}
        </div>
      </a>
      <figcaption>{map.hemisphere} Hemisphere, {map.monthYear}</figcaption>
    </figure>
  );
}

function PDFThumbnailCard({ map }: { map: SkyMapPDF }) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setThumbnailError(false);
  }

  function onDocumentLoadError(error: Error) {
    console.error('PDF load error:', error);
    setThumbnailError(true);
  }

  return (
    <a
      href={map.url}
      target="_blank"
      rel="noopener noreferrer"
      className="sc-card"
    >
      <div className="sc-card__thumb">
        {!thumbnailError ? (
          <Document
            file={proxied(map.url)}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={<p className="sc-card__msg">Loading preview…</p>}
            error={<p className="sc-card__msg">Preview unavailable</p>}
          >
            <Page
              pageNumber={1}
              width={560}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              loading={<p className="sc-card__msg">Rendering…</p>}
            />
          </Document>
        ) : (
          <p className="sc-card__msg">Sky Chart PDF<br />{map.monthYear}</p>
        )}
      </div>

      <div className="sc-card__body">
        <h3>{map.monthYear}</h3>
        <p className="label sc-card__name">{map.filename}</p>
        <div className="sc-card__act">
          <span className="label">
            {numPages ? `${numPages} ${numPages === 1 ? 'page' : 'pages'}` : ''}
          </span>
          <span className="sc-card__cta">Download</span>
        </div>
      </div>
    </a>
  );
}
