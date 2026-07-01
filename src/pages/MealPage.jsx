import { MEALS } from "../data/constants";
import { createRecordMeta, requireStaff } from "../utils/record";

const RATE_OPTIONS = ["10割","9割","8割","7割","6割","5割","4割","3割","2割","1割","0割","未"];
const DRINKS = [
  ["tea", "お茶", 200],
  ["miso", "味噌汁", 125],
  ["milk", "牛乳", 200],
  ["juice", "ジュース", 200],
];

function calcMealWater(meal = {}) {
  const drinks = meal.drinks || {};
  return DRINKS.reduce((sum, [key,, ml]) => sum + (drinks[key] ? ml : 0), 0) + (Number(meal.otherWater) || 0);
}

export default function MealPage({ data, setData, rooms, date, currentStaff }) {
  function name(room) {
    return data.residents?.[room]?.name || "";
  }

  function updateName(room, value) {
    setData({ ...data, residents: { ...data.residents, [room]: { name: value } } });
  }

  function updateMeal(room, mealKey, key, value) {
    if (!requireStaff(currentStaff)) return;
    const day = data.meals?.[room]?.[date] || {};
    const meal = day[mealKey] || {};
    setData({
      ...data,
      meals: {
        ...data.meals,
        [room]: {
          ...(data.meals[room] || {}),
          [date]: {
            ...day,
            [mealKey]: { ...meal, [key]: value, ...createRecordMeta(currentStaff) }
          }
        }
      }
    });
  }

  function toggleDrink(room, mealKey, drinkKey) {
    if (!requireStaff(currentStaff)) return;
    const day = data.meals?.[room]?.[date] || {};
    const meal = day[mealKey] || {};
    const drinks = meal.drinks || {};
    setData({
      ...data,
      meals: {
        ...data.meals,
        [room]: {
          ...(data.meals[room] || {}),
          [date]: {
            ...day,
            [mealKey]: {
              ...meal,
              drinks: { ...drinks, [drinkKey]: !drinks[drinkKey] },
              ...createRecordMeta(currentStaff)
            }
          }
        }
      }
    });
  }

  return (
    <section className="page">
      <h2>食事・水分・服薬</h2>
      <div className="note">主食・副食は10割→0割。水分はお茶200mL、味噌汁125mLをワンタップで自動計算します。</div>
      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              <th className="sticky">部屋</th><th>氏名</th>
              {MEALS.map((m) => <th key={m.key} colSpan="7">{m.label}</th>)}
            </tr>
            <tr>
              <th className="sticky"></th><th></th>
              {MEALS.map((m) => ["食前薬", "主食", "副食", "食後薬", "お茶/味噌汁", "その他", "合計"].map((x) => <th key={m.key+x}>{x}</th>))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => {
              const day = data.meals?.[room]?.[date] || {};
              return (
                <tr key={room}>
                  <td className="sticky room">{room}</td>
                  <td><input value={name(room)} onChange={(e) => updateName(room, e.target.value)} /></td>
                  {MEALS.map((m) => {
                    const meal = day[m.key] || {};
                    const water = calcMealWater(meal);
                    return [
                      <td key={m.key+"pre"}><select value={meal.preMed || ""} onChange={(e) => updateMeal(room, m.key, "preMed", e.target.value)}><option value="">未</option><option>実施</option><option>未実施</option><option>拒否</option><option>保留</option></select></td>,
                      <td key={m.key+"main"}><select value={meal.main || ""} onChange={(e) => updateMeal(room, m.key, "main", e.target.value)}>{RATE_OPTIONS.map((r) => <option key={r}>{r}</option>)}</select></td>,
                      <td key={m.key+"sub"}><select value={meal.sub || ""} onChange={(e) => updateMeal(room, m.key, "sub", e.target.value)}>{RATE_OPTIONS.map((r) => <option key={r}>{r}</option>)}</select></td>,
                      <td key={m.key+"post"}><select value={meal.postMed || ""} onChange={(e) => updateMeal(room, m.key, "postMed", e.target.value)}><option value="">未</option><option>実施</option><option>未実施</option><option>拒否</option><option>保留</option></select></td>,
                      <td key={m.key+"drinks"} className="drinkCell">{DRINKS.slice(0,2).map(([key,label,ml]) => <button type="button" key={key} className={meal.drinks?.[key] ? "active" : ""} onClick={() => toggleDrink(room, m.key, key)}>{label}{ml}</button>)}</td>,
                      <td key={m.key+"other"}><select value={meal.otherWater || ""} onChange={(e) => updateMeal(room, m.key, "otherWater", e.target.value)}><option value="">0</option><option value="50">50</option><option value="100">100</option><option value="150">150</option><option value="200">200</option><option value="250">250</option><option value="300">300</option></select></td>,
                      <td key={m.key+"total"}><b>{water}mL</b><small>{meal.recordedBy || ""}</small></td>,
                    ];
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
