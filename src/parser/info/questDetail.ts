import * as cheerio from 'cheerio';
import { DateTime } from 'luxon';
import { INFOTYPE } from '../../request/types/characterInfoType';

const quest = (ctx: cheerio.CheerioAPI) => {
  return {
    reqLevel: ctx('p.warning').text().replace(/[^0-9]/g, ''),
    requirement: ctx('p.quest_item').html()?.trim().split('<br>').slice(0, -2).map(v => v.replace(/(<([^>]+)>)/ig, '').trim()) || [],
  }
}

const complete = (ctx: cheerio.CheerioAPI) => {
  const dateText = ctx('div.item_memo_sel').text().replace(' 완료', '');
  const date: DateTime = DateTime.fromFormat(dateText, 'yyyy년 MM월 dd일 HH시 mm분', { zone: 'Asia/Seoul' });
  return {
    completedAt: date,
  }
}

const PARSER = {
  [INFOTYPE['quest']]: quest,
  [INFOTYPE['questComplete']]: complete,
}

export const parseQuestDetail = (infotype: INFOTYPE, html: string) => {
  const $ = cheerio.load(html);
  const name = $('h1').text().trim();
  const npcImage = $('div.item_img > a > img').attr('src') || '';
  const info = $('div.quest_infomation').text().trim().replace(/\r/g, '');
  const detail = PARSER[infotype]($);

  return { name, npcImage, info, ...detail };
}
