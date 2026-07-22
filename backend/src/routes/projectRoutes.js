const express = require('express');
const projectController = require('../controllers/projectController');

const router = express.Router();

router.get('/:id/projects', projectController.getProjectsByStaffId);
router.post('/project', projectController.createProject);
router.put('/project/:id', projectController.updateProject);
router.delete('/project/:id', projectController.deleteProject);

module.exports = router;