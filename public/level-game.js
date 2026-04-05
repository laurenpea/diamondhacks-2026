const LEVEL_GAME_API = "http://localhost:3000/api/generate";
const LOCAL_SCORE_KEY = "kp-total-points";

const config = window.levelGameConfig || { level: 1, accentVar: "--electric-moss" };
const dot = document.getElementById("cursor-dot");
const ring = document.getElementById("cursor-ring");
const gameContainer = document.getElementById("gameContainer");
const submitBtn = document.getElementById("submitBtn");
const genBtn = document.getElementById("genBtn");
const resultBox = document.getElementById("resultBox");
const scoreText = document.getElementById("scoreText");
const pointsBreakdown = document.getElementById("pointsBreakdown");
const feedbackText = document.getElementById("feedbackText");
const loadingText = document.getElementById("loadingText");
let correctionsBox = document.getElementById("correctionsBox");

let selectedIds = new Set();
let challengeSentences = [];
let challengeCorrections = [];
let challengeSubmitted = false;
let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

function getStoredPoints() {
  const rawValue = localStorage.getItem(LOCAL_SCORE_KEY);
  const points = Number.parseInt(rawValue ?? "0", 10);
  return Number.isFinite(points) ? points : 0;
}

function setStoredPoints(points) {
  localStorage.setItem(LOCAL_SCORE_KEY, String(points));
}

function updatePointsBadge() {
  let badge = document.getElementById("pointsBadge");

  if (!badge) {
    badge = document.createElement("div");
    badge.id = "pointsBadge";
    badge.className = "fixed top-4 right-4 z-50 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-right shadow-lg backdrop-blur-md";
    badge.innerHTML = `
      <div class="text-[10px] uppercase tracking-[0.25em] text-stone-300">Stored Points</div>
      <div id="pointsBadgeValue" class="text-lg font-bold text-white">0 KP</div>
    `;
    document.body.appendChild(badge);
  }

  const badgeValue = document.getElementById("pointsBadgeValue");
  if (badgeValue) {
    badgeValue.textContent = `${getStoredPoints()} KP`;
  }
}

function addPointsToStorage(points) {
  const updatedTotal = getStoredPoints() + points;
  setStoredPoints(updatedTotal);
  updatePointsBadge();
  return updatedTotal;
}

function ensureCorrectionsBox() {
  if (correctionsBox) return correctionsBox;
  if (!resultBox || !feedbackText) return null;

  correctionsBox = document.createElement("div");
  correctionsBox.id = "correctionsBox";
  correctionsBox.className = "mt-4 border-t border-white/10 pt-4 text-left";
  feedbackText.insertAdjacentElement("afterend", correctionsBox);
  return correctionsBox;
}

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (dot) {
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }
});

function smoothCursor() {
  if (ring) {
    ringX += (mouseX - ringX - 20) * 0.15;
    ringY += (mouseY - ringY - 20) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
  }
  requestAnimationFrame(smoothCursor);
}
smoothCursor();

function bindInteractiveCursor() {
  const interactives = document.querySelectorAll(".nav-link, .sentence-btn, button, input");
  interactives.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      if (!ring) return;
      ring.style.transform = "scale(1.8)";
      ring.style.borderColor = "white";
      ring.style.backgroundColor = `rgba(255, 255, 255, 0.06)`;
    });
    el.addEventListener("mouseleave", () => {
      if (!ring) return;
      ring.style.transform = "scale(1)";
      ring.style.borderColor = `var(${config.accentVar})`;
      ring.style.backgroundColor = "transparent";
    });
  });
}

function setLoadingState(isLoading, message = "Generating challenge...") {
  if (loadingText) {
    loadingText.textContent = message;
    loadingText.classList.toggle("hidden", !isLoading);
  }
  if (genBtn) {
    genBtn.disabled = isLoading;
    genBtn.textContent = isLoading ? "Generating..." : "Generate Text";
  }
}

function clearResults() {
  if (resultBox) {
    resultBox.classList.add("hidden");
  }
  if (scoreText) scoreText.textContent = "";
  if (pointsBreakdown) pointsBreakdown.innerHTML = "";
  if (feedbackText) feedbackText.textContent = "";
  const correctionsEl = ensureCorrectionsBox();
  if (correctionsEl) correctionsEl.innerHTML = "";

  document.querySelectorAll(".glass-vial").forEach((jar) => {
    jar.classList.remove("filled");
  });
}

function createSentenceButton(sentence) {
  const span = document.createElement("span");
  span.className = "sentence-btn";
  span.dataset.id = sentence.id;
  span.dataset.fake = String(sentence.isFalse);
  span.textContent = sentence.text;
  span.addEventListener("click", () => {
    if (submitBtn.disabled) return;
    span.classList.toggle("selected");
    if (selectedIds.has(sentence.id)) {
      selectedIds.delete(sentence.id);
    } else {
      selectedIds.add(sentence.id);
    }
  });
  return span;
}

