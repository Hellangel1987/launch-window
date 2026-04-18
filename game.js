const products = [
  {
    name: "PromptForge",
    pitch: "An AI prompt pack generator for founders shipping late at night.",
    audience: "solo founders",
    tags: ["AI", "Templates", "B2B"],
    targetBuild: 100,
    launchBase: 35,
  },
  {
    name: "GymStreak",
    pitch: "A streak-first workout planner with zero fluff.",
    audience: "fitness nerds",
    tags: ["Health", "Mobile", "Habit"],
    targetBuild: 110,
    launchBase: 32,
  },
  {
    name: "QuietCart",
    pitch: "A distraction-free wishlist and price-drop tracker.",
    audience: "deal hunters",
    tags: ["Shopping", "Utility", "Consumer"],
    targetBuild: 95,
    launchBase: 38,
  },
  {
    name: "ClipPilot",
    pitch: "Turn long videos into punchy social clips in a minute.",
    audience: "creators",
    tags: ["Video", "Creator", "SaaS"],
    targetBuild: 105,
    launchBase: 36,
  },
];

const trends = [
  {
    name: "AI assistants are hot",
    mood: "Curious",
    risk: "Low refund pressure",
    boost: { AI: 16, Templates: 10, B2B: 6 },
    tip: "If your product matches the trend, launching a bit early can snowball.",
    label: "Stable",
  },
  {
    name: "Creator tools are surging",
    mood: "Ready to spend",
    risk: "High copycat risk",
    boost: { Video: 15, Creator: 15, SaaS: 8 },
    tip: "Buzz matters here. Stack hype before launch for a bigger day-one pop.",
    label: "Fast",
  },
  {
    name: "Utility apps are back",
    mood: "Practical",
    risk: "Medium churn",
    boost: { Utility: 14, Shopping: 10, Consumer: 7 },
    tip: "Consistency wins. Cheap improvements beat flashy campaigns.",
    label: "Steady",
  },
  {
    name: "Habit products are trending",
    mood: "Disciplined",
    risk: "Reviewers are picky",
    boost: { Health: 14, Habit: 14, Mobile: 9 },
    tip: "Polish helps more than hype when the crowd is detail-oriented.",
    label: "Demanding",
  },
];

const actions = [
  {
    key: "build",
    title: "Build features",
    type: "good",
    cost: 2,
    desc: "+28 build, -$2k, slight hype",
    effect: (state) => {
      state.build += 28;
      state.cash -= 2;
      state.hype += 4;
      return "You shipped useful work. The roadmap got shorter and people noticed.";
    },
  },
  {
    key: "polish",
    title: "Polish UX",
    type: "good",
    cost: 1,
    desc: "+18 build, +quality, -$1k",
    effect: (state) => {
      state.build += 18;
      state.cash -= 1;
      state.quality += 10;
      return "Everything feels smoother. Fewer rough edges means happier early users.";
    },
  },
  {
    key: "campaign",
    title: "Run a hype campaign",
    type: "good",
    cost: 3,
    desc: "+16 hype, -$3k, small build",
    effect: (state) => {
      state.hype += 16;
      state.cash -= 3;
      state.build += 6;
      return "A sharp trailer and launch thread got shared around. The waitlist woke up.";
    },
  },
  {
    key: "discount",
    title: "Offer founder pricing",
    type: "risky",
    cost: 0,
    desc: "+10 hype once, +users later, score multiplier down",
    effect: (state) => {
      if (state.discount) {
        return "Founder pricing is already live. Use the attention you bought before cutting deeper.";
      }

      state.hype += 10;
      state.discount = true;
      state.pricePower -= 0.1;
      return "Cheap entry pulled attention in, but margins got a little thinner.";
    },
  },
  {
    key: "launch",
    title: "Launch now",
    type: "good",
    cost: 0,
    desc: "Convert build + hype into users and score",
    effect: (state) => doLaunch(state),
  },
  {
    key: "pivot",
    title: "Micro pivot",
    type: "risky",
    cost: 2,
    desc: "Random market swing, can help or hurt",
    effect: (state) => {
      const swing = Math.floor(Math.random() * 25) - 8;
      state.build += 8;
      state.hype += 6;
      state.cash -= 2;
      state.marketBonus += swing;
      const mood = swing >= 0 ? "The new angle clicked." : "The message got muddier than planned.";
      return `${mood} Market fit changed by ${swing >= 0 ? "+" : ""}${swing}.`;
    },
  },
];

