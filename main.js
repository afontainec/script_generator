

const fs = require('fs-extra');


const start = async () => {
  console.log('--');
  await fs.copySync('./MASTER', './COPIES/MASTER_COPY');
  console.log('fin');
}


start();
