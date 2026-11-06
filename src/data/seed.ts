// 초기 데이터. Firebase 연결 후에는 관리자 페이지에서 Firestore로 옮겨 관리한다.
// 대괄호 [ ] 로 표시된 값은 아직 채우지 않은 자리다.

import type { Dream, Group, Persona, Profile, Prompt, Work } from "@/lib/types";

export const groups: Group[] = [
  // 세계관
  { id: "themis", type: "world", title: "THEMIS", sub: "센티넬버스 · 가이드 페르소나", isPublic: true, order: 1 },
  { id: "brookfield", type: "world", title: "BROOKFIELD", sub: "브룩필드 대학교 · 캠퍼스 하이틴", isPublic: true, order: 2 },
  { id: "sinclair", type: "world", title: "S&C", sub: "싱클레어 가문 · 런던", isPublic: true, order: 3 },
  { id: "solo", type: "world", title: "STANDALONE", sub: "단독 시나리오", isPublic: true, order: 4 },
  // 작품
  { id: "themis-open", type: "work", title: "THEMIS — OPEN", sub: "특정 작품 미지정 · 세계관 공통", isPublic: true, order: 1 },
  { id: "moby", type: "work", title: "레비 · 톡신 · 모비딕", sub: "THEMIS · 레비 집무실 시작 시나리오", isPublic: true, order: 2 },
  { id: "guide-wanted", type: "work", title: "충격실화: 가이드 급구", sub: "THEMIS · 긴급 배정 시나리오", isPublic: true, order: 3 },
  { id: "themis-cards", type: "work", title: "볼텍스 · 메테오 · 맥퀸 외", sub: "THEMIS · 카드 캐릭터", isPublic: true, order: 4 },
  { id: "brookfield-u", type: "work", title: "브룩필드 대학교", sub: "캠퍼스 역하렘", isPublic: true, order: 5 },
  { id: "martin", type: "work", title: "마틴", sub: "NCD 잠입 수사관", isPublic: true, order: 6 },
  { id: "gosiwon", type: "work", title: "권태식", sub: "폐업 고시원 마지막 세입자", isPublic: true, order: 7 },
  { id: "kang", type: "work", title: "강태건", sub: "단독 시나리오", isPublic: true, order: 8 },
  { id: "gen", type: "work", title: "카시와기 겐", sub: "단독 시나리오", isPublic: true, order: 9 },
  { id: "queen", type: "work", title: "클럽 QUEEN", sub: "드랙퀸 시나리오", isPublic: true, order: 10 },
  { id: "cole", type: "work", title: "콜 데블린", sub: "뱀파이어 시나리오", isPublic: true, order: 11 },
];

