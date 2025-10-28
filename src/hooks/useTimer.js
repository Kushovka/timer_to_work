import { useRef, useState } from "react";

export default function useTimer(workDefault = 30, breakDefault = 5) {
  const [time, setTime] = useState({ min: 0, sec: 0 });
  const [isRun, setIsRun] = useState(false);
  const [mode, setMode] = useState("work");
  const [workDuration, setWorkDuration] = useState(workDefault);
  const [breakDuration, setBreakDuration] = useState(breakDefault);

  const startTimestamp = useRef(null);
  const timerRef = useRef(null);
  const currentDuration = useRef(0);

  const startTimer = (minutes) => {
    if (isRun) return;

    setWorkDuration(minutes);
    setBreakDuration(minutes === 30 ? 5 : 10);
    setMode("work");

    currentDuration.current = minutes * 60;
    startTimestamp.current = Date.now();
    setIsRun(true);

    timerRef.current = requestAnimationFrame(updateTime);
  };

  const updateTime = () => {
    const now = Date.now();
    const elapsed = Math.floor((now - startTimestamp.current) / 1000);
    const remaining = currentDuration.current - elapsed;

    if (remaining <= 0) {
      if (mode === "work") {
        setMode("break");
        currentDuration.current = breakDuration * 60;
      } else {
        setMode("work");
        currentDuration.current = workDuration * 60;
      }
      startTimestamp.current = Date.now();
      timerRef.current = requestAnimationFrame(updateTime);
      return;
    }

    setTime({ min: Math.floor(remaining / 60), sec: remaining % 60 });
    timerRef.current = requestAnimationFrame(updateTime);
  };

  const pauseTimer = () => {
    if (!isRun) return;
    cancelAnimationFrame(timerRef.current);
    const now = Date.now();
    const elapsed = Math.floor((now - startTimestamp.current) / 1000);
    currentDuration.current -= elapsed;
    setIsRun(false);
  };

  const resetTimer = () => {
    cancelAnimationFrame(timerRef.current);
    setTime({ min: 0, sec: 0 });
    setMode("work");
    setIsRun(false);
  };
  return {
    time,
    isRun,
    mode,
    workDuration,
    breakDuration,
    startTimer,
    pauseTimer,
    resetTimer,
    currentDuration,
    startTimestamp,
  };
}
