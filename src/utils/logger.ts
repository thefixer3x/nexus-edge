// src/utils/logger.ts
export class Logger {
  private static log(level: string, message: string, data?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    if (data) {
      console.log(logEntry, JSON.stringify(data));
    } else {
      console.log(logEntry);
    }
  }

  static info(message: string, data?: any) {
    Logger.log('INFO', message, data);
  }

  static warn(message: string, data?: any) {
    Logger.log('WARN', message, data);
  }

  static error(message: string, data?: any) {
    Logger.log('ERROR', message, data);
  }
}