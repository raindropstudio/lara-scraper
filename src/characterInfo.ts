import { getCharacterInfo, getQuestDetail, getQuestGroupDetail, getRank } from "./controller";
import { INFOTYPE } from "./request/types/characterInfoType";
import { RANKTYPE } from "./request/types/ranktype";
import { ParseError, PrivateError, RequestError } from "./types/error";
import { CharacterInfoRequest, QuestDetail } from "./types/requestType";

const rankQuery = (event: CharacterInfoRequest) => {
  if (!event.rank) return [];
  const rankPromise = event.rank.map((entry) => {
    return getRank(RANKTYPE[entry.type], { nickname: event.nickname, ...entry });
  })

  return rankPromise;
};

const infoQuery = (event: CharacterInfoRequest, characterInfoUrl: string) => {
  if (!event.info) return [];

  const questDetail = async (query: QuestDetail) => {
    const questPromise = {};
    const quest = {
      progress: { entry: [{}], group: [{}] },
      complete: { entry: [{}], group: [{}] },
    };

    if (query.progress) {
      const questData = await getCharacterInfo(INFOTYPE.quest, characterInfoUrl);
      if (query.progress.entry) questPromise['progressEntry'] = query.progress.entry.map((item: string) => {
        return getQuestDetail(INFOTYPE.quest, item, questData);
      });
      if (query.progress.group) questPromise['progressGroup'] = query.progress.group.map((item: string) => {
        return getQuestGroupDetail(INFOTYPE.quest, item, questData);
      });
    }
    if (query.complete) {
      const questCompleteData = await getCharacterInfo(INFOTYPE.questComplete, characterInfoUrl);
      if (query.complete.entry) questPromise['completeEntry'] = query.complete.entry.map((item: string) => {
        return getQuestDetail(INFOTYPE.questComplete, item, questCompleteData);
      });
      if (query.complete.group) questPromise['completeGroup'] = query.complete.group.map((item: string) => {
        return getQuestGroupDetail(INFOTYPE.questComplete, item, questCompleteData);
      });
    }

    const getResult = async (promise: [{}], isGroup: boolean) => {
      const result = await Promise.allSettled(promise);
      return result.map((entry) => {
        if (entry.status === 'fulfilled') return entry.value;
        console.log(entry.reason);
        return isGroup ? [] : {};
      });
    }

    quest.progress.entry = await getResult(questPromise['progressEntry'] ?? [], false);
    quest.progress.group = await getResult(questPromise['progressGroup'] ?? [], true);
    quest.complete.entry = await getResult(questPromise['completeEntry'] ?? [], false);
    quest.complete.group = await getResult(questPromise['completeGroup'] ?? [], true);

    return quest;
  };

  const task = event.info.map((entry) => {
    if (entry.type === 'questDetail') return questDetail(entry as QuestDetail);
    return getCharacterInfo(INFOTYPE[entry.type], characterInfoUrl);
  });

  return task;
};

export const characterInfo = async (event: CharacterInfoRequest) => {
  //? 캐릭터정보 URL
  let characterInfoUrl: string;
  try {
    const character = await getRank(RANKTYPE['total'], { nickname: event.nickname });
    if (character.searchCharacter === -1)
      return { status: 'err_character_not_found' };
    characterInfoUrl = character.list[character.searchCharacter].characterInfoUrl;
  } catch (e) {
    console.log(e);
    return { status: 'err_character_find' };
  }

  try {
    const data: object = {};

    //? Rank
    if (event.rank) {
      const res = await Promise.allSettled(rankQuery(event));
      data['rank'] = res.map((entry) => {
        if (entry.status === 'fulfilled') return entry.value;
        console.log(entry.reason);
        switch (entry.reason.constructor) {
          case RequestError: return { error: 'err_request' };
          case ParseError: return { error: 'err_parse' };
          default: return { error: 'err_unknown' };
        };
      });
    }

    //? Info
    if (event.info) {
      const res = await Promise.allSettled(infoQuery(event, characterInfoUrl));
      data['info'] = res.map((entry) => {
        if (entry.status === 'fulfilled') return entry.value;
        console.log(entry.reason);
        switch (entry.reason.constructor) {
          case RequestError: return { error: 'err_request' };
          case ParseError: return { error: 'err_parse' };
          case PrivateError: return { error: 'err_private' };
          default: return { error: 'err_unknown' };
        };
      });
    }

    return {
      status: 'success',
      data,
    };
  } catch (e) {
    console.log(e);
    switch (e.constructor) {
      case RequestError: return { status: 'err_request' };
      case ParseError: return { status: 'err_parse' };
      default: return { status: 'err_unknown' };
    }
  }
};
