import * as cheerio from "cheerio";

export const isPrivate = (html: string) => {
  const $ = cheerio.load(html);
  const privateDiv = !!$(".private2").length;
  const privateImg = !!$("img[src='https://ssl.nexon.com/s2/game/maplestory/renewal/common/private_img.png']").length;
  const privateAlt = !!$("img[alt='공개하지 않은 정보입니다.']").length;
  const isPrivate = privateDiv || privateImg || privateAlt;
  return isPrivate;
}
