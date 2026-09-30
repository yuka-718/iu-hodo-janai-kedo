const themeColors = {
  plum: "#d88fb3",
  green: "#97c9b7",
  blue: "#a6b5e3",
  orange: "#f2a37d",
};

const puzzleTypes = {
  shift: { label: "かんたん · ひとつずらし", title: "ひとつ前にもどしてね。", rule: "五十音で、ひとつ前にもどします。", time: "約10秒" },
  reverse: { label: "かんたん · さかさ文字", title: "後ろから読んでね。", rule: "右から左へ読む暗号です。", time: "約10秒" },
  morse: { label: "ふつう · モールス信号", title: "トン・ツーを読んでね。", rule: "・がトン、－がツー。和文モールスです。", time: "約30秒" },
  unicode: { label: "専門的 · Unicode", title: "文字コードを解いてね。", rule: "例：U+3042 は「あ」。コードポイントの暗号です。", time: "約40秒" },
};

const sampleCard = {
  version: 2,
  author: "",
  category: "つくったもの",
  teaser: "ちょっとうれしかったこと。",
  message: "この服、じつは自分でつくった。",
  key: "ふく",
  hint: "身につけるもの",
  puzzle: "shift",
  visibility: "limited",
  theme: "plum",
  image: "",
};

const publicSamples = [
  { version: 2, author: "mio", category: "最近好きなもの", teaser: "最近好きなもの。", message: "朝の散歩で見つける、小さな花が好き。", key: "はな", hint: "道ばたに咲いているもの", puzzle: "reverse", visibility: "public", theme: "green", image: "" },
  { version: 2, author: "", category: "できるようになったこと", teaser: "できるようになったこと。", message: "最近、ラテアートが少しできるようになった。", key: "らて", hint: "カフェにあるもの", puzzle: "morse", visibility: "public", theme: "orange", image: "" },
  { version: 2, author: "sora", category: "ひそかな特技", teaser: "ひそかな特技。", message: "地図を一度見ると、道をだいたい覚えられる。", key: "みち", hint: "歩くところ", puzzle: "unicode", visibility: "public", theme: "blue", image: "" },
  { version: 2, author: "", category: "がんばったこと", teaser: "がんばったこと。", message: "ずっと苦手だった曲を、最後まで弾けた。", key: "ぴあの", hint: "鍵盤のある楽器", puzzle: "shift", visibility: "public", theme: "plum", image: "" },
  { version: 2, author: "nagi", category: "おすすめしたいもの", teaser: "おすすめしたいもの。", message: "雨の日に読む短編小説が、じつはかなり好き。", key: "ほん", hint: "読むもの", puzzle: "reverse", visibility: "public", theme: "green", image: "" },
  { version: 2, author: "", category: "伝えたいありがとう", teaser: "伝えたいありがとう。", message: "いつも話を聞いてくれて、ありがとう。", key: "きく", hint: "耳ですること", puzzle: "morse", visibility: "public", theme: "orange", image: "" },
];

const sampleRoom = {
  version: 1,
  id: "sample-room",
  cards: [
    sampleCard,
    { ...publicSamples[1], visibility: "limited" },
    { ...publicSamples[4], visibility: "limited" },
  ],
};

const kana = [
  ..."あいうえお", ..."かきくけこ", ..."さしすせそ", ..."たちつてと", ..."なにぬねの",
  ..."はひふへほ", ..."まみむめも", ..."やゆよ", ..."らりるれろ", ..."わをん",
  ..."がぎぐげご", ..."ざじずぜぞ", ..."だぢづでど", ..."ばびぶべぼ", ..."ぱぴぷぺぽ",
  ..."ぁぃぅぇぉゃゅょっ",
];

