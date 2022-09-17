import { INFOTYPE } from "../request/utils/characterInfoType";
import { parseCommon } from "./info/common";
import { parseEquipment } from "./info/equipment";

const PARSER = {
  [INFOTYPE['common']]: parseCommon,
  [INFOTYPE['equipment']]: parseEquipment,
}

export const parseCharacterInfo = (infotype: INFOTYPE, html: string) => {
  return PARSER[infotype](html);
}
