const mongoose = require('mongoose')

const DesignSchema = new mongoose.Schema({
	owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: String,
    quantity: Number,
    image: String,
    description: String,
    additionalinfo: String,
    about: String,
    price: Number
});


module.exports = mongoose.model("Design", DesignSchema);