const wabunMorse = {
  あ: "－－・－－", い: "・－", う: "・・－", え: "－・－－－", お: "・－・・・",
  か: "・－・・", き: "－・－・・", く: "・・・－", け: "－・－－", こ: "－－－－",
  さ: "－・－・－", し: "－－・－・", す: "－－－・－", せ: "・－－－・", そ: "－－－・",
  た: "－・", ち: "・・－・", つ: "・－－・", て: "・－・－－", と: "・・－・・",
  な: "・－・", に: "－・－・", ぬ: "・・・・", ね: "－－・－", の: "・・－－",
  は: "－・・・", ひ: "－－・・－", ふ: "－－・・", へ: "・", ほ: "－・・",
  ま: "－・・－", み: "・・－・－", む: "－", め: "－・・・－", も: "－・・－・",
  や: "・－－", ゆ: "－・・－－", よ: "－－",
  ら: "・・・", り: "－－・", る: "－・－－・", れ: "－－－", ろ: "・－・－・",
  わ: "－・－", を: "・－－－", ん: "・－・－",
};

const latinMorse = {
  a: "・－", b: "－・・・", c: "－・－・", d: "－・・", e: "・", f: "・・－・",
  g: "－－・", h: "・・・・", i: "・・", j: "・－－－", k: "－・－", l: "・－・・",
  m: "－－", n: "－・", o: "－－－", p: "・－－・", q: "－－・－", r: "・－・",
  s: "・・・", t: "－", u: "・・－", v: "・・・－", w: "・－－", x: "－・・－",
  y: "－・－－", z: "－－・・", 0: "－－－－－", 1: "・－－－－", 2: "・・－－－",
  3: "・・・－－", 4: "・・・・－", 5: "・・・・・", 6: "－・・・・", 7: "－－・・・",
  8: "－－－・・", 9: "－－－－・",
};

const voicedKana = {
  が: "か", ぎ: "き", ぐ: "く", げ: "け", ご: "こ", ざ: "さ", じ: "し", ず: "す", ぜ: "せ", ぞ: "そ",
  だ: "た", ぢ: "ち", づ: "つ", で: "て", ど: "と", ば: "は", び: "ひ", ぶ: "ふ", べ: "へ", ぼ: "ほ",
};
const halfVoicedKana = { ぱ: "は", ぴ: "ひ", ぷ: "ふ", ぺ: "へ", ぽ: "ほ" };
const smallKana = { ぁ: "あ", ぃ: "い", ぅ: "う", ぇ: "え", ぉ: "お", ゃ: "や", ゅ: "ゆ", ょ: "よ", っ: "つ" };
const PUBLIC_STORAGE_KEY = "iu-hodo-public-cards-v1";
const ROOM_CARD_LIMIT = 8;

const views = [...document.querySelectorAll(".view")];
const homeView = document.querySelector("#home-view");
const feedView = document.querySelector("#feed-view");
const roomView = document.querySelector("#room-view");
const readerView = document.querySelector("#reader-view");
const createView = document.querySelector("#create-view");
const completeView = document.querySelector("#complete-view");
const siteHeader = document.querySelector(".site-header");
const siteFooter = document.querySelector(".site-footer");

let activeCard = sampleCard;
let activeRoom = null;
let createdCard = null;
let createdRoom = null;
let creatorRoom = null;
let createdLink = "";
let hintLevel = 0;
let readerReturn = "home";

function katakanaToHiragana(value) {
  return String(value).replace(/[ァ-ヶ]/g, (character) => String.fromCharCode(character.charCodeAt(0) - 0x60));
}

function normalizeAnswer(value) {
  return katakanaToHiragana(String(value).normalize("NFKC").trim().toLowerCase()).replace(/\s+/g, "");
}

function shiftCharacter(character, amount = 1) {
  const hiraganaCharacter = katakanaToHiragana(character);
  const kanaIndex = kana.indexOf(hiraganaCharacter);
  if (kanaIndex >= 0) return kana[(kanaIndex + amount + kana.length) % kana.length];
  if (/[a-z]/i.test(character)) {
    const isUppercase = character === character.toUpperCase();
    const start = isUppercase ? 65 : 97;
    return String.fromCharCode(((character.charCodeAt(0) - start + amount + 26) % 26) + start);
  }
  if (/\d/.test(character)) return String((Number(character) + amount + 10) % 10);
  return character;
}

