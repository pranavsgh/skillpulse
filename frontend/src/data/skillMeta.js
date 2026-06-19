// Skill metadata: difficulty, prerequisites, practice projects, and curated free resources.
// Keys are lowercase skill names matching the skill data from the API.

export const SKILL_META = {
  python: {
    difficulty: "Beginner",
    blurb: "The most beginner-friendly language. Reads almost like English and powers everything from web apps to ML.",
    prerequisites: ["No prior programming experience needed", "Basic problem-solving mindset"],
    practice: [
      "Build a command-line to-do app",
      "Write a web scraper with requests + BeautifulSoup",
      "Automate a boring task (rename files, send emails)",
    ],
    resources: [
      { label: "Official Python Tutorial", url: "https://docs.python.org/3/tutorial/" },
      { label: "Automate the Boring Stuff", url: "https://automatetheboringstuff.com/" },
      { label: "Exercism Python Track", url: "https://exercism.org/tracks/python" },
      { label: "freeCodeCamp Python", url: "https://www.freecodecamp.org/learn/scientific-computing-with-python/" },
    ],
  },
  r: {
    difficulty: "Intermediate",
    blurb: "Built by statisticians for statisticians. The go-to for data analysis, statistics, and visualization in academia and research.",
    prerequisites: ["Basic statistics knowledge helps", "No prior programming needed"],
    practice: [
      "Analyze a public dataset and write a report",
      "Build visualizations with ggplot2",
      "Run a regression model with tidymodels",
    ],
    resources: [
      { label: "R for Data Science (R4DS)", url: "https://r4ds.hadley.nz/" },
      { label: "Swirl (interactive)", url: "https://swirlstats.com/" },
      { label: "Exercism R Track", url: "https://exercism.org/tracks/r" },
      { label: "RStudio Education", url: "https://education.rstudio.com/" },
    ],
  },
  java: {
    difficulty: "Intermediate",
    blurb: "Verbose but everywhere — enterprise backends, Android, and huge codebases. Strong typing teaches good habits.",
    prerequisites: ["Basic programming concepts", "Understanding of OOP helps"],
    practice: [
      "Build a CLI inventory manager",
      "Create a REST API with Spring Boot",
      "Implement classic data structures from scratch",
    ],
    resources: [
      { label: "Official dev.java Tutorials", url: "https://dev.java/learn/" },
      { label: "Oracle Java Tutorials", url: "https://docs.oracle.com/javase/tutorial/" },
      { label: "Exercism Java Track", url: "https://exercism.org/tracks/java" },
      { label: "freeCodeCamp Java (YouTube)", url: "https://www.youtube.com/watch?v=A74TOX803D0" },
    ],
  },
  javascript: {
    difficulty: "Beginner",
    blurb: "The language of the web. Runs in every browser and, with Node, on servers too. Essential for any web role.",
    prerequisites: ["HTML & CSS basics", "No prior programming needed"],
    practice: [
      "Build an interactive to-do list in the browser",
      "Fetch and display data from a public API",
      "Make a simple game (tic-tac-toe, memory)",
    ],
    resources: [
      { label: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
      { label: "JavaScript.info", url: "https://javascript.info/" },
      { label: "Exercism JavaScript Track", url: "https://exercism.org/tracks/javascript" },
      { label: "freeCodeCamp JS", url: "https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/" },
    ],
  },
  sql: {
    difficulty: "Beginner",
    blurb: "The universal language for talking to databases. Almost every backend and data role expects it.",
    prerequisites: ["No prior programming needed", "Understanding of tables/spreadsheets helps"],
    practice: [
      "Query a sample database (joins, GROUP BY)",
      "Design a schema for a small app",
      "Write subqueries and window functions",
    ],
    resources: [
      { label: "SQLBolt (interactive)", url: "https://sqlbolt.com/" },
      { label: "SQLZoo (interactive)", url: "https://sqlzoo.net/" },
      { label: "Mode SQL Tutorial", url: "https://mode.com/sql-tutorial/" },
      { label: "W3Schools SQL", url: "https://www.w3schools.com/sql/" },
    ],
  },
  "c++": {
    difficulty: "Advanced",
    blurb: "Powerful and fast, but unforgiving. You manage memory yourself. Used in systems, games, and high-performance code.",
    prerequisites: ["Solid programming fundamentals", "Understanding of memory & pointers"],
    practice: [
      "Implement a linked list and BST from scratch",
      "Build a CLI calculator or text adventure",
      "Write a small memory allocator",
    ],
    resources: [
      { label: "LearnCpp.com", url: "https://www.learncpp.com/" },
      { label: "cppreference", url: "https://en.cppreference.com/w/" },
      { label: "Exercism C++ Track", url: "https://exercism.org/tracks/cpp" },
      { label: "ISO C++ Get Started", url: "https://isocpp.org/get-started" },
    ],
  },
  linux: {
    difficulty: "Intermediate",
    blurb: "The OS that runs most servers and cloud infrastructure. Comfort in the terminal is a force multiplier for any dev.",
    prerequisites: ["No prior experience needed", "Willingness to use the command line"],
    practice: [
      "Write bash scripts to automate tasks",
      "Set up a basic web server on a VM",
      "Complete OverTheWire Bandit wargame",
    ],
    resources: [
      { label: "Linux Journey", url: "https://linuxjourney.com/" },
      { label: "The Linux Command Line (book)", url: "https://linuxcommand.org/tlcl.php" },
      { label: "OverTheWire: Bandit", url: "https://overthewire.org/wargames/bandit/" },
      { label: "Linux Survival", url: "https://linuxsurvival.com/" },
    ],
  },
  ruby: {
    difficulty: "Intermediate",
    blurb: "Elegant and readable, designed for developer happiness. Powers Rails, a fast way to build full web apps.",
    prerequisites: ["Basic programming concepts", "Understanding of OOP helps"],
    practice: [
      "Build a CLI tool or text-based game",
      "Solve katas on Exercism",
      "Create a small Sinatra web app",
    ],
    resources: [
      { label: "Ruby Official Docs", url: "https://www.ruby-lang.org/en/documentation/" },
      { label: "The Odin Project: Ruby", url: "https://www.theodinproject.com/paths/full-stack-ruby-on-rails" },
      { label: "Exercism Ruby Track", url: "https://exercism.org/tracks/ruby" },
      { label: "Learn Ruby the Hard Way", url: "https://learnrubythehardway.org/book/" },
    ],
  },
  "ruby on rails": {
    difficulty: "Intermediate",
    blurb: "A batteries-included web framework. Convention over configuration lets you ship CRUD apps incredibly fast.",
    prerequisites: ["Ruby basics", "HTML/CSS", "Understanding of MVC & databases"],
    practice: [
      "Build a blog with posts and comments",
      "Create a CRUD task manager with auth",
      "Add a REST API to an existing app",
    ],
    resources: [
      { label: "Official Rails Guides", url: "https://guides.rubyonrails.org/" },
      { label: "The Odin Project: Rails", url: "https://www.theodinproject.com/paths/full-stack-ruby-on-rails" },
      { label: "Rails Tutorial (Hartl)", url: "https://www.railstutorial.org/book" },
    ],
  },
  react: {
    difficulty: "Intermediate",
    blurb: "The most popular frontend library. Component-based UI with a huge ecosystem and strong job demand.",
    prerequisites: ["Solid JavaScript", "HTML & CSS", "ES6 syntax (arrow functions, destructuring)"],
    practice: [
      "Build a to-do app with hooks",
      "Make a weather app that consumes an API",
      "Create a reusable component library",
    ],
    resources: [
      { label: "Official React Docs", url: "https://react.dev/learn" },
      { label: "Scrimba React Course", url: "https://scrimba.com/learn/learnreact" },
      { label: "freeCodeCamp React", url: "https://www.freecodecamp.org/learn/front-end-development-libraries/" },
    ],
  },
  docker: {
    difficulty: "Intermediate",
    blurb: "Package apps into containers that run anywhere. Core to modern deployment and DevOps workflows.",
    prerequisites: ["Command line basics", "Understanding of how apps run"],
    practice: [
      "Containerize a simple web app",
      "Use docker-compose for a multi-service stack",
      "Write an optimized multi-stage Dockerfile",
    ],
    resources: [
      { label: "Docker Get Started", url: "https://docs.docker.com/get-started/" },
      { label: "Docker Curriculum", url: "https://docker-curriculum.com/" },
      { label: "Play with Docker", url: "https://labs.play-with-docker.com/" },
    ],
  },
};

const DIFFICULTY_FALLBACK = {
  difficulty: "Intermediate",
  blurb: "A valued skill in CS roles. Explore the resources below to get started.",
  prerequisites: ["Basic programming fundamentals"],
  practice: ["Build a small project using this skill", "Solve practice exercises online"],
  resources: [
    { label: "Search on freeCodeCamp", url: "https://www.freecodecamp.org/news/search/" },
    { label: "Exercism", url: "https://exercism.org/tracks" },
  ],
};

export function getSkillMeta(name) {
  if (!name) return DIFFICULTY_FALLBACK;
  return SKILL_META[name.toLowerCase()] || DIFFICULTY_FALLBACK;
}

export const DIFFICULTY_STYLES = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};