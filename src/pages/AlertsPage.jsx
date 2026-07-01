import { notifyLineWorks } from "../services/lineworks";

export default function AlertsPage({ alerts }) {
  const vital = alerts.filter((a) => a.category === "バイタル");
  const excretion = alerts.filter((a) => a.category === "排尿" || a.category === "排便");
  return (
    <section className="page">
      <div className="pageHeader"><h2>アラート一覧</h2><div className="buttons"><button onClick={() => notifyLineWorks("全アラート通知", alerts)}>全通知</button><button onClick={() => notifyLineWorks("バイタル通知", vital)}>バイタル通知</button><button onClick={() => notifyLineWorks("排泄通知", excretion)}>排泄通知</button></div></div>
      {alerts.length ? alerts.map((a, i) => <div key={i} className={`alert ${a.level}`}><b>{a.text}</b><p>{a.detail}</p></div>) : <p className="ok">アラートなし</p>}
    </section>
  );
}
