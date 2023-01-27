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

exports.rankList = async (event: RankRequest) => {
  try {
    const res = await rankList(event);
    // return res;
    return JSON.stringify(res);
  } catch (e) {
    logger.error(e);
    return JSON.stringify({ status: 'err_unknown' });
  }
};

exports.characterInfo = async (event: CharacterInfoRequest) => {
  try {
    const res = await characterInfo(event);
    // return res;
    return JSON.stringify(res);
  } catch (e) {
    logger.error(e);
    return JSON.stringify({ status: 'err_unknown' });
  }
};
