const express = require('express');
const router = express.Router();
const controller = require('../controllers/paletteController');

router.get('/', controller.listPalettes);
router.get('/:id', controller.getPalette);
router.post('/', controller.createPalette);
router.put('/:id', controller.updatePalette);
router.delete('/:id', controller.deletePalette);

module.exports = router;
