const fs = require('fs-extra');
const path = require('path');

exports.run = async (dir_path) => {
  const files = await fs.readdirSync(path.join(dir_path, 'raw'));
  // fs.readdirSync(path.join(dir_path, 'raw'), (err, files) => {
  for (let i = 0; i < files.length; i++) {
    console.log(files[i]);
  }
  // });
  // return true;
};
