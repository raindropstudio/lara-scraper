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
