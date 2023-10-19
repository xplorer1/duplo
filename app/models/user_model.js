let mongoose = require('mongoose');
let Schema   = mongoose.Schema;
let bcrypt = require('bcrypt');

let UserSchema = new Schema({
    'created_on' : {type: Date, default: Date.now},
    'password': {type: String, trim: true, index: true},
    'username' : {type: String, trim: true, index: true, lowercase: true},
	'owner_id' : {type: String, index: true},
    'user_type': {enum: ['BUSINESS_OWNER', 'DEPARTMENT_HEAD'], type: String}
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function (password) {
	try{
		var user = this;

		return bcrypt.compareSync(password, user.password);
	}catch(e){
		console.log("password compare exception:", e);
		return false;
	}
};

module.exports = mongoose.model('User', UserSchema);