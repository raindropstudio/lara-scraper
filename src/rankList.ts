import { getRank } from './controller';
import { RANKTYPE } from './request/utils/ranktype';

interface RankRequest {
  type: string,
  period?: string,
  world?: string,
  job?: string,
  dojang?: string,
  grade?: string,
  offset: number,
  limit: number,
};

exports.rankList = async (event: RankRequest) => {
  let res: object;
  try {
    res = await getRank(RANKTYPE[event.type], event);
  } catch (e) {
    return JSON.stringify({
      status: 'error',
      message: e.message,
    });
  }
  return JSON.stringify({
    status: 'success',
    data: res,
  });
};