const BEST_SCORE_KEY = "launch-window-best-score";
const PUBLIC_URL = "https://hellangel1987.github.io/launch-window/";

const state = {};

const els = {
  dayStat: document.getElementById("dayStat"),
  daysLeftStat: document.getElementById("daysLeftStat"),
  cashStat: document.getElementById("cashStat"),
  hypeStat: document.getElementById("hypeStat"),
  usersStat: document.getElementById("usersStat"),
  scoreStat: document.getElementById("scoreStat"),
  launchNowStat: document.getElementById("launchNowStat"),
  bestStat: document.getElementById("bestStat"),
  difficultyPill: document.getElementById("difficultyPill"),
  productCard: document.getElementById("productCard"),
  buildLabel: document.getElementById("buildLabel"),
  buildBar: document.getElementById("buildBar"),
  readinessBox: document.getElementById("readinessBox"),
  daysLeftCard: document.getElementById("daysLeftStat").closest(".stat"),
  mainActions: document.getElementById("mainActions"),
  trendPill: document.getElementById("trendPill"),
  trendText: document.getElementById("trendText"),
  moodText: document.getElementById("moodText"),
  riskText: document.getElementById("riskText"),
  tipBox: document.getElementById("tipBox"),
  log: document.getElementById("log"),
  gameOverCard: document.getElementById("gameOverCard"),
  gameOverTitle: document.getElementById("gameOverTitle"),
  gameOverText: document.getElementById("gameOverText"),
  endStats: document.getElementById("endStats"),
  newRunBtn: document.getElementById("newRunBtn"),
  playAgainBtn: document.getElementById("playAgainBtn"),
  copySummaryBtn: document.getElementById("copySummaryBtn"),
  shareHint: document.getElementById("shareHint"),
};

function randItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function getBestScore() {
  try {
    return Math.max(0, Number(localStorage.getItem(BEST_SCORE_KEY)) || 0);
  } catch {
    return 0;
  }
}

function setBestScore(score) {
  const best = Math.max(getBestScore(), score);

  try {
    localStorage.setItem(BEST_SCORE_KEY, String(best));
  } catch {
    // ignore storage failures
  }

  return best;
}

function initGame() {
  const product = structuredClone(randItem(products));
  const trend = structuredClone(randItem(trends));

  Object.assign(state, {
    day: 1,
    maxDays: 7,
    cash: 12,
    hype: 0,
    users: 0,
    score: 0,
    build: 0,
    quality: 0,
    launches: 0,
    marketBonus: 0,
    pricePower: 1,
    discount: false,
    launchedToday: false,
    over: false,
    lastRunWasNewBest: false,
    product,
    trend,
    bestScore: getBestScore(),
  });

  els.log.innerHTML = "";
  els.gameOverCard.classList.add("hidden");
  addLog("New run", `${product.name} is live on the roadmap. ${trend.name}. You have 7 days to make it matter.`);
  render();
}

function formatCash(k) {
  return `$${Math.max(0, k)}k`;
}

function getMarketFit() {
  return state.product.tags.reduce((sum, tag) => sum + (state.trend.boost[tag] || 0), 0) + state.marketBonus;
}

function addLog(title, text) {
  const entry = document.createElement("div");
  entry.className = "log-entry";
  entry.innerHTML = `<strong>${title}</strong><span>${text}</span>`;
  els.log.prepend(entry);
}

function getLaunchVerdict(current) {
  const buildRatio = current.build / current.product.targetBuild;

  if (buildRatio >= 1) return "Clean launch";
  if (buildRatio >= 0.7) return "Scrappy launch";
  return "Risky launch";
}

