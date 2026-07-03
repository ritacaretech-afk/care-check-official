import { createRecordMeta, requireStaff } from "../utils/record";

export default function VitalPage({ data, setData, rooms, date, currentStaff }) {
  function name(room) { return data.residents?.[room]?.name || ""; }
  function updateName(room, value) { setData({ ...data, residents: { ...data.residents, [room]: { name: value } } }); }

  function updateVital(room, key, value) {
    if (!requireStaff(currentStaff)) return;
    const day = data.vitals?.[room]?.[date] || {};
    setData({ ...data, vitals: { ...data.vitals, [room]: { ...(data.vitals[room] || {}), [date]: { ...day, [key]: value, ...createRecordMeta(currentStaff) } } } });
  }

  function updateWeight(room, key, value) {
    if (!requireStaff(currentStaff)) return;
    const day = data.weights?.[room]?.[date] || {};
    setData({ ...data, weights: { ...data.weights, [room]: { ...(data.weights[room] || {}), [date]: { ...day, [key]: value, ...createRecordMeta(currentStaff) } } } });
  }

  return (
    <section className="page">
      <h2>バイタル・体重</h2>
      <div className="tableWrap">
        <table className="mediumTable">
          <thead><tr><th className="sticky">部屋</th><th>氏名</th><th>体温</th><th>血圧上</th><th>血圧下</th><th>SpO₂</th><th>脈拍</th><th>今回体重</th><th>前回体重</th><th>差</th><th>記録者</th></tr></thead>
          <tbody>
            {rooms.map((room) => {
              const v = data.vitals?.[room]?.[date] || {};
              const w = data.weights?.[room]?.[date] || {};
              const diff = w.weight && w.previousWeight ? Number(w.weight) - Number(w.previousWeight) : null;
              return (
                <tr key={room}>
                  <td className="sticky room">{room}</td><td><input value={name(room)} onChange={(e) => updateName(room, e.target.value)} /></td>
                  <td><input type="number" step="0.1" value={v.temp || ""} onChange={(e) => updateVital(room, "temp", e.target.value)} /></td>
                  <td><input type="number" value={v.bpHigh || ""} onChange={(e) => updateVital(room, "bpHigh", e.target.value)} /></td>
                  <td><input type="number" value={v.bpLow || ""} onChange={(e) => updateVital(room, "bpLow", e.target.value)} /></td>
                  <td><input type="number" value={v.spo2 || ""} onChange={(e) => updateVital(room, "spo2", e.target.value)} /></td>
                  <td><input type="number" value={v.pulse || ""} onChange={(e) => updateVital(room, "pulse", e.target.value)} /></td>
                  <td><input type="number" step="0.1" value={w.weight || ""} onChange={(e) => updateWeight(room, "weight", e.target.value)} /></td>
                  <td><input type="number" step="0.1" value={w.previousWeight || ""} onChange={(e) => updateWeight(room, "previousWeight", e.target.value)} /></td>
                  <td className={diff !== null && Math.abs(diff) >= 2 ? "danger" : ""}>{diff === null ? "-" : `${diff > 0 ? "+" : ""}${diff.toFixed(1)}kg`}</td>
                  <td>{v.recordedBy || w.recordedBy || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