export const personas: Persona[] = [
  {
    id: "styx", nameKo: "스틱스", codename: "STYX", worldId: "themis", workId: "themis-open",
    cardMeta: { label: "IMPRINT", value: "타르타로스 · 아케론" },
    stats: [
      { label: "GENDER", value: "남성" },
      { label: "IMPRINT", value: "타르타로스 · 아케론(비탄의 강)" },
      { label: "STATUS", value: "前 테미스 VESTAL · 現 무소속 이탈자" },
    ],
    ability: "상대 센티넬의 부정적 감정을 흡수하는 ‘흡수형’ 가이딩.",
    background: "‘치료(영구 격리·능력 봉인)’ 처분 전날 탈주했다.",
    isPublic: true, order: 14,
  },
  {
    id: "youth", nameKo: "윤가을", codename: "YOUTH", worldId: "themis", workId: "themis-open",
    cardMeta: { label: "IMPRINT", value: "올림포스 · 헤베" },
    stats: [
      { label: "GENDER", value: "여성" },
      { label: "HEIGHT", value: "158cm" },
      { label: "CLASS", value: "MUSE · B급 가이드" },
      { label: "IMPRINT", value: "올림포스 · 헤베" },
      { label: "PARTNER", value: "없음" },
    ],
    ability: "접촉 대상의 신체 나이 역행·진행. 독소·부식·저주 정화.",
    personality: "다정하고 겁이 많지만 때때로 대담하다. 접촉에 거부감이 있어 특수 장갑을 낀다.",
    appearance: "은백발(뿌리만 검은 투톤, 첫 폭주 때 남은 노화 역류 흔적), 연녹색 눈.",
    isPublic: true, order: 13,
  },
  {
    id: "soye", nameKo: "한소예", codename: "SOYE", worldId: "solo", workId: "gosiwon",
    cardMeta: { label: "ROOM", value: "세광고시원 307호" },
    stats: [
      { label: "AGE", value: "24세" },
      { label: "ROOM", value: "세광고시원 307호" },
    ],
    background: "철거 예정인 고시원에 혼자 남은 마지막 세입자. 운영자는 보증금을 들고 잠적했다.",
    isPublic: true, order: 12,
  },
  {
    id: "flora", nameKo: "플로라", codename: "FLORA", worldId: "themis", workId: "guide-wanted",
    cardMeta: { label: "IMPRINT", value: "올림포스 · 페르세포네" },
    stats: [
      { label: "CLASS", value: "MUSE · C급 가이드" },
      { label: "IMPRINT", value: "올림포스 · 페르세포네" },
    ],
    ability: "에코로 주변 식물의 생장 주기를 제어한다(만개 ↔ 낙화).",
    // 이름·외형 미확정이라 비공개로 시작
    isPublic: false, order: 11,
  },
  {
    id: "danjam", nameKo: "하선우", codename: "DANJAM", nameAlt: "夏善祐 · 단잠", worldId: "themis", workId: "themis-cards",
    cardMeta: { label: "IMPRINT", value: "타르타로스 · 힙노스" },
    stats: [
      { label: "GENDER / AGE", value: "여성 · 29세" },
      { label: "CLASS", value: "A급 가이드" },
      { label: "IMPRINT", value: "타르타로스 · 힙노스" },
      { label: "FORMER", value: "대학병원 응급실 3교대 간호사" },
    ],
    ability: "꿈 없는 깊은 잠에 빠뜨리는 수면 가이딩.",
    personality: "3교대로 다져진 넉살과 강철 멘탈. 센티넬을 환자 다루듯 대한다.",
    voice: "“어이구, 우리 애기씨.” / “환자분, 진정.”",
    isPublic: true, order: 10,
  },
  {
    id: "sway", nameKo: "이소담", codename: "SWAY", worldId: "themis", workId: "themis-open",
    cardMeta: { label: "IMPRINT", value: "올림포스 · 페이토" },
    stats: [
      { label: "AGE / HEIGHT", value: "22세 · 158cm" },
      { label: "CLASS", value: "A급 가이드 (잠재력 S급)" },
      { label: "LINEAGE", value: "올림포스 · 페이토" },
    ],
    ability: "감정 증폭 가이딩. 상대가 품은 호감·보호욕·애정을 매개로 에코가 증폭된다.",
    personality: "수줍고 눈을 잘 못 마주친다. 늘 눈치를 보고, 칭찬받으면 손만 꼼지락거린다.",
    appearance: "뺨과 콧등에 옅은 주근깨.",
    isPublic: true, order: 9,
  },
  {
    id: "blush", nameKo: "유리", codename: "BLUSH", worldId: "themis", workId: "moby",
    cardMeta: { label: "IMPRINT", value: "올림포스 · 아프로디테" },
    stats: [
      { label: "IMPRINT", value: "올림포스 · 아프로디테" },
      { label: "STATUS", value: "前 테미스 MUSE S급 · 現 무소속 이탈자" },
    ],
    ability: "감정 동화·매혹으로 정신에 간섭한다. 발현 시 장미향.",
    appearance: "허니 블론드 롱 웨이브(끝은 장밋빛), 연회청색 눈. 동화 시 홍조.",
    isPublic: true, order: 8,
  },
  {
    id: "rennie", nameKo: "신채령", codename: "RENNIE", worldId: "brookfield", workId: "brookfield-u",
    cardMeta: { label: "ROLE", value: "브룩필드대 편입생 · 고문헌 판독" },
    stats: [
      { label: "GENDER / AGE", value: "여성 · 20세" },
      { label: "HEIGHT", value: "155cm" },
      { label: "SCHOOL", value: "브룩필드 대학교 2학년 편입생" },
      { label: "BIRTHDAY", value: "10월 9일" },
    ],
    ability: "다국어 고문헌 판독(프랑스어·독일어 등).",
    personality: "셋 이상 몰리면 굳고 1:1이면 말문이 터진다. 성깔은 있지만 힘으로는 아무도 못 이긴다.",
    voice: "항상 반말. 화나면 상대를 성으로 부르고, 완전히 화나면 존댓말로 굳는다.",
    appearance: "가는 뼈대, 창백한 피부, 도수 센 사각 안경, 맨얼굴.",
    isPublic: true, order: 7,
  },
  {
    id: "lillian", nameKo: "릴리안 웨스트", codename: "LILLIAN", worldId: "brookfield", workId: "brookfield-u",
    cardMeta: { label: "ROLE", value: "올드머니 상속녀 · 미술사 전공" },
    stats: [
      { label: "GENDER", value: "여성" },
      { label: "ORIGIN", value: "런던 · 미국 동부" },
      { label: "MAJOR", value: "미술사" },
    ],
    appearance: "금발 긴 생머리, 벽안, 올드머니룩.",
    isPublic: true, order: 6,
  },
  {
    id: "rowan", nameKo: "로완 싱클레어", codename: "ROWAN", worldId: "sinclair", workId: "martin",
    cardMeta: { label: "ROLE", value: "싱클레어 가문 · 런던 귀국" },
    stats: [
      { label: "GENDER", value: "여성" },
      { label: "FAMILY", value: "싱클레어 가문 (S&C)" },
    ],
    background: "외국에서 런던으로 돌아온 싱클레어의 자녀.",
    appearance: "뱀 모양 팔찌 시계 — 팔찌인 척하는 시계.",
    isPublic: true, order: 5,
  },
  {
    id: "haewon", nameKo: "정해원", codename: "HAEWON", worldId: "solo", workId: "kang",
    cardMeta: { label: "ROLE", value: "동물병원 수의사" },
    stats: [
      { label: "GENDER", value: "여성" },
      { label: "JOB", value: "동물병원 수의사" },
    ],
    isPublic: true, order: 4,
  },
  {
    id: "songhwa", nameKo: "채송화", codename: "SONGHWA", worldId: "solo", workId: "gen",
    cardMeta: { label: "ROLE", value: "국문과 3학년 · 과외선생" },
    stats: [
      { label: "SCHOOL", value: "국문과 3학년" },
      { label: "JOB", value: "과외선생" },
      { label: "LANGUAGE", value: "일본어 조금" },
    ],
    appearance: "약간 동글동글하고 귀여운 인상.",
    isPublic: true, order: 3,
  },
  {
    id: "belladonna", nameKo: "서윤", codename: "BELLADONNA", worldId: "solo", workId: "queen",
    cardMeta: { label: "ROLE", value: "드랙퀸 · 클럽 QUEEN 정기 출연" },
    stats: [
      { label: "GENDER", value: "남성" },
      { label: "DRAG NAME", value: "벨라돈나" },
      { label: "STAGE", value: "클럽 QUEEN 정기 출연" },
    ],
    isPublic: true, order: 2,
  },
  {
    id: "emery", nameKo: "에머리 베인", codename: "EMERY", nameAlt: "Emery Vane", worldId: "solo", workId: "cole",
    cardMeta: { label: "ROLE", value: "뱀파이어 · 플로리다 정착" },
    stats: [
      { label: "GENDER", value: "남성" },
      { label: "RACE", value: "뱀파이어" },
    ],
    appearance: "마른 체형.",
    isPublic: true, order: 1,
  },
];

