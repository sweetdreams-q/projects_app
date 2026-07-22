const fs = require('fs');
const path = require('path');
const { parse } = require('fast-csv');
const { format } = require('fast-csv');

async function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];

    if (!fs.existsSync(filePath)) {
      resolve([]);
      return;
    }

    fs.createReadStream(filePath)
      .pipe(parse({ headers: true, ignoreEmpty: true, trim: true }))
      .on('error', reject)
      .on('data', (row) => {
        rows.push(row);
      })
      .on('end', () => resolve(rows));
  });
}

async function writeCSV(filePath, data) {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

  return new Promise((resolve, reject) => {
    const csvStream = format({ headers: true });
    const writeStream = fs.createWriteStream(filePath);

    writeStream.on('error', reject);
    csvStream.on('error', reject);
    writeStream.on('finish', resolve);

    csvStream.pipe(writeStream);

    for (const row of data) {
      csvStream.write(row);
    }

    csvStream.end();
  });
}

module.exports = {
  readCSV,
  writeCSV,
};