// Run: npm test
import test from "node:test";
import assert from "node:assert/strict";
import * as A from "astronomy-engine";
import { horizonMatrix, eqVec, altAzOf, makeProjector, enuFromAltAz, altitudeCircle, refract, skyState, limitingMagnitude } from "./skyEngine.ts";

const date = new Date("2026-11-24T22:00:00Z");
const site = { lat: 18.52, lon: 73.85 };

test("catalog -> horizon matrix agrees with astronomy-engine for a star (Sirius)", () => {
  const [ra, dec] = [101.2875, -16.7161];
  const mine = altAzOf(horizonMatrix(date, site)(eqVec(ra, dec)));
  A.DefineStar(A.Body.Star1, ra / 15, dec, 8.6);
  const obs = new A.Observer(site.lat, site.lon, 0);
  const eq = A.Equator(A.Body.Star1, date, obs, true, false);
  const ref = A.Horizon(date, obs, eq.ra, eq.dec, null);
  assert.ok(Math.abs(mine.alt - ref.altitude) < 0.02, `alt ${mine.alt} vs ${ref.altitude}`);
  assert.ok(Math.abs(((mine.az - ref.azimuth + 540) % 360) - 180) < 0.02, `az ${mine.az} vs ${ref.azimuth}`);
});

test("projection: view centre is screen centre, edge of the field is the screen edge", () => {
  const view = { az: 120, alt: 0, fov: 90, width: 1000, height: 600 };
  const p = makeProjector(view);
  const c = p(enuFromAltAz(120, 0));
  assert.ok(Math.abs(c.x - 500) < 1e-6 && Math.abs(c.y - 300) < 1e-6);
  const right = p(enuFromAltAz(165, 0)); // az + fov/2, east of the view is to the right
  assert.ok(Math.abs(right.x - 1000) < 1e-6, `x ${right.x}`);
  const up = p(enuFromAltAz(120, 20));
  assert.ok(up.y < 300, "higher altitude is higher on screen");
});

test("altitude circles: points at that altitude lie on the computed screen circle", () => {
  const view = { az: 200, alt: 35, fov: 110, width: 900, height: 700 };
  const p = makeProjector(view);
  for (const alt of [0, 20, 60]) {
    const c = altitudeCircle(p, view, alt);
    assert.equal(c.kind, "circle");
    for (const az of [150, 200, 260]) {
      const q = p(enuFromAltAz(az, alt));
      assert.ok(Math.abs(Math.hypot(q.x - c.cx, q.y - c.cy) - c.r) < 1e-3);
    }
    assert.equal(c.aboveInside, true, "looking up at 35°, the zenith is inside every altitude circle");
  }
  // Looking straight at the horizon, the horizon is a straight line
  const flat = { az: 0, alt: 0, fov: 90, width: 800, height: 600 };
  assert.equal(altitudeCircle(makeProjector(flat), flat, 0).kind, "line");
});

test("refraction lifts the horizon by about half a degree and leaves the zenith alone", () => {
  const h = altAzOf(refract(enuFromAltAz(90, 0))).alt;
  assert.ok(h > 0.45 && h < 0.6, `horizon lifted to ${h}`);
  assert.ok(Math.abs(altAzOf(refract([0, 0, 1])).alt - 90) < 0.01);
});

test("sky state: stars at night, none in daylight", () => {
  assert.equal(skyState(-30).stars, 1);
  assert.equal(skyState(10).stars, 0);
  assert.equal(limitingMagnitude(100, 0), -Infinity);
  assert.ok(limitingMagnitude(30, 1) > limitingMagnitude(150, 1), "zooming in shows fainter stars");
});
