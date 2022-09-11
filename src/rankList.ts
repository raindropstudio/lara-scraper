import { parseRank } from './parser/rank';
import { getRank } from './request/rank';
import { RANKTYPE } from './request/utils/ranktype';

exports.rankList = async event => {
  const ranktype = 'Dojang';
  const html = await getRank(RANKTYPE[ranktype], {
    'nickname': '진격캐넌',
    'period': 'thisweek',
    'type': '통달',
  });
  const data = parseRank(RANKTYPE[ranktype], html);
  console.log(JSON.stringify(data, null, 2));
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'test',
        input: event,
      },
      null,
      2
    ),
  };
};
