export interface RankRequest {
  type?: string,
  nickname?: string,
  period?: string,
  world?: string,
  job?: string,
  dojang?: string,
  grade?: string,
  offset?: number,
  limit?: number,
};

export interface CharacterInfoRequest {
  nickname: string,
  rank?: [{
    type: string,
    period?: string,
    world?: string,
    job?: string,
    dojang?: string,
    grade?: string,
  }],
  info?: [{
    type: string,
    progress?: {
      group?: string[],
      entry?: string[],
    },
    complete?: {
      group?: string[],
      entry?: string[],
    },
  }],
};
