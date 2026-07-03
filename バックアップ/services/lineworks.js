const WEBHOOK_URL = import.meta.env.VITE_LINEWORKS_WEBHOOK_URL || "";

export function buildMessage(title, alerts) {
  const body = alerts.length
    ? alerts.map((a) => `・${a.text}\n  ${a.detail || ""}`).join("\n")
    : "現在アラートはありません。";

  return `【Care Check ${title}】\n\n${body}\n\n※医療判断ではなく、施設ルールに沿った確認・報告支援です。`;
}

export async function notifyLineWorks(title, alerts) {
  const message = buildMessage(title, alerts);

  if (!WEBHOOK_URL) {
    alert("LINE WORKS通知URLが未設定です。\n\n送信予定内容：\n" + message);
    return;
  }

  const res = await fetch(WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: message })
  });

  if (!res.ok) throw new Error("LINE WORKS通知に失敗しました");
  alert("LINE WORKSへ通知しました。");
}
