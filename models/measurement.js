const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: String,
    neck: Number,
    chest: Number,
    waist: Number,
    shoulderlength: Number,
    shoulderwidth: Number,
    armlength: Number,
    wrist: Number,
    seat: Number,
    clothlength: Number,
    hipmeasurement: Number,
    seatmeasurement: Number,
    inseam: Number,
    hip: Number,
    sleevelength: Number,
    created: {type: Date, default: Date.now}
});


module.exports = mongoose.model("Measurement", MeasurementSchema);

