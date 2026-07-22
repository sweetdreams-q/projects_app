const path = require('path');
const { readCSV, writeCSV } = require('../csv');

const staffModel = require('./staffModel');
const projectsFile = path.join(__dirname, '..', '..', 'data', 'projects.csv');

function normalizeProjectRow(row) {
  return {
    id: Number.parseInt(row.id ?? row.project_id ?? '0', 10) || 0,
    staffId: Number.parseInt(row.staffId ?? row.staff_id ?? '0', 10) || 0,
    title: row.title ?? '',
    description: row.description ?? '',
    tags: row.tags ?? '',
  };
}

async function getAllProjects() {
  const rows = await readCSV(projectsFile);
  return rows.map(normalizeProjectRow);
}

async function getProjectById(id) {
  const projects = await getAllProjects();
  return projects.find((item) => item.id === id) || null;
}

async function getProjectsByStaffId(staffId) {
  const projects = await getAllProjects();
  return projects.filter((item) => item.staffId === staffId);
}

async function createProject(projectData) {
  const staff = await staffModel.getStaffById(projectData.staffId);
  if (!staff) {
    return { error: 'Staff not found', status: 404 };
  }

  const projects = await getAllProjects();
  const nextId = projects.length === 0 ? 1 : Math.max(...projects.map((item) => item.id)) + 1;

  const newProject = {
    id: nextId,
    staffId: projectData.staffId,
    title: projectData.title ?? '',
    description: projectData.description ?? '',
    tags: projectData.tags ?? '',
  };

  projects.push(newProject);
  await writeCSV(projectsFile, projects);
  return newProject;
}

async function updateProject(id, projectData) {
  const projects = await getAllProjects();
  const index = projects.findIndex((item) => item.id === id);

  if (index === -1) {
    return null;
  }

  if (projectData.staffId !== undefined) {
    const staff = await staffModel.getStaffById(projectData.staffId);
    if (!staff) {
      return { error: 'Staff not found', status: 404 };
    }
  }

  const updatedProject = {
    id,
    staffId: projectData.staffId ?? projects[index].staffId,
    title: projectData.title ?? projects[index].title,
    description: projectData.description ?? projects[index].description,
    tags: projectData.tags ?? projects[index].tags,
  };

  projects[index] = updatedProject;
  await writeCSV(projectsFile, projects);
  return updatedProject;
}

async function deleteProject(id) {
  const projects = await getAllProjects();
  const index = projects.findIndex((item) => item.id === id);

  if (index === -1) {
    return false;
  }

  projects.splice(index, 1);
  await writeCSV(projectsFile, projects);
  return true;
}

module.exports = {
  getAllProjects,
  getProjectById,
  getProjectsByStaffId,
  createProject,
  updateProject,
  deleteProject,
};