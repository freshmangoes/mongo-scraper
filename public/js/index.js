$(document).ready(function() {
	// caching elements
	var scrapeBtn = $('.scrape-btn');
	var commentBtn = $('.comment-btn');
	var commentInput = $('.comment-input');

	async function addComment() {
		var articleToComment = $(this).attr('data-_id');
		var commentInput = $(this)
			.parent()
			.children('.comment-input')
			.val()
			.trim();

		console.log(`Article to comment: ${articleToComment}`);
		console.log(commentInput);

		await $.ajax({
			method: 'POST',
			url: '/api/post-comment',
			data: {
				body: commentInput,
				articleToComment
			}
		}).then(function(data) {
			if (data) {
				console.log('Success');
			}
		});
	}

	async function scrapeArticles() {
		await $.get('/api/get-articles').then(function(data) {
			console.log('Fetching articles');
			// reloads page to display new articles
			location.reload(true);
		});
	}

	commentBtn.click(addComment);
	scrapeBtn.click(scrapeArticles);
});
