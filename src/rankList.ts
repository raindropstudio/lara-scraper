import { parseRank } from './parser/rank';
import { getRank } from './request/rank';
import { RANKTYPE } from './request/utils/ranktype';

interface RankRequest {
  ranktype: "dojang" | "seed",
  period?: "thisweek" | "lastweek", // 없을시 기본 lastweek
  type?: "입문" | "통달", // 무릉만, 없을시 기본 통달
  offset: number,
  limit: number,
};

exports.rankList = async (event: RankRequest) => {
  let html, parsed;
  try {
    html = await getRank(RANKTYPE[event.ranktype], event);
  } catch (e) {
    console.log(e);
    return { status: "error", message: "request error" };
  }
  try {
    parsed = parseRank(RANKTYPE[event.ranktype], html);
  } catch (e) {
    console.log(e);
    return { status: "error", message: "parse error" };
  }
  const data = JSON.stringify(parsed, null, 2);
  return { status: "success", data };
};
