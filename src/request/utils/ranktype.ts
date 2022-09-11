export enum RANKTYPE {
  Total = 'Total',
  Pop = 'Pop',
  Dojang = 'Dojang',
  Seed = 'Seed',
  Union = 'Union',
  Achieve = 'Achieve',
}

export type Option = {
  nickname?: string,
  world?: string,
  job?: string,
  period?: string,
  type?: string, // 무릉도장 구간, 입문 0 통달 2
  grade?: string, // 업적 등급
  page?: number,
}
