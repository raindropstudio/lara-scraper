import { reqMaple } from './utils/axiosConfig';
import { toUrlParam } from './utils/rankParam';
import { Option, RANKTYPE } from './utils/ranktype';

const RANKURL = {
  [RANKTYPE.Total]: '/Ranking/World/Total',
  [RANKTYPE.Pop]: '/Ranking/World/Pop',
  [RANKTYPE.Dojang]: '/Ranking/World/Dojang',
  [RANKTYPE.Seed]: '/Ranking/World/Seed',
  [RANKTYPE.Union]: '/Ranking/Union',
  [RANKTYPE.Achieve]: '/Ranking/Achievement',
}

// 무릉도장은 Dojang/thisWeek , Dojang/LastWeek 두 URL 사용

export const getRank = async (ranktype: RANKTYPE, option: Option) => {
  let url = RANKURL[ranktype];
  if(ranktype == RANKTYPE.Dojang) {
    url += option.period == 'thisweek' ? '/ThisWeek' : '/LastWeek';
  }
  url += '?' + toUrlParam(option);
  const { data: res } = await reqMaple(url);
  return res;
}