export const dreams: Dream[] = [
  { id: "rodrigo-styx", characterKo: "로드리고", characterEn: "RODRIGO", personaId: "styx", groupId: "themis", status: "open", note: "스틱스 드림 — 완전 오픈", tags: ["BL"], isPublic: true, order: 1 },
  { id: "cherno-styx", characterKo: "체르노", characterEn: "CHERNO", personaId: "styx", groupId: "themis", status: "open", note: "이탈 루트", tags: ["BL", "이탈"], isPublic: true, order: 2 },
  { id: "meteor-danjam", characterKo: "메테오", characterEn: "METEOR", personaId: "danjam", groupId: "themis", status: "chasing", note: "혼자 각성한 서사로 진행", tags: ["센티넬버스"], isPublic: true, order: 3 },
  { id: "grey-danjam", characterKo: "그레이", characterEn: "GREY", personaId: "danjam", groupId: "themis", status: "chasing", note: "혼자 각성한 서사로 진행", tags: ["센티넬버스"], isPublic: true, order: 4 },
  { id: "tyler-rennie", characterKo: "타일러 퀸", characterEn: "TYLER QUINN", personaId: "rennie", groupId: "brookfield-u", status: "dating", note: "애칭 mon loup", tags: ["캠퍼스"], isPublic: true, order: 5 },
  { id: "sebastian-lillian", characterKo: "세바스찬", characterEn: "SEBASTIAN", personaId: "lillian", groupId: "brookfield-u", status: "ongoing", note: "정략결혼 파혼 작전 · 은근한 질투", tags: ["캠퍼스", "정략"], isPublic: true, order: 6 },
  { id: "martin-rowan", characterKo: "마틴", characterEn: "MARTIN", personaId: "rowan", groupId: "martin", status: "ongoing", note: "초면에서 시작해 연인으로", tags: ["런던"], isPublic: true, order: 7 },
  { id: "cole-emery", characterKo: "콜 데블린", characterEn: "COLE DEVLIN", personaId: "emery", groupId: "cole", status: "dating", note: "조직을 떠나 플로리다에 정착", tags: ["BL", "뱀파이어"], isPublic: true, order: 8 },
];

export const works: Work[] = [
  { id: "w-03", title: "[작품명]", genre: "[장르]", platform: "[플랫폼]", releasedAt: "[출시일]", isPublic: true, order: 3 },
  { id: "w-02", title: "[작품명]", genre: "[장르]", platform: "[플랫폼]", releasedAt: "[출시일]", isPublic: true, order: 2 },
  { id: "w-01", title: "[작품명]", genre: "[장르]", platform: "[플랫폼]", releasedAt: "[출시일]", isPublic: true, order: 1 },
];

export const prompts: Prompt[] = [];

export const profile: Profile = {
  intro: "PAWCAT의 페르소나 · 프롬프트 · 작품 아카이브.",
  careers: [],
  links: [],
};
