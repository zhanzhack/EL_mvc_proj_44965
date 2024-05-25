const express = require('express');
const router = express.Router();
const trainingController = require('../controllers/trainingController');
const userController = require('../controllers/userController');
const upload = require('../middlewares/multer'); 


router.get('/', trainingController.searchTraining);

// Training routes
router.get('/trainings', trainingController.getTrainings);
router.post('/trainings', upload.single('image'), trainingController.addTraining);
router.get('/trainings/add', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }
    res.render('addTraining', { title: 'Add Training' });
});
router.get('/trainings/:id', trainingController.getTrainingById);
router.get('/trainings/:id/edit', trainingController.getEditTraining);
router.post('/trainings/:id/edit', upload.single('image'), trainingController.postEditTraining);
router.post('/trainings/:id/delete', trainingController.deleteTraining);



// User routes
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});
router.post('/register', userController.registerUser);
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});
router.post('/login', userController.loginUser);
router.get('/logout', userController.logoutUser);

router.post('/logout', userController.logoutUser);

module.exports = router;





