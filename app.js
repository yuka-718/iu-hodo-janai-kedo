const sampleCard = {
  version: 1,
  author: "ゆか",
  category: "つくったもの",
  teaser: "ちょっとうれしかったこと。",
  message: "この服、じつは自分でつくった。",
  key: "ふく",
  hint: "身につけるもの",
  theme: "plum",
  image: "",
};

const themeColors = {
  plum: "#d88fb3",
  green: "#97c9b7",
  blue: "#a6b5e3",
  orange: "#f2a37d",
};

const kana = [
  ..."あいうえお",
  ..."かきくけこ",
  ..."さしすせそ",
  ..."たちつてと",
  ..."なにぬねの",
  ..."はひふへほ",
  ..."まみむめも",
  ..."やゆよ",
  ..."らりるれろ",
  ..."わをん",
  ..."がぎぐげご",
  ..."ざじずぜぞ",
  ..."だぢづでど",
  ..."ばびぶべぼ",
  ..."ぱぴぷぺぽ",
  ..."ぁぃぅぇぉゃゅょっ",
];

const views = [...document.querySelectorAll(".view")];
const homeView = document.querySelector("#home-view");
const readerView = document.querySelector("#reader-view");
const createView = document.querySelector("#create-view");
const completeView = document.querySelector("#complete-view");
const siteHeader = document.querySelector(".site-header");
const siteFooter = document.querySelector(".site-footer");

let activeCard = sampleCard;
let createdCard = null;
let createdLink = "";
let hintLevel = 0;

function shiftCharacter(character, amount = 1) {
  const hiraganaCharacter = katakanaToHiragana(character);
  const kanaIndex = kana.indexOf(hiraganaCharacter);
  if (kanaIndex >= 0) {
    return kana[(kanaIndex + amount + kana.length) % kana.length];
  }

  if (/[a-z]/i.test(character)) {
    const isUppercase = character === character.toUpperCase();
    const start = isUppercase ? 65 : 97;
    return String.fromCharCode(((character.charCodeAt(0) - start + amount + 26) % 26) + start);
  }

  if (/\d/.test(character)) {
    return String((Number(character) + amount + 10) % 10);
  }

  return character;
}

function encodeKey(key) {
  return [...normalizeAnswer(key)].map((character) => shiftCharacter(character, 1)).join("");
}

function katakanaToHiragana(value) {
  return String(value).replace(/[ァ-ヶ]/g, (character) =>
    String.fromCharCode(character.charCodeAt(0) - 0x60),
  );
}

function normalizeAnswer(value) {
  return katakanaToHiragana(String(value).normalize("NFKC").trim().toLowerCase()).replace(/\s+/g, "");
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
  window.scrollTo({ top: 0, behavior: "instant" });
}

function openHome({ clearHash = true } = {}) {
  if (clearHash && location.hash.startsWith("#card=")) {
    history.replaceState(null, "", location.pathname + location.search);
  }
  showView(homeView);
}

function openCreator() {
  if (location.hash.startsWith("#card=")) {
    history.replaceState(null, "", location.pathname + location.search);
  }
  showView(createView);
  setTimeout(() => document.querySelector("#create-category")?.focus(), 0);
}

function openReader(card) {
  activeCard = card;
  hintLevel = 0;

  document.querySelector("#reader-from").textContent = card.author ? `from ${card.author}` : "from someone";
  document.querySelector("#reader-title").textContent = card.teaser;
  document.querySelector("#reader-category").textContent = card.category;
  document.querySelector("#answer-input").value = "";
  document.querySelector("#answer-feedback").textContent = "";
  document.querySelector("#answer-feedback").classList.remove("is-right");
  document.querySelector("#hint-text").textContent = "";
  const hintButton = document.querySelector("#hint-button");
  hintButton.textContent = "ヒントをひとつ見る";
  hintButton.onclick = null;
  document.querySelector("#puzzle-panel").hidden = false;
  document.querySelector("#reveal-panel").hidden = true;

  const cipher = encodeKey(card.key);
  const cipherContainer = document.querySelector("#big-cipher");
  cipherContainer.replaceChildren();
  [...cipher].forEach((character) => {
    const tile = document.createElement("span");
    tile.textContent = character;
    cipherContainer.append(tile);
  });
  cipherContainer.setAttribute("aria-label", `暗号：${[...cipher].join("、")}`);

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
    つくったもの: "「これ、どうやってつくったの？」",
    できるようになったこと: "「いつから練習してたの？」",
    今日うれしかったこと: "「どんなところがうれしかった？」",
    最近好きなもの: "「どこがいちばん好き？」",
    小さな自己紹介: "「もう少し聞いてもいい？」",
  };
  return starters[category] || "「もう少し聞いてもいい？」";
}

function hintMessage(level) {
  const key = normalizeAnswer(activeCard.key);
  const cipher = encodeKey(key);

  if (level === 1) {
    return activeCard.hint ? `ヒント：${activeCard.hint}` : `最初の「${[...cipher][0]}」は「${[...key][0]}」です。`;
  }

  if (level === 2) {
    return `「${[...cipher][0]}」は「${[...key][0]}」。全部で${[...key].length}文字です。`;
  }

  return `答えは「${key}」。そのままひらけます。`;
}

