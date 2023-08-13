/**
 * Returns a function that can be called to get the time in nanoseconds since the timer was started.
 *
 * const getDuration = getDurationTimer();
 * const duration = getDuration();
 */
export const getDurationTimer = (): (() => number) => {
  const start = process.hrtime.bigint();

  return () => {
    const end = process.hrtime.bigint();
    return Number(end - start);
  };
};

export const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
