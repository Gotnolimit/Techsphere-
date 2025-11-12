// search page logic (uses ./data/articles.json)
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('search-input');
  const button = document.getElementById('search-button');
  const results = document.getElementById('results-container');

  function renderResults(items) {
    results.innerHTML = '';
    if (!items || items.length === 0) {
      results.innerHTML = '<p>No articles found.</p>';
      return;
    }
    items.forEach(a => {
      const div = document.createElement('div');
      div.className = 'result-card';
      div.innerHTML = `
        <h3>${a.title}</h3>
        <p>${a.content.substring(0, 160)}...</p>
        <p><a href="article.html?id=${a.id}">Read more</a> · <a href="${a.link}" target="_blank" rel="noopener">Source</a></p>
      `;
      results.appendChild(div);
    });
  }

  function search(query) {
    fetch('./data/articles.json')
      .then(r => r.json())
      .then(list => {
        const q = (query || '').trim().toLowerCase();
        if (!q) return renderResults(list);
        const out = list.filter(a => a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
        renderResults(out);
      })
      .catch(err => {
        console.error(err);
        results.innerHTML = '<p>Error loading articles.</p>';
      });
  }

  button.addEventListener('click', () => search(input.value));
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') search(input.value);
  });

  // load all by default
  search('');
});