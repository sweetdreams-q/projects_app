const express = require('express');
const interestController = require('../controllers/interestController');

const router = express.Router();

router.get('/:id/interests', interestController.getInterestsByStaffId);
router.post('/interest', interestController.createInterest);
router.put('/interest/:id', interestController.updateInterest);
router.delete('/interest/:id', interestController.deleteInterest);

module.exports = router;