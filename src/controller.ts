import { parseCharacterInfo } from "./parser/character";
import { parseQuestDetail } from "./parser/info/questDetail";
import { parseRank } from "./parser/rank";
import { reqCharacterInfo } from "./request/character";
import { reqQuestDetail } from "./request/quest";
import { reqRank } from "./request/rank";
import { INFOTYPE } from "./request/utils/characterInfoType";
import { Option, RANKTYPE } from "./request/utils/ranktype";

export const getRank = async (ranktype: RANKTYPE, option: Option) => {
  let html: string, parsed: { list: object, searchCharacter: number };
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
