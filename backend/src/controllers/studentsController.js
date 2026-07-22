const studentsModel = require('../models/studentsModel');

async function getStaffBrowserData(req, res, next) {
  try {
    const { interest } = req.query;
    const staffBrowserData = await studentsModel.getStaffBrowserData({ interest });
    return res.status(200).json(staffBrowserData);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getStaffBrowserData,
};