import { parseRank } from './parser/rank';
import { getRank } from './request/rank';
import { RANKTYPE } from './request/utils/ranktype';

exports.rankList = async (event: any) => {
  const html = await getRank(RANKTYPE[event.ranktype], event);
  const data = parseRank(RANKTYPE[event.ranktype], html);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'test',
        data,
      },
      null,
      2
    ),
  };
};
