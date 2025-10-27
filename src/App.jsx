import React, { useState } from "react";
import icon from "../public/light.png";

const App = () => {
  const [time, setTime] = useState({ min: 0, sec: 0 });
  const [isRun, setIsRun] = useState(null);
  const [mode, setMode] = useState("work");
  const [workDuration, setWorkDuration] = useState(30);
  const [breakDuration, setBreakDuration] = useState(5);

  const startTimer = (workMins) => {
    if (isRun) return;

    setWorkDuration(workMins);
    setBreakDuration(workMins === 30 ? 5 : 10);
    setMode("work");
    setTime({ min: 0, sec: 0 });

    const timer = setInterval(() => {
      setTime((prev) => {
        const limit = mode === "work" ? workDuration : breakDuration;

        if (prev.min === limit && prev.sec === 0) {
          clearInterval(timer);
          setIsRun(null);

          if (mode === "work") {
            setMode("break");
            setTime({ min: 0, sec: 0 });
            setTimeout(() => startTimer(workMins), 1000);
          } else {
            setMode("work");
            setTime({ min: 0, sec: 0 });
          }

          return prev;
        }

        const newSec = prev.sec + 1;
        if (newSec === 60) return { min: prev.min + 1, sec: 0 };
        return { ...prev, sec: newSec };
      });
    }, 1000);

    setIsRun(timer);
  };

  const pauseTimer = () => {
    clearInterval(isRun);
    setIsRun(null);
  };

  const resetTimer = () => {
    clearInterval(isRun);
    setIsRun(null);
    setTime({ min: 0, sec: 0 });
    setMode("work");
  };

  const totalSeconds = mode === "work" ? workDuration * 60 : breakDuration * 60;
  const elapsedSeconds = time.min * 60 + time.sec;
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
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <div className="flex flex-col items-center justify-center">
        <div
          className="relative w-[200px] h-[300px] border-4 rounded-[12px]"
          style={{ backgroundColor: bgColor }}
        >
          <img
            src={icon}
            className={`absolute top-1/2 left-1/2 w-[60px] -translate-x-1/2 -translate-y-1/2 ${
              isBreak ? "animate-pulse" : ""
            }`}
            style={{ backgroundColor: bgColor }}
            alt="icon"
          />
        </div>

        <h1 className="text-[128px]">
          {`${time.min.toString().padStart(2, "0")}:${time.sec
            .toString()
            .padStart(2, "0")}`}
        </h1>
      </div>

      <h2 className="text-xl text-white/30">
        {isBreak
          ? `Chill ${breakDuration} min...`
          : `Work ${workDuration} min...`}
      </h2>

      <div className="flex gap-4">
        <button
          onClick={() => startTimer(30)}
          disabled={isRun}
          className="border px-4 py-2 rounded hover:bg-gray-200 transition-colors"
        >
          start 30
        </button>
        <button
          onClick={() => startTimer(60)}
          disabled={isRun}
          className="border px-4 py-2 rounded hover:bg-gray-200 transition-colors"
        >
          start 60
        </button>
        <button
          onClick={pauseTimer}
          disabled={isBreak}
          className={`border px-4 py-2 rounded transition-colors ${
            isBreak
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "hover:bg-gray-200"
          }`}
        >
          pause
        </button>
        <button
          onClick={resetTimer}
          disabled={isBreak}
          className={`border px-4 py-2 rounded transition-colors ${
            isBreak
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "hover:bg-gray-200"
          }`}
        >
          reset
        </button>
      </div>
    </div>
  );
};

export default App;
