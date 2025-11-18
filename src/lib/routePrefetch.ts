const HEAVY_ROUTES = new Set<string>([
  "/3d-earth",
  "/3d-moon",
  "/3d-mars",
  "/solar-system",
  "/nasa-eyes",
  "/nasa-eyes/asteroids",
  "/nasa-eyes/earth",
  "/nasa-eyes/exoplanet",
  "/nasa-eyes/solar-system",
]);

export const shouldPrefetchRoute = (path: string) => !HEAVY_ROUTES.has(path);
