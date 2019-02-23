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

function promptParams(name, type, validator, warning) {
  const p = {};
  p.name = name;
  if (validator) p.validator = validator;
  if (validator) p.warning = warning;
  switch (type) {
  case 'password':
    p.hidden = true;
    p.replace = '*';
    break;
  default:
  }
  return p;
}

const getName = async(values) => {
  const params = promptParams('nombre', 'string', /^[a-zA-Z\s-]+$/, 'Invalid data, it can only contains letters, spaces, or dashes');
  const answer = await userInput('Nombre de la red:', params);
  values.name = answer;
  const search = new RegExp(' ', 'g');
  values['PLACE-NAME'] = answer.replace(search, '_');
};

const getID = async(values) => {
  let params = promptParams('registrado?');
  const answer = await userInput('Red ya esta registrada en www.accionet.net? ingrese y si esta cualquier otra tecla si esque no', params);
  let id;
  if (answer === 'y') {
    params = promptParams('ID?');
    id = await userInput('Ingrese ID de la red en www.accionet.net', params);
  } else {
    id = await createPlace(values);
  }
  values['PLACE-ID'] = id;
};

const vpn = async (values) => {
  let params = promptParams('vpn');
  promptParams.name = 'vpn?';
  const answer = await userInput('Configurar VPN para esta red? ingrese y si esta cualquier otra tecla si esque no', params);
  if (answer !== 'y') return;
  params = promptParams('usuario');
  values['VPN-USER'] = await userInput('  Ingrese nombre de usuario:', params);
  params = promptParams('usuario', 'password');
  values['VPN-PASSPHRASE'] = await userInput('  Ingrese passphrase:', params);
  params = promptParams('contrasena', 'password');
  values['VPN-PASSWORD'] = await userInput('  Ingrese contrasena:', params);
};

const getInternetConexion = async (values) => {
  const params = promptParams('conexion');
  const answer = await userInput('La conexión a internet se dará por Enlace dedicado?  ingrese y si esta cualquier otra tecla si esque no', params);
  if (answer === 'y') return dedicatedInternet(values);
};

const dedicatedInternet = async (values) => {
  let params = promptParams('IP');
  values['PUBLIC-IP'] = await userInput('  Ingrese IP pública:', params);
  params = promptParams('gateway');
  values['ISP-GATEWAY'] = await userInput('  Ingrese Puerta de Enlace de la IP pública:', params);
};

const getAPs = async (values) => {
  let params = promptParams('wlan');
  const answer = await userInput('Desea usar el AP del mismo router?', params);
  if (answer === 'y') await routerAP(values);
  params = promptParams('cantidad');
  const n = await userInput('Cuantos dispositivos de red desea conectar al router? (AP, switch, controladores, etc)', params);
  values.numOfAps = parseInt(n, 10);
  for (let i = 0; i < values.numOfAps; i++) {
    await getAP(values, i);
  }
};

const routerAP = async (values) => {
  const params = promptParams('SSID');
  values.SSID = await userInput('  Ingrese Nombre de la señal de wifi(SSID):', params);
  values.useRouterAP = true;
};

const getAP = async (values, i) => {
  i++;
  const macKey = `MAC-AP${i}`;
  const ipKey = `IP-AP${i}`;
  const params = promptParams('mac-address');
  values[macKey] = await userInput(`  Ingrese dirección mac del dispotivo num ${i}:`, params);
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