function toMorse(character) {
  const normalized = katakanaToHiragana(character).toLowerCase();
  if (wabunMorse[normalized]) return wabunMorse[normalized];
  if (voicedKana[normalized]) return `${wabunMorse[voicedKana[normalized]]} ・・`;
  if (halfVoicedKana[normalized]) return `${wabunMorse[halfVoicedKana[normalized]]} ・・－－・`;
  if (smallKana[normalized]) return wabunMorse[smallKana[normalized]];
  if (latinMorse[normalized]) return latinMorse[normalized];
  return `U+${normalized.codePointAt(0).toString(16).toUpperCase()}`;
}

function cipherTokens(key, puzzle = "shift") {
  const characters = [...normalizeAnswer(key)];
  if (puzzle === "reverse") return characters.reverse();
  if (puzzle === "morse") return characters.map(toMorse);
  if (puzzle === "unicode") return characters.map((character) => `U+${character.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`);
  return characters.map((character) => shiftCharacter(character, 1));
}

function encodeKey(key, puzzle = "shift") {
  const separator = puzzle === "morse" ? " / " : puzzle === "unicode" ? "  " : "";
  return cipherTokens(key, puzzle).join(separator);
}

function teaserForCategory(category) {
  const exact = {
    つくったもの: "つくったものの話。", できるようになったこと: "できるようになったこと。",
    今日うれしかったこと: "今日うれしかったこと。", 最近好きなもの: "最近好きなもの。",
    小さな自己紹介: "小さな自己紹介。", がんばったこと: "がんばったこと。",
    ひそかな特技: "ひそかな特技。", おすすめしたいもの: "おすすめしたいもの。",
    行ってみた場所: "行ってみた場所。", はじめてやったこと: "はじめてやったこと。",
    伝えたいありがとう: "伝えたいありがとう。",
  };
  return exact[category] || `${category}の話。`;
}

function normalizeCard(card) {
  const category = String(card.category || "小さな自己紹介").slice(0, 24);
  return {
    version: 2,
    author: String(card.author || "").slice(0, 12),
    category,
    teaser: String(card.teaser || teaserForCategory(category)).slice(0, 42),
    message: String(card.message || "").slice(0, 100),
    key: String(card.key || "").slice(0, 12),
    hint: String(card.hint || "").slice(0, 36),
    puzzle: puzzleTypes[card.puzzle] ? card.puzzle : "shift",
    visibility: card.visibility === "public" ? "public" : "limited",
    theme: themeColors[card.theme] ? card.theme : "plum",
    image: typeof card.image === "string" && card.image.startsWith("data:image/") ? card.image : "",
  };
}

function normalizeRoom(room) {
  const cards = Array.isArray(room?.cards)
    ? room.cards.map(normalizeCard).filter((card) => card.message && card.key).slice(0, ROOM_CARD_LIMIT)
    : [];
  return {
    version: 1,
    id: String(room?.id || crypto.randomUUID?.() || Date.now()).slice(0, 48),
    cards: cards.map((card) => ({ ...card, visibility: "limited" })),
  };
}

function showView(view) {
  views.forEach((candidate) => {
    const isActive = candidate === view;
    candidate.hidden = !isActive;
    candidate.classList.toggle("is-active", isActive);
  });
  const isFocusedExperience = view === readerView || view === completeView;
  siteHeader.hidden = isFocusedExperience;
  siteFooter.hidden = isFocusedExperience;
  window.scrollTo({ top: 0, behavior: "auto" });
}

function clearSharedHash() {
  if (location.hash.startsWith("#card=") || location.hash.startsWith("#room=")) {
    history.replaceState(null, "", location.pathname + location.search);
  }
}

function openHome({ clearHash = true } = {}) {
  if (clearHash) clearSharedHash();
  showView(homeView);
}

function openCreator(room = null) {
  creatorRoom = room?.cards ? normalizeRoom(room) : null;
  if (!creatorRoom) clearSharedHash();
  const publicOption = document.querySelector('input[name="visibility"][value="public"]');
  const limitedOption = document.querySelector('input[name="visibility"][value="limited"]');
  const visibilityFieldset = document.querySelector("#visibility-fieldset");
  publicOption.disabled = Boolean(creatorRoom);
  limitedOption.checked = Boolean(creatorRoom) || limitedOption.checked;
  visibilityFieldset.classList.toggle("is-room-mode", Boolean(creatorRoom));
  document.querySelector("#visibility-note").textContent = creatorRoom
    ? "この部屋に、限定公開で置きます。"
    : "限定公開は部屋へ、公開はみんなのフィードへ。";
  document.querySelector("#create-title").innerHTML = creatorRoom
    ? "この部屋に、<br />ひとつだけ。"
    : "言うほどじゃないことを、<br />ひとつだけ。";
  showView(createView);
  setTimeout(() => document.querySelector("#create-category")?.focus(), 0);
}

