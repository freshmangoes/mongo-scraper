const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

const Articles = require('../models/Article');

const getArticles = async () => {
	let url = 'https://www.nytimes.com/section/world';
	let results = [];
	try {
		const data = await axios.get(url);
		const $ = cheerio.load(data.data);
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
				results.push({ title, link, summary });
			});
	} catch (error) {
		console.log(error);
	}
	// console.log(results);
	return results;
};

router.get('/', async (req, res) => {
  const articles = await Articles.find({});
  console.log(articles);
  res.render('index', {data: articles});
});

router.get('/all', async (req, res) => {
  // get articles
  const data = await getArticles();
  
  // insert articles into db
  for(let i = 0; i < data.length; i++) {
    console.log(data[i]);
    try{
      await Articles.create(data[i]);
    } catch (err) {
      console.log(err);
    }
  }
});

module.exports = router;