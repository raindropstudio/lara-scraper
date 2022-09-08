import * as cheerio from 'cheerio';

export const parseRank = (html: string) => {
  const rankList = {
    searchCharacter: -1,
    list: [{}],
  };
  const $ = cheerio.load(html);
  //TODO: 검색한 캐릭터의 배열 번호를 searchCharacter에 저장
  $('table.rank_table>tbody>tr').each((i, elem) => {
    const rank = $(elem).find('td:nth-child(1)>p:nth-child(1)').text().trim();
    const rankChange = $(elem).find('td:nth-child(1)>p:nth-child(2)>span').text().trim();
    const characterImage = $(elem).find('td:nth-child(2)>span>img:not(.bg)').attr('src');
    const characterInfoUrl = $(elem).find('td:nth-child(2)>dl>dt>a').attr('href');
    const nickname = $(elem).find('td:nth-child(2)>dl>dt>a').text().trim();
    const job = $(elem).find('td:nth-child(2)>dl>dd').text().trim(); //TODO: 뒤쪽 직업명만 가져오게 하기
    const level = $(elem).find('td:nth-child(3)').text().trim();
    const exp = $(elem).find('td:nth-child(4)').text().trim();
    const pop = $(elem).find('td:nth-child(5)').text().trim();
    const guild = $(elem).find('td:nth-child(6)').text().trim();
    const rankInfo = { rank, rankChange, characterImage, characterInfoUrl, nickname, job, level, exp, pop, guild };
    rankList.list.push(rankInfo);
  });
  return rankList;
}
