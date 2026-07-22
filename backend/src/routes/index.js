const express = require('express');
const staffRoutes = require('./staffRoutes');
const interestRoutes = require('./interestRoutes');
const projectRoutes = require('./projectRoutes');
const studentsRoutes = require('./studentsRoutes');

const router = express.Router();

router.use('/staff', staffRoutes);
router.use('/staff', interestRoutes);
router.use('/staff', projectRoutes);
router.use('/students', studentsRoutes);

module.exports = router;