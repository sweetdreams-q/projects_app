const staffModel = require('./staffModel');
const interestModel = require('./interestModel');
const projectModel = require('./projectModel');

function buildProfile(staff) {
  return {
    id: staff.id,
    name: staff.name,
    email: staff.email,
    department: staff.department,
    bio: staff.bio,
  };
}

function buildInterestSummary(interest) {
  return {
    id: interest.id,
    title: interest.title,
    description: interest.description,
  };
}

function buildProjectSummary(project) {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    tags: project.tags,
  };
}

async function getStaffBrowserData() {
  return getStaffBrowserDataWithFilter({});
}

async function getStaffBrowserDataWithFilter({ interest } = {}) {
  const staffList = await staffModel.getAllStaff();
  const interests = await interestModel.getAllInterests();
  const projects = await projectModel.getAllProjects();

  const normalizedInterestQuery = typeof interest === 'string' ? interest.trim().toLowerCase() : '';

  return staffList
    .map((staff) => {
    const staffInterests = interests
      .filter((interest) => interest.staffId === staff.id)
      .map(buildInterestSummary);

    const staffProjects = projects
      .filter((project) => project.staffId === staff.id)
      .map(buildProjectSummary);

    return {
      profile: buildProfile(staff),
      areasOfInterest: staffInterests,
      projectIdeas: staffProjects,
    };
    })
    .filter((entry) => {
      if (!normalizedInterestQuery) {
        return true;
      }

      return entry.areasOfInterest.some((interestItem) =>
        interestItem.title.toLowerCase().includes(normalizedInterestQuery),
      );
    });
}

module.exports = {
  getStaffBrowserData,
  getStaffBrowserDataWithFilter,
};