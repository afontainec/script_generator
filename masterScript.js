const path = require('path');
const fs = require('fs-extra');


exports.create = async (dir_path, values) => {
  const scriptPath = path.join(dir_path, 'configuration.rsc');
  let commands = await fs.readFileSync(scriptPath, 'utf8');
  commands = addConection(commands, values);
  // commands = addVPN(commands, values);
  commands = addAPs(commands, values);
  await fs.writeFileSync(scriptPath, commands);
};

const addAPs = (commands, values) => {
  for (let i = 0; i < values.numOfAps; i++) {
    const index = i + 1;
    commands += `import "raw/AP_${index}.rsc"`;
    commands += '\n';
  }
  if (values.useRouterAP) commands += 'import "raw/AP_ROUTER.rsc"';
  return commands;
};

const addConection = (commands, values) => {
  const p = commands.split('#conection');
  let text = p[0];
  text += '#conection \n';
  text += 'import "raw/conexion_internet';
  text += values.conection === 'dedicated_internet' ? '_ED' : '';
  text += '.rsc"';
  text += p[1];
  return text;
};
