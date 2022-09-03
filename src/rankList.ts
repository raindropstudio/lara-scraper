import { getRankByNickname } from './request/rank';
import { RANKTYPE } from './request/ranktype';

exports.rankList = async event => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: await getRankByNickname(RANKTYPE['Total'], '소주에보드카'),
        input: event,
      },
      null,
      2
    ),
  };
};
