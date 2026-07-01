import { notifyLineWorks } from "../services/lineworks";

function count(alerts, category) {
  return alerts.filter((a) => a.category === category).length;
}

export default function DashboardPage({ alerts }) {
  const important = alerts.filter((a) => a.level === "high" || a.level === "warning");

  return (
    <section className="page">
      <div className="pageHeader">
        <h2>ダッシュボード</h2>
        <button onClick={() => notifyLineWorks("重要アラート通知", important)}>LINE WORKS重要通知</button>
      </div>

      <div className="cards">
        <div className="card"><span>🚨</span><p>重要</p><b>{important.length}件</b></div>
        <div className="card"><span>🚽</span><p>排尿</p><b>{count(alerts, "排尿")}件</b></div>
        <div className="card"><span>💩</span><p>排便</p><b>{count(alerts, "排便")}件</b></div>
        <div className="card"><span>🌡</span><p>バイタル</p><b>{count(alerts, "バイタル")}件</b></div>
        <div className="card"><span>⚖</span><p>体重</p><b>{count(alerts, "体重")}件</b></div>
      </div>

      <div className="panel">
        <h3>優先対応</h3>
        {important.length ? important.map((a, i) => (
          <div key={i} className={`alert ${a.level}`}>
            <b>{a.text}</b>
            <p>{a.detail}</p>
          </div>
        )) : <p className="ok">現在、優先対応はありません。</p>}
      </div>
    </section>
  );
}
