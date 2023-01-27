import { Signale } from 'signale-logger';
import { characterInfo } from "./characterInfo";
import { rankList } from "./rankList";
import { CharacterInfoRequest, RankRequest } from "./types/requestType";

const logger = new Signale({ scope: 'handler' });

process.on('uncaughtException', (err) => {
  logger.fatal('uncaughtException');
  logger.fatal(err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.fatal('unhandledRejection: ' + promise);
  logger.fatal(reason);
});

export const handler = async (event: CharacterInfoRequest | RankRequest) => {
  try {
    let res = {};
    if (event.nickname) {
      // TODO: 입력 검증
      res = await characterInfo(event as CharacterInfoRequest);
    }
    else {
      // TODO: 입력 검증
      res = await rankList(event as RankRequest);
    };
    // return res;
    return JSON.stringify(res);
  } catch (e) {
    logger.error(e);
    return JSON.stringify({ status: 'err_unknown' });
  }
};