function openFeed() {
  clearSharedHash();
  renderPublicFeed();
  showView(feedView);
}

function roomLink(room) {
  return `${location.origin}${location.pathname}#room=${encodeRoom(room)}`;
}

function openRoom(room, { updateHash = true } = {}) {
  activeRoom = normalizeRoom(room);
  renderRoom(activeRoom);
  if (updateHash) history.replaceState(null, "", `#room=${encodeRoom(activeRoom)}`);
  showView(roomView);
}

function openReader(card, origin = "home") {
  activeCard = normalizeCard(card);
  readerReturn = origin;
  hintLevel = 0;
  const meta = puzzleTypes[activeCard.puzzle];
  document.querySelector("#reader-from").textContent = `from ${activeCard.author || "匿名"}`;
  document.querySelector("#reader-title").textContent = activeCard.teaser;
  document.querySelector("#reader-category").textContent = activeCard.category;
  document.querySelector("#puzzle-label").textContent = meta.label;
  document.querySelector("#puzzle-title").textContent = meta.title;
  document.querySelector("#puzzle-rule").textContent = meta.rule;
  document.querySelector(".time-pill").textContent = meta.time;
  document.querySelector("#answer-input").value = "";
  document.querySelector("#answer-feedback").textContent = "";
  document.querySelector("#answer-feedback").classList.remove("is-right");
  document.querySelector("#hint-text").textContent = "";
  const hintButton = document.querySelector("#hint-button");
  hintButton.textContent = "ヒントをひとつ見る";
  hintButton.onclick = null;
  document.querySelector("#puzzle-panel").hidden = false;
  document.querySelector("#reveal-panel").hidden = true;

  const tokens = cipherTokens(activeCard.key, activeCard.puzzle);
  const cipherContainer = document.querySelector("#big-cipher");
  cipherContainer.replaceChildren();
  cipherContainer.className = `big-cipher is-${activeCard.puzzle}`;
  tokens.forEach((token) => {
    const tile = document.createElement("span");
    tile.textContent = token;
    cipherContainer.append(tile);
  });
  cipherContainer.setAttribute("aria-label", `暗号：${tokens.join("、")}`);
  showView(readerView);
  setTimeout(() => document.querySelector("#answer-input")?.focus(), 120);
}

