import { Option, RANKTYPE } from './types/ranktype';
import { reqMaple } from './utils/axiosConfig';
import { toUrlParam } from './utils/rankParam';

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
  let url = RANKURL[ranktype ?? RANKTYPE.total];
  if (ranktype == RANKTYPE.dojang) {
    // thisweek 명시 외에는 저번주로 간주
    url += option.period == 'thisweek' ? '/ThisWeek' : '/LastWeek';
    // dojang 입문 명시 외에는 통달로 간주
    if (option.dojang != '입문') option['dojang'] = '통달';
  }
  url += '?' + toUrlParam(option);
  const { data: res } = await reqMaple(url);
  return res;
}
