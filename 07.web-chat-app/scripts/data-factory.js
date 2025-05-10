// Generate a random date between a fixed timestamp and now
function randomDate() {
  const startTimestamp = 1585008324467; // Fixed start timestamp
  const endTimestamp = Date.now(); // Current timestamp
  const timestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
  const date = new Date(timestamp);
  const hour = randomNumber(24, 1);
  date.setHours(hour);
  return date;
}

// Generate a random number between min (inclusive) and max (exclusive)
function randomNumber(min, max = 0) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Generate a fake chat object
function chatGenerator(index) {
  const names = [
    "Mario Speedwagon", "Petey Cruiser", "Anna Sthesia", "Paul Molive", "Anna Mull",
    "Gail Forcewind", "Paige Turner", "Bob Frapples", "Walter Melon", "Nick R. Bocker",
    "Barb Ackue", "Buck Kinnear", "Greta Life", "Ira Membrit", "Shonda Leer",
    "Brock Lee", "Maya Didas", "Rick O'Shea", "Pete Sariya", "Monty Carlo",
    "Sal Monella", "Sue Vaneer", "Cliff Hanger", "Barb Dwyer", "Terry Aki",
    "Cory Ander", "Robin Banks", "Jimmy Changa", "Barry Wine", "Wilma Mumduya",
    "Buster Hyman", "Poppa Cherry", "Zack Lee", "Don Stairs", "Saul T. Balls",
    "Peter Pants", "Hal Appeno", "Otto Matic", "Moe Fugga", "Graham Cracker",
    "Tom Foolery", "Al Dente", "Bud Wiser", "Polly Tech", "Holly Graham",
    "Frank N. Stein", "Cam L. Toe", "Pat Agonia", "Tara Zona", "Barry Cade"
  ];

  const name = names[index % names.length];
  let lastSeen = randomDate().toLocaleDateString().replace(/\//g, ".");
  if (index % 3 === 0) lastSeen = "Today";
  if (index % 4 === 0) lastSeen = "Yesterday";

  return {
    id: Math.random().toString(36).substr(2, 10),
    name,
    username: name.replace(/[^a-zA-Z]/g, '').toLowerCase().substr(0, 8),
    online: Math.random() > 0.7,
    lastseen: lastSeen,
    unreadcount: "0",
    avatar: `https://randomuser.me/api/portraits/${index % 3 ? "women" : "men"}/${(index % 100) + 1}.jpg`
  };
}

// Generate random text for messages
function getRandomText(sub = false) {
  if (sub) {
    const lorem = `If the family member doesn’t need hospitalization and can be cared for at home, you should help him or her with basic needs and monitor the symptoms, while also keeping as much distance as possible, according to guidelines issued by the C.D.C. If there’s space, the sick family member should stay in a separate room and use a separate bathroom. If masks are available, both the sick person and the caregiver should wear them when the caregiver enters the room. Make sure not to share any dishes or other household items and to regularly clean surfaces like counters, doorknobs, toilets and tables. Don’t forget to wash your hands frequently.`;
    const startIdx = randomNumber(lorem.length - 6, 6);
    const endIdx = randomNumber(lorem.length - startIdx, startIdx);
    return lorem.substring(startIdx, startIdx + endIdx);
  }

  // Generate a random sentence from words
  const nouns = ["bird", "clock", "boy", "plastic", "duck", "teacher", "old lady", "professor", "hamster", "dog",
    "area", "book", "business", "case", "child", "company", "country", "day", "eye",
    "fact", "family", "government", "group", "hand", "home", "job", "life", "lot"];

  const verbs = ["kicked", "ran", "flew", "dodged", "sliced", "rolled", "died", "breathed", "slept", "killed",
    "ask", "be", "become", "begin", "call", "can", "come", "could", "do",
    "feel", "find", "get", "give", "go", "have", "hear", "help", "keep", "know"];

  const adjectives = ["beautiful", "lazy", "professional", "lovely", "dumb", "rough", "soft", "hot", "vibrating", "slimy", "important",
    "able", "bad", "best", "better", "big", "black", "certain", "clear", "different", "early",
    "easy", "economic", "federal", "free", "full", "good", "great", "hard", "high", "human"];

  const adverbs = ["slowly", "elegantly", "precisely", "quickly", "sadly", "humbly", "proudly", "shockingly", "calmly", "passionately"];

  const prepositions = ["down", "into", "up", "on", "upon", "below", "above", "through", "across", "towards"];

  const randIdx = (max) => Math.floor(Math.random() * max);
  const randAdjIdx = randIdx(adjectives.length);
  const randNounIdx = randIdx(nouns.length);
  const randVerbIdx = randIdx(verbs.length);
  const randAdvIdx = randIdx(adverbs.length);
  const randPrepIdx = randIdx(prepositions.length);

  return `The ${adjectives[randAdjIdx]} ${nouns[randNounIdx]} ${adverbs[randAdvIdx]} ${verbs[randVerbIdx]} because some ${nouns[randNounIdx]} ${adverbs[randAdvIdx]} ${verbs[randVerbIdx]} ${prepositions[randPrepIdx]} a ${adjectives[randAdjIdx]} ${nouns[randNounIdx]} which, became a ${adjectives[randIdx(adjectives.length)]}, ${adjectives[randIdx(adjectives.length)]} ${nouns[randIdx(nouns.length)]}.`;
}
