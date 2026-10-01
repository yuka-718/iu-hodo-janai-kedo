const themeColors = {
  plum: "#f8b8d2",
  green: "#bfe8d8",
  blue: "#b9d5f4",
  orange: "#ffd1ad",
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
  category: "今日うれしかったこと",
  teaser: "ちょっとうれしかったこと。",
  message: "散歩の途中で、小さな花を見つけた。",
  key: "はな",
  hint: "道ばたに咲いているもの",
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
  isSample: true,
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
const ROOM_CARD_LIMIT = 8;
const CLIENT_TOKEN_KEY = "iu-hodo-client-token-v1";
const backendConfig = window.IU_HODO_CONFIG || {};
const SUPABASE_URL = String(backendConfig.supabaseUrl || "").replace(/\/$/, "");
const SUPABASE_KEY = String(backendConfig.supabaseKey || "");
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
let editingCard = null;
let editingOrigin = "home";

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
    id: card.id && UUID_PATTERN.test(String(card.id)) ? String(card.id) : "",
    roomToken: card.roomToken || card.room_token || "",
    author: String(card.author || "").slice(0, 12),
    category,
    teaser: String(card.teaser || teaserForCategory(category)).slice(0, 42),
    message: String(card.message || "").slice(0, 100),
    key: String(card.key || card.answer || "").slice(0, 12),
    hint: String(card.hint || "").slice(0, 36),
    puzzle: puzzleTypes[card.puzzle] ? card.puzzle : "shift",
    visibility: card.visibility === "public" ? "public" : "limited",
    theme: themeColors[card.theme] ? card.theme : "plum",
    image: typeof card.image === "string" && card.image.startsWith("data:image/") ? card.image : "",
    createdAt: card.createdAt || card.created_at || "",
    updatedAt: card.updatedAt || card.updated_at || "",
    isOwner: Boolean(card.isOwner ?? card.is_owner),
  };
}