function getLaunchProjection(current) {
  const buildRatio = Math.min(1.2, current.build / current.product.targetBuild);
  const fit = getMarketFit();
  const qualityBonus = Math.floor(current.quality * 0.8);
  const launchPower = Math.round((current.product.launchBase + current.hype + qualityBonus + fit) * buildRatio * current.pricePower);
  const expectedUsers = Math.max(12, launchPower + 3);
  const expectedScore = Math.max(20, Math.round(expectedUsers * (1 + current.launches * 0.25)));

  return {
    buildRatio,
    expectedUsers,
    expectedScore,
    verdict: getLaunchVerdict(current),
  };
}

function doLaunch(current) {
  const projection = getLaunchProjection(current);
  const usersGained = Math.max(12, projection.expectedUsers + Math.floor(Math.random() * 18) - 9);
  const scoreGain = Math.max(20, Math.round(usersGained * (1 + current.launches * 0.25)));

  current.users += usersGained;
  current.score += scoreGain;
  current.cash += Math.max(2, Math.round(usersGained / 18));
  current.hype = Math.max(0, Math.round(current.hype * 0.45));
  current.build = Math.max(0, current.build - 35);
  current.launches += 1;
  current.launchedToday = true;

  return `${projection.verdict}. +${usersGained} users, +${scoreGain} score. ${current.discount ? "Founder pricing helped conversion." : "Full-price sales held up."}`;
}

function advanceDay() {
  if (state.over) return;

  if (!state.launchedToday) {
    state.hype = Math.max(0, state.hype - 2);
  }

  if (state.cash <= 0) {
    state.cash = 0;
    finishGame("Out of runway", "You ran out of cash before the market run ended. Good idea, brutal timing.");
    return;
  }

  if (state.day >= state.maxDays) {
    finishGame("Campaign complete", getEndingText());
    return;
  }

  state.day += 1;
  state.launchedToday = false;

  if (Math.random() < 0.55) {
    state.trend = structuredClone(randItem(trends));
    addLog("Market shift", `${state.trend.name}. ${state.trend.tip}`);
  }

  render();
}

function getEndingText() {
  if (state.score >= 420) return "You caught the wave. This feels like a real micro-hit, not a lucky prototype.";
  if (state.score >= 280) return "Solid launch week. Not breakout territory, but absolutely worth another sprint.";
  if (state.score >= 170) return "You found a little traction. With a second pass, this could become something.";
  return "You shipped, learned, and survived. In startup terms, that still counts.";
}

function getEndingSummary() {
  if (state.score >= 420) {
    return {
      label: "Outcome: breakout week",
      note: "You timed the market well. Keep momentum and relaunch fast while the audience is still warm.",
    };
  }

  if (state.score >= 280) {
    return {
      label: "Outcome: strong signal",
      note: "The pitch worked. One more polish day or sharper pricing could turn this into a bigger hit.",
    };
  }

  if (state.score >= 170) {
    return {
      label: "Outcome: early traction",
      note: "There is a real audience here. Tighten the build and launch a little closer to full readiness next time.",
    };
  }

  return {
    label: "Outcome: useful rehearsal",
    note: "The market lesson matters. Build faster, protect runway, and avoid launching without enough product.",
  };
}

function getNextRunTip() {
  const buildGap = Math.max(0, Math.ceil(state.product.targetBuild - state.build));
  const fit = getMarketFit();

  if (state.cash === 0) {
    return "Next run tip: protect at least $2k so you can still buy one last build or pivot day.";
  }

  if (buildGap > 24) {
    return `Next run tip: find about ${buildGap} more build before your main launch push.`;
  }

  if (state.hype < 16) {
    return "Next run tip: stack a little more hype before launching so the release lands harder.";
  }

  if (fit < 12) {
    return "Next run tip: wait for a better market match or use a pivot before you launch.";
  }

  if (state.discount) {
    return "Next run tip: skip founder pricing unless you really need the extra attention.";
  }

  return "Next run tip: you were close, so launch while the build is clean and the market still matches.";
}

function getShareSummary() {
  const bestCallout = state.lastRunWasNewBest ? " and set a new best" : "";
  return `I just scored ${state.score} in Launch Window${bestCallout}, with ${state.users} users across ${state.launches} launch${state.launches === 1 ? "" : "es"}. Can you beat that? ${PUBLIC_URL}`;
}

