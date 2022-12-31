import { reqMaple } from "./utils/axiosConfig";

export const reqItemDetail = async (entry: string, itemData: object) => {
  const groupName = entry.split('\t')[0];
  const itemName = entry.split('\t')[1];
  const detailUrl = itemData[groupName][itemName].detailUrl;
  const { data: res } = await reqMaple(detailUrl, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    }
  });
  return res.view;
}

export const reqItemGroupDetail = async (group: string, itemData: object) => {
  const details: object = {};
  for (const itemEntry of Object.keys(itemData[group])) {
    //TODO: 여기서 하는게 아니라 메인에서 하게 해야하나 (파싱 동시처리 관련 효율?)
    //TODO: 근데 그룹으로 감싸서 반환할거면 여기서 하거나 별도 유틸로 빼야할듯
    const detail = await reqItemDetail(`${group}\t${itemEntry}`, itemData);
    details[itemEntry] = detail;
  }
  return details;
}