function formatRelativeTime(value) {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "";
  const elapsed = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(elapsed / 60000);
  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}日前`;
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function refreshRelativeTimes() {
  document.querySelectorAll("time[data-created-at]").forEach((element) => {
    element.textContent = formatRelativeTime(element.dataset.createdAt);
  });
}

function normalizeRoom(room) {
  const cards = Array.isArray(room?.cards)
    ? room.cards.map(normalizeCard).filter((card) => card.message && card.key).slice(0, ROOM_CARD_LIMIT)
    : [];
  return {
    version: 1,
    id: String(room?.id || crypto.randomUUID?.() || Date.now()).slice(0, 48),
    isSample: Boolean(room?.isSample),
    cards: cards.map((card) => ({ ...card, visibility: "limited" })),
  };
}

function getClientToken() {
  try {
    let token = localStorage.getItem(CLIENT_TOKEN_KEY);
    if (!token || token.length < 20) {
      token = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
      localStorage.setItem(CLIENT_TOKEN_KEY, token);
    }
    return token;
  } catch {
    return `${crypto.randomUUID()}-${crypto.randomUUID()}`;
  }
}

async function callBackend(functionName, body = {}) {
  if (!SUPABASE_URL || !SUPABASE_KEY) throw new Error("公開サービスへ接続できません。");
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    const message = String(detail.message || "");
    if (message.includes("rate limit")) throw new Error("短時間の投稿が多いため、少し待ってから試してください。");
    if (message.includes("room is full")) throw new Error("この部屋には8枚まで置けます。");
    if (message.includes("not card owner")) throw new Error("このカードは、この端末からは変更できません。");
    throw new Error("公開サービスへ保存できませんでした。少し待ってから試してください。");
  }
  return response.status === 204 ? [] : response.json();
}

async function loadPublicCards() {
  const rows = await callBackend("get_public_cards_v2", { p_client_token: getClientToken() });
  return rows.map(normalizeCard).filter((card) => card.id && card.message && card.key);
}

async function loadRoomCards(roomToken) {
  if (!UUID_PATTERN.test(roomToken)) throw new Error("Invalid room");
  const rows = await callBackend("get_room_cards_v2", { p_room_token: roomToken, p_client_token: getClientToken() });
  if (!rows.length) throw new Error("Room not found");
  return normalizeRoom({ id: roomToken, cards: rows });
}

async function loadPublicCard(cardId) {
  if (!UUID_PATTERN.test(cardId)) throw new Error("Invalid card");
  const rows = await callBackend("get_card_v2", { p_card_id: cardId, p_client_token: getClientToken() });
  if (!rows.length) throw new Error("Card not found");
  return normalizeCard(rows[0]);
}

async function saveCard(card, roomToken = null) {
  const rows = await callBackend("create_card", {
    p_visibility: card.visibility,
    p_room_token: roomToken,
    p_author: card.author,
    p_category: card.category,
    p_teaser: card.teaser,
    p_message: card.message,
    p_answer: card.key,
    p_hint: card.hint,
    p_puzzle: card.puzzle,
    p_theme: card.theme,
    p_client_token: getClientToken(),
  });
  if (!rows.length) throw new Error("カードを保存できませんでした。");
  return rows[0];
}

async function updateOwnCard(card) {
  const rows = await callBackend("update_card", {
    p_card_id: card.id,
    p_author: card.author,
    p_category: card.category,
    p_teaser: card.teaser,
    p_message: card.message,
    p_answer: card.key,
    p_hint: card.hint,
    p_puzzle: card.puzzle,
    p_theme: card.theme,
    p_client_token: getClientToken(),
  });
  if (!rows.length) throw new Error("カードを変更できませんでした。");
  return rows[0];
}

async function removeOwnCard(card) {
  const rows = await callBackend("delete_card", {
    p_card_id: card.id,
    p_client_token: getClientToken(),
  });
  if (!rows.length) throw new Error("カードを削除できませんでした。");
  return rows[0];
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
  editingCard = null;
  editingOrigin = "home";
  creatorRoom = room?.cards ? normalizeRoom(room) : null;
  if (!creatorRoom) clearSharedHash();
  resetCreatorForm();
  const publicOption = document.querySelector('input[name="visibility"][value="public"]');
  const limitedOption = document.querySelector('input[name="visibility"][value="limited"]');
  const visibilityFieldset = document.querySelector("#visibility-fieldset");
  publicOption.disabled = false;
  limitedOption.disabled = false;
  publicOption.disabled = Boolean(creatorRoom);
  limitedOption.checked = Boolean(creatorRoom) || limitedOption.checked;
  visibilityFieldset.classList.toggle("is-room-mode", Boolean(creatorRoom));
  document.querySelector("#visibility-note").textContent = creatorRoom
    ? "この部屋に、限定公開で置きます。"
    : "限定公開は共有URLへ、公開はみんなのフィードへ。";
  document.querySelector("#create-title").innerHTML = creatorRoom
    ? "この部屋に、<br />ひとつだけ。"
    : "言うほどじゃないことを、<br />ひとつだけ。";
  document.querySelector("#create-eyebrow").lastChild.textContent = " MAKE YOUR CARD";
  document.querySelector("#create-submit-button").innerHTML = 'カードをつくる <span aria-hidden="true">→</span>';
  showView(createView);
  setTimeout(() => document.querySelector("#create-category")?.focus(), 0);
}

function populateCreatorForm(card) {
  const categorySelect = document.querySelector("#create-category");
  const standardCategory = [...categorySelect.options].some((option) => option.value === card.category && option.value !== "その他");
  categorySelect.value = standardCategory ? card.category : "その他";
  document.querySelector("#create-custom-category").value = standardCategory ? "" : card.category;
  document.querySelector("#create-anonymous").checked = !card.author;
  document.querySelector("#create-author").value = card.author;
  document.querySelector("#create-message").value = card.message;
  document.querySelector("#create-key").value = card.key;
  document.querySelector("#create-hint").value = card.hint;
  document.querySelector(`input[name="puzzle"][value="${card.puzzle}"]`).checked = true;
  document.querySelector(`input[name="visibility"][value="${card.visibility}"]`).checked = true;
  document.querySelector(`input[name="theme"][value="${card.theme}"]`).checked = true;
  document.querySelector("#create-agreement").checked = true;
  updateCount(document.querySelector("#create-message"), "#message-count");
  syncCategoryField();
  if (!standardCategory) document.querySelector("#create-custom-category").value = card.category;
  syncAnonymousField();
  if (card.author) document.querySelector("#create-author").value = card.author;
  updateCipherPreview();
}

function openEditor(card, origin = "home") {
  const normalized = normalizeCard(card);
  if (!normalized.id || !normalized.isOwner) return;
  editingCard = normalized;
  editingOrigin = origin;
  creatorRoom = null;
  resetCreatorForm();
  populateCreatorForm(normalized);
  document.querySelectorAll('input[name="visibility"]').forEach((input) => { input.disabled = true; });
  document.querySelector("#visibility-fieldset").classList.add("is-room-mode");
  document.querySelector("#visibility-note").textContent = "公開範囲はそのまま、内容だけ変更できます。";
  document.querySelector("#create-title").innerHTML = "カードを、<br />ちょっと整える。";
  document.querySelector("#create-eyebrow").lastChild.textContent = " EDIT YOUR CARD";
  document.querySelector("#create-submit-button").innerHTML = '変更を保存 <span aria-hidden="true">→</span>';
  showView(createView);
  setTimeout(() => document.querySelector("#create-message")?.focus(), 0);
}

function leaveCreator() {
  if (!editingCard) {
    if (creatorRoom) openRoom(creatorRoom);
    else openHome();
    return;
  }
  if (editingOrigin === "feed") openFeed();
  else if (editingOrigin === "room" && activeRoom) openRoom(activeRoom);
  else if (editingOrigin === "complete") {
    renderCompleteCard(createdCard);
    showView(completeView);
  } else openReader(editingCard, editingOrigin);
}

async function openFeed() {
  clearSharedHash();
  showView(feedView);
  const feed = document.querySelector("#public-feed");
  const status = document.querySelector("#feed-status");
  feed.replaceChildren();
  status.textContent = "公開カードを読み込んでいます…";
  try {
    const cards = await loadPublicCards();
    renderPublicFeed(cards);
    status.textContent = cards.length
      ? "いま公開されているカードとサンプルです。"
      : "まだ公開カードはありません。サンプルを表示しています。";
  } catch {
    renderPublicFeed([]);
    status.textContent = "公開カードを読み込めませんでした。サンプルを表示しています。";
  }
}

function roomLink(room) {
  return `${location.origin}${location.pathname}#room=${encodeURIComponent(room.id)}`;
}

