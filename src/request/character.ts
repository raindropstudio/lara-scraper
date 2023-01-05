import { INFOTYPE } from "./types/characterInfoType";
import { reqMaple } from "./utils/axiosConfig";

// /Common/Character/Detail/{캐릭터명}{INFOURL}?p={코드}
const COMMONURL = '/Common/Character/Detail/';
const INFOURL = {
  [INFOTYPE.common]: '',
  [INFOTYPE.ranking]: '/Ranking',
  [INFOTYPE.equipment]: '/Equipment',
  [INFOTYPE.inventory]: '/Inventory',
  [INFOTYPE.storage]: '/Storage',
  [INFOTYPE.collection]: '/Collection',
  [INFOTYPE.skill]: '/Skill',
  [INFOTYPE.riding]: '/Riding',
  [INFOTYPE.quest]: '/Quest',
  [INFOTYPE.questComplete]: '/Quest/Complete',
  [INFOTYPE.pet]: '/Pet',
  [INFOTYPE.guild]: '/Guild',
};

export const reqCharacterInfo = async (info: INFOTYPE, characterURL: string) => {
  const nickname = characterURL.split('?')[0].split('/').reverse()[0];
  const param = characterURL.split('?')[1];
  const url = COMMONURL + nickname + INFOURL[info] + '?' + param;
  const { data: res } = await reqMaple(url);
  return res;
}
