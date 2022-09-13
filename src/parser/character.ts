import { INFOTYPE } from "../request/utils/characterInfoType";
import { parseCommon } from "./info/common";

const PARSER = {
  [INFOTYPE['common']]: parseCommon,
}

export const parseCharacterInfo = (infotype: INFOTYPE, html: string) => {
  return PARSER[infotype](html);
}
