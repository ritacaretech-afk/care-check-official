import { HOURS, ROOMS } from "../data/constants";
import { daysSince, minutesSince } from "./date";

function residentName(data, room) {
  return data.residents?.[room]?.name || "";
}

function excretionDay(data, room, date) {
  return data.excretions?.[room]?.[date] || {};
}

function vitalDay(data, room, date) {
  return data.vitals?.[room]?.[date] || {};
}

function weightDay(data, room, date) {
  return data.weights?.[room]?.[date] || {};
}

export function bowelCount(data, room, date) {
  const day = excretionDay(data, room, date);
  let small = 0;
  let medium = 0;
  let large = 0;

  HOURS.forEach((h) => {
    const stool = day.hours?.[h]?.stool || "";
    if (stool === "少量") small += 1;
    if (["中量", "普通", "軟便", "硬便"].includes(stool)) medium += 1;
    if (["多量", "下痢"].includes(stool)) large += 1;
  });

  const smallAsMedium = Math.floor(small / 3);
  const effective = smallAsMedium + medium + large;
  return { small, medium, large, smallAsMedium, effective };
}

export function lastUrination(data, room, date) {
  const day = excretionDay(data, room, date);
  if (day.lastUrination) return day.lastUrination;

  let last = "";
  HOURS.forEach((h) => {
    const urine = day.hours?.[h]?.urine || "";
    if (urine) last = String(h).padStart(2, "0") + ":00";
  });
  return last;
}

export function lastBowelDate(data, room, date) {
  const day = excretionDay(data, room, date);
  if (day.lastBowelDate) return day.lastBowelDate;
  if (bowelCount(data, room, date).effective >= 1) return date;
  return "";
}

export function buildAlerts(data, date, now) {
  const alerts = [];

  ROOMS.forEach((room) => {
    const name = residentName(data, room);

    const lastU = lastUrination(data, room, date);
    const urineMin = minutesSince(lastU, now);
    if (urineMin !== null && urineMin >= 360) {
      alerts.push({
        level: "high",
        category: "排尿",
        room,
        text: `🚽 排尿6時間未確認：${room} ${name} 最終${lastU}`,
        detail: "状態確認・声かけ・水分摂取状況を確認してください。"
      });
    }

    const bowel = bowelCount(data, room, date);
    if (bowel.effective < 1) {
      const noBowelDays = daysSince(lastBowelDate(data, room, date));
      if (noBowelDays >= 5) {
        alerts.push({
          level: "high",
          category: "排便",
          room,
          text: `🚨 排便なし${noBowelDays}日目：${room} ${name}`,
          detail: "下剤調整後の状況、腹部症状、疼痛、嘔吐、食事量を確認し、医師・訪問看護への相談を検討してください。"
        });
      } else if (noBowelDays === 4) {
        alerts.push({
          level: "warning",
          category: "排便",
          room,
          text: `⚠️ 排便なし4日目：${room} ${name}`,
          detail: "下剤調整後の効果確認を行い、看護師へ報告してください。"
        });
      } else if (noBowelDays === 3) {
        alerts.push({
          level: "warning",
          category: "排便",
          room,
          text: `⚠️ 排便なし3日目：${room} ${name}`,
          detail: "施設ルールに沿って下剤調整を確認し、看護師へ報告してください。"
        });
      }
    }

    const v = vitalDay(data, room, date);
    if (v.temp && (Number(v.temp) >= 37.5 || Number(v.temp) < 35.5)) {
      alerts.push({ level: "warning", category: "バイタル", room, text: `🌡️ 体温異常：${room} ${name} ${v.temp}℃`, detail: "再検・状態観察・看護師報告を検討してください。" });
    }
    if (v.spo2 && Number(v.spo2) <= 93) {
      alerts.push({ level: "high", category: "バイタル", room, text: `🫁 SpO₂低下：${room} ${name} ${v.spo2}%`, detail: "体調確認・再検・看護師報告を検討してください。" });
    }
    if (v.bpHigh && (Number(v.bpHigh) >= 160 || Number(v.bpHigh) < 90)) {
      alerts.push({ level: "warning", category: "バイタル", room, text: `🩺 血圧異常：${room} ${name} ${v.bpHigh}/${v.bpLow || "-"}mmHg`, detail: "安静後の再検・看護師報告を検討してください。" });
    }
    if (v.pulse && (Number(v.pulse) >= 110 || Number(v.pulse) < 50)) {
      alerts.push({ level: "warning", category: "バイタル", room, text: `❤️ 脈拍異常：${room} ${name} ${v.pulse}/分`, detail: "再検・状態観察をしてください。" });
    }

    const w = weightDay(data, room, date);
    if (w.weight && w.previousWeight) {
      const diff = Number(w.weight) - Number(w.previousWeight);
      if (Math.abs(diff) >= 2) {
        alerts.push({ level: "warning", category: "体重", room, text: `⚖️ 体重変化：${room} ${name} ${diff > 0 ? "+" : ""}${diff.toFixed(1)}kg`, detail: "浮腫・食事量・水分量・排泄状況を確認してください。" });
      }
    }
  });

  return alerts;
}
