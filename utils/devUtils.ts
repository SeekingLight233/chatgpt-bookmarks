function createThrottleLog() {
  let lastLogTime = 0;

  return function (...args) {
    const now = Date.now();
    if (now - lastLogTime > 1000) {
      console.log(...args);
      lastLogTime = now;
    }
  };
}

export const throttleLog = createThrottleLog();