function revealCard() {
  const puzzlePanel = document.querySelector("#puzzle-panel");
  const revealPanel = document.querySelector("#reveal-panel");
  const visual = document.querySelector("#reveal-visual");
  puzzlePanel.hidden = true;
  revealPanel.hidden = false;
  visual.replaceChildren();
  visual.className = "reveal-visual";
  visual.style.setProperty("--card-color", themeColors[activeCard.theme] || themeColors.plum);
  if (activeCard.image?.startsWith("data:image/")) {
    const image = document.createElement("img");
    image.src = activeCard.image;
    image.alt = activeCard.message;
    visual.append(image);
  } else {
    visual.classList.add("is-default");
  }
  document.querySelector("#reveal-message").textContent = activeCard.message;
  document.querySelector("#starter-text").textContent = conversationStarter(activeCard.category);
  revealPanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

function conversationStarter(category) {
  const starters = {
    つくったもの: "「これ、どうやってつくったの？」", できるようになったこと: "「いつから練習してたの？」",
    今日うれしかったこと: "「どんなところがうれしかった？」", 最近好きなもの: "「どこがいちばん好き？」",
    がんばったこと: "「どんなところをがんばったの？」", ひそかな特技: "「いつ気づいたの？」",
    おすすめしたいもの: "「どこがおすすめ？」", 行ってみた場所: "「どんな場所だった？」",
    はじめてやったこと: "「やってみてどうだった？」", 伝えたいありがとう: "「その話、もう少し聞いてもいい？」",
  };
  return starters[category] || "「もう少し聞いてもいい？」";
}

function hintMessage(level) {
  const key = normalizeAnswer(activeCard.key);
  if (level === 1) return activeCard.hint ? `ヒント：${activeCard.hint}` : puzzleTypes[activeCard.puzzle].rule;
  if (level === 2) return `答えは${[...key].length}文字。最初は「${[...key][0]}」です。`;
  return `答えは「${key}」。そのままひらけます。`;
}

function encodePayload(payload) {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodePayload(encoded) {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((encoded.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function encodeCard(card) {
  return encodePayload(normalizeCard(card));
}

function decodeCard(encoded) {
  const card = normalizeCard(decodePayload(encoded));
  if (!card.message || !card.key) throw new Error("Invalid card");
  return card;
}

function encodeRoom(room) {
  return encodePayload(normalizeRoom(room));
}

function decodeRoom(encoded) {
  const room = normalizeRoom(decodePayload(encoded));
  if (!room.cards.length) throw new Error("Invalid room");
  return room;
}

function loadStoredPublicCards() {
  try {
    const cards = JSON.parse(localStorage.getItem(PUBLIC_STORAGE_KEY) || "[]");
    return Array.isArray(cards) ? cards.map(normalizeCard).filter((card) => card.message && card.key) : [];
  } catch {
    return [];
  }
}

function storePublicCard(card) {
  const cards = loadStoredPublicCards();
  const compactCard = { ...card, image: card.image?.length > 70000 ? "" : card.image };
  try {
    localStorage.setItem(PUBLIC_STORAGE_KEY, JSON.stringify([compactCard, ...cards].slice(0, 12)));
  } catch {
    localStorage.setItem(PUBLIC_STORAGE_KEY, JSON.stringify([{ ...compactCard, image: "" }, ...cards.slice(0, 5)]));
  }
}

function createCardButton(card, origin, index = 0, extraClass = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `feed-card ${extraClass}`.trim();
  button.style.setProperty("--feed-color", themeColors[card.theme] || themeColors.plum);
  button.style.setProperty("--feed-delay", `${(index % 5) * -0.7}s`);
  const top = document.createElement("span");
  top.className = "feed-card-top";
  const category = document.createElement("span");
  category.className = "category-pill";
  category.textContent = card.category;
  const author = document.createElement("span");
  author.className = "quiet-label";
  author.textContent = `from ${card.author || "匿名"}`;
  top.append(category, author);
  const title = document.createElement("strong");
  title.textContent = card.teaser;
  const cipher = document.createElement("span");
  cipher.className = "feed-cipher";
  cipher.textContent = encodeKey(card.key, card.puzzle);
  const bottom = document.createElement("span");
  bottom.className = "feed-card-bottom";
  bottom.textContent = `${puzzleTypes[card.puzzle].label}  ↗`;
  button.append(top, title, cipher, bottom);
  button.addEventListener("click", () => openReader(card, origin));
  return button;
}

function renderPublicFeed() {
  const feed = document.querySelector("#public-feed");
  const cards = [...loadStoredPublicCards(), ...publicSamples];
  feed.replaceChildren(...cards.map((card, index) => createCardButton(card, "feed", index)));
}

function renderRoom(room) {
  const cards = document.querySelector("#room-cards");
  document.querySelector("#room-count").textContent = room.cards.length;
  cards.replaceChildren(...room.cards.map((card, index) => createCardButton(card, "room", index, "room-card")));
  document.querySelector("#add-room-card-button").disabled = room.cards.length >= ROOM_CARD_LIMIT;
}

async function compressImage(file) {
  if (!file) return "";
  if (!file.type.startsWith("image/")) throw new Error("画像ファイルを選んでください。");
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 560 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  let dataUrl = canvas.toDataURL("image/webp", 0.7);
  if (dataUrl.length > 90000) dataUrl = canvas.toDataURL("image/jpeg", 0.48);
  if (dataUrl.length > 125000) throw new Error("写真が大きすぎます。別の写真を選んでください。");
  return dataUrl;
}

function renderCompleteCard(card) {
  const container = document.querySelector("#complete-card");
  container.style.background = themeColors[card.theme] || themeColors.plum;
  container.replaceChildren();
  const meta = document.createElement("p");
  meta.textContent = `${card.category}  ·  from ${card.author || "匿名"}`;
  const title = document.createElement("strong");
  title.textContent = card.teaser;
  container.append(meta, title);
  const isPublic = card.visibility === "public";
  const joinedRoom = !isPublic && creatorRoom;
  document.querySelector("#complete-title").textContent = isPublic
    ? "みんなに流すカードが\nできました。"
    : joinedRoom
      ? "部屋にカードを\n置きました。"
      : "なかまの部屋が\nできました。";
  document.querySelector("#copy-link-button").textContent = isPublic ? "カードのURLをコピー" : "部屋のURLをコピー";
  document.querySelector("#preview-card-button").textContent = isPublic ? "受け手の画面をためす" : "部屋を見る";
  document.querySelector("#view-feed-button").hidden = !isPublic;
  document.querySelector("#share-note").textContent = isPublic
    ? "公開フィードとURLの両方から見られます。"
    : "このURLを知っている仲間だけが、部屋に入れます。";
}

function selectedPuzzle() {
  return document.querySelector('input[name="puzzle"]:checked').value;
}

function updateCipherPreview() {
  document.querySelector("#create-cipher-preview").textContent = encodeKey(document.querySelector("#create-key").value, selectedPuzzle()) || "—";
}

function syncCategoryField() {
  const isOther = document.querySelector("#create-category").value === "その他";
  const input = document.querySelector("#create-custom-category");
  document.querySelector("#custom-category-field").hidden = !isOther;
  input.required = isOther;
  if (!isOther) input.value = "";
}

function syncAnonymousField() {
  const anonymous = document.querySelector("#create-anonymous").checked;
  document.querySelector("#author-field").hidden = anonymous;
  if (anonymous) document.querySelector("#create-author").value = "";
}

document.querySelectorAll("[data-go-home]").forEach((button) => button.addEventListener("click", () => openHome()));
document.querySelectorAll("[data-reader-back]").forEach((button) => button.addEventListener("click", () => {
  if (readerReturn === "feed") openFeed();
  else if (readerReturn === "room" && activeRoom) openRoom(activeRoom);
  else openHome();
}));
document.querySelectorAll("[data-open-create]").forEach((button) => button.addEventListener("click", () => openCreator()));
document.querySelector("[data-creator-back]").addEventListener("click", () => (creatorRoom ? openRoom(creatorRoom) : openHome()));
document.querySelectorAll("[data-open-feed]").forEach((button) => button.addEventListener("click", openFeed));
document.querySelectorAll("[data-open-sample]").forEach((button) => button.addEventListener("click", () => openReader(sampleCard)));
document.querySelectorAll("[data-open-sample-room]").forEach((button) => button.addEventListener("click", () => openRoom(sampleRoom)));
document.querySelector("#add-room-card-button").addEventListener("click", () => openCreator(activeRoom));

document.querySelector("#answer-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = normalizeAnswer(document.querySelector("#answer-input").value);
  const feedback = document.querySelector("#answer-feedback");
  if (answer === normalizeAnswer(activeCard.key)) {
    feedback.textContent = "ほどけた！";
    feedback.classList.add("is-right");
    setTimeout(revealCard, 430);
  } else {
    feedback.textContent = "おしい！ ヒントも使えるよ。";
    feedback.classList.remove("is-right");
  }
});

document.querySelector("#hint-button").addEventListener("click", () => {
  hintLevel = Math.min(3, hintLevel + 1);
  document.querySelector("#hint-text").textContent = hintMessage(hintLevel);
  const button = document.querySelector("#hint-button");
  if (hintLevel < 3) {
    button.textContent = "もうひとつ見る";
  } else {
    button.textContent = "答えでひらく";
    button.onclick = () => {
      document.querySelector("#answer-input").value = activeCard.key;
      revealCard();
    };
  }
});

const messageInput = document.querySelector("#create-message");
const keyInput = document.querySelector("#create-key");
const imageInput = document.querySelector("#create-image");

function updateCount(input, output) {
  document.querySelector(output).textContent = [...input.value].length;
}

messageInput.addEventListener("input", () => updateCount(messageInput, "#message-count"));
keyInput.addEventListener("input", updateCipherPreview);
document.querySelectorAll('input[name="puzzle"]').forEach((input) => input.addEventListener("change", updateCipherPreview));
document.querySelector("#create-category").addEventListener("change", syncCategoryField);
document.querySelector("#create-anonymous").addEventListener("change", syncAnonymousField);
imageInput.addEventListener("change", () => { document.querySelector("#file-label").textContent = imageInput.files[0]?.name || "写真をえらぶ"; });

document.querySelector("#create-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = event.submitter;
  const originalText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.textContent = "カードをつくっています…";
  try {
    const normalizedKey = normalizeAnswer(keyInput.value);
    if ([...normalizedKey].length < 2) {
      keyInput.setCustomValidity("あいことばは2文字以上にしてください。");
      keyInput.reportValidity();
      return;
    }
    keyInput.setCustomValidity("");
    const categorySelect = document.querySelector("#create-category");
    const category = categorySelect.value === "その他" ? document.querySelector("#create-custom-category").value.trim() : categorySelect.value;
    const image = await compressImage(imageInput.files[0]);
    const visibility = creatorRoom ? "limited" : document.querySelector('input[name="visibility"]:checked').value;
    createdCard = normalizeCard({
      version: 2,
      author: document.querySelector("#create-anonymous").checked ? "" : document.querySelector("#create-author").value.trim(),
      category,
      teaser: teaserForCategory(category),
      message: messageInput.value.trim(),
      key: normalizedKey,
      hint: document.querySelector("#create-hint").value.trim(),
      puzzle: selectedPuzzle(),
      visibility,
      theme: document.querySelector('input[name="theme"]:checked').value,
      image,
    });
    if (createdCard.visibility === "public") {
      storePublicCard(createdCard);
      createdRoom = null;
      createdLink = `${location.origin}${location.pathname}#card=${encodeCard(createdCard)}`;
    } else {
      createdRoom = normalizeRoom({
        id: creatorRoom?.id,
        cards: [...(creatorRoom?.cards || []), createdCard],
      });
      createdLink = roomLink(createdRoom);
    }
    renderCompleteCard(createdCard);
    document.querySelector("#copy-status").textContent = "";
    showView(completeView);
  } catch (error) {
    window.alert(error.message || "カードをつくれませんでした。もう一度お試しください。");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalText;
  }
});

async function copyLink(link, status) {
  try {
    await navigator.clipboard.writeText(link);
    status.textContent = "URLをコピーしました。";
  } catch {
    window.prompt("このURLをコピーしてください", link);
  }
}

document.querySelector("#copy-link-button").addEventListener("click", () => {
  copyLink(createdLink, document.querySelector("#copy-status"));
});

document.querySelector("#preview-card-button").addEventListener("click", () => {
  if (createdRoom) {
    openRoom(createdRoom);
    return;
  }
  history.replaceState(null, "", `#card=${encodeCard(createdCard)}`);
  openReader(createdCard);
});
document.querySelector("#view-feed-button").addEventListener("click", openFeed);
document.querySelector("#copy-room-link-button").addEventListener("click", () => {
  if (!activeRoom) return;
  copyLink(roomLink(activeRoom), document.querySelector("#room-copy-status"));
});

function openSharedHash() {
  if (location.hash.startsWith("#room=")) {
    openRoom(decodeRoom(location.hash.slice(6)), { updateHash: false });
    return true;
  }
  if (location.hash.startsWith("#card=")) {
    openReader(decodeCard(location.hash.slice(6)));
    return true;
  }
  return false;
}

window.addEventListener("hashchange", () => {
  try {
    if (!openSharedHash()) openHome({ clearHash: false });
  } catch {
    openHome({ clearHash: true });
  }
});

function initialize() {
  updateCount(messageInput, "#message-count");
  updateCipherPreview();
  syncCategoryField();
  syncAnonymousField();
  renderPublicFeed();
  try {
    if (openSharedHash()) return;
  } catch {
    history.replaceState(null, "", location.pathname + location.search);
  }
  openHome({ clearHash: false });
}

initialize();
