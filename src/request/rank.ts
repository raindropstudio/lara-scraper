import axios from 'axios';
import { Option, RANKTYPE } from './ranktype';

const RANKURL = {
  [RANKTYPE.Total]: 'https://maplestory.nexon.com/Ranking/World/Total',
  [RANKTYPE.Pop]: 'https://maplestory.nexon.com/Ranking/World/Pop',
  [RANKTYPE.Dojang]: 'https://maplestory.nexon.com/Ranking/World/Dojang',
  [RANKTYPE.Seed]: 'https://maplestory.nexon.com/Ranking/World/Seed',
  [RANKTYPE.Union]: 'https://maplestory.nexon.com/Ranking/Union',
}

// 무릉도장은 Dojang/thisWeek , Dojang/LastWeek 두 URL 사용

export const getRankByNickname = async (ranktype: RANKTYPE, nickname: string, option) => {
  const encodedNickname = encodeURIComponent(nickname);
  const url = RANKURL[ranktype] + `?c=${encodedNickname}`;
  const res = await axios(url);
  return res.data;
}

export const getRankByPage = async (ranktype: RANKTYPE, page: number) => {
  const url = RANKURL[ranktype] + `?page=${page}`;
  const res = await axios(url);
  return res.data;
}

export const getRank = async (ranktype: RANKTYPE, option: Option) => {
  
}
