import * as cheerio from 'cheerio';

const parseEquip = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const equipList: object[] = [];
  $('ul.item_pot > li').each((i, elem) => {
    const name = $(elem).find('img').attr('alt') || '';
    const image = $(elem).find('img').attr('src') || '';
    const detailUrl = $(elem).find('span > a').attr('href') || '';
    equipList.push({ name, image, detailUrl });
  });
  const equip = {
    ring1: equipList[0],
    cap: equipList[2],
    emblem: equipList[4],
    ring2: equipList[5],
    pendant1: equipList[6],
    forehead: equipList[7],
    badge: equipList[9],
    ring3: equipList[10],
    pendant2: equipList[11],
    eyeacc: equipList[12],
    earacc: equipList[13],
    medal: equipList[14],
    ring4: equipList[15],
    weapon: equipList[16],
    clothes: equipList[17],
    shoulder: equipList[18],
    subWeapon: equipList[19],
    poket: equipList[20],
    belt: equipList[21],
    pants: equipList[22],
    gloves: equipList[23],
    cape: equipList[24],
    shoes: equipList[27],
    android: equipList[28],
    heart: equipList[29],
  }
  return equip;
}

const parseCashEquip = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const equipList: object[] = [];
  $('ul.item_pot > li').each((i, elem) => {
    const name = $(elem).find('img').attr('alt') || '';
    const image = $(elem).find('img').attr('src') || '';
    const detailUrl = $(elem).find('span > a').attr('href') || '';
    equipList.push({ name, image, detailUrl });
  });
  const equip = {
    ring1: equipList[0],
    cap: equipList[2],
    hair: equipList[4],
    ring2: equipList[5],
    forehead: equipList[7],
    face: equipList[9],
    ring3: equipList[10],
    eyeacc: equipList[12],
    earacc: equipList[13],
    ring4: equipList[15],
    weapon: equipList[16],
    cloths: equipList[17],
    subWeapon: equipList[19],
    pants: equipList[22],
    gloves: equipList[23],
    cape: equipList[24],
    shoes: equipList[27],
  }
  return equip;
}

const parseArcane = (ctx: cheerio.Element) => {
  const $ = cheerio.load(ctx);
  const arcaneList: object[] = [];
  $('ul.item_pot > li').each((i, elem) => {
    const name = $(elem).find('img').attr('alt') || '';
    const image = $(elem).find('img').attr('src') || '';
    const detailUrl = $(elem).find('span > a').attr('href') || '';
    arcaneList.push({ name, image, detailUrl });
  });
  const arcane = {
    force: parseInt($('div.arcane_weapon_wrap > span').text().replace(/[^0-9]/g, '')),
    arcane1: arcaneList[0],
    arcane2: arcaneList[1],
    arcane3: arcaneList[2],
    arcane4: arcaneList[3],
    arcane5: arcaneList[4],
    arcane6: arcaneList[5],
  }
  return arcane;
}

export const parseEquipment = (html: string) => {
  const $ = cheerio.load(html);
  const equip = parseEquip($('div.tab01_con_wrap')[0]);
  const cashEquip = parseCashEquip($('div.tab02_con_wrap')[0]);
  const arcane = parseArcane($('div.tab03_con_wrap')[0]);
  return { equip, cashEquip, arcane };
}
