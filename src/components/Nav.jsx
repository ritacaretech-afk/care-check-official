const items = [
  ["dashboard", "🚨 ダッシュボード"],
  ["meal", "🍚 食事・水分・服薬"],
  ["excretion", "🚽 排泄"],
  ["vital", "🌡 バイタル・体重"],
  ["position", "🔄 体位交換"],
  ["staff", "👥 スタッフ"],
  ["alerts", "🚨 アラート"],
];

export default function Nav({ page, setPage }) {
  return (
    <nav className="nav">
      {items.map(([key, label]) => (
        <button key={key} className={page === key ? "active" : ""} onClick={() => setPage(key)}>
          {label}
        </button>
      ))}
    </nav>
  );
}
