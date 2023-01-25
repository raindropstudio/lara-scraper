import { QuestNotFoundError } from "../types/error";
import { reqMaple } from "./utils/axiosConfig";

export const reqQuestDetail = async (entry: string, questData: object) => {
  let detailUrl: string;
  try {
    const groupName = entry.split('\t')[0];
    const questName = entry.split('\t')[1];
    detailUrl = questData[groupName][questName].detailUrl;
  } catch (e) {
    throw new QuestNotFoundError(`QuestDetail ${entry} not found`);
  }
  const { data: res } = await reqMaple(detailUrl, {
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
    }
  });
  return res.view;
}
