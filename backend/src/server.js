const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const routes = require('./routes');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use(routes);

const dataDir = path.join(__dirname, '..', 'data');
const staffFile = path.join(dataDir, 'staff.csv');
const interestsFile = path.join(dataDir, 'interests.csv');
const projectsFile = path.join(dataDir, 'projects.csv');

async function ensureSeedFiles() {
  await fs.promises.mkdir(dataDir, { recursive: true });

  await ensureCsvFile(staffFile, 'id,name,email,department,bio\n');
  await ensureCsvFile(interestsFile, 'id,staffId,title,description\n');
  await ensureCsvFile(projectsFile, 'id,staffId,title,description,tags\n');
}

async function ensureCsvFile(filePath, headerRow) {
  if (!fs.existsSync(filePath)) {
    await fs.promises.writeFile(filePath, headerRow, 'utf8');
  }
}

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use((error, req, res, next) => {
  res.status(500).json({
    message: 'Internal Server Error',
    error: error.message,
  });
});

ensureSeedFiles().then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});