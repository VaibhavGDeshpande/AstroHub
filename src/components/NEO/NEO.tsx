'use client'
import { useState, useEffect } from "react";
import Link from 'next/link';
import {
  CalendarIcon,
  RocketLaunchIcon,
  ExclamationTriangleIcon,
  GlobeAmericasIcon,
  ArrowTopRightOnSquareIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
  ClockIcon,
  ScaleIcon
} from '@heroicons/react/24/outline';
import { getNEO } from "../../api_service/neo";
import { NEOResponse } from "../../types/neo";
import LoaderWrapper from "../Loader";

// The site's own Back pill: same glass look, no scale or transition-all so it passes the motion rules.
const BackLink = () => (
  <div className="neo-back">
    <Link
      href="/"
      className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white rounded-lg hover:bg-slate-700/50 transition-colors duration-300 motion-reduce:transition-none shadow-lg group"
    >
      <ArrowLeftIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:-translate-x-0.5 transition-transform duration-300 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0" />
      <span className="text-xs sm:text-sm font-medium">Back</span>
    </Link>
  </div>
);

const NEOExplorer = () => {
  const [data, setData] = useState<NEOResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [expandedNEO, setExpandedNEO] = useState<string | null>(null);

  // Get today's date and yesterday as default range
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  useEffect(() => {
    if (!startDate && !endDate) {
      setStartDate(yesterdayStr);
      setEndDate(todayStr);
    }
  }, [yesterdayStr, todayStr, startDate, endDate]);

  const fetchNEOData = async (start: string, end: string) => {
    try {
      setLoading(true);
      setError(null);
      const result = await getNEO(start, end);
      setData(result);
    } catch (err) {
      console.error('Failed to fetch NEO data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load NEO data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchNEOData(startDate, endDate);
    }
  }, [startDate, endDate]);

  const handleDateSearch = () => {
    if (!startDate || !endDate) {
      setError('Please select both start and end dates');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      setError('Start date must be before or equal to end date');
      return;
    }

    const daysDiff = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24));
    if (daysDiff > 7) {
      setError('Date range cannot exceed 7 days');
      return;
    }

    fetchNEOData(startDate, endDate);
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const getHazardClass = (isHazardous: boolean): string => {
    return isHazardous ? 'is-hazard' : 'is-safe';
  };

  const getSizeCategory = (diameterKm: number): string => {
    if (diameterKm < 0.1) return 'Very Small';
    if (diameterKm < 1) return 'Small';
    if (diameterKm < 10) return 'Medium';
    return 'Large';
  };

  if (loading) {
    return <LoaderWrapper/>;
  }

  if (error) {
    return (
      <div className="neo">
        <BackLink />
        <div className="neo-error" role="alert">
          <div className="neo-error__card">
            <ExclamationTriangleIcon aria-hidden="true" />
            <h2>Asteroid Detection Failed!</h2>
            <p>{error}</p>
            <button
              type="button"
              onClick={() => {
                setError(null);
                if (startDate && endDate) {
                  fetchNEOData(startDate, endDate);
                }
              }}
              className="neo-btn"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hazardousCount = data
    ? Object.values(data.near_earth_objects).flat().filter(neo => neo.is_potentially_hazardous_asteroid).length
    : 0;

  return (
    <div className="neo">
      <BackLink />

      <div className="neo-wrap">
        {/* Header */}
        <header className="neo-head">
          <h1>NASA&apos;s Near Earth Objects</h1>
          <p>Track asteroids and comets that approach Earth with detailed orbital information</p>
        </header>

        {/* Search Controls */}
        <section className="neo-panel" aria-labelledby="neo-search-title">
          <div className="neo-search__head">
            <div className="neo-search__title">
              <MagnifyingGlassIcon aria-hidden="true" />
              <div>
                <h2 id="neo-search-title">Search Date Range</h2>
                <p>Select dates to explore NEOs</p>
              </div>
            </div>
          </div>

          <div className="neo-fields">
            <div className="neo-field">
              <label htmlFor="neo-start">
                <CalendarIcon aria-hidden="true" />
                <span>Start Date</span>
              </label>
              <input
                id="neo-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={todayStr}
                className="neo-input"
              />
            </div>

            <div className="neo-field">
              <label htmlFor="neo-end">
                <CalendarIcon aria-hidden="true" />
                <span>End Date</span>
              </label>
              <input
                id="neo-end"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                max={todayStr}
                className="neo-input"
              />
            </div>

            <div className="neo-field">
              <button
                type="button"
                onClick={handleDateSearch}
                className="neo-btn neo-btn--search"
              >
                <MagnifyingGlassIcon aria-hidden="true" />
                <span>Search NEOs</span>
              </button>
            </div>
          </div>

          <div className="neo-search__foot">
            <ul className="neo-hints">
              <li>
                <ExclamationTriangleIcon aria-hidden="true" style={{ color: 'var(--color-neo-yellow)' }} />
                <span>Max 7 days range</span>
              </li>
              <li>
                <ClockIcon aria-hidden="true" />
                <span>Daily NASA updates</span>
              </li>
            </ul>

            {/* Quick Date Shortcuts */}
            <div className="neo-quick" role="group" aria-label="Quick date ranges">
              <button
                type="button"
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                  setStartDate(yesterday);
                  setEndDate(today);
                }}
                className="neo-btn neo-btn--quiet"
              >
                Yesterday-Today
              </button>
              <button
                type="button"
                onClick={() => {
                  const today = new Date().toISOString().split('T')[0];
                  const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0];
                  setStartDate(weekAgo);
                  setEndDate(today);
                }}
                className="neo-btn neo-btn--quiet"
              >
                Last 7 Days
              </button>
            </div>
          </div>
        </section>

        {/* Results */}
        {data && (
          <>
            {/* Summary Stats */}
            <div className="neo-stats">
              <div className="neo-panel neo-stat">
                <RocketLaunchIcon aria-hidden="true" />
                <b>{data.element_count}</b>
                <span>Total NEOs</span>
              </div>

              <div className="neo-panel neo-stat neo-stat--alert">
                <ExclamationTriangleIcon aria-hidden="true" />
                <b>{hazardousCount}</b>
                <span>Potentially Hazardous</span>
              </div>

              <div className="neo-panel neo-stat">
                <CalendarIcon aria-hidden="true" />
                <b>{Object.keys(data.near_earth_objects).length}</b>
                <span>Days Tracked</span>
              </div>
            </div>

            {/* NEO List by Date */}
            <div className="neo-days">
              {Object.entries(data.near_earth_objects).map(([date, neos]) => {
                const day = new Date(date);
                return (
                  <section key={date} className="neo-panel">
                    <div className="neo-day__head">
                      <h3>
                        <CalendarIcon aria-hidden="true" />
                        <span>
                          <span className="neo-day__short">
                            {day.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                          <span className="neo-day__long">
                            {day.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                          </span>
                        </span>
                      </h3>
                      <span className="neo-count">{neos.length} NEOs</span>
                    </div>

                    <ul className="neo-list">
                      {neos.map((neo) => {
                        const approach = neo.close_approach_data[0];
                        const isExpanded = expandedNEO === neo.id;
                        const diameterKm = (neo.estimated_diameter.kilometers.estimated_diameter_min +
                                          neo.estimated_diameter.kilometers.estimated_diameter_max) / 2;

                        return (
                          <li
                            key={neo.id}
                            className={`neo-item${neo.is_potentially_hazardous_asteroid ? ' neo-item--hazard' : ''}`}
                          >
                            <div className="neo-item__top">
                              <div className="neo-item__main">
                                <h4>{neo.name}</h4>
                                <ul className="neo-meta">
                                  <li className={getHazardClass(neo.is_potentially_hazardous_asteroid)}>
                                    <ExclamationTriangleIcon aria-hidden="true" />
                                    <span>{neo.is_potentially_hazardous_asteroid ? 'Hazardous' : 'Safe'}</span>
                                  </li>
                                  <li>
                                    <ScaleIcon aria-hidden="true" />
                                    <span>{getSizeCategory(diameterKm)}</span>
                                  </li>
                                  <li>
                                    <GlobeAmericasIcon aria-hidden="true" />
                                    <span>{formatNumber(diameterKm)} km</span>
                                  </li>
                                </ul>
                              </div>

                              <button
                                type="button"
                                onClick={() => setExpandedNEO(isExpanded ? null : neo.id)}
                                aria-expanded={isExpanded}
                                aria-label={`${isExpanded ? 'Hide' : 'Show'} details for ${neo.name}`}
                                className="neo-more"
                              >
                                {isExpanded ? 'Less' : 'More'}
                              </button>
                            </div>

                            {isExpanded && (
                              <div className="neo-detail">
                                <section>
                                  <h5>Physical Properties</h5>
                                  <dl className="neo-rows">
                                    <div><dt>Absolute Magnitude</dt><dd>{neo.absolute_magnitude_h}</dd></div>
                                    <div><dt>Min Diameter</dt><dd>{formatNumber(neo.estimated_diameter.kilometers.estimated_diameter_min)} km</dd></div>
                                    <div><dt>Max Diameter</dt><dd>{formatNumber(neo.estimated_diameter.kilometers.estimated_diameter_max)} km</dd></div>
                                    <div>
                                      <dt>Sentry Object</dt>
                                      <dd className={neo.is_sentry_object ? 'is-hazard' : 'is-safe'}>{neo.is_sentry_object ? 'Yes' : 'No'}</dd>
                                    </div>
                                  </dl>
                                </section>

                                {approach && (
                                  <section>
                                    <h5>Close Approach Data</h5>
                                    <dl className="neo-rows">
                                      <div><dt>Date</dt><dd>{new Date(approach.close_approach_date_full).toLocaleString()}</dd></div>
                                      <div><dt>Velocity</dt><dd>{formatNumber(parseFloat(approach.relative_velocity.kilometers_per_hour))} km/h</dd></div>
                                      <div><dt>Miss distance</dt><dd>{formatNumber(parseFloat(approach.miss_distance.kilometers))} km</dd></div>
                                      <div><dt>Orbiting</dt><dd>{approach.orbiting_body}</dd></div>
                                    </dl>
                                  </section>
                                )}

                                <div className="neo-detail__foot">
                                  <a
                                    href={neo.nasa_jpl_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="neo-btn"
                                  >
                                    <span>View on NASA JPL</span>
                                    <ArrowTopRightOnSquareIcon aria-hidden="true" />
                                  </a>
                                </div>
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default NEOExplorer;
