const mongoose = require('mongoose')

const PromocodeSchema = new mongoose.Schema({
	name: String,
	discount: Number
});

module.exports = mongoose.model('Promocode', PromocodeSchema)