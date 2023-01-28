import { getCharacterInfo, getQuestDetail, getQuestGroupDetail, getRank } from "./controller";
import { INFOTYPE } from "./request/types/characterInfoType";
import { RANKTYPE } from "./request/types/ranktype";
import { ParseError, PrivateError, RequestError } from "./types/error";
import { CharacterInfoRequest, QuestDetail } from "./types/requestType";
import { Logger } from "./utils/logger";

const logger = Logger.scope('Character Info');

let errorCount = 0;

const rankQuery = (event: CharacterInfoRequest) => {
  if (!event.rank) return [];
  const rankPromise = event.rank.map((entry) => {
    return getRank(RANKTYPE[entry.type], { nickname: event.nickname, ...entry });
  })

  return rankPromise;
};

const questDetail = async (query: QuestDetail, characterInfoUrl: string, questData: object, questCompleteData: object) => {
  const questPromise = {};

  questPromise['progressEntry'] = query.progress?.entry?.map((item: string) => {
    return getQuestDetail(INFOTYPE.quest, item, questData);
  });
  questPromise['progressGroup'] = query.progress?.group?.map((item: string) => {
    return getQuestGroupDetail(INFOTYPE.quest, item, questData);
  });
  questPromise['completeEntry'] = query.complete?.entry?.map((item: string) => {
    return getQuestDetail(INFOTYPE.questComplete, item, questCompleteData);
  });
  questPromise['completeGroup'] = query.complete?.group?.map((item: string) => {
    return getQuestGroupDetail(INFOTYPE.questComplete, item, questCompleteData);
  });

  const getResult = async (promise: [{}], isGroup: boolean) => {
    const result = await Promise.allSettled(promise);
    return result.map((entry) => {
      if (entry.status === 'fulfilled') return entry.value;
      logger.error(entry.reason);
      return isGroup ? [] : {};
    });
  }

  const [progressEntry, progressGroup, completeEntry, completeGroup] = await Promise.all([
    getResult(questPromise['progressEntry'] ?? [], false),
    getResult(questPromise['progressGroup'] ?? [], true),
    getResult(questPromise['completeEntry'] ?? [], false),
    getResult(questPromise['completeGroup'] ?? [], true),
  ]);

  const quest = {
    progress: {
      entry: progressEntry,
      group: progressGroup,
    },
    complete: {
      entry: completeEntry,
      group: completeGroup,
    },
  };

  return quest;
};

const infoQuery = (event: CharacterInfoRequest, characterInfoUrl: string) => {
  if (!event.info) return [];
  let questDataPromise: Promise<{}>, questCompleteDataPromise: Promise<{}>;

  if (event.info.some((entry) => entry.type === 'questDetail')) {
    questDataPromise = getCharacterInfo(INFOTYPE.quest, characterInfoUrl);
    questCompleteDataPromise = getCharacterInfo(INFOTYPE.questComplete, characterInfoUrl);
  };

  const task = event.info.map(async (entry) => {
    if (entry.type === 'quest') return questDataPromise;
    if (entry.type === 'questComplete') return questCompleteDataPromise;
    if (entry.type === 'questDetail') {
      const questData = await questDataPromise;
      const questCompleteData = await questCompleteDataPromise;
      return questDetail(entry as QuestDetail, characterInfoUrl, questData, questCompleteData);
    };
    return getCharacterInfo(INFOTYPE[entry.type], characterInfoUrl);
  });

  return task;
};

export const characterInfo = async (event: CharacterInfoRequest) => {
  errorCount = 0;

  //? 캐릭터정보 URL
  let characterInfoUrl: string;
  try {
    const character = await getRank(RANKTYPE['total'], { nickname: event.nickname });
    if (character.searchCharacter === -1)
      return { status: 'err_character_not_found' };
    characterInfoUrl = character.list[character.searchCharacter].characterInfoUrl;
  } catch (e) {
    logger.error(e);
    return { status: 'err_character_find' };
  }

  try {
    const data = {};
    const rankPromise = Promise.allSettled(rankQuery(event));
    const infoPromise = Promise.allSettled(infoQuery(event, characterInfoUrl));

    //? Rank
    if (event.rank) {
      const res = await rankPromise;
      data['rank'] = res.map((entry) => {
        if (entry.status === 'fulfilled') return entry.value;
        errorCount++;
        logger.error(entry.reason);
        switch (entry.reason.constructor) {
          case RequestError: return { error: 'err_request' };
          case ParseError: return { error: 'err_parse' };
          default: return { error: 'err_unknown' };
        };
      });
    }

    //? Info
    if (event.info) {
      const res = await infoPromise;
      data['info'] = res.map((entry) => {
        if (entry.status === 'fulfilled') return entry.value;
        errorCount++;
        if (entry.reason instanceof PrivateError) {
          logger.info(entry.reason.message);
          return { error: 'err_private' };
        };
        logger.error(entry.reason);
        switch (entry.reason.constructor) {
          case RequestError: return { error: 'err_request' };
          case ParseError: return { error: 'err_parse' };
          default: return { error: 'err_unknown' };
        };
      });
    }

    if(errorCount) logger.warn(`Total ${errorCount} request(s) failed`);

    return {
      status: errorCount ? 'warn_partial_fail' : 'success',
      data,
    };
  } catch (e) {
    logger.error(e);
    switch (e.constructor) {
      case RequestError: return { status: 'err_request' };
      case ParseError: return { status: 'err_parse' };
      default: return { status: 'err_unknown' };
    }
  }
};
