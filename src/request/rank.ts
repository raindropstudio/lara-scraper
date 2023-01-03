import { reqMaple } from './utils/axiosConfig';
import { toUrlParam } from './utils/rankParam';
import { Option, RANKTYPE } from './utils/ranktype';

const RANKURL = {
  [RANKTYPE.total]: '/Ranking/World/Total',
  [RANKTYPE.pop]: '/Ranking/World/Pop',
  [RANKTYPE.dojang]: '/Ranking/World/Dojang',
  [RANKTYPE.seed]: '/Ranking/World/Seed',
  [RANKTYPE.union]: '/Ranking/Union',
  [RANKTYPE.achieve]: '/Ranking/Achievement',
}

// 무릉도장은 Dojang/thisWeek , Dojang/LastWeek 두 URL 사용

export const reqRank = async (ranktype: RANKTYPE, option: Option) => {
  let url = RANKURL[ranktype];
  if(ranktype == RANKTYPE.dojang) {
    url += option.period == 'thisweek' ? '/ThisWeek' : '/LastWeek';
  }
  url += '?' + toUrlParam(option);
  const { data: res } = await reqMaple(url);
  return res;
}
