import { parseCharacterInfo } from "./parser/character";
import { parseRank } from "./parser/rank";
import { getCharacterInfo } from "./request/character";
import { getQuestGroupDetail } from "./request/quest";
import { getRank } from "./request/rank";
import { INFOTYPE } from "./request/utils/characterInfoType";
import { RANKTYPE } from "./request/utils/ranktype";

exports.characterInfo = async event => {
  const chtml = await getRank(RANKTYPE['Total'], { 'nickname': '소주에보드카' });
  const cdata = parseRank(RANKTYPE['Total'], chtml);
  const infotype = 'questComplete';
  const html = await getCharacterInfo(INFOTYPE[infotype], cdata.list[cdata.searchCharacter].characterInfoUrl);
  const data = parseCharacterInfo(INFOTYPE[infotype], html);
  console.time('getQuestGroupDetail');
  const qhtml = await getQuestGroupDetail('캐시', data);
  console.timeEnd('getQuestGroupDetail');
  // console.log(JSON.stringify(qhtml, null, 2));
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'characterInfo',
        input: event,
      },
      null,
      2
    ),
  };
};
