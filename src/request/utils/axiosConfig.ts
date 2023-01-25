import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as http from 'http';
import * as https from 'https';

const MAX_CONCURRENT_REQUESTS = process.env.AXIOS_MAX_CON || 3;
const CHECK_INTERVAL_MS = 30;
const GLOBAL_MAX_RETRY = 5;
const RETRY_DELAY_MS = 100;
let currentRequests = 0;
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

const retry = (res: AxiosResponse | AxiosError, desc: string) => {
  if (currentRetry < GLOBAL_MAX_RETRY) {
    console.log(`Retry [${desc}] (${currentRetry + 1} / ${GLOBAL_MAX_RETRY}) : ${res.config.url}`);
    currentRetry++;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(reqMaple.request(res.config));
      }, RETRY_DELAY_MS * (currentRetry + 1));
    });
  }
  console.log(`Reject [${desc}] (Retry count exceeded) : ${res.config.url}`);
  return Promise.reject(res);
};

const reqThrottle = (config: AxiosRequestConfig) => {
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      if (currentRequests < MAX_CONCURRENT_REQUESTS) {
        currentRequests++;
        clearInterval(interval);
        resolve(config);
      }
    }, CHECK_INTERVAL_MS);
  });
};

const resThrottleSuccess = (response: AxiosResponse) => {
  currentRequests = Math.max(0, currentRequests - 1);
  return Promise.resolve(response);
};

const resThrottleError = (error: AxiosError) => {
  currentRequests = Math.max(0, currentRequests - 1);
  return Promise.reject(error);
};

const resChkSuccess = (response: AxiosResponse) => {
  // Response 내용이 100 미만일 경우 재시도
  //? Quest의 경우 응답이 json이므로 헤더의 Content-Length 확인
  if (response.headers['content-length'] && parseInt(response.headers['content-length']) < 100)
    return retry(response, 'Null Response');
  // json이 아니고 2000 미만일 경우 재시도
  if (response.data.length < 2000)
    return retry(response, 'Null Body Response');

  currentRetry = 0;
  return Promise.resolve(response);
};

const resRetryError = (error: AxiosError) => {
  return retry(error, 'HTTP Error');
};

reqMaple.interceptors.request.use(reqThrottle);
reqMaple.interceptors.response.use(resThrottleSuccess, resThrottleError);
reqMaple.interceptors.response.use(resChkSuccess, resRetryError);
