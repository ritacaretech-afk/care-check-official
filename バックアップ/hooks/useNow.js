import { useEffect, useState } from "react";

export function useNow(refreshMs = 60000) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), refreshMs);
    return () => clearInterval(id);
  }, [refreshMs]);

  return now;
}
