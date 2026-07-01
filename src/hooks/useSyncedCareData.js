import { useEffect, useRef, useState } from "react";
import { EMPTY_DATA } from "../data/constants";
import { fetchAllData, isGasReady, saveAllData } from "../services/gas";
import { loadLocalBackup, saveLocalBackup } from "../utils/storage";

export function useSyncedCareData() {
  const [data, setDataState] = useState(() => ({ ...EMPTY_DATA, ...loadLocalBackup() }));
  const [sync, setSync] = useState(isGasReady() ? "同期準備中" : "ローカル保存");
  const saveTimer = useRef(null);

  useEffect(() => {
    loadFromCloud();
    if (!isGasReady()) return;

    const id = setInterval(() => {
      loadFromCloud(false);
    }, 10000);

    return () => clearInterval(id);
  }, []);

  async function loadFromCloud(showStatus = true) {
    if (!isGasReady()) {
      setSync("ローカル保存");
      return;
    }

    try {
      if (showStatus) setSync("同期中");
      const cloudData = await fetchAllData();
      if (cloudData) {
        setDataState(cloudData);
        saveLocalBackup(cloudData);
        setSync("同期済み");
      }
    } catch (e) {
      console.error(e);
      setSync("同期エラー・ローカル表示");
    }
  }

  function setData(next) {
    setDataState(next);
    saveLocalBackup(next);

    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        if (isGasReady()) {
          setSync("保存中");
          await saveAllData(next);
          setSync("同期済み");
        } else {
          setSync("ローカル保存");
        }
      } catch (e) {
        console.error(e);
        setSync("保存エラー");
      }
    }, 500);
  }

  return { data, setData, sync, loadFromCloud };
}
