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
    id: "phys_01",
    topic: "Physics",
    statement: "Heavier objects always fall faster than lighter ones.",
    true_fact: "In a vacuum, all objects fall at the same rate regardless of mass due to gravity.",
    research_source: "NASA / Galileo experiments"
  },
  {
    id: "astro_01",
    topic: "Astronomy",
    statement: "The Great Wall of China is visible from space with the naked eye.",
    true_fact: "Astronauts have confirmed the Great Wall is not easily visible from low Earth orbit without aid.",
    research_source: "NASA"
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
  }
];