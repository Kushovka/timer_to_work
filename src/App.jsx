import React, { useState, useRef } from "react";
import icon from "./assets/light.png";

const App = () => {
  const [time, setTime] = useState({ min: 0, sec: 0 });
  const [isRun, setIsRun] = useState(false);
  const [mode, setMode] = useState("work");
  const [workDuration, setWorkDuration] = useState(30);
  const [breakDuration, setBreakDuration] = useState(5);

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

  const totalSeconds = mode === "work" ? workDuration * 60 : breakDuration * 60;
  const elapsedSeconds =
    totalSeconds -
    currentDuration.current +
    (isRun ? Math.floor((Date.now() - startTimestamp.current) / 1000) : 0);
  const progress = elapsedSeconds / totalSeconds;

  const workStartColor = [16, 185, 129];
  const workEndColor = [239, 68, 68];
  const breakStartColor = [239, 68, 68];
  const breakEndColor = [16, 185, 129];

  const currentColor =
    mode === "work"
      ? workStartColor.map((c, i) =>
          Math.round(c + (workEndColor[i] - c) * progress)
        )
      : breakStartColor.map((c, i) =>
          Math.round(c + (breakEndColor[i] - c) * progress)
        );

  const bgColor = `rgb(${currentColor.join(",")})`;
  const isBreak = mode === "break";

  return (
    <div className="drag flex flex-col items-center justify-center h-screen gap-4">
      <div className="flex flex-col items-center justify-center  bg-transparent">
        <div
          className="relative sm:w-[200px] w-[150px] sm:h-[300px] h-[200px] border-4 rounded-[12px]"
          style={{ backgroundColor: bgColor }}
        >
          <img
            src={icon}
            className={`absolute  top-1/2 left-1/2 sm:w-[60px] w-[40px] -translate-x-1/2 -translate-y-1/2 ${
              isBreak ? "animate-pulse" : ""
            }`}
            style={{ backgroundColor: bgColor }}
            alt="icon"
          />
        </div>

        <h1 className="sm:text-[128px] text-[96px] bg-transparent">
          {`${time.min.toString().padStart(2, "0")}:${time.sec
            .toString()
            .padStart(2, "0")}`}
        </h1>
      </div>

      <h2 className="text-xl bg-transparent text-white/30">
        {isBreak
          ? `Chill ${breakDuration} min...`
          : `Work ${workDuration} min...`}
      </h2>

      <div className="grid sm:grid-cols-4 grid-cols-2 bg-transparent gap-4">
        <button
          onClick={() => startTimer(30)}
          disabled={isRun || isBreak}
          className="no-drag border px-4 py-2 rounded hover:bg-gray-200/30 transition-colors cursor-pointer"
        >
          start 30
        </button>
        <button
          onClick={() => startTimer(60)}
          disabled={isRun || isBreak}
          className="no-drag border px-4 py-2 rounded hover:bg-gray-200/30 transition-colors cursor-pointer"
        >
          start 60
        </button>
        <button
          onClick={pauseTimer}
          disabled={!isRun}
          className="no-drag border px-4 py-2 rounded hover:bg-gray-200/30 transition-colors cursor-pointer"
        >
          pause
        </button>
        <button
          onClick={resetTimer}
          className="no-drag border px-4 py-2 rounded hover:bg-gray-200/30 transition-colors cursor-pointer"
        >
          reset
        </button>
      </div>
    </div>
  );
};

export default App;
