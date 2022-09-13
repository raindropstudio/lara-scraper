import * as cheerio from 'cheerio';
import { RANKTYPE } from '../request/utils/ranktype';

const parseCommon = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const rank = parseInt($('td:nth-child(1)>p:nth-child(1)').text().trim(), 10);
  const rankChange = parseInt($('td:nth-child(1)>p:nth-child(2)>span').text().trim(), 10);
  const characterImage = $('td:nth-child(2)>span>img:not(.bg)').attr('src') || '';
  const characterInfoUrl = $('td:nth-child(2)>dl>dt>a').attr('href') || '';
  const nickname = $('td:nth-child(2)>dl>dt>a').text().trim();
  const job = $('td:nth-child(2)>dl>dd').text().split('/')[1].trim();
  return {
    rank, rankChange, characterImage, characterInfoUrl, nickname, job
  };
}

const parseTotal = (ctx: cheerio.Element) => { // Total, Pop
  const $ = cheerio.load(ctx);
  const level = parseInt($('td:nth-child(3)').text().split('.')[1].trim(), 10);
  const exp = parseInt($('td:nth-child(4)').text().trim().replace(/,/g, ''), 10);
  const pop = parseInt($('td:nth-child(5)').text().trim(), 10);
  const guild = $('td:nth-child(6)').text().trim();
  return { level, exp, pop, guild };
}

const parseDojang = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const level = parseInt($('td:nth-child(3)').text().split('.')[1].trim(), 10);
  const floor = parseInt($('td:nth-child(4)').text().trim(), 10);
  const time = $('td:nth-child(5)').text().trim(); //TODO: 시간 파싱해야함?
  return { level, floor, time };
}

const parseSeed = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const level = parseInt($('td:nth-child(3)').text().split('.')[1].trim(), 10);
  const floor = parseInt($('td:nth-child(4)').text().trim(), 10);
  const time = $('td:nth-child(5)').text().trim();
  return { level, floor, time };
}

const parseUnion = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const unionLevel = parseInt($('td:nth-child(4)').text().trim().replace(/,/g, ''), 10);
  const unionPower = parseInt($('td:nth-child(5)').text().trim().replace(/,/g, ''), 10);
  return { unionLevel, unionPower };
}

const parseAchieve = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const archieveGrade = parseInt($('td:nth-child(4)').text().trim(), 10);
  const archievePoint = parseInt($('td:nth-child(5)').text().trim().replace(/,/g, ''), 10);
  return { archieveGrade, archievePoint };
}

interface RankData {
  rank: number;
  rankChange: number;
  characterImage: string;
  characterInfoUrl: string;
  nickname: string;
  job: string;
  level?: number;
  exp?: number;
  pop?: number;
  guild?: string;
  floor?: number;
  time?: string;
  unionLevel?: number;
  unionPower?: number;
  archieveGrade?: number;
  archievePoint?: number;
}

const PARSER = {
  [RANKTYPE['Total']]: parseTotal,
  [RANKTYPE['Pop']]: parseTotal,
  [RANKTYPE['Dojang']]: parseDojang,
  [RANKTYPE['Seed']]: parseSeed,
  [RANKTYPE['Union']]: parseUnion,
  [RANKTYPE['Achieve']]: parseAchieve
}

export const parseRank = (ranktype:RANKTYPE, html: string) => {
  const rankList: { searchCharacter: number, list: RankData[] } = {
    searchCharacter: -1,
    list: [],
  };
  const $ = cheerio.load(html);
  rankList.searchCharacter = $('table.rank_table>tbody>tr.search_com_chk').index();
  $('table.rank_table>tbody>tr').each((i, elem) => {
    const common = parseCommon(elem);
    const rankInfo = PARSER[ranktype](elem);
    rankList.list.push({ ...common, ...rankInfo });
  });
  return rankList;
}
