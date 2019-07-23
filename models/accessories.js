const mongoose = require('mongoose')

const AccessoriesSchema = new mongoose.Schema({
	owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: String,
    quantity: Number,
    image: String,
    description: String,
    price: Number
});


module.exports = mongoose.model("Accessories", AccessoriesSchema);

