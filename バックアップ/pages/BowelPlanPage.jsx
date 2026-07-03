import { DEFAULT_BOWEL_PLAN } from "../utils/bowelControl";

export default function BowelPlanPage({ data, setData, rooms }) {
  function getName(room) {
    return data.residents?.[room]?.name || "";
  }

  function updatePlan(room, key, value) {
    const resident = data.residents?.[room] || {};
    const bowelPlan = resident.bowelPlan || {};

    setData({
      ...data,
      residents: {
        ...data.residents,
        [room]: {
          ...resident,
          bowelPlan: {
            ...DEFAULT_BOWEL_PLAN,
            ...bowelPlan,
            [key]: value,
          },
        },
      },
    });
  }

  return (
    <section className="page">
      <h2>排便コントロール個別指示</h2>

      <div className="note">
        利用者ごとに、排便なし3日目・4日目・5日目以降の対応指示を登録します。
      </div>

      <div className="tableWrap">
        <table className="bowelPlanTable">
          <thead>
            <tr>
              <th>部屋</th>
              <th>氏名</th>
              <th>3日目</th>
              <th>4日目</th>
              <th>5日目以降</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              const plan = {
                ...DEFAULT_BOWEL_PLAN,
                ...(data.residents?.[room]?.bowelPlan || {}),
              };

              return (
                <tr key={room}>
                  <td>{room}</td>
                  <td>{getName(room) || "-"}</td>
                  <td>
                    <textarea
                      value={plan.day3}
                      onChange={(e) => updatePlan(room, "day3", e.target.value)}
                    />
                  </td>
                  <td>
                    <textarea
                      value={plan.day4}
                      onChange={(e) => updatePlan(room, "day4", e.target.value)}
                    />
                  </td>
                  <td>
                    <textarea
                      value={plan.day5}
                      onChange={(e) => updatePlan(room, "day5", e.target.value)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}