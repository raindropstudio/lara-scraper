import { Signale } from 'signale-logger';

export const Logger = new Signale({
  logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
});
