import axios, { AxiosError, AxiosResponse } from 'axios';
import * as http from 'http';
import * as https from 'https';

const GLOBAL_MAX_RETRY = 5;
let currentRetry = 0;

export const reqMaple = axios.create({
  baseURL: 'https://maplestory.nexon.com',
  timeout: 3000,
  headers: {
    'Accepts': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
    'Connection': 'keep-alive',
    'Host': 'maplestory.nexon.com',
    'Referer': 'https://maplestory.nexon.com/Ranking/World/Total',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
    'sec-ch-ua': `"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"`,
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
  },
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),
});

reqMaple.interceptors.response.use(
  (response: AxiosResponse) => {
    // Response 내용이 100 미만일 경우 재시도
    if (response.data.length < 100) {
      if (currentRetry < GLOBAL_MAX_RETRY) {
        console.log(`Null Response Retry (${currentRetry} / ${GLOBAL_MAX_RETRY}) : ${response.config.url}`);
        currentRetry++;
        return reqMaple.request(response.config);
      }
      console.log(`Null Response Reject (Retry count exceeded) : ${response.config.url}`);
      return Promise.reject(response);
    }

    currentRetry = 0;
    return Promise.resolve(response);
  }, (error: AxiosError) => {
    if (currentRetry < GLOBAL_MAX_RETRY) {
      console.log(`Error Response Retry (${currentRetry} / ${GLOBAL_MAX_RETRY}) : ${error.config.url}`);
      currentRetry++;
      return reqMaple.request(error.config);
    }
    console.log(`Error Response Reject (Retry count exceeded) : ${error.config.url}`);
    return Promise.reject(error);
  }
);