async function updateShareButtonLabel() {
  const labelPrefix = state.over && state.score > 0 && state.lastRunWasNewBest ? "best run" : "run summary";

  if (navigator.share) {
    els.copySummaryBtn.textContent = `Share ${labelPrefix}`;
    return;
  }

  els.copySummaryBtn.textContent = `Copy ${labelPrefix}`;
}

async function copyRunSummary() {
  if (!state.over) return;

  const summary = getShareSummary();

  try {
    if (navigator.share) {
      await navigator.share({
        title: "Launch Window",
        text: `I just scored ${state.score} in Launch Window${state.lastRunWasNewBest ? " and set a new best" : ""}, with ${state.users} users across ${state.launches} launch${state.launches === 1 ? "" : "es"}. Can you beat that?`,
        url: PUBLIC_URL,
      });
      els.shareHint.textContent = "Run summary shared. See if anyone can beat your score.";
      return;
    }

    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(summary);
    } else {
      const helper = document.createElement("textarea");
      helper.value = summary;
      helper.setAttribute("readonly", "");
      helper.style.position = "absolute";
      helper.style.left = "-9999px";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }

    els.shareHint.textContent = "Run summary copied. Paste it anywhere to challenge a friend.";
  } catch (error) {
    els.shareHint.textContent = error?.name === "AbortError"
      ? "Share cancelled. You can still copy your score anytime."
      : "Share failed. You can still copy your score manually.";
  }
}

