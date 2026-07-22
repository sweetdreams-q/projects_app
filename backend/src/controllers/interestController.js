const interestModel = require('../models/interestModel');
const staffModel = require('../models/staffModel');

function parseId(paramsId) {
  const id = Number.parseInt(paramsId, 10);
  return Number.isNaN(id) ? null : id;
}

async function getInterestsByStaffId(req, res, next) {
  try {
    const staffId = parseId(req.params.id);
    if (staffId === null) {
      return res.status(400).json({ message: 'Invalid staff id' });
    }

    const staff = await staffModel.getStaffById(staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const interests = await interestModel.getInterestsByStaffId(staffId);
    return res.status(200).json(interests);
  } catch (error) {
    next(error);
  }
}

async function createInterest(req, res, next) {
  try {
    const { staffId, title, description } = req.body;
    const parsedStaffId = parseId(String(staffId));

    if (parsedStaffId === null || !title || !description) {
      return res.status(400).json({ message: 'staffId, title, and description are required' });
    }

    const createdInterest = await interestModel.createInterest({
      staffId: parsedStaffId,
      title,
      description,
    });

    if (createdInterest && createdInterest.error) {
      return res.status(createdInterest.status).json({ message: createdInterest.error });
    }

    return res.status(201).json(createdInterest);
  } catch (error) {
    next(error);
  }
}

async function updateInterest(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: 'Invalid interest id' });
    }

    const payload = { ...req.body };
    if (payload.staffId !== undefined) {
      const parsedStaffId = parseId(String(payload.staffId));
      if (parsedStaffId === null) {
        return res.status(400).json({ message: 'Invalid staff id' });
      }
      payload.staffId = parsedStaffId;
    }

    const updatedInterest = await interestModel.updateInterest(id, payload);
    if (!updatedInterest) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    if (updatedInterest.error) {
      return res.status(updatedInterest.status).json({ message: updatedInterest.error });
    }

    return res.status(200).json(updatedInterest);
  } catch (error) {
    next(error);
  }
}

async function deleteInterest(req, res, next) {
  try {
    const id = parseId(req.params.id);
    if (id === null) {
      return res.status(400).json({ message: 'Invalid interest id' });
    }

    const removed = await interestModel.deleteInterest(id);
    if (!removed) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getInterestsByStaffId,
  createInterest,
  updateInterest,
  deleteInterest,
};