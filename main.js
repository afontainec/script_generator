

const fs = require('fs-extra');
let values = require('./data').values;


const generateDirectory = (values) => {
  const dir_name = values['PLACE-NAME'].toUpperCase();
  return fs.copySync('./MASTER', `./COPIES/${dir_name}`);
};

const start = async () => {
  values = getValues();
  const path = await generateDirectory(values);
  await compileDirectory(path, values);
};

const compileDirectory = async () => {
  return true;
};


const getValues = () => {
  return {
    'PLACE-NAME': 'test',
    'PLACE-ID': 1,
    SSID: 'free wifi',
    'VPN-PASSPHRASE': 'asdfasdf',
    'VPN-USER': 'test',
    'VPN-PASSWORD': 'test',
    'PUBLIC-IP': '8.8.8.8',
    'ISP-GATEWAY': '8.8.8.8',
    'ISP1-GATEWAY': '8.8.8.8',
    'ISP2-GATEWAY': '8.8.8.8',
    'ISP1-ADDRESS': '8.8.8.8',
    'ISP2-ADDRESS': '8.8.8.8',
    'MAC-AP1': 'AA:AA:AA:AA:AA:AA',
    'MAC-AP2': 'AA:AA:AA:AA:AA:AB',
  };
};


start();
