$(document).ready(function(){
  // caching elements
  var scrapeBtn = $('.scrape-btn');

  scrapeBtn.click( async function(){
    await $.get('/api/getArticles').then(function(data) {
      console.log('Fetching articles');
    });
  });
});