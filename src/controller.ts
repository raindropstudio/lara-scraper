import { parseCharacterInfo } from "./parser/character";
import { parseQuestDetail } from "./parser/info/questDetail";
import { parseRank } from "./parser/rank";
import { RankData } from "./parser/types/rankData";
import { reqCharacterInfo } from "./request/character";
import { reqQuestDetail } from "./request/quest";
import { reqRank } from "./request/rank";
import { INFOTYPE } from "./request/types/characterInfoType";
import { Option, RANKTYPE } from "./request/types/ranktype";
import { RankRequest } from "./requestType";

interface RankPage {
  searchCharacter: number,
  list: RankData[],
}

export const getRankPage = async (ranktype: RANKTYPE, option: Option) => {
  let html: string, parsed: RankPage;
  try {
    html = await reqRank(ranktype, option);
  } catch (e) {
    throw new Error(`Rank ${ranktype} request error`);
  }
  try {
    parsed = parseRank(ranktype, html);
  } catch (e) {
    throw new Error(`Rank ${ranktype} parse error`);
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
  const rankPages: RankPage[] = await Promise.all(promise);
  const list: RankData[] = rankPages.reduce((acc: RankData[], cur) => acc.concat(cur.list), []);
  const res = {
    searchCharacter: rankPages[0].searchCharacter ?? -1,
    list,
  }
  return res;
};

export const getCharacterInfo = async (infotype: INFOTYPE, url: string) => {
  let html: string, parsed: object;
  try {
    html = await reqCharacterInfo(infotype, url);
  } catch (e) {
    throw new Error(`CharacterInfo ${infotype} request error`);
  }
  try {
    parsed = parseCharacterInfo(infotype, html);
  } catch (e) {
    throw new Error(`CharacterInfo ${infotype} parse error`);
  }
  return parsed;
};

export const getQuestDetail = async (infotype: INFOTYPE, entry: string, questData: object) => {
  let html: string, parsed: object;
  try {
    html = await reqQuestDetail(entry, questData);
  } catch (e) {
    throw new Error(`QuestDetail ${entry} request error`);
  }
  try {
    parsed = parseQuestDetail(infotype, html);
  } catch (e) {
    throw new Error(`QuestDetail ${entry} parse error`);
  }
  return parsed;
};

export const getQuestGroupDetail = async (infotype: INFOTYPE, group: string, questData: object) => {
  let details: object;
  try {
    details = await Promise.all(Object.keys(questData[group]).map(async (questEntry: string) => {
      return await getQuestDetail(infotype, `${group}\t${questEntry}`, questData);
    }));
  } catch (e) {
    throw new Error(`QuestGroupDetail ${group} request error`);
  }

  return details;
};
