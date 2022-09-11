import * as cheerio from 'cheerio';
import { RANKTYPE } from '../request/utils/ranktype';

const parseCommon = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const rank = parseInt($('td:nth-child(1)>p:nth-child(1)').text().trim(), 10);
  const rankChange = parseInt($('td:nth-child(1)>p:nth-child(2)>span').text().trim(), 10);
  const characterImage = $('td:nth-child(2)>span>img:not(.bg)').attr('src');
  const characterInfoUrl = $('td:nth-child(2)>dl>dt>a').attr('href');
  const nickname = $('td:nth-child(2)>dl>dt>a').text().trim();
  const job = $('td:nth-child(2)>dl>dd').text().split('/')[1].trim();
  return {
    rank, rankChange, characterImage, characterInfoUrl, nickname, job
  };
}

const parseLevel = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const level = parseInt($('td:nth-child(3)').text().split('.')[1].trim(), 10);
  return { level };
}

const parseTotal = (ctx: cheerio.Element) => { // Total, Pop
  const $ = cheerio.load(ctx);
  const exp = parseInt($('td:nth-child(4)').text().trim().replace(/,/g, ''), 10);
  const pop = parseInt($('td:nth-child(5)').text().trim(), 10);
  const guild = $('td:nth-child(6)').text().trim();
  return { exp, pop, guild };
}

const parseDojang = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const floor = parseInt($('td:nth-child(4)').text().trim(), 10);
  const time = $('td:nth-child(5)').text().trim(); //TODO: 시간 파싱해야함?
  return { floor, time };
}

const parseSeed = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const floor = parseInt($('td:nth-child(4)').text().trim(), 10);
  const time = $('td:nth-child(5)').text().trim();
  return { floor, time };
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

export const parseRank = (ranktype:RANKTYPE, html: string) => {
  const rankList = {
    searchCharacter: -1,
    list: [{}],
  };
  const $ = cheerio.load(html);
  rankList.searchCharacter = $('table.rank_table>tbody>tr.search_com_chk').index();
  $('table.rank_table>tbody>tr').each((i, elem) => {
    const common = parseCommon(elem);
    let rankInfo = {};
    switch (ranktype) {
      case RANKTYPE.Total: case RANKTYPE.Pop: {
        const { level } = parseLevel(elem);
        const { exp, pop, guild } = parseTotal(elem);
        rankInfo = { level, exp, pop, guild };
        break;
      }
      case RANKTYPE.Dojang: {
        const { level } = parseLevel(elem);
        const { floor, time } = parseDojang(elem);
        rankInfo = { level, floor, time };
        break;
      }
      case RANKTYPE.Seed: {
        const { level } = parseLevel(elem);
        const { floor, time } = parseSeed(elem);
        rankInfo = { level, floor, time };
        break;
      }
      case RANKTYPE.Union: {
        const { unionLevel, unionPower } = parseUnion(elem);
        rankInfo = { unionLevel, unionPower };
        break;
      }
      case RANKTYPE.Achieve: {
        const { archieveGrade, archievePoint } = parseAchieve(elem);
        rankInfo = { archieveGrade, archievePoint };
        break;
      }
    }
    rankList.list.push({ ...common, ...rankInfo });
  });
  return rankList;
}
