const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// schema constructor
const ArticleSchema = new Schema({
	// headline must be of type string
	title: String,
	// summary must be of type string
	summary: String,
	// url must be of type string
	link: String,
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comments'
		}
	]
});

const Article = mongoose.model('Article', ArticleSchema);

module.exports = Article;
