
const fs = require('fs-extra');
const Data = require('./data');
const Compiler = require('./compiler');
const path = require('path');


const generateDirectory = async (values) => {
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
    const string = await Compiler.compileFile(template, AP_VALUES);
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

const start = async () => {
  const values = await Data.get();
  const dir_path = await generateDirectory(values);
  await Compiler.run(dir_path, values);
};


start();
