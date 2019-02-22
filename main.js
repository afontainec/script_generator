
const Data = require('./data');
const Compiler = require('./compiler');


const start = async () => {
  const values = await Data.get();
  const dir_path = await Compiler.generateDirectory(values);
  await Compiler.run(dir_path, values);
};


start().then().catch((err) => {
  console.log(err);
});
