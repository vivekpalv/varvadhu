import os from "os";

export const getSystemInfo = () => {
  return {
    hostname: os.hostname(),
    platform: os.platform(),
    arch: os.arch(),
    osType: os.type(),
    release: os.release(),
    uptime: os.uptime(), // in seconds
    totalMemoryMB: (os.totalmem() / (1024 * 1024)),
    freeMemoryMB: (os.freemem() / (1024 * 1024)),
    cpuCores: os.cpus().length,
    cpuModel: os.cpus()[0].model,
    userInfo: os.userInfo(),
  };
};

export const getNetworkInterfaces = () => {
  return os.networkInterfaces();
};

export const getLoadAverage = () => {
  return os.loadavg(); // [1min, 5min, 15min] average CPU load
};