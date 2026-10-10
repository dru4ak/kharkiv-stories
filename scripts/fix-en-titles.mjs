import fs from "node:fs";

const i18n = JSON.parse(fs.readFileSync("src/data/stories.i18n.json", "utf8"));

const map = {
  vonyaet: { en: "IT STINKS!", uk: "СМЕРДИТЬ!" },
  "zhertvy-obmana": { en: "VICTIMS OF DECEIT", uk: "ЖЕРТВИ ОБМАНУ" },
  "vot-takie-sapogi": { en: "BOOTS LIKE THESE!", uk: "ОСЬ ТАКІ ЧОБОТИ!" },
  "predpochel-tyurmu": { en: "HE PREFERRED PRISON", uk: "ВОЛІВ В’ЯЗНИЦЮ" },
  "do-upddu": { en: "AS FAR AS THE UPDDU", uk: "ДО УПДДУ" },
  "proobraz-vytrezvitelya": {
    en: "A PROTOTYPE SOBERING STATION",
    uk: "ПРООБРАЗ ВИТРЕЗНИКА",
  },
  "brityy-zatylok": { en: "A SHAVED NAPE", uk: "ГОЛЕНА ПОТИЛИЦЯ" },
  "medvezhi-pestuny": { en: "BEAR NURSEMAIDS", uk: "ВЕДМЕЖІ ПЕСТУНИ" },
  "na-kulachki": { en: "FISTFIGHT", uk: "НА КУЛАЧКИ" },
  "rukopis-szheg": { en: "HE BURNED THE MANUSCRIPT", uk: "РУКОПИС СПАЛИВ" },
  "nischih-studentov-net": {
    en: "NO DESTITUTE STUDENTS!",
    uk: "БІДНИХ СТУДЕНТІВ НЕМАЄ!",
  },
  "pochetnyy-grazhdanin": {
    en: "HONORARY CITIZEN",
    uk: "ПОЧЕСНИЙ ГРОМАДЯНИН",
  },
  "po-sledam-lyubovnika": {
    en: "ON THE LOVER’S TRAIL",
    uk: "СЛІДАМИ КОХАНЦЯ",
  },
  "bez-svideteley": { en: "WITHOUT WITNESSES", uk: "БЕЗ СВІДКІВ" },
  beskorystie: { en: "SELFLESSNESS", uk: "БЕЗКОРИСЛИВІСТЬ" },
  "nevidannoe-chudovische": {
    en: "AN UNHEARD-OF MONSTER",
    uk: "НЕБАЧЕНЕ ЧУДОВИСЬКО",
  },
  "shar-v-nebe": { en: "A BALLOON IN THE SKY", uk: "КУЛЯ В НЕБІ" },
  "turok-v-harkove": { en: "A TURK IN KHARKIV", uk: "ТУРОК У ХАРКОВІ" },
  "biznes-na-domu": { en: "BUSINESS AT HOME", uk: "БІЗНЕС ВДОМА" },
  "iz-podpolya": { en: "FROM THE UNDERGROUND", uk: "З ПІДПІЛЛЯ" },
  "na-kogo-molitsya": { en: "WHOM TO PRAY TO?", uk: "НА КОГО МОЛИТИСЯ?" },
  "ne-v-svoey-tarelke": { en: "OUT OF HIS ELEMENT", uk: "НЕ У СВОЇЙ ТАРІЛЦІ" },
  "udar-gvozdem": { en: "A BLOW WITH A NAIL", uk: "УДАР ЦВЯХОМ" },
  "zaveschanie-gorodu": { en: "A BEQUEST TO THE CITY", uk: "ЗАПОВІТ МІСТУ" },
  "aleksandr-vtoroy-ochen-zhal": {
    en: 'ALEXANDER II: "WHAT A PITY!"',
    uk: "ОЛЕКСАНДР ДРУГИЙ: «ДУЖЕ ШКОДА!»",
  },
  "neudavshayasya-popytka": { en: "A FAILED ATTEMPT", uk: "НЕВДАЛА СПРОБА" },
  vsevlastnyy: { en: "ALL-POWERFUL", uk: "ВСЕВЛАДНИЙ" },
};

let n = 0;
for (const [slug, tr] of Object.entries(map)) {
  if (!i18n[slug]) continue;
  i18n[slug].en = i18n[slug].en || {};
  i18n[slug].uk = i18n[slug].uk || {};
  i18n[slug].en.title = tr.en;
  i18n[slug].uk.title = tr.uk;
  n++;
}

fs.writeFileSync(
  "src/data/stories.i18n.json",
  JSON.stringify(i18n, null, 2),
  "utf8",
);

let left = 0;
for (const e of Object.values(i18n)) {
  if (/[а-яё]{3,}/i.test(e.en?.title || "")) left++;
}
console.log({ fixed: n, enCyrillicLeft: left });
