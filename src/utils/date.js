export function todayStr() {
  return new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Tokyo" });
}

export function timeNow() {
  return new Date().toTimeString().slice(0, 5);
}

export function isoNow() {
  return new Date().toISOString();
}

export function minutesNow(now = new Date()) {
  return now.getHours() * 60 + now.getMinutes();
}

export function timeToMinutes(time) {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

export function minutesSince(time, now = new Date()) {
  const target = timeToMinutes(time);
  if (target === null) return null;
  let diff = minutesNow(now) - target;
  if (diff < 0) diff += 24 * 60;
  return diff;
}

export function daysSince(date) {
  if (!date) return null;
  const today = new Date(todayStr() + "T00:00:00");
  const target = new Date(date + "T00:00:00");
  if (Number.isNaN(target.getTime())) return null;
  return Math.floor((today - target) / 86400000);
}
