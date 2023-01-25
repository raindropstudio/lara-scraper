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

export interface QuestDetail {
  type: 'questDetail',
  progress?: {
    group?: string[],
    entry?: string[],
  },
  complete?: {
    group?: string[],
    entry?: string[],
  },
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
  info?: [
    { type: string } | QuestDetail
  ],
};
