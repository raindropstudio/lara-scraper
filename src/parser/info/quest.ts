import * as cheerio from 'cheerio';

export const parseQuest = (html: string) => {
  const $ = cheerio.load(html);
  const quest: object = {};
  $('div.quest_list_wrap').each((i, elem) => {
    const groupName = $(elem).find('h1').text().split('(')[0].trim();
    const questList: object = {};
    $(elem).find('div.quest_list > ul > li').each((i, elem) => {
      const questName = $(elem).find('a').text().trim();
      const detailUrl = $(elem).find('a').attr('href') || '';
      questList[questName] = { detailUrl };
    });
    quest[groupName] = questList;
  });
  return quest;
}
