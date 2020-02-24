const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const moment = require('moment');

const Articles = require('../models/Article');
const Comment = require('../models/Comment');

const getArticles = async () => {
	let url = 'https://www.nytimes.com/section/world';
	let results = [];
	try {
		// gets webpage from url
		const data = await axios.get(url);
		// loads webpage data into cheerio for scraping
		const $ = cheerio.load(data.data);
		// scraping article titles, links, and summaries
		$('#collection-world')
			.find('ol')
			.find('article')
			.each(function(i, ele) {
				let title = $(ele)
					.find('a')
					.text();
				let link = $(ele)
					.find('a')
					.attr('href');
				link = 'https://www.nytimes.com/' + link;
				let summary = $(ele)
					.find('p')
					.text();
				let timeAdded = Date.now();
				let result = { title, link, summary, timeAdded };
				// console.log(result);
				// pushes the data to the array of objects
				results.push(result);
			});
	} catch (error) {
		console.log(error);
	}
	// returns array of objects
	return results;
};

// returns true if no duplicate exists
// returns false if a duplicate exists
const isNotDupe = async (articleObj) => {
	const check = await Articles.count({ title: articleObj.title });
	if (check) {
		console.log('already exists');
		return false;
	}
	console.log(`doesn't exist`);
	return true;
};

const addArticles = async (articleArr) => {
	// insert articles into db
	for (let i = 0; i < articleArr.length; i++) {
		// console.log(articleArr[i]);
		try {
			// checks to make sure duplicates don't get inserted into collection
			let notDupe = await isNotDupe(articleArr[i]);
			// if item isn't a duplicate
			if (notDupe) {
				console.log('inserting into db');
				// insert into db
				await Articles.create(articleArr[i]);
				// if item is a duplicate
			} else if (!notDupe) {
				console.log('Articles collection already contains this item!');
			}
		} catch (err) {
			console.log(err);
		}
	}
};

const addComment = async (comment, article) => {
	await Comment.create({ body: comment })
		.then(function(dbComment) {
			Articles.findOneAndUpdate(
				{ _id: article },
				{ $push: { comments: dbComment._id } },
				{ new: true }
			);
		})
		.then(function(dbArticle) {
			res.json(dbArticle);
		})
		.catch(function(error) {
			console.log(error);
		});
};

router.get('/', async (req, res) => {
	const data = await Articles.find({}).sort({ timeAdded: -1 });
	// console.log({articles: data});
	res.render('index', { articles: data });
});

router.get('/api/get-articles', async (req, res) => {
	// get articles
	const data = await getArticles();
	await addArticles(data);

	// debug
	const collection = await Articles.find({});
	res.json(collection);
});

router.post('/api/post-comment', async (req, res) => {
	const data = req.body;

	// add the comment to the comment db
	await Comment.create({ body: data.body })
		.then(function(dbComment) {
			// find the article to be updated,
			// push the comment _id to the comments array
			return Articles.findOneAndUpdate(
				{ _id: data.articleToComment },
				{ $push: { comments: dbComment._id } },
				{ new: true }
			);
		})
		// push the article back to the client
		.then(function(dbArticle) {
			res.json(dbArticle);
		})
		.catch(function(error) {
			console.log(error);
		});
});

module.exports = router;
