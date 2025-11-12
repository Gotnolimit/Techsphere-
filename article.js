// article page loader (uses ./data/articles.json)
document.addEventListener('DOMContentLoaded', () => {
  const articleContainer = document.getElementById('article-container');
  const articleId = new URLSearchParams(window.location.search).get('id');

  fetch('./data/articles.json')
    .then(res => res.json())
    .then(articles => {
      const article = articles.find(a => a.id === articleId);
      if (!article) {
        articleContainer.innerHTML = '<p>Article not found.</p>';
        return;
      }

      const html = `
        <p class="article-category">${article.category}</p>
        <h1 class="article-title">${article.title}</h1>
        <div class="article-content">${article.content}</div>
        <p><a class="article-link" href="${article.link}" target="_blank" rel="noopener">Original source ›</a></p>
      `;
      articleContainer.innerHTML = html;
    })
    .catch(err => {
      console.error(err);
      if (articleContainer) articleContainer.innerHTML = '<p>Error loading article.</p>';
    });
});