import { parseRank } from './parser/commonRank';
import { getRank } from './request/rank';
import { RANKTYPE } from './request/utils/ranktype';

exports.rankList = async event => {
  const html = await getRank(RANKTYPE['Total'], {
    'nickname': '루델팡'
  });
  const data = parseRank(html);
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
