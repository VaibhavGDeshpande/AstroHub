// Daily quiz: one fixed question per calendar day for every visitor, plus a streak kept in localStorage.

export type DailyQuestion = { q: string; options: string[]; answer: string; fact: string };

export const DAILY_QUESTIONS: DailyQuestion[] = [
  { q: "Which planet has the shortest day?", options: ["Saturn", "Jupiter", "Earth", "Mars"], answer: "Jupiter", fact: "Jupiter spins once in just under 10 hours, the fastest of any planet." },
  { q: "What is the closest star to the Sun?", options: ["Sirius", "Barnard's Star", "Proxima Centauri", "Alpha Centauri A"], answer: "Proxima Centauri", fact: "Proxima Centauri is about 4.24 light-years away, a red dwarf too faint to see without a telescope." },
  { q: "Roughly how long does sunlight take to reach Earth?", options: ["8 seconds", "8 minutes", "1 hour", "1 day"], answer: "8 minutes", fact: "Light covers the 150 million km from the Sun in about 8 minutes 20 seconds." },
  { q: "What is the largest moon in the Solar System?", options: ["Titan", "Callisto", "The Moon", "Ganymede"], answer: "Ganymede", fact: "Jupiter's Ganymede is bigger than the planet Mercury." },
  { q: "Which is the brightest star in the night sky?", options: ["Sirius", "Polaris", "Vega", "Betelgeuse"], answer: "Sirius", fact: "Sirius, in Canis Major, shines at magnitude −1.46." },
  { q: "Which planet is tipped over so far that it spins on its side?", options: ["Neptune", "Saturn", "Uranus", "Venus"], answer: "Uranus", fact: "Uranus's axis is tilted about 98°, probably from an ancient giant impact." },
  { q: "Messier 31 is better known as…", options: ["The Orion Nebula", "The Andromeda Galaxy", "The Crab Nebula", "The Whirlpool Galaxy"], answer: "The Andromeda Galaxy", fact: "M31 is about 2.5 million light-years away and visible to the naked eye from dark sites." },
  { q: "Which is the hottest planet?", options: ["Mercury", "Venus", "Mars", "Jupiter"], answer: "Venus", fact: "Venus's thick CO₂ atmosphere traps heat, keeping its surface around 465 °C." },
  { q: "Which human-made object is farthest from Earth?", options: ["Voyager 2", "New Horizons", "Pioneer 10", "Voyager 1"], answer: "Voyager 1", fact: "Voyager 1, launched in 1977, is in interstellar space more than 160 AU away." },
  { q: "Which moon has a thick nitrogen-rich atmosphere?", options: ["Titan", "Europa", "Triton", "Io"], answer: "Titan", fact: "Saturn's Titan has a surface pressure about 1.5 times Earth's." },
  { q: "A light-year is a unit of…", options: ["Time", "Brightness", "Distance", "Speed"], answer: "Distance", fact: "One light-year is about 9.46 trillion km, the distance light travels in a year." },
  { q: "The main asteroid belt lies between which two planets?", options: ["Earth and Mars", "Mars and Jupiter", "Jupiter and Saturn", "Venus and Earth"], answer: "Mars and Jupiter", fact: "Ceres, the largest object in the belt, is classed as a dwarf planet." },
  { q: "At what altitude is the Kármán line, a common boundary of space?", options: ["10 km", "50 km", "100 km", "400 km"], answer: "100 km", fact: "The Kármán line at 100 km is the boundary used by the FAI." },
  { q: "Betelgeuse and Rigel are in which constellation?", options: ["Orion", "Taurus", "Gemini", "Canis Major"], answer: "Orion", fact: "Red Betelgeuse marks Orion's shoulder and blue-white Rigel his foot." },
  { q: "In which year did Apollo 11 land on the Moon?", options: ["1965", "1969", "1972", "1959"], answer: "1969", fact: "Neil Armstrong and Buzz Aldrin landed on 20 July 1969." },
  { q: "Olympus Mons, the tallest volcano known, is on…", options: ["Venus", "Io", "Mars", "Earth"], answer: "Mars", fact: "Olympus Mons rises about 22 km, nearly 2.5 times the height of Everest." },
  { q: "Roughly how old is the universe?", options: ["4.6 billion years", "13.8 billion years", "100 billion years", "1 billion years"], answer: "13.8 billion years", fact: "The estimate comes from measurements of the cosmic microwave background." },
  { q: "Polaris, the North Star, belongs to which constellation?", options: ["Ursa Major", "Cassiopeia", "Draco", "Ursa Minor"], answer: "Ursa Minor", fact: "Polaris sits less than 1° from the north celestial pole." },
  { q: "What causes Earth's seasons?", options: ["Distance from the Sun", "The tilt of Earth's axis", "Solar flares", "The Moon's orbit"], answer: "The tilt of Earth's axis", fact: "Earth is actually closest to the Sun in early January, during northern winter." },
  { q: "The Great Red Spot is a giant storm on…", options: ["Saturn", "Neptune", "Jupiter", "Mars"], answer: "Jupiter", fact: "The storm has been observed for more than 150 years and is wider than Earth." },
  { q: "Which planet is less dense than water?", options: ["Saturn", "Jupiter", "Uranus", "Neptune"], answer: "Saturn", fact: "Saturn's average density is about 0.69 g/cm³." },
  { q: "Who was the first human in space?", options: ["Alan Shepard", "John Glenn", "Yuri Gagarin", "Valentina Tereshkova"], answer: "Yuri Gagarin", fact: "Gagarin orbited Earth aboard Vostok 1 on 12 April 1961." },
  { q: "The Pleiades star cluster is also called…", options: ["The Beehive", "The Seven Sisters", "The Jewel Box", "The Hyades"], answer: "The Seven Sisters", fact: "The Pleiades, M45, is an open cluster in Taurus about 440 light-years away." },
  { q: "Which telescope, launched in 2021, observes in infrared from the L2 point?", options: ["Hubble", "Spitzer", "James Webb", "Chandra"], answer: "James Webb", fact: "JWST's 6.5 m mirror is made of 18 gold-coated segments." },
  { q: "What element makes up most of the Sun?", options: ["Helium", "Hydrogen", "Oxygen", "Carbon"], answer: "Hydrogen", fact: "About 73% of the Sun's mass is hydrogen and about 25% is helium." },
  { q: "What type of galaxy is the Milky Way?", options: ["Elliptical", "Irregular", "Barred spiral", "Lenticular"], answer: "Barred spiral", fact: "A central bar of stars crosses the Milky Way's core." },
  { q: "Which meteor shower peaks around 12 August?", options: ["Geminids", "Leonids", "Quadrantids", "Perseids"], answer: "Perseids", fact: "The Perseids come from debris left by Comet Swift–Tuttle." },
  { q: "A telescope has a 1000 mm focal length and a 200 mm aperture. What is its focal ratio?", options: ["f/2", "f/5", "f/10", "f/20"], answer: "f/5", fact: "Focal ratio is focal length divided by aperture: 1000 ÷ 200 = 5." },
  { q: "On which planet is a day longer than a year?", options: ["Mercury", "Venus", "Mars", "Neptune"], answer: "Venus", fact: "Venus takes about 243 Earth days to rotate once but only 225 to orbit the Sun." },
  { q: "Which body was reclassified as a dwarf planet in 2006?", options: ["Ceres", "Eris", "Pluto", "Charon"], answer: "Pluto", fact: "The IAU's 2006 definition requires a planet to have cleared its orbit." },
  { q: "Which moon is the most volcanically active body in the Solar System?", options: ["Europa", "Io", "Enceladus", "Titan"], answer: "Io", fact: "Tidal heating from Jupiter powers hundreds of volcanoes on Io." },
  { q: "At roughly what altitude does the ISS orbit?", options: ["40 km", "400 km", "4,000 km", "36,000 km"], answer: "400 km", fact: "The ISS circles Earth about every 90 minutes, around 16 times a day." },
  { q: "Which star colour indicates the hottest surface?", options: ["Red", "Yellow", "Orange", "Blue"], answer: "Blue", fact: "Blue O-type stars can exceed 30,000 K; red dwarfs are under 4,000 K." },
  { q: "Which planet has the fastest winds measured in the Solar System?", options: ["Jupiter", "Saturn", "Neptune", "Earth"], answer: "Neptune", fact: "Voyager 2 measured winds on Neptune of about 2,100 km/h." },
  { q: "Which famous comet returns about every 76 years?", options: ["Hale–Bopp", "Halley's Comet", "Comet NEOWISE", "Comet Encke"], answer: "Halley's Comet", fact: "Halley's Comet was last near the Sun in 1986 and returns in 2061." },
  { q: "When the Moon passes through Earth's shadow, it is a…", options: ["Solar eclipse", "Transit", "Lunar eclipse", "Occultation"], answer: "Lunar eclipse", fact: "Sunlight bent through Earth's atmosphere turns a totally eclipsed Moon red." },
  { q: "What does the Bortle scale measure?", options: ["Star brightness", "Telescope power", "Night-sky darkness", "Seeing turbulence"], answer: "Night-sky darkness", fact: "Bortle 1 is a pristine dark site; Bortle 9 is an inner-city sky." },
  { q: "What is thought to lie beneath Europa's icy crust?", options: ["Molten rock", "A liquid water ocean", "Solid iron", "Nothing, it's hollow"], answer: "A liquid water ocean", fact: "Europa's ocean may hold about twice as much water as all of Earth's oceans." },
  { q: "What is Earth's escape velocity, roughly?", options: ["1.1 km/s", "11.2 km/s", "112 km/s", "300 km/s"], answer: "11.2 km/s", fact: "That is about 40,000 km/h, ignoring air resistance." },
  { q: "Which planet has the most known moons?", options: ["Jupiter", "Uranus", "Saturn", "Neptune"], answer: "Saturn", fact: "Saturn passed 270 confirmed moons in 2025, far ahead of Jupiter." },
];

