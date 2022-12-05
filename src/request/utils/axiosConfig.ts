import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as http from 'http';
import * as https from 'https';

const MAX_CONCURRENT_REQUESTS = process.env.AXIOS_MAX_CON || 4;
const CHECK_INTERVAL = 10; // ms
const GLOBAL_MAX_RETRY = 5;
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

reqMaple.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (currentRequests < MAX_CONCURRENT_REQUESTS) {
          currentRequests++;
          clearInterval(interval);
          resolve(config);
        }
      }, CHECK_INTERVAL);
    });
  }, (error: AxiosError) => {
    return Promise.reject(error);
  }
);

reqMaple.interceptors.response.use(
  (response: AxiosResponse) => {
    currentRequests = Math.max(0, currentRequests - 1);
    currentRetry = 0;
    return Promise.resolve(response);
  }, (error: AxiosError) => {
    currentRequests = Math.max(0, currentRequests - 1);
    if (currentRetry < GLOBAL_MAX_RETRY) {
      currentRetry++;
      return reqMaple.request(error.config);
    }
    return Promise.reject(error);
  }
);
