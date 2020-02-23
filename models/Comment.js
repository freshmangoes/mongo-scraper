const mongoose = require('mongoose');

const Schema = mongoose.Schema;

// schema constructor
const CommentSchema = new Schema({
	// title must be of type string
	title: {
    type: String,
    trim: true,
    required: 'Comment title is required'
  },
	// body must be of type string
	body: {
    type: String,
    trim: true,
    required: 'Comment body is required'
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
