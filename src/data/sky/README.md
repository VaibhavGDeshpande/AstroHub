# Sky data

Compact copies of the data files from [d3-celestial](https://github.com/ofrohn/d3-celestial) 0.7.35
(BSD 3-Clause, Copyright (c) 2015, Olaf Frohn), used by the live sky chart at `/sky-chart`.

- `stars.json`: Hipparcos stars to magnitude 6 as `[ra°, dec°, mag, B−V]`, brightest first, plus proper names.
- `constellations.json`: constellation stick figures and label positions.
- `messier.json`: Messier objects as `[id, common name, type, mag, ra°, dec°]`.
- `milkyway.json`: the Milky Way outline sampled on a ~1.5° grid as `[ra°, dec°, brightness level 1–5]`.

All coordinates are J2000. Planet, Sun and Moon positions are computed at runtime with `astronomy-engine`.
