import icon from "./assets/light.png";
import Button from "./components/Button";
import useColor from "./hooks/useColor";
import useTimer from "./hooks/useTimer";

const App = () => {
  const {
    time,
    isRun,
    mode,
    workDuration,
    breakDuration,
    currentDuration,
    startTimestamp,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer();

  const bgColor = useColor({
    mode,
    workDuration,
    breakDuration,
    currentDuration,
    startTimestamp,
    isRun,
  });

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
        <Button onClick={() => startTimer(30)} disabled={isRun || isBreak}>
          start 30m
        </Button>
        <Button onClick={() => startTimer(60)} disabled={isRun || isBreak}>
          start 60m
        </Button>
        <Button onClick={pauseTimer}>pause</Button>
        <Button onClick={resetTimer}>reset</Button>
      </div>
    </div>
  );
};

export default App;
