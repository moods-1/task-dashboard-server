const router = require('express').Router();
const {
	getAllColumnsController,
	getCompanyColumnsController,
	patchMoveInternalController,
	patchMoveExternalController,
} = require('../controllers/columnsController');
const auth = require('../middleware/auth'); 

//GET
router.get('/', auth, getAllColumnsController);
router.get('/by/companyId/:companyId', auth, getCompanyColumnsController);

//PATCH
router.patch('/move-internal', auth, patchMoveInternalController);
router.patch('/move-external', auth, patchMoveExternalController);

module.exports = router;
