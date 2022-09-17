import { INFOTYPE } from "../request/utils/characterInfoType";
import { parseCommon } from "./info/common";
import { parseEquipment } from "./info/equipment";
import { parseQuest } from "./info/quest";

const PARSER = {
  [INFOTYPE['common']]: parseCommon,
  [INFOTYPE['equipment']]: parseEquipment,
  [INFOTYPE['quest']]: parseQuest,
  [INFOTYPE['questComplete']]: parseQuest,
}

export const parseCharacterInfo = (infotype: INFOTYPE, html: string) => {
  return PARSER[infotype](html);
}
