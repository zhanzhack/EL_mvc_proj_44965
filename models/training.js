const mongoose = require('mongoose');

const trainingSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    intensity: { type: String, required: true },
    duration: { type: Number, required: true },
    city: { type: String, required: true },
    place: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    image: { type: String } 
});

const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;

