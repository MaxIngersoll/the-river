import { generateId, today } from './storage';

const BOTTLES_KEY = 'river-bottles';

function loadBottles() {
  try {
    const raw = localStorage.getItem(BOTTLES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveBottles(bottles) {
  try {
    localStorage.setItem(BOTTLES_KEY, JSON.stringify(bottles));
  } catch (e) {
    console.error('[River] Failed to save bottles:', e.message);
  }
}

export function writeBottleMessage(text) {
  const bottles = loadBottles();
  const bottle = {
    id: generateId(),
    text,
    created_at: new Date().toISOString(),
    delivered: false,
  };
  bottles.push(bottle);
  saveBottles(bottles);
  return bottle;
}

export function getUndeliveredBottle() {
  const bottles = loadBottles();
  const undelivered = bottles.filter(b => !b.delivered);
  if (undelivered.length === 0) return null;
  return undelivered[Math.floor(Math.random() * undelivered.length)];
}

export function markBottleDelivered(id) {
  const bottles = loadBottles();
  const idx = bottles.findIndex(b => b.id === id);
  if (idx === -1) return;
  bottles[idx] = { ...bottles[idx], delivered: true };
  saveBottles(bottles);
}

export function shouldOfferBottleWrite(sessions) {
  const todayStr = today();
  const todayMinutes = sessions
    .filter(s => s.date === todayStr)
    .reduce((sum, s) => sum + s.duration_minutes, 0);
  if (todayMinutes < 30) return false;
  const bottles = loadBottles();
  return bottles.length < 10;
}