function finishGame(title, text) {
  state.over = true;
  const previousBest = getBestScore();
  state.bestScore = setBestScore(state.score);
  render();
  els.copySummaryBtn.disabled = false;
  const summary = getEndingSummary();
  els.gameOverTitle.textContent = title;
  els.gameOverText.textContent = `${text} ${summary.note}`;
  const isNewBest = state.score > previousBest;
  state.lastRunWasNewBest = isNewBest;
  const restartHint = isNewBest
    ? "New best. Press Enter or N to jump into the next run."
    : "Press Enter or N to jump into the next run.";
  els.endStats.innerHTML = [
    `<span class="tag">${summary.label}</span>`,
    `<span class="tag">Final score: ${state.score}</span>`,
    `<span class="tag">Best score: ${state.bestScore}</span>`,
    isNewBest ? `<span class="tag">New best run</span>` : "",
    `<span class="tag">Users: ${state.users}</span>`,
    `<span class="tag">Cash left: ${formatCash(state.cash)}</span>`,
    `<span class="tag">Launches: ${state.launches}</span>`,
    `<span class="tag">${getNextRunTip()}</span>`,
  ].join("");
  els.shareHint.textContent = isNewBest
    ? `${restartHint} Share it while the market is still hot.`
    : `${restartHint} Share your run if you want a rematch.`;
  els.gameOverCard.classList.remove("hidden");
  if (typeof els.gameOverCard.scrollIntoView === "function") {
    requestAnimationFrame(() => {
      els.gameOverCard.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  updateShareButtonLabel();
}

function onAction(actionKey) {
  if (state.over) return;
  const action = actions.find((item) => item.key === actionKey);
  if (!action) return;

  if (state.cash < action.cost) {
    addLog("Too risky", `You need $${action.cost}k runway for that move. Launch now or protect your cash.`);
    return;
  }

  const result = action.effect(state);
  addLog(action.title, result);
  clampState();
  render();
  advanceDay();
}

function clampState() {
  state.cash = Math.max(0, state.cash);
  state.hype = Math.max(0, state.hype);
  state.build = Math.max(0, state.build);
  state.quality = Math.max(0, state.quality);
}

function renderProduct() {
  const fit = getMarketFit();
  els.productCard.innerHTML = `
    <h3>${state.product.name}</h3>
    <p>${state.product.pitch}</p>
    <p><strong>Audience:</strong> ${state.product.audience}</p>
    <p><strong>Market fit:</strong> ${fit >= 0 ? "+" : ""}${fit}</p>
    <div class="tag-row">${state.product.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
  `;
}

function getReadinessText() {
  const buildRatio = state.build / state.product.targetBuild;
  const fit = getMarketFit();
  const projection = getLaunchProjection(state);
  const daysLeft = Math.max(0, state.maxDays - state.day);
  let readinessText = "<strong>Launch readiness:</strong> Mixed. The ingredients are coming together, but timing still matters.";

  if (buildRatio >= 1 && state.hype >= 20) {
    readinessText = "<strong>Launch readiness:</strong> Hot. You have enough product and buzz to push for a strong release.";
  } else if (buildRatio >= 0.75 && fit >= 20) {
    readinessText = "<strong>Launch readiness:</strong> Promising. You could launch now, but one more setup day may pay off.";
  } else if (buildRatio < 0.5) {
    readinessText = "<strong>Launch readiness:</strong> Early. You still need more product before launch will convert well.";
  }

  let timingHint = ` ${daysLeft} day${daysLeft === 1 ? "" : "s"} left after today, so you still have room to set up.`;
  if (daysLeft === 0) {
    timingHint = " Last day. This is your final shot to launch.";
  } else if (daysLeft === 1) {
    timingHint = " Final setup day. If you wait after this, the run ends.";
  } else if (daysLeft === 2) {
    timingHint = " Closing window. Plan for your last good launch moment now.";
  }

  const projectedTotalScore = state.score + projection.expectedScore;
  const bestDelta = state.bestScore - projectedTotalScore;
  const buildNeeded = Math.max(0, Math.ceil(state.product.targetBuild - state.build));
  let buildHint = "";
  let bestHint = "";
  let runwayHint = "";

  if (buildNeeded > 0) {
    buildHint = ` You need about ${buildNeeded} more build for a clean launch.`;
  } else {
    buildHint = " You have enough product for a clean launch, so extra setup is optional.";
  }

  if (state.bestScore > 0) {
    if (bestDelta > 0) {
      bestHint = ` Beat your best by finding about ${bestDelta} more total score before you launch.`;
    } else {
      bestHint = " This pace can beat your best run if you ship cleanly.";
    }
  }

  if (state.cash <= 2 && !state.over) {
    runwayHint = state.cash === 0
      ? " Runway is gone, so only the current launch matters now."
      : state.cash === 1
        ? " Only $1k runway left, so most setup moves are off the table after today."
        : " Only $2k runway left, so you have about one more paid setup move before you must launch or stall.";
  }

  const pricingHint = state.discount
    ? " Founder pricing is live, so this launch trades a little score power for easier conversion."
    : "";

  return `${readinessText}<br><span class="readiness-subtle">Projected launch right now: ${projection.verdict.toLowerCase()}, about ${projection.expectedUsers} users and ${projection.expectedScore} score, for roughly ${projectedTotalScore} total.${buildHint}${timingHint}${runwayHint}${pricingHint}${bestHint}</span>`;
}

function getMarketTemperatureLabel() {
  const fit = getMarketFit();

  if (state.discount) return "Discount live";
  if (fit >= 28) return "Hot market";
  if (fit >= 18) return "Matched market";
  if (fit >= 8) return "Niche market";
  return "Cold market";
}

function isActionDisabled(action) {
  return state.over || state.cash < action.cost || (action.key === "discount" && state.discount);
}

function shouldRecommendLaunch(projection, daysLeft) {
  return daysLeft <= 1 || projection.buildRatio >= 1 || (projection.buildRatio >= 0.75 && getMarketFit() >= 20);
}

function renderActions() {
  els.mainActions.innerHTML = "";
  const projection = getLaunchProjection(state);
  const daysLeft = Math.max(0, state.maxDays - state.day);

  actions.forEach((action, index) => {
    const btn = document.createElement("button");
    const recommendLaunch = action.key === "launch" && shouldRecommendLaunch(projection, daysLeft);
    btn.className = `action-btn ${action.type}${recommendLaunch ? " recommended" : ""}`;
    const isCashLocked = state.cash < action.cost;
    const shortcut = index + 1;
    const isDiscountActive = action.key === "discount" && state.discount;
    const launchTimingNote = daysLeft === 0
      ? "Final day."
      : daysLeft === 1
        ? "Final setup day."
        : daysLeft === 2
          ? "Closing window."
          : "";
    const launchBuildGap = Math.max(0, Math.ceil(state.product.targetBuild - state.build));
    const launchBuildNote = launchBuildGap > 0
      ? `Needs about ${launchBuildGap} more build for a clean launch.`
      : "Build target reached. Extra setup is optional.";
    const desc = action.key === "launch"
      ? `${launchTimingNote ? `${launchTimingNote} ` : ""}${projection.verdict}. About ${projection.expectedUsers} users and ${projection.expectedScore} score. ${launchBuildNote}`
      : isDiscountActive
        ? "Already active. Founder pricing is live for this run."
        : isCashLocked
          ? `Needs $${action.cost}k runway. Launch now or protect your cash.`
          : action.desc;
    const costBadge = isDiscountActive
      ? '<span class="action-badge launch">Active pricing</span>'
      : isCashLocked
        ? `<span class="action-badge locked">Need $${action.cost}k</span>`
        : `<span class="action-badge cost">${action.cost === 0 ? 'Free move' : `Costs $${action.cost}k`}</span>`;
    const projectionBadge = action.key === "launch"
      ? `<span class="action-badge launch">Now: ${projection.expectedScore} score</span>`
      : '';
    const recommendationBadge = recommendLaunch
      ? '<span class="action-badge recommended">Recommended</span>'
      : '';
    btn.innerHTML = `
      <strong>${action.title} <span aria-hidden="true">(${shortcut})</span></strong>
      <div class="action-meta">${costBadge}${projectionBadge}${recommendationBadge}</div>
      <small>${desc}</small>
    `;
    btn.setAttribute("aria-keyshortcuts", String(shortcut));
    btn.disabled = isActionDisabled(action);
    btn.addEventListener("click", () => onAction(action.key));
    els.mainActions.appendChild(btn);
  });
}

function handleKeyboardShortcuts(event) {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) return;

  const target = event.target;
  const tagName = target?.tagName;
  if (tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT" || target?.isContentEditable) return;

  if (event.key === "n" || event.key === "N" || event.key === "r" || event.key === "R") {
    initGame();
    return;
  }

  if (state.over && event.key === "Enter") {
    initGame();
    return;
  }

  const actionIndex = Number(event.key) - 1;
  if (!Number.isInteger(actionIndex) || actionIndex < 0 || actionIndex >= actions.length) return;

  const action = actions[actionIndex];
  if (!action || isActionDisabled(action)) return;

  onAction(action.key);
}

function render() {
  els.copySummaryBtn.disabled = !state.over;
  const daysLeft = Math.max(0, state.maxDays - state.day);
  const isClosingWindow = daysLeft <= 2 && !state.over;
  els.dayStat.textContent = `${state.day} / ${state.maxDays}`;
  els.daysLeftStat.textContent = daysLeft;
  els.cashStat.textContent = formatCash(state.cash);
  els.hypeStat.textContent = state.hype;
  els.usersStat.textContent = state.users;
  els.scoreStat.textContent = state.score;
  const projection = getLaunchProjection(state);
  els.launchNowStat.textContent = `+${projection.expectedScore}`;
  els.bestStat.textContent = state.bestScore;
  els.difficultyPill.textContent = getMarketTemperatureLabel();
  els.trendPill.textContent = state.trend.label;
  els.trendText.textContent = state.trend.name;
  els.moodText.textContent = state.trend.mood;
  els.riskText.textContent = state.trend.risk;
  els.tipBox.textContent = state.trend.tip;
  els.buildLabel.textContent = `${Math.round(state.build)} / ${state.product.targetBuild}`;
  els.buildBar.style.width = `${Math.min(100, (state.build / state.product.targetBuild) * 100)}%`;
  els.readinessBox.innerHTML = getReadinessText();
  els.readinessBox.classList.toggle("urgent", isClosingWindow);
  els.daysLeftCard?.classList.toggle("urgent", isClosingWindow);
  renderProduct();
  renderActions();
}

els.newRunBtn.addEventListener("click", initGame);
els.playAgainBtn.addEventListener("click", initGame);
els.copySummaryBtn.addEventListener("click", copyRunSummary);
document.addEventListener("keydown", handleKeyboardShortcuts);

updateShareButtonLabel();
initGame();
