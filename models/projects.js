const mongoose = require('mongoose')
var uniqid = require('uniqid');
//const deepPopulate = require('mongoose-deep-populate')(mongoose)

const ProjectSchema = new mongoose.Schema({
	// userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	userEmail: String,
	projectId: String,
	projectType: String,
	projectLevel: String,
	projectDuration: String,
	status: {type: String, default:'pending'},
	price: Number,
	projectCordinator: String,
	// design: {type: mongoose.Schema.Types.ObjectId, ref: 'Design'},
	// fabric: {type: mongoose.Schema.Types.ObjectId, ref: 'Fabric'},
	title: String,
	description: String,
	created: {type: Date, default: Date.now}
});

ProjectSchema.pre("save", function (next) {
	var user = this;
	
	user.projectId = uniqid.process();
	next();
});

//Populates schema to any level
//OrderSchema.plugin(deepPopulate)
module.exports = mongoose.model('Project', ProjectSchema);