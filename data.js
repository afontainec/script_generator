const requestify = require('requestify');
const prompt = require('prompt');

const AP_PREFIX = '10.5.49.';
const AP_NUM = 100;

prompt.start();
exports.get = async () => {
  const values = {};
  await getName(values);
  await getID(values);
  await vpn(values);
  await getInternetConexion(values);
  await getAPs(values);
  console.log('-------------');
  console.log(values);
  return values;
};

const getName = async(values) => {
  const promptParams = {};
  promptParams.name = 'nombre';
  promptParams.validator = /^[a-zA-Z\s-]+$/;
  promptParams.warning = 'Invalid data, it can only contains letters, spaces, or dashes';
  const answer = await userInput('Nombre de la red:', promptParams);
  values.name = answer;
  const search = new RegExp(' ', 'g');
  values['PLACE-NAME'] = answer.replace(search, '_');
};

const getID = async(values) => {
  const promptParams = {};
  promptParams.name = 'registrado?';
  const answer = await userInput('Red ya esta registrada en www.accionet.net? ingrese y si esta cualquier otra tecla si esque no', promptParams);
  let id;
  if (answer === 'y') {
    promptParams.name = 'ID';
    id = await userInput('Ingrese ID de la red en www.accionet.net', promptParams);
  } else {
    id = await createPlace(values);
  }
  values['PLACE-ID'] = id;
};

const vpn = async (values) => {
  const promptParams = {};
  promptParams.name = 'vpn?';
  const answer = await userInput('Configurar VPN para esta red? ingrese y si esta cualquier otra tecla si esque no', promptParams);
  if (answer !== 'y') return;
  promptParams.name = 'usuario';
  values['VPN-USER'] = await userInput('  Ingrese nombre de usuario:', promptParams);
  promptParams.hidden = true;
  promptParams.replace = '*';
  promptParams.name = 'passphrase';
  values['VPN-PASSPHRASE'] = await userInput('  Ingrese passphrase:', promptParams);
  promptParams.name = 'contrasena';
  values['VPN-PASSWORD'] = await userInput('  Ingrese contrasena:', promptParams);
};

const getInternetConexion = async (values) => {
  const promptParams = {};
  promptParams.name = 'conexion';
  const answer = await userInput('La conexión a internet se dará por Enlace dedicado?  ingrese y si esta cualquier otra tecla si esque no', promptParams);
  if (answer === 'y') return dedicatedInternet(values);
};

const dedicatedInternet = async (values) => {
  const promptParams = {};
  promptParams.name = 'IP';
  values['PUBLIC-IP'] = await userInput('  Ingrese IP pública:', promptParams);
  promptParams.name = 'gateway';
  values['ISP-GATEWAY'] = await userInput('  Ingrese Puerta de Enlace de la IP pública:', promptParams);
};

const getAPs = async (values) => {
  const promptParams = {};
  promptParams.name = 'router_ap?';
  const answer = await userInput('Desea usar el AP del mismo router?', promptParams);
  if (answer === 'y') routerAP(values);
  promptParams.name = 'cantidad';
  const n = await userInput('Cuantos dispositivos de red desea conectar al router? (AP, switch, controladores, etc)', promptParams);
  values.numOfAps = parseInt(n, 10);
  for (let i = 0; i < values.numOfAps; i++) {
    await getAP(values, i);
  }
};

const routerAP = async (values) => {
  const promptParams = {};
  promptParams.name = 'SSID';
  values.SSID = await userInput('  Ingrese Nombre de la señal de wifi(SSID):', promptParams);
  values.useRouterAP = true;
};

const getAP = async (values, i) => {
  i++;
  const macKey = `MAC-AP${i}`;
  const ipKey = `IP-AP${i}`;
  const promptParams = {};
  promptParams.name = 'mac-address';
  values[macKey] = await userInput(`  Ingrese dirección mac del dispotivo num ${i}:`, promptParams);
  values[ipKey] = getAP_IP(i);
};

function getAP_IP(i) {
  return AP_PREFIX + (AP_NUM + i);
}


const createPlace = async(values) => {
  const data = {};
  data.place = {};
  data.place.name = values.name;
  data.place.location = values.location;
  // const response = await requestify.post('http://localhost:3000/api/v1/places/new', data);
  // return response.id;
  return 1;
};

// const responses = ['testing hola', 'n', 'y', 'passphrase', 'vpnuser', 'vpnpassword', 'n', 'y', 'FREE WIFI', 2, 'AA:AA:AA:AA:AA:AA', 'AA:AA:AA:AA:AA:AB'];
// let i = 0;
// const userInput = async (question, name) => {
//   console.log(question);
//   const ans = responses[i];
//   i++;
//   console.log('    user:', ans);
//   return ans;
// };

const userInput = (question, params) => {
  return new Promise((resolve, reject) => {
    console.log(question);
    prompt.get(params, (err, result) => {
      if (err) return reject(err);
      resolve(result[params.name]);
    });
  });
};
