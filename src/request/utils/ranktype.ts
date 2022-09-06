export const enum RANKTYPE {
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
  type?: string,
  grade?: string,
  page?: number,
}
