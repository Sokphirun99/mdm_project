import morgan from 'morgan';

// Create a timestamp formatter for Cambodia timezone
export const getTimestamp = (): string => {
  const now = new Date();
  const khmTime = new Date(now.getTime() + (7 * 60 * 60 * 1000)); // UTC+7
  return khmTime.toISOString().replace('T', ' ').substring(0, 19) + ' +07';
};

// Enhanced console.log with timestamp
export const log = (...args: any[]) => {
  console.log(`[${getTimestamp()}]`, ...args);
};

export const error = (...args: any[]) => {
  console.error(`[${getTimestamp()}] ERROR:`, ...args);
};

export const warn = (...args: any[]) => {
  console.warn(`[${getTimestamp()}] WARN:`, ...args);
};

export const info = (...args: any[]) => {
  console.info(`[${getTimestamp()}] INFO:`, ...args);
};

// Custom Morgan format with Cambodia timezone
morgan.token('timestamp', () => getTimestamp());

export const morganFormat = ':timestamp :method :url :status :res[content-length] - :response-time ms';

export const morganCombined = ':timestamp :remote-addr - :remote-user ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"';

// Export a logger object for consistency
export const logger = {
  log,
  info,
  warn,
  error
};
