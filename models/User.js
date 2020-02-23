// Create the required custom methods at the bottom of this file

var mongoose = require('mongoose');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new UserSchema object
// This is similar to a Sequelize model
var UserSchema = new Schema({
	username: {
		type: String,
		trim: true,
		required: 'Username is Required'
	},
	// `password` must be of type String
	// `password` will trim leading and trailing whitespace before it's saved
	// `password` is a required field and throws a custom error message if not supplied
	// `password` uses a custom validation function to only accept values 6 characters or more
	password: {
		type: String,
		trim: true,
		required: 'Password is Required',
		validate: [
			function(input) {
				return input.length >= 6;
			},
			'Password should be longer.'
		]
	},
	comments: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});

// This creates our model from the above schema, using mongoose's model method
var User = mongoose.model('User', UserSchema);

// Export the User model
module.exports = User;