async function openRoom(roomOrToken, { updateHash = true } = {}) {
  showView(roomView);
  document.querySelector("#room-cards").replaceChildren();
  document.querySelector("#room-count").textContent = "…";
  try {
    if (typeof roomOrToken === "string") {
      activeRoom = roomOrToken === "sample-room" ? normalizeRoom(sampleRoom) : await loadRoomCards(roomOrToken);
    } else {
      activeRoom = normalizeRoom(roomOrToken);
    }
    renderRoom(activeRoom);
    if (updateHash) history.replaceState(null, "", `#room=${encodeURIComponent(activeRoom.id)}`);
  } catch {
    openHome({ clearHash: true });
    window.alert("この部屋を開けませんでした。URLを確認してください。");
  }
}

function openReader(card, origin = "home") {
  activeCard = normalizeCard(card);
  readerReturn = origin;
  hintLevel = 0;
  const meta = puzzleTypes[activeCard.puzzle];
  const relativeTime = formatRelativeTime(activeCard.createdAt);
  document.querySelector("#reader-from").textContent = `from ${activeCard.author || "匿名"}${relativeTime ? ` · ${relativeTime}` : ""}`;
  document.querySelector("#reader-title").textContent = activeCard.teaser;
  document.querySelector("#reader-category").textContent = activeCard.category;
  document.querySelector("#reader-owner-actions").hidden = !activeCard.isOwner;
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
  setTimeout(() => document.querySelector("#answer-input")?.focus({ preventScroll: true }), 120);
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
  revealPanel.scrollIntoView({ behavior: "smooth", block: "center" });
}

function hintMessage(level) {
  const key = normalizeAnswer(activeCard.key);
  if (level === 1) return activeCard.hint ? `ヒント：${activeCard.hint}` : puzzleTypes[activeCard.puzzle].rule;
  if (level === 2) return `答えは${[...key].length}文字。最初は「${[...key][0]}」です。`;
  return `答えは「${key}」。そのままひらけます。`;
}

