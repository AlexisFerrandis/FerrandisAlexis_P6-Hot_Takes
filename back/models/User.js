const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userShema = mongoose.Schema({
	email: { type: String, required: true, unique: true, minLength: 6, maxLength: 32 },
	password: { type: String, required: true },
});

userShema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userShema);
