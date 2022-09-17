import { parseCharacterInfo } from "./parser/character";
import { parseRank } from "./parser/rank";
import { getCharacterInfo } from "./request/character";
import { getRank } from "./request/rank";
import { INFOTYPE } from "./request/utils/characterInfoType";
import { RANKTYPE } from "./request/utils/ranktype";

exports.characterInfo = async event => {
  const chtml = await getRank(RANKTYPE['Total'], { 'nickname': '소주에보드카' });
  const cdata = parseRank(RANKTYPE['Total'], chtml);
  const infotype = 'equipment';
  const html = await getCharacterInfo(INFOTYPE[infotype], cdata.list[cdata.searchCharacter].characterInfoUrl);
  const data = parseCharacterInfo(INFOTYPE[infotype], html);
  console.log(JSON.stringify(data, null, 2));
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
