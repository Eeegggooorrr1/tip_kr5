const express = require('express');
const router = express.Router();
const controller = require('../controllers/colorController');
const validateFormat = require('../middleware/validateFormat');

router.get('/random', validateFormat, controller.getRandomColor);
router.get('/seed/:seed', validateFormat, controller.getSeedColor);
router.post('/', validateFormat, controller.postColor);

module.exports = router;
