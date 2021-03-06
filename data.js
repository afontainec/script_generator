const requestify = require('requestify');
const prompt = require('prompt');

const AP_PREFIX = '10.5.49.';
const AP_NUM = 100;

prompt.start();
exports.get = async () => {
  const values = {};
  values.location = '-33.4876785,-70.78158';
  await getName(values);
  await getID(values);
  await vpn(values);
  await getInternetConexion(values);
  await getAPs(values);
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
  case 'integer':
    p.validator = /^[0-9]+$/;
    p.warning = 'Input must be a number';
    break;
  case 'boolean':
    p.validator = /^(si|no|s|n|S|N|SI|NO|YES|yes|y)$/;
    p.warning = 'valor invalido, debe ser si o no';
      // TODO: que sea si o no
    break;
  case 'IP':
    p.validator = /^\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b$/;
    p.warning = 'Valor ingresado no corresponde a una IP.';
    break;
  case 'macaddress':
    p.validator = /^([0-9A-Fa-f]{2}[:]){5}([0-9A-Fa-f]{2})$/;
    p.warning = 'valor ingresado no es una macaddress valida, debe ser el formato AA:AA:AA:AA:AA:AA';
    break;
  default:
  }
  return p;
}

const getName = async (values) => {
  const params = promptParams('nombre', 'string', /^[\w\s]+$/, 'Data invalida. Solo puede contener letras, números y espacios');
  const answer = await userInput('Nombre de la red:', params);
  values.name = answer;
  const search = new RegExp(' ', 'g');
  values['PLACE-NAME'] = answer.replace(search, '_');
};

const getID = async (values) => {
  let params = promptParams('registrado?', 'boolean');
  const answer = await userInput('Red ya esta registrada en www.accionet.net? (ingrese si o no)', params);
  let id;
  if (toBoolean(answer)) {
    params = promptParams('ID?', 'integer');
    id = await userInput('Ingrese ID de la red en www.accionet.net', params);
  } else {
    id = await createPlace(values);
  }
  values['PLACE-ID'] = id;
};

const vpn = async (values) => {
  let params = promptParams('vpn', 'boolean');
  promptParams.name = 'vpn?';
  const answer = await userInput('Configurar VPN para esta red? (ingrese si o no)', params);
  if (!toBoolean(answer)) return;
  values.includeVPN = true;
  params = promptParams('usuario', 'string', /^[a-zA-Z0-9]+$/, 'Debe ser alfanumérico');
  values['VPN-USER'] = await userInput('  Ingrese nombre de usuario:', params);
  params = promptParams('passphrase', 'password', /^[a-zA-Z0-9]+$/, 'Debe ser alfanumérico y sin caracteres especiales');
  values['VPN-PASSPHRASE'] = await userInput('  Ingrese passphrase:', params);
  params = promptParams('contrasena', 'password', /^[a-zA-Z0-9]+$/, 'Debe ser alfanumérico y sin caracteres especiales');
  values['VPN-PASSWORD'] = await userInput('  Ingrese contrasena:', params);
};

const getInternetConexion = async (values) => {
  const params = promptParams('conexion', 'boolean');
  const answer = await userInput('La conexión a internet se dará por Enlace dedicado?  (ingrese si o no)', params);
  if (toBoolean(answer)) return dedicatedInternet(values);
  values.conection = 'default';
};

const dedicatedInternet = async (values) => {
  let params = promptParams('IP', 'IP');
  values['PUBLIC-IP'] = await userInput('  Ingrese IP pública:', params);
  params = promptParams('gateway', 'IP');
  values['ISP-GATEWAY'] = await userInput('  Ingrese Puerta de Enlace de la IP pública:', params);
  values.conection = 'dedicated_internet';
};

const getAPs = async (values) => {
  let params = promptParams('wlan', 'boolean');
  const answer = await userInput('Desea usar el AP del mismo router?', params);
  if (toBoolean(answer)) await routerAP(values);
  params = promptParams('cantidad', 'integer');
  const n = await userInput('Cuantos dispositivos de red desea conectar al router? (AP, switch, controladores, etc)', params);
  values.numOfAps = parseInt(n, 10);
  for (let i = 0; i < values.numOfAps; i++) {
    await getAP(values, i);
  }
};

const routerAP = async (values) => {
  const params = promptParams('SSID', 'string');
  values.SSID = await userInput('  Ingrese Nombre de la señal de wifi(SSID):', params);
  values.useRouterAP = true;
};

const getAP = async (values, i) => {
  i++;
  const macKey = `MAC-AP${i}`;
  const ipKey = `IP-AP${i}`;
  const params = promptParams('mac-address', 'macaddress');
  values[macKey] = await userInput(`  Ingrese dirección mac del dispotivo num ${i}:`, params);
  values[ipKey] = getAP_IP(i);
};

function getAP_IP(i) {
  return AP_PREFIX + (AP_NUM + i);
}


const createPlace = async (values) => {
  const data = {};
  data.place = {};
  data.place.name = values.name;
  data.place.location = values.location;
  data.place.is_active = true;
  const response = await requestify.post('http://localhost:3000/api/v1/places/new', data);
  return response.id;
  // return 1;
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

function toBoolean(input) {
  const trueValues = ['s', 'S', 'si', 'SI', 'y', 'Y', 'YES', 'yes'];
  return trueValues.indexOf(input) > -1;
}

const userInput = (question, params) => {
  return new Promise((resolve, reject) => {
    console.log(question);
    prompt.get(params, (err, result) => {
      if (err) return reject(err);
      resolve(result[params.name]);
    });
  });
};
