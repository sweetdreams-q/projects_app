export const staffData = [
  {
    id: 1,
    name: 'Amina Yusuf',
    email: 'amina.yusuf@example.com',
    department: 'Computer Science',
    role: 'Lecturer',
    bio: 'Focuses on applied AI, data systems, and project-based learning.',
    areasOfInterest: [
      { id: 1, title: 'AI', description: 'Machine learning and responsible AI systems.' },
      { id: 2, title: 'Data Science', description: 'Exploring data pipelines and analytics.' },
    ],
    projectIdeas: [
      { id: 1, title: 'AI Study Assistant', description: 'A smart assistant for course support.' , tags: 'AI,EdTech' },
      { id: 2, title: 'Student Analytics', description: 'Visualize student progress trends.', tags: 'Analytics,Dashboard' },
    ],
  },
  {
    id: 2,
    name: 'Daniel Okafor',
    email: 'daniel.okafor@example.com',
    department: 'Software Engineering',
    role: 'Senior Staff',
    bio: 'Works on collaboration tools, product design, and developer experience.',
    areasOfInterest: [
      { id: 3, title: 'UX', description: 'Human-centered software design.' },
      { id: 4, title: 'Web Apps', description: 'Modern responsive web interfaces.' },
    ],
    projectIdeas: [
      { id: 3, title: 'Campus Task Hub', description: 'A task board for teams and classes.', tags: 'Web,Productivity' },
      { id: 4, title: 'Portfolio Builder', description: 'Create student portfolio pages.', tags: 'Web,UI' },
    ],
  },
  {
    id: 3,
    name: 'Grace Mensah',
    email: 'grace.mensah@example.com',
    department: 'Information Systems',
    role: 'Program Coordinator',
    bio: 'Interested in systems thinking, accessibility, and educational tooling.',
    areasOfInterest: [
      { id: 5, title: 'Accessibility', description: 'Inclusive interfaces for all users.' },
      { id: 6, title: 'Productivity', description: 'Tools that simplify workflows.' },
    ],
    projectIdeas: [
      { id: 5, title: 'Accessible Portal', description: 'A screen-reader friendly portal.', tags: 'Accessibility,Web' },
    ],
  },
  {
    id: 4,
    name: 'Noah Bello',
    email: 'noah.bello@example.com',
    department: 'Data Engineering',
    role: 'Research Staff',
    bio: 'Builds data-driven systems and supports student innovation projects.',
    areasOfInterest: [
      { id: 7, title: 'Cloud', description: 'Infrastructure and deployment patterns.' },
      { id: 8, title: 'AI', description: 'Applied machine learning for research use cases.' },
    ],
    projectIdeas: [
      { id: 6, title: 'Research Tracker', description: 'Track lab work and findings.', tags: 'Research,Cloud' },
      { id: 7, title: 'Smart Lab Inventory', description: 'Manage equipment with alerts.', tags: 'IoT,AI' },
    ],
  },
];

export function getStaffById(id) {
  return staffData.find((staff) => staff.id === id) ?? null;
}