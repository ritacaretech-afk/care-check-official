export const FLOOR1 = Array.from({ length: 20 }, (_, i) => String(101 + i));
export const FLOOR2 = Array.from({ length: 39 }, (_, i) => String(201 + i));
export const ROOMS = [...FLOOR1, ...FLOOR2];
export const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const MEALS = [
  { key: "breakfast", label: "朝食" },
  { key: "lunch", label: "昼食" },
  { key: "dinner", label: "夕食" },
];

export const DEFAULT_STAFF = ["井上", "山田", "佐藤", "鈴木"];

export const EMPTY_DATA = {
  residents: {},
  staff: DEFAULT_STAFF,
  meals: {},
  excretions: {},
  vitals: {},
  weights: {},
  positions: {},
  handovers: {},
  notificationHistory: []
};
