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
  <img src="assets/${cat.name.toLowerCase().replace(/ /g, '-')}.png" 
       alt="${cat.displayName} icon" 
       class="btn-icon">
  <span>${cat.displayName}</span>
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
    btn.onclick = () => openTest(level.level);
    container.appendChild(btn);
  });

  showScreen("levelScreen");
}

function openTest(levelName) {
  const levelObj = currentCategory.levels.find(l => l.level === levelName);
  const test = levelObj.tests[0];

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
