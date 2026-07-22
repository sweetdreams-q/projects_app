const path = require('path');
const { readCSV, writeCSV } = require('../csv');

const staffModel = require('./staffModel');
const interestsFile = path.join(__dirname, '..', '..', 'data', 'interests.csv');

function normalizeInterestRow(row) {
  return {
    id: Number.parseInt(row.id ?? row.interest_id ?? '0', 10) || 0,
    staffId: Number.parseInt(row.staffId ?? row.staff_id ?? '0', 10) || 0,
    title: row.title ?? row.interest ?? '',
    description: row.description ?? '',
  };
}

async function getAllInterests() {
  const rows = await readCSV(interestsFile);
  return rows.map(normalizeInterestRow);
}

async function getInterestById(id) {
  const interests = await getAllInterests();
  return interests.find((item) => item.id === id) || null;
}

async function getInterestsByStaffId(staffId) {
  const interests = await getAllInterests();
  return interests.filter((item) => item.staffId === staffId);
}

async function createInterest(interestData) {
  const interests = await getAllInterests();
  const nextId = interests.length === 0 ? 1 : Math.max(...interests.map((item) => item.id)) + 1;

  const staff = await staffModel.getStaffById(interestData.staffId);
  if (!staff) {
    return { error: 'Staff not found', status: 404 };
  }

  const newInterest = {
    id: nextId,
    staffId: interestData.staffId,
    title: interestData.title ?? '',
    description: interestData.description ?? '',
  };

  interests.push(newInterest);
  await writeCSV(interestsFile, interests);
  return newInterest;
}

async function updateInterest(id, interestData) {
  const interests = await getAllInterests();
  const index = interests.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  if (interestData.staffId !== undefined) {
    const staff = await staffModel.getStaffById(interestData.staffId);
    if (!staff) {
      return { error: 'Staff not found', status: 404 };
    }
  }

  const updatedInterest = {
    id,
    staffId: interestData.staffId ?? interests[index].staffId,
    title: interestData.title ?? interests[index].title,
    description: interestData.description ?? interests[index].description,
  };

  interests[index] = updatedInterest;
  await writeCSV(interestsFile, interests);
  return updatedInterest;
}

async function deleteInterest(id) {
  const interests = await getAllInterests();
  const index = interests.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  interests.splice(index, 1);
  await writeCSV(interestsFile, interests);
  return true;
}

module.exports = {
  getAllInterests,
  getInterestById,
  getInterestsByStaffId,
  createInterest,
  updateInterest,
  deleteInterest,
};