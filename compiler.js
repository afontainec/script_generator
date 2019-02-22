const fs = require('fs-extra');
const path = require('path');

exports.run = async (dir_path, values) => {
  const rawDir = path.join(dir_path, 'raw');
  const files = await fs.readdirSync(rawDir);
  const compilers = [];
  for (let i = 0; i < files.length; i++) {
    files[i] = path.join(rawDir, files[i]);
    compilers.push(compileFile(files[i], values));
  }
  console.log('-------------------------------------------');
  console.log(dir_path);
  const results = await Promise.all(compilers);
  console.log(files[1]);
  console.log(results[1]);
  await writeCompiledFiles(files, results);
};


const writeCompiledFiles = async (files, results) => {
  const writers = [];
  if (files.length !== results.length) throw new Error('files lenght and result length does not match');
  for (let i = 0; i < files.length; i++) {
    writers.push(fs.writeFileSync(files[i], results[i]));
  }
  return Promise.all(writers);
};

const compileString = function (string, values) {
  if (!string) return string;
  values = values || {};
  const keys = Object.keys(values);
  for (let i = 0; i < keys.length; i++) {
    const inTextKey = '\\$' + keys[i] + '\\$'; // eslint-disable-line
    const search = new RegExp(inTextKey, 'g');
    string = string.replace(search, values[keys[i]]);
  }
  return string;
};

const compileFile = function (filePath, values) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(compileString(data, values));
    });
  });
};

exports.compileFile = compileFile;
