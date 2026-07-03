import { EMPTY_DATA } from "../data/constants";

const GAS_URL = import.meta.env.VITE_GAS_URL || "";

export function isGasReady() {
  return Boolean(GAS_URL);
}

export async function fetchAllData() {
  if (!isGasReady()) return null;

  const url = new URL(GAS_URL);
  url.searchParams.set("action", "getAll");
  url.searchParams.set("t", Date.now());

  const res = await fetch(url.toString());
  const json = await res.json();

  if (!json.ok) throw new Error(json.error || "GAS取得エラー");
  return { ...EMPTY_DATA, ...(json.data || {}) };
}

export async function saveAllData(data) {
  if (!isGasReady()) return null;

  const res = await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "saveAll",
      data
    })
  });

  const json = await res.json();
  if (!json.ok) throw new Error(json.error || "GAS保存エラー");
  return json;
}
