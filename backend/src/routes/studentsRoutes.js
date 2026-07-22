const express = require('express');
const studentsController = require('../controllers/studentsController');

const router = express.Router();

router.get('/staff', studentsController.getStaffBrowserData);

module.exports = router;