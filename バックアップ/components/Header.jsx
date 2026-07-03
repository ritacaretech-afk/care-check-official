export default function Header({ date, setDate, sync, loadFromCloud }) {
  return (
    <header className="header">
      <div>
        <h1>🏥 Care Check Official</h1>
        <p>全端末同期 / iPhone現場仕様 / Googleスプレッドシート連携</p>
      </div>
      <div className="headerControls">
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <button onClick={() => loadFromCloud()}>再同期</button>
        <span>{sync}</span>
      </div>
    </header>
  );
}
