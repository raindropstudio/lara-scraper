import { getCharacterInfo, getQuestDetail, getQuestGroupDetail, getRank } from "./controller";
import { INFOTYPE } from "./request/utils/characterInfoType";
import { RANKTYPE } from "./request/utils/ranktype";

interface CharacterInfoRequest {
  nickname: string,
  rank?: [{
    type: string,
    period?: string,
    world?: string,
    job?: string,
    dojang?: string,
    grade?: string,
    }],
  info?: [{
    type: string,
    progress?: {
      group?: string[],
      entry?: string[],
    },
    complete?: {
      group?: string[],
      entry?: string[],
    },
  }],
};

exports.characterInfo = async (event: CharacterInfoRequest) => {
  //? 캐릭터정보 URL
  let characterInfoUrl: string;
  try {
    const character = await getRank(RANKTYPE['total'], { nickname: event.nickname });
    characterInfoUrl = character.list[character.searchCharacter].characterInfoUrl;
  } catch (e) {
    console.log(e);
    return {
      status: 'error',
      message: e.message,
    };
  }

  const data: object = {};
  try {
    let rank, info;

    //? rank
    if (event.rank) {
      rank = Promise.all(event.rank.map(async (entry) => {
        return await getRank(RANKTYPE[entry.type], { nickname: event.nickname, ...entry });
      }));
    }

    //? info - quest와 questDetail의 경우 특별하게 처리해야함
    if (event.info) {
      const questType = {
        'progress': 'quest',
        'complete': 'questComplete',
      };
      const getDetail = {
        'group': getQuestGroupDetail,
        'entry': getQuestDetail,
      };
      info = Promise.all(event.info.map(async (entry) => {
        if (entry.type === 'questDetail') {
          let promise = [];
          for (const qtype in questType) {
            if (entry[qtype]) {
              const quest = await getCharacterInfo(INFOTYPE[questType[qtype]], characterInfoUrl);
              for (const dtype in getDetail) {
                if (entry[qtype][dtype]) {
                  promise = promise.concat(entry[qtype][dtype].map(async (item: string) => {
                    return await getDetail[dtype](INFOTYPE[questType[qtype]], item, quest);
                  }));
                }
              }
            }
          }
          return await Promise.all(promise);
        }
        return await getCharacterInfo(INFOTYPE[entry.type], characterInfoUrl);
      }));
    }

    if (event.rank) data['rank'] = await rank;
    if (event.info) data['info'] = await info;
  } catch (e) {
    console.log(e);
    return {
      status: 'error',
      message: e.message,
    };
  }

  return {
    status: 'success',
    data,
  }
};
