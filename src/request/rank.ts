import { reqMaple } from './utils/axiosConfig';
import { toUrlParam } from './utils/rankParam';
import { Option, RANKTYPE } from './utils/ranktype';

const RANKURL = {
  [RANKTYPE.Total]: 'https://maplestory.nexon.com/Ranking/World/Total',
  [RANKTYPE.Pop]: 'https://maplestory.nexon.com/Ranking/World/Pop',
  [RANKTYPE.Dojang]: 'https://maplestory.nexon.com/Ranking/World/Dojang',
  [RANKTYPE.Seed]: 'https://maplestory.nexon.com/Ranking/World/Seed',
  [RANKTYPE.Union]: 'https://maplestory.nexon.com/Ranking/Union',
}

// 무릉도장은 Dojang/thisWeek , Dojang/LastWeek 두 URL 사용

export const getRank = async (ranktype: RANKTYPE, option: Option) => {
  let url = RANKURL[ranktype];
  if(ranktype == RANKTYPE.Dojang) {
    url += option.period == 'thisWeek' ? '/thisWeek' : '/lastWeek';
  }
  url += '?' + toUrlParam(option);
  const { data: res } = await reqMaple(url);
  return res;
}
