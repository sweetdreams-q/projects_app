const path = require('path');
const { readCSV, writeCSV } = require('../csv');

const staffFile = path.join(__dirname, '..', '..', 'data', 'staff.csv');

function normalizeStaffRow(row) {
  return {
    id: Number.parseInt(row.id ?? row.staff_id ?? '0', 10) || 0,
    name: row.name ?? '',
    email: row.email ?? '',
    department: row.department ?? '',
    bio: row.bio ?? '',
  };
}

async function getAllStaff() {
  const rows = await readCSV(staffFile);
  return rows.map(normalizeStaffRow);
}

async function getStaffById(id) {
  const staff = await getAllStaff();
  return staff.find((item) => item.id === id) || null;
}

async function createStaff(staffData) {
  const staff = await getAllStaff();
  const nextId = staff.length === 0 ? 1 : Math.max(...staff.map((item) => item.id)) + 1;

  const newStaff = {
    id: nextId,
    name: staffData.name ?? '',
    email: staffData.email ?? '',
    department: staffData.department ?? '',
    bio: staffData.bio ?? '',
  };

  staff.push(newStaff);
  await writeCSV(staffFile, staff);
  return newStaff;
}

async function updateStaff(id, staffData) {
  const staff = await getAllStaff();
  const index = staff.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  const updatedStaff = {
    id,
    name: staffData.name ?? staff[index].name,
    email: staffData.email ?? staff[index].email,
    department: staffData.department ?? staff[index].department,
    bio: staffData.bio ?? staff[index].bio,
  };

  staff[index] = updatedStaff;
  await writeCSV(staffFile, staff);
  return updatedStaff;
}

async function deleteStaff(id) {
  const staff = await getAllStaff();
  const index = staff.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  staff.splice(index, 1);
  await writeCSV(staffFile, staff);
  return true;
}

module.exports = {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
};