const EPOCH = Date.UTC(2026, 0, 1);

// Local calendar date as YYYY-MM-DD, so the question flips at the visitor's midnight.
export const localDateKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Day number counted from 1 Jan 2026 (#1); it picks the question and names the puzzle in the share text.
export function dayNumber(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - EPOCH) / 86_400_000) + 1;
}

export function questionFor(dateKey: string) {
  const n = dayNumber(dateKey);
  const len = DAILY_QUESTIONS.length;
  return DAILY_QUESTIONS[(((n - 1) % len) + len) % len];
}

export type StreakState = { streak: number; best: number; played: Record<string, boolean> };
export const EMPTY_STREAK: StreakState = { streak: 0, best: 0, played: {} };

function previousDateKey(dateKey: string) {
  const [y, m, d] = dateKey.split("-").map(Number);
  return localDateKey(new Date(y, m - 1, d - 1));
}

// Streak = consecutive days answered correctly. A wrong answer or a missed day resets it.
export function applyResult(state: StreakState, dateKey: string, correct: boolean): StreakState {
  if (dateKey in state.played) return state;
  const continues = state.played[previousDateKey(dateKey)] === true;
  const streak = correct ? (continues ? state.streak + 1 : 1) : 0;
  return { streak, best: Math.max(state.best, streak), played: { ...state.played, [dateKey]: correct } };
}

// What the streak looks like today: if yesterday wasn't won and today isn't played, it has lapsed.
export function currentStreak(state: StreakState, dateKey: string) {
  if (dateKey in state.played) return state.streak;
  return state.played[previousDateKey(dateKey)] === true ? state.streak : 0;
}
