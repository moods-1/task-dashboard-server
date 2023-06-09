const router = require('express').Router();
const {
	getAllColumnsController,
	patchMoveInternalController,
	patchMoveExternalController,
} = require('../controllers/columnsController');

//GET
router.get('/', getAllColumnsController);

//PATCH
router.patch('/move-internal', patchMoveInternalController);

router.patch('/move-external', patchMoveExternalController);

module.exports = router;
