const fs = require('fs-extra');
const path = require('path');

exports.run = async (dir_path) => {
  const rawDir = path.join(dir_path, 'raw');
  const files = await fs.readdirSync(rawDir);
  console.log(files);
};
