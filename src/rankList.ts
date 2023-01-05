import { getRank } from './controller';
import { RANKTYPE } from './request/types/ranktype';
import { RankRequest } from './requestType';

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