function decodePayload(encoded) {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((encoded.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function decodeCard(encoded) {
  const card = normalizeCard(decodePayload(encoded));
  if (!card.message || !card.key) throw new Error("Invalid card");
  return card;
}

function decodeRoom(encoded) {
  const room = normalizeRoom(decodePayload(encoded));
  if (!room.cards.length) throw new Error("Invalid room");
  return room;
}

function createCardButton(card, origin, index = 0, extraClass = "", isSample = false) {
  const shell = document.createElement("article");
  shell.className = "feed-card-shell";
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
  if (isSample) {
    author.textContent = `サンプル · from ${card.author || "匿名"}`;
  } else {
    const byline = document.createElement("span");
    byline.textContent = `from ${card.author || "匿名"}`;
    author.append(byline);
    if (card.createdAt) {
      const time = document.createElement("time");
      time.dateTime = card.createdAt;
      time.dataset.createdAt = card.createdAt;
      time.title = new Date(card.createdAt).toLocaleString("ja-JP");
      time.textContent = formatRelativeTime(card.createdAt);
      author.append(" · ", time);
    }
  }
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
  shell.append(button);
  if (!isSample && card.isOwner && card.id) shell.append(createOwnerActions(card, origin));
  return shell;
}

function createOwnerActions(card, origin) {
  const actions = document.createElement("div");
  actions.className = "owner-actions";
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "owner-action";
  editButton.textContent = "編集";
  editButton.addEventListener("click", () => openEditor(card, origin));
  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "owner-action owner-action-delete";
  deleteButton.textContent = "削除";
  deleteButton.addEventListener("click", () => deleteOwnCard(card, origin));
  actions.append(editButton, deleteButton);
  return actions;
}

async function deleteOwnCard(card, origin = "home") {
  if (!card?.id || !card.isOwner) return;
  if (!window.confirm("このカードを削除しますか？\n削除すると元には戻せません。")) return;
  try {
    await removeOwnCard(card);
    if (origin === "feed") {
      await openFeed();
    } else if (origin === "room" && activeRoom) {
      activeRoom.cards = activeRoom.cards.filter((candidate) => candidate.id !== card.id);
      if (activeRoom.cards.length) renderRoom(activeRoom);
      else {
        openHome({ clearHash: true });
        window.alert("カードを削除しました。部屋が空になったため、トップへ戻ります。");
      }
    } else {
      openHome({ clearHash: true });
      window.alert("カードを削除しました。");
    }
  } catch (error) {
    window.alert(error.message || "カードを削除できませんでした。");
  }
}

function renderPublicFeed(cards) {
  const feed = document.querySelector("#public-feed");
  const publicButtons = cards.map((card, index) => createCardButton(card, "feed", index));
  const sampleButtons = publicSamples.map((card, index) => createCardButton(card, "feed", cards.length + index, "", true));
  feed.replaceChildren(...publicButtons, ...sampleButtons);
  refreshRelativeTimes();
}

function renderRoom(room) {
  const cards = document.querySelector("#room-cards");
  document.querySelector("#room-count").textContent = room.cards.length;
  cards.replaceChildren(...room.cards.map((card, index) => createCardButton(card, "room", index, "room-card")));
  document.querySelector("#add-room-card-button").disabled = room.cards.length >= ROOM_CARD_LIMIT;
  refreshRelativeTimes();
}

function renderCompleteCard(card, { edited = false } = {}) {
  const container = document.querySelector("#complete-card");
  container.style.background = themeColors[card.theme] || themeColors.plum;
  container.replaceChildren();
  const meta = document.createElement("p");
  const relativeTime = formatRelativeTime(card.createdAt);
  meta.textContent = `${card.category}  ·  from ${card.author || "匿名"}${relativeTime ? `  ·  ${relativeTime}` : ""}`;
  const title = document.createElement("strong");
  title.textContent = card.teaser;
  container.append(meta, title);
  const isPublic = card.visibility === "public";
  const joinedRoom = !isPublic && creatorRoom;
  document.querySelector("#complete-title").textContent = edited
    ? "カードを\n更新しました。"
    : isPublic
      ? "みんなに流すカードが\nできました。"
      : joinedRoom
        ? "部屋にカードを\n置きました。"
        : "なかまの部屋が\nできました。";
  document.querySelector("#copy-link-button").textContent = isPublic ? "カードのURLをコピー" : "部屋のURLをコピー";
  document.querySelector("#preview-card-button").textContent = isPublic ? "受け手の画面をためす" : "部屋を見る";
  document.querySelector("#view-feed-button").hidden = !isPublic;
  document.querySelector("#share-note").textContent = isPublic
    ? "公開フィードと共有URLの両方から、ほかの端末でも見られます。"
    : "この共有URLを知っている人は、部屋を開くことができます。";
  document.querySelector("#complete-edit-button").hidden = !card.isOwner;
  document.querySelector("#complete-delete-button").hidden = !card.isOwner;
}

function selectedPuzzle() {
  return document.querySelector('input[name="puzzle"]:checked').value;
}

function updateCipherPreview() {
  const normalizedKey = normalizeAnswer(document.querySelector("#create-key").value);
  document.querySelector("#create-cipher-preview").textContent = normalizedKey && !isSupportedKey(normalizedKey)
    ? "使えない文字があります"
    : encodeKey(normalizedKey, selectedPuzzle()) || "—";
}

function isSupportedKey(value) {
  return [...value].every((character) => kana.includes(character) || /^[a-z0-9]$/.test(character));
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
  const authorInput = document.querySelector("#create-author");
  document.querySelector("#author-field").hidden = anonymous;
  authorInput.required = !anonymous;
  if (anonymous) authorInput.value = "";
}

function resetCreatorForm() {
  const form = document.querySelector("#create-form");
  form.reset();
  document.querySelector("#create-agreement").checked = false;
  document.querySelector("#create-key").setCustomValidity("");
  document.querySelector("#create-author").setCustomValidity("");
  updateCount(document.querySelector("#create-message"), "#message-count");
  syncCategoryField();
  syncAnonymousField();
  updateCipherPreview();
}

document.querySelectorAll("[data-go-home]").forEach((button) => button.addEventListener("click", () => openHome()));
document.querySelectorAll("[data-reader-back]").forEach((button) => button.addEventListener("click", () => {
  if (readerReturn === "feed") openFeed();
  else if (readerReturn === "room" && activeRoom) openRoom(activeRoom);
  else openHome();
}));
document.querySelectorAll("[data-open-create]").forEach((button) => button.addEventListener("click", () => openCreator()));
document.querySelector("[data-creator-back]").addEventListener("click", leaveCreator);
document.querySelectorAll("[data-open-feed]").forEach((button) => button.addEventListener("click", openFeed));
document.querySelectorAll("[data-open-sample]").forEach((button) => button.addEventListener("click", () => openReader(sampleCard)));
document.querySelectorAll("[data-open-sample-room]").forEach((button) => button.addEventListener("click", () => openRoom(sampleRoom)));
document.querySelector("#add-room-card-button").addEventListener("click", () => openCreator(activeRoom?.isSample ? null : activeRoom));
document.querySelector("#reader-edit-button").addEventListener("click", () => openEditor(activeCard, readerReturn));
document.querySelector("#reader-delete-button").addEventListener("click", () => deleteOwnCard(activeCard, readerReturn));

document.querySelector("#answer-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const answer = normalizeAnswer(document.querySelector("#answer-input").value);
  const feedback = document.querySelector("#answer-feedback");
  if (!answer) {
    feedback.textContent = "答えを入力してね。";
    feedback.classList.remove("is-right");
    return;
  }
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

function updateCount(input, output) {
  document.querySelector(output).textContent = [...input.value].length;
}

messageInput.addEventListener("input", () => updateCount(messageInput, "#message-count"));
keyInput.addEventListener("input", () => {
  keyInput.setCustomValidity("");
  updateCipherPreview();
});
document.querySelectorAll('input[name="puzzle"]').forEach((input) => input.addEventListener("change", updateCipherPreview));
document.querySelector("#create-category").addEventListener("change", syncCategoryField);
document.querySelector("#create-anonymous").addEventListener("change", syncAnonymousField);

document.querySelector("#create-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const submitButton = event.submitter;
  const originalText = submitButton.innerHTML;
  const cardBeingEdited = editingCard;
  submitButton.disabled = true;
  submitButton.textContent = cardBeingEdited ? "変更を保存しています…" : "カードをつくっています…";
  try {
    const normalizedKey = normalizeAnswer(keyInput.value);
    if ([...normalizedKey].length < 2 || [...normalizedKey].length > 8) {
      keyInput.setCustomValidity("あいことばは2〜8文字にしてください。");
      keyInput.reportValidity();
      return;
    }
    if (!isSupportedKey(normalizedKey)) {
      keyInput.setCustomValidity("ひらがな・カタカナ・英数字だけを使ってください。");
      keyInput.reportValidity();
      return;
    }
    keyInput.setCustomValidity("");
    const categorySelect = document.querySelector("#create-category");
    const category = categorySelect.value === "その他" ? document.querySelector("#create-custom-category").value.trim() : categorySelect.value;
    const visibility = cardBeingEdited
      ? cardBeingEdited.visibility
      : creatorRoom
        ? "limited"
        : document.querySelector('input[name="visibility"]:checked').value;
    createdCard = normalizeCard({
      version: 2,
      id: cardBeingEdited?.id,
      roomToken: cardBeingEdited?.roomToken,
      author: document.querySelector("#create-anonymous").checked ? "" : document.querySelector("#create-author").value.trim(),
      category,
      teaser: teaserForCategory(category),
      message: messageInput.value.trim(),
      key: normalizedKey,
      hint: document.querySelector("#create-hint").value.trim(),
      puzzle: selectedPuzzle(),
      visibility,
      theme: document.querySelector('input[name="theme"]:checked').value,
      image: "",
      createdAt: cardBeingEdited?.createdAt || new Date().toISOString(),
      updatedAt: cardBeingEdited?.updatedAt || "",
      isOwner: Boolean(cardBeingEdited),
    });
    const saved = cardBeingEdited
      ? await updateOwnCard(createdCard)
      : await saveCard(createdCard, createdCard.visibility === "limited" ? creatorRoom?.id || null : null);
    createdCard = normalizeCard({
      ...createdCard,
      id: saved.id,
      roomToken: saved.room_token || createdCard.roomToken,
      updatedAt: saved.updated_at || createdCard.updatedAt,
      isOwner: true,
    });
    if (createdCard.visibility === "public") {
      createdRoom = null;
      createdLink = `${location.origin}${location.pathname}#card=${encodeURIComponent(createdCard.id)}`;
    } else {
      createdRoom = await loadRoomCards(saved.room_token || createdCard.roomToken);
      createdCard = createdRoom.cards.find((card) => card.id === createdCard.id) || createdCard;
      createdLink = roomLink(createdRoom);
    }
    renderCompleteCard(createdCard, { edited: Boolean(cardBeingEdited) });
    editingCard = null;
    editingOrigin = "home";
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
  history.replaceState(null, "", `#card=${encodeURIComponent(createdCard.id)}`);
  openReader(createdCard);
});
document.querySelector("#view-feed-button").addEventListener("click", openFeed);
document.querySelector("#complete-edit-button").addEventListener("click", () => openEditor(createdCard, "complete"));
document.querySelector("#complete-delete-button").addEventListener("click", () => deleteOwnCard(createdCard, "complete"));
document.querySelector("#copy-room-link-button").addEventListener("click", () => {
  if (!activeRoom) return;
  copyLink(roomLink(activeRoom), document.querySelector("#room-copy-status"));
});

async function openSharedHash() {
  if (location.hash.startsWith("#room=")) {
    const roomValue = decodeURIComponent(location.hash.slice(6));
    if (roomValue === "sample-room" || UUID_PATTERN.test(roomValue)) {
      await openRoom(roomValue, { updateHash: false });
    } else {
      await openRoom(decodeRoom(roomValue), { updateHash: false });
    }
    return true;
  }
  if (location.hash.startsWith("#card=")) {
    const cardValue = decodeURIComponent(location.hash.slice(6));
    openReader(UUID_PATTERN.test(cardValue) ? await loadPublicCard(cardValue) : decodeCard(cardValue));
    return true;
  }
  return false;
}

window.addEventListener("hashchange", async () => {
  try {
    if (!(await openSharedHash())) openHome({ clearHash: false });
  } catch {
    openHome({ clearHash: true });
  }
});

async function initialize() {
  updateCount(messageInput, "#message-count");
  updateCipherPreview();
  syncCategoryField();
  syncAnonymousField();
  try {
    if (await openSharedHash()) return;
  } catch {
    history.replaceState(null, "", location.pathname + location.search);
  }
  openHome({ clearHash: false });
}

initialize();
setInterval(refreshRelativeTimes, 30000);
