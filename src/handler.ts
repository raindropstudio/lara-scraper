import { characterInfo } from "./characterInfo";
import { rankList } from "./rankList";
import { CharacterInfoRequest, RankRequest } from "./types/requestType";

process.on('uncaughtException', (err) => {
  console.log('uncaughtException');
  console.log(err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('unhandledRejection: ' + promise);
  console.log(reason);
});

exports.rankList = async (event: RankRequest) => {
  try {
    const res = await rankList(event);
    // return res;
    return JSON.stringify(res);
  } catch (e) {
    console.log(e);
    return JSON.stringify({ status: 'err_unknown' });
  }
};

exports.characterInfo = async (event: CharacterInfoRequest) => {
  try {
    const res = await characterInfo(event);
    // return res;
    return JSON.stringify(res);
  } catch (e) {
    console.log(e);
    return JSON.stringify({ status: 'err_unknown' });
  }
};
