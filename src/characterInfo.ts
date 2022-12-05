import { parseCharacterInfo } from "./parser/character";
import { parseQuestDetail } from "./parser/info/questDetail";
import { parseRank } from "./parser/rank";
import { getCharacterInfo } from "./request/character";
import { getQuestDetail } from "./request/quest";
import { getRank } from "./request/rank";
import { INFOTYPE } from "./request/utils/characterInfoType";
import { RANKTYPE } from "./request/utils/ranktype";

interface CharacterInfoRequest {
  nickname: string,
  rank: [],
  info: [],
};

exports.characterInfo = async (event: CharacterInfoRequest) => {
  const chtml = await getRank(RANKTYPE['Total'], { 'nickname': '소주에보드카' });
  const cdata = parseRank(RANKTYPE['Total'], chtml);
  const infotype = 'quest';
  const html = await getCharacterInfo(INFOTYPE[infotype], cdata.list[cdata.searchCharacter].characterInfoUrl);
  const data = parseCharacterInfo(INFOTYPE[infotype], html);
  const qhtml = await getQuestDetail('제네시스 무기\t[제네시스 무기] 폭군 매그너스의 흔적', data);
  // const qhtml = await getQuestDetail('셀라스, 별이 잠긴 곳\t[셀라스] 노력한다면 인정해줄지도', data);
  const qdata = parseQuestDetail(INFOTYPE[infotype], qhtml);
  console.log(JSON.stringify(qdata, null, 2));
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
