import { EMPTY_DATA } from "../data/constants";

const DATA_KEY = "careCheckOfficialDataBackup";
const STAFF_KEY = "careCheckCurrentStaff";

export function loadLocalBackup() {
  try {
    return JSON.parse(localStorage.getItem(DATA_KEY)) || EMPTY_DATA;
  } catch {
    return EMPTY_DATA;
  }
}

export function saveLocalBackup(data) {
  localStorage.setItem(DATA_KEY, JSON.stringify(data));
}

export function loadCurrentStaff() {
  return localStorage.getItem(STAFF_KEY) || "";
}

export function saveCurrentStaff(name) {
  localStorage.setItem(STAFF_KEY, name);
}

export function clearCurrentStaff() {
  localStorage.removeItem(STAFF_KEY);
}
