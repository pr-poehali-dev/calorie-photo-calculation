import { useState, useEffect } from "react";

const TRIAL_START_KEY = "trial_start";
const ACCESS_KEY = "access_granted";
const TRIAL_DAYS = 3;

export type AccessStatus = "trial" | "expired" | "paid";

export function useTrial() {
  const [status, setStatus] = useState<AccessStatus>("trial");
  const [daysLeft, setDaysLeft] = useState(TRIAL_DAYS);

  useEffect(() => {
    if (localStorage.getItem(ACCESS_KEY) === "true") {
      setStatus("paid");
      return;
    }

    let start = localStorage.getItem(TRIAL_START_KEY);
    if (!start) {
      start = Date.now().toString();
      localStorage.setItem(TRIAL_START_KEY, start);
    }

    const elapsed = Date.now() - Number(start);
    const msPerDay = 1000 * 60 * 60 * 24;
    const remaining = TRIAL_DAYS - Math.floor(elapsed / msPerDay);

    if (remaining <= 0) {
      setStatus("expired");
      setDaysLeft(0);
    } else {
      setStatus("trial");
      setDaysLeft(remaining);
    }
  }, []);

  const grantAccess = () => {
    localStorage.setItem(ACCESS_KEY, "true");
    setStatus("paid");
  };

  return { status, daysLeft, grantAccess };
}
