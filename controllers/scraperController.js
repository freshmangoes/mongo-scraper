const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');

const Articles = require('../models/Article');

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
        // pushes the data to the array of objects
				results.push({ title, link, summary });
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
  const check = await Articles.count({title: articleObj.title});
	if (check) {
    console.log('already exists')
		return false;
  }
  console.log(`doesn't exist`);
	return true;
};

router.get('/', async (req, res) => {
	const articles = await Articles.find({});
	console.log(articles);
	res.render('index', { data: articles });
});

router.get('/all', async (req, res) => {
	// get articles
	const data = await getArticles();

	// insert articles into db
	for (let i = 0; i < data.length; i++) {
		console.log(data[i]);
    // checks to make sure duplicates don't get inserted into collection
    try{
      let dupe = await isNotDupe(data[i]);
      if (dupe) {
        console.log('inserting into db');
        await Articles.create(data[i]);
      } else if (!dupe) {
        console.log('Articles collection already contains this item!');
      }
    } catch (err) {
      console.log(err);
    }
  }
  const collection = await Articles.find({});
  res.json(collection);
});

module.exports = router;
