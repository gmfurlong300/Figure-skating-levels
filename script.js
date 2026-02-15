(async function () {
  const cardsEl = document.getElementById('cards');
  const categoryFilter = document.getElementById('categoryFilter');
  const levelFilter = document.getElementById('levelFilter');
  const searchBox = document.getElementById('searchBox');

  let data;
  try {
    const res = await fetch('data/tests.json');
    data = await res.json();
    document.getElementById('lastUpdated').textContent = data.meta?.lastUpdated || '';
  } catch (e) {
    cardsEl.innerHTML = `<p>Failed to load test data. Please refresh.</p>`;
    return;
  }

  // Build a unique list of levels across categories
  const allLevels = new Set();
  (data.categories || []).forEach(cat => (cat.levels || []).forEach(l => allLevels.add(l.level)));
  [...allLevels].sort((a,b)=>a.localeCompare(b)).forEach(level => {
    const opt = document.createElement('option');
    opt.value = level; opt.textContent = level;
    levelFilter.appendChild(opt);
  });

  // Populate category filter
  (data.categories || []).forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat.name;
    opt.textContent = cat.displayName || cat.name;
    categoryFilter.appendChild(opt);
  });

  function render() {
    const catVal = categoryFilter.value;
    const levelVal = levelFilter.value;
    const q = searchBox.value.trim().toLowerCase();

    const cards = [];

    (data.categories || []).forEach(cat => {
      if (catVal !== 'All' && cat.name !== catVal) return;

      (cat.levels || []).forEach(levelObj => {
        if (levelVal !== 'All' && levelObj.level !== levelVal) return;

        (levelObj.tests || []).forEach(test => {
          const hay = [test.name, ...(test.elements||[])].join(' ').toLowerCase();
          if (q && !hay.includes(q)) return;

          cards.push(`
            <article class="card">
              <div class="badges">
                <span class="badge">${cat.displayName || cat.name}</span>
                <span class="badge">${levelObj.level}</span>
              </div>
              <h3>${test.name}</h3>
              <ul class="elements">
                ${(test.elements||[]).map(e => `<li>${e}</li>`).join('')}
              </ul>
              ${test.notes ? `<p><em>${test.notes}</em></p>` : ''}
              ${Array.isArray(test.sources) ? `<p>Sources: ${test.sources.map((s,i)=>`<a href="${s}" target="_blank" rel="noopener">[${i+1}]</a>`).join(' ')}</p>` : ''}
            </article>
          `);
        });
      });
    });

    cardsEl.innerHTML = cards.length ? cards.join('') : `<p>No results. Try clearing filters or search.</p>`;
  }

  categoryFilter.addEventListener('change', render);
  levelFilter.addEventListener('change', render);
  searchBox.addEventListener('input', render);

  render();
})();
