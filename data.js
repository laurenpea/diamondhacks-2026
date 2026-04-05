// 'Hallucinations' for the AI models along with corrections
export const truthStore = [
  {
    id: "bio_01",
    topic: "Human Biology",
    statement: "Humans only use 10% of their brains.",
    true_fact: "Functional MRI scans show that humans use nearly every part of the brain, and most of it is active almost all the time.",
    research_source: "Scientific American / Johns Hopkins Medicine"
  },
  {
    id: "bio_02",
    topic: "Human Biology",
    statement: "Cracking your knuckles causes arthritis.",
    true_fact: "Multiple long-term studies have found no correlation between knuckle cracking and arthritis.",
    research_source: "Harvard Medical School"
  },
  {
    id: "bio_03",
    topic: "Human Biology",
    statement: "Hair and nails continue to grow after a person dies.",
    true_fact: "Hair and nails do not grow after death; the appearance of growth is due to skin dehydration and shrinkage.",
    research_source: "American Academy of Dermatology"
  },
  {
    id: "chem_01",
    topic: "Chemistry",
    statement: "Gold is the most expensive metal on Earth.",
    true_fact: "Metals like rhodium and iridium are often significantly more expensive than gold due to rarity and industrial demand.",
    research_source: "Royal Society of Chemistry"
  },
  {
    id: "chem_02",
    topic: "Chemistry",
    statement: "All acids are dangerous and will burn anything they touch.",
    true_fact: "Acidity varies widely; weak acids like acetic acid (vinegar) are safe in low concentrations.",
    research_source: "American Chemical Society"
  },
  {
    id: "chem_03",
    topic: "Chemistry",
    statement: "Mixing any chemicals always produces a dangerous reaction.",
    true_fact: "Many chemicals can be safely combined; dangerous reactions depend on specific substances and conditions.",
    research_source: "American Chemical Society"
  },
  {
    id: "phys_01",
    topic: "Physics",
    statement: "Heavier objects always fall faster than lighter ones.",
    true_fact: "In a vacuum, all objects fall at the same rate regardless of mass due to gravity.",
    research_source: "NASA / Galileo experiments"
  },
  {
    id: "phys_02",
    topic: "Physics",
    statement: "Objects in motion will eventually stop even without external forces.",
    true_fact: "According to Newton’s First Law, an object in motion stays in motion unless acted upon by an external force.",
    research_source: "NASA"
  },
  {
    id: "astro_01",
    topic: "Astronomy",
    statement: "The Great Wall of China is visible from space with the naked eye.",
    true_fact: "Astronauts have confirmed the Great Wall is not easily visible from low Earth orbit without aid.",
    research_source: "NASA"
  },
  {
    id: "astro_02",
    topic: "Astronomy",
    statement: "The Sun is a unique star unlike any other in the universe.",
    true_fact: "The Sun is an average-sized star; many similar stars exist throughout the galaxy.",
    research_source: "NASA / ESA"
  },
  {
    id: "geo_01",
    topic: "Geography",
    statement: "Africa is a country.",
    true_fact: "Africa is a continent made up of 50+ countries with diverse cultures and governments.",
    research_source: "United Nations"
  },
  {
    id: "geo_02",
    topic: "Geology",
    statement: "Diamonds form from compressed coal.",
    true_fact: "Most diamonds form deep in the Earth's mantle under high pressure and temperature, not from coal.",
    research_source: "Gemological Institute of America"
  },
  {
    id: "geo_03",
    topic: "Geography",
    statement: "The equator is the hottest place on Earth at all times.",
    true_fact: "Some deserts away from the equator can reach higher temperatures due to atmospheric conditions.",
    research_source: "National Geographic"
  },
  {
    id: "geo_04",
    topic: "Geology",
    statement: "Earthquakes only happen at night because it is cooler.",
    true_fact: "Earthquakes are caused by tectonic plate movements and occur independently of time or temperature.",
    research_source: "US Geological Survey"
  },
  {
    id: "hist_01",
    topic: "History",
    statement: "Napoleon Bonaparte was extremely short.",
    true_fact: "Napoleon was about average height for his time; the myth comes from differences in measurement systems and propaganda.",
    research_source: "Britannica"
  },
  {
    id: "hist_02",
    topic: "History",
    statement: "People in the Middle Ages believed the Earth was flat.",
    true_fact: "Educated people in the Middle Ages widely understood that the Earth was spherical.",
    research_source: "University of Cambridge / Historical scholarship"
  },
  {
    id: "lit_01",
    topic: "Literature",
    statement: "All dystopian novels predict the future accurately, so modern surveillance will definitely lead to totalitarian control.",
    true_fact: "This is a hasty generalization; dystopian fiction explores possibilities, not guaranteed outcomes.",
    research_source: "Literary theory / Critical thinking"
  },
  {
    id: "lit_02",
    topic: "Literature",
    statement: "If a story has an unreliable narrator, then everything in the story must be false.",
    true_fact: "This is a false dichotomy; unreliable narration means some elements are questionable, not all.",
    research_source: "Narrative theory studies"
  },
  {
    id: "lit_03",
    topic: "Literature",
    statement: "If a book is popular, it must be well-written.",
    true_fact: "This is an appeal to popularity fallacy; popularity does not necessarily reflect literary quality.",
    research_source: "Critical thinking / Literary analysis"
  },
  {
    id: "pol_01",
    topic: "Politics",
    statement: "If one policy fails, all policies from that political party must be bad.",
    true_fact: "This is a hasty generalization; conclusions about an entire group cannot be drawn from a single case.",
    research_source: "Political science / Logic"
  },
  {
    id: "pol_02",
    topic: "Politics",
    statement: "You're either completely for this law or completely against progress.",
    true_fact: "This is a false dilemma; it ignores nuanced or alternative positions.",
    research_source: "Critical thinking / Informal logic"
  },
  {
    id: "pol_03",
    topic: "Politics",
    statement: "If a law benefits one group, it must harm all others.",
    true_fact: "This is a false zero-sum assumption; policies can benefit multiple groups simultaneously.",
    research_source: "Political science / Economics"
  },
  {
    id: "health_01",
    topic: "Health",
    statement: "You need to drink exactly 8 glasses of water a day.",
    true_fact: "Hydration needs vary by individual, activity level, and environment; there is no universal '8 glasses' rule.",
    research_source: "Mayo Clinic"
  },
  {
    id: "health_02",
    topic: "Health",
    statement: "Vitamin C prevents you from getting sick entirely.",
    true_fact: "Vitamin C may slightly reduce the duration of colds but does not prevent illness completely.",
    research_source: "National Institutes of Health"
  },
  {
    id: "cs_01",
    topic: "Computer Science",
    statement: "More lines of code always mean a better program.",
    true_fact: "This is a faulty metric; code quality, efficiency, and readability matter more than length.",
    research_source: "Software engineering principles"
  },
  {
    id: "cs_02",
    topic: "Computer Science",
    statement: "If an algorithm works once, it will always work for all inputs.",
    true_fact: "This is a logical fallacy; correctness must be proven across all cases, not a single example.",
    research_source: "Algorithm analysis / CS theory"
  },
  {
    id: "cs_03",
    topic: "Computer Science",
    statement: "Computers can solve any problem instantly if they are powerful enough.",
    true_fact: "Some problems are computationally intractable or undecidable, regardless of computing power.",
    research_source: "Computational complexity theory"
  }
];