function encodeCard(card) {
  const json = JSON.stringify(card);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeCard(encoded) {
  const padded = encoded.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((encoded.length + 3) % 4);
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const card = JSON.parse(new TextDecoder().decode(bytes));

  if (!card || typeof card !== "object" || !card.teaser || !card.message || !card.key) {
    throw new Error("Invalid card");
  }

  return {
    version: 1,
    author: String(card.author || "").slice(0, 12),
    category: String(card.category || "小さな自己紹介").slice(0, 24),
    teaser: String(card.teaser).slice(0, 42),
    message: String(card.message).slice(0, 100),
    key: String(card.key).slice(0, 12),
    hint: String(card.hint || "").slice(0, 36),
    theme: themeColors[card.theme] ? card.theme : "plum",
    image: typeof card.image === "string" && card.image.startsWith("data:image/") ? card.image : "",
  };
}

async function compressImage(file) {
  if (!file) return "";
  if (!file.type.startsWith("image/")) throw new Error("画像ファイルを選んでください。");

  const bitmap = await createImageBitmap(file);
  const maxDimension = 560;
  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(bitmap.width * scale));
  canvas.height = Math.max(1, Math.round(bitmap.height * scale));
  const context = canvas.getContext("2d");
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let dataUrl = canvas.toDataURL("image/webp", 0.7);
  if (dataUrl.length > 90000) {
    dataUrl = canvas.toDataURL("image/jpeg", 0.48);
  }
  if (dataUrl.length > 125000) {
    throw new Error("写真が大きすぎます。別の写真を選んでください。");
  }
  return dataUrl;
}

function renderCompleteCard(card) {
  const container = document.querySelector("#complete-card");
  container.style.background = themeColors[card.theme] || themeColors.plum;
  container.replaceChildren();
  const meta = document.createElement("p");
  meta.textContent = `${card.category}${card.author ? `  ·  from ${card.author}` : ""}`;
  const title = document.createElement("strong");
  title.textContent = card.teaser;
  container.append(meta, title);
}

document.querySelectorAll("[data-go-home]").forEach((button) => {
  button.addEventListener("click", () => openHome());
});

document.querySelectorAll("[data-open-create]").forEach((button) => {
  button.addEventListener("click", openCreator);
});

document.querySelectorAll("[data-open-sample]").forEach((button) => {
  button.addEventListener("click", () => openReader(sampleCard));
});

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

const teaserInput = document.querySelector("#create-teaser");
const messageInput = document.querySelector("#create-message");
const keyInput = document.querySelector("#create-key");
const imageInput = document.querySelector("#create-image");

function updateCount(input, output) {
  document.querySelector(output).textContent = [...input.value].length;
}

teaserInput.addEventListener("input", () => updateCount(teaserInput, "#teaser-count"));
messageInput.addEventListener("input", () => updateCount(messageInput, "#message-count"));
keyInput.addEventListener("input", () => {
  document.querySelector("#create-cipher-preview").textContent = encodeKey(keyInput.value) || "—";
});

imageInput.addEventListener("change", () => {
  document.querySelector("#file-label").textContent = imageInput.files[0]?.name || "写真をえらぶ";
});

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

    const image = await compressImage(imageInput.files[0]);
    createdCard = {
      version: 1,
      author: document.querySelector("#create-author").value.trim(),
      category: document.querySelector("#create-category").value,
      teaser: teaserInput.value.trim(),
      message: messageInput.value.trim(),
      key: normalizedKey,
      hint: document.querySelector("#create-hint").value.trim(),
      theme: document.querySelector('input[name="theme"]:checked').value,
      image,
    };

    const encoded = encodeCard(createdCard);
    createdLink = `${location.origin}${location.pathname}#card=${encoded}`;
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

document.querySelector("#copy-link-button").addEventListener("click", async () => {
  const status = document.querySelector("#copy-status");
  try {
    await navigator.clipboard.writeText(createdLink);
    status.textContent = "リンクをコピーしました。そっと渡してみてください。";
  } catch {
    window.prompt("このリンクをコピーしてください", createdLink);
  }
});

document.querySelector("#preview-card-button").addEventListener("click", () => {
  history.replaceState(null, "", `#card=${encodeCard(createdCard)}`);
  openReader(createdCard);
});

window.addEventListener("hashchange", () => {
  if (!location.hash.startsWith("#card=")) return;
  try {
    openReader(decodeCard(location.hash.slice(6)));
  } catch {
    openHome({ clearHash: true });
  }
});

function initialize() {
  updateCount(teaserInput, "#teaser-count");
  updateCount(messageInput, "#message-count");

  if (location.hash.startsWith("#card=")) {
    try {
      openReader(decodeCard(location.hash.slice(6)));
      return;
    } catch {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  openHome({ clearHash: false });
}

initialize();
