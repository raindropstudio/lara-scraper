import { Signale } from "signale-logger";
import { parseCharacterInfo } from "./parser/character";
import { isPrivate } from "./parser/info/private";
import { parseQuestDetail } from "./parser/info/questDetail";
import { parseRank } from "./parser/rank";
import { RankData } from "./parser/types/rankData";
import { reqCharacterInfo } from "./request/character";
import { reqQuestDetail } from "./request/quest";
import { reqRank } from "./request/rank";
import { INFOTYPE } from "./request/types/characterInfoType";
import { Option, RANKTYPE } from "./request/types/ranktype";
import { ParseError, PrivateError, QuestNotFoundError, RequestError } from "./types/error";
import { RankRequest } from "./types/requestType";

const logger = new Signale({ scope: 'Controller' });

interface RankPage {
  searchCharacter: number,
  list: RankData[],
}

export const getRankPage = async (ranktype: RANKTYPE, option: Option) => {
  let html: string, parsed: RankPage;
  try {
    html = await reqRank(ranktype, option);
  } catch (e) {
    logger.error({ prefix: '[getRankPage:Req]', message: e });
    throw new RequestError(`Rank ${ranktype} request error`);
  }
  try {
    parsed = parseRank(ranktype, html);
  } catch (e) {
    logger.error({ prefix: '[getRankPage:Parse]', message: e });
    logger.debug(html);
    throw new ParseError(`Rank ${ranktype} parse error`);
  }
  return parsed;
}

export const getRank = async (ranktype: RANKTYPE, param: RankRequest) => {
  let promise: Array<Promise<RankPage>> = [];
  if (param.nickname) promise.push(getRankPage(ranktype, param));
  else {
    const start = param.offset ?? 1;
    const end = start + (param.limit ?? 1);
    for (let page = start; page < end; page += 1) {
      const { offset, limit, ...option } = { ...param, page };
      promise.push(getRankPage(ranktype, option));
    }
  }

  const res = await Promise.allSettled(promise);

  const rankPages = res.map((item) => {
    if (item.status === 'fulfilled') return item.value;
    throw item.reason; //TODO: Retry
  });

  const list: RankData[] = rankPages.reduce((acc: RankData[], cur) => acc.concat(cur.list), []);
  return {
    searchCharacter: rankPages[0].searchCharacter ?? -1,
    list,
  };
};

export const getCharacterInfo = async (infotype: INFOTYPE, url: string) => {
  let html: string, parsed: object;
  try {
    html = await reqCharacterInfo(infotype, url);
  } catch (e) {
    logger.error({ prefix: '[getCharacterInfo:Req]', message: e });
    throw new RequestError(`CharacterInfo ${infotype} request error`);
  }
  if (isPrivate(html)) throw new PrivateError(`CharacterInfo ${infotype} is private`);
  try {
    parsed = parseCharacterInfo(infotype, html);
  } catch (e) {
    logger.error({ prefix: '[getCharacterInfo:Parse]', message: e });
    logger.debug(html);
    throw new ParseError(`CharacterInfo ${infotype} parse error`);
  }
  return parsed;
};

export const getQuestDetail = async (infotype: INFOTYPE, entry: string, questData: object) => {
  let html: string, parsed: any;
  try {
    html = await reqQuestDetail(entry, questData);
  } catch (e) {
    logger.error({ prefix: '[getQuestDetail:Req]', message: e });
    if (e instanceof QuestNotFoundError) throw e;
    throw new RequestError(`QuestDetail ${entry} request error`);
  }
  try {
    parsed = parseQuestDetail(infotype, html);
  } catch (e) {
    logger.error({ prefix: '[getQuestDetail:Parse]', message: e });
    logger.debug(html);
    throw new ParseError(`QuestDetail ${entry} parse error`);
  }
  return parsed;
};

export const getQuestGroupDetail = async (infotype: INFOTYPE, group: string, questData: object) => {
  if (questData?.[group] === undefined)
    throw new QuestNotFoundError(`QuestGroup ${group} not found`);

  const quests = Object.keys(questData[group]).map((questEntry: string) => {
    return getQuestDetail(infotype, `${group}\t${questEntry}`, questData);
  });
  const res = await Promise.allSettled(quests);

  const details = res.map((item) => {
    if (item.status === 'fulfilled') return item.value;
    throw item.reason; //TODO: Retry
  });

  return details;
};
