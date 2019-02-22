

const fs = require('fs-extra');
const Data = require('./data');
const Compiler = require('./compiler');

const path = require('path');

const generateDirectory = async (values) => {
  const dir_name = values['PLACE-NAME'].toUpperCase();
  const dir_path = `./COPIES/${dir_name}`;
  await fs.copySync('./MASTER', dir_path);
  return dir_path;
};

const start = async () => {
  const values = Data.get();
  const dir_path = await generateDirectory(values);
  await Compiler.run(dir_path, values);
};


start();
