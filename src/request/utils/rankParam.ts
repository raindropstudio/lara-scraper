import { Option } from "../types/ranktype";

const WORLD = {
  "전체월드": 0,  "리부트2" : 1,  "리부트"  : 2,
  "오로라"  : 3,  "레드"    : 4,  "이노시스": 5,
  "유니온"  : 6,  "스카니아": 7,  "루나"    : 8,
  "제니스"  : 9,  "크로아"  : 10, "베라"    : 11,
  "엘리시움": 12, "아케인"  : 13, "노바"    : 14,
  "버닝"    : 15, "버닝2"   : 16, "버닝3"   : 17,
  "버닝4"   : 18,
}

// 직업, 라라에서는 차수명만 저장하고, 차수명: {직업코드, 차수코드}, 차수코드 -1일 시 해당직업 차수 없음
const JOB = {
  "초보자"           : [ 0, -1],
  "검사"             : [ 1,  0],
  "파이터"           : [ 1, 10], "페이지"           : [ 1, 20], "스피어맨"    : [ 1,  30],
  "크루세이더"       : [ 1, 11], "나이트"           : [ 1, 21], "버서커"      : [ 1,  31],
  "히어로"           : [ 1, 12], "팔라딘"           : [ 1, 22], "다크나이트"  : [ 1,  32],
  "매지션"           : [ 2,  0],
  "위자드(불,독)"    : [ 2, 10], "위자드(썬,콜)"    : [ 2, 20], "클레릭"      : [ 2,  30],
  "메이지(불,독)"    : [ 2, 11], "메이지(썬,콜)"    : [ 2, 21], "프리스트"    : [ 2,  31],
  "아크메이지(불,독)": [ 2, 12], "아크메이지(썬,콜)": [ 2, 22], "비숍"        : [ 2,  32],
  "아처"             : [ 3,  0], "아처(패스파인더)" : [ 3,  1],
  "헌터"             : [ 3, 10], "사수"             : [ 3, 20], "에인션트아처": [ 3,  30],
  "레인저"           : [ 3, 11], "저격수"           : [ 3, 21], "체이서"      : [ 3,  31],
  "보우마스터"       : [ 3, 21], "신궁"             : [ 3, 22], "패스파인더"  : [ 3,  32],
  "로그"             : [ 4,  0],
  "어쌔신"           : [ 4, 10], "시프"             : [ 4, 20],
  "허밋"             : [ 4, 11], "시프마스터"       : [ 4, 21], "듀어러"      : [ 4,  31],
  "나이트로드"       : [ 4, 12], "섀도어"           : [ 4, 22], "듀얼마스터"  : [ 4,  32],
  "슬래셔"           : [ 4, 33], "듀얼블레이더"     : [ 4, 34],
  "해적"             : [ 5,  0],
  "인파이터"         : [ 5, 10], "건슬링거"         : [ 5, 20], "캐논슈터"    : [ 5,  30],
  "버커니어"         : [ 5, 11], "발키리"           : [ 5, 21], "캐논블래스터": [ 5,  31],
  "바이퍼"           : [ 5, 12], "캡틴"             : [ 5, 22], "캐논마스터"  : [ 5,  32],
  "노블레스"         : [ 6, 10], "소울마스터"       : [ 6, 11], "플레임위자드": [ 6,  12],
  "윈드브레이커"     : [ 6, 13], "나이트워커"       : [ 6, 14], "스트라이커"  : [ 6,  15],
  "미하일"           : [ 6, 16],
  "아란"             : [ 7, -1], "에반"             : [ 8, -1],                            //  9 없음
  "시티즌"           : [10, 30], "배틀메이지"       : [10, 32], "와일드헌터"  : [10,  33],
  "메카닉"           : [10, 35], "데몬슬레이어"     : [10, 31], "데몬어벤져"  : [10, 131],
  "제논"             : [10, 36], "블래스터"         : [10, 37],
  "메르세데스"       : [11, -1], "팬텀"             : [12, -1], "루미너스"    : [13,  -1],
  "카이저"           : [14, -1], "엔젤릭버스터"     : [15, -1], "제로"        : [17,  -1], // 16 없음
  "은월"             : [18, -1], "키네시스"         : [20, -1], "카데나"      : [21,  -1], // 19 없음
  "일리움"           : [22, -1], "아크"             : [23, -1], "호영"        : [24,  -1],
  "아델"             : [25, -1], "카인"             : [26, -1], "라라"        : [28,  -1]  // 27 없음
}

// 무릉도장
const DOJANG = {
  "입문": 0, "통달": 2,
}

// 업적
const GRADE = {
  "전체등급": 0, "마스터": 1, "다이아몬드": 2,
  "플레티넘": 3, "골드"  : 4, "실버"      : 5,
  "브론즈"  : 6,
}

export const toUrlParam = (option: Option) => {
  let urlParam: string[] = [];
  if (option?.nickname) urlParam.push(`c=${encodeURIComponent(option.nickname)}`);
  if (option?.world) urlParam.push(`w=${WORLD[option.world]}`);
  if (option?.job) {
    urlParam.push(`j=${JOB[option.job][0]}`);
    if(JOB[option.job][1] !== -1) urlParam.push(`d=${JOB[option.job][1]}`);
  }
  if (option?.dojang) urlParam.push(`t=${DOJANG[option.dojang]}`);
  if (option?.grade) urlParam.push(`g=${GRADE[option.grade]}`);
  if (option?.page) urlParam.push(`page=${option.page}`);
  return urlParam.join('&');
}
