const quotes = [
  // CONSISTENCY
  { text: "Success is the product of daily habits, not once-in-a-lifetime transformations.", author: "James Clear", source: "Atomic Habits", category: "consistency" },
  { text: "Every action you take is a vote for the type of person you wish to become.", author: "James Clear", source: "Atomic Habits", category: "consistency" },
  { text: "Professionals stick to the schedule. Amateurs let life get in the way.", author: "James Clear", source: "Atomic Habits", category: "consistency" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.", author: "Will Durant", source: "The Story of Philosophy", category: "consistency" },
  { text: "One thousand days of lessons for discipline. Ten thousand days of lessons for mastery.", author: "Miyamoto Musashi", source: "The Book of Five Rings", category: "consistency" },
  { text: "I fear not the man who has practiced 10,000 kicks once, but the man who has practiced one kick 10,000 times.", author: "Bruce Lee", source: "", category: "consistency" },
  { text: "How we spend our days is, of course, how we spend our lives.", author: "Annie Dillard", source: "The Writing Life", category: "consistency" },

  // SYSTEMS
  { text: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear", source: "Atomic Habits", category: "systems" },
  { text: "Habits are the compound interest of self-improvement.", author: "James Clear", source: "Atomic Habits", category: "systems" },
  { text: "You should be far more concerned with your current trajectory than with your current results.", author: "James Clear", source: "Atomic Habits", category: "systems" },
  { text: "Through discipline comes freedom.", author: "Aristotle", source: "", category: "systems" },
  { text: "No man is free who is not master of himself.", author: "Epictetus", source: "", category: "systems" },

  // IDENTITY
  { text: "The ultimate form of intrinsic motivation is when a habit becomes part of your identity.", author: "James Clear", source: "Atomic Habits", category: "identity" },
  { text: "The most effective way to change your habits is to focus not on what you want to achieve, but on who you wish to become.", author: "James Clear", source: "Atomic Habits", category: "identity" },
  { text: "Knowing others is intelligence. Knowing yourself is true wisdom. Mastering others is strength. Mastering yourself is true power.", author: "Lao Tzu", source: "Tao Te Ching", category: "identity" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius", source: "Meditations", category: "identity" },
  { text: "It may seem difficult at first, but everything is difficult at first.", author: "Miyamoto Musashi", source: "The Book of Five Rings", category: "identity" },
  { text: "I choose to live by choice, not by chance.", author: "Miyamoto Musashi", source: "The Book of Five Rings", category: "identity" },

  // PERSISTENCE
  { text: "The first mistake is never the one that ruins you. It is the spiral of repeated mistakes that follows. Missing once is an accident. Missing twice is the start of a new habit.", author: "James Clear", source: "Atomic Habits", category: "persistence" },
  { text: "All big things come from small beginnings. The seed of every habit is a single, tiny decision.", author: "James Clear", source: "Atomic Habits", category: "persistence" },
  { text: "When nothing seems to help, I go and look at a stonecutter hammering away at his rock, perhaps a hundred times without as much as a crack showing in it. Yet at the hundred and first blow it will split in two, and I know it was not that last blow that did it, but all that had gone before.", author: "Jacob Riis", source: "quoted in Atomic Habits", category: "persistence" },
  { text: "A journey of a thousand miles begins with a single step.", author: "Lao Tzu", source: "Tao Te Ching", category: "persistence" },
  { text: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu", source: "Tao Te Ching", category: "persistence" },
  { text: "Do you have the patience to wait until your mud settles and the water is clear?", author: "Lao Tzu", source: "Tao Te Ching", category: "persistence" },
  { text: "Courage is not always a roar. Sometimes courage is the quiet voice at the end of the day that says I will try again tomorrow.", author: "Mary Anne Radmacher", source: "", category: "persistence" },
  { text: "It is better to conquer self than to win a thousand battles.", author: "Buddha", source: "", category: "persistence" },
  { text: "Endurance is one of the most difficult disciplines, but it is to the one who endures that the final victory comes.", author: "Buddha", source: "", category: "persistence" },
  { text: "People with grit do not believe that failure is a permanent condition.", author: "Angela Duckworth", source: "Grit", category: "persistence" },

  // PRACTICE
  { text: "Human beings are at their best when immersed deeply in something challenging.", author: "Cal Newport", source: "Deep Work", category: "practice" },
  { text: "To build your working life around the experience of flow produced by deep work is a proven path to deep satisfaction.", author: "Cal Newport", source: "Deep Work", category: "practice" },
  { text: "Habits do not restrict freedom. They create it.", author: "James Clear", source: "Atomic Habits", category: "practice" },
  { text: "You can only fight the way you practice.", author: "Miyamoto Musashi", source: "The Book of Five Rings", category: "practice" },
  { text: "Knowledge is a treasure, but practice is the key to it.", author: "Lao Tzu", source: "Tao Te Ching", category: "practice" },
  { text: "Do not think that what is hard for you to master is humanly impossible. If it is humanly possible, consider it to be within your reach.", author: "Marcus Aurelius", source: "Meditations", category: "practice" },
  { text: "The successful warrior is the average man, with laser-like focus.", author: "Bruce Lee", source: "", category: "practice" },
  { text: "Nothing in the world is as soft and yielding as water. Yet for dissolving the hard and inflexible, nothing can surpass it.", author: "Lao Tzu", source: "Tao Te Ching", category: "practice" },

  // GROWTH
  { text: "When you fall in love with the process rather than the product, you do not have to wait to give yourself permission to be happy.", author: "James Clear", source: "Atomic Habits", category: "growth" },
  { text: "Good habits make time your ally. Bad habits make time your enemy.", author: "James Clear", source: "Atomic Habits", category: "growth" },
  { text: "Gradually, as you continue to layer small changes on top of one another, the scales of life start to move.", author: "James Clear", source: "Atomic Habits", category: "growth" },
  { text: "When I let go of what I am, I become what I might be.", author: "Lao Tzu", source: "Tao Te Ching", category: "growth" },
  { text: "Muddy water, let stand, becomes clear.", author: "Lao Tzu", source: "Tao Te Ching", category: "growth" },
  { text: "Be content with what you have. Rejoice in the way things are. When you realize there is nothing lacking, the whole world belongs to you.", author: "Lao Tzu", source: "Tao Te Ching", category: "growth" },
  { text: "You must understand that there is more than one path to the top of the mountain.", author: "Miyamoto Musashi", source: "The Book of Five Rings", category: "growth" },
  { text: "We ought to do good to others as simply as a horse runs, or a bee makes honey, or a vine bears grapes season after season without thinking of the grapes it has borne.", author: "Marcus Aurelius", source: "Meditations", category: "growth" },
  { text: "Simplicity, patience, compassion. These three are your greatest treasures.", author: "Lao Tzu", source: "Tao Te Ching", category: "growth" },
  { text: "Determine that today you will overcome yourself of the day before, tomorrow you will win over those of lesser skill, and later you will win over those of greater skill.", author: "Miyamoto Musashi", source: "The Book of Five Rings", category: "growth" },
  { text: "Grit is living life like it is a marathon, not a sprint.", author: "Angela Duckworth", source: "Grit", category: "growth" },
];

// Seed-based random for daily quote (same quote all day)
function seededRandom(seed) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function dateSeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export function getDailyQuote() {
  const seed = dateSeed();
  const idx = Math.floor(seededRandom(seed) * quotes.length);
  return quotes[idx];
}

export function getQuoteByCategory(...categories) {
  const matching = quotes.filter(q => categories.includes(q.category));
  if (matching.length === 0) return quotes[Math.floor(Math.random() * quotes.length)];
  return matching[Math.floor(Math.random() * matching.length)];
}

export function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export default quotes;
