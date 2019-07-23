const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const FileSchema = new Schema({
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  path:  String,
  caption: String,
  created: {type: Date, default: Date.now}
  });

module.exports = mongoose.model('File', FileSchema);