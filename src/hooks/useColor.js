
export default function useColor({
  mode,
  workDuration,
  breakDuration,
  currentDuration,
  startTimestamp,
  isRun,
}) {
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
  return bgColor;
}
