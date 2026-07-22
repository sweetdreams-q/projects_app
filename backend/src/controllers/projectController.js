const projectModel = require('../models/projectModel');
const staffModel = require('../models/staffModel');

function parseId(paramsId) {
  const id = Number.parseInt(paramsId, 10);
  return Number.isNaN(id) ? null : id;
}

async function getProjectsByStaffId(req, res, next) {
  try {
    const staffId = parseId(req.params.id);
    if (staffId === null) {
      return res.status(400).json({ message: 'Invalid staff id' });
    }

    const staff = await staffModel.getStaffById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const projects = await projectModel.getProjectsByStaffId(staffId);
    return res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
}

async function createProject(req, res, next) {
  try {
    const { staffId, title, description, tags } = req.body;
    const parsedStaffId = parseId(String(staffId));

    if (parsedStaffId === null || !title || !description || tags === undefined) {
      return res.status(400).json({ message: 'staffId, title, description, and tags are required' });
    }

    const createdProject = await projectModel.createProject({
      staffId: parsedStaffId,
      title,
      description,
      tags,
    });

    if (createdProject && createdProject.error) {
      return res.status(createdProject.status).json({ message: createdProject.error });
    }

    return res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
}

async function updateProject(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: 'Invalid project id' });
    }

    const payload = { ...req.body };
    if (payload.staffId !== undefined) {
      const parsedStaffId = parseId(String(payload.staffId));
      if (parsedStaffId === null) {
        return res.status(400).json({ message: 'Invalid staff id' });
      }
      payload.staffId = parsedStaffId;
    }

    const updatedProject = await projectModel.updateProject(id, payload);
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (updatedProject.error) {
      return res.status(updatedProject.status).json({ message: updatedProject.error });
    }

    return res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
}

async function deleteProject(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: 'Invalid project id' });
    }

    const removed = await projectModel.deleteProject(id);
    if (!removed) {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProjectsByStaffId,
  createProject,
  updateProject,
  deleteProject,
};