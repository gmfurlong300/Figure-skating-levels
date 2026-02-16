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
    btn.onclick = () => openTest(level);   // ← pass whole object
    container.appendChild(btn);
  });

  showScreen("levelScreen");
}

function openTest(levelObj) {
  const test = levelObj.tests[0];

  document.getElementById("testTitle").textContent = test.name;

  // S3 Rulebook URL
  const RULEBOOK_BASE =
    "https://s3.us-east-2.amazonaws.com/sidearm.nextgen.sites/usafs.sidearmsports.com/documents/2025/8/9/2025-26_Rulebook.pdf";

  // Elements
  const elList = document.getElementById("testElements");
  elList.innerHTML = "";

  test.elements.forEach(e => {
    const li = document.createElement("li");

    if (typeof e === "string") {
      li.textContent = e;
    } else if (e && typeof e === "object") {
      const a = document.createElement("a");
      a.href = `${RULEBOOK_BASE}#page=${e.rulebookPage}`;
      a.target = "_blank";
      a.textContent = e.name;
      li.appendChild(a);
    }

    elList.appendChild(li);
  });

  // Pattern Diagram Link
  const rulebookLinkContainer = document.getElementById("rulebookLink");
  rulebookLinkContainer.innerHTML = "";

  if (test.rulebookPage) {
    const a = document.createElement("a");
    a.href = `${RULEBOOK_BASE}#page=${test.rulebookPage}`;
    a.target = "_blank";
    a.textContent = `View Pattern Diagram in Rulebook (page ${test.rulebookPage})`;
    rulebookLinkContainer.appendChild(a);
  }

  // Notes
  document.getElementById("testNotes").textContent = test.notes || "—";

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
loadData();