function renderChallenge(paragraphs) {
  gameContainer.innerHTML = "";
  selectedIds = new Set();
  challengeSubmitted = false;
  clearResults();

  paragraphs.forEach((paragraph, index) => {
    const paragraphEl = document.createElement("p");
    if (index < paragraphs.length - 1) {
      paragraphEl.className = "mb-5";
    }

    paragraph.forEach((sentence) => {
      paragraphEl.appendChild(createSentenceButton(sentence));
      paragraphEl.appendChild(document.createTextNode(" "));
    });

    gameContainer.appendChild(paragraphEl);
  });

  gameContainer.classList.add("manifested");
  submitBtn.disabled = false;
  bindInteractiveCursor();
}

async function generateChallenge() {
  clearResults();
  submitBtn.disabled = true;
  challengeSentences = [];
  setLoadingState(true);

  try {
    const response = await fetch(`${LEVEL_GAME_API}?level=${encodeURIComponent(config.level)}&t=${Date.now()}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate challenge");
    }

    challengeSentences = data.sentences || [];
    challengeCorrections = data.corrections || [];
    renderChallenge(data.paragraphs || [challengeSentences]);
  } catch (error) {
    gameContainer.classList.add("manifested");
    gameContainer.innerHTML = `<p class="text-red-700 not-italic">Unable to generate a new challenge right now. ${error.message}</p>`;
  } finally {
    setLoadingState(false);
  }
}

function submitGame() {
  if (challengeSentences.length === 0 || challengeSubmitted) return;

  const confidence = parseInt(document.getElementById("confidenceSlider").value, 10);
  const multiplier = 0.5 + (confidence / 100);
  let finalScore = 0;
  let foundHallucinations = 0;
  submitBtn.disabled = true;

  document.querySelectorAll(".sentence-btn").forEach((btn) => {
    const isFake = btn.dataset.fake === "true";
    const isSelected = selectedIds.has(btn.dataset.id);

    if (isFake && isSelected) {
      btn.classList.add("res-correct");
      foundHallucinations += 1;
      finalScore += Math.round(25 * multiplier);
    } else if (!isFake && isSelected) {
      btn.classList.add("res-wrong");
      finalScore -= Math.round(20 * multiplier);
    } else if (isFake && !isSelected) {
      btn.classList.add("res-missed");
      finalScore -= 10;
    } else {
      finalScore += 5;
    }
  });

  for (let i = 1; i <= 3; i += 1) {
    if (i <= foundHallucinations) {
      const jar = document.getElementById(`jar-${i}`);
      if (jar) jar.classList.add("filled");
    }
  }

  challengeSubmitted = true;
  const storedTotal = addPointsToStorage(finalScore);
  scoreText.textContent = `${finalScore} KP`;

  let confidenceText = "";
  if (confidence > 75) {
    confidenceText = `<span class="text-lime-300">High Confidence:</span> Big conviction, big swings.`;
  } else if (confidence < 25) {
    confidenceText = `<span class="text-amber-300">Low Confidence:</span> You reduced risk, but capped your upside.`;
  } else {
    confidenceText = `<span class="text-purple-200">Balanced Read:</span> You kept confidence and skepticism in tension.`;
  }

  pointsBreakdown.innerHTML = `${confidenceText}<div class="mt-2 pt-2 border-t border-white/5 opacity-60">Confidence Multiplier: x${multiplier.toFixed(2)}</div><div class="mt-2 pt-2 border-t border-white/5 opacity-60">Stored Total: ${storedTotal} KP</div>`;

  if (finalScore > 70) feedbackText.textContent = "Excellent analysis. You separated strong information from hallucination.";
  else if (finalScore > 30) feedbackText.textContent = "Good instincts. A few details slipped by, but your read was mostly solid.";
  else if (finalScore >= 0) feedbackText.textContent = "You stayed in the game, though the falsehoods kept some ground.";
  else feedbackText.textContent = "The hallucinations won this round. Try another generated set.";

  const correctionsEl = ensureCorrectionsBox();
  if (correctionsEl) {
    if (challengeCorrections.length === 0) {
      correctionsEl.innerHTML = `
        <h5 class="text-sm uppercase tracking-widest text-stone-200 mb-2">Truth Notes</h5>
        <p class="text-sm text-stone-300 leading-relaxed">This round contained no seeded false fact, so there were no correction notes to reveal.</p>
      `;
    } else {
      const correctionMarkup = challengeCorrections
        .map(
          (item) => `
            <div class="mb-3 last:mb-0">
              <p class="text-[11px] uppercase tracking-widest text-stone-400 mb-1">${item.factId}</p>
              <p class="text-sm text-red-200 leading-relaxed"><span class="font-bold text-red-100">False claim:</span> ${item.statement}</p>
              <p class="text-sm text-green-100 leading-relaxed mt-1"><span class="font-bold text-green-200">Truth:</span> ${item.trueFact}</p>
              <p class="text-xs text-stone-400 mt-1">Source: ${item.source}</p>
            </div>
          `
        )
        .join("");

      correctionsEl.innerHTML = `
        <h5 class="text-sm uppercase tracking-widest text-stone-200 mb-3">Truth Notes</h5>
        ${correctionMarkup}
      `;
    }
  }

  resultBox.classList.remove("hidden");
  resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

window.generateChallenge = generateChallenge;
window.submitGame = submitGame;

updatePointsBadge();
bindInteractiveCursor();
