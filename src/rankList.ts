import { Signale } from 'signale-logger';
import { getRank } from './controller';
import { RANKTYPE } from './request/types/ranktype';
import { ParseError, RequestError } from './types/error';
import { RankRequest } from './types/requestType';

const logger = new Signale({ scope: 'Rank List' });

export const rankList = async (event: RankRequest) => {
  try {
    const data = await getRank(RANKTYPE[event.type || 'total'], event);
    return {
      status: 'success',
      data,
    };
  } catch (e) {
    logger.error(e);
    switch (e.constructor) {
      case RequestError: return { status: 'err_request' };
      case ParseError: return { status: 'err_parse' };
      default: return { status: 'err_unknown' };
    };
  };
};
