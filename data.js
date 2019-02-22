const AP_PREFIX = '10.5.49.';
const AP_NUM = 100;
const requestify = require('requestify');

exports.get = async () => {
  const values = {};
  await getName(values);
  await getID(values);
  await vpn(values);
  await getInternetConexion(values);
  await getAPs(values);
  return values;
};

const getName = async(values) => {
  const answer = await userInput('Nombre de la red:');
  values.name = answer;
  const search = new RegExp(' ', 'g');
  values['PLACE-NAME'] = answer.replace(search, '_');
};

const getID = async(values) => {
  const answer = await userInput('Red ya esta registrada en www.accionet.net? ingrese y si esta cualquier otra tecla si esque no');
  let id;
  if (answer === 'y') {
    id = await userInput('Ingrese ID de la red en www.accionet.net');
  } else {
    id = await createPlace(values);
  }
  values['PLACE-ID'] = id;
};

const vpn = async (values) => {
  const answer = await userInput('Configurar VPN para esta red? ingrese y si esta cualquier otra tecla si esque no');
  if (answer !== 'y') return;
  values['VPN-PASSPHRASE'] = await userInput('  Ingrese passphrase:');
  values['VPN-USER'] = await userInput('  Ingrese nombre de usuario:');
  values['VPN-PASSWORD'] = await userInput('  Ingrese contrasena:');
};

const getInternetConexion = async (values) => {
  const answer = await userInput('La conexión a internet se dará por Enlace dedicado?  ingrese y si esta cualquier otra tecla si esque no');
  if (answer === 'y') return dedicatedInternet(values);
};

const dedicatedInternet = async (values) => {
  values['PUBLIC-IP'] = await userInput('  Ingrese IP pública:');
  values['ISP-GATEWAY'] = await userInput('  Ingrese Puerta de Enlace de la IP pública:');
};

const getAPs = async (values) => {
  const answer = await userInput('Desea usar el AP del mismo router?');
  if (answer === 'y') routerAP(values);
  const n = await userInput('Cuantos dispositivos de red desea conectar al router? (AP, switch, controladores, etc)');
  values.numOfAps = parseInt(n, 10);
  for (let i = 0; i < values.numOfAps; i++) {
    await getAP(values, i);
  }
};

const routerAP = async (values) => {
  values.SSID = await userInput('  Ingrese Nombre de la señal de wifi(SSID):');
  values.useRouterAP = true;
};

const getAP = async (values, i) => {
  i++;
  const macKey = `MAC-AP${i}`;
  const ipKey = `IP-AP${i}`;
  values[macKey] = await userInput(`  Ingrese dirección mac del dispotivo num ${i}:`);
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
  // const response = await requestify.post('http://localhost:3000/places/new', data);
  // return response.id;
  return 1;
};

const responses = ['testing hola', 'n', 'y', 'passphrase', 'vpnuser', 'vpnpassword', 'n', 'y', 'FREE WIFI', 2, 'AA:AA:AA:AA:AA:AA', 'AA:AA:AA:AA:AA:AB'];
let i = 0;
const userInput = async (question) => {
  console.log(question);
  const ans = responses[i];
  i++;
  console.log('    user:', ans);
  return ans;
};
