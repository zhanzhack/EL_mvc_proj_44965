const Training = require('../models/training');
const path = require('path');
const fs = require('fs');

exports.addTraining = async (req, res) => {
    try {
        const { name, type, intensity, duration, city, place, date, description } = req.body;
        const user = req.session.user._id;
        const imagePath = req.file ? req.file.path : null; // Получаем путь к изображению, если оно было загружено

        const newTraining = new Training({
            user,
            name,
            type,
            intensity,
            duration,
            city,
            place,
            date,
            description,
            image: imagePath 
        });

        await newTraining.save();
        res.redirect('/trainings');
    } catch (error) {
        console.error('Error adding training:', error);
        res.status(500).send('Server error');
    }
};

exports.getTrainings = async (req, res) => {
    try {
        const trainings = await Training.find().populate('user', 'username');
        res.status(200).render('trainings', { trainings, title: 'All Trainings' });
    } catch (error) {
        console.error('Error fetching trainings:', error);
        res.status(400).send(error);
    }
};


exports.editTraining = async (req, res) => {
    try {
        const training = await Training.findById(req.params.id);
        if (!training) {
            return res.status(404).send('Training not found');
        }
        res.render('editTraining', { training });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.updateTraining = async (req, res) => {
    try {
        const training = await Training.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!training) {
            return res.status(404).send('Training not found');
        }
        res.redirect('/trainings');
    } catch (error) {
        res.status(400).send(error);
    }
};



exports.searchTraining = async (req, res) => {
    try {
        let trainings;
        if (req.query.search) {
            const regex = new RegExp(req.query.search, 'i'); 
            trainings = await Training.find({ name: regex });
        } else {
            trainings = await Training.find();
        }
        res.render('index', { title: 'Trainings', trainings });
    } catch (error) {
        console.error('Error fetching trainings:', error);
        res.status(500).send('Server error');
    }
};


exports.getTrainingById = async (req, res) => {
    try {
        const training = await Training.findById(req.params.id).populate('user');
        if (!training) {
            return res.status(404).send('Training not found');
        }
        res.render('trainingDetail', { title: training.name, training });
    } catch (error) {
        console.error('Error fetching training by ID:', error);
        res.status(500).send('Server error');
    }
};


exports.getEditTraining = async (req, res) => {
    try {
        const training = await Training.findById(req.params.id);
        if (!training) {
            return res.status(404).send('Training not found');
        }
        if (req.session.userId !== training.user.toString()) {
            return res.status(403).send('You are not authorized to edit this training');
        }
        res.render('editTraining', { title: 'Edit Training', training });
    } catch (error) {
        console.error('Error fetching training:', error);
        res.status(500).send('Server error');
    }
};

exports.postEditTraining = async (req, res) => {
    try {
        const training = await Training.findById(req.params.id);
        if (!training) {
            return res.status(404).send('Training not found');
        }
        if (req.session.userId !== training.user.toString()) {
            return res.status(403).send('You are not authorized to edit this training');
        }

        training.name = req.body.name;
        training.type = req.body.type;
        training.intensity = req.body.intensity;
        training.duration = req.body.duration;
        training.city = req.body.city;
        training.place = req.body.place;
        training.date = new Date(req.body.date);
        if (req.file) {
            training.image = req.file.path;
        }
        if (req.body.description) {
            training.description = req.body.description;
        }

        await training.save();
        res.redirect(`/trainings/${training._id}`);
    } catch (error) {
        console.error('Error updating training:', error);
        res.status(500).send('Server error');
    }
};


exports.deleteTraining = async (req, res) => {
    try {
        const training = await Training.findById(req.params.id);
        if (!training) {
            return res.status(404).send('Training not found');
        }
        if (req.session.userId !== training.user.toString()) {
            return res.status(403).send('You are not authorized to delete this training');
        }

        await Training.findByIdAndDelete(req.params.id);
        res.redirect('/trainings');
    } catch (error) {
        console.error('Error deleting training:', error);
        res.status(500).send('Server error');
    }
};