export enum RANKTYPE {
  total = 'total',
  pop = 'pop',
  dojang = 'dojang',
  seed = 'seed',
  union = 'union',
  achieve = 'achieve',
}

export type Option = {
  nickname?: string,
  world?: string,
  job?: string,
  period?: string,
  dojang?: string, // 무릉도장 구간, 입문 0 통달 2
  grade?: string, // 업적 등급
  page?: number,
}
