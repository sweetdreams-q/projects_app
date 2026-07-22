const staffModel = require('../models/staffModel');

function parseStaffId(paramsId) {
  const id = Number.parseInt(paramsId, 10);
  return Number.isNaN(id) ? null : id;
}

async function getAllStaff(req, res, next) {
  try {
    const staff = await staffModel.getAllStaff();
    res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
}

async function getStaffById(req, res, next) {
  try {
    const id = parseStaffId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: 'Invalid staff id' });
    }

    const staff = await staffModel.getStaffById(id);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    return res.status(200).json(staff);
  } catch (error) {
    next(error);
  }
}

async function createStaff(req, res, next) {
  try {
    const { name, email, department, bio } = req.body;

    if (!name || !email || !department || !bio) {
      return res.status(400).json({ message: 'name, email, department, and bio are required' });
    }

    const createdStaff = await staffModel.createStaff({ name, email, department, bio });
    return res.status(201).json(createdStaff);
  } catch (error) {
    next(error);
  }
}

async function updateStaff(req, res, next) {
  try {
    const id = parseStaffId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: 'Invalid staff id' });
    }

    const updatedStaff = await staffModel.updateStaff(id, req.body);
    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    return res.status(200).json(updatedStaff);
  } catch (error) {
    next(error);
  }
}

async function deleteStaff(req, res, next) {
  try {
    const id = parseStaffId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: 'Invalid staff id' });
    }

    const removed = await staffModel.deleteStaff(id);
    if (!removed) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};