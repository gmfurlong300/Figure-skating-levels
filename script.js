let data = null;
let currentCategory = null;

async function loadData() {
  const res = await fetch("data/tests.json");
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
    btn.onclick = () => openTest(level);   // ← pass whole object
    container.appendChild(btn);
  });

  showScreen("levelScreen");
}

function openTest(levelObj) {
  const test = levelObj.tests[0];  // ← no more .find()

  document.getElementById("testTitle").textContent = test.name;

  // Elements
  const elList = document.getElementById("testElements");
  elList.innerHTML = "";
  test.elements.forEach(e => {
    const li = document.createElement("li");
    li.textContent = e;
    elList.appendChild(li);
  });

  // Notes
  document.getElementById("testNotes").textContent = test.notes || "—";

const rulebookLinkContainer = document.getElementById("rulebookLink");
rulebookLinkContainer.innerHTML = ""; // clear previous

if (test.rulebookPage) {
  const a = document.createElement("a");
  a.href = `https://www.usfigureskating.org/sites/default/files/media-files/2024-25%20Rulebook.pdf#page=${test.rulebookPage}`;
  a.target = "_blank";
  a.textContent = `View Pattern Diagram in Rulebook (page ${test.rulebookPage})`;
  rulebookLinkContainer.appendChild(a);
}

  // Sources
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

  showScreen("testScreen");
}


function goHome() {
  showScreen("homeScreen");
}

function goLevels() {
  showScreen("levelScreen");
}

loadData();
