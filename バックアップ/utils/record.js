import { isoNow } from "./date";

export function createRecordMeta(currentStaff) {
  return {
    recordedBy: currentStaff || "未選択",
    recordedAt: isoNow()
  };
}

export function requireStaff(currentStaff) {
  if (!currentStaff) {
    alert("先に勤務中の職員を選択してください。");
    return false;
  }
  return true;
}
