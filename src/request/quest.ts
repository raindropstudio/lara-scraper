import { reqMaple } from "./utils/axiosConfig";

export const getQuestDetail = async (entry: string, questData: object) => {
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

export const getQuestGroupDetail = async (group: string, questData: object) => {
  const details: object = {};
  for (const questEntry of Object.keys(questData[group])) {
    const detail = await getQuestDetail(`${group}\t${questEntry}`, questData);
    details[questEntry] = detail;
  }
  return details;
}
