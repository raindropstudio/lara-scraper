import axios from 'axios';
import { RANKTYPE } from './ranktype';

const RANKURL = {
  [RANKTYPE.TOTAL]: 'https://maplestory.nexon.com/Ranking/World/Total',
  [RANKTYPE.POP]: 'https://maplestory.nexon.com/Ranking/World/Pop',
  [RANKTYPE.DOJANG]: 'https://maplestory.nexon.com/Ranking/World/Dojang',
  [RANKTYPE.SEED]: 'https://maplestory.nexon.com/Ranking/World/Seed',
  [RANKTYPE.UNION]: 'https://maplestory.nexon.com/Ranking/Union',
}

export const getRankByNickname = async (ranktype: RANKTYPE, nickname: string) => {
  const encodedNickname = encodeURIComponent(nickname);
  const url = RANKURL[ranktype] + `?c=${encodedNickname}`;
  const res = await axios(url);
  return res.data;
}

export const getRankByPage = async (ranktype: RANKTYPE, page: Number) => {
  const url = RANKURL[ranktype] + `?page=${page}`;
  const res = await axios(url);
  return res.data;
}