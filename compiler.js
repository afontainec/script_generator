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
  const results = await Promise.all(compilers);
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


exports.generateDirectory = async (values) => {
  const dir_path = await copyDir(values);
  await Promise.all([makeAPScripts(dir_path, values), makeMasterScript(dir_path, values)]);
  return dir_path;
};

const copyDir = async(values) => {
  const dir_name = values['PLACE-NAME'].toUpperCase();
  const dir_path = `./COPIES/${dir_name}`;
  await fs.copySync('./MASTER', dir_path);
  return dir_path;
};

const makeAPScripts = async (dir_path, values) => {
  const rawDir = path.join(dir_path, 'raw');
  const template = path.join(rawDir, 'AP_N.rsc');
  for (let i = 0; i < values.numOfAps; i++) {
    const index = i + 1;
    const AP_VALUES = {};
    AP_VALUES['MAC-AP'] = `$MAC-AP${index}$`;
    AP_VALUES['IP-AP'] = `$IP-AP${index}$`;
    const string = await compileFile(template, AP_VALUES);
    const scriptPath = path.join(rawDir, `AP_${index}.rsc`);
    await fs.writeFileSync(scriptPath, string);
  }
};

const makeMasterScript = async (dir_path, values) => {
  const scriptPath = path.join(dir_path, 'configuration.rsc');
  let commands = await fs.readFileSync(scriptPath, 'utf8');
  for (let i = 0; i < values.numOfAps; i++) {
    const index = i + 1;
    commands += `import "raw/AP_${index}.rsc"`;
    commands += '\n';
  }
  if (values.useRouterAP) commands += 'import "raw/AP_ROUTER.rsc"';
  await fs.writeFileSync(scriptPath, commands);
};

exports.compileFile = compileFile;
