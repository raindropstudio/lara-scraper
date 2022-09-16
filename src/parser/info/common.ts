import * as cheerio from "cheerio";

const parseBasic = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const basic = {
    world: $('tbody > tr:nth-child(1) > td:nth-child(2) > span').text(),
    job: $('tbody > tr:nth-child(1) > td:nth-child(4) > span').text(),
    pop: parseInt($('tbody > tr:nth-child(2) > td:nth-child(2) > span').text(), 10),
    guild: $('tbody > tr:nth-child(2) > td:nth-child(4) > span').text(),
    meso: parseInt($('tbody > tr:nth-child(3) > td:nth-child(2) > span').text().replace(/,/g, ''), 10),
    maplepoint: parseInt($('tbody > tr:nth-child(3) > td:nth-child(4) > span').text().replace(/,/g, ''), 10),
  }
  return basic;
}

const parseStat = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const statValue: string[] = [];
  $('tbody > tr').each((i, elem) => {
    statValue.push($(elem).find('td:nth-child(2) > span').text().replace(/[,%]/g, '').trim());
    statValue.push($(elem).find('td:nth-child(4) > span').text().replace(/[,%]/g, '').trim());
  });
  const stat = {
    statAttackMin: parseInt(statValue[0].split('~')[0], 10),
    statAttackMax: parseInt(statValue[0].split('~')[1], 10),
    HP: parseInt(statValue[1], 10),
    MP: parseInt(statValue[2], 10),
    STR: parseInt(statValue[3], 10),
    DEX: parseInt(statValue[4], 10),
    INT: parseInt(statValue[5], 10),
    LUK: parseInt(statValue[6], 10),
    critDamage: parseInt(statValue[7], 10),
    bossDamage: parseInt(statValue[8], 10),
    ignoreDef: parseInt(statValue[9], 10),
    statusResist: parseInt(statValue[10], 10), // 상태이상 내성
    stance: parseInt(statValue[11], 10),
    defense: parseInt(statValue[12], 10),
    speed: parseInt(statValue[13], 10),
    jump: parseInt(statValue[14], 10),
    starForce: parseInt(statValue[15], 10),
    honorExp: parseInt(statValue[16], 10),
    arcaneForce: parseInt(statValue[17], 10),
    ability: $('tbody > tr:nth-child(10) > td > span').html()?.split('<br>').slice(0, -1) || [], // 마지막 br 이후 빈 배열 제거
    hyperStat: $('tbody > tr:nth-child(11) > td > span').html()?.split('<br>').slice(0, -1) || [],
  }
  return stat;
}

// 성향
const parseTendency = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const tendencyDetail: {
    level: number,
    todayPoint: number,
    todayMaxPoint: number,
    effect: string[],
  }[] = [];
  $('ul.dispo_list > li').each((i, elem) => {
    const effect: string[] = [];
    $(elem).find('div.total_effect_wrap > ul > li').each((i, elem) => { effect.push($(elem).text().trim()) });
    tendencyDetail.push({
      level: parseInt($(elem).find('div.lv > span').text(), 10),
      todayPoint: parseInt($(elem).find('div.today_point_count').text().split('/')[0].replace(/,/g, ''), 10),
      todayMaxPoint: parseInt($(elem).find('div.today_point_count').text().split('/')[1].replace(/,/g, ''), 10),
      effect: effect.filter((v) => v !== '' && v !== '-'),
    });
  });
  const tendency = {
    ambition: tendencyDetail[0], // 카리스마
    insight: tendencyDetail[1], // 통찰력
    willpower: tendencyDetail[2], // 의지
    diligence: tendencyDetail[3].effect.slice(0, -1), // 손재주 / 아래 주문서 효과는 제외 삭제
    empathy: tendencyDetail[4], // 감성
    charm: tendencyDetail[5], // 매력
  }
  return tendency;
}

const parseMarry = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  return $('tbody > tr > td > span').text() === '-' ? '' : $('tbody > tr > td > span').text();
}

const parseFarm = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const farm = {
    farmName: $('tbody > tr:nth-child(1) > td:nth-child(2) > span').text(),
    farmLevel: parseInt($('tbody > tr:nth-child(1) > td:nth-child(4) > span').text().replace(/,/g, ''), 10),
    waru: parseInt($('tbody > tr:nth-child(2) > td:nth-child(2) > span').text().replace(/,/g, ''), 10),
    clover: parseInt($('tbody > tr:nth-child(2) > td:nth-child(4) > span').text().replace(/,/g, ''), 10),
    gem: parseInt($('tbody > tr:nth-child(3) > td:nth-child(2) > span').text().replace(/,/g, ''), 10),
  }
  return farm;
}

export const parseCommon = (html: string) => {
  const $ = cheerio.load(html);
  const level = parseInt($('#wrap > div.center_wrap > div.char_info_top > div.char_info > dl:nth-child(1) > dd').text().split('.')[1].trim(), 10);
  const exp = parseInt($('#wrap > div.center_wrap > div.char_info_top > div.char_info > div.level_data > span:nth-child(1)').text().replace(/[^0-9]/g, ''), 10);
  const container = $('#container > div.con_wrap > div.contents_wrap > div.container_wrap');
  const basic = parseBasic($(container).find('div.tab01_con_wrap > table.table_style01')[0]);
  const stat = parseStat($(container).find('div.tab01_con_wrap > table.table_style01')[0]);
  const tendency = parseTendency($(container).find('div.tab02_con_wrap > div.dispo_wrap')[0]);
  const marry = parseMarry($(container).find('div.tab03_con_wrap > table.table_style01')[0]);
  const farm = parseFarm($(container).find('div.tab03_con_wrap > table.table_style01')[0]);
  return { level, exp, basic, stat, dispo: tendency, marry, farm };
}
