export interface Star {
  name: string;
  distanceLy: number;
  constellation: string;
  type: string;
  funFact: string;
}

export const starsData: Star[] = [
  { name: "Proxima Centauri", distanceLy: 4.24, constellation: "Centaurus", type: "Red Dwarf", funFact: "The closest star to our Solar System." },
  { name: "Alpha Centauri A", distanceLy: 4.37, constellation: "Centaurus", type: "G-type Main-Sequence", funFact: "A star very similar to our Sun." },
  { name: "Barnard's Star", distanceLy: 5.96, constellation: "Ophiuchus", type: "Red Dwarf", funFact: "Has the largest proper motion of any star." },
  { name: "Wolf 359", distanceLy: 7.78, constellation: "Leo", type: "Red Dwarf", funFact: "Famous as the site of a fictional battle in Star Trek." },
  { name: "Lalande 21185", distanceLy: 8.31, constellation: "Ursa Major", type: "Red Dwarf", funFact: "The brightest red dwarf in the northern hemisphere." },
  { name: "Sirius A", distanceLy: 8.60, constellation: "Canis Major", type: "A-type Main-Sequence", funFact: "The brightest star in Earth's night sky." },
  { name: "Luyten 726-8 A", distanceLy: 8.73, constellation: "Cetus", type: "Red Dwarf", funFact: "A well-known flare star binary system." },
  { name: "Ross 154", distanceLy: 9.68, constellation: "Sagittarius", type: "Red Dwarf", funFact: "An active flare star that can increase in brightness significantly." },
  { name: "Ross 248", distanceLy: 10.32, constellation: "Andromeda", type: "Red Dwarf", funFact: "Will become the closest star to Earth in about 33,000 years." },
  { name: "Epsilon Eridani", distanceLy: 10.52, constellation: "Eridanus", type: "K-type Main-Sequence", funFact: "A young star with a known debris disk and exoplanets." },
  { name: "Lacaille 9352", distanceLy: 10.74, constellation: "Piscis Austrinus", type: "Red Dwarf", funFact: "One of the brightest red dwarfs visible from Earth." },
  { name: "Ross 128", distanceLy: 11.01, constellation: "Virgo", type: "Red Dwarf", funFact: "Hosts an Earth-mass exoplanet that might be habitable." },
  { name: "EZ Aquarii A", distanceLy: 11.27, constellation: "Aquarius", type: "Red Dwarf", funFact: "A triple star system consisting entirely of red dwarfs." },
  { name: "Procyon A", distanceLy: 11.40, constellation: "Canis Minor", type: "F-type Main-Sequence", funFact: "The eighth-brightest star in the night sky." },
  { name: "61 Cygni A", distanceLy: 11.41, constellation: "Cygnus", type: "K-type Main-Sequence", funFact: "The first star to have its distance measured by parallax." },
  { name: "Struve 2398 A", distanceLy: 11.52, constellation: "Draco", type: "Red Dwarf", funFact: "A binary system of two red dwarfs." },
  { name: "Groombridge 34 A", distanceLy: 11.62, constellation: "Andromeda", type: "Red Dwarf", funFact: "A flare star binary system." },
  { name: "Epsilon Indi A", distanceLy: 11.82, constellation: "Indus", type: "K-type Main-Sequence", funFact: "Accompanied by a pair of brown dwarfs." },
  { name: "DX Cancri", distanceLy: 11.82, constellation: "Cancer", type: "Red Dwarf", funFact: "A highly active flare star." },
  { name: "Tau Ceti", distanceLy: 11.89, constellation: "Cetus", type: "G-type Main-Sequence", funFact: "A stable star with multiple confirmed exoplanets." },
  { name: "GJ 1061", distanceLy: 12.04, constellation: "Horologium", type: "Red Dwarf", funFact: "Has a multi-planet system." },
  { name: "YZ Ceti", distanceLy: 12.12, constellation: "Cetus", type: "Red Dwarf", funFact: "Hosts at least three Earth-mass planets." },
  { name: "Luyten's Star", distanceLy: 12.36, constellation: "Canis Minor", type: "Red Dwarf", funFact: "Hosts a potentially habitable exoplanet." },
  { name: "Teegarden's Star", distanceLy: 12.51, constellation: "Aries", type: "Red Dwarf", funFact: "Discovered relatively recently in 2003." },
  { name: "Kapteyn's Star", distanceLy: 12.76, constellation: "Pictor", type: "Subdwarf", funFact: "A halo star moving backwards around the Milky Way." },
  { name: "Ax Microscopii", distanceLy: 12.91, constellation: "Microscopium", type: "Red Dwarf", funFact: "Also known as Lacaille 8760, it's a bright flare star." },
  { name: "Kruger 60 A", distanceLy: 13.15, constellation: "Cepheus", type: "Red Dwarf", funFact: "A visual binary star system." },
  { name: "Wolf 1061", distanceLy: 13.82, constellation: "Ophiuchus", type: "Red Dwarf", funFact: "Hosts a potentially habitable super-Earth." },
  { name: "Van Maanen 2", distanceLy: 14.07, constellation: "Pisces", type: "White Dwarf", funFact: "The closest single white dwarf to Earth." },
  { name: "Gliese 876", distanceLy: 15.20, constellation: "Aquarius", type: "Red Dwarf", funFact: "The first red dwarf known to host planets." },
  { name: "Altair", distanceLy: 16.73, constellation: "Aquila", type: "A-type Main-Sequence", funFact: "Rotates so fast it is flattened at the poles." },
  { name: "Gliese 581", distanceLy: 20.40, constellation: "Libra", type: "Red Dwarf", funFact: "Famous for its system of multiple exoplanets." },
  { name: "Fomalhaut", distanceLy: 25.13, constellation: "Piscis Austrinus", type: "A-type Main-Sequence", funFact: "One of the first stars where an exoplanet was directly imaged." },
  { name: "Vega", distanceLy: 25.04, constellation: "Lyra", type: "A-type Main-Sequence", funFact: "The first star ever to be photographed." },
  { name: "Arcturus", distanceLy: 36.66, constellation: "Boötes", type: "Red Giant", funFact: "A very old star moving through the galactic plane." },
  { name: "Capella", distanceLy: 42.80, constellation: "Auriga", type: "Yellow Giant", funFact: "Actually a quadruple star system." },
  { name: "Aldebaran", distanceLy: 65.23, constellation: "Taurus", type: "Red Giant", funFact: "The 'Eye of the Bull' in the constellation Taurus." },
  { name: "Regulus", distanceLy: 79.30, constellation: "Leo", type: "B-type Main-Sequence", funFact: "A multiple star system and the brightest in Leo." },
  { name: "Algol", distanceLy: 90.00, constellation: "Perseus", type: "Eclipsing Binary", funFact: "Known as the 'Demon Star' because its brightness fluctuates." },
  { name: "Dubhe", distanceLy: 123.0, constellation: "Ursa Major", type: "Red Giant", funFact: "One of the pointers to the North Star." }
];

export function findClosestStar(distance: number): Star {
  return starsData.reduce((prev, curr) => {
    return Math.abs(curr.distanceLy - distance) < Math.abs(prev.distanceLy - distance) ? curr : prev;
  });
}
