import { useMemo, useState } from "react";
import { FLOOR1, FLOOR2, ROOMS } from "./data/constants";
import { loadCurrentStaff, saveCurrentStaff, clearCurrentStaff } from "./utils/storage";
import { todayStr } from "./utils/date";
import { buildAlerts } from "./utils/alerts";
import { useNow } from "./hooks/useNow";
import { useSyncedCareData } from "./hooks/useSyncedCareData";
import Header from "./components/Header";
import StaffLogin from "./components/StaffLogin";
import Nav from "./components/Nav";
import FloorTabs from "./components/FloorTabs";
import DashboardPage from "./pages/DashboardPage";
import MealPage from "./pages/MealPage";
import ExcretionPage from "./pages/ExcretionPage";
import VitalPage from "./pages/VitalPage";
import PositionPage from "./pages/PositionPage";
import StaffPage from "./pages/StaffPage";
import AlertsPage from "./pages/AlertsPage";
import "./styles.css";

export default function App() {
  const { data, setData, sync, loadFromCloud } = useSyncedCareData();
  const [date, setDate] = useState(todayStr());
  const [floor, setFloor] = useState("all");
  const [page, setPage] = useState("dashboard");
  const [currentStaff, setCurrentStaff] = useState(() => loadCurrentStaff());
  const now = useNow(60000);

  const rooms = floor === "1" ? FLOOR1 : floor === "2" ? FLOOR2 : ROOMS;

  function loginStaff(name) {
    setCurrentStaff(name);
    saveCurrentStaff(name);
  }

  function logoutStaff() {
    setCurrentStaff("");
    clearCurrentStaff();
  }

  const alerts = useMemo(() => buildAlerts(data, date, now), [data, date, now]);
  const common = { data, setData, rooms, date, now, currentStaff };

  return (
    <div className="app">
      <Header date={date} setDate={setDate} sync={sync} loadFromCloud={loadFromCloud} />
      <StaffLogin staffList={data.staff || []} currentStaff={currentStaff} loginStaff={loginStaff} logoutStaff={logoutStaff} />
      <Nav page={page} setPage={setPage} />
      <FloorTabs floor={floor} setFloor={setFloor} />

      {page === "dashboard" && <DashboardPage alerts={alerts} />}
      {page === "meal" && <MealPage {...common} />}
      {page === "excretion" && <ExcretionPage {...common} />}
      {page === "vital" && <VitalPage {...common} />}
      {page === "position" && <PositionPage {...common} />}
      {page === "staff" && <StaffPage data={data} setData={setData} />}
      {page === "alerts" && <AlertsPage alerts={alerts} />}
    </div>
  );
}
