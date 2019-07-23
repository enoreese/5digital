const mongoose = require('mongoose')

const FabricSchema = new mongoose.Schema({
	owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: String,
    quantity: Number,
    image: String,
    description: String,
    price: Number,
    created: {type: Date, default: Date.now}
});


module.exports = mongoose.model("Fabric", FabricSchema);

