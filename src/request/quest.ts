import { reqMaple } from "./utils/axiosConfig";

export const reqQuestDetail = async (entry: string, questData: object) => {
  const groupName = entry.split('\t')[0];
  const questName = entry.split('\t')[1];
  const detailUrl = questData[groupName][questName].detailUrl;
  const { data: res } = await reqMaple(detailUrl, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    }
  });
  return res.view;
}

export const reqQuestGroupDetail = async (group: string, questData: object) => {
  const details: object = {};
  for (const questEntry of Object.keys(questData[group])) {
    //TODO: 여기서 하는게 아니라 메인에서 하게 해야하나 (파싱 동시처리 관련 효율?)
    //TODO: 근데 그룹으로 감싸서 반환할거면 여기서 하거나 별도 유틸로 빼야할듯
    const detail = await reqQuestDetail(`${group}\t${questEntry}`, questData);
    details[questEntry] = detail;
  }
  return details;
}
