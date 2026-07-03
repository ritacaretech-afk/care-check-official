import { HOURS } from "../data/constants";
import { bowelCount } from "../utils/alerts";
import { createRecordMeta, requireStaff } from "../utils/record";

export default function ExcretionPage({ data, setData, rooms, date, now, currentStaff }) {
  const currentHour = now.getHours();

  function name(room) { return data.residents?.[room]?.name || ""; }
  function updateName(room, value) { setData({ ...data, residents: { ...data.residents, [room]: { name: value } } }); }

  function updateDay(room, key, value) {
    if (!requireStaff(currentStaff)) return;
    const day = data.excretions?.[room]?.[date] || {};
    setData({ ...data, excretions: { ...data.excretions, [room]: { ...(data.excretions[room] || {}), [date]: { ...day, [key]: value, ...createRecordMeta(currentStaff) } } } });
  }

  function updateHour(room, hour, key, value) {
    if (!requireStaff(currentStaff)) return;
    const day = data.excretions?.[room]?.[date] || {};
    const hours = day.hours || {};
    setData({ ...data, excretions: { ...data.excretions, [room]: { ...(data.excretions[room] || {}), [date]: { ...day, hours: { ...hours, [hour]: { ...(hours[hour] || {}), [key]: value, ...createRecordMeta(currentStaff) } } } } } });
  }

  return (
    <section className="page">
      <h2>排泄管理</h2>
      <div className="note">排泄記録には職員名が自動保存されます。排尿6時間未確認でアラート、少量3回＝中量1回で換算。</div>
      <div className="tableWrap">
        <table>
          <thead>
            <tr><th className="sticky">部屋</th><th>氏名</th><th>最終排尿</th><th>前回排便日</th><th>排便換算</th>{HOURS.map((h) => <th key={h} className={h === currentHour ? "currentHour" : ""}>{h}時</th>)}</tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              const day = data.excretions?.[room]?.[date] || {};
              const bowel = bowelCount(data, room, date);
              return (
                <tr key={room}>
                  <td className="sticky room">{room}</td>
                  <td><input value={name(room)} onChange={(e) => updateName(room, e.target.value)} /></td>
                  <td><input type="time" value={day.lastUrination || ""} onChange={(e) => updateDay(room, "lastUrination", e.target.value)} /></td>
                  <td><input type="date" value={day.lastBowelDate || ""} onChange={(e) => updateDay(room, "lastBowelDate", e.target.value)} /></td>
                  <td className="mini">少{bowel.small}/中{bowel.medium}/多{bowel.large}<br />換算{bowel.effective}</td>
                  {HOURS.map((h) => {
                    const cell = day.hours?.[h] || {};
                    return (
                      <td key={h} className={h === currentHour ? "currentCell" : ""}>
                        <select value={cell.stool || ""} onChange={(e) => updateHour(room, h, "stool", e.target.value)}><option value="">便</option><option>少量</option><option>中量</option><option>多量</option><option>普通</option><option>軟便</option><option>硬便</option><option>下痢</option></select>
                        <select value={cell.urine || ""} onChange={(e) => updateHour(room, h, "urine", e.target.value)}><option value="">尿</option><option>排尿</option><option>失禁</option><option>カテ</option><option>少量</option><option>中量</option><option>多量</option></select>
                        {cell.recordedBy && <small>{cell.recordedBy}</small>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
