import { timeNow } from "../utils/date";
import { createRecordMeta, requireStaff } from "../utils/record";

export default function PositionPage({ data, setData, rooms, date, currentStaff }) {
  function name(room) { return data.residents?.[room]?.name || ""; }
  function updateName(room, value) { setData({ ...data, residents: { ...data.residents, [room]: { name: value } } }); }
  function record(room) {
    if (!requireStaff(currentStaff)) return;
    const day = data.positions?.[room]?.[date] || {};
    setData({ ...data, positions: { ...data.positions, [room]: { ...(data.positions[room] || {}), [date]: { ...day, last: timeNow(), ...createRecordMeta(currentStaff) } } } });
  }
  return (
    <section className="page">
      <h2>体位交換</h2>
      <div className="tableWrap">
        <table className="smallTable">
          <thead><tr><th className="sticky">部屋</th><th>氏名</th><th>最終</th><th>記録者</th><th>記録</th></tr></thead>
          <tbody>{rooms.map((room) => { const p = data.positions?.[room]?.[date] || {}; return <tr key={room}><td className="sticky room">{room}</td><td><input value={name(room)} onChange={(e) => updateName(room, e.target.value)} /></td><td>{p.last || "未記録"}</td><td>{p.recordedBy || "-"}</td><td><button onClick={() => record(room)}>現在時刻</button></td></tr>; })}</tbody>
        </table>
      </div>
    </section>
  );
}
