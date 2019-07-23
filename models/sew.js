const mongoose = require('mongoose')

const SewSchema = new mongoose.Schema({
	owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
	occasion: String,
	design: String,
	measurement: String,
	fabric: String,
	delivery: String,
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Sew', SewSchema);