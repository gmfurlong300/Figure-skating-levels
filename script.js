let data = null;
let currentCategory = null;

async function loadData() {
  const res = await fetch(`data/tests.json?v=${Date.now()}`);
  data = await res.json();
  buildCategoryButtons();
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function buildCategoryButtons() {
  const container = document.getElementById("categoryButtons");
  container.innerHTML = "";

  data.categories.forEach(cat => {
    const btn = document.createElement("button");

    btn.innerHTML = `
      <span>${cat.displayName}</span>
      <img src="assets/${cat.name.toLowerCase().replace(/ /g, '-')}.png"
           class="btn-icon" alt="">
    `;

    btn.onclick = () => openCategory(cat.name);
    container.appendChild(btn);
  });
}

function openCategory(categoryName) {
  currentCategory = data.categories.find(c => c.name === categoryName);

  document.getElementById("levelTitle").textContent =
    `${currentCategory.displayName} – Select a Level`;

  const container = document.getElementById("levelButtons");
  container.innerHTML = "";

  currentCategory.levels.forEach(level => {
    const btn = document.createElement("button");
    btn.textContent = level.level;
    btn.onclick = () => openTest(level);
    container.appendChild(btn);
  });

  // Hide description when leaving home
  document.getElementById("description").classList.add("hidden");

  showScreen("levelScreen");
}

function openTest(levelObj) {
  const test = levelObj.tests[0];

  document.getElementById("testTitle").textContent = test.name;

const RULEBOOK_BASE = "assets/rulebook/USFS-2025-26_Rulebook.pdf";

  const elList = document.getElementById("testElements");
  elList.innerHTML = "";

  test.elements.forEach(e => {
    const li = document.createElement("li");

    if (typeof e === "string") {
      li.textContent = e;
    } else if (e && typeof e === "object") {
    const a = document.createElement("a");
    a.href = e.url || `${RULEBOOK_BASE}#page=${e.rulebookPage}`;
    a.target = "_blank";
    a.textContent = e.display || e.name;
    li.appendChild(a);
    }

    elList.appendChild(li);
  });

  const rulebookLinkContainer = document.getElementById("rulebookLink");
  rulebookLinkContainer.innerHTML = "";

  if (test.rulebookPage) {
    const a = document.createElement("a");
    a.href = `${RULEBOOK_BASE}#page=${test.rulebookPage}`;
    a.target = "_blank";
    a.textContent = `View Pattern Diagram in Rulebook (page ${test.rulebookPage})`;
    rulebookLinkContainer.appendChild(a);
  }

  document.getElementById("testNotes").textContent = test.notes || "—";

  const srcList = document.getElementById("testSources");
  srcList.innerHTML = "";
  test.sources.forEach(s => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = s;
    a.target = "_blank";
    a.textContent = s;
    li.appendChild(a);
    srcList.appendChild(li);
  });

  // Hide description on test screen
  document.getElementById("description").classList.add("hidden");

  showScreen("testScreen");
}

/* -------------------------
   BACK BUTTON FUNCTIONS
-------------------------- */

function goHome() {
  showScreen("homeScreen");
  document.getElementById("description").classList.remove("hidden");
}

function goLevels() {
  showScreen("levelScreen");
  document.getElementById("description").classList.add("hidden");
}

loadData();
