export default function FloorTabs({ floor, setFloor }) {
  return (
    <div className="tabs">
      <button className={floor === "all" ? "active" : ""} onClick={() => setFloor("all")}>全室</button>
      <button className={floor === "1" ? "active" : ""} onClick={() => setFloor("1")}>1F</button>
      <button className={floor === "2" ? "active" : ""} onClick={() => setFloor("2")}>2F</button>
    </div>
  );
}
