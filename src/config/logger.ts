import { createLogger, format, transports } from 'winston';
import  DailyRotateFile  from 'winston-daily-rotate-file';

const logFormat = format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
);

const logger = createLogger({
    level: 'debug',
    format: logFormat,
    defaultMeta: { service: 'gtc-embassy-backend' },
    transports: [
        new transports.Console(),
        new DailyRotateFile({
            filename: 'logs/application-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    ],
});

export default logger;
